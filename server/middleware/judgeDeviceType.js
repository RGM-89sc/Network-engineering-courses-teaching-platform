const fs = require('fs');
const path = require('path');

module.exports = async (ctx, next) => {
  const url = ctx.request.url;
  const isApiUrl = /\/api\/.+/.test(url);
  const isResource = /.+\..+$/.test(url);
  if (!isApiUrl && !isResource) {
    const deviceAgent = ctx.headers["user-agent"].toLowerCase();
    const agentID = deviceAgent.match(/(iphone|ipod|ipad|android)/);
    let mark = 'd';
    if (agentID) {
      // console.log("手机访问" + url);
      mark = 'm';
    } else {
      // console.log("电脑访问" + url);
      mark = 'd';
    }

    // 当用户使用手机访问页面时，标记mark为m，使用电脑访问则置d。m需要加载m目录的index.html，同理d需要加载d目录的index.html
    try {
      const content = fs.readFileSync(path.join(__dirname, `../public/${mark}/index.html`), 'utf-8');
      ctx.response.status = 200;
      ctx.response.headers = {
        'Content-Type': 'text/html; charset=utf-8'
      };
      // mark为d时，应当判断当前url是否为m的url，若是，跳转为d的url
      // mark为m时，应当判断当前url是否为d的url，若是，跳转为m的url
      const urlReg = new RegExp(`\/(${mark === 'd' ? 'm' : 'd'})(\/(?:.+)?)?`);
      const match = url.match(urlReg);
      if (match) {
        ctx.response.redirect(`/${mark}${match[2] ? match[2] : ''}`);
      } else {
        ctx.response.body = content;
      }
    } catch (e) {
      ctx.response.status = 404;
    }
  }
  await next();
};