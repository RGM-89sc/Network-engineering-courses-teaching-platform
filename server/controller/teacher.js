const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const db = require('../tools/mountModel');
const omit = require('../tools/omitObjProp');
const passport = require('../libs/authStrategy');
const {
  serverURL,
  loginMaxAge
} = require('../config.js');

const saltRounds = 10;

module.exports = {
  // get info by id
  async getInfoById(ctx) {
    const {
      id
    } = ctx.request.body;

    await db.teacher.findOne({
        id
      }, {
        password: 0,
        _id: 0,
        __v: 0
      })
      .then(docs => {
        ctx.body = {
          code: 1,
          data: docs
        };
      });
  },

  // register
  async register(ctx) {
    const {
      id,
      username,
      password,
      faculty
    } = ctx.request.body;

    if (await db.teacher.findOne({
        id
      })) {
      return ctx.body = {
        code: 0,
        info: '该工号已存在'
      }
    }

    const hash = await bcrypt.hash(password, saltRounds);
    await db.teacher.create({
        id,
        username,
        password: hash,
        faculty
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
          })), {
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
    ctx.cookies.set('loginState', '', {
      httpOnly: false,
      overwrite: false,
    });
    ctx.body = {
      code: 1
    };
  },

  // update student info
  async updateStuInfo(ctx) {
    const {
      id,
      username,
      faculty,
      major,
      grade,
      sclass
    } = ctx.request.body;

    await db.student.updateOne({
        id
      }, {
        username,
        faculty,
        major,
        grade,
        sclass
      })
      .then(docs => {
        ctx.body = {
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

  // change avatar
  async changeAvatar(ctx) {
    const userid = ctx.state.user.id;
    const avatar = ctx.request.files.avatar;
    const extName = path.extname(avatar.name);
    const name = `tch_${userid + extName}`;

    fs.renameSync(avatar.path, path.join(__dirname, `../public/static/img/avatar/${name}`));

    await db.teacher.updateOne({
        id: userid
      }, {
        avatar: `/static/img/avatar/${name}`
      })
      .then(docs => {
        if (ctx.state.user.avatar !== '/static/img/avatar/default.jpg' && path.extname(ctx.state.user.avatar) !== extName) {
          setTimeout(() => {
            try {
              fs.unlinkSync(path.join(__dirname, `../public${ctx.state.user.avatar}`));
            } catch (err) {}
          }, 0);
        }

        ctx.cookies.set('loginState',
          encodeURI(JSON.stringify({
            id: ctx.state.user.id,
            username: ctx.state.user.username,
            avatar: `/static/img/avatar/${name}`,
            userType: ctx.state.user.userType
          })), {
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
    const {
      password
    } = ctx.request.body;

    const hash = await bcrypt.hash(password, saltRounds);
    await db.teacher.updateOne({
        id: ctx.state.user.id
      }, {
        password: hash
      })
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

  async getMyCourses(ctx) {
    const teaching = ctx.state.user.teaching || [];

    ctx.body = {
      code: 1,
      data: teaching
    }
  },

  async resetStuExamScore(ctx) {
    const {
      stuID,
      courseID,
      examID
    } = ctx.request.body;

    let cIndex;
    try {
      const stu = await db.student.findOne({
        id: stuID
      });
      stu.study.some((s, index) => {
        if (s.courseID === courseID) {
          cIndex = index;
          return true;
        }
        return false;
      });
    } catch (err) {
      return ctx.body = {
        code: -1,
        errMsg: err.message
      }
    }

    await db.student.updateOne({
        id: stuID
      }, {
        $pull: {
          [`study.${cIndex}.exams`]: {
            examID
          }
        }
      })
      .then(docs => {
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
  async getMyArticles(ctx) {
    const articles = ctx.state.user.articles || [];
    return ctx.body = {
      data: articles,
      code: 1
    }
  }
};