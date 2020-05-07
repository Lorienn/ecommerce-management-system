import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// Axios
import axios from 'axios'
// element-UI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 阿里iconfont
import './assets/fonts/iconfont.css'
// 树形表格
import TreeTable from 'vue-table-with-tree-grid'
// 富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 自定义CSS
import './assets/css/global.css'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(axios)
axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.token
  return config
})
Vue.component('tree-table', TreeTable)
Vue.use(VueQuillEditor)

Vue.filter('dateFormat', function (dateStr) {
  const dt = new Date(dateStr * 1000)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + 1 + '').padStart(2, '0')
  const hh = (dt.getHours() + 1 + '').padStart(2, '0')
  const mm = (dt.getMinutes() + 1 + '').padStart(2, '0')
  const ss = (dt.getSeconds() + 1 + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
