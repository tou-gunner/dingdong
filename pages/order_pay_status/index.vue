<template>
	<view :style="viewColor">
		<view class='payment-status boder-24 bg-f'>
			<view class='iconfont icon-duihao2 icon' v-if ="order_pay_info.paid !=0 || order_pay_info.pay_type == 7"></view>
			<view class='iconfont icon-iconfontguanbi icon' v-else></view>

			<view class="status">{{payResult}}</view>
			<view class='wrapper'>
				<view v-if="order_type== 20 || order_pay_info.pay_type==7" class='item acea-row row-between-wrapper'>
					<view>ລະຫັດຄຳສັ່ງຊື້</view>
					<view class='itemCom'>{{order_pay_info.group_order_sn}}</view>
				</view>
				<view class='item acea-row row-between-wrapper'>
					<view>{{order_type== 20 ? 'ເວລາແລກປ່ຽນ' : 'ເວລາສັ່ງຊື້'}}</view>
					<view class='itemCom'>{{order_pay_info.create_time}}</view>
				</view>
				<view v-if="order_type== 20" class='item acea-row row-between-wrapper'>
					<view>ວິທີແລກປ່ຽນ</view>
					<view class='itemCom'>ແລກດ້ວຍຄະແນນ</view>
				</view>
				<view v-else class='item acea-row row-between-wrapper'>
					<view>ວິທີຊຳລະ</view>
					<view v-if="order_pay_info.pay_type==1 || order_pay_info.pay_type==2 || order_pay_info.pay_type==3" class='itemCom'>WeChat</view>
					<view v-else-if="order_pay_info.pay_type==4 || order_pay_info.pay_type==5" class='itemCom'>Alipay</view>
					<view v-else-if="order_pay_info.pay_type==7" class='itemCom'>ຊຳລະອອບລາຍ</view>
					<view v-else class='itemCom'>ຍອດເງິນຄົງເຫຼືອ</view>
				</view>
				<view v-if="order_type== 20" class='item acea-row row-between-wrapper'>
					<view>ຄະແນນທີ່ໃຊ້</view>
					<view class='itemCom'>{{order_pay_info.integral}}</view>
				</view>
				<view class='item acea-row row-between-wrapper'>
					<view>ຈຳນວນເງິນຊຳລະ</view>
					<view class='itemCom'>{{order_pay_info.pay_price}}</view>
				</view>
				<view v-if="order_pay_info.give_integral > 0 && order_pay_info.paid" class='item acea-row row-between-wrapper'>
					<view>ຄະແນນທີ່ໄດ້ຮັບ</view>
					<view class='itemCom t-color'>{{order_pay_info.give_integral}}</view>
				</view>
				<!--失败时加上这个  -->
				<view class='item acea-row row-between-wrapper' v-if="order_pay_info.paid==0 && order_pay_info.pay_type != 7 && order_pay_info.pay_type != 'offline' && msg != 'success'">
					<view>ເຫດຜົນລົ້ມເຫຼວ</view>
					<view class='itemCom'>{{order_pay_info.pay_type==0 ? 'ຍອດເງິນບໍ່ພຽງພໍ':msg}}</view>
				</view>
			</view>
			<!--失败时： 重新购买 -->
			<button @click="goPink(order_pay_info.activity_id)" class='returnBnt gColor' formType="submit" hover-class='none' v-if="order_pay_info.activity_type == 4 && order_pay_info.paid">ເຊີນໝູ່ເຂົ້າຮ່ວມກຸ່ມ</button>
			<view @tap="goOrderDetails">
				<button formType="submit" class='returnBnt' :class="(order_pay_info.activity_type == 4 && order_pay_info.paid) ? 's-Color' : 'gColor'">ເບິ່ງຄຳສັ່ງຊື້</button>
			</view>

			<button v-if="!order_pay_info.paid || order_pay_info.activity_type != 4" @click="goIndex" class='returnBnt s-Color' formType="submit" hover-class='none'>ກັບຄືນໜ້າຫຼັກ</button>
			<view class="coupon-wrapper" v-if="couponList.length>0 && order_pay_info.paid">
				<view class="hd">
					<view class="line"></view>
					<view class="txt">ຄູປອງທີ່ໄດ້ຮັບ</view>
					<view class="line"></view>
				</view>
				<view class="coupon-box" :class="{on:isOpen}">
					<block v-for="(item,index) in couponList" :key="index">
						<view class="coupon-item flex">
							<view class="left-bg" :style="{ 'background-image': `url(${domain}/static/diy/couponBg${keyColor}.png)` }"><text>₭</text>{{item.coupon_price}}</view>
							<view class="info">
								<view class="title">{{item.title}}</view>
								<view v-if="item.use_min_price==0" class="des">ຫຼຸດທັນທີ {{item.coupon_price}} ກີບ</view>
								<view v-else class="des">ໃຊ້ໄດ້ເມື່ອຊື້ຄົບ {{item.use_min_price}} ກີບ</view>
								<block v-if="item.coupon_type == 1">
									<view class="des">ໃຊ້ໄດ້: {{ item.use_start_time |timeYMD }}-{{ item.use_end_time |timeYMD}}</view>
								</block>
								<block v-if="item.coupon_type == 0">
									<view class="des">ໃຊ້ໄດ້ພາຍໃນ {{ item.coupon_time}} ວັນຫຼັງຮັບ</view>
								</block>
							</view>
						</view>
					</block>
				</view>
				<view class="more" v-if="couponList.length>2" @click="bindMore">
					{{ text }}
					<text v-if="!isOpen" class="iconfont icon-ic_downarrow"></text>
					<text v-else class="iconfont icon-ic_uparrow"></text>
				</view>
			</view>
		</view>
		<recommend v-if="recommend_switch == 1" :hostProduct='hostProduct' :isLogin="isLogin" @getCartList="getCartList"></recommend>
		<view class='loadingicon acea-row row-center-wrapper' v-if="hostProduct.length>5 && recommend_switch == 1">
			<text class='loading iconfont icon-jiazai' :hidden='loading==false'></text>{{loadTitle}}
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
	import { getPayOrder } from '@/api/order.js';
	import { getProductHot } from '@/api/store.js';
	import { mapGetters } from "vuex";
	import { toLogin } from '@/libs/login.js';
	import { HTTP_REQUEST_URL } from '@/config/app';
	import { configMap } from '@/utils';
	import recommend from '@/components/recommend';
	export default {
		components: {
			recommend
		},
		filters: {
		  timeYMD: function (value) {
				if(value){
					var newDate=/\d{4}-\d{1,2}-\d{1,2}/g.exec(value)
					return newDate[0]
				}
		  }
		},
		data() {
			return {
				domain: HTTP_REQUEST_URL,
				orderId: '',
				order_type: '',
				order_pay_info: {},
				order_id: "",
				group_order_id: "",
				status: 0,
				msg: '',
				couponList:[], //优惠券列表
				isOpen:false ,//展开
				moneyBg: '/static/images/couponBg',
				text: 'ເບິ່ງເພີ່ມເຕີມ',
				timer: null,
				payResult: 'ກຳລັງກວດສອບຜົນການຊຳລະ...',
				loading: false, //是否加载中
				loadend: false, //是否加载完毕
				loadTitle: 'ໂຫຼດເພີ່ມ', //提示语
				hotScroll: false,
				hotPage: 1,
				hotLimit: 10,
				hostProduct: [],
			};
		},
		computed: configMap({recommend_switch:0}, mapGetters(['isLogin','viewColor','keyColor'])),
		onShow: function() {
		  // 获取当前页面栈
		  const pages = getCurrentPages();
		  const currentPage = pages[pages.length - 1];
		  // 获取最新参数
		  const options = currentPage.options;
		  console.log('最新参数:', options);
			if (!options.order_id) return this.$util.Tips({
				title: 'ບໍ່ມີພາລາມິເຕີ ບໍ່ສາມາດເບິ່ງສະຖານະການຊຳລະໄດ້'
			}, {
				tab: 3,
				url: 1
			});
		  // 使用最新参数更新数据
		  this.orderId = options.order_id;
		  this.order_type = options.order_type;
		  this.status = options.status || 0;
		  this.msg = options.msg || '';
		},
		onLoad: function(options) {
			if (this.isLogin) {
				this.refreshData();
				this.getHostProduct();
			} else {
				toLogin()
			}
		},
		onHide: function(){
			this.clearTimer();
		},
		methods: {
			refreshData(){
				this.timer = setInterval(()=>{
					this.getOrderPayInfo();
				},1000)
			},
			// 优惠券展开
			bindMore(){
				this.isOpen = !this.isOpen
				this.text = this.text == 'ເບິ່ງເພີ່ມເຕີມ' ? 'ຫຍໍ້' : 'ເບິ່ງເພີ່ມເຕີມ';
			},
			/**
			 *
			 * 支付完成查询支付状态
			 *
			 */
			getOrderPayInfo: function() {
				let that = this;
				getPayOrder(that.orderId).then(res => {
					that.$set(that, 'order_pay_info', res.data);
					that.$set(that, 'order_id', res.data.orderList[0]['order_id']);
					that.$set(that, 'group_order_id', res.data.orderList[0]['group_order_id']);
					that.couponList = res.data.give_coupon
					that.order_type = res.data.activity_type
					if(that.order_type == 20){
						that.payResult = res.data.paid == 1 ? 'ແລກປ່ຽນສິນຄ້າສຳເລັດ' : 'ການຊຳລະລົ້ມເຫຼວ'
					}else{
						that.payResult = res.data.paid == 1 ? 'ຊຳລະສຳເລັດ' : res.data.pay_type == 7 ? 'ສ້າງຄຳສັ່ງຊື້ສຳເລັດ' : 'ການຊຳລະລົ້ມເຫຼວ'
					}
					uni.setNavigationBarTitle({
						title: res.data.paid == 1 ? 'ຊຳລະສຳເລັດ': res.data.pay_type == 7 ? 'ຍັງບໍ່ໄດ້ຊຳລະ' : 'ການຊຳລະລົ້ມເຫຼວ'
					});
					if(res.data.paid == 1 || res.data.pay_type == 7){
						clearInterval(this.timer);
						this.timer = null;
					}
				}).catch(err => {
					clearInterval(this.timer);
					uni.hideLoading();
					this.$util.Tips({
						title: err
					}, {
						tab: 3,
						url: 1
					});
				});
			},
			/**
			 * 去首页关闭当前所有页面
			 */
			goIndex: function(e) {
				uni.switchTab({
					url: '/pages/index/index'
				});
			},
			// 去参团页面；
			goPink: function(id) {
				uni.navigateTo({
					url: '/pages/activity/combination_status/index?id=' + id
				});
			},
			/**
			 *
			 * 去订单详情页面
			 */
			goOrderDetails: function(e) {
				let that = this;
				if(that.order_type == 20){
					uni.navigateTo({
						url: `/pages/points_mall/integral_order_details?order_id=${that.order_id}`
					})
				}else{
					if (that.order_pay_info.paid == 0) {
						if(that.order_pay_info.orderList.length == 1){
							uni.navigateTo({
								url: `/pages/order_details/stay?order_id=${that.group_order_id}`
							})
						}else{
							uni.navigateTo({
								url: '/pages/users/order_list/index?status=0'
							})
						}
					} else {
						if(that.order_pay_info.orderList.length == 1) {
							uni.navigateTo({
								url: `/pages/order_details/index?order_id=${that.order_id}`
							})
						}else {
							uni.navigateTo({
								url: '/pages/users/order_list/index?status=1'
							})
						}
					}
				}
			},
			// 推荐列表
			getHostProduct: function() {
				let that = this;
				if (that.loadend) return;
				if (that.hotScroll) return;
				that.loading = true;
				that.loadTitle = "ໂຫຼດເພີ່ມ";
				getProductHot(
					that.hotPage,
					that.hotLimit,
				).then(res => {
					let list = res.data.list || [];
					that.hotPage++
					that.hotScroll = res.data.list.length < that.hotLimit
					that.hostProduct = that.hostProduct.concat(res.data.list)
					that.loading = false;
					that.loadTitle = that.hotScroll ? "ບໍ່ມີຂໍ້ມູນເພີ່ມແລ້ວ" : 'ໂຫຼດເພີ່ມ';
				});
			},
			clearTimer() {
				if (this.timer) {
					clearInterval(this.timer);
					this.timer = null;
				}
			},
		},
		onReachBottom() {
			this.getHostProduct();
		},
		destroyed() {
			this.clearTimer();
		},
		deactivated() {
			this.clearTimer();
		}
	}
</script>

<style lang="scss">
	.payment-status {
		margin: 92rpx 30rpx 30rpx;
		padding: 1rpx 0 28rpx 0;
	}
	.payment-status .icon {
		font-size: 70rpx;
		width: 140rpx;
		height: 140rpx;
		border-radius: 50%;
		color: #fff;
		text-align: center;
		line-height: 140rpx;
		border: 6rpx solid #f5f5f5;
		margin: -76rpx auto 0 auto;
		background-color: #999;
		border: 3px solid #F5F5F5;
		&.icon-duihao2{
			background-color: var(--view-theme);
			border: 3px solid #FFF1F1;
		}
	}
	.payment-status .icon.fail {
		text-shadow: 0px 4px 0px #7a7a7a;
	}
	.payment-status .status {
		font-size: 32rpx;
		font-weight: bold;
		text-align: center;
		margin: 25rpx 0 37rpx 0;
	}
	.payment-status .wrapper {
		border: 1px solid #eee;
		margin: 0 30rpx 47rpx 30rpx;
		padding: 40rpx 0 76rpx;
		border-left: 0;
		border-right: 0;
	}
	.payment-status .wrapper .item {
		font-size: 28rpx;
		color: #282828;
	}
	.payment-status .wrapper .item~.item {
		margin-top: 20rpx;
	}
	.payment-status .wrapper .item .itemCom {
		color: #666;
	}
	.payment-status .returnBnt {
		width: 630rpx;
		height: 86rpx;
		border-radius: 88rpx;
		color: #fff;
		font-size: 28rpx;
		text-align: center;
		line-height: 86rpx;
		margin: 0 auto 20rpx auto;
		&.gColor{
			background-color: var(--view-theme);
		}
		&.s-Color{
			color: var(--view-theme);
			 border: 1px solid var(--view-theme);
		}
	}
	.t-color {
		color: var(--view-theme)!important;
	}
	.coupon-wrapper{
		.hd{
			display: flex;
			align-items: center;
			justify-content: center;
			margin: 30rpx 0;
			color: #999999;
			font-size: 24rpx;
			.line{
				width: 70rpx;
				height: 1px;
				background: #DCDCDC;
			}
			.txt{
				margin: 0 20rpx;
			}
		}
		.coupon-box{
			height: 356rpx;
			padding: 0 20rpx;
			overflow: hidden;
			&.on{
				height: auto;
			}
			.coupon-item{
				width: 100%;
				margin-bottom: 20rpx;
				box-shadow:0px 2px 10px 0px rgba(0, 0, 0, 0.06);
				.left-bg{
					display: flex;
					align-items: center;
					justify-content: center;
					width: 236rpx;
					height: 160rpx;
					color: #fff;
					font-size: 64rpx;
					text{
						margin-top: 26rpx;
						font-size: 36rpx;
					}
				}
				.info{
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					margin-left: 20rpx;
					padding: 20rpx 0;
					.title{
						color: #282828;
						font-size: 30rpx;
					}
					.des{
						font-size: 24rpx;
						color: #999999;
					}
				}
			}
		}
		.more{
			display: flex;
			align-items: center;
			justify-content: center;
			padding-top: 24rpx;
			font-size: 24rpx;
			color: #999999;
			.iconfont{
				margin-top: 6rpx;
				margin-left: 10rpx;
				font-size: 20rpx;
			}
		}
	}
</style>
