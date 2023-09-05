<script>
import {
  isStringElement,
  isEmptyElement,
  flattedChildren,
  cloneElement
} from '@/utils/props-util'
import { h } from 'vue'
import { ElCol } from 'element-plus'

export default {
  name: 'GListItem',
  components: [ElCol],
  props: {
    extra: { type: null, default: undefined },
    actions: { type: Array, default: undefined },
    grid: { type: Object, default: undefined },
    colStyle: { type: Object, default: undefined }
  },
  slots: ['actions', 'extra'],
  setup(props, { slots, attrs }) {
    const { itemLayout, grid } = inject('rowContextKey', {
      grid: ref(),
      itemLayout: ref()
    })

    // 判断在default插槽中是否存在非空的字符串元素
    const isItemContainsTextNodeAndNotSingular = () => {
      const children = slots.default() || []
      let result
      children.forEach((element) => {
        if (isStringElement(element) && !isEmptyElement(element)) {
          result = true
        }
      })
      return result && children.length > 1
    }

    const isFlexMode = () => {
      // 当itemLayout=vertical时, extra存在返回true, 否则返回false
      const extra = props.extra || (slots.extra && slots.extra())
      if (itemLayout.value === 'vertical') {
        return !!extra
      }
      // 当itemLayout为默认值, isItemContainsTextNodeAndNotSingular取反
      return !isItemContainsTextNodeAndNotSingular()
    }

    const { class: className, ...restAttrs } = attrs
    const extra = props.extra || (slots.extra && slots.extra())
    const children = slots.default && slots.default()

    let actions = props.actions || (slots.actions && slots.actions())

    actions = actions && !Array.isArray(actions) ? [actions] : actions

    const actionsContent =
      actions &&
      actions.length > 0 &&
      h(
        'ul',
        { class: 'g-list-item-action', key: 'actions' },
        actions.map((action, i) => {
          return h('li', { key: `g-list-item-action-${i}` }, [
            action,
            i !== actions.length - 1 &&
              h('em', { class: 'g-list-item-action-split' })
          ])
        })
      )

    const Element = grid.value ? 'div' : 'li'

    const itemChildren = h(
      Element,
      {
        ...restAttrs,
        class: [
          'g-list-item',
          { 'g-lit-item-no-flex': !isFlexMode() },
          className
        ]
      },
      // itemLayout=vertical并且extra存在时, 采用flex布局, extra放在最右侧
      itemLayout.value === 'vertical' && extra
        ? [
            h(
              'div',
              { class: 'g-list-item-main', key: 'content' },
              flattedChildren([children, actionsContent])
            ),
            h('div', { class: 'g-list-item-extra', key: 'extra' }, extra)
          ]
        : flattedChildren([
            children,
            actionsContent,
            cloneElement(extra, { key: 'extra' })
          ])
    )

    return () =>
      grid.value
        ? h(ElCol, { flex: 1, style: props.colStyle }, () => {
            return itemChildren
          })
        : itemChildren
  }
}
</script>
