<template>
  <div class="app-container">
    <space wrap>
      <label>切换账号: </label>
      <el-select
        v-model="selectedType"
        placeholder="请选择账号分类"
        style="width: 160px"
        @change="handleType"
      >
        <el-option
          v-for="item in typeOptions.map((e) => ({
            value: e.value,
            label: e.label
          }))"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-select
        v-model="selectedAccount"
        :disabled="selectDisabled"
        placeholder="请选择账号"
        style="width: 160px"
      >
        <el-option
          v-for="item in accountOptions"
          :key="item.value"
          :label="item.value"
          :value="item.value"
      /></el-select>
    </space>

    <component
      :is="selectedType === 'offiaccount' ? OffiAccount : MiniProgram"
      v-if="selectedType !== ''"
    />
  </div>
</template>

<script setup name="WeChat">
import { onMounted, toRaw } from 'vue'
import { fetchList } from '../../api/accounts'
import Space from '../../components/Space/index.vue'
import MiniProgram from './components/miniprogram.vue'
import OffiAccount from './components/offiaccount.vue'

const typeOptions = ref([
  { value: 'offiaccount', label: '公众号', options: [] }
])
const selectedType = ref('')
const accountOptions = ref([{ value: '' }])
const selectedAccount = ref('')
const selectDisabled = ref(true)

onMounted(() => {
  fetchList({ kind: 'wechat' }).then((resp) => {
    typeOptions.value = resp.data
  })
})

const handleType = (e) => {
  for (const index in typeOptions.value) {
    if (typeOptions.value[index].value === e) {
      accountOptions.value = toRaw(typeOptions.value[index].options)
      selectDisabled.value = false
    }
  }
}
</script>

<style lang="scss">
.space-item {
  & label {
    position: relative;
    display: inline-flex;
    align-items: center;
    max-width: 100%;
    height: 32px;
    font-size: 14px;
  }
}
</style>
