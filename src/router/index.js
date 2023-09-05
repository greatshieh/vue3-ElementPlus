import { createRouter, createWebHistory } from 'vue-router'

/* Layout */
import Layout from '@/layout/index.vue'

import componentRouters from './example/components'
// import excelRouters from './example/excel'
import tableRouters from './example/table'

/**
 * constantRoutes
 * 所有权限都能访问的页面
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index.vue')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect.vue'),
    hidden: true
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/error-page/404.vue'),
    hidden: true
  },
  {
    path: '/',
    redirect: '/dashboard',
    component: Layout,
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        name: 'Dashboard',
        meta: { title: '首页', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index.vue'),
        name: 'Profile',
        meta: { title: '个人中心', icon: 'user', noCache: true }
      }
    ]
  },
  {
    path: '/error-page',
    component: Layout,
    name: 'ErrorPage',
    meta: { title: '错误页面', icon: 'error' },
    children: [
      {
        path: '403',
        component: () => import('@/views/error-page/403.vue'),
        name: 'Page403',
        meta: { title: '错误页面-403', noCache: true }
      },
      {
        path: '404',
        component: () => import('@/views/error-page/404.vue'),
        name: 'Page404',
        meta: { title: '错误页面-404', noCache: true }
      },
      {
        path: '500',
        component: () => import('@/views/error-page/500.vue'),
        name: 'Page500',
        meta: { title: '错误页面-500', noCache: true }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user authority
 */

export const asyncRoutes = [
  {
    path: '/superadmin',
    component: Layout,
    name: 'SuperAdmin',
    meta: {
      title: '超级管理员',
      icon: 'superadmin',
      authorityName: 'admin'
    },
    children: [
      {
        path: 'users',
        component: () => import('@/views/super-admin/users.vue'),
        name: 'UserAdmin',
        meta: { title: '用户管理' }
      },
      {
        path: 'system',
        component: () => import('@/views/super-admin/system.vue'),
        name: 'SuperAdmin',
        meta: { title: '系统管理' }
      }
    ]
  },
  componentRouters,
  tableRouters,
  {
    path: '/wechat',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/wechat/index.vue'),
        name: 'WeChat',
        meta: { title: '微信', icon: 'wechat' }
      }
    ]
  },
  {
    path: '/list',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/list/index.vue'),
        name: 'List',
        meta: { title: '列表', icon: 'list' }
      }
    ]
  },
  {
    path: '/colors',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/colors/index.vue'),
        name: 'Color',
        meta: { title: '配色', icon: 'color' }
      }
    ]
  }
]

const router = createRouter({
  //   scrollBehavior: () => ({ y: 0 }),
  history: createWebHistory(),
  routes: constantRoutes
})

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter({
    //   scrollBehavior: () => ({ y: 0 }),
    history: createWebHistory(),
    routes: []
  })
  router.matcher = newRouter.matcher // reset router
}

export default router
