const Canvas = require('canvas')
const {Image} = require("canvas")
const fs = require("fs")

async function compressImgs (width, src, type, quantity = 0.9) {
  // 新建canvas 对象
  const canvas = new Canvas()

  if (!canvas.getContext) {
    return
  }

  const ctx = canvas.getContext('2d')

  // 等待加载图片，获取图片的宽高
  const image = await loadImg (src)

  console.log(image.width, image.heigth)


  canvas.width = width
  canvas.heigth = Math.ceil(width * image.height / image.width)
  

  // 通过ctx.drawImage()压缩图片
  await ctx.drawImage(image, 0, 0, canvas.width, canvas.heigth, 0, 0, image.width, image.height)

  let compressedImg = await toDataUrl(canvas, type, quantity)

  console.log(compressedImg)
}


async function getFileBuf (src) {
  return new Promise((resolve, reject) => {
    fs.readFile(src, (err, buf) => {
      if (err) {
        reject(err)
      } else {
        resolve(buf)
      }
    })
  })
}

async function loadImg (src) {
  const buf = await getFileBuf(src)
  
  const image = new Image
  
  image.src = buf

  return image

  // return new Promise((resolve, reject) => {
  //
  //   const image = new Image()
  //  
  //   image.onload = function () {
  //     resolve(image)
  //   }
  //  
  //   image.onerror = function () {
  //     reject(new Error('Failed to load image'))
  //   }
  //
  //   image.src = buf
  //
  // })
}

async function toDataUrl (canvas, type, quantity) {
  let promise

  switch (type) {
    case '.jpg':
      promise = new Promise((resolve, reject) => {
        canvas.toDataURL('image/jpeg', quantity, (err, jpeg) => {
          if (err) {
            reject(err)
          } else {
            resolve(jpeg)
          }
        })
      })
      break
    case '.png':
      promise = new Promise((resolve, reject) => {
        canvas.toDataURL('image/png', (err, png) => {
          if (err) {
            reject(err)
          } else {
            console.log(png)
            resolve(png)
          }
        })
      })
      break
  }

  return promise
}


module.exports = compressImgs