<template>
  <view class="search-bar">
    <view class="input-wrapper">
      <view class="iconfont icon-ic_search" />
      <input class="search-input" placeholder="ຄົ້ນຫາການສັ່ງຊື້" :value="value"
        @input="$emit('change', $event.target.value)" @confirm="$emit('confirm', $event.target.value)"
        confirm-type="search" />
    </view>
  </view>
</template>

<script>
export default {
  model: {
    prop: "value",
    event: "change"
  },
  props: {
    value: {
      type: String,
      default: ""
    }
  }
}
</script>

<style scoped lang="scss">
.search-bar {
  --content-height: 60rpx;
  margin: 20rpx 25rpx 14rpx;
  display: flex;
  background: #F5F5F5;
  border-radius: 30rpx;
}

.input-wrapper {
  height: var(--content-height);
  flex: 1;
  padding-inline: 32rpx;

  display: flex;
  align-items: center;

  .iconfont {
    margin-right: 16rpx;
    color: #999;
  }

  .search-input {
    flex: 1;
    color: #ccc;
    font-size: 24rpx;
  }
}
</style>