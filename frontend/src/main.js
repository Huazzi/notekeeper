import './assets/main.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import store from './store'

// 设置axios基础URL
axios.defaults.baseURL = 'http://localhost:8081'
axios.defaults.withCredentials = true

// 请求拦截器
axios.interceptors.request.use(
  config => {
    // 这里可以添加认证token等逻辑
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
axios.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (error.response && error.response.status === 401) {
      // 未授权，跳转到登录页
      router.push('/login')
    }
    return Promise.reject(error)
  }
)

const app = createApp(App)

app.use(router)
app.use(store)
app.config.globalProperties.$axios = axios

app.mount('#app')
