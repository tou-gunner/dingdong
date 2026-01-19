<template>
	<view class="orderGoods" :style="viewColor">
		<view class='goodWrapper' :class="'item'+orderData.order_type">
			<view
				v-if="orderData.order_type == 1 && orderData.is_virtual != 4"
				class="title acea-row row-between-wrapper bg-f"
				:class="{'h-86' : (evaluate != 0 && orderData.verify_time)}"
			>
				<!-- <view class="item-status" :class="'status'+evaluate">{{(evaluate == 0 || evaluate == 9) ? '待核销' : '已核销'}}</view> -->
				<view v-if="evaluate != 0 && orderData.verify_time" class="item-date">{{orderData.verify_time}}</view>
			</view>
			<view>
				<view v-for="(item,index) in cartInfo" :key="index">
					<block v-if="activityType === 2">
						<view class='item bg-f presell_item'>
							<view class="acea-row row-between-wrapper" @click="jumpCon(item)">
								<view class='pictrue'>
									<image :src='(item.cart_info.productAttr && item.cart_info.productAttr.image) || item.cart_info.product.image' ></image>
								</view>
								<view class='text'>
									<view class='acea-row row-between-wrapper'>
										<view class='name line1' style="width: 360rpx;"><text class="event_name event_bg">预售</text>{{item.cart_info.product.store_name}}</view>
										<view class='num'><text class="p-color">
										<priceFormat :price="item.cart_info.productPresellAttr.presell_price" weight intSize="28" floatSize="20" labelSize="20"></priceFormat>
										</text><br/>x {{item.product_num}}</view>
									</view>
									<view class='attr line1' v-if="item.cart_info.productAttr.sku" style="margin-top: 0;">{{item.cart_info.productAttr.sku}}</view>
									<view v-if="evaluate === 0 || evaluate === 10 || evaluate === 11" class="event_ship event_color">发货时间：
										<!--全款预售-->
										<text v-if="item.cart_info.productPresell.presell_type === 1">{{ item.cart_info.productPresell.delivery_type === 1 ? '支付成功后' : '预售结束后' }}{{ item.cart_info.productPresell.delivery_day }}天内</text>
										<!--定金预售-->
										<text v-if="item.cart_info.productPresell.presell_type === 2">{{ item.cart_info.productPresell.delivery_type === 1 ? '支付尾款后' : '预售结束后' }}{{ item.cart_info.productPresell.delivery_day }}天内</text>
									</view>
								</view>
							</view>
							<view class="right-btn-box event_box">
								<view class="btn-item" v-if="(item.refund_switch==1 && (item.is_refund ==0 && (evaluate != 10 && evaluate != 11) && orderData.refund_status || item.refund_num > 0)) && !orderData.cancel_status && orderData.order_type!=2" @click.stop="refund(item)">申请退款</view>
								<view class="btn-item err" v-if="item.is_refund ==1">退款中 x {{item.product_num - item.refund_num}}</view>
								<view class='btn-item err' v-if="item.is_refund >1">已退款 x {{item.product_num - item.refund_num}}</view>
								<view class='btn-item' v-if='item.is_reply==0 && evaluate==2 && item.is_refund==0' @click.stop="evaluateTap(item.order_product_id,orderId)">去评价</view>
								<view class='btn-item on' v-else-if="item.is_reply==1 && evaluate==2">已评价</view>
							</view>
						</view>
						<view v-if="orderData.status >= 10" class="event_progress bg-f mt20">
							<view class="progress_list">
								<view class="progress_name font-bold">阶段一： 买家已付款</view>
								<view class="progress_price">商品定金  <text class="align_right regular">¥{{ orderData.pay_price }}</text></view>
								<view class="progress_pay">定金实付款
									<view class="align_right t-color">
										<priceFormat :price="orderData.pay_price" weight intSize="28" floatSize="20" labelSize="20"></priceFormat>
									</view>
								</view>
							</view>
							<view class="progress_list">
								<view class="progress_name font-bold">阶段二：
									<text v-if="orderData.status == 10 && orderData.presellOrder.activeStatus == 0">未开始</text>
									<text v-if="orderData.status == 10 && orderData.presellOrder.activeStatus == 1">等待买家付尾款</text>
									<text v-if="orderData.status == 11 || orderData.presellOrder.activeStatus == 2">交易已关闭</text>
								</view>
								<view class="progress_price">商品尾款  <text class="align_right regular">¥{{ orderData.presellOrder.pay_price }}</text></view>
								<view class="progress_pay">尾款需付款
									<view class="align_right t-color">
										<priceFormat :price="orderData.presellOrder.pay_price" weight intSize="28" floatSize="20" labelSize="20"></priceFormat>
									</view>
								</view>
							</view>
						</view>
					</block>
					<view v-else class='item bg-f'>
						<view class="acea-row row-between-wrapper" @click="jumpCon(item)">
							<view class='pictrue'>
								<image :src='(item.cart_info.productAttr && item.cart_info.productAttr.image) || item.cart_info.product.image' ></image>
							</view>
							<view class='text'>
									<view class='acea-row row-between-wrapper'>
										<view class='name line1'><text v-if="item.product_type != 0 && item.product_type != 10" :class="'font_bg-red type'+item.product_type">{{item.product_type == 1 ? "秒杀" : item.product_type == 2 ? "预售" : item.product_type == 3 ? "助力" : item.product_type == 4 ? "拼团" : ""}}</text>{{item.cart_info.product.store_name}}</view>
										<view class='num'>x {{item.product_num}}</view>
									</view>
									<view class='attr line1' v-if="item.cart_info.productAttr.sku">{{item.cart_info.productAttr.sku}}</view>
									<view class='money p-color' v-if="item.cart_info.product_type ==3">
										<priceFormat :price="item.cart_info.productAssistAttr.assist_price" weight intSize="30" floatSize="22" labelSize="20"></priceFormat>
									</view>
									<view class='money p-color' v-else-if="item.cart_info.product_type ==4">
										<priceFormat :price="item.cart_info.activeSku.active_price" weight intSize="30" floatSize="22" labelSize="20"></priceFormat>
									</view>
									<view class='money acea-row row-middle' v-else>
										<view>
											<priceFormat :price="item.cart_info.productAttr.price" weight intSize="30" floatSize="22" labelSize="20"></priceFormat>
										</view>
										<image v-if="item.cart_info.productAttr.show_svip_price" class="svip-img" :src="`${domain}/static/images/svip.png`"></image>
									</view>
							</view>
						</view>
						<view class="right-btn-box">
							<view class="btn-item err" v-if="item.is_refund ==1">{{orderData.is_virtual == 4 ? '已取消' : '退款中'}} x {{item.product_num - item.refund_num}}</view>
							<view class='btn-item err' v-if="item.is_refund >1">{{orderData.is_virtual == 4 ? '已取消' : '已退款'}} x {{item.product_num - item.refund_num}}</view>
							<!-- <view class="btn-item" v-if="item.refund_switch==1 && (item.is_refund == 0 && evaluate != 9 && orderData.refund_status || item.refund_num > 0) && orderData.is_virtual!=4 && orderData.order_type!=2" @click.stop="refund(item)">申请退款</view> -->
							<view
								class="btn-item"
								v-if="!([-1,2,3].includes(orderData.status) || (orderData.status == 1 && orderData.order_type == 2))
								&& orderData.refund_status && orderData.refund_switch && !orderData.cancel_status
								&& (!(item.is_refund == 1 && item.refund_num == 0) && item.is_refund != 3)"
								@click.stop="refund(item)"
							>
								申请退款
							</view>
							<view class='btn-item' v-if='item.is_reply==0 && evaluate==2 && item.refund_num > 0' @click.stop="evaluateTap(item.order_product_id,orderId)">去评价</view>
							<view class='btn-item on' v-else-if="item.is_reply==1 && evaluate==2">已评价</view>
						</view>
					</view>
				</view>
				<view  v-if="orderData.merchant" class="goodCall" @click="goGoodCall">
					<text class="iconfont icon-ic_customerservice"></text><text style="font-size: 28rpx;">联系客服</text>
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
	import { goShopDetail } from '@/libs/order.js'
	import { initiateAssistApi } from '@/api/activity.js';
	import { mapGetters } from "vuex";
	import { HTTP_REQUEST_URL } from '@/config/app';
	import { getCustomer } from "@/utils";
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
		computed: mapGetters(['viewColor','uid']),
		data() {
			return {
				domain: HTTP_REQUEST_URL,
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
			jumpCon:function(item){
				if(item.product_type == 4)item.activity_id = item.cart_info && item.cart_info.activeSku.product_group_id
				if(item.product_type == 3)item.activity_id = item.cart_info && item.cart_info.productAssistAttr.product_assist_id
				goShopDetail(item).then(res => {
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
				})
			},
			// 退款
			refund(item){
				// #ifdef MP
				openOrderRefundSubscribe().then(() => {
					uni.hideLoading();
					if(this.evaluate == 0 || this.evaluate == 9 || this.orderData.is_virtual != 0){
						uni.navigateTo({
							url:'/pages/users/refund/confirm?order_id='+this.orderId+'&type=1'+'&ids='+item.order_product_id+'&refund_type=1&order_type='+this.orderData.order_type
						})
					}else{
						uni.navigateTo({
							url:'/pages/users/refund/select?order_id='+this.orderId+'&type=1&order_type='+this.orderData.order_type+'&ids='+item.order_product_id
						})
					}
				}).catch(() => {
					uni.hideLoading();
				})
				// #endif
				// #ifdef H5 || APP-PLUS
				if(this.evaluate == 0 || this.evaluate == 9 || this.orderData.is_virtual != 0){
					uni.navigateTo({
						url:'/pages/users/refund/confirm?order_id='+this.orderId+'&type=1'+'&ids='+item.order_product_id+'&refund_type=1&order_type='+this.orderData.order_type
					})
				}else{
					uni.navigateTo({
						url:'/pages/users/refund/select?order_id='+this.orderId+'&type=1&order_type='+this.orderData.order_type+'&ids='+item.order_product_id
					})
				}
				// #endif
			},
			// 联系客服
			goGoodCall() {
				let self = this
				let mer = self.orderData.merchant.services_type
				let data = {
					type: mer.services_type,
					service_phone: mer.service_phone,
					customer_url: mer.mer_customer_url,
					customer_corpId: mer.mer_customer_corpId,
					customer_link: mer.mer_customer_link
				}
				let url = `/pages/chat/customer_list/chat?mer_id=${self.orderData.mer_id}&uid=${this.uid}&order_id=${this.orderId}`
				getCustomer(data, url)
			},
			/**
			 * 拨打电话
			 */
			call: function() {
				let that = this
				if(that.orderData.merchant.service_phone){
					uni.showModal({
						title: '提示',
						content: '暂无在线客服，确定拨打客服电话:'+that.orderData.merchant.service_phone+'吗？',
						success: function(res) {
							if (res.confirm) {
								uni.makePhoneCall({
									phoneNumber: that.orderData.merchant.service_phone
								})
							}
						}
					})
				}else{
					return that.$util.Tips({
						title: '暂无可用客服'
					})
				}
			},
		}
	}
</script>

<style scoped lang="scss">
	.p-color {
		color: var(--view-priceColor);
	}
	.t-color{
		color: var(--view-theme);
	}
	.svip-img{
		width: 65rpx;
		height: 28rpx;
		margin: 4rpx 0 0 4rpx;
	}
	.title{
		height: 20rpx;
		position: relative;
		padding: 0 30rpx;
		border-radius: 24rpx 24rpx 0 0;
		.item-status{
			color: #999999;
			font-size: 30rpx;
			&.status0{
				color: #2291F8;
			}
		}
		.item-date{
			color: #666666;
			font-size: 28rpx;
		}
	}
	.h-86 {
		height: 86rpx;
	}
	.right-btn-box{
		display: flex;
		align-items: center;
		justify-content: flex-end;
		&.event_box{
			position: static;
		}
		.btn-item{
			line-height: 52rpx;
			padding: 0 22rpx;
			margin-left: 10rpx;
			border:1px solid #DDDDDD;
			border-radius:50rpx;
			font-size: 22rpx;
			color: #666666;
			&.on{
				background:rgba(220,220,220,1);
				border-color: rgba(220,220,220,1);
			}
			&.err{
				background-color: #DDDDDD;
			}
		}
	}
	.event_progress {
		border-radius: 24rpx 24rpx 0 0;
	}
	.event_bg{
		background: #FF7F00;
	}
	.event_color{
		color: #FF7F00;
	}
	.goodWrapper .item-count {
		border-radius: 0 0 24rpx 24rpx;
	}
	.presell_item{
		height: auto;
		padding-bottom: 15rpx;
	}
	.event_progress{
		margin-top: 20rpx;
		padding-top: 30rpx;
		.progress_name {
			padding-left: 30rpx;
			height: 60rpx;
			line-height: 60rpx;
			font-size: 24rpx;
			position: relative;
			color: var(--view-theme);
			&::before{
				content: "";
				display: inline-block;
				width: 5rpx;
				height: 34rpx;
				background: var(--view-theme);
				position: absolute;
				top: 15rpx;
				left: 0;
			}
		}
		.align_right{
			float: right;
			font-weight: bold;
		}
		.progress_price{
			padding: 20rpx 30rpx;
			color: #999999;
			font-size: 22rpx;
		}
		.progress_pay{
			padding: 23rpx 30rpx;
			background: var(--view-minorColor);
			font-size: 26rpx;
			color: #282828;
		}
	}
	.event_name{
		display: inline-block;
		margin-right: 9rpx;
		color: #fff;
		font-size: 20rpx;
		padding: 0 8rpx;
		line-height: 30rpx;
		text-align: center;
		border-radius: 6rpx;
	}
	.event_ship{
		font-size: 20rpx;
		margin-top: 20rpx;
	}
	.goodCall {
		text-align: center;
		width: 100%;
		height: 86rpx;
		padding: 0 30rpx;
		font-size: 30rpx;
		line-height: 86rpx;
		color: #282828;
		background: #fff;
		border-radius: 0 0 24rpx 24rpx;
		.iconfont {
			font-size: 28rpx;
			margin-right: 15rpx;
		}
	}
</style>
