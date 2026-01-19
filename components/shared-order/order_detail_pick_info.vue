<template>
  <view class="order-pick-info-wrapper">
    <view class="order-pick-info-title">
     ຂໍ້ມູນຈຸດຮັບສິນຄ້າ
    </view>
		<view class="pick-info-item flex-box">
			<view class="item-label">ຊື່ຈຸດຮັບສິນຄ້າ</view>
			<view class="item-value">{{orderInfo.take.station_name}}</view>
		</view>
		<view class="pick-info-item flex-box">
			<view class="item-label">ເບີໂທລະສັບ</view>
			<view class="item-value">
				{{orderInfo.take.phone}}
				<i class="iconfont icon-ic_phone icon-phone" @click="callPhone(orderInfo.take.phone)"></i>
			</view>
			
		</view>
		<view class="pick-info-item flex-box">
			<view class="item-label">ທີ່ຢູ່ຮັບສິນຄ້າ</view>
			<view class="item-value">{{orderInfo.take.station_address}}</view>
		</view>
  </view>
</template>

<script>

export default {
	name: 'PickUpPointInfo',
  props: {
    orderInfo: {
			type: Object,
			default: {}
		}
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
.order-pick-info-wrapper {
  margin-top: 20rpx;
  background-color: #fff;
  border-radius: 24rpx;
  padding: 32rpx 24rpx;
  font-size: 28rpx;
}

.order-pick-info-title {
  margin-bottom: 26rpx;
  display: flex;
  align-items: center;
	font-weight: 500;

  .iconfont {
    font-size: 28rpx;
    margin-right: 8rpx;
  }
}
.pick-info-item {
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
