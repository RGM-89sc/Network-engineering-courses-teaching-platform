const mongoose = require('mongoose');
const log4js = require('log4js');

const logger = log4js.getLogger();
logger.level = 'debug';

module.exports = async (url, options) => {
  await mongoose.connect(url, options)
    .then(() => {
      logger.info('MongoDB connection successful');
    })
    .catch(err => {
      logger.fatal(err);
    });
};