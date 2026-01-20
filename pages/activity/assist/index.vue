<template>
	<view class="page_container" :style="{ backgroundImage: `url(${domain}assist_bg.png)` }">
		<view class='bargain-list'>
			<view class="sys-head fixed">
				<view class="sys-bar" :style="{height:sysHeight}"></view>
				<!-- #ifdef MP || APP-PLUS -->
				<view class="sys-title">
					<view class='iconfont icon-ic_leftarrow' :style="{top:sysHeight}" @tap='goBack'></view>
					<text v-show="isFixed">ລາຍການຊ່ວຍເຫຼືອ</text>
				</view>
				<!-- #endif -->
				<view v-if="isFixed" class="bg"></view>
			</view>
			<view class='list bg-f boder-24'>
				<block v-for="(item,index) in assistList" :key="index">
					<view class='item acea-row row-between-wrapper' @tap="openSubscribe(item.product_assist_id)">
						<view class='pictrue'>
							<image :src='item.product.image'></image>
						</view>
						<view class='text acea-row row-column-around'>
							<view class='name line2'>{{item.store_name}}</view>
							<view class="num acea-row row-middle">
								<text class='iconfont icon-ic_fire'></text>
								<text class="font-bold">{{item.user_count}}ຄົນກຳລັງເຂົ້າຮ່ວມ</text>
							</view>
							<view class='money font-bold'>ຕ່ຳສຸດ:
								<priceFormat :price="item.assistSku && item.assistSku[0].assist_price" weight intSize="40" floatSize="24" labelSize="24"></priceFormat>
							</view>
							<view class="price regular">¥{{item.product.price}}</view>
						</view>
						<view class='cutBnt'></text>ເລີ່ມຊ່ວຍເຫຼືອ</view>
					</view>
				</block>
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
	import { getAssistList, initiateAssistApi } from '../../../api/activity.js';
	import home from '@/components/home/index.vue';
	import { getUserInfo } from '@/api/user.js';
	import { mapGetters } from "vuex";
	import { configMap } from "@/utils";
	import { HTTP_REQUEST_URL } from '@/config/app';
	import { toLogin } from '@/libs/login.js';
	// #ifndef H5
	import passwordPopup from '@/components/passwordPopup';
	// #endif
	export default {
		components: {
			home,
			// #ifndef H5
			passwordPopup,
			// #endif
		},
		data() {
			return {
				sysHeight: sysHeight,
				domain: HTTP_REQUEST_URL+'/static/images/',
				topImage: '',
				assistList: [],
				active: 0,
				type: 0,
				scrollLeft: 0,
				interval: 0,
				status: 1,
				page: 1,
				limit: 10,
				loading: false,
				loadend: false,
				pageloading: false,
				userInfo: {},
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
				title: 'ກິດຈະກຳຊ່ວຍເຫຼືອ',
				path: 'pages/activity/assist/index',
			}
		},
		onShareTimeline: function() {
			return {
				title: 'ກິດຈະກຳຊ່ວຍເຫຼືອ',
				  query: {
				    key: ''
				  },
				  imageUrl: ''
				}
		},
		// #endif
		computed: configMap({statusBarHeight:0},mapGetters(['isLogin'])),
		watch:{
		 isLogin:{
			handler:function(newV,oldV){
				if(newV){
					this.getUserInfo();
					this.getAssistProductList();
				}
			},
			deep:true
		 }
		},
		onLoad() {
			this.getAssistProductList();
			if (this.isLogin) {
				this.getUserInfo();
			}
		},
		methods: {
			goBack: function() {
				uni.navigateBack();
			},
			getAssistProductList: function() {
				var that = this;
				var data = {
					page: that.page,
					limit: that.limit,
				};
				if (that.loadend) return;
				if (that.pageloading) return;
				that.pageloading = true
				getAssistList(data).then(res => {
					var assistList = res.data.list;
					var loadend = assistList.length < that.limit;
					that.page++;
					that.assistList = that.assistList.concat(assistList);
					uni.stopPullDownRefresh(); //结束下拉刷新
					that.pageloading = false;
					that.loadend = loadend;
				}).catch(err => {
					that.pageloading = false
				});
			},
			openSubscribe: function(id) {
				if(this.isLogin){
					initiateAssistApi(id).then(res => {
						let id = res.data.product_assist_set_id;
						uni.hideLoading();
						uni.navigateTo({
							url: '/pages/activity/assist_detail/index?id='+id
						});
					}).catch((err) => {
						uni.showToast({
							title:err,
							icon:'none'
						})
					});
				}else{
					toLogin()
				}
			},
			/*
			 * 获取用户信息
			 */
			getUserInfo: function() {
				let that = this;
				getUserInfo().then(res => {
					that.$set(that, 'userInfo', res.data);
				});
			},
		},
		onPullDownRefresh: function(){
			this.page = 1;
			this.pageloading = false;
			this.loadend = false;
			this.assistList = []
			this.getAssistProductList();
		},
		// 滚动监听
		onPageScroll(e) {
			this.isFixed = e.scrollTop > 60;
		},
		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom: function() {
			this.getAssistProductList();
		}
	}
</script>

<style lang="scss">
	.page_container {
		width: 100%;
		min-height: 100vh;
		background-size: 100% 926rpx;
		background-repeat: no-repeat;
		padding-top: 470rpx;
	}
	.sys-head .bg{
		background: #E93323;
	}
	.bargain-list .list {
		margin: 0 20rpx;
		padding: 20rpx 24rpx 0;
		position: relative;
		top: -50rpx;
	}
	.bargain-list .list .item {
		position: relative;
		padding: 20rpx 0;
	}
	.bargain-list .list .item .pictrue {
		width: 240rpx;
		height: 240rpx;
	}
	.bargain-list .list .item .pictrue image {
		width: 100%;
		height: 100%;
		border-radius: 16rpx;
	}
	.bargain-list .list .item .text {
		width: 400rpx;
	}
	.bargain-list .list .item .text .name {
		font-size: 28rpx;
		overflow:hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}
	.bargain-list .list .item .text .num {
		font-size: 22rpx;
		color: #E93323;
		margin-top: 8rpx;
	}
	.bargain-list .list .item .text .num .iconfont {
		font-size: 30rpx;
		margin-right: 4rpx;
	}
	.bargain-list .list .item .text .money {
		font-size: 22rpx;
		color: #E93323;
		margin-top: 34rpx;
	}
	.bargain-list .list .item .text .price {
		font-size: 26rpx;
		color: #999999;
		text-decoration-line: line-through;
		margin-top: 10rpx;
	}
	.bargain-list .list .item .cutBnt {
		position: absolute;
		width: 140rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50rpx;
		font-size: 24rpx;
		color: #fff;
		height: 56rpx;
		right: 0;
		bottom: 20rpx;
		background: linear-gradient( 90deg, #FF7931 0%, #E93323 100%);
	}
	.bargain-list .list .item .cutBnt .iconfont {
		margin-right: 8rpx;
		font-size: 30rpx;
	}
	.bargain-list .list .load {
		font-size: 24rpx;
		height: 85rpx;
		text-align: center;
		line-height: 85rpx;
	}

</style>
