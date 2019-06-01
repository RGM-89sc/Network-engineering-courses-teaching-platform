const fs = require('fs');

function unlinkFile(filePath) {
  if (fs.existsSync(filePath)) {
    setTimeout(() => {
      try {
        fs.unlinkSync(filePath);
      } catch (err) { }
    }, 0);
  }
}

function unlinkFiles(files) {
  if (files) {
    Object.entries(files).forEach(([key, file]) => {
      unlinkFile(file.path);
    });
  }
}

module.exports = {
  async all(ctx, next) {
    if (ctx.isAuthenticated()) { // 验证通过，进入下一步处理
      return await next();
    }
    // 非法访问
    unlinkFiles(ctx.request.files);
    ctx.status = 401;
    // ctx.status = 301;
    // ctx.redirect('/login');
  },

  async stu(ctx, next) {
    if (ctx.isAuthenticated()) { // 验证通过，进入下一步处理
      if (ctx.state.user.userType === 0) {
        return await next();
      }
      // 用户不是学生
      unlinkFiles(ctx.request.files);
      ctx.status = 401;
      return null;
    }
    // 未登录
    unlinkFiles(ctx.request.files);
    ctx.status = 401;
    // ctx.status = 301;
    // ctx.redirect('/login');
  },

  async tch(ctx, next) {
    if (ctx.isAuthenticated()) { // 验证通过，进入下一步处理
      if (ctx.state.user.userType === 1) {
        return await next();
      }
      // 用户不是教师
      unlinkFiles(ctx.request.files);
      ctx.status = 401;
      return null;
    }
    // 未登录
    unlinkFiles(ctx.request.files);
    ctx.status = 401;
    // ctx.status = 301;
    // ctx.redirect('/login');
  }
};