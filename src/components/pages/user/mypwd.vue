<template>
	<div class="delivery comman2">
		<van-nav-bar title="密码修改" left-arrow @click-left="onClickLeft" />

		<div class="white all_table">
			<table class="width">
				<tr>
					<td>旧密码</td>
					<td colspan="2">
						<input type="text" placeholder="请输入旧密码" v-model="oldpwd">
					</td>
				</tr>
				<tr>
					<td>新密码</td>
					<td> <input type="password" placeholder="请输入六位以上的密码" v-model="newpwd"></td>
				</tr>

				<tr>
					<td>确认密码</td>
					<td> <input type="password" placeholder="请输入新密码的值" v-model="confirmpwd" @focus="focus"></td>
				</tr>
			</table>

		</div>

		<div class="center"><button class="button_style " :class="{line_gradient:statu}" @click="submit"> 保存</button></div>
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
				oldpwd: '',
				newpwd: '',
				confirmpwd: '',
				statu:''
			}
		},
		created() {

		},
		methods: {
			focus() {
				this.statu = true;
			},
			submit() {
				if(this.newpwd!=this.confirmpwd){
					 this.$toast('新密码与确认密码不一致');
                         return;
				}
			
				if(this.newpwd.match(' ')){
                         this.$toast('输入的密码不能含有空字符');
                         return;
				}
				let newobj = Object.assign({
					password: this.newpwd,
					old_pwd: this.oldpwd,
					password_confirmation: this.confirmpwd
				}, obj);
				let sign = this.$md5(this.$sort(newobj) + APIUrl.appsecret);
				let params = Object.assign({
					sign: sign
				}, newobj);
				this.$post(APIUrl.modifyPassword, params).then(res => {
					if(res.code == 200) {
						this.$toast("修改密码成功");
						this.$router.push({
							name: 'login'
						})
					}else{
						this.$toast(res.msg);
					}
				})
			},
			onClickLeft() {
				this.$router.go(-1);//返回上一层
			},
		}

	}
</script>
<style>
	.black_font {
		color: black;
	}

	.delivery button {
		margin-top:8%;
	}

	.delivery tr {
		line-height: 1.8rem;
		height: 1.8rem;
	}
</style>
