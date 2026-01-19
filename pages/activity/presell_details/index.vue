<template>
	<view :style="viewColor">
		<view class="product-con">
			<view class="pos-fixed w-100 detail-header" id="home" :style="{ top: homeTop + 'rpx' }">
				<view class="head-wrapper">
					<view class="head-menu">
						<view class='iconfont icon-ic_left' @click="returns"></view>
						<view class="iconfont icon-ic_menu3" @click="showNav"></view>
					</view>
					<view v-if="diyProduct.openShare" class="share-icon" :style="{ left: homeLeft }" @click="shareProduct">
						<view class="iconfont icon-ic_transmit1"></view>
					</view>
				</view>
			</view>
			<!-- 导航小图标 -->
			<homeList
				:navH="navH"
				:currentPage="currentPage"
				:sysHeight="sysHeight"
				:openNavList="diyProduct.navList"></homeList>
			<view>
				<scroll-view>
					<view id="past0">
						<!-- #ifdef MP || APP-PLUS -->
						<view class="" :style="'width:100%;' + 'height:'+sysHeight + 'px'"></view>
						<!-- #endif -->
						<productConSwiper class="skeleton-rect" :imgUrls="storeInfo.slider_image" :videoCoverImg="videoCoverImg" :videoline="storeInfo.video_link" :showDot="diyProduct.swiperDot"></productConSwiper>
						<view v-if="storeInfo.atmosphere_pic" :style="{ backgroundImage: `url(${storeInfo.atmosphere_pic})` }" class="nav acea-row row-between-wrapper boder-44 pos-rel">
							<view class='money skeleton-rect'>
								<priceFormat :price="presellInfo.price" weight intSize="48" floatSize="32" labelSize="32"></priceFormat>
							</view>
						</view>
						<view class="swiper-bg pos-rel">
							<view class="detail-count">
								<view class='wrapper pad30'>
									<view :class="{ atmosphere: storeInfo.atmosphere_pic }" class='share acea-row row-between row-bottom' style="margin: 0;">
										<view v-if="storeInfo.atmosphere_pic" class='introduce skeleton-rect'>
											<text v-if="(storeInfo.merchant && storeInfo.merchant.type_name)" class="font-bg-red">{{storeInfo.merchant.type_name}}</text>
											<text v-else-if="(storeInfo.merchant && storeInfo.merchant.is_trader)" class="font-bg-red">自营</text>
											{{presellInfo.store_name}}
										</view>
										<view v-else class='money p-color skeleton-rect'>
											<priceFormat :price="presellInfo.price" weight intSize="48" floatSize="32" labelSize="32"></priceFormat>
											<text class="price_text" :style="{ backgroundImage: `url(${domain}/static/images/price_text.png)` }">预售价</text>
										</view>
										<view v-if="diyProduct.shareList.length>0" class="fenxiang_btn">
											<block v-for="(item,index) in diyProduct.shareList" :key="index">
												<view v-if="diyProduct.shareConfig.includes(item.value)" @click="setShare(item.value)"><text class="iconfont" :class="[`${item.icon}`, { 'icon-ic_star1': storeInfo.isRelation&&item.value==1 }]"></text><br/>{{item.label}}</view>
											</block>
										</view>
									</view>
									<view class='label acea-row skeleton-rect'>
										<view v-show="diyProduct.isOpen.includes(0)" class="line-through">¥{{storeInfo.price || ''}}</view>
										<view v-show="diyProduct.isOpen.includes(1)" style="margin-left: 30rpx;">已预定:{{presellInfo.seles}}{{ storeInfo.unit_name }}</view>
									</view>
									<view v-if="!storeInfo.atmosphere_pic" class='introduce skeleton-rect'>
										<text v-if="(storeInfo.merchant && storeInfo.merchant.type_name)" class="font-bg-red">{{storeInfo.merchant.type_name}}</text>
										<text v-else-if="(storeInfo.merchant && storeInfo.merchant.is_trader)" class="font-bg-red">自营</text>
										{{presellInfo.store_name}}</view>
									<view class="presell_count">
										<view class="acea-row row-middle">
											<view>预售活动时间：</view>
											<view v-if="presellInfo.start_time && presellInfo.end_time" class="presell_time">
												{{ new Date(presellInfo.start_time.replace(/-/g,"/")).getMonth()+1 }}月{{ new Date(presellInfo.start_time.replace(/-/g,"/")).getDate() }}日{{ new Date(presellInfo.start_time.replace(/-/g,"/")).getHours() }}时{{ new Date(presellInfo.start_time.replace(/-/g,"/")).getMinutes()}}分
												<span class='area_line'>~</span>
												{{ new Date(presellInfo.end_time.replace(/-/g,"/")).getMonth()+1 }}月{{ new Date(presellInfo.end_time.replace(/-/g,"/")).getDate() }}日{{ new Date(presellInfo.end_time.replace(/-/g,"/")).getHours() }}时{{ new Date(presellInfo.end_time.replace(/-/g,"/")).getMinutes()}}分
											</view>
										</view>
										<view v-if="presellInfo.presell_type === 2" class="acea-row row-middle">
											<view>支付尾款时间：</view>
											<view v-if="presellInfo.final_start_time && presellInfo.final_end_time" class="presell_time">
												{{ new Date(presellInfo.final_start_time.replace(/-/g,"/")).getMonth()+1 }}月{{ new Date(presellInfo.final_start_time.replace(/-/g,"/")).getDate() }}日{{ new Date(presellInfo.final_start_time.replace(/-/g,"/")).getHours() }}时{{ new Date(presellInfo.final_start_time.replace(/-/g,"/")).getMinutes()}}分
												<span class='area_line'>~</span>
												{{ new Date(presellInfo.final_end_time.replace(/-/g,"/")).getMonth()+1 }}月{{ new Date(presellInfo.final_end_time.replace(/-/g,"/")).getDate() }}日{{ new Date(presellInfo.final_end_time.replace(/-/g,"/")).getHours() }}时{{ new Date(presellInfo.final_end_time.replace(/-/g,"/")).getMinutes()}}分
											</view>
										</view>
										<view v-if="presellInfo.delivery_type == 1" class="acea-row row-middle">
											<text class="iconfont icon-icon_clock-2"></text>
											<view v-if="presellInfo.presell_type==1" class="presell_time">支付成功后{{ presellInfo.delivery_day }}天内发货</view>
											<view v-if="presellInfo.presell_type==2" class="presell_time">付尾款成功后{{ presellInfo.delivery_day }}天内发货</view>
										</view>
										<view v-if="presellInfo.delivery_type == 2">
											<view>预计发货时间：</view>
											<view class="presell_time">预售结束后{{ presellInfo.delivery_day }}天内发货</view>
										</view>
									</view>
								</view>
							</view>
							<view v-if="(diyProduct.showCoupon==1 && coupon.list.length > 0) || diyProduct.serviceList.length>0" class="pad20">
								<view v-if="diyProduct.showCoupon==1 && coupon.list.length > 0" class='coupon acea-row row-between-wrapper skeleton-rect boder-24 bg-f' @click='couponTap'>
									<view class='hide line1 acea-row'>
										优惠券：
										<view class='activity' v-for="(item,index) in coupon.list" :key="index">满{{item.use_min_price}}减{{item.coupon_price}}</view>
									</view>
									<view class='iconfont icon-ic_rightarrow'></view>
								</view>
								<view v-if="diyProduct.serviceList.length>0" class="bg-f boder-24 mt20">
									<block v-for="(item,index) in diyProduct.serviceList" :key="index">
										<specSelect v-if="item.props == 'specSelect' && diyProduct.showService.includes(item.value)" :attrTxt="attrTxt" :attrValue="attrValue" @selecAttr="selecAttr"></specSelect>
										<freight v-if="item.props == 'freight' && diyProduct.showService.includes(item.value)" :shippingValue="shippingValue" :shipping="shipping" @showShip="showShip"></freight>
										<serviceGuarantee v-if="item.props == 'serviceGuarantee' && diyProduct.showService.includes(item.value)" :guarantee="guarantee" @showGuaranee="showGuaranee"></serviceGuarantee>
										<parameter v-if="item.props == 'parameter' && diyProduct.showService.includes(item.value)" :specsInfo="specsInfo" @seeSpecs="seeSpecs"></parameter>
									</block>

								</view>
								<!--定金预售流程-->
								<view v-if="presellInfo.presell_type === 2" class='acea-row row-between-wrapper wrapper presell_process bg-f boder-24'>
									<view>流程：
										<view class='process_count'>
											<view class="process_line"></view>
											<span class="text_line text_line1"><text>定金</text></span>
											<span class="text_line text_line2"><text>尾款</text></span>
											<span class="text_line text_line3"><text>发货</text></span>
										</view>
									</view>
								</view>
								<view class='userEvaluation boder-24' id="past1" v-if="replyCount && replyCount>0 && diyProduct.showReply==1">
									<view class='title acea-row row-between-wrapper'>
										<view>用户评价({{replyCount}})</view>
										<navigator class='praise' hover-class='none' :url='"/pages/users/goods_comment_list/index?product_id="+storeInfo.product_id'>
											<text class='t-color'>{{replyChance}}</text>好评率
											<text class='iconfont icon-ic_rightarrow'></text>
										</navigator>
									</view>
									<block v-if="replyCount">
										<userEvaluation :reply="reply"></userEvaluation>
									</block>
								</view>
								<!-- 商铺信息 -->
								<view v-if="hide_mer_status == 0 && storeInfo.merchant" class="store-wrapper bg-f boder-24">
									<view v-if="diyProduct.showStore==1" class="store-hd">
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
											<navigator :url="'/pages/store/home/index?id='+storeInfo.mer_id" class="link" hover-class="none">进店</navigator>
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
									<view v-if="recommend && recommend.length > 0 && diyProduct.showRecommend==1" class="con-box">
										<view class="acea-row row-between">
											<view class="title">店铺推荐</view>
										</view>
										<view class="swiper page_swiper">
											<swiper
											 indicator-dots="true"
											 :autoplay="false"
											 :circular="circular"
											 :interval="interval"
											 :duration="duration"
											 :current="swiperCur"
											 style="750rpx;"
											 >
												<block v-for="(item,index) in recommend" :key="index">
													<swiper-item class="swiper-item">
														<view class="img-box">
																<view class="img-item" v-for="(itm,idx) in item" :key="idx" @click="goProDetail(itm)">
																	<image :src="itm.image"></image>
																	<view class="txt">
																		<view class="title line1">{{itm.store_name}}</view>
																		<view class="price">
																			<text>¥</text>{{itm.price}}
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
									<view class='title'>产品介绍</view>
									<view class='conter' v-if="description">
										<jyf-parser :domain="domain" :html="description.content" ref="article" :tag-style="tagStyle"></jyf-parser>
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
								<view v-if="presellInfo && presellInfo.presell_type === 2 && presellInfo.final_end_time" class="presell-content-height"></view>
								<view v-else class="content-height"></view>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
			<view class='footer_count'>
				<view v-if="presellInfo && presellInfo.presell_type === 2 && presellInfo.final_end_time" class="presell_desc">
					<text v-if="presellInfo.end_time" class='iconfont icon-icon_tip'></text>
					定金支付时间{{new Date(presellInfo.end_time.replace(/-/g,"/")).getMonth()+1 }}月{{ new Date(presellInfo.end_time.replace(/-/g,"/")).getDate() }}日{{ new Date(presellInfo.end_time.replace(/-/g,"/")).getHours() }}时{{ new Date(presellInfo.end_time.replace(/-/g,"/")).getMinutes()}}分结束
					<text>{{ presellInfo.delivery_type === 1 ? '   付尾款后' : '   活动结束后' }}{{ presellInfo.delivery_day }}天内发货</text>
				</view>
				<view class="acea-row row-between-wrapper footer" :class="{'noborder' : presellInfo.presell_type === 2, 'footpl':hide_mer_status==1}">
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
						<form @submit="goBuy" report-submit='true' v-if="attr.productSelect && presellInfo.presell_status == 1">
							<button v-if="attr.productSelect.stock == 0" class='buy bnts' :class="'virtual_buy virtual_buy'+diyProduct.menuList.length" form-type="submit" disabled>商品已售罄</button>
							<button v-else class='buy bnts' :class="'virtual_buy virtual_buy'+diyProduct.menuList.length" form-type="submit">{{ presellInfo.presell_type === 1 ? "立即支付" : "立即支付定金："+minNum+'元起'  }}</button>
						</form>
						<form @submit="goBuy" report-submit='true' v-if="attr.productSelect && presellInfo.presell_status == 2">
							<button class='buy bnts' :class="'virtual_buy virtual_buy'+diyProduct.menuList.length" form-type="submit" disabled>已结束</button>
						</form>
						<form @submit="goBuy" report-submit='true' v-if="attr.productSelect && presellInfo.presell_status == 0">
							<button class='buy bnts' :class="'virtual_buy virtual_buy'+diyProduct.menuList.length" form-type="submit" disabled>未开始</button>
						</form>
					</view>
				</view>
			</view>
			<block v-if="sharePacket.max&&sharePacket.max>0">
				<shareRedPackets :sharePacket="sharePacket" @listenerActionSheet="listenerActionSheet" @closeChange="closeChange"
				 :showAnimate="showAnimate" @boxStatus="boxStatus"></shareRedPackets>
			</block>
			<!-- 组件 -->
			<productWindow
			:attr="attr"
			:isShow='1'
			:iSplus='1'
			:isPresell='1'
			:presell_type="presellInfo.presell_type"
			:image="storeInfo.image"
			:isCustom="false"
			 @myevent="onMyEvent"
			 @ChangeAttr="ChangeAttr"
			 @ChangeCartNum="ChangeCartNum"
			 @attrVal="attrVal"
			 @iptCartNum="iptCartNum"
			 id='product-window'></productWindow>
			<block v-if="coupon.coupon">
				<couponListWindow :showTitle="0" :isShop="1" :coupon='coupon' @ChangCouponsClose="ChangCouponsClose" @ChangCoupons="ChangCoupons"
				 @ChangCouponsUseState="ChangCouponsUseState"></couponListWindow>
			</block>
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
					<view>生成口令</view>
				</button>
			</view>
			<view class="mask" v-if="posters" @click="listenerActionClose"></view>
			<view class="mask_transparent" v-if="currentPage" @touchmove="hideNav" @click="hideNav()"></view>
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
			<canvas class="canvas" canvas-id='myCanvas' v-if="canvasStatus"></canvas>
			<!-- 发送给朋友图片 -->
			<view class="share-box" v-if="H5ShareBox">
				<image :src="`${domain}/static/images/share-info.png`" @click="H5ShareBox = false"></image>
			</view>
			<guaranteeTemplate ref="guartemplate" :guarantee='guarantee' :shipping='shipping'></guaranteeTemplate>
			<!-- 商品参数 -->
			<specs :specsInfo="specsInfo" @myevent="mySpecs"></specs>
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
		getPresellProductDetail,
		getProductCode,
		collectAdd,
		collectDel,
		postCartAdd,
		copyPasswordApi, priceRuleApi, getStoreRecommend
	} from '@/api/store.js';
	import { getUserInfo, imgToBase } from '@/api/user.js';
	import { getShopCoupons } from '@/api/api.js';
	import { mapGetters } from "vuex";
	import { imageBase64 } from "@/api/public";
	import specs from '@/components/specs/index.vue';
	import freight from '@/components/freight';
	import parameter from '@/components/parameter';
	import serviceGuarantee from '@/components/serviceGuarantee';
	import specSelect from '@/components/specSelect';
	import productConSwiper from '@/components/productConSwiper';
	import productWindow from '@/components/productWindow';
	import couponListWindow from '@/components/couponListWindow';
	import userEvaluation from '@/components/userEvaluation';
	import shareRedPackets from '@/components/shareRedPackets';
	import homeList from '@/components/homeList';
	import { HTTP_REQUEST_URL } from '@/config/app';
	import { toLogin } from '@/libs/login.js';
	import { silenceBindingSpread, configMap, getCustomer } from "@/utils";
	import parser from "@/components/jyf-parser/jyf-parser";
	// #ifndef H5
	import passwordPopup from '@/components/passwordPopup';
	// #endif
	let app = getApp();
	import history from "@/mixins/history";
	import shareScence from "@/libs/spread";
	import guaranteeTemplate from '@/components/freightGuarantee';
	import copyPassword from '@/components/copyPassword';
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
			couponListWindow,
			userEvaluation,
			shareRedPackets,
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
				storeInfo: {}, //商品详情
				presellInfo: {}, //预售详情
				productValue: [], //系统属性
				couponList: [], //优惠券
				cart_num: 1, //购买数量
				isOpen: false, //是否打开属性组件
				actionSheetHidden: true,
				posterImageStatus: false,
				storeImage: '', //海报产品图
				PromotionCode: '', //二维码图片
				canvasStatus: false, //海报绘图标签
				posterImage: '', //海报路径
				posterbackgd: '/static/images/posterbackgd.png',
				sharePacket: {
					isState: true, //默认不显示
				}, //分销商详细
				// uid: 0, //用户uid
				circular: false,
				autoplay: false,
				interval: 3000,
				duration: 500,
				clientHeight: "",
				systemStore: {}, //门店信息
				replyChance: 0,
				storeSelfMention: true,
				posters: false,
				weixinStatus: false,
				attr: {
					cartAttr: false,
					productAttr: [],
					productSelect: {}
				},
				description: '',
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
				minNum: 0,
				currSpid: "",
				codeImg: "",
				videoCoverImg: "",
				shipping: "",
				guarantee: [],
				recommend: [],
				shippingValue: "",
				isCopy: false,
				copyUrl: '',
				services_type: "",
				priceRule: "",
				specsInfo: {
				  show: false,
				  params: []
				},
				currentPage: false,
				homeTop: 59,
				CartCount: 0,
				swiperHeight: "760",
				swiperCur: 0,
				homeLeft: 30,
			};
		},
		computed: configMap(['hide_mer_status','site_name','share_pic'],mapGetters(['isLogin','uid','viewColor','diyProduct'])),
		onLoad(options) {
			let that = this
			if (options.spid) {
				app.globalData.spid = options.spid;
				that.currSpid = options.spid
			}
			var pages = getCurrentPages();
			if (pages.length <= 1) {
				that.retunTop = false
			}
			this.navH = app.globalData.navHeight+10;
			// #ifdef APP-PLUS
			that.homeTop = (that.sysHeight + 8)*2;
			// #endif
			// #ifdef H5
			that.homeTop = 10;
			// #endif
			this.id = options.id;
			if (options.id) {
				this.id = options.id
			}
			uni.getSystemInfo({
				success: function(res) {
					that.height = res.windowHeight
					//res.windowHeight:获取整个窗口高度为px，*2为rpx；98为头部占据的高度；
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
			this.getGoodsDetails();
			// 通过vuex获取并储存商品详情,商品分类可视化的数据
			this.$store.dispatch("getDiyProduct");
			if (this.isLogin) {
				//#ifdef H5
				silenceBindingSpread();
				//#endif
			}
			shareScence(that.currSpid, that.isLogin)
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
		onShow() {},
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
				path: '/pages/activity/presell_details/index?id=' + that.id + '&spid=' + that.uid,
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
			getRecommendGoods(id) {
				let that = this
				getStoreRecommend({
					product_id: id,
					recommend_num: that.diyProduct.recommendNum
				}).then(res => {
					var recommendArr = [];
					that.swiperHeight = (res.data.length>=6 || res.data.length%6>3) ? '760' : '395';
					for(var i=0,len=res.data.length;i<len;i+=6){
						recommendArr.push(res.data.slice(i,i+6));
					}
					that.recommend = recommendArr
				}).catch(err=>{
					that.$util.Tips({
						title: err
					});
				})
			},
			goProDetail(item) {
				uni.redirectTo({
					url: '/pages/goods_details/index?id=' + item.product_id
				})
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
			boxStatus(data) {
				this.showAnimate = data
			},
			closeChange: function() {
				this.$set(this.sharePacket, 'isState', true);
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
			showNav() {
				this.currentPage = !this.currentPage;
			},
			hideNav() {
				this.currentPage = false;
			},
			/*获取价格说明*/
			getPricrRule() {
				priceRuleApi(this.storeInfo.cate_id).then(res => {
					this.priceRule = res.data
				}).catch(err => {

				});
			},
			/**
			 * 打开优惠券插件
			 */
			couponTap: function() {
				let that = this;
				if (that.isLogin === false) {
					toLogin()
				} else {
					that.$set(that.coupon, 'coupon', true);
				}
			},
			/**
			 * 获取优惠券
			 *
			 */
			getCouponList() {
				let that = this;
				let goodsArr = []
				let couponList = [];
				let activeList = []
				getShopCoupons(that.storeInfo.mer_id).then(({
					data
				}) => {
					couponList = goodsArr.concat(data)
					that.$set(that.coupon, 'list', couponList);
					for (let i = 0; i < couponList.length; i++) {
						if (!couponList[i].issue && activeList.length < 2) {
							activeList.push(couponList[i]);
						}
					}
					console.log(that.couponList)
					that.$set(that, 'couponList', activeList);
				})
			},
			ChangCouponsUseState(index) {
				let that = this;
				that.$set(that.coupon, 'coupon', false);
			},
			/**
			 * 购物车手动填写
			 *
			 */
			iptCartNum: function(e) {
				let num = parseInt(e)
				let stock = this.presellInfo.self_count ? parseInt(this.presellInfo.self_count) : 999999999;
				if (num > stock) {
					this.$nextTick(res => {
						this.$set(this.attr.productSelect, 'cart_num', stock);
					})
				} else {
					if (num <= 0) {
						this.$nextTick(res => {
							this.$set(this.attr.productSelect, 'cart_num', stock);
						})
					} else {
						this.$nextTick(res => {
							this.$set(this.attr.productSelect, 'cart_num', num);
						})
					}
				}
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
			/*
			 *去商品详情页
			 */
			goDetail(item) {
				if (item.activity.length == 0) {
					uni.redirectTo({
						url: '/pages/goods_details/index?id=' + item.id
					})
					return
				}
				// 砍价
				if (item.activity && item.activity.type == 2) {
					uni.redirectTo({
						url: `/pages/activity/goods_bargain_details/index?id=${item.activity.id}&bargain=${this.uid}`
					})
					return
				}
				// 拼团
				if (item.activity && item.activity.type == 3) {
					uni.redirectTo({
						url: `/pages/activity/goods_combination_details/index?id=${item.activity.id}`
					})
					return
				}
				// 秒杀
				if (item.activity && item.activity.type == 1) {
					uni.redirectTo({
						url: `/pages/activity/goods_seckill_details/index?id=${item.activity.id}&time=${item.activity.time}&status=1`
					})
					return
				}
			},
			ChangCouponsClose: function() {
				this.$set(this.coupon, 'coupon', false)
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
				let stock = productSelect.stock || 999999999;
				let num = this.attr.productSelect;
				if (changeValue) {
					num.cart_num++;
					if (num.cart_num > stock) {
						this.$set(this.attr.productSelect, "cart_num", stock);
						this.$set(this, "cart_num", stock);
						uni.showToast({
							title: `购买数量不能超过库存`,
							icon: 'none'
						})
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
					if (this.presellInfo.presell_type === 2) this.$set(this.attr.productSelect, "down_price", productSelect.down_price);
					this.$set(this.attr.productSelect, "stock", productSelect.stock);
					this.$set(this.attr.productSelect, "unique", productSelect.unique);
					this.$set(this.attr.productSelect, "cart_num", 1);
					this.$set(this, "attrValue", res);
					this.$set(this, "attrTxt", "选择");
				} else {
					this.$set(this.attr.productSelect, "image", this.storeInfo.image);
					this.$set(this.attr.productSelect, "price", this.storeInfo.price);
					this.$set(this.attr.productSelect, "stock", 0);
					if (this.presellInfo.presell_type === 2) this.$set(this.attr.productSelect, "down_price", 0);
					this.$set(this.attr.productSelect, "unique", "");
					this.$set(this.attr.productSelect, "cart_num", 0);
					this.$set(this, "attrValue", "");
					this.$set(this, "attrTxt", "选择");
				}
			},
			/**
			 * 领取完毕移除当前页面领取过的优惠券展示
			 */
			ChangCoupons: function(e) {
				let coupon = e;
				let couponList = this.$util.ArrayRemove(this.couponList, 'id', coupon.id);
				this.$set(this, 'couponList', couponList);
				this.getCouponList();
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
				getPresellProductDetail(that.id,{pid:that.currSpid}).then(async res => {
					uni.hideLoading();
					let storeInfo = res.data.product;
					let presellInfo = res.data
					if (storeInfo.video_link && storeInfo.slider_image.length > 1) {
						this.videoCoverImg = storeInfo.slider_image[0]
						storeInfo.slider_image.splice(0, 1)
					} else if (storeInfo.video_link && storeInfo.slider_image.length === 1) {
						this.videoCoverImg = storeInfo.slider_image[0]
					}
					that.$set(that, 'presellInfo', presellInfo);
					that.$set(that, 'storeInfo', storeInfo);
					that.$set(that, 'description', storeInfo.content);
					that.$set(that, 'reply', res.data.product.topReply ? [res.data.product.topReply] : []);
					that.$set(that, 'replyCount', res.data.product.replayData && res.data.product.replayData.count);
					that.$set(that, 'replyChance', res.data.product.replayData && res.data.product.replayData.rate);
					that.$set(that.attr, 'productAttr', res.data.product.attr);
					that.$set(that, 'productValue', res.data.product.sku);
					that.$set(that.sharePacket, 'priceName', res.data.product.priceName);
					that.$set(that.sharePacket, 'max', res.data.product.max_extension);
					that.$set(that.sharePacket, 'min', res.data.product.min_extension);
					that.$set(that, 'systemStore', res.data.product.system_store);
					that.$set(that, 'storeSelfMention', res.data.product.store_self_mention);
					that.$set(that, 'PromotionCode', storeInfo.code_base);
					that.$set(that, 'activity', res.data.product.activity ? res.data.product.activity : []);
					that.$set(that, 'shippingValue', res.data.product.temp ? res.data.product.temp.name : '');

					that.$set(that, 'guarantee', res.data.product.guarantee || []);
					that.$set(that, 'shipping', res.data.product.temp ? res.data.product.temp.info : '');
					that.$set(that.specsInfo, 'params', res.data.product.params);
					uni.setNavigationBarTitle({
						title: storeInfo.store_name.substring(0, 7) + "..."
					})
					that.$set(that, 'storeImage', that.storeInfo.image);
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
					that.getRecommendGoods(res.data.product_id);
					that.$nextTick(function() {
						that.getCouponList();
					})
					that.getCartCount();
					// 找到最小定金金额
					let objs = Object.keys(res.data.product.sku);
					let m = objs.map(key => res.data.product.sku[key]);
					this.minNum = Math.min.apply(Math, m.map(function(o) {
						return o.down_price
					}))
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
			 * 拨打电话
			 */
			makePhone: function() {
				uni.makePhoneCall({
					phoneNumber: this.systemStore.phone
				})
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
					this.$set(
						this.attr.productSelect,
						"store_name",
						this.storeInfo.store_name
					);
					this.$set(this.attr.productSelect, "image", productSelect.image);
					this.$set(this.attr.productSelect, "price", productSelect.price);
					if (this.presellInfo.presell_type === 2) this.$set(this.attr.productSelect, "down_price", productSelect.down_price);
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
					if (this.presellInfo.presell_type === 2) this.$set(this.attr.productSelect, "down_price", storeInfo.down_price);
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
					this.$set(
						this.attr.productSelect,
						"unique",
						this.storeInfo.unique || ""
					);
					this.$set(this.attr.productSelect, "cart_num", 1);
					this.$set(this, "attrValue", "");
					this.$set(this, "attrTxt", "选择");
				} else if (productSelect && !productAttr.length) {
					this.$set(
						this.attr.productSelect,
						"store_name",
						this.storeInfo.store_name
					);
					this.$set(this.attr.productSelect, "image", productSelect.image);
					this.$set(this.attr.productSelect, "price", productSelect.price);
					this.$set(this.attr.productSelect, "stock", productSelect.stock);
					this.$set(this.attr.productSelect, "unique", productSelect.unique);
					if (this.presellInfo.presell_type === 2) this.$set(this.attr.productSelect, "down_price", productSelect.down_price);
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
							type: 2,
							type_id: this.presellInfo.product_presell_id
						}).then(res => {
							that.$util.Tips({
								title: '已取消收藏'
							});
							that.$set(that.storeInfo, 'isRelation', !that.storeInfo.isRelation);
						})
					} else {
						collectAdd({
							type_id: this.presellInfo.product_presell_id,
							type: 2
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
					product_type: 2,
					spread_id: this.currSpid
				};
				postCartAdd(q)
					.then(function(res) {
						that.isOpen = false;
						that.attr.cartAttr = false;
						if (news) {
							uni.navigateTo({
								url: '/pages/users/order_confirm/index?cartId=' + res.data.cart_id
							});
						} else {
							that.$util.Tips({
								title: "添加购物车成功",
							});
						}
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
				this.canvasStatus = false
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
			downloadFilePromotionCode: function(successFn) {
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
					product_type: 2
				}).then(async res => {
					that.codeImg = res.data.url;
					that.goPoster();
				}).catch(err => {
					//替换
					that.$util.Tips({
						title: err
					});
					that.posters = false;
					that.$set(that, 'PromotionCode', '');
				});
			},
			// 小程序关闭分享弹窗；
			goFriend: function() {
				this.posters = false;
			},
			async imgToBase(url) {
				let res = await imgToBase({
					image: url
				})
				return res.data.image
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
				arr2 = [that.posterbackgd, await this.imgToBase(that.storeImage), await this.imgToBase(this.codeImg), await that.imgToBase(that.share_pic)];
				// #endif
				that.$util.goodsPosterCanvas(arr2, that.storeInfo.store_name, that.storeInfo.price, that.site_name, that.storeInfo.ot_price, function(tempFilePath) {
					that.$set(that, 'posterImage', tempFilePath);
					that.$set(that, 'posterImageStatus', true);
					that.$set(that, 'canvasStatus', false);
					that.$set(that, 'actionSheetHidden', !that.actionSheetHidden);
				}, (err) => {
					that.$util.Tips({
						title: err
					});
					uni.hideLoading();
					that.$set(that, 'canvasStatus', false);
				});
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
						], configAppMessage).then(res => {
							console.log(res, '=============================>>WXAPI');
						}).catch(err => {
							console.log(err);
						})
					});
				}
			},
			//#endif
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
								return that.$util.Tips({
									title: '请检查图片地址是否在合法域名内'
								});
							}
						});
					})
				}
			},
			//复制口令
			copyPwd(){
				let that = this;
				copyPasswordApi({
					id: that.id,
					product_type: 2
				}).then(async res => {
					that.copyUrl = res.data.str;
					that.posters = false
					that.isCopy = true;
				})
			},
			closeCopy(){
				this.isCopy = false
			},
		},
		// 滚动监听
		onPageScroll(e) {}
	}
</script>

<style scoped lang="scss">
	.font-bg-red{
		position: relative;
		top: -3rpx;
		background-color: var(--view-theme);
	}
	.p-color {
		color: var(--view-priceColor);
	}
	.t-color {
		color: var(--view-theme);
	}
	.product-con .wrapper .coupon .activity {
		border: 1px solid var(--view-priceColor);
		color: var(--view-priceColor);
	}
	.product-con .wrapper .coupon .activity::before,.product-con .wrapper .coupon .activity::after{
		border: 1px solid var(--view-priceColor);
	}
	.product-con .wrapper .coupon .activity::before{
		border-left-color: #ffffff;
	}
	.product-con .wrapper .coupon .activity::after{
		border-right-color: #ffffff;
	}
	.product-con .nav {
		background-color: var(--view-theme);
		padding-bottom: 50rpx;
		margin-bottom: -50rpx;
	}
	.product-con .nav .iconfont {
		color: #fff;
		font-size: 30rpx;
		margin-left: 20rpx;
	}
	.product-con .wrapper {
		width: 100%;
		box-sizing: border-box;
	}
	.product-con .price_text {
		display: inline-block;
		width: 84rpx;
		height: 30rpx;
		background-size: 100% 100%;
		background-repeat: no-repeat;
		color: #FD6523;
		font-size: 22rpx;
		line-height: 30rpx;
		text-align: center;
		margin-left: 14rpx;
		position: relative;
		top: -8rpx;
	}
	.product-con .wrapper .introduce {
		margin: 0;
		position: relative;
		margin-top: 20rpx;
		.icon-fenxiang {
			position: absolute;
			top: 0;
			right: 0;
		}
	}
	.product-con .wrapper .introduce .iconfont {
		font-size: 37rpx;
		color: #515151;
	}
	.product-con .wrapper .label {
		margin: 18rpx 0 0 0;
	}
	.product-con .wrapper .label .stock {
		width: 255rpx;
		margin-right: 28rpx;
	}
	.product-con .presell_count {
		margin: 20rpx 0;
		font-size: 24rpx;
		color: #999999;
		.presell_time {
			margin: 12rpx 0;
			.area_line {
				display: inline-block;
				margin: 0 6rpx;
			}
		}
		.icon-icon_clock-2 {
			display: inline-block;
			margin-right: 4rpx;
			font-size: 26rpx;
		}
	}
	.product-con .presell_process {
		margin-top: 20rpx;
		height: 110rpx;
		padding: 4rpx 32rpx 32rpx;
		.process_count {
			display: inline-block;
			position: relative;
			top: 24rpx;
			left: 40rpx;
		}
		.process_line {
			width: 414rpx;
			height: 2rpx;
			background: #CCCCCC;
		}
		.text_line {
			display: inline-block;
			width: 25%;
			color: #CCCCCC;
			margin-top: 6rpx;
			position: relative;
			font-size: 26rpx;
			text {
				display: inline-block;
				margin-top: 12rpx;
			}
			&::after {
				content: "";
				display: inline-block;
				width: 14rpx;
				height: 14rpx;
				background: #CCCCCC;
				border-radius: 100%;
				position: absolute;
				top: -14rpx;
			}
			&.text_line1 {
				text-align: left;
				color: var(--view-theme);
				&::after {
					background: var(--view-theme);
					left: 0;
				}
				text {
					margin-left: -20rpx
				}
			}
			&.text_line3 {
				text-align: right;
				&::after {
					right: 0;
				}
				text {
					margin-right: -20rpx
				}
			}
			&.text_line2 {
				width: 50%;
				text-align: center;
				&::after {
					left: 50%;
					margin-left: -4rpx;
				}
			}
		}
	}
	.presell-content-height{
		height: 160rpx;
		height: calc(160rpx + constant(safe-area-inset-bottom)); ///兼容 IOS<11.2/
		height: calc(160rpx + env(safe-area-inset-bottom)); ///兼容 IOS>11.2/
	}
	.mask {
		z-index: 300 !important;
	}
	.head-bar {
		background: #fff;
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
	.footer_count {
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		background-color: #fff;
		z-index: 277;
		.presell_desc {
			height: 60rpx;
			line-height: 60rpx;
			background: #FFF7E5;
			color: #FF7F00;
			font-size: 22rpx;
			padding: 0 30rpx;
			.iconfont {
				font-size: 26rpx;
			}
		}
		.footer {
			padding: 0 30rpx 0 40rpx;
			position: static;
			&.footpl{
				padding-left: 70rpx;
			}
			&.noborder {
				border-top: none;
			}
		}
	}
	.product-con .footer .bnt {
		height: 76rpx;
	}
	.product-con .footer .bnt .bnts {
		text-align: center;
		line-height: 76rpx;
		color: #fff;
		font-size: 28rpx;
	}
	.product-con .footer .bnt .buy {
		border-radius: 50rpx;
		background-image: linear-gradient(to right, #FDA923 0%, #FD6523 100%);
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
	.contact {
		font-size: 16px;
		width: 50%;
		background-color: #fff;
		padding: 8rpx 0;
		border-radius: 0;
		margin: 0;
		line-height: 2;
	}
	.contact::after {
		border: none;
	}
	.canvas {
		z-index: 300;
		width: 750px;
		height: 1190px;
	}
	.icon-icon_tip {
		display: inline-block;
		margin-right: 5rpx;
		position: relative;
		top: 3rpx;
	}
	.atmosphere {
		&.money {
			height: 100rpx;
			padding-left: 24rpx;
			margin: 0 -32rpx;
			background: center/cover no-repeat;
			font-weight: 800;
			font-size: 28rpx;
			line-height: 100rpx;
			color: #FFFFFF;
			.num {
				font-size: 48rpx;
			}
		}
		&.share {
			align-items: flex-start;
			padding: 30rpx 0 0;
			.introduce {
				flex: 1;
				margin-top: 0;
			}
		}
	}
</style>
