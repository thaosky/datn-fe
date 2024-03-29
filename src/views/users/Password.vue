<template>
  <div class="content position-r w-100" style="background: #F2F2F2; min-height: calc(100vh - 128px)">
    <div class="container-fluid">
      <div class="row justify-content-center">
        <Title>
          Đổi mật khẩu
        </Title>
        <section class="section section-lg pt-lg-0 w-100" style="margin-top: 200px">
          <div class="py-5 bg-secondary">
            <div class="container">
              <form>
                <div class="register-box__input">
                  <div class="input__group">
                    <label :class="{'text-danger': errors.oldPassword}" for="password">Nhập mật khẩu cũ</label>
                    <div>
                      <div style="position: relative;">
                        <input
                            v-model="oldPassword"
                            :class="{'is-invalid': errors.oldPassword}"
                            :type="showPassword.oldPassword ? 'text' : 'password'"
                            class="form-control"
                            name="password"
                            placeholder="Nhập mật khẩu mới"
                            @focus="errors.oldPassword = ''">
                        <span style="position: absolute; top:0.7em;right:1em;cursor: pointer;"
                              @click="showPassword.oldPassword = !showPassword.oldPassword">
                        <i v-if="showPassword.oldPassword" class="fa fa-eye-slash"></i>
                        <i v-else class="fa fa-eye"></i>
                      </span>
                      </div>
                      <p class="input__message__error"><small>{{ errors.oldPassword }}</small></p>
                    </div>
                  </div>
                  <div class="input__group">
                    <label :class="{'text-danger': errors.newPassword}" for="password">Nhập mật khẩu mới</label>
                    <div>
                      <div style="position: relative;">
                        <input
                            v-model="newPassword"
                            :class="{'is-invalid': errors.newPassword}"
                            :type="showPassword.newPassword ? 'text' : 'password'"
                            class="form-control"
                            name="password"
                            placeholder="Nhập mật khẩu mới"
                            @focus="errors.newPassword = ''">
                        <span style="position: absolute; top:0.7em;right:1em;cursor: pointer;"
                              @click="showPassword.newPassword = !showPassword.newPassword">
                        <i v-if="showPassword.newPassword" class="fa fa-eye-slash"></i>
                        <i v-else class="fa fa-eye"></i>
                      </span>
                      </div>
                      <p class="input__message__error"><small>{{ errors.confirmPassword }}</small></p>
                    </div>
                  </div>
                  <div class="input__group">
                    <label :class="{'text-danger': errors.confirmPassword}" for="password">Nhập lại mật khẩu mới</label>
                    <div>
                      <div style="position: relative;">
                        <input
                            v-model="confirmPassword"
                            :class="{'is-invalid': errors.confirmPassword}"
                            :type="showPassword.confirmPassword ? 'text' : 'password'"
                            class="form-control"
                            name="password"
                            placeholder="Nhập mật khẩu mới"
                            @focus="errors.confirmPassword = ''">
                        <span style="position: absolute; top:0.7em;right:1em;cursor: pointer;"
                              @click="showPassword.confirmPassword = !showPassword.confirmPassword">
                        <i v-if="showPassword.confirmPassword" class="fa fa-eye-slash"></i>
                        <i v-else class="fa fa-eye"></i>
                      </span>
                      </div>
                      <p class="input__message__error"><small>{{ errors.confirmPassword }}</small></p>
                    </div>
                  </div>
                </div>
                <div class="register__action mt-5">
                  <div v-if="!isFormValid"
                       class="button__action button__action--inactive d-flex justify-content-center align-items-center">
                    <p>Cập nhật mật khẩu</p>
                  </div>
                  <div v-else class="button__action button__action--active">
                    <div class="button__action__boxActive d-flex justify-content-center align-items-center"
                         @click="updatePassword">
                      <p>Cập nhật mật khẩu</p>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import { store } from '@/store'
import axios from 'axios'

export default {
  name: 'password',
  data () {
    return {
      store,
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
      showPassword: {
        oldPassword: false,
        newPassword: false,
        confirmPassword: false
      },
      errors: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
    }
  },
  computed: {
    oldPasswordError () {
      if (!this.oldPassword) return 'Bạn cần nhập mật khẩu cũ'
    },
    newPasswordError () {
      if (!this.newPassword) return 'Bạn cần nhập mật khẩu mới'
      if (this.newPassword.length < 6) return 'Mật khẩu phải có ít nhất 6 ký tự'
    },
    confirmPasswordError () {
      if (!this.confirmPassword) return 'Bạn cần nhập lại mật khẩu mới'
      if (this.confirmPassword !== this.newPassword) return 'Mật khẩu nhập lại không khớp'
    },
    isFormValid () {
      return !this.oldPasswordError && !this.newPasswordError && !this.confirmPasswordError
    }
  },
  created () {
  },
  methods: {
    updatePassword () {
      axios.post(this.$appConfig.apiBaseUrl + `/quiz/auth/${this.store.user.id}/change-password`, {
        oldPassword: this.oldPassword,
        newPassword: this.newPassword,
      }, {
        headers: {
          'Authorization': `Bearer ${this.store.token}`
        }
      }).then(res => {
        store.displaySuccess('Câp nhật mật khẩu thành công');
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          localStorage.removeItem('expired');
          this.$router.push('/');
      }).catch(err => {
        if (err.response.data.error)
          store.displayError(err.response.data.error)
        else
          store.displayError('Đã có lỗi xảy ra. Vui lòng thử lại')
      })
    }
  }
}
</script>
