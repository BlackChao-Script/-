import { request } from './request'

export function setMgState(uid: any, type: any) {
  return request({
    url: `users/${uid}/state/${type}`,
    method: 'put',
    params:{
      uid,
      type
    }
  })
}
