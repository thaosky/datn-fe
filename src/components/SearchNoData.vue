<template>
  <div class="search-no-data" style="">
    <div class="w-100 text-center" style="margin-top: 30px">
      <img src="img/theme/mochi-search.png" style="width: 200px">
      <div class="mt-3">
        <p style="font-weight: bold; font-size: 15px; width: 70%; margin-left: 15%">
          <slot>
            {{ defaultText }}
          </slot>
        </p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "SearchNoData",
  data() {
    return {
      defaultText: "QuizChii không tìm được kết quả nào. Bạn thử tìm bằng từ khoá khác nhé. Hoặc bạn có thể liên hệ với QuizChii để được hỗ trợ.",
    };
  },
};
</script>
