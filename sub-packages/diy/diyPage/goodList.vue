<!-- 引用该组件时，需要在父组件中 mixins /mixins/cart.js 插件
 接收 goodList emit 的 selectAttr事件，并通过selectAttr 方法唤起商品规则选择面板 -->
<template>
	<view class="good-list-wrapper" :style="[compStyle]" v-if="baseWhere">
		<view class="filter-box" v-if="dataConfig.filterConfig.tabVal == 0">
			<view class="filter-item" v-for="(item, index) in whereConfig" :key="index"
				:class="{ active: where.sort == item.value }" @click="handleChangeSortType(item.value)">
				{{ item.type }}
				<template v-if="index">
					<template v-if="where.sort == item.value">
						<view class="iconfont icon-ic_downarrow" v-if="where.order"></view>
						<view class="iconfont icon-ic_uparrow" v-else></view>
					</template>
					<view class="iconfont icon-icon_sort-2" v-else></view>
				</template>
			</view>
		</view>

		<view class="good-list-box" :class="goodDisplayCss" @click="handleClickGood" :style="[listStyle]">
			<view v-for="good of goodsList" :key="good.product_id" class="good-item" :class="[
				`type-${dataConfig.styleConfig.tabVal}`
			]">
				<!-- 单列展示 -->
				<template v-if="dataConfig.styleConfig.tabVal === 0">
					<image data-event="detail" :data-good-id="good.product_id" :src="good.image" class="good-img"
						mode="aspectFill" />
					<view class="good-info-box">
						<good-info :dataConfig="dataConfig" :good="good" />
					</view>
				</template>

				<!-- 两列展示(纵向) -->
				<template v-else-if="dataConfig.styleConfig.tabVal === 1">
					<image data-event="detail" :data-good-id="good.product_id" :src="good.image" class="good-img"
						mode="aspectFill" />
					<view class="good-info-box">
						<good-info :dataConfig="dataConfig" :good="good" />
					</view>
				</template>

				<!-- 三列展示 -->
				<template v-else-if="dataConfig.styleConfig.tabVal === 2">
					<image data-event="detail" :data-good-id="good.product_id" :src="good.image" class="good-img"
						mode="aspectFill" />
					<navigator class="good-info-box flex-1 flex flex-col" hover-class="none" :url="buildGoodDetailUrl(good.product_id)">
						<view class="good-name line2">{{ good.store_name }}</view>
						<view class="good-price-wrap">
							<priceFormat :price="good.price" weight intSize="36" floatSize="26" labelSize="26" />
						</view>
					</navigator>
				</template>

				<!-- 两列展示(横向) -->
				<template v-else-if="dataConfig.styleConfig.tabVal === 3">
					<image data-event="detail" :data-good-id="good.product_id" :src="good.image" class="good-img"
						mode="aspectFill" />
					<navigator class="good-info-box" hover-class="none" :url="buildGoodDetailUrl(good.product_id)">
						<view class="good-name line2">{{ good.store_name }}</view>
						<priceFormat :price="good.price" weight intSize="36" floatSize="26" labelSize="26" />
					</navigator>
				</template>

				<!-- 大图展示 -->
				<template v-else-if="dataConfig.styleConfig.tabVal === 4">
					<image data-event="detail" :data-good-id="good.product_id" :src="good.image" class="good-img"
						mode="widthFix" />
					<view class="good-info-box">
						<good-info :dataConfig="dataConfig" :good="good" />
					</view>
				</template>

				<!-- 左右滑动展示 -->
				<template v-else-if="dataConfig.styleConfig.tabVal === 5">
					<image data-event="detail" :data-good-id="good.product_id" :src="good.image" class="good-img"
						mode="aspectFill" />
					<navigator class="good-info-box" hover-class="none" :url="buildGoodDetailUrl(good.product_id)">
						<view class="good-name line2">{{ good.store_name }}</view>
						<view class="good-price-wrap">
							<priceFormat :price="good.price" weight intSize="36" floatSize="26" labelSize="26" />
						</view>
					</navigator>
				</template>


				<good-cart @addCart="handleAddCart" :dataConfig="dataConfig" :good="good"
					v-if="dataConfig.styleConfig.tabVal !== 3" />
			</view>
		</view>
	</view>
</template>

<script>
import { diyUtil } from '@/utils/diy';
import { getProductslist, getStoreGoods } from '@/api/store';
import SvipPrice from "@/components/svip-price.vue";
import GoodInfo from "./components/good-info.vue";
import GoodCart from "./components/good-cart.vue";
import { mapState } from "vuex";

export default {
	name: "goodList",
	components: {
		SvipPrice,
		GoodInfo,
		GoodCart
	},
	props: {
		dataConfig: Object,
		index: {
			type: Number,
			default: 0
		}
	},
	inject: ["parentMerId"],
	data() {
		const { goodsSort, goodsSortType } = this.dataConfig;
		const whereConfig = this.initWhereConfig();
		return {
			whereConfig,
			where: {
				sort: goodsSort.tabVal, // 排序方式
				order: goodsSortType.tabVal, // 排序正序 or 倒序
			},

			goodsList: []
		};
	},
	computed: {
		...mapState({
			location: state => state.location.location,
		}),
		listStyle() {
			const { shadowConfig, filterConfig } = this.dataConfig;
			const style = {};
			if (shadowConfig) {
				style.boxShadow = diyUtil.buildShadowStyle(shadowConfig);
			}
			if (filterConfig.tabVal == 1) {
				style.paddingTop = `var(--card-gap)`;
			}
			return style;
		},
		// 基础筛选条件
		baseWhere() {
			// 筛选条件为空，说明后台未配置相关参数，不进行商品数据请求

			const {
				typeConfig,
				goodsList,
				classList,
				goodsLabel,
				goodsType,
				deliveryType,
				numberConfig
			} = this.dataConfig;
			const baseWhere = {
				limit: numberConfig.val,
			};

			if (typeConfig.activeValue === 1) {
				// 指定商品
				if (goodsList.ids && goodsList.ids.length) {
					baseWhere.ids = goodsList.ids.join(",");
				} else if (goodsList.list && goodsList.list.length) {
					baseWhere.ids = goodsList.list.map(i => i.product_id).join(",");
				} else {
					return null;
				}
			} else if (typeConfig.activeValue === 2) {
				if (!classList.classVal.length) return null;
				// 指定分类
				const cateIds = classList.classVal.join(",");
				if (this.parentMerId) {
					baseWhere.mer_cate_id = cateIds;
				} else {
					baseWhere.cate_id = cateIds;
				}
			} else if (typeConfig.activeValue === 3) {
				if (!goodsLabel.activeValue.length) return null;
				// 指定标签
				const storeLabelIds = goodsLabel.activeValue.join(",");
				if (this.parentMerId) {
					baseWhere.mer_store_label_id = storeLabelIds;
				} else {
					baseWhere.store_label_id = storeLabelIds;
				}
			} else if (typeConfig.activeValue === 4) {
				if (!goodsType || !goodsType.activeValue.length) return null;
				// 商品类型
				baseWhere.store_type_id = goodsType.activeValue.join(",");
			} else if (typeConfig.activeValue === 5) {
				// 配送方式
				if (!deliveryType || !deliveryType.activeValue.length) return null;
				baseWhere.delivery_type = deliveryType.activeValue.join(",");
			}

			if (this.where.sort !== 0) {
				// Non-comprehensive type, need to add sort condition
				const sortKeyMap = {
					1: "distance",
					2: "sales",
					3: "price",
				};
				const sortKey = sortKeyMap[this.where.sort];
				const sortOrder = this.where.order === 0 ? "asc" : "desc";
				baseWhere.order = sortKey + "_" + sortOrder;

				if (sortKey === "distance" && this.location) {
					Object.assign(baseWhere, {
						latitude: this.location.latitude,
						longitude: this.location.longitude,
					});
				}
			}

			return baseWhere;
		},
		// 组件样式
		compStyle() {
			const { ptConfig, moduleColor, bottomBgColor, gapConfig, topConfig, bottomConfig, prConfig, mbConfig, fillet, filterConfig, toneCartConfig, bntBgColor, filletImg, goodsName, toneConfig, goodsNameColor, goodsPriceColor, soldNumColor, scoreColor,
				goodShadowConfig,
			} = this.dataConfig;

			const styles = {
				"--comp-bg": bottomBgColor.color[0].item,
				"--padding-top": topConfig.val + "px",
				"padding-bottom": bottomConfig.val + "px",
				"padding-inline": prConfig.val + "px",
				"margin-top": diyUtil.buildMarginTopOffset(mbConfig, ptConfig),
				"--card-radius": diyUtil.buildBorderRadius(fillet),
				"--card-gap": gapConfig ? gapConfig.val + "px" : "9px",
				"--good-img-radius": diyUtil.buildBorderRadius(filletImg),
				"--z-index": diyUtil.calcZIndex(this.index)
			};

			if (goodShadowConfig) {
				styles["--card-shadow"] = diyUtil.buildShadowStyle(goodShadowConfig);
			}

			if (moduleColor) {
				styles["--card-bg"] = diyUtil.buildLinearColor(moduleColor);
			}

			if (goodsName) {
				styles["--goods-name-font-weight"] = goodsName.tabList[goodsName.tabVal].style;
			}

			if (toneCartConfig.val === 1) {
				styles["--car-bg"] = diyUtil.buildLinearColor(bntBgColor);
			}

			if (toneConfig.tabVal === 1) {
				Object.assign(styles, {
					"--good-name-color": goodsNameColor.color[0].item,
					"--good-price-color": goodsPriceColor.color[0].item,
					"--good-sale-color": soldNumColor.color[0].item,
					"--good-score-color": scoreColor.color[0].item
				});
			}

			return styles;
		},

		// 控制各部位展示信息是否展示
		goodDisplayCss() {
			const { checkboxInfo } = this.dataConfig;
			const displayMapCss = {
				0: "show-good-name",
				1: "show-good-label",
				2: "show-good-price",
				3: "show-good-sale",
				4: "show-good-score",
				5: "show-vip-price",
				6: "show-reply-count",
				7: "show-distance"
			};

			return checkboxInfo.type.reduce((acc, key) => {
				if (displayMapCss[key]) {
					acc.push(displayMapCss[key]);
				}
				return acc;
			}, [
				`good-list-type-${this.dataConfig.styleConfig.tabVal}`
			]);
		},
	},
	watch: {
		baseWhere: {
			handler() {
				this.getGoodsList();
			},
			immediate: true
		},
		location() {
			if (this.where.sort === 1) {
				this.getGoodsList();
			}
		}
	},
	created() {
	},
	methods: {
		initWhereConfig() {
			const whereConfig = [
				{
					type: "ລວມ",
					value: 0
				},
				{
					type: "ໄລຍະຫ່າງ",
					value: 1,
				},
				{
					type: "ຍອດຂາຍ",
					value: 2,
				},
				{
					type: "ລາຄາ",
					value: 3
				}
			];
			if (this.parentMerId) {
				whereConfig.splice(1, 1);
			}
			return whereConfig;
		},
		async getGoodsList() {
			if (!this.baseWhere) return;
			try {
				const task = this.parentMerId ? getStoreGoods(this.parentMerId, this.baseWhere) : getProductslist(this.baseWhere);
				const res = await task;
				this.goodsList = res.data.list;
			} catch (error) {
				console.log(error);
			}
		},
		buildGoodDetailUrl(goodId) {
			return `/pages/goods_details/index?id=${goodId}`;
		},
		handleChangeSortType(value) {
			if (this.where.sort === value) {
				this.where.order = this.where.order === 0 ? 1 : 0;
			} else {
				this.where.sort = value;
			}
		},
		handleClickGood(e) {
			const { event, goodId } = e.target.dataset;
			if (event === "detail" && goodId) {
				uni.navigateTo({
					url: this.buildGoodDetailUrl(goodId)
				});
			}
		},
		handleAddCart(good) {
			this.$emit("selectAttr", good);
		}
	}
}
</script>

<style scoped lang="scss">
::v-deep .good-list-wrapper .price-format {
	color: var(--good-price-color, var(--view-priceColor));
}

.good-list-wrapper {
	position: relative;
	z-index: var(--z-index, initial);
	background-color: var(--comp-bg);
}

.filter-box {
	display: flex;
	gap: 12px;
	padding-bottom: var(--card-gap);
	position: sticky;
	top: var(--diy-sticky-top, 0);
	z-index: 120;
	padding-top: var(--padding-top);
	background-color: var(--comp-bg);

	& .filter-item {
		flex: 1;
		height: 28px;
		background: #FFFFFF;
		border-radius: 6px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 12px;
		color: #282828;
		gap: 2px;

		&.active {
			font-weight: 500;

			.iconfont {
				color: var(--view-theme);
			}
		}

		.iconfont {
			font-size: 12px;
		}
	}
}

.good-list-box {

	&.good-list-type-1,
	&.good-list-type-2,
	&.good-list-type-3,
	&.good-list-type-5 {
		display: flex;
		gap: var(--card-gap);
	}

	&.good-list-type-2,
	&.good-list-type-3 {
		border-radius: var(--good-img-radius);
		background-color: #fff;
	}


	&.good-list-type-1,
	&.good-list-type-2,
	&.good-list-type-3 {
		flex-wrap: wrap;
	}

	&.good-list-type-2 {
		padding: 32rpx 20rpx;
	}

	&.good-list-type-3 {
		padding: 32rpx 24rpx;
	}

	&.good-list-type-5 {
		padding: 32rpx 20rpx;
		overflow: auto;
		border-radius: var(--card-radius);
		background-color: #fff;
	}
}

::v-deep .good-list-box {
	// 通过父类包含的 css，控制所有子组件展示具体字段的信息
	$display-map: (
		show-good-name: ".good-name",
		show-good-label: ".good-tag-list",
		show-good-price: ".price-format",
		show-good-sale: ".good-sale",
		show-good-score: ".good-score",
		show-vip-price: ".svip-price",
		show-reply-count: ".good-reply-count",
		show-distance: ".store-distance"
	);

@each $key, $value in $display-map {
	&:not(.#{$key}) {
		#{$value} {
			display: none;
		}
	}
}
}

::v-deep .good-name {
	font-weight: var(--goods-name-font-weight);
	color: var(--good-name-color, #282828);
}

.good-item {
	background: var(--card-bg, #fff);
	border-radius: var(--card-radius);
	box-shadow: var(--card-shadow);
	position: relative;

	.good-info-box {
		overflow: hidden;
	}

	&.type-0 {
		&+.good-item {
			margin-top: var(--card-gap);
		}

		display: flex;
		padding: 20rpx;

		.good-img {
			width: 224rpx;
			height: 224rpx;
			border-radius: var(--good-img-radius);
			margin-right: 20rpx;
		}

		.good-info-box {
			flex: 1;
		}
	}

	&.type-1 {
		width: calc((100% - var(--card-gap)) / 2);

		--good-cart-bottom: 18rpx;
		--good-cart-right: 24rpx;

		.good-info-box {
			padding: 10rpx 24rpx 24rpx;
		}

		.good-img {
			width: 100%;
			height: auto;
			aspect-ratio: 1;
			display: block;
			border-radius: var(--good-img-radius);
		}
	}

	&.type-2 {
		width: calc((100% - var(--card-gap) * 2) / 3);
		display: flex;
		flex-flow: column nowrap;

		--good-cart-bottom: 0rpx;
		--good-cart-right: 0rpx;

		.good-info-box {
			padding-top: 24rpx;

			.good-name {
				font-size: 28rpx;
				line-height: 40rpx;
				margin-bottom: 18rpx;
			}
		}

		.good-img {
			width: 100%;
			height: auto;
			aspect-ratio: 1;
			display: block;
			border-radius: var(--good-img-radius);
		}

		.good-price-wrap {
			margin-top: auto;
		}
	}

	&.type-3 {
		width: calc((100% - var(--card-gap)) / 2);
		display: flex;

		.good-img {
			width: 144rpx;
			height: 144rpx;
			margin-right: 20rpx;
			border-radius: var(--good-img-radius);
		}

		.good-info-box {
			flex: 1;
			display: flex;
			flex-flow: column nowrap;

			.good-name {
				font-size: 26rpx;
				line-height: 36rpx;
				margin-bottom: auto;
			}
		}

	}

	&.type-4 {
		--good-cart-bottom: 20rpx;
		--good-cart-right: 24rpx;

		&+.good-item {
			margin-top: var(--card-gap);
		}

		.good-img {
			border-radius: var(--good-img-radius);
			display: block;
			width: 100%;
			height: auto;
		}

		.good-info-box {
			padding: 24rpx;
		}
	}

	&.type-5 {
		flex: 0 0 200rpx;
		--good-cart-bottom: 0;
		--good-cart-right: 0;
		display: flex;
		flex-flow: column nowrap;


		.good-img {
			width: 100%;
			display: block;
			height: auto;
			aspect-ratio: 1;
			border-radius: var(--good-img-radius);
		}

		.good-info-box {
			flex: 1;
			padding-top: 20rpx;
			display: flex;
			flex-flow: column nowrap;

			.good-name {
				font-size: 28rpx;
				line-height: 40rpx;
				margin-bottom: auto;
			}

			.good-price-wrap {
				margin-top: 12rpx;
			}
		}
	}
}
</style>
