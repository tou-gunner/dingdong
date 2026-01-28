<template>
	<view class="refund-wrapper" :style="viewColor">
		<view class="bg-f boder-24">
			<view class="item" v-for="(item, index) in orderDetail" :key="index">
				<view class="img-box">
					<image :src="item.cart_info.product.image"></image>
				</view>
				<view class="info">
					<view class="name line1">{{item.cart_info.product.store_name}}</view>
					<view class="tips">{{item.cart_info.productAttr.sku}}</view>
					<view class="price">₭{{item.cart_info.productAttr.price}} ×{{item.refund_num}}</view>
				</view>
				<view class="check-box" @click="bindCheck(item)">
					<view v-if="item.check" class="iconfont icon-a-ic_CompleteSelect"></view>
					<view v-else class="iconfont icon-ic_unselect"></view>
				</view>
			</view>
		</view>
		<view class="btn-box font-500" @click="confirm">ສະໝັກຄືນເງິນ</view>
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
	import { refundBatch } from '@/api/order.js'
	import { mapGetters } from "vuex";
	export default{
		computed: mapGetters(['viewColor']),
		data(){
			return {
				// 订单id
				order_id:'',
				// 退款退货类型
				refund_type:2,
				//单个还是多个
				type:2,
				orderDetail:[],
				activeId:[]
			}
		},
		onLoad(options) {
			this.order_id = options.order_id
			this.refund_type = options.refund_type
			this.type = options.type
			this.getList()
		},
		methods:{
			// 获取退款列表
			getList(){
				refundBatch(this.order_id).then(({data})=>{
					data.forEach(el=>{
						el.check = false
					})
					this.orderDetail = data
				}).catch(error=>{
					this.$util.Tips({
						title:error
					},{
						tab:3
					})
				})
			},
			// 是否选中
			bindCheck(item){
				item.check = !item.check
				this.arrFilter()
			},
			// 筛选
			arrFilter(){
				let tempArr = this.orderDetail.filter(el=>{
					return el.check == true
				})
				this.activeId = []
				tempArr.map(item =>{
					this.activeId.push(item.order_product_id)
				})
			},
			// 确认
			confirm(){
			if(this.activeId.length == 0){
				uni.showToast({
					title:'ກະລຸນາເລືອກສິນຄ້າ',
					icon:'none'
				})
			}else{
					uni.redirectTo({
						url:'/pages/users/refund/confirm?ids='+this.activeId.join(',')+'&refund_type='+this.refund_type+'&type='+this.type+'&order_id='+this.order_id
					})
				}
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
				justify-content: space-between;
				width: 430rpx;
				margin-left: 26rpx;
				.tips{
					color: #999;
					font-size: 20rpx;
				}
				.price{
					font-size: 26rpx;
				}
			}
			.check-box{
				display: flex;
				align-items: center;
				justify-content: center;
				flex: 1;
				margin-left: 16rpx;
				.iconfont{
					font-size: 40rpx;
					color: #CCCCCC;
				}
				.icon-a-ic_CompleteSelect{
					color: var(--view-theme);
				}
			}
		}
		.btn-box{
			position: fixed;
			left: 50%;
			bottom: 60rpx;
			width:690rpx;
			height:86rpx;
			transform: translateX(-50%);
			line-height: 86rpx;
			text-align: center;
			color: #fff;
			background: var(--view-theme);
			border-radius: 50rpx;
			font-size: 28rpx;
		}
	}
</style>
