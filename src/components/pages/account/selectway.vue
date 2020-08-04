<template>
   <div class="select_way">
     <div class="close" @click="close">关闭</div>
     <div class="buttons">
       <button class="create" @click="createCount">创建新账号</button>
         <button class="bind" @click="bind">绑定已有账号</button>


     </div>
   </div>
</template>

<script>
  import APIUrl from './../../../../config/apiurl';
    export default {
        name: "selectway",
      data(){
          return {
            identifying:this.$route.query.identifying,
          }
      },
      methods:{
          close(){
          window.location.href = APIUrl.root + '#/login';
          },
        bind(){
            localStorage.setItem('identifying',this.identifying)
          window.location.href = APIUrl.root + '#/bindlogin';
        },
        createCount(){
          localStorage.setItem('identifying',this.identifying)
          window.location.href = APIUrl.root + '#/register';
          return;

          let obj = {
            appid: APIUrl.appid,
            timeStamp: APIUrl.timeStamp,

          };
          let sign = this.$md5(this.$sort(obj) + APIUrl.appsecret);
          let params = Object.assign({sign: sign,identifying:this.identifying}, obj);


          this.$post(APIUrl.wxLoginFollow, params).then(res => {
            if(res.code==200){
              localStorage.setItem('token', res.data.token);
              localStorage.setItem('is_bind', res.data.is_bind);
              localStorage.setItem('is_child', res.data.is_child);
              this.$toast('创建新账号成功')
              window.location.href = APIUrl.root ;
            }else if(res.code==403){
              this.$toast("绑定手机成功,请耐心等待审核");
              setTimeout(()=>{
                window.location.href = APIUrl.root+"#/login";
              },1000)

            }else{
              this.$toast(res.msg)
            }
          })
        }
      }
    }
</script>

<style scoped>
  .select_way .close{margin:10px;}
.select_way{color:#009A44;font-size: 0.8rem;background: white;position: fixed;width:100%;height:100%;}
.select_way .buttons {display: flex;justify-content: center;flex-direction: column;align-items: center;margin-top:50%;}
.select_way .buttons button{width:50%;height: 38px;border-radius: 5px;}
.select_way .create {background: #009A44;color:white;margin-bottom: 4%;}
.select_way .bind{border: 1px solid #009A44;background: none;}
</style>
