<template>
  <div class="app-container">
    <g-list
      :data-source="dataSource"
      :loading="showLoading"
      :bordered="false"
      :locale="{ emptyText: '空空如也' }"
      size="small"
      :grid="{ gutter: 32, xs: 1, sm: 2, md: 3, lg: 4, xl: 5 }"
    >
      <template #header>
        <h2 style="margin-left: 12px">仿antdv List组件</h2>
      </template>
      <template #footer>
        <h2 style="margin-left: 12px">footer插槽内容</h2>
      </template>
      <template #renderItem="{ item }">
        <g-list-item key="item.username">
          <template #actions>
            <span key="star" style="color: var(--ep-text-color-regular)">
              <svg-icon icon-class="star" />
              {{ item.star }}
            </span>
            <span key="like" style="color: var(--ep-text-color-regular)">
              <svg-icon icon-class="like" />
              {{ item.like }}
            </span>
            <span key="message" style="color: var(--ep-text-color-regular)">
              <svg-icon icon-class="message" />
              {{ item.message }}
            </span>
          </template>
          <template #extra>
            <el-image
              style="width: 100%; max-width: 272px"
              alt="logo"
              src="https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg"
              fit="fill"
            />
          </template>
          <g-list-item-meta :description="item.description">
            <template #title>
              <a :href="item.href">{{ item.username }}</a>
            </template>
            <template #avatar
              ><el-avatar :size="64" :src="item.avatar"
            /></template>
          </g-list-item-meta>
          <div class="item-content">
            {{ item.content }}
          </div>
        </g-list-item>
      </template>
    </g-list>
  </div>
</template>

<script setup name="List">
import { onMounted, ref } from 'vue'
import GList from '@/components/GList/index.vue'
import GListItem from '@/components/GList/Item.vue'
import GListItemMeta from '@/components/GList/ItemMeta.vue'
import { transactionList } from '@/api/remote-search'
import SvgIcon from '@/components/SvgIcon/index.vue'

const dataSource = ref([])
const showLoading = ref(true)

onMounted(() => {
  transactionList().then((resp) => {
    setTimeout(() => {
      dataSource.value = resp.data.items
      showLoading.value = false
    }, 3000)
  })
})
</script>

<style lang="scss" scoped>
.g-list-container {
  background-color: var(--ep-bg-color);

  & .item-content {
    height: 60px;
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
  }
}

.g-list-header,
.g-list-footer {
  background-color: #d9ecff;
}

.icon {
  font-size: 16px;
  color: var(--ep-text-color-regular);
}
</style>
