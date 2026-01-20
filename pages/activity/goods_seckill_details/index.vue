<template>
	<view :style="viewColor">
		<view class="product-con skeleton">
			<view class="head-wrapper" id="home" :style="{ top: homeTop + 'rpx' }">
				<view class="head-menu">
					<view class='iconfont icon-ic_left' @click="returns"></view>
					<view class="iconfont icon-ic_menu3" @click="showNav"></view>
				</view>
				<view v-if="diyProduct.openShare" class="share-icon" :style="{ left: homeLeft }" @click="listenerActionSheet">
					<view class="iconfont icon-ic_transmit1"></view>
				</view>
			</view>
			<homeList
				:navH="navH"
				:currentPage="currentPage"
				:sysHeight="sysHeight"
				:openNavList="diyProduct.navList"></homeList>
			<view>
				<scroll-view :scroll-top="scrollTop" scroll-y='true' scroll-with-animation="true" :style='"height:"+height+"px;"'
				 @scroll="scroll">
					<view id="past0">
						<!-- #ifdef MP || APP-PLUS -->
						<view class="" :style="'width:100%;' + 'height:'+sysHeight + 'px'"></view>
						<!-- #endif -->
						<productConSwiper class="skeleton-rect" :imgUrls="storeInfo.slider_image" :videoCoverImg='videoCoverImg' :showDot="diyProduct.swiperDot" :videoline="storeInfo.video_link"></productConSwiper>
						<view class="swiper-bg pos-rel">
							<view class='nav acea-row row-between-wrapper boder-44 pos-rel' :style="{ 'background-image': `url(${domain}/static/images/seckill-bg.png)`}">
								<view class='money skeleton-rect'>
									<text class="money-text">秒杀价</text>
									<priceFormat :price="storeInfo.price" weight intSize="48" floatSize="32" labelSize="32"></priceFormat>
									<text class='y-money regular'>¥{{storeInfo.ot_price}}</text></view>
								<view class='acea-row row-middle skeleton-rect' v-if="storeInfo.seckill_status == '1'">
									<view class='time'>
										<view>ເຫຼືອເວລາ</view>
										<countDown :is-day="false" :tip-text="' '" :day-text="' '" :hour-text="' : '" :minute-text="' : '" :second-text="' '" :colorTheme="true" :noBorder="true" :datatime="datatime"></countDown>
									</view>
								</view>
							</view>
							<view class="detail-count pos-rel">
								<view class='wrapper'>
									<view class='introduce skeleton-rect acea-row row-between'>
										<view class="title">
											<text v-if="(storeInfo.merchant && storeInfo.merchant.type_name)" class="font-bg-red">{{storeInfo.merchant.type_name}}</text>
											<text v-else-if="(storeInfo.merchant && storeInfo.merchant.is_trader)" class="font-bg-red">自营</text>
											{{storeInfo.store_name}}
										</view>
										<view v-if="diyProduct.shareList.length>0" class="fenxiang_btn">
											<block v-for="(item,index) in diyProduct.shareList" :key="index">
												<view v-if="diyProduct.shareConfig.includes(item.value)" @click="setShare(item.value)"><text class="iconfont" :class="[`${item.icon}`, { 'icon-ic_star1': storeInfo.isRelation&&item.value==1 }]"></text><br/>{{item.label}}</view>
											</block>
										</view>
									</view>
									<view class='label acea-row row-between-wrapper'>
										<view v-show="diyProduct.isOpen.includes(0)" class="skeleton-rect line-through">¥{{storeInfo.ot_price || 0}}</view>
										<view v-show="diyProduct.isOpen.includes(2)" class="skeleton-rect">库存:{{storeInfo.stock || 0}}{{storeInfo.unit_name || ''}}</view>
										<view v-show="diyProduct.isOpen.includes(1)" class="skeleton-rect">已售:{{storeInfo.sales || 0}}{{storeInfo.unit_name || ''}}</view>
									</view>
								</view>
							</view>
							<view class="pad20">
								<view v-if="diyProduct.serviceList.length>0" class="bg-f boder-24">
									<block v-for="(item,index) in diyProduct.serviceList" :key="index">
										<specSelect v-if="item.props == 'specSelect' && diyProduct.showService.includes(item.value)" :attrTxt="attrTxt" :attrValue="attrValue" @selecAttr="selecAttr"></specSelect>
										<freight v-if="item.props == 'freight' && diyProduct.showService.includes(item.value)" :shippingValue="shippingValue" :shipping="shipping" @showShip="showShip"></freight>
										<serviceGuarantee v-if="item.props == 'serviceGuarantee' && diyProduct.showService.includes(item.value)" :guarantee="guarantee" @showGuaranee="showGuaranee"></serviceGuarantee>
										<parameter v-if="item.props == 'parameter' && diyProduct.showService.includes(item.value)" :specsInfo="specsInfo" @seeSpecs="seeSpecs"></parameter>
									</block>
								</view>
								<view class='userEvaluation boder-24' id="past1" v-if="replyCount && replyCount>0 && diyProduct.showReply==1">
									<view class='title acea-row row-between-wrapper'>
										<view>用户评价({{replyCount}})</view>
										<navigator class='praise' hover-class='none' :url='"/pages/users/goods_comment_list/index?product_id="+id'>
											<text class='t-color'>{{replyChance}}</text>好评率
											<text class='iconfont icon-ic_rightarrow'></text>
										</navigator>
									</view>
									<block v-if="replyCount">
										<userEvaluation :reply="reply"></userEvaluation>
									</block>
								</view>
								<!-- 种草秀 -->
								<!-- <view class='userPlant boder-24' v-if="storeInfo.community && storeInfo.community.length>0 && diyProduct.showCommunity == 1">
									<view class='title acea-row row-between-wrapper'>
										<view>种草秀({{storeInfo.community.length}})</view>
										<navigator class='praise' hover-class='none' :url="'/pages/plantGrass/plant_show/index?spu_id='+storeInfo.spu_id">
											查看全部
											<text class='iconfont icon-ic_rightarrow'></text>
										</navigator>
									</view>
									<view class="imgList acea-row">
										<navigator class="pictrue" v-for="(item, index) in storeInfo.community" :key="index" v-if="index<=2"
										 hover-class='none' :url="'/pages/plantGrass/plant_detail/index?id='+item.community_id">
											<image :src="item.image[0]" class="image"></image>
										</navigator>
									</view>
								</view> -->
								<!-- 商铺信息 -->
								<view class="store-wrapper boder-24" v-if="storeInfo.merchant && hide_mer_status ==0 && diyProduct.showStore==1">
									<view class="store-hd">
										<view class="store-info">
											<navigator :url="'/pages/store/home/index?id='+storeInfo.mer_id" hover-class="none" class="logo">
												<image :src="storeInfo.merchant.mer_avatar" mode=""></image>
											</navigator>
											<navigator :url="'/pages/store/home/index?id='+storeInfo.mer_id" hover-class="none" class="info">
												<view class="name">{{storeInfo.merchant.mer_name}}
													<text v-if="(storeInfo.merchant && storeInfo.merchant.type_name)" class="font-bg-red ml8">{{storeInfo.merchant.type_name}}</text>
													<text v-else-if="(storeInfo.merchant && storeInfo.merchant.is_trader)" class="font-bg-red ml8">自营</text>
												</view>
												<view class="txt">
												{{storeInfo.merchant.care_count < 10000 ? storeInfo.merchant.care_count : (storeInfo.merchant.care_count/10000).toFixed(2)+'万'}}人关注
												</view>
											</navigator>
											<navigator :url="'/pages/store/home/index?id='+storeInfo.merchant.mer_id" class="link"
											 hover-class="none">进店</navigator>
										</view>
										<view class="score-wrapper">
											<view class="item">
												商品描述<text>{{storeInfo.merchant.product_score}}</text>
											</view>
											<view class="item">
												卖家服务<text>{{storeInfo.merchant.service_score}}</text>
											</view>
											<view class="item">
												物流服务<text>{{storeInfo.merchant.postage_score}}</text>
											</view>
										</view>
									</view>
									<view v-if="storeInfo.merchant.recommend && storeInfo.merchant.recommend.length > 0 && diyProduct.showRecommend==1" class="con-box">
										<view class="title">ແນະນຳຈາກຮ້ານ</view>
										<view class="swiper page_swiper" :style="'height:'+swiperHeight+'rpx'">
											<swiper
												indicator-dots="true"
												:autoplay="false"
												:circular="circular"
												:interval="interval"
												:duration="duration"
												:current="swiperCur"
												:style="'height:'+swiperHeight+'rpx'"
											>
												<block v-for="(item,index) in recommend" :key="index">
													<swiper-item class="swiper-item">
														<view class="img-box">
																<view class="img-item" v-for="(itm,idx) in item" :key="idx" @click="goProDetail(itm)">
																	<image mode="aspectFill" :src="itm.image"></image>
																	<view class="txt">
																		<view class="title line1">{{itm.store_name}}</view>
																		<view class="price">
																			<priceFormat :price="itm.price" weight intSize="28" floatSize="20" labelSize="20"></priceFormat>
																		</view>
																	</view>
																</view>
														</view>
													</swiper-item>
												</block>
											</swiper>
										</view>
									</view>
								</view>
								<view class='product-intro' id="past3">
									<view class='title'>ແນະນຳສິນຄ້າ</view>
									<view class='conter' v-if="description">
										<jyf-parser :domain='domain' :html="description.content" ref="article" :tag-style="tagStyle"></jyf-parser>
									</view>
									<!-- 价格说明 -->
									<view v-if="priceRule.content" class="price-info">
										<view class="price-title">价格说明</view>
										<!-- #ifndef APP-PLUS -->
										<jyf-parser :domain='domain' :html="priceRule.content.replace(/<br\/>/ig, '')" ref="article" :tag-style="tagStyle"></jyf-parser>
										<!-- #endif -->
										<!-- #ifdef APP-PLUS -->
										<view class="description" v-html="priceRule.content.replace(/<br\/>/ig, '')"></view>
										<!-- #endif -->
									</view>
								</view>
								<view class="content-height"></view>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
			<view class='footer acea-row row-between-wrapper' :class="{'footpl':hide_mer_status==1}">
				<block v-if="diyProduct.footerList.length>0">
					<block v-for="(item,index) in diyProduct.footerList" :key="index">
						<view v-if="diyProduct.menuList.includes(item.value) || (item.value==0 && diyProduct.menuList.includes(item.value)&& hide_mer_status !=1)" class="item skeleton-rect" @click="goMenu(item.value)">
							<view class="iconfont" :class="[`${item.icon}`, { 'icon-ic_star1': storeInfo.isRelation&&item.value==3 }]">
								<text v-if="item.value==2&&CartCount>0" class='num'>{{CartCount || 0}}</text>
							</view>
							<view>{{item.label}}</view>
						</view>
					</block>
				</block>
				<view class='bnt acea-row skeleton-rect'>
					<form @submit="joinCart" report-submit='true'>
						<button class='joinCart bnts' :class="'w_buy'+diyProduct.menuList.length" @tap="openAlone">直接购买</button>
					</form>
					<form @submit="goBuy" report-submit='true' v-if="attr.productSelect && storeInfo.seckill_status == '1'">
						<button v-if="attr.productSelect.stock == 0" class='buy bnts' :class="'w_buy'+diyProduct.menuList.length" form-type="submit" disabled>已售罄</button>
						<button v-else class='buy bnts' :class="'w_buy'+diyProduct.menuList.length" form-type="submit">秒杀购买</button>
					</form>
					<form report-submit='true' v-if="storeInfo.seckill_status == '0'">
						<button class='buy bnts' :class="'w_buy'+diyProduct.menuList.length" form-type="submit" disabled>未开始</button>
					</form>
					<form report-submit='true' v-if="storeInfo.seckill_status == '-1'">
						<button class='buy bnts' :class="'w_buy'+diyProduct.menuList.length" form-type="submit" disabled>已结束</button>
					</form>
				</view>
			</view>
			<!-- 组件 -->
			<productWindow :attr="attr" :isShow='diyProduct.isOpen.includes(2)' :iSplus='1' :isCustom="true" @myevent="onMyEvent" @ChangeAttr="ChangeAttr" @ChangeCartNum="ChangeCartNum"
			 @attrVal="attrVal" @iptCartNum="iptCartNum" id='product-window' :image="storeInfo.image" :maxCount="onceCount"></productWindow>
			<!-- 商品参数 -->
			<specs :specsInfo="specsInfo" @myevent="mySpecs"></specs>
			<!-- 分享按钮 -->
			<view class="generate-posters acea-row row-middle" :class="posters ? 'on' : ''">
				<!-- #ifndef MP -->
				<button class="item" :class="weixinStatus ? 'item3' : ''" hover-class='none' v-if="weixinStatus === true" @click="H5ShareBox = true">
					<view class="iconfont icon-ic_wechat"></view>
					<view class="">发送给朋友</view>
				</button>
				<!-- #endif -->
				<!-- #ifdef MP -->
				<button class="item" :class="weixinStatus ? 'item3' : ''" open-type="share" hover-class='none' @click="goFriend">
					<view class="iconfont icon-ic_wechat"></view>
					<view class="">发送给朋友</view>
				</button>
				<!-- #endif -->
				<button class="item" :class="weixinStatus ? 'item3' : ''" hover-class='none' @click="downloadFilePromotionCode">
					<view class="iconfont icon-a-ic_picture1"></view>
					<view class="">生成海报</view>
				</button>
				<button class="item" :class="weixinStatus ? 'item3' : ''" hover-class='none' @click="copyPwd">
					<view class="iconfont icon-ic_key"></view>
					<view>复制口令</view>
				</button>
			</view>
			<view class="mask" v-if="posters" @click="listenerActionClose"></view>
			<!--口令复制结果-->
			<copyPassword :isCopy='isCopy' :copyUrl='copyUrl' @close="closeCopy"></copyPassword>
			<!-- 海报展示 -->
			<view class='poster-pop' v-if="posterImageStatus">
				<image src='../../../static/images/poster-close.png' class='close' @click="posterImageClose"></image>
				<image :src='posterImage'></image>
				<!-- #ifndef H5  -->
				<view class='save-poster' @click="savePosterPath">保存到手机</view>
				<!-- #endif -->
				<!-- #ifdef H5 -->
				<view class="keep">长按图片可以保存到手机</view>
				<!-- #endif -->
			</view>
			<view class='mask' v-if="posterImageStatus"></view>
			<view class="mask_transparent" v-if="currentPage" @touchmove="hideNav" @click="hideNav()"></view>
			<canvas class="canvas" canvas-id='myCanvas' v-if="canvasStatus"></canvas>
			<!-- 发送给朋友图片 -->
			<view class="share-box" v-if="H5ShareBox">
				<image :src="`${domain}/static/images/share-info.png`" @click="H5ShareBox = false"></image>
			</view>
			<guaranteeTemplate ref="guartemplate" :guarantee='guarantee' :shipping='shipping'></guaranteeTemplate>
			<!-- #ifndef H5 -->
			<passwordPopup></passwordPopup>
			<!-- #endif -->
		</view>
	</view>
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
	var sysHeight = uni.getSystemInfoSync().statusBarHeight;
	import {
		getSeckillProductDetail,
		getProductParmas,
		getProductCode,
		collectAdd,
		collectDel,
		postCartAdd,
		copyPasswordApi, priceRuleApi, getStoreRecommend
	} from '@/api/store.js';
	import { getUserInfo, imgToBase } from '@/api/user.js';
	import { getCoupons, getShopCoupons } from '@/api/api.js';
	import { mapGetters } from "vuex";
	import { imageBase64 } from "@/api/public";
	import specs from '@/components/specs/index.vue';
	import productConSwiper from '@/components/productConSwiper';
	import productWindow from '@/components/productWindow';
	import copyPassword from '@/components/copyPassword';
	import userEvaluation from '@/components/userEvaluation';
	import freight from '@/components/freight';
	import parameter from '@/components/parameter';
	import serviceGuarantee from '@/components/serviceGuarantee';
	import specSelect from '@/components/specSelect';
	import countDown from '@/components/countDown';
	import home from '@/components/home';
	import { HTTP_REQUEST_URL } from '@/config/app';
	import { silenceBindingSpread, configMap, getCustomer } from "@/utils";
	import parser from "@/components/jyf-parser/jyf-parser";
	import { toLogin } from '@/libs/login.js';
	// #ifndef H5
	import passwordPopup from '@/components/passwordPopup';
	// #endif
	import history from "@/mixins/history";
	import shareScence from "@/libs/spread";
	import guaranteeTemplate from '@/components/freightGuarantee';
	import homeList from '@/components/homeList';
	const app = getApp();
	export default {
		components: {
			// #ifndef H5
			passwordPopup,
			// #endif
			specs,
			parameter,
			freight,
			serviceGuarantee,
			specSelect,
			productConSwiper,
			productWindow,
			userEvaluation,
			home,
			countDown,
			guaranteeTemplate,
			copyPassword,
			"jyf-parser": parser,
			homeList
		},
		mixins: [history],
		data() {
			let that = this;
			return {
				isNodes: 0, //控制什么时候开始抓取元素节点,只要数值改变就重新抓取
				countDownHour: "00",
				countDownMinute: "00",
				countDownSecond: "00",
				datatime: '',
				sysHeight: sysHeight, //系统导航条高度
				//属性是否打开
				coupon: {
					'coupon': false,
					list: [],
				},
				attrTxt: '选择', //属性页面提示
				attrValue: '', //已选属性
				animated: false, //购物车动画
				id: 0, //商品id
				replyCount: 0, //总评论数量
				reply: [], //评论列表
				storeInfo: {
					price: 0,
					ot_price: 0,
					store_name: "",
					sales: 0,
					stock: 0,
				}, //商品详情
				productValue: [], //系统属性
				cart_num: 1, //购买数量
				isOpen: false, //是否打开属性组件
				actionSheetHidden: true,
				posterImageStatus: false,
				storeImage: '', //海报产品图
				PromotionCode: '', //二维码图片
				canvasStatus: false, //海报绘图标签
				posterImage: '', //海报路径
				posterbackgd: '/static/images/posterbackgd.png',
				// uid: 0, //用户uid
				circular: false,
				autoplay: false,
				interval: 3000,
				duration: 500,
				priceRule: "",
				replyChance: 0,
				onceCount: 0,
				posters: false,
				weixinStatus: false,
				attr: {
					cartAttr: false,
					productAttr: [],
					productSelect: {}
				},
				description: '',
				navActive: 0,
				H5ShareBox: false, //公众号分享图片
				activity: [],
				retunTop: true, //顶部返回
				navH: "",
				navList: [],
				opacity: 0,
				scrollY: 0,
				topArr: [],
				toView: '',
				height: 0,
				heightArr: [],
				lock: false,
				scrollTop: 0,
				tagStyle: {
					img: 'width:100%;display:block;'
				},
				// 动画状态
				showAnimate: true,
				domain: HTTP_REQUEST_URL,
				currSpid: "",
				time_id: "",
				codeImg: "",
				videoCoverImg: "",
				shipping: "",
				guarantee: [],
				recommend: [],
				shippingValue: "",
				isCopy: false,
				copyUrl: '',
				services_type: "",
				specsInfo: {
				  show: false,
				  params: []
				},
				currentPage: false,
				homeTop: 59,
				CartCount: 0,
				recommend: [],
				swiperCur: 0,
				swiperHeight: "760",
				homeLeft: 30,
			};
		},
		computed:{
			...configMap(['hide_mer_status','site_name','share_pic'],
			mapGetters(['isLogin','uid','viewColor','diyProduct'])),
		},
		onLoad(options) {
			let that = this;
			if (options.spid) {
				that.currSpid = options.spid
				app.globalData.spid = options.spid;
			}
			var pages = getCurrentPages();
			if (pages.length <= 1) {
				that.retunTop = false
			}
			that.navH = app.globalData.navHeight+10;
			// #ifdef APP-PLUS
			that.homeTop = (that.sysHeight + 8)*2;
			// #endif
			// #ifdef H5
			that.homeTop = 10;
			// #endif
			this.id = options.id;
			this.time_id = options.time_id || ''
			if (options.id) {
				this.id = options.id
			}
			uni.getSystemInfo({
				success: function(res) {
					that.height = res.windowHeight
				},
			});
			//扫码携带参数处理
			// #ifdef MP
			if (options.scene) {
				let value = this.$util.getUrlParams(decodeURIComponent(options.scene));
				if (value.id) options.id = value.id;
				//记录推广人uid
				if (value.spid) {
					app.globalData.spid = value.spid;
					that.currSpid = value.spid
				}
			}
			if (!options.id && !options.scene) {
				return this.$util.Tips({
					title: '缺少参数无法查看商品'
				}, {
					tab: 3,
					url: 1
				});
			} else {
				this.id = options.id
			}
			//记录推广人uid
			if (options.spid) app.globalData.spid = options.spid;
			// #endif
			shareScence(that.currSpid, that.isLogin)
			this.getGoodsDetails();
			that.$store.dispatch("getDiyProduct");
			//#ifdef H5
			this.isLogin && silenceBindingSpread();
			//#endif
		},
		onReady() {
			this.isNodes++;
			this.$nextTick(function() {
				// #ifdef MP
				const menuButton = uni.getMenuButtonBoundingClientRect();
				const query = uni.createSelectorQuery().in(this);
				this.homeLeft = menuButton.left-38+'px';
				query
					.select('#home')
					.boundingClientRect(data => {
						this.homeTop = menuButton.top * 2 + menuButton.height - data.height;
					})
					.exec();
				// #endif
			});
		},
		mounted: function() {},
		show() {},
		/**
		 * 用户点击右上角分享
		 */
		// #ifdef MP
		onShareAppMessage: function() {
			let that = this;
			that.$set(that, 'actionSheetHidden', !that.actionSheetHidden);
			return {
				title: that.storeInfo.store_name || '',
				imageUrl: that.storeInfo.image || '',
				path: '/pages/activity/goods_seckill_details/index?id=' + that.id + '&spid=' + that.uid,
			}
		},
		onShareTimeline: function() {
			let that = this;
			that.$set(that, 'actionSheetHidden', !that.actionSheetHidden);
			return {
				title: that.storeInfo.store_name || '',
				query: {
					id: that.id,
					spid: that.uid
				},
				imageUrl: that.storeInfo.image || ''
			}
		},
		// #endif
		methods: {
			goProDetail(item) {
				uni.redirectTo({
					url: '/pages/goods_details/index?id=' + item.product_id
				})
			},
			goCustomer: function() {
				let that = this;
				if (that.isLogin === false) {
					toLogin()
				} else {
					let mer = that.storeInfo.merchant.services_type
					let data = {
						type: mer.services_type,
						service_phone: mer.service_phone,
						customer_url: mer.mer_customer_url,
						customer_corpId: mer.mer_customer_corpId,
						customer_link: mer.mer_customer_link
					}
					let url = `/pages/chat/customer_list/chat?mer_id=${that.storeInfo.mer_id}&uid=${that.uid}&productId=${that.id}`
					getCustomer(data, url)
				}
			},
			/**获取店铺推荐商品*/
			getRecommendGoods() {
				let that = this
				getStoreRecommend({
					product_id: that.storeInfo.product_id,
					recommend_num: that.diyProduct.recommendNum
				}).then(res => {
					var recommendArr = [];
					that.swiperHeight = (res.data.length>=6 || res.data.length%6>3) ? '760' : '395';
					for(var i=0,len=res.data.length;i<len;i+=6){
						recommendArr.push(res.data.slice(i,i+6));
					}
					that.recommend = recommendArr
					console.log(that.recommend)
				}).catch(err=>{
					that.$util.Tips({
						title: err
					});
				})
			},
			//下拉导航页面跳转
			linkPage(url) {
				if (['/pages/index/index', '/pages/order_addcart/order_addcart',
						'/pages/user/index'
					].indexOf(url) > -1) {
					uni.switchTab({
						url
					})
				} else {
					uni.navigateTo({
						url
					})
				}
				this.currentPage = false
			},
			setShare(value){
				switch (value) {
					case 0:
						this.goCustomer();
						break;
					case 1:
						this.setCollect();
						break;
					case 2:
						this.listenerActionSheet();
						break;
					default:
						break;
				}
			},
			/*底部跳转*/
			goMenu(value) {
				switch (value) {
					case 0:
						uni.navigateTo({
							url: '/pages/store/home/index?id=' + this.storeInfo.mer_id
						});
						break;
					case 1:
						this.goCustomer();
						break;
					case 2:
						uni.switchTab({
							url: '/pages/order_addcart/order_addcart'
						})
						break;
					case 3:
						this.setCollect();
						break;
					case 4:
						this.listenerActionSheet();
						break;
					case 5:
						uni.switchTab({
							url: '/pages/index/index'
						})
						break;
					default:
						break;
				}
			},
			/**查看运费说明*/
			showShip: function() {
				this.$refs.guartemplate.showShippingTel();
			},
			/**查看服务保障*/
			showGuaranee: function() {
				this.$refs.guartemplate.showGuaranteeTel();
			},
			/**查看商品参数*/
			seeSpecs() {
			  this.specsInfo.show = true;
			},
			mySpecs() {
			  this.$set(this.specsInfo, 'show', false);
			},
			/*获取价格说明*/
			getPricrRule() {
				priceRuleApi(this.storeInfo.cate_id).then(res => {
					this.priceRule = res.data
				}).catch(err => {

				});
			},
			/**
			 * 购物车手动填写
			 *
			 */
			iptCartNum: function(e) {
				this.$set(this.attr.productSelect, 'cart_num', e);
			},
			// 后退
			returns: function() {
				uni.navigateBack()
			},
			// 首页
			goHome() {
				uni.switchTab({
					url: '/pages/index/index'
				});
			},
			showNav() {
				this.currentPage = !this.currentPage;
			},
			hideNav() {
				this.currentPage = false;
			},
			tap: function(index) {
				var id = "past" + index;
				var index = index;
				var that = this;
				this.$set(this, 'toView', id);
				this.$set(this, 'navActive', index);
				this.$set(this, 'lock', true);
				this.$set(this, 'scrollTop', index > 0 ? that.topArr[index] - (app.globalData.navHeight / 2) : that.topArr[index]);
			},
			scroll: function(e) {
				var that = this,
					scrollY = e.detail.scrollTop;
				var opacity = scrollY / 200;
				opacity = opacity > 1 ? 1 : opacity;
				that.$set(that, 'showAnimate', false);
				that.$set(that, 'opacity', opacity);
				that.$set(that, 'scrollY', scrollY);
				if (that.lock) {
					that.$set(that, 'lock', false)
					return;
				}
				for (var i = 0; i < that.topArr.length; i++) {
					if (scrollY < that.topArr[i] - (app.globalData.navHeight / 2) + that.heightArr[i]) {
						that.$set(that, 'navActive', i)
						break
					}
				}
			},
			/**
			 * 获取购物车数量
			 * @param boolean 是否展示购物车动画和重置属性
			 */
			getCartCount: function() {
				let that = this;
				if(that.isLogin) {
					that.$util.getCartNum(that.isLogin,function(count){
						that.CartCount = count;
					})
				}
			},
			/**
			 * 购物车数量加和数量减
			 *
			 */
			ChangeCartNum: function(changeValue) {
				//changeValue:是否 加|减
				//获取当前变动属性
				let productSelect = this.productValue[this.attrValue];
				//如果没有属性,赋值给商品默认库存
				if (productSelect === undefined && !this.attr.productAttr.length)
					productSelect = this.attr.productSelect;
				//无属性值即库存为0；不存在加减；
				if (productSelect === undefined) return;
				let stock = productSelect.stock || 0;
				let num = this.attr.productSelect;
				if (changeValue) {
					num.cart_num++;
					if (num.cart_num > stock) {
						this.$set(this.attr.productSelect, "cart_num", stock);
						this.$set(this, "cart_num", stock);
					}
					if(num.cart_num > this.onceCount && this.onceCount>0){
						this.$set(this.attr.productSelect, "cart_num", this.onceCount);
						this.$set(this, "cart_num", this.onceCount);
						return this.$util.Tips({
							title: "秒杀时间段内最多购买"+this.onceCount+"件！"
						});
					}
				} else {
					num.cart_num--;
					if (num.cart_num < 1) {
						this.$set(this.attr.productSelect, "cart_num", 1);
						this.$set(this, "cart_num", 1);
					}
				}
			},
			attrVal(val) {
				this.$set(this.attr.productAttr[val.indexw], 'index', this.attr.productAttr[val.indexw].attr_values[val.indexn]);
			},
			/**
			 * 属性变动赋值
			 *
			 */
			ChangeAttr: function(res) {
				let productSelect = this.productValue[res];
				if (productSelect && productSelect.stock > 0) {
					this.$set(this.attr.productSelect, "image", productSelect.image);
					this.$set(this.attr.productSelect, "price", productSelect.price);
					this.$set(this.attr.productSelect, "stock", productSelect.stock);
					this.$set(this.attr.productSelect, "unique", productSelect.unique);
					this.$set(this.attr.productSelect, "cart_num", 1);
					this.$set(this, "attrValue", res);
					this.$set(this, "attrTxt", "选择");
				} else {
					this.$set(this.attr.productSelect, "image", this.storeInfo.image);
					this.$set(this.attr.productSelect, "price", this.storeInfo.price);
					this.$set(this.attr.productSelect, "stock", 0);
					this.$set(this.attr.productSelect, "unique", "");
					this.$set(this.attr.productSelect, "cart_num", 0);
					this.$set(this, "attrValue", "");
					this.$set(this, "attrTxt", "选择");
				}
			},
			/**
			 * 获取产品详情
			 *
			 */
			getGoodsDetails: function() {
				uni.showLoading({
					title: '加载中',
					mask: true
				});
				let that = this;
				getSeckillProductDetail(that.id,{seckill_time_id:that.time_id,pid:that.currSpid }).then(async res => {
					uni.hideLoading();
					let storeInfo = res.data;
					if (storeInfo.video_link && storeInfo.slider_image.length > 1) {
						this.videoCoverImg = storeInfo.slider_image[0]
						storeInfo.slider_image.splice(0, 1)
					} else if (storeInfo.video_link && storeInfo.slider_image.length === 1) {
						this.videoCoverImg = storeInfo.slider_image[0]
					}
					that.$set(that, 'storeInfo', res.data);
					that.$set(that, 'description', storeInfo.content);
					that.$set(that, 'reply', res.data.topReply ? [res.data.topReply] : []);
					that.$set(that, 'replyCount', res.data.replayData && res.data.replayData.count);
					that.$set(that, 'replyChance', res.data.replayData && res.data.replayData.rate);
					that.$set(that.attr, 'productAttr', res.data.attr);
					that.$set(that, 'productValue', res.data.sku);
					that.$set(that, 'onceCount', res.data.once_pay_count);
					that.$set(that, 'activity', res.data.activity ? res.data.activity : []);
					that.$set(that, 'datatime', res.data.stop ? res.data.stop : []);
					that.$set(that, 'guarantee', res.data.guaranteeTemplate ? res.data.guaranteeTemplate : []);
					uni.setNavigationBarTitle({
						title: storeInfo.store_name.substring(0, 7) + "..."
					})
					that.$set(that, 'storeImage', that.storeInfo.image);
					getProductParmas(that.id).then((res) => {
						that.$set(that, 'description', res.data.content);
						if (that.description.type == 0) {
							that.description.content = that.description.content.replace(/<img/gi,'<img style="max-width:100%;height:auto;float:left;display:block"');
						}
						that.$set(that, 'shippingValue', res.data.temp ? res.data.temp.name : '');
						that.$set(that, 'shipping', res.data.temp ? res.data.temp.info : '');
						that.$set(that.specsInfo, 'params', res.data.params);
						that.$set(that.storeInfo, 'merchant', res.data.merchant);
						that.$set(that.storeInfo, 'spu_id', res.data.spu_id);
						that.$set(that.storeInfo, 'community', res.data.community);
						that.$set(that.storeInfo, 'atmosphere_pic', res.data.atmosphere_pic);
					})
					// #ifdef H5
					if (that.isLogin) {
						that.ShareInfo();
					};
					// #endif
					setTimeout(function() {
						that.infoScroll();
					}, 500);
					that.DefaultSelect();
					that.getPricrRule(that.storeInfo.cate_id);
					that.getRecommendGoods();
					that.getCartCount();
				}).catch(err => {
					//状态异常返回上级页面
					return that.$util.Tips({
						title: err
					}, {
						tab: 3,
						url: 1
					});
				})
			},
			infoScroll: function() {
				var that = this,
					topArr = [],
					heightArr = [];
				for (var i = 0; i < that.navList.length; i++) { //productList
					//获取元素所在位置
					var query = uni.createSelectorQuery().in(this);
					var idView = "#past" + i;
					query.select(idView).boundingClientRect();
					query.exec(function(res) {
						var top = res[0].top;
						var height = res[0].height;
						topArr.push(top);
						heightArr.push(height);
						that.$set(that, 'topArr', topArr);
						that.$set(that, 'heightArr', heightArr);
					});
				};
			},
			/**
			 * 默认选中属性
			 *
			 */
			DefaultSelect: function() {
				let productAttr = this.attr.productAttr;
				let value = [];
				let arr = []
				let unSortArr = []
				for (var key in this.productValue) {
					if (this.productValue[key].stock > 0) {
						value = this.attr.productAttr.length ? key.split(",") : [];
						break;
					}
				}
				for (let i = 0; i < productAttr.length; i++) {
					this.$set(productAttr[i], "index", value[i]);
				}
				//sort();排序函数:数字-英文-汉字；
				let productSelect = this.productValue[value.join(",")];
				if (productSelect && productAttr.length) {
					this.$set(this.attr.productSelect,"store_name", this.storeInfo.store_name);
					this.$set(this.attr.productSelect, "image", productSelect.image);
					this.$set(this.attr.productSelect, "price", productSelect.price);
					this.$set(this.attr.productSelect, "stock", productSelect.stock);
					this.$set(this.attr.productSelect, "unique", productSelect.unique);
					this.$set(this, "attrValue", value.join(","));
					this.$set(this, "attrTxt", "选择");
					if (productSelect.stock == 0) {
						this.$set(this.attr.productSelect, "cart_num", 0);
					} else {
						this.$set(this.attr.productSelect, "cart_num", 1);
					}
				} else if (!productSelect && productAttr.length) {
					this.$set(
						this.attr.productSelect,
						"store_name",
						this.storeInfo.store_name
					);
					this.$set(this.attr.productSelect, "image", this.storeInfo.image);
					this.$set(this.attr.productSelect, "price", this.storeInfo.price);
					this.$set(this.attr.productSelect, "stock", 0);
					this.$set(this.attr.productSelect, "unique", "");
					this.$set(this.attr.productSelect, "cart_num", 0);
					this.$set(this, "attrValue", "");
					this.$set(this, "attrTxt", "选择");
				} else if (!productSelect && !productAttr.length) {
					this.$set(
						this.attr.productSelect,
						"store_name",
						this.storeInfo.store_name
					);
					this.$set(this.attr.productSelect, "image", this.storeInfo.image);
					this.$set(this.attr.productSelect, "price", this.storeInfo.price);
					this.$set(this.attr.productSelect, "stock", this.storeInfo.stock);
					this.$set(this.attr.productSelect, "unique", this.storeInfo.unique || "");
					this.$set(this.attr.productSelect, "cart_num", 1);
					this.$set(this, "attrValue", "");
					this.$set(this, "attrTxt", "选择");
				} else if (productSelect && !productAttr.length) {
					this.$set(this.attr.productSelect, "store_name", this.storeInfo.store_name);
					this.$set(this.attr.productSelect, "image", productSelect.image);
					this.$set(this.attr.productSelect, "price", productSelect.price);
					this.$set(this.attr.productSelect, "stock", productSelect.stock);
					this.$set(this.attr.productSelect, "unique", productSelect.unique);
					this.$set(this, "attrValue", value.join(","));
					this.$set(this, "attrTxt", "选择");
					if (productSelect.stock == 0) {
						this.$set(this.attr.productSelect, "cart_num", 0);
					} else {
						this.$set(this.attr.productSelect, "cart_num", 1);
					}
				}
			},
			/*
			 *  单独购买
			 */
			openAlone: function() {
				uni.navigateTo({
					url: `/pages/goods_details/index?id=${this.storeInfo.old_product_id}`
				})
			},
			/**
			 *
			 *
			 * 收藏商品
			 */
			setCollect: function() {
				if (this.isLogin === false) {
					toLogin()
				} else {
					let that = this;
					if (this.storeInfo.isRelation) {
						collectDel({
							type: 1,
							type_id: this.id
						}).then(res => {
							that.$util.Tips({
								title: '已取消收藏'
							});
							that.$set(that.storeInfo, 'isRelation', !that.storeInfo.isRelation);
						})
					} else {
						collectAdd({
							type_id: this.id,
							type: 1
						}).then(res => {
							that.$util.Tips({
								title: '收藏成功'
							});
							that.$set(that.storeInfo, 'isRelation', !that.storeInfo.isRelation);
						})
					}
				}
			},
			/**
			 * 打开属性插件
			 */
			selecAttr: function() {
				this.$set(this.attr, 'cartAttr', true);
				this.$set(this, 'isOpen', true);
			},
			onMyEvent: function() {
				this.$set(this.attr, 'cartAttr', false);
				this.$set(this, 'isOpen', false);
			},
			/**
			 * 打开属性加入购物车
			 *
			 */
			joinCart: function(e) {
				//是否登录
				if (this.isLogin === false) {
					toLogin()
				} else {
					this.goCat();
				}
			},
			/*
			 * 加入购物车
			 */
			goCat: function(news) {
				let that = this,
					productSelect = that.productValue[this.attrValue];
				//打开属性
				if (that.attrValue) {
					//默认选中了属性，但是没有打开过属性弹窗还是自动打开让用户查看默认选中的属性
					that.attr.cartAttr = !that.isOpen ? true : false;
				} else {
					if (that.isOpen) that.attr.cartAttr = true;
					else that.attr.cartAttr = !that.attr.cartAttr;
				}
				//只有关闭属性弹窗时进行加入购物车
				if (that.attr.cartAttr === true && that.isOpen === false)
					return (that.isOpen = true);
				//如果有属性,没有选择,提示用户选择
				if (
					that.attr.productAttr.length &&
					that.isOpen === true &&
					productSelect.stock == 0
				)
					return that.$util.Tips({
						title: "产品库存不足，请选择其它"
					});
				let q = {
					is_new: 1,
					product_id: that.id,
					cart_num: that.attr.productSelect.cart_num,
					product_attr_unique: that.attr.productSelect !== undefined ? that.attr.productSelect.unique : "",
					product_type: 1,
					spread_id: this.currSpid
				};
				postCartAdd(q)
					.then(function(res) {
						that.isOpen = false;
						that.attr.cartAttr = false;
						uni.navigateTo({
							url: '/pages/users/order_confirm/index?cartId=' + res.data.cart_id + '&seckillId=' + that.id
						});
					})
					.catch(res => {
						that.isOpen = false;
						return that.$util.Tips({
							title: res
						});
					});
			},
			/**
			 * 立即购买
			 */
			goBuy: function(e) {
				if (this.isLogin === false) {
					toLogin()
				} else {
					this.goCat(true);
				}
			},
			/**
			 * 分享打开
			 *
			 */
			listenerActionSheet: function() {
				// #ifdef H5
				if (this.$wechat.isWeixin() === true) {
					this.weixinStatus = true;
				}
				// #endif
				this.posters = true;
			},
			// 分享关闭
			listenerActionClose: function() {
				this.posters = false;
			},
			//隐藏海报
			posterImageClose: function() {
				this.posterImageStatus = false
			},
			//替换安全域名
			setDomain: function(url) {
				url = url ? url.toString() : '';
				//本地调试打开,生产请注销
				if (url.indexOf("https://") > -1) return url;
				else return url.replace('http://', 'https://');
			},
			/**
			 * 获取产品分销二维码
			 * @param function successFn 下载完成回调
			 *
			 */
			downloadFilePromotionCode() {
				let that = this;
				let type;
				// #ifndef MP
				type = 'wechat'
				// #endif
				// #ifdef MP
				type = 'routine'
				// #endif
				getProductCode(that.id, {
					type: type,
					product_type: 1
				}).then(async res => {
					that.codeImg = res.data.url;
					that.$nextTick(function(){
						that.goPoster();
					})
				}).catch(err => {
					that.$util.Tips({
						title: err
					});
					that.posters = false;
				});
			},
			async imgToBase(url) {
				let res = await imgToBase({
					image: url
				})
				return res.data.image
			},
			// 小程序关闭分享弹窗；
			goFriend: function() {
				this.posters = false;
			},
			/**
			 * 生成海报
			 */
			async goPoster() {
				if (this.posterImage) {
					this.posterImageStatus = true
					this.posters = false
					return
				}
				let that = this;
				let arr2
				that.posters = false;
				that.$set(that, 'canvasStatus', true);
				uni.showLoading({
					title: '海报生成中',
					mask: true
				});
				// #ifdef MP || APP-PLUS
				arr2 = [that.posterbackgd, await that.fileStoreImage(that.storeImage), await that.fileStoreImage(
					that.codeImg), await that.fileStoreImage(that.share_pic)];
				// #endif
				// #ifdef H5
				arr2 = [that.posterbackgd, await that.imgToBase(that.storeImage), await that.imgToBase(that.codeImg), await that.imgToBase(that.share_pic)];
				// #endif
				that.$util.goodsPosterCanvas(arr2, that.storeInfo.store_name, that.storeInfo.price, that.site_name, that.storeInfo.ot_price, function(tempFilePath) {
					that.$set(that, 'posterImage', tempFilePath);
					that.$set(that, 'posterImageStatus', true);
					that.$set(that, 'canvasStatus', false);
					that.$set(that, 'actionSheetHidden', !that.actionSheetHidden);
				}, (err) => {
					that.$set(that, 'canvasStatus', false);
				});
			},
			//图片转符合安全域名路径
			fileStoreImage(url) {
				if(url){
					// #ifdef MP
					let ishttps = url.split('//')[0] == 'https:'
					if (!ishttps) {
						url = 'https://'+url.split('//')[1]
					}
					// #endif
					return new Promise((resolve, reject) => {
						let that = this;
						uni.downloadFile({
							url: url,
							success: function(res) {
								resolve(res.tempFilePath);
							},
							fail: function(error) {
								console.log(error)
								return that.$util.Tips({
									title: '请检查图片地址是否在合法域名内'
								});
							}
						});
					})
				}
			},
			/*
			 * 保存到手机相册
			 */
			savePosterPath: function() {
				let that = this;
				// #ifdef MP
				uni.getSetting({
					success(res) {
						if (!res.authSetting['scope.writePhotosAlbum']) {
							uni.authorize({
								scope: 'scope.writePhotosAlbum',
								success() {
									uni.saveImageToPhotosAlbum({
										filePath: that.posterImage,
										success: function(res) {
											that.posterImageClose();
											that.$util.Tips({
												title: '保存成功',
												icon: 'success'
											});
										},
										fail: function(res) {
											that.$util.Tips({
												title: '保存失败'
											});
										}
									})
								}
							})
						} else {
							uni.saveImageToPhotosAlbum({
								filePath: that.posterImage,
								success: function(res) {
									that.posterImageClose();
									that.$util.Tips({
										title: '保存成功',
										icon: 'success'
									});
								},
								fail: function(res) {
									that.$util.Tips({
										title: '保存失败'
									});
								},
							})
						}
					}
				})
				// #endif
				// #ifdef APP-PLUS
				uni.saveImageToPhotosAlbum({
					filePath: that.posterImage,
					success: function(res) {
						that.posterImageClose();
						that.$util.Tips({
							title: '保存成功',
							icon: 'success'
						});
					},
					fail: function(res) {
						that.$util.Tips({
							title: '保存失败'
						});
					},
				})
				// #endif
			},
			//复制口令
			copyPwd(){
				let that = this;
				copyPasswordApi({
					id: that.id,
					product_type: 1
				}).then(async res => {
					that.copyUrl = res.data.str;
					that.posters = false
					that.isCopy = true;
				})
			},
			closeCopy(){
				this.isCopy = false
			},
			//#ifdef H5
			ShareInfo() {
				let data = this.storeInfo;
				let href = location.href;
				if (this.$wechat.isWeixin()) {
					getUserInfo().then(res => {
						href =
							href.indexOf("?") === -1 ?
							href + "?spid=" + res.data.uid :
							href + "&spid=" + res.data.uid;

						let configAppMessage = {
							desc: data.store_info,
							title: data.store_name,
							link: href,
							imgUrl: data.image
						};
						this.$wechat.wechatEvevt([
							"updateAppMessageShareData",
							"updateTimelineShareData",
							"onMenuShareAppMessage",
							"onMenuShareTimeline"
						], configAppMessage).then(res => {}).catch(err => {
							console.log(err);
						})
					});
				}
			},
			//#endif
		},
	}
</script>

<style scoped lang="scss">
	.font-bg-red{
		position: relative;
		top: -3rpx;
		background-color: var(--view-theme);
	}
	.product-con .nav {
		background-color: var(--view-theme);
		height: 152rpx;
		padding-bottom: 50rpx;
		margin-bottom: -50rpx;
	}
	.t-color {
		color: var(--view-theme);
	}
	.product-con .nav .money .money-text {
		font-size: 26rpx;
		margin-right: 10rpx;
	}
	.product-con .nav .money .y-money {
		font-size: 26rpx;
		margin-left: 16rpx;
		text-decoration: line-through;
	}
	.product-con .nav .time {
		font-size: 20rpx;
		color: #fff;
		text-align: center;
		>view{
			margin-bottom: 6rpx;
		}
	}
	.product-con .nav .iconfont {
		color: #fff;
		font-size: 30rpx;
		margin-left: 20rpx;
	}
	.product-con .wrapper {
		padding: 32rpx 30rpx;
		width: 100%;
		box-sizing: border-box;
		background: transparent;
	}
	.product-con .wrapper .introduce {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		margin-bottom: 20rpx;
		.title{
			width: 560rpx;
		}
	}
	.product-con .wrapper .introduce .infor {
		width: 570rpx;
	}
	.product-con .wrapper .introduce .iconfont {
		font-size: 37rpx;
		color: #515151;
		&.icon-ic_star1 {
			color: var(--view-theme);
		}
	}
	.product-con .wrapper .label {
		margin: 18rpx 0 0 0;
		font-size: 24rpx;
		color: #82848f;
	}
	.product-con .wrapper .label .stock {
		width: 255rpx;
		margin-right: 28rpx;
	}
	.mask {
		z-index: 300 !important;
	}
	.generate-posters .item {
		/* #ifdef H5 */
		flex: 50%;
		/* #endif */
		/* #ifndef H5 */
		flex: 33.33%;
		/* #endif */
		text-align: center;
		font-size: 30rpx;
		&.item3{
			flex: 33.33%;
		}
	}
	.product-con .mask {
		z-index: 88;
	}
	.product-con .footer {
		padding: 0 20rpx 0 40rpx;
		&.footpl{
			padding-left: 70rpx;
		}
	}
	.product-con .footer .bnt {
		min-width: 444rpx;
		height: 76rpx;
	}
	.product-con .footer .bnt .bnts {
		width: 222rpx;
		text-align: center;
		line-height: 76rpx;
		color: #fff;
		font-size: 28rpx;
	}
	.product-con .footer .bnt .joinCart {
		border-radius: 60rpx 0 0 60rpx;
		background-image: linear-gradient(to right, var(--view-bntColor11) 0%, var(--view-bntColor12) 100%);
	}
	.product-con .footer .bnt .buy {
		border-radius: 0 60rpx 60rpx 0;
		background-image: linear-gradient(to right, var(--view-bntColor21) 0%, var(--view-bntColor22) 100%);
	}
	.product-con .footer .bnt .joinCart[disabled] {
		background: #bbb;
	}
	.product-con .footer .bnt .buy[disabled] {
		background: #bbb;
	}
	button {
		padding: 0;
		margin: 0;
		line-height: normal;
		background-color: #fff;
	}
	button::after {
		border: 0;
	}
	.canvas {
		z-index: 300;
		width: 750px;
		height: 1190px;
	}
</style>
/style>
>
