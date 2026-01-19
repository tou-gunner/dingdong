<template>
  <view class="base-nav-bar" :class="{ 'light-text': lightText }">
    <view class="nav-bar-wrapper">
      <button class="nav-bar-back" v-if="showBack" @click="handleBack">
        <view class="iconfont icon-ic_leftarrow"></view>
      </button>
      <view class="base-nav-bar-title overflow-text">{{ title }}</view>
    </view>
  </view>
</template>

<script>
export default {
  name: "BaseNavBar",
  props: {
    title: {
      type: String,
      default: ""
    },
    lightText: {
      type: Boolean,
      default: false
    },
    showBack: {
      type: Boolean,
      default: true
    }
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
.base-nav-bar {
  padding-top: calc(var(--safe-area-inset-top) + var(--nav-padding-y-gap));
  padding-bottom: var(--nav-padding-y-gap);

  &.light-text {
    color: #fff;
  }

  .nav-bar-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    height: var(--nav-content-height);
  }

  .base-nav-bar-title {
    flex: 1;
    font-size: 34rpx;
    font-weight: 500;
    text-align: center;
    max-width: 80%;
  }

  .nav-bar-back {
    position: absolute;
    left: 20rpx;
    top: 50%;
    transform: translateY(-50%);
    width: 40rpx;
    height: 40rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: transparent;
    color: inherit;

    .iconfont {
      font-size: 40rpx;
      color: inherit;
    }
  }
}
</style>
