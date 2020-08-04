<template>
  <section class="cashde comman2">
    <van-nav-bar title="现金劵信息" left-arrow @click-left="onClickLeft" />
    <section class="cashde_h"></section>
    <section class="cashde">
      <section class="cashde_x">
		    <h3 v-if="couponsDetailsdata.coupons_status==2">正常</h3>
        <h3 v-if="couponsDetailsdata.coupons_status==1">未开始</h3>
        <h3 v-if="couponsDetailsdata.coupons_status==3">已使用</h3>
        <h3 v-if="couponsDetailsdata.coupons_status==4">已过期</h3>
        <ol>
          <li>
            <section class="cashde_xl">标签</section>
            <section :class="couponsDetailsdata.coupons_status | coupons_statust">
              <span v-for="(label,index) in couponsDetailsdata.coupons_label">{{ label }}</span>
            </section>
          </li>
          <li>
            <section class="cashde_xl">名称</section>
            <section class="cashde_xr">{{ couponsDetailsdata.coupons_title }}</section>
          </li>
          <li>
            <section class="cashde_xl">面值</section>
            <section class="cashde_xr">{{ couponsDetailsdata.money }}元</section>
          </li>
          <li>
            <section class="cashde_xl">余额</section>
            <section class="cashde_xr">{{ couponsDetailsdata.residue }}元</section>
          </li>
          <li>
            <section class="cashde_xl">开始时间</section>
            <section class="cashde_xr">{{ couponsDetailsdata.start_time }}</section>
          </li>
          <li>
            <section class="cashde_xl">结束时间</section>
            <section class="cashde_xr">{{ couponsDetailsdata.expire_time }}</section>
          </li>
          <li>
            <section class="cashde_xl">描述</section>
            <section class="cashde_xr">{{ couponsDetailsdata.describe }}</section>
          </li>
        </ol>
      </section>
      <section class="cashde_h"></section>
      <section class="cashde_j">
        <h3>使用记录</h3>
        <ol v-if="couponsDetailsdata.details.length!=0">
          <li v-for="(details,index) in couponsDetailsdata.details">
            <p>{{ details.order_sn }}</p>
            <p>{{ details.spend }}元</p>
            <p>{{ details.created_at.substring(0,10) }}</p>
          </li>
        </ol>
        <section class="cashde_jn" v-else>
          <img src="../../../../static/img/cash_record.png" alt title />
          <p>无记录</p>
        </section>
      </section>
    </section>
  </section>
</template>
<script>
import APIUrl from "./../../../../config/apiurl";
export default {
  data() {
    return {
      fixed:true,
      imgUrl: APIUrl.root,
      // 现金劵信息

      couponsDetailsdata: {
        details:[]
      },
      // id
      id:this.$route.query.id,

    };
  },
  filters: {
    coupons_statust(val) {
      switch (val) {
        case 1:
          return "cashde_xb cashde_xbs1";
        case 2:
          return "cashde_xb cashde_xbs2";
        case 3:
          return "cashde_xb cashde_xbs4";
        default:
          return "cashde_xb cashde_xbs3";
      }
    },
  },
  methods: {
    onClickLeft() {
      this.$router.back()
    },
    // 现金劵信息
    couponsDetails() {
      let obj = {
        appid: APIUrl.appid,
        id: this.id,
        timeStamp: APIUrl.timeStamp
      };

      let sign = this.$md5(this.$sort(obj) + APIUrl.appsecret);
      let params = Object.assign({
        sign: sign,
      }, obj);

      this.$get(APIUrl.couponsDetails, params).then(res => {
        let data = res.data;
        if (res.code == 200) {
          this.couponsDetailsdata = res.data;
        }
      });
    }
  },
  mounted() {},
  created() {
    // 现金劵信息
    this.couponsDetails();
  },
  beforeCreate() {
    document.querySelector("body").setAttribute("style", "background-color:#fff");
  },

  beforeDestroy() {
    document.querySelector("body").removeAttribute("style");
  }
};

</script>
<style scoped>
.cashde_h {
  background: #f7f7f7;
  height:46px;
}

.van-nav-bar .van-icon {
  color: #1a1a1a;
  font-size: 20px;
}

.cashde_x {
  padding-left: 0.4rem;
  padding-right: 0.4rem;
  padding-top: 0.4rem;
  padding-bottom: 0.4rem;
}

.cashde_x h3 {
  color: #1a1a1a;
  font-size: 0.8rem;
  font-weight: 600;
  height: 1.2rem;
  line-height: 1.2rem;
}

.cashde_x ol li {
  padding-top: 0.4rem;
  padding-bottom: 0.4rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
}

.cashde_xl {
  color: #1a1a1a;
  font-size: 0.7rem;
  width: 20%;
  text-align: right;
}

.cashde_xr {
  width: 60%;
  text-align: right;
  color: #808080;
  font-size: 0.7rem;
}

.cashde_xb {
  text-align: right;
  width: 60%;
}

.cashde_xb span {
  display: inline-block;
  border: 1px solid #009a44;
  padding-left: 0.4rem;
  padding-right: 0.4rem;
  padding-bottom: 0.06rem;
  font-size: 0.6rem;
  color: #009a44;
  margin-left: 0.3rem;
  border-radius: 0.2rem;
  margin-top: 0.2rem;
}

.cashde_xbs1 span {
  border: 1px solid #3d98ff;
  color: #3d98ff;
}

.cashde_xbs3 span {
  border: 1px solid #808080;
  color: #808080;
}
.cashde_xbs4 span {

  border: 1px solid #cd2d44;
  color: #cd2d44;
}

.cashde_j {
  padding-left: 0.4rem;
  padding-right: 0.4rem;
}

.cashde_j h3 {
  color: #1a1a1a;
  font-size: 0.8rem;
  text-align: center;
  font-weight: 600;
  height: 2.2rem;
  line-height: 2.2rem;
}

.cashde_j ol li {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.4rem;
}

.cashde_j ol li p {
  color: #1a1a1a;
  font-size: 0.7rem;
  display: inline-block;
  vertical-align: middle;
}

.cashde_jn {
  color: #1a1a1a;
  font-size: 0.6rem;
  text-align: center;
}

.cashde_jn img {
  margin-top: 0.7rem;
  margin-bottom: 0.2rem;
  width: 1.44rem;
  height: 1.56rem;
}
.cashde .van-nav-bar{position: fixed!important;width:100%;}
</style>
