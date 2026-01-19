<template>
	<!-- 商品分类-->
	<view class="index-product-wrapper relative" :style="[bottomBgColor]">
		<view class="nav-bd-box" :style="[navBarStyle]">
			<view class="nav-bd" :class="{
				'nav-bd2': dataConfig.styleConfig.tabVal == 1,
				'nav-bd3': dataConfig.styleConfig.tabVal == 2,
				'nav-bd4': dataConfig.styleConfig.tabVal == 3,
				'nav-bd5': dataConfig.styleConfig.tabVal == 4
			}">
				<scroll-view class="scroll-view" scroll-x="true">
					<view class="item" v-for="(item, index) in explosiveMoney" :index="index"
						:class="{ on: index == ProductNavindex }" @click="ProductNavTab(item, index)" :key="index">
						<view v-if="dataConfig.styleConfig.tabVal == 4" class="image-wrap">
							<image :src="item.image" class="image"></image>
						</view>
						<view class="txt" :style="[index == ProductNavindex ? textColor : {}]">{{ item.chiild[0].val }}</view>
						<view v-if="[1, 2].includes(dataConfig.styleConfig.tabVal)" class="line"
							:style="[index == ProductNavindex ? lineColor : {}]"></view>
						<view class="label" v-if="dataConfig.styleConfig.tabVal == 0 && item.chiild[1].val"
							:style="[index == ProductNavindex ? decorateColor : {}]">
							{{ item.chiild[1].val }}
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
		<goodList ref="goodLists" v-if="goodDataConfig" :dataConfig="goodDataConfig" :key="ProductNavindex" @selectAttr="good => $emit('selectAttr', good)"></goodList>
	</view>
</template>

<script>
import { diyUtil } from '@/utils/diy';
import goodList from './goodList.vue';
export default {
	name: 'promotionList',
	props: {
		dataConfig: {
			type: Object,
			default: () => { }
		},
		isScroll: {
			type: Boolean,
			default: false
		},
		productVideoStatus: {
			type: Boolean,
			default: false
		},
		index: {
			type: Number,
			default: 0
		}
	},
	components: {
		goodList
	},
	data() {
		return {
			tempArr: [],
			iSshowH: false,
			ProductNavindex: 0,
			explosiveMoney: this.dataConfig.tabConfig.list,
			numConfig: this.dataConfig.tabConfig.list[0].numConfig.val,
			// imgStyle: this.dataConfig.imgStyle.type,
			mbConfig: 0,
			themeColor: '',
			titleShow: 0, //标题是否显示
			opriceShow: 0, //划线价是否显示
			priceShow: 0, //价格是否显示
			couponShow: 0, //优惠券标签是否显示
			titleConfig: 0, //标题位置
			fontColor: '',
			labelColor: '',
			txtColor: '',
			infoColor: '',
			goodType: this.dataConfig.tabConfig.list[0].tabVal,
			loadend: false,
			loading: false,
			limit: 10,
			page: 1,
			canPlay: false,
			autoplay: false,
			activeValue: this.dataConfig.tabConfig.list[0],
			allowSticky: this.dataConfig.slideConfig.tabVal === 0,
			navBdH: 0
		};
	},
	computed: {
		goodDataConfig() {
			let goodDataConfig = {
				styleConfig: {
					tabVal: 1
				},
				goodsList: this.activeValue.goodsList,
				brandList: this.activeValue.brandConfig,
				classList: {
					classVal: this.activeValue.selectConfig.activeValue
				},
				goodsLabel: this.activeValue.goodsLabel,
				goodsType: this.activeValue.goodsType,
				deliveryType: this.activeValue.deliveryType,
				typeConfig: {
					activeValue: this.goodType
				},
				goodsSort: {
					tabVal: this.activeValue.goodsSort
				},
				goodsSortType: {
					tabVal: 0
				},
				numberConfig: {
					val: this.numConfig
				},
				filterConfig: {
					tabVal: 1
				},
				bntStyleConfig: this.dataConfig.bntStyleConfig,
				cartConfig: this.dataConfig.cartConfig,
				bntConfig: this.dataConfig.bntConfig,
				filletImg: this.dataConfig.filletImg,
				checkboxInfo: {
					type: [0, 1, 2, 3, 4, 5, 6, 7]
				},
				toneConfig: this.dataConfig.goodsToneConfig,
				toneCartConfig: this.dataConfig.toneCartConfig,
				bntBgColor: this.dataConfig.bntBgColor,
				goodsName: this.dataConfig.goodsName,
				goodsNameColor: this.dataConfig.goodsNameColor,
				goodsPriceColor: this.dataConfig.goodsPriceColor,
				soldNumColor: this.dataConfig.soldNumColor,
				scoreColor: this.dataConfig.scoreColor,
				goodShadowConfig: this.dataConfig.goodShadowConfig,
				topConfig: {
					val: 0
				},
				prConfig: {
					val: 0
				},
				bottomConfig: {
					val: 0
				},
				mbConfig: {
					val: 0
				},
				bottomBgColor: {
					color: [
						{
							item: ''
						}
					]
				},
				fillet: this.dataConfig.fillet,
				name: 'promotionList'
			};
			return goodDataConfig;
		},
		decorateColor() {
			if (this.dataConfig.toneConfig.tabVal) {
				let color = this.dataConfig.decorateColor.color;
				let background = `linear-gradient(90deg, ${color[0].item} 0%, ${color[1].item} 100%)`;
				if (this.dataConfig.styleConfig.tabVal == 2) {
					color = this.dataConfig.decorateColor2.color;
					background = color[0].item;
				}
				return {
					background: background
				};
			} else {
				return {
					background: `linear-gradient(90deg, var(--view-assist) 0%, var(--view-theme) 100%)`
				};
			}
		},
		textColor() {
			if (this.dataConfig.toneConfig.tabVal) {
				let color = this.dataConfig.textColor.color[0].item;
				let bgColor = this.dataConfig.decorateColor.color;
				let background = '';
				if ([0, 1, 2].includes(this.dataConfig.styleConfig.tabVal)) {
					color = this.dataConfig.textColor.color[0].item;
				} else if ([3, 4].includes(this.dataConfig.styleConfig.tabVal)) {
					color = '#ffffff';
					background = `linear-gradient(90deg, ${bgColor[0].item} 0%, ${bgColor[1].item} 100%)`;
				} else if (this.dataConfig.styleConfig.tabVal == 1) {
					color = '#282828';
				}
				return {
					color: color,
					background: background
				};
			} else {
				if (this.dataConfig.styleConfig.tabVal == 1) {
					return {
						color: '#282828'
					};
				} else if ([3, 4].includes(this.dataConfig.styleConfig.tabVal)) {
					return {
						background: 'linear-gradient(90deg, var(--view-assist) 0, var(--view-theme) 100%)',
						color: '#ffffff'
					};
				} else {
					return {
						color: 'var(--view-theme)'
					};
				}
			}
		},
		navBarStyle() {
			const style = {};
			if (this.allowSticky) {
				style.position = 'sticky';
				style.top = "var(--diy-sticky-top, 0)";
				style.zIndex = 100;
				style.background = this.dataConfig.bottomBgColor.color[0].item;
			}
			return style;
		},
		bottomBgColor() {
			return {
				'--z-index': diyUtil.calcZIndex(this.index),
				marginTop: diyUtil.buildMarginTopOffset(this.dataConfig.mbConfig, this.dataConfig.ptConfig),
				boxShadow: diyUtil.buildShadowStyle(this.dataConfig.shadowConfig),
				padding: `${this.dataConfig.topConfig.val * 2}rpx ${this.dataConfig.prConfig.val * 2}rpx ${this.dataConfig.bottomConfig.val * 2}rpx`,
				background: this.dataConfig.bottomBgColor.color[0].item
			};
		},
		lineColor() {
			let diy = this.dataConfig.toneConfig.tabVal;
			let type = this.dataConfig.styleConfig.tabVal;
			let color = this.dataConfig.decorateColor.color;
			let bgColor = `linear-gradient(90deg, ${color[0].item} 0%, ${color[1].item} 100%)`;
			if (type == 1) {
				return {
					background: diy ? bgColor : 'linear-gradient(90deg, var(--view-assist) 0, var(--view-theme) 100%)'
				};
			} else if (type == 2) {
				return {
					'border-bottom-color': diy ? this.dataConfig.textColor2.color[0].item : 'var(--view-theme)'
				};
			}
		}
	},
	watch: {
		tempArr() {
			// #ifndef APP-PLUS
			this.$nextTick(() => {
				if (this.productVideoStatus) {
					uni.getNetworkType({
						success: (res) => {
							if (['wifi', 'unknown'].includes(res.networkType)) {
								// 监听
								this.observeVideo();
							}
							if (['2g', '3g', '4g', '5g'].includes(res.networkType)) {
								if (this.$store.state.app.autoplay) {
									// 监听
									this.observeVideo();
								} else {
									this.$eventHub.$emit('confirm_video_status');
								}
							}
						}
					});
				}
			});
			// #endif
		}
	},
	created() {
		// #ifndef APP-PLUS
		this.$eventHub.$on('product_video_observe', () => {
			this.observeVideo();
		});
		// #endif
		// this.getGroomList();
	},
	mounted() {
		let view = uni.createSelectorQuery().in(this).select('.nav-bd');
		let views = uni.createSelectorQuery().in(this).select('.nav-bd-box');
		view
			.boundingClientRect((data) => {
				this.navBdH = data.height;
			})
			.exec();
	},
	methods: {
		observeVideo() {
			this.autoplay = true;
		},
		// 促销列表的点击事件；
		changeTab(item) {
			this.goodType = item.tabVal;
			this.activeValue = item;
		},
		// 首发新品切换
		ProductNavTab(item, index) {
			this.ProductNavindex = index;
			this.changeTab(item);
		},
	}
};
</script>

<style lang="scss">
// 这里可以自行配置
$border-radius: 10px;

.index-product-wrapper {
	z-index: var(--z-index);
	&.on {
		min-height: 1500rpx;
	}

	.nav-bd {
		position: relative;
		top: 0;
		right: 0;
		left: 0;
		z-index: 99;

		&.nav-bd2 {
			.item {
				position: relative;
				padding: 18rpx 0;
				margin-right: 56rpx;

				&:first-child {
					// margin-left: 24rpx;
				}

				&:last-child {
					margin-right: 24rpx;
				}

				&.on {
					.txt {
						font-weight: 500;
						font-size: 32rpx;
						color: #333333;
					}

					// .line {
					//	background: linear-gradient(90deg, var(--view-assist) 0, var(--view-theme) 100%);
					// }
				}

				.txt {
					position: relative;
					z-index: 1;
					font-size: 28rpx;
					line-height: 44rpx;
				}

				.line {
					position: absolute;
					bottom: 22rpx;
					left: 0;
					width: 100%;
					height: 8rpx;
					border-radius: 4rpx;
				}
			}
		}

		&.nav-bd3 {
			.item {
				position: relative;
				padding: 18rpx 0;
				margin-right: 56rpx;

				&:first-child {
					// margin-left: 24rpx;
				}

				&:last-child {
					margin-right: 24rpx;
				}

				&.on {
					.txt {
						font-weight: 500;
						font-size: 32rpx;
						color: #e93323;
					}

					// .line {
					// 	border-bottom-color: var(--view-theme);
					// }
				}

				.txt {
					font-size: 28rpx;
					line-height: 44rpx;
				}

				.line {
					position: absolute;
					bottom: 8rpx;
					left: 50%;
					width: 64rpx;
					height: 64rpx;
					border: 4rpx solid transparent;
					border-radius: 50%;
					transform: translateX(-50%);
				}
			}
		}

		&.nav-bd4 {
			.item {
				padding: 16rpx 0;
				margin-right: 16rpx;

				&:first-child {
					// margin-left: 20rpx;
				}

				&:last-child {
					margin-right: 20rpx;
				}

				&.on {
					.txt {
						background: linear-gradient(90deg, #ff7931 0%, #e93323 100%);
						font-size: 26rpx;
						color: #ffffff;
					}
				}

				.txt {
					height: 48rpx;
					padding: 0 20rpx;
					border-radius: 24rpx;
					font-size: 28rpx;
					line-height: 48rpx;
				}
			}
		}

		&.nav-bd5 {
			padding-left: 20rpx;

			.item {
				padding: 20rpx 0;
				margin-right: 16rpx;

				&:first-child {
					// margin-left: 24rpx;
				}

				&:last-child {
					margin-right: 24rpx;
				}

				&.on {
					.image-wrap {
						border-color: var(--view-theme);
						background: #ffffff;
					}

					.txt {
						// background: linear-gradient(90deg, #FF7931 0%, #E93323 100%);
						color: #ffffff;
					}
				}

				.image-wrap {
					display: flex;
					justify-content: center;
					align-items: center;
					width: 104rpx;
					height: 104rpx;
					border: 3rpx solid transparent;
					border-radius: 50%;
					margin: 0 auto;
				}

				.image {
					width: 92rpx;
					height: 92rpx;
					border: 1rpx solid #eeeeee;
					border-radius: 50%;
				}

				.txt {
					height: 40rpx;
					padding: 0 12rpx;
					border-radius: 20rpx;
					margin-top: 8rpx;
					font-size: 24rpx;
					line-height: 40rpx;
					color: #333333;
				}
			}
		}

		.scroll-view {
			white-space: nowrap;
		}

		.item {
			display: inline-block;
			padding: 20rpx 0 14rpx;
			margin-right: 66rpx;
			text-align: center;

			&:first-child {
				// margin-left: 36rpx;
			}

			&:last-child {
				margin-right: 36rpx;
			}

			&.on {
				.txt {
					font-weight: 500;
					color: #e93323;
				}

				.label {
					background: linear-gradient(90deg, #ff7931 0%, #e93323 100%);
					font-size: 22rpx;
					color: #ffffff;
				}
			}

			.txt {
				font-size: 30rpx;
				line-height: 42rpx;
				color: #282828;
			}

			.label {
				display: inline-block;
				height: 38rpx;
				padding: 0 12rpx;
				border-radius: 19rpx;
				margin-top: 6rpx;
				font-size: 24rpx;
				line-height: 38rpx;
				color: #999999;
			}
		}
	}
}
</style>
