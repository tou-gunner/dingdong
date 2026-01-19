<template>
	<view :style="viewColor">
		<!-- 选择送货方式 -->
		<view class="mask-box">
			<view class="mask" catchtouchmove="true" :hidden='isShowDiscount==false' @tap='closeShowBox'></view>
			<view class="mask-content animated popup-main" :class="{slideInUp:isShowDiscount}">
				<view class="title font-500">
					优惠明细
					<view class="close iconfont icon-ic_close popup-close" @click="closeShowBox"></view>
				</view>
				<view class="box">
					<view class="check-item">
						<view>商品售价：</view>
						<view class="radio">
							¥{{couponData.total_price}}
						</view>
					</view>
					<view v-if="couponData.order_total_integral_price>0" class="check-item">
						<view>积分抵扣：</view>
						<view class="radio">
							-¥{{couponData.order_total_integral_price}}
						</view>
					</view>
					<view v-if="couponData.total_platform_coupon_price>0" class="check-item">
						<view>平台优惠金额：</view>
						<view class="radio">
							-¥{{ couponData.total_platform_coupon_price }}
						</view>
					</view>
					<view v-if="couponData.order_coupon_price>0" class="check-item">
						<view>店铺优惠金额：</view>
						<view class="radio">
							-¥{{ couponData.order_coupon_price }}
						</view>
					</view>
					<view v-if="couponData.order_svip_discount>0" class="check-item">
						<view>SVIP优惠金额：</view>
						<view class="radio">
							-¥{{ couponData.order_svip_discount }}
						</view>
					</view>
					<view v-if="couponData.total_coupon>0" class="check-item total font-bold">
						<view>共优惠：</view>
						<view class="radio">
							-¥{{ couponData.total_coupon}}
						</view>
					</view>
				</view>
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
	import { mapGetters } from "vuex";
	export default{
		name:'Discount',
		props:{
			isShowDiscount:{
				type:Boolean,
				default:false
			},
			couponData:{
				type:Object,
				default:function(){
					return {}
				}
			}
		},
		computed: mapGetters(['viewColor']),
		data(){
			return {}
		},
		created() {},
		methods:{
			// 关闭配送方式弹窗
			closeShowBox(){
				this.$emit('close')
			},
		}
	}
</script>

<style lang="scss">
	.mask-content{
		.title{
			padding: 40rpx 0;
			margin-bottom: 20rpx;
			.close{
				position: absolute;
				right: 20rpx;
				top: 20rpx;
			}
		}
		.box{
			padding: 0 30rpx 60rpx;
			.check-item{
				display: flex;
				align-items: center;
				justify-content: space-between;
				height: 40rpx;
				margin-bottom: 50rpx;
				font-size: 28rpx;
				.radio{
					color: #999;
				}
				&.total{
					font-size: 32rpx;
					.radio{
						color: var(--view-priceColor);
					}
				}
			}
		}
	}
	.animated {
		animation-duration: .3s
	}
</style>
