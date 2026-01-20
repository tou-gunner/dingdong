<template>
	<BaseContainer :has-min-height="false">
		<view class="refund-wrapper pad20">
			<view class="form-box bg-f boder-24">
				<view class="form-item item-txt">
					<text class="label">ກວດສອບ</text>
					<view class="picker acea-row">
						<view class="agree-count" :class="status == 1 ? 'on' : ''" @click="status = 1">
							<text class="iconfont" :class="status == 1 ? 'icon-ic_Selected' : 'icon-ic_unselect'"></text>
							<text class="icon-agree"></text>ຍິນຍອມ
						</view>
						<view class="agree-count" :class="status == -1 ? 'on' : ''" @click="status = -1">
							<text class="iconfont" :class="status == -1 ? 'icon-ic_Selected' : 'icon-ic_unselect'"></text>
							<text class="icon-agree"></text>ປະຕິເສດ
						</view>
					</view>
				</view>
			</view>
			<view v-if="status == 1" class="form-box bg-f boder-24">
				<view class="form-item item-txt">
					<text class="label">ຊຳລະຕົວຈິງ(ກີບ)</text>
					<view class="picker">
						{{orderInfo.total_price}}
					</view>
				</view>
				<view class="form-item item-txt">
					<text class="label">ຄ່າຂົນສົ່ງຕົວຈິງ(ກີບ)</text>
					<view class="picker">
						{{orderInfo.total_postage}}
					</view>
				</view>
				<view class="form-item item-txt">
					<text class="label">ຈຳນວນສິນຄ້າ(ລາຍການ)</text>
					<view class="picker">
						{{orderInfo.total_num}}
					</view>
				</view>
				<view class="form-item item-txt">
					<text class="label">ຈຳນວນເງິນຂໍຄືນ(ກີບ)</text>
					<view class="picker">
						{{orderInfo.refund_price}}
					</view>
				</view>
				<view class="form-item item-txt">
					<text class="label">ຈຳນວນຂໍຄືນ(ລາຍການ)</text>
					<view class="picker">
						{{orderInfo.refund_num}}
					</view>
				</view>
			</view>
			<view v-if="orderInfo.refund_type == 2 && status == 1" class="form-box bg-f boder-24">
				<view class="form-item item-txt">
					<text class="label">ຜູ້ຮັບ</text>
					<view class="picker">
						<input style="text-align: right;" maxlength="10" class="p-color" type="text" placeholder="ກະລຸນາໃສ່ຊື່" v-model="refundInfo.mer_delivery_user">
					</view>
				</view>
				<view class="form-item item-txtarea">
					<text class="label">ທີ່ຢູ່ຮັບສິນຄ້າ</text>
					<view class="txtarea"><textarea  v-model="refundInfo.mer_delivery_address" value="" placeholder="ກະລຸນາໃສ່ທີ່ຢູ່" /></view>
				</view>
				<view class="form-item item-txt">
					<text class="label">ເບີໂທ</text>
					<view class="picker">
						<input style="text-align: right;" class="p-color" type="text" placeholder="ກະລຸນາໃສ່ເບີໂທ" v-model="refundInfo.phone">
					</view>
				</view>
			</view>
			<view v-if="status == -1" class="form-box bg-f boder-24">
				<view class="form-item item-txtarea">
					<text class="label">ເຫດຜົນປະຕິເສດ</text>
					<view class="txtarea"><textarea v-model="fail_message" value="" placeholder-class="coarea" placeholder="ກະລຸນາໃສ່ເຫດຜົນປະຕິເສດການຄືນເງິນ" /></view>
				</view>
			</view>
			<view class="confirm-btn">
				<view class="btn-box" @click="bindComfirm">ຢືນຢັນການສົ່ງ</view>
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
	import { getRefundOrderInfo, refundOrderSubmit } from '@/api/admin.js'
	import BaseContainer from '@/components/common/base_container.vue'
	export default{
		components:{
			BaseContainer
		},
		data(){
			return {
				order_id:0,
				mer_id: 0,
				type: 0,
				isShowBox:false,
				refund_price:'',
				refund_order_id:'',//退款id
				status: '',
				order_status: false,
				status: 1,
				fail_message: '',
				refundInfo: {
					mer_delivery_user: '',
					mer_delivery_address: '',
					phone: '',
				},
				orderInfo: {}
			}
		},
		onLoad(options) {
			this.order_id = options.id
			this.mer_id = options.merId
			Promise.all([this.getOrderInfo()])
		},
		methods:{
			// 获取退款订单信息
			getOrderInfo(){
				let that = this;
				getRefundOrderInfo(that.mer_id, that.order_id).then(
					res => {
						that.orderInfo = res.data
						that.refundInfo = res.data.refund_info
					},
					err => {
						that.$util.Tips({title: err});
					}
				);
			},
			// 提交
			async bindComfirm(){
				let that = this
				if(that.status == -1){
					if (!that.fail_message) {
						return that.$util.Tips({
							title: 'ກະລຸນາໃສ່ເຫດຜົນປະຕິເສດ'
						})
					}
				}
				let params = {
					status: that.status,
					fail_message: that.fail_message
				}
				if(that.orderInfo.refund_type == 2){
					if (!that.refundInfo.mer_delivery_user) {
						return that.$util.Tips({
							title: 'ກະລຸນາໃສ່ຊື່ຜູ້ຮັບ'
						})
					}
					if (!that.refundInfo.mer_delivery_address) {
						return that.$util.Tips({
							title: 'ກະລຸນາໃສ່ທີ່ຢູ່ຮັບ'
						})
					}
					if (!that.refundInfo.phone) {
						return that.$util.Tips({
							title: 'ກະລຸນາໃສ່ເບີໂທ'
						})
					}else if(!(/^1[3456789]\d{9}$/.test(that.refundInfo.phone))){
						return that.$util.Tips({
							title: 'ກະລຸນາໃສ່ເບີໂທທີ່ຖືກຕ້ອງ'
						})
					}
					params.mer_delivery_user = that.refundInfo.mer_delivery_user
					params.mer_delivery_address = that.refundInfo.mer_delivery_address
					params.phone = that.refundInfo.phone
				}
				refundOrderSubmit(that.mer_id,that.order_id,params).then(
					res => {
						that.$util.Tips({title: res.message});
						setTimeout(res => {
							uni.redirectTo({
								url:`/pages/admin/orderList/index?types=6&merId=${that.mer_id}`
							})
						}, 1000)
					},
					err => {
						that.$util.Tips({title: err});
					}
				);
			},
		}
	}
</script>

<style lang="scss">
	.refund-wrapper{
		.form-box{
			padding-left: 30rpx;
			margin-top: 20rpx;
			.form-item{
				display: flex;
				justify-content: space-between;
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
					width: 500rpx;
					height: 100rpx;
					font-size: 30rpx;
				}
				.coarea{
					color: #ccc;
				}
			}
			.agree-count{
				margin-left: 30rpx;
				.iconfont {
					font-size: 28rpx;
					color: #ccc;
					margin-right: 6rpx;
				}
				&.on,.icon-ic_Selected{
					color: #2291F8;
				}
			}
		}
		.confirm-btn{
			position: fixed;
			bottom: 0;
			left: 0;
			padding: 20rpx 30rpx;
			background: #fff;
			width: 100%;
			.btn-box{
				width:100%;
				height:88rpx;
				line-height: 88rpx;
				text-align: center;
				color: #fff;
				background: #2291F8;
				border-radius:50rpx;
				font-size: 28rpx;
			}
		}
	}
</style>
<style scoped>
.confirm-btn {
	padding-bottom: max(20rpx, var(--safe-area-inset-bottom)) !important;
}
</style>
