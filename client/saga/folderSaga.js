import {take, call, put} from 'redux-saga/effects'
import {getRequest, postRequest, delRequest, api} from '../fetch/fetch'
import {actionTypes as FolderTypes} from '../redux/reducer/folderReducer'
import Cookie from 'js-cookie'

/**
 * 获取所有文件夹数据
 * @return {*}
 */

function* getAllFolders () {
  try {
    const accessToken = localStorage.getItem('ACCESS_TOKEN')
    const csrfToken = Cookie.get('CSRF_TOKEN')

    return yield call(getRequest, api.getFolderApi(), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'x-csrf-token': csrfToken
      }
    })
  } catch (err) {
    console.log(err)
  }
}

export function* getAllFolderFlow () {
  while (true) {

    yield take(FolderTypes.GET_FOLDERS)

    // 拿回来的响应
    let res = yield call(getAllFolders)

    // 判断返回的响应
    if (res.status === 'success') {
      // 存储数据
      yield put({
        type: FolderTypes.SET_FOLDERS,
        data: res.data
      })
    } else {
      alert(res.message)
      location.href = '/#/login'
    }
  }
}

/**
 * 添加文件夹
 * @param data
 * @return {*}
 */
function* addFolder (data) {
  const accessToken = localStorage.getItem('ACCESS_TOKEN')
  const csrfToken = Cookie.get('CSRF_TOKEN')

  try {
    return yield call(postRequest, api.addFolderApi, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'x-csrf-token': csrfToken
      }
    })
  } catch (err) {
    console.log(err)
  }
}

export function* addFolderFlow () {
  while (true) {

    const req = yield take(FolderTypes.ADD_FOLDER)
    const name = req.name

    // 拿回来的响应
    let res = yield call(addFolder, {
      name
    })

    // 判断返回的响应
    if (res.status === 'success') {
      // 存储数据
      yield put({
        type: FolderTypes.SET_FOLDERS,
        data: res.data
      })
      alert('添加文件夹成功！')
    } else {
      alert(res.message)
      location.href = '/#/login'
    }
  }
}


/**
 * 删除文件夹
 * @param folderId
 * @return {*}
 */
function* delFolder (folderId) {
  const accessToken = localStorage.getItem('ACCESS_TOKEN')
  const csrfToken = Cookie.get('CSRF_TOKEN')

  try {
    return yield call(delRequest, api.delFolderApi(folderId), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'x-csrf-token': csrfToken
      }
    })
  } catch (err) {
    console.log(err)
  }
}

export function* delFolderFlow () {
  while (true) {

    const req = yield take(FolderTypes.DEL_FOLDER)
    const id = req.id

    // 拿回来的响应
    let res = yield call(delFolder, id)

    // 判断返回的响应
    if (res.status === 'success') {
      // 存储数据
      yield put({
        type: FolderTypes.SET_FOLDERS,
        data: res.data
      })
      alert('删除文件夹成功！')
    } else {
      alert(res.message)
      location.href = '/#/login'
    }
  }
}