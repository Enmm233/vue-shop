import Vue from 'vue'
import Vuex from 'vuex'
import * as types from './type'
Vue.use(Vuex)

export default new Vuex.Store({
  state:{
    id:'',
    cache:{
      ind:'',
      num:0,
      pd:false
    },
    token:null,
  },
  mutations:{
    getClassId(state,data){
      state.id=data;
    },
    SET_Cache(state,data) {
      state.cache = data;
    },
    [types.LOGIN]: (state, data) => {
      localStorage.token = data;
      state.token = data;
    },
    [types.LOGOUT]: (state) => {
      localStorage.removeItem('token');
      state.token = null
    },
  }
})
