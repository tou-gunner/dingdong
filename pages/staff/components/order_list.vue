<template>
  <view class="order-list" @click="handleOrderListClick">
    <view class="order-item" v-for="(item, index) of orderList" :key="item.order_id">
      <view class="order-item-header">
        <view class="order-item-type">
          {{ item.order_type === 0 ? "上门" : "到店" }}
        </view>
        <view class="order-item-sn overflow-text">{{ item.order_sn }}</view>
        <view class="order-item-status">{{ getBookingOrderStatus(item) }}</view>
      </view>

      <view class="order-item-contact-info" v-if="item.order_type === 0">
        <view class="contact-info-left">
          <view class="contact-info-name overflow-text">
            {{ item.real_name }}
            <text class="contact-info-phone">{{ item.user_phone }}</text>
          </view>
          <view class="contact-info-address overflow-text">
            {{ item.user_address }}
          </view>
        </view>
        <button class="contact-action-btn iconfont icon-ic_Phone" :data-event="EVENT.CALL" :data-index="index"></button>
        <button class="contact-action-btn iconfont icon-icon_Location" :data-event="EVENT.LOCATION"
          :data-index="index"></button>
      </view>

      <navigator hover-class="none" :url="`/pages/staff/order_detail?id=${item.order_id}&mer_id=${item.mer_id}`"
        v-for="(product, _index) of item.orderProduct" :key="_index">
        <OrderGoodSku :product="product" />
        <view class="order-item-reverse-time overflow-text">
          预约日期：
          {{ product.reservation_date }}
          {{ product.reservation_time_part }}
        </view>
      </navigator>

      <view class="order-item-btn-group">
        <button v-if="orderType === 1" class="order-item-btn" :data-event="EVENT.RUSH_ORDER"
          :data-index="index">领取工单</button>
        <template v-else>
          <template v-if="!item.is_instore_order">
            <!-- 服务中才可以添加服务记录 -->
            <navigator v-if="BtnUtil.getServiceRecordStatus(item, item.merchant.checkin)" class="order-item-btn"
              :url="`/pages/staff/service_record?order_id=${item.order_id}&mer_id=${item.mer_id}`">服务记录</navigator>

            <!-- 已经指派，待上门打卡服务  -->
            <navigator v-if="BtnUtil.getCheckinStatus(item, item.merchant.checkin)" class="order-item-btn"
              :url="`/pages/staff/checkin?order_id=${item.order_id}&mer_id=${item.mer_id}`">上门打卡</navigator>
          </template>
          <button v-if="BtnUtil.getReedemStatus(item, item.merchant.checkin)" class="order-item-btn"
            :data-event="EVENT.VERIFY" :data-index="index">核销</button>
        </template>
      </view>
    </view>
  </view>
</template>

<script>
import OrderGoodSku from "@/components/shared-order/order_good_sku.vue";
import { getBookingOrderStatus, handleMakeCallPhone, handleOpenLocation } from "@/utils/order";
import { rushStaffOrder, verifyStaffOrder } from "@/api/staff";
import { BtnUtil } from "@/utils/order";

const EVENT = {
  CALL: "call",
  LOCATION: "location",
  RUSH_ORDER: "rush_order",
  VERIFY: "verify"
}

export default {
  components: {
    OrderGoodSku
  },
  props: {
    orderList: {
      type: Array,
      default: []
    },
    orderType: Number
  },
  data() {
    return {
      BtnUtil,
      EVENT
    };
  },
  methods: {
    getBookingOrderStatus,
    async handleOrderListClick(e) {
      const { event, index } = e.target.dataset;
      if (event === undefined || index === undefined) return;
      const item = this.orderList[index];
      // if (item === undefined) return;

      if (event === EVENT.CALL) {
        handleMakeCallPhone(item.user_phone);
      } else if (event === EVENT.LOCATION) {
        handleOpenLocation(item.user_address);
      } else if (event === EVENT.RUSH_ORDER) {
        const result = await uni.showModal({
          title: "您确定要领取此工单任务吗?",
        });
        if (result[0] || result[1].cancel) return;
        try {
          const res = await rushStaffOrder(item.order_id);
          this.$util.Tips({
            title: res.message,
            icon: "success"
          });
          uni.navigateTo({
            url: `/pages/staff/order_detail?id=${item.order_id}&mer_id=${item.mer_id}`
          });
        } catch (err) {
          this.$util.Tips({
            title: err,
            icon: "none"
          });
          console.log(err);
        }
      } else if (event === EVENT.VERIFY) {
        const [err, { confirm }] = await uni.showModal({
          title: "提示",
          content: `确定要核销此订单吗？`,
        });
        if (err || !confirm) return;
        uni.showLoading({
          mask: true
        });
        try {
          const res = await verifyStaffOrder(item.order_id, {
            mer_id: item.mer_id
          });
          uni.hideLoading();
          this.$util.Tips({
            title: res.message,
            icon: "none"
          });
          item.status = 2;
        } catch (err) {
          uni.hideLoading();
          this.$util.Tips({
            title: err,
            icon: "none"
          });
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
.order-list {
  padding: 0 20rpx 20rpx;
  color: #333;
}

.order-item {
  background-color: #fff;
  border-radius: 24rpx;
  padding: 24rpx;

  &+.order-item {
    margin-top: 20rpx;
  }
}

.order-item-header {
  display: flex;
  align-items: baseline;
  margin-bottom: 26rpx;

  .order-item-type {
    height: 32rpx;
    display: flex;
    align-items: center;
    padding-inline: 6rpx;
    font-size: 20rpx;
    color: #2A7EFB;
    border: 1px solid currentColor;
    border-radius: 6rpx;
  }

  .order-item-sn {
    font-size: 28rpx;
    margin-left: 16rpx;
    flex: 1;
  }

  .order-item-status {
    margin-left: auto;
    font-size: 26rpx;
    color: #2A7EFB;
  }
}

.order-item-reverse-time {
  margin-top: 26rpx;
  font-size: 24rpx;
}

.order-item-btn-group {
  display: flex;
  justify-content: flex-end;
  margin-top: 32rpx;

  .order-item-btn {
    height: 64rpx;
    padding-inline: 32rpx;
    border-radius: 50rpx;
    background-color: #2291F8;
    font-size: 24rpx;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;

    &+.order-item-btn {
      margin-left: 20rpx;
    }
  }
}

.order-item-contact-info {
  background-color: #f9f9f9;
  border-radius: 16rpx;
  padding: 32rpx;
  display: flex;
  margin-bottom: 26rpx;
  align-items: center;

  .contact-info-left {
    margin-right: 28rpx;
    flex: 1;
    overflow: hidden;
    font-size: 28rpx;
    color: #282828;

    .contact-info-phone {
      margin-left: 30rpx;
    }

    .contact-info-address {
      font-size: 24rpx;
      color: #999;
      margin-top: 6rpx;
    }
  }

  .contact-action-btn {
    width: 56rpx;
    height: 56rpx;
    background-color: #edf2f9;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28rpx;
    color: #2a7efb;

    &+.contact-action-btn {
      margin-left: 32rpx;
    }
  }
}
</style>
