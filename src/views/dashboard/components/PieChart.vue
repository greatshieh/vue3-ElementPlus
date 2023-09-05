<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script setup name="PieChart">
import * as echarts from 'echarts' // echarts theme
import 'echarts/theme/macarons.js'
import 'echarts/theme/dark.js'
import resize from './mixins/resize'

const props = defineProps({
  className: {
    type: String,
    default: 'chart'
  },
  width: {
    type: String,
    default: '100%'
  },
  height: {
    type: String,
    default: '300px'
  },
  theme: {
    type: String,
    default: 'macarons'
  }
})

let chart = null

onMounted(() => {
  nextTick(() => {
    initChart()
  })
})

onBeforeUnmount(() => {
  if (!chart) {
    return
  }
  chart.dispose()
  chart = null
})

watch(
  () => props.theme,
  () => {
    chart.dispose()
    initChart()
  }
)

const { proxy } = getCurrentInstance()
function initChart() {
  chart = echarts.init(proxy.$el, props.theme)
  resize(chart)
  chart.setOption({
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)'
    },
    legend: {
      left: 'center',
      bottom: '10',
      data: ['Industries', 'Technology', 'Forex', 'Gold', 'Forecasts']
    },
    series: [
      {
        name: 'WEEKLY WRITE ARTICLES',
        type: 'pie',
        roseType: 'radius',
        radius: [15, 95],
        center: ['50%', '38%'],
        data: [
          { value: 320, name: 'Industries' },
          { value: 240, name: 'Technology' },
          { value: 149, name: 'Forex' },
          { value: 100, name: 'Gold' },
          { value: 59, name: 'Forecasts' }
        ],
        animationEasing: 'cubicInOut',
        animationDuration: 2600
      }
    ]
  })
}
</script>
