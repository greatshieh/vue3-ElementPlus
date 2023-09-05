import Cookies from 'js-cookie'
import { defineStore } from 'pinia'

const useAppStore = defineStore('app', {
  state: () => {
    return {
      sidebar: {
        opened: Cookies.get('sidebarStatus')
          ? !!+Cookies.get('sidebarStatus')
          : true
      },
      device: 'desktop',
      size: Cookies.get('size') || 'medium'
    }
  },
  getters: {},
  actions: {
    toggleSideBar() {
      this.sidebar.opened = !this.sidebar.opened
      if (this.sidebar.opened) {
        Cookies.set('sidebarStatus', 1)
      } else {
        Cookies.set('sidebarStatus', 0)
      }
    }
  }
})

export default useAppStore
