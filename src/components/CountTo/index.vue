<template>
  <span>
    {{ displayValue }}
  </span>
</template>

<script setup name="CountTo">
import {
  requestAnimationFrame,
  cancelAnimationFrame
} from './requestAnimationFrame.js'

const props = defineProps({
  startVal: {
    type: Number,
    required: false,
    default: 0
  },
  endVal: {
    type: Number,
    required: false,
    default: 2017
  },
  duration: {
    type: Number,
    required: false,
    default: 3000
  },
  autoplay: {
    type: Boolean,
    required: false,
    default: true
  },
  decimals: {
    type: Number,
    required: false,
    default: 0,
    validator(value) {
      return value >= 0
    }
  },
  decimal: {
    type: String,
    required: false,
    default: '.'
  },
  separator: {
    type: String,
    required: false,
    default: ','
  },
  prefix: {
    type: String,
    required: false,
    default: ''
  },
  suffix: {
    type: String,
    required: false,
    default: ''
  },
  useEasing: {
    type: Boolean,
    required: false,
    default: true
  },
  easingFn: {
    type: Function,
    default(t, b, c, d) {
      return (c * (-Math.pow(2, (-10 * t) / d) + 1) * 1024) / 1023 + b
    }
  }
})

const data = reactive({
  localStartVal: props.startVal,
  displayValue: formatNumber(props.startVal),
  printVal: null,
  paused: false,
  localDuration: props.duration,
  startTime: null,
  timestamp: null,
  remaining: null,
  rAF: null
})

const displayValue = toRef(data, 'displayValue')

const countDown = computed(() => props.startVal > props.endVal)

watch(
  () => props.startVal,
  () => {
    if (props.autoplay) {
      start()
    }
  }
)

watch(
  () => props.endVal,
  () => {
    if (props.autoplay) {
      start()
    }
  }
)

const $emit = defineEmits(['callback', 'mountedCallback'])

onMounted(() => {
  if (props.autoplay) {
    start()
  }

  $emit('mountedCallback')
})

function start() {
  data.localStartVal = props.startVal
  data.startTime = null
  data.localDuration = props.duration
  data.paused = false
  data.rAF = requestAnimationFrame(count)
}

const pauseResume = () => {
  if (data.paused) {
    resume()
    data.paused = false
  } else {
    pause()
    data.paused = true
  }
}

const pause = () => {
  cancelAnimationFrame(data.rAF)
}

const resume = () => {
  data.startTime = null
  data.localDuration = +data.remaining
  data.localStartVal = +data.printVal
  requestAnimationFrame(this.count)
}

const count = (timestamp) => {
  if (!data.startTime) data.startTime = timestamp
  data.timestamp = timestamp
  const progress = timestamp - data.startTime
  data.remaining = data.localDuration - progress

  if (props.useEasing) {
    if (countDown.value) {
      data.printVal =
        data.localStartVal -
        props.easingFn(
          progress,
          0,
          data.localStartVal - props.endVal,
          data.localDuration
        )
    } else {
      data.printVal = props.easingFn(
        progress,
        data.localStartVal,
        props.endVal - data.localStartVal,
        data.localDuration
      )
    }
  } else {
    if (countDown.value) {
      data.printVal =
        data.localStartVal -
        (data.localStartVal - props.endVal) * (progress / data.localDuration)
    } else {
      data.printVal =
        data.localStartVal +
        (props.endVal - data.localStartVal) * (progress / data.localDuration)
    }
  }
  if (countDown.value) {
    data.printVal = data.printVal < props.endVal ? props.endVal : data.printVal
  } else {
    data.printVal = data.printVal > props.endVal ? props.endVal : data.printVal
  }

  data.displayValue = formatNumber(data.printVal)
  if (progress < data.localDuration) {
    data.rAF = requestAnimationFrame(count)
  } else {
    $emit('callback')
  }
}
function isNumber(val) {
  return !isNaN(parseFloat(val))
}
function formatNumber(num) {
  num = num.toFixed(props.decimals)
  num += ''
  const x = num.split('.')
  let x1 = x[0]
  const x2 = x.length > 1 ? props.decimal + x[1] : ''
  const rgx = /(\d+)(\d{3})/
  if (props.separator && !isNumber(props.separator)) {
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, '$1' + props.separator + '$2')
    }
  }
  return props.prefix + x1 + x2 + props.suffix
}

onUnmounted(() => cancelAnimationFrame(data.rAF))

defineExpose({ start, pauseResume })
</script>
