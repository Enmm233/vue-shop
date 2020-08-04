import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/pages/index/index'
import goodsitem from '@/components/pages/index/goodsitem'
import classify from '@/components/pages/classify/index'
import order from '@/components/pages/order/index'
import shopcart from '@/components/pages/shopcart/index'
import user from '@/components/pages/user/index'

//路由
const page = (folder, file) => () =>
  import('@/components/pages/' + folder + '/' + file)

Vue.use(Router)

const routes = [{
    path: '/',
    name: 'index',
    component: index,
    meta: {
      navShow: true,
      keepAlive: true,
    }
  },
  {
    path: '/goodsitem',
    name: 'goodsitem',
    component: goodsitem
  },
  {
    path: '/classify',
    name: 'classify',
    component: classify,
    meta: {
      navShow: true,
      keepAlive: true,
    }
  },
  {
    path: '/order',
    name: 'order',
    component: order,
    meta: {
      navShow: true,
      keepAlive: true,
    }
  },
  {
    path: '/shopcart',
    name: 'shopcart',
    component: shopcart,
    meta: {
      navShow: true,
    }
  },
  {
    path: '/shoplist',
    name: 'shoplist',
    component: page('shopcart', 'shoplist')
  },
  {
    path: '/user',
    name: 'user',
    component: user,
    meta: {
      navShow: true,
    }
  },
  // 忘记密码
  {
    path: '/forget',
    name: 'forget',
    component: page('account', 'forget')
  },
  //协议
  {
    path: '/treaty',
    name: 'treaty',
    component: page('account', 'treaty')
  },
  //登录
  {
    path: '/login',
    name: 'login',
    component: page('account', 'login')
  },
  {
    path: '/selectway',
    name: 'selectway',
    component: page('account', 'selectway')
  },
  {
    path: '/register',
    name: 'register',
    component: page('account', 'register')
  }, {
    path: '/bindlogin',
    name: 'bindlogin',
    component: page('account', 'bindlogin')
  },

  {
    path: '/modifypwd',
    name: 'modifypwd',
    component: page('account', 'modifypwd')
  }, {
    path: '/myinfo',
    name: 'myinfo',
    component: page('user', 'myinfo')
  }, {
    path: '/cut',
    name: 'cut',
    component: page('user', 'cut')
  }, {
    path: '/mypwd',
    name: 'mypwd',
    component: page('user', 'mypwd')
  }, {
    path: '/delivery',
    name: 'delivery',
    component: page('user', 'delivery')
  },
  {
    path: '/address',
    name: 'address',
    component: page('user', 'address')
  }, {
    path: '/bill',
    name: 'bill',
    component: page('user', 'bill'),
    meta: {
      // keepAlive: true,
    }
  }, {
    path: '/billdetail',
    name: 'billdetail',
    component: page('user', 'billdetail')
  },
  {
    path: '/cash',
    name: 'cash',
    component: page('user', 'cash'),
    meta: {
      keepAlive: true,
    }
  },
  {
    path: '/cashdetail',
    name: 'cashdetail',
    component: page('user', 'cashdetail')
  },
  //账户余额
  {
    path: '/invest',
    name: 'invest',
    component: page('user', 'invest')
  },
  //充值记录
  {
    path: '/investrecord',
    name: 'investrecord',
    component: page('user', 'investrecord')
  }, {
    path: '/investinfo',
    name: 'investinfo',
    component: page('user', 'investinfo')
  }, {
    path: '/accountmange',
    name: 'accountmange',
    component: page('user', 'accountmange')
  },
  {
    path: '/accountedit',
    name: 'accountedit',
    component: page('user', 'accountedit')
  }, {
    path: '/accountadd',
    name: 'accountadd',
    component: page('user', 'accountadd')
  }, {
    path: '/bindmobile',
    name: 'bindmobile',
    component: page('user', 'bindmobile')
  }, {
    path: '/purchase_record',
    name: 'purchase_record',
    meta: {
      keepAlive: true
    },
    component: page('user', 'purchase_record')
  }, {
    path: '/purchase_detail',
    name: 'purchase_detail',
    component: page('user', 'purchase_detail')
  },
  //发票
  {
    path: '/receipt',
    name: 'receipt',
    component: page('user', 'receipt')
  }, {
    path: '/orderdetail',
    name: 'orderdetail',
    component: page('order', 'orderdetail')
  },
  {
    path: '/limitactive',
    name: 'limitactive',
    component: page('index', 'limitactive')
  },
  {
    path: '/shopdetail',
    name: 'shopdetail',
    component: page('index', 'shopdetail')
  }, {
    path: '/search',
    name: 'search',
    component: page('index', 'search'),
    meta: {
      keepAlive: true,
    }
  }, {
    path: '/newback',
    name: 'newback',
    component: page('index', 'newback')
  },
  {
    path: '/recommandshop',
    name: 'recommandshop',
    component: page('classify', 'recommandshop'),
    meta: {
      keepAlive: true,
    }
  }, {
    path: '/collectlist',
    name: 'collectlist',
    component: page('classify', 'collectlist'),
    meta: {
      keepAlive: true,
    }
  },
  {
    path: '/wechatlogin',
    name: 'wechatlogin',
    component: page('account', 'wechatlogin')
  }, {
    path: '/filedate',
    name: 'filedate',
    component: page('account', 'filedate')
  }, {
    path: '/payment',
    name: 'payment',
    component: page('order', 'payment')
  }, {
    path: '/prepay',
    name: 'prepay',
    component: page('order', 'prepay')
  }, {
    path: '/logistics',
    name: 'logistics',
    component: page('order', 'logistics')
  },
  {
    path: '/fenjian',
    name: 'fenjian',
    component: page('order', 'fenjian')
  },
  //溯源
  {
    path: '/suyuan',
    component: page('suyuan', 'comman'),
    children: [{
        path: '/',
        name: 'suyuanindex',
        component: page('suyuan', 'suyuan')
      },
      {
        path: '/suyuan/product',
        name: 'product',
        component: page('suyuan', 'product')
      },
      {
        path: '/suyuan/journey',
        name: 'journey',
        component: page('suyuan', 'journey')
      },
      {
        path: '/suyuan/quantity',
        name: 'quantity',
        component: page('suyuan', 'quantity')
      },

    ]
  }
]

const router = new Router({
  // 去掉#号 history hash
  mode: 'hash',
  routes
});
router.onError((error) => {
  const pattern = /Loading chunk (\d)+ failed/g;
  const isChunkLoadFailed = error.message.match(pattern);
  if (isChunkLoadFailed) {
    console.log(isChunkLoadFailed)
    // window.location.reload();
    // router.replace(router.history.pending.fullPath);
  } else {
    console.log(error)
  }
});

// router.beforeEach((to, from, next) => {
//   //前进刷新.返回上一页不刷新
//   const toDepth = to.path.split('/').length
//   const fromDepth = from.path.split('/').length
//   if (toDepth < fromDepth) {
//
//     from.meta.keepAlive = false
//     to.meta.keepAlive = true
//   }
//   next()
//
//
//   if (to.matched.some(r => r.meta.requireAuth)) {
//     let token =localStorage.getItem('token')
//     if (token) {
//       next();
//     } else {
//       next({
//         path: '/',
//         query: {redirect: to.fullPath}
//       })
//     }
//   } else {
//     next();
//   }
// });
export default router;
