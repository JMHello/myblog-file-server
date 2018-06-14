const Koa = require("koa")
const path = require("path")
const compress = require("koa-compress")
const static = require("koa-static-cache")
const body = require("koa-body")
const mysql = require("mysql2/promise")
const debug = require("debug")('app')
const session = require("koa-session")
const cors = require("koa-cors")
const serverConfig = require("../config")
const routerMap = require("./router")

const app = new Koa()

global.db = mysql.createPool(serverConfig.dbConfig)

// 在 X-Response-Time 的响应头返回响应时间
app.use(async function responseTime (ctx, next) {
  const time1 = Date.now()
  await next()
  const time2 = Date.now()
  ctx.set('X-Response-Time', Math.ceil(time2 - time1) + 'ms')
})

// HTTP 压缩
app.use(compress({}))

// 为JWT cookie 和 session cookie 设置cookie 密钥
app.keys = ['jmazm', 'myblog']

// parse request body into ctx.request.body
// - multipart allows parsing of enctype=multipart/form-data
app.use(body({
  multipart: true,
  formidable: {
    keepExtensions: true
  }
}))

// 设置session(uses signed session cookies, with no server storage)
app.use(session(app))

// 追踪每一个请求
app.use(async function (ctx, next) {
  debug(`${ctx.method}: ${ctx.url}`)
  await next()
})

// 处理一些抛出错误的情况（这里主要是处理用户权限验证）
app.use(async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    const statusCode = err.status || err.statusCode || 500
    const errMsg = err.message || 'Internal Server Error'
    ctx.response.status = statusCode
    ctx.body = {
      status: 'failure',
      message: errMsg
    }
  }
})


app.use(static(path.resolve(__dirname, '../dist'),  {
  maxAge: 60 * 60 * 24 * 30 // 1month
}))
app.use(static(path.resolve(__dirname, '../upload'), {
  maxAge: 60 * 60 * 24 * 60 // 2month
}))

// 跨域
app.use(cors({}))

app.use(routerMap.routes())
  .use(routerMap.allowedMethods())


app.listen(serverConfig.server.serverPort)

console.info(`${process.version} listening on port ${serverConfig.server.serverPort} (${app.env}/${serverConfig.dbConfig.database})`)