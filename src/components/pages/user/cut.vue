<template>
	<div class="backheight cut comman2">
		<van-nav-bar title="裁剪" left-arrow @click-left="onClickLeft" />
<!--		<van-image width="10rem" height="10rem" class="" fit="contain" :src="img" />-->

		<div class="select font_size">
			<span>取消</span>
<!--			<span @click="submit">确定</span>-->
		</div>

    <div class="wrapper">
      <vueCropper
        ref="cropper"
        :img="option.img"
        :outputSize="option.size"
        :outputType="option.outputType"
        :info="false"
        :full="option.full"
        :canMove="option.canMove"
        :canMoveBox="option.canMoveBox"
        :fixedBox="option.fixedBox"
        :original="option.original"
        :autoCrop="option.autoCrop"
        :fixed="option.fixed"
        :fixedNumber="option.fixedNumber"
        @realTime="realTime"
      ></vueCropper>
      <div class="btn">
        <a @click="onClickLeft">取消</a>
        <a @click="finish('base64')">确定</a>
      </div>
    </div>
    <!-- 生成预览图片-->
<!--    <div class="show-preview" :style="{'width': previews.w + 'px', 'height': previews.h + 'px',  'overflow': 'hidden', 'margin': '5px'}">-->
<!--      <div :style="previews.div">-->
<!--        <img :src="previews.url" :style="previews.img">-->
<!--      </div>-->
<!--    </div>-->
	</div>
</template>
<script>
    import APIUrl from './../../../../config/apiurl';
    import { VueCropper }  from 'vue-cropper'
	export default {
      components: {
          VueCropper
      },
		data() {
			return {
          previews: {},
          option: {
              img: this.$route.query.img,//裁切图片的地址
              outputSize: 0.6,//裁剪生成图片的质量 0.1-1
              full: false,//是否输出原图比例的截图
              outputType: 'png',//裁剪生成图片的格式
              canMove: true,//图片是否允许滚轮缩放
              fixedBox: true,//固定截图框大小 不允许改变
              original: false,//上传图片按照原始比例渲染
              canMoveBox: false,//截图框能否拖动
              canMove:true,// 上传图片是否可以移动
             autoCropWidth: 100,
             autoCropHeight: 100,
              autoCrop:true,//是否默认生成截图框
              // 开启宽度和高度比例
              fixed: true,
              fixedNumber: [1, 1]
          },
          // img:this.$route.query.img,
			}
		},

		methods: {
        finish (type) {

            var that =this;

            // 输出
//          var test = window.open('about:blank')
//          test.document.body.innerHTML = '图片生成中..'
            if (type === 'blob') {
                this.$refs.cropper.getCropBlob((data) => {
                    //var test = window.open('')
                    //test.location.href = window.URL.createObjectURL(data)
                })
            } else {

                this.$refs.cropper.getCropData((data) => {
                    //裁切生成的base64图片

                    function dataURLtoBlob(dataurl) {
                        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
                            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
                        while (n--) {
                            u8arr[n] = bstr.charCodeAt(n);
                        }
                        return new Blob([u8arr], {type: mime});
                    }
                    let obj = {appid: APIUrl.appid, timeStamp: APIUrl.timeStamp, type: 'avatars'};
                    let sign = this.$md5(this.$sort(obj) + APIUrl.appsecret);

                    let fileURL = dataURLtoBlob(data);
                    let axios=require('axios')
                    let fd = new window.FormData();
                    fd.append('sign', sign);
                    fd.append('appid', APIUrl.appid);
                    fd.append('timeStamp', APIUrl.timeStamp);
                    fd.append('type', 'avatars ');
                    fd.append('img', fileURL);

                    axios.post( APIUrl.root+APIUrl.uploadImg,fd).then(res=>{
                      
                        if(res.data.code==200){
                            let avatar=res.data.data.path;
                            var obj = {
                                appid: APIUrl.appid,
                                timeStamp: APIUrl.timeStamp,
                            };
                            let sign = this.$md5(this.$sort(obj) + APIUrl.appsecret);
                            let fd = new window.FormData();
                            fd.append('sign', sign);
                            fd.append('appid', APIUrl.appid);
                            fd.append('timeStamp', APIUrl.timeStamp);
                            fd.append('avatar', avatar);


                            axios.post( APIUrl.root + APIUrl.saveMemberInfo, fd)
                            this.$router.push({path:'/myinfo',query:{img:data,}})
                        }
                    })
                    this.crap=false;
                })
            }
        },
        realTime (data) {
            this.previews = data
        },
			onClickLeft() {
       this.$router.back();
			}
		}
	}
</script>
<style>
  body,html{
    height: 100%;
  }
  .box{
    position: relative;
    height: 100%;
  }
  .wrapper{
    position: fixed;
    width: 100%;
    top: 0;
    height: calc(100% - 50px);
  }
  .vue-cropper{
    background: black;
    background-image: none!important;
  }
  .btn a{  font-size: 0.8rem!important;}
  .btn{
    height: 50px;
    background: black;
    width: 100%;
    padding: 0 15px;

  }
  .btn a{
    color: white;
    font-size: .16rem;
    display: inline-block;
    line-height: 50px;
  }
  .btn a:nth-of-type(1){
    float: left;
  }
  .btn a:nth-of-type(2){
    float: right;
  }
	.cut .van-nav-bar,
	.cut {
		background: black;
		color: white;
	}

	.cut .van-icon,
	.cut .van-nav-bar__title {
		color: white;
	}

	.cut .select {
		width: 100%;
		position: fixed;
		bottom: 1%;
		display: flex;
		justify-content: space-between;
		padding: 0 3%;
	}

	.cut .van-hairline--bottom::after {
		border-bottom-width: 0;
	}
</style>
