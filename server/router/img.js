const Router = require("koa-router")
const imgCtrl = require("../controllers/img")

const router = new Router()

router.get('/:idFolder/img', imgCtrl.getImgs)
router.post('/img', imgCtrl.addImg)
router.put('/img', imgCtrl.modifyImg)
router.del('/img/:idImg', imgCtrl.delImg)

module.exports =  router