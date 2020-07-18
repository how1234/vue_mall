module.exports = {
  // 前端Server和接口代理
  devServer:{
    host:'localhost',
    port:8080,
    before: require('./mock'),
   
  },
  //替换loader
  chainWebpack: config => {
    const svgRule = config.module.rule('svg')

    // 清除已有的所有 loader。
    // 如果你不这样做，接下来的 loader 会附加在该规则现有的 loader 之后。
    svgRule.uses.clear()

    // 添加要替换的 loader
    svgRule
      .use('vue-svg-loader')
        .loader('vue-svg-loader')
  }
  // 项目的基本路径
  // publicPath:'/',
  // 项目的生成目录
  // outputDir:'',
  // 修改index.html的路径
  // indexPath:'demo.html',
  // 文件名是否需要hash
  // filenameHashing:true,
  // eslint语法检查，保存时使用
  // lintOnSave:true,
  // 是否启用sourceMap
  // productionSourceMap:true
}