<template>
  <el-container
    :style="{ minHeight: '100%' }"
    :class="{ hideSidebar: isCollapse }"
  >
    <el-aside :width="sideBarWidth">
      <side-bar class="sidebar-container" />
    </el-aside>

    <el-main>
      <div :class="{ hasTagsView: needTagsView }" class="main-container">
        <div :class="{ 'fixed-header': fixedHeader }">
          <!-- 导航栏 -->
          <navbar @change-drawer-visible="drawerVisible = !drawerVisible" />
          <!-- 标签栏 -->
          <Transition name="fade">
            <tags-view v-if="needTagsView"
          /></Transition>
        </div>
        <app-main />
        <right-panel
          v-if="showSettings"
          :model-value="drawerVisible"
          :drawer-width="260"
        >
          <Settings />
        </right-panel>
      </div>
    </el-main>
  </el-container>
</template>

<script setup name="Layout">
import variables from '@/styles/variables.module.scss'
import { AppMain, Navbar, SideBar, TagsView, Settings } from './components'
import RightPanel from '@/components/RightPanel/index.vue'
import { useAppStore, useSettingStore } from '@/store'

const drawerVisible = ref(false)

const appStroe = useAppStore()
const settingStore = useSettingStore()

const isCollapse = computed(() => !appStroe.sidebar.opened)
const needTagsView = computed(() => settingStore.tagsView)
const fixedHeader = computed(() => settingStore.fixedHeader)
const showSettings = computed(() => settingStore.showSettings)
const sideBarWidth = computed(() => {
  return isCollapse.value
    ? variables.sideBarCollapsedWidth
    : variables.sideBarWidth
})
</script>

<style lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

<style lang="scss" scoped>
@use '@/styles/mixin.scss' as *;
@use '@/styles/variables.module.scss' as *;

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  // 配合侧边栏动画
  transition: width 0.2s;
}

.hideSidebar .fixed-header {
  width: calc(100% - #{$sideBarCollapsedWidth});
}

.el-main {
  padding: 0 !important;
}
</style>
