<template>
	<!-- 搜索框 -->
	<view class="header" :style="[headerStyle]" :class="{ 'is-first': index === 0 }">
		<view class="serch-wrapper acea-row row-middle" :style="[serchWrapperStyle]">
			<view class="logo skeleton-rect" v-if="!dataConfig.styleConfig.tabVal && logoUrl">
				<image :src="logoUrl" mode="heightFix" class="logo-img" />
			</view>
			<view class="title" v-if="dataConfig.styleConfig.tabVal == 1 && dataConfig.titleConfig.value" @click="goLink">{{ dataConfig.titleConfig.value }}</view>
			<navigator url="/pages/goods/goods_search/index" class="input acea-row row-middle skeleton-rect" hover-class="none">
				<view class="search acea-row row-middle" :class="{ 'row-center': dataConfig.styleConfig.tabVal == 2 && !dataConfig.displaySearchStyleConfig.tabVal }" :style="[searchStyle]">
					<text class="iconfont icon-ic_search"></text>
					<swiper v-if="hotWords.length" :autoplay="true" :interval="interval" :duration="1000" :vertical="true" circular class="swiper"
						:style="{ color: dataConfig.hotWordsColor.color[0].item }">
						<swiper-item v-for="(item, index) in hotWords" :key="index" class="swiper-item">
							{{ item.val }}
						</swiper-item>
					</swiper>
					<text v-else>{{ dataConfig.tipConfig.value }}</text>
				</view>
				<template v-if="dataConfig.styleConfig.tabVal == 2">
					<view v-if="dataConfig.displaySearchStyleConfig.tabVal == 1" class="button"
						:style="[searchBtnStyle]">搜索</view>
					<view v-else-if="dataConfig.displaySearchStyleConfig.tabVal == 2" class="button2" :style="[searchBtnStyle]">搜索</view>
				</template>
			</navigator>
			<!-- #ifdef MP-WEIXIN  -->
			<view class="wx-menu-placeholder"></view>
			<!-- #endif -->
		</view>
	</view>
</template>

<script>
import { diyUtil } from '@/utils/diy';

	export default {
		name: 'storeHeaderSerch',
		props: {
			dataConfig: {
				type: Object,
				default: () => {}
			},
			index: {
				type: Number,
				default: 0
			},
			special: {
				type: Number,
				default: 0
			},
			isScroll: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				marTop: 40,
				interval: this.dataConfig.numConfig.val * 1000 || 2500,
				bgColor: this.dataConfig.moduleColor.color,
				boxStyle: '',
				logoConfig: '',
				mbConfig: '',
				txtStyle: '',
				hotWords: [],
				prConfig: '',
				tabVal: '',
				radioVal: '',
				textColor: '',
				textStyle: '',
				titleConfig: '',
			};
		},
		computed: {
			logoUrl() {
				return this.isScroll ? this.dataConfig.topLogoConfig.url : this.dataConfig.logoConfig.url;
			},
			headerStyle() {
				return {
					zIndex: diyUtil.calcZIndex(this.index),
					boxShadow: diyUtil.buildShadowStyle(this.dataConfig.shadowConfig),
					"--pd-top": this.dataConfig.topConfig.val + 'px',
					padding: `${this.dataConfig.topConfig.val*2}rpx ${this.dataConfig.prConfig.val*2}rpx ${this.dataConfig.bottomConfig.val*2}rpx`,
					background: this.dataConfig.bottomBgColor.color[0].item,
					marginTop: diyUtil.buildMarginTopOffset(undefined, this.dataConfig.compOffSetY),
				};
			},
			serchWrapperStyle() {
				let borderRadius = [];
				if (this.dataConfig.fillet.type) {
					for (let i = 0; i < this.dataConfig.fillet.valList.length; i++) {
						borderRadius.push(`${this.dataConfig.fillet.valList[i].val*2}rpx`);
					}
				} else {
					for (let i = 0; i < 4; i++) {
						borderRadius.push(`${this.dataConfig.fillet.val*2}rpx`);
					}
				}
				return {
					borderRadius: borderRadius.join(' '),
					background: `linear-gradient(90deg, ${this.dataConfig.moduleColor.color[0].item} 0%, ${this.dataConfig.moduleColor.color[1].item} 100%)`,
				};
			},
			searchStyle() {
				const { displaySearchStyleConfig, styleConfig, toneConfig } = this.dataConfig;
				const style = {
					background: this.dataConfig.searchBoxColor.color[0].item,
					color: this.dataConfig.tipColor.color[0].item,
					boxShadow: diyUtil.buildShadowStyle(this.dataConfig.searchBoxShadowConfig),
				};

				return style;
			},
			searchBtnStyle() {
				const isCustom = this.dataConfig.toneConfig.tabVal === 1;
				if (isCustom) {
					return {
						color: this.dataConfig.searchBtnColor.color[0].item
					};
				} else {
					const btnStyle = this.dataConfig.displaySearchStyleConfig.tabVal;
					if (btnStyle === 2) {
						return {
							color: "var(--view-theme)"
						}
					} else if (btnStyle === 1) {
						return {
							color: "#fff"
						}
					}
				}
			}
		},
		mounted() {
			let that = this;
			that.hotWords = that.dataConfig.hotWords.list.filter(item => {
				if (item.val) {
					return item;
				}
			});
		},
		methods: {
			goLink() {
				let url = this.dataConfig.linkConfig.value;
				this.$util.JumpPath(url);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.serch-wrapper {

		&.center {
			justify-content: center;
		}
	}

	.title {
		margin-right: 30rpx;
		font-weight: 500;
		font-size: 30rpx;
		color: #333333;
	}

	.header {
		&.is-first {
			padding-top: calc(var(--pd-top) + var(--safe-area-inset-top)) !important;
		}
		z-index: 30;
		position: sticky;
		left: 0;
		top: 0;
		width: 100%;

		.serch-wrapper {
			height: 96rpx;
			padding: 18rpx 30rpx;

			.logo {
				height: 60rpx;
				margin-right: 20rpx;

				.logo-img {
					width: 100%;
					height: 100%;
				}
			}
			.input {
				position: relative;
				flex: 1;
				.search {
					flex: 1;
					height: 60rpx;
					padding: 0 32rpx;
					border-radius: 30rpx;
					background: #F5F5F5;
					font-size: 28rpx;
					line-height: 32rpx;
				}

				.iconfont {
					margin-right: 16rpx;
					font-size: 32rpx;
				}

				.swiper {
					flex: 1;
					height: 32rpx;
				}

				.button {
					position: absolute;
					top: 4rpx;
					right: 4rpx;
					height: 52rpx;
					padding: 0 24rpx;
					border-radius: 26rpx;
					background: #E93323;
					font-weight: 500;
					line-height: 52rpx;
					font-size: 22rpx;
				}

				.button2 {
					margin-left: 20rpx;
					font-size: 30rpx;
				}
			}
		}
	}
	.row-center .swiper-item{
		text-align: center;
	}

	.wx-menu-placeholder {
		width: var(--menu-btn-width);
	}
</style>