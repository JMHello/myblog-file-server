import {getComputedStyle} from '../lib/getStyle'
import {api} from '../fetch/fetch'

export const WaterfallPics = {
  wrapper: null,
  wrapperHeight: 0,
  columnWidth: 185,
  columnDis: 20,
  column: 0,

  /**
   * 创建图片
   * @param data
   * @return {string}
   */
  initAddImgs: function (data) {
    const wrapper = this.wrapper

    let str = ``

    for (let item of data) {
      str += this.createImgItemTpl(item)
    }

    wrapper.innerHTML = str

    this.countHeight()
  },
  /**
   * 计算高度差，并正确摆放图片
   */
  countHeight: async function () {
    const wrapper = this.wrapper
    const picItem = [...wrapper.querySelectorAll('.pic-item')]
    const picItemWidth = picItem[0].offsetWidth
    const picItemLen = picItem.length
    // 存储高度
    let heightArr = []

    /**
     * 获取一个容器宽度的方法：
     * 1、getComputedStyle：电脑计算值，想找获取哪一个css属性值，那么就只会返回对应的css属性值
     * 2、ele.style.width：设置在style标签或者style属性上才能拿到对应的css值
     * 3、ele.offsetWidth: border + padding + width
     * 4、ele.clientWidth：padding + width
     * 5、getBoundingClientRect()
     */

    // 计算列数
    const column = Math.floor(wrapper.clientWidth / picItemWidth)

    for (let i = 0; i < picItemLen; i++) {
      if (i < column) {
        heightArr.push(picItem[i].offsetHeight)
      } else {
        // 最小高度
        const minH = Math.min.apply(null, heightArr)
        // 在第几列添加图片
        let curColumn = -1

        for (let h = 0; h < heightArr.length; h++) {
          if (heightArr[h] == minH) {
            curColumn = h
            break
          }
        }

        picItem[i].style.cssText += `; position: absolute; top: ${minH}px; left: ${curColumn * picItemWidth}px;`

        // 插入图片后，重新修改对应列的高度
        heightArr[curColumn] += picItem[i].offsetHeight
      }
    }
  },
  /**
   * 图片item模板
   * @param imgItem
   * @return {string}
   */
  createImgItemTpl: function (imgItem) {
    return `
       <div class="pic-item">
         <div class="pic-info-wrapper">
           <img src="${api.getImgApi(imgItem.ImgUrl)}"/>
           <p class="pic-name">${imgItem.ImgName}</p>
         </div>
         <!--<div className="img-operation">-->
         <!--<button type="button">修改</button>-->
         <!--<button type="button">删除</button>-->
         <!--</div>-->
       </div>
    `
  },
  handleOnScroll: function (data) {
    if (this.checkIfAddImgs()) {
      let str = ``

      for (let item of data) {
        str += this.createImgItemTpl(item)
      }

      this.innerHTML += str
      this.countHeight()
    }
  },
  /**
   * 检测是否需要加载新的数据
   * @return {boolean}
   */
  checkIfAddImgs: function () {
    const wrapper = this.wrapper
    const imgItems = [...wrapper.querySelectorAll('.pic-item') ]
    const imgsItemsLen = imgItems.length
    const lastImgItem = imgItems[imgsItemsLen - 1]
    const lastImgItemDis = lastImgItem.getBoundingClientRect().top
    const scrollTop = wrapper.scrollTop

    return (lastImgItemDis < scrollTop + this.wrapperHeight) ? true : false
  },
  countWrapperHeight: function () {
    // 179是除wrapper以外的高
    this.wrapperHeight = document.body.clientHeight - 179
  },
  init (config) {
    const cfg = Object.assign({}, config)
    const wrapper = this.wrapper = cfg.wrapper

    // 计算wrapper高度
    this.countWrapperHeight()
    // 初始化wrapper的高度
    wrapper.style.cssText += `; height: ${this.wrapperHeight}px;`
  },
  loadImgs: async function (data) {
    let len = data.length
    let promises = []
    let imgs = []

    for (let i = 0; i < len; i++) {
      promises[i] = new Promise((resolve, reject) => {
        imgs[i] = new Image()

        imgs[i].onload = function () {
          resolve(imgs[i])
        }
        imgs[i].src = api.getImgApi(data[i].ImgUrl)
      })
    }

    return promises
  }
}