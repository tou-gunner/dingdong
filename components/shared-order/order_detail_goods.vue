<template>
  <view class="order-goods-wrapper">
		<!-- <view v-if="orderInfo.order_type == 2" class="order-goods-title">
		  共{{tableData[0].value}}件商品
		</view -->
    <view class="order-goods-title">
      <view class="iconfont icon-mendianyeji1" ></view>
      {{ orderInfo.merchant.mer_name }}
    </view>
    <OrderGoodSku v-for="product of orderInfo.orderProduct" :key="product.order_product_id" :product="product" />
    <OrderDetailTable v-if="orderInfo.order_type != 2" :list="tableData" mini-gap :has-style="false" />
  </view>
</template>

<script>
import OrderGoodSku from "@/components/shared-order/order_good_sku.vue";
import OrderDetailTable from "@/components/shared-order/order_detail_table.vue";

export default {
  components: {
    OrderGoodSku,
    OrderDetailTable
  },
  props: {
    orderInfo: Object
  },
  data() {
    return {
      tableData: [
        {
          label: "预约数量",
          value: this.orderInfo.total_num,
        },
        {
          label: "联系人",
          value: this.orderInfo.real_name,
        },
        {
          label: "联系电话",
          value: this.orderInfo.user_phone,
          isPhone: true,
        },
        {
          label: "留言",
          value: this.orderInfo.mark,
          overflow: true,
        }
      ]
    };
  }
}
</script>

<style scoped lang="scss">
.order-goods-wrapper {
  margin-top: 20rpx;
  background-color: #fff;
  border-radius: 24rpx;
  padding: 32rpx 24rpx;
  font-size: 28rpx;
}

.order-goods-title {
  margin-bottom: 32rpx;
  display: flex;
  align-items: center;

  .iconfont {
    font-size: 28rpx;
    margin-right: 8rpx;
  }
}
</style>
