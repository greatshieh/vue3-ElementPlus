<template>
  <div class="app-container">
    <div class="dashboard-container">
      <panel-group @handle-set-line-chart-data="handleSetLineChartData" />

      <el-row
        style="
          /* background: var(--ep-bg-color); */
          padding: 16px 16px 0;
          margin-bottom: 32px;
        "
      >
        <line-chart :chart-data="lineChartData" :theme="theme" />
      </el-row>

      <el-row :gutter="32">
        <el-col :xs="24" :sm="24" :lg="8">
          <div class="chart-wrapper">
            <raddar-chart />
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="8">
          <div class="chart-wrapper">
            <pie-chart />
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="8">
          <div class="chart-wrapper">
            <bar-chart />
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import PanelGroup from './components/PanelGroup.vue'
import LineChart from './components/LineChart.vue'
import RaddarChart from './components/RaddarChart.vue'
import PieChart from './components/PieChart.vue'
import BarChart from './components/BarChart.vue'
import { useSettingStore } from '@/store'
const settingStore = useSettingStore()

const theme = ref('')

const chartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145]
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130]
  }
}

const lineChartData = ref(chartData.newVisitis)

watch(
  () => settingStore.darkTheme,
  (val) => {
    if (val) {
      theme.value = 'dark'
    } else {
      theme.value = 'macarons'
    }
  }
)

function handleSetLineChartData(type) {
  lineChartData.value = chartData[type]
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  padding: 32px;
  position: relative;
  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    // background: var(--ep-bg-color);
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
