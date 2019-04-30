const mongoose = require('mongoose');

const coursesSchema = new mongoose.Schema({
  courseID: {
    type: String,
    require: true,
    unique: true,
  },
  coursename: {
    type: String,
    require: true,
  },
  tchID: {
    type: String,
    require: true,
  },
  cover: {
    type: String,
    require: true
  },
  stus: [
    {
      id: String
    }
  ],
  content: [  // 课程内容，一个元素为一个章节
    {
      id: Number,  // 编号
      stamp: String,  // 章节名称
      part: [
        {
          id: Number,  // 编号
          title: String,  // 单元名称
          content: String  // 内容
        }
      ]
    }
  ],
  created: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Courses', coursesSchema);