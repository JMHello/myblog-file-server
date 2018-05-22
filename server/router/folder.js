const Router = require("koa-router")
const folderCtrl = require("../controllers/folder")

const router = new Router()

router.get('/folder', folderCtrl.getFolders)
router.post('/folder', folderCtrl.addFolder)
router.put('/folder', folderCtrl.modifyFolder)
router.del('/folder/:idFolder', folderCtrl.delFolder)

module.exports =  router