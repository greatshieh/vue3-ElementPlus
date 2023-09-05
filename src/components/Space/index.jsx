import { defineComponent, computed, ref, watch } from 'vue'
import { filterEmpty } from './util'
import './index.scss'

const spaceSize = {
  small: 8,
  middle: 16,
  large: 24
}

function getNumberSize(size) {
  return typeof size === 'string' ? spaceSize[size] : size || 0
}

const Space = defineComponent({
  name: 'Space',
  props: {
    size: {
      type: [String, Number, Array]
    },
    direction: {
      default: 'horizontal',
      type: String,
      validator: (value) => {
        return ['horizontal', 'vertical'].indexOf(value) > -1
      }
    },
    align: {
      type: String,
      validator: (value) => {
        return ['start', 'end', 'center', 'baseline'].indexOf(value) > -1
      }
    },
    wrap: { type: Boolean, default: undefined }
  },
  slots: ['split'],
  setup(props, { slots }) {
    const size = computed(() => props.size || 'small')
    const horizontalSize = ref()
    const verticalSize = ref()
    watch(
      size,
      () => {
        ;[horizontalSize.value, verticalSize.value] = (
          Array.isArray(size.value) ? size.value : [size.value, size.value]
        ).map((item) => getNumberSize(item))
      },
      { immediate: true }
    )

    const mergedAlign = computed(() =>
      props.align === undefined && props.direction === 'horizontal'
        ? 'center'
        : props.align
    )
    const cn = computed(() => {
      if (mergedAlign.value) {
        return `space space-${props.direction} space-align-${mergedAlign.value}`
      }

      return `space space-${props.direction} `
    })

    const style = computed(() => {
      const gapStyle = {}

      gapStyle.columnGap = `${horizontalSize.value}px`
      gapStyle.rowGap = `${verticalSize.value}px`

      return {
        ...gapStyle,
        ...(props.wrap && {
          flexWrap: 'wrap',
          marginBottom: `${-verticalSize.value}px`
        })
      }
    })

    return () => {
      const items = filterEmpty(slots.default())
      const len = items.length

      if (len === 0) {
        return null
      }

      const itemClassName = 'space-item'
      return (
        <div class={cn.value} style={style.value}>
          {items.map((child) => {
            return <div class={itemClassName}>{child}</div>
          })}
        </div>
      )
    }
  }
})

export default Space
