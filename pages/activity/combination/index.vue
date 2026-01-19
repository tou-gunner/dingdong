<template>
	<view :style="viewColor" class="page-container">
		<view class='flash-sale'>
			<view class="fixed-head" :class="{'fixed':isFixed}">
				<view class="sys-head" :style="{height:sysHeight}"></view>
				<view class="tool-bar">
					<view class='iconfont icon-ic_leftarrow' @tap='goBack'></view>
					<user-name-swiper class="name-swiper" :style="'top:'+ (navH/2) +'rpx'" :combinationUserList="combinationUserList" :domain="domain"></user-name-swiper>
				</view>
			</view>
			<view class='head' :style="{ 'background-image': `url(${domain}/static/diy/combination${keyColor}.png)` }">
				<view class="sys-head" :style="{height:statusBarHeight}"></view>
				<view class="tool-bar"></view>
				<view class='header'>
					<view class="success_per">
						<view class="success_num">{{combinationUserCount}}人已参与拼团</view>
						<view class="activity_pic" v-if="combinationUserList.length > 0">
							<view v-for="(item,index) in combinationUserList.slice(0,10)" class="picture" :key="index">
								<image v-if="index != 9" class="avatar" :src='item.avatar ? item.avatar : "/static/images/f.png"'></image>
								<span v-else class="avatar" style="background:#fff;"><text class="iconfont icon-ic_more"></text></span>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="main_count">
				<tabNav class="tabNav" :tabTitle="navTop" @changeTab='changeTab'></tabNav>
				<view class="pad30">
					<view class='list bg-f boder-24'>
						<block v-for="(item,index) in combinationList" :key='index'>
							<view class='item acea-row row-between-wrapper' @tap='goDetails(item)'>
								<view class='pictrue'>
									<image :src='item.product.image'></image>
								</view>
								<view class='text acea-row row-column-around'>
									<view class='name line1'>{{item.product.store_name}}</view>
									<view class='booking'>
										<text class="count">
											<text class="iconfont icon-icon_team"></text>
											{{item.buying_count_num}}人团 <text class="line"></text>
											已拼{{item.sales ? item.sales : 0}}件
										</text>
									</view>
									<view class="progress">
										<view class='combination_price acea-row row-center'>
											<text class="combination_text">拼团价</text>
											<view class="price">
												<priceFormat :price="item.price" weight intSize="32" floatSize="22" labelSize="22"></priceFormat>
											</view>
										</view>
										<view class='order_btn' :style="{ 'background-image': `url(${domain}/static/diy/pink_btn${keyColor}.png)` }">去拼团</view>
									</view>
								</view>
							</view>
						</block>
					</view>
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
	import { getCombinationList, getCombinationUser, getActivitycategory } from '../../../api/activity.js';
	import home from '@/components/home/index.vue'
	import tabNav from '../components/combinNav'
	import userNameSwiper from '../components/userNameSwiper/userNameSwiper.vue'
	import { getIndexData } from '@/api/api.js';
	import { configMap } from "@/utils";
	import { HTTP_REQUEST_URL } from '@/config/app';
	// #ifndef H5
	import passwordPopup from '@/components/passwordPopup';
	// #endif
	import { mapGetters } from "vuex";
	let app = getApp();
	export default {
		components: {
			// #ifndef H5
			passwordPopup,
			// #endif
			home,
			tabNav,
			userNameSwiper
		},
		computed: configMap({statusBarHeight:0},mapGetters(['viewColor','keyColor'])),
		data() {
			return {
				sysHeight: sysHeight,
				domain: HTTP_REQUEST_URL,
				navH: '',
				combinationList: [],
				combinationUserList: [],
				combinationUserCount: 0,
				navTop: [{
					'cate_name': '精选',
					store_category_id: ''
				}],
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
				navIndex: 0,
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
				title: '拼团',
				path: 'pages/activity/combination/index',
			}
		},
		onShareTimeline: function() {
			return {
				title: '拼团活动',
				query: {
					key: ''
				},
				imageUrl: ''
			}
		},
		// #endif
		onLoad() {
			this.navH = app.globalData.navHeight;
			this.getCombinationProductList('');
			this.getIndexConfig();
			this.getCombinationUser();
		},
		methods: {
			goBack: function() {
				uni.navigateBack();
			},
			getCombinationProductList: function(store_category_id) {
				var that = this;
				var data = {
					page: that.page,
					limit: that.limit,
					store_category_id: store_category_id
				};
				if (that.pageloading) return;
				this.pageloading = true
				getCombinationList(data).then(res => {
					var combinationList = res.data.list;
					that.page++;
					that.combinationList = that.combinationList.concat(combinationList);
					uni.stopPullDownRefresh(); //结束下拉刷新
					that.page = that.page;
					that.pageloading = false;
				}).catch(err => {
					that.pageloading = false
				});
			},
			// 首页数据
			getIndexConfig: function() {
				let that = this;
				getActivitycategory(4).then(res => {
					that.navTop = that.navTop.concat(res.data)
				})
			},
			//获取参与拼团用户
			getCombinationUser: function() {
				let that = this;
				getCombinationUser({
					limit: 30
				}).then(res => {
					that.$set(that, "combinationUserCount", res.data.count);
					that.$set(that, "combinationUserList", res.data.list);
				})
			},
			// 导航分类切换
			changeTab(e) {
				let that = this
				if (that.navIndex == e.index) return
				that.navIndex = e.index;
				that.page = 1;
				that.limit = 8;
				that.combinationList = [];
				that.getCombinationProductList(e.pid)

			},
			goDetails(item) {
				uni.navigateTo({
					url: '/pages/activity/combination_details/index?id=' + item.product_group_id
				})
			}
		},
		onPullDownRefresh: function(){
			this.page = 1;
			this.pageloading = false;
			this.loadend = false;
			this.combinationList = []
			this.getCombinationProductList('');
		},
		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom: function() {
			this.getCombinationProductList('');
		},
		// 滚动监听
		onPageScroll(e) {
			this.isFixed = e.scrollTop > 60;
		}
	}
</script>

<style lang="scss" scoped>
	.page-container{
		min-height: 100vh;
		background-color: var(--view-theme);
		padding-bottom: 20rpx;
	}
	.fixed-head.fixed{
		/*#ifdef MP || APP-PLUS*/
		background: var(--view-theme);
		/*#endif*/
	}
	.icon-ic_leftarrow {
		margin-left: 20rpx;
		font-size: 40rpx;
		color: #fff;
	}
	.head {
		display: flex;
		flex-direction: column;
		/* #ifdef MP || APP-PLUS */
		height: 576rpx;
		/* #endif */
		/* #ifdef H5 */
		height: 490rpx;
		/* #endif */
		background-repeat: no-repeat;
		background-size: 100% 100%;
		width: 100%;
	}
	.name-swiper{
		margin-left: 40rpx;
	}
	.header {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		.success_per {
			width: 100%;
			text-align: center;
			left: 0;
			.success_num {
				color: #FFF1BF;
				font-size: 26rpx;
			}
		}
	}
	.activity_pic {
		margin-left: 20rpx;
		padding-left: 20rpx;
		position: relative;
		display: inline-block;
		margin-top: 17rpx;
		background: rgba(0, 0, 0, .15);
		padding: 13rpx 24rpx 13rpx 14rpx;
		border-radius: 33rpx;
		.picture {
			display: inline-block;
		}
		.avatar {
			width: 42rpx;
			height: 42rpx;
			line-height: 20rem;
			display: inline-block;
			background-repeat: no-repeat;
			background-size: center/cover;
			position: relative;
			text-align: center;
			color: #fff;
			font-weight: 600;
			vertical-align: bottom;
			font-size: .875rem;
			-webkit-user-select: none;
			-moz-user-select: none;
			-ms-user-select: none;
			user-select: none;
			border-radius: 50%;
			background-repeat: no-repeat;
			background-size: cover;
			background-position: 0 0;
			margin-right: -10rpx;
			box-shadow: 0 0 0 1px #fff;
			position: relative;
			text {
				position: absolute;
				line-height: 42rpx;
				color: #8E8E8E;
				width: 42rpx;
				left: 0;
			}
		}
	}
	.flash-sale .header {
		width: 100%;
		position: relative;
		top: 60rpx;
	}
	.flash-sale .main_count {
		position: relative;
		top: 10rpx;
		padding-bottom: 40rpx;
	}
	.flash-sale .list .item {
		position: relative;
		border-radius: 20rpx;
		padding: 30rpx;
		&::after{
			content: "";
			width: 630rpx;
			border-bottom: 1px dashed #EEEEEE;
			position: absolute;
			left: 30rpx;
			bottom: 0;
		}
		&:last-child{
			margin-bottom: 0;
			&::after{
				display: none;
			}
		}
	}
	.flash-sale .list .item .pictrue {
		width: 180rpx;
		height: 180rpx;
		border-radius: 16rpx;
	}
	.flash-sale .list .item .pictrue image {
		width: 100%;
		height: 100%;
		border-radius: 16rpx;
	}
	.flash-sale .list .item .text {
		width: 416rpx;
	}
	.flash-sale .list .item .text .name {
		width: 100%;
		font-weight: bold;
		font-size: 30rpx;
	}
	.flash-sale .list .item .text .booking {
		margin-top: 17rpx;
	}
	.flash-sale .list .item .text .booking .count {
		font-size: 22rpx;
		color: var(--view-priceColor);
		border-radius: 18rpx;
		background-color: var(--view-bgColor);
		line-height: 36rpx;
		padding: 5rpx 12rpx;
		.iconfont {
			margin-right: 10rpx;
		}
		.line {
			display: inline-block;
			width: 1rpx;
			height: 14rpx;
			background: #F49088;
			margin: 0 9rpx;
			position: relative;
			top: -3rpx;
		}
	}
	.flash-sale .list .item .text .progress {
		margin-top: 40rpx;
		overflow: hidden;
		.combination_price {
			line-height: 15px;
			padding: 8rpx 0;
			color: #282828;
			float: left;
			position: relative;
			top: 10rpx;
			.combination_text {
				font-size: 22rpx;
				margin-right: 8rpx;
			}
		}
		.order_btn {
			float: right;
			width: 145rpx;
			height: 62rpx;
			text-align: center;
			color: #FFFFFF;
			font-size: 26rpx;
			line-height: 72rpx;
			background-size: 100%;
		}
	}
</style>
