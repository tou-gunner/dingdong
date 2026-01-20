<template>
  <view class="good-body">
    <view class="good-name item_tags" @click="handleToProductPage">
      <view class="good-promotion-type tags_item" v-if="promotionType">{{ promotionType }}</view>
      <view class="good-name-content line1">{{ good.store_name }}</view>
    </view>
    <view class="good-price-info" @click="handleToProductPage">
      <priceFormat :price="good.price" weight intSize="36" floatSize="26" labelSize="26" />
      <svip-price v-if="good.svip_price" :price="good.svip_price" />
    </view>
    <view class="good-tag-list item_tags" @click="handleToProductPage" v-if="tagList.length">
      <view class="good-tag tags_item flex-center line1" v-for="tag of tagList" :style="[tag.style]" :key="tag.label">{{ tag.label }}</view>
    </view>
    <view class="good-sale-score" @click="handleToProductPage">
      <view class="good-score">{{ good.rate }} ຄະແນນ</view>
      <view class="good-sale">ຂາຍແລ້ວ {{ good.sales }}</view>
      <view class="good-reply-count">{{ good.reply_count | formatReplyCount }} ຄຳເຫັນ</view>
    </view>
    <view class="good-store-info" v-if="isStoreInfoVisible">
      <view class="store-distance" v-if="distance">{{ distance }}km</view>
      <view class="store-name line1" @click="toMerPage">
        {{ good.merchant.mer_name }}
      </view>
      <view class="iconfont icon-ic_rightarrow" @click="toMerPage"></view>
    </view>
  </view>
</template>

<script>
import svipPrice from '@/components/svip-price.vue';
import { mapState } from "vuex";
import { getDistanceInMeters } from "@/utils/location";
import { getProductTagList, getProductPromotionType } from "@/utils/product.js";

export default {
  name: "goodInfo",
  components: {
    svipPrice
  },
  inject: ["parentMerId"],
  props: {
    good: Object,
    dataConfig: Object
  },
	methods: {
		handleToProductPage() {
			uni.navigateTo({
				url: `/pages/goods_details/index?id=${this.good.product_id}`
			});
		},
		// 跳转到商城主页
		toMerPage() {
			uni.navigateTo({
				url:`/pages/store/home/index?id=${this.good.merchant.mer_id}`
			});
		}
  },
  filters: {
    formatReplyCount(count) {
      if (count < 10000) return count;
      return parseInt(count / 10000) + "ໝື່ນ+";
    }
  },
  computed: {
    ...mapState({
      location: state => state.location.location
    }),
    promotionType() {
      return getProductPromotionType(this.good.product);
    },
    tagList() {
      return getProductTagList({
        ...this.good.product,
        merchant: this.good.merchant,
      });
    },
    distance() {
      if (this.good.merchant && this.location) {
        const { lat, long } = this.good.merchant;
        const distance = getDistanceInMeters(this.location, { 
          latitude: Number(lat),
          longitude: Number(long)
        }) / 1000;
        return distance.toFixed(2);
      }

      return null;
    },
    isStoreInfoVisible() {
      return !this.parentMerId;
    }
  }
}
</script>

<style scoped lang="scss">
.good-body {
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;

  .good-name {
    display: flex;
    align-items: center;
    gap: 4rpx;
  }

  .good-promotion-type {
    background-color: var(--view-theme);
    border: 1px solid var(--view-theme);
    color: #fff;
  }

  .good-name-content {
    line-height: 28px;
    flex: 1;
  }

  .good-price-info {
    color: var(--good-price-color);
    display: flex;
    align-items: center;
    gap: 8rpx;
    margin-top: auto;
  }

  .good-tag-list {
    margin-top: 16rpx;
    display: flex;
    overflow: hidden;
    white-space: nowrap;

    .good-tag {
      border: 1px solid currentColor;
      flex-shrink: 0;
    }
  }


  .good-sale-score {
    display: flex;
    margin-top: 12rpx;
    font-size: 10px;
    gap: .5em;
    color: #666;

    .good-score {
      color: var(--good-score-color, inherit);
    }

    .good-sale {
      color: var(--good-sale-color, inherit);
    }
  }

  .good-store-info {
    display: flex;
    align-items: center;
    font-size: 10px;
    color: #666;
    margin-top: 12rpx;

    .store-distance {
      margin-right: 6rpx;
    }

    .store-name {
      color: #282828;
      margin-right: 6rpx;
    }

    .iconfont {
      color: #282828;
      font-size: 8px;
    }
  }
}
</style>
