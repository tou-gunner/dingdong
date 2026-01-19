<template>
	<view class="container" :style="viewColor">
		<view class='flash-sale'>
			<view class="sys-head fixed">
				<view class="sys-bar" :style="{height:sysHeight}"></view>
				<!-- #ifdef MP  || APP-PLUS -->
				<view class="sys-title">
					<view class='iconfont icon-ic_leftarrow' :style="{top:sysHeight}" @tap='goBack'></view>
					<text v-show="isFixed">预售列表</text>
				</view>
				<!-- #endif -->
				<view v-if="isFixed" class="bg"></view>
			</view>
			<view class='header'>
				<image mode="widthFix" class="presellBg" :src="domain+'/static/images/presell_header_banner.png'" alt="">
			</view>
			<view class="main_count pad20">
				<view class="presellList acea-row" :style="{'background-image':  `url(${nav_bg})`}">
					<view class='timeList'>
						<block v-for="(item,index) in timeList" :key='index'>
							<view @tap='settimeList(item,index)' class='item' :class="active == index?'on':''">
								<view class='time'><text>{{item}}</text></view>
							</view>
						</block>
					</view>
				</view>
				<view class='list bg-f'>
					<block v-if="presellList.length>0" v-for="(item,index) in presellList" :key='index'>
						<view class='item acea-row row-between-wrapper' @tap='goDetails(item)'>
							<view class='pictrue'>
								<image :src='item.product.image'></image>
							</view>
							<view class='text acea-row row-column-between'>
								<view class='name line2'>{{item.store_name}}</view>
								<view class="item_tags acea-row row-middle">
									<text v-if="item.coupon" class='font-bg-red'>领券</text>
									<text class="tags_item" v-if="item.product.delivery_free == 1">包邮</text>
								</view>
								<view class="progress" :class="active==1 ? '' : 'progress-gray'" :style="'background-image:url('+domain+'/static/images/presell_buy_btn'+active+'.png'">
									<view class='presell_price acea-row'>
										<text class="presell_text">预售:</text>
										<view class="price">
											<priceFormat :price="item.price" weight intSize="40" floatSize="26" labelSize="28"></priceFormat>
										</view>
									</view>
								</view>
							</view>
						</view>
					</block>
					<block v-if="presellList.length == 0">
						<view class="empty-box">
							<image :src="domain+'/static/images/empty-box.png'"></image>
							<view class="txt">暂无预售商品,去看看其他商品吧～</view>
						</view>
					</block>
				</view>
			</view>
		</view>
		<home></home>
		<!-- #ifndef H5 -->
		<passwordPopup></passwordPopup>
		<!-- #endif -->
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
	import {
		getSeckillIndexTime,
		getPresellList
	} from '../../../api/activity.js';
	import home from '@/components/home/index.vue'
	// #ifndef H5
	import passwordPopup from '@/components/passwordPopup';
	// #endif
	import { configMap } from "@/utils";
	import { mapGetters } from "vuex";
	import { HTTP_REQUEST_URL } from '@/config/app';
	export default {
		computed: configMap({statusBarHeight:0},mapGetters(['viewColor','keyColor'])),
		components: {
			// #ifndef H5
			passwordPopup,
			// #endif
			home,
		},
		data() {
			return {
				sysHeight: sysHeight,
				domain: HTTP_REQUEST_URL,
				nav_bg: HTTP_REQUEST_URL+"/static/images/presell_nav_current1.png",
				presellList: [],
				timeList: [
					'未开始',
					'正在进行',
					'已结束'
				],
				active: 1,
				type: 0,
				scrollLeft: 0,
				interval: 0,
				status: 1,
				page: 1,
				limit: 10,
				loading: false,
				loadend: false,
				pageloading: false,
				isFixed: false,
			}
		},
		/**
		 * 用户点击右上角分享
		 */
		// #ifdef MP
		onShareAppMessage: function() {
			wx.showShareMenu({
				withShareTicket: true,
				menus: ['shareAppMessage', 'shareTimeline']
			})
			return {
				title: '预售活动',
				path: 'pages/activity/presell/index',
			}
		},
		onShareTimeline: function() {
			return {
				title: '预售活动',
				  query: {
				    key: ''
				  },
				  imageUrl: ''
				}
		},
		// #endif
		onLoad() {
			this.getPresellProductList();
		},
		methods: {
			goBack: function() {
				uni.navigateBack();
			},
			getPresellProductList: function() {
				var that = this;
				var data = {
					page: that.page,
					limit: that.limit,
					type: that.active
				};
				if (that.loadend) return;
				if (that.pageloading) return;
				this.pageloading = true
				getPresellList(data).then(res => {
					console.log(res);
					var presellList = res.data.list;
					var loadend = presellList.length < that.limit;
					that.page++;
					that.presellList = that.presellList.concat(presellList),
					uni.stopPullDownRefresh(); //结束下拉刷新
					that.pageloading = false;
					that.loadend = loadend;
				}).catch(err => {
					that.pageloading = false
				});
			},
			settimeList: function(item, index) {
				var that = this;
				that.active = index
				that.type = that.active;
				that.nav_bg = that.domain+'/static/images/presell_nav_current'+that.active+'.png';
				that.loadend = false;
				that.page = 1;
				that.presellList = [];
				that.getPresellProductList();
			},
			goDetails(item) {
				uni.navigateTo({
					url: '/pages/activity/presell_details/index?id=' + item.product_presell_id
				})
			}
		},
		onPullDownRefresh: function(){
			this.page = 1;
			this.pageloading = false;
			this.loadend = false;
			this.presellList = []
			this.getPresellProductList();
		},
		// 滚动监听
		onPageScroll(e) {
			this.isFixed = e.scrollTop > 60;
		},
		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom: function() {
			this.getPresellProductList();
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		min-height: 100vh;
		background: linear-gradient( 270deg, #6D4ADC 0%, #7033D7 98%);
	}
	.sys-head .bg{
		background: #7033D7;
	}
	.noCommodity{
		border-top: none;
	}
	.flash-sale .header {
		width: 100%;
		position: relative;
	}
	.flash-sale .main_count{
		position: relative;
		margin-top: -40rpx;
		padding-bottom: 60rpx;
		padding-bottom: calc(60rpx + constant(safe-area-inset-bottom)); ///兼容 IOS<11.2/
		padding-bottom: calc(60rpx + env(safe-area-inset-bottom)); ///兼容 IOS>11.2/
	}
	.flash-sale .header .presellBg {
		width: 750rpx;
		box-sizing: border-box;
	}
	.flash-sale .presellList {
		bottom: 0;
		height: 112rpx;
		background: rgb(211,219,252);
		border-radius: 24rpx 24rpx 0 0;
		background-size: 100% 100%;
		background-repeat: no-repeat;
	}
	.flash-sale .timeList {
		display: flex;
		justify-content: center;
		margin: 0 auto;
		width: 100%;
	}
	.flash-sale .timeList .item {
		font-size: 20rpx;
		color: #666;
		text-align: center;
		box-sizing: border-box;
		width: 33.333%;
		padding: 26rpx 0;
	}
	.flash-sale .timeList .item .time {
		font-size: 26rpx;
		color: #666666;
	}
	.flash-sale .timeList .item.on .time {
		color: #7033D7;
		font-size: 32rpx;
		font-weight: 500;
		span{
			position: relative;
			&::after{
				content: '';
				display: inline-block;
				width: 100%;
				height: 5rpx;
				background: #7033D7;
				position: absolute;
				left: 0;
				bottom: -8rpx;
				border-radius: 2rpx;
			}
		}
	}
	.item_tags{
		margin-top: 16rpx;
	}
	.item_tags .tags_item {
		display: flex;
		font-size: 20rpx;
		text-align: center;
		border-radius: 5rpx;
		padding: 0 4rpx;
		height: 28rpx;
		align-items: center;
		justify-content: center;
		margin-right: 8rpx;
		color: #E93323;
		border: 1px solid #E93323;
	}
	.flash-sale .list{
		border-radius: 24rpx;
		margin-top: -20rpx;
	}
	.flash-sale .list .item {
		height: 278rpx;
		position: relative;
		padding: 0 20rpx;
	}
	.flash-sale .list .item .pictrue {
		width: 240rpx;
		height: 240rpx;
		border-radius: 16rpx;
	}
	.flash-sale .list .item .pictrue image {
		width: 100%;
		height: 100%;
		border-radius: 16rpx;
	}
	.flash-sale .list .item .text {
		width: 406rpx;
		height: 240rpx;
	}
	.flash-sale .list .item .text .name {
		width: 100%;
		font-size: 28rpx;
	}
	.flash-sale .list .item .text .progress {
		width: 392rpx;
		height: 68rpx;
		background-size: 180rpx 68rpx;
		background-position: top right;
		background-repeat: no-repeat;
		background-color: rgba(233, 51, 35, .1);
		border-radius: 12rpx;
		&.progress-gray{
			opacity: .6;
		}
		.presell_price{
			width: 50%;
			padding: 16rpx 0 16rpx 16rpx;
			color: #E93323;
			align-items: flex-end;
			.presell_text{
				font-size: 22rpx;
				font-weight: bold;
				margin-right: 6rpx;
			}
		}
	}
	.empty-box{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 100rpx 0 120rpx;
		image{
			width: 414rpx;
			height: 305rpx;
		}
		.txt{
			font-size: 26rpx;
			color: #999;
		}
	}
</style>
