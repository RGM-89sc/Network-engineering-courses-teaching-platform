const router = require('koa-router')({ prefix: '/api' });
const qa = require('../../controller/qa');
const auth = require('../../middleware/auth');

router.post('/uploadQaQuestion', auth.all, qa.uploadQaQuestion)

router.post('/delQaQuestion', auth.stu, qa.delQaQuestion)

router.post('/modifyQaQuestion', auth.all, qa.modifyQaQuestion)

router.post('/deleteQuestionReply', auth.all, qa.deleteQuestionReply)

router.post('/uploadQaImage', qa.uploadQaImage)

router.post('/getQaQuestion', qa.getQaQuestion)

router.post('/updateQuestionReplys', qa.updateQuestionReplys)

router.post('/getQaQuestions', qa.getQaQuestions)

router.get('/getQaQuestionsSize', qa.getSize)


module.exports = router;