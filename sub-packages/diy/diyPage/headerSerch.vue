<template>
	<view :style="[wrapStyle]" class="wrap-box relative" :class="{ 'is-first': isFirst, 'is-sticky': isSticky }">
		<view :style="[compStyle]" v-if="dataConfig" class="search-box">
			<!-- 标题 -->
			<navigator class="title full" :style="[titleStyle]" v-if="dataConfig.styleConfig.tabVal == 0" :url="dataConfig.linkConfig.value">{{
				dataConfig.titleConfig.value }}</navigator>
			<!-- 定位 -->
			<view class="title full" :style="[titleStyle]" v-else-if="dataConfig.styleConfig.tabVal == 1">
				<view style="display: inline-block;">
					<LocationSelector />
				</view>
			</view>

			<!-- 搜索 -->
			<template v-else-if="dataConfig.styleConfig.tabVal == 2">
				<template v-if="dataConfig.displaySearchStyleConfig.tabVal == 2">
					<image v-if="dataConfig.logoConfig.url" :src="dataConfig.logoConfig.url" class="logo mr10"
						mode="aspectFill" />
				</template>
				<view class="title limit mr10" :style="[titleStyle]" v-else>
					<navigator v-if="dataConfig.displaySearchStyleConfig.tabVal == 0" :url="dataConfig.linkConfig.value">
						{{ dataConfig.titleConfig.value }}
					</navigator>
					<template v-else>
						<LocationSelector />
					</template>
				</view>
				<view class="input-box" :style="[inputWrapperText, inputContentAlignStyle]" @click="handleSearch">
					<swiper class="hot-word-swiper" :indicator-dots="false" :autoplay="true"
					:interval="dataConfig.numConfig.val * 1000" :duration="500" :vertical="true" :circular="true"
					v-if="hotWordsText.length" @change="handleHotWordChange">
					<swiper-item v-for="(item, index) in hotWordsText" :key='index'>
							<view class="hot-word-item" :style="[inputHotWordsTextStyle, inputContentAlignStyle]">
								<text class="iconfont icon-ic_search" />
								{{ item.val }}
							</view>
						</swiper-item>
					</swiper>
					<template v-else>
						<text class="iconfont icon-ic_search" />
						<text :style="[inputTipTextStyle]">{{ inputTipText }}</text>
					</template>
				</view>
			</template>
		</view>
	</view>
</template>

<script>
import { diyUtil } from "@/utils/diy.js";
import LocationSelector from '@/components/LocationSelector.vue';

export default {
	name: "headerSerch",
	components: {
		LocationSelector
	},
	props: {
		dataConfig: Object,
		index: {
			type: Number,
			default: 0
		},
		compCount: {
			type: Number,
			default: 0
		}
	},
	inject: ["parentDiyIdList"],
	computed: {
		isFirst() {
			return this.parentDiyIdList.length <= 1 && this.index === 0;
		},
		isSticky() {
			if (!this.dataConfig) return false;
			return this.dataConfig.fixedConfig.tabVal === 1;
		},
		wrapStyle() {
			if (!this.dataConfig) return {};
			const { bottomBgColor, offsetYConfig } = this.dataConfig;
			return {
				"--z-index": diyUtil.calcZIndex(this.isSticky ? this.compCount : this.index),
				marginTop: diyUtil.buildMarginTopOffset(undefined, offsetYConfig),
				backgroundColor: bottomBgColor.color[0].item
			};
		},
		compStyle() {
			if (!this.dataConfig) return {};
			const { moduleColor } = this.dataConfig;
			return {
				background: diyUtil.buildLinearColor(moduleColor),
				margin: `${this.dataConfig.topConfig.val}px ${this.dataConfig.prConfig.val}px ${this.dataConfig.bottomConfig.val}px ${this.dataConfig.prConfig.val}px`,
				borderRadius: diyUtil.buildBorderRadius(this.dataConfig.fillet),
				boxShadow: diyUtil.buildShadowStyle(this.dataConfig.shadowConfig),
			};
		},
		titleStyle() {
			if (!this.dataConfig) return {};
			const { textColor, fontSizeConfig, textPosition, textStyle } = this.dataConfig;

			return {
				fontSize: `${fontSizeConfig.val}px`,
				"--location-color": textColor.color[0].item,
				color: textColor.color[0].item,
				textAlign: textPosition.tabList[textPosition.tabVal].val,
				fontStyle: textStyle.tabVal === 1 ? 'italic' : 'normal',
				fontWeight: textStyle.tabVal === 2 ? 'bold' : 'normal',
			};
		},
		hotWordsText() {
			if (!this.dataConfig) return "";
			return this.dataConfig.hotWords.list;
		},
		inputTipText() {
			if (!this.dataConfig) return "";
			const { tipConfig, hotWords } = this.dataConfig;
			if (hotWords.list.length > 0 && hotWords.list[0].val) {
				return hotWords.list[0].val;
			}
			return tipConfig.value;
		},
		inputContentAlignStyle() {
			if (!this.dataConfig) return {};
			const { textPosition } = this.dataConfig;
			return {
				justifyContent: textPosition.tabList[textPosition.tabVal].val
			};
		},
		inputWrapperText() {
			if (!this.dataConfig) return {};
			const { searchBoxColor } = this.dataConfig;
			const style = {
				backgroundColor: searchBoxColor.color[0].item,
			};
			
			// #ifdef MP
			if (this.index === 0) {
				style.marginRight = "var(--menu-btn-width)";
			}
			// #endif

			return style;
		},
		inputTipTextStyle() {
			if (!this.dataConfig) return {};
			const { tipColor } = this.dataConfig;
			return {
				color: tipColor.color[0].item,
			};
		},
		inputHotWordsTextStyle() {
			if (!this.dataConfig) return {};
			const { hotWordsColor } = this.dataConfig;
			return {
				color: hotWordsColor.color[0].item,
			};
		},
	},
	data() {
		return {
			hotWordIndex: 0
		}
	},
	methods: {
		handleSearch() {
			const searchVal = this.hotWordsText.length ? this.hotWordsText[this.hotWordIndex].val : this.inputTipText;
			uni.navigateTo({
				url: `/pages/columnGoods/goods_search/index?searchVal=${searchVal}`
			})
		},
		handleHotWordChange(e) {
			this.hotWordIndex = e.detail.current;
		}
	}
}
</script>

<style scoped lang="scss">
.wrap-box {
	background-color: #fff;
	display: flow-root;
	z-index: var(--z-index);
	position: relative;

	&.is-sticky {
		position: sticky;
		top: 0;
	}

	&.is-first {
		padding-top: var(--safe-area-inset-top);
	}
}

.search-box {
	height: 48px;
	padding: 0 15px;
	display: flex;
	align-items: center;
	font-size: 15px;
	color: #333;

	.title {
		&.full {
			flex: 1;
		}

		&.limit {
			max-width: 100px;
			overflow: hidden;
			white-space: nowrap;
		}

		.iconfont {
			font-size: 13px;
		}
	}

	.logo {
		width: 62px;
		height: 22px;
	}

	.input-box {
		flex: 1;
		height: 30px;
		background: #F5F5F5;
		border-radius: 16px;
		display: flex;
		align-items: center;
		padding: 0 15px;

		.iconfont {
			font-size: 13px;
			margin-right: 9px;
		}
	}
}

.hot-word-swiper {
	height: 100%;
	flex: 1;

	.hot-word-item {
		height: 100%;
		display: flex;
		align-items: center;
		font-size: 12px;
	}
}
</style>
