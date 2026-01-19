<template>
  <view class="order-list-info">
    <button class="nav-bar-back" @click="handleBack">
      <view class="iconfont icon-ic_leftarrow"></view>
    </button>
    <image class="user-avatar" mode="aspectFit" :src="userInfo.avatar" />
    <text class="user-name overflow-text">{{ userInfo.nickname }}</text>
    <RoleToggle />
  </view>
</template>

<script>
import { mapGetters } from "vuex";
import RoleToggle from "@/components/role-toggle.vue";

export default {
  components: {
    RoleToggle
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  methods: {
    handleBack() {
      const pages = getCurrentPages();
      if (pages.length > 1) {
        uni.navigateBack();
      } else {
        uni.reLaunch({
          url: "/pages/index/index"
        });
      }
    }
  }
}
</script>

<style scoped lang="scss">
.order-list-info {
  display: flex;
  align-items: center;
  padding: 20rpx 20rpx 10rpx;
  color: #fff;

  // #ifdef MP-WEIXIN
  --padding-y-size: calc(var(--menu-btn-top) - var(--safe-area-inset-top));
  padding-top: var(--padding-y-size);
  padding-bottom: var(--padding-y-size);
  padding-right: calc(var(--menu-btn-width) + var(--menu-btn-right) + 34rpx);
  // #endif

  .user-avatar {
    width: 60rpx;
    height: 60rpx;
    border-radius: 50%;
  }

  .user-name {
    margin: 0 16rpx;
    max-width: 50%;
  }

  .toggle-btn {
    height: 44rpx;
    display: flex;
    align-items: center;
    padding: 0 16rpx;
    gap: 8rpx;
    font-size: 20rpx;
    border-radius: 32rpx;
    background: rgba(255, 255, 255, 0.14);
    color: inherit;

    .iconfont {
      font-size: 20rpx;
    }
  }

  .nav-bar-back {
    width: 40rpx;
    height: 40rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 18rpx;
    background-color: transparent;

    .iconfont {
      font-size: 40rpx;
      color: #fff;
    }
  }
}
</style>
