<template>
  <div>
    <div style="height:52px;"></div>
    <ul class="suyuan_nav">
      <li v-for="(item,index) in nav" @click="color(item)">
        <img v-if="active==item.link" :src="'new/img/'+item.activeimg">
        <img v-else :src="'new/img/'+item.img">
        <span :class="{green:active==item.link}"> {{item.title}}</span>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  data() {
    return {
      active: false,
      nav: [
        { title: '查询结果', link: "/suyuan", activeimg: 'resultgreen.png', img: 'resultgray.png' },
        { title: '产品介绍', link: '/suyuan/product', activeimg: 'productgreen.png', img: 'productgray.png' },
        { title: '全程追溯', link: '/suyuan/journey', activeimg: 'journeygreen.png', img: 'journeygray.png' },
        { title: '质检报告', link: '/suyuan/quantity', activeimg: 'quantitygreen.png', img: 'quantitygray.png' },
      ]
    }
  },
  computed: {
    webname() {
      return this.$route.path;
    }
  },
  methods: {
    color(data) {
      let id = this.$route.query.id;
    
      this.$router.push({ path: data.link})
      this.active = data.link;
    }
  },
  created() {
    this.active = this.webname
  }
}

</script>
<style>
.suyuan_nav {
  display: flex;
  justify-content: space-around;
  position: fixed;
  background: #F5F5F5;
  width: 100%;
  bottom: 0;
  font-size: 12px;
}

.suyuan_nav img {
  display: block;
  width: 40%;
  margin: 0px 25% 2% 25%;
}

.suyuan_nav li {
  padding: 2% 0;
  text-align: center;
}

.suyuan_nav li .green {
  color: #009A44;
}

.suyuan_nav li span {
  color: #9C9C9C;
}

</style>
