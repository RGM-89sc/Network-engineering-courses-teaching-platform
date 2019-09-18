const mongoose = require('mongoose');
const articleSchema = new mongoose.Schema({
    articleID: {
        type: String,
        required: true
    },
    authorName: {
        type: String,
        required: true
    },
    authorID: {
        type: String,
        required: true
    },
    avatarURL: {
        type: String,
        default: '/static/img/avatar/default.png'
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
        type: Number
    },
    goods: {
        type: Number,
        required: true
    },
    summary: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('article', articleSchema)