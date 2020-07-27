import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Cart from '../views/Cart.vue'
import Address from '../views/Address.vue'
import OrderInitialize from '../views/OrderInitialize'
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
    path:'/OrderInitialize',
    name:'OrderInitialize',
    component:OrderInitialize
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
