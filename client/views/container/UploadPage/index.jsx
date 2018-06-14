import React, {Component} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import ReactAddonsPureRenderMixin from 'react-addons-pure-render-mixin'

import SideBar from '../../component/sidebar'
import UploadBtn from '../../component/uploadBtn'
import FolderSelect from '../../component/folderSelect'
import {Upload, Modal} from 'antd'
import Cookie from 'js-cookie'

import home from '../HomePage/style.css'

import {actions as FolderActions} from '../../../redux/reducer/folderReducer'

const {get_folders} = FolderActions

class UploadPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      previewVisible: false,
      previewImage: '',
      fileList: [],
      folderData: {
        Folder_id: -1,
        name: ''
      }
    }

    this.shouldComponentUpdate = ReactAddonsPureRenderMixin.shouldComponentUpdate

    this.handlePreview = this.handlePreview.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.handleSelectChange = this.handleSelectChange.bind(this)
    this.beforeUpload = this.beforeUpload.bind(this)
  }

  handleCancel () {
    this.setState({
      previewVisible: false
    })
  }

  handlePreview (file){
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true
    })
  }

  handleChange ({ fileList }) {
    this.setState({
      fileList
    })
  }

  async handleSelectChange (e) {
    const value = e.target.value

    await this.setState({
      folderData: {
        Folder_id: parseInt(value.split('_')[0]),
        name: value.split('_')[1]
      }
    })
  }

  setHenders () {
    const accessToken = localStorage.getItem('ACCESS_TOKEN')
    const csrfToken = Cookie.get('CSRF_TOKEN')
    
    return {
      Authorization: `Bearer ${accessToken}`,
      'x-csrf-token': csrfToken
    }
  }

  // 上传文件之前的钩子，参数为上传的文件，若返回 false 则停止上传。
  beforeUpload (file, fileList) {
    const {folderData} = this.state

    if (folderData.Folder_id == -1) {
      alert('请选择文件夹')

      return false
    }
  }

  render () {
    const { previewVisible, previewImage, fileList, folderData} = this.state
    const {folders} = this.props

    return (
      <div className={home.wrapper}>
        <SideBar/>
        <div className={home.content}>
          <h2 className={home['content-title']}>图片库</h2>
          <div className={home['select-wrapper']}>
            文件夹：<FolderSelect data={folders} onChange={this.handleSelectChange}/>
          </div>
          <div className="content-inner clearfix">
            <Upload
              action={`/api/img`}
              listType="picture-card"
              onPreview={this.handlePreview}
              onChange={this.handleChange}
              multiple={true}
              data={folderData}
              headers={this.setHenders()}
              beforeUpload={this.beforeUpload}
            >
              {fileList.length >= 10 ? null : <UploadBtn/>}
            </Upload>
            {/*预览图片*/}
            <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
              <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
          </div>
        </div>
      </div>
    )
  }
  componentDidMount () {
    // 获取文件夹图片
    this.props.get_folders()
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
)(UploadPage)
