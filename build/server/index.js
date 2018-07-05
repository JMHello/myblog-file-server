const webpack = require("webpack")
const common = require("../../config")
const config = require("../config/webpack.dev.config")

createServer(config, common.server.clientPort)

function createServer (config, port) {
  const WebpackDevServer = require("webpack-dev-server")
  let app = new WebpackDevServer(webpack(config), {
    publicPath: config.output.publicPath,
    hot: true,
    historyApiFallback: true,
    proxy: {
      '/api/*': 'http://127.0.0.1:3002'
    },
    stats: {
      colors: true
    }
  })

  app.listen(port, function (err) {
    if (err) {
      console.log(err)
    }
    console.log(`Listening at localhost:${port}`)
  })
}