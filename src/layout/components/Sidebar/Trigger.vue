<template>
  <div class="sidebar-trigger-container" @click="$emit('toggleClick')">
    <el-icon v-if="!isCollapse"><ArrowLeft /></el-icon>
    <el-icon v-else><ArrowRight /></el-icon>
  </div>
</template>

<script setup name="Trigger">
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue'

defineProps({
  isCollapse: { type: Boolean, default: false }
})

const $emit = defineEmits(['toggleClick'])
</script>

<style>
.sidebar-trigger-container {
  position: absolute;
  bottom: 0;
  color: var(--ep-text-color-primary);
  font-size: 14px;
  width: 100%;
  height: 50px;
  line-height: 50px;
  border-top: 1px solid var(--ep-border-color);
  text-align: center;
  overflow: hidden;
  cursor: pointer;
}
</style>
