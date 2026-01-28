<template>
	<view :style="[boxStyle]" class="relative">
		<view :style="[boxContentStyle]" @tap="goRank">
			<view class="flex-between-center p-24" style="padding-bottom: 0;">
				<text class="fs-32 fw-500" v-if="titleConfig">{{ titleTxtConfig }}</text>
				<image :src="titleImg" class="w-102 h-32" v-else></image>
				<navigator class="fs-24 text--w111-999" :style="[headerBntColor]" url="/pages/activity/rank/index" hover-class="none">
					{{ headerBtnText }}
					<text class="iconfont icon-ic_rightarrow fs-24"></text>
				</navigator>
			</view>
			<scroll-view scroll-x="true" class="white-nowrap vertical-middle w-full mt-20" show-scrollbar="false"
				v-if="styleConfig == 0">
				<view style="white-space: nowrap;" class="p-24 flex">
					<view class="mr-20"
						v-for="(item, index) of filterList" :key="item.cate_id">
						<view class="rank-card" :style="[rankCardStyle]">
							<view class="fs-28 lh-40rpx fw-600 flex-y-center" :style="[rankItemTitleStyle]">
								<text class="iconfont icon-ic_fire fs-32"></text>
								<text class="pl-8 font-color">{{ item.cate_name }}</text>
							</view>
							<view class="rd-12rpx bg--w111-fff mt-18 p-16" v-if="item.list.length">
								<navigator hover-class="none" :url="`/pages/goods_details/index?id=${good.product_id}`" class="rank-pro-item flex-y-center" v-for="(good, goodIndex) in item.list" :key="good.product_id">
									<view class="w-108 h-108 relative">
										<image :src="good.image" :style="[imgStyle]" class="w-full h-full" />
										<view class="rank_count fs-24 text--w111-fff flex-center" :class="'rank-count' + (goodIndex + 1)">{{
											goodIndex + 1 }}</view>
									</view>
									<view class="pl-16">
										<view class="w-180 line1 fs-26 lh-36rpx mb-8">{{ good.store_name }}</view>
										<priceFormat :price="good.price" weight intSize="28" floatSize="28" labelSize="28" />
									</view>
								</navigator>
							</view>
						</view>
					</view>
					<view class="last-item-placeholder" />
				</view>
			</scroll-view>
			<view v-else>
				<scroll-view scroll-x="true" class="white-nowrap vertical-middle w-full mt-20" show-scrollbar="false">
					<view style="white-space: nowrap;" class="p-24">
						<view class="inline-block type-3 rd-16rpx" :class="{ 'mr-24': index !== filterList.length - 1 }" :style="[rankCardStyle]" v-for="(item, index) of filterList"
							:key="item.cate_id">
							<view class="fs-26 fw-500" :style="[rankItemTitleStyle]">{{ item.cate_name }}</view>
							<view class="flex mt-20">
								<navigator hover-class="none" :url="`/pages/goods_details/index?id=${item.list[0].product_id}`" class="w-296 h-296 relative mr-12" v-if="item.list[0]">
									<image :src="item.list[0].image" class="w-full h-full" :style="[imgStyle]"></image>
									<image class="abs-lt w-72 h-72" :src="`${imgHost}/static/images/rank_icon1.png`"></image>
								</navigator>
								<view>
									<navigator hover-class="none" :url="`/pages/goods_details/index?id=${item.list[1].product_id}`" class="w-142 h-142 relative" v-if="item.list[1]">
										<image :src="item.list[1].image" class="w-full h-full"
											:style="[imgStyle, { width: '142rpx', height: '142rpx' }]"></image>
										<image class="abs-lt w-48 h-48" :src="`${imgHost}/static/images/rank_icon2.png`"></image>
									</navigator>
									<navigator hover-class="none" :url="`/pages/goods_details/index?id=${item.list[2].product_id}`" class="w-142 h-142 relative mt-12" v-if="item.list[2]">
										<image :src="item.list[2].image" class="w-full h-full" :style="[imgStyle]" />
										<image class="abs-lt w-48 h-48" :src="`${imgHost}/static/images/rank_icon3.png`"></image>
									</navigator>
								</view>
							</view>
							<view class="mt-20 fs-26 w-280 line1">{{ item.list[0].store_name }}</view>
							<view class="flex items-baseline mt-10" :style="[priceColor]">
								<priceFormat :price="item.list[0].price" weight intSize="28" floatSize="28" labelSize="28" />
								<text class="fs-20 text--w111-999 text-line pl-8" v-if="item.list[0].ot_price">₭{{ item.list[0].ot_price || '' }}</text>
							</view>
						</view>
						<view class="last-item-placeholder-style2 inline-block" />
					</view>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
import { HTTP_REQUEST_URL } from '@/config/app';
import { hotRankingList } from '@/api/api.js';
import { diyUtil } from '@/utils/diy';
export default {
	name: 'ranking',
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
			imgHost: HTTP_REQUEST_URL,
			rankList: []
		};
	},
	computed: {
		filterList() {
			return this.rankList.filter(item => item.list.length > 0);
		},
		boxStyle() {
			return {
				boxShadow: diyUtil.buildShadowStyle(this.dataConfig.shadowConfig),
				padding: `${this.dataConfig.topConfig.val * 2}rpx ${this.dataConfig.prConfig.val * 2}rpx ${this.dataConfig.bottomConfig.val * 2}rpx`,
				marginTop: diyUtil.buildMarginTopOffset(this.dataConfig.mbConfig, this.dataConfig.offsetYConfig),
				zIndex: diyUtil.calcZIndex(this.index),
				background: this.dataConfig.bottomBgColor.color[0].item
			};
		},
		boxContentStyle() {
			let borderRadius = `${this.dataConfig.fillet.val * 2}rpx`;
			if (this.dataConfig.fillet.type) {
				borderRadius = `${this.dataConfig.fillet.valList[0].val * 2}rpx ${this.dataConfig.fillet.valList[1].val * 2}rpx ${this.dataConfig.fillet.valList[3].val * 2}rpx ${this.dataConfig.fillet.valList[2].val * 2
					}rpx`;
			}
			return {
				borderRadius,
				background: `linear-gradient(90deg, ${this.dataConfig.moduleColor.color[0].item} 0%, ${this.dataConfig.moduleColor.color[1].item} 100%)`
			};
		},
		styleConfig() {
			return this.dataConfig.styleConfig.tabVal;
		},
		/*标题是文本还是图片*/
		titleConfig() {
			return this.dataConfig.titleConfig.tabVal;
		},
		/*标题文本*/
		titleTxtConfig() {
			return this.dataConfig.titleTxtConfig.value;
		},
		/*标题图片*/
		titleImg() {
			return this.dataConfig.imgConfig.url;
		},
		/*卡片颜色和圆角*/
		rankCardStyle() {
			let filletBg = this.dataConfig.filletBg.type;
			let valListBg = this.dataConfig.filletBg.valList;
			let filletValBg = this.dataConfig.filletBg.val;
			return {
				'border-radius': filletBg ? valListBg[0].val + 'px ' + valListBg[1].val + 'px ' + valListBg[3].val + 'px ' + valListBg[2].val + 'px' : filletValBg + 'px',
				background: diyUtil.buildLinearColor(this.dataConfig.listBgColor, "to bottom"),
				boxShadow: diyUtil.buildShadowStyle(this.dataConfig.rankShadowConfig,)
			};
		},
		/*商品图片圆角样式*/
		imgStyle() {
			let borderRadius = `${this.dataConfig.filletImg.val * 2}rpx`;
			if (this.dataConfig.filletImg.type) {
				borderRadius = `${this.dataConfig.filletImg.valList[0].val * 2}rpx ${this.dataConfig.filletImg.valList[1].val * 2}rpx ${this.dataConfig.filletImg.valList[3].val * 2}rpx ${this.dataConfig.filletImg.valList[2].val * 2
					}rpx`;
			}
			return {
				borderRadius
			};
		},
		rankItemTitleStyle() {
			return {
				color: this.dataConfig.toneConfig.tabVal ? this.dataConfig.classColor.color[0].item : 'var(--view-theme)'
			};
		},
		/* 价格颜色 */
		priceColor() {
			return {
				color: this.dataConfig.toneConfig.tabVal ? this.dataConfig.goodsPriceColor.color[0].item : 'var(--view-theme)'
			};
		},
		/*头部按钮样式*/
		headerBntColor() {
			return {
				color: this.styleConfig ? this.dataConfig.headerBntColor.color[0].item : '#999999',
				fontSize: `${this.dataConfig.bntNumber.val * 2}rpx`
			};
		},
		headerBtnText() {
			return this.dataConfig.rightBntConfig.value;
		}
	},
	created() {
		this.getList();
	},
	inject: ["parentDiyId"],
	methods: {
		getList() {
			hotRankingList({
				diy_id: this.parentDiyId,
				unique: this.unique || ""
			}).then((res) => {
				this.rankList = res.data;
			});
		},
		goRank() {
			uni.navigateTo({
				url: '/pages/columnGoods/rank/index'
			});
		}
	}
};
</script>

<style>
.rank-card {
	width: 372rpx;
	padding: 22rpx 16rpx 18rpx;
}

.rank_count {
	width: 30rpx;
	height: 32rpx;
	position: absolute;
	top: 0;
	left: 0;
	background-size: cover;
}

.rank-count1 {
	background-image: url('@/static/images/rank1_icon.png');
}

.rank-count2 {
	background-image: url('@/static/images/rank2_icon.png');
}

.rank-count3 {
	background-image: url('@/static/images/rank3_icon.png');
}

.type-3 {
	padding: 20rpx;
}

.rank-pro-item~.rank-pro-item {
	margin-top: 16rpx;
}

.last-item-placeholder {
	width: 4rpx;
	flex-shrink: 0;
}

.last-item-placeholder-style2 {
	width: 24rpx;
	height: 1px;
}
</style>
