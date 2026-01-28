<template>
	<view :style="viewColor">
		<view class="product-con">
			<view class="head-wrapper" id="home" :style="{ top: homeTop + 'rpx' }">
				<view class="head-menu">
					<view class='iconfont icon-ic_left' @click="returns"></view>
					<view class="iconfont icon-ic_menu3" @click="showNav"></view>
				</view>
				<view v-if="diyProduct.openShare" class="share-icon" :style="{ left: homeLeft }" @click="listenerActionSheet">
					<view class="iconfont icon-ic_transmit1"></view>
				</view>
			</view>
			<!-- 导航小图标 -->
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
						<view :style="'width:100%;' + 'height:'+sysHeight + 'px'"></view>
						<!-- #endif -->
						<productConSwiper class="skeleton-rect" :imgUrls="storeInfo.slider_image" :videoCoverImg="videoCoverImg" :videoline="storeInfo.video_link"></productConSwiper>
						<view class="swiper-bg pos-rel">
							<view class='nav acea-row row-between-wrapper boder-44 pos-rel' :style="{ 'background-image': `url(${domain}/static/images/combination-price-bg.png)`}">
								<view class='money skeleton-rect acea-row row-bottom' style="min-width: 10rpx;">
									<view class="text">ລາຄາກຸ່ມ</view>
									<view v-if="combinationInfo.price" class="price">
										<priceFormat :price="combinationInfo.price" weight intSize="48" floatSize="32" labelSize="32"></priceFormat>
									</view>
									<text v-if="storeInfo.price" class="orig_price regular">
										₭{{storeInfo.price}}</text>
									</text>
								</view>
								<view class="combin-people">
									{{combinationInfo.buying_count_num}}ຄົນຕໍ່ກຸ່ມ
								</view>
							</view>
							<view class="detail-count pos-rel pad30">
								<view class='wrapper'>
									<view class="acea-row row-between">
										<view v-if="storeInfo.store_name" class='introduce skeleton-rect'>
											<text v-if="(storeInfo.merchant && storeInfo.merchant.type_name)" class="font-bg-red">{{storeInfo.merchant.type_name}}</text>
											<text v-else-if="(storeInfo.merchant && storeInfo.merchant.is_trader)" class="font-bg-red">ຮ້ານຄ້າຫຼັກ</text>
											{{storeInfo.store_name}}
										</view>
										<view v-if="diyProduct.shareList.length>0" class="fenxiang_btn">
											<block v-for="(item,index) in diyProduct.shareList" :key="index">
												<view v-if="diyProduct.shareConfig.includes(item.value)" @click="setShare(item.value)"><text class="iconfont" :class="[`${item.icon}`, { 'icon-ic_star1': storeInfo.isRelation&&item.value==1 }]"></text><br/>{{item.label}}</view>
											</block>
										</view>
									</view>
									<view class='label acea-row row-between-wrapper'>
										<view class="skeleton-rect">ຈຳນວນຄົນ:{{combinationInfo.buying_count_num ? combinationInfo.buying_count_num : 0}}ຄົນຕໍ່ກຸ່ມ</view>
										<view v-show="diyProduct.isOpen.includes(2)" class="skeleton-rect">ສາງ:{{combinationInfo.stock ? combinationInfo.stock : 0}}</view>
										<view v-show="diyProduct.isOpen.includes(1)" class="skeleton-rect">ສັ່ງແລ້ວ:{{combinationInfo.sales ? combinationInfo.sales : 0}}{{storeInfo.unit_name ? storeInfo.unit_name : ''}}</view>
									</view>
								</view>
								<view class='notice acea-row row-middle' v-if="itemNew.length">
									<view class='num t-color'>
										<text class='iconfont icon-ic_promotion'></text>
										ສັ່ງແລ້ວ{{combinationInfo.sales ? combinationInfo.sales : 0}}{{storeInfo.unit_name ? storeInfo.unit_name : ''}}<text
										 class='line'>|</text>
									</view>
									<view class='swiper'>
										<swiper :indicator-dots="indicatorDots" :autoplay="autoplay" interval="2500" duration="500" vertical="true"
										 circular="true">
											<block v-for="(item,index) in itemNew" :key='index'>
												<swiper-item>
													<view class='line1'>{{item.nickname ? item.nickname : ''}}ສັ່ງກຸ່ມສຳເລັດ</view>
												</swiper-item>
											</block>
										</swiper>
									</view>
								</view>
							</view>
							<view class="combination_wrapper pad20">
								<view class='assemble mt20 boder-24 bg-f' v-if="pink.length" :style="itemNew.length ? '' : 'margin-top: 20rpx;'">
									<view class='item acea-row row-between-wrapper skeleton-rect' v-for='(item,index) in pink' :key='index' v-if="index < AllIndex && pink.length>0">
										<view class='pictxt acea-row row-between-wrapper'>
											<view class='pictrue'>
												<image :src="item.initiator.avatar || '/static/images/f.png'"></image>
											</view>
											<view class='text line1'>{{ item.initiator.nickname ? item.initiator.nickname : ""}}</view>
										</view>
										<view class='right acea-row row-middle'>
											<view>
												<view class='lack'>ຍັງຂາດ<text class='t-color'>{{item.buying_count_num - item.yet_buying_num}}</text>ຄົນຈະສຳເລັດ</view>
												<view class='time'>
													<text style="margin-right:4px;">ເຫຼືອ</text>
													<count-down :justifyLeft="justifyLeft" :is-day="false" :tip-text="' '" :day-text="' '" :hour-text="':'"
													 :minute-text="':'" :second-text="' '" :datatime="item.end_time" :regular="false"></count-down>
												</view>
											</view>
											<navigator hover-class='none' :url="'/pages/activity/combination_status/index?id='+item.group_buying_id" class='spellBnt'>
												ໄປສັ່ງກຸ່ມ
												<text class='iconfont icon-ic_rightarrow'></text>
											</navigator>
										</view>
									</view>
									<template v-if="pink.length > 2">
										<view class='more' @tap='AllIndex = pink.length' v-if="pink.length > AllIndex">ເບິ່ງເພີ່ມ<text class='iconfont icon-ic_downarrow'></text></view>
										<view class='more' @tap='AllIndex = 2' v-else-if="AllIndex == pink.length">ຫຍໍ້<text
											class='iconfont icon-ic_uparrow'></text></view>
									</template>
								</view>
								<view class='playWay skeleton-rect bg-f boder-24 mt20'>
									<view class='title acea-row row-between-wrapper'>
										<view>ວິທີຊື້ກຸ່ມ</view>
									</view>
									<view class='way acea-row row-middle'>
										<view class='item acea-row row-middle'>
											<text class='num'>①</text>
											<text class="way_text">ເປີດກຸ່ມ/ເຂົ້າກຸ່ມ</text>
										</view>
										<view class='iconfont icon-a-jiantou11'></view>
										<view class='item acea-row row-middle'>
											<text class='num'>②</text>
											<text class="way_text">ເຊີນໝູ່</text>
										</view>
										<view class='iconfont icon-a-jiantou11'></view>
										<view class='item'>
											<view class="acea-row row-middle">
												<text class='num'>③</text>
												<text class="way_text">ຄົບກຸ່ມສົ່ງເຄື່ອງ</text>
											</view>
										</view>
									</view>
								</view>
								<view v-if="diyProduct.serviceList.length>0" class="bg-f boder-24 mt20">
									<block v-for="(item,index) in diyProduct.serviceList" :key="index">
										<specSelect v-if="item.props == 'specSelect' && diyProduct.showService.includes(item.value)" :attrTxt="attrTxt" :attrValue="attrValue" @selecAttr="selecAttr"></specSelect>
										<freight v-if="item.props == 'freight' && diyProduct.showService.includes(item.value)" :shippingValue="shippingValue" :shipping="shipping" @showShip="showShip"></freight>
										<serviceGuarantee v-if="item.props == 'serviceGuarantee' && diyProduct.showService.includes(item.value)" :guarantee="guarantee" @showGuaranee="showGuaranee"></serviceGuarantee>
										<parameter v-if="item.props == 'parameter' && diyProduct.showService.includes(item.value)" :specsInfo="specsInfo" @seeSpecs="seeSpecs"></parameter>
									</block>
								</view>
								<view class='userEvaluation boder-24' id="past1" v-if="replyCount && replyCount>0 && diyProduct.showReply==1">
									<view class='title acea-row row-between-wrapper'>
										<view>ຄຳເຫັນຜູ້ໃຊ້({{replyCount}})</view>
										<navigator class='praise' hover-class='none' :url='"/pages/users/goods_comment_list/index?product_id="+storeInfo.product_id'>
											<text class='t-color'>{{replyChance}}</text>ອັດຕາຄຳຊົມ
											<text class='iconfont icon-ic_rightarrow'></text>
										</navigator>
									</view>
									<block v-if="replyCount">
										<userEvaluation :reply="reply" ></userEvaluation>
									</block>
								</view>
								<!-- 种草秀 -->
								<!-- <view class='userPlant boder-24 mt20' v-if="storeInfo.community && storeInfo.community.length>0 && diyProduct.showCommunity == 1">
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
								<view v-if="hide_mer_status == 0 && storeInfo.merchant && diyProduct.showStore==1" class="store-wrapper bg-f boder-24">
									<view class="store-hd skeleton-rect">
										<view class="store-info">
											<view class="logo">
												<image :src="storeInfo.merchant.mer_avatar" mode=""></image>
											</view>
											<navigator :url="'/pages/store/home/index?id='+storeInfo.mer_id" hover-class="none" class="info">
												<view class="name">{{storeInfo.merchant.mer_name}}
												<text v-if="(storeInfo.merchant && storeInfo.merchant.type_name)" class="font-bg-red ml8">{{storeInfo.merchant.type_name}}</text>
												<text v-else-if="(storeInfo.merchant && storeInfo.merchant.is_trader)" class="font-bg-red ml8">ຮ້ານຄ້າຫຼັກ</text>
												</view>
												<view class="txt">
												{{storeInfo.merchant.care_count < 10000 ? storeInfo.merchant.care_count : (storeInfo.merchant.care_count/10000).toFixed(2)+'ໝື່ນ'}}ຄົນຕິດຕາມ
												</view>
											</navigator>
											<navigator :url="'/pages/store/home/index?id='+storeInfo.mer_id" class="link" hover-class="none">ເຂົ້າຮ້ານ</navigator>
										</view>
										<view class="score-wrapper">
											<view class="item">
												ລາຍລະອຽດສິນຄ້າ<text>{{storeInfo.merchant.product_score}}</text>
											</view>
											<view class="item">
												ບໍລິການຜູ້ຂາຍ<text>{{storeInfo.merchant.service_score}}</text>
											</view>
											<view class="item">
												ບໍລິການຂົນສົ່ງ<text>{{storeInfo.merchant.postage_score}}</text>
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
											 style="750rpx;"
											  :style="'height:'+swiperHeight+'rpx'"
											 >
												<block v-for="(item,index) in recommend" :key="index">
													<swiper-item class="swiper-item">
														<view class="img-box">
																<view class="img-item" v-for="(itm,idx) in item" :key="idx" @click="goProDetail(itm)">
																	<image mode="widthFix" :src="itm.image"></image>
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
										<jyf-parser :domain="domain" :html="description.content" ref="article" :tag-style="tagStyle"></jyf-parser>
									</view>
									<!-- 价格说明 -->
									<view v-if="priceRule.content" class="price-info">
										<view class="price-title">ອະທິບາຍລາຄາ</view>
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
			<view class='footer_count'>
				<view class="acea-row row-between-wrapper footer" :class="{'footpl':hide_mer_status==1}">
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
					<view class='bnt acea-row'>
						<form @submit="joinCart" report-submit='true'>
							<button class='joinCart bnts skeleton-rect' :class="'w_buy'+diyProduct.menuList.length" @tap="openAlone">ຊື້ແຍກ</button>
						</form>
						<form @submit="goBuy" report-submit='true' v-if="attr.productSelect ">
							<button v-if="attr.productSelect.stock == 0" class='buy bnts skeleton-rect' :class="'w_buy'+diyProduct.menuList.length" form-type="submit" disabled>ໝົດແລ້ວ</button>
							<button v-else class='buy bnts skeleton-rect' :class="'w_buy'+diyProduct.menuList.length" form-type="submit">ເປີດກຸ່ມດຽວນີ້</button>
						</form>
					</view>
				</view>
			</view>
			<block v-if="sharePacket.max&&sharePacket.min">
				<shareRedPackets :sharePacket="sharePacket" @listenerActionSheet="listenerActionSheet" @closeChange="closeChange"
				 :showAnimate="showAnimate" @boxStatus="boxStatus"></shareRedPackets>
			</block>
			<!--商品参数-->
			<specs :specsInfo="specsInfo" @myevent="mySpecs"></specs>
			<!-- 组件 -->
			<productWindow :attr="attr" :isShow='diyProduct.isOpen.includes(2)' :iSplus='1' :isCustom="true" :image="storeInfo.image" @myevent="onMyEvent" @ChangeAttr="ChangeAttr"
			 @ChangeCartNum="ChangeCartNum" @attrVal="attrVal" @iptCartNum="iptCartNum" id='product-window'></productWindow>
			<!-- 分享按钮 -->
			<view class="generate-posters acea-row row-middle" :class="posters ? 'on' : ''">
				<!-- #ifndef MP -->
				<button class="item" :class="weixinStatus ? 'item3' : ''" hover-class='none' v-if="weixinStatus === true" @click="H5ShareBox = true">
					<view class="iconfont icon-ic_wechat"></view>
					<view class="">ສົ່ງໃຫ້ໝູ່</view>
				</button>
				<!-- #endif -->
				<!-- #ifdef MP -->
				<button class="item" :class="weixinStatus ? 'item3' : ''" open-type="share" hover-class='none' @click="goFriend">
					<view class="iconfont icon-ic_wechat"></view>
					<view class="">ສົ່ງໃຫ້ໝູ່</view>
				</button>
				<!-- #endif -->
				<button class="item" :class="weixinStatus ? 'item3' : ''" hover-class='none' @click="downloadFilePromotionCode">
					<view class="iconfont icon-a-ic_picture1"></view>
					<view class="">ສ້າງໂປສເຕີ</view>
				</button>
				<button class="item" :class="weixinStatus ? 'item3' : ''" hover-class='none' @click="copyPwd">
					<view class="iconfont icon-ic_key"></view>
					<view>ສ້າງລະຫັດ</view>
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
				<view class='save-poster' @click="savePosterPath">ບັນທຶກໃສ່ໂທລະສັບ</view>
				<!-- #endif -->
				<!-- #ifdef H5 -->
				<view class="keep">ກົດຄ້າງຮູບເພື່ອບັນທຶກໃສ່ໂທລະສັບ</view>
				<!-- #endif -->
			</view>
			<view class='mask' v-if="posterImageStatus"></view>
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
		getProductCode,
		collectAdd,
		collectDel,
		postCartAdd,
		copyPasswordApi, priceRuleApi, getStoreRecommend
	} from '@/api/store.js';
	import { getCombinationDetail } from '@/api/activity.js';
	import { getUserInfo, imgToBase } from '@/api/user.js';
	import { mapGetters } from "vuex";
	import { imageBase64 } from "@/api/public";
	import productConSwiper from '@/components/productConSwiper';
	import productWindow from '@/components/productWindow';
	import specs from '@/components/specs/index.vue';
	import copyPassword from '@/components/copyPassword';
	import userEvaluation from '@/components/userEvaluation';
	import freight from '@/components/freight';
	import parameter from '@/components/parameter';
	import serviceGuarantee from '@/components/serviceGuarantee';
	import specSelect from '@/components/specSelect';
	import shareRedPackets from '@/components/shareRedPackets';
	import { HTTP_REQUEST_UR } from '@/config/app';
	import { silenceBindingSpread, configMap, getCustomer } from "@/utils";
	import parser from "@/components/jyf-parser/jyf-parser";
	import { HTTP_REQUEST_URL } from '@/config/app';
	import { toLogin } from '@/libs/login.js';
	import countDown from '@/components/countDown';
	// #ifndef H5
	import passwordPopup from '@/components/passwordPopup';
	// #endif
	import shareScence from "@/libs/spread";
	let app = getApp();
	import history from "@/mixins/history";
	import guaranteeTemplate from '@/components/freightGuarantee';
	import homeList from '@/components/homeList';
	export default {
		components: {
			// #ifndef H5
			passwordPopup,
			// #endif
			productConSwiper,
			productWindow,
			specs,
			parameter,
			freight,
			serviceGuarantee,
			specSelect,
			userEvaluation,
			shareRedPackets,
			guaranteeTemplate,
			copyPassword,
			countDown,
			"jyf-parser": parser,
			homeList
		},
		mixins: [history],
		data() {
			let that = this;
			return {
				isNodes: 0, //控制什么时候开始抓取元素节点,只要数值改变就重新抓取
				sysHeight: sysHeight, //系统导航条高度
				attrTxt: '请选择', //属性页面提示
				attrValue: '', //已选属性
				animated: false, //购物车动画
				id: 0, //商品id
				replyCount: 0, //总评论数量
				reply: [], //评论列表
				storeInfo: {}, //商品详情
				combinationInfo: {}, //预售详情
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
				sharePacket: {
					isState: true, //默认不显示
				}, //分销商详细
				circular: false,
				autoplay: true,
				interval: 3000,
				duration: 500,
				clientHeight: "",
				itemNew: [],
				recommend: [],
				indicatorDots: false,
				systemStore: {}, //门店信息
				replyChance: 0,
				posters: false,
				weixinStatus: false,
				attr: {
					cartAttr: false,
					productAttr: [],
					productSelect: {}
				},
				description: '',
				priceRule: "",
				navActive: 0,
				H5ShareBox: false, //公众号分享图片
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
				pink_ok_sum: 0,
				pink: [],
				AllIndexDefault: 0,
				AllIndex: 2,
				maxAllIndex: 0,
				currSpid: '',
				codeImg: "",
				justifyLeft: "display: inline;",
				videoCoverImg: "",
				shipping: "",
				guarantee: [],
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
				swiperCur: 0,
				swiperHeight: "760",
				homeLeft: 30,
			};
		},
		computed: configMap(['hide_mer_status','share_pic','site_name'],mapGetters(['isLogin','uid','viewColor','diyProduct'])),
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
			that.navH = app.globalData.navHeight+10;
			// #ifdef APP-PLUS
			that.homeTop = (that.sysHeight + 8)*2;
			// #endif
			// #ifdef H5
			that.homeTop = 10;
			// #endif
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
					title: 'ຂາດຂໍ້ມູນ, ບໍ່ສາມາດເບິ່ງສິນຄ້າໄດ້'
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
			that.getGoodsDetails();
			// 通过vuex获取并储存商品详情,商品分类可视化的数据
			that.$store.dispatch("getDiyProduct");
			if (this.isLogin) {
				//#ifdef H5
				silenceBindingSpread();
				//#endif
				this.getHistory()
			}
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
		onShow() {

		},
		/**
		 * 用户点击右上角分享
		 */
		// #ifdef MP
		onShareAppMessage: function() {
			let that = this;
			return {
				title: that.storeInfo.store_name || '',
				imageUrl: that.storeInfo.image || '',
				path: '/pages/activity/combination_details/index?id=' + that.id + '&spid=' + that.uid,
			}
		},
		onShareTimeline: function() {
			let that = this;
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
						customer_link: mer.mer_customer_link,
					}
					let url = `/pages/chat/customer_list/chat?mer_id=${that.storeInfo.mer_id}&uid=${that.uid}&productId=${that.id}`
					getCustomer(data, url)
				}
			},
			seeSpecs() {
			  this.specsInfo.show = true;
			},
			mySpecs() {
			  this.$set(this.specsInfo, 'show', false);
			},
			goProDetail(item) {
				uni.redirectTo({
					url: '/pages/goods_details/index?id=' + item.product_id
				})
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
				}).catch(err => {});
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
				}).catch(err=>{
					that.$util.Tips({
						title: err
					});
				})
			},
			/**
			 * 购物车手动填写
			 *
			 */
			iptCartNum: function(e) {
				let num = parseInt(e)
				let stock = this.combinationInfo.self_count ? parseInt(this.combinationInfo.self_count) : 999999999;
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
			/*
			 * 获取用户信息
			 */
			getUserInfo: function() {
				let that = this;
				that.$set(that.sharePacket, 'isState', that.sharePacket.priceName != 0 ? false : true);
				getUserInfo().then(res => {
					// that.$set(that, 'uid', res.data.uid);
				});
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
				let stock = productSelect.stock || 999999999;
				let num = this.attr.productSelect;
				if (changeValue) {
					num.cart_num++;
					if (num.cart_num > stock) {
						this.$set(this.attr.productSelect, "cart_num", stock);
						this.$set(this, "cart_num", stock);
						uni.showToast({
							title: `ຈຳນວນຊື້ບໍ່ສາມາດເກີນສາງໄດ້`,
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
					this.$set(this.attr.productSelect, "stock", productSelect.stock);
					this.$set(this.attr.productSelect, "unique", productSelect.unique);
					this.$set(this.attr.productSelect, "cart_num", 1);
					this.$set(this, "attrValue", res);
					this.$set(this, "attrTxt", "ເລືອກແລ້ວ");
				} else {
					this.$set(this.attr.productSelect, "image", this.storeInfo.image);
					this.$set(this.attr.productSelect, "price", this.storeInfo.price);
					this.$set(this.attr.productSelect, "stock", 0);
					this.$set(this.attr.productSelect, "unique", "");
					this.$set(this.attr.productSelect, "cart_num", 0);
					this.$set(this, "attrValue", "");
					this.$set(this, "attrTxt", "ກະລຸນາເລືອກ");
				}
			},
			setClientHeight: function() {
				let that = this;
				let view = uni.createSelectorQuery().in(this).select("#list0");
				view.fields({
					size: true,
				}, data => {
					that.$set(that, 'clientHeight', data.height + 20)
				}).exec();
			},
			/**
			 * 获取产品详情
			 *
			 */
			getGoodsDetails: function() {
				uni.showLoading({
					title: 'ກຳລັງໂຫຼດ...',
					mask: true
				});
				let that = this;
				getCombinationDetail(that.id,{pid: that.currSpid}).then(res => {
					uni.hideLoading();
					let storeInfo = res.data.product;
					let combinationInfo = res.data;
					if (storeInfo.video_link && storeInfo.slider_image.length > 1) {
						this.videoCoverImg = storeInfo.slider_image[0]
						storeInfo.slider_image.splice(0, 1)
					} else if (storeInfo.video_link && storeInfo.slider_image.length === 1) {
						this.videoCoverImg = storeInfo.slider_image[0]
					}
					that.$set(that, 'combinationInfo', combinationInfo);
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
					that.$set(that, 'PromotionCode', storeInfo.code_base);
					that.$set(that, 'pink', res.data.groupBuying);
					that.$set(that, 'itemNew', res.data.successUser);
					that.$set(that, 'shippingValue', res.data.product.temp ? res.data.product.temp.name : '');
					that.$set(that, 'guarantee', res.data.product.guarantee ? res.data.product.guarantee : []);
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
					that.getRecommendGoods();
					that.getPricrRule(that.storeInfo.cate_id);
					that.getCartCount();
					// 找到最小定金金额
					let objs = Object.keys(res.data.product.sku);
					let m = objs.map(key => res.data.product.sku[key]);
					this.minNum = Math.min.apply(Math, m.map(function(o) {
						return o.down_price
					}))
				}).catch(res => {
					uni.hideLoading();
					return that.$util.Tips({
						title: res
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
					this.$set(this.attr.productSelect, "stock", productSelect.stock);
					this.$set(this.attr.productSelect, "unique", productSelect.unique);
					this.$set(this, "attrValue", value.join(","));
					this.$set(this, "attrTxt", "ເລືອກແລ້ວ");
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
					this.$set(this, "attrTxt", "ກະລຸນາເລືອກ");
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
					this.$set(this, "attrTxt", "ກະລຸນາເລືອກ");
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
					this.$set(this, "attrValue", value.join(","));
					this.$set(this, "attrTxt", "ເລືອກແລ້ວ");
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
							type: 4,
							type_id: this.combinationInfo.product_group_id
						}).then(res => {
							that.$util.Tips({
								title: '已取消收藏'
							});
							that.$set(that.storeInfo, 'isRelation', !that.storeInfo.isRelation);
						})
					} else {
						collectAdd({
							type_id: this.combinationInfo.product_group_id,
							type: 4
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
					product_type: 4,
					spread_id: this.currSpid
				};
				postCartAdd(q)
					.then(function(res) {
						that.isOpen = false;
						that.attr.cartAttr = false;
						uni.navigateTo({
							url: '/pages/users/order_confirm/index?cartId=' + res.data.cart_id
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
					product_type: 4
				}).then(async res => {
					that.codeImg = res.data.url;
					that.goPoster();
				}).catch(err => {
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
					title: 'ກຳລັງສ້າງໂປສເຕີ',
					mask: true
				});
				// #ifdef MP || APP-PLUS
				arr2 = [that.posterbackgd, await this.fileStoreImage(this.storeImage), await this.fileStoreImage(
					this.codeImg), await that.fileStoreImage(that.share_pic)];
				// #endif
				// #ifdef H5
				arr2 = [that.posterbackgd, await this.imgToBase(that.storeImage), await this.imgToBase(this.codeImg), await that.imgToBase(that.share_pic)];
				// #endif
				//生成推广海报
				that.$util.goodsPosterCanvas(arr2, that.storeInfo.store_name, that.storeInfo.price, that.site_name, that.storeInfo.ot_price, function(tempFilePath) {
					that.$set(that, 'posterImage', tempFilePath);
					that.$set(that, 'posterImageStatus', true);
					that.$set(that, 'canvasStatus', false);
					that.$set(that, 'actionSheetHidden', !that.actionSheetHidden);
				}, (err) => {
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
												title: 'ບັນທຶກສຳເລັດ',
												icon: 'success'
											});
										},
										fail: function(res) {
											that.$util.Tips({
												title: 'ບັນທຶກບໍ່ສຳເລັດ'
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
										title: 'ບັນທຶກສຳເລັດ',
										icon: 'success'
									});
								},
								fail: function(res) {
									that.$util.Tips({
										title: 'ບັນທຶກບໍ່ສຳເລັດ'
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
							title: 'ບັນທຶກສຳເລັດ',
							icon: 'success'
						});
					},
					fail: function(res) {
						that.$util.Tips({
							title: 'ບັນທຶກບໍ່ສຳເລັດ'
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
			async imgToBase(url) {
				let res = await imgToBase({
					image: url
				})
				return res.data.image
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
					product_type: 4
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
	.product-con .nav {
		background-color: var(--view-theme);
		height: 152rpx;
		padding: 0 40rpx;
		padding-bottom: 50rpx;
		margin-bottom: -50rpx;
		top: -2px;
	}
	.product-con .nav .money {
		.text{
			font-size: 28rpx;
			font-weight: bold;
			margin-right: 16rpx;
		}
		.price{
			position: relative;
			top: 4rpx;
		}
	}
	.product-con .nav .combin-people {
		width: 110rpx;
		height: 48rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(255,255,255,.9);
		border-radius: 120rpx 100rpx 100rpx 0;
		font-size: 24rpx;
		color: var(--view-theme);
	}
	.orig_price {
		text-decoration: line-through;
		margin-left: 16rpx;
	}
	.product-con .notice {
		width: 100%;
		height: 62rpx;
		background-color: var(--view-minorColor);
		padding: 0 20rpx;
		box-sizing: border-box;
		border-radius: 16rpx;
		margin-top: 30rpx;
	}
	.product-con .notice .num {
		font-size: 24rpx;
	}
	.product-con .notice .num .iconfont {
		font-size: 30rpx;
		vertical-align: -3rpx;
		margin-right: 20rpx;
	}
	.product-con .notice .num .line {
		color: #282828;
		margin-left: 15rpx;
	}
	.product-con .notice .swiper {
		height: 100%;
		width: 360rpx;
		line-height: 62rpx;
		overflow: hidden;
		margin-left: 14rpx;
	}
	.product-con .notice .swiper swiper {
		height: 100%;
		width: 100%;
		overflow: hidden;
		font-size: 24rpx;
		color: #282828;
	}
	.product-con .assemble .item {
		padding-right: 20rpx;
		margin-left: 20rpx;
		height: 132rpx;
	}
	.product-con .assemble .item .pictxt {
		width: 270rpx;
	}
	.product-con .assemble .item .pictxt .text {
		width: 184rpx;
	}
	.product-con .assemble .item .pictxt .pictrue {
		width: 80rpx;
		height: 80rpx;
	}
	.product-con .assemble .item .pictxt .pictrue image {
		width: 100%;
		height: 100%;
		border-radius: 50%;
	}
	.product-con .assemble .item .right .lack {
		font-size: 24rpx;
		margin-bottom: 6rpx;
	}
	.product-con .assemble .item .right .time {
		position: relative;
		left: -10rpx;
		font-size: 22rpx;
		color: #999999;
	}
	.product-con .assemble .item .right .spellBnt {
		font-size: 24rpx;
		color: #fff;
		width: 142rpx;
		height: 52rpx;
		border-radius: 26rpx;
		background-image: linear-gradient(to right, var(--view-bntColor22) 0%, var(--view-bntColor21) 100%);
		text-align: center;
		line-height: 50rpx;
		margin-left: 30rpx;
	}
	.product-con .assemble .item .right .spellBnt .iconfont {
		font-size: 25rpx;
		margin-left: 5rpx;
	}
	.product-con .assemble .more {
		font-size: 24rpx;
		color: #282828;
		text-align: center;
		height: 90rpx;
		line-height: 90rpx;
	}
	.product-con .assemble .more .iconfont {
		margin-left: 13rpx;
		font-size: 25rpx;
	}
	.product-con .nav .time {
		font-size: 20rpx;
		color: #fff;
		text-align: center;
	}
	.product-con .nav .iconfont {
		color: #fff;
		font-size: 30rpx;
		margin-left: 20rpx;
	}
	.product-con .wrapper {
		padding-top: 32rpx;
		width: 100%;
		box-sizing: border-box;
	}
	.product-con .attribute .atterTxt1{
		color: #282828;
	}
	.product-con .wrapper .introduce {
		margin: 0;
		position: relative;
		max-width: 560rpx;
	}
	.product-con .wrapper .introduce .iconfont {
		font-size: 37rpx;
		color: #515151;
	}
	.product-con .wrapper .label {
		margin: 18rpx 0 0 0;
		font-size: 24rpx;
		color: #999;
	}
	.product-con .playWay {
		padding: 0 20rpx;
		font-size: 28rpx;
		color: #282828;
	}
	.product-con .playWay .title {
		height: 86rpx;
		border-bottom: 1px solid #eee;
	}
	.product-con .playWay .title .iconfont {
		margin-left: 13rpx;
		font-size: 28rpx;
		color: #717171;
	}
	.product-con .playWay .way {
		min-height: 110rpx;
		font-size: 26rpx;
		color: #282828;
	}
	.product-con .playWay .way .iconfont {
		color: #cdcdcd;
		font-size: 40rpx;
		margin: 0 35rpx;
	}
	.product-con .playWay .way .item .num {
		font-size: 34rpx;
		margin-right: 6rpx;
		width: 17px;
		display: inline-block;
		vertical-align: middle;
	}
	.product-con .playWay .way .item .tip {
		font-size: 22rpx;
		color: #a5a5a5;
		margin-top: -4rpx;
	}
	.product-con .playWay .way .way_text {
		position: relative;
		top: 4rpx;
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
			flex: 33.33%
		}
	}
	.product-con .mask {
		z-index: 88;
	}
	.product-con .footer {
		padding: 0 20rpx 0 40rpx;
	}
	.product-con .footer .bnt {
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
		border-radius: 50rpx 0 0 50rpx;
		background-image: linear-gradient(to right, var(--view-bntColor11) 0%, var(--view-bntColor12) 100%);
	}
	.product-con .footer .bnt .buy {
		border-radius: 0 50rpx 50rpx 0;
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
	action-sheet-item {
		padding: 0;
		height: 240rpx;
		align-items: center;
		display: flex;
	}
	.canvas {
		z-index: 300;
		width: 750px;
		height: 1190px;
	}
	.mask {
		background-color: rgba(0, 0, 0, 0.6);
	}
</style>
