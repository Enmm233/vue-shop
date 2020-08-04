<template>
	<div class="comman2 accountedit">
		<van-nav-bar title="账号编辑" right-text="删除" left-arrow @click-left="onClickLeft" @click-right="onClickRight" />
		<div class="edit_info">
			<van-field v-model="nickname" label="账号名称" />
			<van-field v-model="contact" label="联系人" />
			<van-field v-model="phone" type="tel" label="手机号" />
			<van-field v-model="password" type="password" label="密码" placeholder="请输入六位及以上的密码,不输入密码不变" />
			<van-cell center title="账号启用和禁用" class="greentitle">
				<van-switch v-model="checked" slot="right-icon" size="30" />
			</van-cell>
			<van-field v-model="address" label="收货地址" right-icon="arrow"  placeholder="请选择地址" disabled @click="mapUrl"/>
      <van-field v-model="details" label="门牌号" />

		</div>
		<div class="center" @click="submit"><button class="button_style line_gradient">提交</button></div>
	</div>
</template>
<script>
	import AreaList from '../../../../static/js/areaList';
	import APIUrl from './../../../../config/apiurl'
  import accountadd from "./accountadd";
	export default {
		data() {
			return {
				show: false,
				value1: '',
         select_zid:this.$route.query.select_zid,
			  	accinfo:'',
          nickname:this.$route.query.nickname,
          contact:this.$route.query.contact,
          phone:this.$route.query.mobile,
          url:this.$route.query.url,
          checked: '',
          address:this.$route.query.address,
          password:this.$route.query.password,
          details:this.$route.query.details,
          latng:this.$route.query.latng,
        count:1,
			}
		},

		methods: {
			selectAdd(e) {
				let address = ''
				for(let i of e) {
					address += i.name;
					this.accinfo.address = address;
					this.show = false;
				}
			},
			onClickLeft() {  //返回上一页
				 // this.$router.back();//返回上一层
        this.$router.push({path:'accountmange'})
			},
        mapUrl(){
      if( this.checked){
          this.status = 1
      }else{
          this.status = 0
      }
   //           localStorage.setItem('contact',this.contact)
   //           localStorage.setItem('nickname',this.nickname)
   //           localStorage.setItem('details',this.details)
   //           let url='';
   //           // let domain='http://192.168.0.126:89/';
   //           let domain=APIUrl.root;
   //           if(!this.password){
   //             url=escape(domain+`#/accountedit?count=2&&mobile=${this.phone}&&status=${this.status}&&select_zid=${this.select_zid}
   //            `);
   //           }else{
   //              url=escape(domain+`#/accountedit?password=${this.password}&&count=2&&mobile=${this.phone}&&status=${this.status}&&select_zid=${this.select_zid}
   //             `);
   //           }


   // window.location.href="https://apis.map.qq.com/tools/locpicker?search=1&type=0&backurl="+url+"&key=EE7BZ-2ODH2-DFUUE-C2PG7-RWE6F-XDBMG&referer=caidj"
   // return;
			    this.$router.push({name:'address',query:{
                  nickname:  this.nickname,
                  contact: this.contact,
                  mobile: this.phone,
                  status:this.status,
                  select_zid: this.select_zid,
                  address: this.address,
                  details:this.details,
                  password:this.password,
                  url:'accountedit',

              }})
        },
			onClickRight() {
				this.$dialog.confirm({
					message: '确定要删除改账号吗？'
				}).then(() => {
					// on confirm
            let obj = {
                appid: APIUrl.appid,
                timeStamp: APIUrl.timeStamp,
                select_zid:this.select_zid,
            };
            let sign = this.$md5(this.$sort(obj) + APIUrl.appsecret);
            let params = Object.assign({
                sign: sign
            }, obj)
            this.$get(APIUrl.delChild, params).then(res=>{
                if(res.code==200){
                    this.$toast('删除成功');
                    this.$router.back();
                }else{
                  this.$toast(res.msg);
                }
            })
				}).catch(() => {
					// on cancel
				});
			},
			memberAddressInfo() {
				let obj = {
					appid: APIUrl.appid,
					timeStamp: APIUrl.timeStamp
				};
				let sign = this.$md5(this.$sort(obj) + APIUrl.appsecret);
				let params = Object.assign({
					select_zid: this.select_zid,
					sign: sign
				}, obj)
				this.$get(APIUrl.memberAddressInfo, params).then(res => {
					if(res.code == 200) {
						let data = res.data;
                  this.nickname=data.nickname;
                  this.contact=data.contact;
                  this.phone=data.phone;
                  this.checked=data.checked;
                  this.address=data.address;
                  this.password=data.password;
                  this.details=data.details;
						if(data.status == 0){
							this.checked = false;
						}else{
							this.checked = true;
						}
					}
				})

			},
      submit(){
        let zid=this.select_zid.trim();
        console.log(zid)
        console.log(zid.length)
          if( this.checked){
              this.status = 1
          }else{
              this.status = 0
          }
          let obj = {
              appid: APIUrl.appid,
              timeStamp: APIUrl.timeStamp,
              nickname:  this.nickname,
              contact: this.contact,
              mobile: this.phone,
              status: this.status,
              zid: zid,
              address: this.address
          };
          if(this.contact.match(' ')||this.phone.match(' ')||this.nickname.match(' ')){
          	this.$toast('不能含有非法字符');
          	return;
          }
          let newobj;
          if(this.password){
            newobj=Object.assign({  password:this.password},obj)
          }else{
            newobj=obj
          }
          //
          let sign = this.$md5(this.$sort(newobj) + APIUrl.appsecret);
          let params={};
          if (this.latng) {
             params = Object.assign({
              sign: sign,
              details: this.details,
            latitude: this.$route.query.lat,
            longitude: this.$route.query.lng
            }, newobj)
          } else {
             params = Object.assign({
              sign: sign,
              details: this.details
            }, newobj)
          }



          this.$post(APIUrl.editChild, params).then(res=>{
              if(res.code==200){
                  this.$toast('修改成功');
                  this.$router.push({name:'accountmange'});
              }else{
                this.$toast(res.msg)
              }
          })
      },
		},
		created() {

		    let count=this.$route.query.count||this.count;
          if(count==1){this.memberAddressInfo()}else{
             // this.nickname=localStorage.getItem('nickname');
             // this.details=localStorage.getItem('details');
             // this.contact=localStorage.getItem('contact');
             if(this.status == 0){
             	this.checked = false;
             }else{
             	this.checked = true;
             }
          }

		},

	}
</script>
<style>
	.accountedit .billrecord {
		margin-top: 5px;
		width: 100%;
		padding: 0 10px;
		font-size: 0.7rem;
	}

	.accountedit .van-nav-bar__text {
		color: #009A44;
	}

	.accountedit .van-switch__node {
		border-radius: 0;
		width: 0.6em;
		height: 0.6em;
	}

	.accountedit .van-switch {
		border-radius: 0;
		background: #808080;
		width: 1.3em;
		height: 0.6em;
	}

	.accountedit .van-switch--on {
		background: #009A44;
	}

	.accountedit .van-field__label {
		width: 4rem;
	}

	.accountedit .greentitle .van-cell__title {
		color: #009A44;
	}

	.accountedit .van-cell {
		/*padding: 1% 10px;*/
    font-size: 0.7rem;
	}

	.accountedit .van-switch--on .van-switch__node {
		transform: translateX(0.7em);
	}
  .accountedit .edit_info{margin:5px 0 8%;}
</style>
