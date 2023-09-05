import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import { defineStore } from 'pinia'
import usePermissionStore from './permission'
import useTagsViewStore from './tagsView'

const useUserStore = defineStore('user', {
  state: () => {
    return {
      token: getToken(),
      userName: '',
      nickName: '',
      email: '',
      phone: '',
      avatar: '',
      introduction: '',
      authorityName: ''
    }
  },
  //   getters: {},
  actions: {
    // user login
    login(userInfo) {
      const { username, password } = userInfo
      return new Promise((resolve, reject) => {
        login({ username: username.trim(), password: password })
          .then((response) => {
            const { data } = response
            this.token = data.token
            setToken(data.token)
            resolve()
          })
          .catch((error) => {
            reject(error)
          })
      })
    },

    // get user info
    getInfo() {
      return new Promise((resolve, reject) => {
        getInfo()
          .then((response) => {
            const { data } = response

            if (!data) {
              reject('Verification failed, please Login again.')
            }

            const {
              userName,
              nickName,
              email,
              phone,
              avatar,
              introduction,
              authority
            } = data

            // authorityName must be a non-zero int
            if (authority.authorityName === 0) {
              reject('getInfo: authorityName must be non-null!')
            }
            this.userName = userName
            this.nickName = nickName
            this.email = email
            this.phone = phone
            this.avatar = avatar
            this.introduction = introduction
            this.authorityName = authority.authorityName

            resolve(data)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },

    // user logout
    logout() {
      const tagsView = useTagsViewStore()
      return new Promise((resolve, reject) => {
        logout(this.token)
          .then(() => {
            this.token = ''
            this.authorityName = ''
            removeToken()
            resetRouter()

            // reset visited views and cached views
            // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
            tagsView.delAllViews(null)

            resolve()
          })
          .catch((error) => {
            reject(error)
          })
      })
    },

    // remove token
    resetToken() {
      return new Promise((resolve) => {
        this.token = ''
        this.authorityName = 0
        removeToken()
        resolve()
      })
    },

    // dynamically modify permissions
    async changeAuthority(role) {
      const token = role + '-token'

      this.token = token
      setToken(token)

      const { authorityName } = await this.getInfo

      resetRouter()

      // generate accessible routes map based on authorityName
      const permission = usePermissionStore()
      const accessRoutes = await permission.generateRoutes(authorityName)
      // dynamically add accessible routes
      accessRoutes.forEach((item) => {
        router.addRoute(item)
      })
      const tagsView = useTagsViewStore()
      // reset visited views and cached views
      tagsView.delAllViews(null)
    }
  }
})

export default useUserStore
