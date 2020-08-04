<template>
	<div class="delivery comman2">
		<van-nav-bar title="开具发票" left-arrow @click-left="onClickLeft" />

		<div class="receipt flex white">
			<span :class="{backgreen:type==1}" @click="type=1">企业发票</span>
			<span :class="{backgreen:type==2 }" @click="type=2">个人单位</span>

		</div>
		<p class="red_font note center white">注 : 电子发票和纸质发票具有同等法律效率，可支持报销入账</p>
		<div class="white all_table">

			<table class="width">
				<tr>
					<td>发票抬头</td>
					<td colspan="2">
						<input type="text" placeholder="请填发票抬头" v-model="header">
					</td>
				</tr>
				<tr>
					<td>税　　号</td>
					<td> <input type="text" placeholder="请填写纳税人识别号" v-model="number"></td>
				</tr>

				<tr>
					<td>发票内容</td>
					<td> <input type="text" placeholder="请填入发票内容" v-model="content"></td>
				</tr>
				<tr>
					<td>发票金额</td>
					<td> <input type="text" class="red_font" placeholder="请输入金额" v-model="price" @blur="focus" style="width:4rem;">元</td>
				</tr>
			</table>

		</div>

		<div class="center"><button class="button_style" :class="{line_gradient:show}" @click="submit"> 提交</button></div>
	</div>
</template>

<script>
	import APIUrl from './../../../../config/apiurl';
	let obj = {
		appid: APIUrl.appid,
		timeStamp: APIUrl.timeStamp
	};
	export default {

		data() {
			return {
			    content:'',
          header:'',
          number:'',
          price:'',
			    show:false,
			 	  type: 1,
			}
		},
		methods: {
			focus() {
				this.show = true;
			},
			submit() {
				let obj = {
				    appid:APIUrl.appid,
            timeStamp:APIUrl.timeStamp,
           content: this.content,
          header:this.header,
          number:this.number,
          price:this.price,
          type:this.type,
          };
          if(this.header.match(' ')||this.number.match(' ')||this.price.match(' ')||this.content.match(' ')){
            this.$toast('请不要输入非法字符')
          	return;
          }
          let sign = this.$md5(this.$sort(obj) + APIUrl.appsecret);
          let params = Object.assign({sign: sign}, obj);
				this.$post(APIUrl.handleBill, params).then(res => {
					if(res.code == 200) {
						this.$toast("保存成功");
						this.$router.push({
							name: 'user'
						})
					}else{
					  this.$toast(res.msg);
          }
				})
			},
			onClickLeft() {
			  if(localStorage.getItem('receiptHeader')==this.header){
			    this.$router.back()
        }else{
          this.$dialog.confirm({
            title: '放弃编辑',
            message: '个人信息未保存，确定离开吗？'
          }).then(() => {
            // on confirm
            this.$router.push({
              name: 'user'
            })
          }).catch(() => {
            // on cancel
          });
        }

			},
        billinfo(){
            let sign = this.$md5(this.$sort(obj) + APIUrl.appsecret);
            let params = Object.assign({
                sign: sign
            }, obj);
            this.$get(APIUrl.billInfo, params).then(res=>{
                if(res.code==200){
                    let data=res.data;
                        this.content=data.content;
                        this.header=data.header;
                        this.number=data.number;
                        this.price=data.price;
                        this.type=data.type;
                        localStorage.setItem('receiptHeader',data.header);
                        if(data.type&&data.price&&data.number&&data.header&&data.content){
                                   this.show=true;
                        }
                }
            })
        },

		},
      created(){
		    this.billinfo();
      }

	}
</script>
<style>
	.black_font {
		color: black;
	}

	/*.delivery button {*/
	/*	margin-top: 4%;*/
	/*	background:linear-gradient(-90deg,rgba(0,154,68,1) 0%,rgba(173,219,140,1) 100%);*/
	/*	color: #FFFFFF;*/
	/*}*/

	.delivery tr {
		line-height: 1.8rem;
		height: 1.8rem;
	}

	.backgreen {
		background: #009B44;
		color: white!important;
	}

	.receipt {}

	.receipt {
    margin-top:5px;
		width: 100%;
		padding:6px 1% 1% 1%;
		font-size: 0.8rem;
		justify-content: center;
	}

	p.note {
		font-size: 0.6rem;
		/*margin-top: 5px;*/
	}

	.receipt span {
		border: 1px solid #009B44;
		padding: 1px 6px;
		color: #009B44;
	}
  .delivery>.all_table{margin:0 0 8%;}
	.receipt span:nth-child(1) {
		border-radius: 3px 0 0 3px;
	}
	.receipt span:nth-child(2) {
		border-radius: 0px 3px 3px 0px;
	}
</style>
