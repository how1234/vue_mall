import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userName:'',
    cartCount:0
  },
  mutations: {
    login(state,userName){
      state.userName = userName
    },
    updateCartCount(state,cartCount){
      state.cartCount += cartCount
    },
    setCartCount(state,cartCount){
      state.cartCount = cartCount
    },
    logout(state){
      state.userName = ''
    },
  
  },
  actions: {
    initializeCartCount(context){
      axios.get('/api/users/getCartCount').then( (res) => {
        if(res.data.status == 0){
          context.commit('setCartCount',res.data.data)
        }else{
          context.commit('setCartCount',0)
        }
      })
   
    }
  },
  modules: {
  }
})
