<template>
	<!-- <view> -->
		<!-- 选项卡 -->
		<view :class="{
			isFixed,
			tabNav1: dataConfig.styleConfig.tabVal == 0,
			tabNav2: dataConfig.styleConfig.tabVal == 1,
			tabNav3: dataConfig.styleConfig.tabVal == 2,
		}" :style="[tabNavWrapStyle]" class="relative tabNav-box">
			<view :style="[tabNavStyle]">
				<view :style="[tabNavBgColor]">
					<scroll-view scroll-x="true" :scroll-left="tabLeft" scroll-with-animation>
						<view class="list acea-row row-middle">
							<view v-for="(item, index) in tabListConfig" :key="index" :class="{ on: index == tabActiveIndex }" :style="[
								index == tabActiveIndex ? textStyle : {}
							]" class="item" @click="longClick(item, index)">
								{{ item.text.val }}
								<text v-if="dataConfig.styleConfig.tabVal != 2" class="line" :style="[lineStyle]"></text>
							</view>
						</view>
					</scroll-view>
				</view>
			</view>
		</view>
		<!-- <view v-if="isFixed" class="tab-placeholder" :style="[tabNavStyle]"></view> -->
	<!-- </view> -->
</template>

<script>
import { diyUtil } from '@/utils/diy.js';

export default {
	name: 'tabNav',
	props: {
		dataConfig: {
			type: Object,
			default: () => ({})
		},
		index: {
			type: Number,
			default: 0
		},
		topCompHeight: {
			type: Number,
			default: 0
		},
		tabActiveIndex: {
			type: Number,
			default: 0
		}
	},
	inject: ["parentDiyId", "parentMerId", "parentDiyIdList"],
	data() {
		return {
			tabTitle: [],
			tabLeft: 0,
			isWidth: 0, //每个导航栏占位
			isLeft: 0, //导航栏下划线位置
			fixedTop: 0,
			isTop: 0,
			navHeight: 45,
			tabList: 45,


		};
	},
	computed: {
		isFixed() {
			return this.dataConfig.stickyConfig.tabVal === 0;
		},
		tabNavWrapStyle() {
			if (this.isFixed && this.index !== 0 && this.topCompHeight > 0) {
				return {
					"top": `${this.topCompHeight}px`,
				};
			}
			return {};
		},
		lineStyle() {
			let styleObject = {};
			if (this.dataConfig.toneConfig.tabVal) {
				switch (this.dataConfig.styleConfig.tabVal) {
					case 0:
						styleObject['background'] = `linear-gradient(90deg, ${this.dataConfig.decorateColor.color[0].item} 0%, ${this.dataConfig.decorateColor.color[1].item} 100%)`;
						break;
					case 1:
						styleObject['border-bottom-color'] = this.dataConfig.decorateColor2.color[0].item;
						break;
				}
			}
			return styleObject;
		},
		textStyle() {
			let styleObject = {};
			if (this.dataConfig.toneConfig.tabVal) {
				switch (this.dataConfig.styleConfig.tabVal) {
					case 0:
						styleObject['color'] = this.dataConfig.textColor.color[0].item;
						break;
					case 1:
						styleObject['color'] = this.dataConfig.textColor2.color[0].item;
						break;
					case 2:
						styleObject['background'] = `linear-gradient(90deg, ${this.dataConfig.decorateColor.color[0].item} 0%, ${this.dataConfig.decorateColor.color[1].item} 100%)`;
						styleObject['color'] = this.dataConfig.textColor3.color[0].item;
						break;
				}
			}
			return styleObject;
		},
		tabNavBgColor() {
			let borderRadius = `${this.dataConfig.fillet.val * 2}rpx`;
			if (this.dataConfig.fillet.type) {
				borderRadius =
					`${this.dataConfig.fillet.valList[0].val * 2}rpx ${this.dataConfig.fillet.valList[1].val * 2}rpx ${this.dataConfig.fillet.valList[2].val * 2}rpx ${this.dataConfig.fillet.valList[3].val * 2}rpx`;
			}
			const style = {
				'border-radius': borderRadius,
				'background': `linear-gradient(90deg, ${this.dataConfig.moduleColor.color[0].item} 0%, ${this.dataConfig.moduleColor.color[1].item} 100%)`,
			};

			if (this.parentDiyIdList.length <= 1 && this.index === 0) {
				style["padding-top"] = "var(--safe-area-inset-top)";
			}

			return style;
		},
		tabNavStyle() {
			return {
				'padding': `${this.dataConfig.topConfig.val * 2}rpx ${this.dataConfig.prConfig.val * 2}rpx ${this.dataConfig.bottomConfig.val * 2}rpx`,
				'margin-top': diyUtil.buildMarginTopOffset(this.dataConfig.mbConfig, this.dataConfig.ptConfig),
				'--z-index': diyUtil.calcZIndex(this.index),
				'box-shadow': diyUtil.buildShadowStyle(this.dataConfig.shadowConfig)
			};
		},
		tabListConfig() {
			// 向配置项中添加默认首页，用来展示其他 DIY 组件
			let tabList = this.dataConfig.tabListConfig.list;
			return [
				{
					text: {
						val: "首页"
					}
				},
				...tabList
			];
		},

	},
	created() {
		let that = this;
		uni.getSystemInfo({
			success(e) {
				that.isWidth = e.windowWidth / 5
			}
		})
	},
	mounted() {

	},
	methods: {
		// 导航栏点击
		longClick(item, index) {
			if (this.tabTitle.length > 5) {
				this.tabLeft = (index - 2) * this.isWidth //设置下划线位置
			}
			this.$emit("change", index);
			this.isLeft = index * this.isWidth //设置下划线位置
		},
	}
}
</script>

<style lang="scss" scoped>
.tabNav-box {
	z-index: var(--z-index);
}

.isFixed {
	z-index: 45;
	position: sticky;
	left: 0;
	width: 100%;
	top: 0;
}

.tabNav1 {

	&.on {}

	.list {
		flex-wrap: nowrap;
		height: 80rpx;
		margin-left: 24rpx;
	}

	.item {
		position: relative;
		z-index: 2;
		flex-shrink: 0;
		height: 80rpx;
		margin: 0 55rpx 0 0;
		font-size: 28rpx;
		line-height: 80rpx;
		color: #333333;

		&:last-child {
			margin: 0 24rpx 0 0;
		}
	}

	.on {
		font-weight: bold;
		font-size: 32rpx;

		.line {
			position: absolute;
			bottom: 22rpx;
			left: 50%;
			z-index: -1;
			width: 100%;
			height: 8rpx;
			border-radius: 4rpx;
			background: linear-gradient(90deg, var(--view-theme) 0%, var(--view-assist) 100%);
			transform: translateX(-50%);
		}
	}
}

.tabNav2 {
	.list {
		flex-wrap: nowrap;
		height: 80rpx;
		margin-left: 24rpx;
	}

	.item {
		position: relative;
		z-index: 2;
		flex-shrink: 0;
		height: 80rpx;
		margin: 0 55rpx 0 0;
		font-size: 28rpx;
		line-height: 80rpx;
		color: #333333;

		&:last-child {
			margin: 0 24rpx 0 0;
		}
	}

	.on {
		font-weight: bold;
		font-size: 32rpx;
		color: var(--view-theme);

		.line {
			position: absolute;
			bottom: 8rpx;
			left: 50%;
			z-index: -1;
			width: 64rpx;
			height: 64rpx;
			border: 4rpx solid var(--view-theme);
			border-top-color: transparent;
			border-right-color: transparent;
			border-left-color: transparent;
			border-radius: 50%;
			transform: translateX(-50%);
		}
	}
}

.tabNav3 {
	.list {
		flex-wrap: nowrap;
		height: 80rpx;
		margin-left: 15rpx;
	}

	.item {
		position: relative;
		flex-shrink: 0;
		height: 80rpx;
		padding: 0 20rpx;
		margin: 0 15rpx 0 0;
		font-size: 28rpx;
		line-height: 80rpx;
		color: #333333;
	}

	.on {
		height: 48rpx;
		border-radius: 24rpx;
		background: linear-gradient(90deg, var(--view-theme) 0%, var(--view-assist) 100%);
		text-align: center;
		font-size: 26rpx;
		line-height: 48rpx;
		color: #FFFFFF;
	}
}

.tab-placeholder {
	height: 80rpx;
	opacity: 0;
	box-sizing: content-box;
}
</style>