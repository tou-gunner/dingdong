<template>
	<view :style="viewColor">
		<!--到店-->
		<view v-if="orderInfo.order_type == 1" class="store-info bg-f boder-24">
			<view class="acea-row row-between row-middle">
				<view class="info-t">
					<view class="acea-row row-middle">
						<text class="iconfont icon-zhuanshudaogou"></text>
						<view class="info"><text class="name line1">{{orderInfo.real_name}}</text><text class="phone">{{orderInfo.user_phone}}</text></view>
					</view>
					<view class="acea-row row-middle" style="margin-top: 28rpx;">
						<text class="iconfont icon-ic_mall"></text>
						<view class="info price-info-100">{{orderInfo.merchant.mer_name}}</view>
					</view>
				</view>
				<image class="picture" :src="orderInfo.merchant.mer_avatar"></image>
			</view>
			<view class="store-address" style="border-bottom: 1rpx solid #eee;">
				<view class="address acea-row row-between">
					<view class="info">地址：{{orderInfo.merchant.mer_address}}</view>
					<!-- #ifndef H5 -->
					<text class='copy' @tap='copy(orderInfo.merchant.mer_address)'>复制</text>
					<!-- #endif -->
					<!-- #ifdef H5 -->
					<text class='copy copy-data' :data-clipboard-text="orderInfo.merchant.mer_take_address">复制</text>
					<!-- #endif -->
				</view>
				<view class="info info-100">营业时间：{{orderInfo.merchant.mer_take_time[0]}}-{{orderInfo.merchant.mer_take_time[1]}}</view>
			</view>
			<view class="store-count acea-row row-between">
				<view class="acea-row row-middle row-center" @click="makePhone(orderInfo.merchant.mer_take_phone)"><text class="iconfont icon-ic_phone"></text>联系商家</view>
				<view class="acea-row row-middle row-center" @tap="showMaoLocation"><text class="iconfont icon-ic_location"></text>导航至商家</view>
			</view>
		</view>
		<!--上门-->
		<view v-else class="store-info bg-f boder-24">
			<view class="acea-row row-between">
				<view class="info-t">
					<view class="acea-row row-middle">
						<text class="iconfont icon-ic_location4"></text>
						<view class="info">{{orderInfo.real_name}}<text class="phone">{{orderInfo.user_phone}}</text></view>
					</view>
				</view>
			</view>
			<view class="store-address">
				<view class="address">
					<view class="info info-100">{{orderInfo.user_address}}</view>
				</view>
			</view>
			<view v-if="orderInfo.staffs" class="service acea-row row-between row-middle">
				<view>
					<view class="service-item">服务人员：{{orderInfo.staffs.name}}</view>
					<view class="service-item">联系电话：{{orderInfo.staffs.phone}}</view>
				</view>
				<view class="call acea-row row-center row-middle" @click="makePhone(orderInfo.staffs.phone)">拨打电话</view>
			</view>
			<view class='line'>
				<image :src="`${domain}/static/images/line.jpg`"></image>
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
	let app = getApp();
	export default {
		name: 'reservationInfo',
		props: {
			domain: {
				type: String,
				default: ""
			},
			orderInfo: {
				type: Object,
				default: () => {
					{}
				}
			}
		},
		computed: mapGetters(['viewColor']),
		data() {
			return {

			};
		},
		created() {

		},
		methods: {
			copy(data) {
				this.$emit('copy',data);
			},
			makePhone(phone) {
				this.$emit('makePhone',phone);
			},
			showMaoLocation() {
				this.$emit('showMaoLocation');
			}
		}
	}
</script>

<style lang="scss">
	.store-info {
		padding: 24rpx 24rpx 0;
		margin: 20rpx 0;
		position: relative;
		.line {
			position: absolute;
			left: 2%;
			bottom: 0;
			width: 96%;
			height: 4rpx;
			image {
				width: 100%;
				height: 100%;
				display: block;
			}
		}
		.info-t {
			max-width: 500rpx;
			.iconfont {
				width: 48rpx;
				height: 48rpx;
				background: var(--view-bgColor);
				border-radius: 100%;
				color: var(--view-theme);
				text-align: center;
				line-height: 48rpx;
				margin-right: 16rpx;
				font-size: 28rpx;
				&.icon-ic_location4 {
					color: #000000;
					width: auto;
					height: auto;
					font-size: 30rpx;
					margin-right: 10rpx;
					background: transparent;
				}
			}
			.info {
				font-weight: 500;
				.name {
					max-width: 200rpx;
				}
				.phone{
					margin-left: 18rpx;
				}
			}
		}
		.picture {
			width: 128rpx;
			height: 128rpx;
			border-radius: 16rpx;
		}
		.store-address {
			padding: 32rpx 0 24rpx;

			.address {
				margin-bottom: 14rpx;
			}
			.info {
				width: 560rpx;
				color: #999;
				font-size: 24rpx;
				&.info-100 {
					width: 100%;
				}
			}
			.copy {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 68rpx;
				height: 36rpx;
				background: #F5F5F5;
				border-radius: 26rpx;
				font-size: 10px;
			}
		}
		.store-count {
			margin-top: 24rpx;
			justify-content: center;
			padding-bottom: 24rpx;
			view {
				flex: 0 0 50%;
				text-align: center;
				font-size: 24rpx;
				.iconfont {
					margin-right: 6rpx;
					font-size: 32rpx;
				}
			}
		}
		.service {
			margin-bottom: 20rpx;
			padding: 30rpx 0;
			border-top: 2rpx solid #eee;
			.service-item {
				color: #666;
				font-size: 24rpx;
				margin-bottom: 14rpx;
			}
			.call {
				width: 144rpx;
				height: 56rpx;
				border-radius: 80rpx;
				border: 1rpx solid #CCCCCC;
				font-size: 24rpx;
			}
		}
	}

</style>
