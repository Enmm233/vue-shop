<template>
  <div class="delivery comman2">
    <van-nav-bar title="完善资料" left-arrow @click-left="onClickLeft" />

    <div class="white all_table">
      <table class="width">
        <tr>
          <td>联系人</td>
          <td colspan="2">
            <input type="text" placeholder="联系人姓名">
          </td>
        </tr>
        <tr>
          <td>手机号</td>  <td colspan="2"> <input type="text" placeholder="联系人电话"></td></tr>
        <tr>
          <td>收货地址</td>
          <td>asdfdas </td>
          <td class="right">

            <van-icon name="arrow" @click="mapUrl" />
          </td></tr>
        <tr>
          <td>门牌号</td>  <td colspan="2"> <input type="text" placeholder="例如：8号室8号楼" @focus="focus"></td></tr>
      </table>

    </div>
    <div class="font_size center width see_hightly">
      <span v-for="(item,index) in select" @click="active=index"><i :class="{green_font:active==index}" class="iconfont" >&#xe7c2;</i><dfn :class="{black_font:active==index}">{{item.key}}</dfn></span>
    </div>
    <div class="center"><button class="button_style " :class="{line_gradient:statu}"> 保存</button></div>
  </div>
</template>

<script>
    import AreaList from '../../../../static/js/areaList';
    import APIurl from '../../../../static/js/areaList';
    export default{

        data(){
            return {
              imgurl:APIurl.root,
                statu:false,
                active:0,
                select:[
                    {key:'注重价格'},
                    {key:'注重质量'},
                    {key:'注重服务'},
                ],
            }
        },
        created(){

        },
        methods:{
            focus(){
                this.statu=true;
            },
            mapUrl(){
                this.$router.push({name:'map'})
            },
            onClickLeft() {
                this.$dialog.confirm({
                    title: '放弃编辑',
                    message: '个人信息未保存，确定离开吗？'
                }).then(() => {
                    // on confirm
                    this.$router.push({name:'user'})
                }).catch(() => {
                    // on cancel
                });
            },
        }

    }
</script>
<style>
  .black_font{color:black;}
  .delivery button{margin-top:4%;}
  .see_hightly .green_font{color:green!important;}
  .see_hightly span {margin-left:10px;color:#828282;}
  .see_hightly  {margin:2% 0 5%;}
  .see_hightly span i{margin-right:2px;font-size:10px;}
</style>
