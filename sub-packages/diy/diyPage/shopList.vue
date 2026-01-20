<template>
	<view :style="[commonVars]" class="home-store-comp relative">
		<view class="top-title">
			<image v-if="dataConfig.titleType.tabVal == 0" mode="aspectFill" :src="dataConfig.titleImg.url"
				class="title-img" />
			<view v-else class="title-text">
				ຮ້ານແນະນຳ
			</view>
			<view class="filter-box" v-if="dataConfig.filterBtn.tabVal == 0">
				<text class="filter-item" :class="{ active: sortType == 0 }" @click="sortType = 0">ລວມ</text>
				<text class="filter-item-divider"></text>
				<text class="filter-item" :class="{ active: sortType == 1 }" @click="sortType = 1">ໄລຍະຫ່າງ</text>
			</view>
		</view>
		<!-- 样式一 -->
		<template v-if="dataConfig.styleConfig.tabVal == 0">
			<view v-for="store of storeList" :key="store.mer_id" class="store-item store-style1"
				:style="'--bg-src: url(' + store.mer_banner + ')'">
				<navigator class="top-banner" :url="`/pages/store/home/index?id=${store.mer_id}`" hover-class="none">
					<view class="mer-info-box">
						<image :src="store.mer_avatar" class="mer-avatar" />
						<text class="store-name">{{ store.mer_name }}</text>
						<text class="divider"></text>
						<text class="store-desc">{{ calcDistance(store) }}km</text>
						<text class="store-type">{{ store.mer_type_name }}</text>
					</view>
				</navigator>
				<view class="good-list" v-if="getGoodList(store).length">
					<view @click="handleToGoodDetail(good.product_id)" class="good-item"
						v-for="good of getGoodList(store)" :key="good.product_id">
						<image :src="good.image" class="good-img" />
						<p class="good-name line1" v-if="dataConfig.goodsInfo.type.includes(0)">{{ good.store_name }}</p>
						<p class="good-price" v-if="dataConfig.goodsInfo.type.includes(1)">￥{{ good.price }}</p>
					</view>
				</view>
			</view>
		</template>
		<!-- 样式二 -->
		<template v-else-if="dataConfig.styleConfig.tabVal == 1">
			<view v-for="store of storeList" :key="store.mer_id" class="store-item store-style2"
				:style="'--bg-src: url(' + store.mer_banner + ')'">
				<navigator class="store-info" :url="`/pages/store/home/index?id=${store.mer_id}`" hover-class="none">
					<image :src="store.mer_avatar" class="store-avatar" />
					<view>
						<view class="store-name">
							{{ store.mer_name }}
							<text class="store-type">{{ store.mer_type_name }}</text>
						</view>
						<view class="store-desc">
							<text class="store-follow-text">
								{{ store.care_count | formatCareCount }} ຄົນຕິດຕາມ
							</text>
							<text class="store-divider"></text>
							<text class="store-distance">
								{{ calcDistance(store) }}km
							</text>
						</view>
					</view>
				</navigator>
				<view class="good-list">
					<view @click="handleToGoodDetail(good.product_id)" class="good-item"
						v-for="good of getGoodList(store)" :key="good.product_id">
						<image :src="good.image" class="good-img" />
						<p class="good-name line1" v-if="dataConfig.goodsInfo.type.includes(0)">{{ good.store_name }}</p>
						<view v-if="dataConfig.goodsInfo.type.includes(1)" style="color: var(--view-priceColor)">
							<priceFormat :price="good.price" weight />
						</view>
					</view>
				</view>
			</view>
		</template>
		<!-- 样式三 -->
		<view class="store-grid" v-else-if="dataConfig.styleConfig.tabVal == 2">
			<image v-for="store of storeList" :key="store.mer_id" class="store-item store-style3" :src="store.mer_avatar"
				mode="aspectFit" @click="handleToStoreDetail(store.mer_id)" />
		</view>
		<navigator class="more-btn" v-if="dataConfig.moreBtn.tabVal == 0 && storeList.length"
			:url="linkUrl">
			ຮ້ານເພີ່ມເຕີມ
			<text class="iconfont icon-ic_rightarrow" />
		</navigator>
	</view>
</template>

<script>
import { storeList } from '@/api/api.js';
import { diyUtil } from "@/utils/diy.js";
import { mapGetters } from 'vuex';
import { getDistanceInMeters } from "@/utils/location";

export default {
	name: 'shopList',
	props: {
		dataConfig: {
			type: Object,
			default: () => ({})
		},
		index: {
			type: Number,
			default: 0
		}
	},
	data() {
		return {
			sortType: this.dataConfig.storeSort.tabVal, // 0:ລວມ 1:ໄລຍະຫ່າງ
			storeList: [],
		};
	},
	watch: {
		baseWhere: {
			handler(val) {
				this.getStoreMerchant();
			},
			immediate: true
		}
	},
	inject: ["parentDiyId"],
	filters: {
		formatCareCount(count) {
      if (count < 10000) return count;
      return parseInt(count / 10000) + "ໝື່ນ";
    }
	},
	computed: {
		...mapGetters(['location']),
		linkUrl() {
			if (this.dataConfig.linkConfig?.value) {
				return this.dataConfig.linkConfig.value;
			}

			return "/pages/store/shopStreet/index";
		},
		commonVars() {
			const {
				titleColor,
				titleFontSize,
				titleFontStyle,

				storeImgRounded,
				storePadding,
				storeNameStyle,
				storeNameColor,
				selfSupportBgColor,
				selfSupportTextColor,

				goodsImgRounded,
				goodsPadding,
				goodsNameColor,
				goodsNameStyle,
				goodsShadowConfig,

				componentFloat,
				componentBg,
				componentBottomBg,
				marginTop,
				marginBottom,
				marginLr,
				itemMarginTop,
				bgRadius
			} = this.dataConfig;
			const vars = {
				'--title-color': titleColor.color[0].item,
				'--title-font-size': titleFontSize.val + 'px',

				'--store-img-rounded': diyUtil.buildBorderRadius(storeImgRounded, "top"),
				'--store-gap': storePadding.val + 'px',
				'--store-name-color': storeNameColor.color[0].item,
				'--self-support-bg-color': selfSupportBgColor.color[0].item,
				'--self-support-text-color': selfSupportTextColor.color[0].item,

				'--goods-img-rounded': diyUtil.buildBorderRadius(goodsImgRounded),
				'--goods-gap': goodsPadding.val + 'px',
				'--goods-name-color': goodsNameColor.color[0].item,
				'--goods-shadow': diyUtil.buildShadowStyle(goodsShadowConfig),

				'--z-index': diyUtil.calcZIndex(this.index),
				'--comp-bg': diyUtil.buildLinearColor(componentBg),
				'--base-bg': componentBottomBg.color[0].item,
				'--comp-pt': marginTop.val + 'px',
				'--comp-pb': marginBottom.val + 'px',
				'--comp-p-inline': marginLr.val + 'px',
				'margin-top': diyUtil.buildMarginTopOffset(itemMarginTop, componentFloat),
				'--comp-bg-radius': diyUtil.buildBorderRadius(bgRadius),
				'--comp-shadow': diyUtil.buildShadowStyle(this.dataConfig.shadowConfig),
			};

			if (titleFontStyle.tabVal == 1) {
				vars['--title-font-style'] = 'italic';
			} else if (titleFontStyle.tabVal == 2) {
				vars['--title-font-weight'] = 'bold';
			}

			if (storeNameStyle.tabVal == 0) {
				vars['--store-name-font-weight'] = 'bold';
			}

			if (goodsNameStyle.tabVal == 0) {
				vars['--goods-name-font-weight'] = 'bold';
			}

			return vars;
		},
		baseWhere() {
			const {
				selectStoreType,
				storeList,
				storeType,
				storeCate,
				storeGroup,
				storeNum,
				goodsNum
			} = this.dataConfig;

			const where = {
				diy_id: this.parentDiyId,
				unique: this.unique,
				page: 1,
				limit: storeNum.val || 4,
				good_limit: goodsNum.val || 4,
				sort: this.sortType == 0 ? '' : 'range_asc'
			};

			if (this.sortType == 1) {
				Object.assign(where, this.location);
			}

			const storeTypeValue = selectStoreType.activeValue;
			if (storeTypeValue === 1) { // 指定店铺
				where.mer_id = storeList.list.map(item => item.mer_id).join(',');
			} else if (storeTypeValue === 2) { // 店铺类型
				where.type_id = storeType.activeValue.join(',');
			} else if (storeTypeValue === 3) { // 品牌好店
				where.is_best = 1;
			} else if (storeTypeValue === 4) { // 商户分类
				where.category_id = storeCate.activeValue.join(',');
			} else if (storeTypeValue === 5) { // 商户分组
				where.region_id = storeGroup.activeValue.join(',');
			}

			return where;
		},
	},
	methods: {
		getGoodList(store) {
			return store.all_recommend.slice(0, this.baseWhere.good_limit || 999);
		},
		// 品牌好店
		getStoreMerchant() {
			storeList(this.baseWhere).then(res => {
				this.storeList = res.data.list.slice(0, this.baseWhere.limit);
			});
		},
		handleToGoodDetail(goodId) {
			uni.navigateTo({
				url: `/pages/goods_details/index?id=${goodId}`
			});
		},
		handleToStoreDetail(storeId) {
			uni.navigateTo({
				url: `/pages/store/home/index?id=${storeId}`
			});
		},
		calcDistance(store) {
			const { lat, long } = store;
			if (lat && long && this.location) {
				const distance = getDistanceInMeters(this.location, {
					latitude: Number(lat),
					longitude: Number(long)
				}) / 1000;
				return distance.toFixed(2);
			}

			return 0;
		}
	},
}
</script>

<style scoped lang="scss">
.top-title {
	padding: 0 10rpx 16rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;

	.title-text {
		color: var(--title-color);
		font-style: var(--title-font-style);
		font-weight: var(--title-font-weight);
		font-size: var(--title-font-size);
	}

	.title-img {
		width: 140rpx;
		height: 32rpx;
	}

	.filter-item {
		font-size: 13px;
		line-height: 13px;
		color: #666;

		&.active {
			font-weight: 500;
			color: #E93323;
		}
	}

	.filter-item-divider {
		display: inline-block;
		width: 1px;
		height: 8px;
		background: #CCCCCC;
		margin-inline: 10px;
	}
}

.more-btn {
	background-color: #fff;
	height: 40px;
	border-radius: 6px;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 13px;
	color: #999;
	margin-top: 10px;

	.iconfont {
		font-size: 10px;
		margin-left: 5px;
	}
}

.store-item {
	background: var(--comp-bg);
	border-radius: var(--comp-bg-radius);
}

.store-style1 {

	&+.store-item {
		margin-top: var(--store-gap);
	}

	.top-banner {
		position: relative;

		&::before {
			content: '';
			position: absolute;
			inset: 0;
			background: var(--bg-src) no-repeat center / cover;
			border-radius: var(--store-img-rounded);
		}

		aspect-ratio: calc(710 / 200);
		padding: 22rpx 20rpx;
	}

	.mer-info-box {
		position: relative;
		width: fit-content;
		height: 24px;
		background: #FFFFFF;
		border-radius: 20px;
		display: flex;
		align-items: center;
		padding: 0 5px 0 2px;

		.mer-avatar {
			width: 19px;
			height: 19px;
			border-radius: 50%;
			margin-right: 6px;
		}

		.store-name {
			font-weight: var(--store-name-font-weight);
			font-size: 14px;
			color: var(--store-name-color);
		}

		.divider {
			width: 1px;
			height: 12px;
			background: #D8D8D8;
			margin: 0 4px;
		}

		.store-desc {
			font-size: 12px;
			color: #282828;
		}

		.store-type {
			padding-inline: 5px;
			min-width: 28px;
			height: 15px;
			background: var(--self-support-bg-color);
			border-radius: 34px;
			font-size: 9px;
			color: var(--self-support-text-color);
			margin-left: 6px;
			display: inline-flex;
			align-items: center;
			justify-content: center;
		}
	}

	.good-list {
		--padding: 20rpx;
		display: grid;
		gap: var(--goods-gap);
		padding: var(--padding);
		overflow: auto;
		grid-auto-flow: column;
		grid-auto-columns: calc((100% - var(--goods-gap) * 2) / 3);

		.good-item {
			box-shadow: var(--goods-shadow);
			overflow: hidden;
		}

		.good-img {
			display: block;
			width: 100%;
			height: auto;
			aspect-ratio: 1;
			object-fit: cover;
			border-radius: var(--goods-img-rounded);
			margin-bottom: 9px;
		}

		.good-name {
			text-align: center;
			margin-bottom: 13px;
			font-size: 15px;
			color: var(--goods-name-color);
			font-weight: var(--goods-name-font-weight);
		}

		.good-price {
			font-weight: 600;
			font-size: 14px;
			color: var(--view-priceColor);
			text-align: center;
		}
	}
}

.store-style2 {
	background: var(--comp-bg);
	padding: 10px;
	padding-right: 0;

	&+.store-item {
		margin-top: var(--store-gap);
	}

	.store-info {
		display: flex;
		align-items: center;

		.store-avatar {
			width: 50px;
			height: 50px;
			border-radius: 6px;
			margin-right: 10px;
		}

		.store-name {
			font-size: 14px;
			color: var(--store-name-color);
			font-weight: var(--store-name-font-weight);
			display: inline-flex;
			align-items: center;
			margin-bottom: 16rpx;
		}

		.store-type {
			margin-left: 4px;
			background: var(--self-support-bg-color);
			color: var(--self-support-text-color);
			height: 16px;
			display: inline-flex;
			align-items: center;
			justify-content: center;
			padding-inline: 4px;
			border-radius: 2px;
			font-size: 10px;
		}

		.store-divider {
			width: 1px;
			height: 10px;
			background: #CCCCCC;
			margin: 0 4px;
		}

		.store-desc {
			font-size: 12px;
			color: #666666;
			line-height: 17px;
			display: flex;
			align-items: center;
		}
	}

	.good-list {
		margin-top: 3px;
		overflow: auto;
		white-space: nowrap;
		scrollbar-width: none;

		&::-webkit-scrollbar {
			display: none;
		}
	}

	.good-item {
		display: inline-block;
		box-shadow: var(--goods-shadow);
		width: 152rpx;

		&+.good-item {
			margin-left: var(--goods-gap);
		}

		&:first-child {
			margin-left: 60px;
		}

		.good-img {
			width: 100%;
			height: auto;
			aspect-ratio: 1;
			border-radius: var(--goods-img-rounded);
			margin-bottom: 6px;
		}

		.good-name {
			font-size: 12px;
			line-height: 17px;
			margin-bottom: 4px;
			text-align: center;
			color: var(--goods-name-color);
			font-weight: var(--goods-name-font-weight);
		}
	}
}

.store-grid {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: var(--store-gap);

	.store-style3 {
		width: 100%;
		height: auto;
		aspect-ratio: 1;
		object-fit: cover;
		border-radius: var(--store-img-rounded);
		background: var(--comp-bg);
	}
}

.home-store-comp {
	background: var(--base-bg);
	padding: var(--comp-pt) var(--comp-p-inline) var(--comp-pb);
	box-shadow: var(--comp-shadow);
	z-index: var(--z-index);
}
</style>
