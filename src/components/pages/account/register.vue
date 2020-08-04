<template>
  <div class="register comman2 backheight">
    
    <van-nav-bar

      title="注册"
      left-arrow
      @click-left="onClickLeft"

    />

    <table>
      <tr>
        <td>单位名称</td>
        <td colspan="2"><input type="text" placeholder="请输入单位名称" v-model="company"></td>
      </tr>
      <tr>
        <td>手机号</td>
        <td colspan="2"><input type="number" placeholder="请输入手机号" v-model="mobile"></td>
      </tr>

      <tr>
        <td>密码</td>
        <td colspan="2"><input type="password" placeholder="请设置六位以上的密码" v-model="password"></td>
      </tr>
      <tr>
        <td>确认密码</td>
        <td colspan="2"><input type="password" placeholder="请再次确认登录密码" v-model="confirmPwd"></td>
      </tr>
      </table>
        <!-- <td>字符</td>
        <td >
          <input type="text" placeholder="请输入字符" v-model="codePhoto" class="code_width">
        </td>
        <td class="str_code" @click="charCode">
          <img :src="codeImg">
          <span style="color:#868487;" class="middle_font" >换一张</span></td> -->
          <div class="verify_wj">
            <Verify @success="verify('success')" @error="verify('error')" :type="3" :showButton="false" :vOffset="-25" :barSize="{width:'100%',height:'100%'}" ref="verify"></Verify>
          </div>
      <table>
      <tr>
        <td>验证码</td>
        <td class="middle_font">
          <input type="text" placeholder="请输入验证码" class="code_width" v-model="codevalue" @focus="next=true">

        </td>
        <td class="right"><span class="get_code center" :class="{code_back:send}" @click="getCode">{{messageCode}}</span></td>
      </tr>
    </table>
    
    <div class="center login_treaty ">
      <button  @click="register" :class="{line_gradient:next}">提交</button>
            <p style="margin-top:3%">已有账户？
              <router-link to="/login">现在登录>></router-link>
            </p>
            <p class="hidden_div">
              <router-link to="/treaty">注册协议</router-link>
            </p>
    </div>
  </div>
</template>

<script>
  import Verify from 'vue2-verify'
  import APIUrl from './../../../../config/apiurl';

  export default {
    components: {
        Verify
    },
    data() {
      return {
        company:'',
        messageCode: '获取验证码',
        codeImg: '',
        send: false,
        next: false,
        mobile: '',
        password: '',
        confirmPwd: '',
        codePhoto: '',
        codevalue: '',
        verify_sd:'',
      }
    },

    methods: {
      verify(text) {
        if(text=='success'){
          let obj = {
            appid: APIUrl.appid,
            timeStamp: APIUrl.timeStamp,
          };
          let sign = this.$md5(this.$sort(obj) + APIUrl.appsecret);
          let params = Object.assign({sign: sign}, obj)
          this.$get(APIUrl.random, params).then(res => {
            if (res.code == 200) {
              this.verify_sd=res.data.number
            }else {
              this.$refs.verify.refresh()
              this.$toast(res.msg)
            }
          })
        }
      },
      register() {

        if(!this.company){
          this.$toast('请输入单位名称');
          return;
        }
        if(!this.mobile){
          this.$toast('请输入手机号');
          return;
        }
        if(!this.password){
          this.$toast('请输入密码');
          return;
        }
        if(!this.confirmPwd){
          this.$toast('请输入确认密码');
          return;
        }
        if(!this.codevalue){
          this.$toast('请输入验证码');
          return;
        }
          if(this.company.match(' ')||this.password.match(' ')||this.confirmPwd.match(' ')){
          this.$toast('请不要输入非法字符');
          return;
        }
        let obj = {
          appid: APIUrl.appid,
          timeStamp: APIUrl.timeStamp,
          mobile: this.mobile,
          nickname:this.company,
          password:this.password,
          confirm_pwd:this.confirmPwd,
          verify_code:this.codevalue,
        };

        let sign = this.$md5(this.$sort(obj) + APIUrl.appsecret);
        let sale=this.$route.query.sale;
       let openid =localStorage.getItem('identifying')
        let params={};
        if(sale){
          params = Object.assign({sign: sign,sale:sale}, obj)
        }else{
          params = Object.assign({sign: sign}, obj)
        }
        if(openid){
          params=Object.assign({sign:sign,openid:openid},obj)
        }
        this.$post(APIUrl.register, params).then(res => {
          if(res.code==200){
            this.$toast('注册成功');
             window.location.href = APIUrl.root+"#/login";
          }else {
         
            if(res.msg=='签名错误'){
              this.$toast('请不要输入非法字符')
            }else{
                 this.$toast(res.msg);
            }
          }
        })
      },
      getCode() {
        if(!this.mobile){
          this.$toast('请输入手机号');
          return;
        }
        if(!this.verify_sd){
          this.$toast('请滑动完成验证');
          return;
        }


        let obj = {
          appid: APIUrl.appid,
          timeStamp: APIUrl.timeStamp,
          mobile: this.mobile,
        };
        if(this.messageCode!="获取验证码"){
          return;
        }
        let sign = this.$md5(this.$sort(obj) + APIUrl.appsecret);
        let verify_sd = this.$md5(APIUrl.appsecret+this.verify_sd);
        let params = Object.assign({sign: sign,secret_str:verify_sd}, obj)
        this.$post(APIUrl.sendCode, params).then(res => {
          if (res.code == 200) {
            this.send = true;
            this.next=true;
            this.messageCode = 60;
            let time = setInterval(() => {
              this.messageCode--;
              if (this.messageCode == 0) {
                clearInterval(time);
                this.verify_sd=res.data.random_str
                this.messageCode = '获取验证码';
                this.send = false;
              }
            }, 1000)
            this.$toast('验证码已发送到你手机中，请注意查收');

          } else {
            this.verify_sd=res.data.random_str
            this.$toast(res.msg)
          }
        })
      },

      onClickLeft() {
        this.$router.push({name: 'login'});
      },
      charCode() {
        let obj = {
          appid: APIUrl.appid,
          timeStamp: APIUrl.timeStamp,

        };
        let sign = this.$md5(this.$sort(obj) + APIUrl.appsecret);
        let params = Object.assign({sign: sign}, obj)
        this.$get(APIUrl.captcha, params).then(res => {
          if (res.code == 200) {
            this.codeImg = res.data;
          } else {
            this.$toast(res.msg);
          }
        })
      },
    },
    created() {
      // this.charCode()
    }

  }
</script>
<style>
  .register .middle_font {
    font-size: 0.7rem;
  }

  .register table {
    margin: 0 10px;
    width: 95%;
  }

  .register table .str_code {
    /*display: flex;*/
    /*align-items: center;*/
  }

  .register table .str_code img {
    height: 1rem;
    margin-right: 10px;
  }

  .register table tr {
    height: 1.7rem;
    line-height: 1.7rem;
    color: #808080;
    border-bottom: 1px solid #F7F6F6;
    font-size: 0.7rem;
  }

  .register table tr > td:first-child {
    padding: 0 0 0 10px;
  }

  .register table tr > td:last-child img{height: 1rem;margin-right:5px;width:3rem;}
  .register table .str_code{
    display: flex;
    color: black;

    align-items: center;
    justify-content:flex-end;
  }

  .register .code_width {
    width: 50%;
  }

  .login_treaty p {
    font-size: 12px;
    color: #1F1C1F;
  }

  .login_treaty a {
    color:#1A1A1A;;
  }

  .login_treaty p:last-child a {
    position: fixed;
    color: #418D5F;
    left: 45%;
    bottom: 2%;
  }

  .login_treaty button {
    margin-top:10%;
    font-size: 0.9rem;
    background: #827F82;
    color:#fff;
    border-radius: 5px;
    padding:2% 25%;
  }

  .get_code {
    color: white;
    background: #1BA559;
    border-radius: 6px;
    width: 4rem;
    display: inline-block;
    height: 1rem;
    line-height: 1rem;
  }

  .code_back {
    background: #827F82;
  }

  .register input {
    border: none;
  }
  
</style>
