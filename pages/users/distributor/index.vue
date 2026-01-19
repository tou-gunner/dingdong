<template>
	<view class="distributor" :style="viewColor">
		<view class="fixed-head">
			<view class="sys-head" :style="{height:sysHeight}"></view>
			<view class="tool-bar">
				<view class='iconfont icon-ic_leftarrow' @tap='goBack'></view>
			</view>
		</view>
		<view class="headerBg" :style="{'background-image': `url(${distribution_header})`}">
			<view class="distributor-intr-text">{{distribution_msg}}~</view>
		</view>
		<view class="distributor-main" :style="{'background-image': `url(${domain}/static/images/distribution_count_bg.png)`}">
			<view class="distributor-bg">
				<view v-if="openActivity" class="explain acea-row row-middle row-center" @click="explain">
					<text class="iconfont icon-icon_tip"></text>
					<text>分销说明</text>
				</view>
				<!-- menu -->
				<view class='nav acea-row' v-if="menus.length" :style="{'background-image': `url(${domain}/static/images/distribution_bg.png)`}">
					<block v-for="(item,index) in menus" :key="index">
						<view class='item'>
							<view class='pictrue bg-f boder-24'>
								<image :src='item.img'></image>
							</view>
							<view class="menu-txt area-row line1">{{item.title}}</view>
						</view>
					</block>
				</view>
				<!-- 推荐礼包 -->
				<view class="recommend pin boder-24" v-if="promoter_type == 0" :style="{'background-image': `url(${domain}/static/images/distributor_gift_header.png)`}">
					<view v-if="fastList.length > 0" class="public_title acea-row row-center-wrapper">
						<view class="name" :style="{'background-image': `url(${domain}/static/images/distribution_recommend.png)`}"></view>
					</view>
					<view v-if="fastList.length > 0" class='scroll-product bg-f'>
						<scroll-view class="scroll-view_x" scroll-x style="width:auto;overflow:hidden;">
							<block v-for="(item,index) in fastList" :key='index'>
								<view class="itemCon">
									<view class="item acea-row row-right">
										<view class="picTxt acea-row row-between-wrapper" @click="godDetail(item)">
											<view class="pictrue">
												<image class="image" :src="item.image"></image>
											</view>
											<view class="text">
												<view class="name line2">{{item.store_name}}</view>
												<view class="acea-row row-bottom price_count">
													<view class="money p-color">
														<priceFormat :price="item.price" weight intSize="40" floatSize="26" labelSize="26"></priceFormat>
													</view>
												</view>
											</view>
										</view>
									</view>
								</view>
							</block>
						</scroll-view>
					</view>
				</view>
				<view class="pin boder-24" v-if="openActivity" :style="{'background-image': `url(${domain}/static/images/distributor_gift_header.png)`}">
					<view class="public_title acea-row row-center-wrapper" >
						<view class="name" :style="{'background-image': promoter_type == 0 ? `url(${domain}/static/images/distribution_gift.png)` : `url(${domain}/static/images/distribution_amount.png)`}"></view>
					</view>
					<view class="list bg-f acea-row">
						<view v-for="item in distribution" :key="item.product_id" class="item" @click="godDetail(item)">
						  <image class="image" :src="item.image"></image>
							<view class="name line1">
								{{item.store_name}}
							</view>
							<view v-if="item.show_svip_info&&item.show_svip_info.show_svip_price&&item.svip_price" class="svip-price">
								<priceFormat :price="item.svip_price" weight intSize="28" floatSize="20" labelSize="20"></priceFormat>
								<image :src="`${domain}/static/images/svip.png`"></image>
							</view>
							<view class="shop-price semiBold">
								<priceFormat :price="item.price" weight intSize="28" floatSize="20" labelSize="20"></priceFormat>
							</view>
						</view>
						<navigator hover-class="none" class="distributor-mall" open-type='switchTab' url="/pages/index/index" :style="{'background-image': `url(${domain}/static/images/distribution_btn.png)`}">进入商城，挑选更多商品  &nbsp;<text class="iconfont icon-ic_rightarrow"></text></navigator>
					</view>
				</view>
				<view class='loadingicon acea-row row-center-wrapper' v-if='distribution.length > 0 '>
					<text class='loading iconfont icon-jiazai' :hidden='loading==false'></text>{{loadTitle}}
				</view>
			</view>
		</view>
		<view class="explainTxt" :class="explainShow?'on':''">
			<view class="content bg-f boder-24">
				<view class="name">分销说明</view>

				<view class="conter">
					<jyf-parser :html="explainTxt.promoter_explain" ref="article" :tag-style="tagStyle"></jyf-parser>
				</view>
			</view>
			<text class="iconfont icon-ic_close1" @click="close"></text>
		</view>
		<view class="mask" v-if="explainShow"></view>
		<!-- 组件 -->
		<productWindow :attr="attr" :isShow='true' :iSplus='1' :destri='1' :svipPrice="true" @myevent="onMyEvent" @ChangeAttr="ChangeAttr"
		 @attrVal="attrVal" @iptCartNum="iptCartNum" @goCat="goPay" id='product-window'></productWindow>
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
	let sysHeight = uni.getSystemInfoSync().statusBarHeight-10 + 'px';
	import { goShopDetail } from '@/libs/order.js'
	import { postCartAdd } from '@/api/store.js';
	import { bagExplain, bagRecommend, productBag, getProductDetail } from '@/api/store.js';
	import ProductWindow from "@/components/productWindow";
	import parser from "@/components/jyf-parser/jyf-parser";
	import { mapGetters } from "vuex";
	import { HTTP_REQUEST_URL } from '@/config/app';
	export default {
		components: {
			ProductWindow,
			"jyf-parser": parser,
		},
		computed: mapGetters(['isLogin','viewColor','keyColor']),
		data() {
			return {
				sysHeight: sysHeight,
				domain: HTTP_REQUEST_URL,
				explainShow: false,
				menus: [],
				fastList: [],
				distribution: [],
				explainTxt: '',
				attr: {
					cartAttr: false,
					productAttr: [],
					productSelect: {}
				},
				productValue: [], //系统属性
				storeInfo: {},
				attrValue: '', //已选属性
				attrTxt: '请选择', //属性页面提示
				cart_num: 1, //购买数量
				id: 0, //产品id
				loadend: false,
				loading: false,
				loadTitle: '加载更多',
				where: {
					page: 1,
					limit: 20,
				},
				openActivity: false,
				promoter_type: "0",
				distribution_msg: "",
				tagStyle: {
					img: 'width:100%;display:block;',
					video: 'width:100%;'
				},
				// #ifndef H5
				distribution_header: HTTP_REQUEST_URL+'/static/images/distribution_header.png',
				// #endif
				// #ifdef H5
				distribution_header: HTTP_REQUEST_URL+'/static/images/distribution_header_h5.png',
				// #endif
			}
		},
		onLoad() {},
		onShow: function() {
			this.bagExplain();
			this.productBag();
			this.bagRecommend();
		},
		// 滚动到底部
		onReachBottom() {
			this.productBag();
		},
		methods: {
			goBack: function() {
				uni.navigateBack();
			},
			goBuy: function(item) {
				let that = this;
				that.id = item.product_id;
				that.getGoodsDetails(item);
			},
			onMyEvent: function() {
				this.$set(this.attr, 'cartAttr', false);
			},
			/**
			 * 获取产品详情
			 *
			 */
			getGoodsDetails: function(item) {
				uni.showLoading({
					title: '加载中',
					mask: true
				});
				let that = this;
				getProductDetail(item.product_id).then(res => {
					uni.hideLoading();
					that.attr.cartAttr = true;
					let storeInfo = res.data;
					that.$set(that, 'storeInfo', storeInfo);
					that.$set(that.attr, 'productAttr', res.data.attr);
					that.$set(that, 'productValue', res.data.sku);
					that.DefaultSelect();
				}).catch(err => {
					uni.hideLoading();
				})
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
					this.$set(this.attr.productSelect, "svip_price", productSelect.svip_price);
					this.$set(this.attr.productSelect, "stock", productSelect.stock);
					this.$set(this.attr.productSelect, "unique", productSelect.unique);
					this.$set(this.attr.productSelect, "cart_num", 1);
					this.$set(this, "attrValue", res);
					this.$set(this, "attrTxt", "已选择");
				} else {
					this.$set(this.attr.productSelect, "image", this.storeInfo.image);
					this.$set(this.attr.productSelect, "price", this.storeInfo.price);
					this.$set(this.attr.productSelect, "svip_price", productSelect.svip_price);
					this.$set(this.attr.productSelect, "stock", 0);
					this.$set(this.attr.productSelect, "unique", "");
					this.$set(this.attr.productSelect, "cart_num", 0);
					this.$set(this, "attrValue", "");
					this.$set(this, "attrTxt", "请选择");
				}
			},
			/**
			 * 默认选中属性
			 *
			 */
			DefaultSelect: function() {
				let productAttr = this.attr.productAttr;
				let value = [];
				let arr = [];
				let unSortArr = [];
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
					this.$set(this.attr.productSelect, "svip_price", productSelect.svip_price);
					this.$set(this.attr.productSelect, "stock", productSelect.stock);
					this.$set(this.attr.productSelect, "unique", productSelect.unique);

					this.$set(this, "attrValue", value.join(","));
					this.$set(this, "attrTxt", "已选择");
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
					this.$set(this.attr.productSelect, "svip_price", productSelect.svip_price);
					this.$set(this.attr.productSelect, "stock", 0);
					this.$set(this.attr.productSelect, "unique", "");
					this.$set(this.attr.productSelect, "cart_num", 0);
					this.$set(this, "attrValue", "");
					this.$set(this, "attrTxt", "请选择");
				} else if (!productSelect && !productAttr.length) {
					this.$set(
						this.attr.productSelect,
						"store_name",
						this.storeInfo.store_name
					);
					this.$set(this.attr.productSelect, "image", this.storeInfo.image);
					this.$set(this.attr.productSelect, "price", this.storeInfo.price);
					this.$set(this.attr.productSelect, "svip_price", productSelect.svip_price);
					this.$set(this.attr.productSelect, "stock", this.storeInfo.stock);
					this.$set(
						this.attr.productSelect,
						"unique",
						this.storeInfo.unique || ""
					);
					this.$set(this.attr.productSelect, "cart_num", 1);
					this.$set(this, "attrValue", "");
					this.$set(this, "attrTxt", "请选择");
				} else if (productSelect && !productAttr.length) {
					this.$set(
						this.attr.productSelect,
						"store_name",
						this.storeInfo.store_name
					);
					this.$set(this.attr.productSelect, "image", productSelect.image);
					this.$set(this.attr.productSelect, "price", productSelect.price);
					this.$set(this.attr.productSelect, "svip_price", productSelect.svip_price);
					this.$set(this.attr.productSelect, "stock", productSelect.stock);
					this.$set(this.attr.productSelect, "unique", productSelect.unique);
					this.$set(this, "attrValue", value.join(","));
					this.$set(this, "attrTxt", "已选择");
					if (productSelect.stock == 0) {
						this.$set(this.attr.productSelect, "cart_num", 0);
					} else {
						this.$set(this.attr.productSelect, "cart_num", 1);
					}
				}
			},
			attrVal(val) {
				this.$set(this.attr.productAttr[val.indexw], 'index', this.attr.productAttr[val.indexw].attr_values[val.indexn]);
			},
			/**
			 * 购物车手动填写
			 *
			 */
			iptCartNum: function(e) {
				this.$set(this.attr.productSelect, 'cart_num', e);
			},
			// 立即购买
			goPay() {
				let that = this,
					productSelect = that.productValue[this.attrValue];
				if (
					that.attr.productAttr.length &&
					productSelect.stock == 0
				)
					return that.$util.Tips({
						title: "产品库存不足，请选择其它"
					});
				let q = {
					product_id: that.id,
					cart_num: Number(that.attr.productSelect.cart_num),
					is_new: 1,
					product_attr_unique: that.attr.productSelect !== undefined ? that.attr.productSelect.unique : ""
				};
				postCartAdd(q)
					.then(function(res) {
						that.attr.cartAttr = false;
						uni.navigateTo({
							url: '/pages/users/order_confirm/index?cartId=' + res.data.cart_id
						});
					})
					.catch(res => {
						return that.$util.Tips({
							title: res
						});
					});
			},
			// 去商品详情
			godDetail(item) {
				goShopDetail(item).then(res => {
					uni.navigateTo({
						url: `/pages/goods_details/index?id=${item.product_id}`
					})
				})
			},
			// 分销
			productBag: function() {
				let that = this;
				if (that.loadend) return;
				if (that.loading) return;
				that.loading = true;
				that.loadTitle = '';
				productBag(that.where).then(res => {
					let list = res.data.list;
					let productList = that.$util.SplitArray(list, that.distribution);
					let loadend = list.length < that.where.limit;
					that.loadend = loadend;
					that.loading = false;
					that.loadTitle = loadend ? '已全部加载' : '加载更多';
					that.promoter_type = res.data.promoter_type;
					that.distribution_msg = res.data.msg;
					that.$set(that, 'distribution', productList);
					that.$set(that.where, 'page', that.where.page + 1);
				}).catch(err => {
					that.loading = false;
					that.loadTitle = '加载更多';
				});
			},
			// 推荐
			bagRecommend: function() {
				let that = this;
				bagRecommend().then(res => {
					this.fastList = res.data.list
				})
			},
			// 说明以及导航
			bagExplain: function() {
				let that = this;
				bagExplain().then(res => {
					let data = res.data;
					this.menus = data.data;
					this.explainTxt = data.explain;
					this.openActivity = true
				}).catch(res => {
					this.openActivity = false
					return that.$util.Tips({
						title: res
					});
				});
			},
			explain() {
				this.explainShow = true;
			},
			close() {
				this.explainShow = false;
			}
		},
		// 滚动监听
		onPageScroll(e) {}
	}
</script>

<style lang="scss" scoped>
	.b-color {
		border: 1rpx solid var(--view-theme);
		background-color: var(--view-theme);
	}
	.vip-money {
		color: #282828;
		font-size: 22rpx;
		margin-left: 6rpx;
		font-weight: bold;
	}
	.vipImg {
		width: 65rpx;
		height: 28rpx;
		margin: 4rpx 0 0 4rpx;
		image {
			width: 100%;
			height: 100%;
			display: block;
		}
	}
	.distributor {
		.headerBg {
			width: 100%;
			height: 550rpx;
			background-size: 100%;
			background-repeat: no-repeat;
			position: relative;
			/*#ifdef MP*/
			padding-top: 400rpx;
			/*#endif*/
			/*#ifndef MP*/
			padding-top: 320rpx;
			/*#endif*/
			.distributor-intr-text{
				color: #FF6270;
				font-size: 26rpx;
				padding: 0 44rpx;
				font-weight: 500;

			}
		}
		.distributor-main{
			background-repeat: no-repeat;
			background-size: 100% 100vh;
			padding-top: 80rpx;
			background-repeat: no-repeat;
			position: absolute;
			/*#ifdef MP*/
			top: 440rpx;
			/*#endif*/
			/*#ifndef MP*/
			top: 360rpx;
			/*#endif*/
			width: 100%;
			&::before{
				content: "";
				display: block;
				width: 100%;
				height: 100%;
				background-color: #FFE6D6;
				position: absolute;
				top: 100rpx;
				left: 0;
				z-index: -1;
			}
			.distributor-bg {
				padding: 0 24rpx 40rpx;
			}
			.main-title{
				display: flex;
				align-items: center;
				position: absolute;
				left: 50rpx;
				top: 90rpx;
				.image{
					width: 70rpx;
					height: 70rpx;
				}
				text{
					color: #691F1C;
					font-size: 34rpx;
					font-weight: bold;

				}
			}
			.explain {
				position: absolute;
				top: 102rpx;
				right: 70rpx;
				height: 40rpx;
				color: #ffffff;
				font-size: 24rpx;
				display: flex;
				.iconfont{
					margin-right: 6rpx;
					font-size: 26rpx;
				}
			}
		}
		.nav {
			width: 702rpx;
			height: 316rpx;
			padding: 0 24rpx;
			background-size: 100% 100%;
			flex-wrap: wrap;
			.item {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				width: 140rpx;
				height: 180rpx;
				margin-top: 106rpx;
				background: #FFF6EF;
				margin-right: 30rpx;
				border: 2rpx solid #FFF2DE;
				border-radius: 16rpx;
				&:nth-child(4n){
					margin-right: 0;
				}
				.pictrue{
					width: 80rpx;
					height: 80rpx;
					text-align: center;
					image {
						width: 58rpx;
						height: 58rpx;
						border-radius: 50%;
						margin-top: 16rpx;
					}
				}
				.menu-txt {
					color: #6A251F;
					font-size: 24rpx;
					margin-top: 24rpx;
					font-weight: 500;
					max-width: 120rpx;
				}
			}
		}
		.public_title {
			padding: 44rpx 0 30rpx;
			margin-top: 20rpx;
			.name {
				width: 257rpx;
				height: 41rpx;
				background-size: 100%;
				background-repeat: no-repeat;
			}
		}
		.recommend {
			.scroll-product {
				white-space: nowrap;
				padding-left: 24rpx;
				border-radius: 0 0 24rpx 24rpx;
				padding-bottom: 24rpx;
				.scroll-view_x {
					height: 100%;
				}
				.itemCon {
					display: inline-block;
					.item {
						width: 406rpx;
						height: 194rpx;
						margin-right: 20rpx;
						border-radius: 24rpx;
						position: relative;
						background: #FFF6EF;
						border: 2rpx solid #FFF2DE;
						padding: 24rpx;
						.picTxt {
							width: 406rpx;
							height: 100%;
							display: flex;
							justify-content: space-between;
							.pictrue {
								width: 144rpx;
								height: 144rpx;
								image {
									width: 100%;
									height: 100%;
									border-radius: 24rpx;
								}
							}
							.text {
								width: 190rpx;
								margin-left: 12rpx;
								box-sizing: border-box;
								.name {
									width: 210rpx;
									font-size: 24rpx;
									color: #282828;
									margin-bottom: 20rpx;
									font-weight: 500;
								}
								.money {
									font-size: 40rpx;
									color: #F94C5F;
									font-weight: bold;
								}
							}
						}
					}
				}
			}
		}
		.pin {
			background-size: 100% 150rpx;
			background-repeat: no-repeat;
			.list {
				position: relative;
				border-radius: 0 0 24rpx 24rpx;
				.item {
					width: 201rpx;
					padding-bottom: 24rpx;
					margin-left: 24rpx;
				}
				.image {
					width: 201rpx;
					height: 201rpx;
					border-radius: 16rpx;
				}
				.name {
					font-size: 24rpx;
					margin-top: 16rpx;
				}
				.svip-price {
					margin-top: 6rpx;
					font-size: 28rpx;
					font-weight: bold;
					image {
						width: 65rpx;
						height: 28rpx;
						margin-left: 6rpx;
						position:  relative;
						top: 5rpx;
					}
				}
				.shop-price {
					margin-top: 12rpx;
					color: #E93323;
				}

			}
			.distributor-mall{
				width: 480rpx;
				height: 80rpx;
				background-size: 100% 100%;
				background-repeat: no-repeat;
				display: flex;
				align-items: center;
				justify-content: center;
				color: #ffffff;
				font-size: 28rpx;
				position: fixed;
				bottom: 66rpx;
				left: 50%;
				margin-left: -240rpx;
				z-index: 10;
			}
		}
		.explainTxt {
			position: fixed;
			top: 20%;
			left: 50%;
			width: 600rpx;
			margin-left: -300rpx;
			z-index: 32;
			text-align: center;
			transition: all 0.3s ease-in-out 0s;
			opacity: 0;
			transform: scale(0);
			&.on {
				opacity: 1;
				transform: scale(1);
			}
			.content{
				padding: 33rpx;
				height: 760rpx;
			}
			.name {
				font-size: 38rpx;
				position: relative;
				text-align: center;
				font-weight: bold;
			}
			.iconfont {
				color: #ffffff;
				font-size: 42rpx;
				margin-top: 40rpx;
				display: inline-block;
			}
			.conter {
				margin-top: 30rpx;
				font-size: 26rpx;
				color: #282828;
				line-height: 1.6;
				max-height: 600rpx;
				overflow-y: auto;
			}
		}
	}
</style>
