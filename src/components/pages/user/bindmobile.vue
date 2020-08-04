<template>
  <div class="bindmobile comman2">
    <van-nav-bar title="更换手机" left-arrow @click-left="onClickLeft"/>
     <div class="font_size red_font tip">绑定后可提高账号安全性</div>
    <div class="white all_table">
      <table class="width">
        <tr>
          <td> <input type="number" placeholder="请输入手机号" v-model="mobile"></td>
          <td colspan="2">

          </td>
        </tr>
        </table>
	<div class="verify_wj" style="margin-left:0;margin-right:0;">
		<Verify @success="verify('success')" @error="verify('error')" :type="3" :vOffset="-25" :showButton="false" :barSize="{width:'100%',height:'100%'}" ref="verify"></Verify>
	</div>
	<table style="width:100%;">

        <tr>
          <td><input type="number" placeholder="请输入短信验证码" @focus="focus" v-model="messagecode"></td>
          <td colspan="2"><span class="get_message float_right" @click="getMessage" :class="{gray:color}">{{get_message}}</span></td>
        </tr>
      </table>

    </div>
    <div class="center">
      <button class="button_style " :class="{line_gradient:statu}" @click="submit"> 立即绑定</button>
    </div>
  </div>
</template>

<script>
  import AreaList from '../../../../static/js/areaList';
  import APIUrl from './../../../../config/apiurl'
  import Verify from 'vue2-verify'	

  export default {
    components: {
        Verify
    },
    data() {
      return {
        
        statu:false,
        color:false,
        mobile:'',
        code:'',
        codeImg:'',
        messagecode:'',
        get_message:'获取验证码',
        verify_sd:'',

      }
    },
    created() {

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
      focus() {
        this.statu = true;
      },

      getMessage(){
        let that=this;
        if(!that.mobile){
          that.$toast('手机号不能为空');
          return false;
        }
        if(!this.verify_sd){
          this.$toast('请滑动完成验证');
          return;
        }
       if(this.get_message!='获取验证码'){
          return;
        }

        let obj = {
          appid: APIUrl.appid,
          timeStamp: APIUrl.timeStamp,
          mobile:this.mobile,
        };
        let sign = this.$md5(this.$sort(obj) + APIUrl.appsecret);
        let verify_sd = this.$md5(APIUrl.appsecret+this.verify_sd);
        let params = Object.assign({sign: sign,secret_str:verify_sd}, obj)
        this.$post(APIUrl.sendCode, params).then(res=>{
          if(res.code==200){
            this.color=true;
            this.get_message=60;
            let  time=setInterval(()=>{
              this.get_message--;
              if(this.get_message==0){
                clearInterval(time);
                this.verify_sd=res.data.random_str
                this.get_message='获取验证码';
                this.color=false;
              }
            },1000)
            this.$toast('验证码已发送到你手机中，请注意查收');

          }else{
            this.verify_sd=res.data.random_str
            this.$toast(res.msg)
          }
        })
      },
      onClickLeft() {
        if(!this.mobile){
          this.$router.back();
          return;
        }
        this.$dialog.confirm({
          title: '放弃编辑',
          message: '个人信息未保存，确定离开吗？'
        }).then(() => {
          // on confirm
              this.$router.push({path:'/myInfo'})
        }).catch(() => {
          // on cancel
        });
      },

      submit(){
        let that=this;
        if(!that.mobile){
          that.$toast('手机号不能为空');
          return false;
        }
        // if(!that.code){
        //   that.$toast('字符不能为空');
        //   return;
        // }
        if(!that.messagecode){
          that.$toast('短信验证码不能为空');
          return;
        }
        let obj = {
          appid: APIUrl.appid,
          timeStamp: APIUrl.timeStamp,
        };
        let sign = this.$md5(this.$sort(obj) + APIUrl.appsecret);
        let params = Object.assign({sign: sign,   mobile:this.mobile,
          code:this.messagecode,}, obj)
        this.$post(APIUrl.bindMobile, params).then(res => {
          if(res.code==200){
            this.$toast('你的手机号绑定成功');
            this.$router.push({path:'/myInfo'})
          }else if(res.code==403){
              this.$toast(res.msg);
              this.$router.push({name:'login'})
            }else {
            this.$toast(res.msg);
          }

        })
      },
      charCode(){
        let obj = {
          appid: APIUrl.appid,
          timeStamp: APIUrl.timeStamp,

        };
        let sign = this.$md5(this.$sort(obj) + APIUrl.appsecret);
        let params = Object.assign({sign: sign}, obj)
        this.$get(APIUrl.captcha, params).then(res=>{
          if(res.code==200){
            this.codeImg=res.data;
          }else{
            this.$toast(res.msg);
          }
        })
      },
    },
    created() {

      //字符验证码
      // this.charCode()

    }

  }
</script>
<style>
  .float_right{float:right;}
  .bindmobile .code_img img{height:1.5rem;margin-right:4px;width:3rem;object-fit: contain;}
  .bindmobile .code_img{height: 2rem;
    display: flex;
    justify-content: flex-end;
    align-items: center;}
  .bindmobile .gray{background:#808080!important;}
  .bindmobile .get_message{background: #1EA55A;color:white;width:4rem;border-radius: 8px;display: inline-block;text-align: center;}
  .bindmobile table tr td:first-child{width:60%;}
  .bindmobile .tip{background:#FED8D3;padding:3px 0;text-align: center;}
  .bindmobile button {
    margin-top: 8%;
    /*background: linear-gradient(-90deg, rgba(0, 154, 68, 1) 0%, rgba(173, 219, 140, 1) 100%);*/
  }
</style>
