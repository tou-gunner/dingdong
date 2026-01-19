<!-- 包含中图商品的列表 -->
<template>
  <scroll-view class="medium-product-list" scroll-y @scrolltolower="handleScrollToLower">
    <view class="product-item" v-for="(item, index) in list" :key="index">
      <image :src="item.recommend_image ? item.recommend_image : item.image" class="product-image" mode="widthFix"
        @click="goProductDetail(item)" />
      <view class="product-name line2" @click="goProductDetail(item)">{{ item.store_name }}</view>
      <view class="product-bottom">
        <priceFormat :price="item.price" weight intSize="44" floatSize="28" labelSize="28"></priceFormat>
        <view class="svip-price-container"
          v-if="item.show_svip_info && item.show_svip_info.show_svip_price && item.svip_price">
          <svip-price :price="item.svip_price"></svip-price>
        </view>
        <view v-if="item.cart && item.cart.cart_id" class="flex-y-center ml-auto">
          <view class="flex-center w-48 h-48 rd-30rpx bg--w111-f5f5f5 text--w111-333"
            :class="{ 'disabled-btn': item.min_qty && item.cart.cart_num == item.min_qty }"
            @tap.stop="handleDesCartNum(item)">
            <text class="iconfont icon-ic_Reduce fs-32"></text>
          </view>
          <view class="fs-30 text--w111-333 px-20" v-if="item.cart && item.cart.cart_id">
            <input v-model="item.cart.cart_num" type="text" maxlength="2" @input="inputClick($event, item)"
              @confirm="setProCartNum($event, item)" @blur="setProCartNum($event, item)" class="w-48 text-center" />
          </view>
          <view class="flex-center w-48 h-48 rd-30rpx bg-color text--w111-fff" @tap.stop="handleAddCartNum(item)">
            <text class="iconfont icon-ic_increase fs-32"></text>
          </view>
        </view>
        <view class="buy-btn-box flex-center relative" @click="addCart(item)" v-else>
          加入购物车
        </view>
      </view>
    </view>
    <slot />
  </scroll-view>
</template>

<script>
import productListMixin from "./mixins/product-list-mixin";
import svipPrice from '@/components/svip-price.vue';

export default {
  name: "MediumProductList",
  mixins: [productListMixin],
  components: {
    svipPrice
  },
}
</script>

<style scoped lang="scss">
.ml-auto {
  margin-left: auto;
}

.disabled-btn {
  color: #DEDEDE;
}

.medium-product-list {
  padding-top: 12rpx;
  height: 100%;
}

.product-item {
  padding-inline: 24rpx 20rpx;

  &+.product-item {
    margin-top: 24rpx;
  }

  .product-image {
    display: block;
    width: 100%;
    border-top-left-radius: 20rpx;
    border-top-right-radius: 20rpx;
    margin-bottom: 16rpx;
    min-height: 100rpx;
  }

  .product-name {
    font-size: 28rpx;
    color: #333333;
    line-height: 40rpx;
  }

  .product-bottom {
    padding: 24rpx 0;
    color: var(--view-priceColor);
    display: flex;
    align-items: center;
  }

  .svip-price-container {
    margin-left: 16rpx;
  }

  .buy-btn-box {
    margin-left: auto;
    width: 158rpx;
    height: 52rpx;
    background-color: var(--view-theme);
    border-radius: 26rpx;
    font-size: 22rpx;
    color: #FFFFFF;
    line-height: 30rpx;
  }

  .cart-count {
    background-color: var(--view-theme);
    border: 1px solid #fff;
    border-radius: 16rpx;
    height: 32rpx;
    min-width: 32rpx;
    padding-inline: 6rpx;
    font-weight: 500;
    font-size: 22rpx;
    color: #FFFFFF;
    line-height: 32rpx;
    right: -16rpx;
    top: -16rpx;
  }
}
</style>
