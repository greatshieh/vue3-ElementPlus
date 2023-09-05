<template>
  <g-list bordered :data-source="dataSource" :loading="showLoading">
    <draggable :list="dataSource" item-key="id">
      <template #item="{ element }">
        <g-list-item>
          {{ element.descript }}
          <template #actions>
            <el-tag :type="element.status === 'success' ? 'success' : 'info'">
              {{ element.status }}
            </el-tag>
          </template>
        </g-list-item>
      </template>
    </draggable>
  </g-list>
</template>

<script setup name="TransactionList">
import { onMounted, ref } from 'vue'
import GList from '../../../components/GList/index.vue'
import GListItem from '../../../components/GList/Item.vue'
import { transactionList } from '../../../api/remote-search'
import draggable from 'vuedraggable'

const dataSource = ref([])
const showLoading = ref(true)

onMounted(() => {
  transactionList().then((resp) => {
    dataSource.value = resp.data.items
    showLoading.value = false
  })
})
</script>

<style>
.g-list-item {
  cursor: pointer;
}
</style>
