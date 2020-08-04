<template>
  <div :class="isShowCart==true?'':'hiddencart'">
    <div v-if="shopInfo.countNum">
      <div class="shopcart">
        <div style="height:10px;"></div>
        <div class="sendaddress white" @click="deliveryUrl">
          <p>{{contact}} <span>{{mobile}}</span></p>
          <div class="">
            <div>
              <!--            <i class="iconfont dizhi">&#xe61f;</i>-->
              <img src="./../../../../static/img/dizhi.png">
              <dfn class="address">{{address}}</dfn>
            </div>
            <van-icon name="arrow" class="gray" />
          </div>
        </div>
        <div class="detail">
          <section class="flex">
            <!--          <i class="iconfont ">&#xe65b;</i> -->
            <img src="./../../../../static/img/clock.gif">
            <h2>
              请在({{shopInfo.open_time}} - {{shopInfo.end_time}} )之间下单</h2>
          </section>
          <div>
            <ul>
              <li class="info" @click="chileCount">
                <span class="weight">子账号</span>
                <span class="flex">
                  <dfn>{{count}} </dfn>
                  <van-icon name="arrow" />
                </span>
              </li>
              <li class="info" @click="showtime=true">
                <span class="weight">配送日期</span>
                <span class="flex">
                  <dfn>{{sendtime}}</dfn>
                  <van-icon name="arrow" />
                </span>
              </li>
              <li class="info" @click="selectTime=true">
                <span class="weight">配送时间</span>
                <span class="flex">
                  <dfn>{{sendtimetwo}}</dfn>
                  <van-icon name="arrow" />
                </span>
              </li>
              <router-link to="shoplist">
                <li class="info">
                  <span class="weight">商品列表</span>
                  <span class="flex">
                    <dfn>单品备注</dfn>
                    <van-icon name="arrow" />
                  </span>
                </li>
              </router-link>
            </ul>
          </div>
          <div>
            <ul>
              <template v-if="Is_child==0">
                <li class="info" @click="cash" v-if="shopInfo.on_delivery==0">
                  <span class="weight">现金券</span>
                  <span class="flex">
                    <dfn v-if="cashprice!=0">{{ couponsListe.coupons_title }}(余额{{ couponsListe.residue }}元)</dfn>
                    <dfn v-else>不使用</dfn>
                    <van-icon name="arrow" />
                  </span>
                </li>
              </template>
              <li class="info">
                <span class="weight">小计</span>
                <span class="weight">
                  ￥{{shopInfo.countPrice}}
                </span>
              </li>
              <li class="info">
                <span class="weight">运费</span>
                <span>
                  <dfn class="gray" v-if="shopInfo.fare==0">(免运费)</dfn>
                  <dfn class="weight" v-else> ￥{{shopInfo.fare}}</dfn>
                </span>
              </li>
            </ul>
          </div>
          <div class="flex">
            <span class="weight">备注</span>
            <textarea placeholder="请告诉我们需要注意的地方" v-model="remark" ></textarea>
          </div>
        </div>
      </div>
      <div class="total_price" v-if="isShowCart">
        <div class="note " v-if="activity_type==1">
          <span v-html="fullreduce">
          </span>
          <span class="red_font flex align-items_center" @click="sortUrl">
            <strong>去凑单</strong>
            <van-icon name="arrow" />
          </span>
        </div>
        <div class="flex count">
          <section class="flex white">
            <div>
              <span class="gray">共{{shopInfo.countNum}}件</span>
              <p class="green_font small_font" v-if="activity_type==2&&gift">(包赠品{{gift}}件)</p>
            </div>
            <div style="margin-left:4%;">
              <div class="flex">
                <div>合计 :</div>
                <div v-if="shopInfo.on_delivery==0">
                  <span class="red_font" v-if="shopInfo.is_look==1">
                    <dfn v-if="shopInfo.activity_type == 1">
                      ￥{{(parseFloat(shopInfo.fullPrice-shopInfo.discount)+parseFloat(shopInfo.fare)-parseFloat(cashprice)<0?0:parseFloat(shopInfo.fullPrice-shopInfo.discount)+parseFloat(shopInfo.fare)-parseFloat(cashprice)).toFixed(2)}} </dfn> <dfn v-else>
                        ￥{{(parseFloat(shopInfo.countPrice)+parseFloat(shopInfo.fare)-parseFloat(cashprice)<0?0:parseFloat(shopInfo.countPrice)+parseFloat(shopInfo.fare)-parseFloat(cashprice)).toFixed(2)}} </dfn> </span> <span class="red_font" v-else>
                          <dfn>
                            ￥***
                          </dfn>
                  </span>
                  <p v-if="shopInfo.discount!=0" class="throught gray small_font">
                    ￥{{(parseFloat(shopInfo.totalPrice)+parseFloat(shopInfo.fare)).toFixed(2)}}</p>
                </div>
                <div v-else>
                  <span class="red_font" v-if="shopInfo.is_look==1">
                    <dfn v-if="shopInfo.activity_type == 1">
                      ￥{{(parseFloat(shopInfo.fullPrice-shopInfo.discount)+parseFloat(shopInfo.fare)).toFixed(2)}}
                    </dfn>
                    <dfn v-else>
                      ￥{{(parseFloat(shopInfo.countPrice)+parseFloat(shopInfo.fare)).toFixed(2)}}
                    </dfn>
                  </span>
                  <span class="red_font" v-else>
                    <dfn>
                      ￥***
                    </dfn>
                  </span>
                  <p v-if="shopInfo.discount!=0" class="throught gray small_font">
                    ￥{{(parseFloat(shopInfo.totalPrice)+parseFloat(shopInfo.fare)).toFixed(2)}}</p>
                </div>
              </div>
            </div>
          </section>
          <div class="confirm_order" @click="confirmOrder">
            确认下单
          </div>
        </div>
      </div>
      <van-popup v-model="cashshow" position="bottom" :style="{ height: '36%' }">
        <van-picker show-toolbar item-height="40" :columns="cashe" title="现金券" @cancel="cashshow=false" @confirm="cashconfirm" />
      </van-popup>
      <van-popup v-model="show" position="bottom" :style="{ height: '36%' }">
        <van-picker show-toolbar title="子账号" item-height="30" :columns="columns" @cancel="show=false" @confirm="onConfirm" />
      </van-popup>
      <van-popup v-model="showtime" position="bottom">
        <van-datetime-picker class="select_time" v-model="currentDate" :min-date="sendtime1" title="配送日期" type="date" :formatter="formatter" @cancel="showtime=false" @confirm="confirmTime" />
      </van-popup>
    </div>
    <div v-else class="null_cart">
      <div class="cart_photo"><img src="new/img/nullcart.png"></div>
      <div class="recomand_goods">
        <div class="flex">
          <div class="line_border"></div>
          <h2 class="">推荐商品 </h2>
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
                    <div class="line_marg">
                      <span class="red_font">
                       ￥{{item.price}}/{{item.unit}}</span>
                    </div>
                  </div>
                  <div v-else class="one_line">
                    <div class="line_marg" v-if="is_look=='1'">

                       <div v-if="item.attr.length!=0">
                        <dfn class="red_font">￥{{item.area_price}}/{{item.unit}}</dfn><dfn class="gray">(多规格)</dfn></div>
                        <div v-else>
                          <div v-if="item.is_activity==1">
                            <span  class="red_font">￥{{item.activity_price}}/{{item.unit}}</span>
                            <span class="throught gray">￥{{item.price}}</span>
                          </div>
                          <div v-else  class="red_font">
                            <div v-if="item.market_price==1">时价</div>
                            <div v-else>   ￥{{item.price}}/{{item.unit}}</div>
                         </div>
                        </div>

                     </div>
                    <div class="red_font line_marg" v-else>
                     ￥***
                    </div>
                  </div>
                </div>
                <div class="addcart1">
                  <img src="./../../../../static/img/addcart.png" @click="addCart(item,is_look)" />
                </div>
              </div>
            </div>
          </div>
        </van-list>
      </div>
      <div class="height_px"></div>
    </div>
    <cart :show="visible" :details="this.information" @showCart1="visible=false"></cart>
    </van-popup>
    <van-popup v-model="selectTime" position="bottom" :style="{ height: '36%' }">
      <van-picker show-toolbar title="配送时间" item-height="30" :columns="columntwo" @cancel="selectTime=false" @confirm="selectStart" />
    </van-popup>
  </div>
</template>
<script>
import APIUrl from './../../../../config/apiurl'
import cart from '../../public/addcart'

export default {
  components: {
    cart
  },
  data() {
    return {
       isShowCart:true,
      visible: false,
      Is_child: localStorage.getItem('is_child'),
      remark: '',
      select_zid: '',
      show: false,
      showtime: false,
      cashshow: false,
      contact: '',
      mobile: '',
      address: '',
      sendtime: "",
      sendtime1: "",
      count: '当前账号',
      currentDate: "",
      shopInfo: [],
      price: '',
      delivery: '',
      users: [],
      activity_type: '',
      fullreduce: '',
      gift: '',
      cashe: ["不使用"],
      cashprice: 0,
      couponsListe: {
        id: ''
      },
      columns: ["当前账号"],
      columnsId: [],
      Token: localStorage.getItem('token'),
      defaultPic: '',
      is_look: '',
      logo: '',
      shuiyin: '',
      page: 0,
      imgurl: APIUrl.root,
      indexAd: [],
      list: [],
      loading: false,
      finished: false,
      information: {
        is_look: '',
      },
      userIndex: '',
      columntwo: ['不限'],
      sendtimetwo: '',
      selectTime: false,
      delivery_time_id: '',
      delivery_time_list: '',
      is_detail:''

    }
  },
  computed: {
    defaultImg() {
      return this.defaultPic;
    }
  },
  methods: {
    // 确认现金券
    cashconfirm(value, index) {
      console.log(`当前值：${value}, 当前索引：${index}`)
      if (index == 0) {
        this.couponsListe = { id: '' }
        this.cashprice = 0
      } else {
        this.couponsListe = this.shopInfo.couponsList[index - 1]
        let obj = {
          id: this.shopInfo.couponsList[index - 1].id,
          appid: APIUrl.appid,
          timeStamp: APIUrl.timeStamp
        };
        let sign = this.$md5(this.$sort(obj) + APIUrl.appsecret);
        let params = Object.assign({
          sign: sign
        }, obj)
        this.$get(APIUrl.useCouponsPrice, params).then(res => {
          if (res.code == 200) {
            this.cashprice = res.data.couponsPrice
          }
        })
      }
      this.cashshow = false
    },
    // 显示现金券
    cash() {
      this.cashshow = true
    },
    selectStart(index) {

      let list = this.delivery_time_list;

      for (let i of list) {
        if (i.delivery_time_info == index) {
          this.sendtimetwo = index;
          this.delivery_time_id = i.delivery_time_id;
          this.selectTime = false;
          return;
        } else {
          this.sendtimetwo = '不限';
          this.delivery_time_id = '';
          this.selectTime = false;
        }

      }


    },
    addCart(data, look) {
      this.visible = true;
      this.information = data;
      this.information.is_look = look;
    },
    chileCount() {

      this.show = true;

    },
    onLoad() {
      let obj = {
        appid: APIUrl.appid,
        timeStamp: APIUrl.timeStamp
      };
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

          this.loading = false;
           if (res.data.length == 0) {
            this.finished = true;
            return;
          }
          let data = res.data;
          this.is_detail=data.is_detail;
          this.is_look = data.is_look;
          this.logo = data.logo;
          this.shuiyin = data.shuiyin;
          this.defaultPic = data.item_default;

          if (data.total == 10) {
            this.finished = true;
            this.list.push(...res.data.list);
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
    sortUrl() {
      this.$router.push({
        name: 'classify'
      })
    },
    deliveryUrl() {
      this.$router.push({
        path: '/delivery',
        query: {
          url: 'shopcart',
          id: 1,
          select_zid: this.select_zid
        }
      })
    },
    formatter(type, val) {
      if (type === 'year') {
        return `${val} <span>年</span>`;
      } else if (type === 'month') {
        return `${val}  月`
      } else if (type === 'day') {
        return `${val}  日`
      }
      return val;
    },
    cart() {
      var date = new Date();
      let n = date.getTime() + 24 * 3600000;
      date.setTime(n);
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var day = date.getDate();

      if (month < 10) {
        month = '0' + month;
      }

      if (day < 10) {
        day = '0' + day;
      }
      this.sendtime = year + '-' + month + '-' + day;
      date.setFullYear(year, month - 1, day)
      this.sendtime1 = new Date(year, month - 1, day - 1);
      this.currentDate = date;
      let obj = {
        appid: APIUrl.appid,
        timeStamp: APIUrl.timeStamp
      };
      let sign = this.$md5(this.$sort(obj) + APIUrl.appsecret);
      let params = Object.assign({
        sign: sign
      }, obj)
      this.$get(APIUrl.addInfo, params).then(res => {
        if (res.code == 200) {
          let data = res.data;
          this.shopInfo = data;
          this.activity_type = data.activity_type;
          let data1 = data.userInfo;
          this.contact = data1.contact;
          this.mobile = data1.phone;
          this.address = data1.address;

          this.sendtimetwo = '不限';
          this.delivery_time_id = '';
          this.delivery_time_list = data.delivery_time_list;
          for (let i of data.delivery_time_list) {
            this.columntwo.push(i.delivery_time_info)
          }

          let length = data.activity_rule.length;
          let index = data.activity_rule[length - 1];

          // 现金券
          if (res.data.couponsList.length != 0) {
            this.couponsListe = res.data.couponsList[0]
            for (var i = 0; i < res.data.couponsList.length; i++) {
              this.cashe.push(res.data.couponsList[i].coupons_title + '(余额' + res.data.couponsList[i].residue + "元)")
            }
          }


          //满减
          if (this.activity_type == 1) {
            for (let i of data.activity_rule) {
              let purchase = i.price - data.fullPrice;
              let cut = i.reduce;
              if (data.fullPrice < i.price) {
                this.fullreduce = `再满<strong class="red_font">${purchase.toFixed(2)}元</strong>减 <strong class="red_font">${cut}元</strong>`;
                return;
              }
            }
            if (data.fullPrice > index.price) {
              this.fullreduce = `已享受满<strong class="red_font">${index.price}元</strong>减 <strong class="red_font">${index.reduce}元</strong>服务`;
              return;
            }
          }
          //满赠

          if (this.activity_type == 2) {
            for (let i = length - 1; i >= 0; i--) {
              if (data.fullPrice >= data.activity_rule[i].price) {
                this.gift = data.activity_rule[i].item[0].num;
                return;
              }

            }

          }

        }
      })
    },

    onConfirm(index) {
      console.log(index)
      let user = this.shopInfo.userInfo;
       this.show = false;
      for (let i of this.users) {

        if (i.nickname == index) {
          this.mobile = i.mobile;
          this.address = i.address;
          this.contact = i.contact;
          this.count = i.nickname;
          this.select_zid = i.zid;
          return;
        } else {
          this.mobile = user.phone;
          this.address = user.address;
          this.contact = user.contact;
          this.count = '当前账号';
          this.select_zid = '';
        }

      }

    },
    confirmTime() {
      this.sendtime = this.currentDate;
      var date = this.sendtime;
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      var day = date.getDate()

      if (month < 10) {
        month = '0' + month
      }
      if (day < 10) {
        day = '0' + day
      }
      this.sendtime = year + '-' + month + '-' + day;
      this.showtime = false;
    },
    confirmOrder() {
      let obj = {
        appid: APIUrl.appid,

        timeStamp: APIUrl.timeStamp,
        send_time: this.sendtime
      };
      let sign = this.$md5(this.$sort(obj) + APIUrl.appsecret)
      let params = Object.assign({
        sign: sign
      }, obj)
      this.$get(APIUrl.testOrder, params).then(res => {
        let code = res.code;
        if (res.data.on_delivery == 1) {
          switch (code) {
            case 101:
              this.$dialog.confirm({
                message: '直接下单？',
                title: '提示',
              }).then(action => {
                //确认的回调
                this.order();

              });
              break;
            case 300:
              this.$dialog.confirm({
                message: '信用金即将用完，请及时结账（可以直接下单）？',
                title: '提示',
              }).then(action => {
                //确认的回调
                this.order();

              });
              break;
            case 301:
              this.$dialog.confirm({
                message: '信用金即将用完，请及时结账（可以合并订单）？',
                title: '提示',
              }).then(action => {
                if (action == 'confirm') { //确认的回调
                  this.mergeOrder();
                }
              }).catch(err => {
                if (err == 'cancel') { //取消的回调
                  this.$dialog.confirm({
                    message: '直接下单？',
                    title: '提示',
                  }).then(action => {
                    if (action == 'confirm') { //确认的回调
                      this.order();
                    }
                  });
                }
              });
              break;

            case 500:
              this.$toast({
                message: '信用金已用完，不能下单',
                duration: 1200
              });
              break;

            case 200:
              this.$dialog.confirm({
                message: '可以合并订单？',
                title: '提示',
              }).then(action => {

                if (action == 'confirm') { //确认的回调
                  this.mergeOrder();
                }
              }).catch(err => {

                if (err == 'cancel') {

                  //取消的回调
                  this.$dialog.confirm({
                    message: '直接下单？',
                    title: '提示',
                  }).then(action => {
                    if (action == 'confirm') { //确认的回调
                      this.order();
                    }
                  });
                }
              });
              break;
          }
        } else {
          this.$dialog.confirm({
            message: '确定下单？',
            title: '提示',
          }).then(action => {
            if (action == 'confirm') { //确认的回调
              this.order();
            }
          });
        }
      })
    },

    // 合拼下单
    mergeOrder() {
      let obj = {
        appid: APIUrl.appid,
        timeStamp: APIUrl.timeStamp,
        send_time: this.sendtime,
        way: 1
      };
      let sign = this.$md5(this.$sort(obj) + APIUrl.appsecret)
      let params = Object.assign({
        sign: sign,
        // coupons_member_id:this.shopInfo.on_delivery==0?this.couponsListe.id:0,
        // select_zid: this.select_zid
      }, obj)
      this.$post(APIUrl.mergeOrder, params).then(res => {
        if (res.code != 200) {
          this.$toast({
            message: res.msg,
            duration: 1000
          })
        } else {
          this.$toast({
            message: '合拼订单成功',
            duration: 1000
          })
          this.$router.push({
            name: 'order'
          })
        }
      })
    },
    // 直接下单
    order() {
      let obj = {
        appid: APIUrl.appid,
        timeStamp: APIUrl.timeStamp,
        send_time: this.sendtime,
        way: 1
      };
      let info = this.sendtimetwo;
      if (info == '不限') {
        info = '';
      }
      let sign = this.$md5(this.$sort(obj) + APIUrl.appsecret)
      let params = Object.assign({
        delivery_time_id: this.delivery_time_id,
        delivery_time_info: info,
        coupons_member_id: this.cashprice != 0 ? this.couponsListe.id : 0,
        sign: sign,
        remark: this.remark,
        select_zid: this.select_zid
      }, obj)
      this.$post(APIUrl.addOrder, params).then(res => {

        if (res.code == 104) {
          this.$toast({
            message: '超出下单时间，不能下单',
            duration: 1200
          });
          return false;
        } else if (res.code == 200) {
          if (res.data.on_delivery == 0) {
            this.$router.push({
              path: '/prepay',
              query: {
                id: res.data.orderId
              }
            })
            return;
          }
          this.$toast({
            message: '下单成功',
            duration: 1000
          })

          this.$router.push({
            path: 'order'
          })
        } else if (res.code == 500) {
          this.$toast({
            message: '服务器内部错误,请稍候再试',
            duration: 1000
          })
        } else if (res.code ==440) {
                this.$toast({
            message: '请添加信息',
            duration: 1000
          })
         this.$router.push({
        path: '/delivery',
        query: {
          url: 'shopcart',
          id: 1,
          select_zid: this.select_zid
        }
      })
        } else {
          this.$toast({
            message: res.msg,
            duration: 1000
          })
        }
      })
    },
    detailUrl(data) {
      let id;
      if (data.item_id) {
        id = data.item_id
      } else {
        id = data.id;
      }
      if(this.is_detail==1){  this.$router.push({
        path: '/shopdetail',
        query: {
          id: id
        }
      })}

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
          this.users = res.data;
          for (var i = 0; i < res.data.length; i++) {
            this.columns.push(res.data[i].nickname)
            this.columnsId.push(res.data[i].zid)
          }
        }
      })
    },
  },
  created() {
    if (this.Is_child != 1) {
      this.childInfo()
    }
    this.cart()
  },
  mounted(){
    const that=this;
   window.onresize = () => {
return (() => {
  that.isShowCart=!that.isShowCart;

})()
}
  }
};

</script>
<style>
.select_time .van-picker-column {
  flex: initial;
}

.null_cart .cart_photo {
  background: #fff;
  text-align: center;
  padding: 20% 0;
}

.null_cart .cart_photo img {
  width: 37%;
}


.select_time .van-picker__columns {
  justify-content: center;
}

.total_price {
  font-size: 0.7rem;
  position: fixed;
  bottom: 60px;
  width: 100%;
}

.total_price section {
  width: 80%;
  align-items: center;
  padding-left: 10px;
}

.total_price .count .flex {
  padding: 3px 10px;
  display: flex;
  /*justify-content: space-between;*/
}

.total_price .count .confirm_order {}

.total_price .count {
  min-height: 2rem;
  font-size: 0.8rem;
}

.total_price .confirm_order {
  background: #FF3F1E;
  color: white;
  width: 30%;
  align-items: center;
  justify-content: center;
  display: flex;
}

.total_price .note {
  display: flex;
  justify-content: space-between;
  padding: 4px 5px 4px 10px;
  background: #E6F1E4;
  font-weight: 600;
}

.shopcart .van-icon-arrow {
  font-size: 0.9rem;
}

.shopcart textarea {
  width: 89%;
  margin-left: 3%;
  height: 2.7rem;
  border: none;
}

.shopcart textarea::-webkit-input-placeholder {
  color: #808080;
}

.shopcart textarea:-moz-placeholder {
  color: #808080;
}

.shopcart textarea::-moz-placeholder {
  color: #808080;
}

.shopcart textarea:-ms-input-placeholder {
  color: #808080;
}

.sendaddress p {
  font-size: 0.8rem;
  font-weight: 600;
}

.shopcart .sendaddress p span {
  font-weight: normal;
  font-size: 0.7rem;
}

/*.shopcart .sendaddress .address{padding:0 6% 0 3%;}*/

.shopcart .sendaddress {
  padding: 6px 10px;
}

.shopcart .sendaddress .dizhi {
  /*font-size: 0.7rem;*/
  background-image: linear-gradient(to bottom, #A5D788, #24A65D);
  color: white;
  /*width:0.8rem;height:0.8rem;*/
  border-radius: 50%;
  padding: 2px;
}

.shopcart .detail>div:last-child {
  padding: 10px 0 0 10px !important;
}

.shopcart .detail>div:nth-child(n+2) {
  background: white;
  padding: 0 10px;
  margin-top: 5px;
}

.shopcart .sendaddress>div>div img {
  width: 1.2rem;
  height: 1rem;
  padding-right: 0.2rem
}

.shopcart .sendaddress>div>div {
  display: flex;
  align-items: center;
}

.shopcart .sendaddress>div {
  display: flex;
  margin-top: 5px;
  justify-content: space-between;
  align-items: center;
}

.shopcart section {
  align-items: center;
  height: 1.8rem;
  margin-left: 0.2rem;
}

.shopcart section i {
  color: #FFA200;
  margin: 1px 4px 0 0;
}

.shopcart h2 {
  color: #FF3E1E;
  /*margin-top: 6px;*/
}

.shopcart {
  font-size: 0.7rem;
}

.shopcart>div .info {
  display: flex;
  justify-content: space-between;
  height: 1.7rem;
  line-height: 1.7rem;
}

.shopcart>div .info .flex {
  /*align-items: center;*/
  color: #888586;
}

.shopcart .detail .info i {
  margin-left: 5px;
  display: flex;
  align-items: center;
  height: 1.6rem;
}

.shopcart .detail img {
  width: 1.2rem;
  height: 0.9rem;
}

.shopcart input::-webkit-input-placeholder {
  color: #808080;
}

.null_cart .recomand_goods>div:first-child {
  padding: 3% 13px;
  align-items: center;
  background-image: linear-gradient(to bottom, #FFF, #F7F7F7);
  margin-top: 5px;
}

.null_cart .recomand_goods>div:first-child h2 {
  font-size: 0.8rem;
  margin: 0 6px;
  font-weight: 600;
}

.null_cart .recomand_goods .recomand>div p,
.null_cart .recomand_goods .recomand>div>div {
  padding-left: 3px;
}

.null_cart .recomand_goods .recomand:nth-child(n+3) {
  margin: 4% 1.5% 0%;
}

.null_cart .recomand_goods .recomand {
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

.null_cart .recomand_goods .warp {
  flex-wrap: wrap;
  padding: 0 8px;
}

.null_cart .recomand .shopimg {
  width: 100%;
  height: 5rem;
  margin-top: 4%;
  object-fit: contain;
}

.null_cart .oneline {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.null_cart .recomand .price {
  align-items: center;
  justify-content: space-between;
  width: 97%;
}

.null_cart .shuiyin {
  position: absolute;
  z-index: 1;
  width: 2rem;
  height: 1rem;
  margin: 1% 0 0 0;
}

.van-picker-column__item--selected {
  color: #009A44;
}
.hiddencart+div{display: none;}
</style>
