import React, {Component} from 'react'
import md5 from 'js-md5'

import {postRequest, api} from '../../../fetch/fetch'

import login from './style.css'

class Login extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loginTotal: 0,
      captUrl: api.getCaptchaApi
    }
  }
  async loginHandle () {
    const form = this.form
    const KEY = `a1&890AJN-=+O2,X`
    const name = form.username.value.trim()
    const password = md5(`${name}${KEY}${form.password.value.trim()}`)
    const captcha = form.captcha? form.captcha.value.trim() : ''

    // ajax 请求
    const result = await postRequest(api.adminLoginApi, {
      name,
      password,
      captcha
    })

    // 响应
    if (result.status === 'success') {
      const accessToken = result.accessToken
      localStorage.setItem('ACCESS_TOKEN', accessToken)
      location.href = '/'
    } else {
      alert(result.msg)
      // 获取登录的次数
      this.setState({
        loginTotal: result.loginTotal
      })
    }
  }
  async captClickHandler () {
    this.setState({
      captUrl: api.getCaptchaApi + `?id=${Math.random() * 20}`
    })
  }
  render () {
    return (
      <div className={login.wrapper}>
        <div className={login.header}>
          <h2 className={login['header-ti']}>张静宜文件管理cms登录</h2>
        </div>
        <form className={login['login-form']} ref={ele => this.form = ele}>
          <label htmlFor="username" className={login['form-label']}>
            <input type="text" className={login['form-input']} id="username" name="username" placeholder="用户名"/>
          </label>
          <label htmlFor="password" className={login['form-label']}>
            <input type="password" className={login['form-input']} id="password" name="password" placeholder="密码"/>
          </label>
          {
            this.state.loginTotal >= 3 ?
              <div className={login['captcha-wrapper']}>
                <img src={this.state.captUrl} alt="captcha" onClick={this.captClickHandler.bind(this)}/>
                <label htmlFor="captcha"className={login['form-label']}>
                  <input type="text" className={login['form-input']} id="captcha" name="captcha" placeholder="验证码"/>
                </label>
              </div> :
              null
          }

          <div className={login['tool-bar']}>
            <button className={login.btn} type="button" onClick={this.loginHandle.bind(this)}>登录</button>
          </div>
        </form>
      </div>
    )
  }
}

module.exports = Login