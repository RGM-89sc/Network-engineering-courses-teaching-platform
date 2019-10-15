const router = require('koa-router')({ prefix: '/api' });
const student = require('../../controller/student');
const auth = require('../../middleware/auth');

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

// 学生开始学习课程
router.post('/startStudy', auth.stu, student.startStudy);

// 学生查看自己发布的文章
router.get('/stuGetMyArticles', auth.stu, student.getMyArticles);

router.get('/stuGetMyQuestions', auth.stu, student.getMyQuestions);


module.exports = router;