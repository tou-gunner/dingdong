<template>
	<view class='productSort'>
		<view class="title">
			ເຂົ້າຮ່ວມຫົວຂໍ້
			<text class="iconfont icon-ic_close popup-close" @click="close"></text>
		</view>
		<view class="con-box">
			<view class='aside'>
				<scroll-view scroll-y="true" style="height: 100%; overflow: hidden;">
					<view v-for="(item,index) in productList" :key="item.category_id">
						<view v-show="item.children && item.children.length > 0" class='item acea-row row-center-wrapper' :class='index==navActive?"on":""' @click='tap(index,"b"+index)'><text class="item_text">{{item.cate_name}}</text>
						 </view>
					</view>
				</scroll-view>
			</view>
			<view class='conter'>
				<scroll-view scroll-y="true" style="height: 100%; overflow: hidden;">
					<view v-for="(item,index) in childList" :key="item.topic_id">
						<view class='list' @click.stop="confirmTopic(item)">
							<view class='item acea-row'>
								<view v-if="!item.topic_id" class='no-topic'>
									<text class="iconfont icon-ic_ban1"></text>
								</view>
								<view v-else class='picture'>
									<view class="topic_bg acea-row row-center row-middle">
										<text class="iconfont icon-ic_talk_2"></text>
									</view>

									<image :src='item.pic'></image>
								</view>
								<view class="name line1">{{item.topic_name}}</view>
							</view>
						</view>
					</view>
				</scroll-view>
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
	let app = getApp();
	import { getTopicList } from '@/api/community.js';
	export default {
		data() {
			return {
				navlist: [],
				productList: [],
				navActive: 0,
				childList: []
			}
		},
		watch:{},
		mounted() {
			if (!this.productList.length) {
				this.getAllCategory();
			}
		},
		methods: {
			// 点击关闭按钮
			close() {
				this.$emit('close');
			},
			tap: function(index, id) {
				this.navActive = index;
				this.childList = this.productList[index].children
			},
			getAllCategory: function() {
				let that = this;
				let value = ""
				getTopicList().then(res => {
					let arr = [
						{category_id: "",count_use: 0,count_view: 0,pic: null,topic_id: '',topic_name: "ບໍ່ເພີ່ມຫົວຂໍ້ໃດ"}
					]
					that.productList = res.data;
					if(that.productList[0].children && that.productList[0].children.length > 0){
						that.productList[0].children=[...arr,...that.productList[0].children]
					}else{
						that.productList[0].children = arr
					}
					that.childList = that.productList[0].children;
				})
			},
			confirmTopic(item){
				this.$emit('getTopic',item);
			}
		}
	}
</script>
<style scoped lang="scss">
	.productSort {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 70vh;
		background: #ffffff;
		border-radius: 40rpx 40rpx 0 0;
		.title{
			text-align: center;
			padding: 40rpx 0;
			position: relative;
			color: #282828;
			font-size: 34rpx;
			font-weight: bold;
			.popup-close{
				position: absolute;
				right: 20rpx;
				top: 20rpx;
			}
		}
		.con-box {
			flex: 1;
			display: flex;
			overflow: hidden;
		}
	}
	.productSort .aside {
		overflow-y: auto;
		overflow-x: hidden;
		border-right: 1px solid #EEEEEE;
		width: 202rpx;
		height: 100%;
		overflow: hidden;
	}
	.productSort .aside .item {
		line-height: 100rpx;
		width: 100%;
		font-size: 28rpx;
		color: #666666;
	}
	.productSort .aside .item_text {
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}
	.productSort .aside .item.on {
		width: 100%;
		text-align: center;
		font-weight: bold;
		color: #333333;
	}
	.productSort .conter {
		flex: 1;
		height: 100%;
		padding: 0 30rpx;
		background-color: #ffffff;
		margin-top: 20rpx;
	}
	.productSort .conter .list {
		flex-wrap: wrap;
	}
	.productSort .conter .list .item {
		margin-top: 26rpx;
		margin-bottom: 40rpx;
		align-items: center;
	}
	.productSort .conter .list .item .picture,
	.productSort .conter .list .item .no-topic{
		width: 88rpx;
		height: 88rpx;
		border-radius: 100%;
		position: relative;
		.topic_bg{
			width: 88rpx;
			height: 88rpx;
			border-radius: 100%;
			position: absolute;
			top: 0;
			left: 0;
			background: rgba(0,0,0,.3);
			z-index: 10;
			.icon-ic_talk_2{
				color: #ffffff;
				font-size: 36rpx;
			}
		}
	}
	.no-topic{
		background: #f5f5f5;
		border: 1px solid rgba(112,112,112,.3);
		display: flex;
		align-items: center;
		justify-content: center;
		.iconfont {
			color: rgba(153, 153, 153, 1);
			font-size: 44rpx;
		}
	}
	.productSort .conter .listw:first-child .picture{
		&::before{
			content: "\\";
			background: #D8D8D8;
		}
	}
	.productSort .conter .list .item .picture image {
		width: 100%;
		height: 100%;
		border-radius: 100%;
	}
	.productSort .conter .list .name {
		margin-left: 30rpx;
		font-size: 28rpx;
		color: #282828;
		font-weight: bold;
		max-width: 300rpx;
	}
</style>
