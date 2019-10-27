import http from '../../http'
import config from '../../config/index'
const baseUrl = config.apiBaseUrl

export const CoursesProvider = {
  // 添加课程
  addNewCourse: (payload) => {
    return http.post(baseUrl + 'addNewCourse', payload)
      .then(res => res)
      .catch(err => err)
  },

  // 删除课程
  delCourse: (payload) => {
    return http.post(baseUrl + 'delCourse', payload)
      .then(res => res)
      .catch(err => err)
  },

  // 获取全部课程
  getCourses: () => {
    return http.get(baseUrl + 'getCourses')
      .then(res => res)
      .catch(err => err)
  },

  // 获取课程详情
  getCourseDetail: (payload) => {
    return http.post(baseUrl + 'getCourseDetail', payload)
      .then(res => res)
      .catch(err => err)
  },

  // 给课程添加章节
  addChapter: (payload) => {
    return http.post(baseUrl + 'addChapterToCourse', payload)
      .then(res => res)
      .catch(err => err)
  },

  // 教师发布课程公告
  addBulletin: (payload) => {
    return http.post(baseUrl + 'addBulletin', payload)
      .then(res => res)
      .catch(err => err)
  },

  // 获取课程公告
  getBulletins: (query) => {
    return http.get(baseUrl + 'getBulletins' + query)
      .then(res => res)
      .catch(err => err)
  },

  // 添加/更新课程章节单元
  updatePart: (payload) => {
    return http.post(baseUrl + 'updatePart', payload)
      .then(res => res)
      .catch(err => err)
  },

  // 获取课程章节单元信息
  getPartDetail: (payload) => {
    return http.post(baseUrl + 'getPartDetail', payload)
      .then(res => res)
      .catch(err => err)
  },

  // 获取课程章节单元信息（不需要权限，用于直接查看内容）
  getPartDetailNoAuth: (payload) => {
    return http.post(baseUrl + 'getPartDetailNoAuth', payload)
      .then(res => res)
      .catch(err => err)
  },

  // 删除课程章节单元
  delPart: (payload) => {
    return http.post(baseUrl + 'delPart', payload)
      .then(res => res)
      .catch(err => err)
  },

  // 给课程添加插图
  uploadCourseImg: (payload) => {
    return http.post(baseUrl + 'uploadCourseImg', payload)
      .then(res => res)
      .catch(err => err)
  },

  // 给课程添加视频，接收视频文件分片
  uploadCourseVideoChunks: (payload) => {
    return http.post(baseUrl + 'uploadCourseVideoChunks', payload)
      .then(res => res)
      .catch(err => err)
  },

  // 给课程添加视频，合并视频文件分片
  mergeCourseVideoChunks: (payload) => {
    return http.post(baseUrl + 'mergeCourseVideoChunks', payload)
      .then(res => res)
      .catch(err => err)
  },

  // 删除课程视频
  delCourseVideo: (payload) => {
    return http.post(baseUrl + 'delCourseVideo', payload)
      .then(res => res)
      .catch(err => err)
  },

  // 获取课程学生的信息
  getCourseStusAndExams: (payload) => {
    return http.post(baseUrl + 'getCourseStusAndExams', payload)
      .then(res => res)
      .catch(err => err)
  },


  getFourHottestCourses: (payload) => {
    return http.post(baseUrl + 'getFourHottestCourses', payload)
      .then(res => res)
      .catch(err => err)
  },
  delChapter: (payload) => {
    return http.post(baseUrl + 'delChapter', payload)
      .then(res => res)
      .catch(err => err)
  }
}