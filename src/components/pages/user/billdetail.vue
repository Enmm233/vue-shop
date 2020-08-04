<template>
	<div class="comman2 billdetail">
		<van-nav-bar title="账单详情" left-arrow @click-left="onClickLeft" />
		<div class="info samll_font">
			<table>
				<tr>
					<td class="bottom statu" v-if="bill.pay_type==2" style="color: #009A44;">现金</td>
          <td class="bottom statu" style="color: #52ca28;" v-if="bill.pay_type==1">余额</td>
				</tr>
				<tr>
					<td>账单编号：{{bill.moneySn}}</td>
				</tr>
				<tr>
					<td class="top">账单创建时间：{{bill.date}}</td>
				</tr>
			</table>
		</div>
		<div class="info font_size">
			<table>
				<tr>
					<td class="big_font">订单数量({{bill.list.length}})</td>
					<td></td>
				</tr>
				<tr v-for="(item,index) in bill.list">
					<td>订单编号：{{item.order_sn}}</td>
					<td class="right red_font">￥{{item.totalPrice}}</td>
				</tr>

				<tr>
					<td></td>
					<td class="right">总额:<span class="red_font">￥{{bill.total}}</span></td>
				</tr>
			</table>
		</div>
		<div class="info font_size">
			<table>
				<tr>
					<td>实收</td>
					<td class="right red_font">￥{{bill.net_receipts}}</td>
				</tr>
				<tr>
					<td>差额</td>
					<td class="right red_font">￥{{bill.difference}}</td>
				</tr>
				<tr>
					<td>应收</td>
					<td class="right red_font">￥{{bill.receivable}}</td>
				</tr>
			</table>
		</div>
	</div>
</template>
<script>
	import APIUrl from './../../../../config/apiurl';

	export default {
		data() {
			return {
				bill: [],
          id : this.$route.query.id,
			}
		},

		methods: {
			onClickLeft() {
				this.$router.push({
					name: 'bill'
				})
			},
			billApi() {

				let obj = {
					appid: APIUrl.appid,
					timeStamp: APIUrl.timeStamp,
					id: this.id
				};
				let sign = this.$md5(this.$sort(obj) + APIUrl.appsecret);
				let params = Object.assign({
					sign: sign,
				}, obj);
				this.$get(APIUrl.moneyListInfo, params).then(res => {
					if(res.code == 200) {
						this.bill = res.data;
					}
				})
			}
		},
		created() {
			this.billApi();
		}

	}
</script>
<style>
	.billdetail .info {
		margin-top: 4px;
		background: white;
		width: 100%;
		padding: 5px 10px;
	}

	.billdetail table {
		width: 100%;
	}

	.billdetail table tr {
		height: 1.3rem;
	}

	.billdetail .statu {
		height: 1.7rem;
		font-size: 1rem;
		line-height: 1.5rem;
	}

	.samll_font {
		font-size: 0.6rem;
		color: #808080;
	}

	.big_font {
		font-size: 0.8rem;
	}
</style>
