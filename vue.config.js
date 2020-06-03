'use strict'
const path = require('path')
const defaultSettings = require('./src/settings.js')

function resolve(dir) {
  return path.join(__dirname, dir)
}

// 导入compression-webpack-plugin
const CompressionWebpackPlugin = require('compression-webpack-plugin')
// 定义压缩文件类型
const productionGzipExtensions = ['js', 'css']

const name = defaultSettings.title // page title

const isProd = process.env.NODE_ENV === 'production'

// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, Mac: sudo npm run
// You can change the port by the following methods:
// port = 9528 npm run dev OR npm run dev --port = 9528
const port = process.env.port || process.env.npm_config_port || 9528 // dev port

const externals = {
  vue: 'Vue',
  'vue-router': 'VueRouter',
  vuex: 'Vuex',
  axios: 'axios',
  'element-ui': 'ELEMENT'
}
// cdn
const cdn = {
  // 开发环境
  dev: {
    css: ['https://cdn.bootcss.com/element-ui/2.13.0/theme-chalk/index.css'],
    js: ['https://cdn.bootcss.com/babel-polyfill/7.8.3/polyfill.min.js']
  },
  // 生产环境
  build: {
    css: ['https://cdn.bootcss.com/element-ui/2.13.0/theme-chalk/index.css'],
    js: [
      'https://cdn.bootcss.com/babel-polyfill/7.8.3/polyfill.min.js',
      'https://cdn.bootcss.com/vue/2.6.11/vue.min.js',
      'https://cdn.bootcss.com/vue-router/3.1.3/vue-router.min.js',
      'https://cdn.bootcss.com/axios/0.19.2/axios.min.js',
      'https://cdn.bootcss.com/vuex/3.1.2/vuex.min.js',
      'https://cdn.bootcss.com/crypto-js/4.0.0/crypto-js.min.js',
      'https://cdn.bootcss.com/element-ui/2.13.0/index.js'
    ]
  }
}

// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
  /**
   * You will need to set publicPath if you plan to deploy your site under a sub path,
   * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
   * then publicPath should be set to "/bar/".
   * In most cases please use '/' !!!
   * Detail: https://cli.vuejs.org/config/#publicpath
   */
  publicPath: './', //  基本路径
  outputDir: 'dist', //  构建时的输出目录
  assetsDir: 'static', //  放置静态资源的目录
  // lintOnSave: process.env.NODE_ENV === 'development', //  是否在保存的时候使用 `eslint-loader` 进行检查
  lintOnSave: false, //  是否在保存的时候使用 `eslint-loader` 进行检查
  productionSourceMap: false, //  是否为生产环境构建生成 source map
  devServer: { // 配置 webpack-dev-server 行为
    port: port,
    open: false,
    overlay: {
      warnings: false,
      errors: true
    },
    before: require('./mock/mock-server.js'),
    proxy: {
      '/sunsoft-cms': {
        target: 'https://test.ygzykj.com:1906/sunsoft-cms',
        changeOrigin: true,
        pathRewrite: { '^/sunsoft-cms': '' }
      }
    }
  },
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: name,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    },
    plugins: [
      new CompressionWebpackPlugin({
        // 配置参数详解：
        // filename： 目标资源名称。 [file] 会被替换成原始资源。[path] 会被替换成原始资源的路径， [query] 会被替换成查询字符串。默认值是 "[path].gz[query]"。
        // algorithm： 可以是 function(buf, callback) 或者字符串。对于字符串来说依照 zlib 的算法(或者 zopfli 的算法)。默认值是 "gzip"。
        // test： 所有匹配该正则的资源都会被处理。默认值是全部资源。
        // threshold： 只有大小大于该值的资源会被处理。单位是 bytes。默认值是 0。
        // minRatio： 只有压缩率小于这个值的资源才会被处理。默认值是 0.8。
        filename: '[path].gz[query]',
        algorithm: 'gzip',
        test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'), // 匹配文件名
        threshold: 10240, // 对10K以上的数据进行压缩
        minRatio: 0.8,
        deleteOriginalAssets: false// 是否删除源文件
      })
    ],
    externals: isProd ? externals : ''
  },
  chainWebpack(config) {
    // 移除 preload 插件
    config.plugins.delete('preload')
    // 移除 prefetch 插件
    config.plugins.delete('prefetch')

    /**
     * 添加CDN参数到htmlWebpackPlugin配置中， 详见public/index.html 修改
     */
    config.plugin('html').tap(args => {
      if (isProd) {
        args[0].cdn = cdn.build
      } else {
        args[0].cdn = cdn.dev
      }
      return args
    })

    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    // set preserveWhitespace
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true
        return options
      })
      .end()

    config
    // https://webpack.js.org/configuration/devtool/#development
      .when(process.env.NODE_ENV === 'development',
        config => config.devtool('cheap-source-map')
      )

    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
            // `runtime` must same as runtimeChunk name. default is `runtime`
              inline: /runtime\..*\.js$/
            }])
            .end()
          config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial' // only package third parties that are initially dependent
                },
                /* elementUI: {
                  name: 'chunk-elementUI', // split elementUI into a single package
                  priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                  test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
                }, */
                commons: {
                  name: 'chunk-commons',
                  test: resolve('src/components'), // can customize your rules
                  minChunks: 3, //  minimum common number
                  priority: 5,
                  reuseExistingChunk: true
                }
              }
            })
          config.optimization.runtimeChunk('single')
        }
      )
  },
  css: {
    loaderOptions: {
      // 给 sass-loader 传递选项
      sass: {
        // prependData: `@import "@/styles/var.scss";`
        data: `@import "~@/styles/var.scss";`
      }
    }
  }
}
