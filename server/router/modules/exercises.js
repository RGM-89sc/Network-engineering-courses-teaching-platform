const router = require('koa-router')({ prefix: '/api' });
const exercises = require('../../controller/exercises');
const auth = require('../../middleware/auth');

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
router.post('/uploadExerciseQuestionImg', auth.tch, exercises.uploadQuestionImg);
// 删除上传的题目配图
router.post('/delExerciseQuestionImg', auth.tch, exercises.delQuestionImg);
// 删除上传的题目所有配图
router.post('/delExerciseQuestionImgs', auth.tch, exercises.delQuestionImgs);


module.exports = router;