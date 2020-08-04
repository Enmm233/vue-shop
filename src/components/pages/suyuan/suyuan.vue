<template>
    <div class="suyuan_index" id="suyuan">
        <img :src="index.img" onerror="javascript:this.src='images/suyuan/defaultimg.png';">
        <div class="musicinfo" id="musicinfo" style="display:block;">
  </div>

        <p class='red'>恭喜,你查询的是{{message}}销售的正品!!!</p>

        <div class="info white">

            <table>
                <tr>
                    <th colspan="6">商品信息</th>
                </tr>
                <tr style="height:10px;"></tr>
                <tr>
                    <td>商品名称</td>
                    <td>{{index.title}}</td>
                </tr>
                <tr>
                    <td>商品规格</td>
                    <td>{{index.attr_title}}</td>
                </tr>
                <tr>
                    <td>商品单位</td>
                    <td>{{index.unit}}</td>
                </tr>
                <tr>
                    <td>商品售价</td>
                    <td>{{index.price}}元</td>
                </tr>
                <tr>
                    <td>商品数量</td>
                    <td>{{index.weight}}{{index.unit}}</td>
                </tr>
                <tr style="height:6px;"></tr>
                <tr>
                    <td>商品描述</td>
                    <td>
                        <div>
                            {{index.describe}}
                        </div>
                    </td>
                </tr>
            </table>
        </div>
        <address class="center">技术支持:黑蚂蚁科技<br>
            Coryright &copy;2016-2019

        </address>
        <div style="height:1rem;"></div>
    </div>
</template>

<script>
   import APIUrl from '../../../../config/apiurl'

    export default {
        data() {
            return {
                details: false,
                index: [],
                message: '',
            }
        },
        created() {
            //溯源查询
            this.result();
        },
        mounted() {
            // autoPlayMusic();
        },
        methods: {

            result() {
                  var id = localStorage.getItem('resultId');
                   // let id = this.$route.query.id;
                let obj = {appid: APIUrl.appid, old: id, timeStamp: APIUrl.timeStamp}


                let sign = this.$md5(this.$sort(obj) + APIUrl.appsecret);
                let params = Object.assign({sign: sign}, obj);

                this.$get(APIUrl.result, params)
                    .then((response) => {
                        let data = response.data;
                        if (response.code == 401) {
                            this.$toast({message: '请先登录'});
                            this.$router.push({path: '/login'})
                            return;
                        }
                        if (response.code == 200) {
                            this.message = data.company_name;

                            let shop=document.getElementById('musicinfo');
                           shop.innerHTML=  `<audio id="musicid" src="http://api.ew80yun.com/tts.php?txt=恭喜,你查询的是${this.message}销售的正品!!!" preload="preload" autoplay="autoplay"></audio>`;

                            this.index = data.item;
                            this.describle = data.item.describe;
                            localStorage.setItem('shopId', response.data.item.id)
                        }
                    });
            }
        }

    }
</script>
<style>
    * {
        padding: 0;
        margin: 0;
    }

    .suyuan_index {
        /*position: fixed;*/
        height: 100%;
        background: #C5E3D0;
    }

    .suyuan_index img {
        width: 100%;

        border-bottom: 5px solid #EF9428;
    }

    .red {
        color: red;
    }

    .white {
        background: white;
    }

    .suyuan_index .info {
        width: 93%;
        /*height:40%;*/
        margin: 0 auto;
        padding: 0% 4%;
    }

    .suyuan_index .info tr:nth-child(n+2) {
        font-size: 12px;
    }

    .suyuan_index .info table tr td:first-child {
        width: 33%;
        color: #6BB885;
        margin-left: 1%;
    }

    .suyuan_index .info table tr th {
        color: #6BB885
    }

    .suyuan_index p {
        text-align: center;
        margin: 2% 0 3% 0;
        font-weight: 500;
    }

    .suyuan_index .info tr {
        /*vertical-align: sub;*/
        height: 32px;
    }

    .suyuan_index .info tr:last-child {
        vertical-align: sub;

    }

    .suyuan_index .info tr td:first-child {
        font-weight: 550;
        font-size: 14px;
    }

    .suyuan_index .info tr:last-child td {
        font-size: 13px;
        padding: 0 0 2% 0;
    }

    .suyuan_index .info tr td:last-child div {
        height: 54px;
        overflow: hidden;

    }

    .suyuan_index .info tr th {
        border-bottom: 1px solid #ddd;
    }

    .center {
        text-align: center;
    }

    .suyuan_index address {
        font-size: 10px;
        /*position: fixed;*/
        bottom: 10%;
        margin-top: 11%;
        text-align: center;
        width: 100%;
    }

    .suyuan_index table {
        width: 100%;
    }

    @media (max-height: 568px) {
        .suyuan_index .info tr td:last-child div {
            height: 16px;
            overflow: hidden;

        }
    }
</style>