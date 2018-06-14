const path = require('path')
const webpack = require('webpack')
// const HtmlWebpackPlugin = require('html-webpack-plugin')
const HardSourceWebpackPlugin  = require("hard-source-webpack-plugin")
const ExtractTextWebpackPlugin = require("extract-text-webpack-plugin")
const autoprefixer = require('autoprefixer')
const precss = require('precss')
const postcsseasysprites = require('postcss-easysprites')
const common = require("../../config")

/**
 * 设置默认常用路径
 */
const srcDir = ''
// process.cwd() => 'E:\\projectAndNote\\blog\\myblog'
// 文件输出的地址
const assetsDir = path.resolve(process.cwd(), './dist')
// 生成JS的目录地址(默认:)
const jsDir = 'js/'

const cssDir = 'client/views/'

module.exports = {
  resolve: {
    extensions: [
      '.js',
      '.jsx',
      '.css'
    ],
    // 'E:\\projectAndNote\\blog\\myblog\\client\\node_modules'
    // modules: [ path.resolve(srcDir, 'node_modules') ]
  },
  // 文件输出接口
  output: {
    path: assetsDir,
    // filename: `${jsDir}/[name]-[chunkhash].js`,
    filename: jsDir + '[name].js',
    publicPath: common.publicPath
  },
  // 模块（一般是Loader）
  module: {
    rules: [
      {
        test: /\.css$/,
        include: [path.resolve(srcDir, cssDir)],
        use: ExtractTextWebpackPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                modules: true,
                camelCase: true,
                localIdentName: '[name]_[local]_[hash:base64:3]',
                importLoaders: 1,
                souceMap: true
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true,
                plugins: () => [
                  precss(),
                  autoprefixer({
                    browsers: ['last 3 version', 'ie >= 10']
                  }),
                  // 雪碧图
                  postcsseasysprites({
                    imagePath: '',
                    spritePath: '../dist/sprites'
                  })
                ]
              }
            }
          ]
        })
      },
      // 加另一个loader让其他不在指定文件夹中的css样式不再受到css-modules的影响
      {
        test: /\.css$/,
        exclude: [path.resolve(srcDir, cssDir)],
        use: ExtractTextWebpackPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                sourceMap: true
              }
            }, {
              loader: 'postcss-loader',
              options: {
                sourceMap: true,
                plugins: () => [
                  precss(),
                  autoprefixer({
                    browsers: ['last 3 version', 'ie >= 10']
                  }),
                  postcsseasysprites({
                    imagePath: '../img',
                    // stylesheetPath: '../dist/css',
                    spritePath: '../dist/sprites'
                  })
                ]
              }
            }
          ]
        })
      },
      {
        test: /\.jsx?$/,
        use: [
          'babel-loader'
        ],
        exclude: /node_modules/
      },
      {
        test: /\.(jpg|png|gif|jpeg$)/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10240,
              outputPath: 'imgs/'
            }
          },
          {
            loader: 'image-webpack-loader',
            options: {
              // 设置对jpg格式的图片压缩的程度
              mozjpeg: {
                progressive: true,
                quality: 70
              }
            }
          }
        ]
      },
      {
        test: /\.(eot|woff|ttf|svg$)/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/'
            }
          }
        ]
      }
    ]
  },
  // 插件
  plugins: [
    // 确保输出资源不会包含错误
    new webpack.NoEmitOnErrorsPlugin(),
    new HardSourceWebpackPlugin(),
    // 分离css
    new ExtractTextWebpackPlugin({
      filename: 'css/[name].css',
      disable: false,
      allChunks: true
    }),
  ],
}