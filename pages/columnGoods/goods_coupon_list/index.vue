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
					<input placeholder='ປ້ອນຊື່ສິນຄ້າເພື່ອຄົ້ນຫາ' placeholder-class='placeholder' confirm-type='search' name="search" :value='where.keyword'
					 @confirm="searchSubmit"></input>
				</view>
			</view>
			<view class="nav-wrapper">
				<view class='nav acea-row row-middle'>
					<view class='item' @click="downStatus = !downStatus" :class="{'t-color':downKey>0 && firstKey == 0}">
						{{downMenu[downKey].title}}
						<text v-if="!downStatus" class="iconfont icon-ic_downarrow"></text>
						<text v-else class="iconfont icon-ic_downarrow"></text>
					</view>
					<view class='item' :class="{'t-color':firstKey == 3}" @click='set_where(3)'>
						ຍອດຂາຍ
					</view>
					<view class='item' :class="{'t-color':firstKey == 2}" @click='set_where(2)'>
						ລາຄາ
						<image v-if="price==1" :src="domain+'/static/diy/up'+keyColor+'.png'"></image>
						<image v-else-if="price==2" :src="domain+'/static/diy/down'+keyColor+'.png'"></image>
						<image v-else :src='`${domain}/static/images/horn.png`'></image>
					</view>
					<!-- down -->
					<view class='item' :class="{'t-color':firstKey == 4}" @click='bindRight'>
						ກັ່ນຕອງ
						<text class="iconfont icon-ic_sort"></text>
					</view>
				</view>
			</view>
			<block>
				<view class="container">
					<view v-if="productList.length>0" class="coupon_count acea-row">
						<text class="text">ສິນຄ້າລຸ່ມນີ້ໃຊ້ໄດ້ກັບ</text>
						<text class="coupon_used" :style="{ 'background-image': `url(${domain}/static/diy/coupon${keyColor}.png)` }">满{{couponData.use_min_price}}减{{couponData.coupon_price}}</text>
					</view>
					<!-- 商品 -->
					<view class='list acea-row row-between-wrapper on'>
						<view class='item' hover-class='none' v-for="(item,index) in productList" :key="index"
						 @click.stop="godDetail(item)">
							<view class='pictrue'>
								<image :src='item.image'></image>
							</view>
							<view class='text on acea-row row-between-wrapper'>
								<view class='name line1'>
									<text class="text_name line2">{{item.store_name}}</text>
								</view>
								<view class="item_bot">
									<view class="acea-row">
										<view class='money t-color'>
											<priceFormat :price="item.price" weight intSize="40" floatSize="26" labelSize="26"></priceFormat>
										</view>
										<view v-if="item.show_svip_info.show_svip_price && item.svip_price" class="acea-row row-middle svip-count">
											<text class='vip-money regular'>₭{{item.svip_price}}</text>
											<view class="vipImg">
												<image :src="`${domain}/static/images/svip.png`"></image>
											</view>
										</view>
									</view>
									<view class="item_tags acea-row">
										<text v-if="item.merchant.type_name && item.product_type == 0" class="font-bg-red">{{item.merchant.type_name}}</text>
										<text v-else-if="item.merchant.is_trader && item.product_type == 0" class="font-bg-red">ຂາຍເອງ</text>
										<text v-if="item.product_type != 0" :class="'font_bg-red type'+item.product_type">{{item.product_type == 1 ? "ການຂາຍດ່ວນ" : item.product_type == 2 ? "ສັ່ງຈອງລ່ວງໜ້າ" : item.product_type == 3 ? "ຊ່ວຍເຫຼືອ" : item.product_type == 4 ? "ຊື້ເປັນກຸ່ມ" : ""}}</text>
										<text class="tags_item ticket" v-if="item.issetCoupon">ເອົາຄູປອງ</text>
										<text class="tags_item delivery" v-if="item.delivery_free == 1">ສົ່ງຟຣີ</text>
									</view>
									<view class="score">{{item.rate}}ຄະແນນ {{item.reply_count}}ຄຳເຫັນ</view>
									<view class="company" v-if="item.merchant" @click.stop="goShop(item.mer_id)">
										<text class="line1">{{item.merchant.mer_name}}</text>
										<view class="flex">
											ເຂົ້າຮ້ານ
											<text class="iconfont icon-ic_rightarrow"></text>
										</view>
									</view>
									<view v-if="item.product_type != 3" class="add-cart acea-row row-middle row-center" @click.stop="selecAttr(item)">
										<text class="iconfont icon-ic_ShoppingCart1"></text>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class='noCommodity' v-if="productList.length==0 && where.page > 1">
					<view class='pictrue' style="margin: 60rpx auto;">
						<image :src="`${domain}/static/images/no_thing.png`"></image>
						<view>ບໍ່ມີສິນຄ້າ, ໄປເບິ່ງອັນອື່ນ</view>
					</view>
					<recommend v-if="recommend_switch == 1" :hostProduct="hostProduct" :isLogin="isLogin"></recommend>
				</view>
			</block>
			<rightSlider v-if="rightBox&&brandStataus&&parmasStatus" :price_on="where.price_on" :price_off="where.price_off" :status="rightBox&&brandStataus&&parmasStatus" :brandList="brandList" :storeTypeArr="storeTypeArr" :parmasList="parmasList" @confirm="confirm" @close="close"></rightSlider>
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
	import { getCouponProductlist, getProductHot, getBrandlist, getParmasList, getStoreTypeApi } from '@/api/store.js';
	import recommend from '@/components/recommend';
	import rightSlider from '../components/rightSlider.vue';
	import WaterfallsFlow from '@/components/WaterfallsFlow/WaterfallsFlow.vue';
	import {initiateAssistApi} from '@/api/activity.js';
	import { mapGetters } from "vuex";
	import { configMap } from "@/utils";
	import { HTTP_REQUEST_URL } from '@/config/app';
	import { toLogin } from '@/libs/login.js';
	// #ifndef H5
	import passwordPopup from '@/components/passwordPopup';
	// #endif
	import util from '../../../utils/util.js';
	import { goShopDetail } from '@/libs/order.js';
	import productWindow from '@/components/productWindow';

	const app = getApp();
	export default {
		computed: configMap({hide_mer_status: 1,recommend_switch:0},mapGetters(['uid','isLogin','scrollTop','viewColor','keyColor'])),
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
				couponData: {},
				list: [],
				where: {
					coupon_id: '',
					cate_id: '',
					order: '',
					price_on: '',
					price_off: '',
					brand_id: '',
					keyword:'',
					page:1,
					limit:30
				},
				price: 0,
				stock: 0,
				nows: false,
				loadend: false,
				loading: false,
				loadTitle: 'ໂຫຼດເພີ່ມ',
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
				parmasList: [],
				storeTypeArr: [],
				downKey: 0,
				downStatus: false,
				// 下拉菜单
				downMenu: [{
						title: 'ຈັດລຽງລວມ',
						key: 1,
					},
					{
						title: 'ຄະແນນ',
						key: 2,
					},
					{
						title: 'ສິນຄ້າໃໝ່',
						key: 3,
					}
				],
				// 是否第一个
				firstKey:0,
				// tab切换
				tabIndex: 1,
				// 商铺列表
				storeList: [],
				sotreParam:{
					keyword:'',
					page:1,
					limit:30,
					order:''
				},
				storeKey:0,
				storeScroll:true,
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
			this.$set(this.where, 'cate_id', options.id || '');
			this.$set(this.where, 'coupon_id', options.coupon_id || '');
			this.title = options.title || '';
			this.$set(this.where, 'keyword', options.searchValue || '');
			this.get_product_list(true);
			this.get_host_product();
		},
		onReady(){},
		mounted: function() {
			this.get_product_list(true);
		},
		methods: {
			// 去店铺
			goShop(id){
				if(this.hide_mer_status != 1){
					uni.navigateTo({
						url:`/pages/store/home/index?id=${id}`
					})
				}
			},
			// 右侧切换
			bindRight(){
				this.price = 0;
				this.firstKey = 4
				if(!this.brandList.length)this.getBrandlist()
				if(!this.storeTypeArr.length)this.getStoreType()
				if(!this.parmasList.length)this.getParmasList()
				this.rightBox = true
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
			// 品牌列表
			getBrandlist(){
				let temp = []
				getBrandlist({
					cate_id:this.where.cate_id,
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
			confirm(data) {
				let arr = []
				if(data.brandList.length == 0){
					this.where.brand_id = ''
				}else{
					data.brandList.forEach(item =>{
						arr.push(item.brand_id)
					})
					this.where.brand_id =arr
				}
				this.rightBox = data.status
				this.where.price_on = data.price_on
				this.where.price_off = data.price_off
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
					uni.setStorageSync('storeIndex', this.where.cate_id);
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
				getCouponProductlist(that.where).then(res => {
					this.couponData = res.data.coupon;
					let list = res.data.list;
					let productList = that.$util.SplitArray(list, that.productList);
					let loadend = list.length < that.where.limit;
					that.loadend = loadend;
					that.loading = false;
					that.loadTitle = loadend ? 'ໂຫຼດໝົດແລ້ວ' : 'ໂຫຼດເພີ່ມ';
					that.$set(that, 'productList', productList);
					that.$set(that.where, 'page', that.where.page + 1);
				}).catch(err => {
					that.loading = false;
					that.loadTitle = 'ໂຫຼດເພີ່ມ';
				});
			},
			/**
			 * 打开属性插件
			 */
			selecAttr: function(item) {
				let that = this;
				let type = item.product ? item.product.type : item.type
				if((item.product_type == 0 && type != 0) || item.product_type > 0 || item.mer_form_id){
					that.godDetail(item);
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
						title: "ສິນຄ້າໝົດສະຕ໋ອກ, ກະລຸນາເລືອກອັນອື່ນ"
					});
				if (that.attr.productSelect.cart_num == 0) {
					return that.$util.Tips({
						title: 'ຈຳນວນຊື້ຕ້ອງບໍ່ແມ່ນ 0!'
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
	.font-bg-red {
		background-color: var(--view-theme);
		&.type2{
			background-color: #FD6523;
		}
	}
	.productList .search .input {
		/*#ifdef H5*/
		width: 650rpx;
		/*#endif*/
		/*#ifndef H5*/
		width: 100%;
		/*#endif*/
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
		color: #ccc;
	}
	.productList .search .input .iconfont {
		font-size: 32rpx;
		color: #999;
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
	}
	.productList .nav .item {
		display: flex;
		align-items: center;
		justify-content: center;
		flex: 1;
	}
	.productList .nav .item.t-color {
		font-weight: bold;
	}
	.productList .nav .item image {
		width: 15rpx;
		height: 19rpx;
		margin-left: 10rpx;
	}
	.productList .list {
		padding: 0 20rpx;
	}
	.productList .list.on {
		background-color: #fff;
		border-top: 1px solid #f6f6f6;
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
	color: var(--view-theme);
	border: 1rpx solid var(--view-theme);
}
.item_tags .tags_item.delivery{
	color: #FF9000;
	border: 1rpx solid #FF9000;
}
.container{
	margin-top: 168rpx;
}
.coupon_count{
	background: #FFF6F6;
	padding: 15rpx 30rpx 12rpx;
	color: var(--view-theme);
	font-size: 26rpx;
	line-height: 36rpx;
	.text{
		padding: 4rpx 0;
	}
}
.coupon_used{
	display: flex;
	align-items: center;
	justify-content: center;
	max-width: 300rpx;
	padding: 3rpx 16rpx;
	margin-left: 10rpx;
	background-size: 100% 100%;
	font-size: 24rpx;
	font-weight: normal;
	color: var(--view-priceColor);
}
.svip-count{
	position: relative;
	top: 4rpx;
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
.noCommodity {
	padding-bottom: 30rpx;
}
.icon-ic_downarrow {
	margin-top: 6rpx;
	font-size: 24rpx;
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
.productList .list .item {
	width: 100%;
	display: flex;
	padding-top: 20rpx;
	margin-bottom: 40rpx;
	position: relative;
}
.productList .list .item .pictrue {
	width: 240rpx;
	height: 240rpx;
}
.productList .list .item .pictrue image {
	width: 240rpx;
	height: 240rpx;
	border-radius: 16rpx;
}
.productList .list .item .text {
	font-size: 28rpx;
	width: 460rpx;
	padding: 0 0 0 22rpx;
	justify-content: space-between;
	.name,.item_bot{
		width: 100%;
	}
}
.productList .list .item .text .money {
	color: var(--view-priceColor);
}
.productList .list .item .text .score {
	margin-top: 10rpx;
	color: #737373;
	font-size: 20rpx;
}
.productList .list .item .text .company {
	display: flex;
	align-items: center;
	color: #737373;
	font-size: 20rpx;
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
			font-size: 16rpx;
			margin-top: 4rpx;
		}
	}
}
</style>
