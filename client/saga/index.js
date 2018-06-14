import {fork} from 'redux-saga/effects'
import {getAllImgsFlow} from './imgSaga'
import {getAllFolderFlow, addFolderFlow, delFolderFlow} from './folderSaga'

export default function* rootSage () {
  yield fork(getAllImgsFlow)
  yield fork(getAllFolderFlow)
  yield fork(addFolderFlow)
  yield fork(delFolderFlow)
}
