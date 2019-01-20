const fs = require('fs');
const path = require('path');
const log4js = require('log4js');

const logger = log4js.getLogger();
logger.level = 'debug';

// 把接口文件的文件名作为app[property]中的属性名，存储该接口文件
module.exports = (app, { property = 'controllers', folder = path.join(__dirname, '../controller/') } = {}) => {
  if (!app) {
    logger.fatal('初始化接口时缺少参数app！');
  }

  if (Object.keys(app).includes(property)) {
    logger.fatal(`Koa实例app中已存在属性${property}！`);
  }

  let controllers = {};

  fs.readdirSync(folder).forEach(fileName => {
    const extname = path.extname(fileName);
    if (extname.toLowerCase() === '.js') {
      controllers[fileName.replace(extname, '')] = require(path.join(folder, fileName));
    }
  });

  app[property] = controllers;
};