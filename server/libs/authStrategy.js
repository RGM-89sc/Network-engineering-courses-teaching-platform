const passport = require('koa-passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');
const db = require('../tools/mountModel');
const omit = require('../tools/omitObjProp');

/**
 * 根据id和账号类型获取用户信息
 *
 * @param {String} model 表名
 * @param {String} id 用户id
 * @returns {Object} 用户
 */
function fetchUser (model, id) {
  return db[model].findOne({ id });
}

/**
 * 校验密码
 *
 * @param {String} password 明文密码
 * @param {String} hash 数据库中hash过的密码
 * @returns {Boolean} 密码是否正确
 */
function verifyPassword (password, hash) {
  return bcrypt.compare(password, hash);
}

// 用户名密码验证策略
passport.use(new LocalStrategy({
    usernameField: 'id',
    passReqToCallback: true,
  }, async (req, id, password, done) => {
    const { userType } = req.body;

    if (!userType.toString()) {
      return done(new Error('Could not find user type'));
    }

    // userType兼容数字和字符串
    const model = userType.toString() === '0' ? 'student' : 'teacher';

    try {
      const user = await fetchUser(model, id);
      if (!user) {
        return done(null, null, '用户不存在');
      }
      if (await verifyPassword(password, user.password)) {
        user.userType = parseInt(userType);
        return done(null, user);
      }
      return done(null, null, '密码错误');
    } catch(err) {
      return done(err);
    }
  }
));

// 在用户登录成功以后把用户的关键信息存储到 session 中
passport.serializeUser(({ id, userType }, done) => {
  done(null, { id, userType });  // 这两个信息将在deserializeUser获取到
});

// 在每次请求的时候将从 session 中读取用户关键信息来找到用户
passport.deserializeUser(async ({ id, userType }, done) => {
  const model = userType === 0 ? 'student' : 'teacher';  // userType从49行而来

  try {
    const user = omit(await fetchUser(model, id), [], true);
    user.userType = userType;
    done(null, user);
  } catch(err) {
    done(err);
  }
});

module.exports = passport;