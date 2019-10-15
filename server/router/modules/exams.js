const router = require('koa-router')({ prefix: '/api' });
const exams = require('../../controller/exams');
const auth = require('../../middleware/auth');

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
router.post('/uploadExamQuestionImg', auth.tch, exams.uploadQuestionImg);
// 删除上传的题目配图
router.post('/delExamQuestionImg', auth.tch, exams.delQuestionImg);
// 删除上传的题目所有配图
router.post('/delExamQuestionImgs', auth.tch, exams.delQuestionImgs);
// 考试评分
router.post('/handIn', auth.all, exams.handIn);
// 检查是否可以进入考试
router.post('/checkStuCanEnterExam', auth.all, exams.checkStuCanEnterExam);


module.exports = router;