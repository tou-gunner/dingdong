<template>
	<view class='product-bg product-swiper'>
		<swiper :indicator-dots="indicatorDots" :autoplay="autoplay" :circular="circular"
		 :interval="interval" :duration="duration" @change="change" v-if="isPlay" :current="count">
			<!-- #ifndef APP-PLUS -->
			<swiper-item v-if="videoline">
				<view class="item">
					<view v-show="!controls" class="item-box">
						<video
							id="myVideo"
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
					></video>
					</view>
					<view class="poster" v-show="controls">
						<image class="image" :src="videoCoverImg"></image>
					</view>
					<view class="stop" v-show="controls" @tap="bindPause">
						<image class="image" :src="`${domain}/static/images/video_stop.png`"></image>
					</view>
				</view>
			</swiper-item>
			<!-- #endif -->
			<!-- #ifdef APP-PLUS -->
			<swiper-item v-if="videoline">
				<view class="item">
					<view class="poster" v-show="controls">
						<image class="image" :src="videoCoverImg"></image>
					</view>
					<view class="stop" v-show="controls" @tap="bindPause">
						<image class="image" :src="`${domain}/static/images/video_stop.png`"></image>
					</view>
				</view>
			</swiper-item>
			<!-- #endif -->
			<block v-for="(item, index) in imgUrls" :key="index">
				<swiper-item>
					<image :src="item" class="slide-image" @click="getpreviewImage(item,index)" />
				</swiper-item>
			</block>
		</swiper>
		<!-- #ifdef APP-PLUS -->
		<view v-if="!isPlay" style="width: 100%; height: 750rpx">
		  <video
				id="myVideo"
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
				@ended="handleVideoPlayEnd"
		    ></video>
		</view>
		<!-- #endif -->
		<!-- <swiper v-if="isPlay" class="reverse-swiper">
			<block v-for="(item, index) in imgUrls" :key="index">
				<swiper-item >
					<image :src="currentImg" class="slide-image reverse" />
				</swiper-item>
			</block>
		</swiper> -->
		<!--{{dotCount}}{{showDot}}{{imgUrls.length}}-->
		<view class="swiper-dot" v-if="dotCount > 1 && showDot == 1">
			<block v-for="(_, index) in dotCount" :key="index">
				<view class="dot_item h-4 rd-2rpx" :style="{ 'background-color': currents == index ? '#fff' : 'rgba(255,255,255,0.4)', width: dotWidth + 'rpx' }"></view>
			</block>
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
	import { HTTP_REQUEST_URL } from '@/config/app';
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
			showDot: {
				type: Number,
				default: 1
			},
			autoHeight: {
				type: Number,
				default: 0
			},
		},
		data() {
			return {
				domain: HTTP_REQUEST_URL,
				indicatorDots: false,
				circular: true,
				autoplay: true,
				interval: 5000,
				duration: 500,
				currents: 0,
				count: 0,
				currentImg: this.imgUrls[0] || this.videoCoverImg,
				controls: true,
				isPlay: true,
				videoContext: '',
				dotCount: this.imgUrls.length,
				imgHeight:375
			};
		},
		computed: {
			dotWidth() {
				let windowWidth = uni.getSystemInfoSync().windowWidth;
				return (windowWidth * 2 - (60 + (this.imgUrls.length - 1) * 12)) / this.imgUrls.length;
			},
			swiperHeight() {
				let windowWidth = uni.getWindowInfo().windowWidth;
				let that = this;
				if(this.autoHeight){
					if(this.videoline){
						return {
							height: '750rpx'
						};
					}else{
						uni.getImageInfo({
							src: this.imgUrls[0],
							success: (image) => {
								that.imgHeight = image.height * windowWidth / image.width;
							}
						});
						return {
							height: `${this.imgHeight}px`
						};
					}
				}else{
					return {
						height: '750rpx'
					};
				}
			}
		},
		created() {

		},
		watch: {
			imgUrls(nVal, oVal) {
				this.currents = 0;
				this.$set(this, 'currentImg', (this.videoline && this.count == 0) ? this.videoCoverImg :  this.imgUrls[this.count]);
				this.dotCount = this.imgUrls.length;
			},
			currents(val){
				if(val != 0){
					this.controls = true;
				}
			},
		},
		mounted() {
			if (this.videoline) {
				this.currentImg = this.videoCoverImg
				this.dotCount = this.imgUrls.length+1
			}
			// #ifndef APP-PLUS
			this.videoContext = uni.createVideoContext('myVideo', this);
			// #endif
		},
		methods: {
			handleVideoPlayEnd() {
				this.videoPause();
				if (this.count + 1 < this.imgUrls.length) {
					this.$nextTick(() => {
						this.count++;
					});
				}
			},
			getpreviewImage: function(item) {
				uni.previewImage({
					urls: this.imgUrls,
					current: item
				});
			},
			videoPause(e) {
				// #ifdef APP-PLUS
				this.isPlay = true
				this.autoplay = true
				// #endif
			},
			bindPause: function() {
				// #ifndef APP-PLUS
				this.videoContext.play();
				this.$set(this, 'controls', false)
				this.autoplay = false
				// #endif
				// #ifdef APP-PLUS
				this.isPlay = false
				this.videoContext = uni.createVideoContext('myVideo', this);
				this.$nextTick(()=>{
					this.videoContext.play();
				})
				// #endif
			},
			change: function(e) {
				this.$set(this, 'count', e.detail.current);
				this.$set(this, 'currents', e.detail.current);
				this.$set(this, 'currentImg', (this.videoline && e.detail.current == 0) ? this.videoCoverImg :  this.imgUrls[e.detail.current]);
			},
			endedFun() {
				this.controls = true
			}
		}
	}
</script>

<style scoped lang="scss">
	.product-bg {
		width: 100%;
		height: 750rpx;
		position: relative;
	}
	.product-bg swiper,::v-deep  .uni-swiper-wrapper {
		width: 100%;
		height: 750rpx;
		position: relative;
	}
	.reverse-swiper {
		position: absolute;
		bottom: 2rpx;
		left: 0;
	}
	.product-bg .slide-image,::v-deep  uni-swiper-item {
		width: 100%;
		height: 750rpx;
		line-height: 1;
	}
	.reverse {
		transform: scaleY(-1);
	}
	.product-bg .pages {
		position: absolute;
		background-color: #fff;
		height: 34rpx;
		padding: 0 10rpx;
		border-radius: 3rpx;
		right: 30rpx;
		bottom: 30rpx;
		line-height: 34rpx;
		font-size: 24rpx;
		color: #050505;
	}
	video {
		width: 100%;
		height: 730rpx;
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
	}
	.product-bg .item .stop .image {
		width: 100%;
		height: 100%;
	}
	.swiper-dot {
		width: 100%;
		position: absolute;
		left: 0;
		bottom: 18rpx;
		z-index: 20;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 0 30rpx;
	}
	.dot_item {
		height: 4rpx;
		border-radius: 2rpx;
	}
	.dot_item ~ .dot_item {
		margin-left: 12rpx;
	}
</style>
