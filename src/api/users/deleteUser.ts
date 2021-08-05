import { request } from '../request'

export function deleteUser(id: number) {
  return request({
    url: `/users/${id}`,
    methods: 'delete',
  })
}
