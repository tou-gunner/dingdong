<template>
	<view class='product-bg'>
		<swiper :indicator-dots="indicatorDots" :autoplay="autoPlay" :circular="circular"
		 :interval="interval" :duration="duration" @change="change" v-if="isPlay">
			<!-- #ifndef APP-PLUS -->
			<swiper-item v-if="videoline">
				<view class="item">
					<view v-show="!controls" class="item-box">
						<video
							:id="'myVideo'+productIdx"
							:src="videoline"
							objectFit="cover"
							controls
							show-center-play-btn
							show-mute-btn="true"
							auto-pause-if-navigate
							:custom-cache="false"
							:enable-progress-gesture="false"
							:poster="videoCoverImg"
							@pause="videoPause"
							style="width: 710rpx;height: 710rpx;"
					></video>
					</view>
					<view class="poster" v-if="controls">
						<image class="image" :src="videoCoverImg"></image>
					</view>
					<view class="stop" v-if="controls" @tap="bindPause">
						<text class="iconfont icon-ic_right2"></text>
					</view>
				</view>
			</swiper-item>
			<!-- #endif -->
			<block v-for="(item,index) in imgUrls" :key='index'>
				<swiper-item>
					<image :src="item" class="slide-image" :style="'height:'+ imageH +'rpx;'" mode="aspectFill" />
				</swiper-item>
			</block>
		</swiper>
		<!--轮播图总数和当前轮播的图片-->
		<view class="swiper-images-number">
			<text class="current-num">{{currents}}</text>
			<text class="all-num">{{imgUrls.length}}</text>
		</view>
		<!-- #ifdef APP-PLUS -->
		<!-- <video
			 v-if="!isPlay"
			:id="'myVideo'+productIdx"
			:src="videoline"
			objectFit="cover"
			controls
			show-center-play-btn
			show-mute-btn="true"
			autoplay="true"
			auto-pause-if-navigate
			:custom-cache="false"
			:enable-progress-gesture="false"
			:poster="videoCoverImg"
			@pause="videoPause"
			style="width:710rpx;height:710rpx;"
		  ></video> -->
		<!-- <view v-if="!isPlay" style="width: 100%; height: 710rpx;">
			<video id="myVideo" :src='videoline && (videoline.substring(0,4) == "http" || videoline.substring(0,5) == "https") ? videoline : "http:" + videoline'
			 objectFit="cover" controls style="width:710rpx;height:710rpx;" show-center-play-btn show-mute-btn="true"
			 auto-pause-if-navigate :enable-progress-gesture="false" :poster="videoCoverImg" @pause="videoPause" @ended="endedFun()"></video> -->

		</view>
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
	export default {
		props: {
			imgUrls: {
				type: Array,
				default: function() {
					return [];
				}
			},
			videoline: {
				type: String,
				value: ""
			},
			videoCoverImg: {
				type: String,
			},
			autoPlay: {
				type: Boolean,
				value: false
			},
			productIdx: {
				type: Number,
				value: 0
			},
			imageH: {
				type: Number || String,
				value: 710
			}
		},
		data() {
			return {
				// autoplay: false,
				indicatorDots: false,
				circular: true,
				interval: 3000,
				duration: 500,
				currents: "1",
				controls: true,
				isPlay: true,
				videoContext: '',
				activeIndex: 0
			};
		},
		created() {

		},
		watch: {

		},
		mounted() {
			let that = this
			// #ifndef APP-PLUS
			this.videoContext = uni.createVideoContext('myVideo'+this.productIdx, this);
			// #endif
		},
		methods: {
			//替换安全域名
			setDomain: function(url) {
				url = url ? url.toString() : '';
				//本地调试打开,生产请注销
				if (url.indexOf("https://") > -1) return url;
				else return url.replace('http://', 'https://');
			},
			getpreviewImage: function(item) {
				uni.previewImage({
					urls: this.imgUrls,
					current: item
				});
			},
			videoPause(index) {
				this.videoContext = uni.createVideoContext('myVideo'+this.productIdx, this);
				// #ifndef APP-PLUS
				uni.createVideoContext('myVideo'+index, this).pause();
				this.videoContext.play();
				this.$set(this, 'controls', true)
				// #endif
			},
			bindPause: function() {
				this.videoContext = uni.createVideoContext('myVideo'+this.productIdx, this);
				// #ifndef APP-PLUS
				this.videoContext.play();
				this.$set(this, 'controls', false)
				this.$emit('playToggle',false)
				// #endif
				// #ifdef APP-PLUS
				this.isPlay = false
				this.$nextTick(()=>{
					this.videoContext.play();
				})
				// #endif
			},
			change: function(e) {
				this.$set(this, 'currents', e.detail.current + 1);
			},
			endedFun() {
				this.controls = true
			},
		},
		// 滚动监听
		onPageScroll(e) {

		},
	}
</script>

<style scoped lang="scss">
	.product-bg {
		width: 100%;
		height: 710rpx;
		position: relative;
	}
	.product-bg swiper {
		width: 100%;
		height: 100%;
		position: relative;
		border-radius: 24rpx 24rpx 0 0;
	}
	.product-bg .slide-image {
		width: 100%;
		height: 100%;
		border-radius: 24rpx 24rpx 0 0;
	}
	.product-bg .item {
		position: relative;
		width: 100%;
		height: 100%;
	}
	.product-bg .item .poster {
		position: absolute;
		top: 0;
		left: 0;
		height: 750rpx;
		width: 100%;
		z-index: 9;
	}
	.product-bg .item .poster .image {
		width: 100%;
		height: 100%;
	}
	.product-bg .item .stop {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 136rpx;
		height: 136rpx;
		margin-top: -68rpx;
		margin-left: -68rpx;
		z-index: 9;
		/*#ifndef APP-PLUS*/
		border-radius: 100%;
		background: rgba(0,0,0,.5);
		display: flex;
		align-items: center;
		justify-content: center;
		/*#endif*/
	}
	.product-bg .item .stop .image {
		width: 100%;
		height: 100%;
	}
	.product-bg .item .stop .iconfont{
		font-size: 60rpx;
		color: #fff;
	}
	.swiper-images-number{
		position: absolute;
		bottom: 40rpx;
		right: 30rpx;
		color: #fff;
		min-width: 80rpx;
		height: 36rpx;
		line-height: 36rpx;
		border-radius: 200rpx;
		text-align: center;
		background: rgba(0,0,0,0.3);
		.current-num,.all-num{
			display: inline-block;

			height: 36rpx;
			border-radius: 100rpx;
		}
		.current-num{
			width: 40rpx;
			background: rgba(0,0,0,0.1);
		}
		.all-num {
			padding: 0 12rpx 0 8rpx;
		}
	}

</style>
