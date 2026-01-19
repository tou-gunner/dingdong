<template>
  <view>
    <view class="priceChange" :class="change === true ? 'on' : ''">
			<view class="change-count bg-f">
				<view class="priceTitle" :style="{ 'background-image': `url(${domain}/static/images/pricetitle.jpg)`}">
				  {{ status == 0 ? "一键改价" :  status == 1  ?   "订单备注" : "立即退款" }}
				</view>
				<view class="listChange" v-if="status == 0">
				  <view class="item acea-row row-between-wrapper">
				    <view>商品总价(元)</view>
				    <view class="money">
						<input
							type="digit"
							class="color_black"
							v-model="orderInfo.total_price"
							@input="setValue"
						/>
				    </view>
				  </view>
				  <view class="item acea-row row-between-wrapper">
				    <view>实际支付邮费(元)</view>
				    <view class="money">
						<input
							type="digit"
							class="color_black"
							v-model="orderInfo.pay_postage"
							@input="setValue"/>
				    </view>
				  </view>
				  <view class="item acea-row row-between-wrapper">
				    <view>实际支付金额(元)</view>
				    <view class="money">
						{{ Number(orderInfo.total_price) + Number(orderInfo.pay_postage) - Number(orderInfo.coupon_price) - Number(orderInfo.integral_price)- Number(orderInfo.svip_discount)}}<span class="iconfont icon-ic_lock"></span>
				    </view>
				  </view>
					<view v-if="orderInfo.coupon_price>0 || orderInfo.svip_discount>0" class="item acea-row row-between-wrapper">
						<view>优惠金额(元)</view>
						<view class="money">
						{{ Number(orderInfo.coupon_price) + Number(orderInfo.svip_discount) }}<span class="iconfont icon-ic_lock"></span>
						</view>
					</view>
					<view v-if="orderInfo.integral_price>0" class="item acea-row row-between-wrapper">
						<view>积分抵扣(元)</view>
						<view class="money">
						{{ orderInfo.integral_price }}<span class="iconfont icon-ic_lock"></span>
						</view>
					</view>
				</view>
				<view class="listChange" v-else>
				  <textarea
				    :placeholder="orderInfo.remark ? orderInfo.remark : '请填写备注信息...'"
				    v-model="remark"
				  ></textarea>
				</view>
				<view class="modify" @click="save">
				  {{ status == 0 ? "ແກ້ໄຂດຽວນີ້" : "ຢືນຢັນການສົ່ງ" }}
				</view>
			</view>
			<view class="close">
				<text class="iconfont icon-ic_close1" @click="close"></text>
			</view>
    </view>
    <view class="mask" @touchmove.prevent v-show="change === true"></view>
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
import { HTTP_REQUEST_URL } from '@/config/app';
export default {
  name: "PriceChange",
  components: {},
  props: {
    change: Boolean,
    orderInfo: Object,
    status: String
  },
  data: function() {
    return {
			domain: HTTP_REQUEST_URL,
      focus: false,
      price: 0,
			actual_price: 0,
      refund_price: 0,
      remark: ""
    };
  },
  watch: {
    orderInfo: function(nVal) {
      this.price = this.orderInfo.pay_price;
			this.actual_price = this.orderInfo.total_price + this.orderInfo.pay_postage - this.orderInfo.coupon_price
      this.refund_price = this.orderInfo.pay_price;
      this.remark = this.orderInfo.remark;
    }
  },
  mounted: function() {

	},
  methods: {
    priceChange: function() {
      this.focus = true;
    },
    close: function() {
      this.price = this.orderInfo.pay_price;
      this.$emit("closechange", false);
    },
		setValue: function(){
			this.price = this.orderInfo.total_price + this.orderInfo.pay_postage - this.orderInfo.coupon_price
		},
		save: function() {
			let that = this;
			that.$emit("savePrice", {
				price: that.price,
				refund_price: that.refund_price,
				type: 1,
				remark: that.remark,
				orderInfo: that.orderInfo
			});
		},
		refuse: function() {
			let that = this;
			that.$emit("savePrice", {
				price: that.price,
				refund_price: that.refund_price,
				type: 2,
				remark: that.remark
			});
		}
	}
};
</script>
<style>
.priceChange .listChange{padding:0 40upx;}
.priceChange .listChange textarea{box-sizing: border-box;}
.priceChange .listChange .item{height:103upx;border-bottom:1px solid #eeeeee;font-size:28upx;}
.priceChange .listChange .item .money{color:#ccc;width:200upx;text-align:right;}
.priceChange .listChange .item .money .color_black{color: #333;}
.priceChange .listChange .item .money .iconfont{font-size:32upx;margin-left:20upx;}
.priceChange .listChange .item .money input{width:100%;height:100%;text-align:right;color:#ccc;}
.priceChange .listChange .item .money input.on{color:#666;}
.priceChange .modify1{font-size:28upx;color:#312b2b;width:440upx;height:88upx;text-align:center;line-height:88upx;border-radius:50upx;background-color:#eee;margin:30upx auto 0 auto;}
</style>
