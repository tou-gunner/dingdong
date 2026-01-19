<template>
	<view :style="viewColor">
		<view class='productList'>
			<view class='search acea-row row-between-wrapper'>
				<!--#ifdef H5-->
				<view class="back" @click='set_where(1)'>
					<view class="iconfont icon-ic_leftarrow"></view>
				</view>
				<!--#endif-->
				<view class='input acea-row row-between-wrapper'><text class='iconfont icon-ic_search'></text>
					<input placeholder='搜索商品名称' placeholder-class='placeholder' confirm-type='search' name="search" :value='where.keyword'
					 @confirm="searchSubmit"></input>
				</view>
				<view style="text-align: right;" class='iconfont' :class='is_switch==true?"icon-a-ic_Imageandtextsorting":"icon-a-ic_Picturearrangement"' @click='Changswitch'></view>
			</view>
			<view class="nav-wrapper">
				<view class='nav acea-row row-middle'>
					<view class='item' @click="downStatus = !downStatus" :class="{'t-color':downKey>0 && firstKey == 0}">
						{{downMenu[downKey].title}}
						<text v-if="!downStatus" class="iconfont icon-ic_downarrow"></text>
						<text v-else class="iconfont icon-ic_uparrow"></text>
					</view>
					<view class='item' :class="{'t-color':firstKey == 3}" @click='set_where(3)'>
						销量
					</view>
					<view class='item' :class="{'t-color':firstKey == 2}" @click='set_where(2)'>
						价格
						<image v-if="price==1" :src="domain+'/static/diy/up'+keyColor+'.png'"></image>
						<image v-else-if="price==2" :src="domain+'/static/diy/down'+keyColor+'.png'"></image>
						<image v-else :src='`${domain}/static/images/horn.png`'></image>
					</view>
					<!-- down -->
					<view class='item' :class="{'t-color':firstKey == 4}" @click='bindRight'>
						筛选
						<text class="iconfont icon-ic_sort"></text>
					</view>
				</view>
			</view>
			<!-- 商品 -->
			<block>
				<view v-if="!is_switch && productList.length>0" class='list acea-row row-between-wrapper on'>
					<view class='item on' hover-class='none' v-for="(item,index) in productList" :key="index"
					 @click="godDetail(item)">
						<view class='pictrue on'>
							<image :src='item.image' class="on"></image>
							<view v-if="item.border_pic" :style="{ backgroundImage: `url(${item.border_pic})` }" class="border-picture"></view>
						</view>
						<view class='text on acea-row row-column-between'>
							<view class='name line1'>
								<text class="text_name line2">{{item.store_name}}</text>
							</view>
							<view class='money on'>
								<priceFormat :price="item.price" weight intSize="40" floatSize="26" labelSize="26"></priceFormat>
							</view>
							<view class="item_tags acea-row">
								<text v-if="item.merchant&&item.merchant.type_name && item.product_type == 0" class="font-bg-red bt-color">{{item.merchant.type_name}}</text>
								<text v-else-if="item.merchant.is_trader && item.product_type == 0" class="font-bg-red bt-color">自营</text>
								<text v-if="item.product_type != 0" :class="'font_bg-red bt-color type'+item.product_type">{{item.product_type == 1 ? "秒杀" : item.product_type == 2 ? "预售" : item.product_type == 3 ? "助力" : item.product_type == 4 ? "拼团" : ""}}</text>
								<text class="tags_item ticket" v-if="item.issetCoupon">领券</text>
								<text class="tags_item delivery" v-if="item.delivery_free == 1">包邮</text>
								<text class="tags_item reservation" v-if="item.product.reservation && item.product.type == 4">{{reservateLabel(item.product.reservation)}}</text>
							</view>
							<view class="score">{{item.rate}}评分 {{item.reply_count}}条评论</view>
							<view class="company" v-if="item.merchant" @click.stop="goShop(item.mer_id)">
								<text class="line1">{{item.merchant.mer_name}}</text>
								<view class="flex">
									进店
									<text class="iconfont icon-ic_rightarrow"></text>
								</view>
							</view>
						</view>
						<view v-if="item.product_type != 3" class="add-cart acea-row row-middle row-center" @click.stop="selecAttr(item)">
							<text class="iconfont icon-ic_ShoppingCart1"></text>
						</view>
					</view>
				</view>
				<view v-else class='list'>
					<WaterfallsFlow :wfList='productList' @itemTap="godDetail" :type="1" :isStore="0" :addCart="true" @goShop="goShop" @addCat="selecAttr"/>
				</view>
				<view class='noCommodity' v-if="productList.length==0 && where.page > 1">
					<view class='pictrue' style="margin: 60rpx auto;">
						<image :src="`${domain}/static/images/no_thing.png`"></image>
						<view>暂无商品，去看点什么吧</view>
					</view>
					<recommend v-if="recommend_switch == 1" :hostProduct="hostProduct" :isLogin="isLogin"></recommend>
				</view>
			</block>
			<rightSlider v-if="rightBox&&brandStataus&&parmasStatus" :status="rightBox&&brandStataus&&parmasStatus" :brandList="brandList" :storeTypeArr="storeTypeArr" :parmasList="parmasList" @confirm="confirm" @close="close" :price_on="where.price_on" :price_off="where.price_off" :activeIndex="activeIndex"></rightSlider>
		</view>
		<view class="down-wrapper" v-if="downStatus">
			<view class="bg" @click="downStatus=false"></view>
			<view class="down-box">
				<view class="down-item" v-for="(item,index) in downMenu" :key="item.key" :class="{'on':index == downKey}" @click="bindDown(item,index)">
					{{item.title}}
					<text v-if="index == downKey" class="iconfont icon-ic_complete"></text>
				</view>
			</view>
		</view>
		<!-- #ifndef H5 -->
		<passwordPopup></passwordPopup>
		<!-- #endif -->
		<!-- 组件 -->
		<productWindow :attr="attr" :isShow='true' :iSplus='1' :destri="0" :isList="true" @myevent="onMyEvent" @ChangeAttr="ChangeAttr" @ChangeCartNum="ChangeCartNum"
		 @attrVal="attrVal" @goCat="goCat" @iptCartNum="iptCartNum" id='product-window' :payLimit="pay_limit" :maxCount="max_count" :minCount="min_count" :svipPrice="svipPrice" :image="storeInfo.image"></productWindow>
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
	import {
		getProductslist,
		getProductHot,
		getBrandlist,
		getStoreTypeApi,
		getParmasList
	} from '@/api/store.js';
	import recommend from '@/components/recommend';
	import rightSlider from '../components/rightSlider.vue'
	import WaterfallsFlow from '@/components/WaterfallsFlow/WaterfallsFlow.vue'
	import {initiateAssistApi} from '@/api/activity.js';
	import { configMap } from "@/utils";
	import util from '@/utils/util.js';
	import productWindow from '@/components/productWindow';
	import { mapGetters } from "vuex";
	// #ifndef H5
	import passwordPopup from '@/components/passwordPopup';
	// #endif
	import { goShopDetail } from '@/libs/order.js'
	import { HTTP_REQUEST_URL } from '@/config/app';
	import { toLogin } from '@/libs/login.js';
	const app = getApp();
	export default {
		computed: configMap({hide_mer_status: 1,recommend_switch: 0}, mapGetters(['uid','isLogin','scrollTop','viewColor','keyColor'])),
		components: {
			// #ifndef H5
			passwordPopup,
			// #endif
			recommend,
			rightSlider,
			WaterfallsFlow,
			productWindow
		},
		watch:{

		},
		data() {
			return {
				domain: HTTP_REQUEST_URL,
				productList: [],
				list: [],
				storeTypeArr: [], //店铺类型
				parmasList: [],
				is_switch: true,
				where: {
					cate_pid: '',
					order: '',
					price_on: '',
					price_off: '',
					brand_id: '',
					mer_type_id: '',
					keyword:'',
					is_trader: '',
					filter_params: '',
					page:1,
					limit:30
				},
				price: 0,
				stock: 0,
				nows: false,
				loadend: false,
				loading: false,
				loadTitle: '加载更多',
				title: '',
				hostProduct: [],
				hotPage: 1,
				hotLimit: 10,
				hotScroll: false,
				// 筛选框
				rightBox: false,
				brandStataus: false,
				parmasStatus: false,
				//品牌列表
				brandList: [],
				downKey: 0,
				downStatus: false,
				// 下拉菜单
				downMenu: [{
						title: '综合',
						key: 1,
					},
					{
						title: '评分',
						key: 2,
					},
					{
						title: '新品',
						key: 3,
					}
				],
				// 是否第一个
				firstKey:0,
				sotreParam:{
					keyword:'',
					page:1,
					limit:30,
					order:'',
				},
				storeKey:0,
				storeScroll:true,
				activeIndex: 0,
				max_count: 0,
				min_count: 0,
				pay_limit: 1,
				svipData: {},
				svipPrice: false,
				attr: {
					cartAttr: false,
					productAttr: [],
					productSelect: {}
				},
				storeInfo: {},
				cart_num: 1, //购买数量
				isOpen: false, //是否打开属性组件
				selectedArr: [],
				productValue: [], //系统属性
				attrValue: "",
				uniqueValue: "",
			};
		},
		// 滚动监听
		onPageScroll() {
			uni.$emit('scroll');
		},
		onLoad: function(options) {
			this.$set(this.where, 'cate_pid', options.id || '');
			this.title = options.title || '';
			this.$set(this.where, 'keyword', options.searchValue || '');
			this.get_product_list(true);
			this.get_host_product();
		},
		onReady(){

		},
		mounted: function() {

		},
		methods: {
			reservateLabel(item) {
				return item.reservation_type == 1 ? '到店' : item.reservation_type == 2 ? '上门' : '上门+到店'
			},
			// 去店铺
			goShop(id){
				if(this.hide_mer_status != 1){
					uni.navigateTo({
						url:`/pages/store/home/index?id=${id}`
					})
				}
			},
			// 获取店铺类型
			async getStoreType() {
				let temp = []
				getStoreTypeApi()
					.then(res => {
						temp = res.data.map(item => {
							return {
								...item,
								check: false
							}
						})
						this.storeTypeArr = temp
					})
					.catch(res => {
						this.$util.Tips({
							title: res
						});
					});
			},
			// 获取参数列表
			async getParmasList(){
				let temp = []
				getParmasList({
					cate_pid:this.where.cate_pid,
					keyword:this.where.keyword
				})
					.then(res => {
						this.parmasStatus = true
						temp = res.data.map(item => {
							return {
								...item,
								check: false,
								showValue: false,
								parmasValue: []
							}
						})
						this.parmasList = temp
					})
					.catch(res => {
						this.$util.Tips({
							title: res
						});
					});
			},
			// 右侧切换
			bindRight(){
				this.price = 0;
				this.firstKey = 4;
				if(!this.brandList.length)this.getBrandlist()
				if(!this.storeTypeArr.length)this.getStoreType()
				if(!this.parmasList.length)this.getParmasList()
				this.rightBox = true
			},
			// 品牌列表
			async getBrandlist(){
				let temp = []
				getBrandlist({
					cate_pid:this.where.cate_pid,
					keyword:this.where.keyword
				}).then(res=>{
					this.brandStataus = true
					temp = res.data.list.map(item=>{
						return {
							...item,
							check:false
						}
					})
					this.brandList = temp
				})
			},
			// 去详情页
			godDetail(item) {
				goShopDetail(item, this.uid).then(res => {
					if (this.isLogin) {
						initiateAssistApi(item.activity_id).then(res => {
							let id = res.data.product_assist_set_id;
							uni.hideLoading();
							uni.navigateTo({
								url: '/pages/activity/assist_detail/index?id=' + id
							});
						}).catch((err) => {
							uni.showToast({
								title: err,
								icon: 'none'
							})
						});
					} else {
						toLogin()
					}
				})
			},
			// 组件确定
			confirm(data,index) {
				let arr1 = [],arr2 = []
				if(data.brandList.length == 0){
					this.where.brand_id = ''
				}else{
					data.brandList.forEach(item =>{
						arr1.push(item.brand_id)
					})
					this.where.brand_id = arr1.toString()
				}
				if(data.typeList.length == 0){
					this.where.mer_type_id = ''
				}else{
					data.typeList.forEach(item =>{
						arr2.push(item.mer_type_id)
					})
					this.where.mer_type_id = arr2.toString()
				}
				this.activeIndex = index
				this.where.filter_params = data.parmasList.toString()
				this.rightBox = data.status
				this.where.price_on = data.price_on
				this.where.price_off = data.price_off
				this.where.is_trader = data.is_trader
				this.loadend = false;
				this.$set(this.where, 'page', 1)
				this.get_product_list(true);
			},
			// 组件关闭
			close() {
				this.rightBox = false
			},
			// 下拉选项
			bindDown(item, index) {
				this.firstKey = 0
				if(index == 0){
					this.where.order = ''
				}else if(index == 1){
					this.where.order = 'rate'
				}else if(index == 2){
					this.where.order = 'is_new'
				}
				this.downKey = index
				this.downStatus = false
				this.loadend = false;
				this.$set(this.where, 'page', 1)
				this.get_product_list(true);
			},
			Changswitch: function() {
				let that = this;
				that.is_switch = !that.is_switch
			},
			searchSubmit: function(e) {
				let that = this;
				that.$set(that.where, 'keyword', e.detail.value);
				that.loadend = false;
				that.$set(that.where, 'page', 1)
				this.get_product_list(true);
			},
			/**
			 * 获取我的推荐
			 */
			get_host_product: function() {
				let that = this;
				if (that.hotScroll) return
				getProductHot(
					that.hotPage,
					that.hotLimit,
				).then(res => {
					that.hotPage++
					that.hotScroll = res.data.length < that.hotLimit
					that.hostProduct = that.hostProduct.concat(res.data.list)
				});
			},
			//点击事件处理
			set_where: function(e) {
				switch (e) {
					case 1:
					uni.setStorageSync('storeIndex', this.where.cate_pid);
					uni.navigateBack()
					break
					case 2:
						this.firstKey = e
						if (this.price == 0){
							this.price = 1;
							this.where.order = 'price_asc'
						}else if (this.price == 1){
							this.price = 2;
							this.where.order = 'price_desc'
						}else if (this.price == 2){
							this.price = 0;
							this.where.order = ''
						}
						this.$set(this.where, 'page', 1)
						this.get_product_list(true);
						break;
					case 3:
						this.price = 0;
						this.loadend = false;
						this.$set(this.where, 'order', 'sales')
						this.$set(this.where, 'page', 1)
						this.get_product_list(true);
						this.firstKey = e
						break;
				}
				this.loadend = false;
				this.$set(this.where, 'page', 1);
				this.get_product_list(true);
			},
			//查找产品
			get_product_list: function(isPage) {
				let that = this;
				if (that.loadend) return;
				if (that.loading) return;
				if (isPage === true) that.$set(that, 'productList', []);
				that.loading = true;
				that.loadTitle = '';
				getProductslist(that.where).then(res => {
					let list = res.data.list;
					let productList = that.$util.SplitArray(list, that.productList);
					let loadend = list.length < that.where.limit;
					that.loadend = loadend;
					that.loading = false;
					that.loadTitle = loadend ? '已全部加载' : '加载更多';
					that.$set(that, 'productList', productList);
					that.$set(that.where, 'page', that.where.page + 1);
				}).catch(err => {
					that.loading = false;
					that.loadTitle = '加载更多';
				});
			},
			/**
			 * 打开属性插件
			 */
			selecAttr: function(item) {
				let that = this;
				let type = item.product ? item.product.type : item.type
				if((item.product_type == 0 && type != 0) || item.product_type > 0 || item.mer_form_id){
					that.godDetail(item)
				}else{
					that.storeInfo = item;
					util.getProductSpecs(item.spu_id,function(data){
						that.$set(that, "attr", data.attr);
						that.$set(that.attr.productSelect,"store_name",item.store_name);
						that.$set(that, 'productValue', data.productValue);
						that.$set(that, "attrValue", data.attrValue);
						that.$set(that, 'svipPrice', item.show_svip_info && item.show_svip_info.show_svip_price || false);
						that.$set(that.attr, 'cartAttr', true);
						that.$set(that, 'isOpen', true);
					})
				}

			},
			onMyEvent: function() {
				this.$set(this.attr, 'cartAttr', false);
				this.$set(this, 'isOpen', false);
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
			 * 属性变动赋值
			 *
			 */
			ChangeAttr: function(res) {
				let productSelect = this.productValue[res];
				this.attr.productSelect = {...this.attr.productSelect,...productSelect}
				if(!productSelect || productSelect.stock <= 0){
					this.$set(this.attr.productSelect, "stock", 0);
					this.$set(this.attr.productSelect, "unique", "");
					this.$set(this.attr.productSelect, "cart_num", 0);
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
				util.ChangeCartNum(productSelect,this.attr,changeValue,function(stock){
					this.$set(this.attr.productSelect, "cart_num", stock);
				})
			},
			/*
			 * 加入购物车
			 */
			goCat: function() {
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
				//如果有属性,没有选择,提示用户选择
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
					is_new: 0,
					product_id: that.storeInfo.product_id,
					cart_num: that.attr.productSelect.cart_num,
					product_attr_unique: that.attr.productSelect !== undefined ? that.attr.productSelect.unique : "",
					product_type: that.storeInfo.product_type,
				};
				util.addCart(q,function(){
					that.isOpen = that.attr.cartAttr = false;
				})
			},
		},
		onPullDownRefresh() {

		},
		onReachBottom() {
			if (this.productList.length > 0) {
				this.get_product_list('');
			} else {
				this.get_host_product();
			}
		},
		onPullDownRefresh(){
			// 模拟上拉刷新
			setTimeout(()=>{
				const newList = this.productList.reverse();
				this.productList = newList;
				uni.stopPullDownRefresh();
			},500)
		}
	}
</script>
<style lang="scss" scoped>
	.productList .search {
		width: 100%;
		height: 86rpx;
		padding: 0 20rpx;
		box-sizing: border-box;
		position: fixed;
		left: 0;
		top: 0;
		z-index: 9;
		background-color: var(--view-theme);
	}
	.bt-color{
		background-color: var(--view-theme);
		border:1px solid var(--view-theme);
		&.type2{
			background-color: #FD6523;
			border: 1px solid #FD6523;
		}
	}
	.productList .search .back {
		display: flex;
		align-items: center;
		width: 40rpx;
		height: 60rpx;
		.iconfont {
			color: #fff;
			font-size: 36rpx;
		}
	}
	.productList .search .input {
		/* #ifdef MP || APP-PLUS */
		width: 650rpx;
		/* #endif */
		/* #ifndef MP || APP-PLUS */
		width: 600rpx;
		/* #endif */
		height: 60rpx;
		background-color: #fff;
		border-radius: 50rpx;
		padding: 0 20rpx;
		box-sizing: border-box;
	}
	.productList .search .input input {
		flex: 1;
		height: 100%;
		font-size: 26rpx;
		margin-left: 10rpx;
	}
	.productList .search .input .placeholder {
		color: #999;
	}
	.productList .search .input .iconfont {
		font-size: 35rpx;
		color: #555;
	}
	.productList .search .icon-a-ic_Imageandtextsorting,
	.productList .search .icon-a-ic_Picturearrangement {
		color: #fff;
		width: 62rpx;
		font-size: 40rpx;
		height: 86rpx;
		line-height: 86rpx;
	}
	.productList .nav-wrapper {
		z-index: 9;
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		margin-top: 86rpx;
		background-color: var(--view-theme);
		.tab-bar {
			display: flex;
			align-items: center;
			.tab-item {
				position: relative;
				flex: 1;
				display: flex;
				justify-content: center;
				align-items: center;
				padding: 8rpx 0 20rpx;
				color: #fff;
				font-size: 28rpx;
				font-weight: bold;
				&::after {
					content: ' ';
					position: absolute;
					left: 50%;
					bottom: 18rpx;
					width: 30rpx;
					height: 3rpx;
					background: transparent;
					transform: translateX(-50%);
				}
				&.on {
					&::after {
						background: #fff;
					}
				}
			}
		}
	}
	.productList .nav {
		height: 86rpx;
		color: #454545;
		font-size: 28rpx;
		background-color: #fff;
		display: flex;
		justify-content: space-between;
		padding: 0 28rpx;
		border-radius: 24rpx 24rpx 0 0;
	}
	.productList .nav .item {
		display: flex;
		align-items: center;
		justify-content: center;
		flex: 1;
		&.t-color{
			font-weight: bold;
		}
	}
	.productList .nav .item image {
		width: 15rpx;
		height: 19rpx;
		margin-left: 10rpx;
	}
	.productList{
		padding-bottom: calc(0rpx+ constant(safe-area-inset-bottom)); ///兼容 IOS<11.2/
		padding-bottom: calc(0rpx + env(safe-area-inset-bottom)); ///兼容 IOS>11.2/
	}
	.productList .list {
		padding: 0 20rpx;
		margin-top: 168rpx;
	}
	.productList .list.on {
		background-color: #fff;
		border-top: 1px solid #f6f6f6;
		padding-top: 24rpx;
	}
	.icon-ic_rightarrow {
		margin-top: 6rpx;
	}
	.icon-ic_sort {
		font-size: 30rpx;
		margin-left: 10rpx;
	}
	.down-wrapper {
		.bg {
			z-index: 8;
			position: fixed;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			background: rgba(0, 0, 0, .5);
		}
		.down-box {
			z-index: 8;
			position: fixed;
			left: 0;
			top: 170rpx;
			width: 100%;
			padding: 0 40rpx 28rpx 74rpx;
			background-color: #F8F8F8;
			border-radius: 0 0 24rpx 24rpx;
			.down-item {
				margin-top: 28rpx;
				font-size: 24rpx;
				color: #454545;
				&.on {
					color: var(--view-theme);
				}
				.iconfont{
					float: right;
				}
			}
		}
	}
	.productList .list .item.on {
		width: 100%;
		display: flex;
		justify-content: space-between;
		margin-bottom: 32rpx;
		position: relative;
	}
	.productList .list .item .pictrue.on {
		position: relative;
		width: 270rpx;
		height: 270rpx;
		.border-picture {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background: center/cover no-repeat;
			border-radius: 16rpx;
		}
	}
	.productList .list .item .pictrue image {
		width: 240rpx;
		height: 240rpx;
		border-radius: 20rpx 20rpx 0 0;
	}
	.productList .list .item .pictrue image.on {
		border-radius: 16rpx;
		width: 270rpx;
		height: 270rpx;
	}
	.productList .list .item .text {
		font-size: 30rpx;
		color: #222;
		width: 460rpx;
		padding: 0 0 0 22rpx;
		.name{
			height: 80rpx;
			font-size: 28rpx;
		}
	}
	.productList .list .item .text.on {
		padding: 8rpx 0 0;
		width: 420rpx;
		height: 270rpx;
	}
.item_tags{
	margin-top: 8rpx;
}
.item_tags .tags_item {
	display: inline-block;
	font-size: 20rpx;
	text-align: center;
	border-radius: 5rpx;
	padding: 0 4rpx;
	line-height: 28rpx;
	margin-right: 8rpx;
}
.item_tags .tags_item.ticket{
	color: #E93323;
	border: 1px solid #E93323;
}
.item_tags .tags_item.delivery{
	color: #FF9000;
	border: 1px solid #FF9000;
}
	.productList .list .item .text .money {
		display: flex;
		align-items: center;
		font-size: 26rpx;
		font-weight: bold;
		margin-top: 10rpx;
		color: var(--view-priceColor);
	}
	.productList .list .item .text .money .num {
		font-size: 34rpx;
	}
	.productList .list .item .text .score {
		margin-top: 10rpx;
		color: #737373;
		font-size: 22rpx;
	}
	.productList .list .item .text .company {
		display: flex;
		align-items: center;
		color: #737373;
		font-size: 22rpx;
		margin-top: 6rpx;
		.name {
			display: inline-block;
			width: 200rpx;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
		}
		.flex {
			display: flex;
			align-items: center;
			margin-left: 10rpx;
			color: #282828;
			.iconfont {
				font-size: 20rpx;
				margin-top: 4rpx;
			}
		}
	}
	.productList .list .item .foot-bar {
		width: 100%;
		height: 52rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		background-image: linear-gradient(-90deg, var(--view-bntColor21) 0%, var(--view-bntColor22) 100%);
		border-radius: 0px 0px 16rpx 16rpx;
		color: #fff;
		font-size: 24rpx;
		.icon-fenxiang {
			font-size: 24rpx;
			margin-right: 10rpx;
		}
		&.on {
			position: absolute;
			right: 0;
			bottom: 30rpx;
			width: 180rpx;
			height: 44rpx;
			border-radius: 22rpx;
		}
	}
</style>
