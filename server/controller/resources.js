const fs = require('fs');
const path = require('path');
const db = require('../tools/mountModel');
const omit = require('../tools/omitObjProp');

function encodeFilename(filename) {
  return filename.replace('+', '%2B')
    .replace(' ', '-')
    .replace('/', '%2F')
    .replace('?', '%3F')
    .replace('#', '%23')
    .replace('&', '%26')
    .replace('=', '%3D');
}

function decodeFilename(filename) {
  return filename.replace('%2B', '+')
    .replace('%2F', '/')
    .replace('%3F', '?')
    .replace('%23', '#')
    .replace('%26', '&')
    .replace('%3D', '=');
}

module.exports = {
  async updateResources(ctx) {
    const { classify } = ctx.request.body;
    const file = ctx.request.files.file;
    const filename = encodeFilename(file.name);
    const filepath = file.path;

    if (await db.resources.findOne({ classify, filename })) {
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
      return ctx.body = {
        code: 0,
        info: `${decodeFilename(filename)}已存在`
      };
    }

    await db.resources.create({ classify, filename })
      .then(docs => {
        fs.renameSync(filepath, path.join(__dirname, `../public/static/${classify}/${filename}`));
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
    const { classify, skip, limit } = ctx.request.body;

    const query = {};
    if (classify !== 'all') {
      query.classify = classify;
    }

    await db.resources.find(query, { _id: 0, __v: 0 }).sort({ created: -1 }).skip(parseInt(skip)).limit(parseInt(limit))
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
    let { classify, filename } = ctx.request.body;
    filename = encodeFilename(filename);

    await db.resources.deleteOne({ classify, filename })
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