<<<<<<< HEAD
// 配置API接口地址
const timeStamp=Math.round(new Date().getTime()/1000);
export default {
   // root:                 process.env.API,               // 代理
    root               : window.location.protocol+"//"+window.location.hostname+'/',// 上线；
    active                :2,
    appid                 : 1,                                  // appid
    appsecret             : 'StJfzJcXmya6k6Ar',                 // 密码
    timeStamp             : timeStamp,                          // 时间戳
    roleType              : 'mobileOrder/roleType',             // 登录角色
    cart                  : 'mobileOrder/cart',                 // 登录角色
    login                 : 'mobileOrder/login',                // 登录
    openCart              : 'mobileOrder/openCart',    		      //购物车
    captcha               :'mobileOrder/captcha',               //图形验证码
    sendCode              :'mobileOrder/sendCode',              //短信验证码
    forgetPassword        :'mobileOrder/forgetPassword',        //修改密码
    cateList              :'mobileOrder/cateList',              //分类列表
    itemListByCate        :'mobileOrder/itemListByCate',        //分类商品
    modifyPassword        :'mobileOrder/modifyPassword',        //修改密码
    uploadAvatar          :'mobileOrder/uploadAvatar',          //上传头像
    uploadImg             :'mobileOrder/uploadImg',             //上传图片  x
    moneyList             :'mobileOrder/moneyList',             //账单列表 
    moneyListPaginate     :'mobileOrder/moneyListPaginate',     //账单详情
    orderList             :'mobileOrder/orderList',             //订单列表
    orderInfo             :'mobileOrder/orderInfo',             //订单详情
    childInfo             :'mobileOrder/childInfo',             //子账户信息列表
    editChild             :'mobileOrder/editChild',             //编辑子账户
    getSearchItem         :'mobileOrder/getSearchItem',         //搜索商品
    firstChangeNum        :'mobileOrder/firstChangeNum',        //单个商品自增添加购物车
    changeNum             :'mobileOrder/changeNum',             //更新购物车数量
    getCountNum           :'mobileOrder/getCountNum',           //购物车总价和数量
    deleteCart            :'mobileOrder/deleteCart',            //删除单个购物车
    deleteByUserIds       :'mobileOrder/deleteByUserIds',       //删除多个购物车
    pcAddOrder            :'mobileOrder/pcAddOrder',            //Pc端直接下单
    addOrder              :'mobileOrder/addOrder',              //移动端直接下单
    mergeOrder            :'mobileOrder/mergeOrder',            //移动端合拼下单
    cancelOrder           :'mobileOrder/cancelOrder',           //取消订单
    receiveOrder          :'mobileOrder/receiveOrder',          //确认收货
    oneMoreTime           :'mobileOrder/oneMoreTime',           //再来一单
    testOrder             :'mobileOrder/testOrder',             //检查订单能否直接下单
    pcMergeOrder          :'mobileOrder/pcMergeOrder',          //PC合并订单
    wxConfig     		      :'mobileOrder/wxConfig',          		//微信配置
    wxLogin     		      :'mobileOrder/wxLogin',     	      	//微信登录
    memberInfo        	  :'mobileOrder/memberInfo',          	//用户信息
    saveMemberInfo        :'mobileOrder/saveMemberInfo',        //保存用户信息
    carPosition           :'mobileOrder/carPosition',           //查看物流
    moneyListInfo         :'mobileOrder/moneyListInfo',         //账单详情
    moneyListExport       :'mobileOrder/moneyListExport',       //账单记录导出
    orderExport           :'mobileOrder/orderExport',           //订单记录导出
    indexAd               : 'mobileOrder/indexAd',              //首页公告接口
    indexItem             :'mobileOrder/indexItem',             //首页商品
    censusNum             :'mobileOrder/censusNum',             //订单账单统计
    addInfo               :'mobileOrder/addInfo',               //合拼收货人信息和子账号
    itemRemark            :'mobileOrder/itemRemark',            //购物车备注
    memberAddressInfo     :'mobileOrder/memberAddressInfo',     //用户地址信息
    rechargeList     	  :'mobileOrder/rechargeList',            //充值记录
    getIndexSelect        :'mobileOrder/getIndexSelect',        //收藏列表
    itemRecommend         :'mobileOrder/itemRecommend',         //商品详情页面推荐列表
    panicBuyIndex         :'mobileOrder/panicBuyIndex',         //限时抢购
    getItemById           :'mobileOrder/getItemById',           //商品详情
    itemCommon            :'mobileOrder/itemCommon',            //常用推荐
    changeCollect         :'mobileOrder/changeCollect',         //收藏
    panicBuyList          :'mobileOrder/panicBuyList',           //活动页面限时抢购列表
    getSearchData         :'mobileOrder/getSearchData',         //热门搜索
    updateAddress         :'mobileOrder/updateAddress',         //修改地址
    addChild              :'mobileOrder/addChild',              //添加子账户
    delChild              :'mobileOrder/delChild',              //删除子账户
    billInfo              :'mobileOrder/billInfo',              //我的发票
    handleBill            :'mobileOrder/handleBill',            //更新发票
    voiceSearch           :'mobileOrder/voiceSearch',           //语音搜索
    feedBack              :'mobileOrder/feedBack',              //新品反馈
    createRecharge        :'mobileOrder/createRecharge',        //创建充值订单
    deleteCollect         :'mobileOrder/deleteCollect',         //清空收藏
    bindMobile            :'mobileOrder/bindMobile',            //绑定手机号
    placeRecharge         :'mobileOrder/placeRecharge',         //充值预览
    payOrder         	   :'mobileOrder/payOrder',         	    //支付订单
    balancePay         	  :'mobileOrder/balancePay',          	//余额支付
    temOrderMsg           :'mobileOrder/temOrderMsg',         	//前支付
    payTemOrder           :'mobileOrder/payTemOrder',         	//前支付支付
    addressInfo           :'mobileOrder/addressInfo',         	//注册收货地址
    mpItemList            :'mobileOrder/mpItemList',            //分类商品
    register              :'mobileOrder/register',              //注册
    wxLoginFollow         :'mobileOrder/wxLoginFollow',         //注册
    sendCodeNot           :'mobileOrder/sendCodeNot',           //忘记密码的短信验证码
    bindWeChat            :'mobileOrder/bindWeChat',            //绑定微信
    sortingDetail         :'mobileOrder/sortingDetail',         //分拣详情
    couponsList           :'mobileOrder/couponsList',           //现金券
    couponsDetails        :'mobileOrder/couponsDetails',        //现金券详情
    useCouponsPrice       :'mobileOrder/useCouponsPrice',       //现金券选择
    random                :'mobileOrder/random',                //注册滑动随机数
    result                :'mobileOrder/result',                //溯源查询结果
    tbInfo                : 'mobileOrder/tbInfo',               //溯源产品介绍
    traceBack             :'mobileOrder/traceBack',             //全程追溯
    tbTesting             :'mobileOrder/tbTesting',             //检测报告
    buyRecord       	    :'mobileOrder/buyRecord',       		  //下单端报表
    buyRecordDetail       :'mobileOrder/buyRecordDetail',       //下单端报表详情
  	baseURL               : '',

};
=======
// 配置API接口地址
const timeStamp=Math.round(new Date().getTime()/1000);
export default {
   // root:                 process.env.API,               // 代理
    root               : window.location.protocol+"//"+window.location.hostname+'/',// 上线；
    active                :2,
    appid                 : 1,                                  // appid
    appsecret             : 'StJfzJcXmya6k6Ar',                 // 密码
    timeStamp             : timeStamp,                          // 时间戳
    roleType              : 'mobileOrder/roleType',             // 登录角色
    cart                  : 'mobileOrder/cart',                 // 登录角色
    login                 : 'mobileOrder/login',                // 登录
    openCart              : 'mobileOrder/openCart',    		    //购物车
    captcha               :'mobileOrder/captcha',               //图形验证码
    sendCode              :'mobileOrder/sendCode',              //短信验证码
    forgetPassword        :'mobileOrder/forgetPassword',        //修改密码
    cateList              :'mobileOrder/cateList',              //分类列表
    itemListByCate        :'mobileOrder/itemListByCate',        //分类商品
    modifyPassword        :'mobileOrder/modifyPassword',        //修改密码
    uploadAvatar          :'mobileOrder/uploadAvatar',        //上传头像
    uploadImg             :'mobileOrder/uploadImg',             //上传图片  x
    moneyList             :'mobileOrder/moneyList',             //账单列表
    moneyListPaginate     :'mobileOrder/moneyListPaginate',   //账单详情
    orderList             :'mobileOrder/orderList',             //订单列表
    orderInfo             :'mobileOrder/orderInfo',             //订单详情
    childInfo             :'mobileOrder/childInfo',             //子账户信息列表
    editChild             :'mobileOrder/editChild',             //编辑子账户
    getSearchItem         :'mobileOrder/getSearchItem',         //搜索商品
    firstChangeNum        :'mobileOrder/firstChangeNum',        //单个商品自增添加购物车
    changeNum             :'mobileOrder/changeNum',             //更新购物车数量
    getCountNum           :'mobileOrder/getCountNum',           //购物车总价和数量
    deleteCart            :'mobileOrder/deleteCart',            //删除单个购物车
    deleteByUserIds       :'mobileOrder/deleteByUserIds',       //删除多个购物车
    pcAddOrder            :'mobileOrder/pcAddOrder',            //Pc端直接下单
    addOrder              :'mobileOrder/addOrder',              //移动端直接下单
    mergeOrder            :'mobileOrder/mergeOrder',            //移动端合拼下单
    cancelOrder           :'mobileOrder/cancelOrder',           //取消订单
    receiveOrder          :'mobileOrder/receiveOrder',          //确认收货
    oneMoreTime           :'mobileOrder/oneMoreTime',           //再来一单
    testOrder             :'mobileOrder/testOrder',             //检查订单能否直接下单
    pcMergeOrder          :'mobileOrder/pcMergeOrder',          //PC合并订单
wxConfig     		      :'mobileOrder/wxConfig',          		//微信配置
wxLogin     		      :'mobileOrder/wxLogin',     	      	//微信登录
    memberInfo        	  :'mobileOrder/memberInfo',          	//用户信息
    saveMemberInfo        :'mobileOrder/saveMemberInfo',        //保存用户信息
    carPosition           :'mobileOrder/carPosition',           //查看物流
    moneyListInfo         :'mobileOrder/moneyListInfo',         //账单详情
    moneyListExport       :'mobileOrder/moneyListExport',       //账单记录导出
    orderExport           :'mobileOrder/orderExport',           //订单记录导出
    indexAd               : 'mobileOrder/indexAd',              //首页公告接口
    indexItem             :'mobileOrder/indexItem',            //首页商品
    censusNum             :'mobileOrder/censusNum',             //订单账单统计
    addInfo               :'mobileOrder/addInfo',               //合拼收货人信息和子账号
    itemRemark            :'mobileOrder/itemRemark',            //购物车备注
    memberAddressInfo     :'mobileOrder/memberAddressInfo',     //用户地址信息
    rechargeList     	  :'mobileOrder/rechargeList',          //充值记录
    getIndexSelect        :'mobileOrder/getIndexSelect',        //收藏列表
    itemRecommend         :'mobileOrder/itemRecommend',         //商品详情页面推荐列表
    panicBuyIndex         :'mobileOrder/panicBuyIndex',         //限时抢购
    getItemById           :'mobileOrder/getItemById',           //商品详情
    itemCommon            :'mobileOrder/itemCommon',            //常用推荐
    changeCollect         :'mobileOrder/changeCollect',         //收藏
    panicBuyList          :'mobileOrder/panicBuyList',           //活动页面限时抢购列表
    getSearchData         :'mobileOrder/getSearchData',         //热门搜索
    updateAddress         :'mobileOrder/updateAddress',         //修改地址
    addChild              :'mobileOrder/addChild',              //添加子账户
    delChild              :'mobileOrder/delChild',              //删除子账户
    billInfo              :'mobileOrder/billInfo',              //我的发票
    handleBill            :'mobileOrder/handleBill',            //更新发票
    voiceSearch           :'mobileOrder/voiceSearch',           //语音搜索
    feedBack              :'mobileOrder/feedBack',              //新品反馈
    createRecharge        :'mobileOrder/createRecharge',        //创建充值订单
    deleteCollect         :'mobileOrder/deleteCollect',         //清空收藏
    bindMobile            :'mobileOrder/bindMobile',            //绑定手机号
    placeRecharge         :'mobileOrder/placeRecharge',         //充值预览
    payOrder         	   :'mobileOrder/payOrder',         	    //支付订单
    balancePay         	  :'mobileOrder/balancePay',          	//余额支付
    temOrderMsg           :'mobileOrder/temOrderMsg',         	//前支付
    payTemOrder           :'mobileOrder/payTemOrder',         	//前支付支付
    addressInfo           :'mobileOrder/addressInfo',         	//注册收货地址
    mpItemList            :'mobileOrder/mpItemList',            //分类商品
    register              :'mobileOrder/register',              //注册
    wxLoginFollow         :'mobileOrder/wxLoginFollow',         //注册
    sendCodeNot           :'mobileOrder/sendCodeNot',           //忘记密码的短信验证码
    bindWeChat            :'mobileOrder/bindWeChat',            //绑定微信
    sortingDetail         :'mobileOrder/sortingDetail',         //分拣详情
    couponsList           :'mobileOrder/couponsList',           //现金券
    couponsDetails        :'mobileOrder/couponsDetails',        //现金券详情
    useCouponsPrice       :'mobileOrder/useCouponsPrice',       //现金券选择
    random                :'mobileOrder/random',                //注册滑动随机数
    result                :'mobileOrder/result',                //溯源查询结果
    tbInfo                : 'mobileOrder/tbInfo',               //溯源产品介绍
    traceBack             :'mobileOrder/traceBack',             //全程追溯
    tbTesting             :'mobileOrder/tbTesting',             //检测报告
    buyRecord       	    :'mobileOrder/buyRecord',       		//下单端报表
    buyRecordDetail       :'mobileOrder/buyRecordDetail',       //下单端报表详情
    shareConfig           :'mobileOrder/shareConfig',
  	baseURL               : '',

};
>>>>>>> 5f74ddfb39dc4f2648a2129aee30e79c1e973c97
