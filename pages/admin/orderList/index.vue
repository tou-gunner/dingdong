<template>
	<BaseContainer>
		<view class="pos-order-list" ref="container">
			<view class="top-header">
				<view class="search">
					<view class="search-content acea-row row-middle">
						<text class="iconfont icon-ic_search"></text>
						<input v-model="where.store_name" confirm-type="search" placeholder="ຄົ້ນຫາດ້ວຍເບີໂທ ຫຼື ເລກອໍເດີ" class="input" @confirm="handleSearch" />
					</view>
				</view>
				<view>
					<scroll-view class="nav acea-row" scroll-x="true" style="white-space: nowrap; display: flex;" scroll-with-animation show-scrollbar="true">
						<view class="item" :class="where.status == 1 ? 'on' : ''" @click="changeStatus(1)">
							ລໍຖ້າຊຳລະ
						</view>
						<view class="item" :class="where.is_verify == 1 ? 'on' : ''" @click="changeStatus('verify')">
							ລໍຖ້າກວດສອບ
						</view>
						<view class="item" :class="where.status == 2 ? 'on' : ''" @click="changeStatus(2)">
							ລໍຖ້າສົ່ງ
						</view>
						<view class="item" :class="where.status == 3 ? 'on' : ''" @click="changeStatus(3)">
							ລໍຖ້າຮັບ
						</view>
						<view class="item" :class="where.status == 4 ? 'on' : ''" @click="changeStatus(4)">
							ລໍຖ້າລີວິວ
						</view>
						<view class="item" :class="where.status == 5 ? 'on' : ''" @click="changeStatus(5)">
							ສຳເລັດແລ້ວ
						</view>
						<view class="item" :class="where.status == 6 ? 'on' : ''" @click="changeStatus(6)">
							ຄືນເງິນ
						</view>
					</scroll-view>
				</view>
			</view>
			<view class="pad20">
				<view v-if="where.status == 6" class="list">
					<view class="item bg-f boder-24" v-for="(item, index) in list" :key="index">
						<view class="order-num order-num-refund acea-row row-middle">
							<view v-if="item.order && item.order.activity_type != 0" class="activity_type">
								{{ item.order.activity_type == 1 ? 'Flash Sale' : item.order.activity_type == 2 ? 'ຈອງລ່ວງໜ້າ' : item.order.activity_type == 3 ? 'ຊ່ວຍເຫຼືອ' : item.order.activity_type == 4 ? 'ກຸ່ມຊື້' : item.order.activity_type == 10 ? 'ແພັກເກັດ' :'' }}
							</view>
							ເລກຄືນເງິນ：{{ item.refund_order_sn }}
							<view class="time">ເວລາຂໍ：{{ item.create_time }}</view>
						</view>
						<view class="pos-order-goods order-refund" v-for="(val, key) in item.refundProduct" :key="key" @click="toRefundDetail(item)">
							<view class="goods acea-row row-between">
								<view v-if="val.product.cart_info" class="picTxt pixTxt-refund acea-row row-between-wrapper">
									<view class="pictrue pictrue-refund">
										<image :src="val.product.cart_info.product.image" />
									</view>
									<view class="text refund-text acea-row row-between row-column">
										<view class="info line1 refund-info">
											{{ val.product.cart_info.product&&val.product.cart_info.product.store_name }}
										</view>
										<view class="attr">
											{{ val.product.cart_info.productAttr&&val.product.cart_info.productAttr.sku || "默认" }}
										</view>
										<view class="y-money refund-y-money">
											ຄືນເງິນ：<priceFormat :price="val.refund_price" weight intSize="28" floatSize="20" labelSize="20"></priceFormat>
										</view>
									</view>
								</view>
								<view class="money refund-money">
									<view class="num">x{{ val.refund_num }}</view>
								</view>
							</view>
						</view>
						<view class="item-status">
							<text v-if="item.status == -1" class="iconfont icon-yijujue"></text>
							<text v-if="item.status == 0" class="iconfont icon-tuikuanzhong11 on"></text>
							<text v-if="item.status == 1 || item.status == 2" class="iconfont icon-tuihuozhong on"></text>
							<text v-if="item.status == 3" class="iconfont icon-yituikuan11"></text>
							<text v-if="item.status == -2" class="iconfont icon-yiquxiao"></text>
						</view>
						<view class="operation acea-row row-between-wrapper">
							<view class="more">
							</view>
							<view class="acea-row row-middle">
								<view class="bnt" @click="refundModify(item, 1)">ໝາຍເຫດອໍເດີ</view>
								<navigator class="bnt bnt_color" v-if="item.status == 0" :url="'/pages/admin/orderRefund/index?id='+item.refund_order_id+'&merId='+merId">ຄືນເງິນທັນທີ</navigator>
								<navigator class="bnt" v-if="item.status == 2" :url="'/pages/users/goods_logistics/index?refundId='+item.refund_order_id+'&merId='+merId">ເບິ່ງການຂົນສົ່ງ</navigator>
								<view class="bnt bnt_color" v-if="item.status == 2" @tap='confirmOrder(item)'>ຢືນຢັນຮັບສິນຄ້າ</view>
							</view>
						</view>
					</view>
				</view>
				<view v-else class="list">
					<view class="item bg-f boder-24" v-for="(item, index) in list" :key="index">
						<view class="order-num acea-row row-between">
							<view>
								<view class="acea-row row-middle">
									<view v-if="item.activity_type != 0" class="activity_type">
										{{ item.activity_type == 1 ? 'Flash Sale' : item.activity_type == 2 ? 'ຈອງລ່ວງໜ້າ' : item.activity_type == 3 ? 'ຊ່ວຍເຫຼືອ' : item.activity_type == 4 ? 'ກຸ່ມຊື້' : item.activity_type == 10 ? 'ແພັກເກັດ' :'' }}
									</view>
									ເລກອໍເດີ：{{ item.order_sn }}
								</view>
								<view class="time">ເວລາສັ່ງຊື້：{{ item.create_time }}</view>
							</view>
							<text class="order-status">
								{{getOrderStatus(item)}}
							</text>
						</view>
						<view class="pos-order-goods" v-for="(val, key) in item.orderProduct" :key="key" @click="toDetail(item)">
							<view class="goods">
								<view class="acea-row row-between">
									<view class="picTxt acea-row row-between-wrapper">
										<view class="pictrue">
											<image :src="val.cart_info.product.image" />
										</view>
										<view class="text acea-row row-between row-column">
											<view class="info line2">
												{{ val.cart_info.product.store_name }}
											</view>
											<view class="attr">
												{{ val.cart_info.productAttr&&val.cart_info.productAttr.sku || "默认" }}
											</view>
										</view>
									</view>
									<view class="money">
										<view class="x-money">
											<priceFormat :price="val.cart_info.productAttr.price" weight intSize="32" floatSize="22" labelSize="20"></priceFormat>
										</view>
										<view class="num">x{{ val.product_num }}</view>
										<view class="refund-num" v-if="val.product_num-val.refund_num>0">{{val.product_num-val.refund_num}}ລາຍການ{{val.is_refund==1?'ກຳລັງຄືນເງິນ' : val.is_refund==2 ? 'ຄືນເງິນແລ້ວ' : val.is_refund==3?'ຄືນເງິນທັງໝົດ':''}}</view>
									</view>
								</view>
							</view>
						</view>
						<view class="public-total acea-row row-right">
							ລວມ{{ item.total_num }}ລາຍການ,
							<text v-if="where.status <= 1">ຕ້ອງ</text>
							<text v-else>ໄດ້</text>
							ຊຳລະ
							<view class="money">
								<priceFormat :price="item.pay_price" weight intSize="32" floatSize="22" labelSize="20"></priceFormat>
							</view>
							( ຄ່າຂົນສົ່ງ ¥{{ item.pay_postage}} )
						</view>
						<view class="operation acea-row row-between-wrapper">
							<view class="more">
							</view>
							<view class="acea-row row-middle">
								<view class="bnt" @click="modify(item, 0)" v-if="where.status == 1 && item.activity_type != 2">
									ປ່ຽນລາຄາ
								</view>
								<view class="bnt" @click="modify(item, 1)">ໝາຍເຫດອໍເດີ</view>
								<view class="bnt bnt_color" v-if="where.status == 2 && item.order_type == 0 && !item.is_booking_order" @click="toPostage(item)">ໄປສົ່ງ</view>
								<view class="bnt bnt_color" v-if="((where.status == 2 && item.order_type == 1) || where.is_verify == 1) && item.order_type != 2 && !item.is_booking_order" @click="toDetail(item)">ກວດສອບ</view>
								<!-- 同城配送派单 -->
								<template v-if="item.order_type == 2 && where.is_verify == 1">
									<view class="bnt" @click="confirmService(item)">ຢືນຢັນການສົ່ງ</view>
									<view class="bnt bnt_color" v-if="item.status" @click="cityAssign(item, true)">ມອບໝາຍໃໝ່</view>
									<view class="bnt bnt_color" v-else @click="cityAssign(item)">ມອບໝາຍ</view>
								</template>
								<template v-if="item.paid && item.is_booking_order">
									<!-- 上门订单指派 -->
									<template v-if="!item.is_instore_order && item.status === 0">
										<view class="bnt bnt_color" v-if="item.staffs_id" @click="handleOpenAssignPage(item.order_id, true)">ມອບໝາຍໃໝ່</view>
										<view class="bnt bnt_color" v-else @click="handleOpenAssignPage(item.order_id)">ມອບໝາຍ</view>
									</template>
									<view class="bnt bnt_color" v-if="item.is_instore_order && item.status === 0" @click="handleReedeemBookingOrder(item)">ກວດສອບ</view>
									<view class="bnt bnt_color" v-else-if="!item.is_instore_order && item.status === 20" @click="handleReedeemBookingOrder">ກວດສອບ</view>
								</template>
							</view>
						</view>
					</view>
				</view>
				<Loading :loaded="loaded" :loading="loading"></Loading>
				<view v-if="!loading && list.length <= 0" class="nothing">
					<emptyPage title="ບໍ່ມີອໍເດີ~" :noImage="`${domain}/static/images/noRecord.png`"></emptyPage>
				</view>
			</view>
			<PriceChange :change="change" :orderInfo="orderInfo" v-on:closechange="changeclose($event)" v-on:savePrice="savePrice"
			:status="status"></PriceChange>
			<view>
				<view class="priceChange" :class="refundMark === true ? 'on' : ''">
					<view class="change-count bg-f">
						<view class="priceTitle" :style="{ 'background-image': `url(${domain}/static/images/pricetitle.jpg)`}">
							ໝາຍເຫດອໍເດີ
						</view>
						<view class="listChange">
							<textarea
								placeholder="ກະລຸນາຕື່ມຂໍ້ມູນໝາຍເຫດ..."
								v-model="refundInfo.mer_mark"
							></textarea>
						</view>
						<view class="modify" @click="save">
							ຢືນຢັນສົ່ງ
						</view>
					</view>
					<view class="close">
						<text class="iconfont icon-ic_close1" @click="refundMark=false"></text>
					</view>
				</view>
				<view class="mask" @touchmove.prevent v-show="refundMark === true"></view>

				<OrderAssign
					ref="orderAssign"
					v-if="merId"
					:merId="merId"
					@refresh="handleAssignSuccess" />
			</view>
		</view>
	</BaseContainer>
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
		getOrderList,
		getRefundOrderList,
		setAdminOrderPrice,
		setAdminOrderRemark,
		setOfflinePay,
		setOrderRefund,
		refundOrderReceive,
		setRefundMark,
		redeemBookingOrder,
		confirmServiceApi
	} from "@/api/admin";
	import Loading from '@/components/Loading/index'
	import PriceChange from "@/components/shared-order/PriceChange/index.vue";
	import { isMoney } from '@/utils/validate.js'
	import { HTTP_REQUEST_URL } from '@/config/app';
	import emptyPage from '@/components/emptyPage.vue';
	import OrderAssign from "../components/order_assign.vue";
	import BaseContainer from "@/components/common/base_container.vue";
	import {
		getBookingOrderStatus,
		addBookingOrderType ,
		getDeliveryOrderAdminStatus,
		getVerifyOrderAdminStatus,
		getCityDeliveryOrderAdminStatus,
	} from "@/utils/order";

	export default {
		name: "AdminOrderList",
		components: {
			Loading,
			PriceChange,
			emptyPage,
			OrderAssign,
			BaseContainer
		},
		data() {
			return {
				domain: HTTP_REQUEST_URL,
				current: "",
				change: false,
				refundMark: false,
				types: 1,
				where: {
					page: 1,
					limit: 10,
					status: 1,
					store_name: ''
				},
				list: [],
				loaded: false,
				loading: false,
				refundInfo: {},
				orderInfo: {},
				status: "",
				merId: '',
				orderType: -1, // 配送类型0: 快递，1: 自提，2: 同城
			};
		},
		watch: {
			"$route.params.types": function(newVal) {
				let that = this;
				if (newVal != undefined) {
					that.where.status = newVal;
					that.init();
				}
			},
			types: function() {
				this.getIndex();
			}
		},
		onLoad(option) {
			this.where.status = option.types
			this.current = "";
			this.merId = option.merId;
			this.getIndex();
		},
		methods: {
			async handleReedeemBookingOrder(order) {
				const [err, { confirm }] = await uni.showModal({
					title: "ແຈ້ງເຕືອນ",
					content: `ແນ່ໃຈບໍວ່າຕ້ອງການກວດສອບອໍເດີນີ້?`,
				});
				if (err || !confirm) return;
				uni.showLoading({
					mask: true
				});
				try {
					const res = await redeemBookingOrder(this.merId, order.order_id);
					uni.hideLoading();
					this.$util.Tips({
						title: res.message,
						icon: 'success'
					});
					this.init();
				} catch (error) {
					uni.hideLoading();
					this.$util.Tips({
						title: error,
						icon: 'none'
					});
				}
			},
			handleAssignSuccess(orderId) {
				const order = this.list.find(item => item.order_id === orderId);
				// 如果订单没有被指派过，则更新状态
				if (order && order.is_booking_order && !order.is_instore_order && order.status === 0) {
					order.status = 1;
				}
				this.init()
			},
			handleOpenAssignPage(orderId, isReassign = false) {
				this.$refs.orderAssign.openPanel(orderId, isReassign);
			},
			// 同城配送派单
			cityAssign(item, isReassign = false, isCity = true) {
				const orderId = item.order_id
				this.$refs.orderAssign.openPanel(orderId, isReassign, isCity);
			},
			getOrderStatus(order) {
				if (!order.paid) return "";
				if (order.is_booking_order) {
					return getBookingOrderStatus(order);
				}
				if (order.order_type == 0) {
					return getDeliveryOrderAdminStatus(order)
				}
				if (order.order_type == 1) {
					return getVerifyOrderAdminStatus(order)
				}
				if (order.order_type == 2) {
					return getCityDeliveryOrderAdminStatus(order)
				}
				if (order.refunding != 0 && this.where.status != 1) {
					return order.refunding==1 ? 'ກຳລັງຄືນເງິນ' : order.refunding==2 ? 'ຄືນເງິນບາງສ່ວນ' : 'ຄືນເງິນທັງໝົດ';
				}

				return "";
			},
			handleSearch() {
				this.loaded = false;
				this.where.page = 1;
				this.list = [];
				this.getIndex();
			},
			// 获取数据
			getIndex() {
				let that = this;
				if (that.loading || that.loaded) return;
				that.loading = true;
				if(that.where.status == 6){
					getRefundOrderList(that.where, that.merId).then(
						res => {
							that.loading = false;
							that.loaded = res.data.list.length < that.where.limit;
							that.list.push.apply(that.list, res.data.list);
							that.where.page = that.where.page + 1;
						},
						err => {
							that.$util.Tips({title: err});
						}
					);
				}else{
					getOrderList(that.where, that.merId).then(
						res => {
							that.loading = false;
							that.loaded = res.data.list.length < that.where.limit;
							res.data.list.forEach(item => {
								addBookingOrderType(item);
							});
							that.list.push.apply(that.list, res.data.list);
							that.where.page = that.where.page + 1;
						},
						err => {
							that.$util.Tips({title: err});
						}
					);
				}
			},
			// 初始化
			init: function() {
				this.list = [];
				this.where.page = 1;
				this.loaded = false;
				this.loading = false;
				this.getIndex();
				this.current = "";
			},
			// 导航切换
			changeStatus(val) {
				if(val != 'verify'){
					if(this.where.status != val){
						this.where.status = val;
						delete this.where.is_verify;
						this.init();
					}
				}else{
					this.where.is_verify = 1;
					delete this.where.status;
					this.init();
				}
			},
			// 商品操作
			modify: function(item, status) {
				let temp = status.toString()
				this.change = true;
				this.orderInfo = item;
				this.status = temp;
			},
			refundModify(item){
				this.refundInfo = item;
				this.refundMark = true;
			},
			// 退款单备注
			save(item) {
				let that = this;
				if (!that.refundInfo.mer_mark) {
					return this.$util.Tips({
						title: 'ກະລຸນາໃສ່ໝາຍເຫດ'
					})
				}
				setRefundMark(that.merId,that.refundInfo.refund_order_id,{ mer_mark: that.refundInfo.mer_mark }).then(
					res => {
						that.refundMark = false;
						this.$util.Tips({
							title: res.message,
							icon: 'success'
						})
					},
					err => {
						that.refundMark = false;
						that.$util.Tips({
							title: err
						});
					}
				);
			},
			changeclose: function(msg) {
				this.change = msg;
			},
			// 确认收货
			confirmOrder: function(item) {
				let that = this;
				uni.showModal({
					title: 'ຢືນຢັນຮັບສິນຄ້າ',
					content: 'ເພື່ອປົກປ້ອງສິດທິຂອງທ່ານ, ກະລຸນາກວດສອບສິນຄ້າກ່ອນຢືນຢັນ',
					success: function(res) {
						if (res.confirm) {
							refundOrderReceive(that.merId,item.refund_order_id).then(res => {
								return that.$util.Tips({
									title: 'ດຳເນີນການສຳເລັດ',
									icon: 'success'
								}, function() {
									item.status = 3;
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
			toPostage(item){
				let that = this;
				if(item.refunding != 0){
					uni.showModal({
						title: 'ແຈ້ງເຕືອນ',
						content: 'ອໍເດີນີ້ມີການຂໍຄືນເງິນ, ກະລຸນາຢືນຢັນວ່າໄດ້ດຳເນີນການແລ້ວ!',
						success: function(res) {
							if (res.confirm) {
								uni.navigateTo({
									url:`/pages/admin/delivery/index?id=${item.order_id}&merId=${that.merId}`
								})
							}
						}
					})
				}else{
					uni.navigateTo({
						url:`/pages/admin/delivery/index?id=${item.order_id}&merId=${that.merId}`
					})
				}
			},
			async savePrice(opt) {
				let that = this,
					data = {},
					price = opt.orderInfo.pay_postage,
					refund_price = opt.refund_price,
					refund_status = that.orderInfo.refund_status,
					remark = opt.remark;
					let parmas = {
						 pay_postage: opt.orderInfo.pay_postage,
						 coupon_price: opt.orderInfo.coupon_price,
						 total_price: Number(opt.orderInfo.total_price)
					}
				let id = that.orderInfo.order_id;
				if (that.status == 0) {
					if(!isMoney(opt.orderInfo.pay_postage || opt.orderInfo.total_price)){
						return that.$util.Tips({title: 'ກະລຸນາໃສ່ຈຳນວນເງິນທີ່ຖືກຕ້ອງ'});
					}
					data.pay_price = price;
					setAdminOrderPrice(this.merId,id,parmas).then(
						function() {
							that.change = false;
							that.$util.Tips({
								title:'ປ່ຽນລາຄາສຳເລັດ',
								icon:'success'
							})
							that.init();
						},
						function(res) {
							that.change = false;
							that.$util.Tips({
								title:res,
								icon:'none'
							})
						}
					);
				} else {
					if(!remark){
						return this.$util.Tips({
							title:'请输入备注'
						})
					}
					setAdminOrderRemark(this.merId,id, {remark: remark}).then(
						res => {
							that.change = false;
							this.$util.Tips({
								title:res.message,
								icon:'success'
							})
							that.init();
						},
						err => {
							that.change = false;
							that.$util.Tips({title: err});
						}
					);
				}
			},
			toDetail(item){
				const url = !item.is_booking_order ? "/pages/admin/orderDetail/index" : "/pages/admin/booking/detail";

				uni.navigateTo({
					url: `${url}?id=${item.order_id}&mer_id=${item.mer_id}`
				})
			},
			toRefundDetail(item){
				uni.navigateTo({
					url:`/pages/admin/refundDetail/index?id=${item.refund_order_id}&mer_id=${item.mer_id}`
				})
			},
			// 确认送达
			async confirmService(item) {
				const [err, { confirm }] = await uni.showModal({
				  title: "提示",
				  content: `ແນ່ໃຈບໍວ່າຕ້ອງການຢືນຢັນການສົ່ງ?`,
				});
				if (err || !confirm) return;
				uni.showLoading({
				  mask: true
				});
				const merId = item.mer_id
				const orderId = item.order_id
				confirmServiceApi(merId, orderId).then(res => {
					uni.hideLoading();
					this.$util.Tips({
						title: res.message,
						icon: 'success'
					});
					this.init();
				}).catch(err => {
					this.$util.Tips({
						title: err
					});
				})
			}
		},
		onReachBottom() {
			this.getIndex()
		},
	}
</script>

<style lang="scss" scoped>
	.pos-order-list .top-header {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 99;
		width: 100%;
		background-color: #fff;
	}
	.pos-order-list .nav {
		height: 92rpx;
		font-size: 26rpx;
		color: #282828;
		width: 690rpx;
		margin: 0 30rpx;
	}
	.pos-order-list .nav .item {
		display: inline-block;
		text-align: center;
		color: #333333;
		max-width: 160rpx;
		margin-right: 50rpx;
		line-height: 92rpx;
		&:last-child{
			margin-right: 0;
		}
	}
	.pos-order-list .nav .item.on {
		color: #2291f8;
		font-weight: bold;
	}
	.pos-order-list .list {
		margin-top: 186upx;
	}
	.pos-order-list .list .item {
		background-color: #fff;
		width: 100%;
		position: relative;
		padding: 30rpx;
	}
	.pos-order-list .list .item .item-status{
		position: absolute;
		top: 12rpx;
		right: 20rpx;
		.iconfont{
			font-size: 98rpx;
			color: #CCCCCC;
			&.on{
				color: #FFE3BC;
			}
		}
	}
	.pos-order-list .list .item~.item {
		margin-top: 24upx;
	}
	.pos-order-list .list .activity_type {
		display: inline-block;
		color: #E93323;
		font-size: 20rpx;
		text-align: center;
		border-radius: 5rpx;
		padding: 0 4rpx;
		line-height: 28rpx;
		margin-right: 8rpx;
		border: 1rpx solid #E93323;
	}
	.pos-order-list .list .item .order-num {
		font-size: 28rpx;
		color: #282828;
		position: relative;
		padding-bottom: 30rpx;
		border-bottom: 2rpx solid #eeeeee;
		&.order-num-refund {
			border: none;
		}
	}
	.pos-order-list .list .item .order-status{
		color: #2291F8;
		top: 30rpx;
		right: 20rpx;
		text-align: right;
		width: 100rpx;
		font-weight: normal;
		font-size: 26rpx;
	}
	.pos-order-list .list .item .order-num .time {
		font-size: 24rpx;
		font-weight: normal;
		color: #999;
		margin-top: 10rpx;
	}
	.pos-order-list .list .item .operation {
		margin-top: 56rpx;
	}
	.pos-order-list .list .item .operation .more {
		position: relative;
	}
	.pos-order-list .list .item .operation .order .arrow {
		width: 0;
		height: 0;
		border-left: 11upx solid transparent;
		border-right: 11upx solid transparent;
		border-top: 20upx solid #e5e5e5;
		position: absolute;
		left: 15upx;
		bottom: -18upx;
	}
	.pos-order-list .list .item .operation .order .arrow:before {
		content: '';
		width: 0;
		height: 0;
		border-left: 7rpx solid transparent;
		border-right: 7rpx solid transparent;
		border-top: 20rpx solid #fff;
		position: absolute;
		left: -7rpx;
		bottom: 0;
	}
	.pos-order-list .list .item .operation .order {
		width: 200upx;
		background-color: #fff;
		border: 1px solid #eee;
		border-radius: 10upx;
		position: absolute;
		top: -100upx;
		z-index: 9;
	}
	.pos-order-list .list .item .operation .order .items {
		height: 77upx;
		line-height: 77upx;
		text-align: center;
	}
	.pos-order-list .list .item .operation .order .items~.items {
		border-top: 1px solid #f5f5f5;
	}
	.pos-order-list .list .item .operation .bnt {
		font-size: 24rpx;
		color: #666666;
		height: 64rpx;
		padding-inline: 32rpx;
		border-radius: 50rpx;
		border: 1px solid #dddddd;
		text-align: center;
		line-height: 60rpx;
	}
	.pos-order-list .list .item .operation .bnt_color{
		border: none;
		color: #fff;
		background: linear-gradient(90deg, #2291F8 0%, #1CD1DC 100%);
	}
	.pos-order-list .list .item .operation .bnt~.bnt {
		margin-left: 14upx;
	}
	.pos-order-goods {
		background-color: #fff;
		margin-top: 40rpx;
		&.order-refund {
			margin-top: 20rpx;
		}
	}
	.pos-order-goods .goods {
		overflow: hidden;
	}
	.pos-order-goods .goods .picTxt {
		width: 500rpx;
		align-items: flex-start;
		&.pixTxt-refund {
			width: 560rpx;
		}
	}
	.pos-order-goods .goods .picTxt .pictrue {
		width: 120upx;
		height: 120upx;
		&.pictrue-refund {
			width: 130upx;
			height: 130upx;
		}
	}
	.pos-order-goods .goods .picTxt .pictrue image {
		width: 100%;
		height: 100%;
		border-radius: 16rpx;
	}
	.pos-order-goods .goods .picTxt .text {
		flex-direction: column;
		width: 360rpx;
		&.refund-text {
			width: 410upx;
		}
	}
	.pos-order-goods .goods .picTxt .text .info {
		&.refund-info{
			width: 410upx;
		}
	}
	.refund-y-money{
		margin-top: 20rpx;
		font-size: 26rpx;
	}
	.pos-order-goods .goods .picTxt .text .attr {
		margin-top: 16rpx;
		font-size: 20rpx;
		color: #999;
	}
	.pos-order-goods .goods .money {
		width: 148rpx;
		text-align: right;
		font-size: 28rpx;
		&.refund-money{
			width: auto;
			position: relative;
			.num{
				color: #FF9600;
			}
		}
		.refund-num{
			font-size: 24rpx;
		}
	}
	.pos-order-goods .goods .money .x-money {
		color: #282828;
	}
	.pos-order-goods .goods .money .num {
		color: #ff9600;
		margin: 5upx 0;
	}
	.pos-order-goods .goods .money .y-money {
		color: #999;
		text-decoration: line-through;
	}
	.pos-order-goods .goods .refund_num{
		display: inline-block;
		margin-left: 10rpx;
	}
	.public-total {
		font-size: 28rpx;
		color: #282828;
		text-align: right;
		background-color: #fff;
		margin-top: 38rpx;
	}
	.public-total .money {
		color: #FF9600;
		margin: 0 8rpx;
	}
	.nothing {
		margin-top: 200rpx;
		text-align: center;
		.picture {
			height: 305rpx;
		}
	}
	.search {
		padding: 17rpx 30rpx 0;
		.search-content {
			width: 100%;
			height: 60rpx;
			padding: 0 30rpx;
			border-radius: 30rpx;
			background-color: #F5F5F5;
			font-size: 26rpx;
		}
		.iconfont {
			margin-right: 10rpx;
			font-size: 30rpx;
			color: #999999;
		}
		.input-placeholder {
			font-size: 26rpx;
			color: #cccccc;
		}
		.input {
			flex: 1;
		}
	}
</style>
