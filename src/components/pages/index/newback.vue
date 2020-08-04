<template>
<div class="comman2 newback">
  <van-nav-bar title="新品反馈"  left-arrow @click-left="onClickLeft" />

  <div class="textarea">
    <van-field
      v-model="content"
      rows="3"
      autosize

      type="textarea"
      maxlength="50"
      placeholder="商场没有您要的商品？请提供资料我们帮您找..."
      show-word-limit
    />

    <van-uploader
      class="upimg"
      v-model="fileList"
      multiple
      :after-read="afterRead"
      :delete="deletePhoto"
      :max-count="3"
    />

  </div>
  <div class="center"><button @click="save" class="button_style line_gradient">提交</button></div>
</div>
</template>

<script>
    import APIUrl from './../../../../config/apiurl'
    export default {
        name: "newback",
        data(){
            return {
                content:'',
                fileList:[],
                allPhotos:[]
            }
        },
    methods:{
        onClickLeft() {
            this.$router.back();
        },
         afterRead(file) {
      // 此时可以自行将文件上传至服务器
         function dataURLtoBlob(dataurl) {
                        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
                            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
                        while (n--) {
                            u8arr[n] = bstr.charCodeAt(n);
                        }
                        return new Blob([u8arr], {type: mime});
                    }
                     let axios=require('axios');
            let fileURL = dataURLtoBlob(file.content);

              let obj = {appid: APIUrl.appid, timeStamp: APIUrl.timeStamp,type:'feed'};
              let sign = this.$md5(this.$sort(obj) + APIUrl.appsecret);
             let fd=new FormData();
             fd.append('img',fileURL)
            fd.append('appid',APIUrl.appid)
            fd.append('timeStamp',APIUrl.timeStamp)
            fd.append('type','feed')

            fd.append('sign',sign)
            axios.post(APIUrl.root+APIUrl.uploadImg,fd).then(res=>{
              if(res.data.code==200){

                this.allPhotos.push(res.data.data.path);

              }
              else{
                this.$toast(res.msg)
              }
            })

    },
    deletePhoto(file){

    },
        save(){


            let axios=require('axios');

            if(this.content.match(' ')){
              this.$toast('请不要输入非法字符');
              return;
            }
            let obj = {appid: APIUrl.appid, timeStamp: APIUrl.timeStamp,contents:this.content.trimEnd()};
            let sign = this.$md5(this.$sort(obj) + APIUrl.appsecret);
            let params = Object.assign({ sign:sign,img:this.allPhotos},obj);

           axios.post(APIUrl.root+APIUrl.feedBack,params).then(res => {

             if(res.data.code==200){
               this.$toast('新品反馈成功');
               this.$router.push({name:'index'})

             }else{
              if(res.data.msg=='签名错误'){
               this.$toast('请不要输入非法字符')
              }else{
                 this.$toast(res.data.msg)
              }

             }

        })

    }}
    }
</script>

<style>
.newback .textarea{margin:2% 0 4%;}
  .newback .upimg{background: white;width:100%;}
  .newback .van-uploader__wrapper{padding:10px;}
  .newback .van-uploader__upload{width:3rem;height:3rem;}
  .newback .van-cell:not(:last-child)::after {
    border-bottom: none;}
  .newback .van-cell {
    border-bottom: 1px solid #ebedf0;}
.newback  .van-uploader__preview-image{width:3rem;height: 3rem;}
.newback .van-uploader{display: flex;align-items: center;}
.newback .van-uploader::after{content:"(最多上传三张照片)";font-size:0.6rem;color:gray;}
</style>
