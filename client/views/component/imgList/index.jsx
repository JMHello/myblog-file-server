import React, {Component} from 'react'
import {api} from '../../../fetch/fetch'
import {WaterfallPics} from '../../../plugin/waterfallPics'


import './style.css'

class ImgList extends Component {
  constructor (props) {
    super(props)
  }
  showImg (data) {
    const imgWrapper = this.imgWrapper
    WaterfallPics.init({
      wrapper: imgWrapper,
      data
    })
  }
  render () {
    const {data} = this.props
    return (
      <div className="pics-waterfall" ref={ (ele) => this.imgWrapper = ele}></div>
    )
  }
  componentDidMount () {
    const {data} = this.props
    this.showImg(data)

    WaterfallPics.init({
      wrapper: this.imgWrapper
    })
  }
  componentWillUnmount () {
    this.imgWrapper = null
  }
}

module.exports = ImgList
