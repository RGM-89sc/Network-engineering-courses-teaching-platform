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
  study: [
    {
      courseID: String,
      progress: {
        type: Number,
        default: 0
      }
    }
  ],
  created: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Student', stuSchema);