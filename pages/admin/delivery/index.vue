<template>
	<view class="deliver-goods pad20 mt20">
		<header class="bg-f boder-24">
			<view class="order-num acea-row row-between-wrapper">
				<view class="num line1">ເລກທີ່ອໍເດີ：{{ delivery.order_sn }}</view>
				<view class="name acea-row row-middle">
					<text class="iconfont icon-ic_user2"></text>
					<text class="line1">{{ delivery.user && delivery.user.nickname }}</text>
				</view>
			</view>
			<view class="address">
				<view class="name">
					{{ delivery.real_name }}<span class="phone">{{ delivery.user && delivery.user_phone }}</span>
				</view>
				<view>{{ delivery.user_address }}</view>
			</view>
			<view class="line">
				<image :src="`${domain}/static/images/line.jpg`" />
			</view>
		</header>
		<view class="wrapper mt20 boder-24">
			<view class="item acea-row row-between">
				<view>ວິທີສົ່ງ</view>
				<view class="mode acea-row row-middle row-right">
					<view class="goods acea-row row-middle row-center" :class="active === index ? 'on' : ''" v-for="(item, index) in types" :key="index" @click="changeType(item, index)">
						<text class="iconfont" :class="active === index ? 'icon-ic_Selected' : 'icon-ic_unselect'"></text>
						<text>{{ item.title }}</text>
					</view>
				</view>
			</view>
			<view v-if="active == 0" class="item acea-row row-between">
				<view>ປະເພດການສົ່ງ</view>
				<view class="mode acea-row row-middle row-right">
					<block v-if="active == 0">
						<view class="goods acea-row row-middle row-center" :class="delivery_type === 1 ? 'on' : ''"  @click="getShipmentType(1)">
							<text class="iconfont" :class="delivery_type === 1 ? 'icon-ic_Selected' : 'icon-ic_unselect'"></text>
							<text>ຕື່ມດ້ວຍຕົນເອງ</text>
						</view>
						<view v-if="crmeb_serve_dump == 1" class="goods acea-row row-middle row-center" :class="delivery_type === 4 ? 'on' : ''"  @click="getShipmentType(4)">
							<text class="iconfont" :class="delivery_type === 4 ? 'icon-ic_Selected' : 'icon-ic_unselect'"></text>
							<text>ພິມໃບປະກາສອີເລັກໂທຣນິກ</text>
						</view>
					</block>
					<!-- <block v-else-if="active == 1">
						<view class="goods acea-row row-middle row-center" :class="delivery_type === 2 ? 'on' : ''"  @click="getShipmentType(2)">
							<text class="iconfont" :class="delivery_type === 2 ? 'icon-ic_Selected' : 'icon-ic_unselect'"></text>
							<text>商家配送</text>
						</view>
						<view v-if="delivery_status  == 1" class="goods acea-row row-middle row-center" :class="delivery_type === 5 ? 'on' : ''"  @click="getShipmentType(5)">
							<text class="iconfont" :class="delivery_type === 5 ? 'icon-ic_Selected' : 'icon-ic_unselect'"></text>
							<text>第三方配送</text>
						</view>
					</block> -->
				</view>
			</view>
			<block v-if="logistics.length>0">
				<view class="list">
					<block v-if="delivery_type == 1">
						<view class="item acea-row row-between-wrapper">
							<view>ບໍລິສັດຂົນສົ່ງ</view>
							<view class="select-box">
								<picker class="pickerBox" @change="bindPickerChange" :value="seIndex" :range="logistics" range-key="label">
									<view class="uni-input">{{logistics[seIndex].label}}</view>
								</picker>
							</view>
						</view>
						<view class="item acea-row row-between-wrapper">
							<view>ເລກທີ່ການຂົນສົ່ງ</view>
							<input type="text" placeholder="ຕື່ມເລກທີ່ການຂົນສົ່ງ" v-model="delivery_id" class="mode" />
							<!-- #ifdef MP -->
							<text class="iconfont icon-ic_camera2" @click="scanCode"></text>
							<!-- #endif -->
							<!-- #ifdef H5 -->
							<text v-if="isWeixin" class="iconfont icon-ic_camera2" @click="scanCode"></text>
							<!-- #endif -->
						</view>
					</block>
					<block v-if="delivery_type == 4">
						<view class="item acea-row row-between-wrapper">
							<view>ບໍລິສັດຂົນສົ່ງ</view>
							<view class="select-box">
								<picker class="pickerBox" @change="bindPickerChange" :value="seIndex" :range="logistics" range-key="label">
									<view class="uni-input">{{logistics[seIndex].label}}</view>
								</picker>
							</view>
						</view>
						<view class="item acea-row row-between-wrapper" v-if="expTemp.length > 0 && delivery_type == 4">
							<view>ໃບປະກາສອີເລັກໂທຣນິກ</view>
							<div style="display: flex;align-items: center;">
								<picker class="pickerBox" @change="bindTempChange" :value="expIndex" :range="expTemp" range-key="title">
									<view class="uni-input input-inline">{{expTemp[expIndex].title}}</view>
								</picker>
								<div class="look" @click="previewImage">ເບິ່ງລ່ວງໜ້າ</div>
							</div>
						</view>
						<view class="item acea-row row-between-wrapper">
							<view>ຊື່ຜູ້ສົ່ງ</view>
							<input type="text" placeholder="ຕື່ມຊື່ຜູ້ສົ່ງ" v-model="from_name" class="mode" />
						</view>
						<view class="item acea-row row-between-wrapper">
							<view>ເບີຜູ້ສົ່ງ</view>
							<input type="text" placeholder="ຕື່ມເບີຜູ້ສົ່ງ" v-model="from_tel" class="mode" />
						</view>
						<view class="item acea-row row-between-wrapper">
							<view>ທີ່ຢູ່ຜູ້ສົ່ງ</view>
							<input type="text" placeholder="ຕື່ມທີ່ຢູ່ຜູ້ສົ່ງ" v-model="from_addr" class="mode" />
						</view>
					</block>
				</view>
			</block>
			<view class="list" v-if="delivery_type == 2">
				<view class="item acea-row row-between-wrapper">
					<view>ຊື່ຜູ້ສົ່ງສິນຄ້າ</view>
					<view v-if="deliveryList.length>0" class="select-box">
						<picker class="pickerBox" @change="deliveryPickerChange" :value="deIndex" :range="deliveryList" range-key="name">
							<view class="uni-input">{{deliveryList[deIndex].name}}</view>
						</picker>
					</view>
					<input v-else type="text" placeholder="ຕື່ມຊື່ຜູ້ສົ່ງສິນຄ້າ" maxlength="10" v-model="to_name" class="mode" />
				</view>
				<view class="item acea-row row-between-wrapper">
					<view>ເບີຜູ້ສົ່ງສິນຄ້າ</view>
					<input type="text" placeholder="ຕື່ມເບີຜູ້ສົ່ງສິນຄ້າ" v-model="to_phone" class="mode" />
				</view>
			</view>
			<block v-if="delivery_type == 5">
				<view class="item acea-row row-between-wrapper">
					<view>ຈຸດສົ່ງ</view>
					<view class="select-box">
						<picker class="pickerBox" @change="bindStoreChange" :value="storeIndex" :range="storeList" range-key="label">
							<view class="uni-input">{{storeList[storeIndex] && storeList[storeIndex].label}}</view>
						</picker>
					</view>
				</view>
				<view class="item acea-row row-between-wrapper">
					<view>ນ້ຳໜັກພັດສະດຸ</view>
					<input type="number" placeholder="ຕື່ມນ້ຳໜັກພັດສະດຸ" v-model="cargo_weight" class="mode" />
				</view>
				<view class="item acea-row row-between-wrapper">
					<view>ໝາຍເຫດການສົ່ງ</view>
					<input type="textarea" placeholder="ຕື່ມໝາຍເຫດການສົ່ງ" v-model="mark" class="mode textarea" />
				</view>
			</block>
			<view class="list">
				<view class="item acea-row row-between-wrapper">
					<view>ໝາຍເຫດສົ່ງສິນຄ້າ</view>
					<input type="textarea" placeholder="ຕື່ມໝາຍເຫດສົ່ງສິນຄ້າ" v-model="remark" class="mode textarea" />
				</view>
			</view>
		</view>
		<view class="bg-f boder-24 mt20">
			<block v-if="(delivery.orderProduct) && ((delivery.orderProduct.length > 1) || (delivery.orderProduct.length==1 && delivery.orderProduct[0]['refund_num']>1)) && activity_type != 2">
				<view class="shipment-title item acea-row row-between-wrapper">
					<view>ສົ່ງແຍກ</view>
					<view class="mode acea-row row-middle row-right">
						<view class="goods" :class="curSplit === item.key ? 'on' : ''" v-for="(item, index) in splitList" :key="index" @click="changeSplit(item, index)">
							<text class="iconfont"  :class="curSplit === item.key ? 'icon-ic_Selected' : 'icon-ic_unselect'"></text>{{ item.title }}
						</view>
					</view>
				</view>
				<block v-if="curSplit">
					<view v-for="(item, index) in delivery.orderProduct" :key="index">
						<view class="pro_list acea-row row-between-wrapper">
							<view class="checkbox" @tap.stop="checkedChange(item)">
								<text v-if="item.checked" class="iconfont icon-a-ic_CompleteSelect"></text>
								<text v-else class="iconfont icon-ic_unselect"></text>
							</view>
							<view v-if="item.cart_info && item.cart_info.product" class="picture picture90">
								<image :src="item.cart_info.product.image"></image>
							</view>
							<view class="info" v-if="item.cart_info && item.cart_info.product">
								<view class="name line1">{{item.cart_info.product.store_name}}</view>
								<view class="info_sku" v-if="item.cart_info && item.cart_info.productAttr">{{item.cart_info.productAttr.sku}}</view>
								<view class="acea-row row-between-wrapper info-carnum">
									<view class="info_price" v-if="item.cart_info && item.cart_info.productAttr">
										<priceFormat :price="item.cart_info.productAttr.price" weight intSize="32" floatSize="22" labelSize="22"></priceFormat>
									</view>
									<view class='carnum acea-row row-center-wrapper'>
										<view class="reduce" :class="item.numSub ? 'on' : ''" @click.stop='subCart(item)'>
											<text class="iconfont icon-ic_Reduce"></text>
										</view>
										<view class='num'>{{item.split_num}}</view>
										<view class="plus" :class="item.numAdd ? 'on' : ''" @click.stop='addCart(item)'>
											<text class="iconfont icon-ic_increase"></text>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</block>
			</block>
			<block v-if="!curSplit">
				<view class="pro_count" v-if="delivery.orderProduct">
					<view class="title">ລວມ{{delivery.total_num}}ລາຍການ</view>
					<view v-for="(item, index) in delivery.orderProduct" :key="index">
						<view class="pro_list acea-row row-between">
							<view v-if="item.cart_info && item.cart_info.product" class="picture">
								<image :src="item.cart_info.product.image"></image>
							</view>
							<view class="info pro_info" v-if="item.cart_info && item.cart_info.product">
								<view class="name line2">{{item.cart_info.product.store_name}}</view>
								<view class="info_sku" v-if="item.cart_info && item.cart_info.productAttr">{{item.cart_info.productAttr.sku}}</view>
							</view>
							<view class="pro_price" v-if="item.cart_info && item.cart_info.productAttr">
								<view class="info_price">
									<priceFormat :price="item.cart_info.productAttr.price" weight intSize="32" floatSize="22" labelSize="22"></priceFormat>
								</view>
								<view class="info_num">x{{item.product_num}}</view>
								<view class="refund_num" v-if="item.product_num-item.refund_num>0">{{item.product_num-item.refund_num}}ລາຍການ{{item.is_refund==1?'ກຳລັງຄືນເງິນ' : item.is_refund==2 ? 'ຄືນເງິນແລ້ວ' : item.is_refund==3?'ຄືນເງິນທັງໝົດ':''}}</view>
							</view>
						</view>
					</view>
<view class="footer">
								ລວມ{{delivery.total_num}}ລາຍການ, ຊຳລະແລ້ວ
						<priceFormat :price="delivery.pay_price" weight intSize="32" floatSize="22" labelSize="22"></priceFormat>
					（ ຄ່າຂົນສົ່ງ₭{{delivery.pay_postage}} ）
					</view>
				</view>
			</block>
		</view>
		<view style="height:5.4rem;"></view>
		<view class="confirm_btn"><view class="confirm" @click="saveInfo">ຢືນຢັນການສົ່ງ</view></view>
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
		getAdminOrderDetail,
		setAdminOrderDelivery,
		orderExportTemp,
		orderDeliveryInfo,
		getTempAndDelivery,
		getDeliveryStoreLst,
		getDeliveryPersonList
	} from "@/api/admin";
	import { expressList } from "@/api/order";
	import { checkPhone } from '@/utils/validate.js';
	import { HTTP_REQUEST_URL } from '@/config/app';
	export default {
		name: "GoodsDeliver",
		components: {},
		props: {},
		data: function() {
			return {
				types: [{
						type: 1,
						title: "ສົ່ງສິນຄ້າ"
					},
					// {
					// 	type: 2,
					// 	title: "ສົ່ງເຖິງບ້ານ"
					// },
					{
						type: 3,
						title: "ບໍ່ຕ້ອງການຂົນສົ່ງ"
					}
				],
				deliveryTypes: [
					{
						type: 1,
						title: "ຕື່ມດ້ວຍຕົນເອງ"
						}
				],
				splitList: [
					{
						title: 'ເປີດ',
						key: 1
					},
					{
						title: 'ປິດ',
						key: 0
					}
				],
				curSplit: 0,
				curExpress: 1,
				active: 0,
				order_id: "",
				delivery: {
					user: {}
				},
				logistics: [],
				delivery_type: 1,
				delivery_name: "",
				to_phone: '', //送货人电话
				to_name: '', //送货人姓名
				remark: "",
				mark: "",
				cargo_weight: 0,
				delivery_id: "",
				mer_config_temp_id: "",
				mer_from_com: "",
				seIndex: 0,
				deIndex: 0,
				storeIndex: 0,
				merId: "",
				expIndex:0,
				expTemp:[], // 快递模板
				from_name:'', // 发货人名称
				from_tel:'',  // 发货人电话
				from_addr:"", // 发货人地址
				fictitious_content: '',
				isTemp: false,
				isDelivery: false,
				crmeb_serve_dump: 0,
				delivery_status: 0,
				is_virtual: 0,
				splitProducts: [],
				storeList: [],
				deliveryList: [],
				activity_type: 0,
				domain: HTTP_REQUEST_URL,
				// #ifdef H5
				isWeixin: this.$wechat.isWeixin()
				// #endif
			};
		},
		watch: {

		},
		onLoad: function(option) {
			this.order_id = option.id;
			this.merId = option.merId
			this.getIndex();
			this.expressList();
			this.getDeliveryList();
			this.orderDeliveryInfo();
		},
		methods: {
			// 扫描快递单号一维码
			scanCode() {
				// #ifdef MP
				let that = this;
				uni.scanCode({
					scanType: ['barCode'],
					success(res) {
						let code = res.result.split(",")
						that.delivery_id = code.length == 1 ? code[0] : code[1];
					}
				})
				// #endif
				// #ifdef H5
				if (this.$wechat.isWeixin()) {
					this.$wechat.wechatEvevt('scanQRCode', {
						needResult: 1,
						scanType: ['barCode']
					}).then(res => {
						let code = res.resultStr.split(",")
						that.delivery_id = code.length == 1 ? code[0] : code[1];
					});
				}
				// #endif
			},
			// 预览图片
			previewImage(){
				uni.previewImage({
					urls: [this.expTemp[this.expIndex].pic],
					success:function(){},
					fail:function(error){}
				});
			},
			// 是否开启电子面单和同城配送
			isOpenDeliveryTemp(is_virtual){
				let that = this
				getTempAndDelivery(that.merId).then(
					res => {
						if(is_virtual == 1){
							that.delivery_type = 3
							that.types = [
								{type: 3,title: "无需物流"}
							]
						}else{
							that.crmeb_serve_dump = res.data.crmeb_serve_dump
							that.delivery_status = res.data.delivery_status
							if(res.data.crmeb_serve_dump == 1){
								that.deliveryTypes.push({type: 4,title: "电子面单打印"})
							}
						}
					},
					error => {
						that.$util.Tips({
							title: error
						})
					}
				);
			},
			//获取电子面单默认数据
			getDump(){
				let that = this;
				that.expTemp.forEach((val,index) =>{
					if(val.temp_id == that.mer_config_temp_id){
						that.expIndex = index;
						return;
					}
				})
			},
			 //获取门店列表
			getStoreList() {
			  getDeliveryStoreLst(this.merId).then((res) => {
					this.storeList = res.data
			    }).catch((error) => {
						this.$util.Tips({
							title: error
						})
			    })
			},
			// 获取送货人数据
			getDeliveryList() {
				getDeliveryPersonList(this.merId).then((res) => {
					this.deliveryList = res.data
					this.to_phone = this.deliveryList[this.deIndex]['phone']
			    }).catch((error) => {
						this.$util.Tips({
							title: error
						})
			    })
			},
			changeType: function(item, index) {
				this.active = index;
				this.delivery_name = "";
				this.delivery_id = "";
				this.delivery_type = item.type;
			},
			getShipmentType(type) {
				this.delivery_type = type;
				if(type == 5){
					this.getStoreList()
				}
			},
			changeSplit: function(item, index) {
				this.curSplit = item.key;
			},
			getIndex: function() {
				let that = this;
				getAdminOrderDetail(that.merId,that.order_id).then(
					res => {
						res.data.orderProduct.forEach((goods, j) => {
							goods.checked = true
							goods.split_num = goods.refund_num
						})
						that.delivery = res.data;
						that.activity_type = res.data.activity_type;
						that.is_virtual = res.data.is_virtual;
						that.isOpenDeliveryTemp(that.is_virtual);
					},
					error => {
						that.$util.Tips({
							title: error
						})
					}
				);
			},
			expressList: function() {
				let that = this;
				expressList().then(
					res => {
						that.logistics = res.data;
						that.getExpTemp(res.data[0].value)
					},
					error => {
						that.$util.Tips({
							title: error
						})
					}
				);
			},
			/*选择分单商品*/
			checkedChange(item) {
				item.checked = !item.checked;
			},
			/*获取分单商品*/
			getSplitProduct() {
				let that = this;
				let data = [];
				that.delivery.orderProduct.map((item) => {
					if(item.checked){
						data.push({id:item.order_product_id,num:item.split_num})
					}
				})
				return data;
			},
			subCart(item) {
				if(item.split_num > 1){
					item.split_num--
				}
			},
			addCart(item) {
				if(item.split_num < item.refund_num){
					item.split_num++
				}
			},
			async saveInfo() {
				let that = this,
				delivery_type = that.delivery_type,
				delivery_name = that.logistics[that.seIndex].value,
				delivery_id = that.delivery_id,
				save = {};
				save.delivery_name = delivery_name
				save.delivery_type = delivery_type
				save.is_split = that.curSplit
				save.remark = that.remark
				if(that.curSplit){
					that.splitProducts = that.getSplitProduct()
					if(that.splitProducts.length == 0){
						return this.$util.Tips({
							title: 'ກະລຸນາເລືອກສິນຄ້າສົ່ງແຍກ'
						})
					}
				}
				save.split = that.splitProducts;
				if(delivery_type==1){
					if (!delivery_id) {
						return this.$util.Tips({
							title: 'ກະລຸນາຕື່ມເລກທີ່ຂົນສົ່ງ'
						})
					}
					save.delivery_id = delivery_id
					that.setInfo(save);
				}
				if(delivery_type == 2){
					that.to_name = that.deliveryList.length> 0 ? that.deliveryList[that.deIndex]['name'] : that.to_name
					if (!that.to_name) {
						return this.$util.Tips({
							title: 'ກະລຸນາຕື່ມຊື່ຜູ້ສົ່ງສິນຄ້າ'
						})
					}
					if (!that.to_phone) {
						return this.$util.Tips({
							title: 'ກະລຸນາຕື່ມເບີໂທຜູ້ສົ່ງສິນຄ້າ'
						})
					}
					if (!(/^1[3456789]\d{9}$/.test(that.to_phone))) {
						return this.$util.Tips({
							title: 'ກະລຸນາຕື່ມເບີໂທທີ່ຖືກຕ້ອງ'
						})
					}
					save.delivery_name = that.to_name;
					save.delivery_id = that.to_phone;
					that.setInfo(save);
				}
				if(delivery_type == 3){
					save.remark = that.remark;
					that.setInfo(save);
				}
				if(delivery_type==4){
					if (!that.from_name) {
						return this.$util.Tips({
							title: 'ກະລຸນາຕື່ມຊື່ຜູ້ສົ່ງ'
						})
					}
					if (!that.from_tel) {
						return this.$util.Tips({
							title: 'ກະລຸນາຕື່ມເບີໂທຜູ້ສົ່ງ'
						})
					}
					if (!(/^1[3456789]\d{9}$/.test(that.from_tel))) {
						return this.$util.Tips({
							title: 'ກະລຸນາຕື່ມເບີໂທທີ່ຖືກຕ້ອງ'
						})
					}
					if (!that.from_addr) {
						return this.$util.Tips({
							title: 'ກະລຸນາຕື່ມທີ່ຢູ່ຜູ້ສົ່ງ'
						})
					}
					if(that.expTemp.length==0){
						return this.$util.Tips({
							title: 'ກະລຸນາເລືອກໃບປະກາສອີເລັກໂທຣນິກ'
						})
					}
					save.from_name = that.from_name
					save.from_tel = that.from_tel
					save.from_addr = that.from_addr
					save.temp_id = that.expTemp[that.expIndex].temp_id
					that.setInfo(save);
				}
				if(delivery_type == 5){
					if(!that.storeList[that.storeIndex])return this.$util.Tips({
						title: 'ກະລຸນາເລືອກຈຸດສົ່ງ'
					})
					save.station_id = that.storeList[that.storeIndex].value
					save.cargo_weight = that.cargo_weight;
					save.mark = that.mark;
					that.setInfo(save);
				}
			},
			setInfo: function(item) {
				let that = this;
				setAdminOrderDelivery(that.merId,that.order_id,item).then(
					res => {
						that.$util.Tips({
							title: res.message,
							icon: 'success',
							mask: true
						})
						let type = that.is_virtual ? 4 : 3
						setTimeout(res => {
							uni.redirectTo({
								url:`/pages/admin/orderList/index?types=${type}&merId=${that.merId}`
							})
						}, 1000)
					},
					error => {
						that.$util.Tips({
							title: error
						})
					}
				);
			},
			bindPickerChange(e) {
				this.seIndex = e.detail.value
				this.getExpTemp(this.logistics[e.detail.value].value)
			},
			deliveryPickerChange(e) {
				this.deIndex = e.detail.value
				const selectedRow = this.deliveryList.find(option => option.service_id === this.deliveryList[this.deIndex]['service_id']);
				this.to_phone = selectedRow.phone
			},
			bindTempChange(e) {
				this.expIndex = e.detail.value
			},
			bindStoreChange(e){
				this.storeIndex = e.detail.value
			},
			getExpTemp(code){
				orderExportTemp({
					com: code
				}).then(res=>{
					this.expTemp = res.data.data
				})
			},
			// 获取订单打印默认配置
			orderDeliveryInfo(){
				let that = this
				orderDeliveryInfo(that.merId).then(
					res => {
						that.from_name = res.data.mer_from_name;
						that.from_tel = res.data.mer_from_tel;
						that.from_addr = res.data.mer_from_addr;
						that.mer_config_temp_id = res.data.mer_config_temp_id;
						that.mer_from_com = res.data.mer_from_com
					},
					error => {
						that.$util.Tips({
							title: error
						})
					}
				)
			}
		}
	};
</script>

<style lang="scss" scoped>
	/*发货*/
	.uni-input{
		display: block;
		width: 400rpx;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	}
	.input-inline{
		width: auto;
	}
	.deliver-goods header .order-num {
		padding: 0 30rpx;
		border-bottom: 1px solid #eeeeee;
		height: 72rpx;
	}
	.deliver-goods header .order-num .num {
		width: 420rpx;
		font-size: 24rpx;
		color: #666;
		position: relative;
	}
	.deliver-goods header .order-num .name {
		width: 200rpx;
		font-size: 24rpx;
		color: #282828;
		text-align: center;
	}
	.deliver-goods header .order-num .name .line1 {
		width: 160rpx;
	}
	.deliver-goods header .order-num .name .iconfont {
		font-size: 36upx;
		color: #2291F8;
		margin-right: 5upx;
	}
	.deliver-goods header .address {
		font-size: 24upx;
		color: #999;
		padding: 30rpx;
	}
	.look{
		margin-left: 20rpx;
		color: #1890FF;
	}
	.deliver-goods header .address .name {
		font-size: 34upx;
		color: #282828;
		margin-bottom: 10upx;
	}
	.deliver-goods header .address .name .phone {
		margin-left: 40upx;
	}
	.deliver-goods header .line {
		width: 670rpx;
		height: 3upx;
		margin-left: 15rpx;
	}
	.deliver-goods header .line image {
		width: 100%;
		height: 100%;
		display: block;
	}
	.deliver-goods .wrapper {
		width: 100%;
		background-color: #fff;
	}
	.deliver-goods .wrapper .item {
		padding: 0 30upx;
		padding: 22rpx 30rpx;
		font-size: 30rpx;
		color: #282828;
		position: relative;
	}
	.deliver-goods .wrapper .item .mode {
		width: 480upx;
		height: 100%;
		text-align: right;
		font-size: 30rpx;
	}
	.deliver-goods .wrapper .item .iconfont {
		color: #2291F8;
	}
	.deliver-goods .wrapper .item .mode .iconfont,.shipment-title .iconfont {
		font-size: 32rpx;
		color: #ccc;
		margin-right: 6rpx;
	}
	.deliver-goods .wrapper .item .mode .goods~.goods{
		margin-left: 36rpx;
	}
	.deliver-goods .wrapper .item .mode .goods {
		margin-bottom: 20rpx;
		color: #666;
	}
	.shipment-title .goods {
		color: #666;
	}
	.deliver-goods .wrapper .item .mode .goods.on,.shipment-title .goods.on,
	.deliver-goods .wrapper .item .mode .goods.on .iconfont,
	.shipment-title .goods.on .iconfont {
		color: #2291F8;
	}
	.shipment-title .goods~.goods {
		margin-left: 30rpx;
	}
	.deliver-goods .wrapper .item .icon-up {
		position: absolute;
		font-size: 35upx;
		color: #2c2c2c;
		right: 30upx;
	}
	.deliver-goods .wrapper .item select {
		direction: rtl;
		padding-right: 60upx;
		position: relative;
		z-index: 2;
	}
	.deliver-goods .wrapper .item .input-placeholder{
		color: #bbb;
		font-size: 30rpx;
	}
	.deliver-goods .confirm_btn {
		position: fixed;
		bottom: 0;
		padding: 20rpx 30rpx;
		background: #fff;
		width: 100%;
		left: 0;
	}
	.deliver-goods .confirm {
		font-size: 28upx;
		color: #fff;
		width: 100%;
		height: 88upx;
		background-color: #2291F8;
		text-align: center;
		line-height: 88upx;
		border-radius: 50rpx;
	}
	.select-box {
		flex: 1;
		height: 100%;
		.pickerBox {
			display: flex;
			align-items: center;
			justify-content: flex-end;
			width: 100%;
			height: 100%;
			text-align: right;
			position: relative;
			.iconfont{
				font-size: 28rpx;
				color: #bbb;
				position: absolute;
				right: 0;
				top: 10rpx;
			}
		}
	}
	.shipment-title{
		height: 86rpx;
		padding: 0 30rpx;
	}
	.pro_list{
		width: 100%;
		padding: 20rpx 30rpx;
		position: relative;
	}
	.pro_list .checkbox{
		width: 54rpx;
		.iconfont{
			color: #2291F8;
			font-size: 36rpx;
		}
	}
	.pro_list .picture{
		width: 130rpx;
		height: 130rpx;
		&.picture90, &.picture90 image{
			width: 180rpx;
			height: 180rpx;
		}
	}
	::v-deep .pro_list .picture image{
		width: 130rpx;
		height: 130rpx;
		border-radius: 16rpx;
	}
	.pro_count .title{
		padding: 20rpx 30rpx;
		line-height: 50rpx;
	}
	.pro_list .info{
		width: 380rpx;
		font-size: 28rpx;
		color: #282828;
	}
	.pro_list .info .name {
		width: 380rpx;
	}
	.pro_list .pro_info{
		width: 350rpx;
	}
	.pro_list .info_num{
		color: #ff9600;
		margin-top: 10rpx;
	}
	.pro_list .refund_num{
		margin-top: 10rpx;
		font-size: 24rpx;
	}
	.pro_list .pro_price{
		text-align: right;
		width: 140rpx;
	}
	.pro_list .info-carnum {
		margin-top: 40rpx;
	}
	.pro_list .info .info_sku{
		color: #999;
		font-size: 20rpx;
		margin-top: 14rpx;
	}
	.footer{
		padding: 20rpx 30rpx;
		text-align: right;
		line-height: 50rpx;
		>text{
			color: #ff9600;
			margin-left: 6rpx;
		}
	}
</style>
