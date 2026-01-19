<template>
	<view class="evaluateWtapper">
		<view class="evaluateItem" v-for="(item, indexw) in reply" :key="indexw">
			<view class="pic-text acea-row row-middle">
				<view class="pictrue">
					<image :src="item.avatar || '/static/images/f.png'"></image>
				</view>
				<view class="acea-row row-middle">
					<view class="name line1">{{ item.nickname }}</view>
					<view class="start" :style="'width:'+(item.rate/5)*124+'rpx;background-image: url('+domain+'/static/diy/score2'+keyColor+'.png)'"></view>
				</view>
			</view>
			<view class="time">{{ item.create_time }} {{ item.sku ? item.sku : '' }}</view>
			<view class="evaluate-infor">{{ item.comment }}</view>
			<view v-if="isEvaluation" class="imgList acea-row" :class="'imgList'+item.pics.length">
				<block v-for="(itemn, indexn) in item.pics" :key="indexn">
					<view class="pictrue" :class="'pictrue'+item.pics.length" @click='getpreviewImage(indexw, indexn)'>
						<image :src="itemn"></image>
						<text v-if="item.pics.length>6 && indexn == 5" class="morePic">+{{item.pics.length-4}}</text>
					</view>
					<view v-if="item.pics.length==4 && indexn==1" class="pictrue pictrue4"></view>
				</block>
			</view>
			<view v-else class="imgList acea-row image-detail-List">
				<block v-for="(itemn, indexn) in item.pics" :key="indexn">
					<view class="pictrue" v-if="indexn<=3" @click='getpreviewImage(indexw, indexn)'>
						<image v-if="indexn <=4 " :src="itemn"></image>
						<text v-if="item.pics.length>4 && indexn == 3" class="morePic">+{{item.pics.length-3}}</text>
					</view>
				</block>
			</view>
			<view class="reply" v-if="item.merchant_reply_content">
				<text>ຜູ້ຂາຍ</text>：{{item.merchant_reply_content}}
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
	import { mapGetters } from "vuex";
	import { HTTP_REQUEST_URL } from '@/config/app';
	export default {
		props: {
			reply: {
				type: Array,
				default: () => []
			},
			isEvaluation: {
				type: Boolean,
				default: false
			},
			oneLine: {
				type: Boolean,
				default: false
			}
		},
		computed: mapGetters(['keyColor']),
		components: {},
		data: function() {
			return {
				domain: HTTP_REQUEST_URL
			};
		},
		methods: {
			getpreviewImage: function(indexw, indexn) {
				console.log(this.reply)
				uni.previewImage({
					urls: this.reply[indexw].pics,
					current: this.reply[indexw].pics[indexn]
				});
			}
		},
		// 滚动监听
		onPageScroll(e) {}
	}
</script>
<style lang="scss">
	.evaluateWtapper{
		margin-top: 20rpx;
	}
	.evaluateWtapper .evaluateItem {
		background-color: #fff;
		margin-bottom: 20rpx;
		border-radius: 24rpx;
		padding: 24rpx 30rpx;
	}
	.evaluateWtapper .evaluateItem .pic-text {
		font-size: 26rpx;
		color: #282828;
	}
	.evaluateWtapper .evaluateItem .pic-text .pictrue {
		width: 56rpx;
		height: 56rpx;
		margin-right: 20rpx;
	}
	.evaluateWtapper .evaluateItem .pic-text .pictrue image {
		width: 100%;
		height: 100%;
		border-radius: 50%;
	}
	.evaluateWtapper .evaluateItem .pic-text .name {
		max-width: 450rpx;
		margin-right: 15rpx;
	}
	.evaluateWtapper .evaluateItem .time {
		font-size: 22rpx;
		color: #999999;
		margin-top: 26rpx;
	}
	.evaluateWtapper .evaluateItem .evaluate-infor {
		font-size: 28rpx;
		color: #282828;
		margin-top: 30rpx;
		line-height: 44rpx;
	}
	.evaluateWtapper .evaluateItem .imgList {
		margin-top: 20rpx;
		display: flex;
	}
	.evaluateWtapper .evaluateItem .imgList.imgList2{
		justify-content: space-between;
	}
	.evaluateWtapper .evaluateItem .imgList.image-detail-List .pictrue {
		width: 152rpx;
		height: 152rpx;
		margin: 0 12rpx 10rpx 0;
		position: relative;
		border-radius: 16rpx;
		&:last-child{
			margin-right: 0;
		}
		image{
			width: 152rpx!important;
			height: 152rpx!important;
			border-radius: 16rpx;
		}
	}
	.evaluateWtapper .evaluateItem .imgList .pictrue {
		width: 220rpx;
		height: 220rpx;
		margin: 0 10rpx 10rpx 0;
		position: relative;
		border-radius: 16rpx;
		uni-image,image{
			width: 220rpx;
			height: 220rpx;
			border-radius: 16rpx;
		}
		&.pictrue1{
			width: 400rpx;
			height: 400rpx;
			uni-image,image{
				width: 400rpx;
				height: 400rpx;
			}
		}
		&.pictrue2{
			width: 340rpx;
			height: 340rpx;
			margin: 0;
			uni-image,image{
				width: 340rpx;
				height: 340rpx;
			}
		}
		&.pictrue3,&.pictrue4{
			width: 220rpx;
			height: 220rpx;
			uni-image,image{
				width: 220rpx;
				height: 220rpx;
			}
		}
		&.pictrue3{
			margin: 0;
			flex: 3;
		}
		&.pictrue4{
			margin: 0 10rpx 10rpx 0;
		}
	}
	.evaluateWtapper .evaluateItem .imgList .morePic{
		position: absolute;
		width: 152rpx;
		height: 152rpx;
		color: #ffffff;
		font-size: 40rpx;
		text-align: center;
		top: 0;
		left: 0;
		background: rgba(0,0,0,.5);
		padding-top: 50rpx;
		box-sizing: border-box;
		border-radius: 16rpx;
	}

	.evaluateWtapper .evaluateItem .reply {
		font-size: 26rpx;
		color: #454545;
		background-color: #f7f7f7;
		border-radius: 5rpx;
		margin-top: 20rpx;
		padding: 30rpx;
		position: relative;
		text{
			color: var(--view-theme);
		}
	}
	.evaluateWtapper .evaluateItem .reply::before {
		content: "";
		width: 0;
		height: 0;
		border-left: 20rpx solid transparent;
		border-right: 20rpx solid transparent;
		border-bottom: 30rpx solid #f7f7f7;
		position: absolute;
		top: -30rpx;
		left: 40rpx;
	}
	.start{
		position: relative;
		top: 4rpx;
	}

</style>
