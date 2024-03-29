<template>
  <div class="div-submit-success" id="btn-review" style="display: block; margin: unset">
    <button class="btn-submit-success" @click="$emit('click', $event.target.value)">
      <slot></slot>
    </button>
  </div>
</template>
<script>
export default {
  name: "ButtonSubmitSuccess",
  props: {
    href: {
      type: String,
      default: ""
    }
  }
};
</script>
