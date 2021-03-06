import Vue from 'vue'

import 'normalize.css/normalize.css'

// import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import FormMaking from 'form-making'
import 'form-making/dist/FormMaking.css'

import VueLazyLoad from 'vue-lazyload'

import Cookies from 'js-cookie'

import '@/styles/index.scss'

import App from './App'
import store from './store'
import router from './router'

import '@/icons'
import '@/permission'

import '@/utils/element-ui.js'

import Element from 'element-ui'

import Http from '@/api'
import Utils from '@/utils'

import Pagination from '@/components/Pagination'
import BackToTop from '@/components/BackToTop'

// mock模拟数据
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)
Vue.use(Element, {
  size: Cookies.get('size') || 'small' // set element-ui default size
})

Vue.use(FormMaking)

// 图片懒加载
Vue.use(VueLazyLoad, {
  // error: require('@/assets/images/logo.png'),
  // loading: require('@/assets/images/logo.png')
})

// 挂载到Vue实例上
Vue.prototype.$Http = Http
Vue.prototype.$Utils = Utils

// 全局组件挂载
Vue.component('Pagination', Pagination)
Vue.component('BackToTop', BackToTop)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
