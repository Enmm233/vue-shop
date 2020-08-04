<template>
  <div class="comman2 orderdetail">
    <van-sticky>
      <van-nav-bar title="分拣信息" left-arrow @click-left="onClickLeft"/>
    </van-sticky>
    <div class="font_size info">
      <table>
        <tr>
          <td class="title">用户信息</td>
          <td></td>

        </tr>
        <tr>
          <td>单位编号</td>
          <td>{{list.code}}</td>
        </tr>
        <tr>
          <td>单位名称</td>
          <td>{{list.nickname}}</td>
        </tr>
        <tr>
          <td>收货人</td>
          <td>{{list.contact}}</td>
        </tr>
        <tr>
          <td>收货地址</td>
          <td>{{list.address}}</td>
        </tr>

      </table>
    </div>

    <div class="font_size info">
      <table>
        <tr>
          <td class="title">商品信息</td>
          <td></td>
        </tr>
        <tr>
          <td>商品名称</td>
          <td>{{list.item_title}}</td>
        </tr>
        <tr>
          <td>规格</td>
          <td >{{list.attr_title}}</td>
        </tr>
        <tr>
          <td>预定量</td>
          <td>{{list.num}}</td>
        </tr>
        <tr>
          <td>分拣量</td>
          <td>{{list.weight}}</td>
        </tr>
        <tr>
          <td>备注</td>
          <td >{{list.remark}}</td>
        </tr>


      </table>
    </div>

    <div class="font_size info">
      <table>
        <tr>
          <td class="title">其他信息</td>
          <td></td>

        </tr>
        <tr>
          <td>分拣员</td>
          <td>{{list.sorting_name}}</td>
        </tr>
        <tr>
          <td>分拣时间</td>
          <td>{{list.sorting_time}}</td>
        </tr>
        <tr>
          <td>配送路线</td>
          <td>{{list.line}}</td>
        </tr>
        <tr>
          <td>配送时间</td>
          <td>{{list.send_time}}</td>
        </tr>

      </table>
    </div>
  </div>
</template>

<script>
  import APIUrl from './../../../../config/apiurl'

  export default {
    data() {
      return {
        info: [],
        list: [],
      }
    },

    methods: {
      onClickLeft() {
        this.$router.back()
      },
      orderInfo() {
        let id=this.$route.query.id;
        let obj = {appid: APIUrl.appid, timeStamp: APIUrl.timeStamp, id:id }
        let sign = this.$md5(this.$sort(obj) + APIUrl.appsecret);
        let params = Object.assign({sign: sign}, obj);
        this.$get(APIUrl.sortingDetail, params).then(res => {
          if (res.code == 200) {

            this.list = res.data;
            if(res.data.is_trace_back>0){
              this.$router.push({path:'/suyuan'});
                localStorage.setItem('resultId',id);

            }
          }else{
            this.$toast(res.msg)
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

  .orderdetail .info:first-child {
  }

  .orderdetail .info {
    background: white;
    margin-top: 5px;
    padding: 5px 10px;
  }

  .orderdetail .info table tr {
    height: 1.4rem;
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

  .info .red_font, .goods .red_font {
    color: red !important;
  }

</style>
