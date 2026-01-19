<template>
	<!-- 图片魔方 -->
	<view class="pictureCube relative" :style="[wrapperStyle]" v-if="picList.length">
		<view class="advert1" v-if="style == 0">
			<view class="item" v-for="(item, index) in picList" :key="index" :style="[imgGap]" @click="goDetail(item)">
				<image mode="aspectFill" :src="item.image" class="image"
					:style="{ width: '100%', height: '100%', borderRadius: imgBorderRadius }" />
			</view>
		</view>
		<view class="advert2" v-else-if="style == 1">
			<view class="item" v-for="(item, index) in picList" :key="index" :style="[imgGap]" @click="goDetail(item)">
				<image mode="aspectFill" :src="item.image" class="image" :style="{ borderRadius: imgBorderRadius }" />
			</view>
		</view>
		<view class="advert3" v-else-if="style == 2">
			<view class="item" v-for="(item, index) in picList" :key="index" :style="[imgGap]" @click="goDetail(item)">
				<image mode="aspectFill" :src="item.image" class="image" :style="{ borderRadius: imgBorderRadius }" />
			</view>
		</view>
		<view class="advert4" :style="[autoHeight]" v-else-if="style == 3">
			<view class="item">
				<view class="pic" :style="[imgGap]" @click="goDetail(picList[0])">
					<image mode="aspectFill" :src="picList[0].image" class="image"
						:style="{ width: '100%', height: '100%', borderRadius: imgBorderRadius }" />
				</view>
				<view class="pic" :style="[imgGap]" @click="goDetail(picList[1])">
					<image mode="aspectFill" :src="picList[1].image" class="image"
						:style="{ width: '100%', height: '100%', borderRadius: imgBorderRadius }" />
				</view>
			</view>
			<view class="item" :style="[imgGap]" @click="goDetail(picList[2])">
				<image mode="aspectFill" :src="picList[2].image" class="image"
					:style="{ width: '100%', height: '100%', borderRadius: imgBorderRadius }" />
			</view>
		</view>
		<view class="advert5" :style="[autoHeight]" v-else-if="style == 4">
			<view class="item" :style="[imgGap]" @click="goDetail(picList[0])">
				<image mode="aspectFill" :src="picList[0].image" class="image"
					:style="{ width: '100%', height: '100%', borderRadius: imgBorderRadius }" />
			</view>
			<view class="item">
				<view class="pic" :style="[imgGap]" @click="goDetail(picList[1])">
					<image mode="aspectFill" :src="picList[1].image" class="image"
						:style="{ width: '100%', height: '100%', borderRadius: imgBorderRadius }" />
				</view>
				<view class="pic" :style="[imgGap]" @click="goDetail(picList[2])">
					<image mode="aspectFill" :src="picList[2].image" class="image"
						:style="{ width: '100%', height: '100%', borderRadius: imgBorderRadius }" />
				</view>
			</view>
		</view>
		<view class="advert6" :style="[autoHeight]" v-else-if="style == 5">
			<view class="item" :style="[imgGap]" @click="goDetail(picList[0])">
				<image mode="aspectFill" :src="picList[0].image" class="image"
					:style="{ width: '100%', height: '100%', borderRadius: imgBorderRadius }" />
			</view>
			<view class="item">
				<view class="pic" :style="[imgGap]" @click="goDetail(picList[1])">
					<image mode="aspectFill" :src="picList[1].image" class="image"
						:style="{ width: '100%', height: '100%', borderRadius: imgBorderRadius }" />
				</view>
				<view class="pic" :style="[imgGap]" @click="goDetail(picList[2])">
					<image mode="aspectFill" :src="picList[2].image" class="image"
						:style="{ width: '100%', height: '100%', borderRadius: imgBorderRadius }" />
				</view>
			</view>
		</view>
		<view class="advert7" :style="[autoHeight]" v-else-if="style == 6">
			<view class="item">
				<view class="pic" :style="[imgGap]" @click="goDetail(picList[0])">
					<image mode="aspectFill" :src="picList[0].image" class="image"
						:style="{ width: '100%', height: '100%', borderRadius: imgBorderRadius }" />
				</view>
				<view class="pic" :style="[imgGap]" @click="goDetail(picList[1])">
					<image mode="aspectFill" :src="picList[1].image" class="image"
						:style="{ width: '100%', height: '100%', borderRadius: imgBorderRadius }" />
				</view>
			</view>
			<view class="item" :style="[imgGap]" @click="goDetail(picList[2])">
				<image mode="aspectFill" :src="picList[2].image" class="image"
					:style="{ width: '100%', height: '100%', borderRadius: imgBorderRadius }" />
			</view>
		</view>
		<view class="advert8" :style="[autoHeight]" v-else-if="style == 7">
			<view class="item" :style="[imgGap]" v-for="(item, index) in picList" @click="goDetail(item)" :key="index">
				<image mode="aspectFill" :src="item.image" class="image"
					:style="{ width: '100%', height: '100%', borderRadius: imgBorderRadius }" />
			</view>
		</view>
		<view class="advert9" :style="[autoHeight]" v-else-if="style == 8">
			<view class="item">
				<view class="pic" :style="[imgGap]" @click="goDetail(picList[0])">
					<image mode="aspectFill" :src="picList[0].image" class="image"
						:style="{ width: '100%', height: '100%', borderRadius: imgBorderRadius }" />
				</view>
				<view class="pic" :style="[imgGap]" @click="goDetail(picList[1])">
					<image mode="aspectFill" :src="picList[1].image" class="image"
						:style="{ width: '100%', height: '100%', borderRadius: imgBorderRadius }" />
				</view>
			</view>
			<view class="item">
				<view class="pic" :style="[imgGap]" @click="goDetail(picList[2])">
					<image mode="aspectFill" :src="picList[2].image" class="image"
						:style="{ width: '100%', height: '100%', borderRadius: imgBorderRadius }" />
				</view>
				<view class="pic" :style="[imgGap]" @click="goDetail(picList[3])">
					<image mode="aspectFill" :src="picList[3].image" class="image"
						:style="{ width: '100%', height: '100%', borderRadius: imgBorderRadius }" />
				</view>
				<view class="pic" :style="[imgGap]" @click="goDetail(picList[4])">
					<image mode="aspectFill" :src="picList[4].image" class="image"
						:style="{ width: '100%', height: '100%', borderRadius: imgBorderRadius }" />
				</view>
			</view>
		</view>
		<view class="advert10" :style="[autoHeight]" v-else-if="style == 9">
			<view class="item" :style="[imgGap]" @click="goDetail(picList[0])">
				<image mode="aspectFill" :src="picList[0].image" class="image"
					:style="{ width: '100%', height: '100%', borderRadius: imgBorderRadius }" />
			</view>
			<view class="item">
				<view class="pic-wrap">
					<view class="pic" :style="[imgGap]" @click="goDetail(picList[1])">
						<image mode="aspectFill" :src="picList[1].image" class="image"
							:style="{ width: '100%', height: '100%', borderRadius: imgBorderRadius }" />
					</view>
				</view>
				<view class="pic-wrap">
					<view class="pic" :style="[imgGap]" @click="goDetail(picList[2])">
						<image mode="aspectFill" :src="picList[2].image" class="image"
							:style="{ width: '100%', height: '100%', borderRadius: imgBorderRadius }" />
					</view>
					<view class="pic" :style="[imgGap]" @click="goDetail(picList[3])">
						<image mode="aspectFill" :src="picList[3].image" class="image"
							:style="{ width: '100%', height: '100%', borderRadius: imgBorderRadius }" />
					</view>
				</view>
			</view>
		</view>
		<view class="advert11" v-else-if="style == 10">
			<view class="pic" :style="[imgGap]" @click="goDetail(picList[0])">
				<image mode="scaleToFill" :src="picList[0].image" class="image"
					:style="{ width: '100%', height: imageH + 'px', borderRadius: imgBorderRadius }" />
			</view>
		</view>
		<view class="advert12" :style="[autoHeight]" v-else-if="style == 11">
			<template v-if="dataConfig.picStyle.docPicList.length">
				<view v-for="(item, index) in dataConfig.picStyle.docPicList" :key="index" :style="{
					top: `${(item.doc.startY / 375) * 100}%`,
					left: `${(item.doc.startX / 375) * 100}%`,
					width: `${(item.doc.w / 375) * 100}%`,
					height: `${(item.doc.h / 375) * 100}%`,
					borderWidth: `${dataConfig.imgConfig.val * 2}rpx`,
				}" class="item" @click="goDetail(item)">
					<image mode="aspectFill" :src="item.img" class="image"
						:style="{ width: '100%', height: '100%', borderRadius: imgBorderRadius }" />
				</view>
			</template>
		</view>
	</view>
</template>

<script>
import { diyUtil } from '@/utils/diy';

export default {
	name: 'pictureCube',
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
		return {
			picList: this.dataConfig.picStyle.picList,
			style: this.dataConfig.styleConfig.tabVal,
			imageH: 0,
		};
	},
	computed: {
		imgGap() {
			return {
				borderWidth: `${this.dataConfig.imgConfig.val * 2}rpx`,
			}
		},
		imgBorderRadius() {
			let borderRadius = `${this.dataConfig.filletImg.val * 2}rpx`;
			if (this.dataConfig.filletImg.type) {
				borderRadius =
					`${this.dataConfig.filletImg.valList[0].val * 2}rpx ${this.dataConfig.filletImg.valList[1].val * 2}rpx ${this.dataConfig.filletImg.valList[3].val * 2}rpx ${this.dataConfig.filletImg.valList[2].val * 2}rpx`;
			}
			return borderRadius
		},
		autoHeight() {
			let windowWidth = uni.getSystemInfoSync().windowWidth;
			return {
				height: windowWidth + 'px'
			}
		},
		wrapperStyle() {
			let styleObject = {
				"--img-shadow": diyUtil.buildShadowStyle(this.dataConfig.imgShadowConfig),
				"--z-index": diyUtil.calcZIndex(this.index),
				boxShadow: diyUtil.buildShadowStyle(this.dataConfig.shadowConfig),
				marginTop: diyUtil.buildMarginTopOffset(this.dataConfig.mbConfig, this.dataConfig.ptConfig),
			};
			styleObject['padding'] = `${this.dataConfig.topConfig.val * 2}rpx ${this.dataConfig.prConfig.val * 2}rpx ${this.dataConfig.bottomConfig.val * 2}rpx`;
			styleObject['background'] = this.dataConfig.bottomBgColor.color[0].item;
			if (this.style == 0) {
				styleObject["height"] = "100vw";
			}
			return styleObject;
		}
	},
	mounted() {
		this.computedHeight();
	},
	methods: {
		//替换安全域名
		setDomain: function (url) {
			url = url ? url.toString() : '';
			//本地调试打开,生产请注销
			if (url.indexOf("https://") > -1) return url;
			else return url.replace('http://', 'https://');
		},
		goDetail(url) {
			const link = diyUtil.checkUrl(url.link, this.parentMerId);
			this.$util.JumpPath(link);
		},
		computedHeight() {
			if (this.picList.length) {
				let that = this;
				let windowWidth = uni.getSystemInfoSync().windowWidth;
				this.$nextTick((e) => {
					if (this.style == 0) {
						this.imageH = windowWidth / 2;
					} else if ([1, 2].includes(this.style)) {
						uni.getImageInfo({
							src: that.setDomain(that.picList[0].image),
							success: (res) => {
								if (res && res.height > 0) {
									let height = res.height * ((this.style == 1 ? 375 : 250 - that.dataConfig.prConfig.val * 2) / res.width)
									that.$set(that, 'imageH', height);
								} else {
									that.$set(that, 'imageH', (this.style == 1 ? 375 : 250 - that.dataConfig.prConfig.val * 2) * 2);
								}
							},
							fail: function (error) {
								that.$set(that, 'imageH', (this.style == 1 ? 375 : 250 - that.dataConfig.prConfig.val * 2) * 2);
							}
						})
					} else if (this.style == 10) {
						uni.getImageInfo({
							src: that.setDomain(that.picList[0].image),
							success: (image) => {
								this.imageH = image.height * windowWidth / image.width;

							}
						})
					}
				})
			}
		}
	}
}
</script>

<style lang="scss">
.image {
	box-shadow: var(--img-shadow);
}

.pictureCube-box {
	z-index: var(--z-index);
}

.pictureCube {
	display: flex;
	background-color: #fff;

	.item {
		border-width: 0;
		border-style: solid;
		border-color: transparent;
	}

	.pic {
		border-width: 0;
		border-style: solid;
		border-color: transparent;
	}

	.advert1 {
		flex: 1;
		display: flex;
		flex-direction: column;

		.item {
			flex: 1;
			min-height: 0;
			border-style: solid;
		}

		.image {
			display: block;
			width: 100%;
			height: 100%;
		}
	}

	.advert2 {
		flex: 1;
		display: flex;

		.item {
			flex: 1;
			min-width: 0;
		}

		.image {
			display: block;
			width: 100%;
			height: auto;
			aspect-ratio: 1;
		}
	}

	.advert3 {
		flex: 1;
		display: flex;

		.item {
			flex: 1;
			min-width: 0;
		}

		.image {
			display: block;
			width: 100%;
			height: auto;
			aspect-ratio: 1 / 3;
		}
	}

	.advert4 {
		flex: 1;
		display: flex;
		flex-direction: column;

		.item {
			flex: 1;
			min-height: 0;

			&:nth-child(1) {
				display: flex;

				.pic {
					flex: 1;
					min-width: 0;
				}
			}
		}

		.image {
			display: block;
			width: 100%;
			height: 100%;
		}
	}

	.advert5 {
		flex: 1;
		display: flex;
		flex-direction: column;

		.item {
			flex: 1;
			min-height: 0;

			&:nth-child(2) {
				display: flex;

				.pic {
					flex: 1;
				}
			}
		}

		.image {
			display: block;
			width: 100%;
			height: 100%;
		}
	}

	.advert6 {
		flex: 1;
		display: flex;

		.item {
			flex: 1;
			min-width: 0;

			&:nth-child(2) {
				display: flex;
				flex-direction: column;

				.pic {
					flex: 1;
					min-height: 0;
				}
			}
		}

		.image {
			display: block;
			width: 100%;
			height: 100%;
		}
	}

	.advert7 {
		flex: 1;
		display: flex;

		.item {
			flex: 1;
			min-width: 0;

			&:nth-child(1) {
				display: flex;
				flex-direction: column;

				.pic {
					flex: 1;
					min-height: 0;
				}
			}
		}

		.image {
			display: block;
			width: 100%;
			height: 100%;
		}
	}

	.advert8 {
		flex: 1;
		display: flex;
		flex-wrap: wrap;

		.item {
			flex: 0 0 50%;
			min-width: 0;
		}

		.image {
			display: block;
			width: 100%;
			height: 100%;
		}
	}

	.advert9 {
		flex: 1;
		display: flex;
		flex-direction: column;

		.item {
			flex: 1;
			min-height: 0;
			display: flex;
		}

		.pic {
			flex: 1;
			min-width: 0;
		}

		.image {
			display: block;
			width: 100%;
			height: 100%;
		}
	}

	.advert10 {
		flex: 1;
		display: flex;

		.item {
			flex: 1;
			min-width: 0;

			&:nth-child(2) {
				display: flex;
				flex-direction: column;
			}
		}

		.pic-wrap {
			flex: 1;
			min-height: 0;
			display: flex;

			.pic {
				flex: 1;
				min-width: 0;
			}
		}

		.image {
			display: block;
			width: 100%;
			height: 100%;
		}
	}

	.advert11 {
		flex: 1;

		.pic {
			width: 100%;
			height: 100%;
		}

		.image {
			display: block;
			width: 100%;
			height: 100%;
		}
	}

	.advert12 {
		flex: 1;
		position: relative;

		.item {
			position: absolute;
			border-style: solid;
			border-color: transparent;
		}

		.image {
			display: block;
			width: 100%;
			height: 100%;
		}
	}
}
</style>