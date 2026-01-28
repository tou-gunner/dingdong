<template>
  <view>
    <view class="order-detail-info">
      <view class="info-item">
        <view class="info-key">ເລກທີ່ຄຳສັ່ງຊື້：</view>
        <view class="info-value">
          {{ orderInfo.order_sn }}
          <button class="copy-btn" @click="handleSetClipboard">ຄັດລອກ</button>
        </view>
      </view>
      <view class="info-item">
        <view class="info-key">ເວລາສັ່ງຊື້：</view>
        <view class="info-value">{{ orderInfo.create_time }}</view>
      </view>
      <view class="info-item">
        <view class="info-key">ເວລາຊຳລະເງິນ：</view>
        <view class="info-value">{{ orderInfo.pay_time || "-" }}</view>
      </view>
      <view class="info-item">
        <view class="info-key">ວິທີຊຳລະເງິນ：</view>
        <view class="info-value">{{ getPayType(orderInfo) }}</view>
      </view>
    </view>

    <view class="order-detail-price">
      <view class="info-item">
        <view class="info-key">ລາຄາສິນຄ້າລວມ:</view>
        <view class="info-value">₭{{ orderInfo.total_price }}</view>
      </view>
      <view v-if='orderInfo.svip_discount > 0' class="info-item">
        <view class="info-key">ສ່ວນຫຼຸດສະມາຊິກ：</view>
				{{orderInfo.svip_discount > 0}}
        <view class="info-value">-₭{{ orderInfo.svip_discount }}</view>
      </view>
      <view v-if='orderInfo.coupon_price > 0' class="info-item">
        <view class="info-key">ສ່ວນຫຼຸດຄູປ໋ອງ：</view>
        <view class="info-value">-₭{{ orderInfo.coupon_price }}</view>
      </view>
    	<view v-if='orderInfo.integral_price > 0' class="info-item">
    	  <view class="info-key">ຫັກຄະແນນ：</view>
    	  <view class="info-value">-₭{{ orderInfo.integral_price }}</view>
    	</view>
    	<view v-if='orderInfo.pay_postage > 0' class="info-item">
    	  <view class="info-key">ຄ່າຂົນສົ່ງ：</view>
    	  <view class="info-value">+₭{{ orderInfo.pay_postage }}</view>
    	</view>
      <view class="price-total__wrapper">
        ຈ່າຍຕົວຈິງ：
        <text class="price-total__value">
          <text class="price-total__integer">{{ getPriceInteger(orderInfo.pay_price) }}</text>
          <text class="price-total__float">.{{ getPriceFloat(orderInfo.pay_price) }}</text>
        </text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'OrderDetailInfo',
  props: {
    orderInfo: {
      type: Object,
    }
  },
  methods: {
    getPriceInteger(price) {
      return price.toString().split('.')[0]
    },
    getPriceFloat(price) {
      return price.toString().split('.')[1]
    },
    getPayType(orderInfo) {
      if (!orderInfo.paid) return "ລໍຖ້າຊຳລະ";
      if (orderInfo.pay_type === 0) {
        return 'ຊຳລະດ້ວຍຍອດເງິນ'
      }
      if (orderInfo.pay_type === 7) {
        return 'ຊຳລະແບບອອບລາຍ'
      }
      if (orderInfo.pay_type === 4 || orderInfo.pay_type === 5) {
        return 'Alipay'
      }
      if (orderInfo.pay_type === 1 || orderInfo.pay_type === 2 || orderInfo.pay_type === 3) {
        return 'WeChat Pay'
      }
      
    },
    handleSetClipboard() {
      uni.setClipboardData({
        data: this.orderInfo.order_sn,
        success: () => {
          uni.showToast({ title: 'ຄັດລອກສຳເລັດ' });
        }
      });
    }
  }
}
</script>

<style scoped lang="scss">
.order-detail-info {
  margin-top: 20rpx;
  background-color: #fff;
  border-radius: 24rpx;
  padding: 32rpx 24rpx;
  font-size: 28rpx;

  .info-item {
    display: flex;
    align-items: center;

    &+.info-item {
      margin-top: 24rpx;
    }
  }

  .info-value {
    margin-left: auto;
    color: #999;
    display: flex;
    align-items: center;
  }

  .copy-btn {
    margin-left: 12rpx;
    color: #666;
    width: 80rpx;
    height: 36rpx;
    border-radius: 26rpx;
    border: 1px solid #DDDDDD;
    font-size: 20rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 80rpx;
  }
}

.order-detail-price {
  margin-top: 20rpx;
  background-color: #fff;
  border-radius: 24rpx;
  padding: 32rpx 24rpx;
  font-size: 28rpx;


  .info-item {
    display: flex;
    align-items: center;

    &+.info-item {
      margin-top: 24rpx;
    }
  }

  .info-value {
    margin-left: auto;
    color: #999;
    display: flex;
    align-items: center;
  }

  .copy-btn {
    margin-left: 12rpx;
    color: #666;
    width: 80rpx;
    height: 36rpx;
    border-radius: 26rpx;
    border: 1px solid #DDDDDD;
    font-size: 20rpx;
  }

  .price-total__wrapper {
    margin-top: 24rpx;
    border-top: 1px solid #f0f0f0;
    padding-top: 24rpx;
    text-align: right;
  }

  .price-total__value {
    font-family: "dinProSemiBold";
    font-size: 34rpx;
    color: #FF9600;
    ;

    &::before {
      font-size: 20rpx;
      content: "￥";
      font-family: "dinProSemiBold";
    }

    .price-total__float {
      font-size: 20rpx;
    }
  }
}
</style>