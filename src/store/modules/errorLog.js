import { defineStore } from 'pinia'

const useErrorLogStore = defineStore('errorLog', {
  state: () => {
    return {
      logs: []
    }
  },
  getters: { errorLogs: (state) => state.logs },
  actions: {
    addErrorLog(log) {
      this.logs.push(log)
    },
    clearErrorLog() {
      this.logs.splice(0)
    }
  }
})

export default useErrorLogStore
