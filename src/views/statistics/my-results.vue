<template>
  <div class="content position-r w-100" style="background: #F2F2F2; min-height: calc(100vh - 128px)">
    <div class="container-fluid">
      <div class="row justify-content-center">
        <Title>
          Lịch sử thi
        </Title>
        <UserStatistic/>
      </div>
    </div>
  </div>
</template>

<script>
import { store } from '@/store'
import UserStatistic from '@/views/statistics/user'

export default {
  name: 'statistics',
  components: {
    UserStatistic
  },
  data () {
    return {
      store
    }
  },
}
</script>
