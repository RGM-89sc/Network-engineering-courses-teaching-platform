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
    type: String
  },
  major: {
    type: String
  },
  grade: {
    type: Number
  },
  sclass: {
    type: Number
  },
  avatar: {
    type: String,
    default: '/static/img/avatar/default.png'
  },
  created: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Student', stuSchema);