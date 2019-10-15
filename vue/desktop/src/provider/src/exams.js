import http from '../../http'
import config from '../../config/index'
const baseUrl = config.apiBaseUrl

export const ExamsProvider = {
  // 创建考试
  addExamPaper: (payload) => {
    return http.post(baseUrl + 'addExamPaper', payload)
      .then(res => res)
      .catch(err => err)
  },

  // 设置考试
  updateExamPaper: (payload) => {
    return http.post(baseUrl + 'updateExamPaper', payload)
      .then(res => res)
      .catch(err => err)
  },

  // 获取某一课程的某一考试
  getExamPaper: (payload) => {
    return http.post(baseUrl + 'getExamPaper', payload)
      .then(res => res)
      .catch(err => err)
  },

  // 获取某一课程的所有考试
  getExamPapers: (payload) => {
    return http.post(baseUrl + 'getExamPapers', payload)
      .then(res => res)
      .catch(err => err)
  },

  // 删除考试
  delExamPaper: (payload) => {
    return http.post(baseUrl + 'delExamPaper', payload)
      .then(res => res)
      .catch(err => err)
  },

  // 上传题目的配图
  uploadQuestionImg: (payload) => {
    return http.post(baseUrl + 'uploadExamQuestionImg', payload)
      .then(res => res)
      .catch(err => err)
  },

  // 删除上传的题目配图
  delQuestionImg: (payload) => {
    return http.post(baseUrl + 'delExamQuestionImg', payload)
      .then(res => res)
      .catch(err => err)
  },

  // 删除上传的题目所有配图
  updatePart: (payload) => {
    return http.post(baseUrl + 'delExamQuestionImgs', payload)
      .then(res => res)
      .catch(err => err)
  },

  // 考试评分
  handIn: (payload) => {
    return http.post(baseUrl + 'handIn', payload)
      .then(res => res)
      .catch(err => err)
  },

  // 检查是否可以进入考试
  checkStuCanEnterExam: (payload) => {
    return http.post(baseUrl + 'checkStuCanEnterExam', payload)
      .then(res => res)
      .catch(err => err)
  },
}