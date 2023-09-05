<script>
import { filterEmpty } from '@/utils/props-util'
const spaceSize = {
  small: 8,
  middle: 16,
  large: 24
}
function getNumberSize(size) {
  return typeof size === 'string' ? spaceSize[size] : size || 0
}
export default {
  name: 'Space',
  props: {
    size: {
      default: 'small',
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
      default: 'center',
      type: String,
      validator: (value) => {
        return ['start', 'end', 'center', 'baseline'].indexOf(value) > -1
      }
    },
    wrap: { type: Boolean, default: undefined }
  },
  setup(props, { slots }) {
    const size = ref(props.size)
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

    return () =>
      h(
        'div',
        { class: cn.value, style: style.value },
        filterEmpty(slots.default()).map((e) => {
          return h('div', { class: 'space-item' }, e)
        })
      )
  }
}
</script>

<style lang="scss">
.space {
  display: inline-flex;

  &-vertical {
    flex-direction: column;
  }

  &-align {
    &-center {
      align-items: center;
    }

    &-start {
      align-items: flex-start;
    }

    &-end {
      align-items: flex-end;
    }

    &-baseline {
      align-items: baseline;
    }
  }
}

.space-item {
  &:empty {
    display: none;
  }
}
</style>
