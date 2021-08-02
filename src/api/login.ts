import { request } from './request'

export function logins(username: any, password: any) {
  return request({
    url: '/login',
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'post',
    data: {
      username,
      password,
    },
  })
}
