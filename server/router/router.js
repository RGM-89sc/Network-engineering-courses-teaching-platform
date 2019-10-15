const studentRouter = require('./modules/student');
const teacherRouter = require('./modules/teacher');
const resourcesRouter = require('./modules/resources');
const coursesRouter = require('./modules/courses');
const exercisesRouter = require('./modules/exercises');
const examsRouter = require('./modules/exams');
const qaRouter = require('./modules/qa');
const articleRouter = require('./modules/article');
const log4js = require('log4js');
const logger = log4js.getLogger();
logger.level = 'debug';

module.exports = app => {
  if (!app) {
    logger.fatal('初始化路由时缺少参数app！');
  }

  app.use(studentRouter.routes())
    .use(studentRouter.allowedMethods());

  app.use(teacherRouter.routes())
    .use(teacherRouter.allowedMethods());

  app.use(resourcesRouter.routes())
    .use(resourcesRouter.allowedMethods());

  app.use(coursesRouter.routes())
    .use(coursesRouter.allowedMethods());
  
  app.use(exercisesRouter.routes())
    .use(exercisesRouter.allowedMethods());

  app.use(examsRouter.routes())
    .use(examsRouter.allowedMethods());

  app.use(qaRouter.routes())
    .use(qaRouter.allowedMethods());

  app.use(articleRouter.routes())
    .use(articleRouter.allowedMethods());
};