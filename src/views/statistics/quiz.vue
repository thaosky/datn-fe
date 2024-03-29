<template>
  <div class="content position-r w-100" style="background: #F2F2F2; min-height: calc(100vh - 128px)">
    <div class="container-fluid">
      <div class="row justify-content-center">
        <Title>
          {{ result ? result.testName : 'Thống kê' }}
        </Title>
        <section class="section section-lg pt-lg-0 w-100" style="margin-top: 200px">
          <div class="container">
            <div v-if="store.isAdmin()" class="row mb-3" style="justify-content: end">
              <button
                class="btn btn-outline-success mb-0"
                @click="downloadExcel"
              >Download Excel
              </button>
            </div>
            <div class="row justify-content-center bg-white">
              <a-spin :spinning="loading" class="w-100" size="large">
                <table v-if="result.list && result.list.length" class="table table-striped">
                  <thead>
                  <tr>
                    <th scope="col">Username</th>
                    <th scope="col">Thời điểm nộp bài</th>
                    <th scope="col">Thời gian làm bài</th>
                    <th scope="col">Kết quả</th>
                    <th scope="col">Điểm</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="detail in result.list" :key="result.list.userId">
                    <td :title="detail.username" data-toggle="tooltip">
                      {{ detail.username }}
                    </td>
                    <td :title="submittedTime(detail.submittedAt)" data-toggle="tooltip">
                      {{ submittedTime(detail.submittedAt) }}
                    </td>
                    <td :title="calcTimeUsed(detail.startedAt, detail.submittedAt)" data-toggle="tooltip">
                      {{ calcTimeUsed(detail.startedAt, detail.submittedAt) }}
                    </td>
                    <td>
                      {{ detail.corrected }} / {{ detail.totalQuestion }}
                    </td>
                    <td :title="detail.corrected" data-toggle="tooltip">
                      {{ calcPoint(detail.corrected, detail.totalQuestion) }}
                    </td>
                  </tr>
                  </tbody>
                </table>
                <SearchNoData v-else></SearchNoData>
              </a-spin>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import {store} from '@/store'
import axios from 'axios'

export default {
  name: 'statistics-by-test',
  data() {
    return {
      store,
      result: {},
      loading: false
    }
  },
  async created() {
    this.loading = true
    await axios.get(this.$appConfig.apiBaseUrl + `/quiz/api/results/test/${this.$route.params.id}`, {
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
      const start = new Date(started)
      const submit = new Date(submitted)
      const diff = submit.getTime() - start.getTime()
      const minutes = Math.floor(diff / 1000 / 60)
      const seconds = Math.floor(diff / 1000) - minutes * 60
      return `${minutes < 10 ? '0' + minutes : minutes}m:${seconds < 10 ? '0' + seconds : seconds}s`
    },
    submittedTime(submittedAt) {
      const date = new Date(submittedAt);
      let datePart = [
        date.getMonth() + 1,
        date.getDate(),
        date.getFullYear()
      ].map((n, i) => n.toString().padStart(i === 2 ? 4 : 2, "0")).join("/");
      let timePart = [
        date.getHours(),
        date.getMinutes(),
        date.getSeconds()
      ].map((n, i) => n.toString().padStart(2, "0")).join(":");
      return datePart + " " + timePart;
    },
    downloadExcel() {
      this.downloadFromUrl(this.$appConfig.apiBaseUrl + `/quiz/api/results/test/statistic-excel/${this.$route.params.id}`, 'statistics')
    },
    calcPoint(corrected, totalQuestion) {
      const numericPoint = '' + (corrected * 100 / totalQuestion).toFixed(2)
      return parseFloat(numericPoint)
    },
    async downloadFromUrl(url, filename) {
      await axios.get(url, {
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${store.token}`
        }
      })
        .then(res => {
          const url = window.URL.createObjectURL(new Blob([res.data]))
          const link = document.createElement('a')
          link.href = url
          link.setAttribute('download', filename + '.xlsx')
          document.body.appendChild(link)
          link.click()
        })
        .catch(err => {
          store.displayError('Có lỗi xảy ra. Vui lòng thử lại')
        })
    }
  }
}
</script>
