<template>
  <div class="delivery comman2">
    <van-nav-bar title="账号添加" left-arrow @click-left="onClickLeft" />

    <div class="white all_table">
      <table class="width">
        <tr>
          <td>账号名称</td>
          <td colspan="2">
            <input type="text" placeholder="请输入子账号名称" v-model="nickname">
          </td>
        </tr>
        <tr>
          <td>联系人</td>
          <td colspan="2"><input type="text" placeholder="请输入联系人" v-model="contact"></td>
        </tr>
        <tr>
          <td>手机号</td>
          <td colspan="2"><input type="text" placeholder="请输入手机号" v-model="mobile"></td>
        </tr>
        <tr>
          <td>密码</td>
          <td colspan="2"><input type="password" placeholder="请设置六位以上的密码" v-model="password"></td>
        </tr>
        <tr @click="mapUrl">
          <td>收货地址</td>
          <td class="gray"><input type="text" placeholder="请输入收货地址" v-model="address"></td>
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
      <button class="button_style " :class="{line_gradient:statu}" @click="submit"> 提交</button>
    </div>
  </div>
</template>

<script>
  import APIUrl from './../../../../config/apiurl'

  export default {

    data() {
      return {
        statu: false,
        nickname: this.$route.query.nickname,
        contact: this.$route.query.contact,
        mobile: this.$route.query.mobile,
        password: this.$route.query.password,
        address: this.$route.query.address,
        details: this.$route.query.details
      }
    },
    created() {

    },
    methods: {
      focus() {
        this.statu = true;
      },
      mapUrl() {

        // localStorage.setItem('details', this.details);
        // localStorage.setItem('contact', this.contact);
        // localStorage.setItem('nickname', this.nickname);
        // if (!this.password) {
        //   this.password = '';
        // }
        // if (!this.mobile) {
        //   this.mobile= '';
        // }
        // // let domain='http://192.168.0.126:89/';
        // let domain=APIUrl.root;
        // let url = escape(domain+`#/accountadd?password=${this.password}&&mobile=${this.mobile}&&url=addchild`);

        // window.location.href = "https://apis.map.qq.com/tools/locpicker?search=1&type=0&backurl=" + url +
        //   "&key=EE7BZ-2ODH2-DFUUE-C2PG7-RWE6F-XDBMG&referer=caidj"
        // return;
        this.$router.push({
          name: 'address',
          query: {
            nickname: this.nickname,
            contact: this.contact,
            mobile: this.mobile,
            password: this.password,
            address: this.address,
            details: this.details,
            url: "addchild"
          }
        })
      },
      onClickLeft() {
        this.$dialog.confirm({
          title: '放弃编辑',
          message: '个人信息未保存，确定离开吗？'
        }).then(() => {
          // on confirm
          this.$router.push({
            path: 'accountmange'
          });
        }).catch(() => {
          // on cancel
        });
      },

      submit() {
        if (!this.nickname) {
          this.$toast('账号名称不能为空');
          return
        }
        if (!this.contact) {
          this.$toast('联系人不能为空');
          return
        }
        if (!this.mobile) {
          this.$toast('手机号不能为空');
          return
        }
        if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.mobile))) {
          this.$toast("手机号码有误，请重填");
          return false;
        }
        if (!this.password) {
          this.$toast('请输入密码');
          return;
        }
        if (this.password.length < 6) {
          this.$toast('请设置六位以上的密码');
          return
        }
        if (!this.address) {
          this.$toast('地址不能为空');
          return
        }
        if (this.contact.match(' ') || this.nickname.match(' ')) {
          this.$toast('不能含有非法字符');
          return;
        }
        let obj = {
          appid: APIUrl.appid,
          timeStamp: APIUrl.timeStamp,
          nickname: this.nickname,
          contact: this.contact,
          mobile: this.mobile,
          password: this.password,
          address: this.address,
        };
        let sign = this.$md5(this.$sort(obj) + APIUrl.appsecret);
        let params = Object.assign({
          sign: sign,
          latitude: this.$route.query.lat,
          longitude: this.$route.query.lng,
          details: this.details
        }, obj)
        this.$post(APIUrl.addChild, params).then(res => {
          if (res.code == 200) {
            this.$toast('添加成功');
            this.$router.push({
              name: 'accountmange'
            })
          } else {
            this.$toast(res.msg)
          }
        })
      },
      created() {

        if (this.$route.query.url == 'addchild') {
          // this.nickname=localStorage.getItem('nickname');
          // this.details=localStorage.getItem('details');
          // this.contact=localStorage.getItem('contact');
        }

      }
    }
  }
</script>
<style>
  .delivery button {
    margin-top: 4%;
    background: linear-gradient(-90deg, rgba(0, 154, 68, 1) 0%, rgba(173, 219, 140, 1) 100%);
  }
</style>
