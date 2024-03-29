<template>
  <div style="position: relative; width: 60%">
    <input id="key_search" :value="value" autocomplete="off" class="input-search" name="key"
           placeholder="Gõ vào đây để tìm kiếm"
           @input="$emit('input', $event.target.value)">
    <div class="position-a image-search" @click="$emit('submit', $event.target.value)">
      <img src="img/theme/search.svg" class="w-100">
    </div>
  </div>
</template>
<script>
export default {
  name: "SearchInput",
  props: ['value'],
};
</script>
