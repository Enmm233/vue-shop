<template>
	<div>
		<!--<van-overlay :show="show" @click="show = false">-->
<!--		<van-popup v-model="show" position="bottom" @click-overlay="mask">-->
    <div v-if="show">
      <div @click="show=false" style="position:fixed;height:100%;width:100%;background: rgba(0,0,0,0.35);z-index: 9998;top:0;left:0;"></div>

			<div style="position:fixed;height:100%;z-index: 9999;top:0;left:0;" @click="showCart"><div class="wrapper">
        <div class="caidj_jianpan" @click.stop>
          <div class="title_box">
            <div class="title_txt">{{title}}</div>
            <div class="jianpan_val">
              <input v-model="newval" placeholder="请输入..." readonly/>
            </div>
          </div>
          <div class="content">
            <div class="left">
              <div class="numbtn" v-for="(item,index) in 9" @click="pickNum(item)">{{index+1}}</div>
              <div class="numbtn" @click="pickNum(0)">0</div>
              <div class="numbtn" @click="pickNum('.')">.</div>
              <div class="numbtn shanchu " @click="delNum"><img src="new/img/shanchu.png"></div>
            </div>
            <div class="right">
              <div class="jianpan_btn" @click="eliminate">清除</div>
              <div class="jianpan_btn" @click="showCart">取消</div>
              <div class="jianpan_btn long" @click="toParent">确认</div>
            </div>
          </div>
        </div>
      </div></div>
    </div>
<!--		</van-popup>-->

	</div>
</template>

<script>
	import APIUrl from './../../../config/apiurl'
	export default {
		props: ['show', 'title', 'info', 'val'],
    watch:{
		  val(nvalue,ovalue){
		    this.newval=nvalue;
      }
    },
		data() {
			return {
				  newval: '',
			}
		},
		methods: {
			pickNum(data) {
			   this.newval+=String(data);
			},
			delNum() {

				let string = String(this.newval)
				string = string.substr(0, string.length - 1);
				this.newval = string;
				// console.log(this.val)

			},
			eliminate() {
				this.newval = '';
			},
			showCart() {
				this.newval = '';
				this.$emit('keyBoard', this.show);
			},
			mask() {
				this.newval = '';
				this.$emit('keyBoard', this.show);
			},
			toParent() {
				if(this.newval == "") {
					this.$toast("还没有输入");
				} else if(this.newval==0){
				  this.$toast('购买数量不能为零')
        }else {
          this.$emit("toParent", this.newval);
					this.$emit('keyBoard', this.show);
          this.newval = '';
				}
			}
		},
		created() {}
	};
</script>
<style scoped="scoped">
	.wrapper {
		display: flex;
		align-items: flex-end;
		justify-content: center;
		height: 100%;
	}
  .caidj_jianpan .shanchu {display: flex;justify-content: center;align-items: center;}
  .caidj_jianpan .shanchu img{width:2rem;height:1rem;}
</style>
