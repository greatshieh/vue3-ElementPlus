import {
  Fragment,
  Comment,
  Text,
  cloneVNode,
  isVNode,
  ref,
  onMounted,
  onUnmounted
} from 'vue'
import { responsiveObserve } from './responsiveObserve'

export function isEmptyElement(c) {
  return (
    c &&
    (c.type === Comment ||
      (c.type === Fragment && c.children.length === 0) ||
      (c.type === Text && c.children.trim() === ''))
  )
}

export function isStringElement(c) {
  return c && c.type === Text
}

export function filterEmpty(children) {
  const res = []
  children.forEach((child) => {
    if (Array.isArray(child)) {
      res.push(...child)
    } else if (child.type === Fragment) {
      res.push(...filterEmpty(child.children))
    } else {
      res.push(child)
    }
  })
  return res.filter((c) => !isEmptyElement(c))
}

export function cloneElement(
  vnode,
  nodeProps,
  override = true,
  mergeRef = false
) {
  let ele = vnode
  if (Array.isArray(vnode)) {
    ele = filterEmpty(vnode)[0]
  }
  if (!ele) {
    return null
  }
  const node = cloneVNode(ele, nodeProps, mergeRef)

  // cloneVNode内部是合并属性，这里改成覆盖属性
  node.props = override ? { ...node.props, ...nodeProps } : node.props
  //   warning(typeof node.props.class !== 'object', 'class must be string')
  return node
}

export function cloneVNodes(vnodes, nodeProps = {}, override = true) {
  return vnodes.map((vnode) => cloneElement(vnode, nodeProps, override))
}

export const isValid = (value) => {
  return value !== undefined && value !== null && value !== ''
}

export const flattedChildren = (children = [], filterEmpty = true) => {
  const temp = Array.isArray(children) ? children : [children]
  const res = []
  temp.forEach((child) => {
    if (Array.isArray(child)) {
      res.push(...flattedChildren(child, filterEmpty))
    } else if (child && child.type === Fragment) {
      res.push(...flattedChildren(child.children, filterEmpty))
    } else if (child && isVNode(child)) {
      if (filterEmpty && !isEmptyElement(child)) {
        res.push(child)
      } else if (!filterEmpty) {
        res.push(child)
      }
    } else if (isValid(child)) {
      res.push(child)
    }
  })
  return res
}

export function useBreakpoint() {
  const screens = ref({})
  let token = null
  onMounted(() => {
    token = responsiveObserve.subscribe((supportScreens) => {
      screens.value = supportScreens
    })
  })

  onUnmounted(() => {
    responsiveObserve.unsubscribe(token)
  })

  return screens
}
