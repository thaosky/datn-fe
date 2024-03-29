/*!


=========================================================
* Vue Argon Design System - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-design-system
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-design-system/blob/master/LICENSE.md)

* Coded by www.creative-tim.com

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "ant-design-vue/dist/antd.css";
import Argon from "./plugins/argon-kit";
import wysiwyg from "vue-wysiwyg";
import Antd from 'ant-design-vue';
import './registerServiceWorker'
import config from '../config'

Vue.use(config)
Vue.config.productionTip = false;
Vue.use(Antd);
Vue.use(Argon);
Vue.use(wysiwyg, {
  hideModules: {
    "link": true,
    "headings": true,
    "justifyLeft": true,
    "justifyCenter": true,
    "justifyRight": true,
    "separator": true,
    "code": true,
    "orderedList": true,
    "unorderedList": true,
    "image": true,
    "table": true,
  }
})
new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
