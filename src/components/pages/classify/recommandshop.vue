<template>
  <div class="comman2">
    <van-sticky>
      <van-nav-bar title="常用推荐" left-arrow @click-left="onClickLeft"/>
    </van-sticky>

    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <ul class="recomandshop">
        <li v-for="(item,index) in list" class="flex">
          <div><img :src="logo" v-if="shuiyin==1&&logo" class="shuiyin">
            <van-image :src="item.img" fit="contain" @click="detailUrl(item.id,index)">
              <template v-slot:error><img :src="defaultImg"></template>
            </van-image>
          </div>
          <div class="good_info">
            <div @click="detailUrl(item.id,index)">
              <p>{{item.title}}</p>
              <p class="gray small_font one_line">{{item.describe}}</p>
            </div>
            <div class="flex_left_right width">
              <div @click="detailUrl(item.id,index)" :style="{width:(item.attr.length==0?'70%':'')}"><span class="red_button" v-for="(label,indexw) in item.label" v-if="item.label">{{label}}</span>

              <div v-if="item.attr.length==0">
                 <div v-if="item.is_activity==1">
                   <div v-if="item.activity_num-arrNums[index]>0">
                     <span class="red_font">￥{{item.activity_price}}/{{item.unit}}</span>
                     <span class="throught gray">￥{{item.price}}</span>
                   </div>
                   <div v-if="item.activity_num-arrNums[index]<=0">
                     <div class="red_font line_marg">￥{{item.price}}/{{item.unit}}</div>
                   </div></div>
                 <div v-else>
                   <div v-if="item.market_price==1" class="red_font">时价</div>
                   <div class="red_font line_marg" v-else>￥{{item.price}}/{{item.unit}}</div>
                 </div>

               </div>
                 <div v-else>
                   <span class="red_font line_marg">￥{{item.area_price}}/{{item.unit}}</span>
                   <span class="gray">(多规格)</span>
                 </div>

              </div>
              <div>

                <div v-if="item.attr.length == 0">
                  <div v-if="item.attr.length == 0">
                    <div v-if="arrNums[index]==0" class="self_plus" @click="addcartOne(item,item.cart_num,index)">
                      <img src="./../../../../static/img/plus.png" style="width:0.8rem;height:0.8rem;">

                    </div>
                    <van-stepper v-else v-model="arrNums[index]"
                                 min="0"
                                 @focus="showKeyBoard(item,arrNums[index],index)"
                                 @plus="addCart(item,arrNums[index]+1,index)"
                                 @minus="addCart(item,arrNums[index]-1,index)" disable-input/>
                  </div>
                </div>

                <div v-else class="addcart">

                  <img src="new/img/addcart.png" @click="addCarts(item,is_look)" style="width:0.8rem;height:0.8rem;">
                </div>


              </div>
            </div>
          </div>
        </li>
      </ul>
    </van-list>
    <cart :show="visible" :details="this.information" @showCart1="visible=false"></cart>
    <keyboard :show="showkey" :val="value" @keyBoard="showkey=false" @toParent="keyNum"></keyboard>

  </div>
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
    name: "recommandshop.vue",
    components: {
      cart,
      keyboard

    },
    computed: {
      defaultImg() {
        return this.defaultPhoto;
      }
    },
    data() {
      return {
        logo: '',
        shuiyin: '',
        arrNums: [],
        defaultPhoto: '',
        imgurl: APIUrl.root,
        list: [],
        loading: false,
        finished: false,
        information: '',
        page: 0,
        visible: false,
        showkey: false,
        value: '',
        shopItem: '',
        goodsItem: '',
        index: '',
        is_detail:''
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

        this.addCart(item, 1,index);
      },
      showKeyBoard(data, num, index) {
        this.showkey = true;
        this.value = '';
        this.goodsItem = data;
        this.index = index;
      },
      keyNum(nums) {
        let item = this.goodsItem;
        this.value = nums;
        this.addCart(item, nums,this.index)
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
        }, obj);
        if (nums == 0) {
          this.$post(APIUrl.deleteCart, params).then(res => {
            if (res.code == 200) {
              this.$toast('删除该商品成功');

            }
          })
        } else {
          this.$post(APIUrl.changeNum, params).then(res => {
            if (res.code == 200) {
              this.$toast('操作成功')
              // this.arrNums[this.index] = nums;
            }else if (res.code == 406 || res.code == 407) {
              this.$toast('购买数量超过活动数量')
              if(item.activity_num > 0){
                let arr = [];
                this.arrNums[index] = item.activity_num;
                for (let i of this.arrNums) {
                  arr.push(i);
                }
                this.arrNums = arr;
              }else{
                let arr = [];
                this.arrNums[index] = 0;
                for (let i of this.arrNums) {
                  arr.push(i);
                }
                this.arrNums = arr;
              }
            } else {
              this.$toast(res.msg)
            }
          })
        }


      },
      addCarts(data, look) {

        this.visible = true;
        this.information = data;
        this.information.is_look = look;
      },
      detailUrl(id,index) {
      if( this.is_detail==1){
      this.$router.push({path: 'shopdetail', query: {id,ind:index}})
      }
      },
      onClickLeft() {
        this.$router.back()
      },
      onLoad() {
        this.page += 1;
        let obj = {
          appid: APIUrl.appid,
          timeStamp: APIUrl.timeStamp
        };
        let sign = this.$md5(this.$sort(obj) + APIUrl.appsecret);
        let params = Object.assign({
          sign: sign
        }, obj, {
          page: this.page,
          num: 10
        })
        this.$get(APIUrl.itemCommon, params).then(res => {
          if (res.code == 200) {
            this.is_look = res.data.is_look;
            this.is_detail=res.data.is_detail;
            this.loading = false;
            this.logo = res.data.logo;
            this.shuiyin = res.data.shuiyin;
            this.defaultPhoto = res.data.item_default;
            if (res.data.length == 0) {
              this.finished = true;
              return;
            }
            res.data.list.forEach(v => {
              this.arrNums.splice(this.arrNums.length, 0, v.cart_num)
            })
            if (this.page == 1 && res.data.list.length == 0) {
              this.bitmap = true;
              this.message = ""
            }
            if (this.page == 1 && res.data.list.length < 10) {
              this.list.push(...res.data.list);
              this.finished = true;
            } else if (res.data.list.length != 0) {
              this.list.push(...res.data.list);
            } else {
              this.finished = true;

            }

          }

        })

      },
    },
    // 刷新
		activated(){
			if(this.$store.state.cache.pd){
				var cache={ind:'',num:0,pd:false}
				this.$store.commit('SET_Cache', cache)
				window.location.reload();
      }
			if(this.$store.state.cache.ind>=0){
				this.$set(this.arrNums,this.$store.state.cache.ind,this.arrNums[this.$store.state.cache.ind]+this.$store.state.cache.num)
			}
		},
		// 监听离开判断
		deactivated () {
			if(this.$route.name!='shopdetail'){
				var cache={ind:'',num:0,pd:true}
			}else{
				var cache={ind:'',num:0,pd:false}
			}
			this.$store.commit('SET_Cache', cache)
		},
    created() {

    }
  }
</script>

<style>
  .recomandshop {
    font-size: 0.7rem;
  }

  .recomandshop li {
    background: white;
    padding: 10px;
    margin-top: 5px;
  }

  .recomandshop li img {
    width: 5rem;
    height: 4rem;
    object-fit: contain;
  }

  .recomandshop li > div > div:first-child {
    /* width: 84%; */
  }

  .recomandshop li .good_info {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }

  .recomandshop .shuiyin {
    width: 2rem;
    height: 1rem;
    position: absolute;
    z-index: 1;
    left: 5px;
    margin-top: -2%;
  }

</style>
