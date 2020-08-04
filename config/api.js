import axios from 'axios'
import APIUrl from "./apiurl";
import QS from 'qs';
import * as types from '../config/type'
import router from "./../src/router/index.js";
import store from '../config/store'
//请求响应
axios.interceptors.request.use(
  config => {
     let token=localStorage.getItem('token');

    if (token) {
      config.headers.Authorization =token;
    }
    return config
  },
  err => {
    return Promise.reject(err)
	})

// http response 拦截器  返回
axios.interceptors.response.use(
  response => {
    if(typeof(response.headers.authorization) != "undefined")
    {
      localStorage.setItem('token',response.headers.authorization)
    }

if(response.data.code==401){
  router.replace({
    path: '/login',
    query: { redirect: router.currentRoute.path },
  })
}
    return response
  },
  error => {

    return Promise.reject(error.response.data)
  })

export function get(url, params) {
	return new Promise((resolve, reject) => {
		axios.get(APIUrl.root + url, {
			params: Object.assign({
				active: APIUrl.active
			}, params)
		}).then(res => {
//			if(res.data.code == 401) {
//				this.$toast(res.data.msg);
//				this.$router.push({
//					name: 'login'
//				})
//			} else {
				resolve(res.data);
//			}

		}).catch(err => {
			reject(err.data)
		})
	});
}

export function post(url, params) {
	return new Promise((resolve, reject) => {
		axios.post(APIUrl.root+ url, Object.assign({
			active: APIUrl.active
		}, params)).then(res => {
//			if(res.data.code == 401) {
//				this.$toast(res.data.msg);
//				this.$router.push({
//					name: 'login'
//				})
//			} else {
				resolve(res.data);
//			}
		}).catch(err => {
			reject(err.data)
		})
	});
}
function getCurrentMonthLastDay(){
  var current=new Date();
  var currentMonth=current.getMonth();
  var nextMonth=++currentMonth;
  var nextMonthDayOne =new Date(current.getFullYear(),nextMonth,1);
  var minusDate=1000*60*60*24;
  return new Date(nextMonthDayOne.getTime()-minusDate);
}

export function objKeySort(obj) { //排序的函数
	var newkey = Object.keys(obj).sort();
	//先用Object内置类的keys方法获取要排序对象的属性名，再利用Array原型上的sort方法对获取的属性名进行排序，newkey是一个数组
	var newObj = {}; //创建一个新的对象，用于存放排好序的键值对
	var sz = '';
	for(var i = 0; i < newkey.length; i++) { //遍历newkey数组
		newObj[newkey[i]] = obj[newkey[i]]; //向新创建的对象中按照排好的顺序依次增加键值对
	}
	Object.keys(newObj).forEach(function(key) {
		sz += '&' + key + '=' + newObj[key]
	});
	return sz.substr(1); //返回排好序的新对象
}


export function thedefaulttime() { //购买记录默认时间
	var date = new Date();
  var lastDay = getCurrentMonthLastDay();

  var year = date .getFullYear().toString();
	var time = (date.getMonth()+1).toString();
	var month = '';
	if(time < 10){
		month = "0"+time;
	}else{
		month = time;
	}
  var day =  lastDay.getDate();
	var start = year +'-'+ month +'-01';
	var end = year +'-'+ month +'-'+ day;
	var dateArr = [start,end];
	return dateArr;
}
