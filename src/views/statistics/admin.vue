<template>
  <section class="section section-lg pt-lg-0 w-100" style="margin-top: 200px">
    <div class="container">
      <div class="d-flex justify-content-center my-3">
        <SearchCustom :searchContent="'Tìm kiếm theo tên bài kiểm tra'" :tags="tagList"
                      @submit="searchByTag"></SearchCustom>
      </div>
      <div class="row justify-content-center bg-white">
        <a-spin :spinning="loading" class="w-100" size="large">
          <table v-if="tests.length" class="table table-striped">
            <thead>
            <tr>
              <th scope="col">Tên quiz</th>
              <th scope="col">Mô tả</th>
              <th scope="col">Số lượt thi</th>
              <th scope="col">Điểm trung bình</th>
              <th scope="col">Tag</th>
              <th scope="col"></th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="test in tests" :key="test.id">
              <td :title="test.name" data-toggle="tooltip">
                {{ shortenContent(test.name) }}
              </td>
              <td :title="test.description" data-toggle="tooltip">
                {{ shortenContent(test.description) }}
              </td>
              <td data-toggle="tooltip">
                {{ test.totalSubmit }}
              </td>
              <td data-toggle="tooltip">
                {{ test.averagePoint }}
              </td>
              <td>
                <template v-for="tag in test.tagList">
                  <span v-if="tag" class="badge badge-primary">{{ tag.name }}</span>
                </template>
              </td>
              <td style="display: flex; justify-content: center">
                <router-link
                  :to="'/statistics/quiz/' + test.id"
                  class="btn btn-sm btn-primary">Chi tiết
                </router-link>
              </td>
            </tr>
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
</template>

<script>
import axios from 'axios'
import ButtonSubmitSuccess from '@/components/ButtonSubmitSuccess.vue'
import SearchCustom from '@/components/SearchCustom.vue'
import {store} from '@/store'

export default {
  name: 'admin-statistics',
  components: {SearchCustom, ButtonSubmitSuccess},
  data() {
    return {
      store,
      tests: [],
      pageNo: this.$route.query.page || 1,
      pageSize: this.$route.query.size || 10000,
      sortDir: this.$route.query.sortDir || 'DESC',
      sortName: this.$route.query.sortName || 'id',
      keyword: this.$route.query.keyword || '',
      totalPage: 0,
      total: 0,
      selectedTagId: '',
      tagList: [],
      loading: false,
    }
  },
  async created() {
    await this.searchByTag()
    await axios.get(this.$appConfig.apiBaseUrl + '/quiz/api/tags?pageSize=100000&pageNo=0')
      .then(res => {
        this.tagList = res.data.data.items
      })
      .catch(err => {
        store.displayError('Có lỗi xảy ra. Vui lòng thử lại')
      })
  },
  methods: {
    shortenContent(content) {
      if (content.length > 30) {
        return content.substring(0, 30) + '...'
      }
      return content
    },
    async searchByTag(tagId, keyword) {
      this.tagId = tagId
      this.keyword = keyword
      let url = this.$appConfig.apiBaseUrl + `/quiz/api/tests?pageNo=${this.pageNo - 1}&pageSize=${this.pageSize}&sortDir=${this.sortDir}&sortName=${this.sortName}`
      if (this.selectedTagId) {
        url += `&tagId=${this.selectedTagId}`
      }
      if (this.keyword) {
        url += `&name=${this.keyword}`
      }
      this.loading = true
      await axios.get(url)
        .then(res => {
          this.tests = res.data.data.items
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
  }
}
</script>
