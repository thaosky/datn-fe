<template>
    <header class="header-global">
      <div class="message-container">
        <template v-for="error in store.errorTexts">
          <base-alert type="danger" icon="ni ni-support-16">
            <span slot="text"><strong>Error! </strong> {{ error }}</span>
          </base-alert>
        </template>
        <template v-for="success in store.successTexts">
          <base-alert type="success" icon="ni ni-support-16">
            <span slot="text"><strong>Success! </strong> {{ success }}</span>
          </base-alert>
        </template>
      </div>
    </header>
</template>
<script>

import {store} from "@/store";

export default {
  data() {
    return {
      store
    };
  },
};
</script>
<style>
</style>
