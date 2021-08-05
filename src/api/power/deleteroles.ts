import { request } from '../request'

export function deleteUserRoles(roleId: any, rightId: any) {
  return request({
    url: `roles/${roleId}/rights/${rightId}`,
    methods: 'delete'
  })
}
