import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {getRequest, api} from '../../../fetch/fetch'

import sideBar from './style.css'

class SideBar extends Component {
    constructor (props) {
        super(props)
    }
  async handleLogout () {
    const result = await getRequest(api.adminLogoutApi)

    if (result.status == 'success') {
      localStorage.removeItem('ACCESS_TOKEN')

      location.href = '/#/login'
    }
  }

    render () {
        return (
          <aside className={sideBar.aside}>
            <nav className="aside-nav">
              <ul className={sideBar['aside-nav-list']}>
                <li className={sideBar['nav-list-item']}><Link to="/">查看图片</Link></li>
                <li className={sideBar['nav-list-item']}><Link to="/upload">上传图片</Link></li>
                <li className={sideBar['nav-list-item']}><Link to="/folder">文件夹管理</Link></li>
                <li className={sideBar['nav-list-item']}><a href="javascript:;" onClick={this.handleLogout}>退出登录</a></li>
              </ul>
            </nav>
          </aside>
        )
    }
}

module.exports = SideBar
