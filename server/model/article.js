const mongoose = require('mongoose');
    //不存储字段，从用户（教师、学生）集合获取
    // avatarURL: {
    //     type: String,
    //     default: '/static/img/avatar/default.png'
    // },
    // authorName: {
    //     type: String,
    //     required: true
    // },
const articleSchema = new mongoose.Schema({
    articleID: {
        type: String,
        required: true,
        unique: true
    },
    authorID: {
        type: String,
        required: true
    },
    authorType: {
        type: String,
        required: true
    },
    articleType: {
        type: String,
        required: true,
        default: 'news'
    },
    tags: {
        type: Array,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    posterURL: {
        type: String,
        required: true
    },
    views: {
        type: Number,
        default: 0
    },
    goods: [
        {
            userID: String,
            userName: String,
            userType: Number,
        }
    ],
    summary: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    comments: [{
        id: String,
        commenterAvatar: String,
        commenterID: String,
        commenterName: String,
        content: String,
        created: String,
        likesN: Number,
        replys: [{
            id: String,
            replyerAvatar: String,
            replyerName: String,
            replyerID: String,
            content: String,
            created: String,
            likesN: Number,
        }]
    }]
});

articleSchema.index({ 
  title: 'text',
  content: 'text',
  summary: 'text',
  'comments.content': 'text',
  'comments.replys.content': 'text'
})

module.exports = mongoose.model('article', articleSchema)