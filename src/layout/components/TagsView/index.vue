<template>
  <div
    id="tags-view-container"
    ref="tagsViewContainerRef"
    class="tags-view-container"
  >
    <scrollpane
      ref="scrollPane"
      class="tags-view-wrapper"
      @scroll="handleScroll"
    >
      <router-link
        v-for="tag in visitedViews"
        ref="tagRef"
        :key="tag.path"
        :class="isActive(tag) ? 'active' : ''"
        :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
        class="tags-view-item"
        @click.middle="!isAffix(tag) ? closeSelectedTag(tag) : ''"
        @contextmenu.prevent="openMenu(tag, $event)"
      >
        <span> {{ tag.title }}</span>

        <span v-if="!isAffix(tag)" class="icon-close">
          <el-icon @click.prevent.stop="closeSelectedTag(tag)">
            <Close />
          </el-icon>
        </span>
      </router-link>
    </scrollpane>
    <ul
      v-show="visible"
      :style="{ left: left + 'px', top: top + 'px' }"
      class="contextmenu"
    >
      <li @click="refreshSelectedTag(selectedTag)">Refresh</li>
      <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">
        Close
      </li>
      <li @click="closeOthersTags">Close Others</li>
      <li @click="closeAllTags(selectedTag)">Close All</li>
    </ul>
  </div>
</template>

<script setup name="TagsView">
import path from 'path-browserify'
import Scrollpane from './ScrollPane.vue'
import { Close } from '@element-plus/icons-vue'
import { useTagsViewStore, usePermissionStore } from '@/store'

const tagsViewContainerRef = ref(null)
const tagRef = ref([])
provide('tagRef', tagRef)

const router = useRouter()
const route = useRoute()
const tagsViewStore = useTagsViewStore()
const permissionStore = usePermissionStore()

const visitedViews = computed(() => tagsViewStore.visitedViews)
const routes = computed(() => permissionStore.routes)

const data = reactive({
  visible: false,
  top: 0,
  left: 0,
  selectedTag: {},
  affixTags: []
})

const { visible, top, left, selectedTag, affixTags } = toRefs(data)

function isActive(thisRoute) {
  return thisRoute.path === route.path
}
function isAffix(tag) {
  return tag.meta && tag.meta.affix
}
function filterAffixTags(routes, basePath = '/') {
  let tags = []
  routes.forEach((route) => {
    if (route.meta && route.meta.affix) {
      const tagPath = path.resolve(basePath, route.path)
      tags.push({
        fullPath: tagPath,
        path: tagPath,
        name: route.name,
        meta: { ...route.meta }
      })
    }
    if (route.children) {
      const tempTags = filterAffixTags(route.children, route.path)
      if (tempTags.length >= 1) {
        tags = [...tags, ...tempTags]
      }
    }
  })
  return tags
}
function initTags() {
  const affixTags = (data.affixTags = filterAffixTags(
    JSON.parse(JSON.stringify(routes.value))
  ))
  for (const tag of affixTags) {
    // Must have tag name
    if (tag.name) {
      tagsViewStore.addVisitedView(tag)
    }
  }
}
function addTags() {
  const { name } = route
  if (name) {
    tagsViewStore.addView(route)
  }
  return false
}

const scrollPane = ref(null)
function moveToCurrentTag() {
  const tags = tagRef.value
  nextTick(() => {
    for (const tag of tags) {
      if (tag.to.path === route.path) {
        scrollPane.value.moveToTarget(tag)
        // when query is different then update
        if (tag.to.fullPath !== route.fullPath) {
          tagsViewStore.updateVisitedView(route)
        }
        break
      }
    }
  })
}
function refreshSelectedTag(view) {
  tagsViewStore.delCachedView(view).then(() => {
    const { fullPath } = view
    nextTick(() => {
      router.replace({
        path: '/redirect' + fullPath
      })
    })
  })
}
function closeSelectedTag(view) {
  tagsViewStore.delView(view).then(({ visitedViews }) => {
    if (isActive(view)) {
      toLastView(visitedViews, view)
    }
  })
}
function closeOthersTags() {
  router.push(selectedTag)
  tagsViewStore.delOthersViews(selectedTag).then(() => {
    moveToCurrentTag()
  })
}
function closeAllTags(view) {
  tagsViewStore.delAllViews().then(({ visitedViews }) => {
    if (affixTags.value.some((tag) => tag.path === view.path)) {
      return
    }
    toLastView(visitedViews, view)
  })
}
function toLastView(visitedViews, view) {
  const latestView = visitedViews.slice(-1)[0]
  if (latestView) {
    router.push(latestView.fullPath)
  } else {
    // now the default is to redirect to the home page if there is no tags-view,
    // you can adjust it according to your needs.
    if (view.name === 'Dashboard') {
      // to reload home page
      router.replace({ path: '/redirect' + view.fullPath })
    } else {
      router.push('/')
    }
  }
}
function openMenu(tag, e) {
  const menuMinWidth = 105
  const offsetLeft = tagsViewContainerRef.value.getBoundingClientRect().left // 容器距离窗口左边距离
  const offsetWidth = tagsViewContainerRef.value.offsetWidth // 容器宽度
  const maxLeft = offsetWidth - menuMinWidth // 容器宽度与菜单宽度的差值
  const left = e.clientX - offsetLeft + 15 // 鼠标指针左边距与容器左边距的差值

  if (left > maxLeft) {
    data.left = maxLeft
  } else {
    data.left = left
  }

  top.value = e.clientY
  visible.value = true
  selectedTag.value = tag
}
function closeMenu() {
  visible.value = false
}
function handleScroll() {
  closeMenu()
}

watch(route, () => {
  addTags()
  moveToCurrentTag()
})

watch(visible, (value) => {
  if (value) {
    document.body.addEventListener('click', closeMenu)
  } else {
    document.body.removeEventListener('click', closeMenu)
  }
})

onMounted(() => {
  initTags()
  addTags()
})
</script>

<style lang="scss" scoped>
@use '@/styles/variables.module.scss' as *;
.tags-view-container {
  height: $tagsviewHeight;
  width: 100%;
  box-shadow: var(--el-box-shadow-lighter);
  .tags-view-wrapper {
    .tags-view-item {
      display: inline-block;
      position: relative;
      cursor: pointer;
      height: 26px;
      line-height: 26px;
      border: 1px solid var(--ep-border-color-light);
      padding: 0 8px;
      font-size: 12px;
      margin-left: 5px;
      margin-top: 4px;
      &:first-of-type {
        margin-left: 15px;
      }
      &:last-of-type {
        margin-right: 15px;
      }
      &.active {
        background-color: var(--el-color-success);
        color: var(--el-color-white);
        border-color: var(--el-color-success);
        &::before {
          content: '';
          background: var(--el-color-white);
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          margin-right: 2px;
        }
      }
    }
  }
  .contextmenu {
    margin: 0;
    background: var(--ep-bg-color-page);
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: var(--ep-text-color-regular);
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: var(--ep-bg-color);
      }
    }
  }
}
</style>

<style lang="scss">
.tags-view-wrapper {
  .tags-view-item {
    .icon-close {
      vertical-align: -0.15em;
      border-radius: 50%;
      text-align: center;
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      transform-origin: 100% 50%;
      margin-left: 2px;
      &:before {
        transform: scale(0.6);
        display: inline-block;
      }
      &:hover {
        background-color: #b4bccc;
        color: var(--el-color-white);
      }
    }
  }
}
</style>
