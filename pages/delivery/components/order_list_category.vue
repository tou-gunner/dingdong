<template>
  <view class="order-cate flex-box">
		<view 
			class="flex-box"
			:class="deliveringStyle"
			@click="handleCateClick(0)">
			配送中({{orderCount}})
		</view>
		<view 
			class="flex-box"
			:class="deliveredStyle"
			@click="handleCateClick(1)">
			已配送
		</view>
		<image 
			src="/static/type_tag.png" 
			mode=""
			class="type-tag"
			:class="typeTagStyle">
		</image>
  </view>
</template>

<script>
export default {
	computed: {
		deliveringStyle() {
			return this.actIndex ? 'item delivering' : 'item-act delivering-act'
		},
		deliveredStyle() {
			return this.actIndex ? 'item-act delivered-act' : 'item delivered'
		},
		typeTagStyle() {
			return this.actIndex ? 'tag-right' : 'tag-left'
		}
	},
	created() {
		
	},
  model: {
    prop: "value",
    event: "input"
  },
  props: {
    orderCount: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
			actIndex: 0 // 当前选中的配送情况索引
    }
  },
  methods: {
    handleCateClick(index) {
			this.actIndex = index;
			this.$emit('changeDeliveryCase', index);
    }
  }
}
</script>

<style scoped lang="scss">
.order-cate {
  display: flex;
	position: relative;
  margin: 0 20rpx 0;
	align-items: flex-end;
	z-index: 1;
	.item {
		width: 50%;
		height: 78rpx;
		background-color: #F3FAFF;
		justify-content: center;
		align-items: center;
	}
	.delivering {
		position: relative;
		border-radius: 20rpx 0 0 0;
		bottom: 0;
	}
	.delivered {
		position: relative;
		border-radius: 0 20rpx 0 0;
		bottom: 0;
		right: 0;
	}
	.item-act {
		width: 50%;
		height: 96rpx;
		color: #2291F8;
		font-weight: 500;
		background-color: #FFFFFF;
		justify-content: center;
		align-items: center;
	}
	.delivering-act {
		position: relative;
		border-radius: 20rpx 20rpx 0 0;
		&::after {
			position: absolute;
			content: '';
			height: 78rpx;
			border-left: 10rpx solid #FFF;
			bottom: 0;
			right: -5rpx;
		}
	}
	.delivered-act {
		position: relative;
		border-radius: 20rpx 20rpx 0 0;
		&::after {
			position: absolute;
			content: '';
			height: 78rpx;
			border-left: 10rpx solid #FFF;
			bottom: 0;
			left: -5rpx;
		}
	}
	.type-tag {
		position: absolute;
		width: 57rpx;
		height: 78rpx;
		bottom: 0;
		z-index: 1;
		
	}
	.tag-left {
		transform: rotateY(180deg);
		left: 50%;
	}
	.tag-right {
		right: 50%;
	}
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
.flex-box {
	display: flex;
}
</style>
