import Title from "@/components/Title.vue";
import SearchInput from "@/components/SearchInput.vue";
import SearchNoData from "@/components/SearchNoData.vue";
import BaseButton from "@/components/BaseButton.vue";
import BaseAlert from "@/components/BaseAlert.vue";
import BasePagination from "@/components/BasePagination.vue";

export default {
  install(Vue) {
    Vue.component(BaseAlert.name, BaseAlert);
    Vue.component(Title.name, Title);
    Vue.component(SearchInput.name, SearchInput);
    Vue.component(SearchNoData.name, SearchNoData);
    Vue.component(BaseButton.name, BaseButton);
    Vue.component(BasePagination.name, BasePagination);
  }
};
