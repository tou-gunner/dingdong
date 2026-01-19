<template>
	<view class="order-details pos-order-details">
		<view class="header acea-row row-middle">
			<view class="state" v-if="orderInfo.status == 0">待审核</view>
			<view class="state" v-else-if="orderInfo.status == -1">审核未通过</view>
			<view class="state" v-else-if="orderInfo.status == 1">待退货</view>
			<view class="state" v-else-if="orderInfo.status == 2">待收货</view>
			<view class="state" v-else-if="orderInfo.status == 3">已退款</view>
			<view class="state" v-else-if="orderInfo.status == -2">已取消</view>
		</view>
		<view class="pad20">
			<view v-if="orderInfo.refund_type == 2 && orderInfo.status > 0" class="oder-user-info bg-f boder-24 mt20">
				<view v-if="orderInfo.refund_type == 2 && orderInfo.status > 0" class="orderingUser acea-row row-middle">
					<span class="iconfont icon-a-ic_user1"></span>{{ orderInfo.user && orderInfo.user.nickname }}
				</view>
				<view v-if="orderInfo.refund_type == 2 && orderInfo.status > 0" class="address">
					<view class="address-count">
						<view class="name">
							{{ orderInfo.mer_delivery_user }}<span class="phone">{{ orderInfo.phone }}</span>
						</view>
						<view>{{ orderInfo.mer_delivery_address }}</view>
					</view>
					<!-- #ifdef H5 -->
					<button class="copy copy-data" :data-clipboard-text="'收货人姓名：'+orderInfo.mer_delivery_user+'\n收货人电话：'+ orderInfo.phone+'\n收货人地址：'+orderInfo.mer_delivery_address">复制</button>
					<!-- #endif -->
					<!-- #ifdef MP -->
					<button class="copy" @tap="copyText">复制</button>
					<!-- #endif -->
				</view>
			</view>
			<view v-if="orderInfo.refund_type == 2 && orderInfo.status > 0" class="line">
				<image :src="`${domain}/static/images/line.jpg`" />
			</view>
			<view class="pos-order-goods bg-f boder-24">
				<navigator :url="`/pages/goods_details/index?id=${item.product.cart_info.product.product_id}`" hover-class="none" class="goods acea-row row-between-wrapper" v-for="(item, index) in orderInfo.refundProduct" :key="index">
					<view class="picTxt acea-row row-between-wrapper">
						<view class="pictrue">
							<image :src="item.product.cart_info.product.image || item.product.cart_info.product.image" />
						</view>

						<view class="text acea-row row-between row-column">
							<view class="info line2">
								{{ item.product.cart_info.product.store_name }}
							</view>
							<view class="attr">{{ item.product.cart_info.productAttr.sku || '默认' }}</view>
						</view>
					</view>
					<view class="money">
						<view class="x-money">
							<priceFormat :price="item.product.cart_info.productAttr.price" weight intSize="32" floatSize="22" labelSize="22"></priceFormat>
						</view>
						<view class="num">x{{ item.refund_num }}</view>

					</view>
				</navigator>
			</view>
			<view class="wrapper bg-f boder-24 mt20">
				<view class="item acea-row row-between">
					<view>退款单编号：</view>
					<view class="conter acea-row row-middle row-right">
						{{ orderInfo.refund_order_sn }}
						<!-- #ifdef H5 -->
						<button class="copy copy-data" :data-clipboard-text="orderInfo.refund_order_sn">复制</button>
						<!-- #endif -->
						<!-- #ifdef MP -->
						<span class="copy copy-data" @click="copyNum(orderInfo.refund_order_sn)">复制</span>
						<!-- #endif -->
					</view>
				</view>
				<view class="item acea-row row-between">
					<view>退款金额：</view>
					<view class="conter">{{ orderInfo.refund_price }}</view>
				</view>
				<view class="item acea-row row-between">
					<view>申请件数：</view>
					<view class="conter">{{ orderInfo.refund_num }}</view>
				</view>
				<view class="item acea-row row-between">
					<view>申请时间：</view>
					<view class="conter">{{ orderInfo.create_time }}</view>
				</view>
				<view class="item acea-row row-between">
					<view>退款原因：</view>
					<view class="conter">{{ orderInfo.refund_message }}</view>
				</view>
				<view class="item acea-row row-between">
					<view>备注信息：</view>
					<view class="conter">{{ orderInfo.mark }}</view>
				</view>
				<view class="item acea-row row-between">
					<view>商家备注：</view>
					<view class="conter">{{ orderInfo.mer_mark }}</view>
				</view>
				<view class="item">
					<view>退款凭证：</view>
					<view class="upload-img">
						<view class="img-item" v-for="(item,index) in orderInfo.pics" :key="index">
							<image :src="item" mode="" @click="loookImg(item,index)"></image>
						</view>
					</view>
				</view>
			</view>
			<view style="height:120upx;"></view>
			<view class="footer acea-row row-right row-middle" v-if="goname != 'looks'">
				<view class="more"></view>
				<view class="bnt cancel" @click="modify('1')">订单备注</view>
				<navigator class="bnt cancel" v-if="orderInfo.status == 2" :url="'/pages/users/goods_logistics/index?refundId='+orderInfo.refund_order_id+'&merId='+mer_id">查看物流</navigator>
				<view class="bnt delivery" v-if="orderInfo.status == 2" @click="confirmOrder">确认收货</view>
			</view>
			<view>
			  <view class="priceChange" :class="change === true ? 'on' : ''">
			    <view class="change-count bg-f">
						<view class="priceTitle" :style="{ 'background-image': `url(${domain}/static/images/pricetitle.jpg)`}">
						 订单备注
						</view>
						<view class="listChange">
						  <textarea
						    placeholder="请填写备注信息..."
						    v-model="orderInfo.mer_mark"
						  ></textarea>
						</view>
						<view class="modify" @click="save">
						  确认提交
						</view>
					</view>
					<view class="close">
						<text class="iconfont icon-ic_close1" @click="changeclose"></text>
					</view>
			  </view>
			  <view class="mask" @touchmove.prevent v-show="change === true"></view>
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

	// #ifdef H5
	import ClipboardJS from "@/plugin/clipboard/clipboard.js";
	// #endif
	import {
		getRefundOrderDetail,
		refundOrderReceive,
		setRefundMark
	} from "@/api/admin";
	import { isMoney } from '@/utils/validate.js'
	import { HTTP_REQUEST_URL } from '@/config/app';
	export default {
		name: "AdminOrder",
		components: {
		},
		props: {},
		data: function() {
			return {
				order: false,
				change: false,
				order_id: "",
				mer_id: '',
				mer_mark: '',
				orderInfo: {
					_status: {},
					user: {}
				},
				status: "",
				title: "",
				payType: "",
				types: "",
				clickNum: 1,
				goname:'',
				domain: HTTP_REQUEST_URL,
			};
		},
		watch: {
			"$route.params.oid": function(newVal) {
				let that = this;
				if (newVal != undefined) {
					that.order_id = newVal;
					that.getIndex();
				}
			}
		},
		onLoad: function(option) {
			let self = this
			this.order_id = option.id
			this.mer_id = option.mer_id
			this.goname = option.goname
			this.getIndex();
			// #ifdef H5
			this.$nextTick(function() {
				var clipboard = new ClipboardJS('.copy-data');
				clipboard.on('success', function(e) {
					self.$util.Tips({
						title:'复制成功'
					})
				});
				clipboard.on('error', function(e) {
					self.$util.Tips({
						title:'复制失败'
					})
				});
			});
			// #endif

		},
		methods: {
			more: function() {
				this.order = !this.order;
			},
			modify: function(status) {
				this.change = true;
				this.status = status;
			},
			changeclose: function(msg) {
				this.change = false;
			},
			//  查看大图
			loookImg(item,index){
				uni.previewImage({
					urls: this.orderInfo.pics,
					current: this.orderInfo.pics[index]
				});
			},
			// 图片预览
			getPhotoClickIdx(list, idx) {
				uni.previewImage({
					current: list[idx], //  传 Number H5端出现不兼容
					urls: list
				});
			},
			copyText: function (e) {
			    // var copy = e.currentTarget.dataset.copy;  //data-copy传过来的数值
			    let arr = [
			      {
			        name: "收货人姓名",
			        value: this.orderInfo.real_name
			      },
			      {
			        name: "收货人电话",
			        value: this.orderInfo.user_phone
			      },
			      {
			        name: "收货人地址",
			        value: this.orderInfo.user_address
			      }
			    ]
			    wx.setClipboardData({
			      data: `${arr.map(item =>`${item.name}: ${item.value}`).join("\n")}`,
			      success: function (res) {
			        wx.getClipboardData({
			          success: function (res) {
			            wx.showToast({
			              title: '复制成功'
			            })
			          }
			        })
			      }
			    })
			},
			getIndex: function() {
				let that = this;
				getRefundOrderDetail(that.mer_id,that.order_id).then(
					res => {
						that.orderInfo = res.data;
					},
					err => {
						that.$util.Tips({
							title: err
						}, {
							tab: 3,
							url: 1
						});
					}
				);
			},
			// 确认收货
			confirmOrder: function() {
				let that = this;
				uni.showModal({
					title: '确认收货',
					content: '为保障权益，请收到货确认无误后，再确认收货',
					success: function(res) {
						if (res.confirm) {
							refundOrderReceive(that.mer_id,that.orderInfo.refund_order_id).then(res => {
								return that.$util.Tips({
									title: '操作成功',
									icon: 'success'
								}, function() {
									that.getIndex()
								});
							}).catch(err => {
								return that.$util.Tips({
									title: err
								});
							})
						}
					}
				})
			},
			// 提交备注信息
			save(){
				let that = this;
				if (!that.orderInfo.mer_mark) {
					return this.$util.Tips({
						title: '请输入备注'
					})
				}
				setRefundMark(that.mer_id,that.orderInfo.refund_order_id,{ mer_mark: that.orderInfo.mer_mark }).then(
					res => {
						that.change = false;
						this.$util.Tips({
							title: res.message,
							icon: 'success'
						})
					},
					err => {
						that.change = false;
						that.$util.Tips({
							title: err
						});
					}
				);
			},
			// #ifdef MP
			copyNum(id) {
				uni.setClipboardData({
					data: id,
					success: function() {
						console.log('success');
					}
				});
			},
			copyData(id){
				uni.setClipboardData({
					data: id,
					success: function() {
						console.log('success');
					}
				});
			},
			// #endif
			// #ifdef H5
			webCopy(item, index) {
				let items = item
				let indexs = index
				let self = this
				if (self.clickNum == 1) {
					self.clickNum += 1
					self.webCopy(items, indexs)
				}
			}
			// #endif
		}
	};
</script>

<style lang="scss">
	.pos-order-details .header {
		background: linear-gradient(to right, #2291f8 0%, #1cd1dc 100%);
		background: -webkit-linear-gradient(to right, #2291f8 0%, #1cd1dc 100%);
		background: -moz-linear-gradient(to right, #2291f8 0%, #1cd1dc 100%);
	}
	.pos-order-details .header .state {
		font-size: 36upx;
		color: #fff;
	}
	.pos-order-details .oder-user-info {
		padding: 20rpx 30rpx 32rpx;
	}
	.pos-order-details .orderingUser {
		padding-bottom: 20rpx;
		border-bottom: 1px solid #EEEEEE;
	}
	.pos-order-details .orderingUser .iconfont {
		font-size: 40upx;
		margin-right: 15upx;
	}
	.pos-order-details .pos-order-goods {
		margin-top: 17upx;
	}
	.pos-order-details .footer .more {
		font-size: 27upx;
		color: #aaa;
		width: 100upx;
		height: 64upx;
		text-align: center;
		line-height: 64upx;
		margin-right: 25upx;
		position: relative;
	}
	.pos-order-details .footer .delivery {
		background: linear-gradient(to right, #2291f8 0%, #1cd1dc 100%);
		background: -webkit-linear-gradient(to right, #2291f8 0%, #1cd1dc 100%);
		background: -moz-linear-gradient(to right, #2291f8 0%, #1cd1dc 100%);
	}
	.order-details .header {
		padding: 0 30upx;
		height: 150upx;
	}
	.order-details .address {
		font-size: 26rpx;
		color: #999;
		padding-top: 36rpx;
		position: relative;
	}
	.address-count{
		max-width: 600rpx;
	}
	.order-details .address .name {
		font-size: 30rpx;
		color: #282828;
		margin-bottom: 16rpx;
	}
	.order-details .address .name .phone {
		margin-left: 40rpx;
	}
	.order-details .line {
		width: 670rpx;
		height: 3rpx;
		position: relative;
		left: 15rpx;
	}
	.order-details .line image {
		width: 100%;
		height: 100%;
		display: block;
	}
	.order-details .wrapper {
		padding: 30rpx;
	}
	.order-details .wrapper .item {
		font-size: 28rpx;
		color: #282828;
	}
	.order-details .wrapper .item~.item {
		margin-top: 26rpx;
	}
	.order-details .wrapper .item .conter {
		color: #999;
		text-align: right;
	}
	.order-details .wrapper .item .conter .copy {
		margin-left: 24rpx;
	}
	.address .copy{
		font-size: 20rpx;
		color: #999;
		border-radius: 3rpx;
		border: 1px solid #999;
		padding: 0rpx 15rpx;
		height: 40rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 16rpx;
		position: absolute;
		right: 0;
		top: 20rpx;
	}
	.order-details .footer {
		width: 100%;
		height: 100rpx;
		height: calc(100rpx+ constant(safe-area-inset-bottom)); ///兼容 IOS<11.2/
		height: calc(100rpx + env(safe-area-inset-bottom)); ///兼容 IOS>11.2/
		position: fixed;
		bottom: 0;
		left: 0;
		background-color: #fff;
		padding: 0 30rpx;
		border-top: 1px solid #eee;
	}
	.order-details .footer .bnt {
		width: 160rpx;
		height: 60rpx;
		line-height: 60rpx;
		text-align: center;
		line-height: upx;
		border-radius: 50rpx;
		color: #fff;
		font-size: 24rpx;
	}
	.order-details .footer .bnt.cancel {
		color: #666;
		border: 1px solid #ddd;
	}
	.order-details .footer .bnt.default {
		color: #444;
		border: 1px solid #444;
	}
	.order-details .footer .bnt~.bnt {
		margin-left: 18upx;
	}
	.pos-order-goods {
		padding: 30rpx;
		position: relative;
	}
	.pos-order-goods .goods {
		overflow: hidden;
		margin-bottom: 40rpx;
		&:last-child{
			margin-bottom: 0;
		}
	}
	.pos-order-goods .goods .picTxt {
		width: 480rpx;
	}
	.pos-order-goods .goods .picTxt .pictrue {
		width: 130rpx;
		height: 130rpx;
	}
	.pos-order-goods .goods .picTxt .pictrue image {
		width: 100%;
		height: 100%;
		border-radius: 16rpx;
	}
	.pos-order-goods .goods .picTxt .text {
		width: 320rpx;
		height: 130rpx;
	}
	.pos-order-goods .goods .picTxt .text .info {
		font-size: 28rpx;
	}
	.pos-order-goods .goods .picTxt .text .attr {
		font-size: 20rpx;
		color: #999;
	}
	.pos-order-goods .goods .money {
		width: 154rpx;
		text-align: right;
		font-size: 28rpx;
	}
	.pos-order-goods .goods .money .refund_num{
		display: inline-block;
		margin-left: 10rpx;
	}
	.pos-order-goods .goods .money .x-money {
		color: #282828;
	}
	.pos-order-goods .goods .money .num {
		color: #ff9600;
		margin: 5rpx 0;
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
</style>
