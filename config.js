const config = {
  apiBaseUrl: process.env.VUE_APP_API_BASE_URL,
}
export {
  config
}
export default {
  install (Vue) {
    Vue.appConfig = config
    Vue.prototype.$appConfig = config
  }
}
