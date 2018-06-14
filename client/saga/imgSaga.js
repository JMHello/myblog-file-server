import {take, call, put} from 'redux-saga/effects'
import {getRequest, api} from '../fetch/fetch'
import {actionTypes as ImgTypes} from '../redux/reducer/imgReducer'

function* getAllImgs (idFolder, pageNum, pageSize) {
  try {
    const accessToken = localStorage.getItem('ACCESS_TOKEN')
    const csrfToken = Cookie.get('CSRF_TOKEN')

    return yield call(
      getRequest, 
      api.getImgsByFolderApi(idFolder, pageNum, pageSize), 
      {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'x-csrf-token': csrfToken
      }
    })
  } catch (err) {
    console.log(err)
  }
}

export function* getAllImgsFlow () {
  while (true) {
    let req = yield take(ImgTypes.GET_IMGS)

    // 拿回来的响应
    let res = yield call(getAllImgs, req.idFolder, req.pageNum, req.pageSize)

    // 判断返回的响应
    if (res.status === 'success') {
      // 存储数据
      yield put({
        type: ImgTypes.SET_IMGS,
        data: res.data
      })
    } else {
      alert(res.message)
      // location.href = '/#/login'
    }
  }
}