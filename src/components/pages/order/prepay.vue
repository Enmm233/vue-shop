<style>
	body {
		background: #F8F6F9;
	}

	.payment_box .payment_title {
		background: #FAD0CA;
		color: #FF3E1E;
		font-size: 12px;
		text-align: center;
		padding: 5px 0;
	}

	.payment_box .payment_list {
		background: #ffffff;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px solid #F8F6F9;
		font-size: 13px;
		padding: 10px;
	}

	.payment_box .payment_list .red {
		color: #FF3E1E;
	}

	.payment_box .payment_txt {
		color: #808080;
		font-size: 13px;
		padding: 10px;
	}

	.payment_box .payment_btn {
		padding-top: 30px;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.payment_box .payment_btn button {
		font-size: 16px;
		margin-bottom: 10px;
		border-radius: 10px;
		color: #ffffff;
		background: #808080;
		width: 50%;
		padding: 5px 0;
	}

	.payment_box .payment_btn .green {
		background:  rgba(0, 154, 68, 1);
	}
  .payment .van-nav-bar__left{left:5px!important;color:#808080;}
</style>
<template>
	<div>
		<div class="payment">
			<van-nav-bar title="马上支付" left-arrow @click-left="onClickLeft" />

			<div class="payment_box">
				<div class="payment_title">
					如出现下单端账号与支付账号不一样，请到个人中心更改绑定微信
				</div>
				<div class="payment_list">
					<div class="left">订单编号</div>
					<div class="right">{{placeOrder.order_sn}}</div>
				</div>
				<div class="payment_list">
					<div class="left">配送时间</div>
					<div class="right">{{placeOrder.send_time}}</div>
				</div>
				<div class="payment_list">
					<div class="left">订单金额</div>
					<div class="right">{{placeOrder.total_fee}}</div>
				</div>
				<div class="payment_list">
					<div class="left">现金券抵扣</div>
					<div class="right">{{placeOrder.coupons_price}}</div>
				</div>
				<div class="payment_list">
					<div class="left">我的余额</div>
					<div class="right red">¥ {{placeOrder.myBalance}}</div>
				</div>
				<div class="payment_list">
					<div class="left">余额支付</div>
					<div class="right red">¥ {{placeOrder.payBalance}}</div>
				</div>
				<div class="payment_list">
					<div class="left">微信支付</div>
					<div class="right red">¥ {{placeOrder.payWx}}</div>
				</div>
				<div class="payment_txt">
					注：平台不会以订单异常，系统升级等理由要求您点击任何链接进行退款操作，请提高警惕谨防受骗
				</div>
				<div class="payment_btn">
					<button class="green" @click="gcaidjp_azf">确认支付</button>
					<button @click="onClickLeft">取消支付</button>
				</div>
			</div>

		</div>
	</div>
</template>
<script>
	import APIUrl from './../../../../config/apiurl'
	export default {
		data() {
			return {
				// 订单信息
				placeOrder: {
					wxParams: {}
				},
				isDisable:true,
				// 域名
				URL: APIUrl.root,
			}
		},
		methods: {
			onClickLeft() {
				this.$router.go(-1)
			},
			jsApiCall() {
				if(!this.isDisable){
					return
				}
				var oid = this.$route.query.id;
				var obj = {
					appid: APIUrl.appid,
					timeStamp: APIUrl.timeStamp,
					oid: oid,
					type: 'mp'
				};
				let sign = this.$md5(this.$sort(obj) + APIUrl.appsecret)
				let params = Object.assign({
					sign: sign,
				}, obj)
				this.$post(APIUrl.payTemOrder, params).then(res => {
						if(res.code == 406) {
							this.$toast({
								message: '请您先绑定微信',
								duration: 1000
							})
							setTimeout(()=>{
								this.isDisable = true;
								this.$router.push("/user");
							}, 1500)
							return false
						}else if(res.code == 200) {
							this.isDisable = false;
							if(res.data.payType == 1) {
								var thta = this;
								thta.$toast({
									message: '支付成功',
									duration: 1000
								})
								setTimeout(function() {
									thta.$router.push("/order");
								}, 1500)
							} else if(res.data.payType == 2) {
								var thta = this;
								var wxOrder = res.data.wxParams;
								WeixinJSBridge.invoke(
									'getBrandWCPayRequest', {
										"appId": wxOrder.appId, //公众号名称，由商户传入
										"timeStamp": wxOrder.timeStamp, //时间戳，自1970年以来的秒数
										"nonceStr": wxOrder.nonceStr, //随机串
										"package": wxOrder.package,
										"signType": wxOrder.signType, //微信签名方式：
										"paySign": wxOrder.paySign //微信签名
									},
									function(res) {
										if(res.err_msg == "get_brand_wcpay_request:ok") {
											thta.$toast({
												message: '支付成功',
												duration: 1000
											})
											setTimeout(function() {
												thta.$router.push("/order");
											}, 1500)
										}
									}
								);
							}
						}else {
              this.isDisable = true;
							this.$toast({
								message: res.msg,
								duration: 1000
							})
						}
					});

			},
			callpay() {
				if(typeof WeixinJSBridge == "undefined") {
					if(document.addEventListener) {
						document.addEventListener('WeixinJSBridgeReady', this.jsApiCall(), false);
					} else if(document.attachEvent) {
						document.attachEvent('WeixinJSBridgeReady', this.jsApiCall());
						document.attachEvent('onWeixinJSBridgeReady', this.jsApiCall());
					}
				} else {
					this.jsApiCall();
				}
			},
			// 去支付
			gcaidjp_azf() {
				this.callpay();
			},
		},
		beforeCreate() {
			var id = this.$route.query.id;
			let obj = {
				appid: APIUrl.appid,
				timeStamp: APIUrl.timeStamp,
				id: id,
				type: 'mp'
			};
			let sign = this.$md5(this.$sort(obj) + APIUrl.appsecret)
			let params = Object.assign({
				sign: sign,
			}, obj)
			this.$get(APIUrl.temOrderMsg, params).then(res => {
				if(res.code == 200) {
					this.placeOrder = res.data;
				} else if(res.code == 406) {
					this.$router.push("/user");
				} else {
					this.$toast({
						message: res.msg,
						duration: 1000
					})
				}
			})
		}
	}
</script>
