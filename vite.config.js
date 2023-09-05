import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import path from 'path'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
// import { viteMockServe } from 'vite-plugin-mock'
import eslintPlugin from 'vite-plugin-eslint'
import AutoImport from 'unplugin-auto-import/vite'
import ElementPlus from 'unplugin-element-plus/vite'

// 默认环境为开发环境
const NODE_ENV = process.env.NODE_ENV || 'development'
const env = loadEnv(NODE_ENV, process.cwd())
for (const key in env) {
  process.env[key] = env[key]
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    ElementPlus({
      useSource: true
    }),
    createSvgIconsPlugin({
      // 指定需要缓存的图标文件夹
      iconDirs: [path.resolve(__dirname, 'src/icons/svg')],
      // 指定symbolId格式
      symbolId: 'icon-[dir]-[name]',
      svgoOptions: true
    }),
    AutoImport({
      imports: ['vue', 'vue-router'],
      dirs: ['src/store/modules']
    }),
    eslintPlugin({
      include: ['src/**/*.js', 'src/**/*.vue', 'src/*.js', 'src/*.vue']
    })
    // viteMockServe({
    //   // ↓解析根目录下的mock文件夹
    //   mockPath: './mock/',
    //   supportTs: false // 打开后，可以读取 ts 文件模块。 请注意，打开后将无法监视.js 文件。
    // })
  ],
  server: {
    open: true,
    port: process.env.VITE_CLI_PORT || 9527,
    proxy: {
      // 把key的路径代理到target位置
      // detail: https://cli.vuejs.org/config/#devserver-proxy
      [process.env.VITE_BASE_API]: {
        // 需要代理的路径   例如 '/api'
        target: `${process.env.VITE_BASE_PATH}:${process.env.VITE_SERVER_PORT}/`, // 代理到 目标路径
        changeOrigin: true,
        rewrite: (path) =>
          path.replace(new RegExp('^' + process.env.VITE_BASE_API), '')
      }
    }
  },
  resolve: {
    // Vite路径别名配置
    alias: {
      '@': path.resolve('./src'),
      '/static': path.resolve('public')
    }
  },
  css: {
    postcss: {
      plugins: [
        {
          postcssPlugin: 'internal:charset-removal',
          AtRule: {
            charset: (atRule) => {
              if (atRule.name === 'charset') {
                atRule.remove()
              }
            }
          }
        }
      ]
    },
    preprocessorOptions: {
      scss: {
        // 引入自定义主题
        additionalData: `@use "@/styles/element/index.scss" as *;`
      }
    }
  }
})
