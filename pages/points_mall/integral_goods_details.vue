<template>
	<view :style="viewColor">
		<view class='product-con'>
			<!-- #ifdef H5 -->
			<view class="head-wrapper" :style="'top:'+statusBarHeight">
				<view class="head-menu">
					<view class='iconfont icon-ic_leftarrow' @click.native="returns"></view>
					<view class="iconfont icon-ic_home" @click.native="goHome"></view>
				</view>
			</view>
			<!-- #endif -->
			<scroll-view :scroll-top="scrollTop" scroll-y='true' scroll-with-animation="true"
				:style="'height:'+height+'px;'" @scroll="scroll">
				<view id="past0">
					<productConSwiper :imgUrls='imgUrls'></productConSwiper>
				</view>
				<view class="goods-detail-count swiper-bg">
					<view class="detail-count pad30">
						<view class='nav acea-row row-between-wrapper'>
							<view class="share acea-row row-between row-bottom">
								<view class="money">
									<image :src="`${domain}/static/images/jf-point.png`" mode=""></image>
									<view class="price-count">
										<text class="num">{{storeInfo.ot_price || 0}}</text>
										<text>积分</text><text v-if="storeInfo.price > 0">+{{storeInfo.price}}元</text>
									</view>
								</view>
								<view></view>
							</view>
						</view>
						<view class='wrapper'>
							<view class='introduce acea-row row-between'>
								<view> {{storeInfo.store_name}}</view>
							</view>
							<view class='label acea-row row-middle'>
								<view class='stock line-through'>¥{{storeInfo.cost}}</view>
								<view class='stock'>库存:
									{{ storeInfo.stock}}
								</view>
								<view class='stock'>已兑换：{{storeInfo.sales}}
								</view>
							</view>
						</view>
					</view>
					<view class="pad20 mt20">
						<view class="attribute bg-f boder-24" v-if='attribute.productAttr.length' @tap='selecAttr'>
							<view class='acea-row row-between-wrapper df'>
								<view><view class='atterTxt line1'>{{attr}}：{{attrValue}}</view></view>
								<view class='iconfont icon-ic_rightarrow'></view>
							</view>
							<view class="acea-row row-between-wrapper" style="margin-top:7px;padding-left:55px;" v-if="skuArr.length > 1">
								<view class="flex">
									<image :src="item.image" v-for="(item,index) in skuArr.slice(0,4)" :key="index" class="attrImg"></image>
								</view>
								<view class="switchTxt">共{{skuArr.length}}种规格可选</view>
							</view>
						</view>
						<view class='product-intro' id="past2">
							<view class='title'>产品介绍</view>
							<view class='conter'>
								<jyf-parser :html="storeInfo.description" ref="article" :tag-style="tagStyle"></jyf-parser>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
			<view class='footer acea-row row-between-wrapper'>
				<navigator hover-class="none" class="item" url="/pages/points_mall/index">
					<view class="iconfont icon-ic_gift1"></view>
					<view class="p_center">积分商城</view>
				</navigator>

				<view class="bnt acea-row"
					v-if="attribute.productSelect.stock>0">
					<view class="buy bnts" @tap="goCat">立即兑换</view>
				</view>
				<view class="bnt acea-row" v-else>
					<view class="bnts no-goods">无法兑换</view>
				</view>
			</view>
		</view>
		<product-window :attr='attribute' :limitCount='limitNum' :type="'points'" :domain="domain" :isShow="true" @myevent="onMyEvent" @ChangeAttr="ChangeAttr"
			 @ChangeCartNum="ChangeCartNum" @attrVal="attrVal" @iptCartNum="iptCartNum" id="product-window"></product-window>
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
	const app = getApp();
	var statusBarHeight = uni.getSystemInfoSync().statusBarHeight + 'px';
	import { mapGetters } from "vuex";
	import { getIntegralProductDetail } from '@/api/points_mall.js';
	import { postCartAdd } from '@/api/store.js';
	import productConSwiper from '@/components/productConSwiper/index.vue'
  import productWindow from '@/components/productWindow';
	import parser from "@/components/jyf-parser/jyf-parser";
	import { imageBase64 } from "@/api/public";
	import { toLogin } from '@/libs/login.js';
	import { silenceBindingSpread } from "@/utils";
	import { getUserInfo } from '@/api/user.js';
	import {HTTP_REQUEST_URL} from '@/config/app';
	export default {
		computed: mapGetters(['uid','isLogin','viewColor','keyColor']),
		data() {
			return {
				dataShow: 0,
				id: 0,
				time: 0,
				storeInfo: [],
				imgUrls: [],
				domain:HTTP_REQUEST_URL,
				statusBarHeight: statusBarHeight, //系统导航条高度
				parameter: {
					'navbar': '1',
					'return': '1',
					'title': '抢购详情页',
					'color': false
				},
				attribute: {
					cartAttr: false,
					productAttr: [],
					productSelect: {}
				},
				productValue: [],
				isOpen: false,
				attr: '请选择',
				attrValue: '',
				status: 1,
				iShidden: false,
				limitNum: 0, //限制本属性产品的个数；
				iSplus: false,
				replyCount: 0, //总评论数量
				reply: [], //评论列表
				replyChance: 0,
				navList: ['商品', '详情'],
				opacity: 0,
				scrollY: 0,
				topArr: [],
				height: 0,
				heightArr: [],
				lock: false,
				scrollTop: 0,
				tagStyle: {
					img: 'width:100%;display:block;',
					table: 'width:100%',
					video: 'width:100%'
				},
				navActive: 0,
				posters: false,
				weixinStatus: false,
				posterImageStatus: false,
				storeImage: '', //海报产品图
				PromotionCode: '', //二维码图片
				posterImage: '', //海报路径
				actionSheetHidden: false,
				cart_num: 1,
				returnShow: true,
				H5ShareBox: false, //公众号分享图片
				routineContact: 0,
				selectSku:{},
				skuArr:[]
			}
		},
		components: {
			productConSwiper,
			productWindow,
			"jyf-parser": parser,
		},
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
				path: '/pages/points_mall/integral_goods_details?id=' + that.id + '&spid=' + that.uid,
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
		onLoad(options) {
			let that = this
			let statusBarHeight = ''
			var pages = getCurrentPages();
			that.returnShow = pages.length === 1 ? false : true;
			//设置商品列表高度
			uni.getSystemInfo({
				success: function(res) {
					that.height = res.windowHeight
					statusBarHeight = res.statusBarHeight
					//res.windowHeight:获取整个窗口高度为px，*2为rpx；98为头部占据的高度；
				},
			});
			this.isLogin && silenceBindingSpread();
			// #ifdef MP
			//扫码携带参数处理
			if (options.scene) {
				let value = this.$util.getUrlParams(decodeURIComponent(options.scene));
				if (value.id) {
					this.id = value.id;
				} else {
					return this.$util.Tips({
						title: '缺少参数无法查看商品'
					}, {
						tab: 3,
						url: 1
					});
				}
				//记录推广人uid
				if (value.pid) app.globalData.spid = value.pid;
			}
			// #endif
			if (options.id) {
				this.id = options.id
				this.status = options.status
			}
			this.getIntegralProductDetail();
		},
		onShow(){
			uni.removeStorageSync('form_type_cart');
		},
		methods: {
			// app分享
			// #ifdef APP-PLUS
			appShare(scene) {
				let that = this
				let routes = getCurrentPages(); // 获取当前打开过的页面路由数组
				let curRoute = routes[routes.length - 1].$page.fullPath // 获取当前页面路由，也就是最后一个打开的页面路由
				uni.share({
					provider: "weixin",
					scene: scene,
					type: 0,
					href: `${HTTP_REQUEST_URL}${curRoute}`,
					title: that.storeInfo.store_name,
					imageUrl: that.storeInfo.image,
					success: function(res) {
						uni.showToast({
							title: '分享成功',
							icon: 'success'
						})
						that.posters = false;
					},
					fail: function(err) {
						uni.showToast({
							title: '分享失败',
							icon: 'none',
							duration: 2000
						})
						that.posters = false;
					}
				});
			},
			// #endif
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
			/**
			 * 购物车数量加和数量减
			 *
			 */
			ChangeCartNum: function(changeValue) {
				//changeValue:是否 加|减
				//获取当前变动属性
				let productSelect = this.productValue[this.attrValue];
				//如果没有属性,赋值给商品默认库存
				if (productSelect === undefined && !this.attribute.productAttr.length)
					productSelect = this.attribute.productSelect;
				//无属性值即库存为0；不存在加减；
				if (productSelect === undefined) return;
				let stock = productSelect.stock || 0;
				let num = this.attribute.productSelect;
				if (changeValue) {
					num.cart_num++;
					if (num.cart_num > stock) {
						this.$set(this.attribute.productSelect, "cart_num", stock);
						this.$set(this, "cart_num", stock);
					}

				} else {
					num.cart_num--;
					if (num.cart_num < 1) {
						this.$set(this.attr.productSelect, "cart_num", 1);
						this.$set(this, "cart_num", 1);
					}

				}
			},
			/**
			 * 购物车手动填写
			 *
			 */
			iptCartNum: function(e) {
				this.$set(this.attribute.productSelect, 'cart_num', num);
				this.$set(this, "cart_num", num);
			},
			// 后退
			returns: function() {
				uni.navigateBack()
			},
			getIntegralProductDetail: function() {
				let that = this;
				getIntegralProductDetail(that.id).then(res => {
					this.dataShow = 1;
					let title = res.data.store_name;
					this.storeInfo = res.data;
					this.imgUrls = res.data.slider_image;
					this.limitNum = res.data.once_max_count;
					this.storeInfo.description = this.storeInfo.content.content.replace(/<img/gi,
						'<img style="max-width:100%;height:auto;float:left;display:block" ');
					this.attribute.productAttr = res.data.attr;
					this.productValue = res.data.sku;
					for(let key in res.data.productValue){
						let obj = res.data.productValue[key];
						that.skuArr.push(obj)
					}
					this.$set(this, "selectSku", that.skuArr[0]);
					this.reply = res.data.reply ? [res.data.reply] : [];
					uni.setNavigationBarTitle({
						title: title.substring(0, 7) + '...'
					});
					// #ifdef H5
					this.PromotionCode = res.data.code_base
					that.storeImage = that.storeInfo.image
					// #endif
					that.DefaultSelect();
					app.globalData.openPages = '/pages/activity/goods_seckill_details/index?id=' + that.id +
						'&scene=' + that.storeInfo.uid;
					// wxParse.wxParse('description', 'html', that.data.storeInfo.description || '', that, 0);
					// wxh.time(that.data.time, that);
				}).catch(err => {
					that.$util.Tips({
						title: err
					}, {
						tab: 3
					})
				});
			},
			setShare: function() {
				this.$wechat.isWeixin() &&
					this.$wechat.wechatEvevt([
						"updateAppMessageShareData",
						"updateTimelineShareData",
						"onMenuShareAppMessage",
						"onMenuShareTimeline"
					], {
						desc: this.storeInfo.info,
						title: this.storeInfo.title,
						link: location.href,
						imgUrl: this.storeInfo.image
					}).then(res => {
					}).catch(err => {
						console.log(err);
					});
			},
			/**
			 * 默认选中属性
			 *
			 */
			DefaultSelect: function() {
				let self = this
				let productAttr = self.attribute.productAttr;
				let value = [];
				for (var key in self.productValue) {
					if (self.productValue[key].stock > 0) {
						value = self.attribute.productAttr.length ? key.split(",") : [];
						break;
					}
				}
				for (let i = 0; i < productAttr.length; i++) {
					self.$set(productAttr[i], "index", value[i]);
				}
				//sort();排序函数:数字-英文-汉字；
				let productSelect = self.productValue[value.join(",")];
				if ((productSelect && productAttr.length) || (productSelect && !productAttr.length)) {
					self.$set(self.attribute.productSelect, "image", productSelect.image);
					self.$set(self.attribute.productSelect, "price", productSelect.price);
					self.$set(self.attribute.productSelect, "ot_price", productSelect.ot_price || 0);
					self.$set(self.attribute.productSelect, "stock", productSelect.stock);
					self.$set(self.attribute.productSelect, "unique", productSelect.unique);
					self.$set(self.attribute.productSelect, "cart_num", 1);
					self.$set(self, "attrValue", value.join(","));
					self.attrValue = value.join(",")
				} else if (!productSelect && productAttr.length) {
					self.$set(self.attribute.productSelect, "image", self.storeInfo.image);
					self.$set(self.attribute.productSelect, "price", self.storeInfo.price);
					self.$set(self.attribute.productSelect, "ot_price", self.storeInfo.ot_price || 0);
					self.$set(self.attribute.productSelect, "stock", 0);
					self.$set(self.attribute.productSelect, "unique", "");
					self.$set(self.attribute.productSelect, "cart_num", 0);
					self.$set(self, "attrValue", "");
					self.$set(self, "attrTxt", "请选择");
				} else if (!productSelect && !productAttr.length) {
					self.$set(self.attribute.productSelect, "image", self.storeInfo.image);
					self.$set(self.attribute.productSelect, "price", self.storeInfo.price);
					self.$set(self.attribute.productSelect, "ot_price", self.storeInfo.ot_price || 0);
					self.$set(self.attribute.productSelect, "stock", self.storeInfo.stock);
					self.$set(
						self.attribute.productSelect,
						"unique",
						self.storeInfo.unique || ""
					);
					self.$set(self.attribute.productSelect, "cart_num", 1);
					self.$set(self, "attrValue", "");
					self.$set(self, "attrTxt", "请选择");
				}
				self.$set(self.attribute.productSelect, "store_name", self.storeInfo.store_name);
			},
			selecAttr: function() {
				this.attribute.cartAttr = true
			},
			onMyEvent: function() {
				this.$set(this.attribute, 'cartAttr', false);
				this.$set(this, 'isOpen', false);
			},
			attrVal(val) {
				this.attribute.productAttr[val.indexw].index = this.attribute.productAttr[val.indexw].attr_values[val
					.indexn];
			},
			/**
			 * 属性变动赋值
			 *
			 */
			ChangeAttr: function(res) {
				this.$set(this, 'cart_num', 1);
				let productSelect = this.productValue[res];
				if (productSelect) {
					this.$set(this.attribute.productSelect, "image", productSelect.image);
					this.$set(this.attribute.productSelect, "price", productSelect.price);
					this.$set(this.attribute.productSelect, "ot_price", productSelect.ot_price);
					this.$set(this.attribute.productSelect, "stock", productSelect.stock);
					this.$set(this.attribute.productSelect, "unique", productSelect.unique);
					this.$set(this.attribute.productSelect, "cart_num", 1);
					this.$set(this, "attrValue", res);
					this.attrTxt = "已选择"
				} else {
					this.$set(this.attribute.productSelect, "image", this.storeInfo.image);
					this.$set(this.attribute.productSelect, "price", this.storeInfo.price);
					this.$set(this.attribute.productSelect, "ot_price", this.storeInfo.ot_price);
					this.$set(this.attribute.productSelect, "stock", 0);
					this.$set(this.attribute.productSelect, "unique", "");
					this.$set(this.attribute.productSelect, "cart_num", 0);
					this.$set(this, "attrValue", "");
					this.attrTxt = "已选择"
				}
			},
			scroll: function(e) {
				var that = this,
				scrollY = e.detail.scrollTop;
				var opacity = scrollY / 200;
				opacity = opacity > 1 ? 1 : opacity;
				that.opacity = opacity
				that.scrollY = scrollY
				if (that.lock) {
					that.lock = false
					return;
				}
				for (var i = 0; i < that.topArr.length; i++) {
					if (scrollY < that.topArr[i] - (app.globalData.navHeight / 2) + that.heightArr[i]) {
						that.navActive = i
						break
					}
				}
			},
			/*
			 *  下订单
			 */
			goCat: function() {
				let taht = this;
				if(this.isLogin){
					var that = this;
					var productSelect = this.productValue[this.attrValue];
					//打开属性
					if (this.isOpen)
						this.attribute.cartAttr = true
					else
						this.attribute.cartAttr = !this.attribute.cartAttr
					//只有关闭属性弹窗时进行加入购物车
					if (this.attribute.cartAttr === true && this.isOpen == false) return this.isOpen = true
					//如果有属性,没有选择,提示用户选择
					if (this.attribute.productAttr.length && productSelect === undefined && this.isOpen == true) return app
						.$util.Tips({
							title: '请选择属性'
						});
					if (this.cart_num <= 0) {
						return app.$util.Tips({
							title: '请选择数量'
						});
					}
					this.isOpen = false
					let q = {
						is_new: 1,
						product_id: that.id,
						cart_num: that.attribute.productSelect.cart_num,
						product_attr_unique: that.attribute.productSelect !== undefined ? that.attribute.productSelect.unique : "",
						product_type: 20,
					};
					postCartAdd(q)
						.then(function(res) {
							that.isOpen = that.attribute.cartAttr = false;
							uni.navigateTo({
								url: `/pages/points_mall/integral_order?cartId=${res.data.cart_id}`
							});
						})
						.catch(res => {
							return that.$util.Tips({
								title: res
							});
						});
				}else{
					toLogin()
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.product-con{
		position: relative;
	}
	.product-con .attribute{
		padding: 0 20rpx;
	}
	.p_center{
		text-align: center;
	}
	.icon-ic_leftarrow {
		/* #ifdef H5 */
		top: 30rpx !important;
		/* #endif */
	}
	.goods-detail-count{
		position: relative;
	}
	.product-con .nav {
		padding: 0;
	}
	.product-con .nav .money {
		color: var(--view-theme);
		display: flex;
		align-items: baseline;
		image {
			width: 26rpx;
			height: 26rpx;
		}
	}
	.product-con .nav .money .price-count {
		font-weight: normal;
		font-size: 22rpx;
		.num{
			font-weight: bold;
			margin-right: 2rpx;
		}
	}
	.product-con .nav .money .num {
		font-size: 34rpx;
		padding-left: 10rpx;
	}
	.product-con .nav .iconfont {
		color: #fff;
		font-size: 30rpx;
		margin-left: 20rpx;
	}
	.product-con .wrapper {
		box-sizing: border-box;
		background: transparent;
	}
	.product-con .wrapper .introduce {
		margin: 0;
	}
	.product-con .wrapper .introduce .iconfont {
		font-size: 37rpx;
		color: #515151;
	}
	.product-con .wrapper .label {
		display: flex;
		justify-content: space-between;
		margin: 18rpx 0 0 0;
		font-size: 24rpx;
		color: #999999;
	}
	.product-con .footer {
		padding: 0 30rpx 0 44rpx;
		width: 100%;
		display: flex;
		align-items: center;
		flex-wrap: nowrap;
		padding-bottom: constant(safe-area-inset-bottom); ///兼容 IOS<11.2/
		padding-bottom: env(safe-area-inset-bottom); ///兼容 IOS>11.2/
	}
	.product-con .footer .item {
		width: 110rpx;
		margin-right: 30rpx;
	}
	.product-con .footer .bnt {
		width: 100%;
		height: 76rpx;
	}
	.product-con .footer .bnt .bnts {
		width: 100%;
		text-align: center;
		line-height: 76rpx;
		color: #fff;
		font-size: 28rpx;
	}
	.product-con .footer .bnt .buy {
		border-radius: 60rpx;
		background-image: linear-gradient(90deg, var(--view-bntColor21) 0%, var(--view-bntColor22) 100%);
	}
	.product-con .footer .bnt .no-goods {
		border-radius: 50rpx;
		background-color: #CCCCCC;
	}
	.product-con .conter {
		display: block;
		padding-bottom: 100rpx;
	}
	.product-con .conter img {
		display: block;
	}
	.df {
		display: flex;
		align-items: center;
		flex-wrap: nowrap;
	}

</style>
