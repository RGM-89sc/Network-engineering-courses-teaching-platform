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
  // 教师修改密码
  router.post('/tchChangePW', auth.tch, app.controllers.teacher.changePW);

  // 教师上传资源
  router.post('/updateResources', auth.tch, app.controllers.resources.updateResources);
  // 教师删除单个资源
  router.post('/delResources', auth.tch, app.controllers.resources.delResource);
  // 获取资源
  router.post('/getResources', app.controllers.resources.getResources);

  // 添加课程
  router.post('/addNewCourse', auth.tch, app.controllers.courses.addNewCourse);
  // 删除课程
  router.post('/delCourse', auth.tch, app.controllers.courses.delCourse);
  // 获取全部课程
  router.get('/getCourses', app.controllers.courses.getCourses);
  // 获取课程详情
  router.post('/getCourseDetail', app.controllers.courses.getCourseDetail);

  // 给课程添加章节
  router.post('/addChapterToCourse', auth.tch, app.controllers.courses.addChapter);
  // 删除课程章节
  router.post('/delChapter', auth.tch, app.controllers.courses.delChapter);

  // 添加/更新课程章节单元
  router.post('/updatePart', auth.tch, app.controllers.courses.updatePart);
  // 获取课程章节单元信息
  router.post('/getPartDetail', auth.tch, app.controllers.courses.getPartDetail);
  // 获取课程章节单元信息（不需要权限，用于直接查看内容）
  router.post('/getPartDetailNoAuth', app.controllers.courses.getPartDetailNoAuth);

  // 删除课程章节单元
  router.post('/delPart', auth.tch, app.controllers.courses.delPart);

  // 给课程添加插图
  router.post('/uploadCourseImg', app.controllers.courses.uploadCourseImg);
  // 给课程添加视频，接收视频文件分片
  router.post('/uploadCourseVideoChunks', auth.tch, app.controllers.courses.uploadCourseVideoChunks);
  // 给课程添加视频，合并视频文件分片
  router.post('/mergeCourseVideoChunks', auth.tch, app.controllers.courses.mergeCourseVideoChunks);
  // 删除课程视频
  router.post('/delCourseVideo', auth.tch, app.controllers.courses.delCourseVideo);

  // 学生开始学习课程
  router.post('/startStudy', auth.stu, app.controllers.student.startStudy);
  

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