const router = require('koa-router')({ prefix: '/api' });
const teacher = require('../../controller/teacher');
const auth = require('../../middleware/auth');

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

// 教师查看自己发布的文章
router.get('/tchGetMyArticles', auth.tch, teacher.getMyArticles);
router.get('/tchGetMyQuestions', auth.tch, teacher.getMyQuestions);



module.exports = router;