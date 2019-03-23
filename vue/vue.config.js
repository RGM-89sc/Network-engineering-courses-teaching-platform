const CKEditorWebpackPlugin = require('@ckeditor/ckeditor5-dev-webpack-plugin');
const { styles } = require('@ckeditor/ckeditor5-dev-utils');

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
  // css: {
  //   loaderOptions: {
  //     // 给 sass-loader 传递选项
  //     sass: {
  //       // @/ 是 src/ 的别名
  //       // 所以这里假设你有 `src/variables.scss` 这个文件
  //       //data: `@import "@/variables.scss";`
  //     }
  //   }
  // }
  transpileDependencies: [
    /ckeditor5-[^/\\]+[/\\]src[/\\].+\.js$/,
  ],

  configureWebpack: {
    plugins: [
      // CKEditor needs its own plugin to be built using webpack.
      new CKEditorWebpackPlugin({
        // See https://ckeditor.com/docs/ckeditor5/latest/features/ui-language.html
        language: 'zh-cn'
      })
    ]
  },

  css: {
    loaderOptions: {
      // Various modules in the CKEditor source code import .css files.
      // These files must be transpiled using PostCSS in order to load properly.
      postcss: styles.getPostCssConfig({
        themeImporter: {
          themePath: require.resolve('@ckeditor/ckeditor5-theme-lark')
        },
        minify: true
      })
    }
  },

  chainWebpack: config => {
    // Vue CLI would normally use its own loader to load .svg files. The icons used by
    // CKEditor should be loaded using raw-loader instead.

    // Get the default rule for *.svg files.
    const svgRule = config.module.rule('svg');

    // // Then you can either:
    // //
    // // * clear all loaders for existing 'svg' rule:
    // //
    svgRule.uses.clear();  // 一定选择这句要先清空规则，如果用这里的另一个方案就不行
    //
    // * or exclude ckeditor directory from node_modules:
    // svgRule.exclude.add(__dirname + '/node_modules/@ckeditor').end();

    // Add an entry for *.svg files belonging to CKEditor. You can either:
    //
    // * modify the existing 'svg' rule:
    //
    // svgRule.use( 'raw-loader' ).loader( 'raw-loader' );
    //
    // * or add a new one:
    config.module
      .rule('cke-svg')
      .test(/ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/)
      .use('raw-loader')
      .loader('raw-loader');
  }
};
