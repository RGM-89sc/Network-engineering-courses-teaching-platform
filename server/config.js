const port = 9000;

module.exports = {
  db: 'mongodb://admin:admin_123@39.108.52.7:27017/ncw',
  // 服务器端口
  port,
  // 服务器地址
  serverURL: `http://127.0.0.1:${port}`,
  // cookie有效期
  loginMaxAge: 1000 * 60 * 60 * 3,
  // 跨域白名单
  corsWhiteList: [
    'http://localhost:8080',
    'http://localhost:8081',
    'http://localhost:8082',
    'http://localhost:8083',
    'http://localhost:8084',
    'http://localhost:8085',
    'http://localhost:8086',
    'http://localhost:8087',
    'http://localhost:8088',
    'http://localhost:8089',
    'http://localhost:8090',
  ],

  defaultImageURL: '/static/img/avatar/default.png'
};