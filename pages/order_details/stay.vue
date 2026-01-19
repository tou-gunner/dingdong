<template>
	<view :style="viewColor">
		<!-- 自定义顶部背景颜色 -->
		<view class="top">
			<!-- #ifdef MP || APP-PLUS -->
			<view class="sys-head fixed">
				<view class="sys-bar" :style="{height:sysHeight}"></view>
				<!-- #ifdef MP -->
				<view class="sys-title">
					<view class='iconfont icon-ic_leftarrow' :style="{lineHeight:sysHeight}" @tap='goBack'></view>
					订单详情
				</view>
				<!-- #endif -->
				<view class="bg"></view>
			</view>
			<!-- #endif -->
		</view>
		<view class='order-details' :style="{marginTop:marTop}">
			<view class="header-count" :class="{'presell_bg_header' : (orderInfo.orderList && orderInfo.orderList[0].activity_type != 2)}"></view>
			<view class="pad20 order-main">
				<view>
					<block v-if="orderInfo.orderList && orderInfo.orderList[0].activity_type != 2">
						<view class='header acea-row row-middle row-between'>
							<view class='data'>
								<view class='state'>请在{{orderInfo.cancel_time}}前完成支付!</view>
								<view>{{orderInfo.add_time_y}}<text class='time'>{{orderInfo.create_time}}</text></view>
							</view>
							<view class='pictrue'>
								<image :src="imgUrl+'/static/order_status0.png'"></image>
							</view>
						</view>
						<view class='nav'>
							<view class='navCon acea-row row-between-wrapper'>
								<view class="nav-text on">待付款</view>
								<view class="nav-text">待发货</view>
								<view class="nav-text">待收货</view>
								<view class="nav-text">待评价</view>
								<view class="nav-text">已完成</view>
							</view>
							<view class='progress acea-row row-between-wrapper'>
								<view class='iconfont icon-ic_jindu1 t-color'></view>
								<view class='line'></view>
								<view class='iconfont icon-ic_jindu2'></view>
								<view class='line'></view>
								<view class='iconfont icon-ic_jindu2'></view>
								<view class='line'></view>
								<view class='iconfont icon-ic_jindu2'></view>
								<view class='line'></view>
								<view class='iconfont icon-ic_jindu2'></view>
							</view>
						</view>
					</block>
					<!--预售（代付款）-->
					<block v-else>
						<view class='header presell_header' :style="{ 'background-image': `url(${domain}/static/diy/presell_header${keyColor}.png)`}">
							<view class="presell_payment" v-if="orderInfo.orderList"><text class="iconfont icon-icon_clock-2"></text>{{orderInfo.orderList[0].orderProduct[0].cart_info.productPresell.presell_type==1?'待支付':'待付定金'}}</view>
							<view class='data'>
								<view class='state'>请在{{orderInfo.cancel_time}}前完成支付,超时订单将自动取消</view>
							</view>
						</view>
					</block>
					<block v-if="orderInfo.orderList && orderInfo.orderList[0].order_type != 2">
						<view class='address boder-24' v-if="orderInfo.real_name&&orderInfo.user_address">
							<view class='name'>{{orderInfo.real_name}}<text class='phone'>{{orderInfo.user_phone}}</text></view>
							<view>{{orderInfo.user_address}}</view>
						</view>
						<view class='line'>
							<image :src="`${imgUrl}/static/images/line.jpg`"></image>
						</view>
					</block>
				</view>
				<!-- 店铺商品列表 -->
				<view class="order-wrapper boder-24 bg-f" v-for="(item,index) in orderInfo.orderList" :key="index">
					<view class="title" @click="goStore(item)">{{item.merchant.mer_name}}<text class="iconfont icon-ic_rightarrow"></text>
					</view>
					<view class="goods-box">
						<view v-for="(goods,j) in item.orderProduct" :key="goods.order_product_id" @click="goProduct(goods)">
							<view v-if="item.activity_type === 2">
								<view class="item">
									<image :src="goods.cart_info.product.image"></image>
									<view class="info-box">
										<view class="name line1"><text class="event_name event_bg">预售</text>{{goods.cart_info.product.store_name}}</view>
										<view class="msg">{{goods.cart_info.productAttr.sku}}</view>
										<view  class="event_ship event_color">发货时间：
											<!--全款预售-->
											<text v-if="goods.cart_info.productPresell.presell_type === 1">{{ goods.cart_info.productPresell.delivery_type === 1 ? '支付成功后' : '预售结束后' }}{{ goods.cart_info.productPresell.delivery_day }}天内</text>
											<!--定金预售-->
											<text v-if="goods.cart_info.productPresell.presell_type === 2">{{ goods.cart_info.productPresell.delivery_type === 1 ? '支付尾款后' : '预售结束后' }}{{ goods.cart_info.productPresell.delivery_day }}天内</text>
										</view>
									</view>
									<view class="num"><text class="font-color">¥{{goods.cart_info.productPresellAttr.presell_price}}</text></br>x{{goods.product_num}}</view>
								</view>
								<view class="event_progress" v-if="goods.cart_info.productPresell.presell_type !=1">
									<view class="progress_list">
										<view class="progress_name">阶段一： 等待买家付款</view>
										<view class="progress_price">商品定金  <text class="align_right">¥{{ item.pay_price }}</text></view>
										<view class="progress_pay">定金需付款<text class="align_right gColor">¥{{ item.pay_price }}</text></view>
									</view>
									<view class="progress_list">
										<view class="progress_name">阶段二： 未开始</view>
										<view class="progress_price">商品尾款  <text class="align_right">¥{{ item.presellOrder.pay_price }}</text></view>
										<view class="progress_pay">尾款需付款<text class="align_right gColor">¥{{ item.presellOrder.pay_price }}</text></view>
									</view>
								</view>
							</view>
							<view v-else class="item">
								<image :src="goods.cart_info.product.image"></image>
								<view class="info-box">
									<view class="name line1">{{goods.cart_info.product.store_name}}</view>
									<view class="msg">{{goods.cart_info.productAttr.sku}}</view>
									<view class='price acea-row row-middle'>
										<text>¥{{goods.cart_info.productAttr.price}}</text>
										<image v-if="goods.cart_info.productAttr.show_svip_price" class="svip-img" :src="`${domain}/static/images/svip.png`"></image>
									</view>
								</view>
								<view class="num">x{{goods.product_num}}</view>
							</view>
						</view>
					</view>
					<block v-if="item.merchant">
						<view  class="goodCall" @click="goGoodCall(item)">
							<text class="iconfont icon-ic_customerservice"></text><text style="font-size: 28rpx;">联系客服</text>
						</view>
					</block>
				</view>
				<view class='wrapper bg-f boder-24'>
					<view class='item acea-row row-between'>
						<view>订单编号：</view>
						<view class='conter acea-row row-middle row-right'>{{orderInfo.group_order_sn}}
							<!-- #ifndef H5 -->
							<text class='copy' @tap='copy'>复制</text>
							<!-- #endif -->
							<!-- #ifdef H5 -->
							<text class='copy copy-data' :data-clipboard-text="orderInfo.group_order_sn">复制</text>
							<!-- #endif -->
						</view>
					</view>
					<view class='item acea-row row-between'>
						<view>下单时间：</view>
						<view class='conter'>{{orderInfo.create_time || 0}}</view>
					</view>
					<view class='item acea-row row-between'>
						<view>支付状态：</view>
						<view class='conter'>未支付</view>
					</view>
					<view class='item acea-row row-between'>
						<view>商品总额：</view>
						<view class='conter'>¥{{orderInfo.total_price}}</view>
					</view>
				</view>
				<view v-if="orderInfo.orderList && orderInfo.orderList[0].order_extend" class='wrapper bg-f boder-24'>
					<block v-for="(item,index) in orderInfo.orderList[0].order_extend" v-if="item" :key="index">
						<view v-for="(itm,idx) in item" v-if="itm" :key="idx" class='item acea-row row-between'>
							<view>{{idx}}：</view>
							<view v-if="!Array.isArray(itm)" class='conter'>{{itm}}</view>
							<view v-else class='conter virtual_image'>
								<image v-for="(pic,i) in itm" :key="i" class="picture" :src="pic" @click="getPhotoClickIdx(itm,idx)"></image>
							</view>
						</view>
					</block>
				</view>

				<view class='wrapper bg-f boder-24'>
					<view class='item acea-row row-between' v-if="orderInfo.pay_postage > 0">
						<view>运费：</view>
						<view class='conter'>+¥{{orderInfo.pay_postage}}</view>
					</view>
					<view class='item acea-row row-between' v-if='orderInfo.coupon_price>0'>
						<view>优惠券抵扣：</view>
						<view class='conter'>-¥{{orderInfo.coupon_price}}</view>
					</view>
					<view class='item acea-row row-between' v-if='orderInfo.integral'>
						<view>积分抵扣：</view>
						<view class='conter'>-¥{{orderInfo.integral_price}}</view>
					</view>
					<view class='item acea-row row-between'>
						<view>实付款：</view>
						<view class='conter'>¥{{orderInfo.pay_price}}</view>
					</view>
				</view>
				<view class="content-clip"></view>
				<view class='footer acea-row row-right row-middle'>
					<view class="bnt cancel" @click.stop="cancelOrder">取消订单</view>
					<view class='bnt bgColor' @tap='pay_open(orderInfo.order_id)'>立即付款</view>
				</view>
			</view>
		</view>
		<payment :payMode='payMode' :pay_close="pay_close" @onChangeFun='onChangeFun' :order_id="pay_order_id" :totalPrice='totalPrice'></payment>
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
	import { HTTP_REQUEST_URL } from '@/config/app';
	import { goShopDetail } from '@/libs/order.js'
	import { groupOrderDetail, orderAgain, orderTake, orderDel, unOrderCancel} from '@/api/order.js';
	import { openOrderRefundSubscribe } from '@/utils/SubscribeMessage.js';
	import payment from '@/components/payment';
	import orderGoods from "@/components/orderGoods";
	import ClipboardJS from "@/plugin/clipboard/clipboard.js";
	import { configMap, getCustomer } from "@/utils";
	import { mapGetters } from "vuex";
	import { toLogin } from '@/libs/login.js';
	export default {
		components: {
			payment,
			orderGoods,
		},
		data() {
			return {
				domain: HTTP_REQUEST_URL,
				sysHeight: sysHeight,
				//#ifdef H5
				marTop: 0,
				//#endif
				//#ifdef MP
				marTop: uni.getSystemInfoSync().statusBarHeight+43+'px',
				//#endif
				//#ifdef APP-PLUS
				marTop: uni.getSystemInfoSync().statusBarHeight+'px',
				//#endif
				order_id: '',
				evaluate: 0,
				cartInfo: [], //购物车产品
				orderInfo: {
					system_store: {},
					_status: {}
				}, //订单详情
				system_store: {},
				isGoodsReturn: false, //是否为退款订单
				status: {}, //订单底部按钮状态
				isClose: false,
				payMode: [{
					name: "微信支付",
					icon: "icon-a-ic_wechatpay",
					value: 'wechat',
					title: '微信快捷支付',
					payStatus: app.globalData.pay_weixin_open
				},
				// #ifndef MP
				{
					name: "支付宝支付",
					icon: "icon-a-ic_alipay",
					value: 'alipay',
					title: '支付宝支付',
					payStatus: app.globalData.alipay_open
				},
				// #endif
				{
					name: "余额支付",
					icon: "icon-ic_Money2",
					value: 'balance',
					title: '可用余额:',
					number: 0,
					payStatus: app.globalData.yue_pay_status
				},
				{
					name: '线下支付',
					icon: 'icon-a-ic_offlinepay',
					value: 'offline',
					title: '线下支付',
					payStatus: app.globalData.offline_switch
				}
			],
			pay_close: false,
			pay_order_id: '',
			totalPrice: '0',
			imgUrl:HTTP_REQUEST_URL,
			invoice: {
				invoice: false,
				add: false,
			}
		};
	},
		watch: {
			orderPayList:{
				handler(nVal,oVal){
					if(nVal){
						this.payMode= nVal;
					}
				},
				immediate: true,
				deep:true
			}
		},
		computed: configMap({hide_mer_status:0},
		mapGetters(['isLogin','uid','viewColor','keyColor','orderPayList'])),
		onLoad: function(options) {
			if (options.order_id) {
				this.$set(this, 'order_id', options.order_id);
			}
		},
		onShow() {
			if (this.isLogin) {
				this.getOrderInfo();
			} else {
				toLogin()
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
						title: '复制成功'
					});
				});
			});
			// #endif
		},
		mounted: function() {},
		methods: {
			goBack: function() {
				uni.navigateBack();
			},
			// 图片预览
			getPhotoClickIdx(list, idx) {
				uni.previewImage({
					current: list[idx], //  传 Number H5端出现不兼容
					urls: list
				});
			},
			// 去店铺
			goStore(item){
				if(this.hide_mer_status != 1){
					uni.navigateTo({
						url:`/pages/store/home/index?id=${item.merchant.mer_id}`
					})
				}
			},
			// 商品详情
			goProduct(goods){
				goods.activity_id = goods.cart_info && goods.cart_info.activeSku && goods.cart_info.activeSku.product_group_id
				goShopDetail(goods, '').then(res => {
					uni.navigateTo({
						url:`/pages/goods_details/index?id=${goods.product_id}`
					})
				})
			},
			/**
			 * 拨打电话
			 */
			call: function(item) {
				let that = this
				if(item.merchant.service_phone){
					uni.showModal({
						title: '提示',
						content: '暂无在线客服，确定拨打客服电话:'+item.merchant.service_phone+'吗？',
						success: function(res) {
							if (res.confirm) {
								uni.makePhoneCall({
									phoneNumber: item.merchant.service_phone
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
			goGoodCall(item) {
				let self = this
				let mer = item.merchant.services_type
				let data = {
					type: mer.services_type,
					service_phone: mer.service_phone,
					customer_url: mer.mer_customer_url,
					customer_corpId: mer.mer_customer_corpId,
					customer_link: mer.mer_customer_link
				}
				let url = `/pages/chat/customer_list/chat?mer_id=${item.mer_id}&uid=${this.uid}&order_id=${this.order_id}`
				getCustomer(data, url)
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
			 * 拨打电话
			 */
			makePhone: function() {
				uni.makePhoneCall({
					phoneNumber: this.system_store.phone
				})
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
				this.$util.getPayTypeList(this.pay_order_id,0);
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
			 * 获取订单详细信息
			 *
			 */
			getOrderInfo: function() {
				let that = this;
				uni.showLoading({
					title: "正在加载中"
				});
				groupOrderDetail(this.order_id).then(res => {
					let _type = 0;
					uni.hideLoading();
					that.$set(that, 'orderInfo', res.data);
				}).catch(err => {

					uni.hideLoading();
					that.$util.Tips({
						title: err
					}, '/pages/users/order_list/index');
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
					data: this.orderInfo.group_order_sn
				});
			},
			// #endif
			// 取消订单
			cancelOrder() {
				let self = this
				uni.showModal({
					title: '提示',
					content: '确认取消该订单?',
					success: function(res) {
						if (res.confirm) {
							unOrderCancel(self.order_id)
								.then((data) => {
									console.log(data)
									self.$util.Tips({
										title: data.message
									}, {
										tab: 3
									})
								})
								.catch(() => {
									self.getDetail();
								});
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
	.event_bg{
		background: #FF7F00;
	}
	.event_color{
		color: #FF7F00;
	}
	.presell_bg_header {
		background-image: linear-gradient(90deg, var(--view-bntColor22) 0%, var(--view-bntColor21) 100%);
	}
	.sys-head .bg{
		background-image: linear-gradient(90deg, var(--view-bntColor22) 0%, var(--view-bntColor21) 100%);
	}
	.goodCall {
		text-align: center;
		width: 100%;
		height: 86rpx;
		padding: 0 30rpx;
		font-size: 30rpx;
		line-height: 86rpx;
		color: #282828;
		.icon-ic_customerservice {
			font-size: 32rpx;
			margin-right: 15rpx;
		}
	}
	.header-count{
		height: 260rpx;
		background-image: linear-gradient(90deg, var(--view-bntColor22) 0%, var(--view-bntColor21) 100%);
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
	.order-details .header {
		padding: 0;
		&.presell_header{
			background-repeat: no-repeat;
			background-size: cover;
			.data{
				margin: 8rpx 0 0 26rpx;
				.state{
					font-weight: normal;
					font-size: 24rpx;
				}
			}
		}
	}
	.order-details .order-main {
		position: relative;
		margin-top: -260rpx;
	}
	.order-details .header.on {
		background-color: #666 !important;
	}
	.order-details .header .pictrue {
		width: 160rpx;
		height: 160rpx;
		margin-right: 0;
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
	}
	.presell_header .presell_payment{
		color: #fff;
		font-size: 30rpx;
		font-weight: bold;
		margin-left: 20rpx;
		.iconfont{
			font-weight: normal;
			margin-right: 8rpx;
		}
	}
	.order-details .nav {
		background-color: #fff;
		width: 710rpx;
		height: 130rpx;
		border-radius: 24rpx;
		margin: 0 auto;
		font-size: 26rpx;
		color: #282828;
		padding: 25rpx 0;
	}
	.order-details .nav .navCon {
		padding: 0 40rpx;
	}
	.order-details .nav .navCon .nav-text{
			color: var(--view-theme);
	}
	.order-details .nav .on{
		font-weight: bold;
	}
	.order-details .nav .on ~ .nav-text{
		color: #282828;
	}
	.order-details .nav .progress {
		padding: 0 65rpx;
		margin-top: 10rpx;
	}
	.order-details .nav .progress .line {
		width: 100rpx;
		height: 2rpx;
		background-color: #939390;
	}
	.order-details .nav .progress .iconfont {
		font-size: 20rpx;
		color: #939390;
		position: relative;
		left: 6rpx;
		&.t-color{
			color: var(--view-theme);
		}
	}
	.order-details .address {
		font-size: 26rpx;
		color: #999999;
		background-color: #fff;
		margin-top: 20rpx;
		padding: 40rpx 30rpx;
	}
	.order-details .address .name {
		font-size: 30rpx;
		font-weight: bold;
		color: #282828;
		margin-bottom: 15rpx;
	}
	.order-details .address .name .phone {
		margin-left: 40rpx;
	}
	.order-details .line {
		width: 100%;
		height: 3rpx;
	}
	.order-details .line image {
		width: 100%;
		height: 100%;
		display: block;
	}
	.order-details .wrapper {
		margin-top: 20rpx;
		padding: 30rpx;
	}
	.order-details .wrapper .item {
		font-size: 28rpx;
		color: #282828;
	}
	.order-details .wrapper .item~.item {
		margin-top: 20rpx;
	}
	.order-details .wrapper .item .conter {
		color: #999999;
		max-width: 500rpx;
		text-align: right;
	}
	.order-details .wrapper .item .virtual_image {
		margin-left: 50rpx;
	}
	.order-details .wrapper .item .virtual_image .picture{
		width: 106rpx;
		height: 106rpx;
		border-radius: 8rpx;
		margin-right: 10rpx;
		&:last-child{
			margin-right: 0;
		}
	}
	.order-details .wrapper .item .conter .copy {
		font-size: 20rpx;
		color: #666666;
		border-radius: 26rpx;
		border: 1px solid #dddddd;
		padding: 3rpx 15rpx;
		margin-left: 24rpx;
	}
	.order-details .wrapper .actualPay {
		border-top: 1px solid #eee;
		margin-top: 30rpx;
		padding-top: 30rpx;
	}
	.order-details .wrapper .actualPay .money {
		font-weight: bold;
		font-size: 30rpx;
	}
	.order-details .footer {
		width: 100%;
		position: fixed;
		bottom: 0;
		left: 0;
		background-color: #fff;
		padding: 0 30rpx;
		height: 100rpx;
		height: calc(100rpx+ constant(safe-area-inset-bottom)); ///兼容 IOS<11.2/
		height: calc(100rpx + env(safe-area-inset-bottom)); ///兼容 IOS>11.2/
		box-sizing: border-box;
	}
	.content-clip{
		height: 120rpx;
		height: calc(120rpx+ constant(safe-area-inset-bottom)); ///兼容 IOS<11.2/
		height: calc(120rpx + env(safe-area-inset-bottom)); ///兼容 IOS>11.2/
	}
	.order-details .footer .bnt {
		width: 176rpx;
		height: 60rpx;
		text-align: center;
		line-height: 60rpx;
		border-radius: 50rpx;
		color: #fff;
		font-size: 27rpx;
	}
	.bgColor{
		background-color: var(--view-theme);
	}
	.order-details .footer .bnt.cancel {
		color: #666;
		border: 1px solid #ddd;
	}
	.order-details .footer .bnt~.bnt {
		margin-left: 18rpx;
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
	.order-details .map .place {
		font-size: 26rpx;
		width: 176rpx;
		height: 50rpx;
		border-radius: 25rpx;
		line-height: 50rpx;
		text-align: center;
	}
	.order-details .map .place .iconfont {
		font-size: 27rpx;
		height: 27rpx;
		line-height: 27rpx;
		margin: 2rpx 3rpx 0 0;
	}
	.order-details .address .name .iconfont {
		font-size: 34rpx;
		margin-left: 10rpx;
	}
	.refund {
		padding: 0 30rpx 30rpx;
		margin-top: 24rpx;
		background-color: #fff;
		.title {
			display: flex;
			align-items: center;
			font-size: 30rpx;
			color: #333;
			height: 86rpx;
			border-bottom: 1px solid #f5f5f5;
			image {
				width: 32rpx;
				height: 32rpx;
				margin-right: 10rpx;
			}
		}
		.con {
			padding-top: 25rpx;
			font-size: 28rpx;
			color: #999999;
		}
	}
	.order-wrapper{
		margin-top: 15rpx;
		.title{
			display: flex;
			align-items: center;
			height: 86rpx;
			padding:0 30rpx;
			border-bottom: 1px solid #f0f0f0;
			.iconfont{
				font-size: 24rpx;
				color: #666;
				margin-top: 6rpx;
				margin-left: 5rpx;
			}
		}
		.goods-box{
			.item{
				display: flex;
				padding: 25rpx 30rpx 25rpx 30rpx;
				image{
					width: 130rpx;
					height: 130rpx;
					border-radius: 16rpx;
				}
				.info-box{
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					margin-left: 25rpx;
					width: 450rpx;
					.msg{
						color: #999999;
						font-size: 20rpx;
						margin-top: 18rpx;
					}
					.price{
						font-size: 26rpx;
						color: var(--view-priceColor);
					}
					.svip-img{
						width: 65rpx;
						height: 28rpx;
						margin: 4rpx 0 0 4rpx;
					}
				}
				.num{
					flex: 1;
					text-align: right;
					font-size: 26rpx;
					color: #999999;
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
				margin-top: 18rpx;
			}
		}
		.event_progress{
			margin-top: 20rpx;
			background: #fff;
			.progress_name {
				padding-left: 30rpx;
				height: 60rpx;
				line-height: 60rpx;
				font-size: 24rpx;
				font-weight: bold;
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
			.gColor{
				color: var(--view-theme);
			}
			.progress_price{
				padding: 20rpx 30rpx;
				color: #999999;
				font-size: 22rpx;
			}
			.progress_pay{
				padding: 25rpx 30rpx;
				background: var(--view-minorColor);
				font-size: 26rpx;
				color: #282828;
			}
		}
	}
</style>
