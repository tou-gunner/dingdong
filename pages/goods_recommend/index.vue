<template>
	<view :style="viewColor">
		<view class="product-con">
			<view class="fixed-head">
				<view class="sys-head" :style="{height:sysHeight}"></view>
				<view class="tool-bar">
					<view class='iconfont icon-ic_leftarrow' @tap='goBack'></view>
				</view>
			</view>
		 <!-- 商品列表 -->
			<scroll-view scroll-y="true" :scroll-top="scrollTop" @scroll="scrollHandler" @scrolltolower="loadMore" style="height: 100vh;">
				<view class="goods-item bg-f boder-24" v-for="(item, index) in goodsList" :key="index">
					<productConSwiper :ref="'productConSwiper_'+index" :imgUrls="item.slider_image" :imageH="item.imageH" :autoPlay="item.autoPlay" :videoCoverImg="item.slider_image[0]" :videoline="item.video_link" :productIdx="index" @playToggle="playToggle"></productConSwiper>
					<view class="goods-info">
						<navigator hover-class="none" :url="'/pages/goods_details/index?id='+item.product_id" class="goods-price acea-row row-between-wrapper">
							<view class="price">
								<priceFormat :price="item.price" weight intSize="48" floatSize="32" labelSize="32"></priceFormat>
								<view v-if="item.show_svip_info&&item.show_svip_info.show_svip && item.show_svip_info.show_svip_price" class="acea-row row-middle svip">
									<text class='vip-money semiBold'>¥{{item.svip_price}}</text>
									<view class="vipImg">
										<image :src="`${domain}/static/images/svip.png`"></image>
									</view>
								</view>
							</view>
							<view class="goods-buy-text">{{item.sales}}+人都在买</view>
						</navigator>
						<navigator hover-class="none" :url="'/pages/goods_details/index?id='+item.product_id" class="goods-title acea-row row-between-wrapper">
							<view class="title line1">{{ item.store_name }}</view>
							<text class="iconfont icon-ic_rightarrow"></text>
						</navigator>
						<view class="item-footer acea-row row-between-wrapper">
							<view class="footer-store acea-row">
								<navigator v-if="hide_mer_status !=1" hover-class="none" :url="'/pages/store/home/index?id='+item.mer_id" class='item'>
									<view class='store-avatar'>
										<image class="image" :src="item.merchant&&item.merchant.mer_avatar"></image>
									</view>
									<view>进店</view>
								</navigator>
								<view class="item skeleton-rect">
									<view class="store-avatar" @click.stop="setCollect(item)">
										<view class="iconfont" :class="item.isRelation ? 'icon-ic_star1' : 'icon-ic_star'"></view>
									</view>
									<view>收藏</view>
								</view>
							</view>
							<view class="footer-btn acea-row row-between-wrapper">
								<form @submit="joinCart(item)" report-submit='true'>
									<button v-if="item.type != 1&&item.type != 2&&item.type != 3&&!item.mer_form_id" class='joinCart bnts' form-type="submit">加入购物车</button>
								</form>
								<form @submit="goBuy(item)" report-submit='true'>
									<button class='buy bnts' :class="(item.type == 1 || item.type == 2 || item.type == 3 || item.mer_form_id) ? 'virtual_buy' : ''" form-type="submit">立即购买</button>
								</form>
							</view>
						</view>
					</view>
				</view>
				<view v-if="loadingMore" style="text-align: center; margin-top: 20rpx;">加载中...</view>
			</scroll-view>
			<!-- 组件 -->
			<addcartWindow
				:attr="attr"
				:isShow='1'
				:iSplus='1'
				:destri='1'
				:iSbnt='1'
				:addCart="addCart"
				:isRecommend="true"
				:maxCount="max_count"
				:minCount="min_count"
				@myevent="onMyEvent"
				@ChangeAttr="ChangeAttr"
				@goCat="goCat"
				@attrVal="attrVal"
				@iptCartNum="iptCartNum"
				@ChangeCartNum="ChangeCartNum"
				id='product-window'>
			</addcartWindow>
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
	let sysHeight = uni.getSystemInfoSync().statusBarHeight + 'px';
	import { productRecommendLst,collectAdd,collectDel,postCartAdd,getProductDetail} from '@/api/store.js';
	import { getCartCounts } from '@/api/order.js';
	import Cache from '@/utils/cache';
	import { CART_TIME,CART_ID} from '@/config/cache';
	import { toLogin } from '@/libs/login.js';
	import { configMap } from "@/utils";
	import { mapGetters } from "vuex";
	import { HTTP_REQUEST_URL } from '@/config/app';
	import productConSwiper from './components/productConSwiper.vue';
	import addcartWindow from '@/components/addcartWindow';
	export default {
		components: {
			productConSwiper,
			addcartWindow
		},
		data() {
			return {
				sysHeight: sysHeight,
				domain: HTTP_REQUEST_URL,
				where: {
					page: 1,
					limit: 6,
					product_id: ""
				},
				goodsList: [],
				loadingMore: false, // 是否正在加载更多
				scrollTop: 0, // 控制滚动位置的值
				attr: {
					cartAttr: false,
					productAttr: [],
					productSelect: {}
				},
				isTop: 0,
				max_count: 0,
				min_count: 0,
				pay_limit: 1,
				attrValue: '', //已选属性
				productValue: [], //系统属性
				storeInfo: {},
				uniqueValue: "",
				isOpen: false, //是否打开属性组件
				cart_num: 1,
				addCart: false
			}
		},
		computed:{
			...configMap(['hide_mer_status'], mapGetters(['isLogin','viewColor'])),
		},
		onLoad(options) {
			let that = this
			that.where.product_id = options.id
			that.getCurrentGoods()
		},
		onReady: function() {

		},
		created() {
			setTimeout((e) => {
				const query = uni.createSelectorQuery().in(this);
				query.select('.goods-item').boundingClientRect(data => {
					this.isTop = data.height
				}).exec();
			}, 500)
		},
		onShow() {},
		methods: {
			// 后退
			goBack: function() {
				uni.navigateBack()
			},
			getCurrentGoods(){
				let that = this
				productRecommendLst(that.where).then(res => {
					let list = res.data.list;
					that.$set(list[0], 'autoPlay', true);
					that.$set(that, 'goodsList', list);
					that.where[res.data.filter] = res.data[res.data.filter]
					that.setWidth(list[0])
					this.fetchGoodsList()
				}).catch(err => {
					return that.$util.Tips({
						title: err
					})
				});
			},
			//获取列表数据
			fetchGoodsList(){
				let that = this
				that.loadingMore = true;
				productRecommendLst(that.where).then(res => {
					let list = res.data.list;
					list.forEach((item)=>{
						that.$set(item, 'autoPlay', false);
						that.setWidth(item)
					})
					let goodsList = that.$util.SplitArray(list, that.goodsList);
					that.loadingMore = false;
					that.$set(that, 'goodsList', goodsList);
					that.goodsList[0]['autoPlay'] = true;
				}).catch(err => {
					return that.$util.Tips({
						title: err
					})
				});
			},
			setWidth(item){
				let that = this;
				that.$nextTick(function() {
					uni.getImageInfo({
						src: that.setDomain(item.slider_image[0]),
						success: function(res) {
							if (res && res.height > 0) {
								let height = res.height * ((750-40) / res.width)
								that.$set(item, 'imageH', height);
							} else {
								this.$set(item, 'imageH', 710);
							}
						},
						fail: function(error) {
							that.$set(item, 'imageH', 710);
						}
					})
				})
			},
			//替换安全域名
			setDomain: function(url) {
				url = url ? url.toString() : '';
				//本地调试打开,生产请注销
				if (url.indexOf("https://") > -1) return url;
				else return url.replace('http://', 'https://');
			},
			// 下拉加载更多
			loadMore() {
				if (!this.loadingMore) {
					this.where.page += 1;
					this.fetchGoodsList();
				}
			},
			scrollHandler(e) {
				// 获取滚动的位移
				const scrollTop = e.detail.scrollTop;
				// 设置一次滑动的高度为 500rpx
				// 如果滚动距离大于一次滑动的高度，则执行相应操作
				if(scrollTop > this.isTop-200 || scrollTop == 0){
					let multiple = scrollTop == 0 ? 0 : Math.floor(scrollTop / this.isTop);
					this.goodsList.forEach((item,index)=>{
						this.$set(item, 'autoPlay', false);
						// #ifndef APP-PLUS
						const ref = 'productConSwiper_' + index;
						if(this.$refs[ref]&&this.$refs[ref][0]){
							this.$refs[ref][0].videoPause(index)
						}
						// #endif
					})
					this.goodsList[multiple]['autoPlay'] = true
				}
			},
			/*切换轮播*/
			playToggle(isPlay) {
				this.goodsList.forEach((item)=>{
					this.$set(item, 'autoPlay', isPlay);
				})
			},
			/**
			 * 立即购买
			 */
			goBuy: function(item) {
				if (this.isLogin === false) {
					toLogin()
				} else {
					this.addCart = false
					this.getGoodsDetails(item.product_id);
				}
			},
			/**
			 * 打开属性加入购物车
			 *
			 */
			joinCart: function(item) {
				//是否登录
				if (this.isLogin === false) {
					toLogin()
				} else {
					this.addCart = true
					this.getGoodsDetails(item.product_id);
				}
			},
			/**
			 * 获取产品详情
			 *
			 */
			getGoodsDetails: function(id) {
				uni.showLoading({
					title: '加载中',
					mask: true
				});
				let that = this;
				getProductDetail(id).then(res => {
					uni.hideLoading();
					let storeInfo = res.data;
					that.$set(that, 'storeInfo', storeInfo);
					that.$set(that.attr, 'productAttr', res.data.attr);
					that.$set(that, 'productValue', res.data.sku);
					that.$set(that, 'max_count', res.data.once_max_count);
					that.$set(that, 'pay_limit', res.data.pay_limit);
					that.$set(that, 'min_count', res.data.once_min_count);
					if (that.isLogin) {
						that.DefaultSelect();
					}
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
					this.$set(this.attr.productSelect, "image", productSelect.image ? productSelect.image : this.storeInfo.image);
					this.$set(this.attr.productSelect, "price", productSelect.price);
					this.$set(this.attr.productSelect, "svip_price", productSelect.svip_price);
					this.$set(this.attr.productSelect, "stock", productSelect.stock);
					this.$set(this.attr.productSelect, "unique", productSelect.unique);
					this.$set(this, "uniqueValue", productSelect.unique);
					this.$set(this, "attrValue", value.join(","));
					if (productSelect.stock == 0) {
						this.$set(this.attr.productSelect, "cart_num", 0);
					} else {
						this.$set(this.attr.productSelect, "cart_num", this.min_count || 1);
					}
				} else if (!productSelect && productAttr.length) {
					this.$set(
						this.attr.productSelect,
						"store_name",
						this.storeInfo.store_name
					);
					this.$set(this.attr.productSelect, "image", this.storeInfo.image);
					this.$set(this.attr.productSelect, "price", this.storeInfo.price);
					this.$set(this.attr.productSelect, "svip_price", this.storeInfo.svip_price);
					this.$set(this.attr.productSelect, "stock", 0);
					this.$set(this.attr.productSelect, "unique", "");
					this.$set(this, "uniqueValue", "");
					this.$set(this.attr.productSelect, "cart_num", 0);
					this.$set(this, "attrValue", "");
				} else if (!productSelect && !productAttr.length) {
					this.$set(
						this.attr.productSelect,
						"store_name",
						this.storeInfo.store_name
					);
					this.$set(this.attr.productSelect, "image", this.storeInfo.image);
					this.$set(this.attr.productSelect, "price", this.storeInfo.price);
					this.$set(this.attr.productSelect, "svip_price", this.storeInfo.svip_price);
					this.$set(this.attr.productSelect, "stock", this.storeInfo.stock);
					this.$set(this.attr.productSelect, "unique", this.storeInfo.unique || "");
					this.$set(this, "uniqueValue", this.storeInfo.unique || "");
					this.$set(this, "attrValue", "");
					this.$set(this.attr.productSelect, "cart_num", 1);
				} else if (productSelect && !productAttr.length) {
					this.$set(this.attr.productSelect, "store_name", this.storeInfo.store_name);
					this.$set(this.attr.productSelect, "image", productSelect.image);
					this.$set(this.attr.productSelect, "price", productSelect.price);
					this.$set(this.attr.productSelect, "svip_price", productSelect.svip_price);
					this.$set(this.attr.productSelect, "stock", productSelect.stock);
					this.$set(this.attr.productSelect, "unique", productSelect.unique);
					this.$set(this, "uniqueValue", productSelect.unique);
					this.$set(this, "attrValue", value.join(","));
					if (productSelect.stock == 0) {
						this.$set(this.attr.productSelect, "cart_num", 0);
					} else {
						this.$set(this.attr.productSelect, "cart_num", this.min_count || 1);
					}
				}
				this.openCartWindow();
			},
			/**
			 * 属性变动赋值
			 *
			 */
			ChangeAttr: function(res) {
				let productSelect = this.productValue[res];
				if(productSelect)this.$set(this, "uniqueValue", productSelect.unique);
				if (productSelect && productSelect.stock > 0) {
					this.$set(this.attr.productSelect, "image", productSelect.image ? productSelect.image : this.storeInfo.image);
					this.$set(this.attr.productSelect, "price", productSelect.price);
					this.$set(this.attr.productSelect, "svip_price", productSelect.svip_price);
					this.$set(this.attr.productSelect, "stock", productSelect.stock);
					this.$set(this.attr.productSelect, "unique", productSelect.unique);
					this.$set(this, "uniqueValue", productSelect.unique);
					this.$set(this, "attrValue", res);
					if (productSelect.stock == 0) {
						this.$set(this.attr.productSelect, "cart_num", 0);
					} else {
						this.$set(this.attr.productSelect, "cart_num", this.min_count || 1);
					}
				}
				 else {
					this.$set(this.attr.productSelect, "image", productSelect.image);
					this.$set(this.attr.productSelect, "price", productSelect.price);
					this.$set(this.attr.productSelect, "svip_price", productSelect.svip_price);
					this.$set(this.attr.productSelect, "stock", 0);
					this.$set(this.attr.productSelect, "unique", "");
					this.$set(this.attr.productSelect, "cart_num", 0);
					this.$set(this, "attrValue", res);
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
					if(num.cart_num > this.storeInfo.once_max_count&&this.storeInfo.once_max_count!=0&&this.storeInfo.pay_limit!=0){
						this.$set(this.attr.productSelect, "cart_num", this.storeInfo.once_max_count);
						this.$set(this, "cart_num", this.storeInfo.once_max_count);
						return this.$util.Tips({
							title: "单次购买件数不能超过"+this.storeInfo.once_max_count+"件！"
						});
					}
				} else {
					num.cart_num--;
					if (num.cart_num < 1) {
						this.$set(this.attr.productSelect, "cart_num", 1);
						this.$set(this, "cart_num", 1);
					}
					if(num.cart_num < this.storeInfo.once_min_count&&this.storeInfo.once_min_count!=0){
						this.$set(this.attr.productSelect, "cart_num", this.storeInfo.once_min_count);
						this.$set(this, "cart_num", this.storeInfo.once_min_count);
						return this.$util.Tips({
							title: "单次购买件数不能少于"+this.storeInfo.once_min_count+"件！"
						});
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
			/**
			 *
			 *
			 * 收藏商品
			 */
			setCollect: function(item) {
				if (this.isLogin === false) {
					toLogin()
				} else {
					let that = this;
					if (item.isRelation) {
						collectDel({
							type: 0,
							type_id: item.product_id
						}).then(res => {
							that.$util.Tips({
								title: '已取消收藏'
							});
							that.$set(item, 'isRelation', !item.isRelation);
						}).catch(err=>{
							that.$util.Tips({
								title: err
							});
						})
					} else {
						collectAdd({
							type_id: item.product_id,
							type: 0
						}).then(res => {
							that.$util.Tips({
								title: '收藏成功'
							});
							that.$set(item, 'isRelation', !item.isRelation);
						}).catch(err=>{
							that.$util.Tips({
								title: err
							});
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
			 * 打开购物车弹窗*/
		 openCartWindow(){
			 let that = this,
			 	productSelect = that.productValue[this.attrValue];
			 //打开属性
			 if (that.attrValue) {
			 	//默认选中了属性，但是没有打开过属性弹窗还是自动打开让用户查看默认选中的属性
			 	that.attr.cartAttr = !that.isOpen ? true : false;
			 } else {
			 	if (that.isOpen) that.attr.cartAttr = true;
			 	else
			 	 that.attr.cartAttr = !that.attr.cartAttr;
			 }
			 //只有关闭属性弹窗时进行加入购物车
			 if (that.attr.cartAttr === true && that.isOpen === false)
			 	return (that.isOpen = true);
			 that.isOpen = that.attr.cartAttr = true;
		 },
			/*
			 * 加入购物车
			 */
			goCat: function(news) {
				let that = this,
					productSelect = that.productValue[this.attrValue];
				if (
					that.attr.productAttr.length &&
					that.isOpen === true &&
					productSelect.stock == 0
				)
					return that.$util.Tips({
						title: "产品库存不足，请选择其它"
					});
				if (that.attr.productSelect.cart_num == 0) {
					return that.$util.Tips({
						title: '购买个数不能为0！'
					})
				}
				let q = {
					is_new: news == false ? 0 : 1,
					product_id: this.storeInfo.product_id,
					cart_num: that.attr.productSelect.cart_num,
					product_attr_unique: that.attr.productSelect !== undefined ? that.attr.productSelect.unique : "",
					product_type: 0,
				};
				postCartAdd(q)
					.then(function(res) {
						that.isOpen = that.attr.cartAttr = false;
						let cartId = res.data.cart_id
						let arr = (Cache.get(CART_ID)&&JSON.parse(Cache.get(CART_ID))) || []
						arr.push(cartId)
						Cache.set(CART_ID, Array.from([...new Set(arr)]))
						const timestamp = Date.now();
						Cache.set(CART_TIME,timestamp)
						if (news) {
							uni.navigateTo({
								url: '/pages/users/order_confirm/index?cartId=' + cartId
							});
						} else {
							that.getCartNum()
							that.$util.Tips({
								title: "添加购物车成功",
							});
						}
					})
					.catch(res => {
						return that.$util.Tips({
							title: res
						});
					});
			},
			getCartNum: function() {
				let that = this;
				getCartCounts().then(res => {
					that.$store.commit('UPDATE_CARTNUM', res.data[0].count);
				});
			},
		},

	}
</script>
<style lang="scss" scoped>
	.product-con{
		background: #000000;
		padding: 30rpx 20rpx 0;
		position: relative;
	}

	::v-deep .goods-item{
		margin-bottom: 20rpx;
		.goods-info{
			padding: 24rpx;
		}
		.goods-price{
			.price{
				color: var(--view-theme);
			}
		}
		.goods-buy-text{
			color: #999999;
			font-size: 24rpx;
		}
		.goods-title{
			margin-top: 16rpx;
			font-size: 32rpx;
			.title{
				width: 600rpx;
				font-weight: bold;
			}
		}
	}
	.head-menu{
		width: 60rpx;
		height: 60rpx;
		background: rgba(255,255,255,0.6);
		border-radius: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		position: absolute;
		top: 40rpx;
		left: 20rpx;
		z-index: 10;
		.iconfont{
			color: #000000;
			fonnt-size: 26rpx;
		}
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
		margin-left: 4rpx;
		image {
			width: 100%;
			height: 100%;
			display: block;
		}
	}
	.item-footer{
		margin-top: 20rpx;
		.footer-store{
			width: 150rpx;
			font-size: 20rpx;
			color: #666666;
			justify-content: center;
			.item{
				margin-right: 30rpx;
			}
			.store-avatar{
				width: 42rpx;
				height: 42rpx;
				.image{
					width: 100%;
					height: 100%;
					border-radius: 100%;
				}
			}
			.iconfont{
				font-size: 38rpx;
				&.icon-ic_star1{
					color: var(--view-theme);
				}
			}
		}
		.footer-btn{
			width: 500rpx;
		}
	}
	.item-footer .footer-btn .bnts {
		width: 240rpx;
		text-align: center;
		line-height: 72rpx;
		color: #fff;
		font-size: 26rpx;
		border-radius: 40rpx;
		&.sold_out {
			width: 460rpx;
		}
		&.virtual_buy {
			width: 460rpx;
		}
	}
	.item-footer .footer-btn .joinCart {
		background-image: linear-gradient(90deg, var(--view-bntColor11) 0%, var(--view-bntColor12) 100%);
		&.disabled{
			background: #bbb;
		}
	}
	.item-footer .footer-btn .buy {
		background-image: linear-gradient(90deg, var(--view-bntColor21) 0%, var(--view-bntColor22) 100%);
	}
	.item-footer .footer-btn .buy[disabled] {
		background: #bbb;
	}
</style>
