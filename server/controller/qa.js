const fs = require('fs');
const path = require('path');
const uuidV4 = require('uuid/v4');
const db = require('../tools/mountModel');
const {
    serverURL
} = require('../config.js');
module.exports = {
    //提交问题
    async uploadQaQuestion(ctx) {
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
        }).then(async docs => {
            //更新 user 的问题列表
            await db.student.updateOne({
                id: questionerID
            }, {
                $push: {
                    questions: {
                        qaID: docs.qaID,
                        title: docs.title,
                        created: docs.created,
                        questionerID: docs.questionerID
                    }
                }
            });
            ctx.body = {
                data: docs,
                code: 1
            }
        }).catch((err) => {
            ctx.body = {
                code: -1,
                errMsg: err.message
            }
        });
    },
    //删除问题
    async delQaQuestion(ctx) {
        const {
            qaID,
            questionerID
        } = ctx.request.body;
        if (questionerID !== ctx.state.user.id) {
            return ctx.body = {
                code: 0,
                info: '没有删除问题的权限！'
            }
        }


        await db.qa.deleteOne({
            qaID,
            questionerID
        }).then(async docs => {
            await db.student.updateOne({
                id: questionerID
            }, {
                $pull: {
                    questions: {
                        id: qaID
                    }
                }
            });
            return ctx.body = {
                code: 1,
                data: docs
            }
        }).catch((err) => {
            ctx.body = {
                code: -1,
                errMsg: err.message
            }
        })
    },
    //编辑问题
    async modifyQaQuestion(ctx) {
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
    async deleteQuestionReply(ctx) {

    },
    //加载全部问题
    async getQaQuestions(ctx) {
        await db.qa.find({}, {

        }, {
            _id: 0,
            __v: 0,
            content: 0,
            questionerAvatar: 0,
            content: 0,
            replys: 0
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
    //加载单个问题
    async getQaQuestion(ctx) {
        const {
            qaID
        } = ctx.request.body;

        await db.qa.findOne({
            qaID
        }, {
            _id: 0,
            __v: 0
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
            $inc: {
                replysLength: 1
            },
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
    },
    async getMyQuetions(ctx) {

    }
}