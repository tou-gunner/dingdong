<template>
  <view>
    <view class="product-item" v-if="inited">
      <view :style="[productImgStyle]" class="relative">
        <swiper class="product-swiper" autoplay :indicator-dots="false" circular @change="handleSwiperChange">
          <swiper-item v-for="(src, index) of goods.product.slider_image" :key="index">
            <image class="product-img" :src="src" mode="aspectFit" @click="goProductDetail(goods)" />
          </swiper-item>
        </swiper>
        <view class="swiper-indicator absolute flex-y-center justify-between">
          <view>{{ currentIndex + 1 }}</view>
          <view>{{ goods.product.slider_image.length }}</view>
        </view>
      </view>
      <view class="product-info">
        <view class="flex flex-y-center">
          <view class="price-box">
            <priceFormat :price="goods.product.price" weight intSize="52" floatSize="36" labelSize="36" />
          </view>
          <view class="svip-price-box"
            v-if="goods.show_svip_info && goods.show_svip_info.show_svip_price && goods.svip_price">
            <svip-price :price="goods.svip_price + ''" />
          </view>
          <view class="sales-count">{{ goods.sales }}人都在买</view>
        </view>
        <view class="flex flex-y-center product-bottom">
          <view class="product-name flex-1 line2">{{ goods.product.store_name }}</view>
          <view class="buy-btn-box flex">
            <view class="add-cart-btn flex flex-center" @click="handleAddCart(goods)">
              <view class="iconfont icon-ic_ShoppingCart1"></view>
            </view>
            <view @click="goProductDetail(goods)" class="buy-btn flex-center flex-1">
                购买
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>

</template>

<script>
import svipPrice from '@/components/svip-price.vue';
import { goShopDetail } from '@/libs/order.js';

export default {
  name: "LargeProductItem",
  components: {
    svipPrice
  },
  props: {
    goods: Object
  },
  data() {
    return {
      inited: false,
      ratio: 1,
      currentIndex: 0
    }
  },
  computed: {
    productImgStyle() {
      return {
        "aspect-ratio": `${this.ratio}`
      };
    }
  },
  created() {
    this.initStyleInfo();
  },
  methods: {
    async initStyleInfo() {
      try {
        const [error, res] = await uni.getImageInfo({
          src: this.goods.product.slider_image[0]
        });
        if (error) throw new Error(error.errMsg);
        this.ratio = res.width / res.height;
        this.inited = true;
      } catch (error) {
        console.log(error.message);
      }
    },
    handleSwiperChange(e) {
      this.currentIndex = e.detail.current;
    },
    handleAddCart(goods) {
      this.$emit('addCart', goods);
    },
    goProductDetail(goods) {
      goShopDetail(goods).then(result => {
        if (result) {
          uni.navigateTo({
            url: `/pages/goods_details/index?id=${goods.product_id}`
          });
        }
      });
    }
  }
}
</script>

<style scoped lang="scss">
.product-item {
  --radius: 24rpx;
  border-radius: var(--radius);
  background-color: #fff;
  margin-bottom: 20rpx;

  .product-swiper {
    width: 100%;
    height: 100%;
  }

  .product-img {
    display: block;
    width: 100%;
    height: 100%;
    border-top-left-radius: var(--radius);
    border-top-right-radius: var(--radius);
  }
}

.swiper-indicator {
  right: 20rpx;
  bottom: 34rpx;
  height: 36rpx;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 18rpx;
  min-width: 80rpx;
  overflow: hidden;
  font-weight: 600;
  font-size: 20rpx;
  color: #FFFFFF;
  line-height: 28rpx;
  padding-inline: 14rpx;


  &::before {
    content: "";
    position: absolute;
    bottom: 0;
    right: 50%;
    width: 44rpx;
    height: 44rpx;
    border-bottom-right-radius: 22rpx;
    background: rgba(0, 0, 0, 0.1);
    transform: translateX(2px);
  }
}

.product-info {
  padding: 22rpx 24rpx 32rpx;

  .price-box {
    color: var(--view-priceColor);
  }

  .svip-price-box {
    margin-left: 16rpx;
  }

  .sales-count {
    margin-left: auto;
    font-size: 24rpx;
    color: #999999;
    line-height: 34rpx;
  }

  .product-name {
    font-weight: 500;
    font-size: 28rpx;
    color: #333333;
    line-height: 40rpx;
  }

  .product-bottom {
    margin-top: 22rpx;
  }

  .buy-btn-box {
    width: 200rpx;
    height: 64rpx;
    margin-left: 36rpx;
    background-color: var(--view-theme);
    font-size: 24rpx;
    color: #FFFFFF;
    line-height: 34rpx;
    font-weight: 500;
    border-radius: 50rpx;
  }

  .add-cart-btn {
    width: 88rpx;
    background-color: #fceae9;
    border-top-left-radius: 50rpx;
    border-bottom-left-radius: 50rpx;
    color: var(--view-theme);
    .iconfont {
      font-size: 40rpx;
    }
  }
}
</style>
