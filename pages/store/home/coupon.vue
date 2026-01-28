<template>
  <base-container v-if="store.mer_id">
    <view :style="[wrapperStyle]" class="store-home">
      <search :store="store"></search>
      <view class="main-list-wrapper">
        <view class="main-list-content">
          <scroll-view scroll-y class="main" :style="viewColor">
            <store-info :store="store"></store-info>
            <!-- 优惠券 -->
            <view>
              <view v-if="coupon.length" class="coupon">
                <view v-for="item in coupon" :key="item.coupon_id" class="item">
                  <view class="left gary" :style="[getItemStyle(item)]">
                    <view class="money">
                      <priceFormat :price="item.coupon_price" weight coupon intSize="52" floatSize="36" labelSize="36">
                      </priceFormat>
                    </view>
                    <view v-if="item.use_min_price == 0">ຮັບຄູບອງຫຼຸດທັນທີ {{ item.coupon_price }} ກີບ</view>
                    <view v-else>ຊື້ຄົບ {{ item.use_min_price }} ກີບ ໃຊ້ໄດ້ເລີຍ</view>
                  </view>
                  <view class="right">
                    <view class="name line1 acea-row row-middle">
                      <text class="label">{{ item.type === 0 ? 'ຄູບອງຮ້ານຄ້າ' : 'ຄູບອງສິນຄ້າ' }}</text>
                      <text class="line1">{{ item.title }}</text>
                    </view>
                    <view class="time-wrap" style="justify-content: space-between;">
                      <block v-if="item.coupon_type == 1">
                        <view class="time">{{ item.use_start_time | dateFormat }}-{{ item.use_end_time | dateFormat }}
                        </view>
                      </block>
                      <block v-if="item.coupon_type == 0">
                        <view>ໃຊ້ໄດ້ພາຍໃນ {{ item.coupon_time }} ວັນ ຫຼັງຈາກຮັບ</view>
                      </block>
                      <template v-if="!item.is_timeout">

                        <navigator class="button" v-if="item.issue" hover-class="none"
                        :url="`/pages/columnGoods/goods_coupon_list/index?coupon_id=${item.coupon_id}`">ໄປນໍາໃຊ້</navigator>
                        <view class="button" v-else @click="receiveCoupon(item)">ຮັບທັນທີ</view>
                      </template>
                    </view>
                  </view>
                </view>
                <view class="tabbar-placeholder"></view>
              </view>
              <emptyPage v-if="coupon.length == 0" title="ບໍ່ມີຄູບອງ~"></emptyPage>
            </view>
          </scroll-view>
        </view>
      </view>
    </view>
    <diyDataProvider :diyId="diyId" :merId="merId" v-if="merId || diyId">
      <template #config="{ tabbarConfig }">
        <template v-if="tabbarConfig">
          <!--自定义底部tab栏-->
          <pageFootWrapper :merId="merId" :tabbarConfig="tabbarConfig" :nothing-data="updateStyle(tabbarConfig)" />
        </template>
      </template>
    </diyDataProvider>
  </base-container>
</template>
<script>
import BaseContainer from "@/components/common/base_container.vue";

import search from "./components/search.vue";
import storeInfo from "./components/store-info.vue";
import { mapGetters, mapState } from 'vuex';
import emptyPage from '@/components/emptyPage.vue'
import { HTTP_REQUEST_URL } from '@/config/app';
import { getShopCoupons, setCouponReceive } from '@/api/api.js';
import shareMixins from './components/share-mixins.js';
import diyDataProvider from '@/components/diyPage/common/diyDataProvider.vue';
import pageFootWrapper from "@/sub-packages/diy/diyPage/common/pageFootWrapper.vue";
import { diyUtil } from "@/utils/diy";

export default {
  mixins: [shareMixins],
  components: {
    BaseContainer,
    
    search,
    storeInfo,
    emptyPage,
    diyDataProvider,
    pageFootWrapper
  },
  data() {
    return {
      merId: 0, // 商铺id，兼容 mixin 的 merId 参数
      id: 0, // 商铺id
      coupon: [],
      diyId: undefined,
      tabbarHeight: 0
    }
  },
  // #ifdef MP
  componentPlaceholder: {
		"page-foot-wrapper": "view"
	},
	// #endif
  filters: {
    dateFormat: function (value) {
      if (!value) {
        return '';
      }
      return value.split(' ')[0].replace('-', '.');
    }
  },
  onLoad(options) {
    this.diyId = parseInt(options.diyId) || 0;
    this.merId = this.id = parseInt(options.mer_id || options.id) || 0;
    this.getStore();
    this.getCoupon();
  },
  computed: {
    ...mapGetters(['isLogin', 'uid', 'viewColor', 'keyColor']),
    ...mapState({
      store(state) {
        return state.store.storeInfoMap[this.merId] || {};
      }
    }),
    wrapperStyle() {
      return {
        backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.5) 100%), url(${this.store.mer_banner})`,
        "--tabbar-height": `${this.tabbarHeight}px`
      }
    },
  },
  methods: {
    getItemStyle(item) {
      if (item.is_timeout) {
        return {
          'background-image': `url(${HTTP_REQUEST_URL}/static/images/coupon_gary.png)`
        }
      } 
      return {
        'background-image': `url(${HTTP_REQUEST_URL}/static/diy/couponBg${this.keyColor}.png)`
      }
    },
    updateStyle(tabbarConfig) {
      this.tabbarHeight = diyUtil.calcTabbarHeight(tabbarConfig);
      return undefined;
    },
    // 获取商铺优惠券
    getCoupon() {
      if (this.coupon.length) {
        return;
      }
      getShopCoupons(this.id).then(res => {
        this.coupon = res.data;
      });
    },
    // 领取优惠券
    receiveCoupon(item) {
      let that = this;
      if (that.isLogin === false) {
        toLogin()
      } else {
        setCouponReceive(item.coupon_id).then(res => {
          item.issue = 1
          uni.showToast({
            title: res.message,
            icon: 'none'
          })

          setTimeout(() => {
            const url = `/pages/columnGoods/goods_coupon_list/index?coupon_id=${item.coupon_id}`;
            uni.navigateTo({
              url
            })
          }, 500);
        }).catch(err => {
          uni.showToast({
            title: err,
            icon: 'none'
          })
        })
      }
    },
    async getStore() {
      try {
        await this.$store.dispatch("getStoreInfo", {
          merId: this.id
        });
        this.ShareInfo();
      } catch (error) {
        console.error(error.message);
        this.$util.Tips({
          title: error.message
        });
      }
    },
  }
}
</script>

<style scoped lang="scss">
@import "./components/common.scss";

::v-deep .diy-data-provider {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.coupon {
  padding: 30rpx;
  background-color: #f5f5f5;

  .item {
    display: flex;
    margin-bottom: 16rpx;

    .left {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 240rpx;
      font-weight: 500;
      font-size: 24rpx;
      line-height: 1;
      color: #ffffff;
      background-size: 100% 100%;

      .money {
        margin-bottom: 25rpx;
        font-weight: 800;
        font-size: 36rpx;

        .int {
          font-size: 52rpx;
        }
      }
    }

    .right {
      flex: 1;
      min-width: 0;
      padding-right: 18rpx;
      padding-left: 27rpx;
      background-color: #ffffff;
      position: relative;
      overflow: hidden;
      border-radius: 0 24rpx 24rpx 0;

      .name {
        padding: 30rpx 0;
        border-bottom: 1px solid #f5f5f5;
        font-weight: 500;
        font-size: 30rpx;
        line-height: 1;
        color: #282828;

        .label {
          display: inline-block;
          text-align: center;
          line-height: 28rpx;
          padding: 0 14rpx;
          -webkit-box-sizing: border-box;
          box-sizing: border-box;
          background: var(--view-minorColor);
          border: 1px solid var(--view-theme);
          opacity: 1;
          border-radius: 26rpx;
          font-size: 20rpx;
          color: var(--view-theme);
          margin-right: 12rpx;

          &.gary {
            border-color: #bbb;
            color: #bbb;
            background-color: #f5f5f5;
          }
        }

        text {
          display: inline-block;
          max-width: 290rpx;
        }
      }

      .time-wrap {
        display: flex;
        align-items: center;
        padding: 12rpx 0;
        font-size: 20rpx;
        color: #999999;

        .time {
          flex: 1;
          min-width: 0;
        }

        .button {
          width: 136rpx;
          height: 52rpx;
          border-radius: 26rpx;
          background-color: var(--view-theme);
          font-weight: 500;
          font-size: 22rpx;
          line-height: 52rpx;
          text-align: center;
          color: #ffffff;
        }

        .gary {
          font-size: 130rpx;
          color: #dfdfdf;
          position: absolute;
          right: -15rpx;
          z-index: 0;
          bottom: -20rpx;
          transform: rotateZ(-45deg);
        }
      }
    }
  }
}
</style>
