import { request } from '../request'

export function getinquireUser(id: number) {
  return request({
    url: `/users/${id}`,
  })
}
