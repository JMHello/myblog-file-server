import {take, call, put} from 'redux-saga/effects'
import {getRequest, postRequest, putRequest, api} from '../fetch/fetch'
import {actionTypes as IndexTypes} from '../redux/reducer'
import {actionTypes as ImgTypes} from '../redux/reducer/imgReducer'

function* addImg (idFolder, imgfiles) {
  yield put({
    type: IndexTypes.FETCH_START
  })
  
  try {
      return yield call(postRequest, '/api/img')
  } catch (err) {
    // 报错处理
    yield put({
      type: IndexTypes.SET_MESSAGE,
      msgContent: '网络请求错误',
      msgType: 0
    })
  } finally {
    // 异步请求结束
    yield put({
      type: IndexTypes.FETCH_END
    })
  }
}

export function* addImgFlow () {
  while (true) {

    let req = yield take(ArticleActionTypes.GET_ARTICLE_DETAIL)

    // 拿回来的响应
    let res = yield call(getArticleDetail, req.id)

    // 判断返回的响应
    if (res.status === 'success') {
      // 存储数据
      yield put({
        type: ArticleActionTypes.RESPONSE_ARTICLE_DETAIL,
        data: res.data
      })
    } else {
      yield put({
        type: IndexActionTypes.SET_MESSAGE,
        msgContent: res.message,
        msgType: 0
      });
    }
  }
}

function* getAllImgs (idFolder, pageNum, pageSize) {
  yield put({
    type: IndexTypes.FETCH_START
  })

  try {
    return yield call(getRequest, api.getImgsByFolderApi(idFolder, pageNum, pageSize))
  } catch (err) {
    // 报错处理
    yield put({
      type: IndexTypes.SET_MESSAGE,
      msgContent: '网络请求错误',
      msgType: 0
    })
  } finally {
    // 异步请求结束
    yield put({
      type: IndexTypes.FETCH_END
    })
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
      yield put({
        type: IndexTypes.SET_MESSAGE,
        msgContent: res.message,
        msgType: 0
      });
    }
  }
}