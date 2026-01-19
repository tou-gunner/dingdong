<template>
  <view class="order-cate" @click="handleCateClick">
    <view class="order-cate-item" v-for="item of cateList" :key="item.label" :class="{ active: item.status === value }"
      :data-status="item.status">
      <view class="order-cate-item-label" :data-status="item.status">
        {{ item.label }}
      </view>
    </view>
  </view>
</template>

<script>
export default {
  model: {
    prop: "value",
    event: "input"
  },
  props: {
    value: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      cateList: [
        {
          status: 0,
          label: "全部"
        },
        {
          status: 1,
          label: "待服务"
        },
        {
          status: 20,
          label: "进行中"
        },
        {
          status: 2,
          label: "已服务"
        },
        {
          status: -1,
          label: "已取消"
        }
      ]
    }
  },
  methods: {
    handleCateClick(e) {
      const status = e.target.dataset.status;
      if (status === undefined) return;
      this.$emit("input", Number(status));
    }
  }
}
</script>

<style scoped lang="scss">
.order-cate {
  display: flex;
  margin: 0 20rpx 20rpx;
  font-size: 26rpx;
  color: #333;
  background-color: #fff;
  border-radius: 16rpx;
  position: relative;
  z-index: 1;
}

.order-cate-item {
  flex: 1;
  height: 86rpx;
  display: flex;
  align-items: center;
  justify-content: center;

  &.active {
    font-weight: 500;
    color: #2A7EFB;
  }
}

.order-cate-item-label {
  position: relative;
}
</style>
