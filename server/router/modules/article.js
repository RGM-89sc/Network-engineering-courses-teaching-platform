const router = require('koa-router')({ prefix: '/api' });
const article = require('../../controller/article');
const auth = require('../../middleware/auth');

// 获取文章
router.post('/getArticle', article.getArticle);
// 上传文章
router.post('/postArticle', auth.all, article.postArticle);
// 上传文章图片
router.post('/postArticleImage', article.postArticleImage);
// 删除文章
router.post('/delArticle', article.delArticle);
// 获取 新闻 或者 技术前沿的文章
router.post('/getArticles', article.getArticles);
// 获取全部文章
router.get('/getAllArticles', article.getAllArticles);
// 更新文章信息
router.post('/updateArticleInfo', article.updateArticleInfo);
// 更新文章 评论 回复
// router.post('/updateArticle', article.updateArticle);

// router.post('/delArticle', article.delArticle);


module.exports = router;