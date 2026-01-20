<template>
  <view class="order-list-bottom-tabs">
    <!-- <view 
			class="tab-item" 
			v-for="item of tabs" 
			:key="item.index" 
			:class="{ active: item.index === value }"
      @click="$emit('input', item.index)"> -->
		<view 
			class="tab-item" 
			v-for="item of tabs" 
			:key="item.index" 
			:class="{ active: item.index === value }"
			@click="onchangeTab(item.index)">
      <view class="iconfont-next" :class="item.icon"></view>
      <view class="tab-item-label">{{ item.label }}</view>
    </view>
  </view>
</template>

<script>
import { ASSIGNED, UNASSIGNED } from "../config";

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
      tabs: [
        {
          index: UNASSIGNED,
          label: "ຮັບອໍເດີ",
          icon: "icon-jiedan-weixuanzhong"
        },
        {
          index: ASSIGNED,
          label: "ການຈັດສົ່ງຂອງຂ້ອຍ",
          icon: "icon-dingdan-weixuanzhong"
        }
      ]
    }
  },
	methods: {
		onchangeTab(index) {
			this.$emit('input', index);
			// if (index == UNASSIGNED) {
			// 	uni.navigateTo({
			// 		url: '/pages/delivery/order_list'
			// 	});
			// } else {
			// 	uni.navigateTo({
			// 		url: '/pages/delivery/my_delivery'
			// 	});
			// }
		}
	}
} 
</script>

<style scoped lang="scss">
@import "@/static/iconfont/iconfont-next.css";

.order-list-bottom-tabs {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ffffff;
  padding-bottom: var(--safe-area-inset-bottom);
  display: flex;
}

.tab-item {
  flex: 1;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;
  height: 100rpx;
  font-size: 20rpx;
  line-height: 28rpx;
  color: #333;

  &.active {
    color: #2A7EFB;
  }

  .iconfont-next {
    font-size: 38rpx;
    width: 40rpx;
    height: 40rpx;
    text-align: center;
    line-height: 40rpx;
  }

  .tab-item-label {
    margin-top: 6rpx;
  }
}
</style>
