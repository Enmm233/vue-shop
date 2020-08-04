<template>
	<div class='user'>

		<div class='avator' v-if="token" @click="myInfoUrl">
			<div v-if="logo">
				<div>
					<van-image round width="70" height="70" :src="logo" />
          <span v-if="nickname">  　{{nickname}}</span>
          <span v-else>请先设置</span>

				</div>

				<van-icon name="arrow"  v-if="Is_child!=1"/>
			</div>
             <div v-else>
				<div>
					<van-image round width="70" height="70" :src="wx_avatar" /> 　
          <span v-if="nickname">  　{{nickname}}</span>
          <span v-else>请先设置</span>
				</div>

				<van-icon name="arrow" v-if="Is_child!=1"/>
			</div>
		</div>
		<div class='avator' v-else @click="myInfoUrl">
			<div>
				<div>
					<van-image round width="70" height="70" src="" /> 　请先登录
				</div>

				<van-icon name="arrow" />

			</div>
		</div>
		<div style="background: #009A44;padding-top:12%;width:100%;position: absolute;z-index:0;"></div>
		<div class='middle'>
			<ul>
				<li>
					<img src="../../../../static/img/recommand.png">
					<router-link to="/recommandshop">推荐</router-link>
				</li>
				<li class='address' @click="deliveryUrl">
					<span class="borders"></span>
					<span>
		                <img src="../../../../static//img/address.png">
						<dfn>地址</dfn>
		          	</span>
					<span class="borders"></span>

				</li>
				<li @click="pwdUrl">
					<img src="../../../../static//img/password.png">
					密码
				</li>
			</ul>
		</div>
		<div>
			<table>
				<tr v-if="Is_child!=1" v-for="item in group" @click="urlPage(item.url,item.is_bind)">
					<td><i :style="{color:item.color}" class="iconfont" v-html="item.icon"></i>{{  item.is_bind==1?'微信改绑':item.name}}</td>
					<td>
						<van-icon name="arrow" class="gray" />
					</td>
				</tr>
				<tr @click="urlPage('login')">
					<td><i style="color:#ADDB8C" class="iconfont">&#xe69e;</i>退出登录</td>
					<td>
						<van-icon name="arrow" class="gray" />
					</td>
				</tr>
			</table>
		</div>
    <div class="share_img" v-if="status" @click="status = false">

      <img src="../../../../static/img/share.png" alt="" class="refresh" >

      <button style="position: fixed;bottom:20%;right:38%;width:100px;background: white;z-index:998;padding:10px 0;border-radius: 5px;">取消</button>
    </div>
	</div>
</template>
<script>
	import APIUrl from './../../../../config/apiurl'
  import wx from 'weixin-js-sdk'
  let code = location.search;
  let getCode = code.substring(code.indexOf('=') + 1, code.lastIndexOf('&'));
	export default {
		data() {
			return {
			  status:false,
			  imgurl:APIUrl.interface,
				imgUrl: APIUrl.root,
        logo:'',
        wx_avatar:'',
        nickname:'',
				true: true,
				token: localStorage.getItem('token'),
				Is_child: localStorage.getItem('is_child'),
				group: [{
						color: '#3DABFF',
						icon: "&#xe630;",
						name: '账号管理',
						url: 'accountmange'
					},
					{
						color: '#FF9C00',
						icon: "&#xe65d;",
						name: '开具发票',
						url: 'receipt'
					},
					{
						color: '#FFF000',
						icon: "&#xe720;",
						name: '账单记录',
						url: 'bill'
					},
					{
						color: '#ffab9a',
						icon: '&#xe64c;',
						name: '购买记录',
						url: 'purchase_record'
					},
					{
						color: '#2DC4B4',
						icon: "&#xe604;",
						name: '充值',
						url: 'invest'
					},
					{
						color: '#F8632F',
						icon: "&#xe64b;",
						name: '现金劵',
						url: 'cash'
					},
					{
					  is_bind:localStorage.getItem("is_bind"),
						color: '#26DD5B',
						icon: "&#xe637;",
						name: '绑定微信',
					  url:'bindWechat'
					},
					{
						color: '#ADDB8C',
						icon: "&#xe623;",
						name: '分享公众号',
						url: 'share'
					},
				],
				userinfo:{
					// info:{
					// 	logo:'',
					// }
				},
			}
		},
		methods: {
		  pwdUrl(){
		    if(this.token){
		      this.$router.push({path:'/mypwd'})
        }else{
          this.$router.push({
            path: '/login'
          })
        }
      },
			urlPage(url,is_bind) {
				if(!localStorage.getItem('token')) {
					this.$router.push({
            path: '/login'
					})
					return;
				}

				if(url != 'login' && url != 'bindWechat'&&url!="share") {
					this.$router.push({
						name: url
					});
					return;
				}

				if(url == 'login') {
					this.$dialog.confirm({
						width: '70%',
						message: '确定要退出账号吗？'
					}).then(() => {
						// on confirm
						localStorage.removeItem('token');
						localStorage.removeItem('is_bind');
						localStorage.removeItem('is_child');
						this.$router.push({
              path: '/login'
						})
					}).catch(() => {
						// on cancel
					});
				}
				if(url=='share'){
				  this.status=true;
        }
				if(url == 'bindWechat') {
          this.$dialog.confirm({
            // title: '标题',
            message: is_bind==1?'是否微信改绑':'是否绑定微信'
          }).then(() => {
            // on confirm
            // if(is_bind==1){
            // 	 this.$router.push({name:'login'});
            // 	 return;
            // }
            localStorage.setItem('isWeixin',true)
            if (!getCode&&localStorage.getItem('isWeixin')) {
              let url = window.location.href;
              let redirect_uri = encodeURIComponent(url);
              // console.log(this.userinfo.appid)
              let a = "https://open.weixin.qq.com/connect/oauth2/authorize?" +
                "appid=" + this.userinfo.appId + "&redirect_uri=" + redirect_uri + "&response_type=code&scope=snsapi_userinfo#wechat_redirect"
              window.location.href = a;
            }else{

            }
          })
        }
			},
			deliveryUrl() {
				this.$router.push({
					path: '/delivery',
					query: {
						url: 'user',
						id: 1
					}
				});
			},
			myInfoUrl() {
				let token = localStorage.getItem('token');

				if(token) {
				  if(localStorage.getItem("is_child")==1){

          }else{
            this.$router.push({
              path: '/myInfo'
            })
          }

				} else {
					this.$router.push({
            path: '/login'

					})
				}
			},
			memberInfo() {
				let obj = {
					appid: APIUrl.appid,
					timeStamp: APIUrl.timeStamp
				};
				let sign = this.$md5(this.$sort(obj) + APIUrl.appsecret);
				let params = Object.assign({
					sign: sign
				}, obj)
				this.$get(APIUrl.memberInfo, params).then(res => {
					if(res.code == 200) {
						let data = res.data.info;
						this.logo=data.logo;
            this.wx_avatar=data.wx_avatar;
              this.nickname=data.nickname;
						localStorage.setItem('surplus', res.data.info.balance)
					}
				})
			},
			wxConfig() {

		  if(this.token){

        let obj = {
          appid: APIUrl.appid,
          timeStamp: APIUrl.timeStamp
        };

        let sign = this.$md5(this.$sort(obj) + APIUrl.appsecret);
        let params = Object.assign({
          sign: sign
        }, obj)

        this.$get(APIUrl.wxConfig, params).then(res => {
          if(res.code == 200) {
            this.userinfo = res.data;
            wx.config({
              debug: false, // 开启调试模式
              appId: res.data.appId, // 必填，公众号的唯一标识
              timestamp: res.data.timestamp, // 必填，生成签名的时间戳
              nonceStr: res.data.nonceStr, // 必填，生成签名的随机串
              signature: res.data.signature, // 必填，签名，见附录1
              jsApiList: [
                'updateAppMessageShareData', 'onMenuShareAppMessage'
              ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });
            this.$get(APIUrl.shareConfig,params).then(res=>{
              if(res.code==200){
                let describe=' ';
                if(res.data.share_describe){
                  describe=res.data.share_describe;
                }
                wx.ready(function () {   //需在用户可能点击分享按钮前就先调用
                  wx.updateAppMessageShareData({
                    title: res.data.share_title, // 分享标题
                    desc:describe, // 分享描述
                    link: res.data.share_href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl: res.data.share_img, // 分享图标
                    success: function () {

                    }
                  })
                });
              }
            });

          }
        })
      }

      }

		},
		created() {
			this.wxConfig();
			this.memberInfo();
      if (getCode&&localStorage.getItem('isWeixin')) {
        let obj = {appid: APIUrl.appid, timeStamp: APIUrl.timeStamp, code: getCode};
        let sign = this.$md5(this.$sort(obj) + APIUrl.appsecret);
        let params = Object.assign({sign: sign}, obj);
        this.$post(APIUrl.bindWeChat, params).then(res => {
          getCode = '';
          localStorage.removeItem('isWeixin');
          if (res.code == 200) {
            this.$toast('微信改绑成功');
            // localStorage.setItem('token', res.data.token);
            localStorage.setItem('is_bind', 1);
            // localStorage.setItem('is_child', res.data.is_child);
            window.location.href = APIUrl.root;
          }else if(res.code==500){
           this.$toast('微信服务器出错');
          }else{
            this.$toast(res.msg)
          }

        })
      }else{

      }

    }
	};
</script>
<style scoped="scoped">
	.user {
		font-size: 0.8rem;
	}

	.user .avator {
		background: #009944;
		color: #DCFFED;
		padding: 6% 10px;
		/*height: 24%;*/
	}

	.user .avator>div {
		display: flex;
		justify-content: space-between;
		/*padding-top: 6%;*/
		align-items: center;
	}

	.user .avator>div>div {
		display: flex;
		align-items: center;
	}

	.user>div {
		padding: 0 3%;
    position: relative;
	}

	.user .middle ul {
		display: flex;
		margin: 0 auto;
		justify-content: space-around;
		border-radius: 6px;
		padding: 8% 1%;
		box-shadow: 1px 1px 4px #e0e0e0;
		/*margin-top: -12%;*/
		background: white;
	}

	.user table {
		font-size: 0.7rem;
		width: 100%;
		/*margin-top: 10px;*/
	}

	.user .middle li img {
		width: 1rem;
		margin-right: 5px;
	}

	.user .middle li {
		color: black;
		width: 33%;
		text-align: center;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.user .middle li i {
		margin-right: 0.25rem;
		color: #009A44;
	}

	.user .middle li a {
		color: #1A1A1A;
	}

	.user table tr {
		height: 2rem;
	}

	.user table tr td:first-child i {
		margin-right: 10px;
	}

	.user table tr td:last-child {
		text-align: right;
	}

	.middle .address span:nth-child(2) {
		display: flex;
		align-items: center;
	}

	.middle .address img {
		width: 0.8rem!important;
	}

	.middle .address {
		justify-content: space-between!important;
	}

	.middle .address .borders {
		width: 1px;
		height: 0.8rem;
		background: black;
	}
 .user {height: 100vh;background: white;}
	.user .middle i {
		font-size: 18px;
	}
  .user .share_img{width: 100vw;height:100vh;position: fixed;top:0;left:0;text-align: end;z-index:999;    background-color: rgba(0,0,0,.5)}
  .user .share_img img{width:80%;margin:10px 10px 0 0;}
</style>
