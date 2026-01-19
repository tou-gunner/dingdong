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
          label: "待付款"
        },
        {
          status: 1,
          label: "待核销"
        },
        {
          status: 2,
          label: "待发货"
        },
        {
          status: 3,
          label: "待收货"
        },
        {
          status: 4,
          label: "待评价"
        },
        {
          status: 5,
          label: "已完成"
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
  font-size: 26rpx;
  color: #282828;
  background-color: #fff;
  border-radius: 16rpx;
  display: flex;
  flex-wrap: nowrap;
  gap: 54rpx;
  overflow-x: auto;
  white-space: nowrap;
}

.order-cate-item {
  height: 86rpx;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:last-child {
    margin-right: 30rpx;
  }

  &:first-child {
    margin-left: 30rpx;
  }

  &.active {
    font-size: 30rpx;
    font-weight: 500;
    color: #2A7EFB;
  }
}

.order-cate-item-label {
  position: relative;
}
</style>
