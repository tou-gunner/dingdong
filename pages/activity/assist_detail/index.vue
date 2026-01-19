<template>
	<view :style="viewColor" class="page-container">
		<view class="fixed-head">
			<view class="sys-head" :style="{height:sysHeight}"></view>
			<view class="tool-bar">
				<view class='iconfont icon-ic_leftarrow' @tap='goBack'></view>
			</view>
		</view>
		<view class='bargain'>
			<view class="bargain-bg" :style="{ 'background-image': bargainInfo.relation == 10 ? `url(${domain}/static/images/assist_detail2.png)` : `url(${domain}/static/images/assist_detail1.png)`}">
				<view class="header">
					<view class="sys-head" :style="{height:sysHeight}"></view>
					<view class='people'>
						{{bargainInfo.view_num || 0}}人查看 丨 {{bargainInfo.share_num || 0}}人分享 丨 {{bargainInfo.user_count_all || 0}}人参与
					</view>
				</view>
			</view>
			<view class="pad20 assist-wrapper">
				<view v-if="bargainInfo.relation == 10" class='pictime' :style="{ 'background-image': `url(${domain}/static/images/assist-time.png)`}">
					<countDown :tipText="'倒计时'" :dayText="'天'" :hourText="':'" :minuteText="':'" :secondText="' '" :datatime="datatime" :colorTheme="true" :noTheme="true" :isDay="true"></countDown>
				</view>
				<view v-if="bargainInfo.relation == 1 || bargainInfo.relation == -2" class='pictxt' :style="{ 'background-image': `url(${domain}/static/images/assist-time.png)`}">
					<view class="picheight acea-row row-center-wrapper">
						<view class='pictrue'>
							<image :src='userInfo.avatar || "/static/images/f.png"'></image>
						</view>
						<view class='text'>
							<text>{{userInfo.nickname || ''}}</text>
							邀请您助力加油
						</view>
					</view>
				</view>
				<view class='wrapper bg-f'>
					<view class='pic-wrapper'>
						<view class="acea-row" @tap="goProduct">
							<view class='pictrue'>
								<image :src='bargainInfo.product && bargainInfo.product.image ? bargainInfo.product.image : ""'></image>
							</view>
							<view class='text acea-row row-column-between'>
								<view>
									<view class='line2'>{{bargainData.store_name}}</view>
									<view class='successNum'>已有<text>{{bargainInfo.user_count_product}}</text>人助力成功</view>
								</view>
								<view>
									<view class='money'>
										<text class="money-text">当前</text>
										<priceFormat :price="bargainPrice" weight intSize="48" floatSize="32" labelSize="32"></priceFormat>
									</view>
								</view>
							</view>
						</view>
						<!-- 进度条 -->
						<block v-if="bargainInfo.yet_assist_count != bargainInfo.assist_count">
							<view class="cu-progress acea-row row-middle round margin-top">
								<view class='acea-row row-middle bg-red' :style="'width:'+ (bargainInfo.yet_assist_count/bargainInfo.assist_count*100).toFixed(2) +'%;'"></view>
							</view>
							<view class="acea-row row-between-wrapper">
								<view class="assist-schedule" :style="'left:'+ (bargainInfo.yet_assist_count/bargainInfo.assist_count*100).toFixed(2) +'%;'">
									<image class="chopper" :src="`${domain}/static/images/assist_chopper.png`"></image>
									<view class="assist-count" :class="bargainInfo.yet_assist_count<=0 ? 'opacity0' : ''">{{bargainInfo.yet_assist_count}}人已助力</view>
								</view>
								<view class='money'>
									<view v-if="bargainInfo.yet_assist_count != bargainInfo.assist_count">还差{{bargainInfo.assist_count-bargainInfo.yet_assist_count}}人</view>
								</view>
							</view>
						</block>
						<!-- 帮助助力、助力成功： -->
						<view v-if="bargainInfo.relation == 10">
							<view v-if="bargainInfo.yet_assist_count == bargainInfo.assist_count">
								<view class='bargainSuccess acea-row row-middle row-center'>
									<text class='iconfont icon-a-ic_CompleteSelect'></text>
									<view class="red">恭喜您助力成功，快去支付</view>
								</view>
								<view v-if="bargainInfo.order.paid != 0 && bargainInfo.order.paid != 1" class='bargainBnt' @tap='goPay'>立即支付</view>
								<view v-else class='bargainBnt' @tap='goOrderDetail(bargainInfo.order)'>查看订单</view>
								<view class='bargainBnt on' @tap='goBargainList'>抢更多商品</view>
							</view>
							<view v-else>
								<!-- #ifdef H5 -->
								<button class='bargainBnt' v-if="$wechat.isWeixin()" @click="H5ShareBox = true">邀请好友助力</button>
								<button v-else class='bargainBnt copy-data' :data-clipboard-text="protocol +
									'//' +
									host +
									'/pages/activity/assist_detail/index?id='+
									id+'&spid='+uid">邀请好友助力</button>
								<!-- #endif -->
								<!-- #ifdef MP-->
								<button open-type='share' class='bargainBnt'>邀请好友助力</button>
								<!-- #endif -->
								<!-- #ifdef APP-PLUS -->
								  <button class='bargainBnt' @click="listenerActionSheet">邀请好友助力</button>
								<!-- #endif -->
							</view>
						</view>
						<view v-if="bargainInfo.relation == 1">
							<view class='bargainBnt' @tap='setBargainHelp' :class="load ? 'disabled' : ''">为好友助力</view>
						</view>
						<view v-if="bargainInfo.relation == -1 || bargainInfo.relation == -2">
							<view>
								<view v-if="bargainInfo.relation == -2" class='bargainSuccess  acea-row row-middle row-center'>
									<text class='iconfont icon-a-ic_CompleteSelect'></text>
									<view>已成功助力好友</view>
								</view>
								<view v-else class='bargainSuccess acea-row row-middle row-center'>
									<text class='iconfont icon-a-ic_CompleteSelect' style="color: #999999;"></text>
									<view>商品助力次数上限</view>
								</view>
								<view class='bargainBnt' @tap='currentBargainUser'>我也要发起助力</view>
							</view>
						</view>
					</view>
				</view>
				<view v-if="bargainInfo.yet_assist_count>0" class='bargainGang bg-f mt20'>
					<view class='title' :style="{ 'background-image': `url(${domain}/static/images/assist_cut_title.png)`}"></view>
					<view class="pad20">
						<view class='list'>
							<block v-for="(item,index) in bargainUserHelpList" :key='index'>
								<view class='item acea-row row-between-wrapper'>
									<view class='pictxt acea-row row-center row-middle'>
										<view class='pictrue'>
											<image :src='item.avatar_img' v-if="item.avatar_img"></image>
											<image src='/static/images/f.png' v-else></image>
										</view>
										<view class='text'>
											<view class='name line1'>{{item.nickname}}</view>
											<view class='line1'>{{item.create_time}}</view>
										</view>
									</view>
									<view class='money t-color'>
										已助力
									</view>
								</view>
							</block>
						</view>
						<view class='load font-color' v-if="!limitStatus" @tap='getBargainUser'>点击加载更多</view>
					</view>
				</view>
				<view class='goodsDetails boder-24 mt20'>
					<view class='title' :style="{ 'background-image': `url(${domain}/static/images/assist_goods_detail.png)`}"></view>
					<view v-if="bargainInfo.product && bargainInfo.product.content" class='conter bg-f'>
						<jyf-parser :domain='domain' :html="bargainInfo.product.content.content.replace(/<br\/>/ig, '')" ref="article" :tag-style="tagStyle"></jyf-parser>
					</view>
				</view>
			</view>
			<view class='mask' catchtouchmove="true" v-show='active==true' @tap='close'></view>
		</view>
		<!-- 发送给朋友图片 -->
		<view class="share-box" v-if="H5ShareBox">
			<image :src="`${domain}/static/images/share-info.png`" @click="H5ShareBox = false"></image>
		</view>
		<home></home>
		<!-- 分享按钮 -->
		<view class="generate-posters acea-row row-middle" :class="posters ? 'on' : ''">
			<button class="item" hover-class='none' @tap="downloadFilePromotionCode">
				<view class="iconfont icon-a-ic_picture1"></view>
				<view class="">生成海报</view>
			</button>
			<button class="item" hover-class='none' @click="copyPwd">
				<view class="iconfont icon-ic_key"></view>
				<view>生成口令</view>
			</button>
		</view>
		<view class="mask" v-if="posters || posterImageStatus" @click="listenerActionClose"></view>
		<!--口令复制结果-->
		<copyPassword :isCopy='isCopy' :copyUrl='copyUrl' @close="closeCopy"></copyPassword>
		<!-- 海报展示 -->
		<view class='poster-pop' v-if="posterImageStatus">
			<image src='../../../static/images/poster-close.png' class='close' @click="posterImageClose"></image>
			<image class="poster-image" :src='posterImage'></image>
			<!-- #ifndef H5  -->
			<view class='save-poster' @click="savePosterPath">保存到手机</view>
			<!-- #endif -->
			<!-- #ifdef H5 -->
			<view class="keep">长按图片可以保存到手机</view>
			<!-- #endif -->
		</view>
		<canvas class="canvas" canvas-id='myCanvas' v-if="canvasStatus"></canvas>
		<!-- #ifndef H5 -->
		<passwordPopup></passwordPopup>
		<!-- #endif -->
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
	let sysHeight = uni.getSystemInfoSync().statusBarHeight + 'px';
	import {
		getAssistDetail,
		postAssistHelp,
		assistHelpList,
		initiateAssistApi,
		getAssistUser
	} from '../../../api/activity.js';
	import { HTTP_REQUEST_URL } from '@/config/app';
	import { toLogin } from '@/libs/login.js';
	import { postCartAdd, getProductCode, copyPasswordApi } from '../../../api/store.js';
	import copyPassword from '@/components/copyPassword';
	import util from '../../../utils/util.js';
	import ClipboardJS from "@/plugin/clipboard/clipboard.js";
	import { mapGetters } from "vuex";
	import { configMap, silenceBindingSpread } from "@/utils";
	// #ifndef H5
	import passwordPopup from '@/components/passwordPopup';
	// #endif
	import countDown from '@/components/countDown';
	import home from '@/components/home';
	import parser from "@/components/jyf-parser/jyf-parser";
	import { spread, imgToBase } from '@/api/user.js'
	import history from "@/mixins/history";
	import shareScence from "@/libs/spread";
	const app = getApp();
	export default {
		components: {
			// #ifndef H5
			passwordPopup,
			// #endif
			countDown,
			copyPassword,
			home,
			"jyf-parser": parser
		},
		mixins: [history],
		/**
		 * 页面的初始数据
		 */
		data() {
			return {
				sysHeight: sysHeight,
				countDownDay: '00',
				countDownHour: '00',
				countDownMinute: '00',
				countDownSecond: '00',
				active: false,
				id: 0, //助力产品编号
				userInfo: {}, //当前用户信息
				bargainUid: 0, //开启助力用户
				bargainUserInfo: {}, //开启助力用户信息
				bargainUserId: 0, //开启助力编号
				bargainInfo: [], //助力产品
				bargainData: {
					assistSku: []
				},
				offset: 0,
				limit: 20,
				limitStatus: false,
				bargainUserHelpList: [],
				bargainUserHelpInfo: [],
				bargainUserBargainPrice: 0,
				status: '', // 0 开启助力   1  朋友帮忙助力  2 朋友帮忙助力成功 3 完成助力  4 助力失败 5已创建订单
				bargainCount: [], //分享人数  浏览人数 参与人数
				old_price: 0,
				retunTop: true,
				bargainPartake: 0,
				interval: null,
				userBargainStatus: 0, //判断自己是否助力
				productStock: 0, //判断是否售罄；
				quota: 0, //判断是否已限量；
				userBargainStatusHelp: true,
				navH: '',
				statusPay: '',
				bargainSumCount: 0,
				bargainPrice: 0,
				datatime: 0,
				offest: '',
				tagStyle: {
					img: 'width:100%;display:block;',
					video: 'width:100%;'
				},
				domain: HTTP_REQUEST_URL,
				H5ShareBox: false, //公众号分享图片
				systemH: 0,
				pages: '',
				protocol: '',
				host: '',
				currSpid: "",
				posters: false,
				actionSheetHidden: true,
				posterImageStatus: false,
				storeImage: '', //海报产品图
				PromotionCode: '', //二维码图片
				canvasStatus: false, //海报绘图标签
				posterImage: '', //海报路径
				posterbackgd: '/static/images/posterbackgd.png',
				isDown: true,
				isCopy: false,
				copyUrl: '',
				load: false,
			}
		},
		computed:{
			...configMap({site_name: '',share_pic: ''}, mapGetters(['isLogin','uid','viewColor','keyColor'])),
		},
		watch: {
			isLogin: {
				handler: function(newV, oldV) {
					if (newV) {
						this.getBargainDetails();
					}
				},
				deep: true
			}
		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			var that = this;
			if(options.spid){
				app.globalData.spid = options.spid;
				that.currSpid = options.spid
			}
			// #ifdef MP
			uni.getSystemInfo({
				success: function(res) {
					that.systemH = res.statusBarHeight
					that.navH = that.systemH + 10
				}
			})
			// #endif
			//扫码携带参数处理
			// #ifdef MP
			if (options.scene) {
				var value = util.getUrlParams(decodeURIComponent(options.scene));
				if (typeof value === 'object') {
					if (value.id) options.id = value.id;
					if (value.bargain) options.bargain = value.bargain;
					//记录推广人uid
					if (value.spid){
						app.globalData.spid = value.spid;
						that.currSpid = value.spid
					}
				} else {
					app.globalData.spid = value;
				}
			}
			//记录推广人uid
			if (options.spid) app.globalData.spid = options.spid;
			// #endif
			if (options.hasOwnProperty('id')) {
				that.id = options.id;
				that.bargainUid = options.bargain || 0
			}
			if (that.isLogin) {
				if (that.bargainUid == 'undefined') {
					that.bargainUid = that.$store.state.app.uid
				}
				that.getBargainDetails();
				// #ifdef MP
				that.getHistory()
				// #endif
			} else {
				toLogin()
			}
			shareScence(that.currSpid,that.isLogin)
			uni.setNavigationBarTitle({
				title: '助力详情'
			})
		},
		onShow: function(){
			// #ifdef H5
			this.protocol = window.location.protocol
			this.host = window.location.host
			//#endif
		},
		onReady: function() {
			// #ifdef H5
			this.$nextTick(function() {
				const clipboard = new ClipboardJS(".copy-data");
				clipboard.on("success", () => {
					this.$util.Tips({
						title: '链接已复制成功，请粘贴分享'
					});
				});
			});
			// #endif
		},
		methods: {
			goBack: function() {
				uni.navigateBack({
					delta: 1
				})
			},
			// 去商品页
			goProduct() {
				uni.navigateTo({
					url: `/pages/goods_details/index?id=${this.bargainInfo.product.old_product_id}`
				})
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
				// #ifdef H5
				arr2 = [that.posterbackgd, await that.imgToBase(that.storeImage), await that.imgToBase(that.codeImg), await that.imgToBase(that.share_pic)];
				// #endif
				// #ifdef MP || APP-PLUS
				arr2 = [that.posterbackgd, await that.fileStoreImage(that.storeImage), await that.fileStoreImage(
					that.codeImg), await that.fileStoreImage(that.share_pic)];
				// #endif
				that.$util.goodsPosterCanvas(arr2, that.bargainData.store_name, that.bargainPrice, that.site_name, that.old_price, function(tempFilePath) {
					that.$set(that, 'posterImage', tempFilePath);
					that.$set(that, 'posterImageStatus', true);
					that.$set(that, 'canvasStatus', false);
					that.$set(that, 'actionSheetHidden', !that.actionSheetHidden);
				}, (err) => {
					that.$set(that, 'canvasStatus', false);
				});
			},
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
									title: `${error}`
								});
							}
						});
					})
				}
			},
			/**
			 * 分享打开
			 *
			 */
			listenerActionSheet: function() {
				this.posters = !this.posters;
			},
			// 分享关闭
			listenerActionClose: function() {
				this.posters = false;
			},
			//隐藏海报
			posterImageClose: function() {
				this.posterImageStatus = false
			},
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
					product_type: 3
				}).then(async res => {
					that.codeImg = res.data.url;
					that.$set(that, 'isDown', false);
					that.goPoster()
				}).catch(err => {
					that.$util.Tips({
						title: err
					});
					that.posters = false;
					that.$set(that, 'isDown', false);
					that.$set(that, 'PromotionCode', '');
				});
			},
			/*
			 * 保存到手机相册
			 */
			savePosterPath: function() {
				let that = this;
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
					product_type: 30
				}).then(async res => {
					that.copyUrl = res.data.str;
					that.posters = false
					that.isCopy = true;
				})
			},
			closeCopy(){
				this.isCopy = false
			},
			goPay: function() { //立即支付
				var that = this;
				var data = {
					product_id: that.bargainInfo.product_assist_set_id,
					product_attr_unique: that.bargainInfo.product.unique,
					cart_num: 1,
					product_type: 3,
					is_new: 1
				};
				postCartAdd(data).then(res => {
					uni.navigateTo({
						url: '/pages/users/order_confirm/index?new=1&cartId=' + res.data.cart_id
					});
				}).catch(err => {
					return that.$util.Tips({
						title: err
					})
				});
			},
			getBargainDetails: function() { //获取助力产品详情
				var that = this;
				var id = that.id;
				getAssistDetail(id,{type: 2}).then(function(res) {
					that.bargainInfo = res.data;
					that.bargainData = res.data.assist;
					that.bargainPrice = that.bargainData.assistSku[0].assist_price;
					that.old_price = (that.bargainData.assistSku[0].sku && that.bargainData.assistSku[0].sku.price) || 0;
					that.userInfo = res.data.user;
					that.bargainSumCount = res.data.yet_assist_count;
					that.$set(that, 'storeImage', that.bargainInfo.product.image);
					that.datatime = res.data.stopTime;
					that.pages = '/pages/activity/assist_detail/index?id=' + that.id;
					that.bargainUserHelpList = []
					that.getBargainUser();
					//#ifdef H5
					that.setOpenShare();
					//#endif
				}).catch(function(err) {
					that.$util.Tips({
						title: err
					}, {
						tab: 3
					})
				})
			},
			currentBargainUser: function() { //当前用户助力
				let that = this;
				let id = that.bargainInfo.product_assist_id;
				initiateAssistApi(id).then(res => {
					let assist_id = res.data.product_assist_set_id
					uni.hideLoading();
					uni.navigateTo({
						url: '/pages/activity/assist_detail/index?id=' + assist_id
					});
				}).catch((err) => {
					uni.hideLoading();
					that.$util.Tips({
						title: err
					})
				});
			},
			setBargainHelp: function() { //帮好友助力
				var that = this;
				that.load = true
				postAssistHelp(that.bargainInfo.product_assist_set_id).then(res => {
					that.$set(that, 'bargainUserHelpList', []);
					that.getBargainUser();
					that.$util.Tips({
						title: res.message
					})
					that.getBargainDetails();
					that.load = false
				}).catch(err => {
					that.$util.Tips({
						title: err
					})
					that.$set(that, 'bargainUserHelpList', []);
					that.getBargainUser();
					that.load = false
				})
			},
			getBargainUser: function() { //获取助力帮
				var that = this;
				var data = {
					offset: that.offset,
					limit: that.limit,
				};
				assistHelpList(that.id).then(res => {
					var bargainUserHelpListNew = [];
					var bargainUserHelpList = that.bargainUserHelpList;
					var len = res.data.list.length;
					bargainUserHelpListNew = bargainUserHelpList.concat(res.data.list);
					that.$set(that, 'bargainUserHelpList', res.data.list);
					that.$set(that, 'limitStatus', data.limit > len);
					that.$set(that, 'offest', (Number(data.offset) + Number(data.limit)));
				});
			},
			goBargainList: function() {
				uni.navigateTo({
					url: '/pages/activity/assist/index',
				})
			},
			goOrderDetail: function(order) {
				if (order.paid == 1) {
					uni.navigateTo({
						url: '/pages/order_details/index?order_id=' + order.order_id,
					})
				} else {
					uni.navigateTo({
						url: '/pages/order_details/stay?order_id=' + order.group_order_id,
					})
				}
			},
			close: function() {
				this.$set(this, 'active', false);
			},
			addShareAssist: function() { //添加分享次数 获取人数
				var that = this;
				getAssistUser(that.bargainInfo.product_assist_set_id).then(res => {});
			},
			//#ifdef H5
			setOpenShare() {
				let that = this;
				let configTimeline = {
					title: "您的好友" +
						that.userInfo.nickname +
						"邀请您助力" +
						that.bargainInfo.product.store_name,
					desc: that.bargainInfo.product.store_name,
					link: window.location.protocol +
						"//" +
						window.location.host +
						"/pages/activity/assist_detail/index?id=" +
						that.id+'&spid='+that.uid,
					imgUrl: that.bargainInfo.product.image,
				};
				if (this.$wechat.isWeixin()) {
					this.$wechat.wechatEvevt([
						"updateAppMessageShareData",
						"updateTimelineShareData",
						"onMenuShareAppMessage",
						"onMenuShareTimeline"
					],
					configTimeline
					)
					.then(res => {
						console.log(res);
					})
					.catch(res => {
						if (res.is_ready) {
							res.wx.updateAppMessageShareData(configTimeline);
							res.wx.updateTimelineShareData(configTimeline);
							res.wx.onMenuShareAppMessage(configTimeline);
							res.wx.onMenuShareTimeline(configTimeline);
						}
					});
				}
			}
			//#endif
		},
		/** 生命周期函数--监听页面隐藏
		 */
		onHide: function() {
			if (this.interval !== null) clearInterval(this.interval);
		},
		/**
		 * 生命周期函数--监听页面卸载
		 */
		onUnload: function() {
			if (this.interval !== null) clearInterval(this.interval);
		},
		//#ifdef MP
		/**
		 * 用户点击右上角分享
		 */
		onShareAppMessage: function() {
			let that = this,
				share = {
					title: '您的好友' + that.userInfo.nickname + '邀请您帮他助力' + that.bargainInfo.product.store_name + ' 快去帮忙吧！',
					path: '/pages/activity/assist_detail/index?id=' + this.id+'&spread='+that.uid,
					imageUrl: that.bargainInfo.product.image,
				};
			that.close();
			that.addShareAssist();
			return share;
		},
		//#endif
	}
</script>

<style lang="scss" scoped>
	.page-container {
		min-height: 100vh;
		background: linear-gradient(rgba(255,135,97,0) 0%, rgba(255, 135, 97, 0) 48%);
		background-size: 100% 1000rpx;
	}
	.canvas {
		z-index: 300;
		width: 750px;
		height: 1190px;
		opacity: 0;
	}

	.mask {
		z-index: 100;
	}
	.generate-posters .item {
		flex: 50%;
		text-align: center;
		font-size: 30rpx;
	}
	.assist-wrapper{
		margin-top: -620rpx;
	}
	.bargain{
		.picheight{
			height: 100rpx;
		}
	}
	.bargain .bargain-bg {
		height: 1000rpx;
		background-repeat: no-repeat;
		background-size: 100% 100%;
	}
	.bargain .icon-ic_leftarrow {
		font-size: 40rpx;
		color: #fff;
		position: fixed;
		top: 30rpx;
		left: 30rpx;
		z-index: 99;
		font-size: 36rpx;
	}
	.bargain .header {
		position: relative;
	}
	.bargain .pictxt,.bargain .pictime {
		background-size: 100% 100%;
		background-repeat: no-repeat;
		height: 116rpx;
	}
	.bargain .pictime{
		padding-top: 30rpx;
	}
	.bargain .pictxt .pictrue {
		width: 56rpx;
		height: 56rpx;
	}
	.bargain .pictxt .pictrue image {
		width: 100%;
		height: 100%;
		border-radius: 50%;
		border: 2rpx solid #fff;
	}
	.bargain .pictxt .text text {
		margin: 0 10rpx;
		color: #E93323;
		font-weight: bold;
	}
	::v-deep .bargain .header .time {
		background-repeat: no-repeat;
		background-size: 100% 100%;
		width: 480rpx;
		height: 166rpx;
		font-size: 22rpx;
		text-align: center;
		padding-top: 11rpx;
		box-sizing: border-box;
		position: absolute;
		top: 340rpx;
		left: 50%;
		margin-left: -240rpx;
		align-items: inherit;
	}
	.t-color {
		color: #E93323;
	}
	.b-color {
		background-color: #E93323;
	}
	.bargain .header .people {
		text-align: center;
		color: #fff;
		font-size: 20rpx;
		position: relative;
		width: 100%;
		/* #ifdef MP || APP-PLUS */
		height: 44px;
		line-height: 44px;
		/* #endif */
		/* #ifdef H5 */
		top: 36rpx;
		/* #endif */
	}
	.bargain .bargainGang,
	.bargain .goodsDetails {
		width: 100%;
		box-sizing: border-box;
		position: relative;
		border-radius: 24rpx;
	}
	.bargain .wrapper{
		border-radius: 0 0 24rpx 24rpx;
	}
	.bargain .wrapper .pic-wrapper{
		padding: 20rpx 20rpx 52rpx;
	}
	.bargain .wrapper .pic-wrapper .pictrue {
		width: 280rpx;
		height: 280rpx;
		position: relative;
	}
	.bargain .wrapper .pic-wrapper .pictrue image {
		width: 100%;
		height: 100%;
		border-radius: 16rpx;
	}
	.bargain .pic-wrapper .text {
		width: 340rpx;
		margin-left: 30rpx;
	}
	.bargain .pic-wrapper .text .line2{
		font-weight: 500;
		font-size: 28rpx;
	}
	.bargain .pic-wrapper .text .money {
		color: #E93323;
	}
	.bargain .pic-wrapper .text .money .money-text {
		color: #999999;
		margin-right: 12rpx;
	}
	.bargain .wrapper .pic-wrapper .text .successNum {
		font-size: 22rpx;
		color: #999;
		margin-top: 12rpx;
	}
	.bargain .wrapper .pic-wrapper .successNum text{
		color: #FE960F;
	}
	.bargain .wrapper .cu-progress {
		margin-top: 60rpx;
		height: 20rpx;
		background-color: rgba(233, 51, 35, .08);
		width: 100%;
		border-radius: 20rpx;
		position: relative;
	}
	.bargain .wrapper .assist-schedule {
		position: relative;
	}
	.bargain .wrapper .chopper{
		width: 70rpx;
		height: 70rpx;
		position: absolute;
		top: -40rpx;
		left: -40rpx;
	}
	.bargain .wrapper .assist-count {
		display: inline-block;
		height: 48rpx;
		line-height: 48rpx;
		background: #E93323;
		border-radius: 8rpx;
		padding: 0 10rpx;
		color: #ffffff;
		font-size: 22rpx;
		position: relative;
		margin-left: -66rpx;
		top: 20rpx;
		&.opacity0 {
			opacity: 0;
		}
		&::before{
			content: "";
			border: 10rpx solid transparent;
			border-bottom-color: #E93323;
			position: absolute;
			left: 50%;
			margin-left: -8rpx;
			top: -18rpx;
		}
	}
	.bargain .wrapper .cu-progress .bg-red {
		width: 0;
		height: 100%;
		transition: width 0.6s ease;
		border-radius: 20rpx;
		background: #E93323;
	}
	.bargain .wrapper .money {
		font-size: 22rpx;
		color: #999;
		margin-top: 15rpx;
	}
	.bargain .wrapper .bargainSuccess {
		font-size: 32rpx;
		color: #282828;
		text-align: center;
		margin-top: 50rpx;
	}
	.bargain .wrapper .bargainSuccess .red {
		color: #E93323;
	}
	.bargain .wrapper .bargainSuccess .iconfont {
		font-size: 32rpx;
		color: #54c762;
		padding-right: 18rpx;
	}
	.bargain .wrapper .bargainBnt {
		font-size: 28rpx;
		font-weight: 500;
		color: #fff;
		width: 100%;
		height: 88rpx;
		border-radius: 50rpx;
		background: linear-gradient( 90deg, #E93323 0%, #FF7931 100%);
		text-align: center;
		line-height: 88rpx;
		margin-top: 50rpx;
		&.disabled {
			background: #BFBFBF;
			pointer-events: none;
		}
	}
	.bargain .wrapper .bargainBnt.on {
		border: 2rpx solid #E93323;
		color: #E93323;
		background-image: linear-gradient(to right, #fff 0%, #fff 100%);
		width: 100%;
		height: 86rpx;
		margin-top: 20rpx;
	}
	.bargain .bargainGang .title,
	.bargain .goodsDetails .title {
		height: 86rpx;
		background-size: 100% 100%;
		background-repeat: no-repeat;
		border-radius: 24rpx 24rpx 0 0;
	}
	.bargain .bargainGang .list .item {
		padding: 10rpx 0;
	}
	.bargain .bargainGang .list .item .pictxt {
		 width: 330rpx;
	}
	.bargain .bargainGang .list .item .pictxt .pictrue {
		width: 80rpx;
		height: 80rpx;
		margin-right: 16rpx;
	}
	.bargain .bargainGang .list .item .pictxt .pictrue image {
		width: 100%;
		height: 100%;
		border-radius: 50%;
	}
	.bargain .bargainGang .list .item .pictxt .text {
		width: 225rpx;
		font-size: 22rpx;
		color: #999;
	}
	.bargain .bargainGang .list .item .pictxt .text .name {
		font-size: 25rpx;
		color: #282828;
		margin-bottom: 7rpx;
	}
	.bargain .bargainGang .list .item .money {
		font-size: 28rpx;
	}
	.bargain .bargainGang .list .item .money .iconfont {
		font-size: 35rpx;
		vertical-align: middle;
		margin-right: 10rpx;
	}
	.bargain .bargainGang .load {
		font-size: 24rpx;
		text-align: center;
		line-height: 80rpx;
		height: 80rpx;
	}
	.bargain .goodsDetails~.goodsDetails {
		margin-bottom: 50rpx;
	}
	.bargain .goodsDetails .conter {
		overflow: hidden;
		padding: 20rpx;
	}
	.bargain .mask {
		z-index: 100;
	}
</style>
