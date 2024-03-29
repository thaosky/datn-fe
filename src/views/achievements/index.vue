<template>

  <div class="content position-r w-100" style="background: #F2F2F2; min-height: calc(100vh - 128px)">
    <div class="container-fluid">
      <div class="row justify-content-center">
        <Title>
          {{ store.isAdmin() ? 'Danh sách cài đặt thành tựu' : 'Danh sách thành tựu' }}
        </Title>
        <section class="section section-lg pt-lg-0 w-100" style="margin-top: 200px">
          <div class="container">
            <div v-if="store.isAdmin()" class="d-flex justify-content-center my-3">
              <SearchCustom
                :searchContent="'Tìm kiếm theo tên thành tựu'"
                :tags="[]"
                @submit="searchAchievements"/>
            </div>
            <div class="row mb-3" style="justify-content: end">
              <button v-if="store.isAdmin()" class="btn btn-success" @click="createModal.show=true">
                Thêm thành tựu
              </button>
            </div>
            <div class="row justify-content-center bg-white">
              <a-spin :spinning="loading" class="w-100" size="large">
                <table v-if="achievements.length" class="table table-striped">
                  <thead>
                  <tr>
                    <th scope="col">Tên thành tựu</th>
                    <th scope="col">Thông báo</th>
                    <th v-if="store.isAdmin()" scope="col">Số ngày liên tục</th>
                    <th v-if="store.isAdmin()" scope="col"></th>
                    <th v-if="store.isLoggedIn() && !store.isAdmin()" scope="col">Thời gian đạt được</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="achievement in achievements" :key="achievement.id">
                    <td>{{ achievement.name }}</td>
                    <td>{{ achievement.message }}</td>
                    <td v-if="store.isAdmin()">{{ achievement.daysStreak }}</td>
                    <td v-if="store.isAdmin()">
                      <button class="btn btn-sm btn-primary" @click="showUpdateModal(achievement)">Sửa</button>
                      <button class="btn btn-sm btn-danger" @click="showDeleteAchievementModal(achievement.id)">Xóa
                      </button>
                    </td>
                    <td v-if="store.isLoggedIn() && !store.isAdmin()">{{ achievement.timeAchieved }}</td>
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
            <h4>Tạo thành tựu</h4>
          </template>
          <template>
            <form action="">
              <div class="form-group required-field">
                <label :class="{'text-danger': createModal.errors.name}" for="name">Tên thành tựu</label>
                <input v-model="createModal.name" :class="{'is-invalid': createModal.errors.name}"
                       class="form-control"
                       placeholder="Nhập tên thành tựu" type="text"
                       @focus="createModal.errors.name = ''">
                <p class="input__message__error"><small>{{ createModal.errors.name }}</small></p>
              </div>
              <div class="form-group required-field">
                <label :class="{'text-danger': createModal.errors.message}" for="message">Thông báo</label>
                <input v-model="createModal.message" :class="{'is-invalid': createModal.errors.message}"
                       class="form-control"
                       placeholder="Nhập thông báo" type="text"
                       @focus="createModal.errors.message = ''">
                <p class="input__message__error"><small>{{ createModal.errors.message }}</small></p>
              </div>
              <div class="form-group required-field">
                <label :class="{'text-danger': createModal.errors.daysStreak}" for="daysStreak">Số ngày liên tục</label>
                <input v-model="createModal.daysStreak" :class="{'is-invalid': createModal.errors.daysStreak}"
                       class="form-control"
                       placeholder="Nhập số ngày liên tục" type="number"
                       @focus="createModal.errors.daysStreak = ''">
                <p class="input__message__error"><small>{{ createModal.errors.daysStreak }}</small></p>
              </div>
            </form>
          </template>
          <template v-slot:footer>
            <button class="btn btn-secondary" type="button" @click="createModal.show = false">Đóng</button>
            <button class="btn btn-success" type="button" @click="createAchievement">Tạo</button>
          </template>
        </Modal>
        <Modal :show="updateModal.show" @close="updateModal.show = false">
          <template v-slot:header>
            <h4>Cập nhật thành tựu</h4>
          </template>
          <template>
            <form action="">
              <div class="form-group required-field">
                <label :class="{'text-danger': updateModal.errors.name}" for="name">Tên thành tựu</label>
                <input v-model="updateModal.name" :class="{'is-invalid': updateModal.errors.name}"
                       class="form-control"
                       placeholder="Nhập tên thành tựu" type="text"
                       @focus="updateModal.errors.name = ''">
                <p class="input__message__error"><small>{{ updateModal.errors.name }}</small></p>
              </div>
              <div class="form-group required-field">
                <label :class="{'text-danger': updateModal.errors.message}" for="message">Thông báo</label>
                <input v-model="updateModal.message" :class="{'is-invalid': updateModal.errors.message}"
                       class="form-control"
                       placeholder="Nhập thông báo" type="text"
                       @focus="updateModal.errors.message = ''">
                <p class="input__message__error"><small>{{ updateModal.errors.message }}</small></p>
              </div>
              <div class="form-group required-field">
                <label :class="{'text-danger': updateModal.errors.daysStreak}" for="daysStreak">Số ngày liên tục</label>
                <input v-model="updateModal.daysStreak" :class="{'is-invalid': updateModal.errors.daysStreak}"
                       class="form-control"
                       placeholder="Nhập số ngày liên tục" type="number"
                       @focus="updateModal.errors.daysStreak = ''">
                <p class="input__message__error"><small>{{ updateModal.errors.daysStreak }}</small></p>
              </div>
            </form>
          </template>
          <template v-slot:footer>
            <button class="btn btn-secondary" type="button" @click="updateModal.show = false">Đóng</button>
            <button class="btn btn-primary" type="button" @click="updateAchievement">Sửa</button>
          </template>
        </Modal>
        <Modal :show="deleteModal.show" @close="deleteModal.show = false">
          <template v-slot:header>
            <h4>Xóa thành tựu</h4>
          </template>
          <template>
            <p>Bạn có chắc chắn muốn xóa thành tựu này?</p>
          </template>
          <template v-slot:footer>
            <button class="btn btn-secondary" type="button" @click="deleteModal.show = false">Đóng</button>
            <button class="btn btn-danger" type="button" @click="deleteAchievement">Xóa</button>
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
  name: 'achievements',
  components: {Modal, SearchCustom},
  data() {
    return {
      store,
      achievements: [],
      pageNo: this.$route.query.page || 1,
      pageSize: this.$route.query.size || 5,
      sortDir: this.$route.query.sortDir || 'DESC',
      sortName: this.$route.query.sortName || 'id',
      keyword: this.$route.query.keyword || '',
      totalPage: 0,
      total: 0,
      createModal: {
        show: false,
        name: '',
        message: '',
        daysStreak: 0,
        errors: {
          name: '',
          message: '',
          daysStreak: ''
        }
      },
      updateModal: {
        show: false,
        id: '',
        name: '',
        message: '',
        daysStreak: 0,
        errors: {
          name: '',
          message: '',
          daysStreak: ''
        }
      },
      deleteModal: {
        show: false,
        id: '',
      },
      loading: false,
    }
  },
  async created() {
    await this.searchAchievements('', '')
  },
  methods: {
    async searchAchievements(tagId, keyword) {
      this.keyword = keyword
      this.getAchievements()
    },
    async getAchievements() {
      if (!store.isLoggedIn()) return
      let url = ''
      if (!store.isAdmin()) {
        url = this.$appConfig.apiBaseUrl + `/quiz/api/achievements?pageNo=${this.pageNo - 1}&pageSize=${this.pageSize}&sortDir=${this.sortDir}&sortName=${this.sortName}`
      } else {
        url = this.$appConfig.apiBaseUrl + `/quiz/api/achievements/configs?pageNo=${this.pageNo - 1}&pageSize=${this.pageSize}&sortDir=${this.sortDir}&sortName=${this.sortName}`
      }
      if (this.keyword) {
        url += `&content=${this.keyword}`
      }
      this.loading = true
      await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${store.token}`
        }
      }).then(res => {
        this.achievements = res.data.data.items
        this.totalPage = res.data.data.totalPage
        this.total = res.data.data.totalElements
      }).catch(err => {
        store.displayError('Có lỗi xảy ra. Vui lòng thử lại')
      }).finally(() => {
        this.loading = false
      })
    },
    validateForm(formData, type = 'create') {
      const {name, message, daysStreak} = formData
      if (!name) {
        this[type + 'Modal'].errors.name = 'Vui lòng nhập tên thành tựu'
        return false
      }
      if (name.length < 4) {
        this[type + 'Modal'].errors.name = 'Tên thành tựu phải có ít nhất 4 ký tự'
        return false
      }
      if (!message) {
        this[type + 'Modal'].errors.message = 'Vui lòng nhập thông báo'
        return false
      }
      if (message.length < 4) {
        this[type + 'Modal'].errors.message = 'Thông báo phải có ít nhất 4 ký tự'
        return false
      }
      if (!daysStreak) {
        this[type + 'Modal'].errors.daysStreak = 'Vui lòng nhập số ngày liên tục'
        return false
      }
      if (daysStreak < 1) {
        this[type + 'Modal'].errors.daysStreak = 'Số ngày liên tục phải lớn hơn 0'
        return false
      }
      return true
    },
    createAchievement() {
      if (!this.validateForm(this.createModal)) return
      const {name, message, daysStreak} = this.createModal
      axios.post(this.$appConfig.apiBaseUrl + '/quiz/api/achievements/configs', {
        name,
        message,
        daysStreak: parseInt(daysStreak)
      }, {
        headers: {
          'Authorization': `Bearer ${store.token}`
        }
      }).then(res => {
        this.createModal.show = false
        this.resetCreateModal()
        this.getAchievements()
        store.displaySuccess('Tạo thành tựu thành công')
      }).catch(err => {
        if (err.response.status) {
          const error = err.response.data.error
          if (error) {
            if (error.toUpperCase().includes('MESSAGE')) {
              this.createModal.errors.message = error
            } else if (error.toUpperCase().includes('NAME')) {
              this.createModal.errors.name = error
            } else {
              this.createModal.errors.daysStreak = error
            }
          }
        } else {
          this.createModal.errors.name = 'Có lỗi xảy ra. Vui lòng thử lại'
        }
      })
    },
    resetCreateModal() {
      this.createModal.name = ''
      this.createModal.message = ''
      this.createModal.daysStreak = 0
      this.createModal.errors.name = ''
      this.createModal.errors.message = ''
      this.createModal.errors.daysStreak = ''
    },
    showUpdateModal(achievement) {
      this.updateModal.id = achievement.id
      this.updateModal.name = achievement.name
      this.updateModal.message = achievement.message
      this.updateModal.daysStreak = achievement.daysStreak
      this.updateModal.errors.name = ''
      this.updateModal.errors.message = ''
      this.updateModal.errors.daysStreak = ''
      this.updateModal.show = true
    },
    updateAchievement() {
      if (!this.validateForm(this.updateModal, 'update')) return
      const {id, name, message, daysStreak} = this.updateModal
      let data = {
        name,
        message,
        daysStreak: parseInt(daysStreak)
      }
      axios.put(this.$appConfig.apiBaseUrl + `/quiz/api/achievements/configs/${id}`, data, {
        headers: {
          'Authorization': `Bearer ${store.token}`
        }
      }).then(res => {
        this.updateModal.show = false
        this.getAchievements()
        store.displaySuccess('Cập nhật thành tựu thành công')
      }).catch(err => {
        if (err.response.status) {
          const error = err.response.data.error
          if (error) {
            if (error.toUpperCase().includes('MESSAGE')) {
              this.updateModal.errors.message = error
            } else if (error.toUpperCase().includes('NAME')) {
              this.updateModal.errors.name = error
            } else {
              this.updateModal.errors.daysStreak = error
            }
          }
        } else {
          this.update.errors.name = 'Có lỗi xảy ra. Vui lòng thử lại'
        }
      })
    },
    showDeleteAchievementModal(id) {
      this.deleteModal.show = true
      this.deleteModal.id = id
    },
    deleteAchievement() {
      axios.delete(this.$appConfig.apiBaseUrl + `/quiz/api/achievements/configs/${this.deleteModal.id}`, {
        headers: {
          'Authorization': `Bearer ${store.token}`
        }
      }).then(res => {
        this.deleteModal.show = false
        this.getAchievements()
        store.displaySuccess('Xóa thành tựu thành công')
      }).catch(err => {
        store.displayError('Có lỗi xảy ra. Vui lòng thử lại')
      })
    },
  },
  watch: {
    pageNo(val) {
      this.getAchievements()
    },
  },
}
</script>
