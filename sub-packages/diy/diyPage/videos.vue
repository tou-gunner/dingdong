<template>
	<view :style="[videoWrapStyle]" class="relative video-box">
		<view class="video-box" id="myVideo" :style="[videoStyle]">
			<video class="video" object-fit="cover" :src="dataConfig.videoConfig.url" :poster="dataConfig.imgConfig.url"
				controls></video>
		</view>
	</view>
</template>

<script>
import { diyUtil } from '@/utils/diy';

export default {
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
		return {
			height: 0,
		}
	},
	computed: {
		// 视频高度
		videoStyle() {
			let borderRadius = `${this.dataConfig.fillet.val * 2}rpx`;
			if (this.dataConfig.fillet.type) {
				borderRadius =
					`${this.dataConfig.fillet.valList[0].val * 2}rpx ${this.dataConfig.fillet.valList[1].val * 2}rpx ${this.dataConfig.fillet.valList[2].val * 2}rpx ${this.dataConfig.fillet.valList[3].val * 2}rpx`;
			}
			return {
				'height': this.height + 'px',
				'border-radius': borderRadius,
			};
		},
		videoWrapStyle() {
			return {
				'box-shadow': diyUtil.buildShadowStyle(this.dataConfig.shadowConfig),
				'padding': `${this.dataConfig.topConfig.val * 2}rpx ${this.dataConfig.prConfig.val * 2}rpx ${this.dataConfig.bottomConfig.val * 2}rpx`,
				'margin-top': diyUtil.buildMarginTopOffset(this.dataConfig.mbConfig, this.dataConfig.offsetY),
				'--z-index': diyUtil.calcZIndex(this.index),
				'background': this.dataConfig.bottomBgColor.color[0].item,
			};
		},
	},
	mounted() {
		const query = uni.createSelectorQuery().in(this);
		query.select('#myVideo').boundingClientRect(data => {
			switch (this.dataConfig.scaleConfig.tabVal) {
				case 0:
					this.height = data.width * 9 / 16;
					break;
				case 1:
					this.height = data.width * 3 / 4;
					break;
				default:
					this.height = data.width;
					break;
			}
		}).exec();
	},
}
</script>

<style lang="scss" scoped>
.video-box {
	z-index: var(--z-index);
}

.video {
	width: 100%;
	height: 100%;
}
</style>