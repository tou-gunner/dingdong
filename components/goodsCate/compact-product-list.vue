<!-- 包含紧凑小图商品的列表 -->
<template>
  <scroll-view class="compact-product-list" scroll-y @scrolltolower="handleScrollToLower">
    <view class="product-item" v-for="(item, index) in list" :key="index">
      <image :src="item.recommend_image ? item.recommend_image : item.image" class="product-image" mode="aspectFill"
        @click="goProductDetail(item)" />
      <view class="product-body flex-1 flex-col">
        <view class="product-name line1" @click="goProductDetail(item)">{{ item.store_name }}</view>
        <view class="product-tag-list flex flex-wrap">
          <view class="product-tag flex-center" v-for="tag of getTagList(item)" :key="tag.text">{{ tag.text }}</view>
        </view>

        <view class="product-bottom flex-y-center">
          <priceFormat :price="item.price" weight intSize="40" floatSize="24" labelSize="24"></priceFormat>
          <view class="svip-price-container" v-if="checkShowVipPrice(item)">
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
                @confirm="setProCartNum($event, item)" class="w-48 text-center" @blur="setProCartNum($event, item)" />
            </view>
            <view class="flex-center w-48 h-48 rd-30rpx bg-color text--w111-fff" @tap.stop="handleAddCartNum(item)">
              <text class="iconfont icon-ic_increase fs-32"></text>
            </view>
          </view>
          <view class="buy-btn-box flex-center relative ml-auto" @click="addCart(item)" v-else>
            <view class="iconfont icon-ic_ShoppingCart1 fs-30"></view>
          </view>
        </view>
      </view>
    </view>
    <slot />
  </scroll-view>
</template>

<script>
import productListMixin from "./mixins/product-list-mixin";
import HTTP_REQUEST_URL from '@/config/app';
import svipPrice from '@/components/svip-price.vue';

export default {
  name: "CompactProductList",
  mixins: [productListMixin],
  components: {
    svipPrice
  },
  methods: {
    getTagList(goods) {
      const deliveryWay = goods.delivery_way.split(",");
      const tagList = [
        {
          text: "自营",
          isVisible: goods.merchant && goods.merchant.is_trader === 1
        },
        {
          text: "包邮",
          isVisible: goods.delivery_free === 1
        },
        {
          text: "秒杀",
          isVisible: goods.product_type === 1
        },
        {
          text: "预售",
          isVisible: goods.product_type === 2
        },
        {
          text: "助力",
          isVisible: goods.product_type === 3
        },
        {
          text: "拼团",
          isVisible: goods.product_type === 4
        },
        {
          text: "上门",
          isVisible: deliveryWay.includes("3")
        },
        {
          text: "同城",
          isVisible: deliveryWay.includes("4")
        }
      ];

      return tagList.filter(item => item.isVisible);
    },
    checkShowVipPrice(item) {
      // 如果购物车输入框存在，由于容器宽度限制，不显示SVIP价格
      const isCartInputVisible = item.cart && item.cart.cart_id;
      const isVipPriceVisible = item.show_svip_info && item.show_svip_info.show_svip_price && item.svip_price;

      return !isCartInputVisible && isVipPriceVisible;
    },
    getImage(good) {
      const img = good.recommend_image ? good.recommend_image : good.image;
      return img || HTTP_REQUEST_URL + '/static/images/logo_bgh.png';
    }
  }
}
</script>

<style scoped lang="scss">
.compact-product-list {
  padding-top: 12rpx;
  height: 100%;
}

.product-item {
  display: flex;
  padding-inline: 20rpx;

  &+.product-item {
    margin-top: 24rpx;
  }
}

.product-image {
  width: 176rpx;
  height: 176rpx;
  border-radius: 16rpx;
  margin-right: 20rpx;
}

.product-body {
  overflow: hidden;
}

.product-name {
  font-size: 28rpx;
  color: #333333;
  line-height: 40rpx;
  margin-bottom: 12rpx;
}

.product-tag-list {
  gap: 8rpx;

  .product-tag {
    height: 26rpx;
    border-radius: 4rpx;
    border: 1px solid #E93323;
    font-weight: 400;
    font-size: 18rpx;
    color: #E93323;
    padding-inline: 6rpx;
    border-color: var(--view-theme);
    color: var(--view-theme);

    &:first-child {
      background-color: var(--view-theme);
      color: #fff;
    }
  }
}

.svip-price-container {
  margin-left: 8rpx;
}

.product-bottom {
  margin-top: auto;
}

.buy-btn-box {
  width: 48rpx;
  height: 48rpx;
  background-color: var(--view-theme);
  border-radius: 50%;
  color: #fff;
}

.ml-auto {
  margin-left: auto;
}

.disabled-btn {
  color: #DEDEDE;
}
</style>
