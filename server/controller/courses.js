const fs = require('fs');
const path = require('path');
const uuidV4 = require('uuid/v4');
const db = require('../tools/mountModel');
const { serverURL } = require('../config.js');
const omit = require('../tools/omitObjProp');
const { decodeFilename, encodeFilename } = require('../tools/filenameTools');

module.exports = {
  async addNewCourse(ctx) {
    const { newCourseName } = ctx.request.body;
    const tchID = ctx.state.user.id;
    const file = ctx.request.files.file;
    const filepath = file.path;
    const extname = path.extname(file.name);
    const courseID = uuidV4().split('-').join('');
    const filename = `/static/img/courses/cover_${courseID}${extname}`;

    if (await db.student.findOne({ coursename: newCourseName, tchID })) {
      return ctx.body = {
        code: 0,
        info: '该课程已存在'
      };
    }

    await db.courses.create({ courseID, coursename: newCourseName, cover: filename, tchID })
      .then(async docs => {
        fs.renameSync(filepath, path.join(__dirname, `../public${filename}`));

        const tchDocs = await db.teacher.updateOne({ id: tchID }, {
          $push: {
            teaching: {
              courseID,
              coursename: newCourseName
            }
          }
        });

        return ctx.body = {
          code: 1
        };
      })
      .catch(err => {
        ctx.body = {
          code: -1,
          errMsg: err.message
        };
      });
  },

  async delCourse(ctx) {
    const { courseID, tchID } = ctx.request.body;
    const id = ctx.state.user.id;

    if (id !== tchID) {
      return ctx.body = {
        code: 0,
        info: '您没有该操作的权限'
      }
    }

    await db.courses.deleteOne({ courseID })
      .then(docs => {

        return ctx.body = {
          code: 1,
          data: docs
        };
      })
      .catch(err => {
        return ctx.body = {
          code: -1,
          errMsg: err.message
        };
      });
  },

  async delChapter(ctx) {
    const { courseID, chapter, tchID } = ctx.request.body;
    const id = ctx.state.user.id;

    if (id !== tchID) {
      return ctx.body = {
        code: 0,
        info: '您没有该操作的权限'
      }
    }

    const course = await db.courses.findOne({ courseID });
    let stamp;
    course.content.some(c => {
      if (c.id === chapter) {
        stamp = c.id;
        return true;
      }
      return false;
    });

    await db.courses.updateOne(
      { courseID },
      {
        $pull: {
          content: {
            id: stamp
          }
        }
      }
    )
      .then(docs => {

        return ctx.body = {
          code: 1,
          data: docs
        };
      })
      .catch(err => {
        return ctx.body = {
          code: -1,
          errMsg: err.message
        };
      });
  },

  async delPart(ctx) {
    const { courseID, chapter, part, tchID } = ctx.request.body;
    const id = ctx.state.user.id;

    if (id !== tchID) {
      return ctx.body = {
        code: 0,
        info: '您没有该操作的权限'
      }
    }

    const course = await db.courses.findOne({ courseID });
    let stamp, chapterIndex;
    course.content.some((c, index) => {
      if (c.id === chapter) {
        stamp = c.id;
        chapterIndex = index;
        return true;
      }
      return false;
    });

    await db.courses.updateOne(
      { courseID, 'content.id': stamp, 'content.part.id': part },
      {
        $pull: {
          [`content.${chapterIndex}.part`]: {
            id: part
          }
        }
      }
    )
      .then(async docs => {
        return ctx.body = {
          code: 1,
          data: docs
        };
      })
      .catch(err => {
        return ctx.body = {
          code: -1,
          errMsg: err.message
        };
      });
  },

  async getCourses(ctx) {
    await db.courses.aggregate([
      {
        $lookup: {
          from: "teachers",
          localField: "tchID",
          foreignField: "id",
          as: "tch"
        }
      },
      {
        $project: {
          _id: 0, __v: 0,
          tch: { _id: 0, __v: 0, id: 0, password: 0, faculty: 0, teaching: 0, avatar: 0, stus: 0, content: 0, created: 0 }
        }
      }
    ]).sort({ created: 1 })
      .then(docs => {
        return ctx.body = {
          code: 1,
          data: docs
        }
      })
      .catch(err => {
        return ctx.body = {
          code: -1,
          errMsg: err.message
        }
      });
  },

  async getCourseDetail(ctx) {
    const { courseID } = ctx.request.body;

    await db.courses.aggregate([
      {
        $match: { courseID }
      },
      {
        $lookup: {
          from: "teachers",
          localField: "tchID",
          foreignField: "id",
          as: "tch"
        }
      },
      {
        $project: {
          _id: 0, __v: 0,
          tch: { _id: 0, __v: 0, password: 0, created: 0 }
        }
      }
    ])
      .then(docs => {
        return ctx.body = {
          code: 1,
          data: docs[0]
        }
      })
      .catch(err => {
        return ctx.body = {
          code: -1,
          errMsg: err.message
        }
      });
  },

  async addChapter(ctx) {
    const { courseID, newChapter, tchID } = ctx.request.body;
    const id = ctx.state.user.id;

    if (id !== tchID) {
      return ctx.body = {
        code: 0,
        info: '您没有该操作的权限'
      }
    }

    await db.courses.updateOne({ courseID }, {
      $push: {
        content: newChapter
      }
    })
      .then(docs => {
        return ctx.body = {
          code: 1
        }
      })
      .catch(err => {
        return ctx.body = {
          code: -1,
          errMsg: err.message
        }
      });
  },

  async updatePart(ctx) {
    const { courseID, chapter, part, title, content, tchID } = ctx.request.body;
    const id = ctx.state.user.id;

    if (id !== tchID) {
      return ctx.body = {
        code: 0,
        info: '您没有该操作的权限'
      }
    }

    let course = await db.courses.findOne({ courseID });

    let ch, stamp, chapterIndex;
    course.content.some((c, index) => {
      if (c.id === chapter) {
        stamp = c.id;
        ch = c;
        chapterIndex = index;
        return true;
      }
      return false;
    });
    let partIndex;
    const haveThisPart = ch.part.some((p, index) => {
      partIndex = index;
      return p.id === part;
    });
    if (!haveThisPart) {
      await db.courses.updateOne(
        { courseID, 'content.id': stamp },
        {
          $push: {
            [`content.${chapterIndex}.part`]: {
              id: part,
              title,
              content
            }
          }
        }
      ).catch(err => {
        return ctx.body = {
          code: -1,
          errMsg: err.message
        }
      });
    } else {
      await db.courses.updateOne(
        {
          courseID,
          'content.id': stamp,
          'content.part.id': part
        },
        {
          $set: {
            [`content.${chapterIndex}.part.${partIndex}`]: {
              id: part,
              title,
              content
            }
          }
        }
      ).catch(err => {
        return ctx.body = {
          code: -1,
          errMsg: err.message
        }
      });
    }

    ctx.body = {
      code: 1,
    }
  },

  async getPartDetail(ctx) {
    const { courseID, chapter, part } = ctx.request.body;

    let partDetail;
    try {
      const course = await db.courses.findOne({ courseID });
      let ch, chapterIndex;
      course.content.some((c, index) => {
        if (c.id === chapter) {
          ch = c;
          chapterIndex = index;
          return true;
        }
        return false;
      });
      let partIndex;
      ch.part.some((p, index) => {
        partIndex = index;
        return p.id === part;
      });
      partDetail = course.content[chapterIndex].part[partIndex];
      partDetail = omit(partDetail, ['_id', '__v'], true);
      const videoes = fs.readdirSync(path.join(__dirname, '../public/static/video/'));
      let partVideoes = [];
      videoes.forEach(videoName => {
        if (new RegExp(`content_${courseID}_${chapter}_${part}_(.+)`).test(videoName)) {
          partVideoes.push({
            name: videoName.replace(`content_${courseID}_${chapter}_${part}_`, ''),
            url: serverURL + `/static/video/${videoName}`
          });
        }
      });
      partDetail.videoes = partVideoes;
      partDetail.tchID = course.tchID;
    } catch (e) {
      return ctx.body = {
        code: -1,
        errMsg: e.message
      };
    }

    ctx.body = {
      code: 1,
      data: partDetail
    }
  },

  async getPartDetailNoAuth(ctx) {
    const { courseID, chapter, part } = ctx.request.body;

    let partDetail;
    try {
      const course = await db.courses.findOne({ courseID });
      let ch, chapterIndex;
      course.content.some((c, index) => {
        if (c.id === chapter) {
          ch = c;
          chapterIndex = index;
          return true;
        }
        return false;
      });
      let partIndex;
      ch.part.some((p, index) => {
        partIndex = index;
        return p.id === part;
      });
      partDetail = course.content[chapterIndex].part[partIndex];
      partDetail = omit(partDetail, ['_id', '__v'], true);
    } catch (e) {
      return ctx.body = {
        code: -1,
        errMsg: e.message
      };
    }

    ctx.body = {
      code: 1,
      data: partDetail
    }
  },

  async uploadCourseImg(ctx) {
    const { courseID, chapter, part } = ctx.request.query;
    const file = ctx.request.files.upload;
    const filepath = file.path;
    const extname = path.extname(file.name);
    const imgUUID = uuidV4();
    const filename = `content_${courseID}_${chapter}_${part}_${imgUUID}${extname}`;

    fs.renameSync(filepath, path.join(__dirname, `../public/static/img/courses/${filename}`));

    ctx.body = {
      uploaded: 1,   //写死的
      fileName: filename,  //图片名
      url: serverURL + '/static/img/courses/' + filename  //上传服务器的图片的url
    };
  },

  // 接收视频文件的分片
  async uploadCourseVideoChunks(ctx) {
    const { index, hash } = ctx.request.body;
    const file = ctx.request.files.file;
    const filepath = file.path;
    const chunkTmpDir = path.join(__dirname, `../public/static/video/${hash}/`);

    if (!fs.existsSync(chunkTmpDir)) {
      fs.mkdirSync(chunkTmpDir);
    }
    fs.renameSync(filepath, chunkTmpDir + index);

    ctx.body = {
      code: 1
    }
  },

  async mergeCourseVideoChunks(ctx) {
    const { name, total, ext, hash, courseID, chapter, part } = ctx.request.body;
    const filename = encodeFilename(name);
    const filePath = path.join(__dirname, `../public/static/video/content_${courseID}_${chapter}_${part}_${filename}`);
    const chunkTmpDir = path.join(__dirname, `../public/static/video/${hash}/`);

    // 读取所有的chunks 文件名存放在数组中
    const chunks = fs.readdirSync(chunkTmpDir);
    // 检查切片数量是否正确
    if (chunks.length !== total || chunks.length === 0) {
      return ctx.body = {
        code: -1,
        errMsg: '上传失败'  // 分片总数不符合预期
      };
    }

    try {
      let targetStream = fs.createWriteStream(filePath);
      for (let i = 0; i < total; i++) {
        // 追加写入到文件中
        if (i === total - 1) {
          targetStream.end(fs.readFileSync(chunkTmpDir + i));
        } else {
          targetStream.write(fs.readFileSync(chunkTmpDir + i));
        }
        // 删除本次使用的chunk
        setTimeout(() => {
          const p = chunkTmpDir + i;
          if (fs.existsSync(p)) {
            fs.unlinkSync(p);
          }
        }, 0);
      }
      // 删除chunk的文件夹
      setTimeout(() => {
        fs.rmdirSync(chunkTmpDir);
      }, 0);
    } catch (e) {
      return ctx.body = {
        code: -1,
        errMsg: e.message
      }
    }

    ctx.body = {
      code: 1,
      data: {
        filename,
        url: serverURL + `/static/video/content_${courseID}_${chapter}_${part}_${filename}`
      }
    };
  },

  async delCourseVideo(ctx) {
    const { filename, courseID, chapter, part, tchID } = ctx.request.body;
    const id = ctx.state.user.id;

    if (id !== tchID) {
      return ctx.body = {
        code: 0,
        info: '您没有该操作的权限'
      }
    }

    try {
      setTimeout(() => {
        const p = path.join(__dirname, `../public/static/video/content_${courseID}_${chapter}_${part}_${filename}`);
        if (fs.existsSync(p)) {
          fs.unlinkSync(p);
        }
      }, 0);
    } catch (e) {
      return ctx.body = {
        code: -1,
        errMsg: e.message
      }
    }

    ctx.body = {
      code: 1
    }
  },

  async getCourseStusAndExams(ctx) {
    const { courseID } = ctx.request.body;
    const tchID = ctx.state.user.id;

    let courseExams;
    try {
      courseExams = await db.exams.find({ courseID }, { _id: 0, __v: 0, 'choiceQuestions': 0 });
    } catch(err) {
      return ctx.body = {
        code: -1,
        errMsg: err.message
      };
    }

    await db.courses.aggregate([
      {
        $match: { courseID, tchID }
      },
      {
        $lookup: {
          from: "students",
          localField: "stus.id",
          foreignField: "id",
          as: "stus"
        }
      },
      {
        $project: {
          _id: 0,
          __v: 0,
          content: 0,
          stus: { 
            _id: 0,
            __v: 0,
            password: 0,
            created: 0,
            study: {
              _id: 0,
              __v: 0
            }
          }
        }
      }
    ])
      .then(docs => {
        return ctx.body = {
          code: 1,
          data: {
            course: docs[0],
            exams: courseExams
          }
        }
      })
      .catch(err => {
        return ctx.body = {
          code: -1,
          errMsg: err.message
        }
      });
  },
};
