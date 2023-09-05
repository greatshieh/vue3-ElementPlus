<template>
  <el-drawer
    :model-value="drawerVisible"
    :title="drawerTitle"
    :size="drawerWidth"
  >
    <slot></slot>
  </el-drawer>
</template>

<script setup name="RightPanel">
import { toRef } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  drawerWidth: {
    default: 260,
    type: Number
  },
  drawerTitle: {
    default: '全局配置',
    type: String
  }
})

const drawerVisible = toRef(props, 'modelValue')
const drawerWidth = toRef(props, 'drawerWidth')
const drawerTitle = toRef(props, 'drawerTitle')
</script>
