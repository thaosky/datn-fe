<template>
  <div class="content position-r w-100" style="background: #F2F2F2; min-height: calc(100vh - 128px)">
    <div class="container-fluid">
      <div class="row justify-content-center">
        <Title>
          Danh sách tag
        </Title>
        <section class="section section-lg pt-lg-0 w-100" style="margin-top: 200px">
          <div class="container">
            <div class="d-flex justify-content-center my-3">
              <SearchCustom :searchContent="'Tìm kiếm theo tên tag'" @submit="search"></SearchCustom>
            </div>
            <div v-if="store.isAdmin()" class="row mb-3" style="justify-content: end">
              <button class="btn btn-success" @click="showCreateModal">Thêm tag</button>
            </div>
            <div class="row justify-content-center bg-white">
              <a-spin :spinning="loading" class="w-100" size="large">
                <table v-if="tags.length" class="table table-striped">
                  <thead>
                  <tr>
                    <th scope="col">Tên</th>
                    <th scope="col">Mô tả</th>
                    <th v-if="store.isAdmin()" scope="col"
                        style="width: 170px"></th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="tag in tags" :key="tag.id">
                    <td :title="tag.name" data-toggle="tooltip">
                      {{ shortenContent(tag.name) }}
                    </td>
                    <td :title="tag.description" data-toggle="tooltip">
                      {{ shortenContent(tag.description) }}
                    </td>
                    <td v-if="store.isAdmin()">
                      <button class="btn btn-sm btn-primary" @click="showEditModal(tag)">
                        Sửa
                      </button>
                      <button class="btn btn-sm btn-danger" @click="showDeleteTagModal(tag.id)">Xóa</button>
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
        <modal :show="createModal.show" @close="createModal.show = false">
          <template v-slot:header>
            <h4>Thêm tag</h4>
          </template>
          <template>
            <form>
              <div class="form-row">
                <div class="form-group col-md-12 required-field" :class="{ 'has-error': createModal.errors.name }">
                  <label for="content">Tên tag</label>
                  <input v-model="createModal.name" class="form-control" required @focusout="createModal.errors.name = !createModal.name">
                </div>
              </div>
              <div class="form-row">
                <div class="form-group col-md-12">
                  <label for="content">Mô tả (tuỳ chọn)</label>
                  <textarea v-model="createModal.description" class="form-control" rows="5"></textarea>
                </div>
              </div>
            </form>
          </template>
          <template v-slot:footer>
            <button class="btn btn-secondary" type="button" @click="createModal.show = false">Đóng</button>
            <button class="btn btn-success" type="button" @click="createTag">Thêm</button>
          </template>
        </modal>
        <modal :show="editModal.show" @close="editModal.show = false">
          <template v-slot:header>
            <h4>Sửa tag</h4>
          </template>
          <template>
            <form>
              <div class="form-row">
                <div class="form-group col-md-12 required-field" :class="{ 'has-error': editModal.errors.name }">
                  <label for="content">Tên tag</label>
                  <input v-model="editModal.name" class="form-control" required @focusout="editModal.errors.name = !editModal.name">
                </div>
              </div>
              <div class="form-row">
                <div class="form-group col-md-12">
                  <label for="content">Mô tả (tuỳ chọn)</label>
                  <textarea v-model="editModal.description" class="form-control" rows="5"></textarea>
                </div>
              </div>
            </form>
          </template>
          <template v-slot:footer>
            <button class="btn btn-secondary" type="button" @click="editModal.show = false">Đóng</button>
            <button class="btn btn-primary" type="button" @click="editTag">Sửa</button>
          </template>
        </modal>
        <modal :show="deleteModal.show" @close="deleteModal.show = false">
          <template v-slot:header>
            <h4>Xóa tag</h4>
          </template>
          <template>
            <p>Bạn có chắc chắn muốn xóa tag này?</p>
          </template>
          <template v-slot:footer>
            <button class="btn btn-secondary" type="button" @click="deleteModal.show = false">Đóng</button>
            <button class="btn btn-danger" type="button" @click="deleteTag">Xóa</button>
          </template>
        </modal>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { store } from '@/store'
import Modal from '@/components/Modal.vue'
import SearchCustom from "@/components/SearchCustom.vue";

export default {
  name: 'tags',
  components: {SearchCustom, Modal },
  data () {
    return {
      store,
      tags: [],
      pageNo: this.$route.query.page || 1,
      pageSize: this.$route.query.size || 5,
      sortDir: this.$route.query.sortDir || 'DESC',
      sortName: this.$route.query.sortName || 'id',
      keyword: this.$route.query.keyword || '',
      totalPage: 0,
      total: 0,
      deleteModal: {
        show: false,
        id: '',
      },
      createModal: {
        show: false,
        name: '',
        description: '',
        errors: {
          name: false,
        },
      },
      editModal: {
        show: false,
        id: '',
        name: '',
        description: '',
        errors: {
          name: false,
        },
      },
      loading: false,
    }
  },
  async created () {
    this.getTags()
  },
  methods: {
    shortenContent (content) {
      if (!content) return ''
      if (content.length > 100) {
        return content.substring(0, 100) + '...'
      }
      return content
    },
    showDeleteTagModal (id) {
      this.deleteModal.show = true
      this.deleteModal.id = id
    },
    search(tags, keyword) {
      this.keyword = keyword
      this.getTags()
    },
    getTags () {
      this.loading = true
      axios.get(this.$appConfig.apiBaseUrl + `/quiz/api/tags?pageNo=${this.pageNo - 1}&pageSize=${this.pageSize}&sortDir=${this.sortDir}&sortName=${this.sortName}&name=${this.keyword}`)
        .then(res => {
          this.tags = res.data.data.items
          this.totalPage = res.data.data.totalPage
          this.total = res.data.data.totalElements
        })
        .catch(err => {
          store.displayError('Có lỗi xảy ra. Vui lòng thử lại')
        })
        .finally(() => {
          this.loading = false
        })
    },
    resetCreateModal () {
      this.createModal.show = false
      this.createModal.name = ''
      this.createModal.description = ''
      this.createModal.errors.name = false
    },
    showCreateModal () {
      this.createModal.show = true
    },
    async createTag () {
      await axios.post(this.$appConfig.apiBaseUrl + '/quiz/api/tags', {
        name: this.createModal.name,
        description: this.createModal.description
      }, {
        headers: {
          Authorization: `Bearer ${store.token}`
        }
      }).then(res => {
        this.getTags()
        this.resetCreateModal()
        store.displaySuccess('Thêm tag thành công')
      }).catch(err => {
        store.displayError('Có lỗi xảy ra. Vui lòng thử lại')
      })
    },
    showEditModal (tag) {
      this.editModal.show = true
      this.editModal.id = tag.id
      this.editModal.name = tag.name
      this.editModal.description = tag.description
      this.editModal.errors.name = false
    },
    async editTag () {
      await axios.put(this.$appConfig.apiBaseUrl + `/quiz/api/tags/${this.editModal.id}`, {
        name: this.editModal.name,
        description: this.editModal.description
      }, {
        headers: {
          Authorization: `Bearer ${store.token}`
        }
      }).then(res => {
        this.getTags()
        this.editModal.show = false
        store.displaySuccess('Sửa tag thành công')
      }).catch(err => {
        store.displayError('Có lỗi xảy ra. Vui lòng thử lại')
      })
    },
    deleteTag () {
      axios.delete(this.$appConfig.apiBaseUrl + `/quiz/api/tags/${this.deleteModal.id}`, {
        headers: {
          Authorization: `Bearer ${store.token}`
        }
      }).then(res => {
        store.displaySuccess('Xóa tag thành công!')
        this.deleteModal.show = false
        this.getTags()
      }).catch(err => {
        store.displayError('Có lỗi xảy ra. Vui lòng thử lại')
      })
    }
  },
  watch: {
    pageNo() {
      this.getTags()
    },
  }
}
</script>
