const fs = require('fs');
const path = require('path');
const uuidV4 = require('uuid/v4');
const db = require('../tools/mountModel');
const { serverURL } = require('../config.js');
const omit = require('../tools/omitObjProp');
const { decodeFilename, encodeFilename } = require('../tools/filenameTools');

module.exports = {
  async addExercisePaper(ctx) {
    const { courseID, exerciseID, exerciseName, choiceQuestions } = ctx.request.body;
    const tchID = ctx.state.user.id;

    await db.exercises.create({
      courseID,
      exerciseID,
      exerciseName,
      tchID,
      choiceQuestions
    }).then(docs => {
      return ctx.body = {
        code: 1
      };
    }).catch(err => {
      return ctx.body = {
        code: -1,
        errMsg: err.message
      }
    });
  },

  async updateExercisePaper(ctx) {
    const { courseID, exerciseID, exerciseName, choiceQuestions, delImgs } = ctx.request.body;

    await db.exercises.updateOne({ courseID, exerciseID }, {
      exerciseName,
      choiceQuestions
    })
      .then(docs => {
        try {
          if (delImgs.length > 0) {  
            setTimeout(() => {
              delImgs.forEach(img => {
                const p = path.join(__dirname, `../public/static/img/exercises/${img.name}`);
                if (fs.existsSync(p)) {
                  fs.unlinkSync(p);
                }
              }, 0);
            });
          }
        } catch(err) {}

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

  async getExercisePaper(ctx) {
    const { courseID, exerciseID } = ctx.request.body;

    await db.exercises.findOne({ courseID, exerciseID }, { _id: 0, __v: 0, 'choiceQuestions._id': 0, 'choiceQuestions.detail.imgs._id': 0, 'choiceQuestions.detail.selections._id': 0 }).then(docs => {
      ctx.body = {
        code: 1,
        data: docs
      };
    }).catch(err => {
      ctx.body = {
        code: -1,
        errMsg: err.message
      };
    });
  },

  async getExercisePapers(ctx) {
    const { courseID } = ctx.request.body;

    await db.exercises.find({ courseID }, { _id: 0, __v: 0, 'choiceQuestions': 0 }).sort({ created: 1 }).then(docs => {
      ctx.body = {
        code: 1,
        data: docs
      };
    }).catch(err => {
      ctx.body = {
        code: -1,
        errMsg: err.message
      };
    });
  },

  async delExercisePaper(ctx) {
    const { courseID, exerciseID } = ctx.request.body;

    await db.exercises.findOneAndDelete({ courseID, exerciseID })
      .then(docs => {
        // 删除所有题目中的配图
        const imgs = [];
        if (docs.choiceQuestions) {
          docs.choiceQuestions.forEach(question => {
            imgs.push(...question.detail.imgs);
          });
        }
        if (imgs.length > 0) {
          imgs.forEach(img => {
            try {
              setTimeout(() => {
                const p = path.join(__dirname, `../public/static/img/exercises/${img.name}`);
                if (fs.existsSync(p)) {
                  fs.unlinkSync(p);
                }
              }, 0);
            } catch(e) {}
          });
        }
        
        return ctx.body = {
          code: 1,
        };
      })
      .catch(err => {
        return ctx.body = {
          code: -1,
          errMsg: err.message
        };
      });
  },

  async uploadQuestionImg(ctx) {
    const { courseID, exerciseID, questionID } = ctx.request.body;

    const file = ctx.request.files.file;
    const filepath = file.path;
    const extname = path.extname(file.name);
    const imgUUID = uuidV4().split('-').join('');
    const filename = `${imgUUID}${extname}`;

    fs.renameSync(filepath, path.join(__dirname, `../public/static/img/exercises/${filename}`));

    ctx.body = {
      code: 1,
      data: {
        filename,
        url: serverURL + '/static/img/exercises/' + filename
      }
    };
  },

  async delQuestionImg(ctx) {
    const { filename } = ctx.request.body;

    try {
      setTimeout(() => {
        const p = path.join(__dirname, `../public/static/img/exercises/${filename}`);
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

  async delQuestionImgs(ctx) {
    const { imgs } = ctx.request.body;

    try {
      if (imgs.length > 0) {  
        setTimeout(() => {
          imgs.forEach(img => {
            const p = path.join(__dirname, `../public/static/img/exercises/${img.name}`);
            if (fs.existsSync(p)) {
              fs.unlinkSync(p);
            }
          }, 0);
        });
      }
    } catch (e) {
      return ctx.body = {
        code: -1,
        errMsg: e.message
      }
    }

    ctx.body = {
      code: 1
    }
  }
};