<template>
  <div class="table-header">
    <el-select
      v-model="type"
      clearable
      style="width: 120px"
      placeholder="选择类型"
      @change="updateType"
    >
      <el-option
        v-for="item in typeOptions"
        :key="item.label"
        :value="item.value"
        :label="item.label"
      >
        {{ item.value }}
      </el-option>
    </el-select>

    <el-select
      v-model="importance"
      clearable
      style="width: 120px"
      placeholder="选择重要性"
      @change="updateImportance"
    >
      <el-option
        v-for="item in importanceOptions"
        :key="item.label"
        :value="item.value"
        :label="item.label"
        >{{ item.value }}</el-option
      >
    </el-select>

    <el-select
      v-model="sort"
      style="width: 120px"
      placeholder="ID排序"
      @change="updateSort"
    >
      <el-option
        v-for="item in idSortOptions"
        :key="item.label"
        :value="item.label"
        :label="item.value"
        >{{ item.value }}</el-option
      >
    </el-select>
    <el-button type="primary" @click="cleanAll">
      <template #icon>
        <svg-icon icon-class="clear" />
      </template>
      清除排序和过滤
    </el-button>
    <el-button type="primary" @click="exportExcel">
      <template #icon>
        <svg-icon icon-class="excel" />
      </template>
      导出excel
    </el-button>
    <el-button type="primary" @click="uploadExcel">
      <template #icon>
        <svg-icon icon-class="upload" />
      </template>
      上传excel
    </el-button>
    <el-button type="primary" @click="exportZip">
      <template #icon>
        <svg-icon icon-class="zip" />
      </template>
      导出zip
    </el-button>
  </div>
</template>

<script setup name="TableHeader">
import { ref } from 'vue'
import SvgIcon from '@/components/SvgIcon/index.vue'

const props = defineProps({
  type: {
    type: String,
    default: undefined
  },
  importance: {
    type: String,
    default: undefined
  },
  sort: {
    default: '+id',
    type: String
  }
})

const $emit = defineEmits([
  'update:type',
  'update:importance',
  'update:sort',
  'exportExcel',
  'uploadExcel',
  'exportZip'
])

const typeOptions = [
  { value: 'CN', label: 'CN' },
  { value: 'US', label: 'US' },
  { value: 'JP', label: 'JP' },
  { value: 'EU', label: 'EU' }
]

const importanceOptions = [
  { value: 1, label: 1 },
  { value: 2, label: 2 },
  { value: 3, label: 3 }
]

const idSortOptions = [
  { value: 'ID 升序', label: '+id' },
  { value: 'ID 降序', label: '-id' }
]

function cleanAll() {
  type.value = undefined
  importance.value = undefined
  sort.value = '+id'
  $emit('update:type', type.value)
  $emit('update:importance', importance.value)
  $emit('update:sort', sort.value)
}

const type = ref(props.type)
const importance = ref(props.importance)
const sort = ref(props.sort)

const updateType = () => $emit('update:type', type.value)
const updateImportance = () => $emit('update:importance', importance.value)
const updateSort = () => $emit('update:sort', sort.value)

function exportExcel() {
  $emit('exportExcel')
}
function uploadExcel() {
  $emit('uploadExcel')
}
function exportZip() {
  $emit('exportZip')
}
</script>

<style lang="scss">
.table-header {
  display: flex;
  margin-bottom: 12px;
  & * + * {
    margin-left: 6px;
  }
}
</style>
