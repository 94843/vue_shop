import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from "element-ui"
import 'element-ui/lib/theme-chalk/index.css'
import "./assets/login_con.css"
import axios from 'axios'
axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1/'
//定义一个请求拦截器
axios.interceptors.request.use(config=>{
  //为请求头对象，添加token验证
  // if(token){
  //   config.headers.Authorization = token;
  //   // 每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token
  // }
  config.headers.Authorization = window.sessionStorage.getItem("token")
  return config
})
Vue.prototype.$http = axios

Vue.use(ElementUI)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
