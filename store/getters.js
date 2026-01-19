// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016-2026 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------
export default {
  token: state => state.app.token,
  isLogin: state => !!state.app.token,
  backgroundColor: state => state.app.backgroundColor,
  globalData: state => state.app.globalData,
  userInfo: state => state.app.userInfo || {},
  uid:state => state.app.uid,
  homeActive: state => state.app.homeActive,
  home: state => state.app.home,
  copyPwd: state => state.app.copyPwd,
	cartNum: state => state.app.cartNum,
	orderPayList: state => state.app.orderPayList,
  viewColor: state => state.app.viewColor,
  keyColor: state => state.app.keyColor,
	diyProduct: state => state.app.diyProduct,
	reservationInfo: state => state.app.reservationInfo,
  location: state => state.location.location
};
