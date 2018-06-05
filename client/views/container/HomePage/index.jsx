import React, {Component} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {WaterfallPics} from '../../../plugin/waterfallPics'
import {api, getRequest} from '../../../fetch/fetch'
import {throttle} from '../../../lib/timer'

import SideBar from '../../component/sidebar'
import FolderSelect from '../../component/folderSelect'
import {actions as FolderActions} from '../../../redux/reducer/folderReducer'

import './style.css'

const {get_folders} = FolderActions

class HomePage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      idFolder: 1, // 文件夹Id
      imgs: [], // 显示的所有图片
      pageImgs: [], // 存储每次请求回来的数据
      pageNum: 1, // 分页，请求的页数
      hasMore: true, // 是否有多的数据加载，默认为true
      isLoadingMore: false // 是否加载中，默认false
    }

    this.handleOnScroll = this.handleOnScroll.bind(this)
    this.onSelectChange = this.onSelectChange.bind(this)
  }

  /**
   * 文件夹选择
   */
  async onSelectChange (e) {
    this.setState({
      idFolder: e.target.value,
      // 在改变文件夹的时候，图片的数据需要清空一次
      imgs: []
    })

    // 获取数据
    await this.getImgsData(e.target.value, 1, 15)
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

    // ajax 请求
    const result = await getRequest(api.getImgsByFolderApi(folderId, pageNum, pageSize))

    // 响应
    if (result.status === 'success') {
      
      const promises = await this.loadImgs(result.data)
      console.log(promises)

      let data = await Promise.all(promises)
      console.log(data)
      // 如果返回来数据的长度小于pageSize，那么证明接下来的页数就没有数据，就不需要继续发送请求
      if (data.length < pageSize) {
        this.setState({
          hasMore: false,
        })
      }

      this.setState({
        idFolder: folderId,
        pageNum: pageNum,
        imgs: this.state.imgs.concat(data),
        isLoadingMore: false
      })

    } else {
      alert(result.msg)
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
         await self.getImgsData(self.state.idFolder, self.state.pageNum + 1, 15)
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
        imgs[i].onerror = function (err) {
          reject(err.message)
        }

        imgs[i].src = api.getImgApi(data[i].ImgUrl)
      })
    }
    
    return promises
  }
  
  render () {
    const {folders} = this.props
    const {imgs} = this.state
    
    return (
      <div className="wrapper img--management">
        <SideBar/>
        <div className="content">
          <h2 className="content-title">图片库</h2>
          <div className="select-wrapper">
            文件夹：<FolderSelect data={folders} onChange={this.onSelectChange}/>
          </div>
          <div className="content-inner">
            <div className="img-wrapper">
              <div className="pics-waterfall" onScroll={this.handleOnScroll} ref={ (ele) => this.imgWrapper = ele}>
                {
                  imgs.length > 0 ?
                    (
                      imgs.map((imgItem, i) => {
                        return (
                          <div className="pic-item" key={i}>
                            <div className="pic-info-wrapper">
                              <img src={api.getImgApi(imgItem.ImgUrl)} style={{height: `${imgItem.height}px`}}/>
                              <p className="pic-name">{imgItem.ImgName}</p>
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
     await this.getImgsData(1, this.state.pageNum, 15)
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
