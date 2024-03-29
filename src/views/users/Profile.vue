<template>
  <div class="content position-r w-100" style="background: #F2F2F2; min-height: calc(100vh - 128px)">
    <div class="container-fluid">
      <div class="row justify-content-center">
        <Title>
          Cài đặt tài khoản
        </Title>
        <section class="section section-lg pt-lg-0 w-100" style="margin-top: 200px">
          <div class="py-5 bg-secondary">
            <div class="container">
              <form>
                <div class="register-box__input">
                  <div class="input__group">
                    <label>Tên đăng nhập</label>
                    <div class="">{{ username }}</div>
                  </div>
                  <div class="input__group">
                    <label>Tên hiển thị</label>
                    <input v-model="name" class="form-control" name="name" placeholder="Tên của bạn" type="text">
                    <p class="input__message__error"><small>{{ nameError }}</small></p>
                  </div>
                  <div class="input__group">
                    <label>Email</label>
                    <input v-model="email" class="form-control" name="email"
                           placeholder="Nhập chính xác email của bạn" type="text">
                    <p class="input__message__error"><small>{{ emailError }}</small></p>
                  </div>
                </div>
                <div class="register__action mt-5">
                  <div v-if="!isFormValid"
                       class="button__action button__action--inactive d-flex justify-content-center align-items-center">
                    <p>Cập nhật tài khoản</p>
                  </div>
                  <div v-else class="button__action button__action--active">
                    <div class="button__action__boxActive d-flex justify-content-center align-items-center"
                         @click="updateUser">
                      <p>Cập nhật tài khoản</p>
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
  name: 'profile',
  data () {
    return {
      store,
      username: '',
      email: '',
      name: '',
    }
  },
  computed: {
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
    isFormValid () {
      return this.username && this.email && this.name
          && !this.emailError && !this.nameError
    }
  },
  created () {
    this.username = this.store.user.username
    this.name = this.store.user.name
    this.email = this.store.user.email
  },
  methods: {
    updateUser () {
      axios.put(this.$appConfig.apiBaseUrl + `/quiz/api/users/${this.store.user.id}`, {
        email: this.email,
        name: this.name,
        active: 1
      }, {
        headers: {
          'Authorization': `Bearer ${this.store.token}`
        }
      }).then(res => {
        store.displaySuccess('Câp nhật thông tin thành công')
        this.refreshUserInfo()
      }).catch(err => {
        if (err.response.data.error)
          store.displayError(err.response.data.error)
        else
          store.displayError('Đã có lỗi xảy ra. Vui lòng thử lại')
      })
    },
    refreshUserInfo () {
      axios.get(this.$appConfig.apiBaseUrl + `/quiz/api/users/${this.store.user.id}`, {
        headers: {
          'Authorization': `Bearer ${this.store.token}`
        }
      }).then(res => {
        const roles = store.user.roles
        const id = store.user.id
        store.user = res.data.data
        store.user.roles = roles
        store.user.id = id
        this.username = this.store.user.username
        this.name = this.store.user.name
        this.email = this.store.user.email
        localStorage.setItem('user', JSON.stringify(store.user))
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
