<template>
  <view :style="viewColor">
    <view class='coupon-list-window animated popup-main bg-f' :class='coupon.coupon==true?"slideInUp":""'>
      <view class='title'>
        <view class="item font-500">优惠券</view>
        <text class='iconfont icon-ic_close popup-close' @tap='close'></text>
      </view>
      <view class='coupon-list' v-if="coupon.list.length">
        <view class='item acea-row row-center-wrapper' v-for="(item,index) in coupon.list"
          @click="getCouponUser(index,item)" :key='index'>
          <view class='money acea-row row-column row-center-wrapper'
            :style="{ 'background-image': `url(${domain}/static/diy/couponBg${keyColor}.png)` }">
            <view class="font28 semiBold">
              <priceFormat :price="item.coupon_price" weight coupon intSize="52" floatSize="36" labelSize="36">
              </priceFormat>
            </view>
            <view v-if="item.use_min_price==0" class="pic-num">领券立减{{item.coupon_price}}元</view>
            <view v-else class="pic-num">满{{item.use_min_price}}元可用</view>
          </view>
          <view class='text'>
            <view class='condition line1 no-border'>
              <span class='line-title' v-if='item.type===0'>店铺券</span>
              <span class='line-title' v-else-if='item.type===1'>商品券</span>
              <span>{{item.title}}</span>
            </view>
            <view class='data acea-row row-between-wrapper'>
              <block v-if="item.coupon_type == 1">
                <view>{{ item.use_start_time |timeYMD }}-{{ item.use_end_time |timeYMD}}</view>
              </block>
              <block v-if="item.coupon_type == 0">
                <view>领取后{{ item.coupon_time}}天内可用</view>
              </block>
              <view class='gray iconfont icon-ic_yilingqu' v-if="item.issue"></view>
              <view class='bnt b-color' v-else>{{coupon.statusTile || '立即领取'}}</view>
            </view>
          </view>
        </view>
      </view>
      <!-- 无优惠券 -->
      <view class='pictrue' v-else>
        <image :src="`${domain}/static/images/noCoupon.png`"></image>
      </view>
    </view>
    <view class='mask' catchtouchmove="true" :hidden='coupon.coupon==false' @click='close'></view>
  </view>
</template>
<script>
// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016-2026 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------
  import { setCouponReceive } from '@/api/api.js';
  import { mapGetters } from "vuex";
  import { HTTP_REQUEST_URL } from '@/config/app';
  export default {
    props: {
      //打开状态 0=领取优惠券,1=使用优惠券
      openType: {
        type: Number,
        default: 0,
      },
      coupon: {
        type: Object,
        default: function() {
          return {};
        }
      },
      showTitle: {
        type: Number,
        default: 1,
      },
      isShop: {
        type: Number,
        default: 0,
      },
    },
    filters: {
      timeYMD: function(value) {
        if (value) {
          var newDate = /\d{4}-\d{1,2}-\d{1,2}/g.exec(value)
          return newDate[0]
        }
      }
    },
    computed: mapGetters(['viewColor', 'keyColor']),
    data() {
      return {
        domain: HTTP_REQUEST_URL,
        tabList: ['商品券', '店铺券'],
        tabIndex: this.isShop,
        couponArr: [],
      };
    },
    mounted() {
      this.$nextTick(function() {
        this.couponArr = this.coupon.list
      })
    },
    methods: {
      close: function() {
        this.$emit('ChangCouponsClose');
      },
      getCouponUser: function(index, item) {
        let that = this;
        if (item.issue) return true;
        switch (this.openType) {
          case 0:
            //领取优惠券
            setCouponReceive(item.coupon_id).then(res => {
              item.issue = true
              that.$emit('ChangCouponsUseState', index);
              that.$util.Tips({
                title: "领取成功"
              });
              that.$emit('ChangCoupons', item);
            })
            break;
          case 1:
            that.$emit('ChangCoupons', index);
            break;
        }
      },
      bindTab(item, index) {
        this.tabIndex = index
        this.filterArray()
      }
    }
  }
</script>

<style scoped lang="scss">
  .animated {
    animation-duration: .3s
  }

  .title {
    display: flex;
    border-radius: 40rpx 40rpx 0 0;

    .item {
      position: relative;
      flex: 1;
      font-size: 28rpx;
      color: #282828;

      &::after {
        content: ' ';
        position: absolute;
        left: 50%;
        bottom: 18rpx;
        width: 50rpx;
        height: 5rpx;
        background: transparent;
        border-radius: 3px;
        transform: translateX(-50%);
      }

      &.on {
        color: #282828;

        &::after {
          background: var(--view-theme);
        }
      }
    }
  }

  .b-color {
    background-color: var(--view-theme);
  }

  .coupon-list {
    padding: 30rpx;
  }

  .coupon-list-window {
    background-color: #f5f5f5;
  }

  .coupon-list-window.on {
    animation: aminup;
  }

  .coupon-list-window .title {
    height: 106rpx;
    line-height: 106rpx;
    border: 1px solid #f5f5f5;
  }

  .coupon-list-window .title .icon-ic_close {
    position: absolute;
    right: 20rpx;
    top: 20rpx;
  }

  .coupon-list-window .coupon-list {
    margin: 0 0 50rpx 0;
    height: 550rpx;
    overflow: auto;
  }

  .coupon-list-window .pictrue {
    width: 414rpx;
    height: 336rpx;
    margin: 0 auto 50rpx auto;
  }

  .coupon-list-window .pictrue image {
    width: 100%;
    height: 100%;
  }

  .line-title {
    width: 90rpx;
    padding: 3rpx 14rpx;
    box-sizing: border-box;
    background: var(--view-minorColor);
    border: 1px solid var(--view-theme);
    opacity: 1;
    border-radius: 26rpx;
    font-size: 20rpx;
    color: var(--view-theme);
    margin-right: 12rpx;
  }

  .line-title.gray {
    border-color: #BBB;
    color: #bbb;
    background-color: #F5F5F5;
  }
</style>
