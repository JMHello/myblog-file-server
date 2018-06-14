const imgModel = require("../models/img")
const fs = require("fs")
const path = require("path")
const {convertToWebp, modifyImgageName} = require("../tools/convertToWebp")
// const compressImgs = require("../tools/compressImgs")

class Img {
  /**
   * 根据文件夹id获取图片
   * @param ctx
   * @return {Promise.<void>}
   */
  static async getImgs (ctx, next) {
    await next()

    const idFolder = parseInt(ctx.params.idFolder)
    const pageNum = parseInt(ctx.query.pageNum)
    const pageSize = parseInt(ctx.query.pageSize)
    const imgs = await imgModel.getDataByFolderId(idFolder, pageNum, pageSize)

    ctx.body = {
      status: 'success',
      data: imgs
    }
  }

  /**
   * 添加图片
   * @param ctx
   * @return {Promise.<void>}
   */
  static async addImg (ctx, next) {
    await next()

    const reqBody = ctx.request.body
    const fields = reqBody.fields
    const folderName = fields.name
    const file= reqBody.files.file
    const data = await dealWithImgData(fields, file)
    const uploadUrl = path.resolve(__dirname,`../../upload${data.src}`)

    // 读写文件
    await uploadImg(file.path, uploadUrl)

    // 将jpg/png转化为webp
    await convertToWebp({
      folderName: folderName,
      imageName: file.name,
      src: file.path,
      quantity: 80
    })

    // 压缩图片
    // await compressImgs(170, file.path, data.ImgExt)

    // 存储数据
    const id = await imgModel.addData(data)

    if (id) {
      ctx.body = {
        status: 'success'
      }
    } else {
      ctx.body = {
        status: 'failure'
      }
    }

  }
  static async modifyImg (ctx, next) {
    await next()

    const param = ctx.request.body
    await imgModel.modifyNameById(param.ImgName, parseInt(param.idImg))
    ctx.body = {
      status: 'success'
    }
  }
  static async delImg (ctx, next) {
    await next()

    const id = parseInt(ctx.params.idImg)
    await imgModel.delById(id)
    ctx.body = {
      status: 'success'
    }
  }
}

module.exports =  Img

/**
 * 处理图片数据
 * @param fields
 * @example {
 *  Folder_idFolder: 1,
 *  FolderName: 'progress',
 * }
 * @param file
 * @return {{}}
 */
function dealWithImgData (fields, file) {
  const data = {}

// 图片路径
  data.src = `/${fields.name}/${file.name}`
  // 所属文件夹id
  data.Folder_id = parseInt(fields.Folder_id)
  // 图片格式
  data.ext = `.${file.name.split('.')[1]}`
  // 图片名
  data.name = file.name.split('.')[0]

  return data
}

/**
 * 上传图片
 * @param oriUrl 源文件路径
 * @param desUrl 目标文件路径
 */

async function uploadImg (oriUrl, desUrl) {
  const reader = await fs.createReadStream(oriUrl)
  const writer = await fs.createWriteStream(desUrl)
  await reader.pipe(writer)
}






