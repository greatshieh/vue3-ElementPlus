<template>
  <div class="app-container">
    <el-select
      v-model="selectedEditor"
      placeholder="请选择要使用的编辑器"
      style="width: 160px"
      @change="editorChange"
    >
      <el-option
        v-for="item in editorOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <component :is="editorComponent" v-model="content" :height="550" />
    <div class="editor-content" v-html="content" />
  </div>
</template>

<script setup name="EditorDemo">
import TinymceEditor from '@/components/Tinymce/index.vue'
import CKEditor from '@/components/CKEditor/index.vue'
import { ref } from 'vue'

const editorOptions = [
  { value: 'tinymce', label: 'Tinymce' },
  { value: 'ckeditor', label: 'CkEdior' }
]

const selectedEditor = ref('tinymce')

const tinymceContent = `<h1 style="text-align: center;">TinyMCE6 富文本编辑器!</h1>
  <p style="text-align: center; font-size: 15px;">
    <ul>
        <li><a href="https://www.tiny.cloud/docs/tinymce/6/">TinyMCE6 文档</a></li>
        <li><a href="https://www.tiny.cloud/get-tiny/language-packages/">TinyMCE6 语言包</a>.</li>
      </ul>`

const ckeditorContent = `<h1 style="text-align: center;">CKEditor5 富文本编辑器!</h1>
  <p style="text-align: center; font-size: 15px;">
    <ul>
        <li><a href="https://ckeditor.com/docs/">CKEditor 5 文档</a></li>
        <li><a href="https://ckeditor.com/ckeditor-5/online-builder/">CKEditor 5 在线编译器</a></li>
      </ul>`

const content = ref(tinymceContent)

const editorComponent = computed(() =>
  selectedEditor.value === 'tinymce' ? TinymceEditor : CKEditor
)

const editorChange = (value) => {
  if (value === 'tinymce') {
    content.value = tinymceContent
  } else {
    content.value = ckeditorContent
  }
}
</script>

<style lang="scss">
.editor-content {
  margin-top: 20px;

  & h1 {
    font-size: 2em;
  }
}
</style>
