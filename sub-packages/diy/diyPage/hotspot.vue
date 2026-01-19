<template>
	<view :style="[hotspotWrapStyle]" class="relative hotspot-box">
		<view class="hotspot">
			<image :src="dataConfig.picStyle.url" mode="widthFix" class="image" :style="[imageRadius]"></image>
			<view v-for="(item, index) in dataConfig.picStyle.list" :key="item.number" :style="{
				top: `${item.starY / item.nowImgHeight * 100}%`,
				left: `${item.starX / item.nowImgWidth * 100}%`,
				width: `${item.areaWidth}rpx`,
				height: `${item.areaHeight}rpx`,
			}" class="area" @click="goPage(item.link)"></view>
		</view>
	</view>
</template>

<script>
import { diyUtil } from '@/utils/diy.js';

export default {
	inject: ["parentMerId"],
	props: {
		dataConfig: {
			type: Object,
			default: () => { }
		},
		index: {
			type: Number,
			default: 0
		}
	},
	data() {
		return {}
	},
	computed: {
		imageRadius() {
			let borderRadius = `${this.dataConfig.fillet.val * 2}rpx`;
			if (this.dataConfig.fillet.type) {
				borderRadius =
					`${this.dataConfig.fillet.valList[0].val * 2}rpx ${this.dataConfig.fillet.valList[1].val * 2}rpx ${this.dataConfig.fillet.valList[3].val * 2}rpx ${this.dataConfig.fillet.valList[2].val * 2}rpx`;
			}
			return {
				'border-radius': borderRadius,
			};
		},
		hotspotWrapStyle() {
			return {
				'padding': `${this.dataConfig.topConfig.val * 2}rpx ${this.dataConfig.prConfig.val * 2}rpx ${this.dataConfig.bottomConfig.val * 2}rpx`,
				'margin-top': diyUtil.buildMarginTopOffset(this.dataConfig.mbConfig, this.dataConfig.offsetTopConfig),
				'--z-index': diyUtil.calcZIndex(this.index),
				'background': this.dataConfig.bottomBgColor.color[0].item,
				'box-shadow': diyUtil.buildShadowStyle(this.dataConfig.shadowConfig)
			};
		},
	},
	methods: {
		goPage(link) {
			link = diyUtil.checkUrl(link, this.parentMerId);
			this.$util.JumpPath(link);
		},
	},
}
</script>

<style lang="scss" scoped>
.hotspot-box {
	z-index: var(--z-index);
}


.hotspot {
	position: relative;

	.image {
		display: block;
		width: 100%;
	}

	.area {
		position: absolute;

		// only debug
		// background-color: rgba(0, 0, 0, 0.5);
	}
}
</style>