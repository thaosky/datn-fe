<template>
  <section class="section section-lg pt-lg-0 w-100" style="margin-top: 200px">
    <div class="container">
      <div class="row justify-content-center bg-white">
        <a-spin :spinning="loading" class="w-100" size="large">
          <table v-if="result.list && result.list.length" class="table table-striped">
            <thead>
            <tr>
              <th scope="col">Tên bài quiz</th>
              <th scope="col">Thời điểm nộp bài</th>
              <th scope="col">Thời gian làm bài</th>
              <th scope="col">Kết quả</th>
              <th scope="col">Điểm</th>
              <th scope="col"></th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="detail in result.list" :key="result.list.userId">
              <td :title="detail.testName" data-toggle="tooltip">
                {{ detail.testName }}
              </td>
              <td :title="detail.startedAt.substr(0, 19)" data-toggle="tooltip">
                {{ detail.startedAt.substr(0, 19) }}
              </td>
              <td :title="calcTimeUsed(detail.startedAt, detail.submittedAt)" data-toggle="tooltip">
                {{ calcTimeUsed(detail.startedAt, detail.submittedAt) }}
              </td>
              <td :title="detail.corrected" data-toggle="tooltip">
                {{ detail.corrected }} / {{ detail.totalQuestion }}
              </td>
              <td :title="detail.corrected" data-toggle="tooltip">
                {{ (detail.corrected / detail.totalQuestion * 100).toFixed(2) }}
              </td>
              <td>
                <router-link :to="`/statistics/${detail.resultId}`">
                  <button class="btn btn-sm btn-primary">Review</button>
                </router-link>
              </td>
            </tr>
            </tbody>
          </table>
          <SearchNoData v-else></SearchNoData>
        </a-spin>
      </div>
    </div>
  </section>
</template>

<script>
import axios from 'axios'
import {store} from '@/store'
import moment from "moment"

export default {
  name: 'user-statistics',
  data() {
    return {
      store,
      result: {},
      loading: false
    }
  },
  async created() {
    this.loading = true
    await axios.get(this.$appConfig.apiBaseUrl + `/quiz/api/results/user/${this.store.user.id}`, {
      headers: {
        Authorization: `Bearer ${store.token}`
      }
    }).then(res => {
      this.result = res.data.data
    }).catch(err => {
      store.displayError('Có lỗi xảy ra. Vui lòng thử lại')
    }).finally(() => {
      this.loading = false
    })
  },
  methods: {
    calcTimeUsed(started, submitted) {
      const start = moment(started, 'DD/MM/YYYY HH:mm:ss')
      const end = moment(submitted, 'DD/MM/YYYY HH:mm:ss')
      const duration = moment.duration(end.diff(start))
      const seconds = duration.asSeconds() % 60
      const minutes = Math.floor(duration.asSeconds() / 60)
      return `${minutes < 10 ? '0' + minutes : minutes}m:${seconds < 10 ? '0' + seconds : seconds}s`
    },
  }
}
</script>
