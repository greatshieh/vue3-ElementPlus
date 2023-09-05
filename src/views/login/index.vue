<template>
  <div class="login-container">
    <el-form
      ref="loginFormRef"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      autocomplete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">系统登录</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="usernameRef"
          v-model="loginForm.username"
          placeholder="用户名"
          name="username"
          type="text"
          tabindex="1"
          autocomplete="on"
        />
      </el-form-item>

      <el-tooltip
        :visible="capsTooltip"
        content="大写字母锁定"
        placement="right"
        manual
      >
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="passwordRef"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="密码"
            name="password"
            tabindex="2"
            autocomplete="on"
            @keyup="keyupEvent"
            @blur="capsTooltip = false"
          >
            <span class="show-pwd" @click="showPwd">
              <svg-icon
                :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
              />
            </span>
          </el-input>
        </el-form-item>
      </el-tooltip>

      <el-button
        :loading="loading"
        type="primary"
        style="width: 100%; margin-bottom: 30px"
        @click="handleLogin"
        >登录</el-button
      >

      <div style="position: relative">
        <div class="tips">
          <span>用户名 : superadmin</span>
          <span>密码 : 123456</span>
        </div>
        <div class="tips">
          <span style="margin-right: 18px">用户名 : editor</span>
          <span>密码 : 123456</span>
        </div>

        <el-button
          class="thirdparty-button"
          type="primary"
          @click="showDialog = true"
        >
          第三方登录
        </el-button>
      </div>
    </el-form>

    <el-dialog v-model="showDialog" title="第三方登录" :footer="null">
      本地不能模拟，请结合自己业务进行模拟! ! !
      <br />
      <br />
      <br />
    </el-dialog>
  </div>
</template>

<script setup name="Login">
import { validUsername } from '@/utils/validate'
import { useUserStore } from '@/store'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const validateUsername = (rule, value, callback) => {
  if (!validUsername(value)) {
    return callback(new Error('请输出正确的用户名和密码'))
  } else {
    return callback()
  }
}

const validatePassword = (rule, value, callback) => {
  if (value.length < 6) {
    return callback(new Error('密码不少于6位'))
  } else {
    return callback()
  }
}

const state = reactive({
  loginForm: {
    username: 'superadmin',
    password: '123456'
  },
  loginRules: {
    username: [
      { required: true, trigger: 'blur', validator: validateUsername }
    ],
    password: [{ required: true, trigger: 'blur', validator: validatePassword }]
  },
  passwordType: 'password',
  capsTooltip: false,
  loading: false,
  showDialog: false,
  redirect: undefined,
  otherQuery: {}
})

const {
  loginForm,
  loginRules,
  loading,
  passwordType,
  capsTooltip,
  showDialog,
  redirect,
  otherQuery
} = toRefs(state)

const loginFormRef = ref()
const passwordRef = ref()
const usernameRef = ref()

onMounted(() => {
  if (loginFormRef.value.username === '') {
    usernameRef.value.focus()
  } else if (loginFormRef.value.password === '') {
    passwordRef.value.focus()
  }
})

const getOtherQuery = (query) => {
  return Object.keys(query).reduce((acc, cur) => {
    if (cur !== 'redirect') {
      acc[cur] = query[cur]
    }
    return acc
  }, {})
}

watch(
  route,
  (route) => {
    const query = route.query
    if (query) {
      state.redirect = query.redirect
      state.otherQuery = getOtherQuery(query)
    }
  },
  { immediate: true }
)

function showPwd() {
  if (state.passwordType === 'password') {
    state.passwordType = ''
  } else {
    state.passwordType = 'password'
  }
  nextTick(() => {
    passwordRef.value.focus()
  })
}

function checkCapslock(e) {
  const { key } = e
  state.capsTooltip = key && key.length === 1 && key >= 'A' && key <= 'Z'
}

async function handleLogin() {
  await loginFormRef.value.validate((valid, fields) => {
    if (valid) {
      state.loading = true
      userStore
        .login(loginForm.value)
        .then(() => {
          router.push({
            path: redirect.value || '/',
            query: otherQuery.value
          })
          state.loading = false

          console.log(214, userStore)
        })
        .catch(() => {
          state.loading = false
        })
    } else {
      console.error('error submit!!')
      state.loading = false
    }
  })
}

function keyupEvent(e) {
  if (e.key === 'Enter') {
    handleLogin()
  } else {
    checkCapslock(e)
  }
}
</script>

<style lang="scss">
$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset ant css */
.login-container {
  background: url('@/assets/background.jpg');
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    & .el-input__wrapper {
      display: block;
      background-color: transparent;
      box-shadow: none;
    }

    & input {
      background: transparent !important;
      border: 0px;
      //   -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
