import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'

import GlobalComponents from './components/globalComponents'
import VueLazyload from 'vue-lazyload'


Vue.config.productionTip = false
Vue.prototype.axios = axios

Vue.use(GlobalComponents)
Vue.use(VueLazyload, {
  loading: 'static/loading-svg/loading-bars.svg',
  try: 3 // default 1
})



new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')