<template>
  <div class="orders">
    <div class="first_fix" id="first_Highte">
      <div class="nav">
        <i class="van-icon van-icon-arrow-left" @click="onClickLeft"></i>
        <span>{{ordertitle}}</span>
      </div>
    </div>
    <van-tabs v-model="activee" animated  @click="te" id="tabbare" :title-active-color="selectColor"
      :style="{marginTop:countHeighte+'px'}" :line-height="heighte+'px'">
      <van-tab :title="item.name" v-for="(item,index) in title" :key="index">
        <van-list v-model="loading" :finished="finished" :finished-text="tipmessage" @load="onLoad"
          :style="{marginTop:navHeighte+5+'px'}">
          <section class="cash">
            <ol>
              <li v-for="(item,index) in list" :class="item.coupons_status | coupons_statust"
                @click="orderInfoUrl(item.id)">
                <section class="cash_l">
                  <p class="cash_ly">余额</p>
                  <p class="cash_lq">
                    <span>¥</span>{{ Math.round(item.residue*100)/100 }}.<span>{{ item.residue.split(".")[1] }}</span>
                  </p>
                  <p class="cash_lm">面值{{ item.money }}元</p>
                </section>
                <section class="cash_r">
                  <section class="cash_rt">
                    <h3>{{ item.coupons_title }}</h3>
                    <p>{{ item.coupons_status | coupons_statuse }}</p>
                  </section>
                  <section class="cash_rb">
                    <section class="cash_rbl">
                      <span v-for="(label,index) in item.coupons_label" v-if="index<=5">{{ label }}</span>
                    </section>
                    <section class="cash_rbr">
                      <i class="van-icon van-icon-arrow"></i>
                    </section>
                  </section>
                  <section class="cash_rs">
                    {{ item.coupons_status==1?item.start_time+' 开始':(item.coupons_status==2?item.expire_time+' 过期':'') }}
                  </section>
                </section>
              </li>
            </ol>
          </section>
        </van-list>
        <div style="height:60px;"></div>
        <div v-if="showbite" class="no_infos">
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
        heighte: 3,
        selectColor: '#1ea55a',
        showbite: false,
        countHeighte: '',
        navHeighte: '',
        tipmessage: '当前没有更多了',
        activee: 0,
        page: 0,
        ordertitle: '现金劵',
        orderType: 2,
        title: [{
          name: '正常',
          id: '2'
        },
        {
          name: '未开始',
          id: '1'
        },
        {
          name: '已使用',
          id: '3'
        },
        {
          name: '已过期',
          id: '4'
        },
        ],
        list: [],
        loading: false,
        finished: false
      }
    },
    filters: {
      coupons_statust(val) {
        switch (val) {
          case 1:
            return "cash_se1";
          case 2:
            return "cash_se2";
          case 3:
            return "cash_se4";
          default:
            return "cash_se3";
        }
      },
      coupons_statuse(val) {
        switch (val) {
          case 1:
            return "未开始";
          case 2:
            return "正常";
          case 3:
            return "已使用";
          default:
            return "已过期";
        }
      },
    },
    methods: {
      // 返回
      onClickLeft() {
        this.$router.push({
          name: 'user'
        })
      },
      orderInfoUrl(id) {
        this.$router.push({
          name: 'cashdetail',
          query: {
            id: id
          }
        })
      },
      te(name) {
        this.selectColor = "#1EA55A",
          setTimeout(() => {
            $(".van-tabs__line").css("height", "3px");
          }, 100)

        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
        this.showbite = false;
        this.page = 0;
        this.height = 3;
        this.orderType = this.title[name].id;
        this.tipmessage = '当前没有更多了';
        this.showbite = false;
        this.list = [];
        this.loading = true; //下拉加载中
        this.finished = false; //下拉结束
        if (this.loading) {
          this.onLoad();
        }

      },
      orderListe() {

        var type = this.orderType;

        let obj = {
          appid: APIUrl.appid,
          timeStamp: APIUrl.timeStamp
        };

        let sign = this.$md5(this.$sort(obj) + APIUrl.appsecret);
        let params = Object.assign({
          sign: sign,
          page: this.page,
          type: type,
          num: 10,
        }, obj);

        this.$get(APIUrl.couponsList, params).then(res => {
          let data = res.data;
          if (res.code == 200) {
            this.loading = false;
            if (res.data.list.length == 0) {
              this.finished = true;
              if (this.page == 1) {
                this.tipmessage = '';
                this.showbite = true;
              }
            } else {
              if (res.data.list.length < 10) {
                this.finished = true;
                this.list.splice(this.list.length, 0, ...res.data.list);
              } else {
                this.list.splice(this.list.length, 0, ...res.data.list);
              }
            }
          }
        })


      },
      onLoad() {
        this.page += 1;
        this.orderListe();
      },
    },
    created() {
    },
    mounted() {
      let firste = document.getElementById('first_Highte').offsetHeight;
      this.countHeighte = firste;
      let tabbare = document.getElementById('tabbare');
      this.navHeighte = tabbare.querySelector('div').offsetHeight;
    }
  }

</script>
<style>
  .cash {
    padding-left: 0.6rem;
    padding-right: 0.6rem;
  }

  .cash ol li {
    margin-top: 0.6rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding-left: 1rem;
    padding-right: 0.3rem;
    background-size: cover;
    border-radius: 0.4rem;
  }

  .cash_l {
    padding-top: 1rem;
  }

  .cash_ly {
    font-size: 0.6rem;
    color: #009A44;
  }

  .cash_lq {
    font-size: 1.6rem;
    color: #009A44;
    margin-top: 0.1rem;
  }

  .cash_lq span {
    font-size: 0.7rem;
    color: #009A44;
  }

  .cash_lm {
    font-size: 0.7rem;
    color: #1A1A1A;
    margin-top: 0.1rem;
  }

  .cash_r {
    width: calc(100% - 35%);
    padding-top: 0.4rem;
  }

  .cash_rt {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: wrap;
  }

  .cash_rt h3 {
    width: 80%;
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    word-wrap: break-word;
    white-space: normal !important;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    font-size: 0.8rem;
    color: #1A1A1A;
  }

  .cash_rt p {
    font-size: 0.6rem;
    color: #1A1A1A;
    margin-top: 0.2rem;
  }

  .cash_rb {
    margin-top: 0.3rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: wrap;
    margin-left: -0.3rem;
    border-bottom: 1px solid #eee;
    padding-bottom: 0.6rem;
  }

  .cash_rbl {
    width: 85%;
  }

  .cash_rbl span {
    display: inline-block;
    border: 1px solid #009A44;
    padding-left: 0.4rem;
    padding-right: 0.4rem;
    padding-bottom: 0.06rem;
    font-size: 0.6rem;
    color: #009A44;
    margin-left: 0.3rem;
    border-radius: 0.2rem;
    margin-top: 0.2rem;
  }

  .cash_rbr {
    margin-top: 0.4rem;
  }

  .cash_rbr i {
    font-size: 1.1rem;
    color: #1A1A1A;
  }

  .cash_rs {
    height: 1.6rem;
    line-height: 1.6rem;
    font-size: 0.6rem;
    color: #747474;
  }


  .cash_se1 .cash_ly {
    color: #3D98FF;
  }

  .cash_se1 .cash_lq {
    color: #3D98FF;
  }

  .cash_se1 .cash_lq span {
    color: #3D98FF;
  }

  .cash_se1 .cash_rbl span {
    color: #3D98FF;
    border: 1px solid #3D98FF;
  }


  .cash_se3 .cash_ly {

    color: #808080;
  }

  .cash_se3 .cash_lq {
    color: #808080;
  }

  .cash_se3 .cash_lq span {
    color: #808080;
  }

  .cash_se3 .cash_rbl span {
    color: #808080;
    border: 1px solid #808080;
  }

  .cash_se4 .cash_ly {
    color: #CD2D44;
  }

  .cash_se4 .cash_lq {
    color: #CD2D44;
  }

  .cash_se4 .cash_lq span {
    color: #CD2D44;
  }

  .cash_se4 .cash_rbl span {
    color: #CD2D44;
    border: 1px solid #CD2D44;
  }


  .orders .allorder p {
    padding: 6% 7% 7%;
  }

  .orders .allorder p:first-child {
    border-bottom: 1px solid #ECE9EA;
    padding: 6% 7% 7%;
  }

  .orders .allorder {
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

  .orders .selectAccount {
    background: #ECE9EC;
  }

  .orders .childAccount {
    align-items: center;
    font-size: 0.7rem;
    padding: 0 10px;
    justify-content: flex-end;
    height: 35px;
  }

  .orders .childAccount p span {
    padding: 0 3px;
  }

  .orders .order_info {
    padding: 0 10px;
  }

  .orders .order_info:nth-child(n+2) {
    margin-top: 4px;
  }

  .orders .order_info .button {
    font-size: 0.6rem;
    padding: 5px 0;
  }

  .orders .order_info .button button {
    border-radius: 10px;
    padding: 0 6px;
    margin-left: 10px;
  }

  .orders .order_info>p {
    font-size: 0.6rem;
    padding: 2px 0;
    color: #808080;
  }

  .orders .order_info .right {
    border-top: 1px solid #F7F6F6;
  }

  .orders .order_info .shop {
    padding: 5px 0;
    font-size: 0.7rem;
    border-top: 1px solid #F7F6F6;
  }

  .orders .order_info .shop img {
    width: 5rem;
    height: 4rem;
    margin-right: 10px;
    object-fit: contain;
  }

  .orders .order_info .shop span {
    display: inline-block;
    color: red;
    margin-right: 0.7rem;
  }

  .orders .nav i {
    color: #333;
    font-size: 20px;
    position: absolute;
    left: 0.6rem;
    top: 0.55rem;
  }

  .orders .nav {
    border-bottom: 5px solid #F7F7F7;
    /*background: #009A44;*/
    background: white;
    padding: 10px;
    color: black;
    font-size: 0.8rem;
    text-align: center;
  }

  .orders .van-tab {
    line-height: 30px;
  }

  .orders .van-tabs__wrap--scrollable .van-tab {
    flex: 0;
    color: #1A1A1A;
    height: 31px;
    line-height: 31px;
  }

  .orders .van-tabs__nav--line {
    background: #F8F6F7;
    color: #1EA55A;
    box-sizing: content-box;
    height: 100%;
    padding-bottom: 8px;
  }

  .orders .van-tab--active {
    /*color: #1EA55A !important;*/
    font-weight: 500;
  }

  .orders .van-tabs__line {
    height: 3px;
    background: #21A75F;
    width: 22px !important;
  }

  .orders .van-tabs--line .van-tabs__wrap {
    height: 35px;
    width: 100%;
    position: fixed;
    margin-bottom: 5px;
    z-index: 1;
  }

  /*.order .van-tabs__content--animated {*/
  /*	margin-top: 58px;*/
  /*}*/

  .orders .van-picker__cancel,
  .van-picker__confirm {
    color: #009A44;
    font-size: 0.7rem;
  }

  /*.order .van-tabs__track {*/
  /*	margin-top: 50px;*/
  /*}*/

  .orders .van-picker__title {
    font-size: 0.9rem;
  }

  .orders .van-picker__toolbar {
    background: #ECE9EC;
    height: 2rem;
    line-height: 2rem;
  }

  .orders .van-overlay {
    z-index: 9998;
  }

  .orders .van-tab__text {
    font-size: 0.7rem;
  }

  .orders .no_infos {
    text-align: center;
    margin-top: 13%;
  }

  .orders .no_infos img {
    width: 50%;
  }

  .orders .first_fix {
    z-index: 2;
    top: 0;
    position: fixed;
    width: 100%;
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
</style>