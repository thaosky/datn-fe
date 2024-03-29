<template>
  <div class="col-12 title-course text-center bg-white d-flex justify-content-center"
       style="padding-top: 50px; position: absolute; top: 68px; z-index: 100; width: 100%; background-color: transparent!important;">
    <div class="w-25">
      <slot name="left-item"></slot>
    </div>
    <div class="w-50">
      <div class="col-10 offset-1">
        <div class="course-item-title bg-white" style="background-color: transparent!important;">
          <div class="text-center course-item-header">
            <div class="course-item-button">
              <div class="course-item-button-1" style="background-color: #F2F2F2;"></div>
              <div class="course-item-button-2">
                <p>
                  <slot></slot>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="w-25 side-item-wrapper">
      <div class="w-75">
        <slot name="right-item"></slot>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "Title",
};
</script>
<style scoped>
  .side-item-wrapper {
    transform: translateY(-30px);
  }
</style>
