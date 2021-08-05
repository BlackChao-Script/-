import { request } from '../request'

export function addUsers(
  username: string,
  password: string | number,
  email: string | number,
  mobile: number
) {
  return request({
    url: '/users',
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'post',
    data: {
      username,
      password,
      email,
      mobile,
    },
  })
}
