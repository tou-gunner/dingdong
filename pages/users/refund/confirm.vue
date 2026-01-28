<template>
	<view class="refund-wrapper" :style="viewColor">
		<view class="bg-f boder-24">
			<view class="item" v-for="(item,index) in productData.product" :key="index">
				<view class="img-box">
					<image :src="item.cart_info.productAttr.image || item.cart_info.product.image"></image>
				</view>
				<view class="info">
					<view class="name line1"><text v-if="order_status == 2" class="event_name event_bg">ສິນຄ້າຈອງ</text>{{item.cart_info.product.store_name}}</view>
					<view class='attr line1' v-if="item.cart_info.productAttr.sku">{{item.cart_info.productAttr.sku}}</view>
					<view class="money acea-row row-middle">
						<view class="price">
							<priceFormat :price="order_status == 3 ? item.cart_info.productAssistAttr.assist_price : order_status == 4 ? item.cart_info.activeSku.active_price : item.cart_info.productAttr.price" weight intSize="30" floatSize="22" labelSize="20"></priceFormat>
							<text class="num">×{{item.refund_num}}</text>
						</view>
						<image v-if="item.cart_info.productAttr.show_svip_price" class="svip-img" :src="`${domain}/static/images/svip.png`"></image>
					</view>
				</view>
			</view>
		</view>
		<view class="form-box bg-f boder-24">
			<view class="form-item item-txt" v-if="type==1">
				<text class="label">ຈຳນວນສິນຄ້າ</text>
				<view class="picker">
					<picker @change="bindNumChange" :value="numIndex" :range="numArray" :disabled="order_status == 2">
						<view class="picker-box">
							{{numArray[numIndex] || 0}}
							<text v-if="order_status != 2" class="iconfont icon-ic_rightarrow"></text>
						</view>
					</picker>
				</view>
			</view>
			<view class="form-item item-txt">
				<text class="label">{{ status == 0 ? 'ຈຳນວນເງິນຄືນ (ລວມຄ່າຂົນສົ່ງ)' : 'ຈຳນວນເງິນຄືນ (ບໍ່ລວມຄ່າຂົນສົ່ງ)' }}</text>
				<input style="text-align: right;" :class="{disabled:type == 2}" :disabled="type == 2" class="p-color" type="text" placeholder-class='placeholder' placeholder="ກະລຸນາປ້ອນຈຳນວນເງິນ" v-model="refundPrice" @blur="checkMaxPrice">
			</view>
			<view class="form-item item-txt">
				<text class="label">ເຫດຜົນການຂໍເງິນຄືນ</text>
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
				<view class="txtarea"><textarea v-model="con" value="" placeholder-class='placeholder' placeholder="ຕື່ມຂໍ້ມູນໝາຍເຫດ, ບໍ່ເກີນ 100 ຄຳ" /></view>
			</view>
			<view class="upload-box">
				<view class="title">
					<view class="txt">ອັບໂຫລດຫຼັກຖານ</view>
					<view class="des">( ອັບໂຫລດໄດ້ສູງສຸດ 9 ຮູບ )</view>
				</view>
				<view class="upload-img">
					<view class="img-item" v-for="(item,index) in uploadImg" :key="index">
						<image :src="item" mode=""></image>
						<view class="iconfont icon-ic_close2" @click="deleteImg(index)"></view>
					</view>
					<view v-if="uploadImg.length < 9" class="add-img" @click="uploadpic">
						<text class="iconfont icon-ic_camera1"></text>
						<text class="txt">ອັບໂຫລດຫຼັກຖານ</text>
					</view>
				</view>
			</view>
		</view>

		<view class="btn-box btn-lg" @click="bindComfirm">ສົ່ງ</view>
		<alertBox :msg="msg" v-if="isShowBox" @bindClose="bindClose"></alertBox>
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
	import { refundProduct,refundApply,refundMessage, computedRefundPrice } from '@/api/order.js'
	import alertBox from '../components/alert/index.vue'
	import { mapGetters } from "vuex";
	import { HTTP_REQUEST_URL } from '@/config/app';
	export default{
		components:{
			alertBox
		},
		computed: mapGetters(['viewColor']),
		data(){
			return {
				domain: HTTP_REQUEST_URL,
				order_id:0,
				isShowBox:false,
				// 图片上传
				uploadImg:[],
				// 选择问题
				qsArray:[],
				// 问题index
				qsIndex:0,
				// 选择个数
				numArray:[],
				//个数index
				numIndex:0,
				//商品id
				ids:'',
				// 退款方式:1:退款 2:退款退货
				refund_type:'',
				//退款类型 1:单个 2:批量
				type:'',
				productData:{},
				con:'',
				postage_price: '',
				maxRefundPrice: '',
				refundPrice: '',
				msg:'',
				refund_order_id:'',//退款id
				status: '',
				order_status: false,
			}
		},
		onLoad(optios) {
			this.ids = optios.ids
			this.refund_type = optios.refund_type
			this.type = optios.type,
			this.order_id = optios.order_id
			Promise.all([this.refundProduct(),this.refundMessage()])
		},
		methods:{
			checkMaxPrice(){
				if(this.refundPrice > this.maxRefundPrice){
					this.refundPrice = this.maxRefundPrice.toFixed(2)
				}
			},
			// 限制退款金额
			limitAamount(){
				if(parseFloat(this.refundPrice) > parseFloat(this.maxRefundPrice)){
					uni.showToast({
						title:'ຈຳນວນເງິນຄືນບໍ່ສາມາດຫຼາຍກວ່າຈຳນວນເງິນທີ່ຈ່າຍ',
						icon:'none'
					})
					this.validate = false;
				}
			},
			// 退款理由
			refundMessage(){
				refundMessage().then(res=>{
					this.qsArray = res.data
				})
			},
			// 退款商品
			refundProduct(){
				refundProduct(this.order_id,{ids:this.ids, type: this.type}).then(({data})=>{
					this.productData = data
					this.postage_price = data.postage_price
					this.maxRefundPrice = Number(data.total_refund_price)
					this.status = data.status;
					this.order_status = data.activity_type;
					this.unitPostage = this.postage_price > 0 ? this.$util.$h.Div(this.postage_price, data.product[0].refund_num).toFixed(2) : 0;
					if(this.type == 1){
						this.numArray = Array.from({length: data.product[0].refund_num}, (_, index) => index + 1);
					}
					this.calcRefundPrice();
				}).catch((err) => {
					return this.$util.Tips({
						title: err
					}, {
						tab: 3,
						url: 1
					});
				});
			},
			// 下拉选中
			bindPickerChange(e){
				this.qsIndex = e.target.value
			},
			bindNumChange(e){
				this.numIndex = e.target.value
				this.calcRefundPrice();
			},
			calcRefundPrice() {
				const payload = {
					order_id: this.order_id,
					refund: {}
				};

				if (this.type == 1) {
					// 单个退款
					const product = this.productData.product[0];
					payload.refund[product.order_product_id] = this.numArray[this.numIndex];
				} else {
					// 批量退款
					this.productData.product.reduce((acc, { order_product_id, refund_num }) => {
						acc[order_product_id] = refund_num;
						return acc;
					}, payload.refund);
				}

				uni.showLoading({ mask: true });
				computedRefundPrice(payload)
					.then(({ data }) => {
						this.refundPrice = Number(data.totalRefundPrice)
						this.status = data.isDisplayPostage ? 0 : 1
					})
					.finally(() => {
						uni.hideLoading();
					});
			},
			// 删除图片
			deleteImg(index){
				this.uploadImg.splice(index,1)
			},
			/**
			 * 上传文件
			*/
			uploadpic: function () {
				if(this.uploadImg.length <9){
					let that = this;
					that.$util.uploadImageOne('upload/image', function (res) {
					  that.uploadImg.push(res.data.path);
						that.$set(that,'uploadImg',that.uploadImg);
					});
				}else{
					uni.showToast({
						title:'ອັບໂຫລດໄດ້ສູງສຸດ 9 ຮູບ',
						icon:'none'
					})
				}
			},
			// 提交
			async bindComfirm(){
				try {
					const data = await refundApply(this.order_id,{
						type:this.type,
						refund_type:this.refund_type,
						num:this.type == 1?this.numArray[this.numIndex]:'',
						ids:this.ids,
						refund_message:this.qsArray[this.qsIndex],
						mark:this.con,
						refund_price:this.refundPrice,
						pics:this.uploadImg
					})
					this.msg = data.message
					this.refund_order_id = data.data.refund_order_id
					this.isShowBox = true
				}catch(err){
					uni.showToast({
						title:err,
						icon:'none'
					})
				}
			},
			// 弹窗关闭
			bindClose(){
				this.isShowBox = false
				uni.redirectTo({
					url:'/pages/users/refund/detail?id='+this.refund_order_id
				})
			}
		}
	}
</script>

<style lang="scss">
	.refund-wrapper{
		padding: 20rpx 20rpx 0;
		.item{
			display: flex;
			padding: 25rpx 30rpx;
			.img-box{
				width: 130rpx;
				height: 130rpx;
				image{
					width: 130rpx;
					height: 130rpx;
					border-radius:16rpx;
				}
			}
			.info{
				display: flex;
				flex-direction: column;
				width: 440rpx;
				margin-left: 26rpx;
				.tips{
					color: #999;
					font-size: 20rpx;
				}
				.money{
					margin-top: 10rpx;
				}
				.num{
					font-size: 20rpx;
					color: #999;
					margin-left: 10rpx;
				}
				.attr{
					font-size: 20rpx;
					color: #999;
					margin-top: 16rpx;
				}
				.svip-img{
					width: 65rpx;
					height: 28rpx;
					margin: 4rpx 0 0 4rpx;
				}
			}
			.check-box{
				display: flex;
				align-items: center;
				justify-content: center;
				flex: 1;
				.iconfont{
					font-size: 40rpx;
					color: #CCCCCC;
				}
				.icon-a-ic_CompleteSelect{
					color: var(--view-theme);
				}
			}
		}
		.form-box{
			padding-left: 30rpx;
			margin-top: 18rpx;
			.form-item{
				display: flex;
				justify-content: space-between;
				font-size: 30rpx;
				.placeholder{
					color: #CCCCCC;
				}
			}
			.item-txt{
				align-items: center;
				width: 100%;
				padding: 26rpx 30rpx 26rpx 0;
			}
			.item-txtarea{
				padding: 26rpx 30rpx 26rpx 0;
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
		}
		.upload-box{
			padding: 26rpx 30rpx 26rpx 0;
			.title{
				display: flex;
				align-items: center;
				justify-content: space-between;
				font-size: 30rpx;
				.des{
					color: #999999;
				}
			}
			.upload-img{
				display: flex;
				flex-wrap: wrap;
				margin-top: 20rpx;
				.img-item{
					position: relative;
					width: 150rpx;
					height: 150rpx;
					margin-right: 16rpx;
					margin-top: 20rpx;
					&:nth-child(4n){
						margin-right: 0;
					}
					image{
						width: 150rpx;
						height: 150rpx;
						border-radius: 16rpx;
					}
					.iconfont{
						position: absolute;
						right: -15rpx;
						top: -20rpx;
						font-size: 40rpx;
						color: var(--view-theme);
					}
				}
				.add-img{
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					width: 150rpx;
					height: 150rpx;
					margin-top: 20rpx;
					border: 1px dashed #cccccc;
					color: #999999;
					font-size: 24rpx;
					border-radius: 16rpx;
					background: #F5F5F5;
					.iconfont{
						margin-bottom: 10rpx;
						font-size: 50rpx;
					}
				}
			}
		}
		.btn-box{
			margin: 70rpx auto;
		}
	}
	.p-color {
		color: var(--view-priceColor);
	}
	.p-color.disabled{
		color:#999;
	}
	.event_bg{
		background: #FF7F00;
	}
	.event_name{
		display: inline-block;
		margin-right: 9rpx;
		color: #fff;
		font-size: 20rpx;
		padding: 0 8rpx;
		line-height: 30rpx;
		text-align: center;
		border-radius: 6rpx;
	}
</style>
