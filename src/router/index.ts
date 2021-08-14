import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
const routes: Array<RouteRecordRaw> = [
  { path: '/', redirect: '/login' },
  {
    path: '/login',
    component: () => import('../views/Login.vue'),
  },
  {
    path: '/home',
    component: () => import('../views/Home.vue'),
    redirect: '/home/welcome',
    children: [
      {
        path: 'welcome',
        component: () => import('../views/Welcome.vue'),
      },
      {
        path: 'users',
        component: () => import('../views/Users.vue'),
      },
      {
        path: 'roles',
        component: () => import('../views/power/roles.vue'),
      },
      {
        path: 'rights',
        component: () => import('../views/power/rights.vue'),
      },
      {
        path: 'categories',
        component: () => import('../views/goods/goodsCategory.vue'),
      },
      {
        path: 'params',
        component: () => import('../views/goods/goodSattributes.vue'),
      },
      {
        path: 'goods',
        component: () => import('../views/goods/goodsList.vue'),
      },
      {
        path: 'addgoods',
        component: () => import('../views/goods/addGoodslist.vue'),
      },
      {
        path: 'orders',
        component: () => import('../views/Orders.vue'),
      },
      {
        path: 'reports',
        component: () => import('../views/Reports.vue'),
      },
    ],
  },
]
//! 工厂函数创建router实例
const router = createRouter({
  history: createWebHistory(),
  routes,
})
//! 路由导航守卫
router.beforeEach((to, from, next) => {
  //* 如果用户访问登录页面,直接放行
  if (to.path === '/login') return next()
  //* 从 sessionStorage 中获取到保存的 token 值
  const tokenStr = window.sessionStorage.getItem('token')
  //* 没有token,强制跳转到登录页面
  if (!tokenStr) return next('/login')
  next()
})

export default router
