<template>
  <div class="layout">
    <div class="layout__element"
         style="background: url('img/theme/login-bg.png') center center / 100% no-repeat fixed;">
      <div class="container-fluid" style="padding: 0px;">
        <div class="justify-content-md-center row">
          <div class="col-lg-6">
            <div class="layout__content">
              <div class="header">
                <p>Tạo tài khoản mới</p>
              </div>
              <div class="text-center register">
                <div class="register__title">
                  <p>Cùng tạo 1 tài khoản QuizChii nào</p>
                </div>
                <img alt="icon-signup" class="register__image"
                     src="img/theme/register.png">
                <div class="register-box__input">
                  <div class="input__group">
                    <input v-model="username" class="form-control" name="username" placeholder="Tên đăng nhập"
                           type="text">
                    <p class="input__message__error"><small>{{ usernameError }}</small></p>
                  </div>
                  <div class="input__group">
                    <input v-model="name" class="form-control" name="name" placeholder="Tên của bạn" type="text">
                    <p class="input__message__error"><small>{{ nameError }}</small></p>
                  </div>
                  <div class="input__group">
                    <input v-model="email" class="form-control" name="email"
                           placeholder="Nhập chính xác email của bạn" type="text">
                    <p class="input__message__error"><small>{{ emailError }}</small></p>
                  </div>
                  <div class="input__group">
                    <div style="position: relative;">
                      <input
                          v-model="password"
                          :type="showPassword ? 'text' : 'password'"
                          class="form-control"
                          name="password"
                          placeholder="Tạo mật khẩu (dễ nhớ chút nhé ^^)">
                      <span style="position: absolute; top:0.7em;right:1em;cursor: pointer;"
                            @click="showPassword = !showPassword">
                        <i v-if="showPassword" class="fa fa-eye-slash"></i>
                        <i v-else class="fa fa-eye"></i>
                      </span>
                    </div>
                    <p class="input__message__error"><small>{{ passwordError }}</small></p>
                  </div>
                </div>
                <div class="register__action">
                  <div v-if="!isFormValid" class="button__action button__action--inactive"><p>Tạo tài khoản</p></div>
                  <div v-else class="button__action button__action--active">
                    <div class="button__action__boxActive" @click="register">
                      <p>Tạo tài khoản</p>
                    </div>
                  </div>
                </div>
                <div class="box--redirect"><span>Bạn đã có tài khoản?</span>
                  <RouterLink to="/login">
                    <span class="register__span--redirect">Đăng nhập ngay</span>
                  </RouterLink>
                </div>
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
  name: 'Register',
  data () {
    return {
      store,
      username: '',
      email: '',
      name: '',
      password: '',
      showPassword: false
    }
  },
  computed: {
    usernameError () {
      if (!this.username) return ''
      return this.username.length >= 3 && this.username.length <= 20 ? '' : 'Tên đăng nhập phải có từ 3 đến 20 ký tự'
    },
    emailError () {
      if (!this.email) return ''
      if (this.email.length > 50) return 'Email quá dài'
      const re = /\S+@\S+\.\S+/
      return re.test(this.email) ? '' : 'Email không hợp lệ'
    },
    nameError () {
      if (!this.name) return ''
      return this.name.length >= 6 && this.name.length <= 50 ? '' : 'Tên phải có từ 6 đến 50 ký tự'
    },
    passwordError () {
      if (!this.password) return ''
      return this.password.length >= 6 && this.password.length <= 20 ? '' : 'Mật khẩu phải có từ 6 đến 20 ký tự'
    },
    isFormValid () {
      return this.username && this.email && this.name && this.password
          && !this.usernameError && !this.emailError && !this.nameError && !this.passwordError
    }
  },
  created () {
    if (store.user) {
      this.$router.push('/tests')
    }
  },
  methods: {
    async register () {
      await axios.post(this.$appConfig.apiBaseUrl + `/quiz/auth/register`, {
        username: this.username,
        email: this.email,
        name: this.name,
        password: this.password
      }).then(res => {
        store.displaySuccess('Bạn sẽ được chuyển đến trang đăng nhập')
        setTimeout(() => {
          this.$router.push('/login')
        }, 2000)
      }).catch(err => {
        if (err.response.data.error)
          store.displayError(err.response.data.error)
        else
          store.displayError('Đã có lỗi xảy ra. Vui lòng thử lại')
      })
    },
  }
}
</script>
<style>
</style>
