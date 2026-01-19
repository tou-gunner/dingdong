<template>
	<view :style="viewColor" class="order-details">
		<view v-if="orderInfo" class='wrapper boder-24'>
			<view v-if="orderInfo.orderProduct" class='item acea-row row-between'>
				<view>预约日期</view>
				<view class='conter' >{{orderInfo.orderProduct[0].reservation_date}} {{orderInfo.orderProduct[0].reservation_time_part}}</view>
			</view>
			<view v-if="orderInfo.orderProduct" class='item acea-row row-between'>
				<view>预约数量</view>
				<view class='conter'>{{orderInfo.orderProduct[0].product_num}}</view>
			</view>
		</view>
		<!--系统表单-->
		<block v-if="extendForm&&extendForm.length>0">
			<view v-for="(item,index) in extendForm" :key="index" class='wrapper boder-24'>
				<view v-for="(itm,idx) in item" v-if="itm" :key="idx" class='item acea-row row-between'>
					<view>{{idx}}：</view>
					<view v-if="!Array.isArray(itm)" class='conter'>{{itm}}</view>
					<view v-else class='conter virtual_image'>
						<image v-for="(pic,i) in itm" :key="i" class="picture" :src="pic" @click="getPhotoClickIdx(itm,idx)"></image>
					</view>
				</view>
			</view>

		</block>
		<!-- <view class='wrapper boder-24'>
			<view class="item title">系统表单名称1</view>
			<view class='item acea-row row-between'>
				<view>预约人</view>
				<view class='conter'>王霏霏</view>
			</view>
			<view class='item acea-row row-between'>
				<view>联系电话</view>
				<view class='conter'>13323456543</view>
			</view>
		</view>
		<view class='wrapper boder-24'>
			<view class="item title">系统表单名称2</view>
			<view class='item acea-row row-between'>
				<view>预约人</view>
				<view class='conter'>刘洋</view>
			</view>
			<view class='item acea-row row-between'>
				<view>联系电话</view>
				<view class='conter'>13323456543</view>
			</view>
		</view> -->

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
	import { mapGetters } from "vuex";
	let app = getApp();
	export default {
		name: 'reservationForm',
		props: {
			extendForm: {
				type: Array,
				default: () => {
					[]
				}
			},
			orderInfo: {
				type: Object,
				default: () => {
					{}
				}
			}
		},
		computed: mapGetters(['viewColor']),
		data() {
			return {

			};
		},
		created() {

		},
		methods: {
			getPhotoClickIdx(item,index) {
				this.$emit.getPhotoClickIdx(item,index)
			}
		}
	}
</script>

<style lang="scss">
	.order-details .wrapper {
		background-color: #fff;
		margin-top: 20rpx;
		padding: 30rpx;
	}

	.order-details .wrapper .item {
		font-size: 28rpx;
		color: #282828;
		line-height: 46rpx;
		&.title {
			font-weight: 500;
		}
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
</style>
