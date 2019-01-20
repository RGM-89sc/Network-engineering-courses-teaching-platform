/** 去除对象中不需要的属性
 * @param {Object} obj 源对象
 * @param {Array} uselessKeys 字符串数组，需要排除的键
 * @param {Boolean} deepCopy 是否深复制
 * @return {Obj} 新对象
 */

module.exports = (obj, uselessKeys, deepCopy = false) => {
  let newObj;

  if (deepCopy) { // 深拷贝，对象中的方法无法被保留
    newObj = JSON.parse(JSON.stringify(obj));
  } else { // 浅拷贝，对象中的方法能保留
    newObj = Object.assign({}, obj);
  }

  uselessKeys.forEach((key) => {
    delete newObj[key];
  });

  return newObj;
};