import React, {Component} from 'react'
import SideBar from '../../component/sidebar'
import { Modal, Button, Input } from 'antd';


import './style.css'

class FolderPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      data: [],
      visible: false,
      folderName: ''
    }

    this.showModal = this.showModal.bind(this)
    this.handleOk = this.handleOk.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.handleOnChange = this.handleOnChange.bind(this)
  }
  showModal () {
    this.setState({
      visible: true
    })
  }
  handleOk (e) {
    console.log(e)
    this.setState({
      visible: false
    })
  }
  handleCancel (e) {
    console.log(e)
    this.setState({
      visible: false
    })
  }
  handleOnChange (e) {
    this.setState({
      foldName: e.target.value
    })
  }
  render () {
    return (
      <div className="wrapper img--management">
      <SideBar/>
      <div className="content">
        <h2 className="content-title">文件夹管理</h2>
        <Button type="primary" onClick={this.showModal}>添加文件夹</Button>
        <div className="content-inner clearfix">
          <Modal
            title="创建文件夹"
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
          >
            <Input placeholder="文件夹名" onChange={this.handleOnChange}/>
          </Modal>
        </div>
      </div>
      </div>
    )
  }
}

export default FolderPage
