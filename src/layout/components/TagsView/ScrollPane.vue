<template>
  <el-scrollbar
    ref="scrollContainer"
    :vertical="false"
    class="scroll-container"
    @wheel.prevent="handleScroll"
  >
    <slot />
  </el-scrollbar>
</template>

<script setup name="Scrollpane">
import { useEventListener } from '@vueuse/core'
import { inject } from 'vue'

const $emit = defineEmits(['scroll'])
const tagRef = inject('tagRef')

const tagAndTagSpacing = 4 // tagAndTagSpacing

const scrollContainer = ref(null)

const scrollWrapper = computed(() => scrollContainer.value.wrap$)

onMounted(() => {
  useEventListener(scrollWrapper, 'scroll', emitScroll, true)
  //   scrollWrapper.value.addEventListener('scroll', emitScroll, true)
})

// onBeforeUnmount(() => {
//   scrollWrapper.value.removeEventListener('scroll', emitScroll)
// })

function handleScroll(e) {
  const eventDelta = e.wheelDelta || -e.deltaY * 40
  const $scrollWrapper = scrollWrapper
  $scrollWrapper.value.scrollLeft =
    $scrollWrapper.value.scrollLeft + eventDelta / 4
}

function emitScroll() {
  $emit('scroll')
}

function moveToTarget(currentTag) {
  const $container = scrollContainer.value.$el
  const $containerWidth = $container.offsetWidth
  const $scrollWrapper = scrollWrapper
  const tagList = tagRef

  let firstTag = null
  let lastTag = null

  // find first tag and last tag
  if (tagList.value.length > 0) {
    firstTag = tagList.value[0]
    lastTag = tagList.value[tagList.value.length - 1]
  }

  if (firstTag === currentTag) {
    $scrollWrapper.value.scrollLeft = 0
  } else if (lastTag === currentTag) {
    $scrollWrapper.value.scrollLeft =
      $scrollWrapper.value.scrollWidth - $containerWidth
  } else {
    // find preTag and nextTag
    const currentIndex = tagList.value.findIndex((item) => item === currentTag)
    const prevTag = tagList.value[currentIndex - 1]
    const nextTag = tagList.value[currentIndex + 1]

    // the tag's offsetLeft after of nextTag
    const afterNextTagOffsetLeft =
      nextTag.$el.offsetLeft + nextTag.$el.offsetWidth + tagAndTagSpacing

    // the tag's offsetLeft before of prevTag
    const beforePrevTagOffsetLeft = prevTag.$el.offsetLeft - tagAndTagSpacing

    if (
      afterNextTagOffsetLeft >
      $scrollWrapper.value.scrollLeft + $containerWidth
    ) {
      $scrollWrapper.value.scrollLeft = afterNextTagOffsetLeft - $containerWidth
    } else if (beforePrevTagOffsetLeft < $scrollWrapper.value.scrollLeft) {
      $scrollWrapper.value.scrollLeft = beforePrevTagOffsetLeft
    }
  }
}

defineExpose({ moveToTarget })
</script>

<style lang="scss" scoped>
.scroll-container {
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  width: 100%;
  ::deep {
    .el-scrollbar__bar {
      bottom: 0px;
    }
    .el-scrollbar__wrap {
      height: 49px;
    }
  }
}
</style>
