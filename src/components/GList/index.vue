<script>
import { computed, h, toRaw, withDirectives } from 'vue'
import { ElRow, vLoading, ElEmpty } from 'element-plus'
import { eagerComputed } from './utils'
import { flattedChildren } from '../../utils/props-util'
import { useBreakpoints } from '@vueuse/core'

const responsiveArray = ['xl', 'lg', 'md', 'sm', 'xs']
const breakpointElementPlus = {
  xs: 576,
  sm: 768,
  md: 992,
  lg: 1200,
  xl: 1920
}

export default {
  name: 'GList',
  props: {
    prefixCls: { type: String, default: 'g' },
    dataSource: { type: Array, default: () => [] },
    extra: { type: null, default: undefined },
    grid: {
      type: Object,
      default: () => {}
    },
    itemLayout: { type: null, default: undefined },
    loadMore: { type: null, default: undefined },
    rowKey: { type: null, default: undefined },
    renderItem: { type: null, default: undefined },
    size: { type: null, default: undefined },
    header: { type: null, default: undefined },
    footer: { type: null, default: undefined },
    locale: {
      type: Object,
      default: () => {
        return {
          emptyText: '暂无数据'
        }
      }
    },
    bordered: { type: Boolean, default: false },
    split: { type: Boolean, default: true },
    loading: { type: Boolean, default: false }
  },
  slots: ['extra', 'loadMore', 'renderItem', 'header', 'footer'],
  setup(props, { slots }) {
    provide('rowContextKey', {
      grid: toRef(props, 'grid'),
      itemLayout: toRef(props, 'itemLayout')
    })

    const listItemsKeys = []

    const dataSource = toRef(props, 'dataSource')

    const loadingProp = computed(() => {
      if (typeof props.loading === 'boolean') {
        return {
          spinning: props.loading
        }
      } else {
        return props.loading
      }
    })

    const isLoading = computed(() => {
      return loadingProp.value && loadingProp.value.spinning
    })

    const sizeCls = computed(() => {
      let size = ''
      switch (props.size) {
        case 'large':
          size = 'lg'
          break
        case 'small':
          size = 'sm'
          break
        default:
          break
      }
      return size
    })

    const classObj = computed(() => ({
      [`${props.prefixCls}-list`]: true,
      [`${props.prefixCls}-list-vertical`]: props.itemLayout === 'vertical',
      [`${props.prefixCls}-list-${sizeCls.value}`]: sizeCls.value,
      [`${props.prefixCls}-list-split`]: props.split,
      [`${props.prefixCls}-list-bordered`]: props.bordered,
      [`${props.prefixCls}-list-loading`]: isLoading.value,
      [`${props.prefixCls}-list-grid`]: !!props.grid
    }))

    // ! 获取屏幕宽度
    // 使用usevue代替antdv原方法
    const screens = useBreakpoints(breakpointElementPlus)
    const currentBreakpoint = eagerComputed(() => {
      for (let i = 0; i < responsiveArray.length; i += 1) {
        const breakpoint = responsiveArray[i]
        if (screens.greaterOrEqual(breakpoint).value) {
          return breakpoint
        }
      }
      return undefined
    })

    // 根据屏幕宽度, 计算宽度
    const colStyle = computed(() => {
      if (!props.grid) {
        return undefined
      }
      const columnCount =
        currentBreakpoint.value && props.grid[currentBreakpoint.value]
          ? props.grid[currentBreakpoint.value]
          : props.grid.column
      if (columnCount) {
        return {
          width: `${100 / columnCount}%`,
          maxWidth: `${100 / columnCount}%`
        }
      }
      return undefined
    })

    const renderInnerItem = (item, index) => {
      const renderItem = props.renderItem ?? slots.renderItem
      // 没有定义renderItem属性和rednerItem插槽时, 直接返回
      if (!renderItem) return null

      let key
      const rowKeyType = typeof props.rowKey

      if (rowKeyType === 'function') {
        key = props.rowKey(item)
      } else if (rowKeyType === 'string' || rowKeyType === 'number') {
        key = item[props.rowKey]
      } else {
        key = item.key
      }

      if (!key) {
        key = `list-item-${index}`
      }

      listItemsKeys[index] = key

      return renderItem({ item, index })
    }

    return () => {
      const loadMore = props.loadMore ?? (slots.loadMore && slots.loadMore())
      const footer = props.footer ?? (slots.footer && slots.footer())
      const header = props.header ?? (slots.header && slots.header())

      // ! 没有定义renderItem插槽时, 渲染子元素
      const children = flattedChildren(slots.default && slots.default())

      const isSomethingAfterLastItem = !!(loadMore || footer)
      const classString = {
        ...classObj.value,
        [`g-list-something-after-last-item`]: isSomethingAfterLastItem
      }

      let childrenContent =
        isLoading.value && h('div', { style: { minHeight: '53px' } })

      if (dataSource.value.length > 0) {
        // 用于没有定义props.grid时, 渲染子元素
        // 没有定义 props.renderItem 或者 renderItem插槽 时, items的元素全为空
        const items = dataSource.value.map((item, index) =>
          renderInnerItem(toRaw(item), index)
        )

        // 用于定义了props.grid时, 渲染子元素
        const childrenList = items.map((child, index) =>
          h('div', { key: listItemsKeys[index], style: colStyle.value }, child)
        )

        // 如果定义了grid, 按照layout布局(el-row)
        // 否则在按照ul布局
        childrenContent = props.grid
          ? h(
              ElRow,
              { gutter: props.grid.gutter },
              { default: () => flattedChildren(childrenList) }
            )
          : h(
              'ul',
              { class: 'g-list-items' },
              { default: () => flattedChildren(items) }
            )
      } else if (!children.length && !isLoading.value) {
        childrenContent = h(ElEmpty, { description: props.locale.emptyText })
      }

      return h('div', { class: classString }, [
        header && h('div', { class: 'g-list-header' }, header),
        withDirectives(
          h(
            'div',
            { class: `${props.prefixCls}-list-container` },
            flattedChildren([
              // 定义renderItem插槽
              childrenContent,
              // 没有定义renderItem插槽
              children
            ])
          ),
          [[vLoading, isLoading.value]]
        ),
        footer && h('div', { class: 'g-list-footer' }, footer)
      ])
    }
  }
}
</script>
<style lang="scss">
@use './index.scss' as *;
</style>
