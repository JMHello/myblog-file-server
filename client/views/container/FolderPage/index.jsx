import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import ReactAddonsPureRenderMixin from 'react-addons-pure-render-mixin'

import {actions as folderActions} from '../../../redux/reducer/folderReducer'

const { get_folders, add_folder, del_folder } = folderActions

import SideBar from '../../component/sidebar'
import { Modal, Button, Input, Table, Divider} from 'antd';

// import 'antd/lib/modal/style/index.css'

import home from '../HomePage/style.css'

class FolderPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      data: [],
      visible: false,
      name: '' // 文件夹名称
    }

    this.shouldComponentUpdate = ReactAddonsPureRenderMixin.shouldComponentUpdate

    this.showModal = this.showModal.bind(this)
    this.handleOk = this.handleOk.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.handleOnChange = this.handleOnChange.bind(this)
    this.handleDel = this.handleDel.bind(this)
  }
  /**
   * 表格头部数据
   * @type {[null,null,null]}
   */
  columns = [
    {
      title: 'id',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: '文件夹名称',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      // 必须在这里绑定this才可以，在constructor里绑定无效
      render: this.handleRenderOperation.bind(this)
    }
  ]

  /**
   * 表格数据渲染
   * @param o
   * @param row
   * @param index
   * @return {XML}
   */
  handleRenderOperation (o, row) {
    return (
      <span>
        <a href="javascript:;">查看</a>
        <Divider type="vertical" />
        <a href="javascript:;" onClick={() => this.handleDel(row.id)}>删除</a>
        <Divider type="vertical" />
        <a href="javascript:;" onClick={() => this.showModal(row.id)}>修改</a>
      </span>
    )
  }

  /**
   * 删除文章
   * @param id
   * @param pageNum
   * @param pageSize
   */
  handleDel (id) {
    this.props.del_folder(id)
  }

  /**
   * 处理数据，使用与表格数据
   * @param data
   * @return {*}
   */
  handleData (data) {
    for (let item of data) {
      item.key = item.id
    }

    return data
  }

  showModal () {
    this.setState({
      visible: true
    })
  }

  /**
   * 模态框 - 确认
   * @param e
   */
  async handleOk () {
    const {name} = this.state

    if (name == '') {
      alert('请填写文件夹名！')
    } else {
      await this.props.add_folder(name)

      this.setState({
        visible: false,
        name: ''
      })
    }


  }

  /**
   * 模态框 - 取消
   * @param e
   */
  handleCancel () {
    this.setState({
      visible: false
    })
  }

  /**
   * 表单变化
   * @param e
   */
  handleOnChange (e) {
    this.setState({
      name: e.target.value
    })
  }

  render () {
    const {folders} = this.props

    return (
      <div className={home.wrapper}>
        <SideBar/>
        <div className={home.content}>
          <h2 className={home['content-title']}>文件夹管理</h2>
          <div className="content-inner">
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

              <Table
                dataSource={this.handleData(folders)}
                columns={this.columns}
                pagination={false}
              />
          </div>
        </div>
        </div>
      </div>
    )
  }

  componentDidMount () {
    this.props.get_folders()
  }
}

// 设置默认值
FolderPage.defaultProps = {
  folders: []
}

FolderPage.propTypes = {
  folders: PropTypes.array
}

function mapStateToProps (state) {
  return {
    folders: state.folders
  }
}

function mapDispatchToProps (dispatch) {
  return {
    get_folders: bindActionCreators(get_folders, dispatch),
    add_folder: bindActionCreators(add_folder, dispatch),
    del_folder: bindActionCreators(del_folder, dispatch),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FolderPage)
