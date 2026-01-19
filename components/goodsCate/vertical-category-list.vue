<!-- ລາຍການປະເພດແນວຕັ້ງດ້ານຊ້າຍຂອງໜ້າປະເພດສິນຄ້າ -->
<template>
  <scroll-view class="vertical-category-list" :class="theme" scroll-y :scroll-into-view="scrollIntoViewId" scroll-with-animation>
    <view class="category-item" v-for="(item, index) of list" :key="item.store_category_id"
      :class="{ 'active': activeIndex === index }" @click="handleToggleCategory(index)" :id="`vertical-category-${index}`">
      <view class="top-right-corner" v-if="index > 0 && activeIndex === index"></view>
      <view class="line1">{{ item.cate_name }}</view>
      <view class="bottom-right-corner" v-if="activeIndex === index"></view>
    </view>
    <slot />
  </scroll-view>
</template>

<script>
export default {
  name: "VerticalCategoryList",
  props: {
    theme: {
      type: String,
      default: "gray", // gray, light
    },
    list: Array, // ລາຍການປະເພດ
    activeIndex: Number, // ດັດຊະນີປະເພດທີ່ເລືອກປະຈຸບັນ
  },
  data() {
    return {
      scrollIntoViewId: ""
    }
  },
  watch: {
    activeIndex(index) {
      this.scrollIntoViewId = `vertical-category-${index}`;
    }
  },
  methods: {
    handleToggleCategory(index) {
      this.$emit("toggle", index);
    }
  }
}
</script>

<style scoped lang="scss">
.vertical-category-list {
  --bg-color-primary: #fff;
  --bg-color-secondary: #f5f5f5;
  --radius: 16rpx;

  &.gray {
    border-top-right-radius: var(--radius);
  }

  &.light {
    --bg-color-primary: #f5f5f5;
    --bg-color-secondary: #fff;
  }

  width: 168rpx;
  height: 100%;
  overflow-y: auto;
  background-color: var(--bg-color-primary);

}

.category-item {
  height: 96rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  color: #666;
  background-color: var(--bg-color-primary);
  position: relative;

  --corner-size: calc(var(--radius) * 2);

  &.active {
    background-color: var(--bg-color-secondary);
    color: var(--view-theme);
    font-weight: 500;
    z-index: 1;

    &::after {
      content: "";
      position: absolute;
      left: 0;
      top: 24rpx;
      width: 6rpx;
      height: 48rpx;
      background-color: var(--view-theme);
    }
  }

  .bottom-right-corner,
  .top-right-corner {
    position: absolute;
    width: var(--corner-size);
    height: var(--corner-size);
    right: 0;
    background-color: var(--bg-color-secondary);

    &::after {
      content: "";
      display: block;
      width: 100%;
      height: 100%;
      background-color: var(--bg-color-primary);
    }
  }

  .top-right-corner {
    top: calc(var(--corner-size) * -1);

    &::after {
      border-bottom-right-radius: var(--radius);
    }
  }

  .bottom-right-corner {
    bottom: calc(var(--corner-size) * -1);

    &::after {
      border-top-right-radius: var(--radius);
    }
  }
}
</style>
