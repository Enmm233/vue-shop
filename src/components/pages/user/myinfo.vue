<template>
  <div class="comman2 myinfo">
    <van-nav-bar title="个人信息" left-arrow @click-left="onClickLeft"/>
    <div class="white">
      <div class="avator">
        <span>头像</span>
        <span class="vertical" @click="fileSelect">
        	 <van-image round width="40" height="40" :src="img"/>
        	 <van-icon name="arrow"/>
        </span>
      </div>
    </div>
    <input type="file" accept="image/*" id="filetest" multiple @change="takePhoto($event)">

    <div class="nickname">

      <div>
        <span class="uniform_width">单位名称</span>
        <input type="text" v-model="nickname" placeholder="请输入单位名称" style="width:76%;"></div>
      <div @click="bindMobileUrl">
        <span class="uniform_width">更换手机</span>
        <div class="mobile">{{mobile}}
          <van-icon name="arrow"/>
        </div>
      </div>
    </div>
    <div class="password" v-if="info.is_password==0">

      <div>
        <span class="uniform_width">密码</span>
        <input type="text" v-model="password" placeholder="请输入六位以上的密码"></div>
      <div>
        <span class="uniform_width">确认密码</span>
        <input type="text" v-model="confirmPwd" placeholder="请输入再次确认密码"></div>
    </div>

    <div class="center">
      <button class="button_style" @click="submit" :class="{line_gradient:status}">保存</button>
    </div>
<!--    <van-action-sheet v-model="show" :actions="actions" cancel-text="取消" @cancel="onCancel" @select="select"/>-->
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
        imgurl:APIUrl.root,
        info: '',
        img: this.$route.query.img,
        nickname: '',
        mobile: '',
        status:false,
        show: false,
        value: '',
        password:'',
        confirmPwd:'',
        actions: [{
          name: '拍照',
          color: '#009A44'
        },
          {
            name: '从相册里选择',
            color: '#009A44'
          },

        ]
      }
    },

    methods: {
          bindMobileUrl(){
            this.$router.push({path:'bindmobile'})
          },
      select(action) {
        if (action.name == '拍照') {
        }
      },
      fileSelect() {
        document.getElementById('filetest').click();
      },
      takePhoto(e) {
        var file = e.target.files[0];
        var reader = new FileReader();
        var that = this
        reader.readAsDataURL(file)
        reader.onload = function (e) {
          if (file.name) {
            that.$router.push({
              path: '/cut',
              query: {
                img: this.result
              }
            })
          }
        }

      },
      submit() {

        var obj = {
          appid: APIUrl.appid,
          timeStamp: APIUrl.timeStamp,
        };
        let sign = this.$md5(this.$sort(obj) + APIUrl.appsecret);
        let params;
          if(this.info.is_password==0){
            if(!this.password){
              this.$toast('密码不能为空');
              return;
            }
            if(!this.confirmPwd){
              this.$toast('确认密码不能为空');
              return;
            }
            if(this.password!=this.confirmPwd){
              this.$toast('密码和确认密码不一致');
              return;
            }
          params=Object.assign({
            nickname: this.nickname,
            sign: sign,
            password:this.password,
            confirm_pwd:this.confirmPwd,
          }, obj)
        }else{
          params=Object.assign({
            nickname: this.nickname,
            sign: sign
          }, obj)
        }

        this.$post(APIUrl.saveMemberInfo, params).then(res => {
          if (res.code == 200) {
            this.$toast('修改成功');
            this.$router.push({
              path: '/user'
            })
          }else{
            this.$toast(res.msg)
          }
        })
      },
      onClickLeft() {
            let companyName=localStorage.getItem('nickname');
          if(companyName==this.nickname){
            this.$router.push({name:"user"})
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
      memberInfo() {
        let sign = this.$md5(this.$sort(obj) + APIUrl.appsecret);
        let params = Object.assign({
          sign: sign
        }, obj)
        this.$get(APIUrl.memberInfo, params).then(res => {
          if (res.code == 200) {
            let data = res.data.info;
            this.info = data;
            localStorage.setItem('nickname',data.nickname);

            if(data.logo){  this.img = data.logo;}else{
              this.img = data.wx_avatar;
            }
            this.nickname = data.nickname;
            if(data.mobileNumber){
              this.mobile = data.mobileNumber;
              this.status=true;
            }else{
              this.mobile='未绑定';
              this.status=false;
            }

          }
        })
      },
    },
    created() {
      this.memberInfo()
    },
    mounted() {
      // let cmr = plus.camera.getCamera();
    }
  }
</script>
<style>
  #filetest {
    display: none;
  }

  .myinfo input {
    border: none;
    height:1rem;
  }

  .myinfo .mobile {
    align-items:center;
    display: flex;
  }

  .myinfo .nickname>div:nth-child(2) {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
  }


  .myinfo .nickname, .myinfo .password {
    font-size: 0.7rem;
    background: white;
    padding: 0 10px;
  }

  .myinfo .nickname > div, .myinfo .password > div {
   height:2.2rem;line-height:2.2rem;
    border-bottom: 1px solid #efefef;
  }

  .myinfo .avator {
    font-size: 0.7rem;
    margin: 5px 10px 0;
    padding: 10px 0;
    display: flex;
    align-items: center;
    /*background: white;*/
    border-bottom: 1px solid #efefef;
    justify-content: space-between;
  }

  .myinfo .avator i {
    margin-left: 5px;
  }

  .myinfo .center button {
    margin-top: 8%;
  }

  .myinfo .van-popup--bottom {
    margin: auto;
    bottom: 1%;
    left: 0;
    width: 92%;
    right: 0;
  }

  .myinfo .van-action-sheet__cancel::before {
    opacity: 0.35;
    background-color: rgba(0, 0, 0, .7);
  }

  .myinfo .van-hairline--top::after {
    border: 1px solid #acacac !important;
  }

  .myinfo .van-popup--bottom.van-popup--round {
    border-radius: 10px 10px 0 0;
  }
  .myinfo .uniform_width{width:4rem;display: inline-block;}
</style>
