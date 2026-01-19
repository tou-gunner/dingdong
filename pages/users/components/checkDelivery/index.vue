<template>
	<view :style="viewColor">
		<!-- 选择送货方式 -->
		<view class="mask-box">
			<view class='mask' catchtouchmove="true" :hidden='isShowBox == false' @tap='closeShowBox'></view>
			<view class="mask-content animated popup-main bg-f" :class="{ slideInUp: isShowBox }">
				<view class="title font-500">
					配送方式
					<view class="close iconfont icon-ic_close popup-close" @click="closeShowBox"></view>
				</view>
				<view class="box">
					<view class="check-item" v-for="(item, index) in radioList" :key="index" :class="{ on: index == radioIndex }">
						<view class="check-item-text">
							{{ item.title }}
							<!-- <view class="err-txt" v-if="item.title == '同城配送' && !newData.order.allow_city_take">
								<text class="iconfont icon-icon_tip"></text>
								<view class="txt">此商品不支持该区域配送</view>
							</view> -->
							<view class="err-txt" v-if="item.title == '同城配送' && deliverySettings && isLessMinPrice">
								<text class="iconfont icon-icon_tip"></text>
								<view class="txt">未达到起送价，起送价：￥{{ deliverySettings.deliverySettings.min_delivery_amount }}</view>
							</view>
						</view>
						<view class="radio" @click="bindCheck(item, index)">
							<block v-if="index == radioIndex">
								<view class="iconfont icon-a-ic_CompleteSelect"></view>
							</block>
							<block v-else>
								<view class="iconfont icon-ic_unselect"></view>
							</block>
						</view>
					</view>
				</view>
				<view class="foot">
					<view class="btn" @click="confirmBtn">确定</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016-2026 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------
import { mapGetters } from "vuex";
export default {
	name: 'checkDelivery',
	props: {
		isShowBox: {
			type: Boolean,
			default: false
		},
		activeObj: {
			type: Object,
			default: function () {
				return {}
			}
		},
		deliveryName: {
			type: String,
			default: '快递配送'
		},
		deliverySettings: {
			type: Object,
			default: function () {
				return {}
			}
		},
		radioList: {
			type: Array,
			default: () => [
				{
					title: '快递配送',
					check: true
				},
				{
					title: '到店自提', // 原名：到店核销
					check: false
				},
				{
					title: '同城配送',
					check: false
				}
			],
		},
	},
	data() {
		return {
			radioIndex: 0,
			newData: {}
		}
	},
	computed: {
		...mapGetters(['viewColor']),
		isLessMinPrice() {
			return Number(this.activeObj.order.total_price) < Number(this.deliverySettings.deliverySettings.min_delivery_amount)
		}
	},
	created() {
		this.newData = JSON.parse(JSON.stringify(this.activeObj))
		this.radioIndex = this.radioList.findIndex(item => item.check);
	},
	methods: {
		// 关闭配送方式弹窗
		closeShowBox() {
			this.$emit('close')
		},
		// 选择配送方式
		bindCheck(item, index) {
			if (item.title == '到店自提') {
				this.radioIndex = index
				this.newData.order.isTake = true
				this.newData.order.isCityTake = false
				this.newData.order.default_delivery = "mer_take"
			} else if (item.title == '同城配送' && this.newData.order.allow_city_take) {
				this.radioIndex = index
				this.newData.order.isTake = false
				this.newData.order.isCityTake = true
				this.newData.order.default_delivery = "mer_city_takes"
			} else if (item.title == '同城配送' && !this.newData.order.allow_city_take) {
				uni.showToast({
					title: '此商品不支持该区域配送',
					icon: 'none'
				});
			} else {
				this.newData.order.default_delivery = "mer_delivery"
				this.radioIndex = index
				this.newData.order.isTake = false
				this.newData.order.isCityTake = false
			}
		},
		confirmBtn() {
			const isCityTake = this.newData.order.default_delivery === "mer_city_takes";
			if (isCityTake && this.deliverySettings && this.isLessMinPrice) {
				this.$util.Tips({
					title: "未达到起送价格"
				});
			} else {
				this.$emit('confirmBtn', this.newData)
			}
		}
	}
}
</script>

<style lang="scss">
.mask-box {
	.mask-content {
		.title {
			padding: 40rpx 0;
			margin-bottom: 40rpx;

			.close {
				position: absolute;
				right: 20rpx;
				top: 20rpx;
			}
		}

		.box {
			padding: 0 30rpx;

			.check-item {
				display: flex;
				align-items: center;
				justify-content: space-between;
				height: 40rpx;
				margin-bottom: 50rpx;
				font-size: 28rpx;

				.check-item-text {
					display: flex;
					align-items: center;

					.err-txt {
						display: flex;
						// align-items: center;
						align-items: baseline;
						color: $theme-color;
						font-size: 22rpx;
						font-weight: 400;
						margin-left: 20rpx;

						.iconfont {
							margin-right: 10rpx;
							font-size: 22rpx;
							color: $theme-color;
						}
					}
				}

				.iconfont {
					font-size: 38rpx;
					color: #CCCCCC;

					&.icon-a-ic_CompleteSelect {
						color: var(--view-theme);
					}
				}
			}
		}

		.foot {
			padding: 50rpx 30rpx 20rpx;
			padding: 50rpx 30rpx calc(20rpx+ constant(safe-area-inset-bottom)); ///兼容 IOS<11.2/
			padding: 50rpx 30rpx calc(20rpx + env(safe-area-inset-bottom)); ///兼容 IOS>11.2/

			.btn {
				width: 100%;
				height: 88rpx;
				line-height: 88rpx;
				text-align: center;
				border-radius: 50rpx;
				color: #fff;
				font-size: 28rpx;
				background: var(--view-theme);
			}
		}
	}
}

.animated {
	animation-duration: .3s
}
</style>
