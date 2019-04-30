const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const db = require('../tools/mountModel');
const omit = require('../tools/omitObjProp');
const passport = require('../libs/authStrategy');
const { serverURL, loginMaxAge } = require('../config.js');

const saltRounds = 10;

module.exports = {
  // get info by id
  async getInfoById(ctx) {
    const { id } = ctx.request.body;

    await db.student.findOne({ id }, { password: 0, _id: 0, __v: 0 })
      .then(docs => {
        ctx.body = {
          code: 1,
          data: docs
        };
      });
  },

  // register
  async register(ctx) {
    const { id, username, password, faculty, major, grade, sclass } = ctx.request.body;

    if (await db.student.findOne({ id })) {
      return ctx.body = {
        code: 0,
        info: '该学号已存在'
      }
    }
    const hash = await bcrypt.hash(password, saltRounds);
    await db.student.create({
      id, username, password: hash, faculty, major, grade, sclass
    })
      .then(docs => {
        ctx.body = {
          code: 1,
          data: omit(docs, ['_id', 'password', '__v'], true)
        };
      })
      .catch(err => {
        ctx.body = {
          code: -1,
          errMsg: err.message
        };
      });
  },

  // 登录
  async login(ctx) {
    return passport.authenticate('local', (err, user, info, status) => {
      if (user) {
        ctx.login(user);
        ctx.cookies.set('loginState',
          encodeURI(JSON.stringify({
            id: user.id,
            username: user.username,
            avatar: user.avatar,
            userType: user.userType
          })),
          {
            httpOnly: false,
            overwrite: false,
            maxAge: loginMaxAge
          }
        );

        return ctx.body = {
          code: 1,
          data: omit(user, ['_id', 'password', '__v'], true)
        };
      }
      if (err) {
        return ctx.body = {
          code: -1,
          errMsg: err.message
        };
      }
      return ctx.body = {
        code: 0,
        info: info
      };
    })(ctx);
  },

  // logout
  async logout(ctx) {
    ctx.logout(ctx.state.user);
    ctx.cookies.set('loginState', '',
      {
        httpOnly: false,
        overwrite: false,
        maxAge: 0
      }
    );
    ctx.body = {
      code: 1
    };
  },

  // change avatar
  async changeAvatar(ctx) {
    const userid = ctx.state.user.id;
    const avatar = ctx.request.files.avatar;
    const extName = path.extname(avatar.name);
    const name = `stu_${userid + path.extname(avatar.name)}`;

    fs.renameSync(avatar.path, path.join(__dirname, `../public/static/img/avatar/${name}`));

    await db.student.updateOne({ id: userid }, {
      avatar: `/static/img/avatar/${name}`
    })
      .then(docs => {
        if (ctx.state.user.avatar !== '/static/img/avatar/default.jpg' && path.extname(ctx.state.user.avatar) !== extName) {
          setTimeout(() => {
            try {
              fs.unlinkSync(path.join(__dirname, `../public${ctx.state.user.avatar}`));
            } catch (err) { }
          }, 0);
        }

        ctx.cookies.set('loginState',
          encodeURI(JSON.stringify({
            id: ctx.state.user.id,
            username: ctx.state.user.username,
            avatar: `/static/img/avatar/${name}`,
            userType: ctx.state.user.userType
          })),
          {
            httpOnly: false,
            overwrite: true,
            maxAge: loginMaxAge
          }
        );

        ctx.body = {
          code: 1,
          data: {
            avatarUrl: `${serverURL}/static/img/avatar/${name}`
          }
        };
      })
      .catch(err => {
        ctx.body = {
          code: -1,
          errMsg: err.message
        };
      });
  },

  // change password
  async changePW(ctx) {
    const { password } = ctx.request.body;

    const hash = await bcrypt.hash(password, saltRounds);
    await db.student.updateOne({ id: ctx.state.user.id }, { password: hash })
      .then(docs => {
        ctx.body = {
          code: 1
        };
      })
      .catch(err => {
        ctx.body = {
          code: -1,
          errMsg: err.message
        }
      });
  },

  async startStudy(ctx) {
    const { courseID } = ctx.request.body;
    const stu = ctx.state.user;

    const stuStudy = await db.student.findOne({ id: stu.id });
    const isStudiedOrStudying = stuStudy.study.some(s => {
      return s.courseID === courseID;
    });
    if (isStudiedOrStudying) {
      return ctx.body = {
        code: 1
      }
    }

    await db.student.updateOne(
      { id: stu.id },
      {
        $push: {
          study: {
            courseID
          }
        }
      }
    ).then(async docs => {
      await db.courses.updateOne(
        { courseID },
        {
          $push: {
            stus: {
              id: stu.id,
              avatar: stu.avatar,
              username: stu.username
            }
          }
        }
      );
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

  async getMyCourses(ctx) {
    const stuID = ctx.state.user.id;

    await db.student.aggregate([
      {
        $match: { id: stuID }
      },
      {
        $lookup: {
          from: "courses",
          localField: "study.courseID",
          foreignField: "courseID",
          as: "courses"
        }
      },
      {
        $project: {
          _id: 0, __v: 0, password: 0, faculty: 0, major: 0, grade: 0, sclass: 0, avatar: 0, created: 0,
          courses: { _id: 0, __v: 0, created: 0, stus: 0, content: 0 }
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

  async getMyCourseExams(ctx) {
    const { courseID } = ctx.request.body;
    const stuID = ctx.state.user.id;

    let stuExam, courseExams;
    try {
      const stu = await db.student.findOne({ id: stuID });
      stu.study.some(s => {
        if (s.courseID === courseID) {
          stuExam = s;
          return true;
        }
        return false;
      });

      courseExams = await db.exams.find({ courseID }, { _id: 0, __v: 0, 'choiceQuestions': 0 });
    } catch (err) {
      return ctx.body = {
        code: -1,
        errMsg: err.message
      }
    }

    await db.courses.findOne({ courseID }, { _id: 0, __v: 0, content: 0, stus: 0, created: 0 })
      .then(docs => {
        return ctx.body = {
          code: 1,
          data: {
            course: docs,
            stu: stuExam,
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
  }
};
