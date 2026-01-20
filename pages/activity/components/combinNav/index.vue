<template>
	<view :style="viewColor">
		<view class="navTabBox">
			<view class="longTab">
				<scroll-view scroll-x="true" style="white-space: nowrap; display: flex;height: 60rpx;" scroll-with-animation :scroll-left="tabLeft"
				 show-scrollbar="true">
					<view class="longItem" :style='"width:"+isWidth+"px"' :data-index="index" :class="index===tabClick?'click':''"
					 v-for="(item,index) in tabTitle" :key="index" :id="'id'+index" @click="longClick(index,item.store_category_id)">{{item.cate_name}}
					</view>
					<view class="underlineBox" :style='"transform:translateX("+isLeft+"px);width:"+isWidth+"px"'>
						<view class="underline bg-color-white"></view>
					</view>
				</scroll-view>
				<view class='iconfont icon-ic_downarrow' style="padding: 8rpx 0 0 8rpx;color: #fff;" @click="tabsOpen = true"></view>
			</view>
			<view class="tabs-box" v-if="tabsOpen">
				<view class="box-top">
					<view class="">
						ປ່ຽນປະເພດ
					</view>
					<view class="">
						<view class='iconfont icon-ic_uparrow' @click="tabsOpen = false"></view>
					</view>
				</view>
				<view class="all-tabs">
					<view class="tabs-style" :class="index===tabClick?'active':''" v-for="(tab,index) in tabTitle" :key='index' @click="longClick(index,tab.store_category_id)">
						<text class="line1">{{tab.cate_name}}</text>
					</view>
				</view>
			</view>
		</view>
		<view class='mask' v-if="tabsOpen" @click="tabsOpen = false"></view>
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
	import { mapGetters } from "vuex";
	let app = getApp();
	export default {
		name: 'navTab',
		props: {
			tabTitle: {
				type: Array,
				default: () => {
					[]
				}
			}
		},
		computed: mapGetters(['viewColor']),
		data() {
			return {
				tabClick: 0, //导航栏被点击
				isLeft: 0, //导航栏下划线位置
				isWidth: 0, //每个导航栏占位
				tabLeft: 0,
				swiperIndex: 0,
				childIndex: 0,
				childID: 0,
				window: false,
				tabsOpen: false
			};
		},
		created() {
			var that = this
			// 获取设备宽度
			uni.getSystemInfo({
				success(e) {
					that.isWidth = e.windowWidth / 5
				}
			})
		},
		methods: {
			// 导航栏点击
			longClick(index, id) {
				this.childIndex = 0;
				if (this.tabTitle.length > 5) {
					var tempIndex = index - 2;
					tempIndex = tempIndex <= 0 ? 0 : tempIndex;
					this.tabLeft = (index - 2) * this.isWidth //设置下划线位置
				}
				this.tabClick = index //设置导航点击了哪一个
				this.isLeft = index * this.isWidth //设置下划线位置
				let obj = {
					index: index,
					pid: id
				}
				this.parentEmit(obj);
				this.tabsOpen = false
			},
			parentEmit(obj) {
				this.$emit('changeTab', obj);
			}
		}
	}
</script>

<style lang="scss">
	@keyframes bounce-in {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}
	.navTabBox {
		width: 100%;
		box-sizing: border-box;
		padding: 0 20rpx;
		position: relative;
		.tabs-box {
			position: absolute;
			top: 0;
			left: 30rpx;
			display: flex;
			flex-direction: column;
			width: 690rpx;
			background-color: #FFFFFF;
			border-radius: 24rpx;
			z-index: 999;
			animation: bounce-in .3s;
			.box-top {
				padding: 30rpx 30rpx 10rpx 40rpx;
				display: flex;
				justify-content: space-between;
				font-size: 28rpx;
				.iconfont {
					color: #666;
					font-size: 36rpx;
				}
			}
			.all-tabs {
				display: flex;
				flex-wrap: wrap;
				padding: 20rpx 30rpx;
				font-size: 24rpx;
				.tabs-style {
					display: flex;
					justify-content: center;
					background: #F2F2F2;
					border-radius: 29px;
					color: #282828;
					padding: 10rpx 20rpx;
					white-space: nowrap;
					border-radius: 30px;
					width: 146rpx;
					margin: 0 10rpx 10rpx 0;
					&:last-child {
						margin-right: 0;
					}
				}
				.active {
					background: var(--view-minorColor);
					color: var(--view-theme);
					border: 1px solid var(--view-theme);
				}
			}
		}
		.longTab {
			display: flex;
			width: 95%;
			/* #ifdef H5 */
			padding-bottom: 20rpx;
			/* #endif */
			/* #ifdef MP */
			padding-top: 12rpx;
			padding-bottom: 12rpx;
			/* #endif */
			.longItem {
				height: 50upx;
				display: inline-block;
				line-height: 50upx;
				text-align: center;
				font-size: 30rpx;
				color: rgba(255, 255, 255, .8);
				max-width: 160rpx;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				overflow-x: scroll;
				overflow-y: hidden;
				/*解决ios上滑动不流畅*/
				-webkit-overflow-scrolling: touch;
				&.click {
					font-weight: bold;
					font-size: 30rpx;
					color: #FFFFFF;
				}
			}
			.underlineBox {
				height: 3px;
				width: 20%;
				display: flex;
				align-content: center;
				justify-content: center;
				transition: .5s;
				.underline {
					width: 60rpx;
					height: 4rpx;
				}
			}
		}
	}
	.bg-color-white {
		background-color: #fff;
	}
</style>
