module.exports = {
  lintOnSave: false, //禁用eslint
  devServer: {
    port: 8082,
    index: 'index.html',
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:9000',
        ws: true,
        changeOrigin: true,
        // pathRewrite: {
        //   '^/api/': '/api/'
        // }
      },
      '/static': {
        target: 'http://127.0.0.1:9000',
        ws: true,
        changeOrigin: true,
      }
    }
  },
  baseUrl: '/d/',
  // 向所有 Sass 样式传入共享的全局变量
  css: {
    loaderOptions: {
      // 给 sass-loader 传递选项
      sass: {
        // @/ 是 src/ 的别名
        // 所以这里假设你有 `src/variables.scss` 这个文件
        //data: `@import "@/variables.scss";`
      }
    }
  }
};
