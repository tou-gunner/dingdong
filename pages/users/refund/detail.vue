<template>
	<view class="refund-detail" :style="viewColor">
		<view class="head">
			<block v-if="type == -1">
				<view class="txt">退款失败</view>
				<view class="time">申请时间：{{detail.status_time}}</view>
			</block>
			<block v-if="type == 0">
				<view class="txt">审核中</view>
				<view class="time">申请时间：{{detail.status_time}}</view>
			</block>
			<block v-if="type == 1">
				<view class="txt">请退货并填写物流信息</view>
				<view class="time">申请时间：{{detail.status_time}}</view>
			</block>
			<block v-if="type == 2">
				<view class="txt">请等待商家收货并退款</view>
				<view class="time">还剩：
				<countDown :is-day="true" :tip-text="' '" :day-text="'天'" :hour-text="':'" :minute-text="':'" :second-text="' '"
				 :datatime="datatime"></countDown>
				</view>
			</block>
			<block v-if="type == 3">
				<view class="txt">退款成功，金额 ¥{{detail.refund_price}}</view>
				<view class="time">申请时间：{{detail.status_time}}</view>
			</block>
			<block v-if="type == -2">
				<view class="txt">已取消退货申请</view>
				<view class="time">申请时间：{{detail.status_time}}</view>
			</block>
			<block v-if="type == 4">
				<view class="txt">已申请平台介入</view>
				<view class="time">申请时间：{{detail.status_time}}</view>
			</block>
		</view>
		<view class="pad20">
			<!-- 商户拒绝原因 -->
			<view class="box bg-f boder-24" v-if="type == -1 && detail.fail_message">
				<view class="txt">商户拒绝退款原因</view>
				<view class="des">{{detail.fail_message}}</view>
			</view>
			<!-- 平台拒绝原因 -->
			<view class="box bg-f boder-24" v-if="type == -1 && detail.platform_msg">
				<view class="txt">平台拒绝退款原因</view>
				<view class="des">{{detail.platform_msg}}</view>
			</view>
			<!-- 待退货 -->
			<view class="info-box bg-f boder-24 mt20" v-if="type == 1">
				<view class="title">商家已同意您的退货申请，请尽早退货</view>
				<view class="store-info">
					<view class="text">收货人姓名：<text class="info">{{detail.mer_delivery_user}}</text></view>
					<view class="text">收货人联系方式：<text class="info">{{detail.phone}}</text></view>
					<view class="text">收货人地址：<text class="info">{{detail.mer_delivery_address}}</text></view>
					<view class="red-txt">
						<text class="iconfont icon-icon_tip"></text>请按以上收货信息将商品退回
					</view>
				</view>
			</view>
			<!-- 待收货 -->
			<view class="info-box bg-f boder-24 mt20" v-if="type == 2">
				<view class="title">商家收货并验货无误，将操作退款给您</view>
				<view class="store-info">
					<view class="text">收货人姓名：<text class="info">{{detail.mer_delivery_user}}</text></view>
					<view class="text">收货人联系方式：<text class="info">{{detail.phone}}</text></view>
					<view class="text">收货人地址：<text class="des">{{detail.mer_delivery_address}}</text></view>
				</view>
			</view>
			<view class='line' v-if="type == 1 || type == $attrs">
				<image :src="`${imgUrl}/static/images/line.jpg`"></image>
			</view>
			<view class="info-box bg-f boder-24 mt20">
				<view class="title">退款信息</view>
				<view class="product-box">
					<view class="product-item acea-row row-between" v-for="(item,index) in detail.refundProduct" :key="index">
						<image class="img-box" :src="item.product.cart_info.productAttr.image" mode="" v-if="item.product.cart_info.productAttr.image"></image>
						<image class="img-box" :src="item.product.cart_info.product.image" mode="" v-else></image>
						<view class="msg acea-row row-between">
							<view class="name-count">
								<view class="name line1"><text v-if="item.product.cart_info.product_type === 2" class="event_name event_bg">预售</text>{{item.product.cart_info.product.store_name}}</view>
								<view class="des">{{item.product.cart_info.productAttr.sku}}</view>
							</view>
							<view class="price-count">
								<view class="price">
									<priceFormat :price="item.product.product_type == 3 ? item.product.cart_info.productAssistAttr.assist_price : item.product.product_type == 4 ? item.product.cart_info.activeSku.active_price : item.product.cart_info.productAttr.price" weight intSize="28" floatSize="20" labelSize="20"></priceFormat>
								</view>
								<view class="num">x {{item.refund_num}}</view>
							</view>
						</view>
					</view>
				</view>
			</view>

			<view class="content mt20 bg-f boder-24">
				<view class="item">
					<view class="label">订单编号：</view>
					<view class="txt flex">
						<text>{{detail.refund_order_sn}}</text>
						<!-- #ifdef H5 -->
							<text class='copy copy-data' :data-clipboard-text="detail.refund_order_sn">复制</text>
						<!-- #endif -->
						<!-- #ifdef MP -->
							<text class='copy' @tap='copy'>复制</text>
						<!-- #endif -->
					</view>
				</view>
				<view class="item">
					<view class="label">退款金额：</view>
					<view class="txt flex">
						<text>¥ {{detail.refund_price}}</text>
					</view>
				</view>
				<view class="item">
					<view class="label">申请件数：</view>
					<view class="txt flex">
						<text>{{detail.refund_num}}</text>
					</view>
				</view>
				<view class="item">
					<view class="label">申请时间：</view>
					<view class="txt flex">
						<text>{{detail.create_time}}</text>
					</view>
				</view>
				<view class="item">
					<view class="label">备注说明：</view>
					<view class="txt flex">
						<text>{{detail.mark ? detail.mark : ""}}</text>
					</view>
				</view>
				<view class="item">
					<view class="label">商家备注：</view>
					<view class="txt flex">
						<text>{{detail.mer_mark ? detail.mer_mark : ""}}</text>
					</view>
				</view>
				<view class="item" style="display: block;">
					<view class="label">退款凭证：</view>
					<view class="upload-img">
						<view class="img-item" v-for="(item,index) in detail.pics" :key="index">
							<image :src="item" mode="" @click="loookImg(item,index)"></image>
						</view>
					</view>
				</view>
				<view class="btn-wrapper">
					<block v-if="detail.platform">
						<view class="btn" @click="plantform(detail.refund_order_id)">平台介入</view>
					</block>
					<block v-else-if="type==1">
						<view class="btn gray" @click="cancelSales">取消售后</view>
						<view class="btn" @click="goPage">退回商品</view>
					</block>
					<block v-else-if="type==-1">
						<view class="btn" @click="applyAgain(detail)">再次申请</view>
					</block>
					<block v-else-if="type==2">
						<view class="btn" @click="go">查看物流</view>
					</block>
					<block v-else-if="type==0">
						<view class="btn gray" @click="cancelSales">取消售后</view>
					</block>
					<block v-if="detail.merchant">
						<view class="btn" @click="goService">联系商家</view>
					</block>
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
	import { refundDetail, refundCancelApi, platformIntervention } from '@/api/order.js'
	import ClipboardJS from "@/plugin/clipboard/clipboard.js";
	import countDown from '@/components/countDown'
	import { HTTP_REQUEST_URL } from '@/config/app';
	import { mapGetters } from "vuex";
	import { getCustomer } from '@/utils'
	export default{
		components: {
			countDown,
		},
		computed:{
			...mapGetters(['viewColor']),
		},
		data(){
			return{
				type:0,
				refund_order_id:0,
				detail:'',
				datatime: 0,
				imgUrl:HTTP_REQUEST_URL,
			}
		},
		onLoad(options) {
			uni.setNavigationBarTitle({
			　　title:'退款详情'
			})
			this.refund_order_id = options.id
			this.getDetail()
		},
		onReady: function() {
			// #ifdef H5
			this.$nextTick(function() {
				const clipboard = new ClipboardJS(".copy-data");
				clipboard.on("success", () => {
					this.$util.Tips({
						title: '复制成功'
					});
				});
			});
			// #endif
		},
		methods:{
			//联系客服拨打电话
			call: function(service){
				let that = this;
				if(service){
					uni.showModal({
						title: '提示',
						content: '暂无在线客服，确定拨打客服电话:'+that.detail.merchant.service_phone+'吗？',
						success: function(res) {
							if (res.confirm) {
								uni.makePhoneCall({
								  phoneNumber: that.detail.merchant.service_phone,
								});
							}
						}
					})
				}else{
					return that.$util.Tips({
						title: '暂无可用客服'
					})
				}
			},
			//查看大图
			loookImg(item,index){
				uni.previewImage({
					urls: this.detail.pics,
					current: this.detail.pics[index]
				});
			},
			getDetail(){
				refundDetail(this.refund_order_id).then(res=>{
					// status 0审核中 1待发货 2待收货 3已退款 -1已拒绝
					this.type = res.data.status
					this.detail = res.data
					this.datatime = res.data.auto_refund_time;
				})
			},
			goPage(){
				uni.navigateTo({
					url:'/pages/users/refund/goods/index?id='+this.detail.refund_order_id
				})
			},
			applyAgain(item){
				uni.navigateTo({
					url:`/pages/order_details/index?order_id=${item.refundProduct[0].product.order_id}`
				})
			},
			go(){
				uni.navigateTo({
					url:`/pages/users/refund/logistics?orderId=${this.detail.refund_order_id}`
				})
			},
			/**
			 *
			 * 剪切订单号
			 */
			// #ifndef H5
			copy: function() {
				let that = this;
				uni.setClipboardData({
					data: this.detail.refund_order_sn
				});
			},
			// #endif
			// 客服
			goService(){
				let mer = this.detail.merchant.services_type
				let url = `/pages/chat/customer_list/chat?mer_id=${this.detail.mer_id}&uid=${this.detail.uid}&refund_order_id=${this.detail.refund_order_id}`
				let data = {
					type: mer.services_type,
					service_phone: mer.service_phone,
					customer_url: mer.mer_customer_url,
					customer_corpId: mer.mer_customer_corpId,
					customer_link: mer.mer_customer_link
				}
				getCustomer(data, url)
			},
			// 平台介入
			plantform(id) {
				let that = this;
				uni.showModal({
				  content: '确定要平台介入吗？',
				  success: function(res) {
				    if(res.confirm) {
				      platformIntervention(id).then(res => {
				      	if (res.status === 200) {
				      		that.$util.Tips({
				      			title: res.message
				      		});
									that.getDetail();
								}
				      }).catch((err)=>{
								that.$util.Tips({
									title: err
								});
							})
				    } else if(res.cancel) {
				      console.log('用户点击取消');
				    }
				  }
				});

			},
			// 取消售后
			cancelSales(){
				let that = this;
				uni.showModal({
				  content: '确定要取消售后？',
				  success: function(res) {
				    if(res.confirm) {
				      refundCancelApi(that.detail.refund_order_id).then(res => {
				      	if (res.status === 200) {
				      		that.$util.Tips({
				      			title: res.message
				      		});
									that.getDetail();
								}
				      })
				    } else if(res.cancel) {
				      console.log('用户点击取消');
				    }
				  }
				});
			},
		}
	}
</script>

<style lang="scss">
.refund-detail{
	.head{
		display: flex;
		flex-direction: column;
		justify-content: center;
		height: 150rpx;
		padding: 0 30rpx;
		color: #fff;
		background-color: #666666;
		font-size: 30rpx;
		.txt{
			font-weight: bold;
		}
		.time{
			margin-top: 10rpx;
			font-size: 24rpx;
			opacity: .8;
			.time{
				display: inline-block;
				width: 600rpx;
				::v-deep  .red{
					color: #fff;
				}
			}
		}
	}
	.info-box{
		.title{
			padding: 0 32rpx;
			line-height: 86rpx;
			color: #282828;
		}
		.product-box{
			.product-item{
				display: flex;
				padding: 25rpx 30rpx;
				.img-box{
					width:130rpx;
					height:130rpx;
					border-radius:16rpx;
				}
				.msg{
					position: relative;
					width: 500rpx;
					.name-count {
						width: 380rpx;
						.name{
							font-size: 28rpx;
							color: #282828;
						}
					}
					.price-count{
						width: 100rpx;
						text-align: right;
					}
					.des{
						font-size: 20rpx;
						color: #999999;
						margin-top: 16rpx;
					}
					.price{
						color: var(--view-priceColor);
					}
					.num{
						color: #999999;
						font-size: 22rpx;
						margin-top: 10rpx;
					}
				}
			}
			.event_name{
				display: inline-block;
				margin-right: 9rpx;
				color: #fff;
				font-size: 20rpx;
				padding: 0 8rpx;
				line-height: 30rpx;
				text-align: center;
				border-radius: 6rpx;
			}
		}
		.event_bg{
			background: #FF7F00;
		}
		.store-info{
			padding: 0 30rpx 30rpx;
			.text{
				margin-top: 10rpx;
			}
			.des{
				margin-top: 10rpx;
				font-size: 26rpx;
				color: #999999;
			}
			.red-txt{
				display: flex;
				align-items: center;
				margin-top: 10rpx;
				color: $theme-color;
				font-size: 24rpx;
				.iconfont{
					font-size: 30rpx;
					margin-right: 5rpx;
					margin-top: 6rpx;
				}
			}
		}
	}
	.line {
		width: 670rpx;
		height: 3upx;
		margin-left: 15rpx;
	}
	.line image {
		width: 100%;
		height: 100%;
		display: block;
	}
	.content{
		padding: 30rpx 30rpx 0;
		.item{
			display: flex;
			justify-content: space-between;
			margin-bottom: 30rpx;
			.txt{
				justify-content: flex-end;
				align-items: center;
				width: 450rpx;
				color: #999999;
				text-align: right;
				.copy{
					display: flex;
					align-items: center;
					justify-content: center;
					width:76rpx;
					height:34rpx;
					border:2rpx solid #ddd;
					border-radius:18rpx;
					font-size: 20rpx;
					color: #666;
					margin-left: 6rpx;
				}
			}
			&:last-child{
				margin-bottom: 0;
			}
			.upload-img{
				display: flex;
				flex-wrap: wrap;
				margin-top: 20rpx;
				.img-item{
					position: relative;
					width: 156rpx;
					height: 156rpx;
					margin-right: 23rpx;
					margin-top: 20rpx;
					&:nth-child(4n){
						margin-right: 0;
					}
					image{
						width: 156rpx;
						height: 156rpx;
						border-radius: 8rpx;
					}
				}
			}
		}
		.btn-wrapper{
			position: relative;
			display: flex;
			justify-content: flex-end;
			align-items: center;
			height: 100rpx;
			button{
				font-size: 28rpx;
			}
			.btn{
				width:160rpx;
				height:60rpx;
				line-height: 60rpx;
				text-align: center;
				margin-left: 20rpx;
				background: var(--view-theme);
				border-radius: 50rpx;
				color: #fff;
				font-size: 24rpx;
			}
			.gray{
				background: transparent;
				border: 1px solid #ddd;
				color: #666666;
			}
		}
	}
	.box{
		margin-top: 20rpx;
		padding:25rpx 30rpx;
		font-size: 30rpx;
		color: #282828;
		.des{
			margin-top: 5rpx;
			font-size: 26rpx;
			color: #999999;
		}
	}
}
::v-deep .styleAll{
	color: #fff;
}
</style>
