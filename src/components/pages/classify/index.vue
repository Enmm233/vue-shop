<template>
  <div class="category">
    <div class="search_style white fixed width" ref="elememt">
      <div class="search center vertical">
        <van-icon name="search" />
        <input type="text" @focus="searchUrl" placeholder="请输入商品名称" />
      </div>
    </div>

    <div class="flex">
      <div class="first_cate fixed" style="overflow-y: scroll;" :style="{height:selfheight+'px'}">
        <ul>
          <li v-for="(item,index) in secondCategory" class="flex" :class="{select_fisrt:secondIndex==index}" @click="selectSecond(item,index)">
            <span v-if="secondIndex==index"></span>
            <div class="first_name">{{item.name}}</div>
          </li>
        </ul>
      </div>

      <div>
        <div class="more_info">
          <div class="second_name flex white">
            <div class style="overflow-y:auto: scroll;width:90%;scrollbar-width: none; ">
              <van-tabs v-model="isActivew" @click="selectFirste">
                <van-tab v-for="(item,index) in topCategory" :key="index" :title="item.name"></van-tab>
              </van-tabs>
            </div>
            <i class="iconfont" @click="secondshow=true">&#xe638;</i>
          </div>
        </div>
        <div style="position: absolute;height: 100%;background:white;width:75%;"></div>
        <van-list v-model="loading" :finished="finished"  @load="onLoad" style="position:relative;">

          <ul class="second_cate white">
            <li v-for="(item,index) in list" class="flex">
              <img :src="logo" v-if="shuiyin==1&&logo" class="shuiyin" />
              <van-image :src="item.img" fit="contain" @click="detailUrl(item,index)">
                <template v-slot:error>
                  <img :src="defaultImg" />
                </template>
              </van-image>
              <div class="width flex-top-bottom">
                <div @click="detailUrl(item,index)">
                  <p>{{item.title}}</p>
                  <p class="gray small_font one_line">{{item.describe}}</p>
                </div>
                <div class="flex_left_right width">
                  <div @click="detailUrl(item,index)" :style="{width:(item.attr.length==0?'54%':'')}">
                    <span class="red_button" v-for="(label,indexw) in item.label" v-if="item.label">{{label}}</span>
                    <div class="line_marg ">
                      <span v-if="Token == null" class="flex_bottom">

                        <span class="red_font" v-if="item.attr.length==0">

                        <p v-if="item.market_price==1">时价</p>
                        <p v-else>￥{{item.price}}/{{item.unit}}</p>
                        </span>
                        <span v-else>
                          <dfn class="red_font">￥{{item.area_price}}/{{item.unit}}</dfn>
                          <dfn class="gray">(多规格)</dfn>
                        </span>
                      </span>
                      <div v-else>
                        <div v-if="is_look == 1" class="flex">

                                    <div v-if="item.attr.length==0" class="one_line">
                                      <div v-if="item.is_activity==1">
                                        <div class="red_font" v-if="arrNums[index]>item.activity_num">{{item.price}}/{{item.unit}}</div>
                                        <div v-else class="red_font">￥{{item.activity_price}}/{{item.unit}}</div>
                                      </div>
                                      <div v-else class="red_font">
                                        <div v-if="item.market_price==1" >时价</div>
                                        <div v-else> ￥{{item.price}}/{{item.unit}}</div>
                                       </div>
                                    </div>
                                      <div v-else class="one_line">
                                        <dfn class="red_font">￥{{item.area_price}}/{{item.unit}}</dfn>
                                        <dfn class="gray">(多规格)</dfn>
                                      </div>

                          </div>
                        <div v-else class="red_font">￥***</div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div v-if="item.attr.length==0">
                      <div v-if="arrNums[index]==0" class="self_plus" @click="addcartOne(item,item.cart_num,index)">
                        <img src="./../../../../static/img/plus.png" />
                      </div>
                      <van-stepper v-else v-model="arrNums[index]" min="0" @focus="showKeyBoard(item,arrNums[index],index)"
                        @plus="addCart(item,arrNums[index]+1,index)" @minus="addCart(item,arrNums[index]-1,index)"
                        disable-input />
                    </div>

                    <div class="addcart" v-else @click="addCarts(item,is_look)">
                      <img src="./../../../../static/img/addcart.png" />
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
          <div v-if="loaded">
            <div v-html="loaded" @click="enterNext" style="height:1.5rem;line-height: 1.5rem;text-align: center;font-size: 0.6rem;color:gray;"></div>
          </div>

        </van-list>

        <div class="no_content" v-show="showContent">
          <img src="../../../../static/img/no_content.png" />
        </div>

        <van-popup class="to_right" v-model="secondshow" position="right">
          <h2 class="center">全部分类</h2>
          <ul class="flex wrap">
            <li v-for="(item,index) in topCategory" @click="cateGory(item,index)" :class="{active:isActive == index}">{{item.name}}</li>
          </ul>
          <div class="option flex fixed">
            <button @click="secondshow=false">取消</button>
            <button @click="determine">确定</button>
          </div>
        </van-popup>
        <div style="height:60px;"></div>
      </div>
    </div>

    <cart :show="visible" :details="information" @showCart1="visible=false"></cart>
    <keyboard :show="showkey" :val="value" @keyBoard="showkey=false" @toParent="keyNum"></keyboard>
  </div>
</template>
<script>
  import keyboard from "./../../public/jianpan.vue";
  import cart from "../../public/addcart";
  import APIUrl from "./../../../../config/apiurl";
  import {
    MP
  } from "../../../../static/js/mp";

  let obj = {
    appid: APIUrl.appid,
    timeStamp: APIUrl.timeStamp
  };
  export default {
    components: {
      cart,
      keyboard
    },
    computed: {
      defaultImg() {
        return this.defaultPic;
      }
    },

    data() {
      return {
        defaultPic: "",
        timer: null,
        shuiyin: "",
        logo: "",
        Token: localStorage.getItem("token"),
        arrNums: [],
        is_look: "",
        index: "",
        loaded: "",
        nums: "",
        cart_nums: 0,
        root: APIUrl.root,
        page: 0,
        value: "",
        topCategory: [],
        secondCategory: [],
        visible: false,
        showkey: false,
        secondshow: false,
        firstIndex: 870,
        secondIndex: 0,
        firstId: this.$route.query.id,
        secondId: 0,
        list: [],
        loading: false,
        finished: false,
        selfheight: "",
        id: "",
        information: "",
        is_look: "",
        finitext: '',
        showContent: false,
        isActive: "",
        isActivew: "",
        activeData: "",
        goodsItem: "",
        is_detail: ''
      };
    },
    methods: {
      addcartOne(item, nums, index) {
        let arr = [];
        this.arrNums[index] = 1;
        for (let i of this.arrNums) {
          arr.push(i);
        }
        this.arrNums = arr;
        this.addCart(item, 1, index);
      },
      cateGory(data, index) {
        this.isActive = index;
        this.activeData = data;
      },
      determine() {
        if (this.activeData == "") {
          this.$toast("请选择分类");
        } else {
          this.isActivew = this.isActive;
          this.secondshow = false;
          this.selectFirst(this.activeData);
        }
      },
      showKeyBoard(data, num, index) {
        this.showkey = true;
        this.value = "";
        this.goodsItem = data;
        this.index = index;
      },
      keyNum(nums) {
        this.value = nums;
        let item = this.goodsItem;
        if (item.is_float == 1 && !Number.isInteger(Number(nums))) {
          this.$toast("购买数量不能为小数");
          return;
        }
        this.addCart(item, nums, this.index);
        let arr = [];
        this.arrNums[this.index] = nums;
        for (let i of this.arrNums) {
          arr.push(i);
        }
        this.arrNums = arr;
      },
      addCart(item, nums, index) {
        let obj = {
          appid: APIUrl.appid,
          timeStamp: APIUrl.timeStamp,
          item_id: item.id,
          attr_id: 0,
          item_num: nums
        };
        let sign = this.$md5(this.$sort(obj) + APIUrl.appsecret);
        let params = Object.assign({
            sign: sign
          },
          obj
        );
        if (nums == 0) {
          this.$post(APIUrl.deleteCart, params).then(res => {
            if (res.code == 200) {
              this.$toast("删除商品成功");
            }
          });
        } else {
          if (item.is_activity == 1) {
            if (item.panicActivity.is_limit == 1) {
              this.$post(APIUrl.changeNum, params).then(res => {
                if (res.code == 200) {
                  this.$toast("成功加入购物车");
                } else if (res.code == 407 || res.code == 406) {
                  this.$toast("购买数量不能超过活动数量");
                  if (item.activity_num > 0) {
                    let arr = [];
                    this.arrNums[index] = item.activity_num;
                    for (let i of this.arrNums) {
                      arr.push(i);
                    }
                    this.arrNums = arr;
                  } else {
                    let arr = [];

                    this.arrNums[index] = 0;
                    for (let i of this.arrNums) {
                      arr.push(i);
                    }
                    this.arrNums = arr;

                  }

                } else {
                  this.$toast(res.msg);
                }
              });
            } else {
              if (nums > item.activity_num) {
                this.$toast("购买数量超过活动数量，将恢复原价");
              }
              setTimeout(() => {
                this.$post(APIUrl.changeNum, params).then(res => {
                  if (res.code == 200) {
                    this.$toast("成功加入购物车");
                  } else {
                    this.$toast(res.msg);
                  }
                });
              }, 500);
            }

          } else {
            this.$post(APIUrl.changeNum, params).then(res => {
              if (res.code == 200) {
                this.$toast("成功加入购物车");
              } else {
                this.$toast(res.msg);
              }
            });
          }


        }
      },
      addCarts(data, look) {
        this.visible = true;
        this.information = data;
        this.information.is_look = look;
      },
      searchUrl() {
        this.$router.push({
          name: "search"
        });
      },
      detailUrl(data, index) {
        if (this.is_detail == 1) {
          this.$router.push({
            name: "shopdetail",
            query: {
              id: data.id,
              ind: index
            }
          });
        }

      },
      selectFirste(index, title) {
        this.isActive = index;
        this.selectFirst(this.topCategory[index], index);
      },
      // 点击一级分类
      selectFirst(data, index) {
        this.arrNums = [];
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
        this.arrNums = [];
        this.firstIndex = index;
        this.secondIndex = 0;
        this.firstId = data.id;
        this.secondId = 0;
        this.showContent = false;
        this.page = 0;
        this.list = [];
        this.loaded = "";
        this.loading = true; //下拉加载中
        this.finished = false; //下拉结束
        if (this.loading) {
          this.onLoad();
        }
      },
      // 点击二级分类
      selectSecond(data, index) {
        document.body.scrollTop = 0;
        this.arrNums = [];
        document.documentElement.scrollTop = 0;
        this.secondIndex = index;
        this.firstId = data.pid;
        this.secondId = data.id;
        this.showContent = false;
        this.page = 0;
        this.list = [];
        this.loaded = "";
        this.loading = true; //下拉加载中
        this.finished = false; //下拉结束
        if (this.loading) {
          this.onLoad();
        }
      },
      //分类商品接口
      loadList() {
        // return;
        let sign = this.$md5(this.$sort(obj) + APIUrl.appsecret);
        let params = Object.assign({
            sign: sign,
            firstId: this.firstId,
            secondId: this.secondId,
            page: this.page,
            num: 10
          },
          obj
        );

        this.$get(APIUrl.mpItemList, params).then(res => {

          if (!this.firstId) {
            this.firstId = res.data.firstCate[0].id;
          }

          if (this.firstId) {
            res.data.firstCate.map((e, index) => {
              if (this.firstId == e.id) {
                this.isActivew = index;
                this.isActive = index;
              }
            });
          }

          let data = res.data;
          this.is_look = res.data.is_look;
          this.loading = false;
          this.is_detail = data.is_detail;
          this.defaultPic = data.item_default;
          this.topCategory = data.firstCate;
          this.secondCategory = data.secondCate;
          this.shuiyin = res.data.shuiyin;
          this.logo = res.data.logo;
          res.data.list.forEach(v => {
            this.arrNums.splice(this.arrNums.length, 0, v.cart_num);
          });
          this.is_look = res.data.is_look;
          if (res.data.total == 1 && res.data.list.length == 0) {
            this.finished = true;
            this.showContent = true;
            this.loaded = "";
            this.finitext = "";
            return ;
          }
          if (data.total == 1 && data.list.length != 0) {
            this.list.splice(this.list.length, 0, ...res.data.list);
            if (this.secondIndex < this.secondCategory.length - 1) {
              this.loaded = `上滑或点击<span style=color:red;>${this.secondCategory[this.secondIndex+1].name}</span>进入下一分类`;
            } else {
              this.loaded = "已经没有更多呢";
            }
            this.finished = true;
            return
          }

          if (data.total > 1) {
            if (res.data.list.length) {
              this.list.splice(this.list.length, 0, ...res.data.list);
              if (res.data.list.length < 10) {
                this.finished = true;
                if (this.secondIndex < this.secondCategory.length - 1) {
                  this.loaded =
                    `上滑或点击<span style=color:red;>${this.secondCategory[this.secondIndex+1].name}</span>进入下一分类`;
                } else {
                  this.loaded = "已经没有更多呢";
                }


              }
            } else {
              this.finished = true;
              if (this.secondIndex < this.secondCategory.length - 1) {
                  this.loaded =
                    `上滑或点击<span style=color:red;>${this.secondCategory[this.secondIndex+1].name}</span>进入下一分类`;
                } else {
                  this.loaded = "已经没有更多呢";
                }

            }
          }
        });
      },
      enterNext() {
      if(this.loaded=='已经没有更多呢'){
       return;
      }
        document.body.scrollTop = 0;
        this.arrNums = [];
        document.documentElement.scrollTop = 0;
        this.secondIndex += 1;

        this.secondId = this.secondCategory[this.secondIndex].id;
        this.showContent = false;
        this.page = 0;
        this.list = [];
        this.loaded = "";
        this.loading = true; //下拉加载中
        this.finished = false; //下拉结束
        if (this.loading) {
          this.onLoad();
        }
      },
      onLoad() {
        this.page += 1;
        this.loadList();
      }
    },
    // 刷新
    activated() {
      // console.log(this.$store.state.cache.pd);
      if (this.$store.state.cache.pd) {
        var cache = {
          ind: "",
          num: 0,
          pd: false
        };
        this.$store.commit("SET_Cache", cache);

        window.location.reload();
      }

      if (this.$store.state.cache.ind >= 0) {
        this.$set(
          this.arrNums,
          this.$store.state.cache.ind,
          this.arrNums[this.$store.state.cache.ind] + this.$store.state.cache.num
        );
      }
    },
    created() {},
    // 监听离开判断
    deactivated() {
      if (this.$route.name != "shopdetail") {
        // console.log("11111");
        this.loading = false;
        this.finished = false;
        var cache = {
          ind: "",
          num: 0,
          pd: true
        };
      } else {
        var cache = {
          ind: "",
          num: 0,
          pd: false
        };
      }
      this.$store.commit("SET_Cache", cache);
    },
    mounted() {
      let height = document.body.clientHeight;
      let height2 = this.$refs.elememt.offsetHeight;
      this.selfheight = height - height2 - 60;
    }
  };
</script>
<style>
  /*body {*/
  /*	background: #FFFFFF;*/
  /*}*/

  .active {
    color: #009a44 !important;
    background: #cceadc !important;
  }

  .category .collect a {
    background: #e7e7e7;
    color: #808080;
    padding: 0 4px;
    border-radius: 3px;
  }

  .category .second_cate {
    margin-top: 2.7rem;
  }

  .category .collect {
    height: 25px;
    line-height: 25px;
    padding: 0 8px;
  }

  .category .to_right {
    width: 65%;
    height: 100%;
    font-size: 0.7rem;
  }

  .category .to_right h2 {
    margin: 4% 0 8%;
  }

  .category .to_right .option {
    bottom: 2%;
    right: 3%;
    color: white;
    border-radius: 5px;
  }

  .category .to_right .option button {
    padding: 3% 5%;
    width: 3rem;
  }

  .category .to_right .option button:first-child {
    background: #addb8c;
    border-bottom-left-radius: 5px;
    border-top-left-radius: 5px;
  }

  .category .to_right .option button:last-child {
    background: #009a44;
    border-bottom-right-radius: 5px;
    border-top-right-radius: 5px;
  }

  .category .to_right li {
    /*background: #E7E7E7;*/
    color: #009a44;
    border: 1px solid #009b44;
    border-radius: 3px;
    margin: 2%;
    padding: 1px 7px;
  }

  .category {
    font-size: 0.7rem;
  }

  .category .first_name {
    width: 100%;
    text-align: center;
    padding-left: 0.3rem;
    padding-right: 0.3rem;
  }

  .category .second_name>div {
    white-space: nowrap;
    width: 200px;
    overflow: auto;
  }

  /* TAB */
  .second_name .van-tabs__line {
    display: none;
  }

  .second_name .van-tabs__nav--line {
    padding-bottom: 0;
    margin-right: 0.3rem;
  }

  .second_name .van-tab--active {
    color: #009a44;
  }

  .second_name .van-tab {
    line-height: 2.4rem;
    flex-basis: initial !important;
    padding: 0 10px;
  }

  .second_name .van-ellipsis {
    overflow: initial;
  }

  .second_name .van-tabs--line .van-tabs__wrap {
    height: initial;
  }

  .second_name [class*="van-hairline"]::after {
    border: 0;
  }

  /* TAB结束 */
  .van-tabs__nav {}

  .category .second_name div span {
    /* margin-left: 10px; */
  }

  .category .second_name i {
    color: #009a44;
  }

  .category .second_name {
    /*padding-top: 1.1rem;*/
    height: 2.4rem;
    line-height: 2.4rem;
  }

  .category .search_style {
    padding: 3px 0;
    z-index: 5;
  }

  .category .search_style+div {
    padding-top: 2.3rem;
  }

  .category .first_cate li {
    background: #f7f7f7;
    padding-top: 0.7rem;
    padding-bottom: 0.7rem;
    border-bottom: 1px solid transparent;
    border-color: rgba(151, 151, 151, 0.1);
    align-items: center;
  }

  .category .first_cate .select_fisrt {
    background: white;
  }

  .category .first_cate .select_fisrt span {
    border-left: 6px solid #009a44;
    position: absolute;
    height: 1.5rem;
  }

  .category .first_cate {
    width: 25%;
    background: #f7f7f7;
  }

  .category .first_cate+div {
    margin-left: 25%;
    width: 100%;
  }

  .category .more_info {
    z-index: 5;
    position: fixed;
    width: 75%;
    background: #ffffff;
  }

  .category ::-webkit-scrollbar {
    display: none;
    /* Chrome Safari */
  }

  .second_cate {
    font-size: 0.7rem;
  }

  .second_cate li>img {
    width: 35%;
    height: 4rem;
    object-fit: contain;
    margin-right: 5px;
  }

  .second_cate li>.width {
    width: 54%;
  }

  .second_cate li>div {
    /*border-bottom: 1px solid #eaeaea;*/
    padding-bottom: 4px;
  }

  .second_cate li {
    margin: 6px 0 5px;
    /* padding: 0 10px; */
    border-bottom: 1px solid #eaeaea;
  }

  .category .search i {
    font-size: 1rem;
  }

  .category .addcart img {
    width: 0.8rem;
  }

  .no_content {
    text-align: center;
    padding-top: 50px;
    background: white;
    position: absolute;
    height: 80%;
  }

  .no_content img {
    width: 60%;
  }

  .second_cate .van-image {
    width: 5rem;
    height: 4rem;
    margin: 0 5px;
  }

  .category .shuiyin {
    position: absolute;
    z-index: 1;
    width: 2rem;
    height: 1rem;
    margin: -1% 0 0 1%;
  }
</style>
