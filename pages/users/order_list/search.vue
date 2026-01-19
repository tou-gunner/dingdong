<template>
	<view :style="viewColor">
		<view class='my-order'>
			<view class='header'>
				<view class="search acea-row row-middle">
					<text class="iconfont icon-ic_search"></text>
					<input v-model="store_name" :focus="focus" confirm-type="search" placeholder="搜索我的订单" class="input" @confirm="handleSearch" />
				</view>
			</view>
			<view class='list'>
				<!-- 代付款 -->
				<view v-if="orderList.length > 0">
					<block v-if="orderStatus == 0">
						<view class='item bg-f boder-24' v-for="(item,index) in orderList" :key="index">
							<view @click='goOrderDetails(item.group_order_id)'>
								<view class='title acea-row row-between-wrapper'>
									<view class="acea-row row-middle left-wrapper">
										{{item.group_order_sn}}
									</view>
									<view class='t-color'>{{ item.orderList[0].activity_type === 2 && item.orderList[0].orderProduct[0].cart_info.productPresell.presell_type ==2 ? "待付定金" : "待付款" }}</view>
								</view>
								<view v-for="(order,j) in item.orderList" :key="order.order_id+j">
										<!--预售-->
										<view v-if="order.activity_type === 2">
											<block v-for="(goods,g) in order.orderProduct" :key="g">
											<view  class='item-info acea-row row-between row-top'>
												<view class='pictrue'>
													<image :src='(goods.cart_info.productAttr && goods.cart_info.productAttr.image) || goods.cart_info.product.image'></image>
												</view>
												<view class='text acea-row row-between'>
													<view class='name line1'>
														<text class="event_name event_bg">预售</text><text>{{goods.cart_info.product.store_name}}</text>
														<view class="event_ship event_color">发货时间：
															<!--全款预售-->
															<text v-if="goods.cart_info.productPresell.presell_type === 1">
																{{ goods.cart_info.productPresell.delivery_type === 1 ? '支付成功后' : '预售结束后' }}{{ goods.cart_info.productPresell.delivery_day }}天内
															</text>
															<!--定金预售-->
															 <text v-if="goods.cart_info.productPresell.presell_type === 2">{{ goods.cart_info.productPresell.delivery_type === 1 ? '支付尾款后' : '预售结束后' }}{{ goods.cart_info.productPresell.delivery_day }}天内</text>
														</view>
													</view>
													<view class='money'>
														<view class="regular">¥{{goods.cart_info.productPresellAttr.presell_price}}</view>
														<view>x{{goods.product_num}}</view>
													</view>
												</view>
												<view v-if="goods.cart_info.productPresell.presell_type === 2" class="event_price">
													 定金待支付 <text class="t-color">¥{{ order.pay_price }}</text>
													尾款待支付 <text class="t-color">¥{{ order.presellOrder.pay_price }}</text>
												</view>
											</view>
											</block>
										</view>
									<view v-else>
										<block v-for="(goods,g) in order.orderProduct" :key="g">
												<view class='item-info acea-row row-between row-top'>
													<view class='pictrue'>
														<image :src='(goods.cart_info.productAttr && goods.cart_info.productAttr.image) || goods.cart_info.product.image'></image>
													</view>
													<view class='text acea-row row-between'>
														<view class='name line2'>{{goods.cart_info.product.store_name}}</view>
														<view class='money' v-if="item.orderList[0].activity_type == 4">
															<view v-if="goods.cart_info.activeSku">¥{{goods.cart_info.activeSku.active_price}}</view>
															<view>x{{goods.product_num}}</view>
														</view>
														<view v-else class='money'>
															<view class="regular">¥{{goods.cart_info.productAttr.price}}</view>
															<view>x{{goods.product_num}}</view>
														</view>
													</view>
												</view>
											</block>
										</view>
								</view>
								<view class='totalPrice acea-row row-right' v-if="item.orderList[0].activity_type !== 2">
									<view>共{{item.total_num || 0}}件商品，总金额</view>
									<view class='money p-color'>
										<priceFormat :price="item.pay_price" weight intSize="32" floatSize="22" labelSize="22"></priceFormat>
									</view>
								</view>
								<view class='bottom acea-row row-right row-middle'>
								<!-- 	<view class='bnt cancelBnt' @click.stop='cancelOrder(index,item.group_order_id)'>取消订单</view> -->
									<view class='bnt b-color' @click.stop='goPay(item.pay_price,item.group_order_id)'>立即付款</view>
								</view>
							</view>
						</view>
					</block>
					<!-- 待发货 待收货 待评价 已完成 -->
					<block v-else>
						<view class='item bg-f boder-24' v-for="(item,index) in orderList" :key="index">
							<view @click='goOrderDetails(item.order_id)'>
								<view class='title acea-row row-between-wrapper'>
									<view class="acea-row row-middle left-wrapper" @click.stop="goMall(item)">
										<text class="iconfont icon-ic_mall"></text>
										<view class="store-name font-500">{{item.merchant.mer_name}}</view>
										<text class="iconfont icon-ic_rightarrow"></text>
									</view>
									<view v-if="item.status == 0" class='t-color'>
										<text v-if="item.is_virtual ==4">派单中</text>
										<block v-else>
											<text v-if="item.order_type==1">{{item.takeOrderCount > 0 ? '部分核销' : '待核销'}}</text>
											<text v-else>待发货</text>
										</block>
									</view>
									<view v-if="((item.status == 20 || (item.status == 1 && item.order_type == 1))) && item.is_virtual ==4" class='t-color'>
										<text>待核销</text>
									</view>
									<view v-if="item.status == 1 && item.order_type==0" class='t-color'>{{item.is_virtual ==4  ? '待服务' : '待收货'}}</view>
									<view v-if="item.status == 2" class='t-color'>待评价</view>
									<view v-if="item.status == 3" class='t-color'>已完成</view>
									<view v-if="item.status == -1" class='t-color'>已退款</view>
								</view>
								<view v-if="item.activity_type === 2">
									<view class='item-info acea-row row-between row-top' v-for="(goods,index) in item.orderProduct" :key="index">
										<view class='pictrue'>
											<image :src='(goods.cart_info.productAttr && goods.cart_info.productAttr.image) || goods.cart_info.product.image'></image>
										</view>
										<view class='text acea-row row-between'>
											<view class='name '>
												<view class='name' :class="item.status === 0 ? 'line1' : 'line2'">
													<text class="event_name event_bg">预售</text><text>{{goods.cart_info.product.store_name}}</text>
													<view v-if="item.status == 0" class="event_ship event_color">发货时间：
														<!--全款预售-->
														<text v-if="goods.cart_info.productPresell.presell_type === 1">{{ goods.cart_info.productPresell.delivery_type === 1 ? '支付成功后' : '预售结束后' }}{{ goods.cart_info.productPresell.delivery_day }}天内</text>
														<!--定金预售-->
														<text v-if="goods.cart_info.productPresell.presell_type === 2">{{ goods.cart_info.productPresell.delivery_type === 1 ? '支付尾款后' : '预售结束后' }}{{ goods.cart_info.productPresell.delivery_day }}天内</text>
													</view>
												</view>
												<view style="margin-top: 10rpx;" class="t-color">{{goods.is_refund==1?'退款中':goods.is_refund==2?'部分退款':goods.is_refund==3?'全部退款':''}}</view>
											</view>
											<view class='money'>
												<view class="regular">¥{{goods.cart_info.productPresellAttr.presell_price}}</view>
												<view>x{{goods.product_num}}</view>
											</view>
										</view>
									</view>
								</view>
								<view v-else>
									<view class='item-info acea-row row-between row-top' v-for="(goods,index) in item.orderProduct" :key="index">
										<view class='pictrue'>
											<image :src='(goods.cart_info.productAttr && goods.cart_info.productAttr.image) || goods.cart_info.product.image'></image>
										</view>
										<view class='text acea-row row-between'>
											<view class='name '>
												<view class='name line2'>
													<text>{{goods.cart_info.product.store_name}}</text>
												</view>
												<view style="margin-top: 10rpx;" class="t-color">{{goods.is_refund==1?'退款中':goods.is_refund==2?'部分退款':goods.is_refund==3?'全部退款':''}}</view>
											</view>
											<view class='money' v-if="item.activity_type == 3">
												<view class="regular" v-if="goods.cart_info.productAssistAttr">¥{{goods.cart_info.productAssistAttr.assist_price}}</view>
												<view>x{{goods.product_num}}</view>
											</view>
											<view class='money' v-else-if="item.activity_type == 4">
												<view v-if="goods.cart_info.activeSku">¥{{goods.cart_info.activeSku.active_price}}</view>
												<view>x{{goods.product_num}}</view>
											</view>
											<view class='money' v-else>
												<view class="regular">¥{{goods.cart_info.productAttr.price}}</view>
												<view>x{{goods.product_num}}</view>
											</view>
										</view>
									</view>
								</view>
								<view class='totalPrice acea-row row-right' v-if="item.activity_type == 2">
									<view>共{{item.orderNum || 0}}件商品，总金额</view>
									<view class='money p-color'>
										<priceFormat :price="item.presell_price" weight intSize="32" floatSize="22" labelSize="22"></priceFormat>
									</view>
								</view>
								<view class='totalPrice acea-row row-right' v-else>
									<view>共{{item.orderNum || 0}}件商品，总金额</view>
									<view class='money p-color'>
										<priceFormat :price="item.pay_price" weight intSize="32" floatSize="22" labelSize="22"></priceFormat>
									</view>
								</view>
							</view>
							<view class='bottom acea-row row-right row-middle'>
								<block v-if="item.status == 0 || item.status == 9 || item.status == -1">
								<!-- 	<view class='bnt cancelBnt' @click='goOrderDetails(item.order_id)'>申请退款</view> -->
									<view class='bnt b-color' @click='goOrderDetails(item.order_id)'>查看详情</view>
								</block>
								<block v-if="item.status == 1">
									<view class='bnt cancelBnt' v-if="item.delivery_type == 1 || item.delivery_type == 2" @click='goOrderDetails(item.order_id)'>查看物流</view>
									<view class='bnt b-color' @tap='confirmOrder(item,index)'>确认收货</view>
								</block>
								<block v-if="item.status == 2">
									<navigator v-if="community_status == 1 && !item.community_id" :url="'/pages/plantGrass/plant_release/index?order_id='+item.order_id" class='bnt colorBnt' hover-class="none">
										<text class="iconfont icon-ic_edit"></text>
										发布种草
									</navigator>
									<view class='bnt b-color' @click='goOrderDetails_Evaluation(item.order_id)'>去评价</view>
								</block>
								<block v-if="item.status == 3">
									<view class='bnt b-color' @click='goOrderDetails(item.order_id)' v-if="item.activity_type == 2 || item.activity_type == 3 || item.activity_type == 10">查看详情</view>
									<navigator v-if="community_status == 1 && !item.community_id" :url="'/pages/plantGrass/plant_release/index?order_id='+item.order_id" class='bnt colorBnt' hover-class="none">
										<text class="iconfont icon-ic_edit"></text>
										发布种草
									</navigator>
									<view class='bnt b-color' @click='goOrderDetails(item.order_id)' v-else>再次购买</view>
								</block>
							</view>
						</view>
					</block>
				</view>
			</view>
			<view class='loadingicon acea-row row-center-wrapper' v-if="orderList.length>5">
				<text class='loading iconfont icon-jiazai' :hidden='loading==false'></text>{{loadTitle}}
			</view>
			<view v-if="orderList.length == 0 && page > 1">
				<emptyPage title="暂无订单~"></emptyPage>
			</view>
		</view>
		<home></home>
		<payment :payMode='payMode' :pay_close="pay_close" @onChangeFun='onChangeFun' :order_id="pay_order_id" :totalPrice='totalPrice'></payment>
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
	let app = getApp();
	import {
		getOrderList,
		orderData,
		unOrderCancel,
		orderDel,
		orderPay,
		groupOrderList,
		orderTake
	} from '@/api/order.js';
	import { openOrderSubscribe } from '@/utils/SubscribeMessage.js';
	import payment from '@/components/payment';
	import home from '@/components/home/index.vue';
	import { mapGetters } from "vuex";
	import emptyPage from '@/components/emptyPage.vue'
	import { configMap } from '@/utils'
	import { toLogin } from '@/libs/login.js';
	export default {
		components: {
			payment,
			emptyPage,
			home,
		},
		data() {
			return {
				loading: false, //是否加载中
				loadend: false, //是否加载完毕
				loadTitle: '加载更多', //提示语
				orderList: [], //订单数组
				presellProList: [], //定金预售订单
				presellOrderCount: 0,
				orderData: {}, //订单详细统计
				orderStatus: -1, //订单状态
				page: 1,
				limit: 20,
				focus: true,
				payMode: [],
				pay_close: false,
				pay_order_id: '',
				totalPrice: '0',
				isReady: true,
				store_name: ''
			};
		},
		computed: {
			...mapGetters(['isLogin','viewColor','orderPayList']),
			...configMap(['hide_mer_status', 'community_status',]),
		},
		watch: {
			orderPayList:{
				handler(nVal,oVal){
					if(nVal){
						this.payMode= nVal;
					}
				},
				immediate: true,
				deep:true
			}
		},
		onShow() {
			if (this.isLogin) {
				this.page = 1;
				this.loadend = false;
				this.loading = false;
			} else {
				toLogin()
			}
		},
		onReady(){
		},
		mounted: function() {
		},
		methods: {
			// 去商铺
			goMall(item){
				if(this.hide_mer_status == 0){
					uni.navigateTo({
						url:'/pages/store/home/index?id='+item.mer_id
					})
				}
			},
			/**
			 * 事件回调
			 *
			 */
			onChangeFun: function(e) {
				let opt = e;
				let action = opt.action || null;
				let value = opt.value != undefined ? opt.value : null;
				(action && this[action]) && this[action](value);
			},

			/**
			 * 关闭支付组件
			 *
			 */
			payClose: function() {
				this.pay_close = false;
			},
			/**
			 * 生命周期函数--监听页面加载
			 */
			onLoad: function(options) {
				if (options.status) this.orderStatus = options.status;
			},
			/**
			 * 获取订单统计数据
			 *
			 */
			getOrderData: function() {
				let that = this;
				orderData().then(res => {
					that.$set(that, 'orderData', res.data);
				})
			},
			/**
			 * 取消订单
			 *
			 */
			cancelOrder: function(index, order_id) {
				let that = this;
				if (!order_id) return that.$util.Tips({
					title: '缺少订单号无法取消订单'
				});
				unOrderCancel(order_id).then(res => {
					return that.$util.Tips({
						title: res.message,
						icon: 'success'
					}, function() {
						that.orderList.splice(index, 1);
						that.$set(that, 'orderList', that.orderList);
						that.$set(that.orderData, 'unpaid_count', that.orderData.unpaid_count - 1);
						that.getOrderData();
					});
				}).catch(err => {
					return that.$util.Tips({
						title: err
					});
				});
			},
			/**
			 * 打开支付组件
			 *
			 */
			goPay: function(pay_price, order_id) {
				this.$set(this, 'pay_close', true);
				this.order_id = order_id;
				this.pay_order_id = order_id.toString()
				this.$set(this, 'totalPrice', pay_price);
				this.$util.getPayTypeList(this.pay_order_id,0)
			},
			/**
			 * 支付成功回调
			 *
			 */
			pay_complete: function() {
				this.loadend = false;
				this.page = 1;
				this.$set(this, 'orderList', []);
				this.pay_close = false;
				this.pay_order_id = '';
				this.getOrderData();
				this.getOrderList();
			},
			/**
			 * 支付失败回调
			 *
			 */
			pay_fail: function() {
				this.pay_close = false;
				this.pay_order_id = '';

			},
			/**
			 * 去订单详情
			 */
			goOrderDetails: function(order_id) {
				let self = this
				if (!order_id) return that.$util.Tips({
					title: '缺少订单号无法查看订单详情'
				});
				// #ifdef MP
				uni.showLoading({
					title: '正在加载',
				})
				openOrderSubscribe().then(() => {
					uni.hideLoading();
					if (self.orderStatus == 0) {
						uni.navigateTo({
							url: '/pages/order_details/stay?order_id=' + order_id
						})
					} else {
						uni.navigateTo({
							url: '/pages/order_details/index?order_id=' + order_id
						})
					}
				}).catch(() => {
					uni.hideLoading();
				})
				// #endif
				// #ifndef MP
				if (self.orderStatus == 0) {
					uni.navigateTo({
						url: '/pages/order_details/stay?order_id=' + order_id
					})
				} else {
					uni.navigateTo({
						url: '/pages/order_details/index?order_id=' + order_id
					})
				}
				// #endif
			},
			/**
			 * 点击去评价
			 */
			goOrderDetails_Evaluation: function(order_id) {
				let self = this
				if (!order_id) return that.$util.Tips({
					title: '缺少订单号无法查看订单详情和评价'
				});
				// #ifdef MP
					if (self.orderStatus == 0) {
						uni.navigateTo({
							url: '/pages/order_details/stay?order_id=' + order_id
						})
					} else {
						uni.navigateTo({
							url: '/pages/order_details/index?order_id=' + order_id
						})
					}
				// #endif
				// #ifndef MP
				if (self.orderStatus == 0) {
					uni.navigateTo({
						url: '/pages/order_details/stay?order_id=' + order_id
					})
				} else {
					uni.navigateTo({
						url: '/pages/order_details/index?order_id=' + order_id
					})
				}
				// #endif
			},
			/**
			 * 切换类型
			 */
			statusClick: function(status) {
				if (status == this.orderStatus) return;
				this.orderStatus = status;
				this.loadend = false;
				this.loading = false;
				this.page = 1;
				this.$set(this, 'orderList', []);
				this.getOrderList();
			},
			/**
			 * 获取订单列表
			 */
			getOrderList: function() {
				let that = this;
				if (that.loadend) return;
				if (that.loading) return;
				that.loading = true;
				that.loadTitle = "加载更多";
				console.log(that.store_name);
				getOrderList({
					page: that.page,
					limit: that.limit,
					store_name: that.store_name
				}).then(res => {
					let list = res.data.list || [];
					let loadend = list.length < that.limit;
					that.orderList = that.page == 1 ? list : that.$util.SplitArray(list, that.orderList);
					that.$set(that, 'orderList', that.orderList);
					that.getProductCount();
					that.loadend = loadend;
					that.loading = false;
					that.loadTitle = loadend ? "我也是有底线的" : '加载更多';
					that.page = that.page + 1;
					// that.isReady = true;
				}).catch(err => {
					that.loading = false;
					that.loadTitle = "加载更多";
				})
			},
			/**
			 * 获取定金预售订单列表
			 */
			getpreSellOrderList: function() {
				let that = this;
				getOrderList({
					status: 10,
					page: 1,
					limit: 1,
				}).then(res => {
					let list = res.data.list || [];
					that.presellOrderCount = res.data.count;
					that.$set(that, 'presellProList', list);
				})

			},
			/**
			 * 获取单个订单商品数量
			 */
			getProductCount: function(){
				if(this.orderStatus !== 0){
					this.orderList.forEach((item,i) => {
						let orderNum = 0
						if(item.orderProduct){
							item.orderProduct.forEach((val) => {
							  orderNum += val.product_num
						 })
						 this.orderList[i]['orderNum']=orderNum;
						}
					})
				}
			},
			/**
			 * 删除订单
			 */
			delOrder: function(order_id, index) {
				let that = this;
				orderDel(order_id).then(res => {
					that.orderList.splice(index, 1);
					that.$set(that, 'orderList', that.orderList);
					that.$set(that.orderData, 'unpaid_count', that.orderData.unpaid_count - 1);
					that.getOrderData();
					return that.$util.Tips({
						title: '删除成功',
						icon: 'success'
					});
				}).catch(err => {
					return that.$util.Tips({
						title: err
					});
				})
			},
			// 确认收货
			confirmOrder: function(item, index) {
				let that = this;
				uni.showModal({
					title: '确认收货',
					content: '为保障权益，请收到货确认无误后，再确认收货',
					success: function(res) {
						if (res.confirm) {
							orderTake(item.order_id).then(res => {
								return that.$util.Tips({
									title: '操作成功',
									icon: 'success'
								}, function() {
									that.orderList.splice(index, 1);
									that.getOrderData();
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
			handleSearch() {
				this.loadend = false;
				this.page = 1;
				this.orderList = [];
				if (!this.store_name) {
					return this.$util.Tips({
						title: '请输入搜索内容'
					});
					return;
				}
				this.getOrderList();
			}
		},
		onReachBottom: function() {
			this.getOrderList();
		},

	}
</script>

<style scoped lang="scss">
	.my-order .header {
		padding: 20rpx;
	}
	.t-color{color: var(--view-theme);}
	.p-color{color: var(--view-priceColor);}
	.b-color{background-color:var(--view-theme);}
	.my-order .list {
		width: 710rpx;
		margin: 0 auto;
	}
	.my-order .list .item {
		margin-bottom: 20rpx;
	}
	.my-order .list .item .title {
		height: 84rpx;
		padding: 0 30rpx;
		font-size: 28rpx;
		.left-wrapper {
			.store-name {
				margin: 0 10rpx;
			}
			.icon-ic_rightarrow {
				font-size: 26rpx;
			}
		}
	}
	.my-order .list .item .title .sign {
		font-size: 24rpx;
		padding: 0 7rpx;
		height: 36rpx;
		margin-right: 15rpx;
	}
	.my-order .list .item .item-info {
		padding: 0 30rpx;
		margin-top: 22rpx;
	}
	.my-order .list .item .item-info .pictrue {
		width: 120rpx;
		height: 120rpx;
	}
	.my-order .list .item .item-info .pictrue image {
		width: 100%;
		height: 100%;
		border-radius: 16rpx;
	}
	.my-order .list .item .item-info .text {
		width: 486rpx;
		font-size: 28rpx;
		color: #999;
		margin-top: 6rpx;
	}
	.my-order .list .item .item-info .text .name {
		width: 320rpx;
		color: #282828;
	}
	.event_bg{
		background: #FF7F00;
	}
	.event_color{
		color: #FF7F00;
	}
	.my-order .list .item .event_name{
		display: inline-block;
		margin-right: 9rpx;
		color: #fff;
		font-size: 20rpx;
		padding: 0 8rpx;
		line-height: 30rpx;
		text-align: center;
		border-radius: 6rpx;
	}
	.my-order .list .item .event_ship{
		font-size: 20rpx;
		margin-top: 10rpx;
	}
	.my-order .list  .event_price{
		margin: 0 0 50rpx 120rpx;
	}
	.my-order .list .item .item-info .text .money {
		text-align: right;
	}
	.my-order .list .item .totalPrice {
		font-size: 26rpx;
		color: #282828;
		text-align: right;
		margin: 27rpx 0 0 30rpx;
		padding: 0 30rpx 30rpx 0;
	}
	.my-order .list .item .totalPrice .money {
		margin-left: 8rpx;
	}
	.my-order .list .item .bottom {
		height: 107rpx;
		padding-right: 30rpx;
		margin-left: 30rpx;
	}
	.my-order .list .item .bottom .bnt {
		width: 160rpx;
		height: 64rpx;
		text-align: center;
		line-height: 64rpx;
		color: #fff;
		border-radius: 100rpx;
		font-size: 24rpx;
	}

	.my-order .list .item .bottom .bnt.cancelBnt {
		border: 1px solid #ddd;
		color: #666;
	}
	.my-order .list .item .bottom .bnt.colorBnt {
		border: 1px solid var(--view-theme);
		color: var(--view-theme);
	}
	.my-order .list .item .bottom .bnt .icon-ic_edit{
		font-size: 26rpx;
		margin-right: 10rpx;
	}
	.my-order .list .item .bottom .bnt~.bnt {
		margin-left: 17rpx;
	}
	.search {
		height: 72rpx;
		padding: 0 30rpx;
		border-radius: 100rpx;
		background-color: #FFFFFF;
		font-size: 28rpx;
		.iconfont {
			margin-right: 10rpx;
			font-size: 32rpx;
			color: #999999;
		}
		.input-placeholder {
			font-size: 26rpx;
			color: #999999;
		}
		.input {
			flex: 1;
			font-size: 28rpx;
		}
	}
</style>
