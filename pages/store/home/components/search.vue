<template>
  <!-- 搜索 -->
  <view class="header" :class="{ noPointer: preview }">
    <view class="head-menu">
      <view class="iconfont icon-ic_leftarrow" @click="goback"></view>
      <view class="iconfont icon-ic_home" @click="goHome"></view>
    </view>
    <navigator :url="'/pages/store/list/index?mer_id=' + store.mer_id" hover-class="none" class="search"><text
        class="iconfont icon-ic_search"></text>{{
          placeholder }}</navigator>
  </view>

</template>

<script>
export default {
  name: "search",
  props: {
    preview: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: "ຄົ້ນຫາສິນຄ້າ"
    },
    store: Object
  },
  methods: {
    goback() {
      uni.navigateBack();
    },
    // 首页
    goHome() {
      uni.switchTab({
        url: '/pages/index/index'
      });
    },
  }
}
</script>

<style scoped lang="scss">
.header {
  padding-top: var(--safe-area-inset-top);
  position: relative;
  z-index: 6;
  display: flex;
  align-items: center;
  padding-right: 34rpx;
  height: calc(43px + var(--safe-area-inset-top));
  padding-left: 33rpx;

  .head-menu {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
    height: 27px;
    width: 70px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 13px;

    .icon-ic_leftarrow {
      font-size: 32rpx;
      color: #ffffff;
    }

    .iconfont {
      -webkit-box-flex: 1;
      -webkit-flex: 1;
      flex: 1;
      text-align: center;
      color: #fff;
      box-sizing: border-box;

      &.icon-ic_leftarrow {
        border-right: 1px solid rgba(255, 255, 255, 0.3);
      }
    }
  }

  .search {
    flex: 1;
    display: flex;
    align-items: center;
    min-width: 0;
    height: 58rpx;
    border-radius: 30rpx;
    margin-left: 32rpx;
    background-color: rgba(255, 255, 255, 0.1);
    font-weight: 500;
    font-size: 26rpx;
    color: #cccccc;
    /* #ifdef MP */
    margin-right: 200rpx;

    /* #endif */
    .iconfont {
      margin-right: 13rpx;
      margin-left: 30rpx;
      font-size: 30rpx;
    }
  }
}
</style>