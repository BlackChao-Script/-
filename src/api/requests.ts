import axios from 'axios'

// 设置baseURL

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 定义请求头 使用JSON格式
axios.defaults.headers.post['Content-Type'] = 'application/json;charSet=UTF-8'

axios.defaults.headers.get['Content-Type'] = 'application/json;charSet=UTF-8'

axios.defaults.headers.put['Content-Type'] = 'application/json;charSet=UTF-8'

axios.defaults.headers.delete['Content-Type'] = 'application/json;charSet=UTF-8'

axios.defaults.headers.patch['Content-Type'] = 'application/json;charSet=UTF-8'

// 添加请求拦截器
axios.interceptors.request.use(
  (config) => {
    // 为请求头对象,添加 Token 验证的 Authorzation 字段
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 添加响应拦截器
axios.interceptors.response.use(
  (response) => {
    if (response.status !== 200) {
      console.log('请求信息', response)
      return Promise.reject(new Error('Error'))
    } else {
      return response
    }
  },
  (error) => {
    console.log(`err${error}`)
    return Promise.reject(error)
  }
)
export default {
  get(url: any, params = {}) {
    return new Promise((resolve, reject) => {
      axios
        .get(url, { params: params })
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },

  post(url: any, params = {}) {
    return new Promise((resolve, reject) => {
      axios.post(url, params).then(
        (res) => {
          resolve(res.data)
        },
        (err) => {
          reject(err)
        }
      )
    })
  },

  delete(url: any, params = {}) {
    return new Promise((resolve, reject) => {
      axios
        .delete(url, params)
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },

  put(url: any, params = {}) {
    return new Promise((resolve, reject) => {
      axios
        .put(url, params)
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },

  patch(url: any, params = {}) {
    return new Promise((resolve, reject) => {
      axios
        .patch(url, params)
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
}
