const path = require('path');
const fs = require('fs');

module.exports = () => {
  if (!fs.existsSync(path.join(__dirname, '../public/static'))) {
    fs.mkdirSync(path.join(__dirname, '../public/static'));
  }

  if (!fs.existsSync(path.join(__dirname, '../public/static/courseware'))) {
    fs.mkdirSync(path.join(__dirname, '../public/static/courseware'));
  }

  if (!fs.existsSync(path.join(__dirname, '../public/static/img'))) {
    fs.mkdirSync(path.join(__dirname, '../public/static/img'));
  }

  if (!fs.existsSync(path.join(__dirname, '../public/static/software'))) {
    fs.mkdirSync(path.join(__dirname, '../public/static/software'));
  }

  if (!fs.existsSync(path.join(__dirname, '../public/static/video'))) {
    fs.mkdirSync(path.join(__dirname, '../public/static/video'));
  }


  if (!fs.existsSync(path.join(__dirname, '../public/static/img/avatar'))) {
    fs.mkdirSync(path.join(__dirname, '../public/static/img/avatar'));
  }

  if (!fs.existsSync(path.join(__dirname, '../public/static/img/courses'))) {
    fs.mkdirSync(path.join(__dirname, '../public/static/img/courses'));
  }

  if (!fs.existsSync(path.join(__dirname, '../public/static/img/exams'))) {
    fs.mkdirSync(path.join(__dirname, '../public/static/img/exams'));
  }

  if (!fs.existsSync(path.join(__dirname, '../public/static/img/exercises'))) {
    fs.mkdirSync(path.join(__dirname, '../public/static/img/exercises'));
  }
  const qaImageStoreRelativeURL = '../public/static/img/qa';
  if (!fs.existsSync(path.join(__dirname, qaImageStoreRelativeURL))) {
    fs.mkdirSync(path.join(__dirname, qaImageStoreRelativeURL));

  }

  const newsImageStoreRelativeURL = '../public/static/img/news';
  if (!fs.existsSync(path.join(__dirname, newsImageStoreRelativeURL))) {
    fs.mkdirSync(path.join(__dirname, newsImageStoreRelativeURL));

  }

  const techInfoImageStoreRelativeURL = '../public/static/img/techInfo';
  if (!fs.existsSync(path.join(__dirname, techInfoImageStoreRelativeURL))) {
    fs.mkdirSync(path.join(__dirname, techInfoImageStoreRelativeURL));

  }
};