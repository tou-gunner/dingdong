<template>
  <view class="order-info-wrapper">
    <view class="order-info-title">
     送货信息
    </view>
		<view class="info-item flex-box">
			<view class="item-label">配送员</view>
			<view class="item-value">{{orderInfo.deliveryOrder.deliveryService.name}}</view>
		</view>
		<view class="info-item flex-box">
			<view class="item-label">联系电话</view>
			<view class="item-value">
				{{orderInfo.deliveryOrder.deliveryService.phone}}
				<i class="iconfont icon-ic_phone icon-phone" @click="callPhone(orderInfo.take.phone)"></i>
			</view>
			
		</view>
		<view class="info-item flex-box">
			<view class="item-label">送达时间</view>
			<view class="item-value">{{setDeliveryTimeText}}</view>
		</view>
  </view>
</template>

<script>

export default {
	name: 'DeliveryInfo',
  props: {
    orderInfo: {
			type: Object,
			default: {}
		}
  },
	computed: {
		// 配送时间文本设置
		setDeliveryTimeText() {
			const merId = this.orderInfo.mer_id
			const remarks = this.orderInfo.merchant_take_info[merId].remarks
			let deliveryTimeText = ''
			if (remarks) {
				deliveryTimeText = remarks
			} else {
				const date = this.orderInfo.merchant_take_info[merId].date
				const time = this.orderInfo.merchant_take_info[merId].time
				deliveryTimeText = date+' '+time
			}
			return deliveryTimeText
		},
	},
  data() {
    return {
			
    }
  },
	methods: {
		// 拨打电话
		callPhone(phone) {
			uni.makePhoneCall({
				phoneNumber: phone
			})
		},
	}
}
</script>

<style scoped lang="scss">
.order-info-wrapper {
  margin-top: 20rpx;
  background-color: #fff;
  border-radius: 24rpx;
  padding: 32rpx 24rpx;
  font-size: 28rpx;
}

.order-info-title {
  margin-bottom: 26rpx;
  display: flex;
  align-items: center;
	font-weight: 500;

  .iconfont {
    font-size: 28rpx;
    margin-right: 8rpx;
  }
}
.info-item {
	margin-top: 40rpx;
	justify-content: space-between;
	.item-label {
		flex-shrink: 0;
	}
	.item-value {
		margin-left: 20rpx;
	}
	.icon-phone {
		font-size: 32rpx;
		color: #2A7EFB;
		margin-left: 14rpx;
	}
}
.flex-box {
	display: flex;
}
</style>
