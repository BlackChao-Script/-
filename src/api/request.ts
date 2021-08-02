// 引入axios
import axios from 'axios'

declare module 'axios' {
  interface AxiosInstance {
    (config: AxiosRequestConfig): Promise<any>
  }
}

export function request(config: any) {
  const instance = axios.create({
    //后台服务器地址
    baseURL: 'http://127.0.0.1:8888/api/private/v1/',
    // 请求延时
    timeout: 5000,
  })
  // 请求拦截
  instance.interceptors.request.use(
    (config) => {
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )
  // 响应拦截
  instance.interceptors.response.use(
    (response) => {
      return response.data
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  return instance(config)
}
