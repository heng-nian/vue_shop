import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import axios from 'axios'

import(/* webpackChunkName: "iconfont" */ './assets/fonts/iconfont.css');

import './assets/css/global.css'
Vue.config.productionTip = false
Vue.prototype.$http = axios

axios.defaults.baseURL = "https://www.liulongbin.top:8888/api/private/v1/"
axios.interceptors.request.use((config) => {
  config.headers.Authorization = window.sessionStorage.getItem("token")
  return config
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
