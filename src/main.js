import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import '@/styles/index.scss' // global css

import SvgIcon from '@/components/SvgIcon/index.vue' // svg component
import 'virtual:svg-icons-register'
import './permission' // permission control
import App from './App.vue'
import router from './router'
import pinia from './store'

// pinia 持久化
import piniaPersist from 'pinia-plugin-persist'
pinia.use(piniaPersist)

const app = createApp(App)
app.use(router)
app.use(pinia)
app.component('SvgIcon', SvgIcon)
app.use(ElementPlus, { locale: zhCn })
app.mount('#app')
