const Router = require("koa-router")
const getAddress = require("../controllers/address")
const router = new Router()

router.get('/address', getAddress)

module.exports =  router