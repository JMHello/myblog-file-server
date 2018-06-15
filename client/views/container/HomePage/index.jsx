import React, {Component} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {WaterfallPics} from '../../../plugin/waterfallPics'
import {api, getRequest} from '../../../fetch/fetch'
import {throttle} from '../../../lib/timer'
import ReactAddonsPureRenderMixin from 'react-addons-pure-render-mixin'
import Cookie from 'js-cookie'

import SideBar from '../../component/sidebar'
import FolderSelect from '../../component/folderSelect'
import {actions as FolderActions} from '../../../redux/reducer/folderReducer'

import home from './style.css'

const {get_folders} = FolderActions

class HomePage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      id: 1, // 文件夹Id
      imgs: [], // 显示的所有图片
      pageImgs: [], // 存储每次请求回来的数据
      pageNum: 1, // 分页，请求的页数
      hasMore: true, // 是否有多的数据加载，默认为true
      isLoadingMore: false // 是否加载中，默认false
    }

    this.shouldComponentUpdate = ReactAddonsPureRenderMixin.shouldComponentUpdate

    this.handleOnScroll = this.handleOnScroll.bind(this)
    this.onSelectChange = this.onSelectChange.bind(this)
  }

  /**
   * 文件夹选择
   */
  async onSelectChange (e) {
    const id = e.target.value.split('_')[0]
    this.setState({
      id: id,
      // 在改变文件夹的时候，图片的数据需要清空一次
      imgs: []
    })

    // 获取数据
    await this.getImgsData(id, 1, 15)
  }

  /**
   * 获取图片数据
   * @param folderId
   * @param pageNum
   * @param pageSize
   * @return {Promise.<void>}
   */
  async getImgsData (folderId, pageNum, pageSize) {

    // 记录状态：加载中
    this.setState({
      isLoadingMore: true
    })

    const accessToken = localStorage.getItem('ACCESS_TOKEN')
    const csrfToken = Cookie.get('CSRF_TOKEN')

    // ajax 请求
    const result = await getRequest(api.getImgsByFolderApi(folderId, pageNum, pageSize),  {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'x-csrf-token': csrfToken
      }
    })

    // 响应
    if (result.status === 'success') {
      
      const promises = await this.loadImgs(result.data)
      let data = []

      /**
       * Promise.all(Array|String)：只返回一个Promise，that resolves when all of the promises in the iterable argument have resolved or when the iterable argument contains no promises. It rejects with the reason of the first promise that rejects.
       */
      // let data = await Promise.all(promises)

      // 这里不能直接用Promise.all去处理，因为它要么只返回resolve要么就只返回reject
      // 所以这里要结合promise的语法以及async/await，获取最终的数据
      for (let promise of promises) {
        await promise.then((img) => {
          data.push(img)
        }).catch((img) => {
          data.push(img)
        })
      }

      // 如果返回来数据的长度小于pageSize，那么证明接下来的页数就没有数据，就不需要继续发送请求
      if (data.length < pageSize) {
        this.setState({
          hasMore: false,
        })
      }

      this.setState({
        id: folderId,
        pageNum: pageNum,
        imgs: this.state.imgs.concat(data),
        isLoadingMore: false
      })

    } else {
      alert(result.message)
    }
  }
  
  handleOnScroll () {
    const self = this
     // 如果isLoadingMore为true，证明在加载数据中，所以直接return，不需要再发送请求
     if(this.state.isLoadingMore) {
       return
     }

     // 节流
     throttle(async function () {
       // 如果hasMore为true，证明还有数据可以拿回来
       // 同时，需要判断每组图片的最后一张图片的相对高度
       // 两个条件同时成立，才能继续发送请求
       if (self.state.hasMore && WaterfallPics.checkIfAddImgs()) {
         await self.getImgsData(self.state.id, self.state.pageNum + 1, 15)
       }
     }, 50)()
  }

  /**
   * 加载图片
   * @param data
   * @return {Array}
   */
  async loadImgs (data) {
    let len = data.length
    let promises = []
    let imgs = []

    for (let i = 0; i < len; i++) {
      promises[i] = new Promise((resolve, reject) => {
        imgs[i] = new Image()

        imgs[i].onload = function () {
          // 按比例计算图片展示的高度，170是定义好的图片的宽度
          const height = Math.round(this.height * 170 / this.width)
          let d = data[i]
          d['height'] = height

          resolve(d)
        }
        // 如果读取不到这张图片，也返回这张图片
        imgs[i].onerror = function (err) {
          reject(data[i])
        }

        imgs[i].src = api.getImgApi(data[i].src)
      })
    }
    
    return promises
  }
  
  render () {
    const { folders } = this.props
    const { imgs } = this.state
    
    return (
      <div className={home.wrapper}>
        <SideBar/>
        <div className={home.content}>
          <h2 className={home['content-title']}>图片库</h2>
          <div className={home['select-wrapper']}>
            文件夹：<FolderSelect data={folders} onChange={this.onSelectChange}/>
          </div>
          <div className="content-inner">
            <div className="img-wrapper">
              <div className={home['pics-waterfall']} onScroll={this.handleOnScroll} ref={ (ele) => this.imgWrapper = ele}>
                {
                  imgs.length > 0 ?
                    (
                      imgs.map((imgItem, i) => {
                        return (
                          <div className={`${home['pic-item']} pic-item`} key={i}>
                            <div className={home['pic-info-wrapper']}>
                              <img className={home.img} src={api.getImgApi(imgItem.src)} style={{height: `${imgItem.height}px`}}/>
                              <p className="pic-name">{imgItem.name}</p>
                            </div>
                          </div>
                        )
                      })
                    )
                    :
                    <div>暂无图片！</div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  async componentDidMount () {

    WaterfallPics.init({
      wrapper: this.imgWrapper
    })

    // 获取文件夹
    this.props.get_folders()

    // 获取图片数据
    //  await this.getImgsData(1, this.state.pageNum, 15)
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevState.imgs.length < this.state.imgs.length) {
      WaterfallPics.countHeight()
    }
  }

  componentWillUnmount () {
    this.imgWrapper = null
  }
}
function mapStateToProps(state) {
  return {
    folders: state.folders
  }
}

function mapDispatchToProps (dispatch) {
  return {
    get_folders: bindActionCreators(get_folders, dispatch)
  }
}

export default connect (
  mapStateToProps,
  mapDispatchToProps
)(HomePage)
