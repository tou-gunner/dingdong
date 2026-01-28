<template>
  <!-- svip会员模块 -->
	<view class="card_content">
		<view class="card-section" :style="'background-image: url('+domain+'/static/images/vip_header_bg.png)'">
			<view class="header-card" :style="'background-image: url('+domain+'/static/images/svip_section.png)'">
				<view class="header-avatar acea-row">
					<view class="acea-row row-middle">
						<view class="avatar-box on">
							<image class="image" :src="userInfo.avatar || '/static/images/f.png'"></image>
							<view class="headwear">
								<image :src="`${domain}/static/images/crown.png`"></image>
							</view>
						</view>
						<view class="text acea-row">
							<view class="name">{{userInfo.nickname || ''}}</view>
							<image class="vip" :src="`${domain}/static/images/svip.png`"></image>
						</view>
					</view>
					<view v-if="userInfo.is_svip == 3" class="expire">ສະມາຊິກຕະຫຼອດຊີວິດ</view>
					<view v-else class="expire">{{userInfo.svip_endtime | dateFormat}} ໝົດອາຍຸ</view>
				</view>
				<view class="header_count">
					<view class="acea-row row-between vip_save">
						<view class="save_money">
							<text class="name">ປະຢັດລວມ (ກີບ)</text>
							<view class="money">{{userInfo.svip_save_money}}</view>
						</view>
						<view v-if="userInfo.is_svip != 3" @click="scrollToCard" class="renew_btn">ຕໍ່ອາຍຸດຽວນີ້</view>
					</view>
					<view class="save_list acea-row">
						<scroll-view scroll-x="true" style="white-space: nowrap; display: flex" show-scrollbar="false">
							<view v-for="(item,index) in memberRights" :key="index" class='item' @click="goUrl(item.link)">
								<image class="pic" :src="item.on_pic"></image>
								<view class="text">
									<view class="name">{{item.name}}</view>
									<view class="info line1">{{item.info}}</view>
								</view>
							</view>
						</scroll-view>
					</view>
				</view>
			</view>
		</view>
		<!--卡片下方内容-->
		<view class="vip_center">
			<view v-if="memberCoupons.length > 0" class="coupon-section" :style="{ 'background-image': `url(${domain}/static/images/svip_coupon_bg.png)`}">
				<view class="section-hd">
					<view class="title">ຄູປ໋ອງສະມາຊິກ</view>
					<text class="desc">ຄູປ໋ອງພິເສດສຳລັບສະມາຊິກ, ໃຊ້ໄດ້ທຸກບ່ອນ</text>
				</view>
				<scroll-view class="section-bd" scroll-x="true">
					<view v-for="item in memberCoupons" :key="item.coupon_id" class="item"
						:class="{gray: item.svipIssue}"
						:style="'background-image: url('+domain+'/static/images/svip_coupon.png)'">
						<text v-if="item.svipIssue" class="receive-bg":style="'background-image: url('+domain+'/static/images/received-bg.png)'"></text>
						<view class="coupon-count">
							<view class="money">
								<text>₭</text>
								<text class="num">{{item.coupon_price}}</text>
							</view>
							<view class="text">
								<view v-if="item.use_min_price === '0.00'" class="mark">ຮັບຄູປ໋ອງຫຼຸດທັນທີ {{item.coupon_price}} ກີບ</view>
								<view v-else class="mark">ໃຊ້ໄດ້ເມື່ອຊື້ຄົບ {{item.use_min_price | moneyFormat}}</view>
							</view>
						</view>
						<navigator hover-class="none" :url="'/pages/columnGoods/goods_coupon_list/index?coupon_id='+item.coupon_id" v-if="item.svipIssue" class="coupon-btn">ໄປໃຊ້</navigator>
						<view v-else @click="receiveCoupon(item)" class="coupon-btn">ຮັບດຽວນີ້</view>
					</view>
				</scroll-view>
			</view>
			<!--立即续费-->
			<view v-if="userInfo.is_svip != 3 && memberType.length>0" class="type-section" id="card" :style="{ 'background-image': `url(${domain}/static/images/renew_bg.png)`}">
				<view class="section-hd">
					<view class="title">ຕໍ່ອາຍຸສະມາຊິກ</view>
					<text class="desc">ຕໍ່ອາຍຸເພື່ອຮັບລາຄາພິເສດ</text>
				</view>
				<scroll-view class="scroll" scroll-x="true">
					<view v-for="(item,index) in memberType" :key="item.group_data_id" class="item" :class="{on: index === type}"
						@click="checkType(item,index)">
						<view class="title line1">{{item.value && item.value.svip_name}}</view>
						<view class="new">
							<priceFormat :price="item.value && item.value.price | moneyFormat" weight intSize="50" floatSize="50" labelSize="34"></priceFormat>
						</view>
						<view class="old">₭{{item.value && item.value.cost_price | moneyFormat}}</view>
					</view>
				</scroll-view>
				<view class="buy" @click="pay">ຈ່າຍດຽວນີ້</view>
				<view v-if="memberExplain" class="agree">
					<navigator class="link" url="/pages/annex/vip_clause/index" hover-class="none">ການຊື້ຖືວ່າຍອມຮັບ<text
						class="mark">《ຂໍ້ຕົກລົງຜູ້ໃຊ້ສະມາຊິກ》</text></navigator>
				</view>
			</view>
			<view v-if="goodsList.length" class="goods-section" :style="'background-image: url('+domain+'/static/images/member_price.png)'">
				<view class="section-hd">
					<view class="title">ລາຄາພິເສດສະມາຊິກ</view>
				</view>
				<view class="section-bd acea-row">
					<view v-for="item in goodsList" :key="item.product_id" class="item" @click="goDetail(item.product_id)">
			      <image class="image" :src="item.image"></image>
						<view class="name line2">
							<text v-if="item.merchant.type_name && item.product_type == 0" class="font-bg-red bt-color">{{item.merchant.type_name}}</text>
							{{item.store_name}}
						</view>
						<view class="svip-price">
							<priceFormat :price="item.svip_price" weight intSize="28" floatSize="20" labelSize="20"></priceFormat>
							<image :src="`${domain}/static/images/svip.png`"></image>
						</view>
						<view class="shop-price">ລາຄາຮ້ານ: ₭{{item.price}}</view>
					</view>
				</view>
			</view>
		</view>
		<payment :payMode="payMode" :pay_close="pay_close" :is-call="true" @onChangeFun="onChangeFun"
			:order_id="pay_order_id" :totalPrice="totalPrice"></payment>
		<view v-show="false" v-html="formContent"></view>
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
	import payment from '@/components/payment';
	import { mapGetters } from "vuex";
	import {
		memberCard,
		memberEquity,
		memberCouponLst,
		memberCardDraw,
		memberCardCreate,
		groomList,
		getAgreementApi,
		receiveMemberCoupon
	} from '@/api/user.js';
	import { toLogin } from '@/libs/login.js';
	import { openPaySubscribe } from '@/utils/SubscribeMessage.js';
	import dayjs from '@/plugin/dayjs/dayjs.min.js';
	import { HTTP_REQUEST_URL } from '@/config/app';
	export default {
		components: {
			payment,
		},
		filters: {
			dateFormat: function(value) {
				return dayjs(value).format('YYYY-MM-DD');
			},
			moneyFormat: function(value) {
				return parseFloat(value);
			}
		},
		data() {
			return {
				domain: HTTP_REQUEST_URL,
				memberType: [],
				userInfo: {},
				memberRights: [],
				memberExplain: [],
				memberCoupons: [],
				isGetFree: null,
				popupShow: false,
				account: '',
				password: '',
				goodsList: [],
				pay_order_id: '',
				payMode: [{
					name: 'ຈ່າຍຜ່ານ WeChat',
					icon: 'icon-a-ic_wechatpay',
					// #ifdef H5
					value: this.$wechat.isWeixin() ? 'weixin' : 'h5',
					// #endif
					// #ifdef MP
					value: 'routine',
					// #endif
					// #ifdef APP-PLUS
					value: 'weixin',
					// #endif
					title: 'ຈ່າຍດ່ວນ WeChat',
					payStatus: app.globalData.pay_weixin_open
					}
					// #ifdef H5 ||APP-PLUS
					,
					{
					name: 'ຈ່າຍຜ່ານ Alipay',
					icon: 'icon-a-ic_alipay',
					// #ifdef H5 || APP-PLUS
					value: 'alipay',
					// #endif
					// #ifdef MP
					value: 'alipayQr',
					// #endif
					title: 'ຈ່າຍຜ່ານ Alipay',
					payStatus: app.globalData.alipay_open
					}
					// #endif
				],
				pay_close: false,
				totalPrice: '0',
				formContent: '',
				page: 1,
				limit: 15,
				finished: false,
				loading: false,
				memberEndTime: '',
				// #ifdef H5
				isWeixin: this.$wechat.isWeixin(),
				// #endif
				type: 0,
				svip_type: 1,
				svip: null,
				svipDef: {},
			}
		},
		watch: {

		},
		computed: mapGetters(['isLogin']),
		onLoad() {
			this.getCouponLst();
			if (this.isLogin) {
				this.getMemberCard();
				this.memberEquity();
				this.groomList();
			} else {
				toLogin()
			}
		},
		onShow(){

		},
		onReachBottom() {
			this.groomList();
		},
		methods: {
			onLunch() {
				this.getMemberCard();
				this.memberEquity();
				this.getCouponLst();
			},
			goUrl(url){
				if(url.indexOf("http") != -1){
					// #ifdef H5
					location.href = url
					// #endif
				}else{
					if(['/pages/goods_cate/goods_cate','/pages/order_addcart/order_addcart','/pages/user/index'].indexOf(url) == -1){
						uni.navigateTo({
							url:url
						})
					}else{
						uni.switchTab({
							url:url
						})
					}
				}
			},
			// 付费会员数据
			getMemberCard() {
				uni.showLoading({
					title: 'ກຳລັງໂຫຼດ...'
				});
				memberCard().then(res => {
					uni.hideLoading();
					this.memberType = res.data.list;
					this.svipDef = res.data.def;
					this.totalPrice = res.data.def.price.toString();
					this.pay_order_id = res.data.def.group_data_id.toString();
					this.svip_type = res.data.def.svip_type;
				}).catch(err => {
					uni.showToast({
						title: err,
						icon: 'none'
					});
				});
			},
			// 付费会员权益
			memberEquity() {
				memberEquity().then(res => {
					this.memberRights = res.data.interests;
					this.userInfo = res.data.user;
				}).catch(err => {
					uni.showToast({
						title: err,
						icon: 'none'
					});
				});
			},
			// 会员优惠券
			getCouponLst() {
				memberCouponLst().then(res => {
					this.memberCoupons = res.data
				}).catch(err => {
					uni.showToast({
						title: err,
						icon: 'none'
					});
				});
			},
			receiveCoupon(item) {
				let that = this;
				if (that.isLogin === false) {
					toLogin()
				} else {
					receiveMemberCoupon(item.coupon_id).then(res => {
						item.svipIssue = 1
						uni.showToast({
							title: res.message,
							icon: 'none'
						})
					}).catch(err => {
						uni.showToast({
							title: err,
							icon: 'none'
						})
					})
				}
			},
			pay() {
				if (this.totalPrice == 0) {
					this.createMemberCard('weixin');
				} else {
					this.pay_close = true;
				}
			},
			payClose: function() {
				this.pay_close = false;
			},
			// 立即购买
			createMemberCard(type) {
				uni.showLoading({
					title: 'ກຳລັງໂຫຼດ...'
				});
				let query = {
					pay_type: type,
					// #ifdef H5
					return_url: location.port ? location.protocol + '//' + location.hostname + ':' + location.port +
						'/pages/annex/vip_paid/index' : location.protocol + '//' + location.hostname +
						'/pages/annex/vip_paid/index'
					// #endif
				};
				let group_id = this.pay_order_id
				// #ifdef MP
				openPaySubscribe().then(() => {
					memberCardCreate(group_id,query).then(res => {
						if (parseFloat(this.totalPrice) > 0) {
							this.callPay(res);
						} else {
							uni.hideLoading();
							return this.$util.Tips({
								title: this.svip_type == 1 ? 'ເປີດນຳໃຊ້ຟຣີສຳເລັດ' : 'ຕໍ່ອາຍຸສຳເລັດ',
							}, () => {
								this.onLunch()
							});
						}
					}).catch(err => {
						uni.hideLoading();
						uni.showToast({
							title: err,
							icon: 'none'
						});
					});
				});
				// #endif
				// #ifndef MP
				memberCardCreate(group_id,query).then(res => {
					if (parseFloat(this.totalPrice) > 0) {
						this.callPay(res);
					} else {
						uni.hideLoading();
						return this.$util.Tips({
							title:  this.svip_type == 1 ? 'ເປີດນຳໃຊ້ຟຣີສຳເລັດ' : 'ຕໍ່ອາຍຸສຳເລັດ',
						}, () => {
							this.onLunch()
						});
					}
				}).catch(err => {
					uni.showToast({
						title: err,
						icon: 'none'
					});
				});
				// #endif
			},
			// 调用支付
			callPay(res) {
				let that = this;
				let status = res.data.status,
					orderId = res.data.result.order_id,
					callback_key = res.data.result.pay_key,
					jsConfig = res.data.result.config,
					goPages = '/pages/annx/vip_center/index'
				switch (status) {
					case 'ORDER_EXIST':
					case 'EXTEND_ORDER':
					case 'PAY_ERROR':
					case 'error':
						uni.hideLoading();
						that.payClose();
						return that.$util.Tips({
							title: res.message
						});
						break;
					case 'success':
						uni.hideLoading();
						that.payClose();
						return that.$util.Tips({
							title: res.message,
							icon: 'success'
						});
						break;
					case 'alipay':
					case "alipayQr":
						uni.hideLoading();
						that.payClose();
						uni.navigateTo({
							url: '/pages/order_pay_back/index?keyCode='+callback_key+'&url='+jsConfig+'&type=11',
						})
						return;
						break;
						// #ifndef MP
					case "wechat":
					case "weixin":
					case "weixinApp":
						jsConfig.timeStamp = jsConfig.timestamp;
						// #ifndef APP-PLUS
						this.$wechat.pay(jsConfig).then(res => {
							uni.hideLoading();
							that.payClose();
							return that.$util.Tips({
								title: res.message,
								icon: 'success'
							});
						}).catch(res => {
							uni.hideLoading();
							if (res.errMsg == 'chooseWXPay:cancel') return that.$util.Tips({
								title: 'ຍົກເລີກການຈ່າຍ'
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
								uni.hideLoading();
								that.payClose();
								return that.$util.Tips({
									title: 'ຈ່າຍສຳເລັດ',
									icon: 'success'
								});
							},
							fail: (e) => {
								uni.hideLoading();
								that.payClose();
								uni.showModal({
									content: "ຈ່າຍບໍ່ສຳເລັດ",
									showCancel: false,
									success: function(res) {}
								})
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
								that.payClose();
								return that.$util.Tips({
									title: 'ຈ່າຍສຳເລັດ',
									icon: 'success'
								}, {
									tab: 5,
									url: goPages
								});
							},
							fail: function(e) {
								uni.hideLoading();
								that.payClose();
								return that.$util.Tips({
									title: 'ຍົກເລີກການຈ່າຍ'
								});
							},
						})
						break;
						// #endif
					case "balance":
						uni.hideLoading();
						that.payClose();
						//余额不足
						return that.$util.Tips({
							title: res.message
						}, {
							tab: 5,
							url: goPages
						});
						break;
						// #ifdef H5
					case 'h5':
						let host = window.location.protocol + "//" + window.location.host;
						let url = `${host}/pages/annex/vip_center/index`
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
								uni.hideLoading();
								that.payClose();
								return that.$util.Tips({
									title: 'ຈ່າຍສຳເລັດ',
									icon: 'success'
								});
							},
							fail: (e) => {
								uni.hideLoading();
								uni.showModal({
									content: "ຈ່າຍບໍ່ສຳເລັດ",
									showCancel: false,
									success: function(res) {}
								})
							},
							complete: () => {
								uni.hideLoading();
							},
						});
						break;
						// #endif
				}
			},
			payCheck: function(type) {
				this.createMemberCard(type);
			},
			onChangeFun: function(e) {
				let opt = e;
				let action = opt.action || null;
				let value = opt.value != undefined ? opt.value : null;
				action && this[action] && this[action](value);
			},
			scrollToCard() {
				const query = uni.createSelectorQuery().in(this);
				query.select('#card').boundingClientRect(data => {
					uni.pageScrollTo({
						scrollTop: data.top
					});
				}).exec();
			},
			checkType(svip,index) {
				this.svipDef = svip.value;
				this.type = index;
				this.svip_type = svip.value.svip_type;
				this.pay_order_id = svip.group_data_id.toString();
				this.totalPrice = svip.value.price.toString();
			},
			goDetail(id) {
				uni.navigateTo({
					url: `/pages/goods_details/index?id=${id}`
				});
			},
			groomList() {
				if (this.finished || this.loading) {
					return;
				}
				this.loading = true
				groomList({
					page: this.page,
					limit: this.limit
				}).then(res => {
					this.goodsList = this.goodsList.concat(res.data.list);
					this.finished = res.data.list.length < this.limit;
					this.loading = false;
					this.page += 1;
				}).catch(err => {

				});
			},
		},
		// 滚动监听
		onPageScroll(e) {}
	}
</script>
<style lang="scss" scoped>
	.card_content{
		background: #F5f5f5;
	}
	.card-section {
		height: 600rpx;
		background-size: cover;
		background-repeat: no-repeat;
		position: relative;
		.header-card{
			width: 750rpx;
			margin: 0 auto;
			background-repeat: no-repeat;
			background-size: 100% 100%;
			padding: 53rpx 0 60rpx;
			position: absolute;
			left: 0;
			top: 64rpx;
			z-index: 10;
			.header-avatar{
				justify-content: space-between;
				align-items: center;
				padding: 0 53rpx;
				.text {
					flex: 1;
					margin-left: 15rpx;
					font-size: 22rpx;
					line-height: 30rpx;
					color: #89735B;
				}
				.name {
					margin-bottom: 2rpx;
					font-weight: bold;
					font-size: 30rpx;
					line-height: 42rpx;
					color: #865622;
				}
			}
			.vip{
				width: 82rpx;
				height: 36rpx;
				position: relative;
				top: 5rpx;
				margin-left: 7rpx;
			}
			.expire {
				font-size: 22rpx;
				color: #865622;
			}
		}
		.avatar-box{
			position: relative;
			.image {
				width: 64rpx;
				height: 64rpx;
				border-radius: 50%;
				border: 3rpx solid rgb(255, 210, 104);
				margin-right: 20rpx;
			}
			.headwear {
				position: absolute;
				right: 18rpx;
				top: -18rpx;
				width: 18rpx;
				height: 18rpx;
				image {
					width: 100%;
					height: 100%;
				}
			}
		}
	}
	.header_count{
		margin-top: 20rpx;
		.vip_save{
			padding: 0 53rpx;
			.save_money{
				color: #666666;
				font-size: 24rpx;
				.money{
					font-size: 58rpx;
					color: #282828;
				}
			}
			.renew_btn{
				width: 160rpx;
				line-height: 60rpx;
				height: 60rpx;
				text-align: center;
				background: #282828;
				border-radius: 30rpx;
				color: #F7E1A6;
				font-size: 24rpx;
				font-weight: bold;
				position: relative;
				top: 30rpx;
			}
		}
	}
	.save_list{
		margin-top: 20rpx;
		padding: 0 40rpx;
		display: flex;
		.item{
			width: 22%;
			display: inline-block;
			text-align: center;
			margin-right: 12rpx;
			&:last-child{
				margin-right: 0;
			}
			.pic{
				width: 84rpx;
				height: 84rpx;
				border-radius: 100%;
			}
			.text{
				margin-top: 10rpx;
				color: #282828;
				.name{
					font-size: 22rpx;
					font-weight: bold;
				}
				.info{
					max-width: 100%;
					color: #666666;
					font-size: 18rpx;
					margin-top: 4rpx;
				}
			}
		}
	}
	.vip_center{
		border-radius: 34rpx 34rpx 0 0;
		background: #F5F5F5;
		padding: 215rpx 20rpx 0;
		position: relative;
		margin-top: -284rpx;
		z-index: 5;
		.coupon-section {
			margin-top: 20rpx;
			background-color: #FFFFFF;
			background-size: 100%;
			background-repeat: no-repeat;
			border-radius: 16rpx;
			.section-bd {
				white-space: nowrap;
				padding: 0 20rpx;
				.item {
					display: inline-flex;
					width: 160rpx;
					height: 190rpx;
					margin: 26rpx 20rpx 30rpx 0;
					background-size: cover;
					background-repeat: no-repeat;
					position: relative;
					.coupon-count{
						width: 160rpx;
						text-align: center;
						margin-top: 36rpx;
					}
					&:last-child {
						margin-right: 0;
					}
					.receive-bg {
						display: block;
						width: 160rpx;
						height: 190rpx;
						background-size: cover;
						background-repeat: no-repeat;
						position: absolute;
						top: 0;
						left: 0;
						z-index: 0;
					}
					.coupon-btn {
						position: absolute;
						bottom: 10rpx;
						color: #8F5C11;
						font-size: 22rpx;
						font-weight: bold;
						display: block;
						width: 100%;
						text-align: center;
						z-index: 3;
					}
					.text {
						max-width: 194rpx;
						margin-top: 10rpx;
						display: block;
					}
					.name {
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
						font-weight: bold;
						font-size: 28rpx;
						line-height: 40rpx;
						color: #5D3324;
					}
					.mark {
						display: inline-block;
						height: 35rpx;
						font-size: 22rpx;
						line-height: 35rpx;
						color: #8F5C11;
					}
					.money {
						max-width: 170rpx;
						text-align: center;
						font-size: 22rpx;
						font-weight: 800;
						color: #8F5C11;
						margin-top: -20rpx;
					}
					.num {
						position: relative;
						font-size: 44rpx;
					}
				}
			}
		}
		.type-section {
		  margin-top: 20rpx;
			border-radius: 20rpx;
			background-color: #FFFFFF;
			padding-bottom: 30rpx;
			background-size: 100%;
			background-repeat: no-repeat;
			.title_bd {
				padding: 26rpx 40rpx 0 0;
				font-size: 24rpx;
				color: #999999;
				.bold {
					display: inline-block;
					margin-right: 14rpx;
					font-weight: bold;
					font-size: 32rpx;
					line-height: 45rpx;
					color: #333333;
					+view {
						display: inline-block;
					}
				}
				.time {
					margin-left: 14rpx;
					font-size: 24rpx;
					color: #AE5A2A;
				}
			}
			.scroll {
				white-space: nowrap;
				padding: 0 30rpx;
			}
			.item {
				display: inline-flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				width: 210rpx;
				height: 240rpx;
				border-radius: 12rpx;
				margin: 32rpx 20rpx 30rpx 0;
				border: 1px solid #CFCFCF;
				line-height: 42rpx;
				&:last-child {
					margin-right: 0;
				}
				&.on {
					border: 3rpx solid #FCC282;
					background-color: #FEF7EC;
					.new {
						color: #DBAA4D;
					}
				}
				.title{
					color: #282828;
					font-weight: bold;
					font-size: 30rpx;
					width: 180rpx;
					text-align: center;
				}
			}
			.new {
				margin-top: 22rpx;
				font-weight: 600;
				font-size: 34rpx;
				color: #E7BE7D;
				.num {
					font-size: 48rpx;
					line-height: 48rpx;
				}
			}
			.old {
				margin-top: 13rpx;
				text-decoration: line-through;
				font-size: 24rpx;
				color: #999999;
			}
			.info {
				margin-top: 13rpx;
				font-size: 24rpx;
			}
			.agree {
				font-size: 22rpx;
				text-align: center;
				color: #999999;
				margin-top: 30rpx;
				.link {
					display: inline-block;
				}
				.mark {
					color: #8A602E;
				}
			}
			.buy {
				height: 80rpx;
				border-radius: 12rpx;
				background: linear-gradient(270deg, #E5BA62 0%, #ECCA7F 51%, #F3D99B 100%);
				font-size: 30rpx;
				font-weight: bold;
				line-height: 80rpx;
				text-align: center;
				color: #865622;
				border-radius: 44rpx;
				margin: 0 30rpx;
			}
			.cash {
				padding-top: 26rpx;
				padding-bottom: 29rpx;
				font-size: 28rpx;
				text-align: center;
				color: #754E19;
			}
		}
		.section-hd {
			padding: 30rpx 30rpx 0;
			.title {
				font-weight: bold;
				font-size: 32rpx;
				line-height: 45rpx;
				color: #333333;
			}
			.desc {
				font-size: 20rpx;
				color: #999999;
			}
		}
	}
	.goods-section {
		margin-top: 20rpx;
		background-color: #ffffff;
		background-size: 100%;
		background-repeat: no-repeat;
		border-radius: 16rpx;
		padding-bottom: calc(0rpx + constant(safe-area-inset-bottom)); ///兼容 IOS<11.2/
		padding-bottom: calc(0rpx + env(safe-area-inset-bottom)); ///兼容 IOS>11.2/
		.section-hd {
			padding: 20rpx 30rpx 0;
			font-weight: bold;
			font-size: 32rpx;
			line-height: 45rpx;
			color: #333333;
			text {
				color: #999999;
				font-size: 24rpx;
				font-weight: normal;
			}
		}
		.section-bd {
			margin-top: 26rpx;
			.item {
				width: 325rpx;
				padding-bottom: 24rpx;
				margin-left: 20rpx;
			}
			.image {
				width: 325rpx;
				height: 325rpx;
				border-radius: 16rpx 16rpx 0 0;
			}
			.name {
				margin-top: 10rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
				line-height: 37rpx;
			}
			.svip-price {
				margin-top: 6rpx;
				font-size: 28rpx;
				font-weight: bold;
				image {
					width: 65rpx;
					height: 28rpx;
					margin-left: 6rpx;
					position:  relative;
					top: 5rpx;
				}
			}
			.shop-price {
				margin-top: 4rpx;
				font-size: 20rpx;
				color: #666666;
			}
		}
	}
</style>
