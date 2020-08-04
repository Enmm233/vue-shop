<template>
  <div class="register comman">
<van-nav-bar
class="line_gradient"
  title="修改密码"
  left-arrow
  @click-left="onClickLeft"

/>

<table>
	
	<tr>
		<td>手机号</td>
		<td><input type="text" placeholder="请输入手机号"></td>
	</tr>
	<tr>
		<td>密码</td>
		<td ><input type="text" placeholder="请设置六位以上的密码"></td>
	</tr>
	<tr>
		<td>确认密码</td>
		<td ><input type="text" placeholder="请再次确认登录密码"></td>
	</tr>
	</table>
	<div class="verify_wj">
		<Verify @success="verify('success')" @error="verify('error')" :type="3" :vOffset="-25" :showButton="false" :barSize="{width:'100%',height:'100%'}" ref="verify"></Verify>
	</div>
	<table>
	<tr>
		<td>验证码</td>
		<td><input type="text" placeholder="请输入验证码" class="code_width" @blur="getSend" v-model="codevalue">
			<span class="get_code center" :class="{code_back:send}" @click="getCode">{{messageCode}}</span>
		</td>
	</tr>
</table>
<div class="center login_treaty">
	<button class='button_style' @click="register" :class="{line_gradient:next}">注册，下一步</button>
	<p>已有账户？<router-link to="/login">现在登录>></router-link></p>
     <p><router-link to="/treaty">注册协议</router-link></p>
</div>
  </div>
</template>

<script>
	import Verify from 'vue2-verify'	
	
  export default{
	components: {
        Verify
    },
     data(){
       return {
          messageCode:'获取验证码',
          send:false,
          next:false,
		  codevalue:'',
		  verify_sd:'',
       }
     },

     methods:{
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
     	getCode(){
     		let count=60;
     		this.send=true;
     		let clearTime=setInterval(()=>{
     			count--;
     			this.messageCode=count;
     			if(count==0){
     				clearInterval(clearTime);
     				this.messageCode="获取验证码";
     				this.send=false;
     			}
     		},1000)
     	},
     	getSend(){
     		if(this.codevalue){
     			this.next=true;
     		}
     
     	},
     	register(){
     		this.$toast('验证码输入错误')
     	},
 onClickLeft() {
     this.$toast('返回');
    },
   
	 },
	 created() {
      // this.charCode()
    }

  }
</script>
<style>

.register table tr>td:first-child{width:20%;}
.register .code_width{width:50%;}
.login_treaty p{font-size:12px;color:#1F1C1F;}
.login_treaty a {color:#1F1C1F;}
.login_treaty p:last-child a{position:fixed;color:#418D5F;left:45%;bottom:2%;}
.login_treaty button{margin-bottom:10px;}
.get_code{color:white;background:#1BA559;border-radius:6px;width:72px;display:inline-block;}
.code_back{background:#827F82;}
</style>