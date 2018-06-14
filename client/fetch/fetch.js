import axios from 'axios'
import commonConfig from '../../config'

let defaultConfig = {
  baseURI: '/',
  validateStatus: (status) => {
    // return status >= 200 && status < 300 || status === 304
    return status >= 200
  },
  transformResponse: [
    function (data) {
      return data
    }
  ],
  headers: {
    // 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    'Content-Type': 'application/json'
  },
  timeout: 10000,
  responseType: 'json'
}

axios.interceptors.response.use(function (res) {
  return res.data
})

export function getRequest (url, config) {

  return axios.get(url, Object.assign({}, defaultConfig, config))
}

export function postRequest (url, data, config) {
  return axios.post(url, data, Object.assign({}, defaultConfig, config))
}

export function delRequest (url, config) {
  return axios.delete(url, Object.assign({}, defaultConfig, config))
}

export function putRequest (url, data, config) {
  return axios.put(url, data, Object.assign({}, defaultConfig, config))
}

let domain = ''

export const api = {
  getFolderApi: () => `${domain}/api/folder`,
  delFolderApi: (id) => `${domain}/api/folder/${id}`,
  addFolderApi: `${domain}/api/folder`,
  modifyFolderApi: () => `${domain}/api/folder`,
  getImgsByFolderApi: (folderId, pageNum, pageSize) => `${domain}/api/${folderId}/img?pageNum=${pageNum}&pageSize=${pageSize}`,
  getImgApi: (childUrl) => `http://127.0.0.1:${commonConfig.server.serverPort}${childUrl}`,
  getCaptchaApi: `${domain}/api/captcha`,
  adminLoginApi: `${domain}/api/login`,
  adminLogoutApi: `${domain}/api/logout`,
}
