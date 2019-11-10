import http from '../../http'
import config from '../../config/index'
const baseUrl = config.apiBaseUrl

export const QaProvider = {
  uploadQaQuestion: (payload) => {
    return http.post(baseUrl + 'uploadQaQuestion', payload)
      .then(res => res)
      .catch(err => err)
  },

  delQaQuestion: (payload) => {
    return http.post(baseUrl + 'delQaQuestion', payload)
      .then(res => res)
      .catch(err => err)
  },

  modifyQaQuestion: (payload) => {
    return http.post(baseUrl + 'modifyQaQuestion', payload)
      .then(res => res)
      .catch(err => err)
  },

  deleteQuestionReply: (payload) => {
    return http.post(baseUrl + 'deleteQuestionReply', payload)
      .then(res => res)
      .catch(err => err)
  },

  uploadQaImage: (payload) => {
    return http.post(baseUrl + 'uploadQaImage', payload)
      .then(res => res)
      .catch(err => err)
  },

  getQaQuestion: (payload) => {
    return http.post(baseUrl + 'getQaQuestion', payload)
      .then(res => res)
      .catch(err => err)
  },

  updateQuestionReplys: (payload) => {
    return http.post(baseUrl + 'updateQuestionReplys', payload)
      .then(res => res)
      .catch(err => err)
  },
  
  getQaQuestions: () => {
    return http.get(baseUrl + 'getQaQuestions')
      .then(res => res)
      .catch(err => err)
  },
}