import http from '../../../../http'
import config from '../../../../config/index'
const baseUrl = config.apiBaseUrl

export const TeacherProvider = {
  // 获取教师信息
  getInfoById: (payload) => {
    return http.post(baseUrl + 'getTchInfoById', payload)
      .then(res => res.data)
      .catch(err => err)
  },

  // 教师注册
  register: (payload) => {
    return http.post(baseUrl + 'tchRegister', payload)
      .then(res => res.data)
      .catch(err => err)
  },

  // 教师登录
  login: (payload) => {
    return http.post(baseUrl + 'tchLogin', payload)
      .then(res => res.data)
      .catch(err => err)
  },

  // 教师退出登录
  logout: () => {
    return http.get(baseUrl + 'tchLogout')
      .then(res => res.data)
      .catch(err => err)
  },

  // 教师修改学生信息
  updateStuInfo: (payload) => {
    return http.post(baseUrl + 'updateStuInfo', payload)
      .then(res => res.data)
      .catch(err => err)
  },

  // 教师更改头像
  changeAvatar: (payload) => {
    return http.post(baseUrl + 'tchChangeAvatar', payload)
      .then(res => res.data)
      .catch(err => err)
  },

  // 教师修改密码
  changePW: (payload) => {
    return http.post(baseUrl + 'tchChangePW', payload)
      .then(res => res.data)
      .catch(err => err)
  },

  // 教师查看自己的课程信息
  getMyCourses: () => {
    return http.get(baseUrl + 'tchGetMyCourses')
      .then(res => res)
      .catch(err => err)
  },

  // 重置某个学生的某个考试
  resetStuExamScore: (payload) => {
    return http.post(baseUrl + 'resetStuExamScore', payload)
      .then(res => res.data)
      .catch(err => err)
  },

  // 教师查看自己发布的文章
  getMyArticles: () => {
    return http.get(baseUrl + 'tchGetMyArticles')
      .then(res => res)
      .catch(err => err)
  },
}