<template>
  <div class="app-container" style="margin: 30px 50px">
    <el-row :gutter="8">
      <el-col class="gutter-row" :span="12">
        <kan-ban
          v-model="dataSource"
          board-class="drag-board"
          header-class="drag-board__header"
          content-class="drag-board__content"
          content-item-class="drag-board__item"
          :show-content="showDataSource"
        >
          <template #item="{ element }">
            <div class="drag-board__item">
              {{ element.task_no }} status: {{ element.status }}
            </div>
          </template>
        </kan-ban>
      </el-col>
      <el-col :span="12">
        <pre
          style="margin-left: 30px; width: 500px; background-color: #f9f7f6"
          >{{ valString }}</pre
        >
      </el-col>
    </el-row>
  </div>
</template>

<script setup name="DragKanban">
import KanBan from '@/components/KanBan/index.vue'
import { transactionList } from '@/api/remote-search'

const dataSource = ref([])

onMounted(() => {
  transactionList().then((resp) => {
    dataSource.value = resp.data.items
  })
})

const showDataSource = ref('${element.username}, price: ${element.price}')

const valString = computed(() => JSON.stringify(dataSource.value, null, 2))
</script>

<style>
.drag-board {
  /* width: 50%; */
  min-height: 100px;
  height: auto;
  margin: auto;
  overflow: hidden;
  background: #f0f0f0;
  border-radius: 3px;
}

.drag-board__header {
  height: 50px;
  line-height: 50px;
  overflow: hidden;
  padding: 0 20px;
  text-align: center;
  background: #f9944a;
  color: #fff;
  border-radius: 3px 3px 0 0;
}

.drag-board__content {
  height: auto;
  overflow: hidden;
  border: 10px solid transparent;
  min-height: 60px;
  display: flex;
  -webkit-box-pack: start;
  justify-content: flex-start;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  flex-direction: column;
  -webkit-box-align: center;
  align-items: center;
}

.drag-board__item {
  cursor: pointer;
  width: 100%;
  height: 64px;
  margin: 5px 0;
  background-color: #fff;
  text-align: left;
  line-height: 54px;
  padding: 5px 10px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  -webkit-box-shadow: 0 1px 3px 0 rgb(0 0 0 / 20%);
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 20%);
}
</style>
