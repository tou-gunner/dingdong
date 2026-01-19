<template>
	<view class='product-bg'>
		<swiper
		:indicator-dots="indicatorDots"
		indicator-color="#fff"
		indicator-active-color="#e93323"
		:circular="circular"
		 :interval="interval"
		 :duration="duration"
		 :style="'height:'+(imageH)+'px;'"
		 @change="change">
			<block v-for="(item,index) in imgUrls" :key='index'>
				<swiper-item>
					<image
					class="slide-image"
					:src="item"
					@click='getpreviewImage(item)'
					:mode="isAuto ?  'aspectFill' : 'heightFix'"
					:style="{height:imageH + 'px'}"/>
				</swiper-item>
			</block>
		</swiper>
		<view class="swiper-images-number acea-row row-middle row-center">
			{{currents}}/{{imgUrls.length}}
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
			isType: {
				type: Number,
				default: 1
			},
			imageH: {
				type: Number,
				default: 500
			},
			isAuto: {
				type: Boolean,
				default: true
			}
		},
		data() {
			return {
				currents: 1,
				circular: true,
				autoplay: true,
				interval: 5000,
				duration: 500,
				controls: true,
			};
		},
		computed: {
			indicatorDots() {
				return this.imgUrls.length > 1;
			}
		},
		created() {
		},
		watch: {

		},
		mounted() {},
		methods: {
			getpreviewImage: function(item) {
				uni.previewImage({
					urls: this.imgUrls,
					current: item
				});
			},
			change: function(e) {
				this.$set(this, 'currents', e.detail.current + 1);
			},
		}
	}
</script>

<style scoped lang="scss">
	.product-bg {
		width: 710rpx;
		position: relative;
	}
	.swiper-images-number {
		width: 60rpx;
		height: 41rpx;
		position: absolute;
		background: rgba(40, 40, 40, .5);
		top: 20rpx;
		right: 20rpx;
		border-radius: 22rpx;
		font-size: 20rpx;
		color: #fff;
		z-index: 10;
	}
	.product-bg swiper {
		width: 100%;
		position: relative;
		text-align: center;
	}
	.product-bg .slide-image {
		width: 100%;
		height: 100%;
		border-radius: 24rpx;

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
	#myVideo {
		width: 100%;
		height: 100%
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
</style>
