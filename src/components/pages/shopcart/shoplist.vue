<template>
  <div class="comman2 buylist">

    <van-sticky>
      <van-nav-bar title="商品列表" right-text="清空" left-arrow @click-left="onClickLeft" @click-right="onClickRight"/>
    </van-sticky>
    <div class="margin_top"></div>
    <div class="buy_goods white" v-for="(item,first) in list.shop">
      <div class="property" v-if="item.list.length">
        <span class="tag">类别</span>
        <span>{{item.p_name}}({{item.count}})</span></div>
      <div v-for="(project,second) in item.list" class="white buy_good">
        <div class="flex width">
          <van-image :src="project.img" fit="contain">
            <template v-slot:error><img :src="defaultImg"></template>
          </van-image>
          <div class="width flex-top-bottom">
            <div class="flex flex_between width">
              <div>
                <p>{{project.title}}</p>
                <p class="gray small_font one_line">{{project.describe}}</p>
              </div>
              <i class="iconfont delete" @click="clearCar(project,first,second)">&#xe619;</i>
            </div>
            <div class="width flex_left_right">
              <div style="width:70%">
                <span class="red_button " v-for="(label,indexw) in project.label" v-if="project.label">{{label}}</span>


                <div v-if="project.attr.length==0">
                  <div v-if="project.is_activity==1">
                    <div v-if="project.activity_num-project.cart_num>0">
                      <span class="red_font">￥{{project.activity_price}}元/{{project.unit}}</span>
                      <span class="gray throught">￥{{project.price}}</span>
                    </div>
                    <div v-if="project.activity_num-project.cart_num<=0">
                      <span class="red_font">{{project.price}}/{{project.unit}}</span>
                    </div>


                  </div>
                  <div v-else>
                    <span v-if="project.market_price==1" class="red_font">时价</span>
                    <span v-else class="red_font">{{project.price}}/{{project.unit}}</span>
                  </div>
                </div>

                <dfn v-else>
                  <div v-if="project.attr.is_activity==1">
                    <span class="red_font"> {{project.attr.activity_price}}/{{project.attr.unit}}</span>
                    <span class="gray">已选({{project.attr.attr_title}})</span></div>
                  <div v-else>
                    <div class="red_font" v-if="project.attr.market_price==1">时价</div>
                    <div v-else>
                      <span class="red_font"> {{project.attr.attr_price}}/{{project.attr.unit}}</span>
                      <span class="gray">已选({{project.attr.attr_title}})</span></div>
                  </div>
                </dfn>
              </div>
              <van-stepper v-model="project.cart_num" disable-input min="0"
                           @focus="showKeyBoard(project.cart_num,project,second)"
                           @plus="addCart(project,project.cart_num+1,first,second)"
                           @minus="addCart(project,project.cart_num-1,first,second)"/>
            </div>

          </div>
        </div>

        <div class="remark">
          备注：<input type="text" placeholder="请告诉我们需要注意的地方" @focus="addRemark(project,second)" v-model="project.remark">
        </div>
      </div>

    </div>

    <div class="gifts" v-if="list.activity_type==2&&totalPrice>=activity_price[0].price">
      <div>
        <span class="tag">赠品</span>
        <span> 赠品（1）</span>
      </div>
      <div class="flex gift">
        <img :src="giftInfo[0].img">
        <div class="flex flex_left_right width">
          <div>
            <p>{{giftInfo[0].title}}</p>
          </div>
          <span class="small_font">
            x{{giftInfo[0].num}}
          </span>

        </div>
      </div>

    </div>
    <keyboard :show="showkey" :val="value" @keyBoard="showkey=false" @toParent="keyNum"></keyboard>
    <van-overlay :show="show" @click="show = false">
      <div class="wrappers" @click.stop>
        <div class="block flex" style="flex-direction: column;align-items: center;">
          <h2 class="weight">确定要修改备注吗？</h2>
          <textarea type="text" class="placefl_list_tex" placeholder="请输入您想说的" v-model="remark_info" ref='text_id'
                    id="text_area"></textarea>

          <div class="flex buttons">
            <div @click="show=false">取消</div>
            <div @click="confirmRemark">确定</div>
          </div>
        </div>


      </div>
    </van-overlay>
  </div>
  </div>
</template>

<script>
  import APIUrl from './../../../../config/apiurl'
  import keyboard from './../../public/jianpan.vue'

  export default {
    components: {
      keyboard
    },
    name: "recommandshop.vue",
    computed: {
      defaultImg() {
        return this.defaultPic;
      }
    },
    data() {
      return {
        remark_info: '',
        defaultPic: '',
        imgurl: APIUrl.root,
        cart_num: 0,
        totalPrice: '',
        active_price: '',
        list: [],
        loading: false,
        finished: false,
        value: '',
        show: false,
        showkey: false,
        shopItem: '',
        goodsItem: '',
        index: '',
        giftInfo: [],
      }
    },
    methods: {
      addRemark(data, index) {
        this.shopItem = data;
        this.show = true;
        this.index = index;
        this.remark_info = data.remark;
        setTimeout(() => {
          this.$refs.text_id.focus();
        }, 100)
      },
      confirmRemark() {
        let obj = {
          appid: APIUrl.appid,
          timeStamp: APIUrl.timeStamp
        };
        if (this.remark_info.match(' ')) {
          this.$toast('不能含有非法字符');
          return;
        }
        let newobj = {};
        let item = this.shopItem;
        let remark = this.remark_info.trimEnd();
        console.log
        if (item.attr.length != 0) {
          let itemId, attrId;
          itemId = item.attr.item_id;
          attrId = item.attr.id;
          newobj = Object.assign({
            item_id: itemId,
            attr_id: attrId,
            remark: remark,
          }, obj);
        } else {
          newobj = Object.assign({
            item_id: item.id,
            attr_id: 0,
            remark: remark,
          }, obj);
        }

        let sign = this.$md5(this.$sort(newobj) + APIUrl.appsecret);
        let params = Object.assign({
          sign: sign
        }, newobj);

        this.$post(APIUrl.itemRemark, params).then(res => {
          if (res.code == 200) {
            for (var i = 0; i < this.list.shop.length; i++) {
              if (this.shopItem.p_name == this.list.shop[i].p_name) {
                this.list.shop[i].list[this.index].remark = this.remark_info;
              }
            }
            this.$toast('修改备注成功')
            this.show = false;

          }
        })
      },
      showKeyBoard(num, data, index) {
        this.showkey = true;
        this.value = '';
        this.goodsItem = data;
        this.index = index;
      },
      keyNum(nums) {
        let item = this.goodsItem;
        this.value = nums;
        this.addCart(item, nums)
        for (var i = 0; i < this.list.shop.length; i++) {
          if (this.goodsItem.p_name == this.list.shop[i].p_name) {
            this.list.shop[i].list[this.index].cart_num = nums
          }
        }
      },
      onClickLeft() {
        this.$router.back();
      },
      addCart(data, num, one, two) {

        let obj = {
          appid: APIUrl.appid,
          timeStamp: APIUrl.timeStamp
        };
        let newobj = {};
        let item = data;
        let nums = num;
        let isFloat = "";

        if (item.attr.length != 0) {

          isFloat = item.attr.is_float;
          let itemId, attrId;
          itemId = item.attr.item_id;
          attrId = item.attr.id;

          newobj = Object.assign({
            item_id: itemId,
            attr_id: attrId,
            item_num: num
          }, obj);
        } else {
          isFloat = item.is_float;
          newobj = Object.assign({
            item_id: item.id,
            attr_id: 0,
            item_num: num
          }, obj);
        }

        if (isFloat == 1 && !Number.isInteger(Number(nums))) {
          this.$toast('购买数量不能为小数');
          return;
        }
        let sign = this.$md5(this.$sort(newobj) + APIUrl.appsecret);
        let params = Object.assign({
          sign: sign
        }, newobj);
        if (num == 0) {
          this.$post(APIUrl.deleteCart, params).then(res => {
            if (res.code == 200) {
              this.$toast('删除成功');
              this.list.shop[one].list.splice(two, 1);
            } else {
              this.$toast(res.msg)
            }
          })

        } else {
          this.$post(APIUrl.changeNum, params).then(res => {
            if (res.code == 200) {
              this.$toast('加入购物车成功');
            } else if (res.code == 407 || res.code == 406) {
              this.$toast("购买数量不能超过活动数量")
              this.openCart();
            } else if (res.code == 1000) {
              this.$toast("购买数量不能为小数")
            } else {
              this.$toast(res.msg)
            }
          })
        }

      },
      onClickRight() {
        this.$dialog.confirm({
          message: '确定将购物车物品全部清空吗？'
        }).then(() => {
          // on confirm
          //获取清空的id
          let list = this.list.shop;
          let newlist = [];

          for (let i of list) {
            i.list.forEach(v => {
              newlist.push(v.cart_id)
            })
          }
          let obj = {
            appid: APIUrl.appid,
            timeStamp: APIUrl.timeStamp
          };
          let sign = this.$md5(this.$sort(obj) + APIUrl.appsecret);
          let params = Object.assign({
            sign: sign,
            keys: newlist
          }, obj)
          this.$post(APIUrl.deleteByUserIds, params).then(res => {
            if (res.code == 200) {
              this.$toast('成功清空购物车');
              this.$router.push({
                path: '/'
              })
            } else {
              this.$toast(res.msg);
            }
          })
        }).catch(() => {
          // on cancel
        });
      },

      clearCar(data, one, two) {
        this.$dialog.confirm({
          message: '确定将该物品删除吗？'
        }).then(() => {
          // on confirm
          let id, attrid;
          if (data.attr.length == 0) {
            id = data.id;
            attrid = 0
          } else {
            id = data.attr.item_id;
            attrid = data.attr.id
          }

          let obj = {
            appid: APIUrl.appid,
            timeStamp: APIUrl.timeStamp,
            item_id: id,
            attr_id: attrid
          };
          let sign = this.$md5(this.$sort(obj) + APIUrl.appsecret);
          let params = Object.assign({
            sign: sign
          }, obj)
          this.$post(APIUrl.deleteCart, params).then(res => {
            if (res.code == 200) {
              this.$toast('成功删除该商品')
              this.list.shop[one].list.splice(two, 1);
              if (res.data.countNum == 0) {
                this.$router.push({
                  name: 'index'
                })
              }
              this.openCart();
            }
          })
        }).catch(() => {
          // on cancel
        });
      },
      openCart() {
        let obj = {
          appid: APIUrl.appid,
          timeStamp: APIUrl.timeStamp
        };
        let sign = this.$md5(this.$sort(obj) + APIUrl.appsecret);
        let params = Object.assign({
          sign: sign
        }, obj)

        this.$get(APIUrl.openCart, params).then(res => {
          if (res.code == 200) {
            this.list = res.data;
            this.defaultPic = res.data.item_default;
            let activity_type = res.data.activity_rule;
            this.activity_price = activity_type;
            this.$get(APIUrl.getCountNum, params).then(result => {
              if (result.code == 200) {
                let nums = result.data.rule;
                let totalPrice = result.data.countPrice;
                this.totalPrice = totalPrice;
                activity_type.forEach(res => {
                  if (totalPrice > res.price) {
                    this.giftInfo = res.item;
                    return;
                  } else {
                  }
                })
              }
            })
          }
        });


      },

    },
    created() {
      this.openCart();
    },
    mounted() {

    }
  }
</script>

<style>
  .van-nav-bar {
    /*position: fixed;*/
    width: 100%;
  }

  .buylist .margin_top {
    margin-top: 4px;
  }

  .buylist {
    font-size: 0.8rem;
  }

  .buy_goods {
    font-size: 0.7rem;
  }

  .buylist .van-icon-plus {
    background-image: linear-gradient(to bottom, #A5D788, #24A65D);
    color: white;
    border-radius: 50%;
    font-size: 0.6rem;
    padding: 0.5px;
  }

  .buylist .delete {
    color: #fF3E1E;
  }

  .buylist .remark {
    border-bottom: 1px solid #F7F6F6;
    padding-bottom: 4px;
  }

  .buylist .property {
    padding: 8px 0 0 10px;
  }

  .buylist .property .tag {
    background: #009A44;
    color: white;
    padding: 0 4px;
    border-radius: 3px;
  }

  .buylist .buy_good {
    padding: 5px 10px 0px 10px;
  }

  .buylist .remark input {
    border: none;
  }

  .buylist .gifts {
    background: white;
    padding: 10px;
    margin-top: 3px;
    margin-bottom: 20px;
  }

  .buylist .gift {
    margin-top: 5px;
  }

  .buy_goods .buy_good img {
    width: 5rem;
    height: 4rem;
  }

  .gifts img {
    width: 5rem;
    height: 4rem;
  }

  .gifts div:first-child {
    font-size: 0.6rem;
  }

  .gifts .tag {
    background: red;
    color: white;
    padding: 0 4px;
    font-size: 0.7rem;
    border-radius: 3px;
  }

  .buylist .wrappers {
    /* display: flex;
    align-items: center;
    justify-content: center;
    height: 100%; */
  }

  .buylist .block h2 {
    margin: 10px;
    font-size: 0.7rem;
    position: relative;
    z-index: 9;
  }

  .buylist #text_area {
    height: 4.2rem;
    width: 90%;
    border: 1px solid #ccc;
    padding-top: 5px;
    padding-left: 10px;
    /*margin-top: 10px;*/
    border-radius: 5px;
  }

  .buylist .van-overlay {
    opacity: 1;
  }

  .buylist .block {
    width: 12rem;
    height: 9rem;
    border-radius: 5px;
    background-color: #fff;
    position: absolute;
    bottom: 0;
    top: 0;
    left: 0;
    right: 0;
    margin: auto;

  }

  .buylist .block .buttons > div:first-child {
    /*margin-right: 10%;*/
  }

  .buylist .block .buttons div {
    height: 1.6rem;
    line-height: 1.6rem;
    text-align: center;
    width: 50%;
  }

  .buylist .block .buttons div:first-child {
    border-right: 1px solid #ccc;
  }

  .buylist .block .buttons {
    display: flex;
    position: absolute;
    width: 100%;
    border-top: 1px solid #ccc;
    margin-top: 10px;
    /*padding: 2%;*/
    font-size: 0.7rem;
    justify-content: space-around;
    bottom: 0;
  }
</style>
