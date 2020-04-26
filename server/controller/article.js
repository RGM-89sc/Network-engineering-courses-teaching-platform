const fs = require("fs");
const path = require("path");
const uuidV4 = require("uuid/v4");
const db = require("../tools/mountModel");
const { serverURL } = require("../config.js");
const omit = require("../tools/omitObjProp");
const { decodeFilename, encodeFilename } = require("../tools/filenameTools");

module.exports = {
  //获取文章总数
  async getArticlesCount(ctx) {
    const { articleType } = ctx.request.body;
    await db.article
      .find({
        articleType,
      })
      .count()
      .then((count) => {
        return (ctx.body = {
          data: count,
          code: 1,
        });
      })
      .catch((err) => {
        return (ctx.body = {
          errMsg: err.message,
          code: -1,
        });
      });
  },
  //获取全部文章
  async getArticles(ctx) {
    const { articleType, skipArticles, getArticlesCount } = ctx.request.body;
    await db.article
      .find(
        {
          articleType,
        },
        {
          __v: 0,
          _id: 0,
        }
      )
      .skip(parseInt(skipArticles))
      .limit(parseInt(getArticlesCount))
      .then((docs) => {
        return (ctx.body = {
          data: docs,
          code: 1,
        });
      })
      .catch((err) => {
        return (ctx.body = {
          errMsg: err.message,
          code: -1,
        });
      });
  },
  //获取单个新闻
  async getArticle(ctx) {
    const {articleType, articleID} = ctx.request.body;

    
    const isLiked = (ctx.state.user ? true : false) && ctx.state.user.likes.some( i => {
      return i.articleID === articleID;
    });
    
    await db.article
      .findOne(
        {
          articleType,
          articleID,
        },
        {
          _id: 0,
          __v: 0,
        }
      )
      .then((docs) => {
        ctx.body = {
          data: Object.assign({
            isLiked
          },docs._doc),
          code: 1,
        };
      })
      .catch((err) => {
        ctx.body = {
          code: -1,
          errMsg: err.message,
        };
      });
  },
  //上传新闻
  async postArticle(ctx) {
    const {
      authorName,
      authorID,
      articleID,
      avatarURL,
      tags,
      content,
      title,
      views,
      posterURL,
      summary,
      articleType,
    } = ctx.request.body;
    await db.article
      .create({
        authorName,
        authorID,
        articleID,
        avatarURL,
        tags,
        content,
        title,
        views,
        posterURL,
        summary,
        articleType,
      })
      .then(async (docs) => {
        const user = ctx.state.user;
        const userType = user.userType === 0 ? "student" : "teacher";

        await db[userType].updateOne(
          {
            id: user.id,
          },
          {
            $push: {
              articles: {
                title,
                authorID,
                articleID,
                created: docs.created,
                articleType,
              },
            },
          }
        );

        ctx.body = {
          data: docs,
          code: 1,
        };
      })
      .catch((err) => {
        console.log(err);
        ctx.body = {
          code: -1,
          errMsg: err.message,
        };
      });
  },
  //删除新闻
  async delArticle(ctx) {
    const {articleID, authorID, articleType} = ctx.request.body;
    const id = ctx.state.user.id;
    if (authorID !== id) {
      return (ctx.body = {
        code: 0,
        info: "您没有该操作的权限",
      });
    };
    await db.article
      .findOneAndRemove({
        articleID,
        articleType,
      })
      .then(async docs => {
        const user = ctx.state.user;
        const userType = user.userType === 0 ? "student" : "teacher";
        await db[userType].updateOne(
          {
            id: user.id,
          },
          {
            $pull: {
              articles: {
                articleID,
              }
            },
          }
        );
        docs.goods.forEach(async i => {
          const _type = i.userType === 0 ? 'student' : 'teacher';
          await db[_type].updateOne({
            id: i.userID
          }, {
            $pull: {
              likes: {
                articleID
              }
            }
          })
        });
        return (ctx.body = {
          data: docs,
          code: 1,
        });
      })
      .catch((err) => {
        return (ctx.body = {
          code: -1,
          errMsg: err.message,
        });
      });
  },
  //上传图片
  async postArticleImage(ctx) {
    const { articleID, articleType } = ctx.request.query;
    console.log(articleType);
    const file = ctx.request.files.upload;
    const fpath = file.path;
    const extname = path.extname(file.name);
    const imgUUID = uuidV4().split("-").join("");
    const fname = `article_${articleID}_${imgUUID}${extname}`;
    setTimeout(() => {
      fs.renameSync(
        fpath,
        path.join(
          __dirname,
          `../public/static/img/article/${articleType}/${fname}`
        )
      );
    }, 0);

    ctx.body = {
      uploaded: 1, //写死的
      fileName: fname, //图片名
      url: serverURL + `/static/img/article/${articleType}/${fname}`, //上传服务器的图片的url
    };
  },
  //浏览次数递增
  async incViewsCount(ctx) {
    const { articleID, articleType } = ctx.request.body;
    await db.article
      .updateOne(
        {
          articleType,
          articleID,
        },
        {
          $inc: {
            views: 1,
          },
        }
      )
      .then((docs) => {
        return (ctx.body = {
          data: docs,
          code: 1,
        });
      })
      .catch((err) => {
        return (ctx.body = {
          errMsg: err.message,
          code: -1,
        });
      });
  },
  //点赞
  async doLikes(ctx) {
    const { articleID, articleType, userID, userType, userName } = ctx.request.body;
    // @todo check repeat
    // 检测重复
    await db.article
      .updateOne(
        {
          articleType,
          articleID,
        },
        {
          $push: {
            goods: {
              userID,
              userType,
              userName
            },
          },
        }
      )
      .then(async docs => {
        const _type = userType === 0 ? 'student' : 'teacher';
        await db[_type].updateOne(
          {
            id: userID
          },
          {
            $push: {
              likes: {
                articleID,
                articleType
              }
            }
          }
        )
        .then(docs => {
          return (ctx.body = {
            data: docs,
            code: 1,
          });
        })
        .catch(err => {
          return (ctx.body = {
            errMsg: err.message,
            code: -1,
          });
        })
      })
      .catch((err) => {
        return (ctx.body = {
          errMsg: err.message,
          code: -1,
        });
      });
  },
  //取消点赞
  async cancelLikes(ctx) {
    const { articleID, articleType, userID, userType, userName } = ctx.request.body;
    await db.article
      .updateOne(
        {
          articleType,
          articleID,
        },
        {
          $pull: {
            goods: {
              userID,
              userType
            },
          },
        }
      )
      .then(async docs => {
        const _type = userType === 0 ? 'student' : 'teacher';
        await db[_type].updateOne(
          {
            id: userID
          },
          {
            $pull: {
              likes: {
                articleID,
              }
            }
          }
        )
        .then(docs => {
          return (ctx.body = {
            data: docs,
            code: 1,
          });
        })
        .catch(err => {
          return (ctx.body = {
            errMsg: err.message,
            code: -1,
          });
        })
      })
      .catch((err) => {
        return (ctx.body = {
          errMsg: err.message,
          code: -1,
        });
      });
  },
  async postComment(ctx) {
    const { articleType, articleID, comment } = ctx.request.body;
    comment.id = uuidV4().split("-").join();
    await db.article
      .updateOne(
        {
          articleType,
          articleID,
        },
        {
          $push: {
            comments: comment,
          },
        }
      )
      .then((docs) => {
        return (ctx.body = {
          data: docs,
          code: 1,
        });
      })
      .catch((err) => {
        return (ctx.body = {
          errMsg: err.message,
          code: -1,
        });
      });
  },
  async postCommentReply(ctx) {
    const { articleType, articleID, reply, commentIndex } = ctx.request.body;
    await db.article
      .updateOne(
        {
          articleType,
          articleID,
        },
        {
          $push: {
            [`comments.${commentIndex}.replys`]: reply,
          },
        }
      )
      .then((docs) => {
        return (ctx.body = {
          data: docs,
          code: 1,
        });
      })
      .catch((err) => {
        return (ctx.body = {
          errMsg: err.message,
          code: -1,
        });
      });
  },
  async delCommentReply(ctx) {
    const {
      articleType,
      articleID,
      replyIndex,
      commentIndex,
    } = ctx.request.body;
    await db.article
      .updateOne(
        {
          articleType,
          articleID,
        },
        {
          $pull: {
            [`comments.${commentIndex}.replys`]: {
              replyIndex,
            },
          },
        }
      )
      .then((docs) => {
        return (ctx.body = {
          data: docs,
          code: 1,
        });
      })
      .catch((err) => {
        return (ctx.body = {
          errMsg: err.message,
          code: -1,
        });
      });
  },
};
