<template>
  <div class="comman2 backheight mobilelogin ">
    <van-nav-bar left-arrow @click-left="onClickLeft" title="" />
    <div class="login_img"> <img :src="logo" v-if="logo"></div>
    <div class="login">
      <!--      <h2>登录</h2>-->
      <div class="flex account"><i class="iconfont icon-yonghu" style="line-height:23px;"></i>
        <input type="text" placeholder="请输入手机号码" name="" v-model="user">
      </div>
      <div class="flex lock"><i class="iconfont icon-mima54"></i>
        <input type="password" placeholder="请输入密码" name="" v-model="password"></div>
      <div class='center login_button'>
        <button class="button_style line_gradient" @click="submit">登录</button>
      </div>
      <div class="flex_left_right select_way">
        <router-link to="/register">立即注册</router-link>
        <router-link to="/forget">忘记密码?</router-link>
      </div>
      <address class="center hidden_div">
        已阅读并同意
        <router-link to="/treaty"><strong>注册协议</strong></router-link>
        <!--        由<strong>菜东家</strong>提供技术-->
      </address>
    </div>
    <div class="other_method center">
      <van-divider>其他登录</van-divider>
      <div class="wechat" @click="wechatlogin">
        <img src="new/img/wechat.png">
        <!--        <div class="iconfont i" >&#xe637;</div>-->
        <p>微信登录</p>
      </div>
    </div>
  </div>
</template>
<script>
import APIUrl from './../../../../config/apiurl';
let code = location.search;
let getCode = code.substring(code.indexOf('=') + 1, code.lastIndexOf('&'));
export default {
  data() {
    return {
      wechat: true,
      imgurl: APIUrl.root,
      user: '',
      password: '',
      logo: '',

    }
  },
  created() {
     
    if (localStorage.getItem('codeStatu') == 'on'&&getCode) {
     
      let obj = { appid: APIUrl.appid, timeStamp: APIUrl.timeStamp, code: getCode };
      let sign = this.$md5(this.$sort(obj) + APIUrl.appsecret);
      let params = Object.assign({ sign: sign }, obj);
      this.$post(APIUrl.wxLogin, params).then(res => {
        if (res.code == 200) {
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('is_bind', res.data.is_bind);
          localStorage.setItem('is_child', res.data.is_child);
          // window.location.href = APIUrl.root + 'New#'
          window.location.href = APIUrl.root;
        } else if (res.code == 201) {
          this.$router.push({
            path: '/selectway',
            query: { identifying: res.data.identifying }
          })
        } else {
           localStorage.removeItem('codeStatu');
          this.$toast(res.msg);
          setTimeout(() => {
            window.location.href = APIUrl.root + "#/login";
          }, 1000)

        }
      })
    }

    this.getLogo();
  },
  destroyed() {
    localStorage.removeItem('codeStatu')
  },
  methods: {
    getLogo() {
      let obj = {
        appid: APIUrl.appid,
        timeStamp: APIUrl.timeStamp
      };
      let sign = this.$md5(this.$sort(obj) + APIUrl.appsecret);
      let params = Object.assign({
        sign: sign
      }, obj)
      this.$get(APIUrl.indexAd, params).then(res => {
        if (res.code == 200) {
          this.logo = res.data.logo;
        }
      })
    },
    wechatlogin() {

        let obj = { appid: APIUrl.appid, timeStamp: APIUrl.timeStamp, };
        let sign = this.$md5(this.$sort(obj) + APIUrl.appsecret);
        let params = Object.assign({ sign: sign }, obj);
        this.$get(APIUrl.wxConfig, params).then(res => {
          if (res.code == 200) {
 localStorage.setItem('codeStatu', 'on');
            // let url = window.location.href;
            let url = APIUrl.root + "#/login";
            let redirect_uri = encodeURIComponent(url);
            let a = "https://open.weixin.qq.com/connect/oauth2/authorize?" +
              "appid=" + res.data.appId + "&redirect_uri=" + redirect_uri + "&response_type=code&scope=snsapi_userinfo#wechat_redirect"
            window.location.href = a;
          } else if (res.code == 500) {
            this.$toast('微信服务器出错')
          } else {
            this.$toast(res.msg)
          }

        })
      
    },
    submit() {

      let user = this.user;
      let password = this.password;
      if (!user) {
        this.$toast('手机号码不能为空');
        return;
      }
      if (!password) {
        this.$toast('密码不能为空');
        return;
      }
      if (password.length < 6) {
        this.$toast('请输入六位以上的密码');
        return;
      }
      var obj = {
        appid: 2,
        mobile: user,
        password: password,
        timeStamp: APIUrl.timeStamp
      };
      let sign = this.$md5(this.$sort(obj) + APIUrl.appsecret);
      let params = Object.assign({
        sign: sign
      }, obj)

      this.$post(APIUrl.login, params).then(res => {
        if (res.code == 200) {
          localStorage.setItem('token', res.data.token)
          localStorage.setItem('is_bind', res.data.is_bind);
          localStorage.setItem('is_child', res.data.is_child);
          this.$router.replace('/')
        } else {
          this.$toast(res.msg);
        }
      })
    },
    onClickLeft() {
      this.$router.push({ name: 'index' })

    }
  },
  mounted() {}
}

</script>
<style>
.mobilelogin .select_way {
  font-size: 0.6rem;
  padding: 10px 0;
}

.mobilelogin .other_method {
  position: fixed !important;
  bottom: 10%;
  width: 100%;
  z-index: -1;
  padding: 0 10px;
}

.mobilelogin .other_method .wechat {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.mobilelogin .other_method .wechat p {
  font-size: 0.7rem;
  margin-top: 2%;
  color: #333333;
}

.mobilelogin .other_method .wechat img {

  width: 41px;
  height: 40px;

  margin: 1% 0;

}

.mobilelogin .other_method .van-divider {
  font-size: 0.6rem;
  margin-bottom: 7%;
}

.login {
  width: 80%;
  margin: 14% auto 0;
}

.login table {
  width: 100%;
}

.login input {
  border: none;
  /*height: 23px;*/
}

.login table tr td:first-child {
  width: 10%;
}

.login table tr {
  border-bottom: 1px solid #C4C4C2;
  vertical-align: bottom;
  height: 2.9rem;
  line-height: 1.1rem;
  font-size: 0.7rem;
  margin-top: 1rem;
}

.login i {
  color: #46C68A;
}

.login button {
  width: 100%;
  margin: 10% 0 5%;
  padding: 3% 20%;
  font-size: 1rem;
}

.login_button a,
.login_button p {
  color: #161815;
  font-size: 12px;
}

.login .account {
  margin-top: 14px;
}

.login input {
  font-size: 0.8rem;
}

.mobilelogin .van-hairline--bottom::after {
  border-bottom-width: 0;
}

.login .iconfont {
  font-size: 0.8rem;
}

.login address {
  font-size: 12px;
  position: fixed;
  bottom: 2%;
  left: 37%;
}

.login address strong {
  color: #4BA673;
}

.login_gradient {
  background-image: linear-gradient(to bottom, white, #F4FCF7);
}

.mobilelogin .van-nav-bar__title {
  font-size: 0.8rem;
  font-weight: 600;
}

.mobilelogin input::-webkit-input-placeholder,
textarea::-webkit-input-placeholder {
  font-size: 0.7rem;
  color: #c9c9c9;
  margin-top: -50px;
}

.mobilelogin .account i {
  width: 1rem;
  text-align: center;
  margin-right: 5px;
}

.mobilelogin .account {
  border-bottom: 1px solid #C4C4C2;
  padding-bottom: 1%;
}

.mobilelogin .lock {
  border-bottom: 1px solid #C4C4C2;
  padding: 5% 0 1% 0;
}

.mobilelogin .lock i {
  width: 1rem;
  text-align: center;
  margin-right: 8px;
  font-size: 1rem;
}

.mobilelogin .login_img img {
  height: 70px;
  object-fit: contain;
}

.mobilelogin .login_img {
  height: 75px;
  width: 50%;
  object-fit: contain;
  margin: 0 auto;
}

</style>
