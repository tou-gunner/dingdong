<template>
	<view ref="pageContainer" :style="viewColor">
		<view class='flash-sale'>
			<view class="fixed-head">
				<view class="sys-head" :style="{height:sysHeight}"></view>
				<view class="tool-bar">
					<view class='iconfont icon-ic_leftarrow' @tap='goBack'></view>
				</view>
			</view>
			<view class="saleBox" :style="{'background-image': `url(${seckill_header})`}"></view>
			<view class="seckill-count">
				<!--#ifdef MP || APP-PLUS-->
				<view v-if="isFixed" class="mp-height" :style="{height:topHeight}">
					<view class="mp-top acea-row row-middle row-center" :style="{top:sysHeight,height:sysHeight}">
						<view class='iconfont icon-ic_leftarrow' @tap='goBack'></view>
						<view>限时秒杀</view>
					</view>
				</view>
				<!--#endif-->
				<view class="seckillList acea-row row-between-wrapper" :class="{fixed:isFixed}" :style="'top:'+topHeight">
					<view class='timeLsit' :class="{'oneList' : timeList.length==1}">
						<scroll-view class="scroll-view_x" :class="{'point-none' : pageloading}" scroll-x scroll-with-animation style="width:auto;" :scroll-into-view="intoindex">
							<block v-for="(item,index) in timeList" :key='index'>
								<view @tap='settimeList(item,index)' class='item' :class="active == index?'on':''" :id='"sort"+index' :style="{'background-image': active == index ? `url(${seckill_tag})` : 'none'}">
									<view class='time semiBold'>{{item.time}}</view>
									<view class="state">{{item.state}}</view>
								</view>
							</block>
						</scroll-view>
					</view>
				</view>
				<view class='list'>
					<block v-for="(item,index) in seckillList" :key='index'>
						<view class='item acea-row row-between-wrapper' @tap='goDetails(item)'>
							<view class='pictrue'>
								<image :src='item.image'></image>
							</view>
							<view class='text acea-row row-column-between'>
								<view>
									<view class='name line1'>{{item.store_name}}</view>
								</view>
								<view>
									<view class='money'>
										<text>秒杀价：</text>
										<priceFormat :price="item.price" weight intSize="40" floatSize="26" labelSize="26"></priceFormat>
										<text class="y_money">¥{{item.ot_price}}</text>
									</view>
									<view class="progress-btn acea-row row-middle" :class="'btn'+item.skill_status" :style="{'background-image': item.skill_status == 0 ? `url(${domain}/static/images/seckill-btn0.png)` : `url(${domain}/static/images/seckill-btn.png)`}">
										<block v-if="item.skill_status == 1">
											<view class="progress">
												<view class='bg-reds' :style="'width:'+item.percent+';'"></view>
											</view>
											<view class='piece'>已抢{{item.percent}}</view>
										</block>
										<block v-else-if="item.skill_status == 0">
											<view class='piece orange'>活动即将开始</view>
										</block>
										<block v-else-if="item.skill_status == -1">
											<view class='piece'>活动已结束</view>
										</block>
									</view>
								</view>
							</view>
						</view>
					</block>
					<view class='noCommodity' v-if="seckillList.length == 0 && (page != 1 || active== 0) && loadend">
						<view class='pictrue'>
							<image :src="`${domain}/static/images/no_thing.png`"></image>
							<view>暂无商品，去看点什么吧</view>
						</view>
					</view>
				</view>
			</view>
		</view>
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
	import { getSeckillIndexTime, getSeckillList } from '../../../api/activity.js';
	// #ifndef H5
	import passwordPopup from '@/components/passwordPopup';
	// #endif
	import { mapGetters } from "vuex";
	import { configMap } from "@/utils";
	import { HTTP_REQUEST_URL } from '@/config/app';
	export default {
		components: {
			// #ifndef H5
			passwordPopup,
			// #endif
		},
		computed: configMap({statusBarHeight:0},mapGetters(['viewColor','keyColor'])),
		data() {
			return {
				sysHeight: sysHeight,
				domain: HTTP_REQUEST_URL,
				seckill_header: HTTP_REQUEST_URL+'/static/images/seckill-header-banner.png',
				seckill_tag: HTTP_REQUEST_URL+'/static/images/seckill-tag.png',
				seckillList: [],
				timeList: [],
				time_id: "",
				active: 5,
				page: 1,
				limit: 10,
				loading: false,
				loadend: false,
				pageloading: false,
				intoindex:'',
				isFixed: false,
				// #ifdef MP
				topHeight: uni.getSystemInfoSync().statusBarHeight+53+'px',
				// #endif
				// #ifndef MP
				topHeight: uni.getSystemInfoSync().statusBarHeight+'PX',
				// #endif
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
				title: '秒杀活动',
				path: 'pages/activity/goods_seckill/index',
			}
		},
		onShareTimeline: function() {
			return {
				title: '秒杀活动',
				  query: {
				    key: ''
				  },
				  imageUrl: ''
				}
		},
		// #endif
		onLoad() {
			this.getSeckillConfig();
		},
		methods: {
			goBack: function() {
				uni.navigateBack();
			},
			getSeckillConfig: function() {
				let that = this;
				getSeckillIndexTime().then(res => {
					that.timeList = res.data.seckillTime;
					that.active = res.data.seckillTimeIndex;
					that.seckill_tag =
					that.active == 0 ? that.domain+'/static/images/seckill-tag.png' :
					that.active == res.data.seckillTime.length-1 ? that.domain+'/static/images/seckill-tag-right.png' :
					that.domain+'/static/images/seckill-tag-middle.png'
					that.time_id = that.timeList[that.active].seckill_time_id;
					that.$nextTick(()=>{
						that.intoindex = 'sort'+res.data.seckillTimeIndex
					})
					let time;
					that.timeList.map((item) => {
						time = item.start_time > 9 ? item.start_time + ':00' : '0' + item.start_time + ':00';
						item.time = time;
					})
					if (that.timeList.length) {
						setTimeout(function() {
							that.loading = true
						}, 2000);
						that.seckillList = [],
						that.page = 1
						that.getSeckillList();
					}
				});
			},
			getSeckillList: function() {
				var that = this;
				var data = {
					page: that.page,
					limit: that.limit,
					start_time: that.timeList[that.active].start_time,
					end_time: that.timeList[that.active].end_time
				};
				if (that.loadend) return;
				if (that.pageloading) return;
				this.pageloading = true
				uni.showLoading({
					title: '正在加载',
				})
				getSeckillList(data).then(res => {
					var seckillList = res.data.list;
					seckillList.map((item) => {
						item.percent = item.stock === 0 ? '100%' : (item.sales*100 / (item.sales+item.stock)).toFixed(2) + '%';
					})
					var loadend = seckillList.length < that.limit;
					that.seckillList = that.page == 1 ? seckillList : that.seckillList.concat(seckillList);
					that.page++;
					uni.stopPullDownRefresh(); //结束下拉刷新
					that.pageloading = false;
					that.loadend = loadend;
					uni.hideLoading()
				}).catch(err => {
					that.pageloading = false
					uni.hideLoading()
				});
			},
			settimeList: function(item, index) {
				var that = this;
				this.active = index
				that.intoindex = 'sort'+index
				that.seckill_tag =
				that.active == 0 ? that.domain+'/static/images/seckill-tag.png' :
				that.active == that.timeList.length-1 ? that.domain+'/static/images/seckill-tag-right.png' :
				that.domain+'/static/images/seckill-tag-middle.png'
				that.loadend = false;
				that.time_id = that.timeList[that.active].seckill_time_id;
				that.page = 1;
				// that.seckillList = [];
				that.getSeckillList();
			},
			goDetails(item) {
				uni.navigateTo({
					url: '/pages/activity/goods_seckill_details/index?id='+item.product_id+'&time_id='+this.time_id
				})
			}
		},
		onPullDownRefresh: function(){
			this.page = 1;
			this.pageloading = false;
			this.loadend = false;
			this.seckillList = []
			this.getSeckillList();
		},
		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom: function() {
			this.getSeckillList();
		},
		// 滚动监听
		onPageScroll(e) {
			this.isFixed = e.scrollTop > 160;
		}
	}
</script>

<style lang="scss" scoped>
	.flash-sale .seckillList {
		border-radius: 30rpx 30rpx 0 0;
		background: rgba(255,255,255,.2);
		padding-bottom: 20rpx;
		transition: transform 0.2s ease; /* 平滑过渡 */
		will-change: transform; /* 提前告知浏览器优化 */
		&.fixed{
			position: fixed;
			top: 0;
			left: 0;
			z-index:10;
			width: 100%;
			background: #ED5C4F;
			padding-bottom: 0;
			.timeLsit {
				background: #E93323;
			}
			.item{
				padding-bottom: 0;
				&:first-child,&:last-child{
					&.on{
						padding-bottom: 16rpx;
					}
				}
			}
		}
	}
	.point-none {
		pointer-events: none;
	}
	.mp-height {
		background: #E93323;
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 10;
		.mp-top {
			color: #fff;
			position: relative;
			font-size: 32rpx;
			.iconfont {
				position: absolute;
				left: 20rpx;
				top: 50%;
				margin-top: -20rpx;
				font-size: 40rpx;
			}
		}

	}
	.seckill-count{
		margin-top: -124rpx;
	}
	.flash-sale .timeLsit {
		width: 100%;
		white-space: nowrap;
	}
	.flash-sale .timeLsit .item {
		display: inline-block;
		text-align: center;
		padding: 11rpx 40rpx 30rpx;
		box-sizing: border-box;
		background-size: 100% 100%;
		background-repeat: no-repeat;
		&.on{
			padding: 11rpx 60rpx;
			.time{
				font-size: 42rpx;
			}
		}
		&:first-child{
			&.on{
				padding: 11rpx 80rpx 30rpx 30rpx;
			}
		}
		&:last-child{
			&.on{
				padding: 11rpx 30rpx 30rpx 80rpx;
			}
		}
	}
	.flash-sale .oneList .item {
		&:last-child{
			&.on{
				padding: 11rpx 60rpx;
			}
		}
	}
	.flash-sale .timeLsit .item .time {
		font-size: 40rpx;
		font-weight: bold;
		color: #ffffff;
	}
	.flash-sale .timeLsit .item.on .time {
		color: #282828;
	}
	.flash-sale .timeLsit .item .state{
		color: #ffffff;
		font-size: 24rpx;
	}
	.flash-sale .timeLsit .item.on .state {
		width: 96rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 36rpx;
		border-radius: 200rpx;
		background: #E93323;
		color: #fff;
	}
	.flash-sale .list {
		background: #f5f5f5;
		border-radius: 24rpx;
		margin-top: -40rpx;
		padding: 32rpx 20rpx 0;
	}
	.flash-sale .list .item {
		position: relative;
		margin: 0 auto 20rpx auto;
		background-color: #fff;
		border-radius: 24rpx;
		padding: 24rpx 20rpx;
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
		width: 400rpx;
		font-size: 28rpx;
		height: 240rpx;
	}
	.flash-sale .list .item .text .name {
		width: 400rpx;
	}
	.flash-sale .list .item .text .money {
		color: #E93323;
		font-size: 22rpx;
	}
	.flash-sale .list .item .text .money .y_money {
		font-size: 22rpx;
		color: #999;
		text-decoration-line: line-through;
		margin-left: 15rpx;
	}
	.flash-sale .list .item .text .limit {
		font-size: 22rpx;
		color: #999;
		margin-bottom: 5rpx;
	}
	.flash-sale .list .item .text .limit .limitPrice {
		margin-left: 10rpx;
	}
	.flash-sale .list .item .progress-btn {
		margin-top: 24rpx;
		width: 100%;
		height: 64rpx;
		background-color: rgba(233, 51, 35, .05);
		border-radius: 16rpx 16rpx 30rpx 16rpx;
		padding-left: 16rpx;
		background-repeat: no-repeat;
		background-size: 102rpx 64rpx;
		background-position: top right;
		&.btn0{
			background-color: #FFF1E5;
			background-size: 140rpx 64rpx;
		}
	}
	.flash-sale .list .item .text .progress {
		overflow: hidden;
		background-color: rgba(233, 51, 35, .05);
		width: 160rpx;
		border-radius: 24rpx;
		height: 18rpx;
		position: relative;
		margin-right: 8rpx;
	}
	.flash-sale .list .item .text .progress .bg-reds {
		width: 0;
		height: 100%;
		transition: width 0.6s ease;
		background: linear-gradient( 90deg, #E93323 0%, #FF7931 100%);
	}
	.flash-sale .list .item .piece {
		font-size: 22rpx;
		color: #E93323;
		&.orange{
			color: #FF7D00;
		}
	}
	.flash-sale .saleBox {
		width: 100%;
		height: 604rpx;
		background-size: 100% 100%;
		background-repeat: no-repeat;
	}
</style>
