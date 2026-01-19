<template>
	<view class="page_count" :style="[wrapperStyle]">
		<view v-if="dataConfig.styleConfig.tabVal === 2" class="relative fullscreen-banner-wrap">
			<swiper autoplay class="fullscreen-banner" :circular="circular" :interval="intervals" :duration="duration"
				:current="swiperCur" @change="swiperChange">
				<swiper-item v-for="(item, index) in dataConfig.swiperConfig.list" :key="index">
					<image :src="item.img" :style="[imageStyle]" mode="aspectFill" class="slide-image" @click="goDetail(item)">
					</image>
				</swiper-item>
			</swiper>
			<HomeCombSwiperDot :dataConfig="dataConfig" :swiperCur="swiperCur" />
			<HomeCombTop :dataConfig="dataConfig" :isScrolled="isScroll" :special="special" :tabActiveIndex="tabActiveIndex"
				@change="changeTab" :compCount="compCount" />
		</view>
		<template v-else>
			<view class="bg-img" v-if="imgUrls.length">
				<image class="bg-img-item" :class="{ active: index == swiperCur }" v-for="(i, index) in imgUrls" :src="i.img"
					:key="index">
				</image>
			</view>
			<view class="bag-gradient" :style="[bgGradientStyle]"></view>
			<!--搜索-->
			<HomeCombTop :dataConfig="dataConfig" :isScrolled="isScroll" :special="special" :tabActiveIndex="tabActiveIndex"
				@change="changeTab" :compCount="compCount" />
			<view class="swiperBg" :style="{ paddingBottom: isMenu ? '20rpx' : '20rpx' }">
				<view class="swiper page_swiper" v-if="imgUrls.length">
					<swiper :autoplay="true" :circular="circular" :interval="intervals" :duration="duration" :current="swiperCur"
						:previous-margin="swiperMargin" :next-margin="swiperMargin" @change="swiperChange" class="swiper">
						<block v-for="(item, index) in imgUrls" :key="index">
							<swiper-item :class="{ active: index == swiperCur, scalex: isScale }" class="swiper-item">
								<view @click="goDetail(item)" class="slide-navigator acea-row row-between-wrapper">
									<image :src="item.img" :style="[imageStyle]" mode="aspectFill" class="slide-image"></image>
								</view>
							</swiper-item>
						</block>
					</swiper>
					<HomeCombSwiperDot :dataConfig="dataConfig" :swiperCur="swiperCur" />
				</view>
			</view>
		</template>
	</view>
</template>

<script>
import HomeCombTop from "./components/home-comb-top.vue";
import HomeCombSwiperDot from "./components/home-comb-swiper-dot.vue";
import { diyUtil } from "@/utils/diy";
const statusBarHeight = uni.getSystemInfoSync().statusBarHeight;

export default {
	name: 'homeComb',
	components: {
		HomeCombTop,
		HomeCombSwiperDot
	},
	inject: ["parentDiyId", "parentMerId"],
	props: {
		dataConfig: {
			type: Object,
			default: () => { }
		},
		compCount: { // 组件数量
			type: Number,
			default: 0
		},
		index: {
			type: Number,
			default: 0
		},
		isScroll: {
			type: Boolean,
			default: false
		},
		isScale: {
			type: Boolean,
			default: false
		},
		isMenu: {
			type: Boolean,
			default: false
		},
		special: {
			type: Number,
			default: 0
		},
		belongIndex: {
			type: Number,
			default: 0
		},
		tabActiveIndex: {
			type: Number,
			default: 0
		}
	},
	data() {
		return {
			statusBarHeight: this.index === 0 ? statusBarHeight : 0,
			autoplay: true,
			interval: this.dataConfig.numConfig.val * 1000 || 2500,
			duration: 500,
			isLeft: 0, //导航栏下划线位置
			isWidth: 0, //每个导航栏占位

			tabLeft: 0,
			tabTitle: [],
			isTop: 0,
			navHeight: 38,
			indicatorDots: false,
			circular: true,
			intervals: 3000,
			imgUrls: [], //图片轮播数据
			swiperCur: 0,
			searchVal: '',
			bgColor: this.dataConfig.swiperConfig.list.length ? this.dataConfig.swiperConfig.list[0].img : '',
			bgColorLeft: '',
			bgColorRight: '',
			fixConfig: this.dataConfig.searchFix.tabVal,

			firstImgRatio: 2.3
		};
	},
	computed: {
		wrapperStyle() {
			return {
				'--first-img-ratio': this.firstImgRatio
			};
		},
		bgGradientStyle() {
			return {
				'background-image': `linear-gradient(to bottom, rgba(245,245,245,0) 0%, rgba(245,245,245,0) 50%, ${this.dataConfig.gradientColor ? this.dataConfig.gradientColor.color[0].item : '#f5f5f5'
					} 100%)`
			};
		},
		swiperMargin() {
			return this.dataConfig.styleConfig.tabVal ? '50rpx' : '10rpx';
		},


		locationStyle() {
			return {
				"--location-color": this.isScroll ? "#333" : "#fff"
			};
		},
		imageStyle() {
			let borderRadius = `${this.dataConfig.filletImg.val * 2}rpx`;
			if (this.dataConfig.filletImg.type) {
				borderRadius = `${this.dataConfig.filletImg.valList[0].val * 2}rpx ${this.dataConfig.filletImg.valList[1].val * 2}rpx ${this.dataConfig.filletImg.valList[3].val * 2}rpx ${this.dataConfig.filletImg.valList[2].val * 2
					}rpx`;
			}
			return {
				'border-radius': borderRadius
			};
		},
	},
	created() {
		var that = this;
		that.imgUrls = that.dataConfig.swiperConfig.list;
		this.calcFirstImgRatio();
	},
	methods: {
		async calcFirstImgRatio() {
			const firstImg = this.imgUrls[0];
			if (!firstImg || !firstImg.img) return;
			const [error, result] = await uni.getImageInfo({
				src: firstImg.img
			});
			if (error) return;
			this.firstImgRatio = result.width / result.height;
		},
		changeTab(index) {
			this.$emit("change", index);
		},
		goDetail(url) {
			const urls = diyUtil.checkUrl(url.info[1].value, this.parentMerId);
			this.$util.JumpPath(urls);
		},
		goProductDetail(item) {
			uni.navigateTo({
				url: '/pages/goods_details/index?id=' + item.product_id
			});
		},
		//替换安全域名
		setDomain: function (url) {
			url = url ? url.toString() : '';
			//本地调试打开,生产请注销
			if (url.indexOf('https://') > -1) return url;
			else return url.replace('http://', 'https://');
		},
		swiperChange(e) {
			let { current, source } = e.detail;
			if (source === 'autoplay' || source === 'touch') {
				this.swiperCur = e.detail.current;
				this.bgColor = this.imgUrls[e.detail.current]['img'];
			}
		},


	}
};
</script>

<style lang="scss" scoped>
.scrollColor {
	transition: background-color 0.5s ease;
	background-color: #fff;
	color: #333 !important;

	.longItem {
		// color: #333 !important;

		&.click {
			&::after {
				background: #333 !important;
			}
		}
	}
}

.page_count {
	position: relative;
	overflow: hidden;

	.bag-gradient {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		overflow: hidden;
		z-index: 0;
	}

	.bg-img {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		z-index: 0;
		filter: blur(0);
		overflow: hidden;

		.bg-img-item {
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			filter: blur(30rpx);
			transform: scale(1.5);
			opacity: 0;
			transition: opacity 0.5s ease;

			&.active {
				opacity: 1;
				transform: scale(1.5);
			}
		}
	}
}






.scrolled {
	z-index: 99;
	position: fixed;
	left: 0;
	top: 0;
	width: 100%;
	background-color: #fff;

	.underline {
		background: #000 !important;
	}

	.input,
	.uninput {
		background: rgba(0, 0, 0, 0.22) !important;
	}

	.click {
		&::after {
			background-color: #fff !important;
		}
	}
}

.swiperBg {
	z-index: 1;

	.page_swiper {
		position: relative;
		width: 100%;
		height: auto;
		margin: 0 auto;
		border-radius: 15rpx;
		overflow-x: hidden;
		// z-index: 20;
		padding: 5rpx 10rpx 0;

		.swiper {
			height: auto;
			aspect-ratio: var(--first-img-ratio);
			width: 100%;
			display: block;
		}

		.swiper-item {
			border-radius: 15rpx;
		}

		.swiper-item,
		.slide-image,
		.acea-row.row-between-wrapper {
			width: 100%;
			height: 100%;
			margin: 0 auto;
			border-radius: 15rpx;
		}

		.slide-image {
			transform: scale(0.93);
			transition: all 0.6s ease;
		}

		.swiper-item.active,
		.swiper-item.scalex {
			.slide-image {
				transform: scale(1);
			}
		}

	}
}

/deep/.dot0 .uni-swiper-dots-horizontal {
	left: 10%;
}

/deep/.dot1 .uni-swiper-dots-horizontal {
	left: 50%;
}

/deep/.dot2 .uni-swiper-dots-horizontal {
	left: 90%;
}

.water-flow-wrapper {
	padding-inline: 10px;
}

.fullscreen-banner {
	position: absolute;
	inset: 0;
	height: auto;

	.slide-image {
		width: 100%;
		height: 100%;
		display: block;
	}
}

.fullscreen-banner-wrap {
	aspect-ratio: var(--first-img-ratio);
}
</style>
