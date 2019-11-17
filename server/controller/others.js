const db = require('../tools/mountModel');

module.exports = {
  // 全文搜索
  async search(ctx) {
    const { searchKey } = ctx.request.body;

    let docs = {}
    const modules = [ 'article', 'courses', 'qa' ]
    let taskArr = []

    modules.forEach(module => {
      taskArr.push(new Promise((resolve, reject) => {
        db[module].find(
          { $text: { $search: searchKey || '' } },
          { score: { $meta: 'textScore' } }
        ).sort({ score: { $meta: 'textScore' } })
          .then(result => {
            docs[module] = result
            resolve(result)
          })
          .catch(e => {
            reject(e)
          })
      }))
    })

    await Promise.all(taskArr)
      .then(res => {
        return ctx.body = {
          data: docs,
          code: 1
        }
      })
      .catch(err => {
        return ctx.body = {
          errMsg: err.message,
          code: -1
        }
      })
  },
}