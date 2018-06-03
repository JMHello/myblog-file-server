const Router = require("koa-router")
const folderCtrl = require("../controllers/folder")
const { userAuth } = require("../tools/auth")


const router = new Router()

router.get('/folder', folderCtrl.getFolders, userAuth)
router.post('/folder', folderCtrl.addFolder, userAuth)
router.put('/folder', folderCtrl.modifyFolder, userAuth)
router.del('/folder/:idFolder', folderCtrl.delFolder, userAuth)

module.exports =  router