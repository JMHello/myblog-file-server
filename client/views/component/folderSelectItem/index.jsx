import React, {Component} from 'react'

import '../folderSelect/style.css'

class FolderSelectItem extends Component {
    constructor (props) {
        super(props)
    }
    render () {
        const {id, name} = this.props
        return (
          <option className="select-item" value={`${id}_${name}`}>{name}</option>
        )
    }
}

module.exports = FolderSelectItem
