<template>
	<div class="comman2 investrecord">
		<van-sticky>
			<van-nav-bar title="充值记录" left-arrow @click-left="onClickLeft" />
		</van-sticky>
		<div class="billrecord white" v-if="visible">
			<van-list v-model="loading" :finished="finished" :finished-text="tipmessage" @load="onLoad">
			<table v-for="item in inves">
				<tr>
					<td class="bottom ">订单消费：{{item.order_sn}}</td>
					<td rowspan="2" class="right" v-if="item.consume == 1">-{{item.price}}</td>
					<td rowspan="2" class="right red_font" v-if="item.consume == 0">+{{item.price}}</td>
				</tr>
				<tr>
					<td class="gray"> 消费时间：{{item.date}}</td>
				</tr>
			</table>
			</van-list>

		</div>
	</div>
</template>
<script>
	import APIUrl from './../../../../config/apiurl'
	export default {
		data() {
			return {
				visible: true,
				inves: [],
				tipmessage: '当前没有更多了',
				page: 1,
				loading: false,
				finished: false
			}
		},

		methods: {
			onClickLeft() {
				this.$router.go(-1); //返回上一层
			},
			rechargeList() {
				let obj = {
					appid: APIUrl.appid,
					timeStamp: APIUrl.timeStamp
				};
				let sign = this.$md5(this.$sort(obj) + APIUrl.appsecret);
				let params = Object.assign({
					sign: sign,
					page: this.page,
					num: 20
				}, obj)
				this.$get(APIUrl.rechargeList, params).then(res => {
					if(res.code == 200) {
						this.inves = res.data;
					}
				})
			},
			onLoad() {
				this.page++
					let obj = {
						appid: APIUrl.appid,
						timeStamp: APIUrl.timeStamp
					};
				let sign = this.$md5(this.$sort(obj) + APIUrl.appsecret);
				let params = Object.assign({
					sign: sign,
					page: this.page,
					num: 20
				}, obj)
				this.$get(APIUrl.rechargeList, params).then(res => {
					if(res.code == 200) {
						this.loading = false;
            if(res.data.lengt==0){
              this.finished = true;
              return;
            }
						if(res.data.length) {
							this.inves.splice(this.inves.length, 0, ...res.data);
						} else {

							if(this.page == 1) {
								this.tipmessage = ''
							} else {
								this.finished = true;
							}
						}
					}
				})
			}
		},
		created() {
			this.rechargeList()
		}

	}
</script>
<style>
	.investrecord .billrecord {
		margin-top: 5px;
		width: 100%;
		padding: 0 10px;
		font-size: 0.7rem;
	}

	.investrecord table {
		width: 100%;
    border-bottom: 1px solid #efefef;
	}

	.investrecord table tr {
		height: 1.5rem;
	}
</style>
