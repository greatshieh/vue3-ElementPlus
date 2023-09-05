import { asyncRoutes, constantRoutes } from '@/router'
import { defineStore } from 'pinia'

function hasPermission(authorityName, route) {
  if (route.meta && route.meta.authorityName) {
    console.log('store permission line 6, ', route.meta.authorityName)
    return route.meta.authorityName === authorityName
  } else {
    return true
  }
}

export function filterAsyncRoutes(routes, authorityName) {
  const res = []

  routes.forEach((route) => {
    const tmp = { ...route }
    console.log('tmp is ', tmp)
    if (hasPermission(authorityName, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, authorityName)
      }
      res.push(tmp)
    }
  })

  return res
}

const usePermissionStore = defineStore('permission', {
  state: () => {
    return {
      routes: [],
      addRoutes: []
    }
  },
  getters: { permission_routes: (state) => state.routes },
  actions: {
    generateRoutes(authorityName) {
      return new Promise((resolve) => {
        let accessedRoutes
        if (authorityName === 'admin') {
          // admin加载所有路由
          accessedRoutes = asyncRoutes || []
        } else {
          // 非admin需要过滤路由
          accessedRoutes = filterAsyncRoutes(asyncRoutes, authorityName)
        }
        this.addRoutes = accessedRoutes
        this.routes = constantRoutes.concat(accessedRoutes)
        resolve(accessedRoutes)
      })
    }
  }
})

export default usePermissionStore
