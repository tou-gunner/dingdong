<template>
  <view>
    <view class="order-index" ref="container">
      <view class="header acea-row" :style="{ 'background-image': `url(${domain}/static/images/order_header.png)`}">
        <navigator class="item" :url="`/pages/admin/orderList/index?types=1&merId=${mer_id}`" hover-class="none">
          <view class="num">{{ census.unpaid }}</view>
          <view>待付款</view>
        </navigator>
        <navigator class="item" :url="`/pages/admin/orderList/index?types=2&merId=${mer_id}`" hover-class="none">
          <view class="num">{{ census.unshipped }}</view>
          <view>待发货</view>
        </navigator>
        <navigator class="item" :url="`/pages/admin/orderList/index?types=3&merId=${mer_id}`" hover-class="none">
          <view class="num">{{ census.untake }}</view>
          <view>待收货</view>
        </navigator>
        <navigator class="item" :url="`/pages/admin/orderList/index?types=4&merId=${mer_id}`" hover-class="none">
          <view class="num">{{ census.unevaluate }}</view>
          <view>待评价</view>
        </navigator>
        <navigator class="item" :url="`/pages/admin/orderList/index?types=6&merId=${mer_id}`" hover-class="none">
          <view class="num">{{ census.refund }}</view>
          <view>退款</view>
        </navigator>
      </view>
      <view class="wrapper bg-f boder-24">
        <view class="title">
          <span class="iconfont icon-icon_statistics"></span>数据统计
        </view>
        <view class="list acea-row" v-if="orderData">
          <navigator class="item" :url="`/pages/admin/statistics/index?type=price&time=today&merId=${mer_id}`" hover-class="none">
            <view class="num">{{ orderData.today.payPrice }}</view>
            <view>今日成交额</view>
          </navigator>
          <navigator class="item" :url="`/pages/admin/statistics/index?type=price&time=yesterday&merId=${mer_id}`" hover-class="none">
            <view class="num">{{ orderData.yesterday.payPrice }}</view>
            <view>昨日成交额</view>
          </navigator>
          <navigator class="item" :url="`/pages/admin/statistics/index?type=price&time=month&merId=${mer_id}`" hover-class="none">
            <view class="num">{{ orderData.month.payPrice  }}</view>
            <view>本月成交额</view>
          </navigator>
          <navigator class="item" :url="`/pages/admin/statistics/index?type=order&time=today&merId=${mer_id}`" hover-class="none">
            <view class="num">{{ orderData.today.orderNum}}</view>
            <view>今日订单数</view>
          </navigator>
          <navigator class="item" :url="`/pages/admin/statistics/index?type=order&time=yesterday&merId=${mer_id}`" hover-class="none">
            <view class="num">{{ orderData.yesterday.orderNum }}</view>
            <view>昨日订单数</view>
          </navigator>
          <navigator class="item" :url="`/pages/admin/statistics/index?type=order&time=month&merId=${mer_id}`" hover-class="none">
            <view class="num">{{ orderData.month.orderNum}}</view>
            <view>本月订单数</view>
          </navigator>
        </view>
      </view>
      <view class="public-wrapper bg-f boder-24">
        <view class="title">
          <span class="iconfont icon-icon_date"></span>详细数据
        </view>
        <view class="nav acea-row row-between-wrapper">
          <view class="data">日期</view>
          <view class="browse">订单数</view>
          <view class="turnover">成交额</view>
        </view>
        <view class="conter">
          <view class="item acea-row row-between-wrapper" v-for="(item, index) in list" :key="index">
            <view class="data">{{ item.pay_time.slice(0, 10) }}</view>
            <view class="browse">{{ item.total }}</view>
            <view class="turnover">{{ item.pay_price }}</view>
          </view>
        </view>
      </view>
      <Loading :loaded="loaded" :loading="loading"></Loading>
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
import {
  getStatisticsInfo,
  getStatisticsMonth,
  orderStatistics,
  orderPrice
} from "@/api/admin";
import Loading from '@/components/Loading/index.vue'
import { HTTP_REQUEST_URL } from '@/config/app';
export default {
  name: 'adminOrder',
  components: {
    Loading
  },
  data() {
    return {
			domain: HTTP_REQUEST_URL,
      census: {},
      orderData: {
        today: {},
        yesterday: {},
        month: {}
      },
      list: [],
      where: {
        page: 1,
        limit: 15
      },
      loaded: false,
      loading: false,
      mer_id: '',
    }
  },
  onLoad(options) {
	  this.mer_id = options.mer_id
	  this.getOrderStatistics(this.mer_id);
	  this.getList(this.mer_id)
  },
  methods: {
    getIndex: function() {
      var that = this;
      getStatisticsInfo().then(
        res => {
          that.census = res.data;
        },
        err => {
          that.$util.Tips({
            title: err.message
          })
        }
      );
    },
    getList: function(mer_id) {
      var that = this;
      if(that.loading || that.loaded) return;
      that.loading = true;
      orderPrice(that.where, mer_id).then(
        res => {
          that.loading = false;
          that.loaded = res.data.length < that.where.limit;
          that.list.push.apply(that.list, res.data);
          that.where.page = that.where.page + 1;
        },
        error => {
          that.$util.Tips({
            title: error.msg
          })
        },
        300
      );
    },
    getOrderStatistics: function(mer_id) {
      let that = this;
      orderStatistics(mer_id).then(
        res => {
          that.census = res.data.order;
          that.orderData = res.data.data;
        },
        err => {
          that.$util.Tips({
            title: err.message
          })
        }
      );
    }
  },
  onReachBottom() {
    this.getList(this.mer_id)
  }
}
</script>

<style lang="scss" scoped>
/*订单首页*/
.order-index .header {
  background-size: 100% 100%;
  width: 100%;
  height: 280upx;
  padding: 40upx 3upx 0 3upx;
  box-sizing: border-box;
}
.order-index .header .item {
  flex: 1;
  -webkit-flex: 1;
  -o-flex: 1;
  -ms-flex: 1;
  text-align: center;
  font-size: 24upx;
  color: #fff;
}
.order-index .header .item .num {
  font-size: 40upx;
  margin-bottom: 7upx;
  height: 60rpx;
}
.order-index .wrapper {
  width: 690upx;
  margin: -115upx auto 0 auto;
  padding-top: 25upx;
}
.order-index .wrapper .title,.public-wrapper .title {
  font-size: 30rpx;
	font-weight: bold;
  padding: 0 30rpx;
  margin-bottom: 40rpx;
}
.order-index .wrapper .title .iconfont {
  color: #2291F8;
  font-size: 40upx;
  margin-right: 13upx;
  vertical-align: middle;
}
.order-index .wrapper .list .item {
  width: 33.33%;
  text-align: center;
  font-size: 24upx;
  color: #999;
  margin-bottom: 45upx;
}
.order-index .wrapper .list .item .num {
  font-size: 40rpx;
	font-weight: bold;
	color: #282828;
	margin-bottom: 4rpx;
}
.public-wrapper .title .iconfont {
  color: #2291f8;
  font-size: 40upx;
  margin-right: 13upx;
  vertical-align: middle;
}
.public-wrapper {
  margin: 18upx auto 0 auto;
  width: 690upx;
  padding-top: 25upx;
}
.public-wrapper .nav {
  padding: 0 30upx;
  height: 70upx;
  line-height: 70upx;
  font-size: 24upx;
  color: #999;
}
.public-wrapper .data {
  width: 280rpx;
  text-align: left;
}
.public-wrapper .browse {
  width: 122rpx;
}
.public-wrapper .turnover {
  width: 227rpx;
  text-align: right;
}
.public-wrapper .conter {
  padding: 0 30rpx;
}
.public-wrapper .conter .item {
  border-bottom: 1px solid #f7f7f7;
  height: 70rpx;
  font-size: 24rpx;
}
.public-wrapper .conter .item .turnover {
  color: #d84242;
}
</style>
