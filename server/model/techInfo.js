const mongoose = require('mongoose');
const techSchema = new mongoose.Schema({
    articleID: {
        type: String,
        required: true,
        unique: true
    },
    authorName: {
        type: String,
        required: true
    },
    authorID: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
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
        required: true
    },
    goods: {
        type: Number,
        required: true
    },
    summary: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('tech', techSchema)