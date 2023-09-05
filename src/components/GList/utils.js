import { watchEffect, shallowRef } from 'vue'

export function eagerComputed(fn) {
  const result = shallowRef()
  watchEffect(
    () => {
      result.value = fn()
    },
    {
      flush: 'sync' // needed so updates are immediate.
    }
  )

  return result
}
