<template>
  <div class="home">

    <div class="search_style fixtop" id="search_style">
      <div class="search center vertical">
        <van-icon name="search"/>
        <input type="text" name="" value="" placeholder="请输入商品名称" @focus="searchUrl">
      </div>
    </div>
    <div class="padding_back"></div>
    <van-swipe class="my-swipe " :autoplay="3000" indicator-color="white" style="margin:0 10px;background: white;">
      <van-swipe-item v-for="(item,index) in indexAd.ad" :key="index">
        <van-image :src="item.banner" @click="bannerUrl(item)" fit="contain">
          <template v-slot:error><img :src="defaultImg"></template>
        </van-image>
      </van-swipe-item>

    </van-swipe>

    <van-notice-bar v-if="indexAd.public_msg" class="white font_size" :text="indexAd.public_msg"
                    left-icon="new/img/gcaidj_pic4.png"/>

    <ul class="flex classify">

      <li v-for="item in indexAd.nav" @click="jumpUrl(item)">
        <van-image :src="item.img_url" fit="contain">
          <template v-slot:error><img :src="defaultImg"></template>
        </van-image>
        <p>{{item.title}}</p>
      </li>
    </ul>

    <van-image v-if="indexAd.banner4" :src="indexAd.banner4" class="banner4" @click="banner4Url">
      <template v-slot:error><img :src="defaultImg"></template>
    </van-image>
    <!-- 限时抢购 -->
    <div class="limit_time white" v-if="time">
      <div class="limit_time_title flex">
        <div class="flex">

          <div class="line_border"></div>
          <h2>限时抢购 </h2>

          <van-count-down :time="time">
            <template v-slot="timeData">
              <span class="item" v-if="timeData.days>=1">{{ timeData.days*24 +timeData.hours}}</span>
              <span class="item" v-if="timeData.hours<10&&timeData.days<1">0{{ timeData.hours}}</span>
              <span class="item" v-if="timeData.hours>=10&&timeData.days<1">{{ timeData.hours}}</span>
              :
              <span class="item"><span v-if="timeData.minutes<10">0</span>{{ timeData.minutes }}</span>:
              <span class="item"><span v-if="timeData.seconds<10">0</span>{{ timeData.seconds }}</span>
            </template>
          </van-count-down>
        </div>
        <div class="flex ">
          <router-link class="green_font more flex" to="limitactive"><span>更多</span>
            <van-icon name="arrow"/>
          </router-link>
        </div>

      </div>
      <div class="flex hidden_scroll">
        <div class="limit_shop " v-for="(item,index) in itemList" @click="detailUrl(item)">

          <div class="desc">

            <van-image :src="item.img" fit="contain">
              <template v-slot:error><img :src="defaultImg"></template>
            </van-image>
            <p>{{item.item_title}}</p>
            <div class="tag">
              <span v-for="(label,indexw) in item.label">{{label}}</span>
            </div>
          </div>

          <div class="price">

            <div v-if="Token==null">
              <p class="red_font">￥{{item.activity_price}}/{{item.unit}}</p>
              <p>￥{{item.price}}</p>
            </div>
            <div v-else>
              <div v-if="is_look==1">

                  <p class="red_font">￥{{item.activity_price}}/{{item.unit}}</p>
                  <p>￥{{item.price}}</p></div>

              <div v-else class="red_font">
                ￥***
              </div>
            </div>
            <div class="addcart1">
              <img src="./../../../../static/img/addcart.png">
            </div>
          </div>

        </div>
      </div>

    </div>

    <div class="recomand_goods" style="min-height:200px;">
      <div class="flex">
        <div class="line_border"></div>
        <h2 class="">推荐商品</h2>
      </div>
      <van-list v-model="loading" :finished="finished" loading-text="正在加载中..." finished-text="已经到底呢" @load="onLoad">
        <div class="flex warp">
          <div v-for="item in list" class="recomand">
            <div @click="detailUrl(item)">
              <img :src="logo" class="shuiyin" v-if="shuiyin==1&&logo">
              <van-image :src="item.img" class="shopimg" fit="contain">
                <template v-slot:error><img :src="defaultPic"></template>
              </van-image>
              <p>{{item.title}}</p>
              <p class="gray line_spacing oneline">{{item.describe}}</p>

            </div>
            <div class="flex price">
              <div @click="detailUrl(item)">
                <div>
                  <span class="red_button" v-for="(label,indexw) in item.label" v-if="item.label!=''">{{label}}</span>
                </div>

                <div v-if="Token==null">
                  <div class="line_marg one_line" v-if="item.attr.length!=0">
                    <dfn class="red_font">￥{{item.area_price}}/{{item.unit}}</dfn><dfn class="gray">(多规格)</dfn>
                  </div>
                  <div class="red_font line_marg" v-else>
                        <div v-if="item.market_price==1">时价</div>
                    <div v-else>￥{{item.price}}/{{item.unit}}</div>
                  </div>
                </div>
                <div v-else>
                  <div class="line_marg one_line" v-if="is_look=='1'">

                      <div v-if="item.attr.length!=0">
                        <dfn class="red_font">￥{{item.area_price}}/{{item.unit}}</dfn><dfn class="gray">(多规格)</dfn>
                      </div>
                      <div v-else>
                        <div v-if="item.market_price==1"><dfn class="red_font">时价</dfn></div>
                            <div v-else> <div v-if="item.is_activity==1">
                              <span class="red_font">￥{{item.activity_price}}/{{item.unit}}</span>
                              <span class="throught gray">￥{{item.price}}</span>

                            </div>
                              <div v-else class="red_font">￥{{item.price}}/{{item.unit}}</div>
                            </div>
                        </div>


                  </div>
                  <div class="red_font line_marg " v-else>
                    ￥***
                  </div>
                </div>

              </div>

              <div class="addcart1">
                <img src="./../../../../static/img/addcart.png" @click="addCart(item,is_look)"/>
              </div>
            </div>
          </div>
        </div>

      </van-list>
    </div>

    <cart :show="visible" :details="this.information" @showCart1="visible=false"></cart>
    <div style="height:90px;font-size:0.6rem;text-align: center;" v-if="finished"><a href="http://www.caidj.cn"
                                                                                     style="color:#999!important;">
      由<strong style="font-family: normal;color: #9DD47F;">
      菜东家</strong>提供技术支持</a></div>
  </div>
  </div>
</template>
<script>
  import cart from '../../public/addcart'
  import APIUrl from './../../../../config/apiurl'
  import search from "./search"

  let obj = {
    appid: APIUrl.appid,
    timeStamp: APIUrl.timeStamp
  };
  export default {
    components: {

      cart
    },
    computed: {
      defaultImg() {
        return this.defaultPic;
      }
    },
    data() {
      return {
        Token: '',
        defaultPic: '',
        is_look: '',
        logo: '',
        shuiyin: '',
        page: 0,
        imgurl: APIUrl.root,
        indexAd: [],
        itemList: [],
        visible: false,
        isfix: false,
        list: [],
        loading: false,
        finished: false,
        time: '',
        is_detail: '',
        information: {
          is_look: '',
        },
      }
    },
    methods: {
      banner4Url() {
        if (this.indexAd.banner4_href) {
          window.location.href = this.indexAd.banner4_href;

        }
      },
      bannerUrl(data) {
        if (data.href) {
          window.location.href = data.href;
        }
      },
      jumpUrl(data) {
        let id = data.id;

        if (data.status == 0) {
          this.$toast('该栏目已下架');
          return;
        }
        switch (id) {
          case 1:
            this.$router.push({
              name: 'collectlist'
            });
            break;
          case 2:
            this.$router.push({
              name: 'newback'
            });
            break;
          case 3:
            this.$router.push({
              name: 'recommandshop'
            });
            break;
          case 4:
            window.location.href = `tel:${this.indexAd.phone}`
            break;
          case 5:
            this.$router.push({
              name: 'classify'
            });
            break;
          case 6:
            this.$router.push({
              name: 'shopcart'
            });
            break;
          case 7:
            this.$router.push({
              name: 'order'
            });
            break;
          case 8:
            this.$router.push({
              name: 'user'
            });
            break;
          default:
            this.$router.push({
              name: 'classify',
              query: {
                id: data.cate_id,
              }
            });
            break;
        }
      },
      searchUrl() {
        this.$router.push({
          name: 'search'
        })
      },
      detailUrl(data) {

        let id;
        if (data.item_id) {
          id = data.item_id
        } else {
          id = data.id;
        }
        if (this.is_detail == 1) {
          this.$router.push({
            path: '/shopdetail',
            query: {
              id: id
            }
          })
        }

      },
      limitList() {
        let sign = this.$md5(this.$sort(obj) + APIUrl.appsecret);
        let params = Object.assign({
          sign: sign
        }, obj)
        this.$get(APIUrl.panicBuyIndex, params).then(res => {
          if (res.code == 200) {
            this.itemList = res.data.itemList;
            this.time = Math.abs(res.data.timeRemain * 1000);
          }
        }).catch(error => {

        })
      },
      addCart(data, look) {
        this.visible = true;
        this.information = data;
        this.information.is_look = look;
      },
      onLoad() {
        this.Token = localStorage.getItem('token');
        this.page += 1;
        let sign = this.$md5(this.$sort(obj) + APIUrl.appsecret);
        let params = Object.assign({
          sign: sign
        }, obj, {
          page: this.page,
          num: 10
        })
        this.$get(APIUrl.indexItem, params).then(res => {
          if (res.code == 200) {
            localStorage.setItem('errImg', res.data.item_default);
            this.loading = false;
            let data = res.data;

            if (res.data.length == 0) {
              this.finished = true;
              return;
            }
            this.is_look = data.is_look;
            this.is_detail = data.is_detail;
            this.logo = data.logo;
            this.shuiyin = data.shuiyin;
            this.defaultPic = data.item_default;

            if (data.total == 10) {
              this.finished = true;
              this.list.push(...res.data.list);
              return;
            }
            if (data.list.length < 10) {
              this.finished = true;
              this.list.push(...res.data.list);
            } else {
              this.list.push(...res.data.list);
            }
          }
        })
      },
      nav() {
        let obj = {
          appid: APIUrl.appid,
          timeStamp: APIUrl.timeStamp
        };
        let sign = this.$md5(this.$sort(obj) + APIUrl.appsecret);
        let params = Object.assign({
          sign: sign
        }, obj)
        this.$get(APIUrl.indexAd, params).then(res => {
          if (res.code == 200) {
            this.indexAd = res.data;
            localStorage.setItem('open_time', res.data.open_time);
            localStorage.setItem('end_time', res.data.end_time);
          }
        })
      },
      handleScroll() {
        var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
        if (scrollTop >= 200) {

          // $(".search_style").addClass('on');
          // document.getElementById('')
          // document.querySelector('.search_style').classList.add('on');
        } else {
          // $(".search_style").removeClass('on');
          // document.querySelector('.search_style').classList.remove('on');
        }
      },
    },

    // 刷新
    activated() {
      localStorage.removeItem('identifying')
      if (this.$store.state.cache.pd) {
        var cache = {
          ind: '',
          num: 0,
          pd: false
        }
        this.$store.commit('SET_Cache', cache)
        window.location.reload();
      }
    },
    // 监听离开判断
    deactivated() {
      if (this.$route.name != 'shopdetail') {
        // console.log("44444444");
        this.loading = false;
        this.finished = false;
        var cache = {
          ind: '',
          num: 0,
          pd: true
        }
      } else {
        var cache = {
          ind: '',
          num: 0,
          pd: false
        }
      }
      this.$store.commit('SET_Cache', cache)
    },
    created() {
      localStorage.removeItem('identifying')

      // return;
      this.nav();
      this.limitList();
    },
    mounted() {
      window.addEventListener('scroll', this.handleScroll);
    }
  };
</script>
<style>
  .search input {
    background: none !important;
  }

  .home .search {
    background: rgba(247, 246, 246);

  }

  .home .search_style {
    background: #fff;
    padding: 2% 0;
  }

  .search_style.on {
    background-color: rgb(255, 255, 255);
    border-bottom: 1px solid #f9f8f8;
    -webkit-transition: background-color 500ms ease-in-out;
    -moz-transition: background-color 500ms ease-in-out;
    -o-transition: background-color 500ms ease-in-out;
    -ms-transition: background-color 500ms ease-in-out;
    transition: background-color 500ms ease-in-out;
  }

  .fixtop {
    position: fixed;
    padding: 1% 0;
    width: 100%;
    z-index: 6;
  }

  .limit_shop:nth-child(n+2) {
    margin-left: 20px;
  }

  .home .recomand_goods > div:first-child {
    padding: 3% 13px;
    align-items: center;
    background-image: linear-gradient(to bottom, #FFF, #F7F7F7);
    margin-top: 5px;
  }

  .home .recomand_goods > div:first-child h2 {
    font-size: 0.8rem;
    margin: 0 6px;
    font-weight: 600;
  }

  .home .limit_shop {
    justify-content: space-between;
    flex-direction: column;
    display: flex;
    width: 36%;
    padding: 0 0 0 5px;
    -ms-flex-negative: 0;
    flex-shrink: 0;
  }

  .limit_shop .tag span {
    background: #FF3E1E;
    font-size: 0.6rem;
    padding: 0 2px;
    border-radius: 2px;
    color: #FFE7D1;
    margin-right: 0.1rem;
  }

  .limit_shop .desc p {
    font-size: 0.7rem;
  }

  .home .banner {
    margin: 10px;
    width: 100%;
  }

  .home .classify p {
    width: 69%;
    text-align: center;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  .home .classify {
    flex-wrap: wrap;
    justify-content: center;
    background: white;
    margin-top: 4px;
    padding: 8px 0;
  }

  .home .classify img {
    display: block;
    width: 2.5rem;
    height: 2.5rem;
    object-fit: contain;
  }

  .home .classify li p {
    /*letter-spacing: 1px;*/
    margin-top: 2px;
  }

  .home .classify li {
    width: 25%;
    display: flex;
    margin-top: 2%;
    flex-direction: column;
    justify-content: center;
    font-size: 0.7rem;
    align-items: center;
  }

  .home .item {
    display: inline-block;
    width: 22px;
    margin-right: 5px;
    color: white;
    height: 0.8rem;
    line-height: 0.9rem;
    font-size: 12px;
    text-align: center;
    border-radius: 2px;
    background-color: black;
  }

  .home .limit_time {
    padding: 11px;
  }

  .limit_time_title {
    justify-content: space-between;
    font-size: 0.8rem;
    font-weight: 600;
  }

  .limit_time_title > div {
    align-items: center;
  }

  .limit_time_title .van-count-down {
    /*line-height: 0.9rem;*/
  }

  .limit_time_title h2 {
    letter-spacing: 2px;
    font-weight: 600;
    margin: 0 6px;
    font-size: 0.8rem;
  }

  .limit_time_title a {
    font-size: 0.5rem;
    display: flex;
    align-items: center;
  }

  .limit_time .price {
    font-size: 0.6rem;
    display: flex;
    justify-content: space-between;
  }

  .addcart {
    font-size: 1rem;
    color: white;
    align-items: center;
    display: flex;
  }

  .limit_time .price p:last-child {
    color: #808080;
    text-decoration: line-through;
  }

  .home .recomand_goods .recomand > div p,
  .home .recomand_goods .recomand > div > div {
    padding-left: 3px;
  }

  .home .recomand_goods .recomand:nth-child(n+3) {
    margin: 4% 1.5% 0%;
  }

  .home .recomand_goods .recomand {
    display: flex;
    flex-direction: column;
    width: 47%;
    justify-content: space-between;
    font-size: 0.7rem;
    -webkit-box-shadow: 1px 1px 6px lightgrey;
    box-shadow: 1px 1px 6px lightgrey;
    background: white;
    margin: 0% 1.5% 0%;
    border-radius: 6px;
    padding-bottom: 2%;
  }

  .home .recomand_goods .warp {
    flex-wrap: wrap;
    padding: 0 8px;
  }

  .home .limit_time .more {
    align-items: center;
    font-size: 0.6rem;
  }

  .home .recomand .shopimg {
    object-fit: contain;
    width: 100%;
    height: 5rem;
    margin-top: 4%;
  }

  .home .recomand .price {
    align-items: center;
    justify-content: space-between;
    width: 97%;
  }

  .home .van-notice-bar__content {
    color: #333;
  }

  .home .padding_back {
    height: 224px;
    background: #fff;
    width: 100%;
    position: absolute;
  }

  .home .banner4 {
    width: 92%;
    height: 5rem;
    margin: 5px auto;
    object-fit: contain;
    border-radius: 6px;
    display: block;
  }

  .home .oneline {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  .home .recomand .shuiyin {
    width: 2rem;
    height: 1rem;
    object-fit: contain;
    position: absolute;
    z-index: 1;
    margin-left: 1%;
    margin-top: 0;
  }

  .home .desc img {
    width: 100%;
    height: 5rem;
  }

  .home .hidden_scroll {
    overflow-x: scroll;
  }

  ::-webkit-scrollbar {
    width: 0;
    height: 0;
    background-color: transparent;
  }

  .my-swipe .van-swipe-item {
    color: #fff;
    font-size: 20px;
    /*line-height: 150px;*/
    text-align: center;
    /*background-color: #39a9ed;*/
  }

  .van-swipe {
    padding-top: 60px;
    height: 224px;
  }

  .my-swipe img {
    width: 99%;
  }

  .search_page .find_shop .addcart img {
    width: 0.8rem;
    height: 0.8rem;
  }

  .home .my-swipe img {
    /*box-shadow: 0px 2px 3px lightgrey;*/
    width: 99%;
  }

  .home .banner4 img {
    height: 5rem;
  }
</style>
