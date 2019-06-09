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
    //提交问题
    async uploadQuestion(ctx) {
        const {
            title,
            content,
            tag,
            questionerAvatar,
            questionerName,
            questionerID,
            questionerType
        } = ctx.request.body;
        const qaID = uuidV4().split('-').join('')
        await db.qa.create({
            qaID,
            title,
            content,
            tag,
            questionerAvatar,
            questionerName,
            questionerID,
            questionerType
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
    //删除问题
    async deleteQuestion(ctx) {
        const {
            qaID
        } = ctx.request.body;

        await db.qa.deleteOne({
            qaID
        }).then((docs) => {

        }).catch((err) => {
            ctx.body = {
                code: -1,
                errMsg: err.message
            }
        })
    },
    async modifyQuestion() {
        const {
            tag,
            qaID
        } = ctx.request.body;

        await db.qa.updateOne({
            tag,
            qaID
        }, {
            tag,
            replys
        }).then((docs) => {
            ctx.body = {
                code: 1,

            }
        })
    },
    //删除问题的回复 or 回答
    async deleteQuestionReply() {

    },
    //加载全部问题
    async loadQuestions(ctx) {
        await db.qa.find(

        ).then((docs) => {

            ctx.body = {
                data: omit(docs, ['_id', '__v'], true),
                code: 1
            }
        }).catch((err) => {
            ctx.body = {
                data: err.message,
                code: -1
            }
        })
    },
    //加载单个问题
    async loadQuestion(ctx) {
        const {
            qaID
        } = ctx.request.body;

        await db.qa.findOne({
            qaID
        }).then((docs) => {
            ctx.body = {
                data: docs,
                code: 1
            }
        }).catch((err) => {
            ctx.body = {
                data: err.message,
                code: -1
            }
        })
    },
    //更新问题的回复
    async updateQuestionReplys(ctx) {
        const {
            qaID,
            reply
        } = ctx.request.body;

        await db.qa.updateOne({
            qaID
        }, {
            $push: {
                ['replys']: reply
            }
        }).then((docs) => {
            ctx.body = {
                data: docs,
                code: 1
            }
        }).catch((err) => {
            ctx.body = {
                data: err.message,
                code: -1
            }
        });
        //更新回答者的回答

        //    const replyerID = reply.replyerID;
        //    await db.teacher.UpdateOne({
        //     id:replyerID
        //    },{

        //    });
    },
    //上传问题富文本图片
    async uploadQaImage(ctx) {
        const {
            questionerID
        } = ctx.request.query;
        const file = ctx.request.files.upload;
        const fpath = file.path;
        const extname = path.extname(file.name);
        const imgUUID = uuidV4();
        const fname = `question_${questionerID}_${imgUUID}${extname}`;
        setTimeout(() => {
            fs.renameSync(fpath, path.join(__dirname, `../public/static/img/qa/${fname}`))
        }, 0)

        ctx.body = {
            uploaded: 1, //写死的
            fileName: fname, //图片名
            url: serverURL + '/static/img/qa/' + fname //上传服务器的图片的url
        }
    }

}