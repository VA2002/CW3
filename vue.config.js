module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/CW3/' : '/',
  transpileDependencies: [
    'vue-echarts',
    'resize-detector'
  ],
  pluginOptions: {
    webpackBundleAnalyzer: {
      openAnalyzer: false
    }
  },
  chainWebpack: config => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        // modify the options...
        return options
      })
  }
}
