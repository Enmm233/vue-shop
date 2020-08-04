<template>
  <div class="comman2 collect">
    <van-nav-bar title="收藏列表" right-text="清空" left-arrow @click-left="onClickLeft" @click-right="onClickRight"/>
    <van-list v-model="loading" :finished="finished" :finished-text="message" @load="onLoad">
      <ul class="recomandshop">
        <li v-for="(item,index) in list" class="flex">
          <img :src="logo" v-if="shuiyin==1&&logo" class="logo">
          <van-image :src="item.img" fit="contain" class="align_center" @click="detailUrl(item.id,index)">
            <template v-slot:error><img :src="defaultImg"></template>
          </van-image>
          <div class="width" style="display: flex;flex-direction: column;justify-content: space-between;">
            <div class="flex flex_between" >
              <div @click="detailUrl(item.id,index)">
                <p>{{item.title}}</p>
                <p class="gray small_font line_spacing hidden">{{item.describe}}</p>
              </div>

              <van-icon name="star" class="star" @click="cancelCollect(item.id,index)"/>
            </div>
            <div class="flex_left_right width">
              <div @click="detailUrl(item.id,index)" :style="{width:(item.attr.length==0?'70%':'')}">
                <span class="red_button" v-for="(label,indexw) in item.label" v-if="item.label">{{label}}</span>

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
                    <div  v-else class="red_font line_marg">￥{{item.price}}/{{item.unit}}</div>
                  </div>

                </div>
                  <div v-else>
                    <span class="red_font line_marg">￥{{item.area_price}}/{{item.unit}}</span>
                    <span class="gray">(多规格)</span>
                  </div>

              </div>
              <div>
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

                <div v-else class="addcart">
                  <img src="new/img/addcart.png" @click="addCarts(item,is_look)" style="width:0.8rem;height:0.8rem;">
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </van-list>
    <div class="bitmap center" v-if="bitmap"><img src="./../../../../static/img/no_content.png"></div>
    <cart :show="visible" :details="this.information" @showCart1="visible=false"></cart>
    <keyboard :show="showkey" :val="value" @keyBoard="showkey=false" @toParent="keyNum"></keyboard>

  </div>
  </div>
</template>

<script>
  import APIUrl from './../../../../config/apiurl'
  import cart from '../../public/addcart'
  import keyboard from './../../public/jianpan.vue'

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
        arrNums: [],
        defaultPhoto: '',
        info: [],
        shuiyin: '',
        logo: '',
        is_look: '',
        visible: false,
        showkey: false,
        imgurl: APIUrl.root,
        list: [],
        message: '没有更多呢',
        loading: false,
        finished: false,
        information: '',
        page: 0,
        value: '',
        shopItem: '',
        goodsItem: '',
        index: '',
        bitmap: false,
        is_detail:''
      }
    },
    methods: {
      cancelCollect(id,index){
        //   let status;
        // if (this.collectStatu == 1) {
        //   status = 2;
        // } else {
        //   status = 1;
        // }
        let obj = {
          appid: APIUrl.appid,
          timeStamp: APIUrl.timeStamp,
          item_id: id,
          status: 1
        };
        let sign = this.$md5(this.$sort(obj) + APIUrl.appsecret);
        let params = Object.assign({
          sign: sign
        }, obj);
        this.$get(APIUrl.changeCollect, params).then(res => {
          if (res.code == 200) {

            // this.collectStatu = status;
            // if (status == 2) {
            //   this.$toast('收藏成功')
            // } else {
              this.$toast('取消收藏')
              this.list.splice(index,1);
              console.log(this.list)
            // }
          }
        })
      },
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
            } else if(res.code == 407 || res.code == 406){
                 this.$toast("购买数量不能超过活动数量");
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
                this.$toast(res.msg);
              }
          })
        }


      },
      addCarts(data, islook) {
        this.visible = true;
        this.information = data;
        this.information.is_look = islook;
      },
      detailUrl(id,index) {
      if(this.is_detail==1){
        this.$router.push({path: '/shopdetail', query: {id,ind:index}})
      }
      },
      onClickLeft() {
        this.$router.back()
      },
      onClickRight() {
        this.$dialog.confirm({
          message: '确定将收藏商品全部清空吗？'
        }).then(() => {
          // on confirm
          let obj = {
            appid: APIUrl.appid,
            timeStamp: APIUrl.timeStamp,
          };
          let sign = this.$md5(this.$sort(obj) + APIUrl.appsecret);
          let params = Object.assign({
            sign: sign
          }, obj);

          this.$get(APIUrl.deleteCollect, params).then(res => {
            if (res.code == 200) {
              this.$toast('收藏列表已清空');
              this.$router.push({name: 'index'})
            } else {
              this.$toast(res.msg);
            }
          })

        }).catch(() => {
          // on cancel
        });
      },
      onLoad() {
        this.page += 1;
        let obj = {
          appid: APIUrl.appid,
          timeStamp: APIUrl.timeStamp
        };
        let sign = this.$md5(this.$sort(obj) + APIUrl.appsecret);
        let params = Object.assign({
          sign: sign,
          page: this.page,
          num: 10
        }, obj)
        this.$get(APIUrl.getIndexSelect, params).then(res => {
          if (res.code == 200) {
            this.loading = false;
            this.is_look = res.data.is_look;
            this.defaultPhoto = res.data.item_default;
            this.logo = res.data.logo;
            this.shuiyin = res.data.shuiyin;
            this.is_detail=res.data.is_detail;
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
				this.arrNums= [];
        this.defaultPhoto= '';
        this.info= [];
        this.shuiyin= '';
        this.logo= '';
        this.is_look= '';
        this.visible= false;
        this.showkey= false;
        this.list= [];
        this.message= '没有更多呢';
        this.loading= false;
        this.finished= false;
        this.information= '';
        this.page= 0;
        this.value= '';
        this.shopItem= '';
        this.index= '';
        this.bitmap= false;
      }
			if(this.$store.state.cache.ind){
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
  }
</script>

<style>

  .collect .bitmap img {
    width: 50%;
    padding: 25% 0;
  }

  .recomandshop .star {
    color: #FAA105;
  }

  .recomandshop {
    font-size: 0.7rem;
    /*padding-top: 2.2rem;*/
  }


  .recomandshop li img {
    width: 5rem;
    height: 4rem;
  }

  .recomandshop li {
    background: white;
    padding: 5px 10px 0;
    margin-top: 3px;
  }

  .collect .logo {
    width: 2rem;
    height: 1rem;
    position: absolute;
    left: 5px;
    margin-top: -1%;
    z-index: 1;
  }
</style>
