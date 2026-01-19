<template>
	<view :style="[boxStyle]" v-if="bargList.length" class="bargain-wrapper relative">
		<view :style="[wrapperStyle]">
			<!-- 砍价头部 -->
			<view class="w-full h-96 px-24 flex-between-center bg-cover" :style="[headerStyle]">
				<view class="flex-y-center">
					<text class="fs-32 lh-44rpx fw-500" :style="[titleStyle]" v-if="titleConfig">{{ titleTxtConfig }}</text>
					<image :src="titleImg" class="w-140 h-32" v-else></image>
					<text class="fs-28 text--w111-ccc px-20" :style="[dividerColor]">|</text>
					<text class="fs-26 text--w111-999 lh-36rpx" :style="[tipsColor]">{{ tipTxt }}</text>
				</view>
				<view class="flex-y-center fs-24 text--w111-999" :style="[headerBntColor]"
					@tap="goPage('/pages/activity/assist/index')">
					<text>{{ rightBntTxt }}</text>
					<text class="iconfont icon-ic_rightarrow" :style="[headerBntColor]"></text>
				</view>
			</view>
			<!-- 砍价列表 -->
			<!-- 单列 -->
			<view class="pt-32 pr-20 pb-32 pl-20" :style="[boxContentStyle]" v-if="goodStyleConfig == 0">
				<view class="w-full flex justify-between item good-item" v-for="(item, index) in bargList" :key="index"
					@tap="bargDetail(item)">
					<image :src="item.product.image" mode="aspectFill"
						:style="{ width: '280rpx', height: '280rpx', borderRadius: imgStyle }" />
					<view class="flex-1 flex-col pl-20 h-280 flex-column justify-between">
						<view class="w-full">
							<view class="w-full fs-28 h-80 lh-40rpx line2" :style="[productStyle]" v-if="checkboxInfo.includes(0)">{{
								item.store_name }}</view>
							<view class="flex-y-center mt-26" :style="[joinColor]" v-if="checkboxInfo.includes(1)">
								<text class="iconfont icon-ic_fire fs-20"></text>
								<text class="fs-24 fw-500 pl-4" :style="[braginSuccess]">{{ item.user_count }}人正在参与</text>
							</view>
						</view>
						<view class="flex justify-between items-end">
							<view class="flex-col">
								<view :style="{ color: priceColor }" v-if="checkboxInfo.includes(2)">
									<priceFormat :price="item.assistSku[0].assist_price" intSize="36" floatSize="36" labelSize="24"
										weight />
								</view>
								<text class="text-line fs-28 text--w111-999 pt-10 Regular line-price" v-if="checkboxInfo.includes(3)"
									:style="[otPriceColor]">¥{{ item.product.ot_price }}</text>
							</view>
							<view class="w-144 h-56 rd-30rpx flex-center fs-24 text--w111-fff" v-if="!showBtn" :style="[btnBgColor]">
								参与砍价</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 两列 -->
			<view class="grid-column-2 grid-gap-22rpx pt-32 pr-20 pb-32 pl-20" :style="[boxContentStyle]"
				v-if="goodStyleConfig == 1">
				<view class="good-item" v-for="(item, index) in bargList" :key="index" @tap="bargDetail(item)">
					<image :src="item.product.image" mode="aspectFill"
						:style="{ width: '100%', height: '324rpx', borderRadius: imgStyle }" />
					<view class="w-full line1 mt-16 fs-28 lh-40rpx" :style="[productStyle]" v-if="checkboxInfo.includes(0)">{{
						item.store_name }}</view>
					<view class="flex justify-between items-end mt-10">
						<view class="flex-col">
							<view :style="{ color: priceColor }" v-if="checkboxInfo.includes(2)">
								<priceFormat :price="item.assistSku[0].assist_price" intSize="36" floatSize="36" labelSize="24"
									weight />
							</view>
							<text class="text-line fs-28 text--w111-999 pt-14 Regular line-price" v-if="checkboxInfo.includes(3)"
								:style="[otPriceColor]">¥{{ item.product.ot_price }}</text>
						</view>
						<view class="w-144 h-56 rd-30rpx flex-center fs-24 bg--w111-E93323" v-if="!showBtn" :style="[btnBgColor]">
							参与砍价</view>
					</view>
				</view>
			</view>
			<!-- 三列 -->
			<view class="grid-column-3 grid-gap-18rpx pt-32 pr-20 pb-32 pl-20" :style="[boxContentStyle]"
				v-if="goodStyleConfig == 2">
				<view class="good-item" v-for="(item, index) in bargList" :key="index" @tap="bargDetail(item)">
					<image :src="item.product.image" mode="aspectFill"
						:style="{ width: '100%', height: '212rpx', borderRadius: imgStyle }" />
					<view class="w-full line1 mt-16 fs-26" :style="[productStyle]" v-if="checkboxInfo.includes(0)">{{
						item.store_name
						}}</view>
					<view class="flex items-baseline mt-12">
						<view :style="{ color: priceColor }" v-if="checkboxInfo.includes(2)">
							低至
							<priceFormat :price="item.assistSku[0].assist_price" intSize="36" floatSize="36" labelSize="24" weight />
						</view>
					</view>
					<view class="text-line fs-24 text--w111-999 Regular lh-32rpx" :style="[otPriceColor]"
						v-if="checkboxInfo.includes(3)">¥{{ item.product.ot_price }}</view>
				</view>
			</view>
			<!-- 滑动 -->
			<scroll-view scroll-x="true" show-scrollbar="false" class="white-nowrap vertical-middle w-full p-32 border-box"
				:style="[boxContentStyle]" v-if="goodStyleConfig == 3">
				<view style="white-space: nowrap;">
					<view class="inline-block good-item" :class="{ 'ml-20': index }" v-for="(item, index) in bargList"
						:key="index" @tap="bargDetail(item)">
						<image :src="item.product.image" mode="aspectFill"
							:style="{ width: '224rpx', height: '224rpx', borderRadius: imgStyle }" />
						<view class="w-222 line1 mt-16 fs-26 mb-10" :style="[productStyle]" v-if="checkboxInfo.includes(0)">{{
							item.store_name }}</view>
						<text class="badge fs-20 mb-14" v-if="checkboxInfo.includes(1)" :style="[braginSuccess]">{{ item.user_count
							}}人正在参与</text>
						<view>
							<view :style="{ color: priceColor }" v-if="checkboxInfo.includes(2)">
								<priceFormat :price="item.assistSku[0].assist_price" intSize="36" floatSize="36" labelSize="24"
									weight />
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
import { initiateAssistApi } from '@/api/activity.js';
import { getAssistData } from '@/api/api.js';
import { toLogin } from '@/libs/login.js';
import { mapGetters } from 'vuex';
import { diyUtil } from '@/utils/diy';
export default {
	name: 'bargain',
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
			bargList: []
		};
	},
	computed: {
		...mapGetters(['isLogin', 'uid']),
		wrapperStyle() {
			return {
				borderRadius: diyUtil.buildBorderRadius(this.dataConfig.fillet),
				overflow: 'hidden',
			};
		},
		boxStyle() {
			return {
				zIndex: diyUtil.calcZIndex(this.index),
				boxShadow: diyUtil.buildShadowStyle(this.dataConfig.shadowConfig),
				padding: `${this.dataConfig.topConfig.val * 2}rpx ${this.dataConfig.prConfig.val * 2}rpx ${this.dataConfig.bottomConfig.val * 2}rpx`,
				marginTop: diyUtil.buildMarginTopOffset(this.dataConfig.mbConfig, this.dataConfig.offsetYConfig),
				background: this.dataConfig.bottomBgColor.color[0].item
			};
		},
		boxContentStyle() {
			return {
				"--good-shadow": diyUtil.buildShadowStyle(this.dataConfig.goodShadowConfig),
				background: `linear-gradient(90deg, ${this.dataConfig.moduleColor.color[0].item} 0%, ${this.dataConfig.moduleColor.color[1].item} 100%)`
			};
		},
		/*商品模板*/
		goodStyleConfig() {
			return this.dataConfig.goodStyleConfig.tabVal;
		},
		styleConfig() {
			return this.dataConfig.styleConfig.tabVal;
		},
		headerStyle() {
			let imgBgUrl = this.$util.BuildImgUrl(this.dataConfig.imgBgConfig.url);
			return {
				backgroundImage: this.styleConfig
					? 'url(' + imgBgUrl + ')'
					: `linear-gradient(90deg,${this.dataConfig.headerBgColor.color[0].item} 0%,${this.dataConfig.headerBgColor.color[1].item} 100%)`
			};
		},
		titleStyle() {
			let titleText = this.dataConfig.titleText;
			return {
				fontStyle: !titleText.tabVal ? 'normal' : titleText.tabList[titleText.tabVal].style,
				fontWeight: !titleText.tabVal ? 'bold' : 'normal',
				color: this.dataConfig.titleColor.color[0].item,
				fontSize: this.dataConfig.titleNumber.val * 2 + 'rpx'
			};
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
			return this.styleConfig ? this.titleUrl : this.titleColorUrl;
		},
		titleColorUrl() {
			return this.dataConfig.imgColorConfig.url;
		},
		titleUrl() {
			return this.dataConfig.imgConfig.url;
		},
		/*标题提示文字*/
		tipsColor() {
			return {
				color: this.styleConfig ? this.dataConfig.tipsColor.color[0].item : this.dataConfig.tipsColor2.color[0].item
			};
		},
		/*分割线颜色*/
		dividerColor() {
			return {
				color: this.dataConfig.dividerColor.color[0].item
			};
		},
		/*头部提示语文本*/
		tipTxt() {
			return this.dataConfig.tipTxtConfig.value;
		},
		/*头部按钮文本*/
		rightBntTxt() {
			return this.dataConfig.rightBntConfig.value;
		},
		/*头部按钮样式*/
		headerBntColor() {
			return {
				color: this.styleConfig ? this.dataConfig.headerBntColor.color[0].item : this.dataConfig.headerBntColor2.color[0].item,
				fontSize: `${this.dataConfig.bntNumber.val * 2}rpx`
			};
		},
		/*商品图片圆角样式*/
		imgStyle() {
			let borderRadius = `${this.dataConfig.filletImg.val * 2}rpx`;
			if (this.dataConfig.filletImg.type) {
				borderRadius = `${this.dataConfig.filletImg.valList[0].val * 2}rpx ${this.dataConfig.filletImg.valList[1].val * 2}rpx ${this.dataConfig.filletImg.valList[3].val * 2}rpx ${this.dataConfig.filletImg.valList[2].val * 2
					}rpx`;
			}
			return borderRadius;
		},
		/*商品名称样式*/
		productStyle() {
			return {
				color: this.dataConfig.goodsNameColor.color[0].item,
				fontWeight: this.dataConfig.goodsName.tabVal ? 'normal' : 'bold'
			};
		},
		/* 展示信息 */
		checkboxInfo() {
			return this.dataConfig.checkboxInfo.type;
		},
		/* 参与人数颜色 */
		joinColor() {
			return {
				color: this.dataConfig.toneConfig.tabVal ? this.dataConfig.joinNumColor.color[0].item : 'var(--view-theme)'
			};
		},
		/* 价格颜色 */
		priceColor() {
			return this.dataConfig.toneConfig.tabVal ? this.dataConfig.bargainPriceColor.color[0].item : 'var(--view-theme)';
		},
		/* 划线价颜色 */
		otPriceColor() {
			return {
				color: this.dataConfig.goodsPriceColor.color[0].item
			};
		},
		showBtn() {
			return this.dataConfig.bargainConfig.tabVal;
		},
		/* 按钮颜色 */
		btnBgColor() {
			return {
				background: this.dataConfig.toneConfig.tabVal
					? `linear-gradient(90deg,${this.dataConfig.goodsBntColor.color[1].item} 0%,${this.dataConfig.goodsBntColor.color[0].item} 100%)`
					: 'linear-gradient(90deg, var(--view-theme) 0%, var(--view-assist) 100%)',
				color: this.dataConfig.goodsBntTxtColor.color[0].item
			};
		},
		/*砍价成功*/
		braginSuccess() {
			let styleObject = {};
			if (this.dataConfig.toneConfig.tabVal) {
				styleObject['color'] = this.dataConfig.joinNumColor.color[0].item;
			} else {
				if (this.goodStyleConfig == 3) {
					styleObject['color'] = '#fff';
				} else {
					styleObject['color'] = 'var(--view-theme)';
				}
			}
			return styleObject;
		},
		/*商品数量*/
		numberConfig() {
			return this.dataConfig.numberConfig.val;
		}
	},
	mounted() {
		this.getBargainList();
	},
	inject: ['parentDiyId', 'parentMerId'],
	methods: {
		goPage(url) {
			uni.navigateTo({
				url
			});
		},
		// 砍价列表
		getBargainList() {
			getAssistData({
				page: 1,
				limit: this.numberConfig,
				diy_id: this.parentDiyId,
				unique: this.unique || "",
				mer_id: this.parentMerId || "",
			}).then((res) => {
				this.bargList = res.data.list;
			});
		},
		bargDetail(item) {
			if (this.isLogin) {
				initiateAssistApi(item.product_assist_id)
					.then(res => {
						let id = res.data.product_assist_set_id;
						uni.hideLoading();
						uni.navigateTo({
							url: '/pages/activity/assist_detail/index?id=' + id
						});
					})
					.catch(err => {
						uni.showToast({
							title: err,
							icon: 'none'
						});
					});
			} else {
				toLogin()
			}
		}
	}
};
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

.badge {
	padding: 0 10rpx;
	height: 26rpx;
	background: linear-gradient(270deg, var(--view-theme) 0%, var(--view-assist) 100%);
	border-radius: 20rpx;
	display: inline-flex;
	justify-content: center;
	align-items: center;
	vertical-align: middle;
}

.line-price {
	padding-left: 3px;
}

.border-box {
	box-sizing: border-box;
}

.good-item {
	box-shadow: var(--good-shadow);
}

.bargain-wrapper {
	overflow: hidden;
}
</style>