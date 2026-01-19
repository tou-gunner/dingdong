<template>
	<diyDataProvider :diyId="diyId">
		<template #config="{ tabbarConfig }">
			<view :style="viewColor">
				<skeleton :show="showSkeleton" :isNodes="isNodes" ref="skeleton" loading="chiaroscuro" selector="skeleton"
					bgcolor="transparent"></skeleton>
				<!-- 自定义顶部背景颜色 -->
				<view class="top">
					<!-- #ifdef MP || APP-PLUS -->
					<view class="sys-head">
						<view class="sys-bar" :style="{height:sysHeight}"></view>
					<!-- #ifdef MP -->
					<view class="sys-title">
						ສູນກາງສ່ວນຕົວ
					</view>
					<!-- #endif -->
						<view class="bg"></view>
					</view>
					<!-- #endif -->
				</view>
				<!-- 自定义顶部背景颜色 -->
				<view class="new-users skeleton" :style="{visibility: showSkeleton ? 'hidden' : 'visible'}">
					<view class="head">
						<view class="user-card" :class="svip_switch_status == 1 ? 'svip-card' : ''">
							<view class="bg"></view>
							<view class="user-info">
								<view class="avatar-box" :class="{on:userInfo.is_svip > 0 && svip_switch_status == 1}">
									<image class="avatar skeleton-radius" :src="userInfo.avatar || `${domain}/static/images/f.png`" @click="goEdit"></image>
									<view class="headwear" v-if="userInfo.is_svip > 0 && svip_switch_status == 1">
										<image :src="`${domain}/static/images/headwear.png`"></image>
									</view>
								</view>
								<view class="info">
								<!--#ifdef MP-->
								<view class="name" v-if="!userInfo.uid" @click="openAuto">
									ກະລຸນາຄລິກເພື່ອອະນຸຍາດ
								</view>
								<!--#endif-->
								<!--#ifdef APP-PLUS-->
								<view class="name" v-if="!userInfo.uid" @click="openAuto">
									ກະລຸນາຄລິກເພື່ອເຂົ້າສູ່ລະບົບ
								</view>
								<!--#endif-->
								<!--#ifdef H5-->
								<view  class="name" v-if="!userInfo.uid" @click="openAuto">
									<text v-if="isWeixin">ກະລຸນາຄລິກເພື່ອອະນຸຍາດ</text>
									<text v-else>ກະລຸນາຄລິກເພື່ອເຂົ້າສູ່ລະບົບ</text>
								</view>
								<!--#endif-->
									<view class="name" v-if="userInfo.uid">
										{{userInfo.nickname}}
										<image v-if="member_status && userInfo.member_icon" class="level_icon" :src="userInfo.member_icon" alt="" />
										<view class="vip" v-if="userInfo.is_svip > 0 && svip_switch_status == 1">
											<image :src="`${domain}/static/images/svip.png`" />
										</view>
									</view>
									<RoleToggle v-if="merchantMenus.length" use-theme-color />
									<template v-else>
										<view class="num" v-if="userInfo.phone" @click="goEdit()">
											<!-- <view class="num-txt">ID：{{userInfo.uid}}</view> -->
											<view class="num-txt">{{userInfo.phone}}</view>
											<view class="icon">
												<image src="/static/images/edit.png" mode=""></image>
											</view>
										</view>
										<view class="phone" v-if="!userInfo.phone && isLogin" @tap="bindPhone">ຜູກມັດເບີໂທລະສັບ</view>
									</template>
								</view>
							</view>
							<view class="num-wrapper skeleton-rect">
								<view class="num-item" @click="goMenuPage('/pages/users/user_goods_collection/index')">
									<text class="num regular">{{userInfo.total_collect_product || 0}}</text>
									<view class="txt">ການສະສົມຂອງຂ້ອຍ</view>
								</view>
								<view v-if="hide_mer_status != 1" class="num-item" @click="goMenuPage('/pages/users/user_goods_collection/index?tab=2')">
									<text class="num regular">{{userInfo.total_collect_store || 0}}</text>
									<view class="txt">ຕິດຕາມຮ້ານ</view>
								</view>
								<view class="num-item" @click="goMenuPage('/pages/users/browsingHistory/index')">
									<text class="num regular">{{userInfo.total_visit_product || 0}}</text>
									<view class="txt">ປະຫວັດການເບິ່ງ</view>
								</view>
								<view class="num-item" @click="goMenuPage('/pages/users/user_coupon/index')">
									<text class="num regular">{{userInfo.total_coupon || 0}}</text>
									<view class="txt">ຄູປອງ</view>
								</view>
							</view>
							<view @click="goSvip" class="cardVipA acea-row row-between-wrapper" v-if="svip_switch_status == 1">
								<image class="svip_user" :src="`${domain}/static/images/svip_user.png`"></image>
								<view class="left-box">
									<view v-if="userInfo.is_svip > 0" class="small">ປະຢັດໃຫ້ທ່ານລວມ {{userInfo.svip_save_money}} ກີບ</view>
									<view v-else class="small">ເປີດໃຊ້ສິດທິພິເສດ 6 ຢ່າງ, ປະຢັດເງິນແລະບໍ່ຕ້ອງກັງວົນ
									</view>
								</view>
								<view class="acea-row row-middle">
									<view class="btn-open">{{userInfo.is_svip > 0 && userInfo.is_svip != 3  ? 'ຕໍ່ອາຍຸດຽວນີ້' : userInfo.is_svip == 3 ? 'ສະມາຊິກຕະຫຼອດຊີວິດ' : 'ເປີດໃຊ້ດຽວນີ້'}}</view>
								</view>
							</view>
							<view class="right-btn">
								<view class="iconfont icon-a-ic_setup1" v-if="isLogin" @click="goSetting()"></view>
								<view class="btn" @click="authTo('/pages/chat/customer_list/index?type=0')">
									<view class="iconfont icon-ic_message"></view>
									<text class="iconnum" v-if="userInfo.total_unread">{{userInfo.total_unread}}</text>
								</view>
							</view>
						</view>
					</view>
					<view class="wrapper">
						<view class="order-wrapper">
							<view class="order-hd flex skeleton-rect">
								<view class="left">ຄຳສັ່ງຊື້ຂອງຂ້ອຍ</view>
								<view class="right flex" @click="authTo('/pages/users/order_list/index?status=-1')" hover-class="none" open-type="navigate">
									ຄຳສັ່ງຊື້ທັງໝົດ
									<text class="iconfont icon-ic_rightarrow"></text>
								</view>
							</view>
							<view class="order-bd">
								<block v-for="(item,index) in orderMenu" :key="index">
									<view class="order-item" @click="authTo(item.url)" hover-class="none">
										<view class="pic">
											<text class="iconfont" :class="item.icon"></text>
											<text class="order-status-num" v-if="item.num > 0">{{ item.num }}</text>
										</view>
										<view class="txt skeleton-rect">{{item.title}}</view>
									</view>
								</block>
							</view>
						</view>
						<!-- 轮播 -->
						<view class="slider-wrapper skeleton-rect" v-if="imgUrls.length>0">
							<swiper indicator-dots="true" :autoplay="autoplay" :circular="circular" :interval="interval" :duration="duration"
							indicator-color="rgba(255,255,255,0.6)" indicator-active-color="#fff">
								<block v-for="(item,index) in imgUrls" :key="index">
									<swiper-item>
										<view @click="goUrl(item.url)" class='slide-navigator acea-row row-between-wrapper'>
											<image :src="item.pic" class="slide-image"></image>
										</view>
									</swiper-item>
								</block>
							</swiper>
						</view>
						<!-- 会员菜单 -->
						<view class="user-menus" style="margin-top: 20rpx;">
							<view class="title skeleton-rect">ບໍລິການຂອງຂ້ອຍ</view>
							<view class="menu-box">
								<block v-for="(item,index) in personalMenu" :key="index">
									<view v-if="item.isShow" class="item">
										<view @click="authTo(item.url)" class="item-count">
											<image v-if="showSkeleton" class="skeleton_image skeleton-radius"></image>
											<image v-else :src="item.pic" mode="aspectFit"></image>
											<text>{{item.name}}</text>
										</view>
									</view>
								</block>
								<view v-if="service_type.sys_service_switch != 0 && service_type.sys_service_switch != 5" class="item">
									<view @click="customer" class="item-count">
										<image :src="`${domain}/static/images/user_customer.png`" mode="aspectFit"></image>
										<text>ຕິດຕໍ່ຝ່າຍບໍລິການ</text>
									</view>
								</view>
								<!--#ifdef MP-->
								<button v-if="service_type.sys_service_switch == 5" class="item" open-type='contact' hover-class='none'>
									<image :src="`${domain}/static/images/user_customer.png`"></image>
									<text>ຕິດຕໍ່ຝ່າຍບໍລິການ</text>
								</button>
								<!--#endif-->
							</view>
						</view>
						<!-- 商家菜单 -->
						<view class="user-menus" style="margin-top: 20rpx;" v-if="merchantMenus.length">
							<view class="title skeleton-rect">ການຄຸ້ມຄອງຮ້ານຄ້າ</view>
							<view class="menu-box">
								<block v-for="(item,index) in merchantMenus" :key="index">
									<view class="item">
										<view @click="authTo(item.url)" class="item-count">
											<image v-if="showSkeleton" class="skeleton_image skeleton-radius"></image>
											<image v-else :src="item.pic" mode="aspectFit"></image>
											<text>{{item.name}}</text>
										</view>
									</view>
								</block>
							</view>
						</view>
					</view>
					<view v-if="copyright.status !== -1" class="copy-right">
						<image class="img-copyright" :src="copyright.image" mode="widthFix"></image>
						<view class="text">{{copyright.Copyright}}</view>
					</view>
					<view v-else class="copy-right">
						<view class="iconfont icon-crmeb"></view>
						<view class="text">Copyright ©{{new Date().getFullYear()}} CRMEB. All Rights</view>
					</view>
					<!-- #ifndef H5 -->
					<passwordPopup></passwordPopup>
					<!-- #endif -->
				</view>

				<!--自定义底部tab栏-->
				<template v-if="tabbarConfig">
					<pageFooterPlaceholder :tabbarConfig="tabbarConfig" />
					<pageFootWrapper :tabbarConfig="tabbarConfig" />
					<tabbarCheck ref="tabbarCheck" :tabbarConfig="tabbarConfig" />
				</template>
			</view>
		</template>
	</diyDataProvider>
</template>
<script>
// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016-2026 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------
	let sysHeight = uni.getSystemInfoSync().statusBarHeight + 'px';
	import { getMenuList, getUserInfo, setVisit } from '@/api/user.js';
	import { getVersion } from "@/api/public";
	import { orderData } from '@/api/order.js'
	import { mapGetters } from "vuex";
	import dayjs from '@/plugin/dayjs/dayjs.min.js';
	import Cache from '@/utils/cache';
	// #ifndef H5
	import passwordPopup from '@/components/passwordPopup';
	// #endif
	import { configMap, getCustomer } from '@/utils';
	import Auth from '../../libs/wechat';
	import { HTTP_REQUEST_URL } from '@/config/app';
	import { toLogin } from '@/libs/login.js';
	import { ROLES, RoleManager } from '@/utils/role';
	import RoleToggle from "@/components/role-toggle";
	import pageFootWrapper from "@/sub-packages/diy/diyPage/common/pageFootWrapper.vue";
	import pageFooterPlaceholder from "@/components/diyPage/pageFooterPlaceholder.vue";
	import diyDataProvider from '@/components/diyPage/common/diyDataProvider.vue';
	import tabbarCheck from '@/components/diyPage/common/tabbarCheck.vue';

	const app = getApp();
	export default {
		components: {
			// #ifndef H5
			passwordPopup,
			// #endif
			RoleToggle,
			pageFootWrapper,
			pageFooterPlaceholder,
			diyDataProvider,
			tabbarCheck
		},
		// #ifdef MP
		componentPlaceholder: {
			"page-foot-wrapper": "view"
		},
		// #endif
		computed: configMap({
			mer_intention_open: 0,
			hide_mer_status: 0,
			recharge_switch: 0,
			integral_status: 0,
			member_status: 0,
			balance_func_status: 0,
			svip_switch_status: 0,
			navigation: {},
			service_type: {},
		}, {
			...mapGetters(['isLogin','viewColor','keyColor','cartNum']),
			merchantMenus() {
				const { userInfo } = this;
				const menus = [];
				if (userInfo.service) {
					menus.push({
						pic: `${HTTP_REQUEST_URL}/static/images/merchant_manage.png`,
						name: 'ການຄຸ້ມຄອງຮ້ານຄ້າ',
						url: '/pages/admin/business/index?is_sys=0'
					});
				}

				if (userInfo.topService) {
					menus.push({
						pic: `${HTTP_REQUEST_URL}/static/images/platform_manage.png`,
						name: 'ການຄຸ້ມຄອງແພລດຟອມ',
						url: '/pages/chat/customer_list/index?type=1&mer_id=0',
					});
				}
				if (userInfo.staffs?.length) {
					menus.push({
						pic: `${HTTP_REQUEST_URL}/static/images/ticket_manage.png`,
						name: 'ການຄຸ້ມຄອງໃບສັ່ງວຽກ',
						url: '/pages/staff/order_list',
					});
				}
				if (userInfo.delivery?.length) {
					menus.push({
						pic: `${HTTP_REQUEST_URL}/static/images/delivery_manage.png`,
						name: 'ການຄຸ້ມຄອງການຈັດສົ່ງ',
						url: '/pages/delivery/order_list',
					});
				}

				return menus;
			}
		}),
		filters: {
			dateFormat: function(value) {
				return dayjs(value * 1000).format('YYYY-MM-DD');
			}
		},
		data() {
			return {
				diyId: undefined,
				ROLES,
				//#ifdef H5
				isWeixin: this.$wechat.isWeixin(),
				//#endif
				domain: HTTP_REQUEST_URL,
				showSkeleton: true, //骨架屏显示隐藏
				isNodes: 0, //控制什么时候开始抓取元素节点,只要数值改变就重新抓取
				orderMenu: [{
					icon: 'icon-ic_daifukuan12',
					title: 'ລໍຖ້າຊຳລະເງິນ',
					url: '/pages/users/order_list/index?status=0',
					num: 0
				},
				{
					icon: 'icon-ic_daifahuo11',
					title: 'ລໍຖ້າສົ່ງ/ກວດສອບ',
					url: '/pages/users/order_list/index?status=1',
					num: 0
				},
				{
					icon: 'icon-ic_daishouhuo1',
					title: 'ລໍຖ້າຮັບສິນຄ້າ',
					url: '/pages/users/order_list/index?status=2',
					num: 0
				},
				{
					icon: 'icon-ic_daipingjia1',
					title: 'ລໍຖ້າລີວິວ',
					url: '/pages/users/order_list/index?status=3',
					num: 0
				},
				{
					icon: 'icon-ic_daituikuan1',
					title: 'ບໍລິການຫຼັງການຂາຍ/ຄືນເງິນ',
					url: '/pages/users/refund/list',
					num: 0
				},
				],
				imgUrls: [{url:'',pic:''}],
				userMenu: [],
				skeletonMenu: [],
				personalMenu: [
					{pic: '',name: '',isShow: true},
					{pic: '',name: '',isShow: true},
					{pic: '',name: '',isShow: true},
					{pic: '',name: '',isShow: true},
					{pic: '',name: '',isShow: true},
					{pic: '',name: '',isShow: true},
					{pic: '',name: '',isShow: true},
					{pic: '',name: '',isShow: true},
					{pic: '',name: '',isShow: true},
					{pic: '',name: '',isShow: true},
					{pic: '',name: '',isShow: true},
					{pic: '',name: '',isShow: true}
				],
				autoplay: true,
				circular: true,
				interval: 3000,
				duration: 500,
				orderStatusNum: {},
				userInfo: {aratar: '',is_svip:0},
				MyMenus: [],
				is_promoter: 0, //推广人开关  1开
				extension_status: 0,
				copyright: {
					copyright_status: 1
				},
				sysHeight: sysHeight,
				show_promoter: false,
			}
		},
		onLoad(options) {
			this.diyId = this.$util.getDiyId(options);
		},
		onReady() {
			this.isNodes++;
		},
		mounted: function() {
			this.getVersion()
		},
		onShow: function() {
			this.$refs.tabbarCheck && this.$refs.tabbarCheck.check();
			let that = this;
			that.$util.getCartNum(that.isLogin,null);
			if (that.isLogin) {
				that.getUserInfo();
				that.orderNum();
			} else {
				that.orderMenu.forEach(v=>{
					v.num = 0
				})
				that.getMyMenus();
			}
			setTimeout(() => {
				that.showSkeleton = false
			}, 500)
		},
		methods: {
			handleToggleRole(role) {
				RoleManager.setRole(role);
				uni.navigateTo({
					url: RoleManager.getRoleRoute()
				});
			},
			authTo(url){
				if(this.isLogin){
					uni.navigateTo({
						url: url
					})
				}else{
					this.openAuto()
				}
			},
			customer() {
				let that = this;
				let sys = that.service_type
				let data = {
					type: sys.sys_service_switch,
					service_phone: sys.sys_phone,
					customer_url: sys.customer_url,
					customer_corpId: sys.customer_corpId,
					customer_link: sys.customer_link
				}
				let url = `/pages/chat/customer_list/chat?type=0`
				getCustomer(data, url)
			},
			goSvip(){
				if(this.isLogin){
					if(this.userInfo.is_svip > 0){
						uni.navigateTo({
							url: '/pages/annex/vip_center/index'
						})
					}else{
						uni.navigateTo({
							url: '/pages/annex/vip_paid/index'
						})
					}
				}else{
					this.openAuto()
				}
			},
			goRouter(item) {
				var pages = getCurrentPages();
				var page = (pages[pages.length - 1]).$page.fullPath;
				if (item.link == page) return
				uni.switchTab({
					url: item.link,
					fail(err) {
						uni.redirectTo({
							url: item.link
						})
					}
				})
			},
			toService(is_sys){
				uni.navigateTo({
					url: '/pages/admin/business/index?is_sys=' + is_sys
				})
			},
			getVersion() {
				getVersion().then(data => {
					this.copyright = data.data;
				});
			},
			// 菜单显示
			filterMenus: function(item){
				let that = this;
				if(item.url=='/pages/users/user_money/index') item.isShow =  that.balance_func_status == 1
				else if(item.url=='/pages/users/user_spread_user/index'){
					if(that.extension_status == 0){
						item.isShow = false
					} else if(that.extension_status == 1){
						item.isShow = that.show_promoter
						if(that.is_promoter != 1)item.url="/pages/users/distributor/index"
					}
				}
				else if(item.url=='/pages/store/settled/index')item.isShow = that.mer_intention_open == 1
				else if(item.url=='/pages/users/user_grade/index') item.isShow = that.member_status == 1
				else if(item.url=='/pages/users/user_integral/index') item.isShow = that.integral_status == 1
				else item.isShow = true
			},
			showMenu(menu){
				return !menu || ['integral','service','admin_order','verify_order','intention','promoter','balance'].indexOf(menu) === -1;
			},
			goUrl(url){
				if(url.indexOf("http") != -1){
					// #ifdef H5
					location.href = url
					// #endif
				}else{
					if(['/pages/goods_cate/goods_cate','/pages/order_addcart/order_addcart','/pages/user/index'].indexOf(url) == -1){
						uni.navigateTo({
							url:url
						})
					}else{
						uni.switchTab({
							url:url
						})
					}
				}
			},
			// 去聊天列表
			goChat() {
				let type = this.userInfo.service ? 1 : 0
				uni.navigateTo({
					url: `/pages/chat/customer_list/index?type=${type}`
				})
			},
			// 记录会员访问
			setVisit() {
				setVisit({
					url: '/pages/user/index'
				}).then(res => {})
			},
			// 打开授权
			openAuto() {
				toLogin()
			},
			Setting: function() {
				uni.openSetting({
					success: function(res) {}
				});
			},
			// 绑定手机
			bindPhone() {
				uni.navigateTo({
					url: '/pages/users/user_phone/index'
				})
			},
			/**
			 * 获取个人用户信息
			 */
			getUserInfo: function() {
				let that = this;
				getUserInfo().then(res => {
					that.$store.commit("UPDATE_USERINFO", res.data);
					that.userInfo = res.data;
					that.is_promoter = res.data.promoter&&res.data.promoter.isPromoter;
					that.show_promoter = res.data.promoter&&res.data.promoter.isShow;
					that.extension_status = res.data.promoter.extension_status;
					that.getMyMenus();
				});
			},
			// 订单数字
			orderNum() {
				orderData().then(({
					data
				}) => {
					this.orderMenu.forEach((item, index) => {
						switch (item.title) {
							case 'ລໍຖ້າຊຳລະເງິນ':
								item.num = data.noPay
								break
							case 'ລໍຖ້າສົ່ງ/ກວດສອບ':
								item.num = data.noPostage
								break
							case 'ລໍຖ້າຮັບສິນຄ້າ':
								item.num = data.noDeliver
								break
							case 'ລໍຖ້າລີວິວ':
								item.num = data.noComment
								break
							case 'ບໍລິການຫຼັງການຂາຍ/ຄືນເງິນ':
								item.num = data.refund
								break
						}
					})
				})
			},
			/**
			 *
			 * 获取个人中心图标
			 */
			getMyMenus: function() {
				let that = this;
				if (this.MyMenus.length) return;
				getMenuList().then(res => {
					that.personalMenu = []
					res.data.menu.forEach((item,index)=>{
						that.filterMenus(item)
						that.personalMenu.push(item)
					})
					that.imgUrls = res.data.banner
					uni.stopPullDownRefresh(); //结束下拉刷新
				});
			},
			// 编辑页面
			goEdit() {
				if(this.isLogin){
					uni.navigateTo({
						url: '/pages/users/user_info/index'
					})
				}else{
					this.openAuto()
				}
			},
			goSetting() {
				if(this.isLogin){
					uni.navigateTo({
						url: '/pages/users/user_setting/index'
					})
				}else{
					this.openAuto()
				}
			},
			// 签到
			goSignIn() {
				uni.navigateTo({
					url: '/pages/users/user_sgin/index'
				})
			},
			goMenuPage(url) {
				if (this.isLogin) {
					uni.navigateTo({
						url
					})
				} else {
					this.openAuto()
				}
			},
		},
		onPullDownRefresh: function(){
			if (this.isLogin) {
				this.getUserInfo();
				this.orderNum();
			} else {
				this.userInfo = {}
				this.orderMenu.forEach(v=>{
					v.num = 0
				})
				this.getMyMenus();
			}
		},
	}
</script>

<style lang="scss" scoped>
	.cardVipA {
		position: absolute;
		background: linear-gradient(145deg, #F8E3A8 0%, #E8C077 100%);
		background-size: 100% 100%;
		width: 710rpx;
		height: 84rpx;
		bottom: 0;
		left: 20rpx;
		padding: 0 30rpx 0 105rpx;
		border-radius: 24rpx 24rpx 0 0;
		box-sizing: border-box;
		color: 19bf219;
		.svip_user{
			width: 52rpx;
			height: 52rpx;
			border-radius: 100%;
			position: absolute;
			left: 30rpx;
			top: 17rpx;
		}
		.left-box {
			font-size: 26rpx;
			color: #905100;
			font-weight: 400;
		}
		.btn {
			color: #905100;
			font-weight: 400;
			font-size: 24rpx;
		}
		.btn-open {
			background: #282828;
			border-radius: 40rpx;
			color: #F7E1A6;
			font-size: 24rpx;
			width: 140rpx;
			height: 50rpx;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
	.new-users {
		.head {
			background: #fff;
			.user-card {
				position: relative;
				width: 100%;
				padding: 35rpx 0 50rpx;
				background-image: linear-gradient(90deg, var(--view-bntColor21) 0%, var(--view-bntColor22) 100%);
				&.svip-card{
					padding: 35rpx 0 120rpx;
				}
				.bg {
					position: absolute;
					left: 0;
					top: 0;
					width: 100%;
					height: 100%;
					background-size: 100% 100%;
				}
				.user-info {
					z-index: 31;
					position: relative;
					display: flex;
					padding: 0 28rpx;
					.level_icon{
						width: 34rpx;
						height: 32rpx;
						margin: 4rpx 0 0 6rpx;
						border: none;
					}
					.avatar-box{
						width: 120rpx;
						height: 120rpx;
						border-radius: 50%;
						position: relative;
						.avatar,image{
							width: 120rpx;
							height: 120rpx;
							border-radius: 50%;
						}
						&.on {
							.avatar {
								border: 2px solid #FFAC65;
								border-radius: 50%;
								box-sizing: border-box;
							}
						}
					}
					.headwear {
						position: absolute;
						right: -4rpx;
						top: -14rpx;
						width: 44rpx;
						height: 44rpx;
						z-index: -1;
						image {
							width: 100%;
							height: 100%;
						}
					}
					.info {
						flex: 1;
						display: flex;
						flex-direction: column;
						justify-content: space-between;
						margin-left: 20rpx;
						padding: 15rpx 0;
						.name {
							display: flex;
							align-items: center;
							color: #fff;
							font-size: 32rpx;
							line-height: 1;
							.vip {
								width: 82rpx;
								height: 36rpx;
								margin-left: 12rpx;
								image {
									width: 82rpx;
									height: 36rpx;
								}
							}
						}
						.num {
							display: flex;
							align-items: center;
							font-size: 26rpx;
							color: rgba(255, 255, 255, 0.6);
							image {
								width: 22rpx;
								height: 23rpx;
								margin-left: 20rpx;
							}
						}
					}
				}
				.num-wrapper {
					z-index: 30;
					position: relative;
					display: flex;
					align-items: center;
					justify-content: space-between;
					margin: 30rpx 20rpx 0;
					color: #fff;
					.num-item {
						width: 25%;
						text-align: center;
						.num {
							font-size: 42rpx;
							font-weight: 500;
						}
						.txt {
							margin-top: 8rpx;
							font-size: 22rpx;
							color: rgba(255, 255, 255, 0.6);
						}
					}
				}
				.sign {
					z-index: 200;
					position: absolute;
					right: -12rpx;
					top: 80rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					width: 120rpx;
					height: 60rpx;
					background: linear-gradient(90deg, rgba(255, 225, 87, 1) 0%, rgba(238, 193, 15, 1) 100%);
					border-radius: 29rpx 4rpx 4rpx 29rpx;
					color: #282828;
					font-size: 28rpx;
					font-weight: bold;
				}
			}
		}
		.wrapper {
			position: relative;
			padding: 0 20rpx;
			margin-top: 20rpx;
		}
		.order-wrapper {
			background-color: #fff;
			border-radius: 24rpx;
			.order-hd {
				height: 80rpx;
				align-items: center;
				justify-content: space-between;
				border-bottom: 1rpx dashed #eee;
				padding: 0 30rpx;
				color: #282828;
				.left {
					font-weight: 500;
				}
				.right {
					align-items: center;
					color: #666666;
					font-size: 26rpx;
					.icon-ic_rightarrow {
						margin-left: 5rpx;
						margin-top: 6rpx;
						font-size: 26rpx;
					}
				}
			}
			.order-bd {
				display: flex;
				.order-item {
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					width: 20%;
					// height: 160rpx;
					height: fit-content;
					.pic {
						position: relative;
						text-align: center;
						.iconfont{
							font-size: 48rpx;
							color: var(--view-theme);
						}
					}
					.txt {
						margin-top: 8rpx;
						font-size: 26rpx;
						color: #282828;
					}
				}
			}
		}
		.slider-wrapper {
			margin: 20rpx 0;
			height: 130rpx;
			border-radius: 24rpx;
			swiper,
			swiper-item {
				height: 100%;
			}
			image {
				width: 100%;
				height: 130rpx;
				border-radius: 24rpx;
			}
		}
		.user-menus {
			padding-bottom: 30rpx;
			background-color: #fff;
			border-radius: 24rpx;
			.title {
				height: 80rpx;
				line-height: 80rpx;
				padding: 0 30rpx;
				border-bottom: 1px dashed #eee;
				font-weight: 500;
			}
			.item {
				position: relative;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: space-between;
				width: 25%;
				line-height: 28rpx;
				height: 90rpx;
				margin-top: 40rpx;
				text-align: center;
				.item-count {
					display: flex;
					flex-direction: column;
					align-items: center;
					width: 100%;
				}
				image {
					width: 52rpx;
					height: 52rpx;
				}
				.skeleton_image{
					width: 80rpx;
					height: 80rpx;
				}
				text {
					margin-top: 10rpx;
					font-size: 26rpx;
					color: #282828;
					text-overflow: ellipsis;
					overflow: hidden;
					white-space: nowrap;
					width: 78%;
				}
				&:last-child::before {
					display: none;
				}
			}
			button {
				font-size: 28rpx;
			}
		}
		.phone {
			color: #fff;
		}
		.order-status-num {
			background-color: #fff;
			color: var(--view-theme);
			border-radius: 200rpx;
			position: absolute;
			right: -12rpx;
			top: -12rpx;
			font-size: 20rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			min-width: 30rpx;
			height: 30rpx;
			padding: 0 8rpx;
			box-sizing: border-box;
			border: 1px solid var(--view-theme);
		}
	}
	.sys-head {
	  .bg {
	    background-image:linear-gradient(90deg, var(--view-bntColor21) 0%, var(--view-bntColor22) 100%);
	  }
	  .sys-title {
	    font-size: 32rpx;
	  }
	}
	.menus-list-item{
		background: #fff;
		border-radius: 24rpx;
		padding: 30rpx 50rpx 30rpx 40rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 20rpx;
		.title{
			font-size: 34rpx;
			color: #282828;
			font-weight: bold;
		}
		.info{
			margin-top: 15rpx;
			font-size: 22rpx;
			display: flex;
			align-items: center;
			.iconfont{
				font-size: 20rpx;
				margin-left: 4rpx;
			}
			&.merchant{
				color: #E93323;
			}
			&.plantform{
				color: #FFC552;
			}
		}
		.image{
			width: 180rpx;
			height: 108rpx;
			background-size: 100%;
			background-repeat: no-repeat;
		}
	}
	.copy-right {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		color: #CCCCCC;
		font-size: 22rpx;
		margin-top: 40rpx;
		margin-bottom: 0;
		.iconfont {
			font-size: 60rpx;
		}
		.img-copyright{
			width: 120rpx;
			height: 60rpx;
		}
	}
	.menu-box {
		display: flex;
		flex-wrap: wrap;
	}
	.right-btn {
		z-index: 99;
		position: absolute;
		right: 30rpx;
		top: 40rpx;
		display: flex;
		align-items: center;
		color: #fff;
		.iconfont {
			font-size: 40rpx;
			margin-left: 33rpx;
		}
		.btn {
			position: relative;
		}
		.iconnum {
			min-width: 6px;
			background-color: #fff;
			color: var(--view-theme);
			border-radius: 15rpx;
			position: absolute;
			right: -10rpx;
			top: -10rpx;
			font-size: 10px;
			padding: 0 4px;
		}
	}
	.menu-list-count{
		margin-top: 20rpx;
		border-radius: 12rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		.menu-item{
			width: 345rpx;
			border-radius: 24rpx;
			padding: 20rpx;
			background-color: #fff;
			display: flex;
			align-items: center;
			position: relative;
			.image {
				width: 106rpx;
				height: 64rpx;
				background-size: 100%;
				background-repeat: no-repeat;
				&.merchant-image{
					margin-right: 15rpx;
				}
				&.plantform-image{
					margin-left: 15rpx;
				}
			}
			.menu-text{
				margin-left: 10rpx;
				.title{
					color: #282828;
					font-weight: bold;
					font-size: 26rpx;

				}
				.info{
					display: flex;
					align-items: center;
					font-size: 22rpx;
					margin-top: 16rpx;
					.iconfont{
						font-size: 20rpx;
						margin-left: 4rpx;
					}
					&.merchant{
						color: #E93323;
					}
					&.plantform{
						color: #FFC552;
					}
				}
			}
		}
	}

	.toggle-role-box {
		display: flex;
		gap: 12rpx;
		margin-top: 20rpx;

		.toggle-role-btn {
			display: flex;
			align-items: center;
			padding-inline: 16rpx;
			height: 42rpx;
			background-color: transparent;
			border-radius: 21rpx;
			border: 1rpx solid #fff;
			color: #ffff;
			font-size: 22rpx;

			.iconfont {
				font-size: 20rpx;
				margin-left: 8rpx;
			}
		}

	}
</style>
