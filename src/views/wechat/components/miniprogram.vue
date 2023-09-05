<template>
  <el-tabs v-model="activeKey" type="card">
    <el-tab-pane
      v-for="item in tabPanes"
      :key="item.key"
      :name="item.key"
      :label="item.title"
    ></el-tab-pane>
  </el-tabs>
</template>

<script setup name="MiniProgram">
const activeKey = ref('')

const tabPanes = [
  { key: 1, title: '核心数据' },
  { key: 2, title: '访问分析' }
]
</script>
