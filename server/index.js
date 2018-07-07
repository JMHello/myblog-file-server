const Koa = require("koa")
const path = require("path")
const compress = require("koa-compress")
const static = require("jmazm-koa-static-cache")
const body = require("koa-body")
const mysql = require("mysql2/promise")
const debug = require("debug")('app')
const session = require("koa-session")
const validate = require("koa-validate")
const cors = require("koa-cors")
const serverConfig = require("../config")
const routerMap = require("./router")
const rootDir = process.cwd()

const app = new Koa()

// 将myql连接池暴露在全局环境下
global.db = mysql.createPool(serverConfig.dbConfig)

// 拦截器 - validate url params, url queries, request bodies, headers as well as files
validate(app)

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

app.use(static(path.resolve(rootDir, 'dist'),  {
  maxAge: 60 * 60 * 24 * 30 // 1month
}))

app.use(static(path.resolve(rootDir, 'upload'), {
  maxAge: 60 * 60 * 24 * 60 // 2month
}))

app.use(cors({}))

// 防止点击劫持
app.use(async function (ctx, next) {
  ctx.set('X-XSS-Protection', '1; mode=block')
  ctx.set('X-Frame-Options', 'DENY')

  await next()
})

app.use(routerMap.routes())
  .use(routerMap.allowedMethods())

app.listen(serverConfig.server.serverPort)

console.info(`${process.version} listening on port ${serverConfig.server.serverPort} (${app.env}/${serverConfig.dbConfig.database})`)