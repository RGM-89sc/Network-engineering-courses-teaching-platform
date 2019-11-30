const router = require('koa-router')({ prefix: '/api' });
const others = require('../../controller/others');
const auth = require('../../middleware/auth');

// 全局搜索
router.post('/search', others.search);

module.exports = router;