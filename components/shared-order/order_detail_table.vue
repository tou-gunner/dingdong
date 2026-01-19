<template>
  <view class="order-detail-table" :class="{ 'has-style': hasStyle }">
    <view class="order-detail-title" v-if="title">{{ title }}</view>
    <view class="order-table-item" v-for="(item, pindex) in list" :key="pindex" :class="{ 'mini-gap': miniGap }">
      <view class="order-label">{{ item.label }}</view>
      <view class="order-value image-list" v-if="item.isImage" @click="handlePreviewImage">
        <image :src="img" mode="aspectFill" v-for="(img, index) in item.value" :key="index"
          class="image-item" :data-index="index" :data-pindex="pindex" />
      </view>
      <view class="order-value" :class="[item.overflow ? 'overflow-text' : '', item.isPhone ? 'phone-value' : '', item.isDate ? 'is-date' : '', item.value && item.value.length > 2 ? 'not-empty' : '']"
        v-else>
        {{ item.value }}
        <text @click="handleMakeCallPhone(item.value)" class="iconfont icon-ic_phone" v-if="item.isPhone" />
      </view>
    </view>
  </view>
</template>

<script>
import { handleMakeCallPhone } from "@/utils/order";

export default {
  name: "OrderDetailTable",
  props: {
    hasStyle: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: ""
    },
    miniGap: {
      type: Boolean,
      default: false
    },
    list: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {

    };
  },
  methods: {
    handleMakeCallPhone,
    handlePreviewImage(e) {
      const { index, pindex } = e.target.dataset;
      if (index === undefined || pindex === undefined) return;
      uni.previewImage({
        current: +index,
        urls: this.list[pindex].value
      });
    }
  }
}
</script>

<style scoped lang="scss">
.order-detail-table {
  font-size: 28rpx;

  &.has-style {
    margin-top: 20rpx;
    background-color: #fff;
    border-radius: 24rpx;
    padding: 32rpx 24rpx;
  }
}

.order-detail-title {
  font-weight: 500;
  font-size: 30rpx;
}

.order-table-item {
  display: flex;
  margin-top: 40rpx;
  align-items: center;

  &.mini-gap {
    margin-top: 32rpx;
  }
}

.order-label {
  min-width: 134rpx;
  // width: 170rpx;
  flex-shrink: 0;
}

.order-value {
  &.is-date {
    min-width: 290rpx;

    &.not-empty {
      text-align: initial;
    }
  }
  margin-left: auto;
  text-align: right;

  &.phone-value {
    display: flex;
    align-items: center;

    .iconfont {
      margin-left: 12rpx;
      color: #2A7EFB;
    }
  }

  &.image-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 12rpx;

    .image-item {
      width: 106rpx;
      height: 106rpx;
      border-radius: 12rpx;

    }
  }
}
</style>
