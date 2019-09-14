const fs = require('fs');
const path = require('path');
const uuidV4 = require('uuid/v4');
const db = require('../tools/mountModel');
const {
    serverURL
} = require('../config.js');
const omit = require('../tools/omitObjProp');
const {
    decodeFilename,
    encodeFilename
} = require('../tools/filenameTools');

module.exports = {
    //获取文章列表
    async getTechInfoList(ctx) {
        await db.TechInfo.find().then(docs => {
            ctx.body = {
                data: docs,
                code: 1
            }
        }).catch(err => {
            ctx.body = {
                errMsg: err.message,
                code: -1
            }
        });
    },
    //获取单个文章
    async getTechInfo(ctx) {
        const {
            articleID
        } = ctx.request.body;

        await db.TechInfo.findOne({
            articleID
        }).then(docs => {
            ctx.body = {
                data: docs,
                code: 1
            }
        }).catch(err => {
            ctx.body = {
                code: -1,
                errMsg: err.message,
            }
        })
    },
    //上传文章
    async postTechInfo(ctx) {
        const {
            authorName,
            authorID,
            tags,
            content,
            title,
            goods,
            views
        } = ctx.request.body;
        const articleID = uuidV4().split('-').join('')
        await db.TechInfo.create({
            authorName,
            authorID,
            articleID,
            tags,
            content,
            title,
            goods,
            views,
            posterURL
        }).then((docs) => {
            ctx.body = {
                data: docs,
                code: 1

            }
        }).catch((err) => {
            console.log(err);
            ctx.body = {
                code: -1,
                errMsg: err.message
            }
        });
    },
    //删除文章
    async deleteTechInfo(ctx) {
        const {
            articleID,
            authorID
        } = ctx.request.body;
        await db.TechInfo.deleteOne({
            articleID,
            authorID
        }).then(docs => {
            ctx.body = {
                data: docs,
                code: 1
            }
        }).catch(err => {
            console.log(err);
            ctx.body = {
                code: -1,
                errMsg: err.message
            }
        })
    },
    //上传图片
    async postImage() {
        const {
            authorID

        } = ctx.request.query;
        const file = ctx.request.files.upload;
        const fpath = file.path;
        const extname = path.extname(file.name);
        const imgUUID = uuidV4();
        const fname = `techInfo_${authorID}_${imgUUID}${extname}`;
        setTimeout(() => {
            fs.renameSync(fpath, path.join(__dirname, `../public/static/img/techInfo/${fname}`))
        }, 0)

        ctx.body = {
            uploaded: 1, //写死的
            fileName: fname, //图片名
            url: serverURL + '/static/img/techInfo/' + fname //上传服务器的图片的url
        }
    }
}