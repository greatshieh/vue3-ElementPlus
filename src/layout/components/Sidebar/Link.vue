<template>
  <component :is="type" v-bind="linkProps(to)">
    <slot />
  </component>
</template>

<script setup name="Link">
import { isExternal } from '@/utils/validate'

const props = defineProps({
  to: {
    type: String,
    required: true
  }
})

const is_external = computed(() => isExternal(props.to))
const type = computed(() => {
  if (is_external.value) {
    return 'a'
  }
  return 'router-link'
})

function linkProps(to) {
  if (is_external.value) {
    return {
      href: to,
      target: '_blank',
      rel: 'noopener'
    }
  }
  return {
    to: to
  }
}
</script>
