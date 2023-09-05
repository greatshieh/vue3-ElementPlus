import { createPinia } from 'pinia'

export { default as useAppStore } from './modules/app'
export { default as useErrorLogStore } from './modules/errorLog'
export { default as usePermissionStore } from './modules/permission'
export { default as useSettingStore } from './modules/settings'
export { default as useTagsViewStore } from './modules/tagsView'
export { default as useUserStore } from './modules/user'

const pinia = createPinia()
export default pinia
