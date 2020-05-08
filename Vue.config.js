module.exports = {
  publicPath: './',
  chainWebpack: config => {
    // 生产环境配置
    config.when(process.env.NODE_ENV === 'production', config => {
      // 引用不同的main.js
      config.entry('app').clear().add('./src/main-prod.js')
      // 通过externals加载外部CDN资源
      config.set('externals', {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        axios: 'axios',
        lodash: '_',
        echarts: 'echarts',
        nprogress: 'NProgress',
        'vue-quill-editor': 'VueQuillEditor'
      })
      // 根据不同环境选择是否使用CDN
      config.plugin('html').tap(args => {
        args[0].isProd = true
        return args
      })
    })
    // 开发环境配置
    config.when(process.env.NODE_ENV === 'development', config => {
      config.entry('app').clear().add('./src/main-dev.js')
      config.plugin('html').tap(args => {
        args[0].isProd = false
        return args
      })
    })
  }
}
