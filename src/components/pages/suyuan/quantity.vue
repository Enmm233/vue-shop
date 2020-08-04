<template>
    <div :class="{quantity:show}" class="detection">

        <div v-if="show" class="table">
            <div class="menu">
                <p >{{observe.info.date}}</p>
                <p>{{observe.info.title}}</p>
            </div>
            <table width="92%" >
            <tr>
                <th colspan="5">{{observe.info.title}}</th>
            </tr>
            <tr >
                <td v-for="(item,index) in title">{{item.name}}</td>
            </tr>
            <tr v-for="(item,index) in observe.test">
                <td>{{index+1}}</td>
                <td>{{item.project_name}}</td>
                <td>{{item.sample_name}}</td>
                <td>{{item.test_value}}</td>
                <td>{{item.test_value}}</td>
            </tr>

        </table>
            <p>检测单位:菜东家蔬果农残检测中心</p>
            <div class="audit">
                <span>检测时间:{{observe.info.date}}</span>
                <span>主检:　{{observe.info.inspector}}</span>
                <span>审核:　{{observe.info.inspector}}</span>
            </div>

        </div>
        <div v-else class="img">
            <img src="images/suyuan/detection.png">
        </div>
        <address class="center">技术支持:黑蚂蚁科技<br>
            Coryright &copy;2016-2019

        </address>
    </div>
</template>
<script>
    import APIUrl from '../../../../config/apiurl'
    export default{
        data(){
            return {
                show:true,
                title:[
                    {name:'序号'},
                    {name:'检测项目'},
                    {name:'样品名称'},
                    {name:'抑制率(%)'},
                    {name:'检测结果'},
                    ],
                observe:{info: {title: "", date: "", inspector: ""}},
            }
        },
        created(){
            //溯源查询
            this.result();
        },
        methods:{
            result(){
                var id=localStorage.getItem('resultId');
                 // let id = this.$route.query.id;
                let  obj={appid:APIUrl.appid,timeStamp:APIUrl.timeStamp }


                let sign=this.$md5(this.$sort(obj)+APIUrl.appsecret);
                let params=Object.assign({sign:sign},obj);

                this.$get(APIUrl.tbTesting,params)
                    .then((response) => {
                        let data =response.data;
                        if(response.code==401){
                            this.$toast({message:'请先登录'});
                            this.$router.push({path:'/login'})
                            return;
                        }
                        if(response.code==200)
                        {
                                if(data.test.length){
                                    this.observe=data;
                                }else{
                                    this.show=false;
                                }
                        }
                    });
            }
        }

    }
</script>
<style>
    .detection {position:fixed;height: 100%;width:100%;}
    .quantity {background:#C5E3D0;padding: 3% 0 8%;}
.quantity .table table{border:1px solid black;margin:0 auto;}
.quantity .table {width:93%;background:white;margin:0 auto;height:82%;box-shadow: 0px 1px 2px grey;
    border-radius: 5px;}
.quantity .table .menu{font-size: 8px;

    display: flex;
    padding: 5px 0;}
.quantity .table table tr{border:1px solid black;text-align: center;}
.quantity .table table tr:first-child{height:36px;}

.quantity .table table tr:nth-child(n+2){height:25px;font-size:12px;}
.quantity .table table tr:nth-child(n+2) td{width:20%;}
.quantity .table table tr td{border:1px solid black;}
.quantity .table .audit{    display: flex;
    padding: 0% 4% ;
    font-size: 12px;
position:fixed;
    bottom:24%;width: 93%;
    justify-content: space-between;}
.quantity .table>p{padding: 2% 0 0% 4%;font-size:14px;}
.quantity .table .menu p{font-size:8px;width:50%;}
    /*.quantity address{font-size:14px;margin:0 auto;width:100%;text-align: center;}*/
    .detection .img{display: flex;
        height: 86%;
        align-items: center;
        justify-content: center;}
    .detection .img img{width:30%;}
   .detection address{position:fixed;font-size:10px;margin:0 auto;width:100%;text-align: center;
   bottom:10%;
   }
    body{height: 100%!important;}
</style>