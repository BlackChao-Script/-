import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
const routes: Array<RouteRecordRaw> = [
]
// 工厂函数创建router实例
const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
