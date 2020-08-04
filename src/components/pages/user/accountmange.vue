<template>
  <div class="comman2 accountmange">
    <van-nav-bar title="账号管理" right-text="添加" left-arrow @click-left="onClickLeft" @click-right="onClickRight"/>
    <div class="billrecord white" v-if="visible">
      <ul>
        <li v-for="item in list" @click="billDetailUrl(item.zid)">
          <div class="accountmange_list_left">
            <div>账号名称：{{item.nickname}}</div>
            <div class="address">收货地址：{{item.address}}</div>
          </div>
          <div class="accountmange_list_right">
            <img src="new/img/editinfo.png">
            <!--						<i class="iconfont gray">&#xe655;</i>-->
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  import APIUrl from './../../../../config/apiurl'

  export default {
    data() {
      return {
        show: false,
        visible: true,
        date: '',
        list: '',
      }
    },

    methods: {
      billDetailUrl(data) {
        this.$router.push({
          name: 'accountedit',
          query: {select_zid: data}
        })
      },
      onClickLeft() {
        this.$router.push({
          name: 'user'
        })
      },
      onClickRight() {
        this.$router.push({
          name: 'accountadd'
        })
      },
      childInfo() {
        let obj = {
          appid: APIUrl.appid,
          timeStamp: APIUrl.timeStamp
        };
        let sign = this.$md5(this.$sort(obj) + APIUrl.appsecret);
        let params = Object.assign({
          sign: sign
        }, obj)
        this.$get(APIUrl.childInfo, params).then(res => {
          if (res.code == 200) {
            this.list = res.data;
          }
        })
      },

    },
    created() {
      this.childInfo()
    },

  }
</script>
<style>
  .accountmange .billrecord {
    margin-top: 5px;
    width: 100%;

    font-size: 0.7rem;
  }

  /*.accountmange li>div{*/
  .accountmange li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    /*margin-bottom: 0.5rem;*/
    /*padding: 0.25rem 0;*/
    padding: 10px 10px;
    border-bottom: 2px solid #f7f7f7;
  }

  .accountmange li .accountmange_list_right img{width: 60%;}
  .accountmange li .accountmange_list_left {
    width:81%;
    height: 2.3rem;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    /*line-height: 2rem;*/
  }

  .accountmange li .address {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .accountmange .van-nav-bar__text {
    color: #009A44;
  }
</style>

