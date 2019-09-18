const mongoose = require('mongoose');

const tchSchema = new mongoose.Schema({
  id: {
    type: String,
    require: true,
    unique: true
  },
  username: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true
  },
  faculty: {
    type: String,
    require: true,
  },
  teaching: {
    type: Array,
    default: []
  },
  avatar: {
    type: String,
    default: '/static/img/avatar/default.png'
  },
  created: {
    type: Date,
    default: Date.now
  },
  articles: [{
    articleID: String,
    authorID: String,
    title: String,
    created: Date,
    articleType: String
  }],
  //回答过的问题
  questionReplys: [{
    qaID: String,
    created: Date
  }]
});

module.exports = mongoose.model('Teacher', tchSchema);