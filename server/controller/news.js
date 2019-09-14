const fs = require('fs');
const path = require('path');
const uuidV4 = require('uuid/v4');
const db = require('../tools/mountModel');
const {
    serverURL
} = require('../config.js');
const omit = require('../tools/omitObjProp');
const {
    decodeFilename,
    encodeFilename
} = require('../tools/filenameTools');

module.exports = {
    //获取新闻列表
    async getNewsList(ctx) {
        await db.news.find().then(docs => {
            ctx.body = {
                data: docs,
                code: 1
            }
        }).catch(err => {
            ctx.body = {
                errMsg: err.message,
                code: -1
            }
        });
    },
    //获取单个新闻
    async getNewsArticle(ctx) {
        const {
            articleID
        } = ctx.request.body;

        await db.news.findOne({
            articleID
        }, {
            _id: 0,
            __v: 0
        }).then(docs => {
            ctx.body = {
                data: docs,
                code: 1
            }
        }).catch(err => {
            ctx.body = {
                code: -1,
                errMsg: err.message,
            }
        })
    },
    async getAllNewsArticle(ctx) {
        await db.news.find({}, {
            _id: 0,
            __v: 0,
            content: 0
        }).then(docs => {
            // const {
            //     summary,
            //     authorName,
            //     authorID,
            //     title,
            //     created,
            //     articleID,
            //     views,
            //     goods,
            //     tags,
            //     avatarURL,
            //     posterURL
            // } = docs;
            ctx.body = {
                data: docs,
                code: 1
            }
        }).catch(err => {
            ctx.body = {
                code: -1,
                errMsg: err.message
            }
        })
    },
    //上传新闻
    async postNewsArticle(ctx) {
        const {
            authorName,
            authorID,
            articleID,
            avatarURL,
            tags,
            content,
            title,
            goods,
            views,
            posterURL,
            summary
        } = ctx.request.body;



        await db.news.create({
            authorName,
            authorID,
            articleID,
            avatarURL,
            tags,
            content,
            title,
            goods,
            views,
            posterURL,
            summary
        }).then(async docs => {
            const user = ctx.state.user;
            const type = user.userType === 0 ? 'student' : 'teacher';

            await db[type].updateOne({
                id: user.id,
            }, {
                $push: {
                    articles: {
                        title,
                        authorID,
                        articleID
                    }
                }
            })

            ctx.body = {
                data: docs,
                code: 1
            }


        }).catch((err) => {
            console.log(err);
            ctx.body = {
                code: -1,
                errMsg: err.message
            }
        });
    },
    //删除新闻
    async delNewsArticle(ctx) {
        const {
            articleID,
            authorID
        } = ctx.request.body;
        const id = ctx.state.user.id;
        if (authorID !== id) {
            return ctx.body = {
                code: 0,
                info: '您没有该操作的权限'
            }
        }

        await db.news.deleteOne({
            articleID
        }).then(async docs => {
            const user = ctx.state.user;
            const type = user.userType === 0 ? 'student' : 'teacher';
            await db[type].updateOne({
                id: user.id
            }, {
                $pull: {
                    articles: {
                        articleID
                    }
                }
            });
            return ctx.body = {
                data: docs,
                code: 1
            }
        }).catch(err => {
            return ctx.body = {
                code: -1,
                errMsg: err.message
            }
        })
    },
    //上传图片
    async postNewsArticleImage(ctx) {
        const {
            authorID

        } = ctx.request.query;
        const file = ctx.request.files.upload;
        const fpath = file.path;
        const extname = path.extname(file.name);
        const imgUUID = uuidV4();
        const fname = `news_${authorID}_${imgUUID}${extname}`;
        setTimeout(() => {
            fs.renameSync(fpath, path.join(__dirname, `../public/static/img/news/${fname}`))
        }, 0)

        ctx.body = {
            uploaded: 1, //写死的
            fileName: fname, //图片名
            url: serverURL + '/static/img/news/' + fname //上传服务器的图片的url
        }
    }
}