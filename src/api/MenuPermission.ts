import { request } from "./request";

export function MenuPermission(){
  return request({
    url:'/menus'
  })
}