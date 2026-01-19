<template>
	<view :style="viewColor">
		<view class="add_invoicing popup-main bg-f" :class="invoice.invoice==true?'on':''">
			<view class='title font-500'>ເລືອກໃບແຈ້ງໜີ້<text class='iconfont icon-ic_close popup-close' @tap='close'></text></view>
			<form @submit="formSubmit" report-submit="true">
				<view class="panel">
					<view v-if="receipt_title_type == '1'" class="acea-row row-middle">
						<view>ປະເພດໃບແຈ້ງໜີ້</view>
						<input name="receipt_type" :value="typeName" disabled="true" />
					</view>
					<view v-if="receipt_title_type == '2'" class="acea-row row-middle">
						<view>ປະເພດໃບແຈ້ງໜີ້</view>
						<input name="receipt_type" :value="typeName" disabled="true" />
						<text class="iconfont icon-ic_rightarrow" @click.stop="callType"></text>
					</view>
					<view class="acea-row row-middle">
						<view>ປະເພດຫົວຂໍ້</view>
						<radio-group name="receipt_title_type" @change="changeHeader">
							<label>
								<radio value="1" :checked="receipt_title_type == '1' ? true : false" /><text>ສ່ວນບຸກຄົນ</text>
							</label>
							<label>
								<radio value="2" :checked="receipt_title_type == '2' ? true : false" /><text>ບໍລິສັດ</text>
							</label>
						</radio-group>
					</view>
					<view class="acea-row row-middle">
						<view>ຫົວຂໍ້ໃບແຈ້ງໜີ້</view>
						<input name="receipt_title" :value="receipt_title" :maxlength="20" placeholder="ຊື່ບໍລິສັດທີ່ຕ້ອງການອອກໃບແຈ້ງໜີ້"/>
						<text class="iconfont icon-ic_rightarrow" @click="callTitle" ></text>
					</view>
					<view v-show="receipt_title_type == '2'" class="acea-row row-middle">
						<view>ເລກປະຈຳຕົວຜູ້ເສຍພາສີ</view>
						<input name="duty_paragraph" :value="duty_paragraph"  placeholder="ເລກປະຈຳຕົວຜູ້ເສຍພາສີ" />
					</view>
					<view class="acea-row row-middle">
						<view>ອີເມວ</view>
						<input name="email" :value="email"  placeholder="ອີເມວຕິດຕໍ່ຂອງທ່ານ" />
					</view>
				</view>
				<view v-show="receipt_title_type == '2' && receipt_type == '2'" class="panel">
					<view class="acea-row row-middle">
						<view>ທະນາຄານ</view>
						<input name="bank_name" :value="bank_name"  placeholder="ທະນາຄານຂອງທ່ານ" />
					</view>
					<view class="acea-row row-middle">
						<view>ເລກບັນຊີທະນາຄານ</view>
						<input name="bank_code" :value="bank_code"  placeholder="ເລກບັນຊີທະນາຄານຂອງທ່ານ" />
					</view>
					<view class="acea-row row-middle">
						<view>ທີ່ຢູ່ບໍລິສັດ</view>
						<input name="address" :value="address"  placeholder="ທີ່ຢູ່ບໍລິສັດຂອງທ່ານ" />
					</view>
					<view class="acea-row row-middle">
						<view>ໂທລະສັບບໍລິສັດ</view>
						<input name="tel" :value="tel"  placeholder="ໂທລະສັບບໍລິສັດຂອງທ່ານ" />
					</view>
				</view>
				<view class="btn-wrap">
					<button class="button acea-row row-middle row-center" form-type="submit">ສົ່ງຄຳຮ້ອງຂໍ</button>
					<button class="back acea-row row-middle row-center" @tap="noInvoice">ບໍ່ອອກໃບແຈ້ງໜີ້</button>
				</view>
			</form>
			<view :class="{ mask: popupType || popupTitle }"></view>
			<view class="popup popup-main" :class="{ on: popupType }">
				<view class="title font-500">ເລືອກປະເພດໃບແຈ້ງໜີ້<text class="iconfont icon-ic_close popup-close" @click="closeType"></text></view>
				<scroll-view scroll-y="true">
					<radio-group name="invoice-type" @change="changeType">
						<label v-for="item in invoiceTypeList" :key="item.type" class="acea-row row-middle bg-f boder-24">
							<view class="text">
								<view>{{ item.name }}</view>
								<view class="info">{{ item.info }}</view>
							</view>
							<radio :value="item.type" :checked="receipt_type == item.type ? true : false" />
						</label>
					</radio-group>
				</scroll-view>
				<button class="acea-row row-center row-middle" @tap="closeType">ຢືນຢັນ</button>
			</view>
			<view class="popup popup-main" :class="{ on: popupTitle }">
				<view class="title font-500">ເລືອກຫົວຂໍ້<text class="iconfont icon-ic_close popup-close" @click="closeTitle"></text></view>
				<scroll-view v-if="invoiceList.length > 0" scroll-y="true">
					<radio-group name="invoice-title" @change="changeTitle">
						<template v-for="item in invoiceList">
							<label :key="item.user_receipt_id" class="acea-row row-middle" :style="{'background-image':`url(${domain}/static/images/invoice_bg.png)`}">
								<view class="text">
									<view class="acea-row row-middle">
										<view class="name">{{ item.receipt_title }}</view>
										<view v-if="item.is_default" class="label">ເລີ່ມຕົ້ນ</view>
									</view>
									<view class="type" :class="{ special: item.receipt_type == '2'}">{{ item.receipt_type == 1 ? 'ໃບແຈ້ງໜີ້ທົ່ວໄປ' : 'ໃບແຈ້ງໜີ້ສະເພາະ'}}</view>
								</view>
								<radio :value="item.user_receipt_id" :checked="item.user_receipt_id == invoice_id ? true : false" />
							</label>
						</template>
					</radio-group>
				</scroll-view>
				<view v-else class="nothing">
					<image class="picture" :src="`${domain}/static/images/noInvoice.png`"></image>
					<view class="nothing_text">ທ່ານຍັງບໍ່ໄດ້ເພີ່ມຂໍ້ມູນໃບແຈ້ງໜີ້ເທື່ອ~</view>
				</view>
				<button class="acea-row row-center row-middle" v-if="invoice.add" @tap="addTitle"><text class="iconfont icon-ic_sort2"></text><text>ເພີ່ມຫົວຂໍ້ໃໝ່</text></button>
				<!-- <button v-else class="acea-row row-center row-middle btn-default" @tap="close">不开发票</button> -->
			</view>
		</view>
		<view class='mask' catchtouchmove="true" :hidden='invoice.invoice==false' @tap='close'></view>
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
	import { invoiceDefault, invoice, invoiceDetail } from '@/api/user.js';
	import { mapGetters } from "vuex";
	import { HTTP_REQUEST_URL } from '@/config/app';
	export default {
		props: {
			invoice: {
				type: Object,
				default: function() {
					return {
						invoice: false,
						mer_id: 0,
					};
				}
			}
		},
		computed: { ...mapGetters(['viewColor'])},
		data() {
			return {
				domain: HTTP_REQUEST_URL,
				id: '',
				receipt_title_type: '1',
				receipt_type: '1',
				drawer_phone: '',
				receipt_title: '',
				duty_paragraph: '',
				tel: '',
				address: '',
				bank_name: '',
				bank_code: '',
				is_default: 0,
				email: '',
				isDefault: [],
				typeName: 'ໃບແຈ້ງໜີ້ອີເລັກໂທຣນິກທົ່ວໄປ',
				popupType: false,
				popupTitle: false,
				invoiceTypeList: [{
						type: '1',
						name: 'ໃບແຈ້ງໜີ້ອີເລັກໂທຣນິກທົ່ວໄປ',
						info: 'ສົ່ງໄປທີ່ອີເມວທີ່ໃຫ້ໄວ້ເລີ່ມຕົ້ນ'
					},
					{
						type: '2',
						name: 'ໃບແຈ້ງໜີ້ພາສີມູນຄ່າເພີ່ມສະເພາະ',
						info: 'ໃບແຈ້ງໜີ້ເຈ້ຍຈະສົ່ງທາງໄປສະນີ'
					}
				],
				special_invoice: true,
				invoice_func: true,
				invoiceList: [],
				invoice_checked: '',
				invoice_id: '',
				order_id: '',
				news: '',
				cartId: '',
				pinkId: '',
				couponId: '',
				addressId: '',
				invoiceData: {},
				formvalidate: false
			}
		},
		watch: {
		},
		onLoad(option) {
			this.news = option.news;
			this.cartId = option.cartId;
			this.pinkId = option.pinkId;
			this.couponId = option.couponId;
			this.addressId = option.addressId;
			if (option.special_invoice == 'false') {
				this.$set(this, 'special_invoice', false);
			}
		},
		onShow(){
			this.getInvoiceDefault();
			this.popupTitle = false;
		},
		methods: {
			getInvoiceList() {
				invoice().then(res => {
					for (let i = 0; i < res.data.length; i++) {
						res.data[i].user_receipt_id = res.data[i].user_receipt_id.toString();
						if (res.data[i].is_default) {
							this.invoice_id = res.data[i].user_receipt_id;
						}
					}
					this.$set(this, 'invoiceList', res.data);
				}).catch(err => {
					this.$util.Tips({
						title: err
					});
				});
			},
			getInvoiceDefault() {
				let params = {
					is_default: 1,
				}
				invoice(params).then(res => {
					let data = res.data[0];
					this.typeName = data.receipt_type == '1' ? 'ໃບແຈ້ງໜີ້ອີເລັກໂທຣນິກທົ່ວໄປ' : 'ໃບແຈ້ງໜີ້ພາສີມູນຄ່າເພີ່ມສະເພາະ'
					this.receipt_title_type = data.receipt_title_type;
					this.receipt_type = data.receipt_type ;
					this.receipt_title = data.receipt_title;
					this.email = data.email;
					this.duty_paragraph = data.duty_paragraph;
					this.bank_name = data.bank_name;
					this.bank_code = data.bank_code;
					this.address = data.address;
					this.tel = data.tel;
					this.invoice_id = data.user_receipt_id.toString();
					this.popupTitle = false;
				}).catch(err => {});
			},
			getInvoiceDetail(id){
				invoiceDetail(id).then(res => {
					uni.hideLoading();
					this.receipt_title_type = res.data.receipt_title_type;
					this.receipt_type = res.data.receipt_type;
					this.typeName = this.receipt_type == '1' ? 'ໃບແຈ້ງໜີ້ອີເລັກໂທຣນິກທົ່ວໄປ' : 'ໃບແຈ້ງໜີ້ພາສີມູນຄ່າເພີ່ມສະເພາະ'
					this.receipt_title = res.data.receipt_title;
					this.email = res.data.email;
					this.duty_paragraph = res.data.duty_paragraph;
					this.bank_name = res.data.bank_name;
					this.bank_code = res.data.bank_code;
					this.address = res.data.address;
					this.tel = res.data.tel;
					this.is_default = res.data.is_default;
				}).catch(err => {
					uni.hideLoading();
					this.$util.Tips({
						title: err
					});
				});
			},
			close: function() {
				this.$emit('changeInvoiceClose','');
			},
			noInvoice: function(){
				uni.setStorage({
					key:'invoice_Data',
					data:{},
					success: function(){}
				})
				this.$emit('changeInvoiceClose','');
			},
			callType() {
				this.popupType = true;
			},
			changeType(e) {
				this.receipt_type = e.detail.value;
				this.typeName = this.invoiceTypeList.find(value => {
					return value.type == this.receipt_type;
				}).name;
			},
			closeType() {
				this.popupType = false;
			},
			callTitle() {
				this.popupTitle = true;
			},
			changeTitle(e) {
				this.invoice_id = e.detail.value.toString();
				this.getInvoiceDetail(e.detail.value)
				this.popupTitle = false;
			},
			addTitle() {
				this.popupType = false;
				this.popupTitle = false;
				uni.navigateTo({
					url: '/pages/users/user_invoice_form/index?mer_id='+this.invoice.mer_id
				});
			},
			closeTitle() {
				this.popupTitle = false;
			},
			changeHeader(e) {
				this.receipt_title_type = e.detail.value;
				if(e.detail.value == 1){
					this.receipt_type = 1;
					this.typeName = 'ໃບແຈ້ງໜີ້ອີເລັກໂທຣນິກທົ່ວໄປ'
				}
				this.receipt_type
			},
			changeDefault(e) {
				this.is_default = e.detail.value.length ? 1 : 0;
			},
			// 提交发票数据
			formSubmit(e) {
				let that = this,
					value = e.detail.value;
				if (!value.receipt_title_type) return that.$util.Tips({
					title: 'ກະລຸນາຕື່ມຫົວຂໍ້ໃບແຈ້ງໜີ້'
				});
				if (!value.email) return that.$util.Tips({
					title: 'ກະລຸນາຕື່ມອີເມວ'
				});
				if (!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value.email)) return that.$util.Tips({
					title: 'ກະລຸນາໃສ່ອີເມວທີ່ຖືກຕ້ອງ'
				});
				if(value.receipt_title_type == 2){
					if (!value.duty_paragraph) return that.$util.Tips({
						title: 'ກະລຸນາຕື່ມເລກປະຈຳຕົວຜູ້ເສຍພາສີ'
					});
					if(value.receipt_type == 'ໃບແຈ້ງໜີ້ພາສີມູນຄ່າເພີ່ມສະເພາະ'){
						if (!value.bank_name) return that.$util.Tips({
							title: 'ກະລຸນາຕື່ມທະນາຄານ'
						});
						if (!value.bank_code) return that.$util.Tips({
							title: 'ກະລຸນາຕື່ມເລກບັນຊີທະນາຄານ'
						});
						if (!value.address) return that.$util.Tips({
							title: 'ກະລຸນາຕື່ມທີ່ຢູ່ບໍລິສັດ'
						});
						if (!value.tel) return that.$util.Tips({
							title: 'ກະລຸນາຕື່ມໂທລະສັບບໍລິສັດ'
						});
						if(!/^(\d{9}|\d{14}|\d{18})$/.test(value.bank_code)){
							return this.$util.Tips({
								title: 'ກະລຸນາໃສ່ເລກບັນຊີທະນາຄານທີ່ຖືກຕ້ອງ'
							});
						}
						if(!/(^(\d{3,4})?\d{7,8})$|(13[0-9]{9})/.test(value.tel)){
							return this.$util.Tips({
								title: 'ກະລຸນາໃສ່ເບີໂທລະສັບທີ່ຖືກຕ້ອງ'
							});
						}
					}
				}
				that.formvalidate = true;
				value.mer_id = that.invoice.mer_id;
				value.receipt_type = that.receipt_type;
				that.invoiceData = value
				uni.setStorage({
					key:'invoice_Data',
					data: [that.invoiceData],
					success: function(){
					}
				})
				that.$emit('changeInvoiceClose',that.invoiceData)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.add_invoicing{
		padding-bottom: 20rpx;
	}
	.add_invoicing .title {
		height: 123rpx;
		line-height: 123rpx;
	}
	.add_invoicing .title .iconfont {
		position: absolute;
		right: 20rpx;
		top: 20rpx;
	}
	form {
		font-size: 28rpx;
		color: #282828;
	}
	form input, form radio-group {
		flex: 1;
		text-align: right;
	}
	form input {
		font-size: 26rpx;
	}
	form label {
		margin-right: 50rpx;
		&:last-child {
			margin-right: 0;
		}
	}
	form radio {
		margin-right: 8rpx;
	}
	form checkbox-group {
		height: 90rpx;
	}
	form checkbox {
		margin-right: 20rpx;
	}
	.panel {
		padding-right: 30rpx;
		padding-left: 30rpx;
		background-color: #FFFFFF;
	}
	.panel~.panel {
		margin-top: 14rpx;
	}
	.panel .acea-row {
		height: 90rpx;
	}
	.icon-ic_rightarrow {
		margin-left: 25rpx;
		font-size: 24rpx;
		color: #BFBFBF;
		cursor: pointer;
	}
	.btn-wrap {
		width: 100%;
		border-top: 1px solid #F5F5F5;
	}
	.btn-wrap .button{
		height: 88rpx;
		line-height: 88rpx;
		border-radius: 100rpx;
		font-size: 28rpx;
	}
	.btn-wrap .back {
		border-radius: 50rpx;
		height: 86rpx;
		line-height: 86rpx;
		border: 1rpx solid var(--view-theme);
		background: none;
		color: var(--view-theme);
	}
	.popup {
		background-color: #F5F5F5;
		transform: translateY(100%);
	}
	.popup.on {
		transform: translateY(0);
	}
	.popup .title {
		height: 137rpx;
		line-height: 137rpx;
	}
	.popup scroll-view {
		height: 466rpx;
		padding-right: 30rpx;
		padding-left: 30rpx;
		box-sizing: border-box;
	}
	.popup label {
		padding: 35rpx 30rpx;
		margin-bottom: 20rpx;
	}
	.popup .text {
		flex: 1;
		min-width: 0;
		font-size: 28rpx;
		color: #282828;
	}
	.popup .info {
		margin-top: 10rpx;
		font-size: 22rpx;
		color: #909090;
	}
	button{
		background-color: var(--view-theme);
		margin: 30rpx;
		height: 88rpx;
		border-radius: 100rpx;
		font-size: 28rpx;
		color: #fff;
		.iconfont {
			font-size: 32rpx;
			margin: 2rpx 10rpx 0 0;
		}
	}
	button.btn-default{
		background-color: transparent;
		color: var(--view-theme);
		border: 1px solid var(--view-theme);
	}
	.popup .text .acea-row {
		display: inline-flex;
		max-width: 100%;
	}
	.popup .name {
		flex: 1;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		font-size: 30rpx;
	}
	.popup .label {
		width: 50rpx;
		height: 28rpx;
		border: 1px solid #E93323;
		margin-left: 18rpx;
		font-size: 16rpx;
		line-height: 26rpx;
		text-align: center;
		color: #E93323;
	}
	.popup .type {
		width: 124rpx;
		height: 42rpx;
		margin-top: 14rpx;
		background-color: #FCF0E0;
		font-size: 24rpx;
		line-height: 42rpx;
		text-align: center;
		color: #D67300;
	}
	.popup .type.special {
		background-color: #FDE9E7;
		color: #E93323;
	}
	.nothing {
		margin: 50rpx 0;
		text-align: center;
		.picture{
			height: 305rpx;
		}
	}
	.nothing_text{
		margin-top: 20rpx;
		color: #999999;
	}
</style>
