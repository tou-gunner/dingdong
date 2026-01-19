<template>
	<view class="reservation" :style="viewColor">
		<!-- 自定义顶部背景颜色 -->
		<view class="top">
			<!-- #ifdef MP || APP-PLUS -->
			<view class="sys-head fixed">
				<view class="sys-bar" :style="{height:sysHeight}"></view>
				<!-- #ifdef MP -->
				<view class="sys-title">
					<view class='iconfont icon-ic_leftarrow' :style="{lineHeight:sysHeight}" @tap='goBack'></view>
					立即预约
				</view>
				<!-- #endif -->
				<view class="bg"></view>
			</view>
			<!-- #endif -->
		</view>
	   <view class="header" :style="{marginTop:marTop}"></view>
	   <view class="pad20 reservation-main">
			<!--服务类型-->
			<view class="reservation-header boder-24">
				<view v-if="reservation_type == 3" class="reservation-type acea-row">
					<view v-for="(item,index) in serviceTypeList" :key="index" class="type-name acea-row row-center row-middle" :class="{on : item.type==service_type}" @click="changeType(item)">
						{{item.name}}
						<text v-if="item.type==service_type" class="type_tag" :class="'type_tag'+service_type" :style="{ backgroundImage: `url(${domain}/static/images/type_tag.png)`}"></text>
					</view>
				</view>
				<view class="reservation-address">
					<!--上门服务地址-->
					<view v-if="service_type == 2 && addressInfo" class="acea-row row-between-wrapper" @click="onAddress">
						<view class="address-info" v-if="addressInfo.real_name">
							<view class="address-name">
								<text>{{addressInfo.real_name}}</text>
								<text>{{addressInfo.phone}}</text>
							</view>
							<view class="address-detail line1">
								{{addressInfo.province}}{{addressInfo.city}}{{addressInfo.district}}{{addressInfo.street || ''}}{{addressInfo.detail}}
							</view>
						</view>
						<navigator v-else url="'/pages/users/user_address/index?product_type=4" hover-class="none" class='addressCon'>
							<view class='setaddress'>设置收货地址</view>
						</navigator>
						<view class="address-more">
							<text class="iconfont icon-ic_rightarrow"></text>
						</view>
					</view>
					<!--到店服务地址-->
					<view v-else class="acea-row row-between-wrapper">
						<view class="address-info info-arrive">
							<view class="address-name">
								<text>{{merData.mer_name}}</text>
								<!-- <text>18435762634</text> -->
							</view>
							<view class="address-detail line1">
								{{merData.mer_address}}
							</view>
						</view>
						<view class="address-location acea-row " :style="{ backgroundImage: `url(${domain}/static/images/type_loaction.png)`}">
							<view class="location-distance acea-row row-center row-middle">距您{{distance}}</view>
							<image class="loaction-avatar" :src="merData.mer_avatar"></image>
							<view class="location-point"></view>
						</view>
					</view>
					<view class='line'>
						<image :src="`${domain}/static/images/line.jpg`"></image>
					</view>
				</view>
			</view>
			<!--服务内容-->
			<view class="service-content bg-f boder-24">
				<view class="service-informatin acea-row row-between">
					<image class="service-image" :src="productInfo.image"></image>
					<view class="service-name acea-row">
						<view class="name line2">
							{{productInfo.store_name}}
						</view>
						<view class="price acea-row row-bottom">
							<priceFormat :price="attr.productSelect.price" weight intSize="36" floatSize="24" labelSize="20"></priceFormat>
							<view v-if="svipData && svipData.show_svip_price && svipData.show_svip" class="acea-row row-middle">
								<text class="vip-money regular">¥{{attr.productSelect.svip_price}}</text>
								<image class="vip-image" :src="`${domain}/static/images/svip.png`"></image>
							</view>
						</view>
					</view>
				</view>
				<view class="service-specs" v-for="(item, indexw) in attr.productAttr" :key="indexw">
					<view>{{ item.attr_name }}</view>
					<scroll-view show-scrollbar="false" class="spec-scroll">
					  <view class="acea-row">
							<view v-for="(itemn, indexn) in item.attr_values" :key="indexn" class="acea-row spec-item row-middle"  :class="attrSelected.sku == itemn ? 'bntActive' : ''"  @click="tapAttr(item, itemn)">
								<view class="spec-image">
									<image :src="productValue[itemn]&&productValue[itemn].image || productInfo.image" class="image"></image>
								</view>
								<view class="spec-attr">{{itemn}}</view>		 				  
							</view>
						</view>
					</scroll-view>
				</view>
				<!--购买数量-->
				<view class="service-count acea-row row-between-wrapper" >
				  <view class="fs-28">购买数量</view>
				  <view>
					<view class="acea-row row-middle">
						<view class="buy_limit" v-if="min_count>0 || max_count>0">
							(<text v-if="min_count>0">{{min_count}}件起购<text v-if="min_count>0 && max_count>0">，</text></text><text v-if="max_count>0">最多{{max_count}}件</text>)
						</view>
						<view class="acea-row row-middle">
							<text class="iconfont icon-ic_Reduce" :class="(cartNum<=1 || (min_count>0 && cartNum<=min_count))?'on':''" @click.stop="addCart(0)"></text>
							<input type="number" maxlength="3" class="input-count" v-model="cartNum" />
							<text class="iconfont icon-ic_increase" :class="max_count>0&&cartNum>=max_count?'on':''" @click.stop="addCart(1)"></text>
						</view>
					</view>
				  </view>
				</view>
			</view>
			<view>
			  <calendar v-if="currentDate" @dateChange="getCalendar" @dayChange="dayChange" :initDay="currentDate" :dotList='userDate' :reservationDefaultDate='reservationDefaultDate'></calendar>
			</view>
			<view v-if="reservationTimeData.length>0" class="time-solt bg-f boder-24">
			  <view class="list acea-row" :class="timeArrow?'on':''">
				 <view v-for="(item,index) in reservationTimeData" class="time" @click="timeDataTap(item)" :key="index">
					 <view class="time-item acea-row row-middle row-center" :class="[(item.stock>0 && !item.disable)?'':'bntHui',currentTimeId==item.attr_reservation_id?'bntActive':'']">
						<view>{{item.start_time}}-{{item.end_time}}</view>
						<view v-if="showStock" class="item-stock">
							<view v-if="item.stock<=0">约满</view>
							<view v-else>余{{item.stock}}</view>
						</view>
					 </view>
				 </view>
			  </view>
			  <view v-if="reservationTimeData.length>9" class="item-toggle" @click="timetap">{{timeArrow?'收起':'展开全部'}}<text class="iconfont fs-22 ml-4" :class="timeArrow?'icon-ic_uparrow':'icon-ic_downarrow'"></text></view>
			</view>
			<!--到店-->
			<view v-if="service_type==1">
				<view class="wrapper virtual_form bg-f boder-24">
					<view class='item acea-row row-between-wrapper'>
						<view class="name">联系人</view>
						<view class="discount">
							<input type="text" placeholder="请填写姓名" placeholder-class="placeholderc" maxlength="12" v-model="customer.real_name" />
						</view>
					</view>
					<view class='item acea-row row-between-wrapper'>
						<view class="name">联系电话</view>
						<view class="discount">
							<input type="number" placeholder="请填写电话" placeholder-class="placeholderc" v-model="customer.phone" />
						</view>
					</view>
				</view>
			</view>
			<!--预约须知-->
			<view class="bg-f boder-24 service-notice">
			  <view class="notice-title">预约须知</view>
			  <view class="notice-info">
					<view class="text">预定规则：预定成功后，系统不支持修改订单，如您有时间调整等需求，请联系商家协商</view>
					<view class="text">放号规则：用户只能预约{{productInfo.show_reservation_days}}天之内的日期</view>
					<view class="text" v-if="productInfo.is_cancel_reservation">取消预约：请于预约开始时间前 {{productInfo.cancel_reservation_time}} 小时进行操作。若距离预约开始已不足 {{productInfo.cancel_reservation_time}} 小时，请您联系商家协商处理。</view>
					<view class="text" v-else>取消预约：预定成功后，不支持取消预约，若您有相关需求请联系商家处理</view>
			  </view>
			</view>
	  </view>
	   <view class="heights"></view>
		 <view class="reservation-bottom">
			<view class='footer acea-row row-between-wrapper'>
			 	<view class='settlement' style='z-index:100' @click="nextStep">下一步</view>
			 </view>
		 </view>
		 <!--选择地址弹窗-->
		 <addressWindow ref="addressWindow" @changeTextareaStatus="changeTextareaStatus" :address='address'
		 	:pagesUrl="pagesUrl" @OnChangeAddress="OnChangeAddress" @changeClose="changeClose"></addressWindow>
		<timeranges :isShow='isShow' :time='timeranges' @confrim="confrim" @cancel="cancels"></timeranges>	
	</view>
</template>

<script>
let sysHeight = uni.getSystemInfoSync().statusBarHeight + 'px';
import { mapGetters } from "vuex";
import { HTTP_REQUEST_URL } from '@/config/app';
import Cache from '@/utils/cache';
import { CART_TIME,CART_ID} from '@/config/cache';
import calendar from '../components/calendar/index.vue';
import timeranges from '@/components/timeranges';
import addressWindow from '@/components/addressWindow';
import confirm from "@/mixins/confirm";
import { Debounce } from '@/utils/validate.js';
import { getAddressList, getAddressDetail } from '@/api/user.js';
import { getReservationDate, getReservationTimes, getReservationMerData, getReservationMerDistance } from '@/api/activity.js';
import { getProductDetail, postCartAdd } from '@/api/store.js';

export default {
	name: 'reservation',
	components: {
		calendar,
		timeranges,
		addressWindow
	},
	mixins: [confirm],
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
			// 日历组件数据
			targetDate: 0, //本月
			timeArrow:false,
			productId:0, //商品id；
			skuId: "", //规格id
			unique:'', //默认选中的属性唯一值；
			attr: {
				cartAttr: false,
				productAttr: [],
				productSelect: {}
			},
			productValue: {},
			attrStyle:false,
			cartNum:1, //预约数量
			reservationTimeData:[], //时间段
			current:0, //当前选中属性索引值
			productInfo:{},
			service_type: 2,
			reservation_type: 0,
			currentService:0,
			userDate:[],
			targetDay:0,//选中天数
			currentTimeId:0, //选中时间段id
			discountInfo: {
				discount: []
			},
			totalPrice: 0,
			totalSvipPrice: 0,
			orderId:'',
			cartInfoId:0,
			reservationDefaultDate:'',
			address: {
				address: false
			}, //地址组件
			addressInfo: {
	
			}, //地址信息
			addressId: 0, //地址id
			pagesUrl: "",
			serviceTypeList: [
				{name: "上门服务",type: 2},
				{name: "到店服务",type: 1},
			],
			service_type: 2,
			domain: HTTP_REQUEST_URL,
			type_tag: HTTP_REQUEST_URL+'/static/images/seckill-tag.png',
			isShowDiscount: false,
			couponData: {},
			customer: {},
			max_count: 0,
			pay_limit: 0,
			min_count: 0,
			svipData: {},
			merData: {},
			attrSelected: {},
			showStock: true,
			currentDate: "",
			parameters: "",
			distance: ""
		}
	},
	computed: {
		...mapGetters(['viewColor','isLogin']),
		confirmShow(){
			let obj = this.orderId && this.confirm.length && this.confirm[0].length;
			return obj;
		}
	},
	onLoad(options){
		let m = (parseInt(new Date().getMonth() + 1) < 10 ? '0' : '') + parseInt(new Date().getMonth() + 1);
		let d = (parseInt(new Date().getDate()) < 10 ? '0' : '') + parseInt(new Date().getDate());
		this.targetDate = parseInt(new Date().getFullYear()) + '-' + m;
		this.targetDay =  d;
		this.currentDate = this.targetDate+'-'+d
		this.productId = options.id;
		this.skuId = options.sku_id;
		this.addressId = options.addressId;
		this.parameters = `?id=${this.productId}&sku_id=${this.skuId}`;
		uni.setStorageSync('parameters', this.parameters);
		if(this.isLogin) {
			this.getaddressInfo();	
			this.$nextTick(function() {
				this.$refs.addressWindow.getAddressList();
			})
		}
	},
	mounted(){
		this.reservationOrderInfo();	
	},
	methods: {
		goBack: function() {
			uni.navigateBack();
		},	
		onAddress: function() {
			let that = this;
			if(that.addressInfo.real_name){
				that.address.address = true;
				that.pagesUrl = '/pages/users/user_address/index?product_type=4';
			}else{
				uni.navigateTo({
					url: `/pages/users/user_address/index?product_type=4`,
				});
			}
		},
		// 关闭地址弹窗；
		changeClose: function() {
			this.$set(this.address, 'address', false);
		},
		/**
		 * 选择地址后改变事件
		 * @param object e
		 */
		OnChangeAddress: function(e) {
			this.addressId = e;
			this.address.address = false;
			this.getaddressInfo();
		},
		/*
		 * 获取默认收货地址或者获取某条地址信息
		 */
		getaddressInfo: function() {
			let that = this;
			if (that.addressId) {
				getAddressDetail(that.addressId).then(res => {
					res.data.is_default = parseInt(res.data.is_default);
					that.addressInfo = res.data || {};
					that.addressId = res.data.address_id || 0;
					that.address.addressId = res.data.address_id || 0;
					that.customer = {real_name: res.data.real_name, phone: res.data.phone}
				})
			} else {
				getAddressList().then(res => {
					that.addressInfo = res.data.list.length > 0 ? res.data.list[0] : {};
					that.addressId = res.data.list.length > 0 ? res.data.list[0].address_id : 0;
					that.address.addressId = res.data.list.length > 0 ? res.data.list[0].address_id : 0;
					that.customer = res.data.list.length > 0 ? {real_name: res.data.list[0].real_name,phone:res.data.list[0].phone } : {real_name: '', phone: ''}
				})
			}
		},
		changeType(item) {
			this.service_type = item.type
		},
		// 打开优惠明细弹窗
		openDiscount(item, index) {
			this.isShowDiscount = !this.isShowDiscount;
		},
		closeDiscount() {
			this.isShowDiscount = false
		},
		/*
		 * 下一步
		 */
		nextStep() {	
			let that = this;
			if(that.service_type == 2 && !that.addressId){
				return that.$util.Tips({
					title: '请选择地址'
				});
			}
			if(!that.currentTimeId){
				return that.$util.Tips({
					title: '请选择时间段'
				});
			}
			let timeData = that.reservationTimeData.find(item => item.attr_reservation_id === that.currentTimeId);
			if(that.cartNum>timeData.stock){
				return that.$util.Tips({
					title: `该时间段库存最大为${timeData.stock}`
				});
			}
			if(that.service_type == 1){
				if(!that.customer.real_name)
				return that.$util.Tips({
					title: '请输入联系人'
				});
				if(!that.customer.phone)
				return that.$util.Tips({
					title: '请输入联系电话'
				});
				if(that.customer.phone && !/^1(3|4|5|7|8|9|6)\d{9}$/i.test(that.customer.phone))
				return that.$util.Tips({
					title: '请输入正确的联系电话'
				});
			}
			if(this.service_type == 1)uni.setStorageSync('customerInfo', this.customer);
			let q = {
				is_new: 1,
				product_id: that.productId,
				cart_num: that.cartNum,
				product_attr_unique: that.attr.productSelect !== undefined ? that.attr.productSelect.unique : "",
				product_type: 0,
				sku_id: that.skuId,
				reservation_id: that.currentTimeId,
				reservation_date: that.targetDate+'-'+that.targetDay
			};
			postCartAdd(q)
				.then(function(res) {
					let cartId = res.data.cart_id
					let arr = (Cache.get(CART_ID)&&JSON.parse(Cache.get(CART_ID))) || []	 
					arr.push(cartId)
					Cache.set(CART_ID, Array.from([...new Set(arr)]))	
					const timestamp = Date.now();
					Cache.set(CART_TIME,timestamp);
					if (that.productInfo.mer_form_id) {
						uni.navigateTo({
							url: `/pages/reservation/reservation_info/index?cart_id=${cartId}&address_id=${that.addressId}&service_type=${that.service_type}&mer_id=${that.productInfo.mer_id}&formType=${that.productInfo.reservation_form_type}` 
						});
					} else {
						uni.navigateTo({
							url: `/pages/users/order_confirm/index?cartId=${cartId}&addressId=${that.addressId}&serviceType=${that.service_type}&merId=${that.productInfo.mer_id}`
						});
					}
				})
				.catch(res => {
					return that.$util.Tips({
						title: res
					});
				});
		},
		// 预约商品详情
		reservationOrderInfo(){
			getProductDetail(this.productId).then(res=>{
				let data = res.data;
				this.$set(this.attr, 'productAttr', res.data.attr);
				this.productValue = res.data.sku;
				this.productInfo = res.data;
				this.productId = data.product_id;
				this.$set(this, 'max_count', res.data.once_max_count);
				this.$set(this, 'pay_limit', res.data.pay_limit);
				this.$set(this, 'min_count', res.data.once_min_count);
				this.$set(this, 'svipData', res.data.show_svip_info || null);		
				this.reservation_type = data.reservation_type;
				this.service_type = data.reservation_type == 1 ? 1 : 2; //1到店，2上门
				this.DefaultSelect();
				this.getMerData(res.data.mer_id);
				this.reservationDate();
				this.reservationTimes();
			}).catch(err=>{
				return this.$util.Tips({
					title: err
				});
			})
		},
		/**
		 * 获取商户信息
		 *
		 */
		getMerData(id) {
			getReservationMerData(id).then(res => {
				this.merData = res.data
				this.getMerLocation(id,{latitude: res.data.lat,longitude: res.data.long})
			})
		},
		getMerLocation(id,data) {
			getReservationMerDistance(id,data).then(res => {
				this.distance = res.data.distance
			})
		},
		
		/**
		 * 默认选中属性
		 *
		 */
		DefaultSelect: function() {
			for (var key in this.productValue) {
				if (this.productValue[key].value_id == this.skuId) {
					this.attrSelected = this.productValue[key];
					this.attr.productSelect = this.attrSelected;
					this.totalPrice = this.attr.productSelect.price * this.cartNum;
				}
			}	
		},
		timeDataTap(item){
			if(item.stock>0 && !item.disable){
				if(this.currentTimeId == item.attr_reservation_id){
					this.currentTimeId = 0;
				}else{
					this.currentTimeId = item.attr_reservation_id;
				}
			}
		},
		dayChange(e){
			this.currentTimeId = 0;
			const dateObj = new Date(e);
			this.targetDay = String(dateObj.getDate()).padStart(2, '0');
			this.reservationDefaultDate = e;
			this.reservationTimes();
		},
		reservationTimes(){
			let data = {
				sku_id:this.skuId,
				date:this.targetDate,
				day:this.targetDay
			}
			this.reservationTimeData = []
			getReservationTimes(this.productId,data).then(res=>{
				this.reservationTimeData = res.data.list;
				this.showStock = res.data.show
			}).catch(err=>{
				return this.$util.Tips({
					title: err
				});
			})
		},
		getCalendar(e){
			this.targetDate = e;
			this.reservationDate();
			this.reservationTimeData = []
			let m = (parseInt(new Date().getMonth() + 1) < 10 ? '0' : '') + parseInt(new Date().getMonth() + 1);
			let date = parseInt(new Date().getFullYear()) + '-' + m
			if(this.targetDate == date) this.reservationTimes()
		},
		// 获取可选择日期；
		reservationDate(){
			let data = {
				sku_id:this.skuId,
				date:this.targetDate
			}
			getReservationDate(this.productId,data).then(res=>{
				this.userDate = res.data.days;
			}).catch(err=>{
				return this.$util.Tips({
					title: err
				});
			})
		},
		tapAttr: function(item, itemn) {
			this.attrSelected = this.productValue[itemn]
			this.skuId = this.productValue[itemn]['value_id']
			this.ChangeAttr(this.attrSelected);
			this.reservationDate();
			this.reservationTimes();
		},
		//获取被选中属性；
		getCheckedValue: function() {
			let productAttr = this.attr.productAttr;
			let value = [];
			for (let i = 0; i < productAttr.length; i++) {
				for (let j = 0; j < productAttr[i].attr_values.length; j++) {
					if (productAttr[i].index === productAttr[i].attr_values[j]) {
						value.push(productAttr[i].attr_values[j]);
					}
				}
			}
			return value;
		},
		/**
		 * 属性变动赋值
		 *
		 */
		ChangeAttr: function(res) {
			let productSelect = res;
			this.attr.productSelect = res;
			this.$set(this, "skuId", productSelect.value_id);
			this.$set(this, "cartNum", this.min_count && this.min_count > this.cartNum ? this.min_count : this.cartNum);
			this.$set(this, "totalPrice", productSelect.price * this.cartNum);
			this.$set(this, "totalSvipPrice", productSelect.svip_price * this.cartNum);
		},
		timetap(){
			this.timeArrow = !this.timeArrow;
		},
		addCart(type){
			//changeValue:是否 加|减
			//获取当前变动属性
			let productSelect = this.attr.productSelect;
			//如果没有属性,赋值给商品默认库存
			if (productSelect === undefined && !this.attr.productAttr.length)
				productSelect = this.attr.productSelect;
			//无属性值即库存为0；不存在加减；
			if (productSelect === undefined) return;
			if (type) {
				this.cartNum++;
				if(this.cartNum > this.max_count&&this.max_count!=0&&this.pay_limit!=0){
					this.$set(this, "cartNum", this.max_count);
					return this.$util.Tips({
						title: "单次购买件数不能超过"+this.max_count+"件！"
					});
				}
			} else {
				this.cartNum--;
				if (this.cartNum < 1) {
					this.$set(this, "cartNum", 1);
				}
				if(this.cartNum < this.min_count&&this.min_count!=0){
					this.$set(this, "cartNum", this.min_count);
					return this.$util.Tips({
						title: "单次购买件数不能少于"+this.min_count+"件！"
					});
				}
			}
			this.$set(this, "totalPrice", this.attr.productSelect.price * this.cartNum);
			this.$set(this, "totalSvipPrice",this.attr.productSelect.svip_price * this.cartNum);
		},
		setValue: Debounce(function(e){
			this.cartNum = e.detail.value;
		}),
	}
};
</script>

<style lang="scss" scoped>
	.sys-head .bg{
		background-image: linear-gradient( 90deg, var(--view-bntColor22) 0%, var(--view-bntColor21) 100%);
	}
	.reservation-main {
		position: relative;
		/*#ifdef MP*/
		margin-top: -80rpx;
		/*#endif*/
		/*#ifndef MP*/
		margin-top: -100rpx;
		/*#endif*/
	}
	.reservation-header {
		background: rgba(255,255,255,.9);
	}
	.reservation-type {
		height: 80rpx;
		.type-name {
			height: 80rpx;
			text-align: center;
			flex: 0 0 50%;
			position: relative;
			&.on {
				height: 96rpx;
				background: #fff;
				color: var(--view-theme);
				font-weight: 500;
				top: -16rpx;
				border-radius: 24rpx 24rpx 0 0;
			}
			.type_tag {
				width: 48rpx;
				height: 80rpx;
				position: absolute;
				bottom: 0;
				background-size: 100% 100%;
				&.type_tag2 {
					right: -48rpx;
					transform: rotateY(180deg);
				}
				&.type_tag1 {
					left: -48rpx;
				}
			}
		}
	}
	.reservation-address {
		padding: 32rpx 26rpx 32rpx 32rpx;
		position: relative;
		.line {
			position: absolute;
			left: 2%;
			bottom: 0;
			width: 96%;
			height: 4rpx;
			image {
				width: 100%;
				height: 100%;
				display: block;
			}
		}
	}
	.address-info {
		width: 580rpx;
		&.info-arrive {
			width: 450rpx;
		}
		.address-name {
			font-size: 30rpx;
			font-weight: 600;
		}
		.address-detail {
			margin-top: 12rpx;
		}
	}
	.address-location {
		width: 188rpx;
		height: 104rpx;
		background-size: 100% 100%;
		flex-direction: column;
		align-items: center;
		.location-distance {
			background: #fff;
			box-shadow: 0px 0px 8px 0px rgba(0,0,0,0.0784);
			min-width: 130rpx;
			max-width: 160rpx;
			height: 36rpx;
			position: relative;
			font-size: 20rpx;
			&::after {
				content: "";
				display: block;
				width: 9rpx;
				height: 9rpx;
				border: 9rpx solid transparent;
				border-top-color: #fff;
				position: absolute;
				bottom: -20rpx;
			}
		}
		.loaction-avatar {
			margin-top: 8rpx;
			width: 52rpx;
			height: 52rpx;
			border-radius: 8rpx;
			border: 6rpx solid #fff;
			box-shadow: 0px 0px 6px 0px rgba(0,0,0,0.0784);
		}
		.location-point {
			width: 6rpx;
			height: 6rpx;
			background: var(--view-theme);
			border-radius: 100%;
			margin-top: 2rpx;
		}
	}
	.service-content {
		padding: 30rpx 20rpx;
		margin-top: 20rpx;
		.service-image {
			width: 140rpx;
			height: 140rpx;
			border-radius: 16rpx;
		}
		.service-name {
			width: 504rpx;
			flex-direction: column;
			justify-content: space-between;
		}
		.price {
			color: var(--view-theme);
		}
	}
	.vip-money{
		margin-left: 13rpx;
		color: #282828;
		font-size: 26rpx;
		font-weight: 700;
	}
	.vip-image{
		width: 70rpx;
		height: 30rpx;
		margin-left: 6rpx;
	}
	.service-specs {
		margin-top: 32rpx;
		.spec-scroll {
			margin-top: 8rpx;
		}
		.spec-item {
			display: flex;
			position: relative;
			margin-right: 28rpx;
			border-radius: 50rpx;
			background: #F5F5F5;
			border: 2rpx solid #F5F5F5;
			padding-right: 20rpx;
			margin-top: 24rpx;
			height: 56rpx;
			flex-wrap: nowrap;
			overflow: hidden;
			&.bntActive{
				background: var(--view-bgColor);
			}
			.spec-image,.image {
				width: 48rpx;
				height: 48rpx;
				border-radius: 100%;
			}
			.spec-attr {
				font-size: 24rpx;
				margin-left: 8rpx;
				flex-shrink: 0;
				 width: calc(100% - 56rpx);
				text-wrap: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
		}
	}
	.service-count {
		margin-top: 32rpx;
		.input-count {
			width: 72rpx;
			height: 36rpx;
			background: #F5F5F5;
			border-radius: 4rpx;
			text-align: center;
			font-size: 24rpx;
			font-weight: 600;
			margin: 0 8rpx;
		}
		.iconfont  {
			font-size: 26rpx;
			&.on {
				color: #bbb;
			}
		}
		.buy_limit {
			font-size: 22rpx;
			color: var(--view-theme);
			margin-right: 30rpx;
			border: none;
		}
	}
	.time-solt {
		margin-top: 20rpx;
		padding: 12rpx 24rpx 32rpx;
		.time {
			margin-right: 18rpx;
			&:nth-child(3n) {
				margin-right: 0;
			}
		}
		.time-item {
			width: 208rpx;
			flex-direction: column;
			border: 1px solid #ddd;
			margin-top: 20rpx;
			padding: 24rpx 0;
			border-radius: 16rpx;
			.item-stock {
				margin-top: 10rpx;
			}
		}
		.item-toggle {
			margin-top: 24rpx;
			text-align: center;
			color: #999999;
			font-size: 22rpx;
			.iconfont {
				font-size: 22rpx;
				margin-left: 4rpx;
			}
		}
	}
	.service-notice {
		margin-top: 20rpx;
		padding: 32rpx 24rpx;
		.notice-title {
			font-size: 28rpx;
		}
		.notice-info {
			color: #666666;
			font-size: 26rpx;
			margin-top: 16rpx;
			.text {
				margin-bottom: 6rpx;
			}
		}
	}
	.virtual_form .discount {text-align: right;}
	::v-deep .uni-input-input {font-size: 28rpx;}
	.reservation-bottom {
		width: 100%;
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 100;
		background-color: #fff;
		.area-tip {
			padding: 0 32rpx;
			height: 80rpx;
			background: var(--view-bgColor);
			color: var(--view-theme);
			.iconfont {
				margin-right: 10rpx;
			}
		}
	}
	.reservation .footer {
		width: 100%;
		height: 100rpx;
		height: calc(120rpx + constant(safe-area-inset-bottom)); ///兼容 IOS<11.2/
		height: calc(120rpx + env(safe-area-inset-bottom)); ///兼容 IOS>11.2/	
		padding: 0 30rpx;
		font-size: 28rpx;
		color: #333;
		box-sizing: border-box;
		z-index: 30;
		.footer_count{
			font-size: 28rpx;
			>view {
				align-items: baseline;
			}
			.pColor {
				margin-left: 12rpx;
			}
		}
		.coupon_price{
			color: #999999;
			font-size: 22rpx;
			margin-top: 10rpx;
			.detail{
				color: #666666;
				background: #F5F5F5;
				border-radius: 26rpx;
				margin-left: 20rpx;
				height: 34rpx;
				line-height: 34rpx;
				display: inline-block;
				width: 104rpx;
				text-align: center;
				font-size: 18rpx;
			}
		}
	}
	.pColor{
		color: var(--view-priceColor);
	}
	.reservation .footer .settlement {
		font-size: 30rpx;
		color: #fff;
		width: 100%;
		height: 72rpx;
		background-color: var(--view-theme);
		border-radius: 60rpx;
		text-align: center;
		line-height: 72rpx;
		font-size: 26rpx;
		&.disabled {
			background-color: #cccccc;
		}
	}
	.heights{
		height: calc(150rpx + constant(safe-area-inset-bottom)); ///兼容 IOS<11.2/
		height: calc(150rpx + env(safe-area-inset-bottom)); ///兼容 IOS>11.2/
	}
	.time:nth-of-type(3n){
		margin-right: 0;
	}
	.list{
		/*#ifdef MP*/
		max-height: 470rpx;
		/*#endif*/
		/*#ifndef MP*/
		max-height: 486rpx;
		/*#endif*/
		
		transition: all 0.3s;
		overflow: hidden;
		&.on{
			max-height:unset;
			height: max-content;
		}
	}
	.header{
		height: 160rpx;
		background: linear-gradient( 360deg, #F5F5F5 0%, rgba(245,245,245,0) 100%);
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
	.bntHui{
		color: #CCCCCC;
		background: #F9F9F9;
		border-color: #F9F9F9 !important;
	}
	.bntActive{
		color: var(--view-theme);
		background: var(--view-bgColor);
		border-color: var(--view-theme) !important;
	}
</style>