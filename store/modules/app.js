// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016-2026 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------
import { getUserInfo } from "@/api/user.js";
import { diyProductApi } from "@/api/store.js";
import { LOGIN_STATUS, UID } from '../../config/cache';
import Cache from '../../utils/cache';
import { USER_INFO } from '../../config/cache';
import { RoleManager } from '@/utils/role';

const state = {
	token: Cache.get(LOGIN_STATUS) || null,
	uuid: uni.getStorageSync('uuid') || "",
	backgroundColor: "#fff",
	userInfo: null,
	uid: Cache.get(UID) || null,
	globalData: uni.getStorageSync('GLOBAL_DATA') || {},
	homeActive: false,
	copyPwd: null,
	pageFooter:uni.getStorageSync('pageFoot') || {},
	keyColor: Cache.get('KEY_COLOR') || '_default',
	viewColor: Cache.get('VIEW_COLOR') || '--view-theme: #E93323;--view-assist:#FF7612;--view-priceColor:#E93323;--view-bgColor:rgba(255, 118, 18,.1);--view-minorColor:rgba(233, 51, 35,.1);--view-bntColor11:#FDA923;--view-bntColor12:#FD6523;--view-bntColor21:#F11B09;--view-bntColor22:#F67A38;',
	cartNum: null,
	orderPayList: [],
	// 商品详情可视化数据
	diyProduct: {
		navList: [0, 1, 2, 3, 4], // 顶部菜单内容
		openShare: 1, //是否开启分享
		pictureConfig: 0, //轮播图模式 0 固定方图 1 高度自适应
		swiperDot: 1, //是否展示轮播指示点
		showPrice: [0, 1], //是否显示付费会员价和等级会员
		isOpen: [0, 1, 2], //是否展示 0 原价 1 累计销量 2 库存
		shareConfig: [1,2],//分享收藏按钮
		showSvip: 1, //是否展示付费会员卡片
		showRank: 1, // 是否展示 排行榜卡片
		showService: [0, 1, 2, 3], //服务区卡片 0 营销活动入口 1 sku选择 2 服务保障 3 参数
		showReply: 1, //是否展示评论区
		replyNum: 3, //评论数量
		showMatch: 1, //是否展示搭配购
		matchNum: 3, //搭配套餐数量
		showStore: 1, //是否显示店铺
		showRecommend: 1, //是否展示推荐商品
		recommendNum: 12, //推荐商品数量
		menuList: [0, 1, 2], //底部左侧菜单
		showCart: 1, //是否显示购物车
		showCommunity: 0, //是否显示种草
		communityNum:3,
		swiperHeight: '750',
		shareList: [
			{label: 'ບໍລິການລູກຄ້າ', value: 0, icon: "icon-ic_customerservice"},
			{label: 'ຖືກໃຈ', value: 1, icon: "icon-ic_star"},
			{label: 'ແບ່ງປັນ', value: 2, icon: "icon-ic_transmit1"},
		],
		serviceList: [
			{name: 'ກະລຸນາເລືອກ', label: "ເລືອກຂະໜາດ", value: 0, info: "ສີຟ້າ, 2 ຊິ້ນ",props: "specSelect"},
			{name: 'ຄ່າຂົນສົ່ງ', label: "ລາຍລະອຽດຄ່າຂົນສົ່ງ", value: 1, info: "ຂົນສົ່ງຟຣີ",props: "freight"},
			{name: 'ການຮັບປະກັນ', label: "ການຮັບປະກັນບໍລິການ", value: 2, info: "ປອມໜຶ່ງຈ່າຍສີ່ ຄືນເງິນໄວ ປ່ຽນຄືນໄດ້ພາຍໃນ 7 ມື້",props: "serviceGuarantee"},
			{name: 'ພາຣາມິເຕີ', label: "ລາຍລະອຽດພາຣາມິເຕີ", value: 3, info: "ຍີ່ຫໍ້ ຮຸ່ນ...",props: "parameter"},
		],
		footerList: [
			{label: 'ຮ້ານຄ້າ', value: 0, icon: "icon-ic_mall"},
			{label: 'ບໍລິການລູກຄ້າ', value: 1, icon: "icon-ic_customerservice"},
			{label: 'ກະຕ່າສິນຄ້າ', value: 2, icon: "icon-ic_ShoppingCart"}, 
			{label: 'ຖືກໃຈ', value: 3, icon: "icon-ic_star"},
			{label: 'ແບ່ງປັນ', value: 4, icon: "icon-ic_transmit1"},
			{label: 'ໜ້າຫຼັກ', value: 5, icon: "icon-ic_home"}, 
		],
	},
	reservationInfo: {}
	
};
const mutations = {
	LOGIN(state, opt) {
		state.token = opt.token;
		Cache.set(LOGIN_STATUS, opt.token, opt.time);
		uni.removeStorageSync('auth_token');
	},
	SETUID(state,val){
		state.uid = val;
		Cache.set(UID, val);
	},
	SETUUID(state,val){
		state.uuid = val;
		uni.setStorageSync('uuid', val)
	},
	UPDATE_LOGIN(state, token) {
		state.token = token;
	},	
	LOGOUT(state) {
		state.token = null;
		state.uid = null
		Cache.clear(LOGIN_STATUS);
		Cache.clear(UID);
		RoleManager.clearRole();
	},
	BACKGROUND_COLOR(state, color) {
		state.color = color;
		document.body.style.backgroundColor = color;
	},
	UPDATE_USERINFO(state, userInfo) {
		userInfo.isNew && uni.setStorageSync('is_new_user', true)
		state.userInfo = userInfo;
	},
	OPEN_HOME(state) {
		state.homeActive = true;
	},
	CLOSE_HOME(state) {
		state.homeActive = false;
	},
	PARSE_PWD(state, pwd) {
		state.copyPwd = pwd;
	},
	VIEW_COLOR(state, color) {
		Cache.set('VIEW_COLOR', color)
		state.viewColor = color;
	},
	KEY_COLOR(state, key) {
		Cache.set('KEY_COLOR', key)
		state.keyColor = key;
	},
	GLOBAL_DATA(state, key) {
		uni.setStorageSync('GLOBAL_DATA', key);
		state.globalData = key;
	},
	FOOT_UPLOAD(state,data){
		state.pageFooter = data
	},
	UPDATE_CARTNUM(state,data){
		state.cartNum = data;
	},
	UPDATE_ORDERPAYLIST(state,data){
		state.orderPayList = data;
	},
	SET_PRODUCT_DIY(state, data){
		state.diyProduct = data.value;	
	},
	SET_RESERVATE_INFO(state, data){
		state.reservationInfo = data;	
	},
	
};

const actions = {
	USERINFO({
		state,
		commit
	}, force) {
		if (state.userInfo !== null && !force)
			return Promise.resolve(state.userInfo);
		else
			return new Promise(reslove => {
				getUserInfo().then(res => {
					commit("UPDATE_USERINFO", res.data);
					Cache.set(USER_INFO, res.data);
					reslove(res.data);
				});
			}).catch(() => {

			});
	},
	// diy商品详情
	async getDiyProduct({commit}) {
		let result = await diyProductApi();
		if(result.status == 200){
			commit("SET_PRODUCT_DIY",result.data);
		}else {
			commit("SET_PRODUCT_DIY",this.diyProduct);
		}
	},
};

export default {
	state,
	mutations,
	actions
};
