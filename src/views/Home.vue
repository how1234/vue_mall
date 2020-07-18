<template>
  <div class="home">
    <nav-header></nav-header>
    <nav-breadcrumb>
      <span>Goods</span>
    </nav-breadcrumb>
    <div class="accessory-result-page accessory-page">
  <div class="container">
    <div class="filter-nav">
      <span class="sortby">Sort by:</span>
      <a href="javascript:void(0)" class="default cur">Default</a>
      <a href="javascript:void(0)" class="price">Price <svg class="icon icon-arrow-short"><use xlink:href="#icon-arrow-short"></use></svg></a>
      <a href="javascript:void(0)" class="filterby stopPop">Filter by</a>
    </div>
    <div class="accessory-result">
      <!-- filter -->
      <div class="filter stopPop" id="filter">
        <dl class="filter-price">
          <dt>Price:</dt>
          <dd><a href="javascript:void(0)">All</a></dd>
          <dd>
            <a href="javascript:void(0)">0 - 100</a>
          </dd>
          <dd>
            <a href="javascript:void(0)">100 - 500</a>
          </dd>
          <dd>
            <a href="javascript:void(0)">500 - 1000</a>
          </dd>
          <dd>
            <a href="javascript:void(0)">1000 - 2000</a>
          </dd>
        </dl>
      </div>

      <!-- search result accessories list -->
      <div class="accessory-list-wrap">
        <div class="accessory-list col-4">
          <ul>
            <li v-for="item in goodsList" :key="item.productId">
              <div class="pic">
                <a href="#"><img :src="getImgUrl(item.productImg)" alt=""></a>
              </div>
              <div class="main">
                <div class="name">{{item.productName}}</div>
                <div class="price">{{item.productPrice}}</div>
                <div class="btn-area">
                  <a href="javascript:;" class="btn btn--m">加入购物车</a>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</div>
    <nav-footer></nav-footer>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from 'axios'


export default {
  name: 'Home',
  data(){
    return {
      goodsList : []
    }
  },
  mounted:function(){
    this.getGoodsInfo()
  
  },

  methods:{
    //https://stackoverflow.com/questions/40491506/vue-js-dynamic-images-not-working
    getImgUrl(picName){
      return require('../../static/' + picName)
    },
    getGoodsInfo(){
      axios.get('/api/goodsInfo').then((res) => {
 
        let results = res.data.results
 
        this.goodsList = results
          console.log(this.goodsList)
      })

    }
  }
}
</script>
