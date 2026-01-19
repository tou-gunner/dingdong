<!-- 商品分类页面，水平方向滚动分类列表组件，仅文字列表，无图片 -->
<template>
  <view class="horizontal-cate-list-wrapper">
    <view class="scroll-wrapper">
      <scroll-view class="horizontal-text-cate-list" scroll-x :scroll-into-view="scrollIntoViewId"
        scroll-with-animation>
        <view class="cate-item-list flex flex-no-wrap" :class="theme">
          <view class="cate-item line1" v-for="(item, index) of list" :key="item.store_category_id"
            :class="{ 'active': activeIndex === index }" @click="handleToggleCategory(index)"
            :id="`horizontal-category-${index}`">
            {{ item.cate_name }}
          </view>
        </view>
      </scroll-view>
    </view>
    <view class="show-all-btn flex relative">
      <view class="icon-wrapper flex-center" :class="theme" @click="handleOpenPanel">
        <view class="iconfont icon-ic_downarrow fs-24"></view>
      </view>
    </view>

    <view class="all-category-wrapper fixed" v-if="allCategoryVisible" @click.self="handleClosePanel">
      <view class="all-category-content rd-b-32rpx">
        <TopSearch theme="light" />
        <view class="cate-item-list flex gray flex-wrap">
          <view class="cate-item line1" v-for="(item, index) of list" :key="item.store_category_id"
            :class="{ 'active': activeIndex === index }" @click="handleToggleCategoryOnPanel(index)">
            {{ item.cate_name }}
          </view>
        </view>
        <view class="flex-center">
          <view class="close-btn flex-center text--w111-999 fs-24" @click="handleClosePanel">
            点击收起
            <view class="iconfont icon-ic_uparrow pl-4"></view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import TopSearch from '@/components/goodsCate/top-search.vue';

export default {
  name: "HorizontalTextCateList",
  components: {
    TopSearch
  },
  props: {
    theme: {
      type: String,
      default: "light", // gray, light
    },
    list: Array, // 分类列表
    activeIndex: Number // 当前选中的分类索引
  },
  data() {
    return {
      allCategoryVisible: false,
      scrollIntoViewId: ""
    }
  },
  methods: {
    handleToggleCategoryOnPanel(index) {
      this.handleClosePanel();
      this.$emit("toggle", index);
      this.scrollIntoViewId = `horizontal-category-${index}`;
    },
    handleClosePanel() {
      this.allCategoryVisible = false;
    },
    handleOpenPanel() {
      this.allCategoryVisible = true;
    },
    handleToggleCategory(index) {
      this.$emit("toggle", index);
    }
  }
}
</script>
<style scoped lang="scss">
.horizontal-cate-list-wrapper {
  display: flex;
  align-items: center;
}

.show-all-btn {
  width: 92rpx;
  height: 104rpx;
  align-items: center;
  justify-content: flex-end;

  .icon-wrapper {
    width: 56rpx;
    height: 56rpx;
    background: #FFFFFF;
    border-radius: 50%;

    &.gray {
      background: #F5F5F5;
    }
  }

  .iconfont {
    font-size: 32rpx;
  }

  &::before {
    content: '';
    position: absolute;
    left: -10rpx;
    top: 4rpx;
    width: 18rpx;
    height: 96rpx;
    background: radial-gradient(59% 59% at 81% 49%, rgba(0, 0, 0, 0.082) 0%, rgba(0, 0, 0, 0) 100%);
  }
}

.scroll-wrapper {
  flex: 1;
  overflow: hidden;
}

.cate-item-list {
  display: flex;
  gap: 16rpx;

  --bg-color-primary: #f5f5f5;
  --bg-color-secondary: #FCEAE9;
  --text-color: var(--view-theme);

  &.light {
    --bg-color-primary: #fff;
  }
}

.cate-item {
  width: 144rpx;
  height: 56rpx;
  background-color: var(--bg-color-primary);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  color: #333333;
  line-height: 34rpx;
  border-radius: 28rpx;
  flex-shrink: 0;

  &.active {
    color: var(--text-color);
    background-color: var(--bg-color-secondary);
    border: 1px solid currentColor;
  }
}

.all-category-wrapper {
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;

  .all-category-content {
    background-color: #fff;
  }

  .cate-item-list {
    padding: 24rpx 30rpx;
  }

  .close-btn {
    height: 80rpx;
  }
}
</style>
