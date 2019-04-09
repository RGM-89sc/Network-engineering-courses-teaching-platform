const fs = require('fs');
const path = require('path');
const uuidV4 = require('uuid/v4');
const db = require('../tools/mountModel');
const { serverURL } = require('../config.js');
const omit = require('../tools/omitObjProp');
const { decodeFilename, encodeFilename } = require('../tools/filenameTools');

module.exports = {
  async addExamPaper(ctx) {
    const { courseID, examID, examName, choiceQuestions, startTime, endTime, examTiming } = ctx.request.body;
    const tchID = ctx.state.user.id;

    await db.exams.create({
      courseID,
      examID,
      examName,
      tchID,
      choiceQuestions,
      startTime,
      endTime,
      examTiming
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

  async updateExamPaper(ctx) {
    const { courseID, examID, startTime, endTime, examTiming } = ctx.request.body;

    await db.exams.updateOne({
      courseID,
      examID
    }, {
        startTime,
        endTime,
        examTiming
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

  async getExamPaper(ctx) {
    const { courseID, examID } = ctx.request.body;

    await db.exams.findOne({ courseID, examID }, { _id: 0, __v: 0, 'choiceQuestions._id': 0, 'choiceQuestions.detail.imgs._id': 0, 'choiceQuestions.detail.selections._id': 0, 'choiceQuestions.detail.selections.isAnswer': 0 }).then(docs => {
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

  async getExamPapers(ctx) {
    const { courseID } = ctx.request.body;

    await db.exams.find({ courseID }, { _id: 0, __v: 0, 'choiceQuestions': 0 }).sort({ created: 1 }).then(docs => {
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

  async delExamPaper(ctx) {
    const { courseID, examID } = ctx.request.body;

    await db.exams.findOneAndDelete({ courseID, examID })
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
                const p = path.join(__dirname, `../public/static/img/exams/${img.name}`);
                if (fs.existsSync(p)) {
                  fs.unlinkSync(p);
                }
              }, 0);
            } catch (e) { }
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
    const { courseID, examID, questionID } = ctx.request.body;

    const file = ctx.request.files.file;
    const filepath = file.path;
    const extname = path.extname(file.name);
    const imgUUID = uuidV4().split('-').join('');
    const filename = `${imgUUID}${extname}`;

    fs.renameSync(filepath, path.join(__dirname, `../public/static/img/exams/${filename}`));

    ctx.body = {
      code: 1,
      data: {
        filename,
        url: serverURL + '/static/img/exams/' + filename
      }
    };
  },

  async delQuestionImg(ctx) {
    const { filename } = ctx.request.body;

    try {
      setTimeout(() => {
        const p = path.join(__dirname, `../public/static/img/exams/${filename}`);
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
            const p = path.join(__dirname, `../public/static/img/exams/${img.name}`);
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
  },

  // 交卷
  async handIn(ctx) {
    const { courseID, examID, userAnswer } = ctx.request.body;
    const stuID = ctx.state.user.id;
    let score = 0, rightAnswer = {}, countQuestions = 0, countRight = 0;

    await db.exams.findOne({ courseID, examID }).then(async docs => {
      // 获取题目总数
      countQuestions = docs.choiceQuestions.length;

      // 提取正确答案
      docs.choiceQuestions.forEach(question => {
        const selections = question.detail.selections;
        let right = [];
        selections.forEach(selection => {
          if (selection.isAnswer) {
            right.push(selection.id);
          }
        });
        rightAnswer[question.id] = right;
      });

      // 计算分数
      docs.choiceQuestions.forEach(question => {
        const selections = question.detail.selections;
        let isRight = false,
          thisUserAnswer = userAnswer[question.id],
          thisRightAnswer = rightAnswer[question.id];
        thisUserAnswer = Array.isArray(thisUserAnswer) ? thisUserAnswer : [thisUserAnswer];
        isRight =
          thisRightAnswer.every(val => {
            return thisUserAnswer.indexOf(val) !== -1;
          }) && thisRightAnswer.length === thisUserAnswer.length;

        if (isRight) {
          countRight++;
        }
      });

      score = (countRight / countQuestions * 100).toFixed(2);

      try {
        if (ctx.state.user.userType === 0) {
          const stu = await db.student.findOne({ id: stuID });
          let index;
          stu.study.some((study, i) => {
            if (study.courseID === courseID) {
              index = i;
              return true;
            }
            return false;
          });
          await db.student.updateOne({ id: stuID }, {
            $push: {
              [`study.${index}.exams`]: {
                examID,
                examScore: score
              }
            }
          });
        }
      } catch (err) {
        return ctx.body = {
          code: -1,
          errMsg: err.message
        };
      }

      ctx.body = {
        code: 1,
        data: {
          score
        }
      };
    }).catch(err => {
      ctx.body = {
        code: -1,
        errMsg: err.message
      };
    });
  },

  async checkStuCanEnterExam(ctx) {
    const { courseID, examID } = ctx.request.body;
    const stuID = ctx.state.user.id;

    if (ctx.state.user.userType === 1) {
      return ctx.body = {
        code: 1,
        data: {
          canEnterExam: true
        }
      };
    }

    const course = await db.courses.findOne({ courseID });
    let isStuLearning = course.stus.some(stu => {
      return stu.id === stuID;
    });
    if (!isStuLearning) {
      return ctx.body = {
        code: 1,
        data: {
          canEnterExam: false,
          reason: '您未学习该课程，无法参加考试！'
        }
      };
    }

    await db.student.findOne({ id: stuID }).then(stu => {
      let stuExams = [], stuExam;
      stu.study.some(study => {
        if (study.courseID === courseID) {
          stuExams = study.exams;
          return true;
        }
        return false;
      });
      if (stuExams.length > 0) {
        stuExams.some(exam => {
          if (exam.examID === examID) {
            stuExam = exam;
            return true;
          }
          return false;
        });
      }
      if (stuExam && stuExam.examScore >= 0) {
        return ctx.body = {
          code: 1,
          data: {
            canEnterExam: false,
            reason: '您已交卷，无法再次参加考试！'
          }
        }
      }
      ctx.body = {
        code: 1,
        data: {
          canEnterExam: true
        }
      }
    }).catch(err => {
      return ctx.body = {
        code: -1,
        errMsg: err.message
      }
    });
  }
};