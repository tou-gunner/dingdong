<template>
	<!-- 产品参数 -->
	<view>
		<view class="specs popup-main bg-f" :class="specsInfo.show === true ? 'on' : ''">
			<view class="title font-500">ຕົວກໍານົດສິນຄ້າ<text class="iconfont icon-ic_close popup-close" @click="closeSpecs"></text></view>
			<view class="list">
				<view class="item acea-row" v-for="(item,index) in specsInfo.params" :key="index">
					<view class="name">{{item.label}}</view>
					<view class="acea-row" style="flex: 1">
						<view v-for="(itm,idx) in item.value" :key="idx" class="val">
							{{itm}}
							<text v-if="idx < item.value.length-1" class="valCont">、</text>
						</view>
					</view>

				</view>
			</view>
			<view class="bnt" @click="closeSpecs">ສຳເລັດ</view>
			<slot name="bottom"></slot>
		</view>
		<view class="mask" @touchmove.prevent :hidden="specsInfo.show === false" @click="closeSpecs"></view>
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
	export default {
		props: {
			specsInfo: {
				type: Object,
				default: () => {}
			},
		},
		data() {
			return {};
		},
		mounted() {},
		methods: {
			closeSpecs(){
				this.$emit('myevent');
			}
		}
	}
</script>

<style scoped lang="scss">
	.specs{
		padding: 36rpx 0 22rpx;
		padding: 36rpx 0 calc(22rpx + constant(safe-area-inset-bottom)); ///兼容 IOS<11.2/
		padding: 36rpx 0 calc(22rpx + env(safe-area-inset-bottom)); ///兼容 IOS>11.2/
		.title{
			.iconfont{
				position: absolute;
				right: 20rpx;
				top: -20rpx;
			}
		}
		.list{
			height: 750rpx;
			margin: 60rpx 30rpx 0;
			color: #999999;
			overflow-x: hidden;
			overflow-y: auto;
			.item{
				padding: 30rpx 0;
				border-bottom: 1rpx solid #f5f5f5;
				.name{
					width: 160rpx;
					margin-right: 10rpx;
					word-break: break-all;
				}
				.val{
					word-break: break-all;
					color: #282828;
					max-width: 540rpx;
					.valCont {
						margin-left: 6rpx;
					}
				}
			}
		}
		.bnt{
			width: 690rpx;
			height: 88rpx;
			text-align: center;
			line-height: 88rpx;
			border-radius: 50rpx;
			background-color: var(--view-theme);
			font-size: 28rpx;
			color: #fff;
			margin: 0 auto;
		}
	}
</style>
