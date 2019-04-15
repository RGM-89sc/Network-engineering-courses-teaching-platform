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
  // 学生查看自己的课程信息
  router.get('/stuGetMyCourses', auth.stu, app.controllers.student.getMyCourses);
  // 学生查看自己考试的信息
  router.post('/getMyCourseExams', auth.stu, app.controllers.student.getMyCourseExams);

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
  // 教师查看自己的课程信息
  router.get('/tchGetMyCourses', auth.tch, app.controllers.teacher.getMyCourses);
  // 重置某个学生的某个考试
  router.post('/resetStuExamScore', auth.tch, app.controllers.teacher.resetStuExamScore);

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
  router.post('/getCourseDetail', auth.all, app.controllers.courses.getCourseDetail);

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
  router.post('/uploadCourseImg', auth.tch, app.controllers.courses.uploadCourseImg);
  // 给课程添加视频，接收视频文件分片
  router.post('/uploadCourseVideoChunks', auth.tch, app.controllers.courses.uploadCourseVideoChunks);
  // 给课程添加视频，合并视频文件分片
  router.post('/mergeCourseVideoChunks', auth.tch, app.controllers.courses.mergeCourseVideoChunks);
  // 删除课程视频
  router.post('/delCourseVideo', auth.tch, app.controllers.courses.delCourseVideo);
  // 获取课程学生的信息
  router.post('/getCourseStusAndExams', auth.tch, app.controllers.courses.getCourseStusAndExams);
  

  // 学生开始学习课程
  router.post('/startStudy', auth.stu, app.controllers.student.startStudy);

  // 创建作业
  router.post('/addExercisePaper', auth.tch, app.controllers.exercises.addExercisePaper);
  // 更新作业
  router.post('/updateExercisePaper', auth.tch, app.controllers.exercises.updateExercisePaper);
  // 获取某一课程的某一作业
  router.post('/getExercisePaper', app.controllers.exercises.getExercisePaper);
  // 获取某一课程的所有作业
  router.post('/getExercisePapers', app.controllers.exercises.getExercisePapers);
  // 删除作业
  router.post('/delExercisePaper', auth.tch, app.controllers.exercises.delExercisePaper);
  // 上传题目的配图
  router.post('/uploadQuestionImg', auth.tch, app.controllers.exercises.uploadQuestionImg);
  // 删除上传的题目配图
  router.post('/delQuestionImg', auth.tch, app.controllers.exercises.delQuestionImg);
  // 删除上传的题目所有配图
  router.post('/delQuestionImgs', auth.tch, app.controllers.exercises.delQuestionImgs);

  // 创建考试
  router.post('/addExamPaper', auth.tch, app.controllers.exams.addExamPaper);
  // 设置考试
  router.post('/updateExamPaper', auth.tch, app.controllers.exams.updateExamPaper);
  // 获取某一课程的某一考试
  router.post('/getExamPaper', app.controllers.exams.getExamPaper);
  // 获取某一课程的所有考试
  router.post('/getExamPapers', app.controllers.exams.getExamPapers);
  // 删除考试
  router.post('/delExamPaper', auth.tch, app.controllers.exams.delExamPaper);
  // 上传题目的配图
  router.post('/uploadQuestionImg', auth.tch, app.controllers.exams.uploadQuestionImg);
  // 删除上传的题目配图
  router.post('/delQuestionImg', auth.tch, app.controllers.exams.delQuestionImg);
  // 删除上传的题目所有配图
  router.post('/delQuestionImgs', auth.tch, app.controllers.exams.delQuestionImgs);
  // 考试评分
  router.post('/handIn', auth.all, app.controllers.exams.handIn);
  // 检查是否可以进入考试
  router.post('/checkStuCanEnterExam', auth.all, app.controllers.exams.checkStuCanEnterExam);
  

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