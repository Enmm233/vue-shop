<template>
	<div class="comman2 invest white">
		<van-nav-bar title="充值" left-arrow @click-left="onClickLeft" />
		<div>
			<div class="center remain">
				<p>账户余额 (元)</p>
				<p>{{surplus}}</p>

				<div class="full" @click="record">
					<span>充值记录 </span>
					<van-icon name="arrow" />
				</div>
			</div>

			<div class="center"><button @click="visible=true">充值</button></div>
			<keyboard :show="visible" :val="value" title="充值金额 (元)" @keyBoard="visible=false" @toParent="getVal"></keyboard>
		</div>
	</div>
</template>

<script>
	import keyboard from './../../public/jianpan.vue'
	import APIUrl from './../../../../config/apiurl'
	export default {
		components: {
			keyboard
		},
		data() {
			return {
				visible: false,
				is_bind:'',
				value: '',
				title: ".......",
				surplus: localStorage.getItem('surplus')
			}
		},

		methods: {
			submit() {

			},
			onClickLeft() {
				this.$router.push({
					name: 'user'
				})
			},
			record() {
				this.$router.push({
					path: "/investrecord"
				})
			},
			// 绑定微信
			adminisus_weixin() {
				if(localStorage.getItem('token')) { // 判断是否登录
					let url = "http://" + window.location.host + '/#/recharge';
					var urle = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + this.wxConfig.appId + '&redirect_uri=' + encodeURIComponent(url) + '&response_type=code&scope=snsapi_userinfo#wechat_redirect';
					window.location.href = urle;
				} else {
					this.$router.push("/wechatlogin");
				}
			},
			getVal(msg) {

			  if(msg==0){
           this.$toast('充值金额必须大于0');
           this.value='';
           return ;
        }
				if(this.is_bind == 0) {
				  this.$toast('请先绑定微信')
					// this.adminisus_weixin();

				} else if(this.is_bind == 1) {
					let obj = {
						appid: APIUrl.appid,
						timeStamp: APIUrl.timeStamp,
						price: msg
					};
					let sign = this.$md5(this.$sort(obj) + APIUrl.appsecret);
					let params = Object.assign({
						sign: sign,
            type:'mp'
					}, obj)
					this.$post(APIUrl.createRecharge, params).then(res => {
						if(res.code==200) {
							this.$toast('成功创建充值订单');
							this.$router.push({
								path: 'investinfo',
								query: {
									id: res.data.orderId
								}
							})
						} else {
							this.$toast(res.msg)
						}
					})
				}

			}
		},
		created() {
			this.is_bind = localStorage.getItem('is_bind');
		}

	}
</script>
<style>
	.invest {
		position: fixed;
		width: 100%;
		height: 100%;
	}

	.invest .remain {
		border-top: 4px solid #F7F7F7;
		padding: 15% 0 30%;
	}

	.invest .remain p:first-child {
		font-size: 0.7rem;
	}

	.invest .remain p:nth-child(2) {
		font-size: 1rem;
		font-weight: 550;
		padding: 2% 0 7%;
	}

	.invest .remain p:nth-child(3) {
		font-size: 0.5rem;
		color: #808080;
	}

	.invest button {
		background: #009A44;
		border-radius: 3px;
		color: #E4FFEF;
		padding: 1% 10% 1.5%;
		font-size: 1rem;
	}

	.invest .van-overlay {
		opacity: 0.8;
	}

	.invest .full {
		font-size: 0.6rem;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #808080;
	}
</style>
