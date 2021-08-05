import { request } from '../request'

export function setUser(id: number, email: string | number, mobile: number) {
  return request({
    url: `/users/${id}`,
    methods: 'put',
    data: {
      email,
      mobile,
    },
  })
}
