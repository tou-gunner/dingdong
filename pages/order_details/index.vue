<template>
	<view :style="viewColor">
		<!-- 自定义顶部背景颜色 -->
		<view class="top">
			<!-- #ifdef MP || APP-PLUS -->
			<view class="sys-head fixed" :class="{'refund-head' : orderInfo.status == -1}">
				<view class="sys-bar" :style="{height:sysHeight}"></view>
				<!-- #ifdef MP -->
				<view class="sys-title">
					<view class='iconfont icon-ic_leftarrow' :style="{lineHeight:sysHeight}" @tap='goBack'></view>
					订单详情
				</view>
				<!-- #endif -->
				<view class="bg"></view>
			</view>
			<!-- #endif -->
		</view>
		<view class='order-details' :style="{marginTop:marTop}">
			<!-- 给header上与data上加on为退款订单-->
			<!--预售-->
			<view :class="{headerCount : orderInfo.status != -1}"></view>
			<view :class="{'order-main' : orderInfo.status != -1}">
				<view v-if="orderInfo.activity_type == 2 && (orderInfo.status == 10 || orderInfo.status == 11)" class='header presell_header'>
					<view class="presell_payment">
						<text class="iconfont icon-icon_clock-2"></text>
						{{ orderInfo.status == 11 ? '交易已关闭' : '待付尾款' }}
					</view>
					<view class='data' style="margin-left: 0;">
						<view class='state'>请在{{orderInfo.orderProduct[0].cart_info.productPresell.final_end_time}}前完成支付,超时订单将自动取消</view>
					</view>
				</view>
				<view v-else class="header-gradient">
					<view class='header acea-row row-middle row-between' :class='isGoodsReturn ? "on":""'>
						<view class='data' :class='isGoodsReturn ? "on":""'>
							<view class='state'>
								<block v-if="orderInfo.status == 0  && orderInfo.order_type == 0">{{orderInfo.is_virtual == 4 ? '待服务' : '待发货'}}</block>
								<!-- order_type 0: 快递 1: 自提 2: 同城 -->
								<block v-if="orderInfo.status == 0 && orderInfo.order_type == 2">{{orderInfo.is_virtual == 4 ? '待服务' : '待配送'}}</block>

								<block v-if="orderInfo.status == 9">等待其他人参加拼团</block>
								<block v-if="orderInfo.status == 0 && orderInfo.order_type == 1">{{orderInfo.is_virtual != 4 ? '待核销' : '待服务'}}</block>


								<!-- <block v-if="orderInfo.status == 20 && orderInfo.is_virtual == 4">{{orderInfo.order_type == 1 ? '待核销' : '已打卡'}}</block> -->
								<block v-if="orderInfo.status == 20 && orderInfo.is_virtual == 4">待核销</block>
								<block v-if="orderInfo.order_type != 2">
									<block v-if="orderInfo.status == 1">{{orderInfo.is_virtual == 1 ? '服务商品已虚拟发货' : orderInfo.is_virtual == 4 ? '待服务' : '待收货'}}</block>
								</block>
								<!-- 如果是同城配送则再判断是否为配送中 -->
								<block v-if="orderInfo.order_type == 2 && orderInfo.deliveryOrder && orderInfo.deliveryOrder.status == 3">配送中</block>
								<block v-if="orderInfo.status == 2">待评价</block>
								<block v-if="orderInfo.status == 3">已完成</block>
								<block v-if="orderInfo.status == -1">已为您退款,感谢您的支持</block>
							</view>
							<view v-if="orderInfo.is_virtual!= 4 && orderInfo.order_type != 2">{{orderInfo.pay_time}}</view>
							<view v-else-if="orderInfo.order_type == 2 && orderInfo.deliveryOrder && orderInfo.deliveryOrder.status == 3">商家正在配送，请等待收货</view> <!-- 如果是同城配送，则显示文本-->
							<view v-else-if="orderInfo.is_virtual == 4">预约时间： {{orderInfo.orderProduct[0].reservation_date}} {{orderInfo.orderProduct[0].reservation_time_part}}</view>

						</view>
						<view class='pictrue reservation-pictrue'>
							<image v-if="orderInfo.status==0 && (orderInfo.is_virtual!=4&&orderInfo.order_type!=1)" class="shipping-img" :src="orderInfo.is_virtual == 4 ? imgUrl+'/static/order_status0.png' : imgUrl+'/static/wait_shipping.png'"></image>
							<image v-else-if="(orderInfo.status == 0 && orderInfo.order_type == 1) || (orderInfo.status == 20 && orderInfo.is_virtual == 4)" :src="imgUrl+'/static/order_status0.png'"></image>
							<image v-else-if="orderInfo.status!=20" :src="imgUrl+'/static/order_status'+(orderInfo.status)+'.png'"></image>
							<image v-else :src="imgUrl+'/static/order_status14.png'"></image>
						</view>
					</view>
					<block v-if="isGoodsReturn==false">
						<view v-if="orderInfo.is_virtual == 4" class='nav'>
							<!-- orer_type 1 到店 -->
							<view class='navCon acea-row row-between-wrapper'>
								<view class="nav-text">待付款</view>
								<view class="nav-text" :class="orderInfo.status == 0 ? 'on':''">待服务</view>
								<view class="nav-text" :class="orderInfo.status == 20 || (orderInfo.order_type==1 && orderInfo.status == 1) ? 'on':''">待核销</view>
								<view class="nav-text" :class="orderInfo.status == 2 ? 'on':''">待评价</view>
								<view class="nav-text" :class="orderInfo.status == 3 ? 'on':''">已完成</view>
							</view>
							<view class='progress acea-row row-between-wrapper'>
								<view class='iconfont icon-ic_jindu2 t-color'></view>
								<view class='line b-color'></view>
								<view class='iconfont' :class='(orderInfo.status == 0  ? "icon-ic_jindu1":"icon-ic_jindu2") + " " + (orderInfo.status == 20 || orderInfo.status == 1 || orderInfo.status == 0 || orderInfo.status >=2 ? "t-color":"")'></view>
								<view class='line' :class='orderInfo.status >= 1 ? "b-color":""'></view>
								<view class='iconfont' :class='((orderInfo.order_type == 0 && orderInfo.status == 20) || (orderInfo.order_type == 1 && orderInfo.status == 1) ? "icon-ic_jindu1":"icon-ic_jindu2") + " " +((orderInfo.order_type == 0 && orderInfo.status == 20) || (orderInfo.order_type == 1 && orderInfo.status == 1) || orderInfo.status == 2 || orderInfo.status == 3 ? "t-color":"")'></view>
								<view class='line' :class='orderInfo.status > 1 && (orderInfo.order_type == 1 || (orderInfo.order_type == 0 && orderInfo.status != 20)) ? "b-color":""' ></view>
								<view class='iconfont' :class='(orderInfo.status == 2 ? "icon-ic_jindu1":"icon-ic_jindu2") + " " + (orderInfo.status >= 2 && orderInfo.status != 20 ? "t-color":"")'></view>
								<view class='line' :class='orderInfo.status > 2 && orderInfo.status != 20 ? "b-color":""'></view>
								<view class='iconfont' :class='(orderInfo.status == 3 && orderInfo.status != 20  ? "icon-ic_jindu1":"icon-ic_jindu2") + " " + (orderInfo.status >= 3 && orderInfo.status != 20  ? "t-color":"")'></view>
							</view>
						</view>
						<view v-else class='nav'>
							<view class='navCon acea-row row-between-wrapper'>
								<view class="nav-text">待付款</view>
								<view class="nav-text" :class="(orderInfo.status == 0 || orderInfo.status == 9) ? 'on':''" v-if="orderInfo.order_type != 1">{{orderInfo.order_type == 2 ? '待配送' : '待发货'}}</view>
								<view class="nav-text" :class="(orderInfo.status == 0 || orderInfo.status == 9) ? 'on':''" v-if="orderInfo.order_type == 1">待核销</view>
								<view class="nav-text" :class="orderInfo.status == 1 ? 'on':''" v-if="orderInfo.order_type != 1">{{orderInfo.order_type == 2 ? '配送中' : '待收货'}}</view>
								<view class="nav-text" :class="orderInfo.status == 2 ? 'on':''">待评价</view>
								<view class="nav-text" :class="orderInfo.status == 3 ? 'on':''">已完成</view>
							</view>
							<view class='progress acea-row row-between-wrapper'>
								<view class='iconfont icon-ic_jindu2 t-color'></view>
								<view class='line b-color'></view>
								<view class='iconfont' :class='((orderInfo.status == 0 || orderInfo.status == 9) ? "icon-ic_jindu1":"icon-ic_jindu2") + " " + (orderInfo.status >= 0 ? "t-color":"")'></view>
								<view class='line' :class='orderInfo.status > 0 && orderInfo.status != 9 ? "b-color":""'></view>
								<view class='iconfont' :class='(orderInfo.status == 1 ? "icon-ic_jindu1":"icon-ic_jindu2") + " " +(orderInfo.status >= 1 && orderInfo.status != 9 ? "t-color":"")'  v-if="orderInfo.order_type != 1"></view>
								<view class='line' :class='orderInfo.status > 1 && orderInfo.status != 9 ? "b-color":""'  v-if="orderInfo.order_type != 1"></view>
								<view class='iconfont' :class='(orderInfo.status == 2 && orderInfo.status != 9 ? "icon-ic_jindu1":"icon-ic_jindu2") + " " + (orderInfo.status >= 2 && orderInfo.status != 9 ? "t-color":"")'></view>
								<view class='line' :class='orderInfo.status > 2 && orderInfo.status != 9 ? "b-color":""'></view>
								<view class='iconfont' :class='(orderInfo.status == 3 ? "icon-ic_jindu1":"icon-ic_jindu2") + " " + (orderInfo.status >= 3 && orderInfo.status != 9 ? "t-color":"")'></view>
							</view>
						</view>
					</block>
				</view>
				<view class="pad20">
					<!--预约商品-->
					<block v-if="orderInfo.is_virtual == 4">
						<!-- <view class="reserve-box boder-24 bg-f mt-20">
							<view class="reserve-info-box">
								<view  class="reserve-info">
									<view class="reserve-name">
										<text class="iconfont icon-a-ic_user1"></text>
										<text>{{orderInfo.staffs.name}}</text>
										<text class="ml-20">{{orderInfo.staffs.phone}}</text>
									</view>
									<view class="mer-name">
										<text class="iconfont icon-ic_mall"></text>
										{{111}}
									</view>
								</view>
								<view class="same-city-map-box">
									<view class="map-content">
										<view class="dsitance">
										</view>
										<view class="triangle"></view>
										<view class="shop-logo-box">
											<image class="shop-logo" :src="orderInfo.merchant.mer_avatar">
											</image>
										</view>
										<view class="triangle"></view>
										<view class="point"></view>
									</view>
								</view>
							</view>
							<view class="mer-info-box">
								<view class="mer-address-box">
									<view class="mer-address fs-24">
										地址：{{orderInfo.merchant.mer_address}}
									</view>
									<view class="copy-btn fs-22">

									</view>
								</view>
								<view class="mer-time-box fs-24">
									营业时间：{{`${orderInfo.merchant.mer_take_time[0]}-${orderInfo.merchant.mer_take_time[1]}`}}
								</view>
							</view>
							<view class="footer-box flex-box">
								<view class="phone" @click="makePhone(orderInfo.merchant.mer_take_phone)">
									<text class="iconfont icon-ic_phone fs-24"></text>
									<text class="fs-24">联系商家</text>
								</view>
								<view class="navigation" @click="showMaoLocation('mer')">
									<text class="iconfont icon-ic_location fs-24"></text>
									<text class="fs-24">导航至商家</text>
								</view>
							</view>
						</view>
						-->
						<reservationInfo
							ref="reservationInfo"
							:domain="imgUrl"
							:orderInfo="orderInfo"
							@copy="copy"
							@makePhone="makePhone"
							@showMaoLocation="showMaoLocation" />
						<!-- 核销码 -->
						<reservationCode
							v-if="orderInfo.status != 2 && orderInfo.status != 3 && orderInfo.status != -1"
							ref="reservationCode"
							class="mt-20"
							@copy="copy"
							:codeUrl="codeUrl"
							:verifyVal="orderInfo.verify_code" />
					</block>
					<block v-else>
						<!-- 配送地址 -->
						<block v-if="orderInfo.order_type != 0">
							<block v-if="orderInfo.take">
								<view class="take-point-box boder-24 bg-f mt-20">
									<view class="address-title acea-row row-middle">
										<text class="iconfont icon-ic_truck"></text>
										<block v-if="orderInfo.order_type == 2">
											<text class="text-title">门店配送</text>
											<text class="text-content">线上下单，门店为您配送</text>
										</block>
										<block v-if="orderInfo.order_type == 1">
											<text class="text-title">到店自提</text>
											<text class="text-content">请尽快前往自提点取货</text>
										</block>
									</view>
									<view class="same-city-address">
										<view v-if="orderInfo.take" class="shop-info">
											<view class="shop-name">{{orderInfo.take.station_name}}</view>
											<view class="shop-address">{{orderInfo.take.station_address}}</view>
											<text class="marks" v-if="!isInBusinessHours(orderInfo.take.business_time_start, orderInfo.take.business_time_end)">
												自提点已打烊，
											</text>
											<text class="marks">营业时间：{{`${orderInfo.take.business_time_start}-${orderInfo.take.business_time_end}`}}</text>
										</view>
										<view v-if="orderInfo.merchant_take_info" class="same-city-map-box">
											<view class="map-content">
												<view class="dsitance">
													距您{{orderInfo.merchant_take_info[orderInfo.mer_id].distance}}
												</view>
												<view class="triangle">

												</view>
												<view class="shop-logo-box">
													<image class="shop-logo" :src="orderInfo.merchant.mer_avatar">
													</image>
												</view>
												<view class="triangle">
												</view>
												<view class="point">
												</view>
											</view>
										</view>
									</view>
									<view v-if="orderInfo.order_type != 0" class="footer-box flex-box">
										<view class="phone" @click="makePhone(orderInfo.take.phone)">
											<text
												class="iconfont icon-ic_phone fs-24"></text>
											<text class="fs-24">联系自提点</text>
										</view>
										<view class="navigation" @click="showMaoLocation('take')">
											<text class="iconfont icon-ic_location fs-24"></text>
											<text class="fs-24">导航至自提点</text>
										</view>
									</view>
								</view>
							</block>
						</block>
						<block v-else>
							<view class="address boder-24 bg-f mt-20" v-if="orderInfo.order_type == 0 && orderInfo.is_virtual != 1 && orderInfo.is_virtual != 3">
								<view class='name acea-row row-middle'>
									<view>{{orderInfo.real_name}}</view>
									<view class='phone'>{{orderInfo.user_phone}}</view>
								</view>
								<view class="address-info">{{orderInfo.user_address}}</view>
							</view>
							<view v-if="orderInfo.order_type == 0" class='line'>
								<image :src="`${imgUrl}/static/images/line.jpg`"></image>
							</view>
						</block>
						<!-- 核销码 -->
						<block v-if="orderInfo.order_type == 1">
							<reservationCode
								v-if="orderInfo.status != 2 && orderInfo.status != 3 && orderInfo.status != -1"
								ref="reservationCode"
								@copy="copy"
								:codeUrl="codeUrl"
								:verifyVal="orderInfo.verify_code"
								class="mt-20"
							/>
						</block>

						<!-- 地图 -->
						<!-- <view class="boder-24 bg-f">
							<view class="map acea-row row-between-wrapper" v-if="orderInfo.order_type == 1">

								<view>自提地址信息</view>
								<view class="place t-color acea-row row-center-wrapper" @tap="showMaoLocation">
									<text class="iconfont icon-ic_location1"></text>查看位置
								</view>
							</view>
							<view class='address' v-if="orderInfo.order_type == 1" style="margin-top: 0;">
								<view class='name'>
									{{orderInfo.merchant.mer_name}}
									<text class='phone' @click="makePhone(orderInfo.merchant.mer_take_phone)">{{orderInfo.merchant.mer_take_phone}}</text>
									<view class="phonenumber">
										<text class="iconfont icon-a-icon_phonenumber" @click="makePhone(orderInfo.merchant.mer_take_phone)"></text>
									</view>
								</view>
								<!== <view class="line2">{{orderInfo.take.station_address}}</view> ==>
								<view class="line2">{{orderInfo.merchant.mer_take_address}}</view>
							</view>
							<view v-if="orderInfo.order_type == 1 && orderInfo.take" class="take-info">
								<view class="take-msg">
									<view class="left">
										<view class="title">
											营业时间
										</view>
										<view class="text">
											<text v-if="orderInfo.take.business_date && orderInfo.take.business_date.length == 7">周一至周日：</text>
											<block v-else>
												<text v-for="item in orderInfo.take.business_date">{{'周'+ toChinese(item)}},</text>
											</block>
											<text class="time" v-if="orderInfo.take.business_time_end && orderInfo.take.business_time_start">
												{{orderInfo.take.business_time_start}}-{{orderInfo.take.business_time_end}}
											</text>
										</view>
									</view>
									<view v-if="orderInfo.status == 0 || orderInfo.status == 9" class="code" @click="showCode">
										<text class="iconfont icon-a-ic_QRcode"></text>
										<view class="text">
											自提码
										</view>
									</view>
								</view>
							</view>
						</view> -->
					</block>
					<view class="mt-20">
						<view class="merchant bg-f" v-if="orderInfo.merchant && (orderInfo.order_type != 1 || orderInfo.is_virtual == 4)" @click="goStore(orderInfo.mer_id)">
							<view class="acea-row row-middle">
								<text class="iconfont icon-ic_mall"></text>
								<view class="txt">{{orderInfo.merchant.mer_name}}</view>
								<text class="iconfont icon-ic_rightarrow"></text>
							</view>
						</view>
						<block v-if="cartInfo.length>0">
							<orderGoods :orderData='orderInfo' :evaluate='orderInfo.status' :activityType='orderInfo.activity_type' :orderId="order_id" :cartInfo="cartInfo" :jump="true"></orderGoods>
							<block v-if="orderInfo.order_type == 1 && orderInfo.takeOrderList && orderInfo.takeOrderList.length > 0" v-for="(item,index) in orderInfo.takeOrderList" :key="index">
								<orderGoods :orderData='item' :evaluate='item.status' :activityType='item.activity_type' :orderId="item.order_id" :cartInfo="item.orderProduct" :jump="true"></orderGoods>
							</block>
						</block>
					</view>
					<!-- 收货信息 -->
					<view
						class="receive-info-box bg-f boder-24 mt-20"
						v-if="orderInfo.order_type == 2"
					>
						<text class="title">收货信息</text>
						<view class="take-point-item">
							<text class="item-title">收货人名称</text>
							<text class="item-content">{{orderInfo.real_name}}</text>
						</view>
						<view class="take-point-item">
							<text class="item-title">联系电话</text>
							<text class="item-content">
								{{orderInfo.user_phone}}
							</text>
						</view>
						<view class="take-point-item">
							<text class="item-title">收货地址</text>
							<text class="item-content">{{orderInfo.user_address}}</text>
						</view>
						<view v-if="orderInfo.deliveryOrder && orderInfo.deliveryOrder.finish_code != ''" class="take-point-item">
							<text class="item-title">收货码</text>
							<text class="item-content">{{orderInfo.deliveryOrder.finish_code}}</text>
						</view>
					</view>
					<!-- 送货信息 -->
					<view
						class="delivery-info-box bg-f boder-24 mt-20"
						v-if="orderInfo.order_type == 2 && orderInfo.status == 1 && orderInfo.deliveryOrder.deliveryService"
					>
						<text class="title">送货信息</text>
						<view class="delivery-info-item">
							<text class="item-title">配送员</text>
							<text class="item-content">{{orderInfo.deliveryOrder.deliveryService.name}}</text>
						</view>
						<view class="delivery-info-item">
							<text class="item-title">联系电话</text>
							<text class="item-content">
								{{orderInfo.deliveryOrder.deliveryService.phone}}
								<text class="iconfont icon-ic_phone" @click="makePhone(orderInfo.deliveryOrder.deliveryService.phone)"></text>
							</text>
						</view>
						<view class="delivery-info-item">
							<text class="item-title">送达时间</text>
							<text class="item-content">{{deliveryTimeText}}</text>
						</view>
					</view>
					<!--预约商品-->
					<reservationForm v-if="orderInfo.is_virtual == 4" ref="reservationForm" :extendForm="orderInfo.order_extend" :orderInfo="orderInfo" @getPhotoClickIdx="getPhotoClickIdx"/>
					<block v-else>
						<!--卡密商品发货-->
						<view v-if="orderInfo.delivery_type == 6 && orderInfo.delivery_id" class='wrapper boder-24'>
							<view class='item acea-row row-between'>
								<view>卡密发货：</view>
								<view class="item acea-row">
									<view class="conter">
										<!-- #ifndef H5 -->
										<text class='copy' @tap='copyKm'>复制</text>
										<!-- #endif -->
										<!-- #ifdef H5 -->
										<text class='copy copy-data' :data-clipboard-text="orderInfo.delivery_id">复制</text>
										<!-- #endif -->
									</view>
								</view>
							</view>
							<view class="item acea-row">
								<view style="color:#999;">卡密已自动发放 <view>{{orderInfo.delivery_id}}</view></view>
							</view>
						</view>
						<!-- 送货 -->
						<view class="wrapper boder-24" v-if="orderInfo.delivery_type == 2">
							<view class='item acea-row row-between'>
								<view>配送方式：</view>
								<view class='conter'>送货</view>
							</view>
							<view class='item acea-row row-between'>
								<view>配送员：</view>
								<view class='conter'>{{orderInfo.delivery_name}}</view>
							</view>
							<view class='item acea-row row-between'>
								<view>联系电话：</view>
								<view class='conter'>{{orderInfo.delivery_id}}</view>
							</view>
						</view>
						<!-- 同城配送 -->
						<!-- <view v-if="orderInfo.delivery_type == 5" class="wrapper boder-24">
							<view class='item virtual_item'>
								<view class="acea-row virtual_row">
									<view>
										<image :src="`${imgUrl}/static/images/delivery_man.png`"></image>
									</view>
									<view v-if="orderInfo.delivery_id" class="virtual_delivery">
										<view>{{orderInfo.delivery_name}}</view>
										<view>{{orderInfo.delivery_id}}</view>
									</view>
									<view v-else class="virtual_delivery_not">配送员未接单</view>
								</view>
								<navigator class="virtual_detail" hover-class="none"
								:url="'/pages/order_details/delivery?orderId=' + orderInfo.order_id">查看详情</navigator>
							</view>
						</view> -->
						<view v-if="orderInfo.remark" class="wrapper boder-24">
							<view class="item acea-row row-between">
								<view class="">发货备注：</view>
								<view class="conter remark">{{ orderInfo.remark }}</view>
							</view>
						</view>
					</block>
					<view class='wrapper boder-24'>
						<view class='item acea-row row-between'>
							<view>订单编号：</view>
							<view class='conter acea-row row-middle row-right'>{{orderInfo.order_sn}}
								<!-- #ifndef H5 -->
								<text class='copy' @tap='copy(orderInfo.order_sn)'>复制</text>
								<!-- #endif -->
								<!-- #ifdef H5 -->
								<text class='copy copy-data' :data-clipboard-text="orderInfo.order_sn">复制</text>
								<!-- #endif -->
							</view>
						</view>
						<view class='item acea-row row-between'>
							<view>下单时间：</view>
							<view class='conter'>{{orderInfo.create_time}}</view>
						</view>
						<view class='item acea-row row-between'>
							<view>支付状态：</view>
							<view class='conter'>已支付</view>
						</view>
						<view class='item acea-row row-between' v-if="orderInfo.pay_time">
							<view>支付时间：</view>
							<view class='conter'>{{orderInfo.pay_time}}</view>
						</view>
						<!-- <view class='item acea-row row-between'>
							<view>商品总额：</view>
							<view class='conter'>¥{{orderInfo.total_price}}</view>
						</view> -->
						<view class='item acea-row row-between'>
							<view>支付方式：</view>
							<view class='conter' v-if="orderInfo.pay_type==0">余额支付</view>
							<view class='conter' v-if="orderInfo.pay_type==7">线下支付</view>
							<view class='conter' v-if="orderInfo.pay_type==4 || orderInfo.pay_type==5">支付宝支付</view>
							<view class='conter' v-if="orderInfo.pay_type==1 || orderInfo.pay_type==2 || orderInfo.pay_type==3">微信支付</view>
						</view>
						<view class='item acea-row row-between' v-if="orderInfo.mark">
							<view>买家留言：</view>
							<view class='conter'>{{orderInfo.mark}}</view>
						</view>
					</view>
					<view v-if="orderInfo.order_extend && orderInfo.is_virtual != 4" class='wrapper boder-24'>
						<block v-for="(item,index) in orderInfo.order_extend" v-if="item" :key="index">
							<view v-for="(itm,idx) in item" v-if="itm" :key="idx" class='item acea-row row-between'>
								<view>{{idx}}：</view>
								<view v-if="!Array.isArray(itm)" class='conter'>{{itm}}</view>
								<view v-else class='conter virtual_image'>
									<image v-for="(pic,i) in itm" :key="i" class="picture" :src="pic" @click="getPhotoClickIdx(itm,idx)"></image>
								</view>
							</view>
						</block>
					</view>
					<view class='wrapper boder-24'>
						<view class='item acea-row row-between' v-if="orderInfo.pay_postage > 0 && orderInfo.order_type != 1">
							<view>运费：</view>
							<view class='conter'>+¥{{orderInfo.pay_postage}}</view>
						</view>
						<view class='item acea-row row-between'>
							<view>商品总额：</view>
							<view class='conter'>¥{{orderInfo.total_price}}</view>
						</view>
						<view class='item acea-row row-between' v-if='orderInfo.coupon_price > 0'>
							<view>优惠券抵扣：</view>
							<view class='conter'>-¥{{orderInfo.coupon_price}}</view>
						</view>
						<view class='item acea-row row-between' v-if='orderInfo.integral'>
							<view>积分抵扣：</view>
							<view class='conter'>-¥{{orderInfo.integral_price}}</view>
						</view>
						<view class='item acea-row row-between' v-if="orderInfo.activity_type == 2">
							<view>实付款：</view>
							<view class='conter'>¥{{orderInfo.presell_price}}</view>
						</view>
						<view class='item acea-row row-between' v-else>
							<view>实付款：</view>
							<view class='conter'>¥{{orderInfo.pay_price}}</view>
						</view>
						<view class='item acea-row row-between'>
							<view></view>
							<view v-if="!orderInfo.receipt && orderInfo.open_receipt == 1" class='bnt cancels' @click="applyInvoice">申请开票</view>
						</view>
					</view>
				</view>
			</view>
			<view class="content-clip" v-if="isGoodsReturn==false && showBtn"></view>

			<view class='footer acea-row row-between row-middle' v-if="isGoodsReturn==false && showBtn">
				<!-- <view v-if="(orderInfo.is_virtual!=4 && (![1, 2, 3, 4, 10].includes(orderInfo.activity_type))) || orderInfo.status == 1" class="bnt more" @click="isMore = !isMore"> -->
				<view
					v-if="!([-1,2,3].includes(orderInfo.status) || (orderInfo.order_type == 2 && orderInfo.status == 1)) && refundNum.length != cartInfo.length && orderInfo.refund_status && orderInfo.refund_switch && !orderInfo.cancel_status"
					class="bnt more"
					@click="isMore = !isMore"
				>
					更多
				</view>
				<view v-if="isMore" class="toggle-btn">
					<view
						v-if="!([-1,2,3].includes(orderInfo.status) || (orderInfo.order_type == 2 && orderInfo.status == 1)) && refundNum.length != cartInfo.length && orderInfo.refund_status && orderInfo.refund_switch && !orderInfo.cancel_status"
						class="bnts"
						@click="allRefund"
						>批量退款</view
					>
				</view>
				<view v-else></view>
				<view class="acea-row row-right row-middle">
					<view v-if="orderInfo.is_virtual == 4 && orderInfo.cancel_status" class='bnt cancel' @click="cancelReservation">取消预约</view>
					<view v-if="orderInfo.activity_type == 2 && (orderInfo.status == 10 || orderInfo.status == 11)" class=" acea-row row-right row-middle" style="margin-left: 17rpx;">
						<view v-if="orderInfo.presellOrder.activeStatus == 0" class='bnt b-color btn_auto'>{{ orderInfo.presellOrder.final_start_time | filterDay }} 付尾款</view>
						<view v-if="orderInfo.presellOrder.activeStatus == 1" class='bnt b-color' @tap='pay_open'>立即付款</view>
						<view v-if="orderInfo.presellOrder.activeStatus == 2 && orderInfo.is_virtual != 4" class='bnt cancel' @click="cancelOrder">取消订单</view>
					</view>
					<block v-if="orderInfo.status == 9">
						<view class="bnt cancel" @click="getCombinationRemove">取消拼团</view>
					</block>
					<view class='bnt cancel' v-if="orderInfo.activity_type==4" @tap='goJoinPink'>查看拼团</view>
					<view v-if="orderInfo.status == 3" class='bnt cancel' @click="delOrder">删除订单</view>
					<navigator v-if="(orderInfo.status == 0 || orderInfo.status == 1) && orderInfo.delivery_type == 1 || orderInfo.delivery_type == 4 && orderInfo.is_virtual != 4" class='bnt cancel' hover-class='none' :url="'/pages/users/goods_logistics/index?orderId='+ orderInfo.order_id">查看物流</navigator>
					<view class='bnt cancel' @click="goOrderConfirm" v-if="orderInfo.is_virtual!=4 && (![1, 2, 3, 4, 10].includes(orderInfo.activity_type))">再次购买</view>
					<view v-if="orderInfo.status == 1" class='bnt b-color' @tap='confirmOrder'>确认收货</view>

				</view>
			</view>
		</view>
		<payment :payMode='payMode' :pay_close="pay_close" @onChangeFun='onChangeFun' :order_id="pay_order_id" :totalPrice='totalPrice' :order_type='1'></payment>
		<addInvoicing ref="addInvoicing" @changeInvoiceClose="changeInvoiceClose" :invoice='invoice'></addInvoicing>
		<!--核销码弹窗-->
		<uni-popup ref="cancellPoupon" type="bottom">
			<view class="code-content">
				<text class="iconfont popup-close icon-ic_close" @click="close"></text>
				<view class="title font-500">核销码</view>
				<view class="trip">
					请将二维码展示给店员 或 提供数字核销码
				</view>
				<view class="grayBg">
					<view class="pictrue">
						<image :src="codeUrl"></image>
					</view>
				</view>
				<view v-if="orderInfo.verify_code" class="num">{{orderInfo.verify_code}}</view>
			</view>
		</uni-popup>
		<home></home>
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
	import { HTTP_REQUEST_URL } from '@/config/app';
	import {
		getOrderDetail,
		orderAgain,
		orderTake,
		orderDel,
		unOrderCancel,
		verifyCode,
		applyInvoiceApi,
		groupOrderDetail,
	} from '@/api/order.js';
	import { postCombinationRemove, cancelReservationApi } from '@/api/activity';
	import { openOrderRefundSubscribe } from '@/utils/SubscribeMessage.js';
	import payment from '@/components/payment';
	import orderGoods from "@/components/orderGoods";
	import ClipboardJS from "@/plugin/clipboard/clipboard.js";
	import { mapGetters } from "vuex";
	import { configMap } from "@/utils";
	import { toLogin } from '@/libs/login.js';
	import addInvoicing from '@/components/addInvoicing';
	import reservationForm from './components/reservationForm';
	import reservationInfo from './components/reservationInfo';
	import reservationCode from './components/reservationCode';
	import zbCode from '@/components/zb-code/zb-code.vue';
	import home from '@/components/home/index.vue';
	import openNavigation from '@/utils/navigation.js'
	export default {
		components: {
			payment,
			orderGoods,
			addInvoicing,
			zbCode,
			home,
			reservationForm,
			reservationInfo,
			reservationCode
		},
		data() {
			return {
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


				order_id: '',
				evaluate: 0,
				activityType: 0,
				cartInfo: [], //购物车产品
				orderInfo: {
					system_store: {},
					_status: {},
					take: {}
				}, //订单详情
				system_store: {},
				isGoodsReturn: false, //是否为退款订单
				status: {}, //订单底部按钮状态
				isClose: false,
				payMode: [],
				pay_close: false,
				pay_order_id: '',
				totalPrice: '0',
				refundNum: [], //退款个数临时数据
				imgUrl:HTTP_REQUEST_URL,
				codeUrl:'',
				isTimePay: false,
				codeShow: false,
				cid: '1',
				val: "", // 要生成的二维码值
				size: 200, // 二维码大小
				unit: 'upx', // 单位
				background: '#FFF', // 背景色
				foreground: '#000', // 前景色
				pdground: '#32dbc6', // 角标色
				icon: '', // 二维码图标
				iconsize: 40, // 二维码图标大小
				lv: 3, // 二维码容错级别 ， 一般不用设置，默认就行
				onval: true, // val值变化时自动重新生成二维码
				loadMake: true, // 组件加载完成后自动生成二维码
				src: '', // 二维码生成后的图片地址或base64
				codeSrc: "",
				wd: 225,
				hg: 500,
				isMore: false,
				showBtn: false,
				invoice: {
					invoice: false,
					add: false,
				},
				deliveryTimeText: '', // 配送时间
			};
		},
		computed:{
			...configMap({hide_mer_status:0,yue_pay_status:0,alipay_open:0},
			mapGetters(['isLogin','uid','viewColor','keyColor','orderPayList'])),
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
		filters:{
			filterDay(val){
				if(val){
					var reg =/(\d{4})\-(\d{2})\-(\d{2})/;
					var date = val.replace(reg,"$2月$3日");
					return date
				}
			}
		},
		onLoad: function(options) {
			if (options.order_id) {
				this.$set(this, 'order_id', options.order_id);
			}
		},
		onShow() {
			this.isMore = false
			if (this.isLogin) {
				this.getOrderInfo();
				this.isPayBalance();
			} else {
				toLogin()
			}
		},
		onHide: function() {
			this.isClose = true;
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
		mounted: function() {},
		methods: {
			goBack: function() {
				uni.navigateBack();
			},
			// 图片预览
			getPhotoClickIdx(list, idx) {
				uni.previewImage({
					current: list[idx], //  传 Number H5端出现不兼容
					urls: list
				});
			},
			// 判断是否到支付尾款时间
			isPayBalance(){
				let that = this;
				if(that.orderInfo.status === 10){
					if(new Date() < new Date(that.orderInfo.presellOrder.final_start_time)){
						that.isTimePay = false; //未开始
					}else if((new Date() >= new Date(that.orderInfo.presellOrder.final_start_time)) && (new Date() <= new Date(that.orderInfo.presellOrder.final_start_time)) ){
						that.isTimePay = true; //立即支付
					}
				}
			},
			// 数字转汉字
			toChinese(num){
				let changeNum = ['零', '一', '二', '三', '四', '五', '六', '日', '八', '九'];
				let unit = ["", "十", "百", "千", "万"];
				num = parseInt(num);
				let getWan = (temp) => {
			　　let strArr = temp.toString().split("").reverse();
			　　let newNum = "";
			　　for (var i = 0; i < strArr.length; i++) {
				　　newNum = (i == 0 && strArr[i] == 0 ? "" : (i > 0 && strArr[i] == 0 && strArr[i - 1] == 0 ? "" : changeNum[strArr[i]] + (strArr[i] == 0 ? unit[0] : unit[i]))) + newNum;
			　　}
			 　 return newNum;
			 }
			 let overWan = Math.floor(num / 10000);
			 let noWan = num % 10000;
			 if (noWan.toString().length < 4) {　　　　　　noWan = "0" + noWan;　　　 }
			 return overWan ? getWan(overWan) + "万" + getWan(noWan) : getWan(num);
			},
			// 返回店铺首页
			goStore(mer_id){
				if(this.hide_mer_status != 1){
					uni.navigateTo({
						url: '/pages/store/home/index?id=' + mer_id
					})
				}
			},
			// 批量退款
			allRefund() {
				// #ifdef MP
				openOrderRefundSubscribe().then(() => {
					uni.hideLoading();
					if (this.orderInfo.status == 0 || this.orderInfo.is_virtual != 0) {
						uni.navigateTo({
							url: '/pages/users/refund/index?order_id=' + this.order_id + '&refund_type=1&type=2&order_type='+this.orderInfo.order_type
						})
					} else {
						uni.navigateTo({
							url: '/pages/users/refund/select?order_id=' + this.order_id + '&type=2&order_type='+this.orderInfo.order_type
						})
					}
				}).catch(() => {
					uni.hideLoading();
				})
				// #endif
				// #ifdef H5 || APP-PLUS
				if (this.orderInfo.status == 0 || this.orderInfo.is_virtual != 0) {
					uni.navigateTo({
						url: '/pages/users/refund/index?order_id=' + this.order_id + '&refund_type=1&type=2&order_type='+this.orderInfo.order_type
					})
				} else {
					uni.navigateTo({
						url: '/pages/users/refund/select?order_id=' + this.order_id + '&type=2&order_type='+this.orderInfo.order_type
					})
				}
				// #endif
			},
			//拼团取消
			getCombinationRemove: function() {
				var that = this;
				postCombinationRemove({
					group_buying_id: that.orderInfo.orderProduct[0].activity_id
					})
					.then(res => {
						that.$util.Tips({
							title: res.message
						}, {
							tab: 3
						});
					})
					.catch(res => {
						that.$util.Tips({
							title: res.message
						});
					});
			},
			// 取消售后
			cancelSales(){
				let that = this;
				uni.showModal({
				  content: '确定要取消售后？',
				  success: function(res) {
				    if(res.confirm) {
				      deletePlantApi(that.order_id).then(res => {
				      	if (res.status === 200) {
				      		that.$util.Tips({
				      			title: res.message
				      		});
								}
				      })
				    } else if(res.cancel) {
				      console.log('用户点击取消');
				    }
				  }
				});
			},
			// 取消预约
			cancelReservation() {
				let that = this;
				uni.showModal({
				  content: '确定取消预约吗？',
				  success: function(res) {
				    if(res.confirm) {
				      cancelReservationApi(that.order_id).then(res => {
				      	if (res.status === 200) {
				      		that.$util.Tips({
				      			title: res.message
				      		});
									that.getOrderInfo();
								}
				      })
				    } else if(res.cancel) {
				      console.log('用户点击取消');
				    }
				  }
				});
			},
			openSubcribe: function(e) {
				let page = e;
				uni.showLoading({
					title: '正在加载',
				})
				openOrderRefundSubscribe().then(res => {
					uni.hideLoading();
					uni.navigateTo({
						url: page,
					});
				}).catch(() => {
					uni.hideLoading();
				});
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
			 * 拨打电话
			 */
			makePhone: function(phone) {
				uni.makePhoneCall({
					phoneNumber: phone
				})
			},
			/**
			 * 打开地图
			 *
			 */
			showMaoLocation: function(type = 'mer') {
				let that, lat, long
				if (type == 'mer') {
					if (!this.orderInfo.merchant.lat || !this.orderInfo.merchant.long) return this.$util.Tips({
						title: '请设置允许商城访问您的位置！'
					});
					that = this
					lat = parseFloat(that.orderInfo.merchant.lat)
					long = parseFloat(that.orderInfo.merchant.long)
				} else if (type == 'take') {
					if (!this.orderInfo.take.lat || !this.orderInfo.take.lng) return this.$util.Tips({
						title: '请设置允许自提点访问您的位置！'
					});
					that = this
					lat = parseFloat(that.orderInfo.take.lat)
					long = parseFloat(that.orderInfo.take.lng)
				}
				// let that = this, lat = parseFloat(that.orderInfo.take.lat),
				//     long = parseFloat(that.orderInfo.take.lng)
				//#ifdef H5
				if (that.$wechat.isWeixin() === true) {
					that.$wechat.seeLocation({
						latitude: Number(lat),
						longitude: Number(long),
						address: that.orderInfo.take ? that.orderInfo.take.station_name : ''
					}).then(res=>{
						console.log('success');
					})
				}else{
				  //#endif
					uni.openLocation({
						latitude: lat,
						longitude: long,
						name: that.orderInfo.take ? that.orderInfo.take.station_name : '',
						address: that.orderInfo.take ? that.orderInfo.take.station_address : '',
						scale: 8,
						success: function() {
						},
					});
					// #ifdef H5
				}
				//#endif
			},
			/**
			 * 关闭支付组件
			 *
			 */
			payClose: function() {
				this.pay_close = false;
			},
			/**
			 * 打开支付组件
			 *
			 */
			pay_open: function() {
				this.pay_close = true;
				this.pay_order_id = this.orderInfo.order_id.toString();
				this.totalPrice = this.orderInfo.pay_price;
				let type = this.orderInfo.activity_type == 2 ? 2 : 0;
				this.$util.getPayTypeList(this.pay_order_id,type)
			},
			/**
			 * 支付成功回调
			 *
			 */
			pay_complete: function() {
				this.pay_close = false;
				this.pay_order_id = '';
				this.getOrderInfo();
			},
			/**
			 * 支付失败回调
			 *
			 */
			pay_fail: function() {
				this.pay_close = false;
				this.pay_order_id = '';
			},
			getOrderCode(){
				verifyCode(this.order_id).then(res=>{
					this.codeUrl = res.data.qrcode
					this.val = res.data.qrcode
				})
			},
			/**
			 * 获取订单详细信息
			 *
			 */
			getOrderInfo: function() {
				let that = this;
				uni.showLoading({
					title: "正在加载中"
				});
				getOrderDetail(that.order_id).then(res => {
					uni.hideLoading();
					that.$set(that, 'orderInfo', res.data);
					that.orderInfo.take = res.data.take;
					that.$set(that, 'cartInfo', res.data.orderProduct);
					// debugger
					if (that.orderInfo.status == '-1') {
						that.isGoodsReturn = true;
					}
					res.data.orderProduct.map(el => {
						if (el.refund_num == 0) {
							that.refundNum.push(el)
						}
					})
					if(res.data.order_type == 1 || res.data.is_virtual == 4){
						that.getOrderCode()
					}
					that.showBtn =
					(that.orderInfo.is_virtual!=4 && (![1, 2, 3, 4, 10].includes(that.orderInfo.activity_type)) || that.orderInfo.status == 1) ||
					(that.orderInfo.is_virtual == 4 && that.orderInfo.cancel_status) ||
					(that.orderInfo.activity_type == 2 && (that.orderInfo.status == 10 || that.orderInfo.status == 11)) ||
					that.orderInfo.status == 9 ||
					([0,1, 2, 3].includes(that.orderInfo.status) && that.refundNum.length != that.cartInfo.length && that.orderInfo.refund_status && that.orderInfo.refund_switch) ||
					that.orderInfo.activity_type==4 ||
					that.orderInfo.status == 3 ||
					((that.orderInfo.status == 0 || that.orderInfo.status == 1) && that.orderInfo.delivery_type == 1 || that.orderInfo.delivery_type == 4 && that.orderInfo.is_virtual != 4)
					// 配送时间文本显示
					if(this.orderInfo.merchant_take_info[this.orderInfo.mer_id])this.setDeliveryTimeText()
				}).catch(err => {
					uni.hideLoading();
					that.$util.Tips({
						title: err
					}, '/pages/users/order_list/index');
				});
			},
			qrR(res) {
				this.codeSrc = res
			},
			showCode() {
				this.$refs.cancellPoupon.open();
			},
			close(){
				this.$refs.cancellPoupon.close();
			},
			/**
			 *
			 * 剪切订单号
			 */
			// #ifndef H5
			copy: function(data) {
				let that = this;
				uni.setClipboardData({
					data: data,
					success: function(res){
					}

				});
			},
			// #endif
			/**
			 *
			 * 剪切卡密内容
			 */
			// #ifndef H5
			copyKm: function() {
				let that = this;
				uni.setClipboardData({
					data: that.orderInfo.delivery_id,
					success: function(res){
					}

				});
			},
			// #endif
			/**
			 * 去拼团详情
			 *
			 */
			goJoinPink: function() {
				uni.navigateTo({
					url: '/pages/activity/combination_status/index?id=' + this.orderInfo.orderProduct[0].activity_id,
				});
			},
			/**
			 * 再此购买
			 *
			 */
			goOrderConfirm: function() {
				let that = this;
				let data = []
				this.cartInfo.map((item, index) => {
					let obj = {}
					obj.product_id = item.product_id
					obj.product_attr_unique = item.product_sku
					obj.cart_num = item.product_num
					data.push(obj)
				})
				orderAgain({
					data: data
				}).then(res => {
					let cart_id = res.data.cart_id.join(',')
					return uni.navigateTo({
						url: '/pages/users/order_confirm/index?cartId=' + cart_id
					});
				}).catch(err => {
					that.$util.Tips({
						title: err
					})
				});
			},
			confirmOrder: function() {
				let that = this;
				uni.showModal({
					title: '确认收货',
					content: '为保障权益，请收到货确认无误后，再确认收货',
					success: function(res) {
						if (res.confirm) {
							orderTake(that.order_id).then(res => {
								return that.$util.Tips({
									title: '操作成功',
									icon: 'success'
								}, function() {
									that.getOrderInfo();
									that.isMore = false;
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
			/**
			 *
			 * 删除订单
			 */
			delOrder: function() {
				let that = this;
				orderDel(this.order_id).then(res => {
					return that.$util.Tips({
						title: '删除成功',
						icon: 'success'
					}, {
						tab: 3,
						url: 1
					});
				}).catch(err => {
					return that.$util.Tips({
						title: err
					});
				});
			},
			cancelOrder() {
				let self = this
				uni.showModal({
					title: '提示',
					content: '确认取消该订单?',
					success: function(res) {
						if (res.confirm) {
							orderDel(self.orderInfo.order_id)
								.then((data) => {
									self.$util.Tips({
										title: data.message
									})
									uni.navigateTo({
										url: `/pages/users/presell_order_list/index`,
									});
								})
								.catch((err) => {
									return self.$util.Tips({
										title: err
									});
								});
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			/*申请开票*/
			applyInvoice() {
				let that = this;
				that.invoice.invoice = true;
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
				applyInvoiceApi(that.order_id,data).then(res => {
					that.getOrderInfo();
					return that.$util.Tips({
						title: res.message,
					});
				}).catch(err => {
					return that.$util.Tips({
						title: err
					});
				})
			},
			// 判断当前时间是否在营业时间
			isInBusinessHours(startTime, endTime) {
				if (startTime && endTime) {
					const date = new Date();
					const now = date.getHours() * 60 + date.getMinutes();

					const [startH, startM] = startTime.split(':').map(Number);
					const [endH, endM] = endTime.split(':').map(Number);
					return now >= startH * 60 + startM && now < endH * 60 + endM;
				}
				else {
					return true
				}
			},
			// 配送时间文本设置
			setDeliveryTimeText() {
				const merId = this.orderInfo.mer_id
				const remarks = this.orderInfo.merchant_take_info[merId].remarks
				if (remarks) {
					this.deliveryTimeText = remarks
				} else {
					const date = this.orderInfo.merchant_take_info[merId].date
					const time = this.orderInfo.merchant_take_info[merId].time
					this.deliveryTimeText = date+' '+time
				}
			},
			// 打开导航
			openNav() {
				// openNavigation()
			}
		}
	}
</script>
<style scoped lang="scss">
	.remark {
		// flex: 1;
	}
	.merchant {
		width: 100%;
		height: 86rpx;
		padding: 0 30rpx;
		font-size: 30rpx;
		color: #282828;
		line-height: 86rpx;
		box-sizing: border-box;
		border-radius: 24rpx 24rpx 0 0;
		.icon-ic_rightarrow {
			font-size: 28rpx;
		}
		.icon-ic_mall {
			font-size: 32rpx;
		}
		.txt {
			margin: 0 8rpx;
		}
	}
	.presell_bg_header{
		background-image: linear-gradient( 90deg, var(--view-bntColor22) 0%, var(--view-bntColor21) 100%);
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
	.b-color {
		background-color: var(--view-theme);
	}
	.t-color {
		color: var(--view-theme)!important;
	}
	.sys-head .bg{
		background-image: linear-gradient( 90deg, var(--view-bntColor22) 0%, var(--view-bntColor21) 100%);
	}
	.refund-head {
		.sys-title {
			color: #282828;
		}
		.bg {
			background: #fff;
		}
	}
	.headerCount{
		height: 260rpx;
		background-image: linear-gradient( 90deg, var(--view-bntColor22) 0%, var(--view-bntColor21) 100%);
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
	.header-gradient {
		position: relative;
	}
	.order-details .header {
		padding: 0 0 0 40rpx;
		&.presell_header{
			background-repeat: no-repeat;
			background-size: cover;
			padding: 30rpx;
			.data{
				margin: 8rpx 0 0 13rpx;
				.state{
					font-weight: normal;
					font-size: 24rpx;

				}
			}
		}
	}
	.order-details .order-main {
		position: relative;
		margin-top: -260rpx;
	}
	.take-info{
		padding: 0 30rpx 30rpx;
		margin-bottom: 14rpx;
	}
	.take-msg {
		display: flex;
		justify-content: space-between;
		background-color: #FAFAFA;
		padding: 24rpx;
		border-radius: 4rpx;
		.left {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			.title {
				font-size: 28rpx;
				font-weight: 500;
				color: #282828;
			}
			.text {
				color: #666666;
			}
		}
		.code {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			.iconfont {
				font-size: 50rpx;
				color: #666666;
			}
			.text {
				font-size: 20rpx;
				color: #666666;
				margin-top: 12rpx;
			}
		}
	}
	.order-details .header.on {
		background-color: #666 !important;
	}
	.order-details .header .pictrue {
		width: 110rpx;
		height: 110rpx;
		margin-right: 27rpx;
		&.reservation-pictrue {
			width: 160rpx;
			height: 160rpx;
			margin-right: 0;
		}
		.shipping-img {
			position: relative;
			right: 20rpx;
		}
	}
	.order-details .header .pictrue image {
		width: 100%;
		height: 100%;
	}
	.order-details .header .data {
		color: rgba(255, 255, 255, 0.8);
		font-size: 24rpx;

	}
	.order-details .header .data.on {
		margin-left: 0;
	}
	.order-details .header .data .state {
		font-size: 30rpx;
		font-weight: bold;
		color: #fff;
		margin-bottom: 8rpx;
	}
	.presell_header .presell_payment{
		color: #fff;
		font-size: 30rpx;
		font-weight: bold;
		.iconfont{
			font-weight: normal;
			margin-right: 8rpx;
		}
	}
	.order-details .header .data .time {
		margin-left: 20rpx;
	}
	.order-details .nav {
		background-color: #fff;
		width: 710rpx;
		border-radius: 24rpx;
		margin: 0 auto;
		font-size: 26rpx;
		color: #282828;
		padding: 25rpx 0;
	}
	.order-details .nav .navCon {
		padding: 0 40rpx;
	}
	.order-details .nav .navCon .nav-text{
		color: var(--view-theme);
	}
	.order-details .nav .on ~ .nav-text{
		color: #282828;
	}
	.order-details .nav .on{
		font-weight: bold;
	}

	.order-details .nav .progress {
		padding: 0 65rpx;
		margin-top: 36rpx;
	}
	.order-details .nav .progress .line {
		width: 100rpx;
		height: 2rpx;
		background-color: #999999;
		&.b-color{
			background: var(--view-theme);
		}
	}
	.order-details .nav .progress .iconfont {
		font-size: 20rpx;
		color: #939390;
		position: relative;
		left: 6rpx;
		&.t-color{
			color: var(--view-theme);
		}
	}
	.order-details .address {
		font-size: 26rpx;
		color: #999;
		// margin-top: 20rpx;
		padding: 35rpx 30rpx;
	}
	.order-details .address .name {
		font-size: 30rpx;
		color: #282828;
	}
	.order-details .address .phone {
		margin-left: 40rpx;
	}
	.order-details .address .address-info {
		margin-top: 20rpx;
	}
	.order-details .address .phonenumber{
		width: 34rpx;
		height: 34rpx;
		text-align: center;
		line-height: 26rpx;
		display: inline-block;
		background: var(--view-theme);
		border-radius: 100%;
		margin-left: 30rpx;
		position: relative;
		top: -6rpx;
	}
	.order-details .address .name .icon-a-icon_phonenumber{
		color: #fff;
		font-size: 16rpx;
	}
	// 服务人员信息
	.reserve-box {
		padding: 30rpx;
		// 顶部服务人员信息
		.reserve-info-box {
			display: flex;
			// padding: 14rpx 30rpx 35rpx;
			justify-content: space-between;
			margin: 14rpx 0 18rpx;
			.reserve-info {
				font-size: 28rpx;
				font-weight: 500;
				.reserve-name {
				}
				.mer-name {
					margin-top: 12rpx;
					width: 428rpx;
				}
				.iconfont {
					display: inline-block;
					width: 48rpx;
					height: 48rpx;
					color: var(--view-theme);
					background-color: var(--view-bgColor);
					border-radius: 50%;
					text-align: center;
					line-height: 48rpx;
					margin-right: 16rpx;
				}
			}
			.same-city-map-box {
				display: flex;
				justify-content: center;
				align-items: center;
				.map-content {
					display: flex;
					flex-direction: column;
					align-items: center;
					width: 188rpx;
					height: 104rpx;
					background: url('@/static/images/map-bg.png');
					background-size: cover;
					.dsitance {
						background: #FFFFFF;
						padding: 4rpx 16rpx;
						border-radius: 6rpx;
						box-shadow: 0rpx 0rpx 16rpx 0rpx rgba(0,0,0,0.0784);
						font-weight: 400;
						font-size: 20rpx;
						color: #333333;
					}
					.triangle {
						content: '';
						border-top: 6rpx solid #FFFFFF;
						border-right: 10rpx solid transparent;
						border-left: 10rpx solid transparent;
						box-shadow: 0rpx 0rpx 16rpx 0rpx rgba(0,0,0,0.0784);
					}
					.shop-logo-box {
						width: 52rpx;
						height: 51rpx;
						background: #FFFFFF;
						padding: 6rpx;
						border-radius: 6rpx;
						.shop-logo {
							width: 40rpx;
							height: 39rpx;
							border-radius: 6rpx;
						}
					}
					.point {
						width: 6rpx;
						height: 6rpx;
						border-radius: 50%;
						background: var(--view-theme);
					}
				}
			}
		}
		// 中部商户信息
		.mer-info-box {
			color: #999999;
			.mer-address-box {
				display: flex;
				justify-content: space-between;
				align-items: baseline;
				.mer-address {
					margin-bottom: 12rpx;
				}
				.copy-btn {
					flex-shrink: 0;
					padding: 2rpx 12rpx;
					margin-left: 32rpx;
					color: #333333;
					background: #F5F5F5;
					border-radius: 200rpx 200rpx 200rpx 200rpx;
				}
			}
			.mer-time-box {
				margin-bottom: 24rpx;
			}
		}
		// 底部电话与导航
		.footer-box {
			justify-content: space-between;
			padding: 24rpx 72rpx 0;
			border-top: 1rpx solid #EEEEEE;
			color: #333333;
			.iconfont {
				margin-right: 8rpx;
			}
		}
	}
	// 提货点信息
	.take-point-box {
		padding: 30rpx;
		// 配送地址标题内容
		.address-title {
			color: var(--view-theme);
			font-size: 28rpx;
			font-weight: 500;
			// padding: 32rpx 30rpx 22rpx;
			padding: 0 0 22rpx;
			border-bottom: 1rpx solid #F5F5F5;
			.icon-ic_truck {

			}
			.text-title {
				margin: 0 12rpx;
			}
			.text-content {
				font-size: 24rpx;
				font-weight: 400;
				color: #999999;
			}
		}
		// 配送店铺信息
		.same-city-address {
			display: flex;
			// padding: 14rpx 30rpx 35rpx;
			justify-content: space-between;
			margin: 14rpx 0 18rpx;
			.shop-info {
				.shop-name {
					font-size: 30rpx;
					font-weight: 500;
				}
				.shop-address {
					color: #666666;
					font-size: 24rpx;
					margin-top: 12rpx;
					width: 428rpx;
				}
				.marks {
					margin-top: 12rpx;
					font-weight: 400;
					font-size: 22rpx;
					color: #999999;
				}
			}
			.same-city-map-box {
				display: flex;
				justify-content: center;
				align-items: center;
				.map-content {
					display: flex;
					flex-direction: column;
					align-items: center;
					width: 188rpx;
					height: 104rpx;
					background: url('@/static/images/map-bg.png');
					background-size: cover;
					.dsitance {
						background: #FFFFFF;
						padding: 4rpx 16rpx;
						border-radius: 6rpx;
						box-shadow: 0rpx 0rpx 16rpx 0rpx rgba(0,0,0,0.0784);
						font-weight: 400;
						font-size: 20rpx;
						color: #333333;
					}
					.triangle {
						content: '';
						border-top: 6rpx solid #FFFFFF;
						border-right: 10rpx solid transparent;
						border-left: 10rpx solid transparent;
						box-shadow: 0rpx 0rpx 16rpx 0rpx rgba(0,0,0,0.0784);
					}
					.shop-logo-box {
						width: 52rpx;
						height: 51rpx;
						background: #FFFFFF;
						padding: 6rpx;
						border-radius: 6rpx;
						.shop-logo {
							width: 40rpx;
							height: 39rpx;
							border-radius: 6rpx;
						}
					}
					.point {
						width: 6rpx;
						height: 6rpx;
						border-radius: 50%;
						background: var(--view-theme);
					}
				}
			}
		}
		// 底部电话与导航
		.footer-box {
			justify-content: space-between;
			padding: 24rpx 72rpx 0;
			border-top: 1rpx solid #EEEEEE;
			color: #333333;
			.iconfont {
				margin-right: 8rpx;
			}
		}
	}
	.order-details .line {
		width: 670rpx;
		height: 4rpx;
		margin-left: 15rpx;
	}
	.order-details .line image {
		width: 100%;
		height: 100%;
		display: block;
	}
	.order-details .wrapper {
		background-color: #fff;
		margin-top: 20rpx;
		padding: 30rpx;
		&:last-child {
			margin-bottom: 20rpx;
		}
	}
	.order-details .wrapper .item {
		font-size: 28rpx;
		color: #282828;
		line-height: 46rpx;
	}
	.order-details .wrapper .virtual_item {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.order-details .virtual_item .virtual_row {
		width: 300rpx;
		align-items: center;
		justify-content: space-between;
		image,uni-image{
			width: 80rpx;
			height: 80rpx;
			border-radius: 100%;
		}
	}
	.order-details .virtual_item .virtual_detail {
		color: var(--view-theme);
	}
	.order-details .virtual_item .virtual_delivery {
		line-height: 40rpx;
	}
	.order-details .virtual_item .virtual_delivery_not {
		font-weight: bold;
	}
	.order-details .wrapper .item~.item {
		margin-top: 20rpx;
	}
	.order-details .wrapper .item .conter {
		color: #333;
		max-width: 500rpx;

	}
	.order-details .wrapper .item .virtual_image {
		margin-left: 50rpx;
	}
	.order-details .wrapper .item .virtual_image .picture{
		width: 106rpx;
		height: 106rpx;
		border-radius: 8rpx;
		margin-right: 10rpx;
		&:last-child{
			margin-right: 0;
		}
	}
	.order-details .wrapper .item .conter .copy {
		margin-left: 24rpx;
	}
	.order-details .wrapper .actualPay {
		border-top: 1px solid #eee;
		margin-top: 30rpx;
		padding-top: 30rpx;
	}
	.order-details .wrapper .actualPay .money {
		font-weight: bold;
		font-size: 30rpx;
	}
	.order-details .footer {
		width: 100%;
		position: fixed;
		bottom: 0;
		left: 0;
		background-color: #fff;
		padding: 0 30rpx;
		height: 100rpx;
		height: calc(100rpx+ constant(safe-area-inset-bottom)); ///兼容 IOS<11.2/
		height: calc(100rpx + env(safe-area-inset-bottom)); ///兼容 IOS>11.2/
		box-sizing: border-box;

	}
	.content-clip{
		height: 100rpx;
		height: calc(100rpx+ constant(safe-area-inset-bottom)); ///兼容 IOS<11.2/
		height: calc(100rpx + env(safe-area-inset-bottom)); ///兼容 IOS>11.2/
	}
	.order-details .bnt {
		width: 156rpx;
		text-align: center;
		height: 60rpx;
		border-radius: 50rpx;
		color: #fff;
		font-size: 27rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		&.btn_auto{
			width: auto;
			padding: 0 40rpx;
		}
		~.bnt {
			margin-left: 17rpx;
		}
		&.more {
			color: #999;
			width: 100rpx;
			.iconfont{
				font-size: 36rpx;
			}
		}
	}
	.toggle-btn {
		width: 200rpx;
		background: #ffffff;
		box-shadow: 0 2rpx 14rpx rgba(0, 0, 0, 0.1);
		padding: 20rpx;
		position: absolute;
		bottom: 90rpx;
		left: 20rpx;
		z-index: 9;
		border-radius: 10rpx;
		&::after {
			content: "";
			display: inline-block;
			width: 26rpx;
			height: 26rpx;
			background: #ffffff;
			-webkit-transform: rotate(140deg);
			transform: rotate(140deg);
			position: absolute;
			bottom: -12rpx;
			left: 30rpx;
			box-shadow: -1rpx -1rpx 1rpx rgba(0, 0, 0, 0.05);
		}
		.bnts {
			padding: 10rpx 0;
			text-align: center;
		}
	}
	.order-details .cancels {
		color: #666666;
		border: 1px solid #ddd;
		position: relative;
		right: -12rpx;
	}
	.order-details .footer .bnt.cancel {
		color: #666666;
		border: 1px solid #ddd;
	}
	.order-details .footer .bnt~.bnt {
		margin-left: 18rpx;
	}
	.order-details .writeOff {
		background-color: #fff;
		margin-top: 13rpx;
		padding-bottom: 30rpx;
	}
	.order-details .writeOff .title {
		font-size: 30rpx;
		color: #282828;
		height: 87rpx;
		border-bottom: 1px solid #f0f0f0;
		padding: 0 30rpx;
		line-height: 87rpx;
	}
	.grayBg .pictrue {
		width: 290rpx;
		height: 290rpx;
		margin: 0 auto;
	}
	.grayBg .pictrue image {
		width: 100%;
		height: 100%;
		display: block;
	}
	.gear {
		width: 590rpx;
		height: 30rpx;
		margin: 0 auto;
	}
	.gear image {
		width: 100%;
		height: 100%;
		display: block;
	}
	.num {
		color: #282828;
		font-size: 34rpx;
		font-weight: bold;
		margin: 0 auto;
		text-align: center;
		margin-top: 30rpx;
	}
	.order-details .writeOff .rules {
		margin: 46rpx 30rpx 0 30rpx;
		border-top: 1px solid #f0f0f0;
		padding-top: 10rpx;
	}
	.order-details .writeOff .rules .item {
		margin-top: 20rpx;
	}
	.order-details .writeOff .rules .item .rulesTitle {
		font-size: 28rpx;
		color: #282828;
	}
	.order-details .writeOff .rules .item .rulesTitle .iconfont {
		font-size: 30rpx;
		color: #333;
		margin-right: 8rpx;
		margin-top: 5rpx;
	}
	.order-details .writeOff .rules .item .info {
		font-size: 28rpx;
		color: #999;
		margin-top: 7rpx;
	}
	.order-details .writeOff .rules .item .info .time {
		margin-left: 20rpx;
	}
	.order-details .map {
		height: 86rpx;
		font-size: 30rpx;
		color: #282828;
		line-height: 86rpx;
		margin-top: 13rpx;
		padding: 0 30rpx;
		position: relative;
		&::after{
			content: "";
			width: 664rpx;
			height: 2rpx;
			background: #f0f0f0;
			position: absolute;
			left: 24rpx;
			bottom: 0;
		}
	}
	.order-details .map .place {
		font-size: 26rpx;
		width: 164rpx;
		border-radius: 26rpx;
		line-height: 46rpx;
		text-align: center;
		border: 1px solid var(--view-theme);
	}
	.order-details .map .place .iconfont {
		font-size: 27rpx;
		height: 27rpx;
		line-height: 27rpx;
		margin: 2rpx 3rpx 0 0;
	}
	.refund {
		padding: 0 30rpx 30rpx;
		margin-top: 24rpx;
		background-color: #fff;
		.title {
			display: flex;
			align-items: center;
			font-size: 30rpx;
			color: #333;
			height: 86rpx;
			border-bottom: 1px solid #f5f5f5;
			image {
				width: 32rpx;
				height: 32rpx;
				margin-right: 10rpx;
			}
		}
		.con {
			padding-top: 25rpx;
			font-size: 28rpx;
			color: #999;
		}
	}
	.qs-btn {
		width: auto;
		height: 60rpx;
		text-align: center;
		line-height: 60rpx;
		border-radius: 50rpx;
		color: #fff;
		font-size: 27rpx;
		padding: 0 3%;
		color: #aaa;
		border: 1px solid #ddd;
		margin-right: 20rpx;
	}
	.code-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 32rpx 0 60rpx 0;
		background: #ffffff;
		border-radius: 40rpx 40rpx 0 0;
		position: relative;
		.iconfont{
			font-size: 24rpx;
			color: #939393;
			position: absolute;
			top: 20rpx;
			right: 20rpx;
		}
		.title{
			color: #282828;
			font-size: 32rpx;
		}
		.trip {
			font-size: 28rpx;
			font-weight: 400;
			color: #666666;
			margin: 40rpx 0;
		}
	}
	//提货点信息样式
	.receive-info-box {
		padding: 30rpx;
		font-size: 28rpx;
		color: #333333;
		.title {
			font-weight: 500;
		}
		.take-point-item {
			display: flex;
			justify-content: space-between;
			margin-top: 40rpx;
			font-weight: 400;
			.item-title {
				flex-shrink: 0;
			}
			.item-content {
				margin-left: 20rpx;
			}
		}
	}
	// 送货信息样式
	.delivery-info-box {
		padding: 30rpx;
		font-size: 28rpx;
		color: #333333;
		.title {
			font-weight: 500;
		}
		.delivery-info-item {
			display: flex;
			justify-content: space-between;
			margin-top: 40rpx;
			font-weight: 400;
			.item-title {

			}
			.item-content {
				.iconfont {
					font-size: 28rpx;
					color: #2A7EFB;
					margin-left: 12rpx;
				}
			}
		}
	}
	.flex-box {
		display: flex;
	}
</style>

