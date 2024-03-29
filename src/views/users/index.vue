<template>
  <div class="content position-r w-100" style="background: #F2F2F2; min-height: calc(100vh - 128px)">
    <div class="container-fluid">
      <div class="row justify-content-center">
        <Title>
          Danh sách người dùng
        </Title>
        <section class="section section-lg pt-lg-0 w-100" style="margin-top: 200px">
          <div class="container">
            <div class="d-flex justify-content-center my-3">
              <SearchCustom :searchContent="'Tìm kiếm theo username, tên, hoặc email'" :tags="[]" @submit="searchUsers"></SearchCustom>
            </div>
            <div class="row mb-3" style="justify-content: end">
              <button class="btn btn-success" @click="createModal.show=true">Thêm user</button>
            </div>

            <div class="row justify-content-center bg-white">
              <a-spin :spinning="loading" class="w-100" size="large">
                <table v-if="users.length" class="table table-striped">
                  <thead>
                  <tr>
                    <th scope="col">Username</th>
                    <th scope="col">Tên người dùng</th>
                    <th scope="col">Email</th>
                    <th scope="col">Vai trò</th>
                    <th scope="col">Trạng thái</th>
                    <th scope="col"></th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="user in users" :key="user.username">
                    <td>{{ user.username }}</td>
                    <td>{{ user.name }}</td>
                    <td>{{ user.email }}</td>
                    <td> {{ getRoles(user.role) }}</td>
                    <td>{{ user.active ? 'Đang hoạt động' : 'Đã khóa' }}</td>
                    <td>
                      <button class="btn btn-sm btn-primary" @click="showUpdateModal(user)">Sửa</button>
                    </td>
                  </tr>
                  </tbody>
                </table>
                <SearchNoData v-else></SearchNoData>
              </a-spin>
              <div v-if="totalPage === 0" class="text-center">
                <div class="spinner-border text-primary" role="status">
                  <span class="sr-only">Loading...</span>
                </div>
              </div>
              <div v-if="totalPage > 1">
                <base-pagination v-model="pageNo" :page-count="totalPage" :per-page="pageSize"
                                 :total="total"></base-pagination>
              </div>
            </div>
          </div>
        </section>
        <Modal :show="createModal.show" @close="createModal.show = false">
          <template v-slot:header>
            <h4>Tạo người dùng</h4>
          </template>
          <template>
            <form action="">
              <div class="form-group required-field">
                <label :class="{'text-danger': createModal.errors.username}" for="username">Tên đăng nhập</label>
                <input v-model="createModal.username" :class="{'is-invalid': createModal.errors.username}"
                       class="form-control"
                       placeholder="Nhập tên đăng nhập" type="text"
                       @focus="createModal.errors.username = ''">
                <p class="input__message__error"><small>{{ createModal.errors.username }}</small></p>
              </div>
              <div class="form-group required-field">
                <label :class="{'text-danger': createModal.errors.name}" for="name">Tên hiển thị</label>
                <input v-model="createModal.name" :class="{'is-invalid': createModal.errors.name}" class="form-control"
                       placeholder="Nhập tên hiển thị" type="text"
                       @focus="createModal.errors.name = ''">
                <p class="input__message__error"><small>{{ createModal.errors.name }}</small></p>
              </div>
              <div class="form-group required-field">
                <label :class="{'text-danger': createModal.errors.email}" for="email">Email</label>
                <input v-model="createModal.email" :class="{'is-invalid': createModal.errors.email}"
                       class="form-control"
                       placeholder="Nhập email" type="email"
                       @focus="createModal.errors.email = ''">
                <p class="input__message__error"><small>{{ createModal.errors.email }}</small></p>
              </div>
              <div class="form-group required-field">
                <label :class="{'text-danger': createModal.errors.password}" for="password">Mật khẩu</label>
                <div>
                  <div style="position: relative;">
                    <input
                      v-model="createModal.password"
                      :class="{'is-invalid': createModal.errors.password}"
                      :type="createModal.showPassword ? 'text' : 'password'"
                      class="form-control"
                      name="password"
                      placeholder="Nhập mật khẩu"
                      @focus="createModal.errors.password = ''">
                    <span style="position: absolute; top:0.7em;right:1em;cursor: pointer;"
                          @click="createModal.showPassword = !createModal.showPassword">
                        <i v-if="createModal.showPassword" class="fa fa-eye-slash"></i>
                        <i v-else class="fa fa-eye"></i>
                      </span>
                  </div>
                  <p class="input__message__error"><small>{{ createModal.errors.password }}</small></p>
                </div>
              </div>
              <div class="form-group">
                <label for="role">Vai trò</label>
                <select v-model="createModal.role" class="form-control">
                  <option value="admin">Quản trị viên</option>
                  <option value="user">Người dùng</option>
                </select>
              </div>
            </form>
          </template>
          <template v-slot:footer>
            <button class="btn btn-secondary" type="button" @click="createModal.show = false">Đóng</button>
            <button class="btn btn-success" type="button" @click="createUser">Tạo</button>
          </template>
        </Modal>
        <Modal :show="updateModal.show" @close="updateModal.show = false">
          <template v-slot:header>
            <h4>Cập nhật người dùng</h4>
          </template>
          <template>
            <form action="">
              <div class="form-group">
                <label for="username">Tên đăng nhập</label>
                <div id="username" class=""> {{ updateModal.username }}</div>
              </div>
              <div class="form-group required-field">
                <label :class="{'text-danger': updateModal.errors.name}" for="name">Tên hiển thị</label>
                <input v-model="updateModal.name" :class="{'is-invalid': updateModal.errors.name}" class="form-control"
                       placeholder="Nhập tên hiển thị" type="text"
                       @focus="updateModal.errors.name = ''">
                <p class="input__message__error"><small>{{ updateModal.errors.name }}</small></p>
              </div>
              <div class="form-group required-field">
                <label :class="{'text-danger': updateModal.errors.email}" for="email">Email</label>
                <input v-model="updateModal.email" :class="{'is-invalid': updateModal.errors.email}"
                       class="form-control"
                       placeholder="Nhập email" type="email"
                       @focus="updateModal.errors.email = ''">
                <p class="input__message__error"><small>{{ updateModal.errors.email }}</small></p>
              </div>
              <div class="form-group">
                <label :class="{'text-danger': updateModal.errors.password}" for="password">Mật khẩu</label>
                <div>
                  <input id="changePass" v-model="updateModal.hasNewPassword" type="checkbox">&nbsp;
                  <label for="changePass">Cập nhật mật khẩu</label>
                  <div v-if="updateModal.hasNewPassword" style="position: relative;margin-top: 10px">
                    <input
                      v-model="updateModal.password"
                      :class="{'is-invalid': updateModal.errors.password}"
                      :type="updateModal.showPassword ? 'text' : 'password'"
                      class="form-control"
                      name="password"
                      placeholder="Nhập mật khẩu mới"
                      @focus="updateModal.errors.password = ''">
                    <span style="position: absolute; top:0.7em;right:1em;cursor: pointer;"
                          @click="updateModal.showPassword = !updateModal.showPassword">
                        <i v-if="updateModal.showPassword" class="fa fa-eye-slash"></i>
                        <i v-else class="fa fa-eye"></i>
                      </span>
                  </div>
                  <p class="input__message__error"><small>{{ updateModal.errors.password }}</small></p>
                </div>
              </div>
              <div class="form-group">
                <label for="active">Trạng thái</label>
                <select v-model="updateModal.active" class="form-control" :disabled="store.user.id === updateModal.id">
                  <option value="1">Đang hoạt động</option>
                  <option value="0">Đã khóa</option>
                </select>
              </div>
            </form>
          </template>
          <template v-slot:footer>
            <button class="btn btn-secondary" type="button" @click="updateModal.show = false">Đóng</button>
            <button class="btn btn-primary" type="button" @click="updateUser">Sửa</button>
          </template>
        </Modal>
      </div>
    </div>
  </div>
</template>

<script>
import {store} from '@/store'
import SearchCustom from '@/components/SearchCustom.vue'
import axios from 'axios'
import Modal from '@/components/Modal.vue'

export default {
  name: 'users',
  components: {Modal, SearchCustom},
  data() {
    return {
      store,
      users: [],
      pageNo: this.$route.query.page || 1,
      pageSize: this.$route.query.size || 5,
      sortDir: this.$route.query.sortDir || 'DESC',
      sortName: this.$route.query.sortName || 'id',
      keyword: this.$route.query.keyword || '',
      totalPage: 0,
      total: 0,
      createModal: {
        show: false,
        username: '',
        name: '',
        email: '',
        password: '',
        hasNewPassword: true,
        role: 'admin',
        showPassword: false,
        errors: {
          username: '',
          name: '',
          email: '',
          password: ''
        }
      },
      updateModal: {
        show: false,
        id: '',
        username: '',
        name: '',
        email: '',
        password: '',
        hasNewPassword: false,
        showPassword: false,
        active: false,
        errors: {
          username: '',
          name: '',
          email: '',
          password: ''
        }
      },
      loading: false,
    }
  },
  async created() {
    await this.searchUsers('', '')
  },
  methods: {
    getRoles(roles) {
      if (!roles) return 'Người dùng'
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === 'ROLE_ADMIN') {
          return 'Quản trị viên'
        }
      }
      return 'Người dùng'
    },
    async searchUsers(tagId, keyword) {
      this.keyword = keyword
      this.getUsers()
    },
    async getUsers() {
      let url = this.$appConfig.apiBaseUrl + `/quiz/api/users?pageNo=${this.pageNo - 1}&pageSize=${this.pageSize}&sortDir=${this.sortDir}&sortName=${this.sortName}`
      if (this.keyword) {
        url += `&name=${this.keyword}`
      }
      this.loading = true
      axios.get(url, {
        headers: {
          'Authorization': `Bearer ${store.token}`
        }
      }).then(res => {
        this.users = res.data.data.items
        this.totalPage = res.data.data.totalPage
        this.total = res.data.data.totalElements
      }).catch(err => {
        store.displayError('Có lỗi xảy ra. Vui lòng thử lại')
      }).finally(() => {
        this.loading = false
      })
    },
    validateForm(formData) {
      const {username, name, email, password, hasNewPassword} = formData
      if (!username) {
        this.createModal.errors.username = 'Vui lòng nhập tên đăng nhập'
        return false
      }
      if (username.length < 4) {
        this.createModal.errors.username = 'Tên đăng nhập phải có ít nhất 4 ký tự'
        return false
      }
      if (!name) {
        this.createModal.errors.name = 'Vui lòng nhập tên'
        return false
      }
      if (name.length < 4) {
        this.createModal.errors.name = 'Tên phải có ít nhất 4 ký tự'
        return false
      }
      if (!email) {
        this.createModal.errors.email = 'Vui lòng nhập email'
        return false
      }
      // using regex to check email
      const regex = /\S+@\S+\.\S+/
      if (!regex.test(email)) {
        this.createModal.errors.email = 'Email không hợp lệ'
        return false
      }
      if (hasNewPassword) {
        if (!password) {
          this.createModal.errors.password = 'Vui lòng nhập mật khẩu'
          return false
        }
        if (password.length < 6) {
          this.createModal.errors.password = 'Mật khẩu phải có ít nhất 6 ký tự'
          return false
        }
      }
      return true
    },
    createUser() {
      if (!this.validateForm(this.createModal)) return
      const {username, name, email, password, role} = this.createModal
      axios.post(this.$appConfig.apiBaseUrl + '/quiz/api/users', {
        username,
        name,
        email,
        password,
        role: [role]
      }, {
        headers: {
          'Authorization': `Bearer ${store.token}`
        }
      }).then(res => {
        this.createModal.show = false
        this.resetCreateModal()
        this.getUsers()
        store.displaySuccess('Tạo người dùng thành công')
      }).catch(err => {
        if (err.response.status === 400) {
          const error = err.response.data.error
          if (error) {
            if (error.toUpperCase().includes('USERNAME')) {
              this.createModal.errors.username = error
            } else if (error.toUpperCase().includes('EMAIL')) {
              this.createModal.errors.email = error
            } else if (error.toUpperCase().includes('PASSWORD')) {
              this.createModal.errors.password = error
            } else if (error.toUpperCase().includes('NAME')) {
              this.createModal.errors.name = error
            } else {
              this.createModal.errors.username = error
            }
          }
        } else {
          this.createModal.errors.username = 'Có lỗi xảy ra. Vui lòng thử lại'
        }
      })
    },
    resetCreateModal() {
      this.createModal.username = ''
      this.createModal.name = ''
      this.createModal.email = ''
      this.createModal.password = ''
      this.createModal.role = 'user'
      this.createModal.showPassword = false
      this.createModal.errors.username = ''
      this.createModal.errors.name = ''
      this.createModal.errors.email = ''
      this.createModal.errors.password = ''
    },
    showUpdateModal(user) {
      this.updateModal.id = user.id
      this.updateModal.username = user.username
      this.updateModal.name = user.name
      this.updateModal.email = user.email
      this.updateModal.active = user.active
      this.updateModal.showPassword = false
      this.updateModal.hasNewPassword = false
      this.updateModal.errors.username = ''
      this.updateModal.errors.name = ''
      this.updateModal.errors.email = ''
      this.updateModal.errors.password = ''
      this.updateModal.show = true
    },
    updateUser() {
      if (!this.validateForm(this.updateModal)) return
      const {id, name, email, password, hasNewPassword, active} = this.updateModal
      let data = {
        name,
        email,
        active: parseInt(active)
      }
      if (hasNewPassword) {
        data.password = password
      }
      axios.put(this.$appConfig.apiBaseUrl + `/quiz/api/users/${id}`, data, {
        headers: {
          'Authorization': `Bearer ${store.token}`
        }
      }).then(res => {
        this.updateModal.show = false
        this.getUsers()
        store.displaySuccess('Cập nhật người dùng thành công')
      }).catch(err => {
        if (err.response.status === 400) {
          const error = err.response.data.error
          if (error) {
            if (error.toUpperCase().includes('EMAIL')) {
              this.updateModal.errors.email = error
            } else if (error.toUpperCase().includes('PASSWORD')) {
              this.updateModal.errors.password = error
            } else if (error.toUpperCase().includes('NAME')) {
              this.updateModal.errors.name = error
            } else {
              this.updateModal.errors.username = error
            }
          }
        } else {
          this.update.errors.name = 'Có lỗi xảy ra. Vui lòng thử lại'
        }
      })
    }
  },
  watch: {
    pageNo(val) {
      this.getUsers()
    },
  },
}
</script>
