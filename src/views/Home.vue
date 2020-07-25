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
          <a href="javascript:void(0)" class="price" @click="sortGoods"
            >Price
            <svg class="icon icon-arrow-short">
              <use xlink:shref="#icon-arrow-short"></use></svg
          ></a>
          <a
            href="javascript:void(0)"
            class="filterby stopPop"
            @click="filterShow()"
            >Filter by</a
          >
        </div>
        <div class="accessory-result">
          <!-- filter -->
          <div
            class="filter stopPop"
            id="filter"
            :class="{ 'filterby-show': filterBy }"
          >
            <dl class="filter-price">
              <dt>Price:</dt>
              <dd>
                <a
                  href="javascript:void(0)"
                  :class="{ cur: priceRangeChecked === 'all' }"
                  @click="clickPriceFilter('all')"
                  >All</a
                >
              </dd>
              <dd v-for="(el, index) in priceFilter" :key="index">
                <a
                  href="javascript:void(0)"
                  :class="{ cur: index === priceRangeChecked }"
                  @click="clickPriceFilter(index)"
                  >{{ el.startPrice }}- {{ el.endPrice }}</a
                >
              </dd>
            </dl>
          </div>

          <!-- search result accessories list -->
          <div
            class="accessory-list-wrap"
            :class="{ 'filterby-show': filterBy }"
          >
            <div class="accessory-list col-4">
              <ul>
                <li v-for="item in goodsList" :key="item.productId">
                  <div class="pic">
                    <a href="#"
                      ><img v-lazy="getImgUrl(item.productImage)" alt=""
                    /></a>
                  </div>
                  <div class="main">
                    <div class="name">{{ item.productName }}</div>
                    <div class="price">{{ item.salePrice }}</div>
                    <div class="btn-area">
                      <a href="javascript:;" class="btn btn--m" @click="addToCart(item.productId)">Add to cart</a>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <div
              v-infinite-scroll="loadMore"
              infinite-scroll-disabled="busy"
              infinite-scroll-distance="30"
            >
              load more
            </div>
          </div>
          <div
            class="md-overlay"
            v-show="overLayFlag"
            @click="filterClose()"
          ></div>
        </div>
      </div>
    </div>
    <modal :modalShow="errorModalShow" v-on:closeModal="closeModal">
      <p slot="message"> Please login!</p>
      <div slot="btnGroup">
        <button class="btn btn--m" @click="closeModal">Close</button>
      </div>
    </modal>

    <modal :modalShow="successModalShow" v-on:closeModal="closeModal">
      <p slot="message"> Adding success</p>
      <div slot="btnGroup">
        <router-link class="btn btn--m" href="javascript:;" to="/cart">Check Cart</router-link>
        <button class="btn btn--m" @click="closeModal">Close</button>
      </div>
    </modal>

    <nav-footer></nav-footer>
  </div>
</template>
<style scoped>
.btn:hover{
  background-color:#ee7a23;
  transition: all .3s ease-out
}
</style>
<script>
// @ is an alias to /src

export default {
  name: "Home",
  data() {
    return {
      goodsList: [],
      priceFilter: [
        {
          startPrice: "0",
          endPrice: "100"
        },
        {
          startPrice: "0",
          endPrice: "500"
        },
        {
          startPrice: "500",
          endPrice: "1000"
        },
        {
          startPrice: "1000",
          endPrice: "5000"
        }
      ],
      filterBy: false,
      overLayFlag: false,
      sortFlag: true,
      page: 1,
      pageSize: 8,
      busy: true,
      priceRangeChecked:"all",
      errorModalShow:false,
      successModalShow:false
    };
  },

  mounted: function() {
    this.getGoodsInfo();
  },

  methods: {
    //https://stackoverflow.com/questions/40491506/vue-js-dynamic-images-not-working
    clickPriceFilter(activeIndex) {
      this.priceRangeChecked = activeIndex;
      this.getGoodsInfo()
    },
    filterShow() {
      this.filterBy = true;
      this.overLayFlag = true;
    },
    filterClose() {
      this.filterBy = false;
      this.overLayFlag = false;
    },
    getImgUrl(picName) {
      return require("../../public/static/" + picName);
    },
    getGoodsInfo(flag = false) {
      let param = {
        page: this.page,
        pageSize: this.pageSize,
        sort: this.sortFlag ? 1 : -1,
        priceRange:this.priceRangeChecked
      };
      this.axios
        .get("/api/goods", {
          params: param
        })
        .then(res => {
          if (res.data.status == 0) {
            //分页情况
            if (flag) {
              this.goodsList = this.goodsList.concat(res.data.result.list);
              //数据库是否还有多余数据
              if (res.data.result.count == 0) {
                //禁止动态加载
                this.busy = true;
              } else {
                this.busy = false;
              }
            } else {
              this.goodsList = res.data.result.list;
              this.busy = false;
            }
          } else {
            this.goodsList = [];
           
          }
        });
    },
    sortGoods() {
      this.sortFlag = !this.sortFlag;
      this.page = 1;
      this.getGoodsInfo();
    },
    loadMore() {
      //关闭滚动加载
      this.busy = true;
      setTimeout(() => {
        this.page++;
        this.getGoodsInfo(true);
      }, 500);
    },
    addToCart(productId){
      this.axios.post('/api/goods/addToCart',{
        productId
      }).then((res) =>{

        if(res.data.status == 0){
          this.successModalShow = true
        }else{
          this.errorModalShow = true
          
        }
      })
    },
    closeModal(){
      this.errorModalShow= false
      this.successModalShow = false
    }
  }
};
</script>
