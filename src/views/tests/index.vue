<template>
  <div class="content position-r w-100" style="background: #F2F2F2; min-height: calc(100vh - 128px)">
    <div class="container-fluid">
      <div class="row justify-content-center">
        <Title>
          Danh sách quiz
          <template v-slot:right-item>
            <div class="position-relative achievement-wrapper">
              <div class="position-absolute w-100 h-100 achievement-background"></div>
              <div class="position-a w-75 achievement">
                <div class="achievement-title">Bạn đã học liên tục</div>
                <div class="achievement-count">{{ achievement }} ngày</div>
              </div>
            </div>
          </template>
        </Title>
        <section class="section section-lg pt-lg-0 w-100" style="margin-top: 200px">
          <div class="container container-lg">
            <div class="d-flex justify-content-center my-3">
              <SearchCustom :searchContent="'Tìm kiếm theo tên bài kiểm tra'" :tags="tagList"
                            @submit="searchByTag"></SearchCustom>
            </div>
            <div v-if="store.isAdmin()" class="row mb-3" style="justify-content: flex-end">
              <router-link class="btn btn-success" to="/tests/create">Thêm quiz</router-link>
            </div>
            <div v-if="store.isLoggedIn() && !store.isAdmin()" class="row mb-3 mt-5" style="justify-content: flex-start">
              <input id="onlyShowTakenTest" v-model="onlyShowTakenTest" class="mr-2" type="checkbox">
              <label class="m-0" for="onlyShowTakenTest">Chỉ hiển thị bài quiz đã thi</label>
            </div>
            <div class="row justify-content-center bg-white">
              <a-spin :spinning="loading" class="w-100" size="large">
                <table v-if="tests.length" class="table table-striped">
                  <thead>
                  <tr>
                    <th scope="col">Tên quiz</th>
                    <th scope="col">Mô tả</th>
                    <th scope="col">Ngày thi</th>
                    <th scope="col">Thời lượng</th>
                    <th v-if="store.isLoggedIn() && !store.isAdmin()" scope="col">Số lần đã thi</th>
                    <th v-if="store.isLoggedIn() && !store.isAdmin()" scope="col">Điểm TB</th>
                    <th scope="col">Tags</th>
                    <th scope="col"></th>
                  </tr>
                  </thead>
                  <tbody>
                  <template v-for="test in tests">
                    <tr v-if="!onlyShowTakenTest || test.countSubmitByUser"
                        :key="test.id"
                        :class="store.isLoggedIn() && !store.isAdmin() && test.countSubmitByUser ? 'test-taken' : ''">
                      <td :title="test.name" data-toggle="tooltip">
                        {{ shortenContent(test.name) }}
                      </td>
                      <td :title="test.description" data-toggle="tooltip">
                        {{ shortenContent(test.description) }}
                      </td>
                      <td :title="test.startTime" data-toggle="tooltip">
                        {{ test.startTime }}
                      </td>
                      <td :title="test.availableTime" data-toggle="tooltip">
                        {{ shortenContent(test.availableTime) + ' phút' }}
                      </td>
                      <td v-if="store.isLoggedIn() && !store.isAdmin()">
                        {{ test.countSubmitByUser }}
                      </td>
                      <td v-if="store.isLoggedIn() && !store.isAdmin()">
                        {{ test.averagePointByUser }}
                      </td>
                      <td>
                        <template v-for="tag in test.tagList">
                          <span v-if="tag" class="badge badge-primary">{{ tag.name }}</span>
                        </template>
                      </td>
                      <td style="display: flex; justify-content: center">
                        <template v-if="!store.isLoggedIn()">
                          <router-link
                            :to="{ name: 'tests.detail', params: { id: test.id } }"
                            class="btn btn-sm btn-neutral">Xem
                          </router-link>
                        </template>
                        <template v-if="store.isLoggedIn()">
                          <router-link
                            :class="{ 'disabled': checkCanStartTest(test) }"
                            :to="{ name: 'tests.start', params: { id: test.id } }"
                            class="btn btn-sm btn-success"
                          >
                            Thi
                          </router-link>
                          <template v-if="store.isAdmin()">
                            <router-link
                              :to="{ name: 'tests.edit', params: { id: test.id } }"
                              class="btn btn-sm btn-primary">Sửa
                            </router-link>
                            <button class="btn btn-sm btn-danger" @click="showDeleteModal(test)">Xóa</button>
                          </template>
                        </template>
                      </td>
                    </tr>
                  </template>
                  </tbody>
                </table>
                <SearchNoData v-else></SearchNoData>
              </a-spin>
              <div v-if="totalPage > 1">
                <base-pagination v-model="pageNo" :page-count="totalPage" :per-page="pageSize"
                                 :total="total"></base-pagination>
              </div>
            </div>
          </div>
        </section>
        <modal :show="deleteModal.show" @close="deleteModal.show = false">
          <template v-slot:header>
            Xóa bài kiểm tra
          </template>
          <template>
            <p>Bạn có chắc chắn muốn xóa bài kiểm tra này?</p>
          </template>
          <template v-slot:footer>
            <button class="btn btn-secondary" @click="deleteModal.show = false">Hủy</button>
            <button class="btn btn-danger" @click="deleteTest">Xóa</button>
          </template>
        </modal>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import {store} from '@/store'
import ButtonSubmitSuccess from '@/components/ButtonSubmitSuccess.vue'
import SearchCustom from '@/components/SearchCustom.vue'
import Modal from '@/components/Modal.vue'
import moment from "moment";

export default {
  name: 'tests',
  components: {Modal, SearchCustom, ButtonSubmitSuccess},
  data() {
    return {
      store,
      tests: [],
      pageNo: this.$route.query.page || 1,
      pageSize: this.$route.query.size || 5,
      sortDir: this.$route.query.sortDir || 'DESC',
      sortName: this.$route.query.sortName || 'id',
      keyword: this.$route.query.keyword || '',
      tagId: this.$route.query.tagId || '',
      testType: this.$route.query.testType || (store.isLoggedIn() ? '' : 'PRACTICE'),
      totalPage: 0,
      total: 0,
      selectedTagId: '',
      deleteModal: {
        show: false,
        id: null,
      },
      tagList: [],
      loading: false,
      achievement: 0,
      onlyShowTakenTest: false,
      now: moment(),
    }
  },
  async created() {
    this.getTests()
    this.getAchievementCount()
    await axios.get(this.$appConfig.apiBaseUrl + '/quiz/api/tags?pageSize=100000&pageNo=0')
      .then(res => {
        this.tagList = res.data.data.items
      })
      .catch(err => {
        store.displayError('Có lỗi xảy ra. Vui lòng thử lại')
      })
    setInterval(() => {
      this.now = moment()
    }, 1000)
  },
  methods: {
    shortenContent(content) {
      if (content.length > 30) {
        return content.substring(0, 30) + '...'
      }
      return content
    },
    async getAchievementCount() {
      if (store.token) {
        await axios.get(this.$appConfig.apiBaseUrl + `/quiz/api/achievements/daily`, {
          headers: {
            Authorization: `Bearer ${store.token}`
          }
        }).then(res => {
          this.achievement = res.data.data.days;
        }).catch(err => {
          store.displayError('Có lỗi xảy ra. Vui lòng thử lại')
        })
      }
    },
    async getTests() {
      let url = this.$appConfig.apiBaseUrl + `/quiz/api/tests?pageNo=${this.pageNo - 1}&pageSize=${this.pageSize}&sortDir=${this.sortDir}&sortName=${this.sortName}`
      if (this.tagId) {
        url += `&tagId=${this.tagId}`
      }
      if (this.keyword) {
        url += `&name=${this.keyword}`
      }
      if (this.testType) {
        url += `&testType=${this.testType}`
      }
      if (store.isLoggedIn()) {
        url += `&username=${store.user.username}`
      }
      this.loading = true
      await axios.get(url).then(res => {
        this.tests = res.data.data.items
        this.totalPage = res.data.data.totalPage
        this.total = res.data.data.totalElements
      }).catch(err => {
        store.displayError('Có lỗi xảy ra. Vui lòng thử lại')
      }).finally(() => {
        this.loading = false
      })
    },
    checkCanStartTest(test) {
      if ((test.testType === 'ONCE_WITH_TIME' || test.testType === 'ONCE_WITHOUT_TIME') && test.countSubmitByUser > 0) {
        return false
      }
      if (test.testType === 'ONCE_WITH_TIME') {
        // check if the time is already over using moment
        const endTime = moment(test.endTime, 'DD/MM/YYYY HH:mm')
        return this.now.isAfter(endTime)
      }
      return false
    },
    async searchByTag(tagId, keyword) {
      this.tagId = tagId
      this.keyword = keyword
      await this.getTests()
    },
    showDeleteModal(test) {
      this.deleteModal.show = true
      this.deleteModal.id = test.id
    },
    deleteTest() {
      axios.delete(this.$appConfig.apiBaseUrl + `/quiz/api/tests/${id}`, {
        headers: {
          Authorization: `Bearer ${store.token}`
        }
      }).then(res => {
        if (res.status === 200) {
          this.getTests()
          this.deleteModal.show = false
          store.displayError('Xóa bài kiểm tra thành công!')
        }
      }).catch(err => {
        store.displayError('Có lỗi xảy ra. Vui lòng thử lại')
      })
    }
  },
  watch: {
    pageNo() {
      this.getTests()
    },
  }
}
</script>
<style scoped>
.achievement-wrapper {
  padding-bottom: 51%
}

.achievement-background {
  background-image: url('/img/media/achievement-badge.svg');
  background-size: cover;
}

.achievement {
  left: 50%;
  top: 50%;
  text-align: center;
  transform: translate(-52%, -40%);
  font-weight: 700;
  font-size: 18px;
}

.achievement-title {
  color: #23ac38;
  margin-bottom: 5px;
}

.achievement-count {
  color: #ee9b1f;
}

.btn-success.disabled, .btn-success:disabled {
  background-color: darkgrey;
  border: darkgray;
}

.test-taken td:first-child:after {
  background-image: url('/img/icons/tick-icon.png');
  background-size: cover;
  background-repeat: no-repeat;
  content: '';
  display: inline-block;
  width: 20px;
  height: 20px;
}
</style>
