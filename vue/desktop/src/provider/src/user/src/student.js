import http from '../../../../http'
import config from '../../../../config/index'
const baseUrl = config.apiBaseUrl

export const StudentProvider = {
  // 获取学生信息
  getInfoById: (payload) => {
    return http.post(baseUrl + 'getStuInfoById', payload)
      .then(res => res.data)
      .catch(err => err)
  },

  // 学生注册
  register: (payload) => {
    return http.post(baseUrl + 'stuRegister', payload)
      .then(res => res.data)
      .catch(err => err)
  },

  // 学生登录
  login: (payload) => {
    return http.post(baseUrl + 'stuLogin', payload)
      .then(res => res.data)
      .catch(err => err)
  },

  // 学生退出登录
  logout: () => {
    return http.get(baseUrl + 'stuLogout')
      .then(res => res.data)
      .catch(err => err)
  },

  // 学生更改头像
  changeAvatar: (payload) => {
    return http.post(baseUrl + 'stuChangeAvatar', payload)
      .then(res => res.data)
      .catch(err => err)
  },

  // 学生修改密码
  changePW: (payload) => {
    return http.post(baseUrl + 'stuChangePW', payload)
      .then(res => res.data)
      .catch(err => err)
  },

  // 学生查看自己的课程信息
  getMyCourses: (payload) => {
    return http.post(baseUrl + 'stuGetMyCourses', payload)
      .then(res => res.data)
      .catch(err => err)
  },

  // 学生查看自己考试的信息
  getMyCourseExams: (payload) => {
    return http.post(baseUrl + 'getMyCourseExams', payload)
      .then(res => res.data)
      .catch(err => err)
  },

  // 学生查看自己考试的信息
  startStudy: (payload) => {
    return http.post(baseUrl + 'startStudy', payload)
      .then(res => res.data)
      .catch(err => err)
  },

  // 学生查看自己文章信息
  getMyArticles: () => {
    return http.get(baseUrl + 'stuGetMyArticles')
      .then(res => res.data)
      .catch(err => err)
  },

  // 学生查看自己的回答
  getMyQuestions: () => {
    return http.post(baseUrl + 'stuGetMyQuestions')
      .then(res => res.data)
      .catch(err => err)
  },
}