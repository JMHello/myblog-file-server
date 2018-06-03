const Router = require("koa-router")
const img = require("./img")
const folder = require("./folder")
const address = require("./address")
const user = require("./user")
const captcha = require("./captcha")

const router = new Router()

router.use('/api',img.routes(), img.allowedMethods())
router.use('/api',folder.routes(), folder.allowedMethods())
router.use('/api',address.routes(), address.allowedMethods())
router.use('/api',user.routes(), user.allowedMethods())
router.use('/api',captcha.routes(), captcha.allowedMethods())

module.exports =  router