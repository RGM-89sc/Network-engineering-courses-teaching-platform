const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  courseID: {
    type: String,
    require: true,
  },
  examID: {
    type: String,
    require: true,
    unique: true
  },
  examName: {
    type: String,
    require: true,
  },
  tchID: {
    type: String,
    require: true,
  },
  choiceQuestions: [
    {
      id: Number,
      questionType: String,
      problem: String,
      detail: {
        imgs: [
          {
            name: String,
            url: String
          }
        ],
        selections: [
          {
            id: String,
            content: String,
            isAnswer: Boolean
          }
        ],
      }
    }
  ],
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: {
    type: Date,
    default: Date.now
  },
  examTiming: {  // 考试时长，分钟为单位
    type: Number,
    default: 60
  },
  created: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Exam', examSchema);