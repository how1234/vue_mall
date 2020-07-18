import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import GlobalComponents from './components/globalComponents'
import VueLazyLoad from 'vue-lazyload'




Vue.config.productionTip = false
Vue.use(VueLazyLoad,{
  loading:getLoadingFile()
  
})

function getLoadingFile(){
  return require("../static/loading-svg/loading-bars.svg");
}
Vue.use(GlobalComponents)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
