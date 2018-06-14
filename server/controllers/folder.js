const folderModel = require("../models/folder")
const fs = require("fs")
const path = require("path")


class Folder {
  static async getFolders (ctx, next) {
    await next()

    const query = ctx.request.query
    const pageNum = query.pageNum

    let folders

    if (pageNum) {

    } else {
      folders = await folderModel.getAllFolders()

    }

    ctx.body = {
      status: 'success',
      data: folders
    }
  }
  static async addFolder (ctx, next) {
    await next()

    const param = ctx.request.body
    const result = await folderModel.addData(param)
    const id = result.id
    const folders = result.folders
    const name = param.name

    await createFolder(name)

    if (id) {
      ctx.body = {
        status: 'success',
        data: folders
      }
    } else {
      ctx.body = {
        status: 'failure'
      }
    }

  }
  static async modifyFolder (ctx) {
    const param = ctx.request.body
    await folderModel.modifyNameById(param.FolderName, parseInt(param.idFolder))
    ctx.body = {
      status: 'success'
    }
  }
  static async delFolder (ctx, next) {
    await next()

    // 删除数据数据
    const id = parseInt(ctx.params.idFolder)
    const result = await folderModel.delById(id)

    // 删除本地文件和文件夹
    const root = path.resolve(__dirname, '../../upload')
    const folderPath = path.resolve(root, result.name)
    await deleteFolders(folderPath)

    ctx.body = {
      status: 'success',
      data: result.folders
    }
  }
}

/**
 * 创建文件夹
 * @param name
 * @return {Promise}
 */
async function createFolder (name) {
  const root = path.resolve(__dirname, '../../upload')
  const folderPath = path.resolve(root, name)

  return new Promise(async (resolve, reject) => {
    const folderIsExist = await folderIsExit(folderPath)

    // folderIsExist 为 true代表文件夹不存在
    if (folderIsExist) {
      fs.mkdir(folderPath, (err) => {
        resolve(err ? false : true)
      })
    }
    // folderIsExist 为 true代表文件夹存在
    else {
      resolve(false)
    }
  })
}

/**
 * 删除文件夹及文件内容
 * @param folderPath
 */
async function deleteFolders (folderPath) {
  let files = [];

  const isExist = await folderIsExit(folderPath)

  // isExist 为 true代表文件夹不存在
  if(!isExist) {
    // readdirSync读取当前路径下有什么文件和文件夹
    files = await fs.readdirSync(folderPath);

    // 遍历files
    for (let file of files) {
      const curPath = path.resolve(folderPath, file);

      // 如果是文件夹，则继续递归
      if(fs.statSync(curPath).isDirectory()) {
        await deleteFolders(curPath);
      }
      // 删除文件夹
      else {
        await fs.unlinkSync(curPath);
      }
    }

    // 删除目录
    await fs.rmdirSync(folderPath)
  }
}

/**
 * 判断文件夹是否存在
 * @param folderPath
 * @return {Promise}
 */
function folderIsExit (folderPath) {
  return new Promise((resolve) => {
    fs.stat(folderPath, (err) => {
      resolve(err ? true : false)
    })
  })
}

module.exports =  Folder