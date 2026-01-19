<template>
	<view :style="viewColor">
		<!-- 自定义顶部背景颜色 -->
		<view class="top">
			<!-- #ifdef MP || APP-PLUS -->
			<view class="sys-head fixed">
				<view class="sys-bar" :style="{height:sysHeight}"></view>
				<!-- #ifdef MP -->
				<view class="sys-title"><view class='iconfont icon-ic_leftarrow' @tap='goBack'></view>积分详情</view>
				<!-- #endif -->
				<view class="bg"></view>
			</view>
			<!-- #endif -->
		</view>
		<!-- 自定义顶部背景颜色 -->
		<view class='integral-details' :style="{marginTop:marTop}">
			<view class='header'>
				<view class="my-points">
					<view class="acea-row row-middle">
						<image class="points-icon" :src="`${domain}/static/images/points-icon.png`"></image>
						<text>我的积分</text>
						<view class="tip-text acea-row row-middle">
							<text class="iconfont icon-ic_horn1"></text>
							<text>您有部分积分将于{{userInfo.clear&&userInfo.clear.nextClearDay}}过期！</text>
						</view>
					</view>
					<view class="scoreNum semiBold">{{userInfo.integral ? userInfo.integral : 0}}</view>
				</view>
				<image class="picture" :src="`${domain}/static/images/points_coins.png`"></image>
				<!--积分详情-->
				<view class="points-detail" :style="{ backgroundImage: `url(${domain}/static/images/points_detail_bg.png)` }">
					<view class="acea-row row-middle">
						<view class="title">积分详情</view>
						<navigator class="details" hover-class='none' url='/pages/users/user_points_list/index'>积分明细 <text class="iconfont icon-ic_rightarrow"></text></navigator>
					</view>
					<view class='nav acea-row'>
						<view class='item'>
							<view class='num semiBold'>{{userInfo.totalGainIntegral || 0}}</view>
							<view>累计积分</view>
						</view>
						<view class='item'>
							<view class='num semiBold'>{{userInfo.deductionIntegral || 0}}</view>
							<view>累计消费</view>
						</view>
						<view class='item'>
							<view class='num semiBold'>{{userInfo.lockIntegral || 0}}</view>
							<view>冻结积分</view>
						</view>
					</view>
				</view>
			</view>
			<view class="wrapper">
				<view class="bg-f boder-24 points-play">
					<view class="titles">互动玩积分</view>
					<view class="acea-row row-between">
						<view class="item" :style="{ backgroundImage: `url(${domain}/static/images/interact_bg1.png)` }">
							<view class="item-t">下单抵扣</view>
							<view class="item-info">积分特惠抵现金</view>
							<navigator class='btn acea-row row-middle row-center' hover-class='none' url='/pages/index/index' open-type='switchTab'>
								去下单
							</navigator>
						</view>
						<view class="item" :style="{ backgroundImage: `url(${domain}/static/images/interact_bg2.png)` }">
							<view class="item-t">积分兑换</view>
							<view class="item-info">积分商城兑好礼</view>
							<navigator class='btn acea-row row-middle row-center' hover-class='none' url='/pages/points_mall/index'>
								去兑换
							</navigator>
						</view>
					</view>
				</view>

			</view>
			<view class='wrapper'>
				<view v-if="integral_status" class='list2 boder-24 bg-f'>
					<view class="titles">做任务赚积分</view>
						<navigator class='item acea-row row-between-wrapper' open-type='switchTab' hover-class='none' url='/pages/index/index'>
							<view class='pictrue'>
								<image :src="`${domain}/static/images/earn_points1.png`"></image>
							</view>
							<view class="item-text acea-row row-between-wrapper">
								<view class='name'>
									<view class="name-t">购买商品</view>
									<view class="name-info">购买商品可获得积分</view>
								</view>
								<view class='earn'>去完成</view>
							</view>
						</navigator>
						<navigator class='item acea-row row-between-wrapper' hover-class='none' url='/pages/users/user_sgin/index'>
							<view class='pictrue'>
								<image :src="`${domain}/static/images/earn_points2.png`"></image>
							</view>
							<view class="item-text acea-row row-between-wrapper">
								<view class='name'>
									<view class="name-t">每日签到</view>
									<view class="name-info">每日签到可获得积分</view>
								</view>
								<view class='earn'>去完成</view>
							</view>
						</navigator>
						<view class='item acea-row row-between-wrapper' @click="shareIntegral">
							<view class='pictrue'>
								<image :src="`${domain}/static/images/earn_points3.png`"></image>
							</view>
							<view class="item-text acea-row row-between-wrapper">
								<view class='name'>
									<view class="name-t">邀请好友</view>
									<view class="name-info">邀请好友可获得<text>{{integral_user_give}}积分</text></view>
								</view>
								<view class='earn'>去完成</view>
							</view>
						</view>
						<navigator class='item acea-row row-between-wrapper' hover-class='none' open-type='navigate' url='/pages/plant_grass/index'>
							<view class='pictrue'>
								<image :src="`${domain}/static/images/earn_points4.png`"></image>
							</view>
							<view class="item-text acea-row row-between-wrapper">
								<view class='name'>
									<view class="name-t">发布种草</view>
									<view class="name-info">发布种草可获得<text>{{integral_community_give}}积分</text></view>
								</view>
								<view class='earn'>去完成</view>
							</view>
						</navigator>
					</view>
				</view>
				<!-- <view class='list' :hidden='current != 0' >
					<view class='tip' v-if="userInfo.clear && userInfo.clear.status && userInfo.clear.nextClearIntegral > 0"><text class='iconfont icon-shuoming'></text>
						<text class="tip-text">提示：您有部分积分将于{{userInfo.clear.nextClearDay}}过期，请尽快使用！</text>
					</view>
					<view class='item acea-row row-between-wrapper' v-for="(item,index) in integralList" :key="index">
						<view>
							<view class='state line1'>{{item.mark}}</view>
							<view>{{item.create_time}}</view>
						</view>
						<block v-if="item.pm">
							<view class="p-color acea-row acea-row row-between-wrapper">
								<text v-if="item.status == 0" class="item-label">冻结中</text>
								<view class='p-color num semiBold'>+{{item.number}}</view>
							</view>
						</block>
						<view class='num semiBold' v-else>-{{item.number}}</view>
					</view>
					<view class='loadingicon acea-row row-center-wrapper' v-if="integralList.length>0">
						<text class='loading iconfont icon-jiazai' :hidden='loading==false'></text>{{loadTitle}}
					</view>
					<view v-if="integralList.length == 0">
						<emptyPage title="暂无积分记录哦～" :noImage="`${domain}/static/images/noRecord.png`"></emptyPage>
					</view>
				</view> -->

		</view>
		<view class="instructions" v-if="showProtocol">
			<view class="agreement-count">
				<view class="setAgCount">
					<view class="title">积分说明</view>
					<view class="agBox">
						<view class="content">
							<jyf-parser :html="protocol" ref="article" :tag-style="tagStyle"></jyf-parser>
						</view>
					</view>
				</view>
				<text class="icon iconfont icon-ic_close1" @click="showProtocol = false"></text>
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
	let sysHeight = uni.getSystemInfoSync().statusBarHeight + 'px';
	import { getIntegralInfo, getIntegralList, getAgreementApi } from '@/api/user.js';
	import { mapGetters } from "vuex";
	import { configMap } from '@/utils';
	import emptyPage from '@/components/emptyPage.vue';
	import parser from "@/components/jyf-parser/jyf-parser";
	import { toLogin } from '@/libs/login.js';
	import { HTTP_REQUEST_URL } from '@/config/app';
	const app = getApp();
	export default {
		components: {
			emptyPage,
			"jyf-parser": parser,
		},
		data() {
			return {
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
				domain: HTTP_REQUEST_URL,
				navList: [{
						'name': '分值明细',
						'icon': 'icon-ic_list'
					},
					{
						'name': '分值提升',
						'icon': 'icon-a-icon_Scoreincrease'
					}
				],
				current: 0,
				page: 1,
				limit: 10,
				integralList: [],
				userInfo:{},
				loadend: false,
				loading: false,
				loadTitle: '加载更多',
				showProtocol: false,
				protocol: '',
				tagStyle: {
					img: 'width:100%;display:block;',
					video: 'width:100%;'
				},
				integral_status: true,
			};
		},
		computed: {
			...mapGetters(['isLogin','viewColor']),
			...configMap(['integral_user_give','integral_community_give']),
		},
		onLoad() {
			if (this.isLogin) {
				this.getUserInfo();
			} else {
				toLogin()
			}
			this.getAgreement();
		},
		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom: function () {
			this.getIntegralList();
		},
		methods: {
			goBack: function() {
				uni.navigateBack();
			},
			getUserInfo: function() {
				let that = this;
				getIntegralInfo().then(function(res) {
					that.$set(that,'userInfo',res.data);
					that.getIntegralList()
				}).catch(res => {
					this.integral_status = false
					return that.$util.Tips({
						title: res
					}, {
						tab: 3,
						url: 1
					});
				});
			},
			/*获取积分说明*/
			getAgreement() {
				let that = this
				getAgreementApi('sys_integral_rule').then(res => {
					that.protocol = res.data.sys_integral_rule
				})
			},
			/**
			 * 获取积分明细
			 */
			getIntegralList: function() {
				let that = this;
				if (that.loading) return;
				if (that.loadend) return;
				that.loading = true;
				that.loadTitle = '';
				getIntegralList({
					page: that.page,
					limit: that.limit
				}).then(function(res) {
					let list = res.data.list,
					loadend = list.length < that.limit;
					that.integralList = that.$util.SplitArray(list, that.integralList);
					that.$set(that,'integralList',that.integralList);
					that.page = that.page + 1;
					that.loading = false;
					that.loadend = loadend;
					that.loadTitle = loadend ? '哼~😕我也是有底线的~' : "加载更多";
				}, function(res) {
					that.loading = false;
					that.loadTitle = '加载更多';
				});
			},
			shareIntegral(){
				uni.setStorageSync('isIntegral',true)
				uni.switchTab({
					url: '/pages/index/index'
				});
			},
			nav: function(current) {
				this.current = current;
			}
		}
	}
</script>

<style scoped lang="scss">
	@keyframes kf {
		0% {
			transform: translateY(8rpx);
		}

		100% {
			transform: translateY(0);
		}
	}
	.sys-title .iconfont{ position: absolute; left: 30rpx; }
	.sys-head .bg { background: linear-gradient(90deg, var(--view-bntColor22) 0%, var(--view-bntColor21) 100%); }
	.integral-details .header {
		position: relative;
		background-repeat: no-repeat;
		width: 100%;
		// max-height: 480rpx;
		padding: 40rpx 20rpx 20rpx 20rpx;
		box-sizing: border-box;
		background-size: 100% 100%;
		background-image: linear-gradient( 90deg, var(--view-bntColor22) 0%, var(--view-bntColor21) 100%);
		.picture {
			position: absolute;
			width: 412rpx;
			height: 376rpx;
			right: 0;
			top: 22rpx;
			-webkit-animation: kf 1.2s linear .8s infinite alternate;
			animation: kf 1.2s linear .8s infinite alternate;
		}
	}
	.integral-details .points-icon {
		width: 16px;
		height: 16px;
		margin-right: 4rpx;
	}
	.integral-details .my-points {
		padding: 0 10rpx;
		color: #fff;
	}
	.integral-details .my-points .tip-text {
		padding: 12rpx 16rpx;
		background: rgba(0,0,0,0.1);
		border-radius: 100rpx;
		color: #fff;
		font-size: 22rpx;
		margin-left: 16rpx;
		.iconfont {
			font-size: 28rpx;
			margin: 2rpx 8rpx 0 0;
		}
	}
	.integral-details .scoreNum {
		font-size: 64rpx;
		margin-top: 20rpx;
	}
	.points-detail {
		width: 100%;
		background-size: 100% 100%;
		margin-top: 30rpx;
		padding: 20rpx 32rpx 42rpx;
		position: relative;
		z-index: 9;
		.title {
			font-size: 32rpx;
			font-weight: 600;
		}
		.details {
			color: var(--view-theme);
			font-size: 22rpx;
			margin-left: 16rpx;
			.iconfont {
				font-size: 22rpx;
			}
		}
	}
	.wrapper {
		padding: 0 20rpx 20rpx;
		.titles {
			font-size: 32rpx;
			font-weight: 500;
			margin: 8rpx 0 32rpx;
		}
		.points-play {
			margin-top: 20rpx;
			padding: 24rpx;
			.item {
				width: 320rpx;
				height: 230rpx;
				border-radius: 16rpx;
				padding: 32rpx 30rpx;
				position: relative;
				background-position: right bottom;
				background-size: 130rpx 146rpx;
				background-repeat: no-repeat;
				&::before {
					content: "";
					width: 100%;
					height: 60%;
					opacity: .3;
					position: absolute;
					top: 0;
					left: 0;
					z-index: 0;
					border-radius: 16rpx;
				}
				&:first-child {
					&::before {
						background: linear-gradient( 180deg, #FFE2D9 0%, rgba(255,255,255,0) 100%);
					}
				}
				&:last-child {
					&::before {
						background: linear-gradient( 180deg, #FAE7C0 0%, #FFFFFF 100%);
					}
				}
				.item-t {
					font-size: 28rpx;
					font-weight: 500;
				}
				.item-info {
					color: #999;
					margin-top: 12rpx;
				}
				.btn {
					margin-top: 28rpx;
					width: 128rpx;
					height: 54rpx;
					border-radius: 50rpx;
					background: linear-gradient( 90deg, var(--view-bntColor22) 0%, var(--view-bntColor21) 100%);
					font-size: 24rpx;
					color: #fff;
				}
			}
		}
	}

	.integral-details .header .nav {
		font-size: 22rpx;
		flex: 1;
		margin-top: 48rpx;
	}
	.integral-details .header .nav .item {
		width: 33.33%;
		text-align: center;
		color: #999;
		position: relative;
		&::after {
			content: "";
			display: block;
			width: 2rpx;
			height: 42rpx;
			background: #DDDDDD;
			position: absolute;
			right: 0;
			top: 50%;
			margin-top: -21rpx;
		}
		&:last-child {
			&::after {
				display: none;
			}
		}
	}
	.integral-details .header .nav .item .num {
		font-size: 40rpx;
		margin-bottom: 14rpx;
		color: #282828;
	}
	.p-color {
		color: var(--view-priceColor);
	}
	.item-label{
		font-size: 18rpx;
		display: flex;
		width: 76rpx;
		height: 26rpx;
		text-align: center;
		justify-content: center;
		background-color: var(--view-bgColor);
		margin-right: 6rpx;
		font-weight: normal;
	}
	.integral-details .item .orange-text {
		color: #FF7F00;
		margin-top: 4rpx;
	}
	.integral-details .wrapper .nav .item:nth-of-type(2).on {
		border-radius: 0 20rpx 0 0;
	}
	.integral-details .wrapper .nav .item .iconfont {
		font-size: 38rpx;
		margin-right: 10rpx;
	}
	.integral-details .wrapper .list {
		background-color: #fff;
		padding: 24rpx 30rpx;
		min-height: calc(100vh - 460rpx);
	}
	.integral-details .wrapper .list .tip {
		font-size: 25rpx;
		width: 690rpx;
		border-radius: 50rpx;
		background-color: #fff5e2;
		border: 1px solid #ffeac1;
		color: #c8a86b;
		padding: 10rpx 20rpx 10rpx 55rpx;
		box-sizing: border-box;
		margin-bottom: 24rpx;
		position: relative;
	}
	.integral-details .wrapper .list .tip .iconfont {
		font-size: 35rpx;
		margin-right: 15rpx;
		position: absolute;
		top: 10rpx;
		left: 16rpx;
	}
	.integral-details .wrapper .list .item {
		padding: 24rpx 0;
		border-bottom: 1rpx solid #eee;
		font-size: 24rpx;
		color: #999;
	}
	.integral-details .wrapper .list .item .state {
		font-size: 28rpx;
		color: #282828;
		margin-bottom: 18rpx;
		max-width: 400rpx;
	}
	.integral-details .wrapper .list .item .num {
		font-size: 36rpx;
		color: #16AC57;
		&.p-color{
			color: var(--view-priceColor);
		}
	}
	.integral-details .wrapper .list2 {
		padding: 24rpx 32rpx;
	}
	.integral-details .wrapper .list2 .item {
		width: 100%;
		height: 140rpx;
		position: relative;
		border-radius: 24rpx;
		padding: 32rpx 0;
		box-sizing: border-box;

	}
	.integral-details .wrapper .list2 .item .pictrue {
		width: 90rpx;
		height: 90rpx;
		margin-right: 16rpx;
	}
	.integral-details .wrapper .list2 .item .pictrue image {
		width: 100%;
		height: 100%;
	}
	.integral-details .wrapper .list2 .item .item-text {
		flex: 1;
	}
	.integral-details .wrapper .list2 .item .name .name-info {
		color: #999999;
		font-size: 24rpx;
		margin-top: 8rpx;
		text {
			color: var(--view-theme);
		}
	}
	.integral-details .wrapper .list2 .item .earn {
		font-size: 24rpx;
		background: linear-gradient( 90deg, var(--view-bntColor22) 0%, var(--view-bntColor21) 100%);
		display: flex;
		align-items: center;
		justify-content: center;
		height: 56rpx;
		width: 120rpx;
		border-radius: 50rpx;
		color: #fff;
	}

</style>
