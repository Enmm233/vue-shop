// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.


import Vue from 'vue'
import App from './App'
import router from './router'
import Axios from 'axios'
import md5 from './../static/js/md5'
import '../static/js/jquery-1.9.1.min.js'
import '../static/js/rem'
import '../static/css/caidjapp.css'
import '../static/icon/iconfont.css'
import {get,post,objKeySort,thedefaulttime} from './../config/api'
import Vuex from 'vuex'
import store from './../config/store'

import { Overlay,Button, Col,Cell, Row, Tabbar, TabbarItem,Popup,Tab, Tabs,Picker,NoticeBar,CountDown,Tag,
  List,Stepper,Sticky,TreeSelect, DatetimePicker,Swipe, SwipeItem, Loading,Uploader,Divider,
  Icon, Dialog,NavBar,Toast,Image,Field,ActionSheet,AddressEdit,Area,Search,Switch,PullRefresh} from 'vant';
  import Calendar from 'vue-mobile-calendar'
import APIUrl from "../config/apiurl";
Vue.prototype.$md5 = md5;
Vue.prototype.$axios = Axios;
Vue.prototype.$get = get;
Vue.prototype.$post = post;
Vue.prototype.$sort = objKeySort;
Vue.prototype.$thedefaulttime = thedefaulttime;
Vue.use(Calendar)
Vue.use(Toast);
Vue.use(Divider);
Vue.use(Dialog)
Vue.use(Icon);
Vue.use( Loading);
Vue.use(Tabbar);
Vue.use(TabbarItem);
Vue.use(Button);
Vue.use(Col);
Vue.use(Row);
Vue.use(Overlay);
Vue.use(NavBar);
Vue.use(Toast);
Vue.use(Image);
Vue.use(Field);
Vue.use(Area);
Vue.use(Swipe);
Vue.use( SwipeItem);
Vue.use(ActionSheet);
Vue.use(AddressEdit);
Vue.use(Search);
Vue.use(Switch);
Vue.use(Cell);
Vue.use(Popup);
Vue.use(Tab);
Vue.use(Tabs);
Vue.use(Picker);
Vue.use(NoticeBar);
Vue.use(CountDown);
Vue.use(Tag);
Vue.use(List);
Vue.use(Stepper);
Vue.use(Sticky);
Vue.use(TreeSelect);
Vue.use(DatetimePicker);
Vue.use(PullRefresh);
Vue.use(Uploader);
Vue.use(Vuex)

Vue.config.productionTip = false

new Vue({
	el: '#app',
	router,
  store,
	components: {
		App
	},
	template: '<App/>'
})



