<template>
  <view class="menu-btn-box flex-center" :style="[searchBtnStyle]">
    <image class="w-32 h-32" src="@/static/images/drop_more.png" @click="handleOpenDrawer"></image>
    <text class="text--w111-b3b3b3 px-16">|</text>
    <image class="w-32 h-32" src="@/static/images/cart_icon.png" @click="handleGoCart"></image>
  </view>
</template>

<script>
export default {
  name: 'MenuBtn',
  computed: {
    searchBtnStyle() {
      const style = {};
      // #ifdef MP
      Object.assign(style, {
        height: `var(--menu-btn-height)`,
      });
      // #endif
      return style;
    }
  },
  methods: {
    handleOpenDrawer() {
      this.$emit("open-drawer");
    },
    handleGoCart() {
      uni.switchTab({
        url: '/pages/order_addcart/order_addcart'
      })
    }
  }
}
</script>

<style scoped lang="scss">
.menu-btn-box {
  width: 162rpx;
  height: 58rpx;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 29rpx;
  border: 1px solid rgba(0, 0, 0, 0.1);
  margin-right: 14rpx;
}
</style>
