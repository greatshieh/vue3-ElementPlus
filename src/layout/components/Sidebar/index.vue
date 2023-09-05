<template>
  <div :class="{ 'has-logo': showLogo }">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar
      wrap-class="scrollbar-wrapper"
      :class="{ hasTrigger: triggerPosition === 'bottom' }"
    >
      <el-menu
        unique-opened
        :collapse="isCollapse"
        :collapse-transition="false"
      >
        <sidebar-item
          v-for="route in permission_routes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
    <trigger
      v-if="triggerPosition === 'bottom'"
      :is-collapse="isCollapse"
      @toggle-click="toggleSideBar"
    />
  </div>
</template>

<script setup name="SideBar">
import Logo from './Logo.vue'
import SidebarItem from './SidebarItem.vue'
import Trigger from './Trigger.vue'
import { useAppStore, useSettingStore, usePermissionStore } from '@/store'
import { computed } from 'vue'

const appStore = useAppStore()
const settingStore = useSettingStore()
const permissionStore = usePermissionStore()

const isCollapse = computed(() => !appStore.sidebar.opened)
const showLogo = computed(() => settingStore.sidebarLogo)
const triggerPosition = computed(() => settingStore.triggerPosition)
const permission_routes = computed(() => permissionStore.routes)

const toggleSideBar = () => {
  appStore.toggleSideBar()
}
</script>

<style lang="scss">
.hasTrigger {
  padding-bottom: 50px;
}
</style>
