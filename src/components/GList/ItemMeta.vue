<script>
import { h } from 'vue'

export default {
  name: 'GListItemMeta',
  props: {
    avatar: { type: null, default: undefined },
    description: { type: null, default: undefined },
    title: { type: null, default: undefined }
  },
  displayName: 'GListItemMeta', // 兼容历史函数式组件
  __ANT_LIST_ITEM_META: true,
  slots: ['avatar', 'description', 'title'],
  setup(props, { slots }) {
    return () => {
      const classString = 'g-list-item-meta'
      const title = props.title || slots.title()
      const description = props.description || slots.description()
      const avatar = props.avatar || slots.avatar()
      const content = h('div', { class: 'g-list-item-meta-content' }, [
        title && h('div', { class: 'g-list-item-meta-title' }, title),
        description &&
          h('div', { class: 'g-list-item-meta-description' }, description)
      ])

      return h('div', { class: classString }, [
        avatar && h('div', { class: 'g-list-item-meta-avatar' }, avatar),
        (title || description) && content
      ])
    }
  }
}
</script>
