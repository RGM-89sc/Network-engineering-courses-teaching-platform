const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const db = require('../tools/mountModel');
const omit = require('../tools/omitObjProp');
const passport = require('../libs/authStrategy');

const saltRounds = 10;

module.exports = {
  // get info by id
  async getInfoById (ctx) {
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
  async register (ctx) {
    const { id, username, password, faculty, major, grade, sclass } = ctx.request.body;

    if (await db.student.findOne({ id })) {
      return ctx.body = {
        code: 0,
        info: '该学号已存在'
      }
    }

    await bcrypt.hash(password, saltRounds).then(async hash => {
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
    });
  },

  // 登录
  async login (ctx) {
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
            maxAge: 1000 * 60 * 60 * 3 
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
  async logout (ctx) {
    ctx.logout(ctx.state.user);
    ctx.cookies.set('loginState', '',
      {
        httpOnly: false,
        overwrite: false,
      }
    );
    ctx.body = {
      code: 1
    };
  },

  // change avatar
  async changeAvatar (ctx) {
    const userid = ctx.state.user.id;
    const avatar = ctx.request.files.avatar;
    const name = `stu_${userid + path.extname(avatar.name)}`;

    fs.renameSync(avatar.path, path.join(__dirname, `../public/static/img/avatar/${name}`));

    if (ctx.state.user.avatar === '/static/img/avatar/default.jpg') {
      await db.student.updateOne({ id: userid }, {
        avatar: `/static/img/avatar/${name}`
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
      return null;
    }
    ctx.body = {
      code: 1
    };
  },

  // change password
  async changePW (ctx) {
    const { password } = ctx.request.body;

    await bcrypt.hash(password, saltRounds).then(async hash => {
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
    });
  }
};
