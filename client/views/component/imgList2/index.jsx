import React, {Component} from 'react'
import {api} from '../../../fetch/fetch'
import {getComputedStyle} from '../../../lib/getStyle'

import ImgListItem from '../imgListItem/index'

import './style.css'

class ImgList extends Component {
  constructor (props) {
    super(props)
  }
  showImg () {
    const imgWrapper = this.imgWrapper
    const containerWidth = getComputedStyle(imgWrapper, 'width')
    const containerHeight = getComputedStyle(imgWrapper, 'height')
    console.log(containerHeight, containerWidth, imgWrapper.style.height, imgWrapper.offsetHeight)
  }
  render () {
    const {data} = this.props
    return (
      <ul className="img-list-wrapper" ref={ (ele) => this.imgWrapper = ele}>
       <li>
         {
           data.map((item, i) => {
             return <ImgListItem idImg={item.idImg} ImgName={item.ImgName} ImgUrl={api.getImgApi(item.ImgUrl)} key={i}/>
           })
         }
       </li>
        <li>
          {
            data.map((item, i) => {
              return <ImgListItem idImg={item.idImg} ImgName={item.ImgName} ImgUrl={api.getImgApi(item.ImgUrl)} key={i}/>
            })
          }
        </li>
        <li>
          {
            data.map((item, i) => {
              return <ImgListItem idImg={item.idImg} ImgName={item.ImgName} ImgUrl={api.getImgApi(item.ImgUrl)} key={i}/>
            })
          }
        </li>
        <li>
          {
            data.map((item, i) => {
              return <ImgListItem idImg={item.idImg} ImgName={item.ImgName} ImgUrl={api.getImgApi(item.ImgUrl)} key={i}/>
            })
          }
        </li>
        <li>
          {
            data.map((item, i) => {
              return <ImgListItem idImg={item.idImg} ImgName={item.ImgName} ImgUrl={api.getImgApi(item.ImgUrl)} key={i}/>
            })
          }
        </li>
      </ul>
    )
  }
  componentDidMount () {
    // const {data} = this.props
    this.showImg()
    
  }
  componentWillUnmount () {
    this.imgWrapper = null
  }
}

function dyMinHeight () {
  
}

module.exports = ImgList
