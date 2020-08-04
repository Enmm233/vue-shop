<template>
  <div class="order">
    <div class="first_fix" id="first_Hight">
      <div class="nav">
        <span></span>
        <span>{{ordertitle}}</span>
        <span><i class="iconfont weight" @click="status=true">&#xe638;</i></span>
      </div>
      <div>
        <div v-if="status">
          <van-overlay :show="status" @click="status = false" />
          <div class="allorder center">
            <p @click="allOrder">全部订单</p>
            <p @click="noPay">未支付</p>
          </div>
        </div>
        <div class="flex childAccount white" @click="show=true" v-if="Is_child != 1">
          <p class="weight">选择子账号: <span class="gray">{{childAccount}}</span></p>
          <van-icon name="arrow" class="gray" />
        </div>
        <van-popup v-model="show" position="bottom" :style="{height:''}">
          <van-picker show-toolbar title="子账号" item-height="30" :columns="userList" @cancel="show=false" @confirm="onConfirm" />
        </van-popup>
      </div>
    </div>
    <van-tabs v-model="active" animated @click="t" id="tabbar" :title-active-color="selectColor" :style="{marginTop:countHeight+'px'}"
      :line-height="height+'px'">
      <van-tab :title="item.name" v-for="(item,index) in title" :key="index">
        <van-list v-model="loading" :finished="finished" :finished-text="tipmessage" @load="onLoad" :style="{marginTop:navHeight+'px'}">
          <div class="white order_info" v-for="(item,index) in list">
            <div class="order_num">
              <p>订单编号：{{item.order_sn}}</p>
              <p v-if="item.order_status==0">待审核</p>
              <p v-if="item.order_status==1">备货中</p>
              <p v-if="item.order_status==2">配送中</p>
              <p v-if="item.order_status==3">已收货</p>
              <p v-if="item.order_status==4">已取消</p>
            </div>
            <div class="shop flex" @click="orderInfoUrl(item.id)">
              <van-image :src="item.item_img" fit="contain">
                <template v-slot:error><img :src="defaultImg"></template>
              </van-image>
              <div class="order_width">
                <p class="shop_name">{{item.item_title}}<dfn class="gray">(等{{item.item_count}}件商品¥{{item.xd_price}})</dfn></P>
                <P>配送日期: {{item.send_time}}</P>
                <P v-if="item.is_cash_delivery==1">
                  实付:<span v-if="order.is_look == 0">¥ ***</span>
                  <span v-if="order.is_look == 1">¥ {{item.total_fee}}</span> 应付: <span v-if="order.is_look == 0">¥ ***</span>
                  <span v-if="order.is_look == 1">¥ {{item.yf_price}}</span>

                </P>
                <P v-else>
                  运费:<span v-if="order.is_look == 0">¥ ***</span>
                  <span v-if="order.is_look == 1">¥ {{item.delivery_fee}}</span> 应付: <span v-if="order.is_look == 0">¥
                    ***</span>
                  <span v-if="order.is_look == 1">¥ {{item.yf_price}}</span>

                </P>
                <p v-if="item.coupons_member_id!=0">现金券:<span style="margin-right:0.3rem;">¥ {{item.coupons_price}}</span></p>
                <P class="flex_left_right">
                  <dfn>下单时间: {{item.created_time}}</dfn>
                  <dfn v-if="item.pay_status==0" class="red_font">未支付</dfn>
                  <dfn v-if="item.pay_status==1" class="green_font">已支付</dfn>
                </P>
              </div>
            </div>
            <div class="button right" v-if="hiddenList">
              <button style="background:#ADDB8C;color:white;" @click="oneOrder(item.id)" v-if="item.order_status==2">
                再来一单
              </button>
              <button style="background:#ADDB8C;color:white;" @click="oneOrder(item.id)" v-if="item.order_status==3&&orderType==1">再来一单
              </button>
              <button style="background:#02B1E4;color:white;" @click="mapUrl(item)" v-if="item.order_status==2">查看物流
              </button>
              <button style="background:red;color:white;" v-if="item.order_status==3&&item.pay_status==0" @click="pay(item.id,item.wx_pay)">马上支付
              </button>
              <button style="background:white;color:#808080;border:1px solid #808080;" @click="cancelOrder(item.id,index)"
                v-if="item.order_status==0">取消订单
              </button>
              <button style="background:white;color:#808080;border:1px solid #808080;" v-if="item.order_status==3&&item.pay_status==1">已支付
              </button>
              <button style="background:red;color:white;border:1px solid red;" @click="confirmOrder(item.id,index)"
                v-if="item.order_status==2">确认收货
              </button>
              <!--							<button style="background:red;color:white;" v-if="item.order_status==0" @click="pay(item.id)">马上支付</button>-->
            </div>
          </div>
        </van-list>
        <div style="height:60px;"></div>
        <div v-if="showbit" class="no_infos">
          <img src="./../../../../static/img/no_record.png"></div>
      </van-tab>
    </van-tabs>
  </div>
</template>
<script>
  import APIUrl from './../../../../config/apiurl';

  export default {
    data() {
      return {
        countClick:0,
        Is_child: localStorage.getItem('is_child'),
        active: 5,
        height: 0,
        selectColor: 'black',
        showbit: false,
        imgshow: false,
        hiddenList: false,
        countHeight: '',
        navHeight: '',
        imgUrl: APIUrl.root,
        is_bind: '',
        tipmessage: '当前没有更多了',
        show: false,
        page: 0,
        childAccount: '当前账号',
        ordertitle: '全部订单',
        orderType: 1,
        status: false,
        title: [{
            name: '待审核',
            id: '1'
          },
          {
            name: '备货中',
            id: '2'
          },
          {
            name: '配送中',
            id: '3'
          },
          {
            name: '已收货',
            id: '4'
          },
          {
            name: '已取消',
            id: '5'
          },
          {
            name: '21',
            id: '6'
          },

        ],
        timer: null,
        userList: ["当前账号"],
        userId: [''],
        statusId: '',
        userIndex: '',
        order: '',
        list: [],
        loading: false,
        finished: false
      }
    },
    computed: {
      defaultImg() {
        return this.order.item_default;
      }
    },
    methods: {
      onConfirm(value, index) {
        this.loading = true; //下拉加载中
        this.finished = false; //下拉结束
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
        this.show = false;
        this.childAccount = value;
        this.userIndex = index;
        this.page = 1;
        this.list = [];
        this.tipmessage = '当前没有更多了';
        this.showbit = false;
        this.orderList()
      },
      orderInfoUrl(id) {
        this.$router.push({
          name: 'orderdetail',
          query: {
            id: id
          }
        })
      },
      allOrder() {
        this.list = [];
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
        this.ordertitle = "全部订单";
        this.selectColor = "black",
        this.active = 5;
        this.height = 0;
        this.orderType = 1;
        this.page = 1;
        this.status = false;
        this.statusId = "";
        this.tipmessage = '当前没有更多了';
        this.showbit = false;
        this.loading = true; //下拉加载中
        this.finished = false; //下拉结束
        this.orderList()
      },
      noPay() {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
        this.selectColor = "black",
          this.height = 0;
        this.active = 5;
        this.list = [];
        this.ordertitle = "未支付";
        this.orderType = 2;
        this.page = 1;
        this.status = false;
        this.statusId = "";
        this.tipmessage = '当前没有更多了';
        this.showbit = false;
        this.loading = true; //下拉加载中
        this.finished = false; //下拉结束
        this.orderList()
      },
      t(name) {

        this.countClick++;
        console.log( this.countClick)
        this.height = 3;
        this.selectColor = "#1EA55A",
          document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
        this.page = 0;
        this.statusId = name + 1;
        this.tipmessage = '当前没有更多了';
        this.showbit = false;
        this.list = [];
        this.loading = true; //下拉加载中
        this.finished = false; //下拉结束
        if (this.loading&&this.countClick==1) {

          this.onLoad();
        }
      },
      childInfo() {
        let obj = {
          appid: APIUrl.appid,
          timeStamp: APIUrl.timeStamp
        };
        let sign = this.$md5(this.$sort(obj) + APIUrl.appsecret);
        let params = Object.assign({
          sign: sign,
        }, obj)
        this.$get(APIUrl.childInfo, params).then(res => {
          if (res.code == 200) {

            for (var i = 0; i < res.data.length; i++) {
              this.userList.push(res.data[i].nickname)
              this.userId.push(res.data[i].zid)
            }
          }
          // console.log(this.userId)
        })
      },
      orderList() {

        this.order = '';
        var type = this.orderType;

        if (this.userIndex == 0) {
          var select_zid = '';
        } else {
          var select_zid = this.userId[this.userIndex];
        }
        // console.log(select_zid)
        let obj = {
          appid: APIUrl.appid,
          page: this.page,
          type: type,
          timeStamp: APIUrl.timeStamp
        };

        let sign = this.$md5(this.$sort(obj) + APIUrl.appsecret);
        let params = Object.assign({
          sign: sign,
          status: this.statusId,
          select_zid: select_zid,
        }, obj);

        this.$get(APIUrl.orderList, params).then(res => {
          let data = res.data;
          if (res.code == 200) {
            this.countClick=0;
            this.loading = false;
            this.order = res.data;
            if (res.data.list.length == 0) {
              this.finished = true;
              if (this.page == 1) {
                this.tipmessage = '';
                this.showbit = true;
              }
            } else {
              if (res.data.list.length < 10) {
                this.finished = true;
                this.list.splice(this.list.length, 0, ...res.data.list);
              } else {
                this.list.splice(this.list.length, 0, ...res.data.list);
              }
            }
            if (this.statusId == 2 || this.statusId == 5) {
              this.hiddenList = false;
            } else {
              this.hiddenList = true;
            }
          }
        })


      },
      onLoad() {
        this.page += 1;
        this.orderList();
      },
      option(url, params, message, success) {
        this.$dialog.confirm({
          // title: '标题',
          message: message
        }).then(() => {
          // on confirm

          this.$get(url, params).then(res => {
            if (res.code == 200) {
              this.$toast(success);

            } else {
              this.$toast(res.msg)
            }
          })
        }).catch(() => {
          // on cancel
        });
      },
      pay(id) {
        console.log(this.is_bind)
        if (this.is_bind == 1) {
          this.$router.push({
            path: '/payment',
            query: {
              id: id
            }
          })

        } else {
          this.$toast('请先绑定微信');
          this.$router.push({
            name: 'user'
          });
          // this.adminisus_weixin()
        }

      },
      // 绑定微信
      adminisus_weixin() {
        if (localStorage.getItem('token')) { // 判断是否登录
          let url = "http://" + window.location.host + '/#/order';
          var urle = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + this.wxConfig.appId +
            '&redirect_uri=' + encodeURIComponent(url) + '&response_type=code&scope=snsapi_userinfo#wechat_redirect';
          window.location.href = urle;
        } else {
          this.$router.push("/login");
        }
      },
      cancelOrder(id, index) {
        this.$dialog.confirm({
          // title: '标题',
          message: "是否取消订单"
        }).then(() => {
          // on confirm
          let obj = {
            appid: APIUrl.appid,
            timeStamp: APIUrl.timeStamp,
            id: id,
          };

          let sign = this.$md5(this.$sort(obj) + APIUrl.appsecret);
          let params = Object.assign({
            sign: sign,
          }, obj);
          this.$get(APIUrl.cancelOrder, params, ).then(res => {
            if (res.code == 200) {
              this.$toast('取消订单成功');
              this.list.splice(index, 1);
            } else {
              this.$toast(res.msg)
            }
          })

        }).catch(() => {
          // on cancel
        });

      },
      confirmOrder(id, index) {
        this.$dialog.confirm({
          // title: '标题',
          message: "是否确认收货？"
        }).then(() => {
          let obj = {
            appid: APIUrl.appid,
            timeStamp: APIUrl.timeStamp,
            id: id,
          };

          let sign = this.$md5(this.$sort(obj) + APIUrl.appsecret);
          let params = Object.assign({
            sign: sign,
          }, obj);
          this.$get(APIUrl.receiveOrder, params, ).then(res => {
            if (res.code == 200) {
              this.$toast('已确认收货');
              this.list.splice(index, 1);
              if (this.list.length == 0) {
                this.showbit = true;
                this.tipmessage = '';
              }
            } else {
              this.$toast(res.msg)
            }
          })
        }).catch(() => {
          // on cancel
        });
      },
      oneOrder(id) {
        this.$dialog.confirm({
          // title: '标题',
          message: "是否再来一单"
        }).then(() => {
          // on confirm
          let obj = {
            appid: APIUrl.appid,
            timeStamp: APIUrl.timeStamp,
            id: id,
          };

          let sign = this.$md5(this.$sort(obj) + APIUrl.appsecret);
          let params = Object.assign({
            sign: sign,
          }, obj);

          this.$get(APIUrl.oneMoreTime, params).then(res => {
            if (res.code == 200) {
              this.$toast("已成功再来一单");
              this.$router.push({
                name: 'shopcart'
              })
            } else {
              this.$toast(res.msg)
            }
          })

        }).catch(() => {
          // on cancel
        });


      },
      mapUrl(data) {
        let id = data.vehicle_id;
        let obj = {
          appid: APIUrl.appid,
          timeStamp: APIUrl.timeStamp,
          // id: id
        };
        let sign = this.$md5(this.$sort(obj) + APIUrl.appsecret);
        let params = Object.assign({
          sign: sign,
        }, obj)
        this.$post(APIUrl.carPosition, params).then(res => {
          if (res.code == 200) {
            let data = res.data;
            // let lat = data.member_latitude;
            // let lon = data.member_longitude;
            let carlat = data.latitude;
            let carlon = data.longitude;
            // return;
            if (!carlat && !carlon) {
              this.$toast('该订单没有物流信息');
            } else {
              this.$router.push({
                path: '/logistics',
                query: {
                  // lat: lat,
                  // lon: lon,
                  carlat: carlat,
                  carlon: carlon,
                  ak: data.ak,
                }
              })
            }
          } else {
            this.$toast(res.msg)
          }
        })

      },
    },
    created() {
      if (this.Is_child != 1) {
        this.childInfo()
      }
      this.is_bind = localStorage.getItem('is_bind');

    },
    // 刷新
    activated() {
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
      // console.log(this.$route.name)
      if (this.$route.name == 'orderdetail' || this.$route.name == 'logistics') {
        var cache = {
          ind: '',
          num: 0,
          pd: false
        }
      } else {
        this.loading = false; //下拉加载中
        this.finished = false; //下拉结束
        var cache = {
          ind: '',
          num: 0,
          pd: true
        }

      }
      this.$store.commit('SET_Cache', cache);
      // console.log(this.$store.state.cache)
    },
    mounted() {
      let first = document.getElementById('first_Hight').offsetHeight;
      this.countHeight = first;
      let tabbar = document.getElementById('tabbar');
      this.navHeight = tabbar.querySelector('div').offsetHeight;
    }
  }
</script>
<style>
  .order .allorder p {
    padding: 6% 7% 7%;
  }

  .order .allorder p:first-child {
    border-bottom: 1px solid #ECE9EA;
    padding: 6% 7% 7%;
  }

  .order .allorder {
    padding: 2px 0 0 0;
    z-index: 9999;
    border-radius: 2px;
    position: fixed;
    right: 10px;
    color: #1EA55A;
    font-size: 0.7rem;
    background: white;
    width: 25%;
  }

  .order .selectAccount {
    background: #ECE9EC;
  }

  .order .childAccount {
    align-items: center;
    font-size: 0.7rem;
    padding: 0 10px;
    justify-content: flex-end;
    height: 35px;
  }

  .order .childAccount p span {
    padding: 0 3px;
  }

  .order .order_info {
    padding: 0 10px;
  }

  .order .order_info:nth-child(n+2) {
    margin-top: 4px;
  }

  .order .order_info .button {
    font-size: 0.6rem;
    padding: 5px 0;
  }

  .order .order_info .button button {
    border-radius: 10px;
    padding: 0 6px;

  }

  .order .order_info>p {
    font-size: 0.6rem;
    padding: 2px 0;
    color: #808080;
  }

  .order .order_info .right {
    border-top: 1px solid #F7F6F6;
  }

  .order .order_info .shop {
    padding: 5px 0;
    font-size: 0.7rem;
    border-top: 1px solid #F7F6F6;
  }

  .order .order_info .shop img {
    width: 5rem;
    height: 4rem;
    margin-right: 10px;
    object-fit: contain;
  }

  .order .order_info .shop span {
    display: inline-block;
    color: red;
    margin-right: 0.3rem;
  }

  .order .nav i {
    color: #1EA55A;
  }

  .order .nav {
    border-bottom: 5px solid #F7F7F7;
    /*background: #009A44;*/
    background: white;
    padding: 10px;
    color: black;
    font-size: 0.8rem;
    display: flex;
    justify-content: space-between;
  }

  .order .van-tabs__wrap--scrollable .van-tab {
    flex: 0;
    color: #1A1A1A;
    height: 31px;
    line-height: 31px;
  }

  .order .van-tabs__wrap--scrollable .van-tab:nth-child(6) {
    display: none;
  }

  .order .van-tabs__nav--line {
    background: white;
    color: #1EA55A;
    box-sizing: content-box;
    height: 100%;
    padding-bottom: 8px;
  }

  .order .van-tab--active {
    /*color: #1EA55A !important;*/
    font-weight: 500;
  }

  .order .van-tabs__line {
    background: #21A75F;
    width: 22px !important;
  }

  .order .van-tabs--line .van-tabs__wrap {
    height: 35px;
    width: 100%;
    position: fixed;
    /*margin-top: 0.62rem;*/
    z-index: 1;
  }

  /*.order .van-tabs__content--animated {*/
  /*	margin-top: 58px;*/
  /*}*/

  .order .van-picker__cancel,
  .van-picker__confirm {
    color: #009A44;
    font-size: 0.7rem;
  }

  /*.order .van-tabs__track {*/
  /*	margin-top: 50px;*/
  /*}*/

  .order .van-picker__title {
    font-size: 0.9rem;
  }

  .order .van-picker__toolbar {
    background: #ECE9EC;
    height: 2rem;
    line-height: 2rem;
  }

  .order .van-overlay {
    z-index: 9998;
  }

  .order .van-tab__text {
    font-size: 0.7rem;
  }

  .order .no_infos {
    text-align: center;
    margin-top: 13%;
  }

  .order .no_infos img {
    width: 50%;
  }

  .order .first_fix {
    z-index: 2;
    top: 0;
    position: fixed;
    width: 100%;
  }

  .order .order_num {
    display: flex;
    justify-content: space-between;
    color: #808080;
    font-size: 0.6rem;
    height: 1rem;
    align-items: center;
  }

  /*@media (max-width: 414px) {*/
  /*	.order .van-tabs__content--animated {*/
  /*		margin-top: 55px;*/
  /*	}*/
  /*}*/
  /*@media (max-width:320px) {*/
  /*	.order .van-tabs__content--animated {*/
  /*		margin-top: 50px;*/
  /*	}*/
  /*}*/

  .order .shop .order_width {
    width: 100%;
  }
</style>
