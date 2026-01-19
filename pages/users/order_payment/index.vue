<template>
	<view class="order_pay" :style="viewColor">
		<view class="order_count">
			<view class="pay_price acea-row row-center-wrapper">
				<priceFormat :price="payPrice" weight intSize="52" floatSize="40" labelSize="40"></priceFormat>
			</view>
			<view class="pay_time">
				<countDown
					:tipText="'支付剩余时间'"
					:dayText="' '"
					:hourText="' : '"
					:minuteText="' : '"
					:secondText="' '"
					:datatime="invalidTime"
					:isView="false"
					:isBold="true"
					:colorTheme="true"
					:isDay="false"
				></countDown>
			</view>
		</view>
		<view class="payment boder-24 bg-f">
			<radio-group @change="changeType">
				<label class="item acea-row row-between-wrapper" v-for="(item, index) in payMode" v-if="item.payStatus == 1" :key="index">
					<view class="left acea-row row-between-wrapper">
						<view class="icon acea-row row-center row-middle" :class="'icons-' + item.icon">
							<view class="iconfont" :class="item.icon"></view>
						</view>
						<view class="text">
							<view class="name">{{ item.name }}</view>
							<view class="info">{{ item.title }} {{ item.value === 'balance' ? item.number : '' }}</view>
						</view>
					</view>
					<radio :value="item.value" :checked="pay_type == item.value" />
				</label>
			</radio-group>
			<view class="btn">
				<view class="button acea-row row-center-wrapper" @click="goPay()">确认支付</view>
				<view class="wait-pay" @click="waitPay">暂不支付</view>
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
let app = getApp();
import { mapGetters } from 'vuex';
import { configMap } from '@/utils';
import countDown from '@/components/countDown';
import { orderPay, integralOrderPay, getCashierOrder, getOrderPayTypeList } from '@/api/order.js';
export default {
	components: {
		countDown
	},
	data() {
		return {
			invalidTime: 0,
			order_id: '',
			payPrice: '',
			order_type: '',
			pay_type: '',
			number: 0,
			payMode: this.orderPayList
		};
	},
	computed: {
		...mapGetters(['isLogin', 'viewColor', 'orderPayList']),
		...configMap(['hide_mer_status']),
	},
	watch: {
		orderPayList:{
			handler(nVal,oVal){
				if(nVal && this.order_id){
					this.payMode= nVal;
					this.getOrderConfig()
				}
			},
			immediate: true,
			deep:true
		}
	},
	onLoad(options) {
		this.order_id = options.order_id;
		this.getPayList()

	},
	methods: {
		close: function () {
			this.$emit('onChangeFun', {
				action: 'payClose'
			});
		},
		changeType: function (e) {
			this.pay_type = e.detail.value;
		},
		getPayList() {
			this.$util.getPayTypeList(this.order_id,0)
		},
		getOrderConfig() {
			uni.showLoading({
				title: '创建订单中'
			});
			getCashierOrder(this.order_id)
				.then((res) => {
					let obj = this.payMode.find(item => item.payStatus && item.payStatus !=0);
					this.pay_type = obj.value;
					this.payPrice = res.data.pay_price;
					this.payPostage = res.data.pay_postage;
					this.order_type = res.data.activity_type;
					if(app.globalData.offline_switch == 0)this.payMode=this.payMode.slice(0, -1);
					this.invalidTime = res.data.invalid_time;
					this.number = Number(res.data.now_money) || 0;
					uni.hideLoading();
				})
				.catch((err) => {
					uni.hideLoading();
					// return this.$util.Tips({
					// 	title: err
					// }, {
					// 	tab: 3,
					// 	url: 1
					// });
				});
		},
		waitPay(){
			if(this.order_type == 20){
				uni.reLaunch({
					url: '/pages/points_mall/exchange_record?delte=1'
				})
			}else{
				uni.reLaunch({
					url: '/pages/users/order_list/index?status=0'
				})
			}
		},
		goPay() {
			let that = this;
			let type = '';
			let paytype = this.pay_type;
			if (paytype == 'weixin') {
				// #ifdef H5
				type = this.$wechat.isWeixin() ? 'weixin' : 'h5';
				// #endif
				// #ifdef APP-PLUS
				type = 'weixin';
				// #endif
				// #ifdef MP
				type = 'routine';
				// #endif
			} else if (paytype == 'balance') {
				type = 'balance';
			} else if (paytype == 'alipay') {
				// #ifndef MP
				type = 'alipay';
				// #endif
				// #ifdef MP
				type = 'alipayQr';
				// #endif
			} else if (paytype == 'offline') {
				type = 'offline';
			}
			if (!that.order_id)
				return that.$util.Tips({
					title: '请选择要支付的订单'
				});
			if (paytype == 'balance' && parseFloat(this.number) < parseFloat(that.payPrice))
				return that.$util.Tips({
					title: '余额不足！'
				});
			uni.showLoading({
				title: '支付中'
			});
			let orderApi = that.order_type === 20 ? integralOrderPay : orderPay;
			orderApi(that.order_id, {
				type: type,
				// #ifdef H5
				return_url: 'http://' + window.location.host + '/pages/users/order_list/index'
				// #endif
			})
				.then((res) => {
					let status = res.data.status,
						orderId = res.data.result.order_id,
						jsConfig = res.data.result.config,
						callback_key = res.data.result.pay_key,
						goPages = '/pages/order_pay_status/index?order_id=' + orderId + '&msg=' + res.message;
					switch (status) {
						case 'ORDER_EXIST':
						case 'EXTEND_ORDER':
						case 'PAY_ERROR':
						case 'error':
							uni.hideLoading();
							this.$emit('onChangeFun', {
								action: 'payClose'
							});
							return that.$util.Tips({
								title: res.message
							});
							break;
						case 'success':
							uni.hideLoading();
							this.$emit('onChangeFun', {
								action: 'payClose'
							});
							let jumpType = type == 'offline' ? '&status=0' : '&status=1';
							return that.$util.Tips(
								{
									title: type == 'offline' ? '订单创建成功' : '支付成功',
									icon: 'success'
								},
								{
									tab: 5,
									url: goPages + jumpType
								}
							);
							break;
						case 'alipay':
						case 'alipayQr':
							uni.hideLoading();
							this.$emit('onChangeFun', {
								action: 'payClose'
							});
							uni.navigateTo({
								url: '/pages/order_pay_back/index?keyCode=' + callback_key + '&url=' + jsConfig
							});
							return;
							break;
						// #ifndef MP
						case 'wechat':
						case 'weixin':
						case 'weixinApp':
							jsConfig.timeStamp = jsConfig.timestamp;
							// #ifndef APP-PLUS
							that.$wechat
								.pay(jsConfig)
								.then((res) => {
									console.log('测试支付数据无效的success：' + res.data);
									this.$emit('onChangeFun', {
										action: 'payClose'
									});
									uni.hideLoading();
									return that.$util.Tips(
										{
											title: '支付成功',
											icon: 'success'
										},
										{
											tab: 5,
											url: goPages + 'status=1'
										}
									);
								})
								.catch((res) => {
									console.log('测试支付数据无效的catch：' + res.data);
									if (res.errMsg == 'chooseWXPay:cancel') {
										return that.$util.Tips(
											{
												title: '取消支付'
											},
											{
												tab: 5,
												url: goPages + '?status=0'
											}
										);
									}
								});
							// #endif
							// #ifdef APP-PLUS
							let mp_pay_name = '';
							if (uni.requestOrderPayment) {
								mp_pay_name = 'requestOrderPayment';
							} else {
								mp_pay_name = 'requestPayment';
							}
							uni[mp_pay_name]({
								provider: 'wxpay',
								orderInfo: jsConfig,
								success: (e) => {
									this.$emit('onChangeFun', {
										action: 'payClose'
									});
									return that.$util.Tips(
										{
											title: '支付成功',
											icon: 'success'
										},
										{
											tab: 5,
											url: goPages + 'status=1'
										}
									);
								},
								fail: (e) => {
									return that.$util.Tips(
										{
											title: '取消支付'
										},
										{
											tab: 5,
											url: goPages + '?status=0'
										}
									);
								},
								complete: () => {
									uni.hideLoading();
								}
							});
							// #endif
							break;
						// #endif
						// #ifdef MP
						case 'routine':
							jsConfig.timeStamp = jsConfig.timestamp;
							that.toPay = true;
							let mp_pay_name = '';
							if (uni.requestOrderPayment) {
								mp_pay_name = 'requestOrderPayment';
							} else {
								mp_pay_name = 'requestPayment';
							}
							uni[mp_pay_name]({
								...jsConfig,
								success: function (res) {
									uni.hideLoading();
									that.$emit('onChangeFun', {
										action: 'payClose'
									});
									if (that.BargainId || that.combinationId || that.pinkId || that.seckillId)
										return that.$util.Tips(
											{
												title: '支付成功',
												icon: 'success'
											},
											{
												tab: 5,
												url: goPages + '?status=1'
											}
										);

									return that.$util.Tips(
										{
											title: '支付成功',
											icon: 'success'
										},
										{
											tab: 5,
											url: goPages + '?status=1'
										}
									);
								},
								fail: function (e) {
									uni.hideLoading();
									that.$emit('onChangeFun', {
										action: 'payClose'
									});
									return that.$util.Tips({
										title: '取消支付'
									});
								},
								complete: function (e) {
									uni.hideLoading();
									//关闭当前页面跳转至订单状态
									if (res.errMsg == 'requestPayment:cancel')
										return that.$util.Tips({
											title: '取消支付'
										});
									that.$emit('onChangeFun', {
										action: 'payClose'
									});
								}
							});
							break;
						// #endif
						case 'balance':
							uni.hideLoading();
							that.$emit('onChangeFun', {
								action: 'payClose'
							});
							//余额不足
							return that.$util.Tips({
								title: res.message
							});
							break;
						// #ifdef H5
						case 'h5':
							let host = window.location.protocol + '//' + window.location.host;
							let url = `${host}/pages/order_pay_status/index?order_id=${orderId}`;
							let eUrl = encodeURIComponent(url);
							let jsurl = jsConfig.mweb_url || jsConfig.h5_url;
							let locations = `${jsurl}&redirect_url=${eUrl}`;
							setTimeout(() => {
								location.href = locations;
							}, 100);
							break;
						// #endif

						// #ifdef APP-PLUS
						case 'alipayApp':
							uni.requestPayment({
								provider: 'alipay',
								orderInfo: jsConfig,
								success: (e) => {
									that.$emit('onChangeFun', {
										action: 'payClose'
									});
									return that.$util.Tips(
										{
											title: '支付成功',
											icon: 'success'
										},
										{
											tab: 5,
											url: goPages + 'status=1'
										}
									);
								},
								fail: (e) => {
									return that.$util.Tips({
										title: '取消支付'
									});
								},
								complete: () => {
									uni.hideLoading();
								}
							});
							break;
						// #endif
					}
				})
				.catch((err) => {
					uni.hideLoading();
					return that.$util.Tips({
						title: err
					});
				});
		}
	}
};
</script>

<style scoped lang="scss">
.order_pay {
	padding: 88rpx 20rpx 0;
}
.payment {
	margin-top: 80rpx;
}
.pay_price {
	text-align: center;
	font-weight: bold;
}
.pay_time {
	margin-top: 28rpx;
}
.payment .item {
	height: 130rpx;
	padding: 0 30rpx;
}
.payment .item .left {
	width: 580rpx;
}
.payment .item .left .text {
	width: 500rpx;
}
.payment .item .left .text .name {
	font-size: 28rpx;
	color: #282828;
}
.payment .item .left .text .info {
	font-size: 22rpx;
	color: #999;
}
.payment .item .left .text .info .money {
	color: #ff9900;
}
::v-deep radio .uni-radio-input.uni-radio-input-checked,
::v-deep radio .wx-radio-input.wx-radio-input-checked {
	border: 1px solid var(--view-theme) !important;
	background-color: var(--view-theme) !important;
}

.btn {
	position: fixed;
	left: 30rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	bottom: 30rpx;
	bottom: calc(30rpx + constant(safe-area-inset-bottom)); ///兼容 IOS<11.2/
	bottom: calc(30rpx + env(safe-area-inset-bottom)); ///兼容 IOS>11.2/
}

.wait-pay {
	color: #aaa;
	font-size: 24rpx;
	padding-top: 20rpx;
}

.button {
	width: 690rpx;
	height: 90rpx;
	border-radius: 45rpx;
	color: #ffffff;
	background-color: var(--view-theme);
}
</style>
