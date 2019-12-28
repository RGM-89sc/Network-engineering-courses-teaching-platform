const mongoose = require('mongoose');
const log4js = require('log4js');

const logger = log4js.getLogger();
logger.level = 'debug';

module.exports = async config => {
  await mongoose.connect(config.url, config.options)
    .then(() => {
      logger.info('MongoDB connection successful');
    })
    .catch(err => {
      logger.fatal(err);
    });
};