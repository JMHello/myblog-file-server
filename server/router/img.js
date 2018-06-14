const Router = require("koa-router")
const imgCtrl = require("../controllers/img")
const { userAuth } = require("../tools/auth")


const router = new Router()

router.get('/:idFolder/img', imgCtrl.getImgs, userAuth)
router.post('/img', imgCtrl.addImg, userAuth)
router.put('/img', imgCtrl.modifyImg, userAuth)
router.delete('/img/:idImg', imgCtrl.delImg, userAuth)

module.exports =  router