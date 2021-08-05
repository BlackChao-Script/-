import { request } from '../request'

export function getuserDataList(
  query: string,
  pagenum: number,
  pagesize: number
) {
  return request({
    url: '/users',
    params: {
      query,
      pagenum,
      pagesize,
    },
  })
}
