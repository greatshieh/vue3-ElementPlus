<template>
  <div class="ckeditor-container" :style="{ width: containerWidth }">
    <div :id="ckeditorID" class="ckeditor-textarea" />
  </div>
</template>

<script setup name="CKEditor">
import { computed } from 'vue'
import { ElMessage } from 'element-plus'
import load from './dynamicLoadScript'
const ckeditorCDN =
  'https://cdn.jsdelivr.net/gh/greatshieh/ckeditor-all-in-one@1.0.0/build/ckeditor.js'

const props = defineProps({
  id: {
    type: String,
    default: function () {
      return (
        'vue-ckeditor-' + +new Date() + ((Math.random() * 1000).toFixed(0) + '')
      )
    }
  },
  modelValue: {
    type: String,
    default: ''
  },
  toolbar: {
    type: Array,
    required: false,
    default() {
      return []
    }
  },
  menubar: {
    type: String,
    default: 'file edit insert view format table'
  },
  height: {
    type: [Number, String],
    required: false,
    default: 360
  },
  width: {
    type: [Number, String],
    required: false,
    default: 'auto'
  }
})

const ckeditorID = ref(props.id)

const $emit = defineEmits(['update:modelValue'])

const modelValue = ref(props.modelValue)

const containerWidth = computed(() => {
  const width = props.width
  if (/^[\d]+(\.[\d]+)?$/.test(width)) {
    return `${width}px`
  }
  return width
})

const containerHeight = () => {
  const height = props.height
  if (/^[\d]+(\.[\d]+)?$/.test(height)) {
    return `${height}px`
  }
  return height
}

onMounted(() => {
  init()
})

onActivated(() => {
  if (window.editor) {
    initCKEditor()
  }
})

onDeactivated(() => {
  destroyckeditor()
})

onUnmounted(() => {
  destroyckeditor()
})

const init = () => {
  // dynamic load ckeditor from cdn
  load(ckeditorCDN, (err) => {
    if (err) {
      ElMessage.error({
        message: err.message,
        type: 'error',
        duration: 5 * 1000
      })
      return
    }
    initCKEditor()
  })
}

const initCKEditor = () => {
  CKSource.Editor.create(document.querySelector(`#${ckeditorID.value}`), {
    removePlugins: ['Markdown']
  }).then((editor) => {
    window.editor = editor

    // 设置编辑器高度
    editor.ui.view.editable.element.style.height = containerHeight()

    // 设置初始值
    if (modelValue.value !== '' && modelValue.value !== null) {
      editor.setData(modelValue.value)
    }

    // 监听编辑器内容变化, 更新modelValue
    editor.model.document.on('change:data', () => {
      $emit('update:modelValue', editor.getData())
    })
  })
}
const destroyckeditor = () => {
  window.editor.destroy().catch((error) => {
    console.log(error)
  })
}
//   if (ckeditor) {
//     ckeditor.destroy()
//   }
// }
// // const setContent = (value) => {
// //   window.ckeditor.get(ckeditorID.value).setContent(value)
// // }
// // const getContent = () => {
// //   window.ckeditor.get(ckeditorID.value).getContent()
// // }
// const imageSuccessCBK = (arr) => {
//   arr.forEach((v) =>
//     window.ckeditor
//       .get(ckeditorID.value)
//       .insertContent(`<img class="wscnph" src="${v.url}" >`)
//   )
// }
</script>

<style lang="scss" scoped>
.editor-custom-btn-container {
  position: absolute;
  right: 4px;
  top: 4px;
}

.fullscreen .editor-custom-btn-container {
  z-index: 10000;
  position: fixed;
}

.editor-upload-btn {
  display: inline-block;
}
</style>
