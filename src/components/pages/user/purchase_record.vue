<template>
<<<<<<< HEAD
  <div class="comman2 bill">
    <van-nav-bar title="购买记录" left-arrow @click-left="onClickLeft" />
    <calendar @change="onConfirm" :show.sync="calendarShow" mode="during" />
    <div class="search_style width">
      <div class="white">
=======
  <div class="comman2 purchase_record">
    <div>
      <van-nav-bar title="购买记录" left-arrow @click-left="onClickLeft" />
      <calendar @change="onConfirm" :show.sync="calendarShow" mode="during" />
      <div class="search_style white width">
>>>>>>> 5f74ddfb39dc4f2648a2129aee30e79c1e973c97
        <div class="search center vertical">
          <van-icon name="search" />
          <input type="text" @click="calendarShow =true" v-model="date" placeholder="请选择日期" readonly />
        </div>
<<<<<<< HEAD
      </div>
      <div class="total_box" v-if="record.total">
        合计：<span>¥{{record.total}}</span>
=======
        <div class="flex_left_right" v-if="record.list.length">
          <div class="total_box">商品数量:{{record.list.length}}种</div>
          <div class="total_box" v-if="record.total">
            合计：<span>¥{{record.total}}</span>
          </div>
        </div>


>>>>>>> 5f74ddfb39dc4f2648a2129aee30e79c1e973c97
      </div>
    </div>
    <div class="purchase_recordrecord" v-if="!is_txt">


      <div v-for="item in list" class="purchase_record" @click="purchase_recorddetail(item.item_id,item.attr_id)">
        <van-image :src="item.item_url" fit="contain">
        </van-image>
        <div class="record_detail">
          <div class="top">
            <div class="left">
              <div class="title">
                {{item.item_title}}
                <span v-if="item.attr_title" class="gray">【{{item.attr_title}}】</span>
              </div>
              <div class="txt">
                {{item.describe}}
              </div>
            </div>
          </div>
          <div class="bottom">
            共:{{item.nums}}/{{item.unit}} 小计:{{item.subtotal}}元
          </div>
        </div>
      </div>


      <!-- <div v-for="item in list" class="flex_left_right methods" @click="purchase_recordDetailUrl(item.id)">
					<div>

						<p class="bottom light_grenn_font" v-if="item.pay_type==1">余额</p>
						<p class="bottom green_font" v-if="item.pay_type==2">现金</p>
						<p class="bottom blue_font" v-if="item.pay_type==3">转账</p>
						<p>{{item.date}}</p>

					</div>

					<div class="red_font">￥{{item.receivable}}</div>

				</div> -->
      <div class="gray small_font center no_more">{{loadtext}}</div>
    </div>
    <div v-show="is_txt" class="no_record">
      <img src="../../../../static/img/no_record.png" />
    </div>
  </div>
</template>
<script>
  import APIUrl from './../../../../config/apiurl'

  let year = new Date().getFullYear();
  let month = new Date().getMonth();
  export default {
    computed: {},
    data() {
      return {
        calendarShow: false,
        show: false,
        is_txt: false,
        visible: true,
        date: [],
        list: [],
        record: '',
        loadtext: ''

      }
    },

    methods: {
      moneyList() {
        var start = this.date[0];
        var end = this.date[1];
        let obj = {
          appid: APIUrl.appid,
          timeStamp: APIUrl.timeStamp
        };
        let sign = this.$md5(this.$sort(obj) + APIUrl.appsecret);
        let params = Object.assign({
          start: start,
          end: end,
          sign: sign,
        }, obj)
        this.$get(APIUrl.buyRecord, params).then(res => {
          if (res.code == 200) {
            this.record = res.data;

            if (res.data.list != '') {
              this.is_txt = false;

              for (var i = 0; i < res.data.list.length; i++) {
                this.list.push(res.data.list[i]);

              }

              this.loadtext = "没有更多呢"
            } else {
              this.is_txt = true;
            }


          }
        })
      },
      onConfirm(time) {
        if (time.map((item) => item.format('YYYY-MM-DD')).length == 2) {
          this.calendarShow = false;
          this.date = time.map((item) => item.format('YYYY-MM-DD'));
          console.log(this.date)
          this.list = [];
          this.moneyList()
        }
      },
      purchase_recorddetail(item_id, attr_id) {
        var date = this.date;
        this.$router.push({
          path: '/purchase_detail',
          query: {
            item_id: item_id,
            attr_id: attr_id,
            date: date
          }
        })
      },
      onClickLeft() {
        this.$router.push({
          name: 'user'
        })
      },
    }, // 刷新
    activated() {

      if (this.$store.state.cache.pd) {
        var cache = {
          ind: "",
          num: 0,
          pd: false
        };
        this.$store.commit("SET_Cache", cache);

        window.location.reload();
      }

    },

    // 监听离开判断
    deactivated() {
      if (this.$route.name != "purchase_detail") {
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
    created() {
      this.date = this.$thedefaulttime();
      this.moneyList()
    }
  }
</script>
<style scoped="scoped">
  .van-nav-bar {
    height: 2.2rem;
    line-height: 2.2rem;
    position: fixed;
    width: 100%;
    z-index: 99;
  }
<<<<<<< HEAD
  .bill .billrecord {
    padding-top: 6.1rem;
=======

  .purchase_record .purchase_recordrecord {
    padding-top: 6.5rem;
>>>>>>> 5f74ddfb39dc4f2648a2129aee30e79c1e973c97
    font-size: 0.7rem;
    margin-top: 0 !important;
  }

  .purchase_record .purchase_record {
    display: flex;
    align-items: center;
    padding: 0.1rem 1rem;
    background-color: #FFFFFF;
    margin-bottom: 0.2rem;
  }

  .purchase_record .purchase_record .van-image {
    width: 4.5rem;
    height: 3.5rem;
    margin-right: 10px;
    object-fit: contain;
  }

  .purchase_record .purchase_record .record_detail {
    width: 100%;
  }

  .purchase_record .purchase_record .record_detail .top {
    display: flex;
    justify-content: space-between;
  }

  .purchase_record .purchase_record .record_detail .top .left {
    width: 90%;
  }

  .purchase_record .purchase_record .record_detail .top .right {
    font-size: 12px;
  }

  .purchase_record .purchase_record .record_detail .top .title {
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-bottom: 10px;
  }

  .purchase_record .purchase_record .record_detail .top .txt {
    font-size: 12px;
    color: #808080;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }

  .purchase_record .purchase_record .record_detail .bottom {
    color: #808080;
    margin-top: 10px;
    text-align: end;
    font-size: 12px;
    width: 100%;
  }

  .purchase_record p {
    height: 1.1rem;
    line-height: 1.1rem;
  }

  .purchase_record .search {
    margin: 0 10px;
  }

  .purchase_record .van-hairline--bottom::after {
    border: none;
  }

  .purchase_record .search_style {
    padding: 0 0 3% 0;
    position: fixed;
    top: 2.2rem;
    z-index: 99;
  }

  .purchase_record .light_grenn_font {
    color: #52ca28;
  }

  .purchase_record .no_record {
    text-align: center;
    padding-top: 8rem;
  }

  .purchase_record .no_record img {
    width: 170px;
  }

  .total_box {
    background: #FFFFFF;
    text-align: end;
    padding: 10px;
    font-size: 0.7rem;
  }

  .total_box span {
    color: #FF3E1E;
  }

  .purchase_record .no_more {
    height: 1.5rem;
    line-height: 1.5rem;
  }
</style>
