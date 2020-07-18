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
          <a href="javascript:void(0)" class="price"
            >Price
            <svg class="icon icon-arrow-short">
              <use xlink:href="#icon-arrow-short"></use></svg
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
                  :class="{ cur: checked === 'all' }"
                  @click="clickPriceFilter('active')"
                  >All</a
                >
              </dd>
              <dd v-for="(el, index) in priceFilter" :key="index">
                <a
                  href="javascript:void(0)"
                  :class="{ cur: index === checked }"
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
                      ><img v-lazy="getImgUrl(item.productImg)" alt=""
                    /></a>
                  </div>
                  <div class="main">
                    <div class="name">{{ item.productName }}</div>
                    <div class="price">{{ item.productPrice }}</div>
                    <div class="btn-area">
                      <a href="javascript:;" class="btn btn--m">Add to cart</a>
                    </div>
                  </div>
                </li>
              </ul>
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
    <nav-footer></nav-footer>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from "axios";

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
          endPrice: "2000"
        }
      ],
      checked: "all",
      filterBy: false,
      overLayFlag: false
    };
  },

  mounted: function() {
    this.getGoodsInfo();
  },

  methods: {
    //https://stackoverflow.com/questions/40491506/vue-js-dynamic-images-not-working
    async clickPriceFilter(activeIndex) {
      this.checked = activeIndex;
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
      return require("../../static/" + picName);
    },
    getGoodsInfo() {
      axios.get("/api/goodsInfo").then(res => {
        let results = res.data.results;

        this.goodsList = results;
      });
    }
  }
};
</script>
