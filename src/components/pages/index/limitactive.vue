<template>
  <div class="comman2">
    <div class="fixed" style="z-index: 8;">
      <van-nav-bar title="限时抢购" left-arrow @click-left="onClickLeft"/>

      <div class="limit_stage">
        <img src="./../../../../static/img/secondsha.png" class="width">
        <div class="flex  limit_time">
          <div v-for="(item,index) in activeList" :class="{green_back:indextime==index}"
               @click="selectActive(index,item.id)">

            <div v-if="item.timeRemain>0">
              <p class="center">距离结束</p>
              <van-count-down :time="time">
                <template v-slot="timeData">
                  <span class="item" v-if="timeData.days>=1">{{ timeData.days*24 +timeData.hours}}</span>
                  <span class="item" v-if="timeData.hours<10&&timeData.days<1">0{{ timeData.hours}}</span>
                  <span class="item" v-if="timeData.hours>10&&timeData.days<1">{{ timeData.hours}}</span>
                  :
                  <span class="item"><span v-if="timeData.minutes<10">0</span>{{ timeData.minutes }}</span>:
                  <span class="item"><span v-if="timeData.seconds<10">0</span>{{ timeData.seconds }}</span>
                </template>
              </van-count-down>
            </div>

            <div v-else class="center">
              <p>即将开始</p>
              <p>{{item.day}} {{item.hour}}</p>
            </div>
          </div>

        </div>
        <div class="flex limit_square">

          <div v-for="(item,index) in activeList">
            <div :class="{square:squareindex==index}"></div>
          </div>

        </div>

      </div>
    </div>
    <div style="height:10.5rem;"></div>
    <div class="limit_shops">

      <div class="flex white info" v-for="(item,index) in list">
        <div v-if="item.num_limit > 0">

          <div v-if="item.activity_inventory<=arrNums[index]" class="num_limit">已抢光</div>
        </div>
        <div v-else>
          <div v-if="item.activity_num<arrNums[index]" class="num_limit">
            已抢光
          </div>
        </div>

        <van-image :src="item.img" @click="shopDetailUrl(item)" fit="contain">
          <template v-slot:error><img :src="defaultImg"></template>
        </van-image>

        <div class="width">
          <p @click="shopDetailUrl(item)">{{item.item_title}}</p>
          <p class="gray small_font" @click="shopDetailUrl(item)">{{item.attr_title}}</p>
          <div class="flex buy">
            <div class="width line_spacing">

              <div>
                <span class="red_button" v-for="(label,indexw) in item.label" v-if="item.label">{{label}}</span>
                <span class="red_button" v-if="item.activity_num-arrNums[index]>0">省</span>

                <span v-if="Token == null">
                  <span class="red_font" v-if="item.activity_num-arrNums[index]!=0">{{item.difference}}元</span>
                </span>
                <span v-else>
                  <span class="red_font" v-if="is_look == 1">
                    <dfn v-if="item.activity_num-arrNums[index]>0">{{item.difference}}元</dfn></span>
                  <span class="red_font" v-else>***元</span>
                </span>

                <span class="gray cost">剩余:{{item.activity_num-arrNums[index]}}个</span>
              </div>
              <div class="flex flex_left_right">
                <div v-if="Token == null">
                  <p class="red_font">
                    ￥{{item.activity_price}}元/{{item.unit}}
                    <span class="gray throught">￥{{item.price}}</span>
                  </p>
                </div>
                <div v-else>
                  <div class="red_font" v-if="is_look == 1">


                    <span v-if="item.activity_num-arrNums[index]<=0">￥{{item.price}}</span>
                    <span v-else>￥{{item.activity_price}}元/{{item.unit}}
                      <dfn class="gray throught">￥{{item.price}}</dfn></span>


                  </div>
                  <p class="red_font" v-else>
                    ￥***
                  </p>
                </div>
                <div v-if="activeList[squareindex].status==1">
                  <div v-if="item.num_limit > 0">
                    <div v-if="item.activity_inventory > arrNums[index]">
                      <div v-if="arrNums[index]==0" class="self_plus" @click="addcartOne(item,item.cart_num,index)">
                        <img src="./../../../../static/img/plus.png">
                      </div>
                      <van-stepper v-else v-model="arrNums[index]" min="0"
                                   @focus="showKeyBoard(item,arrNums[index],index)"
                                   @plus="addCart(item,arrNums[index]+1,index)"
                                   @minus="addCart(item,arrNums[index]-1,index)"
                                   disable-input/>
                    </div>
                    <div v-else>
                      <span style="color:white;background:#808080;border-radius:10px;padding:3px 6px;">已抢完</span>
                    </div>
                  </div>
                  <div v-else>
                    <div v-if="item.activity_num-arrNums[index]>0">
                      <div v-if="arrNums[index]==0" class="self_plus" @click="addcartOne(item,item.cart_num,index)">
                        <img src="./../../../../static/img/plus.png">
                      </div>
                      <van-stepper v-else v-model="arrNums[index]" min="0"
                                   @focus="showKeyBoard(item,arrNums[index],index)"
                                   @plus="addCart(item,arrNums[index]+1,index)"
                                   @minus="addCart(item,arrNums[index]-1,index)"
                                   disable-input/>
                    </div>
                    <div v-else>
                      <span style="color:white;background:#808080;border-radius:10px;padding:3px 6px;">已抢完</span>
                    </div>
                  </div>

                </div>
                <div v-else
                     style="background: #808080;border-radius: 6px;color:white;padding: 0 5px;height:1rem;line-height: 1.1rem;">
                  即将开始
                </div>

              </div>

            </div>

            <div>
            </div>

          </div>
        </div>

        <div>

        </div>
      </div>

    </div>
    <keyboard :show="showkey" :val="value" @keyBoard="showkey=false" @toParent="keyNum"></keyboard>
    <cart :show="visible" :details="information" @showCart1="visible=false"></cart>
  </div>
</template>

<script>
  import keyboard from './../../public/jianpan.vue'
  import cart from '../../public/addcart'
  import APIUrl from './../../../../config/apiurl'

  let obj = {
    appid: APIUrl.appid,
    timeStamp: APIUrl.timeStamp
  };
  export default {
    computed: {
      defaultImg() {
        return this.defaultPic;
      },

    },
    components: {
      cart,
      keyboard

    },
    data() {
      return {
        Token: localStorage.getItem('token'),
        imgurl: APIUrl.root,
        is_look: '',
        information: '',
        showkey: false,
        arrNums: [],
        nums: '',
        time: '',
        defaultPic: '',
        alltimes: '',
        list: [],
        activeList: [],
        visible: false,
        indextime: 0,
        squareindex: 0,
        page: 0,
        value: '',
        pbId: ''
      }
    },
    methods: {
      addcartOne(item, nums, index) {
        let arr = [];
        this.arrNums[index] = 1;
        for (let i of this.arrNums) {
          arr.push(i)
        }

        this.arrNums = arr;

        this.addCart(item, 1);
      },
      showKeyBoard(item, data, index) {
        this.showkey = true;
        this.value = '';
        this.index = index;
        this.nums = item;
      },

      keyNum(nums) {
        this.value = nums;
        let item = this.nums;
        if (nums > this.nums.activity_num) {
          this.$toast('购买数量不能超过活动数量');
          return;
        }

        this.addCart(item, nums)
      },
      addCart(item, nums) {
        if (nums <= 0) {
          nums = 0
        }

        if (item.is_float == 1 && !Number.isInteger(Number(nums))) {
          this.$toast('购买数量不能为小数');
          return;
        }
        this.arrNums[this.index] = nums;
        let obj = {
          appid: APIUrl.appid,
          timeStamp: APIUrl.timeStamp,
          item_id: item.item_id,
          attr_id: item.attr_id,
          item_num: nums
        };
        let sign = this.$md5(this.$sort(obj) + APIUrl.appsecret);
        let params = Object.assign({
          sign: sign
        }, obj);

        if (nums <= 0) {
          this.$post(APIUrl.deleteCart, params).then(res => {
            if (res.code == 200) {
              this.$toast('删除商品成功')
            } else {
              this.$toast(res.msg)
            }
          })
        } else {
          this.$post(APIUrl.changeNum, params).then(res => {
            if (res.code == 200) {
              this.$toast('操作成功')
            } else if (res.code == 407 || res.code == 406) {
              this.$toast('超过限购数量')
            } else {
              this.$toast(res.msg)
            }
          })
        }
      },
      addCarts(data) {
        this.visible = true;
        this.information = data;
      },
      shopDetailUrl(event) {
        let id = "";
        if (event.attr_id == 0) {
          id = event.item_id;
        } else {
          id = event.attr_id;
        }
        this.$router.push({
          name: 'shopdetail',
          query: {
            id: event.item_id
          }
        })
      },
      onClickLeft() {
        this.$router.back();
      },
      selectActive(data, id) {
        this.arrNums = [];
        this.list = [];
        this.indextime = data;
        this.squareindex = data;
        this.pbId = id;
        this.limitActive()
      },
      limitActive() {
        let sign = this.$md5(this.$sort(obj) + APIUrl.appsecret);
        let params = Object.assign({
          sign: sign,
          pbId: this.pbId
        }, obj)
        this.$get(APIUrl.panicBuyList, params).then(res => {
          if (res.code == 200) {
            let data = res.data;
            this.activeList = data.activeList;
            this.time = data.activeList[0].timeRemain * 1000;
            res.data.goodsList.forEach(v => {
              this.arrNums.splice(this.arrNums.length, 0, v.cart_num)
            })

            this.list = res.data.goodsList;
            this.defaultPic = data.item_default;
            this.is_look = data.is_look;
          }
        })
      },
    },
    created() {
      this.limitActive()
    }
  }
</script>

<style>
  .limit_shops .van-image {
    width: 5rem;
    height: 4rem;
  }

  .limit_stage .van-count-down {
    color: white;
    font-size: 0.7rem;
  }

  .limit_shops .buy {
    justify-content: space-between;
    align-items: center;
  }

  .limit_shops .van-list__finished-text {
    line-height: 34px;
  }

  .limit_shops .info {
    /* align-items: center; */
    font-size: 0.6rem;
    padding: 10px;
    margin-bottom: 6px;
  }

  .square {
    width: 0px !important;
    transform: translateX(0px);
    transition-duration: 0.3s;
    height: 0px;
    margin: 0 auto;
    border-width: 8px;
    border-style: solid;
    bottom: 12px;
    /*margin-left: 25%;*/
    border-color: #009A44 transparent transparent;
  }

  /*.limit_stage .limit_time, .limit_square {*/
  /*  justify-content: space-around;*/
  /*  font-size: 0.6rem;*/
  /*}*/

  .limit_stage .limit_time > div {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: #999999;
    flex: 1;
    /*width: 25%;*/
    color: white;
    padding: 2% 0;
  }

  .green_back {
    background: #009A44 !important;
  }

  .limit_stage {
    margin-bottom: 2%;
  }

  .limit_shops .buy .cost {
    margin-left: 2px;
  }

  .limit_shops .info img {

    height: 3rem;
  }

  .cart_back {
    background-image: linear-gradient(45deg, #A5D788, #24A65D);
    color: white !important;
    border-radius: 50%;
    padding: 2px;
  }

  .limit_stage .limit_time {
    font-size: 0.7rem;
    margin-top: -10px;
  }

  .limit_stage .limit_square > div {
    flex: 1;
  }

  .limit_shops .num_limit {
    width: 3.5rem;
    height: 3.5rem;
    z-index: 2;
    color: white;
    background: rgb(128, 128, 128, 0.5);
    position: absolute;
    border-radius: 50%;
    text-align: center;
    align-items: center;
    display: flex;
    justify-content: center;
  }
</style>
