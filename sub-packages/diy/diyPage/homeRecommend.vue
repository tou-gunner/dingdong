<template>
	<view :style="[commonCssVars]" v-if="explosiveMoney.length" class="home-recommend relative">
		<view>
			<view class="hot-img">
				<!--单行展示-->
				<block v-if="tabConfig == 0">
					<view class="item skeleton-rect" v-for="(item, index) in explosiveMoney" :key="index" @click="goDetail(item)">
						<view class="title area-row">{{ item.info[0].value }}</view>
						<view class="msg area-row line1">{{ item.info[1].value }}</view>
						<view class="img">
							<image class="image" :src="item.img"></image>
						</view>
					</view>
				</block>
				<!--多行展示-->
				<block v-if="tabConfig == 1">
					<view class="bd">
						<view class="item skeleton-rect" v-for="(item, index) in explosiveMoney" :key="index"
							@click="goDetail(item)">
							<view class="left">
								<view class="title area-row">{{ item.info[0].value }}</view>
								<view class="msg area-row line1">{{ item.info[1].value }}</view>
							</view>
							<view class="img">
								<image class="image" :src="item.img"></image>
							</view>
						</view>
					</view>
				</block>
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
import { merPath } from "@/utils/index"
import { diyUtil } from '@/utils/diy';

export default {
	name: 'homeRecommend',
	props: {
		dataConfig: {
			type: Object,
			default: () => { }
		},
		merId: {
			type: String || Number,
			default: ''
		},
		index: {
			type: Number,
			default: 0
		}
	},
	computed: {
		commonCssVars() {
			const {
				imageRound,
				imageShadowConfig,
				ptConfig,
				bottomBgColor,
				topConfig,
				bottomConfig,
				prConfig,
				mbConfig,
				fillet,
				shadowConfig,
			} = this.dataConfig;
			return {
				'--image-round': diyUtil.buildBorderRadius(imageRound),
				'--image-shadow': diyUtil.buildShadowStyle(imageShadowConfig),

				'--comp-bg-color': diyUtil.buildLinearColor(bottomBgColor),
				'--comp-top-pd': topConfig.val + "px",
				'--comp-bottom-pd': bottomConfig.val + "px",
				'--comp-pr-pd': prConfig.val + "px",
				'margin-top': diyUtil.buildMarginTopOffset(mbConfig, ptConfig),
				'--z-index': diyUtil.calcZIndex(this.index),
				'--border-radius': diyUtil.buildBorderRadius(fillet),
				'--comp-shadow': diyUtil.buildShadowStyle(shadowConfig),
			}
		},
	},
	data() {
		return {
			explosiveMoney: this.dataConfig.recommendList.list,
			// themeColor: this.dataConfig.themeColor.color[0].item,
			// bgColor: this.dataConfig.bgColor.color,
			mbConfig: this.dataConfig.topConfig.val * 2,
			boxColor: this.dataConfig.bottomBgColor.color[0].item,
			tabConfig: this.dataConfig.styleConfig.tabVal, //展示样式
		};
	},
	created() { },
	methods: {
		goDetail(url) {
			let urls = url.info[2].value
			urls = merPath(urls, this.merId)
			this.$util.JumpPath(urls);
		}
	}
}
</script>

<style scoped lang="scss">
.home-recommend {
	z-index: var(--z-index);
	padding-top: var(--comp-top-pd);
	padding-bottom: var(--comp-bottom-pd);
	padding-inline: var(--comp-pr-pd);
	background: var(--comp-bg-color);
	box-shadow: var(--comp-shadow);
}

.hot-img {
	// margin: 0 20rpx 0;
	// padding: 20rpx 0;
	display: flex;
	align-items: center;
	gap: 2%;

	.item {
		display: block;
		width: 23.5%;
		background-color: #fefeff;
		padding: 20rpx 0 10rpx;
		border-radius: var(--border-radius);
		text-align: center;
		box-shadow: 2px 1px 6px 1px rgba(0, 0, 0, 0.03);
		box-sizing: border-box;

		.title {
			font-weight: bold;
			color: #282828;
			height: 40rpx;
		}

		.msg {
			margin: 5rpx auto 0;
			font-size: 20rpx;
			max-width: 150rpx;
			height: 40rpx;
			color: var(--desc-color);
		}

		.img {
			margin: 10rpx auto 0;
			width: 130rpx;
			height: 130rpx;

			.image {
				width: 130rpx !important;
				height: 130rpx !important;
				border-radius: var(--image-round);
				box-shadow: var(--image-shadow);
			}
		}

		&:first-child .msg {
			color: #8fbbe8;
		}

		&:nth-child(2) .msg {
			color: #d797b7;
		}

		&:nth-child(3) .msg {
			color: #c49bd1;
		}

		&:nth-child(4) .msg {
			color: #a3bf95;
		}
	}
}

.bd {
	display: flex;
	flex-wrap: wrap;
	width: 100%;

	.item {
		display: flex;
		align-items: center;
		width: 49%;
		margin-right: 2%;
		background: #fff;
		border-radius: var(--border-radius);
		padding: 20rpx;
		justify-content: space-between;

		&:nth-child(3),
		&:nth-child(4) {
			margin-top: 20rpx;
		}

		&:nth-child(2n) {
			margin-right: 0;
		}

		.left {
			width: 150rpx;
			align-items: center;
		}

		.img {
			margin: 0;
		}

		.image {
			width: 120rpx !important;
			height: 120rpx !important;
		}
	}
}
</style>
