const mongoose = require('mongoose');

const stuSchema = new mongoose.Schema({
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
  major: {
    type: String,
    require: true,
  },
  grade: {
    type: Number,
    require: true,
  },
  sclass: {
    type: Number,
    require: true,
  },
  avatar: {
    type: String,
    default: '/static/img/avatar/default.png'
  },
  study: [{
    courseID: String,
    progress: {
      type: Number,
      default: 0
    },
    exams: [{
      examID: String,
      examScore: {
        type: Number,
        default: -1
      }
    }]
  }],
  created: {
    type: Date,
    default: Date.now
  },
  articles: [{
    authorID: String,
    articleID: String,
    type: String,
    title: String,
    created: Date
  }],
  //提出过的问题
  questions: [{
    qaID: String,
    title: String,
    created: Date,
    tags: Array,
    solved: Boolean
  }],
  //回答过的问题
  questionReplys: [{
    replyID: String,
    qaID: String,
    created: Date
  }],
  likes: [
    {
      articleID: {
        unique: true,
        type: String
      },
      articleType: String
    }
  ]
  // //  浏览过的文章
  // viewedArticles:[
  //   articleID: String
  // ],
  // //  点赞过的文章
  // goodArticles:[
  //   articleID: String
  // ]
});

module.exports = mongoose.model('Student', stuSchema);