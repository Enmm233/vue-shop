<template>
  <div class="comman2 billdetail purchase_detail">
    <van-nav-bar title="详细记录" left-arrow @click-left="onClickLeft" />
    <div class="bill_record">
      <div class="record_box">
        <div class="img">
          <!-- <image :src="imgUrl+'img/nullcart.png'" alt=""></image> -->
          <van-image use-error-slot :src="detailItem.item_url" width="100px" height="80px" fit="contain">
          </van-image>
        </div>
        <div class="record_detail">
          <div class="top">
            <div class="left">
              <div class="title">
                {{detailItem.item_title}}
              </div>
              <div class="txt">
                {{detailItem.describe}}
              </div>
              <div class="txt" v-if="detailItem.attr_title">
                【{{detailItem.attr_title}}】
              </div>
            </div>
          </div>
          <div class="bottom flex_left_right" >
			    <div>总量：{{count}}</div>
          <div>   合计：<span>¥{{detail.total}}</span></div>

          </div>
        </div>
      </div>
    </div>
    <div class="pur_list">
      <div class="item" v-for="item in detail.list">
        <div class="left">
          <div class="time">
            {{item.send_time}}
          </div>
          <div class="num">
            <span>数量：{{item.nums}}{{detailItem.unit}}</span>
            <span>单价：¥{{item.price}}</span>
          </div>
        </div>
        <div class="right">
          小计：¥{{item.subtotal}}
        </div>
      </div>
    </div>


  </div>
</template>
<script>
  import APIUrl from './../../../../config/apiurl';

  export default {
    data() {
      return {
        data: '',
        detail: '',
        detailItem: '',
        count:''
      }
    },

    methods: {
      onClickLeft() {
        this.$router.go(-1)
      },
      billApi() {
        var data = this.data;
        let obj = {
          appid: APIUrl.appid,
          timeStamp: APIUrl.timeStamp,
        };
        let sign = this.$md5(this.$sort(obj) + APIUrl.appsecret);
        let params = Object.assign({
          sign: sign,
          item_id: data.item_id,
          attr_id: data.attr_id,
          start: data.date[0],
          end: data.date[1],
        }, obj);
        this.$get(APIUrl.buyRecordDetail, params).then(res => {
          if (res.code == 200) {
            this.detail = res.data;
            this.detailItem = res.data.item;
            let sum=parseFloat(0);
            for(let i of res.data.list){
              sum+=parseFloat(i.nums);
            }
            this.count=sum;
          }
        })
      }
    },
    created() {
      this.data = this.$route.query;
      console.log(this.data)
      this.billApi();
    }

  }
</script>
<<<<<<< HEAD
<style scoped="scoped">
  .van-nav-bar {
      height: 2.2rem;
      line-height: 2.2rem;
      position: fixed !important;
=======
<style>
  .purchase_detail .van-nav-bar {
      height: 2.2rem;
      line-height: 2.2rem;
      position: fixed!important;
>>>>>>> 5f74ddfb39dc4f2648a2129aee30e79c1e973c97
      width: 100%;
      z-index: 99;
  }
  .bill_record {
    padding-top: 2.2rem;
    border-top: 5px #F7F6F6 solid;
    border-bottom: 5px #F7F6F6 solid;
  }

  .bill_record .record_box {
    display: flex;
    align-items: center;
    padding: 0 0.5rem;
    background: #FFFFFF;
  }

  .bill_record .record_box .img {
    width: 100px;
    height: 80px;
    margin-right: 0.5rem;
  }

  .bill_record .record_box .img image {
    width: 100px;
    height: 80px;
  }

  .bill_record .record_box .record_detail {
    width: 100%;
  }

  .bill_record .record_box .record_detail .top {
    display: flex;
    justify-content: space-between;
  }

  .bill_record .record_box .record_detail .top .left {
    width: 80%;
  }

  .bill_record .record_box .record_detail .top .right {
    font-size: 12px;
  }

  .bill_record .record_box .record_detail .top .title {
    font-size: 14px;
    overflow: hidden;
    span-overflow: ellipsis;
    white-space: nowrap;
    margin-bottom: 0.5rem;
  }

  .bill_record .record_box .record_detail .top .txt {
    font-size: 12px;
    color: #C1C1C1;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }

  .bill_record .record_box .record_detail .top .txt:nth-child(2) {
    color: #808080;
  }

  .bill_record .record_box .record_detail .bottom {
    margin-top: 0.5rem;
    text-align: end;
    font-size: 14px;
    width: 100%;
  }

  .bill_record .record_box .record_detail .bottom span {
    color: #FF3E1E;
  }

  .pur_list .item {
    padding: 0.4rem;
    border-bottom: 1px solid #F7F6F6;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    background: #FFFFFF;
  }

  .pur_list .item .time {
    margin-bottom: 0.25rem;
    font-size: 0.7rem;
  }

  .pur_list .item .num,
  .pur_list .item .right {
    font-size: 12px;
    color: #808080;
  }

  .pur_list .item .num span {
    margin-right: 0.5rem;
  }
</style>
