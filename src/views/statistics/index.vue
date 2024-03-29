<template>
  <div class="content position-r w-100" style="background: #F2F2F2; min-height: calc(100vh - 128px)">
    <div class="container-fluid">
      <div class="row justify-content-center">
        <Title>
          Thống kê
        </Title>
        <AdminStatistic/>
      </div>
    </div>
  </div>
</template>

<script>
import { store } from '@/store'
import AdminStatistic from '@/views/statistics/admin'

export default {
  name: 'statistics',
  components: {
    AdminStatistic
  },
  data () {
    return {
      store
    }
  },
}
</script>
