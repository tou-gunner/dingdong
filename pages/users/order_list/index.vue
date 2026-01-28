<template>
	<view :style="viewColor">
		<!-- 自定义顶部背景颜色 -->
		<!-- #ifdef MP || APP-PLUS -->
		<view class="top">
			<view class="sys-head fixed">
				<view class="sys-bar" :style="{height:sysHeight}"></view>
				<!-- #ifdef MP -->
				<view class="sys-title">
					<view class='iconfont icon-ic_leftarrow' :style="{lineHeight:sysHeight}" @tap='goBack'></view>
					ລາຍການສັ່ງຊື້
				</view>
				<!-- #endif -->
				<view class="bg"></view>
			</view>
		</view>
		<!-- #endif -->
		<view class='my-order' :style="{marginTop:marTop}">
			<view class='header'>
				<view class='picTxt acea-row row-between-wrapper'>
					<view class='text'>
						<view class='name'>ຂໍ້ມູນການສັ່ງຊື້</view>
						<view>ຄຳສັ່ງຊື້: {{orderData.orderCount || 0}} ລວມທັງໝົດ: ₭{{orderData.orderPrice || 0}}</view>
					</view>
					<view class='pictrue'>
						<image :src="`${domain}/static/images/orderTime.png`"></image>
					</view>
				</view>
			</view>
			<view class="order-position">
				<navigator class="search acea-row row-middle" url="/pages/users/order_list/search" hover-class="none">
					<text class="iconfont icon-ic_search"></text>
					ຄົ້ນຫາຄຳສັ່ງຊື້ຂອງຂ້ອຍ
				</navigator>
				<view class='nav acea-row row-around'>
					<view class='item' :class='orderStatus==-1 ? "on": ""' @click="statusClick(-1)">
						<view>ທັງໝົດ</view>
						<view class='num'>{{orderData.all || 0}}</view>
					</view>
					<view class='item' :class='orderStatus==0 ? "on": ""' @click="statusClick(0)">
						<view>ລໍຖ້າຈ່າຍເງິນ</view>
						<view class='num'>{{orderData.noPay || 0}}</view>
					</view>
					<view class='item' :class='orderStatus==1 ? "on": ""' @click="statusClick(1)">
						<view>ລໍຖ້າຈັດສົ່ງ/ຢືນຢັນ</view>
						<view class='num'>{{orderData.noPostage || 0}}</view>
					</view>
					<view class='item' :class='orderStatus==2 ? "on": ""' @click="statusClick(2)">
						<view>ກຳລັງຮອດ</view>
						<view class='num '>{{orderData.noDeliver || 0}}</view>
					</view>
					<view class='item' :class='orderStatus==3 ? "on": ""' @click="statusClick(3)">
						<view>ລໍຖ້າຄຳຕິຊົມ</view>
						<view class='num'>{{orderData.noComment || 0}}</view>
					</view>
				</view>
				<!--定金预售订单-->
				<view v-if="presellProList.length > 0" class="event_container" :style="{ 'background-image': `url(${domain}/static/images/presell_orderBg.png)`}">
					<navigator class="acea-row row-between" url="/pages/users/presell_order_list/index" hover-class='none' >
						<view class="info">
							<view class="title">ຄຳສັ່ງຊື້ເງິນຍອດທ້າຍຂອງການສັ່ງຈອງລ່ວງໜ້າຖືກໂອນມາທີ່ນີ້ແລ້ວ!</view>
							<view class="desc">ມີ <text class="t-color">{{ presellOrderCount }}</text> ຄຳສັ່ງຊື້ເງິນຍອດທ້າຍລໍຖ້າຈ່າຍເງິນ, ກະລຸນາຄລິກເພື່ອເບິ່ງ</view>
						</view>
						<view class="photo acea-row row-between">
							<view class='picture'>
								<image :src='(presellProList[0].orderProduct[0].cart_info.productAttr && presellProList[0].orderProduct[0].cart_info.productAttr.image) || presellProList[0].orderProduct[0].cart_info.product.image'></image>
							</view>
							<view class="more_btn acea-row row-center row-middle"><text class="iconfont icon-ic_rightarrow"></text></view>
						</view>
					</navigator>
				</view>
				<view class='list'>
					<!-- 代付款 -->
					<view v-if="orderList.length > 0">
						<block v-if="orderStatus == 0">
							<view class='item' v-for="(item,index) in orderList" :key="index">
								<view @click='goOrderDetails(item.group_order_id, item)'>
									<view class='title acea-row row-between-wrapper'>
										<view class="acea-row row-middle left-wrapper">
											{{item.group_order_sn}}
										</view>
										<view class='t-color'>{{ item.orderList[0].activity_type === 2 && item.orderList[0].orderProduct[0].cart_info.productPresell.presell_type ==2 ? "ລໍຖ້າຈ່າຍເງິນມັດຈຳ" : "ລໍຖ້າຈ່າຍເງິນ" }}</view>
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
															<text class="event_name event_bg">ຈອງລ່ວງໜ້າ</text><text>{{goods.cart_info.product.store_name}}</text>
															<view class="event_ship event_color">ເວລາຈັດສົ່ງ:
																<!--全款预售-->
																<text v-if="goods.cart_info.productPresell.presell_type === 1">
																	{{ goods.cart_info.productPresell.delivery_type === 1 ? 'ຫຼັງຈ່າຍເງິນສຳເລັດ' : 'ຫຼັງສິ້ນສຸດການຈອງລ່ວງໜ້າ' }}{{ goods.cart_info.productPresell.delivery_day }}ວັນ
																</text>
																<!--定金预售-->
																 <text v-if="goods.cart_info.productPresell.presell_type === 2">{{ goods.cart_info.productPresell.delivery_type === 1 ? 'ຫຼັງຈ່າຍເງິນຍອດທ້າຍ' : 'ຫຼັງສິ້ນສຸດການຈອງລ່ວງໜ້າ' }}{{ goods.cart_info.productPresell.delivery_day }}ວັນ</text>
															</view>
														</view>
														<view class='money'>
															<view class="regular">₭{{goods.cart_info.productPresellAttr.presell_price}}</view>
															<view>x{{goods.product_num}}</view>
														</view>
													</view>
													<view v-if="goods.cart_info.productPresell.presell_type === 2" class="event_price">
														 ເງິນມັດຈຳລໍຖ້າຈ່າຍ <text class="t-color">₭{{ order.pay_price }}</text>
														ເງິນຍອດທ້າຍລໍຖ້າຈ່າຍ <text class="t-color">₭{{ order.presellOrder.pay_price }}</text>
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
															<view class='name line2'>
																<text v-if="goods.product_type != 0 && goods.product_type != 10" :class="'font_bg-red type'+goods.product_type">{{goods.product_type == 1 ? "ແຟລຊເຊລ" : goods.product_type == 2 ? "ຈອງລ່ວງໜ້າ" : goods.product_type == 3 ? "ຊ່ວຍເຫຼືອ" : goods.product_type == 4 ? "ຊື້ຮ່ວມ" : ""}}</text>
																{{goods.cart_info.product.store_name}}
															</view>
															<view class='money' v-if="item.orderList[0].activity_type == 4">
																<view class="regular" v-if="goods.cart_info.activeSku">₭{{goods.cart_info.activeSku.active_price}}</view>
																<view>x{{goods.product_num}}</view>
															</view>
															<view v-else class='money'>
																<view class="regular">₭{{goods.cart_info.productAttr.price}}</view>
																<view>x{{goods.product_num}}</view>
															</view>
														</view>
													</view>
												</block>
											</view>
									</view>
									<view class='totalPrice acea-row row-right' v-if="item.orderList[0].activity_type !== 2">ລວມ {{item.total_num || 0}} ລາຍການສິນຄ້າ, ຍອດລວມ
										<priceFormat :price="item.pay_price" weight intSize="32" floatSize="22" labelSize="22"></priceFormat>
									</view>
									<view class='bottom acea-row row-right row-middle'>
										<view class='bnt b-color' @click.stop='goPay(item.pay_price,item.group_order_id)'>ຈ່າຍເງິນດຽວນີ້</view>
									</view>
								</view>
							</view>
						</block>
						<!-- 待发货 待收货 待评价 已完成 -->
						<block v-else>
							<view class='item' v-for="(item,index) in orderList" :key="index">
								<view @click='goOrderDetails(item.order_id, item)'>
									<view class='title acea-row row-between-wrapper'>
										<view class="acea-row row-middle left-wrapper" @click.stop="goMall(item)">
											<text class="iconfont icon-ic_mall"></text>
											<view class="store-name">{{item.merchant.mer_name}}</view>
											<text class="iconfont icon-ic_rightarrow"></text>
										</view>
										<view v-if="item.paid === 0" class="t-color">ລໍຖ້າຈ່າຍເງິນ</view>
										<template v-else>
											<view v-if="item.status == 0" class='t-color'>
												<text v-if="item.is_virtual ==4">ກຳລັງມອບໝາຍ</text>
												<block v-else>
													<text v-if="item.order_type==1">{{item.takeOrderCount > 0 ? 'ຢືນຢັນບາງສ່ວນ' : 'ລໍຖ້າຢືນຢັນ'}}</text>
													<text v-else-if="item.order_type==2">ລໍຖ້າຈັດສົ່ງ</text>
													<text v-else>ລໍຖ້າຈັດສົ່ງ</text>
												</block>
											</view>
											<view v-if="((item.status == 20 || (item.status == 1 && item.order_type == 1))) && item.is_virtual ==4" class='t-color'>
												<text>ລໍຖ້າຢືນຢັນ</text>
											</view>
											<view v-if="item.status == 1 && item.order_type==0" class='t-color'>{{item.is_virtual ==4  ? 'ລໍຖ້າບໍລິການ' : 'ກຳລັງຮອດ'}}</view>
											<view v-if="item.status == 1 && item.order_type==2" class='t-color'>ກຳລັງຈັດສົ່ງ</view>
											<view v-if="item.status == 2" class='t-color'>ລໍຖ້າຄຳຕິຊົມ</view>
											<view v-if="item.status == 3" class='t-color'>ສຳເລັດແລ້ວ</view>
											<view v-if="item.status == -1" class='t-color'>ຄືນເງິນແລ້ວ</view>
										</template>
									</view>
									<view v-if="item.activity_type === 2">
										<view class='item-info acea-row row-between row-top' v-for="(goods,index) in item.orderProduct" :key="index">
											<view class='pictrue'>
												<image :src='(goods.cart_info.productAttr && goods.cart_info.productAttr.image) || goods.cart_info.product.image'></image>
											</view>
											<view class='text acea-row row-between'>
												<view class='name '>
													<view class='name' :class="item.status === 0 ? 'line1' : 'line2'">
														<text class="event_name event_bg">ຈອງລ່ວງໜ້າ</text><text>{{goods.cart_info.product.store_name}}</text>
														<view v-if="item.status == 0" class="event_ship event_color">ເວລາຈັດສົ່ງ:
															<!--全款预售-->
															<text v-if="goods.cart_info.productPresell.presell_type === 1">{{ goods.cart_info.productPresell.delivery_type === 1 ? 'ຫຼັງຈ່າຍເງິນສຳເລັດ' : 'ຫຼັງສິ້ນສຸດການຈອງລ່ວງໜ້າ' }}{{ goods.cart_info.productPresell.delivery_day }}ວັນ</text>
															<!--定金预售-->
															<text v-if="goods.cart_info.productPresell.presell_type === 2">{{ goods.cart_info.productPresell.delivery_type === 1 ? 'ຫຼັງຈ່າຍເງິນຍອດທ້າຍ' : 'ຫຼັງສິ້ນສຸດການຈອງລ່ວງໜ້າ' }}{{ goods.cart_info.productPresell.delivery_day }}ວັນ</text>
														</view>
													</view>
													<view class="t-color refund-text">{{goods.is_refund==1?'ກຳລັງຄືນເງິນ':goods.is_refund==2?'ຄືນເງິນບາງສ່ວນ':goods.is_refund==3?'ຄືນເງິນທັງໝົດ':''}}</view>
												</view>
												<view class='money'>
													<view class="regular">₭{{goods.cart_info.productPresellAttr.presell_price}}</view>
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
														<text v-if="goods.product_type != 0 && goods.product_type != 10" :class="'font_bg-red type'+goods.product_type">{{goods.product_type == 1 ? "ແຟລຊເຊລ" : goods.product_type == 2 ? "ຈອງລ່ວງໜ້າ" : goods.product_type == 3 ? "ຊ່ວຍເຫຼືອ" : goods.product_type == 4 ? "ຊື້ຮ່ວມ" : ""}}</text>
														<text>{{goods.cart_info.product.store_name}}</text>
													</view>
													<view class="refund-text t-color">{{goods.is_refund==1?'ກຳລັງຄືນເງິນ':goods.is_refund==2?'ຄືນເງິນບາງສ່ວນ':goods.is_refund==3?'ຄືນເງິນທັງໝົດ':''}}</view>
												</view>
												<view class='money' v-if="item.activity_type == 3">
													<view class="regular" v-if="goods.cart_info.productAssistAttr">
														₭{{goods.cart_info.productAssistAttr.assist_price}}
													</view>
													<view>x{{goods.product_num}}</view>
												</view>
												<view class='money' v-else-if="item.activity_type == 4">
													<view class="regular" v-if="goods.cart_info.activeSku">₭{{goods.cart_info.activeSku.active_price}}</view>
													<view>x{{goods.product_num}}</view>
												</view>
												<view class='money' v-else>
													<view class="regular">₭{{goods.cart_info.productAttr.price}}</view>
													<view>x{{goods.product_num}}</view>
												</view>
											</view>
										</view>
									</view>
									<view class='totalPrice acea-row row-right' v-if="item.activity_type == 2">ລວມ {{item.orderNum || 0}} ລາຍການສິນຄ້າ, ຍອດລວມ
										<view class='money p-color'>
											<priceFormat :price="item.presell_price" weight intSize="32" floatSize="22" labelSize="22"></priceFormat>
										</view>
									</view>
									<view class='totalPrice acea-row row-right' v-else>ລວມ {{item.orderNum || 0}} ລາຍການສິນຄ້າ, ຍອດລວມ
										<view class='money p-color'>
											<priceFormat :price="item.pay_price" weight intSize="32" floatSize="22" labelSize="22"></priceFormat>
										</view>
									</view>
								</view>
								<view class='bottom acea-row row-right row-middle'>
									<template v-if="item.paid">
										<view v-if="!item.receipt && item.status != -1 && item.open_receipt == 1 && item.is_virtual!=1" class='bnt cancelBnt' @click.stop='applyInvoice(item.order_id)'>ສະໝັກອອກໃບແຈ້ງໜີ້</view>
										<block v-if="item.status == 0 || item.status == 9 || item.status == -1">
											<view class='bnt b-color' @click='goOrderDetails(item.order_id, item)'>ເບິ່ງລາຍລະອຽດ</view>
										</block>
										<block v-if="item.status == 1 && item.is_virtual != 4">
											<navigator class='bnt cancelBnt' v-if="item.delivery_type == 1 || item.delivery_type == 2"hover-class='none' :url="'/pages/users/goods_logistics/index?orderId='+ item.order_id">ເບິ່ງການຂົນສົ່ງ</navigator>
											<view class='bnt b-color' @tap='confirmOrder(item,index)'>ຢືນຢັນການຮັບສິນຄ້າ</view>
										</block>
										<block v-if="item.status == 2">
											<navigator v-if="community_status == 1 && !item.community_id" :url="'/pages/plantGrass/plant_release/index?order_id='+item.order_id" class='bnt colorBnt' hover-class="none">
												<text class="iconfont icon-ic_edit"></text>
												ເຜີຍແຜ່ລີວິວ
											</navigator>
											<view class='bnt b-color' @click='goOrderDetails_Evaluation(item.order_id)'>ໃຫ້ຄຳຕິຊົມ</view>
										</block>
										<block v-if="item.status == 3">
											<view class='bnt b-color' @click='goOrderDetails(item.order_id, item)' v-if="item.activity_type == 2 || item.activity_type == 3 || item.activity_type == 10">ເບິ່ງລາຍລະອຽດ</view>
											<navigator v-if="community_status == 1 && !item.community_id" :url="'/pages/plantGrass/plant_release/index?order_id='+item.order_id" class='bnt colorBnt' hover-class="none">
												<text class="iconfont icon-ic_edit"></text>
												ເຜີຍແຜ່ລີວິວ
											</navigator>
											<view v-else class='bnt b-color' @click='goOrderDetails(item.order_id, item)'>ຊື້ອີກຄັ້ງ</view>
										</block>
									</template>
									<view class='bnt b-color' @click.stop='goPay(item.pay_price,item.group_order_id)' v-else>ຈ່າຍເງິນດຽວນີ້</view>
								</view>
							</view>
						</block>
					</view>
				</view>
				<view class='loadingicon acea-row row-center-wrapper' v-if="orderList.length>5">
					<text class='loading iconfont icon-jiazai' :hidden='loading==false'></text>{{loadTitle}}
				</view>
				<view v-if="orderList.length == 0 && page > 1">
					<emptyPage title="ບໍ່ມີຄຳສັ່ງຊື້~" :noImage="`${domain}/static/images/noRecord.png`"></emptyPage>
				</view>
			</view>
		</view>
		<home></home>
		<payment :payMode='payMode' :pay_close="pay_close" @onChangeFun='onChangeFun' :order_id="pay_order_id" :totalPrice='totalPrice'></payment>
		<addInvoicing ref="addInvoicing" @changeInvoiceClose="changeInvoiceClose" :invoice='invoice'></addInvoicing>
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
	let sysHeight = uni.getSystemInfoSync().statusBarHeight + 'px';
	const f2ef6a = '';
	import {
		getOrderList,
		orderData,
		groupOrderList,
		orderTake,
		applyInvoiceApi,
		getOrderPayTypeList
	} from '@/api/order.js';
	import { openOrderSubscribe } from '@/utils/SubscribeMessage.js';
	import payment from '@/components/payment';
	import home from '@/components/home/index.vue';
	import addInvoicing from '@/components/addInvoicing';
	import { mapGetters } from "vuex";
	import emptyPage from '@/components/emptyPage.vue';
	import { configMap } from '@/utils'
	import { HTTP_REQUEST_URL } from '@/config/app';
	import { toLogin } from '@/libs/login.js';
	export default {
		components: {
			payment,
			emptyPage,
			home,
			addInvoicing
		},
		data() {
			return {
				loading: false, //是否加载中
				loadend: false, //是否加载完毕
				loadTitle: 'ໂຫຼດເພີ່ມເຕີມ', //提示语
				orderList: [], //订单数组
				presellProList: [], //定金预售订单
				presellOrderCount: 0,
				orderData: {}, //订单详细统计
				orderStatus: 0, //订单状态
				page: 1,
				limit: 20,
				domain: HTTP_REQUEST_URL,
				sysHeight: sysHeight,
				//#ifdef H5
				marTop: 0,
				//#endif
				//#ifdef MP
				marTop: uni.getSystemInfoSync().statusBarHeight+43+'px',
				//#endif
				//#ifdef APP-PLUS
				marTop: uni.getSystemInfoSync().statusBarHeight+'px',
				//#endif
				payMode: [],
				pay_close: false,
				pay_order_id: '',
				invoice_order_id: '',
				totalPrice: '0',
				isReady: true,
				invoice: {
					invoice: false,
					add: false,
				},
			};
		},
		computed: {
			...mapGetters(['isLogin','viewColor','orderPayList']),
			...configMap(['hide_mer_status', 'community_status']),
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
				this.pay_close = false;
				this.getOrderData();
				this.getOrderList();
				this.getpreSellOrderList();
			} else {
				toLogin()
			}
		},
		onReady(){
		},
		mounted: function() {
		},
		methods: {
			goBack: function() {
				uni.switchTab({
					url: '/pages/user/index',
				})
			},
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
			 * 打开支付组件
			 *
			 */
			goPay: function(pay_price, order_id) {
				this.order_id = order_id;
				this.pay_order_id = order_id.toString();
				this.$set(this, 'totalPrice', pay_price);
				this.$util.getPayTypeList(this.pay_order_id,0);
				this.$set(this, 'pay_close', true);
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
			goOrderDetails: function(order_id, order) {
				let self = this
				if (!order_id) return that.$util.Tips({
					title: 'ຂາດເລກທີ່ຄຳສັ່ງຊື້ບໍ່ສາມາດເບິ່ງລາຍລະອຽດໄດ້'
				});
				const notPaid = order?.paid === 0;
				if (notPaid) {
					order_id = order.group_order_id;
				}
				// #ifdef MP
				uni.showLoading({
					title: 'ກຳລັງໂຫຼດ',
				})
				openOrderSubscribe().then(() => {
					uni.hideLoading();
					if (self.orderStatus == 0 || notPaid) {
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
				if (self.orderStatus == 0 || notPaid) {
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
					title: 'ຂາດເລກທີ່ຄຳສັ່ງຊື້ບໍ່ສາມາດເບິ່ງລາຍລະອຽດແລະຄຳຕິຊົມໄດ້'
				});
				uni.navigateTo({
					url: '/pages/order_details/index?order_id=' + order_id
				})
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
				that.loadTitle = "ໂຫຼດເພີ່ມເຕີມ";
				uni.showLoading({
					title: 'ກຳລັງໂຫຼດ',
					mask: true
				});
				if(that.isReady){
					that.isReady = false
					if (that.orderStatus == 0) {
						groupOrderList({
							page: that.page,
							limit: that.limit,
						}).then(res => {
							that.isReady = true;
							uni.hideLoading()
							let list = res.data.list || [];
							let loadend = list.length < that.limit;
							that.orderList = that.page == 1 ? list : that.$util.SplitArray(list, that.orderList);
							that.$set(that, 'orderList', that.orderList);
							that.getProductCount();
							that.loadend = loadend;
							that.loading = false;
							that.loadTitle = loadend ? "我也是有底线的" : '加载更多';
							that.page = that.page + 1
						})
					} else {
						getOrderList({
							status: that.orderStatus - 1,
							page: that.page,
							limit: that.limit,
						}).then(res => {
							uni.hideLoading()
							let list = res.data.list || [];
							let loadend = list.length < that.limit;
							that.orderList = that.page == 1 ? list : that.$util.SplitArray(list, that.orderList);
							that.$set(that, 'orderList', that.orderList);
							that.getProductCount();
							that.loadend = loadend;
							that.loading = false;
							that.loadTitle = loadend ? "ໝົດແລ້ວ" : 'ໂຫຼດເພີ່ມເຕີມ';
							that.page = that.page + 1;
							that.isReady = true;
						}).catch(err => {
							that.loading = false;
							that.loadTitle = "ໂຫຼດເພີ່ມເຕີມ";
						})
					}
				}
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
			// 确认收货
			confirmOrder: function(item, index) {
				let that = this;
				uni.showModal({
					title: 'ຢືນຢັນການຮັບສິນຄ້າ',
					content: 'ເພື່ອປົກປ້ອງສິດຂອງທ່ານ, ກະລຸນາກວດສອບສິນຄ້າໃຫ້ຖືກຕ້ອງກ່ອນຢືນຢັນການຮັບສິນຄ້າ',
					success: function(res) {
						if (res.confirm) {
							orderTake(item.order_id).then(res => {
								return that.$util.Tips({
									title: 'ດຳເນີນການສຳເລັດ',
									icon: 'success'
								}, function() {
									that.orderList.splice(index, 1);
									that.getOrderData();
									that.page = 1;
									that.getOrderList();
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
			/*申请开票*/
			applyInvoice(order_id) {
				let that = this;
				that.invoice_order_id = order_id
				that.invoice.invoice = true;
				that.$refs.addInvoicing.popupTitle = false;
				that.$refs.addInvoicing.getInvoiceDefault();
				that.$refs.addInvoicing.getInvoiceList();
			},
			// 关闭发票弹窗
			changeInvoiceClose: function(data) {
				if(data)this.getInvoiceData(data);
				this.$set(this.invoice, 'invoice', false);
			},
			// 开票回调
			getInvoiceData(data) {
				let that = this
				applyInvoiceApi(that.invoice_order_id,data).then(res => {
					that.loadend = false;
					that.loading = false;
					that.page = that.page-1;
					that.getOrderList();
					return that.$util.Tips({
						title: res.message,
					});
				}).catch(err => {
					return that.$util.Tips({
						title: err
					});
				})
			}
		},
		onReachBottom: function() {
			this.getOrderList();
		}
	}
</script>

<style scoped lang="scss">
	.my-order .header {
		height: 370rpx;
		padding: 0 30rpx;
		background-color: #f5f5f5;
		background-image: linear-gradient( -90deg, var(--view-bntColor21) 0%,var(--view-bntColor22) 100%);
		position: relative;
		&::after {
			content: "";
			position: absolute;
			left: 0;
			bottom: 0;
			width: 100%;
			height: 86rpx;
			background: linear-gradient(0deg, #F5F5F5 0%, rgba(245, 245, 245, 0) 100%);
		}
	}
	.t-color{color: var(--view-theme);}
	.p-color{color: var(--view-priceColor);}
	.b-color{background-color:var(--view-theme);}
	.sys-head .bg{
		background-image: linear-gradient( -90deg, var(--view-bntColor21) 0%, var(--view-bntColor22) 100%);
	}
	.my-order .header .picTxt {
		height: 190rpx;
	}
	.my-order .header .picTxt .text {
		color: rgba(255, 255, 255, 0.8);
		font-size: 26rpx;
	}
	.my-order .header .picTxt .text .name {
		font-size: 34rpx;
		font-weight: bold;
		color: #fff;
		margin-bottom: 20rpx;
	}
	.my-order .header .picTxt .pictrue {
		width: 122rpx;
		height: 109rpx;
	}
	.my-order .header .picTxt .pictrue image {
		width: 100%;
		height: 100%;
	}
	.my-order .order-position {
		position: relative;
		margin-top: -170rpx;
		padding-bottom: 0;
		padding-bottom: calc(0rpx + constant(safe-area-inset-bottom));
		padding-bottom: calc(0rpx + env(safe-area-inset-bottom));
	}
	.my-order .nav {
		background-color: #fff;
		width: 690rpx;
		height: 140rpx;
		border-radius: 24rpx;
		margin: 20rpx auto 0 auto;
	}
	.my-order .nav .item {
		text-align: center;
		font-size: 26rpx;
		color: #282828;
		padding: 29rpx 0;
		height: 140rpx;
	}
	.my-order .nav .item.on {
		font-weight: bold;
		border-bottom: 5rpx solid var(--view-theme);
	}
	.my-order .nav .item .num {
		margin-top: 18rpx;
	}
	.my-order .list {
		width: 690rpx;
		margin: 20rpx auto 0 auto;
	}
	.my-order .list .item {
		background-color: #fff;
		border-radius: 24rpx;
		margin-bottom: 20rpx;
	}
	.my-order .list .item .title {
		height: 84rpx;
		padding: 0 30rpx;
		font-size: 28rpx;
		color: #282828;
		.left-wrapper {
			.iconfont {
				font-size: 28rpx;
			}
			.store-name {
				margin: 0 10rpx;
			}
			.icon-ic_rightarrow {
				font-size: 20rpx;
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
		border-radius: 16rpx;
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
	.my-order .list .item .item-info .refund-text {
		margin-top: 10rpx;
		font-size: 22rpx;
	}
	.my-order .list .item .item-info .text .name .font_bg-red{
		position: relative;
		top: -2px;
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
		font-size: 28rpx;
		margin-left: 6rpx;
	}
	.my-order .list .item .bottom {
		height: 107rpx;
		padding-right: 30rpx;
		margin-left: 30rpx;
	}
	.my-order .list .item .bottom .bnt {
		width: 176rpx;
		height: 64rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #fff;
		border-radius: 50rpx;
		font-size: 27rpx;
		font-size: 24rpx;
	}
	.my-order .list .item .bottom .bnt.cancelBnt {
		border: 1px solid #ddd;
		color: #666666;
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
	.noCart {
		margin-top: 171rpx;
		padding-top: 0.1rpx;
	}
	.noCart .pictrue {
		width: 414rpx;
		height: 336rpx;
		margin: 78rpx auto 56rpx auto;
	}
	.noCart .pictrue image {
		width: 100%;
		height: 100%;
	}
	.event_container{
		width: 690rpx;
		background-size: cover;
		background-repeat: no-repeat;
		margin: 20rpx auto;
		padding: 30rpx 30rpx 24rpx;
		border-radius: 16rpx;
		.info{
			width: 420rpx;
			.title{
				color: #282828;
				font-size: 26rpx;
				font-weight: 500;
			}
			.desc{
				color: #999;
				font-size: 24rpx;
				margin-top: 16rpx;
			}
		}
		.photo{
			width: 144rpx;
			.picture{
				width: 76rpx;
				height: 76rpx;
				image{
					width: 100%;
					height: 100%;
					border-radius: 8rpx;
				}
			}
			.more_btn{
				color: #fff;
				background: #F97E3B;
				width: 40rpx;
				height: 40rpx;
				border-radius: 40rpx;
				text-align: center;
				position: relative;
				top: 18rpx;
				text{
					font-size: 20rpx;
				}
			}
		}
	}
	.search {
		height: 70rpx;
		padding: 0 30rpx;
		border-radius: 35rpx;
		margin: -35rpx 30rpx 0;
		background-color: #FFFFFF;
		font-size: 26rpx;
		color: #999999;
		.iconfont {
			margin-right: 10rpx;
			font-size: 23rpx;
		}
	}
	.empty-box {
		padding-top: 0;
	}
</style>
