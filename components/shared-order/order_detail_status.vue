<template>
  <view>
    <view class="order-detail-status">
      <view class="order-status-label">
				<text v-if="orderInfo.order_type == 2">{{ getCityDeliveryOrderStatus(orderInfo) }}</text>
				<text v-else>{{ getBookingOrderStatus(orderInfo) }}</text>
			</view>
      <view v-if="orderInfo.order_type == 2" class="order-reserve-date">
				{{setDeliveryTimeText}}
      </view>
			<view v-else class="order-reserve-date">
        {{ orderInfo.orderProduct[0].reservation_date }}
        {{ orderInfo.orderProduct[0].reservation_time_part }}
        {{ orderInfo.is_instore_order ? "到店服务" : "上门服务" }}
      </view>
    </view>

    <view class="order-remark-wrapper" v-if="orderInfo.order_type != 0">
      <view class="iconfont icon-ic_notes" />
      <view class="order-remark" @click="$emit('remark')" :class="{ empty: !!orderInfo.remark }">
        {{ orderInfo.remark || "订单未备注，点击添加备注信息" }}
      </view>
    </view>

    <view style="margin-top: 20rpx" v-if="!orderInfo.is_instore_order">
      <OrderAddress :orderInfo="orderInfo" />
    </view>
  </view>
</template>

<script>
import OrderAddress from "@/components/shared-order/order_address.vue";
import { 
	getCityDeliveryOrderStatus,
	getBookingOrderStatus
} from "@/utils/order";

export default {
  name: "OrderDetailStatus",
  components: {
    OrderAddress
  },
  props: {
    orderInfo: Object
  },
	computed: {
		// 配送时间文本设置
		setDeliveryTimeText() {
			const merId = this.orderInfo.mer_id
			const remarks = this.orderInfo.merchant_take_info[merId].remarks
			let deliveryTimeText = ''
			if (remarks) {
				deliveryTimeText = '预期时间: '+remarks
			} else {
				const date = this.orderInfo.merchant_take_info[merId].date
				const time = this.orderInfo.merchant_take_info[merId].time
				deliveryTimeText = '预期时间: '+date+' '+time+' 送达'
			}
			return deliveryTimeText
		},
	},
  methods: {
		getCityDeliveryOrderStatus,
    getBookingOrderStatus
  }
}
</script>

<style scoped lang="scss">
.order-detail-status {
  padding: 39rpx 0 34rpx;
  color: #fff;

  .order-status-label {
    // font-weight: 500;
    // margin-bottom: 18rpx;
		font-size: 30rpx;
		font-weight: 500;
		margin-bottom: 18rpx;
		margin-left: 10rpx;
  }

  .order-reserve-date {
    // font-size: 24rpx;
		font-size: 28rpx;
		margin-left: 10rpx;
  }
}

.order-remark-wrapper {
  display: flex;
  align-items: center;
  background-color: #fff;
  border-radius: 24rpx;
  padding: 24rpx 30rpx;

  .iconfont {
    width: 36rpx;
    height: 36rpx;
    color: #282828;
    margin-right: 16rpx;
  }

  .order-remark {
    flex: 1;
    color: #ccc;
    font-size: 28rpx;

    &.empty {
      color: #282828;
    }
  }
}
</style>
