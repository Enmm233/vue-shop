<template>
  <div class="comman2 orderdetail">
    <van-sticky>
      <van-nav-bar title="订单详情" left-arrow @click-left="onClickLeft" />
    </van-sticky>
    <div class="font_size info">
      <table>
        <tr>
          <td class="title">支付信息</td>
          <td style="color:#1EA55A;" v-if="list.order_status==0">待审核</td>
          <td style="color:#1EA55A;" v-if="list.order_status==1">备货中</td>
          <td style="color:#1EA55A;" v-if="list.order_status==2">配送中</td>
          <td style="color:#1EA55A;" v-if="list.order_status==3">已收货</td>
          <td class="red_font" v-if="list.order_status==4">已取消</td>


        </tr>
        <tr>
          <td>下单时间</td>
          <td>{{list.create_time}}</td>
        </tr>
        <tr>
          <td>配送日期</td>
          <td>{{list.send_time}}</td>
        </tr>
        <tr>
          <td>配送时间</td>
          <td>{{list.delivery_time_info}}</td>
        </tr>
        <tr>
          <td>订单编号</td>
          <td>{{list.order_sn}}</td>
        </tr>
        <!--   <tr>
          <td>商户信息</td>
          <td>主账号</td>
        </tr> -->
        <tr>
          <td>联系电话</td>
          <td>{{list.mobile}}</td>
        </tr>
        <tr>
          <td>送货地址</td>
          <td>{{list.address}}</td>
        </tr>
        <tr>
          <td>备注</td>
          <td>{{list.remark?list.remark:''}}</td>
        </tr>
      </table>
    </div>

    <div class="font_size info">
      <table>
        <tr>
          <td class="title">金额信息</td>
          <td></td>
        </tr>
        <tr>
          <td>下单金额</td>
          <td class="red_font" v-if="info.is_look==0">￥***</td>
          <td class="red_font" v-if="info.is_look==1">￥{{list.xd_price}}</td>
        </tr>
        <tr>
          <td>退货金额</td>
          <td class="red_font" v-if="info.is_look==0">￥***</td>
          <td class="red_font" v-if="info.is_look==1">￥{{list.th_price}}</td>
        </tr>
        <tr>
          <td>运费</td>
          <td v-if="info.is_look==0">￥***</td>
          <td v-if="info.is_look==1">￥{{list.delivery_fee}}</td>
        </tr>
        <tr>
          <td>应付金额</td>
          <td class="red_font" v-if="info.is_look==0">￥***</td>
          <td class="red_font" v-if="info.is_look==1">￥{{list.yf_price}}</td>
        </tr>
        <tr v-if="list.is_cash_delivery == 1">
          <td>实付金额</td>
          <td class="red_font" v-if="info.is_look==0">￥***</td>
          <td class="red_font" v-if="info.is_look==1">￥{{list.total_fee}}</td>
        </tr>
        <tr>
          <td>支付状态</td>
          <td v-if="list.pay_status==0">未支付</td>
          <td v-if="list.pay_status==1">已支付</td>
        </tr>
      </table>
    </div>

    <div class="font_size info goods">

      <div>

        <h2 class="title">商品信息</h2>

        <div v-for="(item,index) in list.order_list">
          <div>
            <div class="flex_left_right line_spacing">
              <span>
                <span v-if="item.is_gift==1" style="background:red;color:white;padding:0 2px;border-radius:2px;">赠</span>
                {{item.item_title}}</span>
              <span class="red_font" v-if="info.is_look==0">￥***</span>
              <span class="red_font" v-if="info.is_look==1">￥{{item.price}}/{{item.unit}}</span>
            </div>

            <div class="gray flex_left_right line_spacingut">
              <span>下单数量：{{item.num}}</span>
              <span>配送数量:{{item.weight}}</span>
            </div>


          </div>
        </div>


        <!--        <tr>-->
        <!--          <td><span style="background:red;color:white;padding:0 2px;border-radius:2px;">增</span></td>-->
        <!--          <td></td>-->
        <!--        </tr>-->
        <!--        <tr>-->
        <!--          <td>赠送数量</td>-->
        <!--          <td>配送数量</td>-->
        <!--        </tr>-->
      </div>
    </div>
  </div>
</template>

<script>
  import APIUrl from './../../../../config/apiurl'

  export default {
    data() {
      return {
        info: '',
        list: [],
      }
    },

    methods: {
      onClickLeft() {
        this.$router.back()
      },
      orderInfo() {
        let obj = {
          appid: APIUrl.appid,
          timeStamp: APIUrl.timeStamp,
          id: this.$route.query.id
        }
        let sign = this.$md5(this.$sort(obj) + APIUrl.appsecret);
        let params = Object.assign({
          sign: sign
        }, obj);
        this.$get(APIUrl.orderInfo, params).then(res => {
          if (res.code == 200) {
            this.info = res.data;
            this.list = res.data.orderInfo;
          }
        })
      },
    },
    created() {
      this.orderInfo();
    }

  }
</script>
<style>
  .orderdetail table {
    width: 100%;
  }

  .orderdetail .title {
    font-size: 0.8rem;
    font-weight: 600;
  }

  .orderdetail .info:first-child {}

  .orderdetail .info {
    background: white;
    margin-top: 5px;
    padding: 5px 10px 10px;
  }

  .orderdetail .info table tr {
    height: 1.2rem;
  }

  .orderdetail .info table tr td:last-child {
    text-align: right;
    color: #808080;
  }

  /*.orderdetail .info table tr:nth-child(n+2) td:first-child {text-align:right;}*/
  .orderdetail .info table tr td:first-child {
    color: #1C1C1C;
    width: 20%;
  }

  .orderdetail .goods table tr:nth-child(odd) td {
    color: #808080;
  }

  .info .red_font,
  .goods .red_font {
    color: red !important;
  }
</style>
