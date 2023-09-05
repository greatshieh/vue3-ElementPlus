import { useEventListener } from '@vueuse/core'

// 添加一个监听器, 当侧边栏展开/收缩时, 刷新图表尺寸
function resize(chart) {
  // 添加一个监听器, 当window尺寸变化时, 刷新图表尺寸
  useEventListener(window, 'resize', () => {
    chart.resize({
      animation: {
        duration: 0.4,
        easing: 'width'
      }
    })
  })

  const el = document.getElementsByClassName('ant-layout-sider')[0]
  useEventListener(el, 'transitionend', (e) => {
    if (e.propertyName === 'width') {
      chart.resize()
    }
  })
}

export default resize
