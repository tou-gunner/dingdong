<template>
  <view class="distance-box" :class="{'blur': blur}">
    <image :src="info.merchant.mer_avatar" class="store-img" mode="aspectFit" />
    <text class="store-name">{{ info.merchant.mer_name }}</text>
    <text class="vertical-line"></text>
    <text class="distance">{{ info.distance }}</text>
  </view>
</template>

<script>
export default {
  name: "MerDistanceInfo",
  props: {
    info: Object,
    blur: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped lang="scss">
.distance-box {
  max-width: 100%;
  width: fit-content;
  display: flex;
  align-items: center;
  height: 42rpx;
  padding: 0 8rpx;
  font-size: 12px;
  color: #333;
  font-size: 12px;
  border-radius: 2px;
  background: var(--bg-color, #F7F7F7);

  &.blur {
    backdrop-filter: blur(2px);
  }

  .store-img {
    width: 28rpx !important;
    height: 28rpx !important;
    border-radius: 4rpx !important;
    margin-right: 4px;
    flex-shrink: 0;
  }

  .store-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .vertical-line {
    height: 20rpx;
    width: 1px;
    background-color: #333;
    opacity: 0.5;
    margin: 0 12rpx;
  }
}
</style>
