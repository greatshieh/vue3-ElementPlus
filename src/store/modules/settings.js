import { defaultSettings } from '@/settings'
import { defineStore } from 'pinia'

const {
  showSettings,
  darkTheme,
  tagsView,
  fixedHeader,
  sidebarLogo,
  triggerPosition
} = defaultSettings

const useSettingStore = defineStore('setting', {
  state: () => {
    return {
      showSettings: showSettings,
      darkTheme: darkTheme,
      tagsView: tagsView,
      fixedHeader: fixedHeader,
      sidebarLogo: sidebarLogo,
      triggerPosition: triggerPosition
    }
  },
  getters: {},
  actions: {
    changeSetting({ key, value }) {
      // eslint-disable-next-line no-prototype-builtins
      if (this.hasOwnProperty(key)) {
        this[key] = value
      }
    }
  }
})

export default useSettingStore
