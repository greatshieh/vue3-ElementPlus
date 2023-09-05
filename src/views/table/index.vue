<template>
  <div class="app-container">
    <table-header
      v-model:value="listQuery"
      @export-excel="exportExcel"
      @export-zip="exportZip"
      @update:type="listQuery.type = $event"
      @update:importance="listQuery.importance = $event"
      @update:sort="listQuery.sort = $event"
    />
    <el-table :data="dataSource">
      <el-table-column prop="id" label="ID" width="60" align="center" />
      <el-table-column prop="title" label="标题" header-align="center">
        <template #default="scope">
          <div class="editable-cell">
            <template v-if="editableData[scope.row.id]">
              <el-input
                v-model="scope.row.title"
                class="edit-input"
                @press-enter="handleSave(scope.row.id)"
              />
              <el-icon
                class="editable-cell-icon"
                @click="handleSave(scope.row.id)"
              >
                <check />
              </el-icon>
            </template>
            <template v-else>
              {{ scope.row.title }}
              <el-icon
                class="editable-cell-icon"
                style="vertical-align: middle"
                @click.prevent="handleEdit(scope.row.id)"
              >
                <edit />
              </el-icon>
            </template>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="类型" width="60" align="center" />
      <el-table-column
        prop="author"
        label="作者"
        min-width="80"
        width="120"
        align="center"
      />
      <el-table-column
        prop="importance"
        label="重要性"
        min-width="40"
        width="80"
        align="center"
      >
        <template #default="scope">
          <el-rate v-model="scope.row.importance" :max="3" />
        </template>
      </el-table-column>
      <el-table-column
        prop="pageviews"
        label="阅读量"
        min-width="40"
        width="80"
        align="center"
      />
      <el-table-column prop="status" label="状态" width="80" align="center">
        <template #default="scope">
          <el-tag :type="scope.row.status === 'published' ? 'success' : 'info'">
            {{ scope.row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="display_time"
        label="发布时间"
        width="160"
        align="center"
      />
      <el-table-column label="操作" width="220" align="center">
        <template #default="scope">
          <el-popconfirm
            :title="scope.row.status == 'draft' ? '确定发布 ?' : '撤销发布 ?'"
            @confirm="onChangeStatus(scope.row.id, scope.row.status)"
          >
            <template #reference>
              <el-button
                :type="scope.row.status === 'draft' ? 'success' : 'info'"
                size="small"
              >
                {{ scope.row.status === 'draft' ? '发布' : '草稿' }}
              </el-button>
            </template>
          </el-popconfirm>
          <el-popconfirm title="确定删除 ?" @confirm="onDelete(scope.row.id)">
            <template #reference>
              <el-button type="danger" size="small">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      :current="listQuery.page"
      :total="total"
      @update:page="listQuery.page = $event"
      @update:limit="listQuery.limit = $event"
    />
  </div>
</template>

<script setup name="Table">
import { onMounted, ref, toRaw, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { fetchList, updateArticle } from '@/api/article'
import TableHeader from './components/TableHeader.vue'
import Pagination from '@/components/Pagination/index.vue'
import { Edit, Check } from '@element-plus/icons-vue'
import { cloneDeep } from 'lodash-es'
import { parseTime } from '@/utils'

const listQuery = ref({
  type: '',
  importance: '',
  page: 1,
  limit: 10,
  sort: '+id'
})

const total = ref(0)

watch(
  listQuery,
  (val) => {
    const e = toRaw(val)
    fetchData(e)
  },
  { deep: true }
)

const dataSource = ref()
const columns = ref([
  {
    title: 'ID',
    key: 'id'
  },
  { title: '标题', key: 'title' },
  { title: '类型', key: 'type' },
  { title: '作者', key: 'author' },
  {
    title: '重要性',
    key: 'importance'
  },
  {
    title: '阅读量',
    key: 'pageviews'
  },
  { title: '状态', key: 'status' },
  { title: '发布时间', key: 'display_time' }
])

const editableData = reactive({})

const fetchData = (query) => {
  fetchList(query).then((response) => {
    total.value = response.data.total
    dataSource.value = response.data.items
  })
}

onMounted(() => fetchData(listQuery.value))

const handleSave = (id) => {
  // 需要配合服务器使用
  Object.assign(
    dataSource.value.filter((item) => id === item.id)[0],
    editableData[id]
  )
  delete editableData[id]
}

const handleEdit = (id) => {
  editableData[id] = cloneDeep(
    dataSource.value.filter((item) => id === item.id)[0]
  )
}

const onDelete = (id) => {
  // 需要配合服务器使用
  dataSource.value = dataSource.value.filter((item) => item.id !== id)
}

const onChangeStatus = (id, status) => {
  const newStatus = status === 'draft' ? 'published' : 'draft'

  updateArticle({ id: id, status: newStatus }).then(() => {
    Object.assign(dataSource.value.filter((item) => id === item.id)[0], {
      status: newStatus
    })
    ElMessage.success(newStatus === 'published' ? '发布成功' : '撤销发布')
  })
}

function formatJson(filterVal) {
  return dataSource.value.map((v) =>
    filterVal.map((j) => {
      if (j === 'timestamp') {
        return parseTime(v[j])
      } else {
        return v[j]
      }
    })
  )
}

const exportExcel = () => {
  import('@/vendor/Export2Excel').then((excel) => {
    const tHeader = columns.value.map((e) => e.title)
    const filterVal = columns.value.map((e) => e.key)
    const data = formatJson(filterVal)
    excel.export_json_to_excel({
      header: tHeader,
      data,
      filename: 'table-list'
    })
  })
}

const exportZip = () => {
  import('@/vendor/Export2Zip').then((zip) => {
    const tHeader = columns.value.map((e) => e.title)
    const filterVal = columns.value.map((e) => e.key)
    const list = dataSource.value
    const data = formatJson(filterVal, list)
    const filename = 'zip-test'
    zip.export_txt_to_zip(tHeader, data, filename, filename)
  })
}
</script>

<style lang="scss">
.edit-input {
  padding-right: 100px;
}

.editable-cell {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: nowrap;
  flex-direction: row;

  .editable-cell-icon {
    display: none;
    cursor: pointer;
  }

  &:hover .editable-cell-icon {
    display: inline-block;
    color: #108ee9;
  }
}
</style>
