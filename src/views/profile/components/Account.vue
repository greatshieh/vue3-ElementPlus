<template>
  <el-form>
    <el-form-item label="Name">
      <el-input v-model.trim="user.username" />
    </el-form-item>
    <el-form-item label="Email">
      <el-input v-model.trim="user.email" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">Update</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup name="Account">
import { reactive } from 'vue'

const props = defineProps({
  user: {
    type: Object,
    default: () => {
      return {
        username: '',
        email: ''
      }
    }
  }
})

const user = reactive({
  user: props.user
})

function submit() {
  this.$message({
    message: 'User information has been updated successfully',
    type: 'success',
    duration: 5 * 1000
  })
}
</script>
