const mongoose = require('mongoose');

const resourcesSchema = new mongoose.Schema({
  classify: {
    type: String,
    require: true,
  },
  filename: {
    type: String,
    require: true,
  },
  courseID: {
    type: String
  },
  created: {
    type: Date,
    default: Date.now
  },
  userID: {
    type: String,
  }
});

resourcesSchema.index({ 
  filename: 'text',
})

module.exports = mongoose.model('Resources', resourcesSchema);