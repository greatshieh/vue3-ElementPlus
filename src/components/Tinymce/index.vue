<template>
  <div class="tinymce-container" :style="{ width: containerWidth }">
    <textarea :id="tinymceId" class="tinymce-textarea" />
  </div>
</template>

<script setup name="TinymceEditor">
import { ElMessage } from 'element-plus'
import plugins from './plugins'
import toolbar from './toolbar'
import load from './dynamicLoadScript'

const tinymceCDN =
  'https://cdn.bootcdn.net/ajax/libs/tinymce/6.2.0/tinymce.min.js'

const props = defineProps({
  id: {
    type: String,
    default: function () {
      return (
        'vue-tinymce-' + +new Date() + ((Math.random() * 1000).toFixed(0) + '')
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

const hasChange = ref(false)
const hasInit = ref(false)
const tinymceId = ref(props.id)
const fullscreen = ref(false)

const $emit = defineEmits(['update:modelValue'])

const modelValue = ref(props.modelValue)

const containerWidth = computed(() => {
  const width = props.width
  if (/^[\d]+(\.[\d]+)?$/.test(width)) {
    // matches `100`, `'100'`
    return `${width}px`
  }
  return width
})

onMounted(() => {
  init()
})

onActivated(() => {
  if (window.tinymce) {
    initTinymce()
  }
})

onDeactivated(() => {
  destroyTinymce()
})

onUnmounted(() => {
  destroyTinymce()
})

const init = () => {
  // dynamic load tinymce from cdn
  load(tinymceCDN, (err) => {
    if (err) {
      ElMessage({ message: err.message, type: 'error', duration: 5 * 1000 })
      return
    }
    initTinymce()
  })
}

const initTinymce = () => {
  tinymce.init({
    selector: `#${tinymceId.value}`,
    language: 'zh-Hans',
    language_url:
      'https://cdn.jsdelivr.net/npm/tinymce-i18n@22.10.18/langs6/zh-Hans.js',
    height: props.height,
    body_class: 'panel-body ',
    object_resizing: false,
    toolbar: props.toolbar.length > 0 ? props.toolbar : toolbar,
    menubar: props.menubar,
    plugins: plugins,
    end_container_on_empty_block: true,
    powerpaste_word_import: 'clean',
    code_dialog_height: 450,
    code_dialog_width: 1000,
    advlist_bullet_styles: 'square',
    advlist_number_styles: 'default',
    // imagetools_cors_hosts: ['www.tinymce.com', 'codepen.io'],
    default_link_target: '_blank',
    link_title: false,
    nonbreaking_force_tab: true, // inserting nonbreaking space &nbsp; need Nonbreaking Space Plugin
    init_instance_callback: (editor) => {
      if (modelValue) {
        editor.setContent(modelValue.value)
      }
      hasInit.value = true
      editor.on('NodeChange Change KeyUp SetContent', (e) => {
        hasChange.value = true
        $emit('update:modelValue', editor.getContent())
      })
    },
    setup(editor) {
      editor.on('FullscreenStateChanged', (e) => {
        fullscreen.value = e.state
      })
    }
  })
}
const destroyTinymce = () => {
  const tinymce = window.tinymce.get(tinymceId.value)
  if (fullscreen.value) {
    tinymce.execCommand('mceFullScreen')
  }

  //   if (tinymce) {
  //     flag.value = true
  //     tinymce.destroy(true)
  //   }
}
</script>

<style lang="scss" scoped>
.tinymce-container {
  position: relative;
  line-height: normal;
}

.tinymce-container {
  :deep {
    .mce-fullscreen {
      z-index: 10000;
    }
  }
}

.tinymce-textarea {
  visibility: hidden;
  z-index: -1;
}

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
