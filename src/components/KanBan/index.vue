<script>
import draggable from 'vuedraggable'
export default {
  name: 'KanBan',
  props: {
    modelValue: {
      default: () => [],
      type: Array
    },
    // 看板的样式
    boardClass: {
      default: '',
      type: [Object, String]
    },
    // 是否使用header
    headerEnable: {
      default: true,
      type: Boolean
    },
    headerClass: {
      default: '',
      type: [Object, String]
    },
    // 看板header内容
    headerText: {
      default: '看板',
      type: String
    },
    contentClass: {
      default: '',
      type: [Object, String]
    },
    contentItemClass: {
      default: '',
      type: [Object, String]
    },
    itemKey: {
      default: 'id',
      type: String
    },
    showContent: {
      default: '',
      type: String
    }
  },
  emits: ['update:modelValue'],

  setup(props, { attrs, slots }) {
    const {
      boardClass,
      headerClass,
      headerText,
      contentClass,
      contentItemClass,
      itemKey
    } = { ...props }

    const headerAttribute = {}

    const modelValue = toRef(props, 'modelValue')

    const contentAttribute = reactive({
      list: modelValue,
      'item-key': itemKey
    })

    const contentItemAttribute = {}

    if (typeof headerClass === 'object') {
      headerAttribute.style = headerClass
    } else if (typeof headerClass === 'string') {
      headerAttribute.class = headerClass
    }

    const headerNode = h('div', headerAttribute, headerText)

    if (typeof contentClass === 'object') {
      contentAttribute.style = contentClass
    } else if (typeof contentClass === 'string') {
      contentAttribute.class = contentClass
    }

    if (typeof contentItemClass === 'object') {
      contentItemAttribute.style = contentItemClass
    } else if (typeof contentClass === 'string') {
      contentItemAttribute.class = contentItemClass
    }

    const contentNode = computed(() =>
      h(draggable, contentAttribute, {
        item: ({ element }) =>
          slots.item?.({ element: element }) ||
          h('div', contentItemAttribute, `task ${element.id} - ${element.name}`)
      })
    )

    const boardAttribute = {}
    if (typeof boardClass === 'object') {
      boardAttribute.style = boardClass
    } else if (typeof boardClass === 'string') {
      boardAttribute.class = boardClass
    }

    boardAttribute.attribute = attrs

    return () => h('div', boardAttribute, [headerNode, contentNode.value])
  }
}
</script>
<!--
<template>
  <div :class="boardClass">
    <div :class="headerClass">
      {{ headerText }}
    </div>
    <draggable :list="props.modelValue" item-key="id" :class="contentClass">
      <template #item="{ element }">
        <slot name="item" :element="element">
          <div :class="contentItemClass">
            {{ element.name }}--{{ element.id }}
          </div>
        </slot>
      </template>
    </draggable>
  </div>
</template>

<script setup name="KanBan">
import draggable from 'vuedraggable'

const props = defineProps({
  modelValue: {
    default: () => [],
    type: Array
  },
  // 看板的样式
  boardClass: {
    default: '',
    type: [Object, String]
  },
  // 是否使用header
  headerEnable: {
    default: true,
    type: Boolean
  },
  headerClass: {
    default: '',
    type: [Object, String]
  },
  // 看板header内容
  headerText: {
    default: '看板',
    type: String
  },
  contentClass: {
    default: '',
    type: [Object, String]
  },
  contentItemClass: {
    default: '',
    type: [Object, String]
  },
  itemKey: {
    default: 'id',
    type: String
  }
})

// 当使用dragable的v-model时, 有两种情况
// 更新modelValue, 等同于list
// const $emit = defineEmits(['update:modelValue'])
// const modelValue = computed({
//   get: () => props.modelValue,
//   set: (val) => $emit('update:modelValue', val)
// })

// 不需要更新modelValue时, 可以直接使用
// const modelValue = ref(props.modelVale)
</script> -->
