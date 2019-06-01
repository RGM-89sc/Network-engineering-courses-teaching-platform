const path = require('path');
const CKEditorWebpackPlugin = require('@ckeditor/ckeditor5-dev-webpack-plugin');
const { styles } = require('@ckeditor/ckeditor5-dev-utils');
const pxtorem = require('postcss-pxtorem');

// ckeditor5的主题设置，源码中styles.getPostCssConfig返回一个只有一个plugins属性的对象
// Various modules in the CKEditor source code import .css files.
// These files must be transpiled using PostCSS in order to load properly.
const postCssConfig = styles.getPostCssConfig({
  themeImporter: {
    themePath: require.resolve('@ckeditor/ckeditor5-theme-lark')
  },
  minify: true,
});


module.exports = {
  lintOnSave: false, //禁用eslint
  devServer: {
    disableHostCheck: true,
    port: 8090,
    index: 'index.html',
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:9000',
        ws: true,
        changeOrigin: true,
      },
      '/static': {
        target: 'http://127.0.0.1:9000',
        ws: true,
        changeOrigin: true,
      }
    }
  },
  publicPath: '/m/',
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
      postcss: postCssConfig
    }
  },

  chainWebpack: config => {
    // Vue CLI would normally use its own loader to load .svg files. The icons used by
    // CKEditor should be loaded using raw-loader instead.

    // Get the default rule for *.svg files.
    const svgRule = config.module.rule('svg');

    // Then you can either:
    //
    // * clear all loaders for existing 'svg' rule:
    //
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
      
      
    // 自定义svg icon
    config.module
      .rule('md-custom-svg-icons')
      .test(/\.svg$/i)
      .include
      .add(path.resolve(__dirname, 'src/assets/svg/'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader');
    

    // pxtorem只对mand的组件有效
    config.module
      .rule('md-postcss')
      .test(/mand-mobile.*\.css$/)
      .use('css-loader')
      .loader('postcss-loader')
      .options({
        plugins: [
          pxtorem({
            rootValue: 30, // 转换基准：1rem = 30px
            minPixelValue: 2,
            propList: ['*'],
            selectorBlackList: []
          })
        ]
      });
  }
};
