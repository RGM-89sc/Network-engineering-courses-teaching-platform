const router = require('koa-router')({ prefix: '/api' });
const log4js = require('log4js');
const controllersInit = require('./tools/controllersInit');
const auth = require('./middleware/auth');

const logger = log4js.getLogger();
logger.level = 'debug';

module.exports = app => {
  if (!app) {
    logger.fatal('初始化路由时缺少参数app！');
  }

  controllersInit(app);

  // 获取学生信息
  router.post('/getStuInfoById', auth.all, app.controllers.student.getInfoById);
  // 学生注册
  router.post('/stuRegister', app.controllers.student.register);
  // 学生登录
  router.post('/stuLogin', app.controllers.student.login);
  // 学生退出登录
  router.get('/stuLogout', app.controllers.student.logout);
  // 学生更改头像
  router.post('/stuChangeAvatar', auth.stu, app.controllers.student.changeAvatar);
  // 学生修改密码
  router.post('/stuChangePW', auth.stu, app.controllers.student.changePW);


  // 获取教师信息
  router.post('/getTchInfoById', auth.all, app.controllers.teacher.getInfoById);
  // 教师注册
  router.post('/tchRegister', app.controllers.teacher.register);
  // 教师登录
  router.post('/tchLogin', app.controllers.teacher.login);
  // 教师退出登录
  router.get('/tchLogout', app.controllers.teacher.logout);
  // 教师修改学生信息
  router.post('/updateStuInfo', auth.tch, app.controllers.teacher.updateStuInfo);
  // 教师更改头像
  router.post('/tchChangeAvatar', auth.tch, app.controllers.teacher.changeAvatar);
  // 学生修改密码
  router.post('/tchChangePW', auth.tch, app.controllers.teacher.changePW);


  // 登录认证状态测试
  router.get('/testAuth', auth.all, (ctx) => {
    ctx.body = {
      info: '认证通过',
      data: ctx.state.user
    };
  });

  app.use(router.routes())
    .use(router.allowedMethods());
};