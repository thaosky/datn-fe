<template>
  <div class="layout">
    <div class="layout__element"
         style="background: url('img/theme/login-bg.png') center no-repeat; background-size: cover;">
      <div class="container-fluid" style="padding: 0px;">
        <div class="justify-content-md-center row">
          <div class="col-lg-6">
            <div class="layout__content">
              <div class="header">
                <p>Đăng nhập</p>
              </div>
              <div class="text-center login">
                <div class="login__boxTitle"><p>Đăng nhập tài khoản QuizChii</p></div>
                <div class="login__boxInput">
                  <div class="input__group">
                    <input
                        v-model="username"
                        class="form-control "
                        placeholder="Nhập tên đăng nhập"
                        type="text">
                    <p class="input__message__error">
                      <small>{{
                          username && username.length < 4 ? 'Tên đăng nhập phải có ít nhất 4 ký tự' : ''
                        }}</small>
                    </p>
                  </div>
                  <div class="input__group">
                    <div style="position: relative;">
                      <input
                          v-model="password"
                          class="form-control"
                          minlength="4"
                          placeholder="Nhập chính xác mật khẩu của bạn"
                          type="password"/>
                    </div>
                    <p class="input__message__error">
                      <small>{{ password && password.length < 4 ? 'Mật khẩu phải có ít nhất 4 ký tự' : '' }}</small>
                    </p>
                  </div>
                </div>
                <div class="login__action">
                  <div v-if="password.length < 4 || username.length < 4"
                       class="button__action button__action--inactive">
                    <p>Đăng nhập</p>
                  </div>
                  <div v-else class="button__action button__action--active">
                    <div class="button__action__boxActive" @click="login">
                      <p>Đăng nhập</p>
                    </div>
                  </div>
                </div>
                <p style="font-weight: bold;"><span>Chưa có tài khoản? </span>
                  <RouterLink to="/register">
                    <span class="login__title__register">Tạo tài khoản học mới</span>
                  </RouterLink>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import { store } from '@/store'

export default {
  name: 'login',
  data () {
    return {
      username: '',
      password: '',
      store
    }
  },
  created () {
    if (store.user) {
      this.$router.push('/tests')
    }
  },
  methods: {
    async login () {
      await axios.post(this.$appConfig.apiBaseUrl + '/quiz/auth/login', {
        username: this.username,
        password: this.password
      }).then(res => {
        localStorage.setItem('token', res.data.accessToken)
        localStorage.setItem('user', JSON.stringify(res.data))
        localStorage.setItem('expired', Date.now() + 86399000)
        this.$router.push('/tests')
      }).catch(err => {
        const error = err.response.data.error || err.message
        store.displayError(error)
      })
    }
  }
}
</script>
<style>
</style>
