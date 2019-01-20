module.exports = {
  async all (ctx, next) {
    if (ctx.isAuthenticated()) { // 验证通过，进入下一步处理
      return await next();
    }
    // 非法访问
    ctx.status = 401;
    // ctx.status = 301;
    // ctx.redirect('/login');
  },

  async stu (ctx, next) {
    if (ctx.isAuthenticated()) { // 验证通过，进入下一步处理
      if (ctx.state.user.userType === 0) {
        return await next();
      }
      // 用户不是学生
      ctx.status = 401;
      return null;
    }
    // 未登录
    ctx.status = 401;
    // ctx.status = 301;
    // ctx.redirect('/login');
  },

  async tch (ctx, next) {
    if (ctx.isAuthenticated()) { // 验证通过，进入下一步处理
      if (ctx.state.user.userType === 1) {
        return await next();
      }
      // 用户不是教师
      ctx.status = 401;
      return null;
    }
    // 未登录
    ctx.status = 401;
    // ctx.status = 301;
    // ctx.redirect('/login');
  }
};