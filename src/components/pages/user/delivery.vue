<template>
  <div class="delivery comman2">
    <van-nav-bar title="收货地址" left-arrow @click-left="onClickLeft" />

    <div class="white all_table">
      <table class="width">
        <tr>
          <td>联系人</td>
          <td colspan="2">
            <input type="text" placeholder="联系人姓名" v-model="contact">
          </td>
        </tr>
        <tr>
          <td>手机号</td>
          <td colspan="2"><input type="number" placeholder="联系人电话" v-model="phone" max="11" maxlength="11"></td>
        </tr>
        <tr @click="mapUrl">
          <td>收货地址</td>
          <td>{{address}}</td>
          <td class="right">
            <van-icon name="arrow" />
          </td>
        </tr>
        <tr>
          <td>门牌号</td>
          <td colspan="2"><input type="text" placeholder="例如：8号室8号楼" @focus="focus" v-model="details"></td>
        </tr>
      </table>

    </div>
    <div class="center">
      <button class="button_style " :class="{line_gradient:statu}" @click="submit"> 保存</button>
    </div>
  </div>
</template>

<script>
  import AreaList from '../../../../static/js/areaList';
  import APIUrl from './../../../../config/apiurl'

  export default {

    data() {
      return {
        count: 1,
        statu: false,
        id: this.$route.query.id,
        select_zid: this.$route.query.select_zid,
        contact: this.$route.query.contact,
        address: this.$route.query.address,
        phone: this.$route.query.mobile,
        details: this.$route.query.details,
        url: this.$route.query.url,
        lat: this.$route.query.lat,
        lng: this.$route.query.lng,
        isBack:'',
        // lng:this.$route.query.latng.split(',')[1]
      }
    },
    created() {

    },
    watch:{
      contact(o,n){
       this.isBack=n;
      }
    },
    methods: {
      focus() {
        this.statu = true;
      },
      mapUrl() {
       //  localStorage.setItem('contact',this.contact);
       //  localStorage.setItem('details',this.details);

       //  // let domain='http://192.168.0.126:89/';
       // let domain=APIUrl.root;

       //  let url = escape(
       //    domain+`#/delivery?mobile=${this.phone}&&url=${this.url}`
       //  );

       //  window.location.href = "https://apis.map.qq.com/tools/locpicker?search=1&type=0&backurl=" + url +
       //    "&key=EE7BZ-2ODH2-DFUUE-C2PG7-RWE6F-XDBMG&referer=caidj"
       //  return;
        this.$router.push({
          name: 'address',
          query: {
            contact: this.contact,
            mobile: this.phone,
            address: this.address,
            details: this.details,
            url: this.url,
            count: this.count,
          }
        })
      },
      onClickLeft() {
              if(!this.isBack){
               if (this.url == 'shopcart') {
                 this.$router.push({
                   name: 'shopcart'
                 });
               }
               if (this.url == 'user') {
                 this.$router.push({
                   name: 'user'
                 });
               }
               return;
              }
        this.$dialog.confirm({
          title: '放弃编辑',
          message: '个人信息未保存，确定离开吗？'
        }).then(() => {
          // on confirm
          if (this.url == 'shopcart') {
            this.$router.push({
              name: 'shopcart'
            });
          }
          if (this.url == 'user') {
            this.$router.push({
              name: 'user'
            });
          }
        }).catch(() => {
          // on cancel
        });
      },
      memberAddressInfo() {

        var date = this.date;

        let obj = {
          appid: APIUrl.appid,
          timeStamp: APIUrl.timeStamp
        };
        let sign = this.$md5(this.$sort(obj) + APIUrl.appsecret);
        let params = Object.assign({
          date: date,
          sign: sign,
          select_zid: this.select_zid
        }, obj)
        this.$get(APIUrl.memberAddressInfo, params).then(res => {
          if (res.code == 200) {
            let data = res.data;
            this.contact = data.contact;
            this.phone = data.phone;
            this.address = data.address;
            this.details = data.details;

          }
        })
      },
      submit() {
        let obj = {
          appid: APIUrl.appid,
          timeStamp: APIUrl.timeStamp,
          contact: this.contact,
          mobile: this.phone,
          address: this.address,
        };

        if (this.contact.match(' ')) {
          this.$toast('不能含有非法字符');
          return;
        }
        let sign = this.$md5(this.$sort(obj) + APIUrl.appsecret);
        let params={};
        if (this.lat) {
           params = Object.assign({
            sign: sign,
            details: this.details,
            latitude: this.lat,
            longitude: this.lng
          }, obj)
        } else {
           params = Object.assign({
            sign: sign,
            details: this.details
          }, obj)
        }
        //
        this.$post(APIUrl.updateAddress, params).then(res => {

          if (res.code == 200) {
            this.$toast('保存成功');
            if (this.url == 'shopcart') {
              this.$router.push({
                path: '/shopcart'
              })
            }
            if (this.url == 'user') {
              this.$router.push({
                path: '/user'
              })
            }
          } else {
            this.$toast(res.msg);
          }

        })
      },
    },
    created() {

      if (this.id && this.url) {
        this.memberAddressInfo();
      } else {
        // this.contact = localStorage.getItem('contact');
        // this.details = localStorage.getItem('details');
      }
    }

  }
</script>
<style>
  .delivery button {
    margin-top: 8%;
    background: #009a44;
  }
</style>
