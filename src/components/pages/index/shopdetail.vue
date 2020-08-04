<template>
  <div class="shop_detail font_size">

    <div class="flex left width" :class="{back:isfix}">

      <van-icon name="arrow-left" @click="back"/>


    </div>

    <div class="judge_attr">


      <van-image :src="list.img" fit="contain">
        <template v-slot:error><img :src="defaultImg"></template>
      </van-image>
      <div v-if="list.attr.length==0">
        <div v-if="list.is_activity==1" class="active_time">
          <div v-if="list.panicActivity.statu==0">
            即将开始 {{list.panicActivity.start_time}}
          </div>
          <div v-else class="limit_open">
            <p>正在抢购</p>
            <van-count-down :time="list.panicActivity.timeRemain*1000">
              <template v-slot="timeData">
                <span class="item" v-if="timeData.days>=1">{{  timeData.days*24 +timeData.hours}}</span>
                <span class="item" v-if="timeData.hours<10&&timeData.days<1">0{{ timeData.hours}}</span>
                <span class="item" v-if="timeData.hours>=10&&timeData.days<1">{{ timeData.hours}}</span>
                :
                <span class="item"><span v-if="timeData.minutes<10">0</span>{{ timeData.minutes }}</span>:
                <span class="item"><span v-if="timeData.seconds<10">0</span>{{ timeData.seconds }}</span>
              </template>
            </van-count-down>
            <p>结束</p>
            <div style="position: absolute;right:5px;font-size:0.6rem;">
              <span v-if="list.activity_num-list.cart_num>0">剩余{{list.activity_num-list.cart_num}}件</span>
              <span v-if="list.activity_num-list.cart_num<=0">剩余0件</span>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <div v-if="list.attr[kind].is_activity==1" class="active_time">
          <div v-if="list.panicActivity.statu==0">
            即将开始 {{list.panicActivity.start_time}}
          </div>
          <div v-else class="limit_open">
            <p>正在抢购</p>
            <van-count-down :time="list.panicActivity.timeRemain*1000">
              <template v-slot="timeData">

                <span class="item" v-if="timeData.days>=1">{{  timeData.days*24 +timeData.hours}}</span>
                <span class="item" v-if="timeData.hours<10&&timeData.days<1">0{{ timeData.hours}}</span>
                <span class="item" v-if="timeData.hours>10&&timeData.days<1">{{ timeData.hours}}</span>

                :
                <span class="item"><span v-if="timeData.minutes<10">0</span>{{ timeData.minutes }}</span>:
                <span class="item"><span v-if="timeData.seconds<10">0</span>{{ timeData.seconds }}</span>
              </template>
            </van-count-down>
            <p>结束</p>
            <div style="position: absolute;right:5px;font-size:0.6rem;">
              <span v-if="list.attr[kind].activity_num-list.attr[kind].cart_num>0">剩余{{list.attr[kind].activity_num-list.attr[kind].cart_num}}件</span>
              <span v-if="list.attr[kind].activity_num-list.attr[kind].cart_num<=0">剩余0件</span>
            </div>
          </div>
        </div>
      </div>

      <div class="white info">
        <div>
          <p class="weight">
            {{list.title}}
          </p>
          <p class="gray line_spacing"> {{list.describe}}
          </p>

          <div v-if="list.attr.length==0">
            <div v-if="list.is_activity==0">
 <span class="red_button" v-for="(item,index) in list.label">{{item}}</span>
              <div v-if="Token == null">
                <p class="red_font" v-if="list.market_price==1">时价</p>
                 <p class="red_font" v-else>￥{{list.price}}/{{list.unit}}</p>
              </div>
              <div v-else>
                <div v-if="list.is_look == 1">
                  <p v-if="list.market_price==1" class="red_font">时价</p>
                  <p v-else class="red_font">￥{{list.price}}/{{list.unit}}</p>
                </div>
                <div v-else>
                  <p class="red_font">￥***</p>
                </div>
              </div>

            </div>
            <div v-if="list.is_activity==1">
              <span class="red_button" v-for="(item,index) in list.label">{{item}}</span>
              <div v-if="Token == null">
                <p class="red_font">￥{{list.activity_price}}元/{{list.unit}}
                  <span class="throught gray">￥{{list.price}}/{{list.unit}}</span></p>
              </div>
              <div v-else>
                <div v-if="list.is_look == 1">
                  <div v-if="list.activity_num-list.cart_num>0"><p class="red_font">
                    ￥{{list.activity_price}}元/{{list.unit}}
                    <span class="throught gray">￥{{list.price}}/{{list.unit}}</span></p>

                  </div>
                  <div v-if="list.activity_num-list.cart_num<=0"><p class="red_font">
                    ￥{{list.price}}/{{list.unit}}</p></div>
                </div>
                <div v-else>
                  <p class="red_font">￥***</p>
                </div>
              </div>

            </div>
            <div v-if="list.is_activity==2">
             <span class="red_button" v-for="(item,index) in list.label">{{item}}</span>
              <div class="full_redece">
                <span v-for="(item,index) in list.activity_rule" class="">满{{item.price}}减{{item.reduce}}</span>
              </div>

              <div v-if="Token == null">
                 <p v-if="list.market_price==1" class="red_font">时价</p>
                  <p v-else class="red_font">￥{{list.price}}/{{list.unit}}</p>
              </div>
              <div v-else>
                <div v-if="list.is_look == 1">
                  <p v-if="list.market_price==1" class="red_font">时价</p>
                  <p v-else class="red_font">￥{{list.price}}/{{list.unit}}</p>
                </div>
                <div v-else>
                  <p class="red_font">￥***</p>
                </div>
              </div>

            </div>

            <div v-if="list.is_activity==3">

              <div class="flex">
               <span class="red_button" v-for="(item,index) in list.label">{{item}}</span>
                <div class="full_give red_button flex">
                  <div class="one_line1">{{list.activity_rule}}</div>
                  <div>
                    <van-icon v-if="direct==false" name="arrow-down" @click="direct=true"/>
                    <van-icon v-if="direct==true" name="arrow-up" @click="direct=false"/>
                  </div>
                </div>
              </div>

              <div v-if="direct" class="gray">{{list.activity_rule}}</div>
              <div v-if="Token == null">
                 <p v-if="list.market_price==1" class="red_font">时价</p>
                  <p v-else class="red_font">￥{{list.price}}/{{list.unit}}</p>
              </div>
              <div v-else>
                <div v-if="list.is_look == 1">
                  <p v-if="list.market_price==1" class="red_font">时价</p>
                  <p v-else class="red_font">￥{{list.price}}/{{list.unit}}</p>
                </div>
                <div v-else>
                  <p class="red_font">￥***</p>
                </div>
              </div>

            </div>
          </div>

          <div v-else>
            <div v-if="list.attr[kind].is_activity==0||list.attr[kind].is_activity==1">
              <span class="red_button" v-for="(label,indexw) in list.label" v-if="list.label">{{label}}</span>
              <div v-if="Token == null">
                <p class="red_font" v-if="list.attr[kind].market_price==1">时价</p>
  <p class="red_font" v-else>￥{{list.attr[kind].attr_price}}元/{{list.attr[kind].unit}}</p>
              </div>
              <div v-else>
                <div v-if="list.is_look == 1" class="flex active_price">

                  <p class="red_font" v-if="list.attr[kind].market_price==1">时价</p>
                  <p class="red_font" v-else>￥{{list.attr[kind].attr_price}}元/{{list.attr[kind].unit}}</p>

                </div>
                <div v-else>
                  <p class="red_font">￥***</p>
                </div>
              </div>
            </div>

            <!--            满减-->
            <div v-if="list.attr[kind].is_activity==2">
            <span class="red_button" v-for="(item,index) in list.label">{{item}}</span>
              <div class="full_redece">
                <span v-for="(item,index) in list.activity_rule" class="">满{{item.price}}减{{item.reduce}}</span>
              </div>
            </div>
            <!--            满赠-->
            <div v-if="list.attr[kind].is_activity==3">
             <span class="red_button" v-for="(item,index) in list.label">{{item}}</span>
              <span class="full_give red_button" @click="direct=!direct">
                				<span class="red_button_txt">{{list.activity_rule}}</span>
							<span>
				                  <van-icon v-if="direct==false" name="arrow-down"/>
				                  <van-icon v-if="direct==true" name="arrow-up"/>
				                </span>
							</span>
              <div v-if="direct" class="gray line_spacing">{{list.activity_rule}}</div>
            </div>
            <div v-if="list.attr[kind].is_activity==2||list.attr[kind].is_activity==3">
              <div v-if="Token == null">
                              <p class="red_font" v-if="list.attr[kind].market_price==1">时价</p>
  <p class="red_font" v-else>￥{{list.attr[kind].attr_price}}元/{{list.attr[kind].unit}}</p>
              </div>
              <div v-else>
                <div v-if="list.is_look == 1">
                  <p class="red_font" v-if="list.attr[kind].market_price==1">时价</p>
                  <p class="red_font" v-else>￥{{list.attr[kind].attr_price}}元/{{list.attr[kind].unit}}</p>
                </div>
                <div v-else>
                  <p class="red_font">￥***</p>
                </div>
              </div>
            </div>


          </div>

        </div>

        <div class="specs">
          <div v-if="list.attr!=0">
            <p>选择规格</p>
            <div class="select_specs">
              <span :class="{select:kind==index}" v-for="(item,index) in list.attr" @click="selectSpecs(index,item)">{{item.attr_title}}</span>

            </div>
          </div>

          <div class="flex flex_between">
            <span class="weight" style="font-size: 0.7rem;font-weight: 600;">购买数量</span>
            <van-stepper v-model="value" @focus="showKeyBoard()" disable-input/>

          </div>
        </div>
      </div>

    </div>

    <div class="similary white">
      <div class="limit_time_title flex">
        <div class="flex width">
          <div class="line_border"></div>
          <h2 class="">相似商品 </h2>

        </div>

      </div>
      <div class="flex hidden_scroll">
        <div class="limit_shop " v-for="item in similaryList.list" @click="detailUrl(item)">
          <div class="desc">
            <img :src="similaryList.logo" class="shuiyin">
            <van-image :src="item.img" fit="contain">
              <template v-slot:error><img :src="defaultImg"></template>
            </van-image>
            <p>{{item.title}}</p>
          </div>
          <div class="price">
            <div class="tag">
              <span class="red_button" v-for="(label,indexw) in item.label" v-if="item.label">{{label}}</span>
            </div>
            <div v-if="Token == null">
              <p class="red_font" v-if="item.market_price==1">时价</p>
                <p class="red_font" v-else>￥{{item.price}}</p>
            </div>
            <div v-else>
              <div v-if="similaryList.is_look == 1">
                <p class="red_font" v-if="item.market_price==1">时价</p>
                <p class="red_font" v-else>￥{{item.price}}</p>
              </div>
              <div v-else>
                <p class="red_font">￥***</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="picture_detail white">
      <div class="flex title ">
        <div class="line_border"></div>
        <h2>图文详情</h2>
      </div>
      <div>
        <div v-if="list.info.length==0" class="center bit">
          <img src="./../../../../static/img/no_content.png">
        </div>
        <div v-else class="info_img">
          <div v-html="list.info"></div>
          <div style="height:60px;"></div>
        </div>
      </div>
    </div>
    <div class="select_option flex flex_between width white">
      <div class="center" @click="changeCollect">
        <van-icon name="star" class="star" v-if="collectStatu==2"/>
        <van-icon name="star-o" class="star_o" v-if="collectStatu==1"/>
        <p class="gray">收藏</p>
      </div>
      <div class="flex">
        <span class="add_shop" @click="addShop">加入购物车</span>
        <span class="buy" @click="buy">立即购买</span>
      </div>
    </div>
    <keyboard :show="showkey" :val="value" @keyBoard="showkey=false" @toParent="keyNum"></keyboard>
  </div>
</template>
<script>
  import APIUrl from './../../../../config/apiurl'
  import keyboard from './../../public/jianpan.vue'

  export default {
    name: "shopdetail.vue",
    components: {
      keyboard
    },
    computed: {
      defaultImg() {
        return this.defaultPic;
      }
    },
    beforeRouterLeave(to, from, next) {
      to.meta.keepAlive = true;
      next();
    },
    data() {
      return {
        Token: localStorage.getItem('token'),
        imgurl: APIUrl.root,
        defaultPic: '',
        pictureDetail: '',
        direct: false,
        kind: 0,
        isfix: false,
        value: 1,
        list: {
          attr:[],
          info:[],
        },
        similaryList: [],
        price: '',
        unit: '',
        activePrice: '',
        itemId: '',
        attrId: '',
        catItem: '',
        collectStatu: '',
        id: this.$route.query.id,
        showkey: false
      }
    },
    destroyed (e) {
      if(this.$route.name!='classify'&&this.$route.name!='recommandshop'&&this.$route.name!='collectlist'&&this.$route.name!='index'&&this.$route.name!='search'){
        let cache={ind:'',num:0,pd:true}
        this.$store.commit('SET_Cache', cache)
      }
    },
    methods: {
      showKeyBoard() {
        this.showkey = true;
      },
      keyNum(nums) {
        this.value = nums;
      },
      handleScroll() {
        var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
        if (scrollTop != 0) {
          this.isfix = true;
        } else {
          this.isfix = false;
        }
      },
      selectSpecs(index, data) {
        this.kind = index;
        this.price = data.attr_price;
        this.unit = data.unit;
        this.itemId = data.item_id;
        this.attrId = data.id;
        this.catItem = data;
      },
      addShop() {
        let obj = {
          appid: APIUrl.appid,
          timeStamp: APIUrl.timeStamp
        };
        let newobj = Object.assign({
          item_id: this.itemId,
          attr_id: this.attrId,
          item_num: this.value
        }, obj);
        let sign = this.$md5(this.$sort(newobj) + APIUrl.appsecret);
        let params = Object.assign({
          sign: sign
        }, newobj);
        this.$post(APIUrl.firstChangeNum, params).then(res => {
          if (res.code == 200) {
            this.$toast('加入购物车成功')

            if(this.attrId==0&&this.$route.query.ind>=0){
              let cache={ind:this.$route.query.ind,num:this.$store.state.cache.num+this.value,pd:false}
              this.$store.commit('SET_Cache', cache)
            }
          } else if (res.code == 406 || res.code == 407) {
            this.$toast('购买数量超过活动数量')
          } else {
            this.$toast(res.msg)
          }
        })
      },
      buy() {
        let obj = {
          appid: APIUrl.appid,
          timeStamp: APIUrl.timeStamp
        };
        let newobj = Object.assign({
          item_id: this.itemId,
          attr_id: this.attrId,
          item_num: this.value
        }, obj);
        let sign = this.$md5(this.$sort(newobj) + APIUrl.appsecret);
        let params = Object.assign({
          sign: sign
        }, newobj);
        this.$post(APIUrl.firstChangeNum, params).then(res => {
          if (res.code == 200) {
            // if(this.attr_id==0){

            // }
            this.$toast('加入购物车成功')
            this.$router.push({path: '/shopcart'})
          } else if (res.code == 406 || res.code == 407) {
            this.$toast('购买数量超过活动数量，将恢复原价')
          } else {
            this.$toast(res.msg)
          }
        })

      },
      changeCollect() {
        let status;
        if (this.collectStatu == 1) {
          status = 2;
        } else {
          status = 1;
        }
        let obj = {
          appid: APIUrl.appid,
          timeStamp: APIUrl.timeStamp,
          item_id: this.id,
          status: status
        };
        let sign = this.$md5(this.$sort(obj) + APIUrl.appsecret);
        let params = Object.assign({
          sign: sign
        }, obj);
        this.$get(APIUrl.changeCollect, params).then(res => {
          if (res.code == 200) {
            this.collectStatu = status;
            if (status == 2) {
              this.$toast('收藏成功')
            } else {
              this.$toast('取消收藏')
            }
          }
        })
      },
      back() {
        this.$router.back()
      },
      detailUrl(data) {
        this.$router.push({
          name: 'shopdetail',
          query: {
            id: data.id
          }
        });
        window.location.reload()
      },
      recomandList() {
        let obj = {
          appid: APIUrl.appid,
          timeStamp: APIUrl.timeStamp,
          id: this.id
        };
        let sign = this.$md5(this.$sort(obj) + APIUrl.appsecret);
        let params = Object.assign({
          sign: sign
        }, obj)
        //单个商品详情
        this.$get(APIUrl.getItemById, params).then(res => {
          let data = res.data;
          if (res.code == 200) {
            this.list = data;
            // this.value=res.data.cart_num
            this.defaultPic = data.item_default;
            this.collectStatu = data.collect_status;
            // 判断单规格是否参与限时活动的价钱
            if (data.attr.length == 0) {
              this.itemId = data.id;
              this.attrId = 0;
              this.catNum = data.cart_num;
            } else {
              this.itemId = data.attr[0].item_id;
              this.attrId = data.attr[0].id;
              this.catNum = data.attr[0].cart_num;
            }
          }
        });
        //相似推荐
        this.$get(APIUrl.itemRecommend, params).then(res => {
          if (res.code == 200) {
            this.similaryList = res.data;
          }
        })
      },
    },
    mounted() {
      window.addEventListener('scroll', this.handleScroll);
    },
    created() {
        document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
      this.recomandList()
    }
  }
</script>

<style scoped>
  .shop_detail .flex_center {
    display: flex;
    justify-content: center;
  }

  .shop_detail .flex_center img {
    width: 1rem;
  }

  .judge_attr .active_price {
    margin-top: 4px;
  }

  .judge_attr .red_font {
    /*margin-top: 10px;*/
  }

  .judge_attr .active_time {
    background: #F7C0B7;
    padding: 5px;
    justify-content: center;
    color: white;
    font-size: 0.8rem;
    display: flex;
  }

  .shop_detail .left {
    z-index: 2;
    position: absolute;
    font-size: 1.2rem;
    color: #808080;
    display: flex;
    height: 40px;
    line-height: 40px;
    align-items: center;
  }

  .shop_detail .select_option .star_o {
    font-size: 1.2rem;
  }

  .shop_detail .select_option .star {
    font-size: 1.2rem;
    color: orange;
  }

  .shop_detail .judge_attr img {
    width: 100%;
    height: 12rem;
    object-fit: contain;
    background: white;
  }

  .shop_detail .back {
    position: fixed;
    background: white;
    width: 100%;
    z-index: 6;
    border-bottom: 1px solid #D9D9D9;
    align-items: center;
  }

  .shop_detail .full_give {
    margin-left: 10px;
    flex: 2;
  }

  .shop_detail .select_option {
    position: fixed;
    padding: 1% 4% 1% 6%;
    bottom: 0;
    border-top: 1px solid #F5F3F3;
    align-items: center;
  }

  .shop_detail .select_option > div:last-child {
    border-radius: 5px;
    color: white;
  }

  .shop_detail .one_line1 {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;

    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }

  .shop_detail .add_shop {
    background: #ADDB8C;
    border-bottom-left-radius: 5px;
    border-top-left-radius: 5px;
  }

  .shop_detail .buy {
    background: #009A44;
    border-bottom-right-radius: 5px;
    border-top-right-radius: 5px;
  }

  .shop_detail .buy,
  .shop_detail .add_shop {
    padding: 3% 0;
    width: 4.8rem;
    text-align: center;
    font-size: 0.8rem;
  }

  .shop_detail .info {
    padding: 10px;
  }

  .shop_detail .start {
    background: #DCDADD;
    color: white;
    padding: 2% 0;
  }

  .shop_detail .info .specs {
    margin-top: 0.4rem;
  }

  .shop_detail .select_specs span:nth-child(n+2) {
    margin-left: 9px;
  }

  .shop_detail .select_specs span {
    border: 1px solid #14A24C;
    border-radius: 5px;
    color: #14A24C;
    padding: 0 4px;
  }

  .shop_detail .select {
    background: #87CD7C;
    color: white !important;
  }

  .shop_detail .info .specs > div {
    line-height: 1.7rem;
  }

  .shop_detail .info > div:first-child {
    border-bottom: 1px solid #F7F6F6;
    padding-bottom: 3%;
  }

  .shop_detail .similary {
    margin-top: 5px;
    padding: 10px 0 30px 10px;
  }

  .shop_detail .picture_detail .bit img {
    width: 50%;
    padding: 30% 0 60%;
  }

  .shop_detail .picture_detail .info_img > div img {
    width: 100% !important;
  }

  .shop_detail .picture_detail {
    margin-top: 5px;
    padding: 10px;
  }

  .shop_detail .picture_detail .title {
    align-items: center;
    margin-bottom: 10px;
  }

  .shop_detail .similary h2,
  .picture_detail .title h2 {
    margin-left: 2%;
    font-weight: bold;
  }

  .shop_detail .activity_img {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 0.7rem;
    width: 100%;
  }

  .shop_detail .activity_img img {
    width: 5%;
  }

  .shop_detail .van-stepper {
    width: 33%;
    text-align: end;
  }

  .shop_detail .left .van-icon {
    position: absolute;
    color: #1A1A1A;
  }

  .shop_detail .van-stepper__input {
    width: 66%;
  }

  .shop_detail .back .van-icon {
    position: absolute;
  }

  .shop_detail .similary .limit_time_title > div {
    align-items: center;
  }

  .shop_detail .desc img {
    width: 80%;
    height: 4rem;
    object-fit: contain;
  }

  .shop_detail .hidden_scroll {
    overflow-x: scroll;
  }

  .shop_detail .limit_shop {
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    width: 30%;
    -ms-flex-negative: 0;
    flex-shrink: 0;
  }

  .shop_detail .full_redece {
    display: flex;
    flex-wrap: wrap;
    padding: 5px 0;
  }

  .shop_detail .full_redece span {
    border: 1px solid #FFA85F51;
    color: #808080;
    padding: 0 2px;
    margin: 1% 2% 0 0;
    border-radius: 3px;
  }

  ::-webkit-scrollbar {
    width: 0;
    height: 0;
    background-color: transparent;
  }


  .red_button_txt {
    width: 70%;
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 0.9;
  }

  .shop_detail .van-count-down {
    line-height: normal;
    margin: 0px 2px 0 10px;
    /*display: flex;*/
    align-items: center;
  }

  .shop_detail .item {
    display: inline-block;
    /*width: 22px;*/
    margin-right: 5px;
    color: white;
    padding: 0 2px;
    font-size: 0.6rem;
    text-align: center;
    background-color: #FF3E1E;
  }

  .shop_detail .limit_open {
    display: flex;
    align-items: center;
  }

  .shop_detail .van-stepper__input {
    width: 50% !important;
  }

  .shop_detail .desc .van-image {
    height: 4rem;
    width:100%;
  }
.shop_detail .desc .shuiyin{width:2rem;height:1rem;}
  .shop_detail .judge_attr .van-image {
    width: 100%;
    background: white;
    height: 10rem;
  }
</style>
