import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Cart from '../views/Cart.vue'
import Address from '../views/Address.vue'
import OrderConfirmation from '../views/OrderConfirmation.vue'
Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path:'/cart',
    name:'Cart',
    component: Cart
  },
  {
    path:'/address',
    name:'Address',
    component:Address
  },
  {
    path:'/orderConfirmation',
    name:'OrderConfirmation',
    component:OrderConfirmation
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
