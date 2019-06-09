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

  const student = app.controllers.student;
  const teacher = app.controllers.teacher;
  const resources = app.controllers.resources;
  const courses = app.controllers.courses;
  const exercises = app.controllers.exercises;
  const exams = app.controllers.exams;


  // 获取学生信息
  router.post('/getStuInfoById', auth.all, student.getInfoById);
  // 学生注册
  router.post('/stuRegister', student.register);
  // 学生登录
  router.post('/stuLogin', student.login);
  // 学生退出登录
  router.get('/stuLogout', student.logout);
  // 学生更改头像
  router.post('/stuChangeAvatar', auth.stu, student.changeAvatar);
  // 学生修改密码
  router.post('/stuChangePW', auth.stu, student.changePW);
  // 学生查看自己的课程信息
  router.get('/stuGetMyCourses', auth.stu, student.getMyCourses);
  // 学生查看自己考试的信息
  router.post('/getMyCourseExams', auth.stu, student.getMyCourseExams);

  // 获取教师信息
  router.post('/getTchInfoById', auth.all, teacher.getInfoById);
  // 教师注册
  router.post('/tchRegister', teacher.register);
  // 教师登录
  router.post('/tchLogin', teacher.login);
  // 教师退出登录
  router.get('/tchLogout', teacher.logout);
  // 教师修改学生信息
  router.post('/updateStuInfo', auth.tch, teacher.updateStuInfo);
  // 教师更改头像
  router.post('/tchChangeAvatar', auth.tch, teacher.changeAvatar);
  // 教师修改密码
  router.post('/tchChangePW', auth.tch, teacher.changePW);
  // 教师查看自己的课程信息
  router.get('/tchGetMyCourses', auth.tch, teacher.getMyCourses);
  // 重置某个学生的某个考试
  router.post('/resetStuExamScore', auth.tch, teacher.resetStuExamScore);

  // 教师上传资源
  router.post('/uploadResources', auth.tch, resources.uploadResources);
  // 教师删除单个资源
  router.post('/delResources', auth.tch, resources.delResource);
  // 获取资源
  router.post('/getResources', resources.getResources);

  // 添加课程
  router.post('/addNewCourse', auth.tch, courses.addNewCourse);
  // 删除课程
  router.post('/delCourse', auth.tch, courses.delCourse);
  // 获取全部课程
  router.get('/getCourses', courses.getCourses);
  // 获取课程详情
  router.post('/getCourseDetail', auth.all, courses.getCourseDetail);

  // 给课程添加章节
  router.post('/addChapterToCourse', auth.tch, courses.addChapter);
  // 删除课程章节
  router.post('/delChapter', auth.tch, courses.delChapter);

  // 教师发布课程公告
  router.post('/addBulletin', auth.tch, courses.addBulletin);
  // 获取课程公告
  router.get('/getBulletins', auth.all, courses.getBulletins);

  // 添加/更新课程章节单元
  router.post('/updatePart', auth.tch, courses.updatePart);
  // 获取课程章节单元信息
  router.post('/getPartDetail', auth.tch, courses.getPartDetail);
  // 获取课程章节单元信息（不需要权限，用于直接查看内容）
  router.post('/getPartDetailNoAuth', courses.getPartDetailNoAuth);

  // 删除课程章节单元
  router.post('/delPart', auth.tch, courses.delPart);

  // 给课程添加插图
  router.post('/uploadCourseImg', /*auth.tch,*/ courses.uploadCourseImg); // ckfinder的xhr没有设置xhr.withCredentials = true;无法验证身份，位置：node_modules\@ckeditor\ckeditor5-adapter-ckfinder\src\uploadadapter.js 第127行_initRequest()
  // 给课程添加视频，接收视频文件分片
  router.post('/uploadCourseVideoChunks', auth.tch, courses.uploadCourseVideoChunks);
  // 给课程添加视频，合并视频文件分片
  router.post('/mergeCourseVideoChunks', auth.tch, courses.mergeCourseVideoChunks);
  // 删除课程视频
  router.post('/delCourseVideo', auth.tch, courses.delCourseVideo);
  // 获取课程学生的信息
  router.post('/getCourseStusAndExams', auth.tch, courses.getCourseStusAndExams);
  

  // 学生开始学习课程
  router.post('/startStudy', auth.stu, student.startStudy);

  // 创建作业
  router.post('/addExercisePaper', auth.tch, exercises.addExercisePaper);
  // 更新作业
  router.post('/updateExercisePaper', auth.tch, exercises.updateExercisePaper);
  // 获取某一课程的某一作业
  router.post('/getExercisePaper', exercises.getExercisePaper);
  // 获取某一课程的所有作业
  router.post('/getExercisePapers', exercises.getExercisePapers);
  // 删除作业
  router.post('/delExercisePaper', auth.tch, exercises.delExercisePaper);
  // 上传题目的配图
  router.post('/uploadQuestionImg', auth.tch, exercises.uploadQuestionImg);
  // 删除上传的题目配图
  router.post('/delQuestionImg', auth.tch, exercises.delQuestionImg);
  // 删除上传的题目所有配图
  router.post('/delQuestionImgs', auth.tch, exercises.delQuestionImgs);

  // 创建考试
  router.post('/addExamPaper', auth.tch, exams.addExamPaper);
  // 设置考试
  router.post('/updateExamPaper', auth.tch, exams.updateExamPaper);
  // 获取某一课程的某一考试
  router.post('/getExamPaper', exams.getExamPaper);
  // 获取某一课程的所有考试
  router.post('/getExamPapers', exams.getExamPapers);
  // 删除考试
  router.post('/delExamPaper', auth.tch, exams.delExamPaper);
  // 上传题目的配图
  router.post('/uploadQuestionImg', auth.tch, exams.uploadQuestionImg);
  // 删除上传的题目配图
  router.post('/delQuestionImg', auth.tch, exams.delQuestionImg);
  // 删除上传的题目所有配图
  router.post('/delQuestionImgs', auth.tch, exams.delQuestionImgs);
  // 考试评分
  router.post('/handIn', auth.all, exams.handIn);
  // 检查是否可以进入考试
  router.post('/checkStuCanEnterExam', auth.all, exams.checkStuCanEnterExam);

  const qa = app.controllers.qa;

  router.post('/uploadQuestion', auth.all, qa.uploadQuestion)
  router.post('/deleteQuestion', auth.all, qa.deleteQuestion)
  router.post('/modifyQuestion', auth.all, qa.modifyQuestion)
  router.post('/deleteQuestionReply', auth.all, qa.deleteQuestionReply)
  router.post('/uploadQaImage', qa.uploadQaImage)
  router.post('/loadQuestion', qa.loadQuestion)
  router.post('/updateQuestionReplys', qa.updateQuestionReplys);

  router.get('/loadQuestions', qa.loadQuestions)

  app.use(router.routes())
    .use(router.allowedMethods());
};