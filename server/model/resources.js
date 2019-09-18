const mongoose = require('mongoose');

const resourcesSchema = new mongoose.Schema({
  classify: {
    type: String,
    require: true,
  },
  filename: {
    type: String,
    require: true,
    unique: true
  },
  courseID: {
    type: String
  },
  created: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Resources', resourcesSchema);