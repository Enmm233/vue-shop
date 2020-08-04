<template>
  <div>
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>


    <van-tabbar
      v-model="active"
      @change="change"
      active-color="#009A44"
      inactive-color="#999"
      route v-show="$route.meta.navShow">
<!--      <div   v-if="weburl" class="flex rest_time">-->
<!--        <div>休息</div>-->
<!--        <div>-->
<!--          <p>店铺休息中，暂停接单</p>-->
<!--          <p>营业时间：{{open_time}}-{{end_time}}</p>-->
<!--        </div>-->
<!--      </div>-->

      <div class="flex footer_height">
        <van-tabbar-item replace to="/">
          首页
          <img
            slot="icon"
            slot-scope="props"
            :src="props.active ? index.active : index.inactive"
          >
        </van-tabbar-item>
        <van-tabbar-item replace to="/classify">
          分类
          <img
            slot="icon"
            slot-scope="props"
            :src="props.active ? category.active:category.inactive"
          >
        </van-tabbar-item>
        <van-tabbar-item replace to="/shopcart">

          购物车
          <img
            slot="icon"
            slot-scope="props"
            :src="props.active ? shopcart.active :shopcart.inactive"
          >
        </van-tabbar-item>

        <van-tabbar-item replace to="/order">
          订单
          <img
            slot="icon"
            slot-scope="props"
            :src="props.active? order.active : order.inactive"
          >
        </van-tabbar-item>

                <van-tabbar-item replace to="/user" icon="setting-o">
                  我的
                  <img
                    slot="icon"
                    slot-scope="props"
                    :src="props.active? user.active : user.inactive"
                  >
                </van-tabbar-item>
      </div>

    </van-tabbar>
  </div>

</template>
<script>
    export default {
        computed: {

            weburl() {
                let url=this.$route.name;
                let time=new Date();
                 let open_hours=this.open_time.substring(0,2);
                 let open_min=this.open_time.substring(3,5);
                 let open_second=this.open_time.substring(6,9);
                  let end_hours=this.end_time.substring(0,2);
                 let end_min=this.end_time.substring(3,5);
                 let end_second=this.end_time.substring(6,9);

                let open_millisecond= new Date(time.getFullYear(),time.getMonth(),time.getDay(),open_hours,open_min,open_second).getTime();
                let end_millisecond= new Date(time.getFullYear(),time.getMonth(),time.getDay(),end_hours,end_min,end_second).getTime();
                // console.log(open_millisecond)
                // console.log(end_millisecond)
                // console.log(time.getTime());
                if((url=='index'||url=='classify'||url=='shopcart')&&(time.getTime()>end_millisecond&&time.getTime()<open_millisecond)){
                    return true;
                }

            }
        },
        data() {
            return {
              open_time:localStorage.getItem('open_time'),
              end_time:localStorage.getItem('end_time'),
                active: 0,
                index: {
                    active: './../../../new/img/index_green.png',
                    inactive: './../../../new/img/index_gray.png',
                },
                category: {
                    active: './../../../new/img/classify_green.png',
                    inactive: './../../../new/img/classify_gray.png',
                },
                shopcart:{
                   active: './../../../new/img/shopcart_green.png',
                   inactive: './../../../new/img/shopcart_gray.png',
               },
                order: {
                    active: './../../../new/img/order_green.png',
                    inactive: './../../../new/img/order_gray.png',
                },
                user: {
                    active: './../../../new/img/user_green.png',
                    inactive: './../../../new/img/user_gray.png',
                },

            }
        },
        methods: {
            change(active) {
                this.active = active;
              document.body.scrollTop=0;
              document.documentElement.scrollTop = 0;
            }
        },
        created() {

        }
    };
</script>
<style scoped="scoped">
  .rest_time > div:last-child {
    color: #52B562;
  }

  .rest_time > div:first-child {
    color: #009842;
    background: #009A44;
    margin-right: 10px;
    padding: 0.3rem 0.8rem;
    border-radius: 2px;
    color: white;
  }

  .rest_time {
    align-items: center;
    font-size: 0.6rem;
    background: #ADDB8C;
    padding: 5px 10px;
  }

  .footer_height {
    height: 60px;
  }
  .footer_height .van-tabbar-item__icon img {
    display: block;
    height: 1rem;
    width: 1rem;
  }
</style>
