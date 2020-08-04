<template>
    <div class="font_size wechat backheight">
      <router-link to="/"><span class="green_font">关闭</span></router-link>
      <div>
        <div class="center" >
          <img class="login_img" :src="imgurl+'/uploads/item/1912/10/H8gt5JuSizRKL8xfRsW57xjy0WGyfssveVxO07MZ.png'"></div>
        <div class="center" >
          <div class="wechat_login" @click="login">
            <i class="iconfont">&#xe637;</i>
            <button>

              微信登录
            </button>
          </div>

        <p @click="show=true">使用其他方式登录</p>
        </div>
      </div>
      <div class="center fixed width explain">
        <p>已阅读并同意<span class="green_font" @click="treatyUrl">注册协议</span></p>
        <p>由<span class="green_font">菜东家</span>提供技术</p>
      </div>
      <van-popup
        v-model="show"
        position="bottom"
       >

        <div @click="mobileUrl">手机号登录</div>
        <div @click="show=false">取消</div>

      </van-popup>
    </div>
</template>

<script>
    import APIUrl from './../../../../config/apiurl';

    let code = location.search;
    let getCode = code.substring(code.indexOf('=') + 1, code.lastIndexOf('&'));
    export default {
        name: "wechatlogin",
      data(){
          return{
            imgurl:APIUrl.root,
            show:false,
          }
      },
        methods:{
          mobileUrl(){
            this.$router.push({path:'/login'})
          },
          treatyUrl(){
            this.$router.push({path:'/treaty'})
          },
            login(){
              if(!getCode){
                let obj = {appid: APIUrl.appid, timeStamp: APIUrl.timeStamp,};
                let sign = this.$md5(this.$sort(obj) + APIUrl.appsecret);
                let params = Object.assign({ sign:sign}, obj);
                this.$get(APIUrl.wxConfig, params).then(res=>{
                if(res.code==200){
                  let url=window.location.href;
                  let redirect_uri = encodeURIComponent(url);
                  let a="https://open.weixin.qq.com/connect/oauth2/authorize?" +
                    "appid="+res.data.appId+"&redirect_uri="+redirect_uri+"&response_type=code&scope=snsapi_userinfo#wechat_redirect"
                  window.location.href=a;
                }
              })}
            }
        },
      created() {

         if(getCode){
           let obj = {appid: APIUrl.appid, timeStamp: APIUrl.timeStamp, code:getCode};
           let sign = this.$md5(this.$sort(obj) + APIUrl.appsecret);
           let params = Object.assign({ sign:sign}, obj);
            
           this.$post(APIUrl.wxLogin, params).then(res=>{
             if(res.code==200){
               localStorage.setItem('token',res.data.token);
              
               window.location.href=APIUrl.root;
             }

           })

         };
      }
    }
</script>

<style scoped>
 .wechat{padding:10px;}
 .wechat .explain{bottom:10px;font-size: 0.6rem;}
 .wechat .login_img{width:50%;margin:30% 0 15%;}
 .wechat .van-popup {display: flex;flex-direction: column;justify-content:center;align-items: center;}
 .wechat .van-popup>div{border-bottom: 4px solid #F5F5F5;width:100%;text-align: center;padding:12px 0;}
 .wechat .van-popup div:last-child{border:none;}
  .wechat .wechat_login+p{color:#02B1E4;margin-top:10px;}
  .wechat button{font-size: 1rem;background:#009a44;}
  .wechat .iconfont{font-size: 1.5rem;margin-right:10px;}
  .wechat .wechat_login{display: flex;justify-content: center;background:#009a44;width:82%;margin: 0 auto;padding:2% 0;color:white;border-radius: 6px;}
</style>

