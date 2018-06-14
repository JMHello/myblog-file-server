import React, {Component} from 'react'

import FolderSelectItem from '../folderSelectItem/index'
import select from './style.css'

class FolderSelect extends Component {
  constructor (props) {
    super(props)
  }
  render () {
    const {data} = this.props

    return (
      <select className={select.select} onChange={this.props.onChange.bind(this)}>
        <FolderSelectItem id={-1} name={'请选择文件夹'}/>
        {
          data.length > 0 ?
            data.map((item, i) => {
              return <FolderSelectItem id={item.id} name={item.name} key={i}/>
            }) :
            <FolderSelectItem id={-1} name={'暂无数据'}/>
        }
      </select>
    )
  }
  componentWillMount () {
  }
}

module.exports = FolderSelect
