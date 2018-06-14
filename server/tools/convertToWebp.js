const imagemin = require("jmazm-imagemin")
const imageminWebp = require("imagemin-webp")
const fs = require("fs")
const path = require("path")

/**
 * path.parse()
 { root: '',
     dir: 'upload\\progress',
     base: 'inlineblock-03.webp',
     ext: '.webp',
     name: 'inlineblock-03' }
 */

/**
 * 转化成webp格式的
 * @param config
 * @example {
 *  folderName: 文件夹名称,
 *  imageName: 图片名称,（携带ext）
 *  src: 原始图片路劲,
 *  quantity: 图片质量
 * }
 * @return {Promise.<*>}
 */
async function convertToWebp (config) {
  const {folderName, imageName, src, quantity} = config
  // 出口
  const outpuFolder = `upload/${folderName}`
  const type = path.extname(src)
  let promise = null

  switch (type) {
    case '.jpg':
      // jpg 转化为 webp
      promise = imagemin([src], outpuFolder, {
        imageName,
        plugins: [
          imageminWebp({
            quanlity: quantity
          })
        ]
      })
        .then(async (files) => {
          console.log(`${folderName}/${imageName}.jpg finished`)
          return files[0]
        })
        .catch((err) => {
          console.log(err)
          return err
        })
      break;
    case '.png':
      promise = imagemin([src], outpuFolder, {
        imageName,
        plugins: [
          imageminWebp({
            lossless: true
          })
        ]
      })
        .then((files) => {
          console.log(`${folderName}/${imageName}.png finished`)
          return files[0]
        })
        .catch((err) => {
          console.log(err)
          return err
        })
      break
  }

  return promise
}

module.exports = {
  convertToWebp
}