const fs = require('fs');
const path = require('path');

const modelPath = path.join(__dirname, '../model/');
const db = {};

fs.readdirSync(modelPath).forEach(fileName => {
  const extname = path.extname(fileName);
  if (extname.toLowerCase() === '.js') {
    db[fileName.replace(extname, '')] = require(path.join(modelPath, fileName));
  }
});

module.exports = db;