<template>
  <view v-if="dataConfig.cartConfig.tabVal === 0" @click="handleCartClick" class="cart-box"
    :class="[`type-${styleType}`]" :style="[cartStyle]">
    <template v-if="styleType === CART_BTN_ENUM.TEXT">ຊື້</template>
    <view class="iconfont icon-ic_increase" v-else-if="styleType === CART_BTN_ENUM.PLUS_ICON"></view>
    <view class="iconfont icon-ic_ShoppingCart1" v-else-if="styleType === CART_BTN_ENUM.CART_ICON"></view>
  </view>
</template>

<script>
import { diyUtil } from "@/utils/diy";

const CART_BTN_ENUM = {
  TEXT: 0,
  PLUS_ICON: 1,
  CART_ICON: 2
};

export default {
  name: "goodCart",

  props: {
    dataConfig: Object,
    good: Object
  },
  data() {
    return {
      CART_BTN_ENUM,
    };
  },
  computed: {
    cartStyle() {
      const { bntBgColor, toneCartConfig } = this.dataConfig;
      if (toneCartConfig.tabVal === 0) return {};
      return {
        background: diyUtil.buildLinearColor(bntBgColor)
      };
    },
    styleType() {
      const { bntStyleConfig, styleConfig } = this.dataConfig;

      if ([0, 4].includes(styleConfig.tabVal)) {
        // 单列展示和大图展示风格下，购物车按钮包含三种样式，文字、plus、cart => [0, 1, 2]
        return bntStyleConfig.tabVal;
      } else {
        // 其他风格下，购物车按钮包含两种样式，plus、cart => [0, 1]
        return bntStyleConfig.tabVal + 1;
      }
    }
  },
  methods: {
    handleCartClick() {
      if (this.dataConfig.bntConfig.tabVal === 0) {
        // 进入详情页
        uni.navigateTo({
          url: `/pages/goods_details/index?id=${this.good.product_id}`
        });
      } else {
        // 加购
        this.$emit("addCart", this.good);
      }
    },
  }
}
</script>

<style scoped lang="scss">
.cart-box {
  position: absolute;
  bottom: var(--good-cart-bottom, 10px);
  right: var(--good-cart-right, 15px);
  background: linear-gradient(to right, var(--view-theme) 0%, var(--view-assist) 100%);

  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;

  width: 44rpx;
  height: 44rpx;
  border-radius: 50%;
  font-size: 12px;

  .iconfont {
    font-size: 12px;
  }

  &.type-0 {
    width: 96rpx;
    height: 56rpx;
    border-radius: 50rpx;
  }
}
</style>
