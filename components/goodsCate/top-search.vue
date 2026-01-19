<!-- 商品分类页面顶部搜索组件 -->
<template>
  <view class="top-search-wrapper flex" :class="theme" :style="[searchWrapperStyle]">
    <slot />
    <navigator class="top-search-btn flex-1" :url="searchUrl" hover-class="none" :style="[searchBtnStyle]">
      <view class="iconfont icon-ic_search"></view>
      <text>请输入商品名称</text>
    </navigator>
  </view>
</template>

<script>
export default {
  name: "TopSearch",
  props: {
    merId: {
      type: Number,
      default: 0
    },
    theme: {
      type: String,
      default: "gray", // gray, light
    }
  },
  computed: {
    searchUrl() {
      return this.merId ? `/pages/store/list/index?mer_id=${this.merId}` : '/pages/columnGoods/goods_search/index';
    },
    searchWrapperStyle() {
      const style = {};
      // #ifdef MP
      Object.assign(style, {
        paddingRight: `calc(var(--menu-btn-width) + var(--menu-btn-right) + ${uni.upx2px(20)}px)`,
        paddingTop: `var(--menu-btn-top)`,
      });
      // #endif
      return style;
    },
    searchBtnStyle() {
      const style = {};
      // #ifdef MP
      Object.assign(style, {
        height: `var(--menu-btn-height)`,
      });
      // #endif
      return style;
    }
  }
}
</script>

<style scoped lang="scss">
.top-search-wrapper {
  // 默认 gray 主题
  --top-search-bg-color: #f5f5f5; // 搜索组件背景
  --top-search-btn-bg-color: #fff; // 搜索框背景

  &.light {
    --top-search-bg-color: #fff;
    --top-search-btn-bg-color: #f5f5f5;
    --top-search-btn-color: #333;
  }

  padding-top: calc(var(--safe-area-inset-top) + 12rpx);
  padding-bottom: 10rpx;
  --default-top-search-padding-inline: 32rpx;
  padding-inline: var(--top-search-padding-inline, var(--default-top-search-padding-inline));
  background-color: var(--top-search-bg-color);
}

.top-search-btn {
  display: flex;
  background-color: var(--top-search-btn-bg-color);
  height: 58rpx;
  border-radius: 30rpx;
  color: #999;
  align-items: center;
  padding-inline: 32rpx;
  font-size: 24rpx;

  .iconfont {
    font-size: 26rpx;
    margin-right: 18rpx;
  }
}
</style>
