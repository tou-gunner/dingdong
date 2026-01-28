<template>
	<view class="orderGoods bg-f boder-24 mt20" :style="viewColor">
		<view class='goodWrapper'>
			<view class="title">共{{cartInfo.length}}件商品</view>
			<view v-for="(item,index) in cartInfo" :key="index">
				<view class='item acea-row row-between-wrapper'>
					<view class='pictrue' @click="jumpCon(item.product_id)">
						<image :src='(item.cart_info.productAttr && item.cart_info.productAttr.image) || item.cart_info.product.image' ></image>
					</view>
					<view class='text'>
						<view class='acea-row row-between-wrapper'>
							<view class='name line1'>{{item.cart_info.product.store_name}}</view>
							<view class='num'>x {{item.product_num}}</view>
						</view>
						<view class='attr line1' v-if="item.cart_info.productAttr.sku">{{item.cart_info.productAttr.sku}}</view>
						<view class="acea-row row-middle item-money">
							<view class='moneys semiBold'>₭{{item.cart_info.productAttr.price}}</view>
							<view class="btn-item err" v-if="item.is_refund ==1">退款中 x {{item.product_num - item.refund_num}}</view>
							<view class='btn-item err' v-if="item.is_refund >1">已退款 x {{item.product_num - item.refund_num}}</view>
						</view>
					</view>
				</view>
			</view>
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
	import { openOrderRefundSubscribe } from '@/utils/SubscribeMessage.js';
	import { mapGetters } from "vuex";
	export default {
		props: {
			evaluate: {
				type: Number,
				default: 0,
			},
			activityType: {
				type: Number,
				default: 0,
			},
			cartInfo: {
				type: Array,
				default: function() {
					return [];
				}
			},
			orderId: {
				type: String,
				default: '',
			},
			jump: {
				type: Boolean,
				default: false,
			},
			orderData: {
				type: Object,
				default: function() {
					return {};
				}
			}
		},
		computed: mapGetters(['viewColor']),
		data() {
			return {
				totalNmu:'',
				isTimePay: false, //是否到支付时间
			};
		},
		watch:{
			cartInfo:function(nVal,oVal){
				let num = 0
				nVal.forEach((item,index)=>{
					num += item.cart_num
				})
				this.totalNmu = num
			}
		},
		onShow() {
			this.isPayBalance()
		},
		mounted() {},
		methods: {
			evaluateTap:function(unique,orderId){
				uni.navigateTo({
					url:`/pages/users/goods_comment_con/index?uni=${unique}&order_id=${orderId}`
				})
			},
			// 判断是否到支付尾款时间
			isPayBalance(){
				let that = this;
				if(that.orderData.status === 10){
					if(new Date() < new Date(that.orderData.presellOrder.final_start_time)){
						that.isTimePay = false; //未开始
					}else if((new Date() >= new Date(that.orderData.presellOrder.final_start_time)) && (new Date() <= new Date(that.orderData.presellOrder.final_start_time)) ){
						that.isTimePay = true; //立即支付
					}
				}
			},
			jumpCon:function(id){
				if(this.jump){
					if(this.activityType == 2){
						uni.navigateTo({
							url: `/pages/activity/presell_details/index?id=${id}`
						})
					}else{
						uni.navigateTo({
							url: `/pages/goods_details/index?id=${id}`
						})
					}
				}
			},
			// 退款
			refund(item){
				// #ifdef MP
				openOrderRefundSubscribe().then(() => {
					uni.hideLoading();
					if(this.evaluate == 0){
						uni.navigateTo({
							url:'/pages/users/refund/confirm?order_id='+this.orderId+'&type=1'+'&ids='+item.order_product_id+'&refund_type=1'
						})
					}else{
						uni.navigateTo({
							url:'/pages/users/refund/select?order_id='+this.orderId+'&type=1'+'&ids='+item.order_product_id
						})
					}
				}).catch(() => {
					uni.hideLoading();
				})
				// #endif
				// #ifdef H5
				if(this.evaluate == 0){

					uni.navigateTo({
						url:'/pages/users/refund/confirm?order_id='+this.orderId+'&type=1'+'&ids='+item.order_product_id+'&refund_type=1'
					})
				}else{
					uni.navigateTo({
						url:'/pages/users/refund/select?order_id='+this.orderId+'&type=1'+'&ids='+item.order_product_id
					})
				}
				// #endif
			}
		}
	}
</script>

<style scoped lang="scss">
	.goodWrapper{
		.title{
			padding: 0 32rpx;
			height: 86rpx;
			line-height: 86rpx;
		}
	}
	.right-btn-box{
		position: absolute;
		right: 0;
		bottom: 0;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		&.event_box{
			position: static;
		}
		.btn-item{
			display: flex;
			align-items: center;
			justify-content: center;
			width:140rpx;
			height:46rpx;
			margin-left: 20rpx;
			border:1px solid rgba(187,187,187,1);
			border-radius:23rpx;
			font-size: 24rpx;
			color: #282828;
			&.on{
				background:rgba(220,220,220,1);
				border-color: rgba(220,220,220,1);
			}
			&.err{
				background:rgba(247,247,247,1);
				border-color: rgba(247,247,247,1);
				color: #AAAAAA;
			}
		}
	}
	.event_bg{
		background: #FF7F00;
	}
	.event_color{
		color: #FF7F00;
	}
	.item-money{
		margin-top: 20rpx;
	}
	.moneys {
		margin-top: 0;
		color: var(--view-priceColor);
	}
	.btn-item{
		display: flex;
		align-items: center;
		justify-content: center;
		width:140rpx;
		height:46rpx;
		margin-left: 10rpx;
		border:1px solid rgba(187,187,187,1);
		border-radius:23rpx;
		font-size: 24rpx;
		color: #282828;
		&.on{
			background:rgba(220,220,220,1);
			border-color: rgba(220,220,220,1);
		}
		&.err{
			background:rgba(247,247,247,1);
			border-color: rgba(247,247,247,1);
			color: #AAAAAA;
		}
	}
</style>
