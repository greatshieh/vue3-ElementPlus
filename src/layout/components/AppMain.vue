<template>
  <div class="app-main">
    <router-view v-slot="{ Component }">
      <keep-alive :include="cachedViews">
        <component :is="Component" :key="key" />
      </keep-alive>
    </router-view>
  </div>
</template>

<script setup name="AppMain">
import { useTagsViewStore } from '../../store'

const tagsViewStore = useTagsViewStore()
const route = useRoute()

const cachedViews = computed(() => tagsViewStore.cachedViews)

const key = computed(() => route.path)
</script>

<style lang="scss" scoped>
@use '@/styles/variables.module.scss' as *;

.app-main {
  width: 100%;
  min-height: 100%;
  position: relative;
  overflow: hidden;
  transition: all 0.2s;
}

.fixed-header + .app-main {
  padding-top: $navbarHeight;
}

.hasTagsView {
  .fixed-header + .app-main {
    padding-top: $navbarHeight + $tagsviewHeight;

    .app-container {
      height: calc(100vh - #{$navbarHeight} - #{$tagsviewHeight});
    }
  }
}
</style>
