import router from './router'
import { useUserStore, usePermissionStore } from './store'
import { ElMessage } from 'element-plus'
import NProgress from 'nprogress' // 进度条
import 'nprogress/nprogress.css' // 进度条样式
import { getToken } from '@/utils/auth' // 从cookie中读取token
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress 配置

const whiteList = ['/login', '/auth-redirect'] // 不需要重定向白名单

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  const permissionStore = usePermissionStore()

  // 启动进度条
  NProgress.start()

  // 设置页面 title
  document.title = getPageTitle(to.meta.title)

  // 读取 token
  const hasToken = getToken()

  if (hasToken) {
    // token 存在
    if (to.path === '/login') {
      // 跳过登录页, 直接进入首页
      next({ path: '/' })
      NProgress.done()
    } else {
      // 从store中获取用户权限, 手段刷新页面store信息会清除
      const authorityName = userStore.authorityName

      if (authorityName) {
        // 已经登录, 进入目标页面
        next()
      } else {
        try {
          // 从服务器获取用户信息
          const { authority } = await userStore.getInfo()
          // 基于角色, 生成可访问路由表
          const accessRoutes = await permissionStore.generateRoutes(
            authority.authorityName
          )

          // 动态添加可访问路由表
          accessRoutes.forEach((item) => {
            router.addRoute(item)
          })

          // hack方法 确保addRoutes已完成
          // set the replace: true, so the navigation will not leave a history record
          next({ ...to, replace: true })
        } catch (error) {
          // 无法获取用户角色, 或不能生成可访问路由表
          // 移除token, 返回登录页面
          await userStore.resetToken()
          ElMessage({
            message: error || 'Has Error',
            type: 'error',
            duration: 5 * 1000
          })
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* token不存在, 需要重新登录 */
    if (whiteList.indexOf(to.path) !== -1) {
      // 直接前往白名单中的路径
      next()
    } else {
      //   不在白名单中的路径重定向到登录页
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
