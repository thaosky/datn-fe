<template>
  <div class="content position-r w-100" style="background: #F2F2F2; min-height: calc(100vh - 128px)">
    <div class="container-fluid">
      <div class="row justify-content-center">
        <Title>
          Sửa quiz
        </Title>
        <modal :show.sync="addQuestionModal.show" modal-classes="modal-lg">
          <h6 id="modal-title-default" slot="header" class="modal-title">Thêm câu hỏi vào đề thi</h6>

          <select v-model="addQuestionModal.selectingTagId" class="form-control col-6" @change="getQuestionsForModal">
            <option value="">Chọn tag</option>
            <option v-for="tag in tagList" :key="tag.id" :value="tag.id">{{ tag.name }}</option>
          </select>

          <a-spin :spinning="questionsLoading" class="w-100 mt-4" size="large">
            <table v-if="addQuestionModal.questions.length" class="table table-striped">
              <thead>
              <tr>
                <th scope="col">Chọn</th>
                <th scope="col">Nội dung</th>
                <th scope="col">Câu hỏi</th>
                <th scope="col">Đáp án</th>
                <th scope="col">Tags</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="question in addQuestionModal.questions" :key="question.id">
                <td>
                  <input v-model="addQuestionModal.selectingQuestionIds" :value="question.id" type="checkbox">
                </td>
                <td :title="stripHtmlTags(question.content)" class="td-ellipsis td-ellipsis--modal"
                    data-toggle="tooltip" v-html="question.content"></td>
                <td :title="stripHtmlTags(question.question)" class="td-ellipsis td-ellipsis--modal"
                    data-toggle="tooltip" v-html="question.question"></td>
                <td :title="stripHtmlTags(convertAnswer(question))" class="td-ellipsis td-ellipsis--modal"
                    data-toggle="tooltip" v-html="convertAnswer(question)"></td>
                <td>
                <span v-for="tag in question.tagList" :key="tag.id" class="badge badge-primary mr-1">{{
                    tag.name
                  }}</span>
                </td>
              </tr>
              </tbody>
            </table>
            <SearchNoData v-else></SearchNoData>
          </a-spin>
          <div v-if="addQuestionModal.totalPage > 1" class="d-flex justify-content-center">
            <base-pagination
              v-model="addQuestionModal.pageNo" :page-count="addQuestionModal.totalPage"
              :per-page="addQuestionModal.pageSize"
              :total="addQuestionModal.total"/>
          </div>

          <template slot="footer">
            <base-button type="primary" @click="saveModalChanges">Save changes</base-button>
            <base-button class="ml-auto" type="link" @click="discardModalChanges">
              Close
            </base-button>
          </template>
        </modal>
        <section class="section section-lg pt-lg-0 w-100" style="margin-top: 200px">
          <div class="py-5 bg-secondary">
            <a-spin :spinning="loading" size="large">
              <div class="container">
                <form>
                  <div class="form-row">
                    <div :class="errors.name ? 'has-error' : ''" class="form-group col-md-12 required-field">
                      <label for="content">Tên quiz</label>
                      <input v-model="name" class="form-control" required @focusout="errors.name = !name"/>
                    </div>
                  </div>
                  <div class="form-row">
                    <div :class="errors.description ? 'has-error' : ''" class="form-group col-md-12 required-field">
                      <label for="content">Mô tả</label>
                      <textarea v-model="description" class="form-control" required rows="5"
                                @focusout="errors.description = !description"/>
                    </div>
                  </div>
                  <div class="form-row">
                    <div class="form-group col-md-12">
                      <label for="content">Loại bài thi</label>
                      <select v-model="testType" class="form-control">
                        <option value="ONCE_WITH_TIME">Không thể thi lại, thời điểm bắt đầu cố định</option>
                        <option value="ONCE_WITHOUT_TIME">Không thể thi lại, thời điểm bắt đầu không cố định</option>
                        <option value="PRACTICE">Có thể thi lại</option>
                      </select>
                    </div>
                  </div>
                  <div class="form-row">
                    <div :class="errors.availableTime ? 'has-error' : ''" class="form-group col-md-6 required-field">
                      <label for="content">Thời gian làm bài</label>
                      <input v-model="availableTime" class="form-control" required type="number"
                             @focusout="errors.availableTime = !availableTime"/>
                    </div>
                    <div v-if="testType === 'ONCE_WITH_TIME'" :class="errors.startTime ? 'has-error' : ''"
                         class="form-group col-md-6 required-field">
                      <label for="startTime">Thời điểm bắt đầu</label>
                      <a-date-picker
                        id="startTime"
                        v-model="startTime"
                        :disabled-date="disabledPrevDate"
                        :show-time="{ defaultValue: moment('00:00', 'HH:mm'), format: 'HH:mm' }"
                        :showToday="false"
                        class="w-100"
                        format="DD/MM/YYYY HH:mm"
                        name="startDate"
                        placeholder="Chọn ngày"
                        valueFormat="YYYY-MM-DD HH:mm:00"
                      />
                    </div>
                  </div>
                </form>

                <button class="btn btn-primary" type="button" @click="showModal">Thêm câu hỏi</button>
                <button class="btn btn-success" type="submit" @click="storeTest">Cập nhật</button>

                <h4 v-if="addQuestionModal.selectedQuestionIds.length" class="mt-5">
                  Các câu hỏi đã chọn
                </h4>
                <h4 v-else class="mt-5">
                  Chưa có câu hỏi nào được chọn
                </h4>
                <table v-if="addQuestionModal.selectedQuestionIds.length" class="table table-striped">
                  <thead>
                  <tr>
                    <th scope="col">Nội dung</th>
                    <th scope="col">Tags</th>
                  </tr>
                  </thead>
                  <tbody>
                  <template v-for="question in questions">
                    <tr v-if="addQuestionModal.selectedQuestionIds.includes(question.id)">
                      <td v-html="question.content"></td>
                      <td>
                      <span v-for="tag in question.tagList" :key="tag.id" class="badge badge-primary mr-1">{{
                          tag.name
                        }}</span>
                      </td>
                    </tr>
                  </template>
                  </tbody>
                </table>
              </div>
            </a-spin>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import {BFormTags, BFormTag, BFormSelect} from 'bootstrap-vue'
import Modal from '@/components/Modal.vue'
import {store} from '@/store'

export default {
  name: 'tests-edit',
  components: {
    Modal,
    BFormTags,
    BFormTag,
    BFormSelect
  },
  data() {
    return {
      addQuestionModal: {
        show: false,
        selectingTagId: '',
        questions: [],
        selectingQuestionIds: [],
        selectedQuestionIds: [],
        pageNo: 1,
        pageSize: 10,
        totalPage: 0,
        total: 0,
      },
      tagList: [],
      questions: [],
      store,
      name: '',
      description: '',
      testType: 'ONCE_WITH_TIME',
      startTime: null,
      loadingQuestions: false,
      availableTime: '',
      selectedTags: [],
      loading: false,
      questionsLoading: false,
      errors: {
        name: false,
        description: false,
        availableTime: false,
        startTime: false,
      },
    }
  },
  computed: {
    tagNameList() {
      return this.tagList.map(tag => tag.name)
    },
    availableTags() {
      return this.tagNameList.filter(tag => !this.selectedTags.includes(tag))
    },
  },
  created() {
    this.getTags()
    this.getAllQuestions()
    this.loading = true
    axios.get(this.$appConfig.apiBaseUrl + '/quiz/api/tests/' + this.$route.params.id, {
      headers: {
        'Authorization': `Bearer ${store.token}`
      }
    }).catch(err => {
      store.displayError('Có lỗi xảy ra. Vui lòng thử lại')
    }).then(response => {
      this.name = response.data.data.name
      this.description = response.data.data.description
      this.testType = response.data.data.testType
      this.startTime = response.data.data.startTime
      this.availableTime = response.data.data.availableTime
      this.selectedTags = response.data.data.tagList ? response.data.data.tagList.map(tag => tag.name) : []
      this.addQuestionModal.selectedQuestionIds = response.data.data.questionList ? response.data.data.questionList.map(question => question.id) : []
    }).finally(() => {
      this.loading = false
    })
  },
  methods: {
    moment,
    showModal() {
      this.addQuestionModal.show = true
      this.addQuestionModal.selectingTagId = ''
      this.addQuestionModal.questions = []
      this.addQuestionModal.selectingQuestionIds = this.addQuestionModal.selectedQuestionIds
      this.addQuestionModal.pageNo = 1
      this.addQuestionModal.totalPage = 0
      this.addQuestionModal.total = 0
      this.getQuestionsForModal()
    },
    discardModalChanges() {
      this.addQuestionModal.show = false
      this.addQuestionModal.selectingTagId = ''
      this.addQuestionModal.questions = []
      this.addQuestionModal.selectingQuestionIds = this.addQuestionModal.selectedQuestionIds
      this.addQuestionModal.pageNo = 1
      this.addQuestionModal.totalPage = 0
      this.addQuestionModal.total = 0
    },
    saveModalChanges() {
      this.addQuestionModal.show = false
      this.addQuestionModal.selectingTagId = ''
      this.addQuestionModal.questions = []
      this.addQuestionModal.selectedQuestionIds = this.addQuestionModal.selectingQuestionIds
      this.addQuestionModal.pageNo = 1
      this.addQuestionModal.totalPage = 0
      this.addQuestionModal.total = 0
      this.getQuestions()
    },
    async storeTest() {
      if (!this.name || !this.availableTime) {
        store.displayError('Vui lòng nhập đầy đủ thông tin')
        return
      }

      this.errors.startTime = false
      if (this.testType === 'ONCE_WITH_TIME' && !this.startTime) {
        store.displayError('Vui lòng chọn thời gian thi')
        this.errors.startTime = true
        return
      }

      if (this.availableTime < 1) {
        store.displayError('Thời gian làm bài không hợp lệ')
        return
      }

      if (this.testType === 0 && !this.startTime) {
        store.displayError('Vui lòng chọn thời gian thi')
        return
      }

      const questionIds = []
      for (let questionId of this.addQuestionModal.selectedQuestionIds) {
        questionIds.push({id: questionId})
      }

      const tagIds = []
      for (let tagName of this.selectedTags) {
        const tag = this.tagList.find(tag => tag.name === tagName)
        tagIds.push({id: tag.id})
      }

      await axios.put(this.$appConfig.apiBaseUrl + '/quiz/api/tests/' + this.$route.params.id, {
        id: this.$route.params.id,
        name: this.name,
        description: this.description,
        tagList: tagIds,
        questionList: questionIds,
        testType: this.testType,
        startTime: this.startTime,
        availableTime: this.availableTime,
      }, {
        headers: {
          'Authorization': `Bearer ${store.token}`
        }
      }).then(res => {
        store.displaySuccess('Tạo bài thi thành công')
        this.$router.push('/tests')
      }).catch(err => {
        store.displayError('Có lỗi xảy ra. Vui lòng thử lại')
      })
    },
    async getQuestionsForModal() {
      let url = this.$appConfig.apiBaseUrl + '/quiz/api/questions?pageSize=' + this.addQuestionModal.pageSize
        + '&pageNo=' + (this.addQuestionModal.pageNo - 1)
      if (this.addQuestionModal.selectingTagId) {
        url += '&tagId=' + this.addQuestionModal.selectingTagId
      }
      this.questionsLoading = true
      await axios.get(url).then(res => {
        this.addQuestionModal.questions = res.data.data.items
        this.addQuestionModal.totalPage = res.data.data.totalPage
        this.addQuestionModal.total = res.data.data.total
      }).catch(err => {
        store.displayError('Có lỗi xảy ra. Vui lòng thử lại')
      }).finally(() => {
        this.questionsLoading = false
      })
    },
    async getTags() {
      await axios.get(this.$appConfig.apiBaseUrl + '/quiz/api/tags?pageSize=100000&pageNo=0')
        .then(res => {
          if (res.data.data.items.length === 0) {
            return
          }
          this.tagList = res.data.data.items
        }).catch(err => {
          store.displayError('Có lỗi xảy ra. Vui lòng thử lại')
        })
    },
    async getAllQuestions() {
      await axios.get(this.$appConfig.apiBaseUrl + '/quiz/api/questions?pageSize=100000&pageNo=0')
        .then(res => {
          this.questions = res.data.data.items
        }).catch(err => {
          store.displayError('Có lỗi xảy ra. Vui lòng thử lại')
        })
    },
    disabledPrevDate(current) {
      // Can not select days before today and today
      return current && current < moment().endOf('day');
    },
    convertAnswer(question) {
      if (question.correctAnswer) {
        question.correctAnswer = parseInt('' + question.correctAnswer)
      } else {
        return ''
      }
      return question['answer' + question.correctAnswer]
    },
    stripHtmlTags(str) {
      let doc = new DOMParser().parseFromString(str, 'text/html');
      return doc.body.textContent || "";
    },
  },
  watch: {
    'addQuestionModal.pageNo': 'getQuestionsForModal',
  }
}
</script>
