<template>
	<view :style="viewColor">
		<!-- 自定义顶部背景颜色 -->
		<view class="top">
			<!-- #ifdef MP -->
			<view class="sys-head">
				<view class="sys-bar" :style="{height:sysHeight}"></view>
				<!-- #ifdef MP -->
				<view class="sys-title"><view class='iconfont icon-ic_leftarrow' @tap='goBack'></view>ສົ່ງຄຳສັ່ງ</view>
				<!-- #endif -->
				<view class="bg"></view>
			</view>
			<!-- #endif -->
		</view>
		<view class="order-header-bg"></view>
		<view class='order-submission'>
			<view class="allAddress" @click="onAddress">
				<view class='address acea-row row-between-wrapper bg-f boder-24' v-if='shippingType == 0 '>
					<view class='addressCon' v-if="addressInfo.real_name">
						<view class='name'>{{addressInfo.real_name}}
							<text class='phone'>{{addressInfo.phone}}</text>
						</view>
						<view>
							<text class='default t-color'
								v-if="addressInfo.is_default">[默认]</text>{{addressInfo.province}}{{addressInfo.city}}{{addressInfo.district}}{{addressInfo.street || ''}}{{addressInfo.detail}}
						</view>
					</view>
					<navigator v-else :url="'/pages/users/user_address/index?cartId='+cartId" hover-class="none" class='addressCon'>
						<view class='setaddress'>设置收货地址</view>
					</navigator>
					<view class='iconfont icon-ic_rightarrow'></view>
				</view>
				<view class='line'>
					<image :src="`${domain}/static/images/line.jpg`"></image>
				</view>
			</view>
			<!-- 商品信息 -->
			<view class="storeinfo-wrapper bg-f boder-24 mt20">
				<view class="store-item" v-for="(item,index) in cartInfo" :key="index">
					<view v-for="(goods,j) in item.list" :key="j">
						<view>
							<view class="product-item">
								<view class="img-box">
									<image :src="goods.productAttr.image || goods.product.image"></image>
								</view>
								<view class="content">
									<view class="acea-row row-between">
										<view class="name line1">{{goods.product.store_name}}</view>
										<text class="number">x{{goods.cart_num}}</text>
									</view>
									<view class="label">{{goods.productAttr.sku}}</view>
									<view class="price acea-row row-between">
										<view class="acea-row row-middle">
											<block>
												{{goods.productAttr.ot_price}}积分<block v-if="goods.productAttr.price>0">+{{goods.productAttr.price}}元</block>
											</block>
										</view>
									</view>
									<view class="err-txt" v-if="goods.undelivered && addressInfo.real_name">
										<text class="iconfont icon-icon_tip"></text>
										<view class="txt">此商品不支持该区域配送</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class='wrapper bg-f boder-24 mt20'>
				<view class='item acea-row row-between-wrapper'>
					<view>可用积分</view>
					<view class='discount'>{{resData.true_integral}}积分
					</view>
				</view>
				<view class='item acea-row row-between-wrapper'>
					<view>兑换积分</view>
					<view class='discount'>{{resData.order_total_integral}}积分
					</view>
				</view>
				<view class='item acea-row row-between-wrapper'>
					<view>支付金额</view>
					<view class='discount'>¥{{resData.order_pay_price || 0}}
					</view>
				</view>
				<view class='item acea-row row-between-wrapper'>
					<view>快递费用</view>
					<view class='discount'>免运费
					</view>
				</view>
				<view class='item' v-if="textareaStatus">
					<view>备注信息</view>
					<textarea placeholder-class='placeholder' placeholder="请添加备注（150字以内）"
						@input='bindHideKeyboard' :value="mark" :maxlength="150" name="mark">
						</textarea>
				</view>
			</view>
			<view style='height:120rpx;'></view>
			<view class='footer acea-row row-between-wrapper'>
				<view>支付：
					<text class='color-t'>{{resData.order_total_integral || 0}}积分</text><text class="color-t" v-if="resData.order_pay_price>0">+{{resData.order_pay_price}}元</text>
				</view>
				<view class='settlement' :class="{'disabled' : resData.true_integral < resData.order_total_integral}" @tap="goPay">{{resData.true_integral < resData.order_total_integral ? '积分不足' : '立即兑换'}}</view>
			</view>
		</view>
		<view class="alipaysubmit" v-html="formContent"></view>
		<addressWindow ref="addressWindow" @changeTextareaStatus="changeTextareaStatus" :news='news' :address='address'
			:pagesUrl="pagesUrl" @OnChangeAddress="OnChangeAddress" @changeClose="changeClose"></addressWindow>
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
	let sysHeight = uni.getSystemInfoSync().statusBarHeight + 'px';
	import {
		integralOrderConfirm,
		integralOrderCreate,
	} from '@/api/points_mall.js';
	import {
		getAddressDefault,
		getAddressDetail,
		getAddressList,
		getUserInfo,
	} from '@/api/user.js';
	import { storeListApi } from '@/api/store.js';
	import { CACHE_LONGITUDE,CACHE_LATITUDE } from '@/config/cache.js';
	import { openPaySubscribe } from '@/utils/SubscribeMessage.js';
	import addressWindow from '@/components/addressWindow';
	import { HTTP_REQUEST_URL } from '@/config/app';
	import { toLogin } from '@/libs/login.js';
	import { mapGetters } from "vuex";
	export default {
		components: {
			addressWindow,
		},
		data() {
			return {
				sysHeight: sysHeight,
				confirm:[],
				textareaStatus: true,
				//支付方式
				cartArr: [{
						"name": "微信支付",
						"icon": "icon-icon_WeChat_1",
						value: 'weixin',
						title: '微信快捷支付',
						payStatus: app.globalData.pay_weixin_open,
					},
					{
						name: "支付宝支付",
						icon: "icon-icon_Alipay",
						// #ifdef H5 || APP-PLUS
						value: 'alipay',
						// #endif
						// #ifdef MP
						value: 'alipayQr',
						// #endif
						title: '支付宝支付',
						payStatus: app.globalData.alipay_open
					},
					{
						"name": "余额支付",
						"icon": "icon-a-ic_Money111",
						value: 'balance',
						title: '可用余额:',
						payStatus: app.globalData.yue_pay_status,
					},
					{
						name: '线下支付',
						icon: 'icon-a-ic_offlinepay',
						value: 'offline',
						title: '线下支付',
						payStatus: app.globalData.offline_switch
					}
				],
				formContent: '',
				payType: 'weixin', //支付方式
				openType: 1, //优惠券打开方式 1=使用
				active: 0, //支付方式切换
				coupon: {
					coupon: false,
					list: [],
					statusTile: '立即使用'
				}, //优惠券组件
				address: {
					address: false
				}, //地址组件
				addressInfo: {}, //地址信息
				pinkId: 0, //拼团id
				addressId: 0, //地址id
				couponId: 0, //优惠券id
				cartId: '', //购物车id
				BargainId: 0,
				combinationId: 0,
				seckillId: 0,
				userInfo: {}, //用户信息
				mark: '', //备注信息
				couponTitle: '请选择', //优惠券
				coupon_price: 0, //优惠券抵扣金额
				useIntegral: false, //是否使用积分
				integral_price: 0, //积分抵扣金额
				integral: 0,
				ChangePrice: 0, //使用积分抵扣变动后的金额
				formIds: [], //收集formid
				status: 0,
				is_address: false,
				toPay: false, //修复进入支付时页面隐藏从新刷新页面
				shippingType: 0,
				system_store: {},
				storePostage: 0,
				contacts: '',
				contactsTel: '',
				mydata: {},
				storeList: [],
				store_self_mention: 0,
				cartInfo: {},
				priceGroup: {},
				animated: false,
				totalPrice: 0,
				integralRatio: "0",
				pagesUrl: "",
				offlinePostage: "",
				from: '',
				news: 1,
				order_key: "",
				order_type: 20,
				invTitle: '不开发票',
				special_invoice: false,
				invoice_func: false,
				header_type: '',
				invShow: false,
				invList: [],
				invChecked: '',
				urlQuery: '',
				pay_close: false,
				resData: {},
				product_type:1,
				newImg: [],
				domain: HTTP_REQUEST_URL,
			};
		},
		computed: mapGetters(['isLogin','viewColor','keyColor']),
		onLoad: function(options) {
			// #ifdef H5
			this.from = this.$wechat.isWeixin() ? 'weixin' : 'h5'
			// #endif
			// #ifdef MP
			this.from = 'routine'
			// #endif
			// #ifdef APP-PLUS
			this.from = 'weixin'
			// #endif
			if (this.payType == 'weixin') {
				this.payType = this.from
			}
			if (!options.cartId) return this.$util.Tips({
				title: '请选择要购买的商品'
			}, {
				tab: 3,
				url: 1
			});
			this.addressId = options.addressId || 0;
			this.cartId = options.cartId;
			this.is_address = options.is_address ? true : false;
			this.invChecked = options.invoice_id || '';
			// #ifndef APP-PLUS
			this.textareaStatus = true;
			// #endif
			if (this.isLogin && this.toPay == false) {
				this.getFun();
			} else {
				toLogin();
			}
		},
		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: function() {
			uni.removeStorageSync('form_type_cart');
			let _this = this
			uni.$on("handClick", res => {
				if (res) {
					_this.system_store = res.address
				}
				// 清除监听
				uni.$off('handClick');
			})
		},
		methods: {
			goBack: function() {
				uni.navigateBack();
			},
			getFun(){
				this.getaddressInfo();
				this.$nextTick(function() {
					this.getUserInfo();
					this.$refs.addressWindow.getAddressList();
				})
			},
			// 获取个人信息
			getUserInfo() {
				getUserInfo().then(res => {
					this.userInfo = res.data
				})
			},
			payClose: function() {
				this.pay_close = false;
			},
			payItem: function(e) {
				let that = this;
				let active = e;
				that.active = active;
				that.animated = true;
				that.payType = that.cartArr[active].value;
				if (that.payType == 'weixin') {
					that.payType = that.from
				}
			},
			goPay() {
				let that = this,
					data = {};
				if (!that.addressId) {
					return that.$util.Tips({
						title: '请选择收货地址'
					});
				}
				if (parseFloat(that.resData.true_integral) < parseFloat(that.resData.order_total_integral))
					return that.$util.Tips({
						title: '积分不足！'
					});
				data = {
					cart_id: this.cartId.split(","),
					address_id: this.addressId,
					pay_type: this.payType,
					mark: this.mark,
					order_type: this.order_type,
					key: this.order_key,
					// #ifdef H5
					return_url: 'http://' + window.location.host + '/pages/points_mall/exchange_record',
					// #endif
				};
				if (data.mark && this.isEmojiCharacter(data.mark[Object.keys(data.mark)[0]])) {
					that.$util.Tips({
						title: '备注不允许输入表情！'
					});
					return;
				}
				if (data.payType == 'balance' && parseFloat(that.userInfo.now_money) < parseFloat(that.totalPrice))
					return that.$util
						.Tips({
							title: '余额不足！'
						});
				uni.showLoading({
					title: '订单支付中',
					mask: true
				});
				// #ifdef MP
				openPaySubscribe().then(() => {
					that.payment(data);
				});
				// #endif
				// #ifndef MP
				that.payment(data);
				// #endif
			},
			payment: function(data) {
				let that = this;
				integralOrderCreate(data).then(res => {
					if(res.data.status != 'success'){
						uni.navigateTo({
							url: `/pages/users/order_payment/index?order_id=${res.data.result.order_id}&from_type=order`
						})
						return
					}
					uni.hideLoading();
					let status = res.data.status,
						orderId = res.data.result.order_id,
						callback_key = res.data.result.pay_key,
						jsConfig = res.data.result.config,
						goPages = '/pages/order_pay_status/index?order_type=20&order_id=' + orderId + '&msg=' + res.message;
					that.orderPay = true;
					uni.hideLoading();
					switch (status) {
						case 'ORDER_EXIST':
						case 'EXTEND_ORDER':
						case 'PAY_ERROR':
						case 'error':
							return that.$util.Tips({
								title: res.message
							}, {
								tab: 5,
								url: goPages
							});
							break;
						case 'success':
							return that.$util.Tips({
								title: res.message,
								icon: 'success'
							}, {
								tab: 5,
								url: goPages
							});
							break;
						case 'alipay':
						case "alipayQr":
							uni.navigateTo({
								url: '/pages/order_pay_back/index?keyCode=' + callback_key + '&url=' +
									jsConfig
							})
							return;
							break;
							// #ifndef MP
						case "wechat":
						case "weixin":
						case "weixinApp":
							// #ifndef APP-PLUS
							this.$wechat.pay(jsConfig).then(res => {
								return that.$util.Tips({
									title: res.message,
									icon: 'success'
								}, {
									tab: 4,
									url: goPages
								});
							}).catch(res => {
								if (res.errMsg == 'chooseWXPay:cancel') return that.$util.Tips({
									title: '取消支付'
								}, {
									tab: 5,
									url: goPages
								});
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
									let url = '/pages/order_pay_status/index?order_type=20&order_id=' + orderId +
										'&msg=支付成功';
									return that.$util.Tips({
										title: '支付成功',
										icon: 'success'
									}, {
										tab: 4,
										url: url
									});
								},
								fail: (e) => {
									let url = '/pages/order_pay_status/index?order_type=20&order_id=' + orderId + '&msg=取消支付';
									return that.$util.Tips({
										title: '取消支付',
									}, {
										tab: 4,
										url: url
									});
								},
								complete: () => {
									let url = '/pages/order_pay_status/index?order_type=20&order_id=' + orderId + '&msg=取消支付';
									return that.$util.Tips({
										title: '取消支付',
									}, {
										tab: 4,
										url: url
									});
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
									return that.$util.Tips({
										title: '支付成功',
										icon: 'success'
									}, {
										tab: 5,
										url: goPages
									});
								},
								fail: function(e) {
									let pages = '/pages/order_pay_status/index?order_type=20&order_id=' +
										orderId + '&msg=取消支付'
									return that.$util.Tips({
										title: '取消支付'
									}, {
										tab: 5,
										url: pages + '&status=0'
									});
								},
							})
							break;
							// #endif
						case "balance":
							//余额
							return that.$util.Tips({
								title: res.message
							}, {
								tab: 5,
								url: goPages + '&status=1'
							});
							break;
							// #ifdef H5
						case 'h5':
							let host = window.location.protocol + "//" + window.location.host;
							let url = `${host}/pages/order_pay_status/index?order_type=20&order_id=${orderId}&msg=${res.message}`
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
									return that.$util.Tips({
										title: '支付成功',
										icon: 'success'
									}, {
										tab: 5,
										url: goPages
									});
								},
								fail: (e) => {
									let pages = '/pages/order_pay_status/index?order_type=20&order_id=' +
										orderId + '&msg=支付失败'
									return that.$util.Tips({
										title: '支付失败'
									}, {
										tab: 5,
										url: pages
									});
								},
								complete: () => {
									uni.hideLoading();
									let pages = '/pages/order_pay_status/index?order_type=20&order_id=' +
										orderId + '&msg=取消支付'
									return that.$util.Tips({
										title: '取消支付'
									}, {
										tab: 5,
										url: pages
									});
								},
							});
							break;
							// #endif
						default:
							let pages = '/pages/order_pay_status/index?order_type=20&order_id=' +
								orderId + '&msg=取消支付'
							return that.$util.Tips({
								title: '取消支付'
							}, {
								tab: 5,
								url: pages + '&status=0'
							});
					}
				}).catch(err => {
					uni.hideLoading();
					return that.$util.Tips({
						title: err
					});
				});
			},
			isEmojiCharacter: function(substring) {
				if (substring) {
					for (var i = 0; i < substring.length; i++) {
						var hs = substring.charCodeAt(i);
						if (0xd800 <= hs && hs <= 0xdbff) {
							if (substring.length > 1) {
								var ls = substring.charCodeAt(i + 1);
								var uc = ((hs - 0xd800) * 0x400) + (ls - 0xdc00) + 0x10000;
								if (0x1d000 <= uc && uc <= 0x1f77f) {
									return true;
								}
							}
						} else if (substring.length > 1) {
							var ls = substring.charCodeAt(i + 1);
							if (ls == 0x20e3) {
								return true;
							}
						} else {
							if (0x2100 <= hs && hs <= 0x27ff) {
								return true;
							} else if (0x2B05 <= hs && hs <= 0x2b07) {
								return true;
							} else if (0x2934 <= hs && hs <= 0x2935) {
								return true;
							} else if (0x3297 <= hs && hs <= 0x3299) {
								return true;
							} else if (hs == 0xa9 || hs == 0xae || hs == 0x303d || hs == 0x3030 ||
								hs == 0x2b55 || hs == 0x2b1c || hs == 0x2b1b ||
								hs == 0x2b50) {
								return true;
							}
						}
					}
				}
			},
			// 关闭地址弹窗；
			changeClose: function() {
				this.$set(this.address, 'address', false);
			},

			ChangCouponsClose: function() {

			},
			changeTextareaStatus: function() {

			},
			/**
			 * 选择地址后改变事件
			 * @param object e
			 */
			OnChangeAddress: function(e) {
				this.textareaStatus = true;
				this.addressId = e;
				this.address.address = false;
				this.getaddressInfo();
			},
			bindHideKeyboard: function(e) {
				this.mark = e.detail.value;
			},
			/**
			 * 获取当前订单详细信息
			 *
			 */
			getConfirm: function() {
				let that = this;
				console.log(this.addressId)
				integralOrderConfirm({
					cart_id: this.cartId.split(","),
					address_id: this.addressId
				}).then(res => {
					that.$set(that, 'resData', res.data);
					that.$set(that, 'cartInfo', res.data.order);
					that.$set(that, 'order_key', res.data.key);
					that.$set(that, 'order_type', res.data.order_type);
				}).catch(err => {
					return this.$util.Tips({
						title: err
					}, {
						tab: 3,
						url: 1
					});
				});
			},
			bindDateChange: function(e, index) {
				this.confirm[index].value = e.target.value
			},
			bindTimeChange: function(e, index) {
				this.confirm[index].value = e.target.value
			},
			/*
			 * 获取默认收货地址或者获取某条地址信息
			 */
			getaddressInfo: function() {
				let that = this;
				if (that.addressId) {
					getAddressDetail(that.addressId).then(res => {
						res.data.is_default = parseInt(res.data.is_default);
						that.addressInfo = res.data || {};
						that.addressId = res.data.address_id || 0;
						that.address.addressId = res.data.address_id || 0;
						that.getConfirm();
					})
				} else {
					getAddressList().then(res => {
						that.addressInfo = res.data.list.length > 0 ? res.data.list[0] : {};
						that.addressId = res.data.list.length > 0 ? res.data.list[0].address_id : 0;
						that.address.addressId = res.data.list.length > 0 ? res.data.list[0].address_id : 0;
						that.getConfirm();
					})
				}
			},
			onAddress: function() {
				let that = this;
				if(that.addressInfo.real_name){
					that.textareaStatus = false;
					that.address.address = true;
					that.pagesUrl = '/pages/users/user_address/index?cartId=' + this.cartId+'&product_type=20';
				}else{
					uni.navigateTo({
						url: `/pages/users/user_address/index?cartId=${this.cartId}&product_type=20`,
					});
				}
			},
			clickTextArea() {
				this.$nextTick(() => {
					this.$refs.getFocus.focus()
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.sys-title .iconfont{ position: absolute; left: 30rpx; }
	/deep/uni-checkbox[disabled] .uni-checkbox-input {
		background-color: #eee;
	}
	.order-header-bg {
		height: 100rpx;
		background-image: linear-gradient( 90deg, var(--view-bntColor21) 0%, var(--view-bntColor22) 100%);
		position: relative;
		&::after {
			content: "";
			position: absolute;
			left: 0;
			bottom: 0;
			width: 100%;
			height: 86rpx;
			background: linear-gradient(0deg, #F5F5F5 0%, rgba(245, 245, 245, 0) 100%);
		}
	}
	.sys-head .bg{
		background-image: linear-gradient( 90deg, var(--view-bntColor21) 0%, var(--view-bntColor22) 100%);
	}
	.order-submission{
		padding: 0 20rpx;
		margin-top: -70rpx;
	}
	.alipaysubmit {
		display: none;
	}
	.order-submission .address {
		padding: 28rpx 30rpx;
		background-color: #fff;
		box-sizing: border-box;
	}
	.order-submission .address .addressCon {
		width: 610rpx;
		font-size: 26rpx;
		color: #666;
	}
	.order-submission .address .addressCon .name {
		font-size: 30rpx;
		color: #282828;
		font-weight: bold;
		margin-bottom: 10rpx;
	}
	.order-submission .address .addressCon .name .phone {
		margin-left: 50rpx;
	}
	.order-submission .address .addressCon .default {
		margin-right: 12rpx;
	}
	.order-submission .address .addressCon .setaddress {
		color: #333;
		font-size: 28rpx;
	}
	.order-submission .address .iconfont {
		font-size: 35rpx;
		color: #707070;
	}
	.order-submission .allAddress {
		width: 100%;
		position: relative;
	}
	.order-submission .allAddress .nav {
		width: 710rpx;
		margin: 0 auto;
	}
	.order-submission .allAddress .nav .item {
		width: 355rpx;
		position: relative;
	}
	.order-submission .allAddress .nav .item.on {
		position: relative;
		width: 250rpx;
	}
	.order-submission .allAddress .address {
		height: 150rpx;
		margin: 0 auto;
	}
	.order-submission .line {
		position: absolute;
		left: 2%;
		bottom: 0;
		width: 96%;
		height: 3rpx;
	}
	.order-submission .line image {
		width: 100%;
		height: 100%;
		display: block;
	}
	.storeinfo-wrapper {
		.product-item {
			display: flex;
			padding: 25rpx 30rpx;
			.img-box {
				width: 130rpx;
				height: 130rpx;
				image {
					width: 130rpx;
					height: 130rpx;
					border-radius: 16rpx;
				}
			}
			.content {
				position: relative;
				width: 550rpx;
				margin-left: 30rpx;
				font-size: 28rpx;
				color: #282828;
				overflow: hidden;
				.name {
					width: 400rpx;
				}
				.number{
					display: block;
					text-align: right;
					color: #999;
					font-size: 26rpx;
				}
				.label {
					margin-top: 10rpx;
					color: #999999;
					font-size: 20rpx;
				}
				.price {
					margin-top: 20rpx;
					color: var(--view-priceColor);
					position: relative;
					text {
						margin-left: 10rpx;
						color: #999;
					}
				}
				.err-txt {
					display: flex;
					align-items: center;
					margin-top: 18rpx;
					color: $theme-color;
					.iconfont {
						margin-right: 10rpx;
					}
				}
			}
		}
	}
	.order-submission .wrapper .item .name{
		position: relative;
	}
	.order-submission .wrapper .item {
		padding: 27rpx 30rpx;
		font-size: 30rpx;
	}
	.order-submission .wrapper .item .discount input {
		text-align: end;
	}
	.order-submission .wrapper .item .discount .iconfont {
		color: #515151;
		font-size: 30rpx;
		margin-left: 15rpx;
	}
	.order-submission .wrapper .item .discount .num {
		font-size: 32rpx;
		margin-right: 20rpx;
	}
	.order-submission .wrapper .item textarea {
		background-color: #f9f9f9;
		width: 100%;
		height: 140rpx;
		border-radius: 3rpx;
		margin-top: 30rpx;
		padding: 25rpx 28rpx;
		box-sizing: border-box;
	}
	.order-submission .wrapper .item .list {
		margin-top: 35rpx;
	}
	.order-submission .moneyList {
		margin-top: 12rpx;
		background-color: #fff;
		padding: 30rpx;
	}
	.order-submission .moneyList .item {
		font-size: 28rpx;
		color: #282828;
	}
	.order-submission .moneyList .item~.item {
		margin-top: 20rpx;
	}
	.order-submission .moneyList .item .money {
		color: #999;
	}
	.order-submission .footer {
		width: 100%;
		height: 100rpx;
		background-color: #fff;
		padding: 0 30rpx;
		font-size: 28rpx;
		color: #333;
		box-sizing: border-box;
		position: fixed;
		bottom: 0;
		bottom: calc(0rpx + constant(safe-area-inset-bottom)); ///兼容 IOS<11.2/
		bottom: calc(0rpx + env(safe-area-inset-bottom)); ///兼容 IOS>11.2/
		left: 0;
	}
	.order-submission .footer .color-t{
		color: var(--view-theme);
	}
	.order-submission .footer .settlement {
		font-size: 26rpx;
		color: #fff;
		width: 200rpx;
		height: 72rpx;
		background-color: var(--view-theme);
		border-radius: 50rpx;
		text-align: center;
		line-height: 72rpx;
		font-weight: 500;
		&.disabled {
			background: #BFBFBF;
			pointer-events: none;
		}
	}
</style>
