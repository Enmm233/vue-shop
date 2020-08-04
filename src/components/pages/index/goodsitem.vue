<template>
	<div>
		<!--header-->
		<div @click="to">单个商品</div>
		<Jianpan></Jianpan>
	</div>
</template>
<script>
	import Jianpan from '../../public/jianpan'
	
	export default {
		components: {
			Jianpan
		},
		data() {
			return {
			}
		},
		methods: {
			to() {
				this.$dialog.confirm({
					title: '标题',
					message: '弹窗内容'
				}).then(() => {
					// on confirm
				}).catch(() => {
					// on cancel
				});
				//				this.$router.push({
				//					name: 'goodsitem'
				//				});
			}
		},
		created() {

		}
	};
</script>
<style scoped="scoped">

</style>