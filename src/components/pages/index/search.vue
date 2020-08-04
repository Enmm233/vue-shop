<template>
  <div class="search_page">
    <div class="flex find white">
      <van-icon name="arrow-left" @click="onClickLeft"/>
      <div class="flex search_right">
        <div class="search_key">

          <van-icon name="search"/>
          <input type="text" placeholder="请输入商品名称" v-model.trim="keyWord" @focus="hot=true">

          <i class="iconfont gray anjian" @click="languagepd?language():''">&#xe641;</i>
        </div>
        <div class="green_font" @click="searchItem">搜索</div>
      </div>
    </div>
    <div>
      <div v-if="hot" class="hot_search">
        <div>
          <h2>热门搜索</h2>
          <div class="tag">
            <span v-for="(item,index) in keywords" @click="selectKey(item)">{{item.keywords}}</span>
          </div>
        </div>

        <van-popup v-model="show" closeable position="bottom" :style="{ height: '30%' }">
          <div class="speech_text">
            <div>
              <p class="center">正在倾听</p>
              <p>请说出你想要的内容</p>
            </div>
          </div>

        </van-popup>
      </div>

      <div v-else>

        <div class="find_shop flex white" v-for="(item,index) in list">
          <div>

            <img :src="config.logo" alt="" class="shuiyin" v-if="config.logo&&config.shuiyin==1">
            <van-image :src="item.img" fit="contain" @click="detailUrl(item,index)">
              <template v-slot:error><img :src="defaultImg"></template>
            </van-image>
          </div>

          <div class="width flex-top-bottom">
            <div @click="detailUrl(item,index)">
              <p>{{item.title}}</p>
              <p class="gray small_font one_line">{{item.describe}}</p>
            </div>
            <div class="flex  info">
              <div @click="detailUrl(item,index)" :style="{width:(item.attr.length==0?'70%':'')}">
                <span class="red_button small_font" v-for="(label,indexw) in item.label">{{label}}</span>

                <div v-if="Token">
                  <div v-if="is_look==1">

                    <div  class="red_font">
                      <div v-if="item.attr.length==0">
                        <div v-if="item.market_price==1" class="red_font">时价</div>
                        <div v-else>   ￥{{item.price}}/{{item.unit}}</div>
                     </div>
                      <div v-else>￥{{item.area_price}}/{{item.unit}}<dfn class="gray">(多规格)</dfn></div>
                    </div>
                  </div>
                  <div v-else class="red_font">￥***</div>
                </div>
                <div v-else class="red_font">
                  <div v-if="item.attr.length==0"> 
                  <span v-if="item.market_price==1">时价</span>
                  <span v-else>  ￥{{item.price}}/{{item.unit}}</span>
                
                  </div>
                  <div v-else>￥{{item.area_price}}/{{item.unit}}<dfn class="gray">(多规格)</dfn></div>
                </div>
              </div>
              <div>
                <div v-if="item.attr.length==0">

                  <div v-if="arrNums[index]==0" class="self_plus" @click="addcartOne(item,item.cart_num,index)">
                    <img src="./../../../../static/img/plus.png">

                  </div>
                  <van-stepper v-else v-model="arrNums[index]" min="0" @focus="showKeyBoard(item,arrNums[index],index)"
                               @plus="addCart(item,arrNums[index]+1,index)"
                               @minus="addCart(item,arrNums[index]-1,index)"
                               disable-input/>
                </div>

                <div class="addcart" v-else>

                  <img src="./../../../../static/img/addcart.png" @click="addCarts(item,is_look)">
                </div>
              </div>
            </div>
          </div>
        </div>
        <!--        </van-list>-->
      </div>
      <div class="bitmap center" v-if="bitMap"><img src="./../../../../static/img/no_content.png"></div>
      <cart :show="visible" :details="this.information" @showCart1="visible=false"></cart>
      <keyboard :show="showkey" :val="value" @keyBoard="showkey=false" @toParent="keyNum"></keyboard>
    </div>

  </div>
</template>

<script>
  import APIUrl from './../../../../config/apiurl'
  import keyboard from './../../public/jianpan.vue'
  import cart from '../../public/addcart'
  import wx from 'weixin-js-sdk'

  let obj = {
    appid: APIUrl.appid,
    timeStamp: APIUrl.timeStamp
  };
  export default {
    components: {
      cart,
      keyboard
    },
    name: "search.vue",
    computed: {
      defaultImg() {
        return this.defaultPhoto;
      }
    },
    data() {
      return {
        defaultPhoto: '',
        Token: localStorage.getItem('token'),
        languagepd: true,
        keyWord: '',
        is_look: '',
        imgurl: APIUrl.root,
        hot: true,
        show: false,
        loading: false,
        finished: false,
        list: [],
        keywords: [],
        arrNums: [],
        value: '',
        index: '',
        nums: '',
        goodsItem: '',
        config: [],
        visible: false,
        showkey: false,
        information: '',
        bitMap: false,
        is_detail: ''
      }
    },
    methods: {
      addcartOne(item, nums, index) {
        if (!this.Token) {
          this.$toast("请先登录");
          this.$router.push({
            name: 'login'
          })
        } else {
          let arr = [];
          this.arrNums[index] = 1;
          for (let i of this.arrNums) {
            arr.push(i)
          }

          this.arrNums = arr;
          this.addCart(item, 1, index);
        }

      },
      showKeyBoard(select, val, index) {
        this.showkey = true;
        this.value = '';
        this.index = index;
        this.goodsItem = select;

      },
      keyNum(data) {
        this.value = data;
        if (this.goodsItem.is_float == 1 && !Number.isInteger(Number(data))) {
          this.$toast('购买数量不能为小数');
          return;
        }
        let item = this.goodsItem;
        this.addCart(item, data, this.index)
        let arr = [];
        this.arrNums[this.index] = data;
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
              this.$toast('删除商品成功')
            }
          })
        } else {
          this.$post(APIUrl.changeNum, params).then(res => {
            if (res.code == 200) {
              this.$toast('成功加入购物车')
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
                // console.log(index)
                // console.log(this.arrNums[index])
                this.arrNums[index] = 0;
                for (let i of this.arrNums) {
                  arr.push(i);
                }
                this.arrNums = arr;
                // console.log(this.arrNums)
              }

            } else {
              this.$toast(res.msg);
            }
          })
        }
      },
      detailUrl(data, index) {
        if (this.is_detail == 1) {
          this.$router.push({
            name: 'shopdetail',
            query: {
              id: data.id,
              ind: index
            }
          })
        }

      },

      addCarts(data, look) {
        this.visible = true;
        this.information = data;
        this.information.is_look = look;
      },
      hotsearch() {
        let sign = this.$md5(this.$sort(obj) + APIUrl.appsecret);
        let params = Object.assign({
          sign: sign
        }, obj)
        this.$get(APIUrl.getSearchData, params).then(res => {
          if (res.code == 200) {
            this.keywords = res.data;
          }
        })
      },

      selectKey(data) {
        this.keyWord = data.keywords;
        this.list = [];
        this.searchItem();
      },
      searchItem() {
        if (!this.keyWord) {
          this.$toast('关键字不能为空');
          return;
        }
        let newobj = Object.assign({
          keyword: this.keyWord
        }, obj)
        let sign = this.$md5(this.$sort(newobj) + APIUrl.appsecret);
        let params = Object.assign({
          sign: sign
        }, newobj)
        this.$get(APIUrl.getSearchItem, params).then(res => {
          if (res.code == 200) {
            this.defaultPhoto = res.data.item_default;
            this.is_detail = res.data.is_detail;
            if (res.data.length == 0) {
              this.bitMap = true;
            } else {
              this.bitMap = false;
            }
            this.config = res.data;
            // console.log(res.data)
            this.hot = false;
            this.is_look = res.data.is_look;
            this.list = res.data.list;
            this.arrNums = [];

            res.data.list.forEach(v => {
              if (!v.cart_num) {
                this.arrNums.push(0);
              } else {
                this.arrNums.push(v.cart_num);
              }


            })
          }
        })

      },
      // 录音
      language() {
        this.languagepd = false;
        var that = this;
        this.$toast.loading({
          message: '请在5秒内说话...',
          // overlay:true,
          forbidClick: true,
          duration: 5000,
          loadingType: 'spinner',
        });
        wx.startRecord({
          success: function () {
            recordTimer = setTimeout(() => {
              wx.stopRecord({
                success: function (res) {
                  that.$toast.clear();
                  that.wxuploadVoice(res.localId);
                  clearTimeout(recordTimer);
                },
                fail: function (res) {
                  // alert(JSON.stringify(res));
                }
              });
            }, 5000);
          },
          cancel: function () {
            that.$toast('用户拒绝授权录音');
          }
        });
      },
      // 微信
      wxuploadVoice(localId) {
        var that = this;
        //调用微信的上传录音接口把本地录音先上传到微信的服务器
        //不过，微信只保留3天，而我们需要长期保存，我们需要把资源从微信服务器下载到自己的服务器
        wx.uploadVoice({
          localId: localId, // 需要上传的音频的本地ID，由stopRecord接口获得
          isShowProgressTips: 1, // 默认为1，显示进度提示
          success: function (res) {
            wx.downloadVoice({
              serverId: res.serverId, // 需要下载的音频的服务器端ID，由uploadVoice接口获得
              isShowProgressTips: 1, // 默认为1，显示进度提示
              success: function (res) {
                var localId = res.localId; // 返回音频的本地ID
                wx.translateVoice({
                  localId: localId, // 需要识别的音频的本地Id，由录音相关接口获得
                  isShowProgressTips: 1, // 默认为1，显示进度提示
                  success: function (res) {
                    var transl = res.translateResult
                    transl = transl.replace(/。/g, "");
                    that.keyWord = transl;
                    that.list = [];
                    that.languagepd = true;
                    that.searchItem();
                  }
                });
              }
            });
          }
        });
      },
      // 微信授权
      wxConfig() {
        let sign = this.$md5(this.$sort(obj) + APIUrl.appsecret);
        this.$get(APIUrl.wxConfig, {
          active: APIUrl.active,
          appid: APIUrl.appid,
          timeStamp: APIUrl.timeStamp,
          sign: sign
        }).then((response) => {
          if (response.code == 200) {
            wx.config({
              debug: false, // 开启调试模式
              appId: response.data.appId, // 必填，公众号的唯一标识
              timestamp: response.data.timestamp, // 必填，生成签名的时间戳
              nonceStr: response.data.nonceStr, // 必填，生成签名的随机串
              signature: response.data.signature, // 必填，签名，见附录1
              jsApiList: [
                'checkJsApi',
                'startRecord',
                'stopRecord',
                'translateVoice',
                'downloadVoice',
                'uploadVoice'
              ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });
          }
        });
      },
      onClickLeft() {
        this.$router.back();
      },
      onLoad() {

      },
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
        this.keyWord = '';
        this.is_look = '';
        this.hot = true;
        this.show = false;
        this.loading = false;
        this.finished = false;
        this.list = [];
        this.keywords = []
        this.arrNums = [];
        this.value = '';
        this.index = '';
        this.nums = '';
        this.visible = false;
        this.showkey = false;
        this.information = '';
        this.bitMap = false;
        this.hotsearch()
      }
      if (this.$store.state.cache.ind) {
        this.$set(this.arrNums, this.$store.state.cache.ind, this.arrNums[this.$store.state.cache.ind] + this.$store.state
          .cache.num)
      }
    },
    // 监听离开判断
    deactivated() {
      if (this.$route.name != 'shopdetail') {
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
      this.hotsearch()
      // 微信授权
      this.wxConfig();
    }
  }
</script>

<style>
  .search_page .error {
    text-align: center;
  }

  .search_page .error .repeat {
    font-size: 0.8rem;
    margin-bottom: 5px;
  }

  .search_page .speech_icon .iconfont {
    background: #009A44;
    color: white;
    padding: 5px;
    border-radius: 50%;
    font-size: 2rem;
    margin: 0.2rem 0 0 0.2rem;
  }

  .search_page .speech_icon {
    text-align: center;
  }

  .search_page .van-popup {
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }

  .search_page .van-popup__close-icon--top-right {
    top: 6px;
    right: 5px;
    color: #808080;
    font-size: 1.3rem;
  }

  .search_page .speech_text .center {
    margin-bottom: 10px;
  }

  .search_page .speech_text {
    display: flex;
    position: absolute;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    color: #009A44;
  }

  .search_page .search_key {
    background: #F6F6F6;
    display: flex;
    align-items: center;
    border-radius: 20px;
    padding: 4px 5px;
    width: 86%;
    height: 1.6rem;
    line-height: 1.6rem;
  }

  .search_page .search_key .van-icon-search {
    margin-top: 3px;
    font-size: 1rem;
  }

  .search_page .find {
    padding: 2% 10px 2% 5px;
    align-items: center;
    font-size: 0.8rem;
  }

  .search_page .search_key input {
    border: none;
    background: #F6F6F6;
    width: 100%;
    font-size: 0.7rem;
  }

  .search_right {
    width: 95%;
    margin-left: 8%;
    align-items: center;
  }

  .search_page .search_key + div {
    margin-left: 5%;
    font-size: 0.7rem;
  }

  .search_page .hot_search {
    font-size: 0.7rem;
    height: 100%;
    background: white;
    position: fixed;
    width: 100%;
  }

  .search_page .hot_search h2 {
    font-weight: 600;
  }

  .search_page .hot_search h2,
  .search_page .hot_search .tag {
    margin: 2% 10px;
  }

  .search_page .hot_search .tag {

    display: flex;
    flex-wrap: wrap;
    align-items: center;
  }

  .search_page .hot_search span {
    /*border: 1px solid #9999;*/
    border-radius: 3px;
    color: #808080;
    height: 1rem;
    line-height: 1rem;
    padding: 0 3px;
    display: inline-block;
    background: #f2f2f2;
    margin: 5px 10px 0 0;
  }

  .search_page .bitmap {
    padding: 30% 0;
  }

  .search_page .bitmap img {
    width: 50%;
  }

  .search_page .find_shop img {
    width: 6rem;
    height: 4rem;
  }

  .search_page .find_shop .addcart img {
    width: 0.8rem;
    height: 0.8rem;
  }

  .search_page .find_shop {
    font-size: 0.7rem;
    padding: 2px 10px 4px;
  }

  .search_page .find_shop .info {
    justify-content: space-between;
    align-items: center;
  }

  .search_page .find_shop .car {
    color: white;
    padding: 2px;
    border-radius: 50%;
  }

  .search_page .find_shop:nth-child(n+2) {
    margin-top: 1%;
  }

  .search_page .search_key .anjian {
    font-size: 1.5rem;
  }

  .search_page .shuiyin {
    width: 2rem !important;
    height: 1rem !important;

    object-fit: contain;
    position: absolute;
    z-index: 1;
    margin-left: 1%;
    margin-top: 0;
  }
</style>
