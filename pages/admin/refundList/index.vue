<template>
	<view>
		<view v-if="orderList.length > 0">
			<view class='refund'>
				<view>
					<view class='list'>
						<view class='item acea-row row-between-wrapper'>
							<view v-for="goods in orderList" :key="goods.cart_id" class='picTxt acea-row'>
								<view v-if="goods.refund_num > 0" class="checkbox"  @click.stop="goodsCheck(goods)">
									<text v-if="goods.check" class="iconfont icon-xuanzhong1"></text>
									<text v-else class="iconfont icon-ic_unselect"></text>
								</view>
								<view v-else class="checkbox">
									<text class="iconfont icon-ic_unselect disabled"></text>
								</view>
								<view class='pictrue'>
									<image :src='goods.cart_info.product.image'></image>
								</view>
								<view class='text'>
									<view class='line1 name'>{{goods.cart_info.product.store_name}}</view>
									<view class="attr line1">{{ goods.cart_info.productAttr.sku }}</view>
									<view class="refund_bom acea-row row-between">
										<view class='money acea-row row-middle'>
											<text>¥{{goods.cart_info.productAttr.price}}</text>
											<text class="callate_text">x{{goods.product_num}}</text>
										</view>
										<view class='carnum acea-row row-center-wrapper'>
											<view class="reduce" :class="(goods.numSub || goods.refund_num == 1) ? 'on' : ''" @click.stop='subCart(goods)'>
												<text class="iconfont icon-ic_Reduce"></text>
											</view>
											<view class='num'>{{goods.refund_num}}</view>
											<view class="plus" :class="(goods.max_count == goods.refund_num || goods.numAdd) ? 'on' : ''" @click.stop='addCart(goods)'>
												<text class="iconfont icon-ic_increase"></text>
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
					<view class="form-box">
						<view class="form-item item-txt">
							<text class="label">ຈຳນວນເງິນຄືນ</text>
							<input style="text-align: right;" class="p-color" type="text" placeholder="ກະລຸນາໃສ່ຈຳນວນ" placeholder-class="holder-color" v-model="rerundPrice" @blur="checkMaxPrice">
						</view>
						<view class="form-item item-txt">
							<text class="label">ເຫດຜົນຄືນເງິນ</text>
							<view class="picker">
								<picker @change="bindPickerChange" :value="qsIndex" :range="qsArray">
									<view class="picker-box">
										{{qsArray[qsIndex]}}
										<text class="iconfont icon-ic_rightarrow"></text>
									</view>
								</picker>
							</view>
						</view>
						<view class="form-item item-txtarea">
							<text class="label">ໝາຍເຫດ</text>
							<view class="txtarea"><textarea v-model="con" placeholder-class="holder-color" placeholder="ກະລຸນາຕື່ມໝາຍເຫດ, ບໍ່ເກີນ100ຕົວອັກສອນ" /></view>
						</view>
					</view>
				</view>
				<button class="btn-box" @click="confirmRefund" :disabled="disabled" :class="{'disabled' : disabled}">ຢືນຢັນຄືນເງິນ</button>
			</view>
		</view>
		<view v-else>
			<emptyPage title="ບໍ່ມີຂໍ້ມູນອໍເດີ~"  :noImage="`${domain}/static/images/noRefund.png`"></emptyPage>
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
		getRefundOrderApi, confirmRefundApi, computeRefundPrice
	} from '@/api/admin.js';
	import { refundMessage } from '@/api/order.js';
	import { getProductHot } from '@/api/store.js';
	import { mapGetters } from "vuex";
	import { HTTP_REQUEST_URL } from '@/config/app';
	import emptyPage from '@/components/emptyPage.vue'
	const app = getApp();
	export default {
		components: {
			emptyPage
		},
		data() {
			return {
				domain: HTTP_REQUEST_URL,
				loading: false, //是否加载中
				loadend: false, //是否加载完毕
				loadTitle: '加载更多', //提示语
				orderList: [],
				order_id: "",
				mer_id: '',
				isAllSelect: true, //全选
				selectValue: [], //选中的数据
				maxRefundPrice: 0.00,
				rerundPrice: "",
				con: "",
				qsArray:[],
				qsIndex:0,
				disabled: false,
			};
		},
		computed: mapGetters(['isLogin']),
		onReady(){},
		mounted: function() {},
		onLoad: function(options) {
			let that = this;
			that.order_id = options.order_id
			that.mer_id = options.mer_id
			Promise.all([this.refundMessage()])
		},
		onShow: function() {
			if (this.isLogin == true) {
				this.getOrderData();
			}else{
				setTimeout(() =>{
					toLogin()
				}, 300);
			}
		},
		methods: {
			getOrderData(){
				let that = this
				getRefundOrderApi(that.mer_id,that.order_id)
					.then(res => {
						that.orderList = res.data.product
						that.maxRefundPrice = Number(res.data.postage_price) + Number(res.data.total_refund_price)
						that.rerundPrice = that.maxRefundPrice.toFixed(2);
						that.orderList.forEach((item) => {
							item.max_count = item.refund_num
							this.$set(item, "check", true);
						})
					}).catch(res => {
						return that.$util.Tips({
							title: res
						}, {
							tab: 3,
							url: 1
						});
					})
			},
			// 退款理由
			refundMessage(){
				refundMessage().then(res=>{
					this.qsArray = res.data
				})
			},
			checkMaxPrice(){
				if(this.rerundPrice > this.maxRefundPrice){
					this.rerundPrice = this.maxRefundPrice.toFixed(2)
				}
			},
			// 下拉选中
			bindPickerChange(e){
				this.qsIndex = e.target.value
			},
			// 商品递减
			subCart(goods) {
				if (goods.refund_num <= 1) {
					goods.refund_num = 1;
					goods.numSub = true;

				} else {
					goods.refund_num--
					goods.numAdd = false;
					this.getRefundPrice()
				}
			},
			// 商品增加
			addCart(goods) {
				if(goods.max_count <= goods.refund_num){
					goods.refund_num = goods.max_count
					goods.numAdd = true;
				}else{
					goods.refund_num++
					goods.numSub = false;
					this.getRefundPrice()
				}
			},
			confirmRefund() {
				let that = this;
				let refundData = that.getSelectedProduct();
				let arr = Object.keys(refundData);
				if(arr.length == 0){
					return that.$util.Tips({
						title: 'ກະລຸນາເລືອກສິນຄ້າ'
					});
				}
				if(that.maxRefundPrice == undefined){
					return that.$util.Tips({
						title: 'ກະລຸນາໃສ່ຈຳນວນເງິນຄືນ'
					});
				}
				let data = {
					refund_message: that.qsArray[that.qsIndex],
					refund_price: that.rerundPrice,
					mer_mark: that.con,
					refund: refundData,
					order_id: that.order_id
				}
				that.disabled = true
				uni.showLoading({
					title: "ກຳລັງຄືນເງິນ"
				})
				confirmRefundApi(that.mer_id, data)
					.then(res => {
						that.$util.Tips({
							title: res.message
						});
						that.disabled = false
						setTimeout(()=>{
							uni.navigateTo({
								url:`/pages/admin/refundDetail/index?id=${res.data.refund_order_id}&mer_id=${that.mer_id}`
							})
						},500)
					})
					.catch(err => {
						return that.$util.Tips({
							title: err
						}, {
							tab: 3,
							url: 1
						});
				});
			},
			// 获取选中的商品
			getSelectedProduct(){
				let arr = {}
				this.orderList.forEach((item) => {
					if(item.check){
						arr[item.order_product_id] = item.refund_num
					}
				})
				return arr
			},
			// 商品选中
			goodsCheck(goods) {
				goods.check = !goods.check
				this.getRefundPrice()
			},
			// 计算退款金额
			getRefundPrice(){
				let that = this;
				let refundData = that.getSelectedProduct();
				computeRefundPrice(that.mer_id,{refund: refundData,order_id: that.order_id})
					.then(res => {
						that.rerundPrice = res.data.totalRefundPrice
					}).catch(res => {
						that.$util.Tips({
							title: res
						});
					})
			},
		},
		onReachBottom() {

		},
		// 滚动监听
		onPageScroll(e) {}
	}
</script>

<style scoped lang="scss">
	page {
		background: #F5F5F5;
	}
	.refund {
		.list{
			background: #fff;
		}
		.item{
			padding: 20rpx;
		}
		.picTxt {
			width: 100%;
			position: relative;
			align-items: center;
			margin-bottom: 30rpx;
			.checkbox {
				width: 60rpx;
				.iconfont {
					font-size: 40rpx;
					color: #CCCCCC;
					border-radius: 100%;
					&.disabled{
						background: #f3f3f3;
					}
				}
				.icon-xuanzhong1 {
					color: #2291F8;
				}
			}
			.pictrue {
				width: 130rpx;
				height: 130rpx;
				image {
					width: 100%;
					height: 100%;
					border-radius: 16rpx;
				}
			}
			.text {
				width: 490rpx;
				margin-left: 20rpx;
				font-size: 28rpx;
				color: #282828;
			}
			.attr {
				font-size: 24rpx;
				color: #999999;
				margin-top: 17rpx;
			}
			.text .money {
				font-size: 26rpx;
				color: #282828;
			}
			.refund_bom{
				margin-top: 20rpx;
				align-items: center;
				.callate_text{
					margin-left: 12rpx;
				}
			}
		}
		.form-box{
			padding-left: 30rpx;
			margin-top: 18rpx;
			background-color: #fff;
			.form-item{
				display: flex;
				justify-content: space-between;
				border-bottom: 1px solid #f5f5f5;
				font-size: 30rpx;
			}
			.item-txt{
				align-items: center;
				width: 100%;
				padding:30rpx 30rpx 30rpx 0;
			}
			.item-txtarea{
				padding:30rpx 30rpx 30rpx 0;
				textarea{
					display: block;
					width: 400rpx;
					height: 100rpx;
					font-size: 30rpx;
					text-align: right;
				}
			}
			.icon-ic_rightarrow{
				margin-left: 10rpx;
				font-size: 28rpx;
				color: #BBBBBB;
			}
			.holder-color{
				color: #CCCCCC;
			}
		}
		.btn-box{
			width:690rpx;
			height:86rpx;
			margin: 100rpx auto 0;
			line-height: 86rpx;
			text-align: center;
			color: #fff;
			background: #2291F8 ;
			border-radius:43rpx;
			font-size: 32rpx;
			&.disabled{
				background: #bbb;
				pointer-events: none;
			}
		}
		.btn-box[disabled]{
			pointer-events: none;
			background: #bbb;
		}
	}
</style>

