import http from '../../http'
import config from '../../config/index'
const baseUrl = config.apiBaseUrl

export const ArticleProvider = {
  // 获取文章
  getArticle: (payload) => {
    return http.post(baseUrl + 'getArticle', payload)
      .then(res => res)
      .catch(err => err)
  },

  // 上传文章
  postArticle: (payload) => {
    return http.post(baseUrl + 'postArticle', payload)
      .then(res => res)
      .catch(err => err)
  },

  // 上传文章图片
  postArticleImage: (payload) => {
    return http.post(baseUrl + 'postArticleImage', payload)
      .then(res => res)
      .catch(err => err)
  },

  // 删除文章
  delArticle: (payload) => {
    return http.post(baseUrl + 'delArticle', payload)
      .then(res => res)
      .catch(err => err)
  },

  // 获取 新闻 或者 技术前沿的文章
  getArticles: (payload) => {
    return http.post(baseUrl + 'getArticles', payload)
      .then(res => res)
      .catch(err => err)
  },

  getQaQuestion: (payload) => {
    return http.post(baseUrl + 'getQaQuestion', payload)
      .then(res => res)
      .catch(err => err)
  },

  // 获取全部文章
  getAllArticles: (payload) => {
    return http.post(baseUrl + 'getAllArticles', payload)
      .then(res => res)
      .catch(err => err)
  },
  
  // 更新文章信息
  updateArticleInfo: (payload) => {
    return http.post(baseUrl + 'updateArticleInfo', payload)
      .then(res => res)
      .catch(err => err)
  },
}