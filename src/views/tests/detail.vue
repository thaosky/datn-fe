<template>
  <div class="content position-r w-100" style="background: #F2F2F2; min-height: calc(100vh - 128px)">
    <div class="container-fluid" style="min-height: calc(100vh - 128px)">
      <div class="row justify-content-center" style="margin-top: 68px;min-height: calc(100vh - 128px)">
        <div class="col-3 _col-1 position-r">
          <div class="position-a" style="left: 0; top: 30%; width: 80%; max-width: 180px">
            <img src="img/theme/cloud1.png"
                 style="width: 100%">
          </div>
        </div>
        <div class="col-6 _col-2 main-center" style="padding-bottom: 10px; min-height: 616px;">
          <div class="div-review" style="">
            <div class="row div_process" style="margin: 0; padding: 30px 0 10px">
              <div class="col-9 offset-1">
                <div class="process_bar" style="">
                  <div id="process-element" :style="{'width': this.progress + '%'}" class="process-element"
                       data-content="5">
                    <img alt="" src="img/theme/quyt.png">
                  </div>
                </div>
              </div>
              <div class="col-2 text-center">
                <img src="img/theme/close_black.png" style="width: 25px; cursor: pointer"
                     @click="endTestEarly">
              </div>
            </div>

            <div v-if="totalQuestions" class="learn-game position-r"
                 style="overflow: hidden auto; padding-bottom: 30px;">
              <div id="game">
                <div class="game-learn-2 game-learn-word">
                  <div class="row justify-content-center position-r">
                    <div class="col-9">
                      <div class="game-learn-2 game-learn-word">
                        <div class="text-center w-100">
                          <div class="title-game-2" v-html="currentQuestion.content">
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="col-9">
                      <div class="box-answer-3">
                        <div class="text-center list-answer-3">
                          <div class="mb-0" style="font-size: 15px; font-weight: 550" v-html="currentQuestion.question">
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="col-8">
                      <div class="div-answer-game" style="margin-top: 30px">
                        <div v-for="answerNo in [1,2,3,4]" :key="answerNo" class="bg-answer-item">
                          <div :class="{'answer-review-item-success': currentAnswer === answerNo}"
                               :data-answer="answerNo"
                               class="answer-review-item item-game text-center">
                            <div class="mb-0" v-html="currentQuestion['answer' + answerNo]">
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="position-a mochi-hello" style="bottom: 0px; left: 0px;">
            <img src="img/theme/icon-hello.svg" style="width: 100px">
          </div>
        </div>
        <div class="col-3 _col-3 text-center position-r">
          <div class="position-a" style="right: 0; top: 0; width: 70%; max-width: 150px">
            <img src="img/theme/cloud2.png"
                 style="width: 100%">
          </div>
          <div class="position-a" style="right: 0; top: 50%; width: 80%">
            <img src="img/theme/cloud8.png"
                 style="width: 100%">
          </div>
          <div class="result-questions">
            <h2 class="result-box-header result-box-title">Danh sách câu hỏi</h2>
            <div class="result-box-body">
              <div class="row g-0 result-box-list">
                <div v-for="(question, index) in questions" :key="index"
                     :class="{
                  answering: index === currentQuestionNo,
                  answered: answers[index] !== undefined,
                }" class="result-box-span" @click="goToQuestion(index)">
                  <div class="result-box-number">{{ index + 1 }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { BFormTags, BFormTag, BFormSelect } from 'bootstrap-vue'
import Modal from '@/components/Modal.vue'
import { store } from '@/store'

export default {
  name: 'tests-detail',
  components: {
    Modal,
    BFormTags,
    BFormTag,
    BFormSelect
  },
  data () {
    return {
      store,
      questions: [],
      answers: [],
      currentQuestionNo: 0,
      currentAnswer: 0,
      totalQuestions: 0,
      totalAnswers: 0,
      availableTime: 0,
      passedTime: 0,
    }
  },
  computed: {
    progress () {
      if (this.totalQuestions === 0) {
        return 5
      }
      const progress = (this.currentQuestionNo + 1) / this.totalQuestions * 100
      if (progress > 100) {
        return 100
      }
      return progress < 5 ? 5 : progress
    },
    currentQuestion () {
      if (this.totalQuestions === 0) {
        return {}
      }
      return this.questions[this.currentQuestionNo]
    },
    formattedRemainingTime () {
      const remainingTime = this.availableTime - this.passedTime
      if (remainingTime <= 0) {
        return '00:00'
      }
      const minutes = Math.floor(remainingTime / 60)
      const seconds = remainingTime % 60
      return `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`
    },
  },
  async created () {
    await this.getQuestions()
  },
  methods: {
    endTestEarly () {
      this.$router.push('/tests')
    },
    async getQuestions () {
      await axios.get(this.$appConfig.apiBaseUrl + '/quiz/api/tests/view/' + this.$route.params.id)
          .then(res => {
            this.questions = res.data.data.questionList
            this.totalQuestions = res.data.data.questionList.length
          })
          .catch(err => {
            store.displayError('Có lỗi xảy ra. Vui lòng thử lại')
          })
    },
    nextQuestion () {
      this.answers[this.currentQuestionNo] = this.currentAnswer
      this.currentAnswer = 0
      this.currentQuestionNo++
      this.totalAnswers++
    },
    goToQuestion (index) {
      if (this.currentAnswer !== 0) {
        this.answers[this.currentQuestionNo] = this.currentAnswer
      }
      this.currentQuestionNo = index
      this.currentAnswer = this.answers[index] || 0
    },
  }
}
</script>
<style>
</style>
