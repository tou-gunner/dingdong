<template>
	<view v-if="hostProduct.length>0" class="pad20">
		<view class='recommend'>
			<view class="common-hd">
				<view class="title" :style="{ 'background-image': `url(${domain}/static/images/index-title.png)`}">为你推荐</view>
			</view>
			<view class='recommendList' :class="indexP?'on':''">
				<WaterfallsFlow :wfList='hostProduct' :addCart="true" @itemTap="goDetail" @addCat="selecAttr" :type="0" />
			</view>
		</view>
		<!-- 组件 -->
		<productWindow :attr="attr" :isShow='true' :iSplus='1' :destri="0" :isList="true" :isTab="isTab" :isCustom="isCustom" @myevent="onMyEvent" @ChangeAttr="ChangeAttr" @ChangeCartNum="ChangeCartNum"
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
	import {mapGetters} from "vuex";
	import { goShopDetail } from '@/libs/order.js';
	import {initiateAssistApi} from '@/api/activity.js';
	import {toLogin} from '@/libs/login.js';
	import WaterfallsFlow from '@/components/WaterfallsFlow/WaterfallsFlow.vue';
	import { HTTP_REQUEST_URL } from '@/config/app';
	import productWindow from '@/components/productWindow';
	import util from '@/utils/util.js';
	export default {
		components:{WaterfallsFlow, productWindow},
		computed: mapGetters(['uid']),
		props: {
			hostProduct: {
				type: Array,
				default: function() {
					return [];
				}
			},
			indexP:{
				type: Boolean,
				default: false
			},
			isLogin:{
				type: Boolean,
				default: false
			},
			isTab: {
				type: Boolean,
				default: false
			},
			isCart: {
				type: Boolean,
				default: false
			},
			isCustom: {
				type: Boolean,
				default: () => false
			}
		},
		data() {
			return {
				domain: HTTP_REQUEST_URL,
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
		mounted() {

		},
		watch: {

		},
		onPullDownRefresh(){
			// 模拟上拉刷新
			setTimeout(()=>{
				const newList = this.hostProduct.reverse();
				this.hostProduct = newList;
				uni.stopPullDownRefresh();
			},500)
		},
		methods: {
			goDetail(item){
				if(item.cate_hot == 1){
					uni.navigateTo({
						url: '/pages/goods_recommend/index?id=' + item.product_id
					});
				}else{
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
							toLogin();
						}
					})
				}
			},
			/**
			 * 打开属性插件
			 */
			selecAttr: function(item) {
				let that = this;
				let type = item.product ? item.product.type : item.type
				if((item.product_type == 0 && type != 0) || item.product_type > 0 || item.mer_form_id){
					that.goDetail(item)
				}else{
					that.storeInfo = item;
					util.getProductSpecs(item.spu_id,function(data){
						that.$set(that, "attr", data.attr);
						that.$set(that.attr.productSelect,"store_name",item.store_name);
						that.$set(that, 'svipPrice', item.show_svip_info && item.show_svip_info.show_svip_price || false);
						that.$set(that, 'productValue', data.productValue);
						that.$set(that, "attrValue", data.attrValue);
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
					if(that.isCart){
						that.$emit("getCartNum");
						// that.$emit("getCartList");
					}
				})
			},
		}
	}
</script>

<style scoped lang="scss">
	.common-hd {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 118rpx;
		.title {
			padding: 0 80rpx;
			font-size: 34rpx;
			color: $theme-color;
			font-weight: bold;
			background-repeat: no-repeat;
			background-size: 100% auto;
			background-position: left center;
		}
	}
	.recommend .recommendList {
		min-height: 100rpx;
	}
	.recommend .recommendList.on{
		padding: 0;
	}
	/deep/.looming-gray{
		border-radius: 16rpx 16rpx 0 0;
	}
</style>
