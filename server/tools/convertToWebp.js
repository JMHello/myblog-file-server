const imagemin = require("imagemin")
const imageminWebp = require("imagemin-webp")
const fs = require("fs")
const path = require("path")

async function convertToWebp (folderName, imgName, type, quanlity = 80) {
  const outpuFolder = `upload/${folderName}`
  let promise = null

  switch (type) {
    case '.jpg':
      const JPEGImages = `upload/${folderName}/${imgName}.jpg`
      // jpg 转化为 webp
      promise = imagemin([JPEGImages], outpuFolder, {
        plugins: [
          imageminWebp({
            quanlity: quanlity
          })
        ]
      })
        .then(async (files) => {
          console.log(`${folderName}/${imgName}.jpg finished`)

          return {
            status: 'success',
            file: files[0]
          }
        })
        .catch((err) => {
          console.log(err)

          reject({
            status: 'failure',
            msg: err.message
          })
        })
      break;
    case '.png':
      const PNGImages = `upload/${folderName}/${imgName}.png`
      promise = imagemin([PNGImages], outpuFolder, {
        plugins: [
          imageminWebp({
            lossless: true
          })
        ]
      })
        .then((files) => {
          console.log(`${folderName}/${imgName}.png finished`)

          return {
            status: 'success',
            file: files[0]
          }
        })
        .catch((err) => {
          console.log(err)

          reject({
            status: 'failure',
            msg: err.message
          })
        })
      break
  }

  return promise
}

/**
 * 修改图片的名字
 * @param path 图片的路径
 * @param ext 图片原来的扩展名
 * @return {Promise}
 */
async function modifyImgageName (filePath, ext) {
  return new Promise((resolve, reject) => {
    /**
     * path.parse()
     { root: '',
         dir: 'upload\\progress',
         base: 'inlineblock-03.webp',
         ext: '.webp',
         name: 'inlineblock-03' }
     */
    const parsePath = path.parse(filePath)

    // 原路径：'upload\\progress\\微信截图_20180322101610.webp'
    const oldPath = filePath

    // 新路径：'upload\\progress\\微信截图_20180322101610.png(或者jpg).webp'
    const newPath = oldPath.replace(/\.webp/, `${ext}.webp`)

    // 修改文件名
    fs.rename(oldPath, newPath, (err) => {
      if (err) {
        reject(err)
      } else {
        // path.sep指的是可以根据不同的平台判断其路径的分割从操作符
        const folder = parsePath.dir.split(path.sep)[1]

        // 目标路径：返回出去的路径 '/progress/微信截图_20180322101610.png(或者jpg).webp'
        const url = `/${folder}/${parsePath.name}${ext}.webp`

        resolve(url)
      }
    })
  })
}

module.exports = {
  convertToWebp,
  modifyImgageName
}