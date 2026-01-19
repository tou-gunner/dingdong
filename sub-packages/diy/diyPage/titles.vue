<template>
	<!-- 标题 -->
	<view :style="[titleWrapperStyle]" class="relative">
		<view :style="[titleWrapStyle]">
			<view @click="goLink" class="title acea-row row-middle row-between" :style="[titleLocation]">
				<view :style="[titleStyle]">{{dataConfig.titleConfig.value}}</view>
				<view class="more" v-if="!dataConfig.buttonConfig.tabVal" :style="[moreStyle]">
					{{dataConfig.titleConfigRight.value}}
					<text class="iconfont icon-ic_rightarrow"></text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { diyUtil } from '@/utils/diy';

	export default {
		name: 'titles',
		inject: ["parentMerId"],
		props: {
			dataConfig: {
				type: Object,
				default: () => {}
			},
			index: {
				type: Number,
				default: 0
			}
		},
		computed: {
			titleWrapperStyle() {
				return {
					zIndex: diyUtil.calcZIndex(this.index),
					boxShadow: diyUtil.buildShadowStyle(this.dataConfig.shadowConfig),
					'padding': `${this.dataConfig.topConfig.val * 2}rpx ${this.dataConfig.prConfig.val * 2}rpx ${this.dataConfig.bottomConfig.val * 2}rpx`,
					'margin-top': diyUtil.buildMarginTopOffset(this.dataConfig.mbConfig, this.dataConfig.offsetYConfig),
					'background': this.dataConfig.bottomBgColor.color[0].item,
				};
			},
			titleWrapStyle() {
				let borderRadius = `${this.dataConfig.fillet.val * 2}rpx`;
				if (this.dataConfig.fillet.type) {
					borderRadius =
						`${this.dataConfig.fillet.valList[0].val * 2}rpx ${this.dataConfig.fillet.valList[1].val * 2}rpx ${this.dataConfig.fillet.valList[3].val * 2}rpx ${this.dataConfig.fillet.valList[2].val * 2}rpx`;
				}
				return {
					'border-radius': borderRadius,
					'background': `linear-gradient(90deg, ${this.dataConfig.titleColor.color[0].item} 0%, ${this.dataConfig.titleColor.color[1].item} 100%)`,
				};
			},
			titleStyle() {
				let style = {
					'font-size': `${this.dataConfig.fontSize.val * 2}rpx`,
					'color': this.dataConfig.themeColor.color[0].item,
					'font-weight': 400
				};
				switch (this.dataConfig.textStyle.tabVal) {
					case 1:
						style['font-style'] = 'italic';
						break;
					case 2:
						style['font-weight'] = '500';
						break;
				}
				return style;
			},
			titleLocation() {
				if(this.dataConfig.buttonConfig.tabVal){
					let style = {}
					switch (this.dataConfig.textPosition.tabVal) {
						case 1:
							style['justify-content'] = 'center';
							break;
						case 2:
							style['justify-content'] = 'flex-end';
							break;
					}
					return style;
				}
			},
			moreStyle() {
				return {
					'font-size': `${this.dataConfig.buttonText.val * 2}rpx`,
					'color': this.dataConfig.buttonColor.color[0].item,
				};
			},
		},
		methods: {
			goLink() {
				const link = diyUtil.checkUrl(this.dataConfig.linkConfig.value, this.parentMerId);
				this.$util.JumpPath(link);
			}
		}
	}
</script>

<style lang="scss">
	.title {
		justify-content: space-between;
		padding: 26rpx 24rpx;
		border-radius: 16rpx 16rpx 0rpx 0rpx;
		font-weight: 500;
		font-size: 32rpx;
		line-height: 44rpx;
		color: #333333;

		.more {
			font-weight: 400;
			font-size: 24rpx;
			line-height: 34rpx;
			color: #999999;
		}

		.iconfont {
			font-size: 24rpx;
		}
	}
</style>