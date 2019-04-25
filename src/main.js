import Vue from 'vue'
import router from './router'
import ElementUI from 'element-ui'
import axios from 'axios'

import App from './App'

import './assets/css/global.css'
import './assets/fronts/iconfont.css'

Vue.config.productionTip = false

Vue.use(ElementUI)

axios.defaults.baseURL = 'http://127.0.0.1:11333/api/private/v1/'

axios.interceptors.request.use(
  function(config) {
    // Do something before request is sent
    const token = window.sessionStorage.getItem('token')

    if (token !== null) {
      config.headers.Authorization = token
    }

    return config
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error)
  }
)

Vue.prototype.$http = axios

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
