import { defineStore } from 'pinia'

function addVisitedView(state, view) {
  if (state.visitedViews.some((v) => v.path === view.path)) return
  state.visitedViews.push(
    Object.assign({}, view, {
      title: view.meta.title || 'no-name'
    })
  )
}

function addCachedView(state, view) {
  if (state.cachedViews.includes(view.name)) return
  if (!view.meta.noCache) {
    state.cachedViews.push(view.name)
  }
}

function delVisitedView(state, view) {
  for (const [i, v] of state.visitedViews.entries()) {
    if (v.path === view.path) {
      state.visitedViews.splice(i, 1)
      break
    }
  }
}

function delCachedView(state, view) {
  const index = state.cachedViews.indexOf(view.name)
  index > -1 && state.cachedViews.splice(index, 1)
}

function delOtherVisitedViews(state, view) {
  state.visitedViews = state.visitedViews.filter((v) => {
    return v.meta.affix || v.path === view.path
  })
}

// function delOtherCachedViews(state, view) {
//   const index = state.cachedViews.indexOf(view.name)
//   if (index > -1) {
//     state.cachedViews = state.cachedViews.slice(index, index + 1)
//   } else {
//     // if index = -1, there is no cached tags
//     state.cachedViews = []
//   }
// }

function delAllVisitedViews(state) {
  // keep affix tags
  const affixTags = state.visitedViews.filter((tag) => tag.meta.affix)
  state.visitedViews = affixTags
}

function delAllCachedViews(state) {
  state.cachedViews = []
}

function updateVisitedView(state, view) {
  for (let v of state.visitedViews) {
    if (v.path === view.path) {
      v = Object.assign(v, view)
      break
    }
  }
}

const useTagsViewStore = defineStore('tagsview', {
  state: () => {
    return {
      visitedViews: [],
      cachedViews: []
    }
  },

  getters: {},

  actions: {
    addView(view) {
      addVisitedView(this, view)
      this.addCachedView
    },

    addVisitedView(view) {
      addVisitedView(this, view)
    },
    addCachedView(view) {
      addCachedView(this, view)
    },

    delView(view) {
      return new Promise((resolve) => {
        delVisitedView(this, view)
        delCachedView(this, view)
        resolve({
          visitedViews: [...this.visitedViews],
          cachedViews: [...this.cachedViews]
        })
      })
    },

    delVisitedView(view) {
      return new Promise((resolve) => {
        delVisitedView(this, view)
        resolve([...this.visitedViews])
      })
    },

    delCachedView(view) {
      return new Promise((resolve) => {
        delCachedView(this, view)
        resolve([...this.cachedViews])
      })
    },

    delOthersViews(view) {
      return new Promise((resolve) => {
        delOtherVisitedViews(this, view)
        delOthersCachedViews(this, view)
        resolve({
          visitedViews: [...this.visitedViews],
          cachedViews: [...this.cachedViews]
        })
      })
    },

    delOthersVisitedViews(view) {
      return new Promise((resolve) => {
        delOthersVisitedViews(this, view)
        resolve([...this.visitedViews])
      })
    },

    delOthersCachedViews(view) {
      return new Promise((resolve) => {
        delOthersCachedViews(this, view)
        resolve([...this.cachedViews])
      })
    },

    delAllViews(view) {
      return new Promise((resolve) => {
        delAllVisitedViews(this, view)
        delAllCachedViews(this, view)
        resolve({
          visitedViews: [...this.visitedViews],
          cachedViews: [...this.cachedViews]
        })
      })
    },

    delAllVisitedViews() {
      return new Promise((resolve) => {
        delAllVisitedViews(this, view)
        resolve([...this.visitedViews])
      })
    },

    delAllCachedViews() {
      return new Promise((resolve) => {
        delAllCachedViews(this, view)
        resolve([...this.cachedViews])
      })
    },

    updateVisitedView(view) {
      updateVisitedView(this, view)
    }
  }
})

export default useTagsViewStore
