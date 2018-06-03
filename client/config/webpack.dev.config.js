const webpack = require('webpack')
const HtmlWebpackPlugin = require("html-webpack-plugin")
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const OpenBrowserWebpackPlugin  = require("open-browser-webpack-plugin")

const config = require('./webpack.base.config')
const port = require("../../config").server.clientPort

config.mode = 'development'

config.devtool = 'source-map'

/**
 * webpack-dev-middleware的配置
 index: [
 'react-hot-loader/patch',
 'webpack-hot-middleware/client',
 './client/views/index.jsx'
 ]
 */

config.entry = {
  index: [
    'webpack-dev-server/client?http://127.0.0.1:' + port,
    'webpack/hot/only-dev-server',
    'react-hot-loader/patch',
    './client/views/index.jsx'
  ],

  // lib: [
  //   'react',
  //   'react-dom',
  //   'react-router',
  //   'react-router-dom',
  //   'react-redux',
  //   'redux',
  //   'redux-saga'
  // ]
}

config.module.rules.push(
  {
    test: /\.css$/,
    use: ['style-loader', 'css-loader']
  }
)

// 定义环境
config.plugins.push(
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('development')
  })
)


config.plugins.push(
  new webpack.HotModuleReplacementPlugin()
)

// 当开启 HMR 的时候使用该插件会显示模块的相对路径，建议用于开发环境。
config.plugins.push(
  new webpack.NamedModulesPlugin()
)

config.plugins.push(
  new HtmlWebpackPlugin({
    template: './client/views/index.html',
    inject: true,
    hash: true,
    minify: {
      sortAttributes: true,
      removeComments: true,
      collapseWhitespace: true
    },
    filename: 'index.html'
  })
)

// config.plugins.push(
//   new webpack.DllReferencePlugin({
//     context: process.cwd(),
//     manifest: require('../../dist/lib/manifest.json')
//   })
// )

config.plugins.push(
  new OpenBrowserWebpackPlugin({
    url: `http://127.0.0.1:${port}/#/admin/login`
  })
)

config.plugins.push(
  new ProgressBarPlugin()
)

module.exports = config