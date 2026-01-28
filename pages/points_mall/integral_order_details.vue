<template>
	<view :style="viewColor">
		<view class='order-details'>
			<view class="header-count">
				<view class='header acea-row row-middle'>
					<view class='pictrue'>
						<image v-if="orderInfo.paid == 0" :src="domain+'/static/order_2.gif'"></image>
						<image v-else :src="domain+'/static/order_'+(orderInfo.status+1)+'.gif'"></image>
					</view>
					<view v-if="orderInfo.status == 0 && orderInfo.paid == 0" class='data'>
						<view class='state'>ກະລຸນາຊຳລະກ່ອນ{{orderInfo.cancel_time}}!</view>
						<view>{{orderInfo.add_time_y}}<text class='time'>{{orderInfo.create_time}}</text></view>
					</view>
					<view v-else class='data'>
						<view class='state'>
							<block v-if="orderInfo.status == 0  && orderInfo.paid == 1">ລໍຖ້າສົ່ງ</block>
							<block v-if="orderInfo.status == 1">ລໍຖ້າຮັບ</block>
							<block v-if="orderInfo.status == 3">ສຳເລັດແລ້ວ</block>
						</view>
						<view>{{orderInfo.pay_time}}</view>
					</view>
				</view>
			</view>
			<view class="pad20 order-count">
				<view class="bg-f boder-24">
					<view class='address'>
						<view class='name'>{{orderInfo.real_name}}<text class='phone'>{{orderInfo.user_phone}}</text></view>
						<view>{{orderInfo.user_address}}</view>
					</view>
					<view class='line'>
						<image :src="`${domain}/static/images/line.jpg`"></image>
					</view>
				</view>
				<view class="orderGoods bg-f mt20 boder-24" :class="orderInfo.product_type == 0?'':'on'">
					<view class='total'>ລວມ {{orderInfo.total_num}} ລາຍການ</view>
					<view class='goodWrapper'>
						<view class='item acea-row row-between-wrapper' v-for="(item, index) in orderInfo.orderProduct" @click="jumpCon(item)" :key="index">
							<view class='pictrue'>
								<image v-if="item.cart_info" :src='(item.cart_info.productArr && item.cart_info.productArr.image) || item.cart_info.product.image'></image>
							</view>
							<view class='text'>
								<view class='acea-row row-between-wrapper'>
									<view class='name line1'>{{item.cart_info.product.store_name}}</view>
									<view class='num'>x {{item.product_num}}</view>
								</view>
								<view class='attr line1'>{{item.cart_info.productAttr.sku || 'ຄ່າເລີ່ມຕົ້ນ'}}</view>
								<view class='money'>
									{{item.integral}}ຄະແນນ <text v-if="item.product_price > 0">+{{item.product_price}}ກີບ</text>
								</view>
							</view>
						</view>
					</view>
				</view>
				<!-- 送货 -->
				<view class="wrapper bg-f mt20 boder-24" v-if="orderInfo.delivery_type == 2">
					<view class='item acea-row row-between'>
<view>ວິທີຈັດສົ່ງ：</view>
					<view class='conter'>ສົ່ງສິນຄ້າ</view>
					</view>
					<view class='item acea-row row-between'>
						<view>ຜູ້ຈັດສົ່ງ：</view>
						<view class='conter'>{{orderInfo.delivery_name}}</view>
					</view>
					<view class='item acea-row row-between'>
						<view>ເບີໂທຕິດຕໍ່：</view>
						<view class='conter'>{{orderInfo.delivery_id}}</view>
					</view>
				</view>
				<view class='wrapper bg-f mt20 boder-24'>
					<view class='item acea-row row-between'>
						<view>ເລກຄຳສັ່ງ：</view>
						<view class='conter acea-row row-middle row-right'>{{orderInfo.order_sn}}
							<!-- #ifndef H5 -->
							<text class='copy' @tap='copy'>ສຳເນົາ</text>
							<!-- #endif -->
							<!-- #ifdef H5 -->
							<text class='copy copy-data' :data-clipboard-text="orderInfo.order_sn">ສຳເນົາ</text>
							<!-- #endif -->
						</view>
					</view>
					<view class='item acea-row row-between'>
						<view>ເວລາສັ່ງ：</view>
						<view class='conter'>{{orderInfo.create_time}}</view>
					</view>
					<view class='item acea-row row-between'>
<view>ສະຖານະຊຳລະ：</view>
					<view class='conter'>{{orderInfo.paid == 1 ? 'ຊຳລະແລ້ວ' : 'ຍັງບໍ່ຊຳລະ'}}</view>
					</view>
					<view class='item acea-row row-between'>
<view>ຄະແນນຊຳລະ：</view>
					<view class='conter'>{{orderInfo.integral}}ຄະແນນ</view>
					</view>
					<view class='item acea-row row-between'>
						<view>ຈຳນວນເງິນຊຳລະ：</view>
						<view class='conter'>₭{{orderInfo.pay_price}}</view>
					</view>
					<view class='item acea-row row-between'>
						<view>ໝາຍເຫດ：</view>
						<view class='conter'>{{orderInfo.mark}}</view>
					</view>
					<view class='item acea-row row-between' v-if="orderInfo.delivery_type === 'express'">
						<view>ເລກພັດສະດຸ：</view>
						<view class='conter'>{{orderInfo.delivery_id}}</view>
					</view>
					<view class='item acea-row row-between' v-if="orderInfo.delivery_type === 'express'">
						<view>ບໍລິສັດຂົນສົ່ງ：</view>
						<view class='conter'>{{orderInfo.delivery_name}}</view>
					</view>
					<view class='item acea-row row-between' v-if="orderInfo.delivery_type === 'send'">
						<view>ເບີໂທຜູ້ສົ່ງ：</view>
						<view class='conter'>{{orderInfo.delivery_id}}</view>
					</view>
					<view class='item acea-row row-between' v-if="orderInfo.delivery_type === 'send'">
						<view>ຊື່ຜູ້ສົ່ງ：</view>
						<view class='conter'>{{orderInfo.delivery_name}}</view>
					</view>
				</view>
				<view style='height:120rpx;'></view>
				<view v-if="orderInfo.status==1 || orderInfo.status==3" class='footer acea-row row-right row-middle'>
					<navigator class='bnt cancel' hover-class='none'
						v-if="orderInfo.status==1 && orderInfo.delivery_id && orderInfo.delivery_type == 1"
						:url="'/pages/users/goods_logistics/index?orderId='+ orderInfo.order_id">ເບິ່ງການຂົນສົ່ງ
					</navigator>
					<view v-if="orderInfo.status == 3 && orderInfo.paid == 1" class="bnt cancel" @click="delOrder(orderInfo.order_id)">ລຶບ</view>
					<view class='bnt bg-colort' v-if="orderInfo.status==1 && orderInfo.paid==1" @click='confirmOrder'>ຢືນຢັນຮັບສິນຄ້າ</view>
				</view>
				<view v-else-if="orderInfo.status==0 && orderInfo.paid==0" class='footer acea-row row-right row-middle'>
					<view class='bnt bg-colort' @click='pay_open()'>ຊຳລະດຽວນີ້</view>
				</view>
			</view>
		</view>
		<payment :payMode='payMode' :pay_close="pay_close" :returnUrl="'/pages/points_mall/integral_order_details?order_id='+order_id" @onChangeFun='onChangeFun' :order_id="pay_order_id" :totalPrice='totalPrice'></payment>
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
	let app = getApp();
	import { integralOrderDetail, integralOrderDelete, integralOrderTake } from '@/api/points_mall.js';
	import { openOrderRefundSubscribe } from '@/utils/SubscribeMessage.js';
	import { HTTP_REQUEST_URL } from '@/config/app';
	import orderGoods from "@/components/orderGoods";
	import ClipboardJS from "@/plugin/clipboard/clipboard.js";
	import payment from '@/components/payment';
	import { configMap } from "@/utils";
	import { toLogin } from '@/libs/login.js';
	import { mapGetters } from "vuex";
	export default {
		components: {
			orderGoods,
			payment
		},
		data() {
			return {
				order_id: '',
				evaluate: 0,
				orderInfo: {}, //订单详情
				isGoodsReturn: false, //是否为退款订单
				status: {}, //订单底部按钮状态
				isClose: false,
				payMode: [],
				pay_close: false,
				pay_order_id: '',
				totalPrice: '0',
				routineContact: '0',
				domain: HTTP_REQUEST_URL,
			};
		},
		watch: {
			orderPayList:{
				handler(nVal,oVal){
					if(nVal){
						this.payMode = nVal.filter(item => item.value !== 'offline');
					}
				},
				immediate: true,
				deep:true
			}
		},
		computed: {
			...mapGetters(['isLogin','viewColor','orderPayList'])
		},
		onLoad: function(options) {
			if (options.order_id) {
				this.$set(this, 'order_id', options.order_id);
			}
		},
		onShow() {
			uni.removeStorageSync('form_type_cart');
			if (this.isLogin) {
				this.getOrderInfo();
			} else {
				toLogin();
			}
		},
		onHide: function() {
			this.isClose = true;
		},
		onReady: function() {
			// #ifdef H5
			this.$nextTick(function() {
				const clipboard = new ClipboardJS(".copy-data");
				clipboard.on("success", () => {
					this.$util.Tips({
						title: 'ສຳເນົາສຳເລັດ'
					});
				});
			});
			// #endif
		},
		methods: {
			openSubcribe: function(e) {
				let page = e;
				uni.showLoading({
					title: 'ກຳລັງໂຫຼດ',
				})
				openOrderRefundSubscribe().then(res => {
					uni.hideLoading();
					uni.navigateTo({
						url: page,
					});
				}).catch(() => {
					uni.hideLoading();
				});
			},
			/**
			 * 关闭支付组件
			 *
			 */
			payClose: function() {
				this.pay_close = false;
			},
			/**
			 * 打开支付组件
			 *
			 */
			pay_open: function() {
				this.pay_close = true;
				this.pay_order_id = this.orderInfo.group_order_id.toString();
				this.totalPrice = this.orderInfo.pay_price;
				this.$util.getPayTypeList(this.pay_order_id,0)
			},
			/**
			 * 支付成功回调
			 *
			 */
			pay_complete: function() {
				this.pay_close = false;
				this.pay_order_id = '';
				uni.redirectTo({
					url:'/pages/users/order_list/index?status=1'
				})
			},
			/**
			 * 支付失败回调
			 *
			 */
			pay_fail: function() {
				this.pay_close = false;
				this.pay_order_id = '';
			},
			/**
			 * 事件回调
			 *
			 */
			onChangeFun: function(e) {
				let opt = e;
				let action = opt.action || null;
				let value = opt.value != undefined ? opt.value : null;
				(action && this[action]) && this[action](value);
			},
			/**
			 * 获取订单详细信息
			 *
			 */
			getOrderInfo: function() {
				let that = this;
				uni.showLoading({
					title: "ກຳລັງໂຫຼດ"
				});
				integralOrderDetail(this.order_id).then(res => {
					uni.hideLoading();
					that.$set(that, 'orderInfo', res.data);
					that.orderInfo.status = res.data.status==2 ? 3 : res.data.status
				}).catch(err => {
					uni.hideLoading();
					that.$util.Tips({
						title: err
					}, '/pages/points_mall/exchange_record');
				});
			},
			/**
			 *
			 * 剪切订单号
			 */
			// #ifndef H5
			copy: function() {
				let that = this;
				uni.setClipboardData({
					data: that.orderInfo.order_sn,
					success: function(res){
					}

				});
			},
			// #endif
			/**
			 * 去商品详情
			 */
			jumpCon: function(item) {
				uni.navigateTo({
					url: '/pages/points_mall/integral_goods_details?id=' + item.cart_info.product.product_id
				})
			},
			confirmOrder: function() {
				let that = this;
				uni.showModal({
					title: 'ຢືນຢັນຮັບສິນຄ້າ',
					content: 'ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການຢືນຢັນຮັບສິນຄ້າ?',
					success: function(res) {
						if (res.confirm) {
							integralOrderTake(that.order_id
							).then(res => {
								return that.$util.Tips({
									title: 'ດຳເນີນການສຳເລັດ',
									icon: 'success'
								}, function() {
									that.getOrderInfo();
								});
							}).catch(err => {
								return that.$util.Tips({
									title: err
								});
							})
						}
					}
				})
			},
			/**
			 * 删除订单
			 */
			delOrder: function(order_id) {
				let that = this;
				uni.showModal({
					title: 'ແຈ້ງເຕືອນ',
					content: 'ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລຶບບັນທຶກນີ້?',
					success: function (res) {
						if (res.confirm) {
							integralOrderDelete(order_id).then(res=>{
								return that.$util.Tips({
									title: 'ລຶບສຳເລັດ',
									icon: 'success'
								}, {
									tab: 3,
									url: 1
								});
							}).catch(err => {
								return that.$util.Tips({
									title: err
								});
							})
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},

		}
	}
</script>

<style scoped lang="scss">
	.header-count {
		height: 260rpx;
		background-image: linear-gradient(90deg, var(--view-bntColor21) 0%,var(--view-bntColor22) 100%);
	}
	.order-details .header {
		padding: 0 30rpx;
	}
	.order-details .header .pictrue {
		width: 110rpx;
		height: 110rpx;
	}
	.order-details .header .pictrue image {
		width: 100%;
		height: 100%;
	}
	.order-details .header .data {
		color: rgba(255, 255, 255, 0.8);
		font-size: 24rpx;
		margin-left: 27rpx;
	}
	.order-details .header .data .state {
		font-size: 30rpx;
		font-weight: bold;
		color: #fff;
		margin-bottom: 12rpx;
	}
	.order-count {
		margin-top: -90rpx;
	}
	.qs-btn {
		width: auto;
		height: 60rpx;
		text-align: center;
		line-height: 60rpx;
		border-radius: 50rpx;
		color: #fff;
		font-size: 27rpx;
		padding: 0 3%;
		color: #aaa;
		border: 1px solid #ddd;
		margin-right: 20rpx;
	}
	.goodCall {
		color: #e93323;
		text-align: center;
		width: 100%;
		height: 86rpx;
		padding: 0 30rpx;
		border-bottom: 1rpx solid #eee;
		font-size: 30rpx;
		line-height: 86rpx;
		background: #fff;
		/* #ifdef MP */
		button {
			display: flex;
			align-items: center;
			justify-content: center;
			height: 86rpx;
			font-size: 30rpx;
			color: #e93323;
		}
		/* #endif */
	}
	.order-details .header {
		padding: 0 30rpx;
		height: 150rpx;
	}
	.order-details .header.on {
		background-color: #666 !important;
	}
	.order-details .header .pictrue {
		width: 110rpx;
		height: 110rpx;
	}
	.order-details .header .pictrue image {
		width: 100%;
		height: 100%;
	}
	.order-details .header .data {
		color: rgba(255, 255, 255, 0.8);
		font-size: 24rpx;
		margin-left: 27rpx;
	}
	.order-details .header .data.on {
		margin-left: 0;
	}
	.order-details .header .data .state {
		font-size: 30rpx;
		font-weight: bold;
		color: #fff;
		margin-bottom: 7rpx;
	}
	.order-details .header .data .time {
		margin-left: 20rpx;
	}
	.order-details .address {
		font-size: 26rpx;
		color: #999;
		padding: 35rpx 30rpx;
	}
	.order-details .address .name {
		font-size: 30rpx;
		color: #282828;
		margin-bottom: 15rpx;
	}
	.order-details .address .name .phone {
		margin-left: 40rpx;
	}
	.order-details .line {
		width: 100%;
		height: 3rpx;
		width: 670rpx;
		margin-left: 15rpx;
	}
	.order-details .line image {
		width: 100%;
		height: 100%;
		display: block;
	}
	.order-details .wrapper {
		padding: 30rpx;
	}
	.order-details .wrapper .item {
		font-size: 28rpx;
		color: #282828;
	}
	.order-details .wrapper .item~.item {
		margin-top: 30rpx;
	}
	.order-details .wrapper .item .conter {
		color: #999;
		width: 460rpx;
		text-align: right;
	}
	.order-details .wrapper .actualPay {
		border-top: 1rpx solid #eee;
		margin-top: 30rpx;
		padding-top: 30rpx;
	}
	.order-details .wrapper .actualPay .money {
		font-weight: bold;
		font-size: 30rpx;
	}
	.order-details .footer {
		width: 100%;
		height: 100rpx;
		position: fixed;
		bottom: 0;
		left: 0;
		background-color: #fff;
		padding: 0 30rpx;
		box-sizing: border-box;
	}
	.order-details .footer .bnt {
		width: 150rpx;
		height: 60rpx;
		text-align: center;
		line-height: 60rpx;
		border-radius: 50rpx;
		color: #fff;
		font-size: 27rpx;
	}
	.order-details .footer .bnt.cancel {
		color: #aaa;
		border: 1rpx solid #ddd;
	}
	.order-details .footer .bnt~.bnt {
		margin-left: 18rpx;
	}
	.order-details .footer .bg-colort {
		background-color: var(--view-theme);
	}
	.order-details .writeOff {
		background-color: #fff;
		margin-top: 13rpx;
		padding-bottom: 30rpx;
	}
	.order-details .writeOff .title {
		font-size: 30rpx;
		color: #282828;
		height: 87rpx;
		border-bottom: 1px solid #f0f0f0;
		padding: 0 30rpx;
		line-height: 87rpx;
	}
	.order-details .writeOff .grayBg {
		background-color: #f2f5f7;
		width: 590rpx;
		height: 384rpx;
		border-radius: 20rpx 20rpx 0 0;
		margin: 50rpx auto 0 auto;
		padding-top: 55rpx;
		position: relative;
	}
	.order-details .writeOff .grayBg .written {
		position: absolute;
		top: 0;
		right: 0;
		width: 60rpx;
		height: 60rpx;
	}
	.order-details .writeOff .grayBg .written image {
		width: 100%;
		height: 100%;
	}
	.order-details .writeOff .grayBg .pictrue {
		width: 290rpx;
		height: 290rpx;
		margin: 0 auto;
	}
	.order-details .writeOff .grayBg .pictrue image {
		width: 100%;
		height: 100%;
		display: block;
	}
	.order-details .writeOff .gear {
		width: 590rpx;
		height: 30rpx;
		margin: 0 auto;
	}
	.order-details .writeOff .gear image {
		width: 100%;
		height: 100%;
		display: block;
	}
	.order-details .writeOff .num {
		background-color: #f0c34c;
		width: 590rpx;
		height: 84rpx;
		color: #282828;
		font-size: 48rpx;
		margin: 0 auto;
		border-radius: 0 0 20rpx 20rpx;
		text-align: center;
		padding-top: 4rpx;
	}
	.order-details .writeOff .rules {
		margin: 46rpx 30rpx 0 30rpx;
		border-top: 1px solid #f0f0f0;
		padding-top: 10rpx;
	}
	.order-details .writeOff .rules .item {
		margin-top: 20rpx;
	}
	.order-details .writeOff .rules .item .rulesTitle {
		font-size: 28rpx;
		color: #282828;
	}
	.order-details .writeOff .rules .item .rulesTitle .iconfont {
		font-size: 30rpx;
		color: #333;
		margin-right: 8rpx;
		margin-top: 5rpx;
	}
	.order-details .writeOff .rules .item .info {
		font-size: 28rpx;
		color: #999;
		margin-top: 7rpx;
	}
	.order-details .writeOff .rules .item .info .time {
		margin-left: 20rpx;
	}
	.order-details .map {
		height: 86rpx;
		font-size: 30rpx;
		color: #282828;
		line-height: 86rpx;
		border-bottom: 1px solid #f0f0f0;
		margin-top: 13rpx;
		background-color: #fff;
		padding: 0 30rpx;
	}
	.order-details .address .name .iconfont {
		font-size: 34rpx;
		margin-left: 10rpx;
	}

	.orderGoods .total {
		width: 100%;
		height: 86rpx;
		padding: 0 30rpx;
		border-bottom: 2rpx solid #f0f0f0;
		font-size: 30rpx;
		color: #282828;
		line-height: 86rpx;
		box-sizing: border-box;
	}
	.goodWrapper .item .text .money{
		color: var(--view-theme);
	}
</style>
