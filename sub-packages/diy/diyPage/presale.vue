<template>
	<view :style="[boxStyle]" v-if="productList.length" class="relative">
		<view :style="[boxContentStyle]" class="presale-wrapper">
			<!-- 预售头部 -->
			<view class="w-full h-96 px-24 flex-between-center bg-cover" :style="[headerStyle]">
				<view class="flex-y-center">
					<text class="fs-32 lh-44rpx fw-500" :style="[titleStyle]" v-if="titleConfig">{{ titleTxtConfig }}</text>
					<image :src="titleImg" class="w-140 h-32" v-else></image>
					<text class="fs-28 text--w111-ccc px-16" :style="[dividerColor]">|</text>
					<text class="fs-26 text--w111-999 lh-36rpx" :style="[tipsColor]">{{ tipTxt }}</text>
				</view>
				<view class="flex-y-center fs-24 text--w111-999" :style="[headerBntColor]"
					@tap="goPage('/pages/activity/presell/index')">
					<text>{{ rightBntTxt }}</text>
					<text class="iconfont icon-ic_rightarrow fs-24"></text>
				</view>
			</view>
			<!-- 预售列表 -->
			<!-- 单列 -->
			<view class="pt-32 pr-20 pb-32 pl-20 bg--w111-fff" :style="[contentBox]" v-if="goodStyleConfig == 0">
				<view class="w-full flex justify-between item sale-item" v-for="(item, index) in productList" :key="index"
					@tap="goDetails(item)">
					<image :src="item.product.image" mode="aspectFill"
						:style="{ width: '240rpx', height: '240rpx', borderRadius: imgStyle }" />
					<view class="flex-1 flex-col justify-between pl-20 h-240">
						<view class="w-full fs-28 h-80 lh-40rpx line2" :style="[productStyle]" v-if="checkboxInfo.includes(0)">
							{{ item.store_name }}
						</view>
						<view class="item_tags acea-row row-middle">
							<view class="presale-label" v-if="item.coupon">领券</view>
							<view class="presale-label" v-if="item.delivery_free == 1">包邮</view>
						</view>
						<view class="flex w-full h-68 rd-8rpx relative"
							:style="{ background: dataConfig.goodsBntColor.color[0].item }" v-if="!showBtn">
							<view class="flex-y-center pl-20 fs-22 btn-left "
								:style="{ color: dataConfig.goodsBntColor.color[0].item }">
								<!--  v-if="checkboxInfo.includes(2)" -->
								<view :style="{ color: priceColor }">
									预售:
									<priceFormat :price="item.price" intSize="40" floatSize="26" labelSize="26" weight />
								</view>
							</view>
							<view class="flex-center fs-26 fw-bold text--w111-fff btn-right" :style="[btnBgColor]">
								{{ item.product_status | filterType }}</view>
							<image class="shandian" src="@/static/images/presale.png"></image>
						</view>
					</view>
				</view>
			</view>
			<!-- 两列 -->
			<view class="grid-column-2 grid-gap-22rpx pt-32 pr-20 pb-32 pl-20" v-if="goodStyleConfig == 1">
				<view class="sale-item" v-for="(item, index) in productList" :key="index" @tap="goDetails(item)">
					<image :src="item.product.image" mode="aspectFill"
						:style="{ width: '100%', height: '324rpx', borderRadius: imgStyle }" />
					<view class="w-full line2 mt-16 fs-28 lh-40rpx" :style="[productStyle]" v-if="checkboxInfo.includes(0)">
						{{ item.store_name }}</view>
					<view class="flex justify-between items-end mt-10">
						<view class="flex-col">
							<view :style="{ color: priceColor }" v-if="checkboxInfo.includes(2)">
								<priceFormat :price="item.price" intSize="36" floatSize="36" labelSize="24" weight />
							</view>
							<text class="text-line fs-26 text--w111-999 pt-14 Regular" :style="[otPriceColor]">¥{{ item.product.ot_price
								}}</text>
						</view>
						<view class='w-144 h-56 rd-30rpx flex-center fs-24 text--w111-fff bg--w111-E93323' v-if="!showBtn"
							:style="[btnBgColor]">去预定</view>
					</view>
				</view>
			</view>
			<!-- 三列 -->
			<view class="grid-column-3 grid-gap-18rpx pt-32 pr-20 pb-32 pl-20" v-if="goodStyleConfig == 2">
				<view class="sale-item" v-for="(item, index) in productList" :key="index" @tap="goDetails(item)">
					<image :src="item.product.image" mode="aspectFill"
						:style="{ width: '100%', height: '212rpx', borderRadius: imgStyle }" />
					<view class="w-full line1 mt-16 fs-26" :style="[productStyle]" v-if="checkboxInfo.includes(0)">
						{{ item.store_name }}</view>
					<view class="flex items-baseline mt-12">
						<view :style="{ color: priceColor }" v-if="checkboxInfo.includes(2)">
							预售价
							<priceFormat :price="item.price" intSize="36" floatSize="36" labelSize="24" weight />
						</view>
					</view>
					<view class="text-line fs-24 text--w111-999 Regular lh-32rpx" :style="[otPriceColor]"
						v-if="checkboxInfo.includes(3)">¥{{ item.product.ot_price }}</view>
				</view>
			</view>
			<!-- 滑动 -->
			<scroll-view scroll-x="true" show-scrollbar="false" class="white-nowrap vertical-middle w-full pt-32 pb-32"
				v-if="goodStyleConfig == 3">
				<view style="white-space: nowrap;">
					<view class="inline-block ml-20 sale-item" v-for="(item, index) in productList" :key="index"
						@tap="goDetails(item)">
						<image :src="item.product.image" mode="aspectFill"
							:style="{ width: '224rpx', height: '224rpx', borderRadius: imgStyle }" />
						<view class="w-222 line1 mt-16 fs-26" :style="[productStyle]" v-if="checkboxInfo.includes(0)">
							{{ item.store_name }}</view>
						<view class="flex items-baseline mt-12">
							<view :style="{ color: priceColor }" v-if="checkboxInfo.includes(2)">
								预售价
								<priceFormat :price="item.price" intSize="36" floatSize="36" labelSize="24" weight />
							</view>
						</view>
						<view class="text-line fs-24 text--w111-999 Regular lh-32rpx" :style="[otPriceColor]"
							v-if="checkboxInfo.includes(3)">¥{{ item.product.ot_price }}</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
import { getPresellData } from '@/api/api.js';
import { diyUtil } from '@/utils/diy';

export default {
	name: 'presale',
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
	filters: {
		filterType(val) {
			let obj = {
				1: '立即预定',
				2: '已结束'
			};
			return obj[val]
		}
	},
	data() {
		return {
			productList: [],
		};
	},
	computed: {
		boxStyle() {
			return {
				zIndex: diyUtil.calcZIndex(this.index),
				boxShadow: diyUtil.buildShadowStyle(this.dataConfig.shadowConfig),
				padding: `${this.dataConfig.topConfig.val * 2}rpx ${this.dataConfig.prConfig.val * 2}rpx ${this.dataConfig.bottomConfig.val * 2}rpx`,
				marginTop: diyUtil.buildMarginTopOffset(this.dataConfig.mbConfig, this.dataConfig.offsetYConfig),
				background: this.dataConfig.bottomBgColor.color[0].item,
				"--good-shadow": diyUtil.buildShadowStyle(this.dataConfig.goodsShadowConfig),
			}
		},
		boxContentStyle() {
			return {
				borderRadius: diyUtil.buildBorderRadius(this.dataConfig.fillet),
				background: `linear-gradient(90deg, ${this.dataConfig.moduleColor.color[0].item} 0%, ${this.dataConfig.moduleColor.color[1].item} 100%)`,
			};
		},
		/*商品模板*/
		goodStyleConfig() {
			return this.dataConfig.goodStyleConfig.tabVal
		},
		styleConfig() {
			return this.dataConfig.styleConfig.tabVal
		},
		headerStyle() {
			let imgBgUrl = this.$util.BuildImgUrl(this.dataConfig.imgBgConfig.url);
			return {
				backgroundImage: this.styleConfig ? 'url(' + imgBgUrl + ')' : `linear-gradient(90deg,${this.dataConfig.headerBgColor.color[0].item} 0%,${this.dataConfig.headerBgColor.color[1].item} 100%)`,
			}
		},
		contentBox() {
			let br = `${this.dataConfig.fillet.val * 2}rpx`,
				borderRadius = '',
				imgBgUrl = this.dataConfig.imgBgConfig.url;
			if (this.dataConfig.fillet.type) {
				borderRadius = `0 0 ${this.dataConfig.fillet.valList[0].val * 2}rpx ${this.dataConfig.fillet.valList[1].val * 2}rpx`
			} else {
				borderRadius = `0 0 ${br} ${br}`
			}
			return {
				borderRadius,

			}
		},
		/*标题是文本还是图片*/
		titleConfig() {
			return this.dataConfig.titleConfig.tabVal
		},
		/*标题文本*/
		titleTxtConfig() {
			return this.dataConfig.titleTxtConfig.value
		},
		/*标题图片*/
		titleImg() {
			return this.styleConfig ? this.titleUrl : this.titleColorUrl
		},
		titleColorUrl() {
			return this.dataConfig.imgColorConfig.url
		},
		titleUrl() {
			return this.dataConfig.imgConfig.url
		},
		titleStyle() {
			return {
				'font-style': this.dataConfig.titleText.tabVal == 2 ? 'italic' : '',
				'font-size': `${this.dataConfig.titleNumber.val * 2}rpx`,
				'font-weight': this.dataConfig.titleText.tabVal == 0 ? 'bold' : '',
				color: this.dataConfig.titleColor.color[0].item
			}
		},
		/*标题提示文字*/
		tipsColor() {
			return {
				color: this.styleConfig ? this.dataConfig.tipsColor.color[0].item : this.dataConfig.tipsColor2.color[0].item
			}
		},
		/*分割线颜色*/
		dividerColor() {
			return {
				color: this.dataConfig.dividerColor.color[0].item
			}
		},
		/*头部提示语文本*/
		tipTxt() {
			return this.dataConfig.tipTxtConfig.value
		},
		/*头部按钮文本*/
		rightBntTxt() {
			return this.dataConfig.rightBntConfig.value
		},
		/*头部按钮样式*/
		headerBntColor() {
			return {
				color: this.styleConfig ? this.dataConfig.headerBntColor.color[0].item : this.dataConfig.headerBntColor2.color[0].item,
				fontSize: `${this.dataConfig.bntNumber.val * 2}rpx`
			}
		},
		/*商品图片圆角样式*/
		imgStyle() {
			let borderRadius = `${this.dataConfig.filletImg.val * 2}rpx`;
			if (this.dataConfig.filletImg.type) {
				borderRadius =
					`${this.dataConfig.filletImg.valList[0].val * 2}rpx ${this.dataConfig.filletImg.valList[1].val * 2}rpx ${this.dataConfig.filletImg.valList[3].val * 2}rpx ${this.dataConfig.filletImg.valList[2].val * 2}rpx`;
			}
			return borderRadius
		},
		/*商品名称样式*/
		productStyle() {
			return {
				color: this.dataConfig.goodsNameColor.color[0].item,
				fontWeight: this.dataConfig.goodsName.tabVal ? 'normal' : 'bold'
			}
		},
		/* 展示信息 */
		checkboxInfo() {
			return this.dataConfig.checkboxInfo.type
		},
		/* 价格颜色 */
		priceColor() {
			return this.dataConfig.toneConfig.tabVal ? this.dataConfig.presalePriceColor.color[0].item : 'var(--view-theme)'
		},
		/* 原价颜色 */
		otPriceColor() {
			return this.dataConfig.goodsPriceColor.color[0].item
		},
		showBtn() {
			return this.dataConfig.presaleConfig.tabVal
		},
		/* 按钮颜色 */
		btnBgColor() {
			return {
				color: this.dataConfig.goodsBntTxtColor.color[0].item,
				background: this.dataConfig.toneConfig.tabVal ? `linear-gradient(90deg,${this.dataConfig.goodsBntColor.color[0].item} 0%,${this.dataConfig.goodsBntColor.color[1].item} 100%)` : 'linear-gradient(90deg, var(--view-theme) 0%, var(--view-assist) 100%)'
			}
		},
		/*商品数量*/
		numberConfig() {
			return this.dataConfig.numberConfig.val
		}
	},
	mounted() {
		this.getList();
	},
	inject: ['parentDiyId', 'parentMerId'],
	methods: {
		goPage(url) {
			uni.navigateTo({
				url
			})
		},
		getList() {
			getPresellData({
				page: 1,
				limit: this.numberConfig,
				diy_id: this.parentDiyId,
				unique: this.unique || "",
				mer_id: this.parentMerId || "",
			}).then(res => {
				this.productList = res.data.list;
			})
		},
		goDetails(item) {
			uni.navigateTo({
				url: `/pages/activity/presell_details/index?id=${item.product_presell_id}`
			})
		}
	}
}
</script>

<style lang="scss">
.Regular {
	font-family: 'Regular';
}

.bg-cover {
	background-size: cover;
}

.item~.item {
	margin-top: 32rpx;
}

.item_tags {
	.presale-label {
		display: flex;
		font-size: 20rpx;
		text-align: center;
		border-radius: 5rpx;
		padding: 0 4rpx;
		height: 28rpx;
		align-items: center;
		justify-content: center;
		margin-right: 8rpx;
		color: var(--view-theme);
		border: 1px solid var(--view-theme);

		&:nth-child(odd) {
			background-color: var(--view-theme);
			color: #fff;
		}
	}
}

.badge {
	width: 152rpx;
	height: 26rpx;
	background: linear-gradient(90deg, #FF7931 0%, #E93323 100%);
	border-radius: 20rpx;
	display: inline-flex;
	justify-content: center;
	align-items: center;
	margin: 16rpx 0;
}

.btn-left {
	width: 60%;
	border-radius: 8rpx 0 0 8rpx;
	background: rgba(255, 255, 255, 0.9);
}

.btn-right {
	width: 40%;
	border-radius: 0 8rpx 8rpx 0;
}

.shandian {
	width: 48rpx;
	height: 74rpx;
	position: absolute;
	// transform: scale(1.1);
	left: 60%;
	top: 0;
	margin-top: -2rpx;
	margin-left: -22rpx;
}

.sale-item {
	box-shadow: var(--good-shadow);
}

.presale-wrapper {
	overflow: hidden;
}
</style>
