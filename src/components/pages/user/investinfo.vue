<template>
	<div class="comman2 invest_info">
		<van-nav-bar title="充值信息" left-arrow @click-left="onClickLeft" />
		<div class="invest_order">
			<p class="caution">如出现下单端账号与支付账号不一样，请到个人中心更改绑定微信</p>
			<div class="flex_left_right ">
				<dfn>  充值编号</dfn>
				<dfn class="gray">{{placeRecharge.order_sn}}</dfn>
			</div>
			<div class="flex_left_right ">
				<dfn>充值金额</dfn>
				<dfn class="red_font">￥{{placeRecharge.count_price}}</dfn>
			</div>
			<div class="flex tips">
				<p>注：</p>
				<p>平台不会以订单异常，系统升级等理由要求您点击任何链接进行退款操作，请提高 警惕谨防受骗！
				</p>
			</div>
		</div>
		<div class="button_option center">
			<button class="button_style line_gradient" @click="submit"> 确认充值</button>
			<button class="button_style" @click="backIndex"> 取消充值</button>
		</div>

	</div>
</template>

<script>
	import APIUrl from './../../../../config/apiurl'
	export default {
		name: "investinfo",
		data() {
			return {
				id: this.$route.query.id,
				is_bind: '',
				placeRecharge: [],

			}
		},
		methods: {
			onClickLeft() {
				this.$router.back()
			},

			jsApiCall() {
				var thta = this;
				WeixinJSBridge.invoke(
					'getBrandWCPayRequest', {
						"appId": this.placeRecharge.wxParams.appId, //公众号名称，由商户传入 
						"timeStamp": this.placeRecharge.wxParams.timeStamp, //时间戳，自1970年以来的秒数 
						"nonceStr": this.placeRecharge.wxParams.nonceStr, //随机串 
						"package": this.placeRecharge.wxParams.package,
						"signType": this.placeRecharge.wxParams.signType, //微信签名方式： 
						"paySign": this.placeRecharge.wxParams.paySign //微信签名 
					},
					function(res) {
						if(res.err_msg == "get_brand_wcpay_request:ok") {
							thta.$toast({
								message: '支付成功',
								duration: 1000
							});
							setTimeout(function() {
								thta.$router.push("/user");
							}, 1500)
						}
					}
				);
			},
			callpay() {
				if(typeof WeixinJSBridge == "undefined") {
					if(document.addEventListener) {
						document.addEventListener('WeixinJSBridgeReady', jsApiCall, false);
					} else if(document.attachEvent) {
						document.attachEvent('WeixinJSBridgeReady', jsApiCall);
						document.attachEvent('onWeixinJSBridgeReady', jsApiCall);
					}
				} else {
					this.jsApiCall();
				}
			},
			// 去支付
			submit() {
				this.callpay();
			},

			backIndex() {
				this.$router.back()
			},
			createdOrder() {
				let obj = {
					appid: APIUrl.appid,
					timeStamp: APIUrl.timeStamp,
					id: this.id,
					type: 'mp'
				};
				let sign = this.$md5(this.$sort(obj) + APIUrl.appsecret);
				let params = Object.assign({
					sign: sign
				}, obj)
				this.$post(APIUrl.placeRecharge, params).then(res => {
					if(res.code == 200) {
						this.placeRecharge = res.data;
					} else {
						this.$toast(res.msg)
					}
				})
			}
		},
		created() {
			this.is_bind = localStorage.getItem('is_bind')
			this.createdOrder();
		}
	}
</script>

<style scoped>
	.invest_info {
		font-size: 0.8rem;
	}
	
	.invest_info .invest_order .flex_left_right {
		border-bottom: 1px solid #F6F6F6;
		font-size: 0.7rem;
	}
	
	.invest_info .invest_order .caution {
		background: #FAD0CC;
		color: #FF3E1E;
		padding: 3px 10px;
		text-align: center;
		font-size: 0.6rem;
	}
	
	.invest_info .invest_order div {
		background: white;
		padding: 7px 10px;
	}
	
	.invest_info .tips {
		color: #808080;
		padding: 0 10px;
		font-size: 0.6rem;
		background: none!important;
	}
	
	.invest_info .button_option {
		flex-direction: column;
		margin-top: 5%;
	}
	
	.invest_info .button_option button {
		font-size: 0.8rem;
		flex: 0.5;
		margin-top: 3%;
	}
</style>