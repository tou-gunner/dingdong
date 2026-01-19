<template>
  <view class='my-coupon' :style="viewColor">
    <!-- 自定义顶部背景颜色 -->
    <view class="top">
      <!-- #ifdef MP || APP-PLUS -->
      <view class="sys-head fixed">
        <view class="sys-bar" :style="{height:sysHeight}"></view>
        <!-- #ifdef MP -->
        <view class="sys-title">
          <view class='iconfont icon-ic_leftarrow' @tap='goBack'></view>
          领券中心
        </view>
        <!-- #endif -->
        <view class="bg"></view>
      </view>
      <!-- #endif -->
    </view>
    <view class='header' :style="{marginTop:topHeight}">
      <view class='nav acea-row row-around' :style="{top:topHeight}">
        <view class='item' :class='type==-1 ? "on": ""' @click="statusClick(-1)">
          <view>全部</view>
        </view>
        <view class='item' :class='type==10 ? "on": ""' @click="statusClick(10)">
          <view>通用券</view>
        </view>
        <view class='item' :class='type==11 ? "on": ""' @click="statusClick(11)">
          <view>品类券</view>
        </view>
        <view class='item' :class='type==12 ? "on": ""' @click="statusClick(12)">
          <view>跨店券</view>
        </view>
        <view class='item' :class='type==0 ? "on": ""' @click="statusClick(0)">
          <view>店铺券</view>
        </view>
      </view>
    </view>
    <view class="listBox">
      <block v-for="(item) in list" :key='item.coupon_id'>
        <view class="list acea-row row-around bg-f boder-24">
          <view class="left cross" v-if="item.ProductLst.length == 1 || item.ProductLst.length == 0">
            <view v-if="item.ProductLst.length == 1" class="cross-left" v-for="(items,index) in item.ProductLst"
              :key='index'>
              <image :src="items.image"></image>
            </view>
            <view v-if="item.ProductLst.length == 0" class="cross-left">
              <image :src="`${domain}/static/images/no_product.png`"></image>
            </view>
            <view class="tips cross-right">
              <view class="title line2">{{item.title || ''}}</view>
              <view class="time">{{item.create_time}}</view>
            </view>
          </view>
          <view class="left" v-else>
            <view class="tips line1">{{item.title || ''}}</view>
            <view class="info">
              <view class="info-box" v-for="(items,index) in item.ProductLst" :key='index'>
                <image class="image" :src="items.image"></image>
                <view class="money">¥ {{items.price}}</view>
              </view>
            </view>
          </view>
          <view class="right">
            <view class="couponlogo" v-if="item.type == 10"
              :style="{ 'background-image': `url(${domain}/static/images/couponlogo.png)`}">通用券</view>
            <view class="couponlogo" v-if="item.type == 11"
              :style="{ 'background-image': `url(${domain}/static/images/couponlogo.png)`}">品类券</view>
            <view class="couponlogo" v-if="item.type == 12"
              :style="{ 'background-image': `url(${domain}/static/images/couponlogo.png)`}">跨店券</view>
            <view class="couponlogo" v-if="item.type == 0"
              :style="{ 'background-image': `url(${domain}/static/images/couponlogo.png)`}">店铺券</view>
            <view class="title" :class="{'disabled' : item.ProductLst.length<=0}">
              <view>
                <p>
                  <priceFormat :price="item.coupon_price" weight coupon intSize="52" floatSize="36" labelSize="36">
                  </priceFormat>
                </p>
                <p>
                  <text class='font3' v-if="item.use_min_price == 0">领券立减{{item.coupon_price}}元</text>
                  <text class='font3' v-else>满{{parsePrice(item.use_min_price)}}元可用</text>
                </p>
              </view>
              <view class="btn acea-row row-middle row-center" :class="item.ProductLst.length == 0 ? 'disabled' : ''"
                v-if="!item.issue" @click="receiveCoupon(item)">{{item.ProductLst.length == 0 ? '暂无法使用' : '立即领取'}}
              </view>
              <navigator :url="'/pages/columnGoods/goods_coupon_list/index?coupon_id='+item.coupon_id"
                class='btn shiyong acea-row row-middle row-center' hover-class="none"
                v-if="item.issue && item.ProductLst.length > 0">
                去使用
              </navigator>
              <view v-if="item.issue && item.ProductLst.length == 0" class='btn shiyong disabled'>暂无法使用</view>
            </view>
          </view>
        </view>
      </block>
    </view>
    <view class="loadingicon acea-row row-center-wrapper">
      <text class="loading iconfont icon-jiazai" :hidden="loading == false" style="color:#33;"></text>
    </view>
    <view class='noCommodity' v-if="!list.length && loaded">
      <view class='pictrue'>
        <image :src="`${domain}/static/images/noCoupon.png`"></image>
        <view>暂无商品，去看点什么吧</view>
      </view>
    </view>
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
  let sysHeight = uni.getSystemInfoSync().statusBarHeight + 'px';
  import { getCouponLst } from '@/api/activity.js';
  import { setCouponReceive } from '@/api/api.js';
  import { mapGetters } from "vuex";
  import { HTTP_REQUEST_URL } from '@/config/app';
  export default {
    computed: mapGetters(['viewColor']),
    components: {},
    data() {
      return {
        sysHeight: sysHeight,
        // #ifdef MP
        topHeight: uni.getSystemInfoSync().statusBarHeight + 43 + 'px',
        // #endif
        // #ifdef H5
        topHeight: 0,
        // #endif
        // #ifdef APP-PLUS
        topHeight: uni.getSystemInfoSync().statusBarHeight + 'px',
        // #endif
        domain: HTTP_REQUEST_URL,
        type: '',
        list: [],
        loading: false,
        loaded: false,
        page: 1,
        limit: 15,
      }
    },
    onLoad: function() {
      this.statusClick(-1)
    },
    methods: {
      goBack: function() {
        uni.navigateBack();
      },
      parsePrice(price) {
        if (price >= 100) {
          return parseFloat(price)
        } else {
          return price
        }
      },
      // 领取优惠券
      receiveCoupon(item) {
        let that = this;
        setCouponReceive(item.coupon_id).then(res => {
          item.issue = 1
          uni.showToast({
            title: res.message,
            icon: 'none'
          })
        }).catch(err => {
          uni.showToast({
            title: err,
            icon: 'none'
          })
        })
      },
      getList() {
        if (this.loading || this.loaded) return;
        this.loading = true;
        getCouponLst({
          product: 1,
          type: this.type == -1 ? '' : this.type,
          page: this.page,
          limit: this.limit
        }).then(res => {
          this.list = this.list.concat(res.data.list);
          this.loading = false;
          this.loaded = res.data.list.length != this.limit;
          this.page++;
        })
      },
      //切换类型
      statusClick: function(status) {
        if (status == this.type) return;
        this.loaded = false;
        this.loading = false;
        this.page = 1;
        this.list = [];
        this.type = status;
        this.getList()
      },
    },
    // 滚动监听
    onPageScroll(e) {},
    onReachBottom: function() {
      this.getList();
    }
  }
</script>

<style lang="scss">
  .sys-head .bg {
    background-color: var(--view-theme);
  }
  .my-coupon .top {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 10;
  }
  .my-coupon .header {
    height: 200rpx;
    background-color: var(--view-theme);
    border-bottom-left-radius: 10%;
    border-bottom-right-radius: 10%;
    .nav {
      border-radius: 0 0 6rpx 6rpx;
      padding: 30rpx 0;
      width: 100%;
      background: var(--view-theme);
      position: fixed;
      left: 0;
      z-index: 10;
      .item {
        text-align: center;
        font-size: 26rpx;
        color: #FFFFFF;
        padding: 29rpx 0;
        opacity: 0.7;
        line-height: 2rpx;
        .num {
          margin-top: 18rpx;
        }
      }
      .item.on {
        opacity: 1;
        font-weight: bold;
        border-bottom: 5rpx solid #FFFFFF;
      }
    }
  }
  .my-coupon .listBox {
    margin: -73rpx auto 0 auto;
    padding: 0 30rpx;
    .list {
      width: 100%;
      height: 260rpx;
      overflow: hidden;
      margin-bottom: 20rpx;
      text-align: center;
      .cross {
        display: flex;
        .cross-left {
          margin-top: 6rpx;
          image {
            width: 200rpx;
            height: 200rpx;
            border-radius: 12rpx;
          }
        }
        .cross-right {
          margin-left: 20rpx;
          margin-top: 6rpx;
          .title {
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
          }
          .time {
            margin-top: 40rpx;
            font-size: 22rpx;
            font-weight: 400;
            color: #666666;
          }
        }
      }
      .left {
        width: 75%;
        height: 210rpx;
        margin-top: 20rpx;
        border-right: 2rpx dashed #eee;
        text-align: left;
        padding-left: 30rpx;
        .tips {
          font-size: 26rpx;
          font-weight: 600;
          color: #282828;
          display: block;
        }
        .info {
          margin-top: 18rpx;
          display: flex;
          justify-content: flex-start;
          .info-box {
            margin-right: 25rpx;
            image,
            /deep/uni-image {
              display: inline-block;
              width: 130rpx;
              height: 130rpx;
              border-radius: 16rpx;
            }
            .money {
              text-align: center;
              font-size: 22rpx;
              font-weight: 400;
              color: #666666;
              margin-top: 4rpx;
            }
          }
        }
      }
      .right {
        width: 25%;
        height: 100%;
        position: relative;
        &::before,
        &::after {
          content: "";
          display: inline-block;
          width: 24rpx;
          height: 24rpx;
          background: #f5f5f5;
          border-radius: 100%;
          position: absolute;
          bottom: -12rpx;
        }
        &::before {
          left: -12rpx;
        }
        &::after {
          top: -12rpx;
          left: -12rpx;
        }
        .couponlogo {
          width: 112rpx;
          height: 32rpx;
          margin: 0 auto;
          font-size: 20rpx;
          font-weight: 400;
          line-height: 38rpx;
          color: #9B5434;
          background-size: 112rpx 32rpx;
        }
        .title {
          width: 146rpx;
          height: 169rpx;
          margin: 30rpx auto 0;
          color: var(--view-priceColor);
          font-weight: 600;
          .font1 {
            font-size: 26rpx;
          }
          .font2 {
            font-size: 26rpx;
            &.int {
              font-size: 52rpx;
            }
          }
          .font3 {
            font-size: 20rpx;
            font-weight: 400;
            color: var(--view-theme);
          }
          p {
            margin-top: 10rpx;
          }
          .btn {
            width: 136rpx;
            background: linear-gradient(270deg, var(--view-bntColor21) 0%, var(--view-bntColor22) 100%);
            border-radius: 26rpx;
            font-size: 22rpx;
            font-weight: 400;
            color: #FFFFFF;
            height: 52rpx;
            margin: 20rpx auto 0;
            &.disabled {
              pointer-events: none;
              background: #ccc;
              color: #fff;
              border-color: #ccc;
              cursor: not-allowed;
            }
          }
          &.disabled {
            color: #BBBBBB;
            .font3 {
              color: #BBBBBB;
            }
          }
          .shiyong {
            border: 2rpx solid var(--view-theme);
            background: none;
            color: var(--view-theme);
            border-radius: 26rpx;
            &.disabled {
              pointer-events: none;
              color: #ccc;
              border-color: #ccc;
              cursor: not-allowed;
              background: none;
            }
          }
        }
      }
    }
    .list:nth-child(1) {
      .right {
        &::after {
          background-color: var(--view-theme);
        }
      }
    }
  }
  .noCommodity {
    width: 100%;
    margin-top: 4rpx;
    background-color: #f5f5f5;
    .pictrue {
      margin: 0 auto;
    }
  }
</style>
