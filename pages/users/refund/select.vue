<template>
	<view class="refund-select pad20" :style="viewColor">
		<view class="select-item bg-f boder-24 mt20" @click="goPage(1)">
			<view class="left">
				<image :src="domain+'/static/diy/select01'+keyColor+'.png'" mode=""></image>
			</view>
			<view class="right-wrapper">
				<view class="title">ຂ້ອຍຕ້ອງການເງິນຄືນ (ບໍ່ສົ່ງສິນຄ້າ)</view>
				<view class="txt">ບໍ່ໄດ້ຮັບສິນຄ້າ, ຫຼື ຕົກລົງກັບຜູ້ຂາຍຂໍເງິນຄືນໂດຍບໍ່ສົ່ງສິນຄ້າ</view>
			</view>
			<view class="iconfont icon-ic_rightarrow"></view>
		</view>
		<view class="select-item bg-f boder-24 mt20" @click="goPage(2)">
			<view class="left">
				<image :src="domain+'/static/diy/select02'+keyColor+'.png'" mode=""></image>
			</view>
			<view class="right-wrapper">
				<view class="title">{{order_type != 2 ? 'ຂ້ອຍຕ້ອງການສົ່ງຄືນສິນຄ້າ ແລະ ຂໍເງິນຄືນ' : 'ຂ້ອຍຕ້ອງການເງິນຄືນ'}}</view>
				<view class="txt" v-if="order_type != 2">ໄດ້ຮັບສິນຄ້າແລ້ວ, ຕ້ອງການສົ່ງຄືນສິນຄ້າທີ່ໄດ້ຮັບ</view>
			</view>
			<view class="iconfont icon-ic_rightarrow"></view>
		</view>
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
	import {mapGetters} from "vuex";
	import { HTTP_REQUEST_URL } from '@/config/app';
	export default{
		computed: mapGetters(['viewColor', 'keyColor']),
		data(){
			return {
				domain: HTTP_REQUEST_URL,
				order_id:'',
				type:0,
				ids:'',
				order_type: 0
			}
		},
		onLoad(options) {
			this.order_id = options.order_id
			this.type = options.type
			this.ids = options.ids || ''
			this.order_type = options.order_type
		},
		methods:{
			goPage(type){
				if(this.type ==1 && this.ids){
					uni.redirectTo({
						url:`/pages/users/refund/confirm?ids=${this.ids}&refund_type=${type}&type=${this.type}&order_id=${this.order_id}`
					})
				}else{
					uni.redirectTo({
						url:`/pages/users/refund/index?order_id=${this.order_id}&refund_type=${type}&type=${this.type}`
					})
				}

			}
		}
	}
</script>

<style lang="scss">
.refund-select{
	.select-item{
		position: relative;
		display: flex;
		align-items: center;
		padding: 25rpx 0;
	}
	.left{
		display: flex;
		align-items: center;
		justify-content: center;
		width: 105rpx;
		image{
			width:50rpx;
			height: 46rpx;
		}
	}
	.right-wrapper{
		position: relative;
		.title{
			font-size: 26rpx;
			color: #282828;
		}
		.txt{
			margin-top: 10rpx;
			color: #999999;
			font-size: 22rpx;
		}
	}
	.icon-ic_rightarrow{
		position: absolute;
		right: 30rpx;
		top: 50%;
		transform: translateY(-50%);
		color: #999999;
		font-size: 30rpx;
	}
}
</style>
