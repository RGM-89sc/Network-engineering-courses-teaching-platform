const router = require('koa-router')({ prefix: '/api' });
const courses = require('../../controller/courses');
const auth = require('../../middleware/auth');

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


router.get('/getFourHottestCourses', courses.getFourHottestCourses);

module.exports = router;