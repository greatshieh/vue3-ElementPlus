<template>
  <div class="app-container">
    <div class="color-group">
      <el-row :gutter="20">
        <el-col v-for="item in colors.slice(0, 6)" :key="item.key" :span="4">
          <div class="color-name">{{ item.key }}</div>
          <div
            v-for="(color, index) in item.color"
            :key="color"
            class="color"
            :style="{ background: color, color: index < 5 ? '#fff' : '#000' }"
          >
            {{ color }}
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col v-for="item in colors.slice(6, 12)" :key="item.key" :span="4">
          <div class="color-name">{{ item.key }}</div>
          <div
            v-for="(color, index) in item.color"
            :key="color"
            class="color"
            :style="{ background: color, color: index < 5 ? '#fff' : '#000' }"
          >
            {{ color }}
          </div>
        </el-col>
      </el-row>
    </div>

    <div style="margin-top: 12px">
      <el-row>
        <el-button>Default</el-button>
        <el-button type="primary">Primary</el-button>
        <el-button type="success">Success</el-button>
        <el-button type="info">Info</el-button>
        <el-button type="warning">Warning</el-button>
        <el-button type="danger">Danger</el-button>
      </el-row>

      <el-row>
        <el-button plain>Plain</el-button>
        <el-button type="primary" plain>Primary</el-button>
        <el-button type="success" plain>Success</el-button>
        <el-button type="info" plain>Info</el-button>
        <el-button type="warning" plain>Warning</el-button>
        <el-button type="danger" plain>Danger</el-button>
      </el-row>

      <el-row>
        <el-button round>Round</el-button>
        <el-button type="primary" round>Primary</el-button>
        <el-button type="success" round>Success</el-button>
        <el-button type="info" round>Info</el-button>
        <el-button type="warning" round>Warning</el-button>
        <el-button type="danger" round>Danger</el-button>
      </el-row>

      <el-row>
        <el-button :icon="Search" circle />
        <el-button type="primary" :icon="Edit" circle />
        <el-button type="success" :icon="Check" circle />
        <el-button type="info" :icon="Message" circle />
        <el-button type="warning" :icon="Star" circle />
        <el-button type="danger" :icon="Delete" circle />
      </el-row>
    </div>

    <div style="margin-top: 12px">
      <span style="margin-right;: 12px">Dark</span>
      <el-tag
        v-for="item in items"
        :key="item.label"
        :type="item.type"
        effect="dark"
        style="margin-left: 12px"
      >
        {{ item.label }}
      </el-tag>

      <el-tag
        v-for="item in items"
        :key="item.label"
        :type="item.type"
        effect="dark"
        closable
        style="margin-left: 12px"
      >
        {{ item.label }}
      </el-tag>
    </div>

    <div style="margin-top: 12px">
      <span>Light</span>
      <el-tag
        v-for="item in items"
        :key="item.label"
        :type="item.type"
        effect="light"
        style="margin-left: 12px"
      >
        {{ item.label }}
      </el-tag>
      <el-tag
        v-for="item in items"
        :key="item.label"
        :type="item.type"
        effect="light"
        closable
        style="margin-left: 12px"
      >
        {{ item.label }}
      </el-tag>
    </div>

    <div style="margin-top: 12px">
      <span>Plain</span>
      <el-tag
        v-for="item in items"
        :key="item.label"
        :type="item.type"
        effect="plain"
        style="margin-left: 12px"
      >
        {{ item.label }}
      </el-tag>
      <el-tag
        v-for="item in items"
        :key="item.label"
        :type="item.type"
        effect="plain"
        closable
        style="margin-left: 12px"
      >
        {{ item.label }}
      </el-tag>
    </div>
  </div>
</template>

<script setup name="Colors">
import {
  Check,
  Delete,
  Edit,
  Message,
  Search,
  Star
} from '@element-plus/icons-vue'
const colorsGroups = [
  {
    key: 'Dust Red / 薄暮',
    primary: '#d32029',
    color: [
      '#2a1215',
      '#431418',
      '#58181c',
      '#791a1f',
      '#a61d24',
      '#d32029',
      '#e84749',
      '#f37370',
      '#f89f9a',
      '#fac8c3'
    ]
  },
  {
    key: 'Volcano / 火山',
    primary: '#d84a1b',
    color: [
      '#2b1611',
      '#441d12',
      '#592716',
      '#7c3118',
      '#aa3e19',
      '#d84a1b',
      '#e87040',
      '#f3956a',
      '#f8b692',
      '#fad4bc'
    ]
  },
  {
    key: 'Sunset Orange / 日暮',
    primary: '#d87a16',
    color: [
      '#2b1d11',
      '#442a11',
      '#593815',
      '#7c4a15',
      '#aa6215',
      '#d87a16',
      '#e89a3c',
      '#f3b765',
      '#f8cf8d',
      '#fae3b7'
    ]
  },
  {
    key: 'Calendula Gold / 金盏花',
    primary: '#d89614',
    color: [
      '#2b2111',
      '#443111',
      '#594214',
      '#7c5914',
      '#aa7714',
      '#d89614',
      '#e8b339',
      '#f3cc62',
      '#f8df8b',
      '#faedb5'
    ]
  },
  {
    key: 'Sunrise Yellow / 日出',
    primary: '#d8bd14',
    color: [
      '#2b2611',
      '#443b11',
      '#595014',
      '#7c6e14',
      '#aa9514',
      '#d8bd14',
      '#e8d639',
      '#f3ea62',
      '#f8f48b',
      '#fafab5'
    ]
  },
  {
    key: 'Lime / 青柠',
    color: [
      '#1f2611',
      '#2e3c10',
      '#3e4f13',
      '#536d13',
      '#6f9412',
      '#8bbb11',
      '#a9d134',
      '#c9e75d',
      '#e4f88b',
      '#f0fab5'
    ]
  },
  {
    key: 'Polar Green / 极光绿',
    primary: '#49aa19',
    color: [
      '#162312',
      '#1d3712',
      '#274916',
      '#306317',
      '#3c8618',
      '#49aa19',
      '#6abe39',
      '#8fd460',
      '#b2e58b',
      '#d5f2bb'
    ]
  },
  {
    key: 'PCyan / 明青',
    primary: '#13a8a8',
    color: [
      '#112123',
      '#113536',
      '#144848',
      '#146262',
      '#138585',
      '#13a8a8',
      '#33bcb7',
      '#58d1c9',
      '#84e2d8',
      '#b2f1e8'
    ]
  },
  {
    key: 'Daybreak Blue / 拂晓蓝',
    primary: '#177ddc',
    color: [
      '#111d2c',
      '#112a45',
      '#15395b',
      '#164c7e',
      '#1765ad',
      '#177ddc',
      '#3c9ae8',
      '#65b7f3',
      '#8dcff8',
      '#b7e3fa'
    ]
  },
  {
    key: 'Geek Blue / 极客蓝',
    primary: '#2b4acb',
    color: [
      '#131629',
      '#161d40',
      '#1c2755',
      '#203175',
      '#263ea0',
      '#2b4acb',
      '#5273e0',
      '#7f9ef3',
      '#a8c1f8',
      '#d2e0fa'
    ]
  },
  {
    key: 'Golden Purple / 酱紫',
    primary: '#642ab5',
    color: [
      '#1a1325',
      '#24163a',
      '#301c4d',
      '#3e2069',
      '#51258f',
      '#642ab5',
      '#854eca',
      '#ab7ae0',
      '#cda8f0',
      '#ebd7fa'
    ]
  },
  {
    key: 'Magenta / 法式洋红',
    primary: '#cb2b83',
    color: [
      '#291321',
      '#40162f',
      '#551c3b',
      '#75204f',
      '#a02669',
      '#cb2b83',
      '#e0529c',
      '#f37fb7',
      '#f8a8cc',
      '#fad2e3'
    ]
  },
  {
    key: 'Polar Green / 极光绿',
    primary: '#5a5a5a',
    color: [
      '#151515',
      '#1f1f1f',
      '#2d2d2d',
      '#393939',
      '#494949',
      '#5a5a5a',
      '#6a6a6a',
      '#7b7b7b',
      '#888888',
      '#969696'
    ]
  }
]

const colors = ref(colorsGroups)
const items = ref([
  { type: 'success', label: 'success' },
  { type: 'info', label: 'info' },
  { type: 'danger', label: 'danger' },
  { type: 'warning', label: 'warning' }
])
</script>

<style lang="scss">
.color-name {
  font-size: 14px;
  text-align: center;
  margin-bottom: 12px;
}

.color {
  font-size: 12px;
  height: 30px;
  line-height: 30px;
  min-width: 100%;
  text-align: center;
}

.el-row + .el-row {
  margin-top: 12px;
}
</style>
