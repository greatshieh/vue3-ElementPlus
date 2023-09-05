<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script setup name="LineChart">
import * as echarts from 'echarts'
import 'echarts/theme/macarons.js'
import 'echarts/theme/dark.js'
import resize from './mixins/resize'
import {
  getCurrentInstance,
  nextTick,
  onBeforeUnmount,
  onMounted,
  watch
} from 'vue'

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
    default: '350px'
  },
  autoResize: {
    type: Boolean,
    default: true
  },
  chartData: {
    type: Object,
    required: true
  },
  theme: {
    type: String,
    default: 'macarons'
  }
})

let chart = null

watch(
  () => props.chartData,
  (val) => {
    setOptions(val)
  },
  { deep: true }
)

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
  setOptions(props.chartData)
}

function setOptions({ expectedData, actualData } = {}) {
  chart.setOption({
    xAxis: {
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      boundaryGap: false,
      axisTick: {
        show: false
      }
    },
    grid: {
      left: 10,
      right: 10,
      bottom: 20,
      top: 30,
      containLabel: true
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      },
      padding: [5, 10]
    },
    yAxis: {
      axisTick: {
        show: false
      }
    },
    legend: {
      data: ['expected', 'actual']
    },
    series: [
      {
        name: 'expected',
        itemStyle: {
          color: '#FF005A'
        },
        lineStyle: {
          color: '#FF005A',
          width: 2
        },
        smooth: true,
        type: 'line',
        data: expectedData,
        animationDuration: 2800,
        animationEasing: 'cubicInOut'
      },
      {
        name: 'actual',
        smooth: true,
        type: 'line',
        itemStyle: {
          color: '#3888fa'
        },
        areaStyle: {
          color: '#f3f8ff'
        },
        lineStyle: {
          color: '#3888fa',
          width: 2
        },
        data: actualData,
        animationDuration: 2800,
        animationEasing: 'quadraticOut'
      }
    ]
  })
}

onMounted(() => {
  nextTick(() => initChart())
})

onBeforeUnmount(() => {
  if (!chart) {
    return
  }

  chart.dispose()
  chart = null
})
</script>
