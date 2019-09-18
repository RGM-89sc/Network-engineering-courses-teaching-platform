const fs = require('fs');
const path = require('path');
const db = require('../tools/mountModel');
const omit = require('../tools/omitObjProp');
const {
  decodeFilename,
  encodeFilename
} = require('../tools/filenameTools');

module.exports = {
  async uploadResources(ctx) {
    const {
      classify,
      courseID
    } = ctx.request.body;
    const file = ctx.request.files.file;
    const filename = encodeFilename(file.name);
    const filepath = file.path;
    const classifyPath = classify === 'courseware' ? `/${courseID}` : '';
    if (await db.resources.findOne({
        classify,
        filename
      })) {
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
      return ctx.body = {
        code: 0,
        info: `${decodeFilename(filename)}已存在`
      };
    }

    await db.resources.create({
        classify,
        filename,
        courseID
      })
      .then(docs => {
        const URI = `../public/static/${classify}${classifyPath}`;
        if (!fs.existsSync(path.join(__dirname, URI))) {
          fs.mkdirSync(path.join(__dirname, URI));
        }
        fs.renameSync(filepath, path.join(__dirname, `${URI}/${filename}`));
        return ctx.body = {
          code: 1
        };
      })
      .catch(err => {
        ctx.body = {
          code: -1,
          errMsg: err.message
        };
      });
  },

  async getResources(ctx) {
    const {
      classify,
      skip,
      limit,
      courseID
    } = ctx.request.body;
    const query = {};
    query.classify = classify;

    if (classify === 'courseware') {
      query.courseID = courseID;
    }
    await db.resources.find(query, {
        _id: 0,
        __v: 0
      }).sort({
        created: -1
      }).skip(parseInt(skip)).limit(parseInt(limit))
      .then(docs => {
        return ctx.body = {
          code: 1,
          data: docs
        }
      })
      .catch(err => {
        return ctx.body = {
          code: -1,
          errMsg: err.message
        }
      });
  },

  async delResource(ctx) {
    let {
      classify,
      filename
    } = ctx.request.body;
    filename = encodeFilename(filename);

    await db.resources.deleteOne({
        classify,
        filename
      })
      .then(docs => {
        const filepath = path.join(__dirname, `../public/static/${classify}/${filename}`);
        if (fs.existsSync(filepath)) {
          fs.unlinkSync(filepath);
        }

        return ctx.body = {
          code: 1,
          data: docs
        };
      })
      .catch(err => {
        return ctx.body = {
          code: -1,
          errMsg: err.message
        };
      });
  }
};