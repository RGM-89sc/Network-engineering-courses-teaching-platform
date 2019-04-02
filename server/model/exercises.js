const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  courseID: {
    type: String,
    require: true,
  },
  exerciseID: {
    type: String,
    require: true,
    unique: true
  },
  exerciseName: {
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
        analyze: String
      }
    }
  ],
  created: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Exercise', exerciseSchema);