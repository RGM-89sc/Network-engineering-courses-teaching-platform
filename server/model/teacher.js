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
    type: String
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
  }
});

module.exports = mongoose.model('Teacher', tchSchema);