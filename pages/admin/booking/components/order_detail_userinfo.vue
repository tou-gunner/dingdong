<template>
  <view class="order-detail-userinfo">
    <image class="user-avatar" :src="orderInfo.user.avatar" />
    <view>
      <view class="user-name">
        {{ orderInfo.user && orderInfo.user.nickname }}
        <image :src="`${domain}/static/images/svip.png`" class="user-vip-icon" v-if="orderInfo.user && orderInfo.user.is_svip > 0" mode="aspectFill" />
      </view>
      <view class="user-phone">
        {{ orderInfo.user_phone }}（ID: {{ orderInfo.uid }}）
      </view>
    </view>
  </view>
</template>
<script>
import { HTTP_REQUEST_URL } from "@/config/app";

export default {
  name: "OrderDetailUserInfo",
  props: {
    orderInfo: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      domain: HTTP_REQUEST_URL
    }
  }
}
</script>

<style scoped lang="scss">
.order-detail-userinfo {
  border-radius: 24rpx;
  background: #FFFFFF;
  padding: 24rpx;
  margin-top: 20rpx;

  display: flex;
  align-items: center;

  .user-avatar {
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
    margin-right: 20rpx;
  }

  .user-name {
    font-size: 28rpx;
    color: #333333;
    display: flex;
    align-items: center;
    gap: 10rpx;

    .user-vip-icon {
      width: 56rpx;
      height: 26rpx;

      &:first-child {
        margin-left: 2rpx;
      }
    }
  }

  .user-phone {
    font-size: 24rpx;
    color: #999999;
    margin-top: 4rpx;
  }
}
</style>
