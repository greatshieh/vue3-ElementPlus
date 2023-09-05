/*
 ! antdv设置
 * export const responsiveArray = ['xxxl', 'xxl', 'xl', 'lg', 'md', 'sm', 'xs']
 * export const responsiveMap = {
 * xs: '(max-width: 575px)',
 * sm: '(min-width: 576px)',
 * md: '(min-width: 768px)',
 * lg: '(min-width: 992px)',
 * xl: '(min-width: 1200px)',
 * xxl: '(min-width: 1600px)',
 * xxxl: '(min-width: 2000px)'
 * }
 */

//  ! 保持和 elementplus 的Layout布局一致
export const responsiveMap = {
  xs: '(max-width: 767px)',
  sm: '(min-width: 768px)',
  md: '(min-width: 992px)',
  lg: '(min-width: 1200px)',
  xl: '(min-width: 1920px)'
}

const subscribers = new Map()
let subUid = -1
let screens = {}

export const responsiveObserve = {
  matchHandlers: {},
  dispatch(pointMap) {
    screens = pointMap
    subscribers.forEach((func) => func(screens))
    return subscribers.size >= 1
  },
  subscribe(func) {
    if (!subscribers.size) this.register()
    subUid += 1
    subscribers.set(subUid, func)
    func(screens)
    return subUid
  },
  unsubscribe(token) {
    subscribers.delete(token)
    if (!subscribers.size) this.unregister()
  },
  unregister() {
    Object.keys(responsiveMap).forEach((screen) => {
      const matchMediaQuery = responsiveMap[screen]
      const handler = this.matchHandlers[matchMediaQuery]
      handler.mql.removeListener(handler?.listener)
    })
    subscribers.clear()
  },
  register() {
    Object.keys(responsiveMap).forEach((screen) => {
      const matchMediaQuery = responsiveMap[screen]
      const listener = ({ matches }) => {
        this.dispatch({
          ...screens,
          [screen]: matches
        })
      }
      const mql = window.matchMedia(matchMediaQuery)
      mql.addEventListener('change', listener)
      this.matchHandlers[matchMediaQuery] = {
        mql,
        listener
      }

      listener(mql)
    })
  }
}
