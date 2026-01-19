<template>
	<view>
		<view class="payment popup-main bg-f" :class="pay_close ? 'on' : ''">
			<view class="title acea-row row-center-wrapper font-500">
				ເລືອກວິທີຊຳລະເງິນ
				<text class="iconfont icon-ic_close popup-close" @click="close"></text>
			</view>
			<view class="item acea-row row-between-wrapper" @click='goPay(item.number || 0 , item.value)' v-for="(item,index) in payMode" v-if="item.payStatus==1 || item.payStatus==true"
			 :key="index">
				<view class="left acea-row row-between-wrapper">
					<view class="icon acea-row row-center row-middle" :class="'icons-'+item.icon">
						<text class="iconfont" :class="item.icon"></text>
					</view>
					<view class="text">
						<view class="name">{{item.name}}</view>
						<view class="info" v-if="item.number">
							{{item.title}} <span class="money">¥{{ item.number }}</span>
						</view>
						<view class="info" v-else>{{item.title}}</view>
					</view>
				</view>
				<view class="iconfont icon-ic_rightarrow"></view>
			</view>
		</view>
		<view class="mask" ref="close" @click='close' v-if="pay_close"></view>
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
		orderPay,
		integralOrderPay,
		presellOrderPay
	} from '@/api/order.js';
	export default {
		props: {
			payMode: {
				type: Array,
				default: function() {
					return [];
				}
			},
			pay_close: {
				type: Boolean,
				default: false,
			},
			order_id: {
				type: String,
				default: ''
			},
			totalPrice: {
				type: String,
				default: '0'
			},
			order_type: {
				type: Number,
				default: 0,
			},
			isCall: {
				type: Boolean,
				default: false
			},
			returnUrl: {
				type: String,
				default: ''
			}
		},
		data() {
			return {

			};
		},
		mounted:function(){

		},
		methods: {
			close: function() {
				this.$emit('onChangeFun', {
					action: 'payClose'
				});
			},
			goPay: function(number, paytype) {
				if (this.isCall) {
					return this.$emit('onChangeFun', {
						action: 'payCheck',
						value: paytype
					});
				}
				let that = this;
				let type = ''
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
				}else if(paytype == 'alipay'){
					// #ifndef MP
					type = 'alipay';
					// #endif
					// #ifdef MP
					type = 'alipayQr';
					// #endif
				}else if (paytype == 'offline') {
					type = 'offline';
				}
				if (!that.order_id) return that.$util.Tips({
					title: 'ກະລຸນາເລືອກຄຳສັ່ງຊື້ທີ່ຈະຊຳລະເງິນ'
				});
				if (paytype == 'balance' && parseFloat(number) < parseFloat(that.totalPrice)) return that.$util.Tips({
					title: 'ຍອດເງິນບໍ່ພຽງພໍ!'
				});
				uni.showLoading({
					title: 'ກຳລັງຊຳລະເງິນ'
				});
				let orderApi = that.order_type === 1 ? presellOrderPay : that.order_type === 2 ? integralOrderPay : orderPay
				orderApi(that.order_id, {
					type: type,
					// #ifdef H5
					return_url: that.returnUrl!=='' ? 'http://'+window.location.host+that.returnUrl : 'http://'+window.location.host+'/pages/users/order_list/index',
					// #endif
				}).then(res => {
					let status = res.data.status,
						orderId = res.data.result.order_id,
						jsConfig = res.data.result.config,
						callback_key = res.data.result.pay_key,
						goPages = that.returnUrl ? that.returnUrl : '/pages/users/order_list/index';
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
							if(paytype == 'offline'){
								return that.$util.Tips({
									title: 'ກະລຸນາຢືນຢັນການຊຳລະເງິນອອບລາຍໃນລະບົບຫຼັງບ້ານ',
								});
							}else{
								return that.$util.Tips({
									title: 'ການຊຳລະເງິນສຳເລັດ',
									icon: 'success'
								}, {
									tab: 5,
									url: goPages + '?status=1'
								});
							}

							break;
						case 'alipay':
						case 'alipayQr':
							uni.hideLoading();
							this.$emit('onChangeFun', {
								action: 'payClose'
							});
							uni.navigateTo({
								url: '/pages/order_pay_back/index?keyCode='+callback_key+'&url='+jsConfig,
							})
							return
							break;
						// #ifndef MP
						case "wechat":
						case "weixin":
						case "weixinApp":
							jsConfig.timeStamp = jsConfig.timestamp;
							// #ifndef APP-PLUS
							that.$wechat.pay(jsConfig).then(res => {
								this.$emit('onChangeFun', {
									action: 'payClose'
								});
								uni.hideLoading();
								return that.$util.Tips({
									title: 'ການຊຳລະເງິນສຳເລັດ',
									icon: 'success'
								}, {
									tab: 5,
									url: goPages + 'status=1'
								});
							}).catch(res => {
								if (res.errMsg == 'chooseWXPay:cancel'){
									if(that.isCall){
										return that.$util.Tips({
											title: 'ຍົກເລີກການຊຳລະເງິນ'
										});
									}else{
										return that.$util.Tips({
											title: 'ຍົກເລີກການຊຳລະເງິນ'
										}, {
											tab: 5,
											url: goPages + '?status=0'
										});
									}
								}
							})
							// #endif
							// #ifdef APP-PLUS
							let mp_pay_name=''
							if(uni.requestOrderPayment){
								mp_pay_name='requestOrderPayment'
							}else{
								mp_pay_name='requestPayment'
							}
							uni[mp_pay_name]({
								provider: 'wxpay',
								orderInfo: jsConfig,
								success: (e) => {
									this.$emit('onChangeFun', {
										action: 'payClose'
									});
									return that.$util.Tips({
										title: 'ການຊຳລະເງິນສຳເລັດ',
										icon: 'success'
									}, {
										tab: 5,
										url: goPages + 'status=1'
									});
								},
								fail: (e) => {
									if(that.isCall){
										return that.$util.Tips({
											title: 'ຍົກເລີກການຊຳລະເງິນ'
										});
									}else{
										return that.$util.Tips({
											title: 'ຍົກເລີກການຊຳລະເງິນ'
										}, {
											tab: 5,
											url: goPages + '?status=0'
										});
									}
								},
								complete: () => {
									uni.hideLoading();
								},
							});
							// #endif
							break;
						// #endif
						// #ifdef MP
						case "routine":
							jsConfig.timeStamp = jsConfig.timestamp;
							that.toPay = true;
							let mp_pay_name=''
							if(uni.requestOrderPayment){
								mp_pay_name='requestOrderPayment'
							}else{
								mp_pay_name='requestPayment'
							}
							uni[mp_pay_name]({
								...jsConfig,
								success: function(res) {
									uni.hideLoading();
									that.$emit('onChangeFun', {
										action: 'payClose'
									});
									if (that.BargainId || that.combinationId || that.pinkId || that.seckillId)
										return that.$util.Tips({
											title: 'ການຊຳລະເງິນສຳເລັດ',
											icon: 'success'
										}, {
											tab: 5,
											url: goPages + '?status=1'
										});
									return that.$util.Tips({
										title: 'ການຊຳລະເງິນສຳເລັດ',
										icon: 'success'
									}, {
										tab: 5,
										url: goPages + '?status=1'
									});
								},
								fail: function(e) {
									uni.hideLoading();
									that.$emit('onChangeFun', {
										action: 'payClose'
									});
									return that.$util.Tips({
										title: 'ຍົກເລີກການຊຳລະເງິນ'
									});
								},
								complete: function(e) {
									uni.hideLoading();
									//关闭当前页面跳转至订单状态
									if (res.errMsg == 'requestPayment:cancel') return that.$util.Tips({
										title: 'ຍົກເລີກການຊຳລະເງິນ'
									});
									that.$emit('onChangeFun', {
										action: 'payClose'
									});
								},
							})
							break;
						// #endif
						case "balance":
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
							let host = window.location.protocol+"//"+window.location.host;
							let url = `${host}/pages/order_pay_status/index?order_id=${orderId}`
							let eUrl = encodeURIComponent(url)
							let jsurl = jsConfig.mweb_url || jsConfig.h5_url
							let locations = `${jsurl}&redirect_url=${eUrl}`
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
									return that.$util.Tips({
										title: 'ການຊຳລະເງິນສຳເລັດ',
										icon: 'success'
									}, {
										tab: 5,
										url: goPages + 'status=1'
									});

								},
								fail: (e) => {
									return that.$util.Tips({
										title: 'ຍົກເລີກການຊຳລະເງິນ'
									});
								},
								complete: () => {
									uni.hideLoading();
								},
							});
						break;
						// #endif
					}
				}).catch(err => {
					uni.hideLoading();
					return that.$util.Tips({
						title: err
					});
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.payment {
		padding-bottom: 60rpx;
	}
	.payment .title {
		height: 123rpx;
		padding: 0 30rpx;
		border-bottom: 1px solid #eee;
	}
	.payment .title .iconfont{
		position: absolute;
		right: 20rpx;
		top: 20rpx;
	}
	.payment .item {
		border-bottom: 1px solid #eee;
		height: 130rpx;
		margin-left: 30rpx;
		padding-right: 30rpx;
	}
	.payment .item .left {
		width: 610rpx;
	}
	.payment .item .left .text {
		width: 540rpx;
	}
	.payment .item .left .text .name {
		font-size: 32rpx;
		color: #282828;
	}
	.payment .item .left .text .info {
		font-size: 24rpx;
		color: #999;
	}
	.payment .item .left .text .info .money {
		color: #ff9900;
	}
</style>
