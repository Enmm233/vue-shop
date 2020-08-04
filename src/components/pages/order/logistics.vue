<template>
  <div class="baidu_map">
    <van-nav-bar title="查看物流" left-arrow @click-left="mapUrl" />
    <!--  <div class="flex width white title">
      <van-icon name="arrow-left" @click="mapUrl" />
      <h2 class="width center">{{title}}</h2>
    </div> -->

    <div class="baidumap" id="container"></div>

    <!--        <ul><li v-for="item in list">{{item.title}}</li></ul>-->
  </div>
</template>

<script>
  import {
    MP
  } from './../../../../static/js/mp'
  import APIUrl from "../../../../config/apiurl";
  export default {

    data() {
      return {
        title: '查看物流',
        ak: this.$route.query.ak,
        lat: this.$route.query.lat,
        lon: this.$route.query.lon,
        carlat: this.$route.query.carlat,
        carlon: this.$route.query.carlon,

      }
    },
    created() {

    },
    methods: {
      mapUrl() {
        this.$router.back();
      },
      loadmap() {
        var map = new BMap.Map("container");
        var point = new BMap.Point(this.carlon, this.carlat);
        map.centerAndZoom(point, 15);
        var marker = new BMap.Marker(point); // 创建标注    
        map.addOverlay(marker);
      }

    },

    mounted() {
      //加载除订单之外的地图

      this.$nextTick(function() {
        var _this = this;
        //加载百度地图
        MP(_this.ak).then(BMap => {

          _this.loadmap()
        })
      })

    },
    created() {

    }
  }
</script>
<style>
  .baidu_map .van-nav-bar .van-icon {
    margin-left: -10px;
    color: #808080;
  }

  .baidu_map #list li {
    padding: 3px 0;
    line-height: 1rem;
    border-bottom: 1px solid #efefef;
    color: gray;
  }

  .baidu_map #list {
    font-size: 0.7rem;
    padding: 5px 10px;
  }

  .baidu_map .title {
    align-items: center;
    padding: 2% 0;
  }

  .baidu_map .title h2 {
    font-size: 0.8rem;
    margin-left: -3%;
  }

  .baidu_map .search_style {
    padding: 5px 0;
  }

  .baidu_map [class*=van-hairline]::after {
    border: none;
  }

  #container {
    width: 100%;
    height: 100vh;

  }

  .baidu_map .search {
    padding: 0 23%;
  }
</style>
