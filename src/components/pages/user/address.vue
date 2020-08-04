<template>
  <div class="baidu_map comman2">
    <van-nav-bar title="收货地址" right-text="确定" left-arrow @click-left="onClickLeft" @click-right="onClickRight"/>

    <iframe id="mapPage" frameborder=0 :src="hrefUrl">
    </iframe>
    <img src="../../../../static/img/nav.png" alt="" class="refresh" @click="refresh">
  </div>
</template>

<script>
  import {
    MP
  } from './../../../../static/js/mp'

  import APIUrl from './../../../../config/apiurl'
  import wx from 'weixin-js-sdk'

  let obj = {
    appid: APIUrl.appid,
    timeStamp: APIUrl.timeStamp
  };
  export default {

    data() {
      return {
        hrefUrl: '',
        count: this.$route.query.count,
        status: this.$route.query.status,
        select_zid: this.$route.query.select_zid,
        contact: this.$route.query.contact,
        password: this.$route.query.password,
        phone: this.$route.query.mobile,
        mapsite: this.$route.query.address,
        details: this.$route.query.details,
        url: this.$route.query.url,
        nickname: this.$route.query.nickname,
        lat: '',
        lng: ''
      }
    },
    methods: {
      onClickRight() {
        this.onClickLeft()
      },
      onClickLeft() {
        if (this.url == 'addchild') {
          this.$router.push({
            name: 'accountadd',
            query: {
              nickname: this.nickname,
              contact: this.contact,
              password: this.password,
              mobile: this.phone,
              address: this.mapsite,
              details: this.details,
            }
          })
          return;
        }
        if (this.url == 'shopcart' || this.url == 'user') {
          this.$router.push({
            name: 'delivery',
            query: {
              contact: this.contact,
              mobile: this.phone,
              address: this.mapsite,
              details: this.details,
              url: this.url,
              count: this.$route.query.count + 1,
              lat: this.lat,
              lng: this.lng,
            }
          })
          return;
        }
        if (this.url == 'accountedit') {
          this.$router.push({
            name: 'accountedit',
            query: {
              nickname: this.nickname,
              contact: this.contact,
              mobile: this.phone,
              status: this.status,
              select_zid: this.select_zid,
              address: this.mapsite,
              password: this.password,
              details: this.details,
              url: 'accountedit',
              lat: this.lat,
              lng: this.lng,
              count: 2,
            }
          })
          return;
        }
      },

      //腾讯地图转百度地图
      txMap_to_bdMap(lat, lng) {
        let pi = 3.14159265358979324 * 3000.0 / 180.0;
        let x = lng;
        let y = lat;
        var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * pi);
        var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * pi);
        lng = z * Math.cos(theta) + 0.0065;
        lat = z * Math.sin(theta) + 0.006;
        this.lat = lat;
        this.lng = lng;
        // return {'lng':lng,'lat':lat};
      },
      refresh() {
        window.location.reload();
      },
      loadmap() {
        let that = this;
        window.addEventListener('message', event => {
          // 接收位置信息，用户选择确认位置点后选点组件会触发该事件，回传用户的位置信息
          var loc = event.data;
          if (loc && loc.module == 'locationPicker') { //防止其他应用也会向该页面post信息，需判断module是否为'locationPicker'

            that.mapsite = loc.poiaddress;

            that.txMap_to_bdMap(loc.latlng.lat, loc.latlng.lng)

          }
        }, false);
      },
      wxConfig() {
        let that = this;
        let sign = this.$md5(this.$sort(obj) + APIUrl.appsecret);
        this.$get(APIUrl.wxConfig, {
          active: APIUrl.active,
          appid: APIUrl.appid,
          timeStamp: APIUrl.timeStamp,
          sign: sign
        }).then((response) => {
          if (response.code == 200) {
            console.log(45)
            wx.config({
              debug: false, // 开启调试模式
              appId: response.data.appId, // 必填，公众号的唯一标识
              timestamp: response.data.timestamp, // 必填，生成签名的时间戳
              nonceStr: response.data.nonceStr, // 必填，生成签名的随机串
              signature: response.data.signature, // 必填，签名，见附录1
              jsApiList: [
                'checkJsApi',
                'getLocation'
              ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });
          }
        });
        wx.ready(function () {
          wx.getLocation({
            type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
            success: function (res) {

              let lat = res.latitude; // 纬度，浮点数，范围为90 ~ -90
              let lng = res.longitude; // 经度，浮点数，范围为180 ~ -180。

              that.hrefUrl =
                'https://apis.map.qq.com/tools/locpicker?search=1&type=1&coord=' + lat + ',' +
                lng +
                '&key=EE7BZ-2ODH2-DFUUE-C2PG7-RWE6F-XDBMG&referer=myapp';
              console.log(that.hrefUrl)
              var speed = res.speed; // 速度，以米/每秒计
              var accuracy = res.accuracy; // 位置精度
            }
          });


        })
      },

    },
    mounted() {
      let that = this;
      this.loadmap()
    },
    created() {
      this.wxConfig()

    }
  }
</script>
<style>
  .baidu_map .van-nav-bar__text {
    color: black;
  }

  .baidu_map #list li {
    padding: 3px 0;
    line-height: 1rem;
    border-bottom: 1px solid #efefef;
    color: gray;
  }

  #list > div > div {
    display: none;
  }

  #list > div > div > li div:first-child {
    display: none;
  }

  .baidu_map #list {
    font-size: 0.7rem;
    padding: 5px 10px;
    color: gray !important;
  }

  .baidu_map .title {
    align-items: center;
    padding: 5px 0 0 5px;
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
    height: 200px;
  }

  .baidu_map .search {
    padding: 0 23%;
  }

  .baidu_map .refresh {
    position: absolute;
    width: 40px;
    height: 40px;
    background: white;
    border-radius: 50%;
    top: calc(44% + 2.2rem);
    left: 10px;
  }

  #mapPage {
    width: 100%;
    height: 100%;
    position: fixed;
  }
</style>
