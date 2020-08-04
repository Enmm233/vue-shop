<template>
  <div>
    <van-popup v-model="show" position="bottom" @click-overlay="showCart" style="z-index:9999;" :class="{on:showkey}"
      id="addcarts">
      <div class="c_addcart" v-if="details">
        <div class="flex c_info">
          <van-image :src="details.img" fit="contain">
            <template v-slot:error><img :src="defaultImg"></template>
          </van-image>
          <div>
            <div class="hidden">
              <p>{{details.title}}</p>
              <p class="gray line_spacing one_line">{{details.describe}}</p>
            </div>
            <div>
              <span class="tag red_button" v-for="(label,indexw) in details.label">{{label}}</span>
              <div v-if="Token==null">
                <div v-if="details.attr.length==0">
                  <span class="red_font line_spacing" v-if="details.market_price==1">时价</span>
                    <span class="red_font line_spacing" v-else>￥{{details.price}}/{{details.unit}}</span>
                </div>
                <div v-else>
                  <span class="red_font line_spacing" v-if="details.attr[activeIndex].market_price==1">时价</span>
                  <span class="red_font line_spacing" v-else>￥{{details.attr[activeIndex].attr_price}}/{{details.attr[activeIndex].unit}}</span>
                </div>
              </div>
              <div v-else>
                <div v-if="details.is_look == 1">

                   <div v-if="details.attr.length==0">
                    <div v-if="details.is_activity==1">
                      <span class="red_font line_spacing">￥{{details.activity_price}}/{{details.unit}}</span>
                      <span class="throught gray">￥{{details.price}}/{{details.unit}}</span>
                    </div>
                    <div v-else>
                       <span v-if="details.market_price==1" class="red_font">时价</span>
                      <span class="red_font line_spacing" v-else>￥{{details.price}}/{{details.unit}}</span>
                    </div>
                  </div>
                    <div v-else>
                      <div v-if="details.attr[activeIndex].is_activity==1">
                        <span class="red_font line_spacing">￥{{details.attr[activeIndex].attr_price}}/{{details.attr[activeIndex].unit}}</span>
                        <span class="throught gray">￥{{details.attr[activeIndex].activity_price}}</span>
                      </div>
                      <div v-else>
                        <span v-if="details.attr[activeIndex].market_price==1" class="red_font">时价</span>
                        <span v-else class="red_font line_spacing">￥{{details.attr[activeIndex].attr_price}}/{{details.attr[activeIndex].unit}}</span>
                      </div>

                    </div>

                </div>
                <div v-else>
                  <span class="red_font line_spacing">￥***</span>
                </div>
              </div>

            </div>

          </div>
          <img class="x" src="./../../../static/img/x.png" @click="showCart">
        </div>
        <div v-if="details.attr">
          <div class="c_select" v-if="details.attr.length!=0">
            <p>选择规格</p>
            <div>
              <button v-for="(specs,index) in details.attr" :class="{green_back:activeIndex==index}" @click="select(details.attr[index],index)">{{specs.attr_title}}
              </button>

            </div>
          </div>
        </div>

        <div class="flex buynum">
          <span>购买数量</span>
          <van-stepper v-model="value" disable-input @focus="showKeyBoarde" />
        </div>
        <div class="line_gradient center submit" @click="submit">
          确定
        </div>
      </div>

    </van-popup>
    <keyboard :show="showkey" :val="valuek" @keyBoard="showkey=false" @toParent="keyNum"></keyboard>
  </div>
</template>

<script>
  import APIUrl from './../../../config/apiurl'
  import keyboard from "./jianpan.vue";
  export default {
    components: {
      keyboard
    },
    computed: {
      defaultImg() {
        return localStorage.getItem('errImg');
      },
    },
    data() {
      return {
        Token: localStorage.getItem('token'),
        imgurl: APIUrl.root,
        activeIndex: 0,
        value: 1,
        item_id: '',
        attr_id: '',
        isSelect: false,
        is_float: '',
        newshow: '',
        valuek: '',
        showkey: false,
      }
    },
    props: {
      show: {
        type: Boolean,
        default: false,
      },
      details: {},
    },
    watch: {
      show(nvalue, ovalue) {
        this.newshow = nvalue;
      }
    },
    methods: {
      showKeyBoarde() {
        this.showkey = true;
        this.valuek = '';
      },
      keyNum(nums) {
        this.valuek = nums;
        if (this.is_float == 1 && !Number.isInteger(Number(nums))) {
          this.$toast("购买数量不能为小数");
          return;
        }
        this.value = nums;

      },
      select(data, index) {

        this.activeIndex = index;
        this.price = data.attr_price;
        this.unit = data.unit;
        this.attr_id = data.id;
        this.item_id = data.item_id;
        this.isSelect = true;
        this.is_float = data.is_float;
      },
      showCart() {

        this.activeIndex = 0;
        this.value = 1;
        this.$emit('showCart1', this.newshow)
      },
      showCarts() {
        this.newshow = false;
      },
      submit() {
        if (this.details.is_float == 1 && !Number.isInteger(this.value) || this.is_float == 1 && !Number.isInteger(this
            .value)) {
          this.$toast('购买数量不能为小数');
          return;
        }

        let obj = {
          appid: APIUrl.appid,
          timeStamp: APIUrl.timeStamp
        };
        let newobj = {};
        let item = this.details;
        if (item.attr.length != 0) {
          let itemId, attrId;
          if (this.isSelect) {
            itemId = this.item_id;
            attrId = this.attr_id;
          } else {
            itemId = item.attr[0].item_id;
            attrId = item.attr[0].id;
          }
          newobj = Object.assign({
            item_id: itemId,
            attr_id: attrId,
            item_num: this.value
          }, obj);
        } else {
          newobj = Object.assign({
            item_id: item.id,
            attr_id: 0,
            item_num: this.value
          }, obj);
        }

        let sign = this.$md5(this.$sort(newobj) + APIUrl.appsecret);
        let params = Object.assign({
          sign: sign
        }, newobj);

        this.$post(APIUrl.firstChangeNum, params).then(res => {
          if (res.code == 200) {
            this.isSelect = false;
            this.$toast('加入购物车成功');
            if (this.$route.path == '/shopcart') {
              location.reload()
            }
            this.$emit('showCart1', this.show);
            this.value = 1;
            this.activeIndex = 0;

          } else if (res.code == 407 || res.code == 406) {
              this.$toast("购买数量不能超过活动数量")
            } else {
            this.$toast(res.msg);
            this.value = 1;
            this.activeIndex = 0;
          }
        })

      }

    },
    created() {

    }
  }
</script>

<style>
  .c_addcart .green_back {
    background: #87CD7C !important;
    color: white !important;
  }

  .c_addcart {
    font-size: 0.6rem;
    padding-top: 5px;
  }

  .c_addcart .c_info {
    /*justify-content: space-between;*/
    padding: 0 0 4%;
  }

  .c_addcart .c_info img {
    width: 6rem;
    height: 5rem;
    object-fit: contain;
  }

  .c_addcart .c_info>div {
    margin: 0px 0 0 4px;
    /*justify-content: space-around;*/
    flex-direction: column;
    display: flex;
  }

  .c_addcart .c_info .x {
    position: absolute;
    right: 12px;
    margin-top: -5px;
    /*font-size: 1.2rem;*/
    height: 16px;
    width: 16px;
    color: #808080;
  }

  .c_addcart .c_select p,
  .c_addcart .c_select>div {
    margin: 3% 0;
  }

  .c_addcart .c_info,
  .c_addcart .c_select {
    border-bottom: 1px solid #F8F8F8;
    margin: 13px 10px 0;
    font-size: 0.7rem;
  }

  .c_addcart .c_select div button:nth-child(n+2) {
    margin-left: 6px;
  }

  .c_addcart .c_select div button {
    color: #009A44;
    border: 1px solid #009A44;
    border-radius: 5px;
    background: white;
    padding: 0 4px;
    margin-bottom: 5px;
  }

  .c_addcart .van-stepper__input {
    height: 16px;
    width: 58px;
    background: white;
  }

  .c_addcart .van-stepper__minus::after,
  .van-stepper__minus::before,
  .van-stepper__plus::after,
  .van-stepper__plus::before {
    color: white;
  }

  .c_addcart .buynum {
    font-size: 0.7rem;
    padding: 3% 10px;
    justify-content: space-between;
  }

  .c_addcart .van-stepper__minus::before,
  .van-stepper__plus::before {
    width: 9px;
    height: 0px;
  }

  .c_addcart .van-stepper__plus::after {
    height: 8px;
  }

  .c_addcart .submit {
    font-size: 0.9rem;
    color: white;
    padding: 2% 0;
  }


  .van-popup--bottom.on {
    bottom: 13.4rem;
  }

  .van-popup--bottom.on .c_addcart .c_info .x {
    display: none;
  }
</style>
