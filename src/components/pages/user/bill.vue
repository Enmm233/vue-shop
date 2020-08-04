<template>
	<div class="comman2 bill">
		<van-nav-bar title="账单记录" left-arrow @click-left="onClickLeft" />
		<calendar @change="onConfirm" :show.sync="calendarShow" mode="during" />
		<!--		<van-search v-model="date" shape="round" background="#fff" @click="show = true" placeholder="请选择日期" />-->
		<div class="search_style white  width">
			<div class="search center vertical">
				<van-icon name="search" />
				<input type="text" @click="calendarShow =true" v-model="date" placeholder="请选择日期" readonly />
			</div>
		</div>
		<div class="billrecord white" v-if="!is_txt">

			<van-list v-model="loading" :finished="finished" loading-text="正在加载中..." finished-text="已经到底呢" @load="onLoad">
				<div v-for="item in list" class="flex_left_right methods" @click="billDetailUrl(item.id)">
					<div>

						<p class="bottom light_grenn_font" v-if="item.pay_type==1">余额</p>
						<p class="bottom green_font" v-if="item.pay_type==2">现金</p>
						<p class="bottom blue_font" v-if="item.pay_type==3">转账</p>
						<p>{{item.date}}</p>

					</div>

					<div class="red_font">￥{{item.receivable}}</div>

				</div>

			</van-list>
		</div>
		<div v-show="is_txt" class="no_record">
			<img src="../../../../static/img/no_record.png" />
		</div>
	</div>
</template>
<script>
	import APIUrl from './../../../../config/apiurl'

	let year = new Date().getFullYear();
	let month = new Date().getMonth();
	export default {
		computed: {
		},
		data() {
			return {
                calendarShow: false,
				show: false,
				is_txt: false,
				visible: true,
				date: [],
				list: [],
				loading: false,
				finished: false,
				page: 0,
				num:10,
				textinfo:'没有更多呢'
			}
		},
		methods: {
			moneyList() {

				var date = this.date;
				let obj = {
					appid: APIUrl.appid,
					timeStamp: APIUrl.timeStamp
				};
				let sign = this.$md5(this.$sort(obj) + APIUrl.appsecret);
				let params = Object.assign({
					dateArr: date,
					sign: sign,
					page: this.page,
					num:this.num
				}, obj)
				this.$get(APIUrl.moneyListPaginate, params).then(res => {
					if (res.code == 200) {
						this.loading = false;
                     	
						if (res.data.total == 0) { this.finished = true; this.is_txt = true;return; }
						if (res.data.total == 10) { 
							this.list.push(...res.data.list);
							this.finished = true;	
							return; 
							}
		
						if (res.data.list.length<10) {
					    	this.finished = true;
					    	this.is_txt = false;
					    	this.list.push(...res.data.list);
						}else{		
						this.list.push(...res.data.list);	
						}

					}
				})
			},
			onLoad() {
				this.page+=1;
				this.moneyList()
			},
			onConfirm(time) {
				if(time.map((item) => item.format('YYYY-MM-DD')).length==2){
					this.calendarShow = false;
					this.date = time.map((item) => item.format('YYYY-MM-DD'));
					this.list = [];
					this.moneyList()
				}
			},
			billDetailUrl(data) {
				this.$router.push({
					path: '/billdetail',
					query: {
						id: data
					}
				})
			},
			onClickLeft() {
				this.$router.push({
					name: 'user'
				})
			},
		},
		created() {
		}
	}
</script>
<style>
	.bill .billrecord {
		margin-top: 5px;
		/*width: 100%;*/
		/*padding: 0 10px;*/
		font-size: 0.7rem;
	}

	.bill .methods {
		padding: 8px 10px 6px;
		border-bottom: 1px solid #FAF7F8;
	}

	.bill p {
		height: 1.1rem;
		line-height: 1.1rem;
	}

	.bill .search {
		margin: 0 10px;
	}

	.bill .van-hairline--bottom::after {
		border: none;
	}

	.bill .search_style {
		padding: 0 0 3% 0;
	}

	.bill .light_grenn_font {
		color: #52ca28;
	}

	.bill .no_record {
		text-align: center;
		margin-top: 40px;
	}

	.bill .no_record img {
		width: 170px;
	}
</style>