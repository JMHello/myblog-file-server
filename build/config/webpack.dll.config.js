const webpack = require('webpack');
const path = require('path')
const CompressionWebpackPlugin = require("compression-webpack-plugin")
const CleanWebpackPlugin = require("clean-webpack-plugin")

module.exports = {
  mode: 'production',
  entry: {
    react: [
      'react', 'react-dom', 'react-router', 'react-router-dom'
    ],
    redux: [
      'redux', 'react-redux', 'redux-saga'
    ],
    axios: [
      'axios'
    ],
    other: [
      'dateformat', 'js-cookie'
    ]
  },
  output: {
    publicPath: '/',
    path: path.resolve(process.cwd(), './dist'),
    filename: 'lib/' + '[name].js',
    library: '[name]',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  plugins: [  
    new webpack.DllPlugin({
      context: process.cwd(), // 'E:\\projectAndNote\\blog\\myblog'
      path: path.resolve(process.cwd(), './dist/lib/[name].manifest.json'), // 本Dll文件中各模块的索引，供DllReferencePlugin读取使用
      name: '[name]'
    }),
    new CompressionWebpackPlugin({
      test: /\.js$|\.css$|\.html$/,
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      // 只处理大于这个字节的文件
      threshold: 10240,
      minRatio: 0.8
    }),

    // 清除
    new CleanWebpackPlugin(['dist'],  {
      root: path.resolve(process.cwd(), './'),
      verbose: true,
      dry: false
    }),

    // 定义环境
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ]
};
