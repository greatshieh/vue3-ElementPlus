<template>
  <div class="navbar">
    <hamburger
      v-if="triggerPosition === 'navbar'"
      id="hamburger-container"
      :is-collapse="isCollapse"
      class="hamburger-container"
      @toggle-click="toggleSideBar"
    />
    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
      <template v-if="device !== 'mobile'">
        <screenfull id="screenfull" class="right-menu-item hover-effect" />
      </template>

      <el-dropdown
        class="avatar-container right-menu-item hover-effect"
        trigger="click"
      >
        <div class="avatar-wrapper">
          <img :src="avatar + '?imageView2/1/w/80/h/80'" class="user-avatar" />
          <el-icon><CaretBottom /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <router-link to="/profile/index">
              <el-dropdown-item> 个人中心 </el-dropdown-item>
            </router-link>
            <router-link to="/">
              <el-dropdown-item>首页</el-dropdown-item>
            </router-link>
            <a
              target="_blank"
              href="https://github.com/greatshieh/vue3-ElementPlus"
            >
              <el-dropdown-item>项目地址</el-dropdown-item>
            </a>
            <el-dropdown-item divided @click="logout">
              <span style="display: block">退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <el-tooltip content="全局设置">
        <div
          class="right-menu-item hover-effect"
          style="margin-right: 30px; font-size: 24px"
          @click="$emit('changeDrawerVisible')"
        >
          <svg-icon icon-class="setting"></svg-icon>
        </div>
      </el-tooltip>
    </div>
  </div>
</template>

<script setup name="Navbar">
import Breadcrumb from '@/components/Breadcrumb/index.vue'
import Hamburger from '@/components/Hamburger/index.vue'
import Screenfull from '@/components/Screenfull/index.vue'
import SvgIcon from '@/components/SvgIcon/index.vue'
import { useUserStore, useAppStore, useSettingStore } from '@/store'
import { CaretBottom } from '@element-plus/icons-vue'

const $emit = defineEmits(['changeDrawerVisible'])

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const appStore = useAppStore()
const settingStore = useSettingStore()
const avatar = computed(() => userStore.avatar)
const device = computed(() => appStore.device)
const isCollapse = computed(() => !appStore.sidebar.opened)
const triggerPosition = computed(() => settingStore.triggerPosition)

const toggleSideBar = () => {
  appStore.toggleSideBar()
}

async function logout() {
  await userStore.logout()
  router.push(`/login?redirect=${route.fullPath}`)
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables.module.scss' as *;

.navbar {
  height: $navbarHeight;
  overflow: hidden;
  position: relative;
  background: var(--ep-bg-color);
  border-bottom: 1px solid var(--ep-border-color);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .anticon-caret-down {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>

<style lang="scss">
.breadcrumb-container a {
  color: var(--ep-text-color-primary) !important;
}
</style>
