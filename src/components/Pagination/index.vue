<template>
  <el-pagination
    v-model:current-page="current"
    v-model:page-size="pageSize"
    class="pagination"
    :total="total"
    layout="sizes, prev, pager, next, jumper, ->, total"
    hide-on-single-page
    @size-change="handleChange"
    @current-change="handleChange"
  />
</template>

<script setup name="Pagination">
import { scrollTo } from '@/utils/scroll-to'

const props = defineProps({
  current: {
    default: 1,
    type: Number
  },
  total: {
    default: 10,
    type: Number
  },
  limit: {
    default: 10,
    type: Number
  }
})

const current = ref(props.current)

const pageSize = ref(props.limit)

const $emit = defineEmits(['update:page', 'update:limit'])

function handleChange() {
  $emit('update:page', current.value)
  $emit('update:limit', pageSize.value)
  scrollTo(0, 800)
}
</script>

<style>
.pagination {
  margin-top: 12px;
}
</style>
