const router = require('koa-router')({ prefix: '/api' });
const resources = require('../../controller/resources');
const auth = require('../../middleware/auth');

// 教师上传资源
router.post('/uploadResources', auth.tch, resources.uploadResources);
// 教师删除单个资源
router.post('/delResources', auth.tch, resources.delResource);
// 获取资源
router.post('/getResources', resources.getResources);


module.exports = router;