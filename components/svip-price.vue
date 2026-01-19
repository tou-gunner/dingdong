<template>
  <view class="svip-price">
    <view class="svip-price-text">SVIP</view>
    <view class="svip-price-num">￥{{ price }}</view>
  </view>
</template>

<script>
export default {
  name: "svip-price",
  props: {
    price: {
      type: String,
      default: ""
    }
  }
}
</script>

<style scoped lang="scss">
.svip-price {
  --primary-color: #fff0d1;
  --secondary-color: #231f1b;

  background-color: var(--primary-color);
  color: var(--secondary-color);
  // height: 26rpx;
  border-radius: 13rpx;
  font-weight: 600;
  display: inline-flex;
  overflow: hidden;
  font-size: 9px;

  .svip-price-num,
  .svip-price-text {
    height: 100%;
  }

  .svip-price-text {
    width: 54rpx;
    background-color: var(--secondary-color);
    color: var(--primary-color);
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom-right-radius: 10rpx;
  }

  .svip-price-num {
    padding-left: 4rpx;
    padding-right: 8rpx;
  }
}
</style>
