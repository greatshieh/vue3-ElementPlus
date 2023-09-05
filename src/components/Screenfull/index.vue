<template>
  <div>
    <svg-icon
      :icon-class="isFullscreen ? 'exit-fullscreen' : 'fullscreen'"
      @click.stop="changeScreenfull"
    />
  </div>
</template>

<script setup name="Screenfull">
import { ElMessage } from 'element-plus'
import screenfull from 'screenfull'

const isFullscreen = ref(false)

function change() {
  if (screenfull.isEnabled) isFullscreen.value = screenfull.isFullscreen
}

onMounted(() => {
  screenfull.isEnabled && screenfull.on('change', change)
})

onBeforeUnmount(() => {
  screenfull.isEnabled && screenfull.off('change', change)
})

function changeScreenfull() {
  if (!screenfull.isEnabled) {
    ElMessage.warning('you browser can not work')
  }

  screenfull.toggle()
}
</script>
