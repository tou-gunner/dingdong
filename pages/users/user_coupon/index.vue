<template>
	<view :style="viewColor">
		<view class="navTabBox">
			<view class="longTab">
				<view class="tab-item" v-for="(item,index) in tabList" :key="index" :class="{'on':index == tabIndex-1}" @click="bindTab(index)"><text>{{item.title}}</text></view>
			</view>
		</view>
		<view class='coupon-list' v-if="couponsList.length">
			<view v-for='(item,index) in couponsList' :key="index">
				<view v-if="item.merchant && item.status==0" class="store-info acea-row row-between-wrapper">
					<view class="store_name acea-row row-between-wrapper">
						<image class="image" :src="item.merchant.mer_avatar"></image>
						<text class="name">{{item.merchant.mer_name}}</text>
					</view>
					<view v-if="hide_mer_status == 0 && item.status == 0" class="store" @click="goStore(item)">ເຂົ້າຮ້ານ</view>
				</view>
				<view class='item acea-row row-center-wrapper'>
					<block v-if="item.status == 0">
						<view v-if="item.coupon.send_type == 5" class='money vip-coupon' :style="{ 'background-image': `url(${domain}/static/images/coupon-vip-bg.png)` }">
							<view class="line1 coupon_value">₭<text class='num'>{{item.coupon_price}}</text></view>
							<view v-if="item.use_min_price==0" class="pic-num">ຮັບຄູປອງຫຼຸດລາຄາ {{item.coupon_price}} ກີບ</view>
							<view v-else class="pic-num">ຊື້ຄົບ {{item.use_min_price}} ກີບໃຊ້ໄດ້</view>
						</view>
						<view v-else class='money' :style="{ 'background-image': `url(${domain}/static/diy/couponBg${keyColor}.png)` }">
							<view class="line1 coupon_value">₭<text class='num semiBold'>{{item.coupon_price}}</text></view>
							<view v-if="item.use_min_price==0" class="pic-num">ຮັບຄູປອງຫຼຸດລາຄາ {{item.coupon_price}} ກີບ</view>
							<view v-else class="pic-num">ຊື້ຄົບ {{item.use_min_price}} ກີບໃຊ້ໄດ້</view>
						</view>
					</block>
					<view v-else class='money moneyGray' :style="'background-image: url('+domain+'/static/images/sign-rotate-bg.png)'">
						<view>₭<text class='num semiBold'>{{item.coupon_price}}</text></view>
						<view class="pic-num">ຊື້ຄົບ {{ item.use_min_price }} ກີບໃຊ້ໄດ້</view>
					</view>
					<view class='text'>
						<view class='condition line1' :class="{'no-border' : item.merchant && item.status==0}">
							<view class="line-title" :class="item.status === 0 ? 'bg-color-check' : 'bg-color-huic'" v-if="item.coupon && item.coupon.type === 0">ຄູປອງຮ້ານ</view>
							<view class="line-title" :class="item.status === 0 ? 'bg-color-check' : 'bg-color-huic'" v-else-if="item.coupon && item.coupon.type === 1">ຄູປອງສິນຄ້າ</view>
							<view class="line-title" :class="item.status === 0 ? 'bg-color-check' : 'bg-color-huic'" v-else-if="item.coupon && item.coupon.type === 11">ຄູປອງປະເພດ</view>
							<view class="line-title" :class="item.status === 0 ? 'bg-color-check' : 'bg-color-huic'" v-else-if="item.coupon && item.coupon.type === 10">ຄູປອງທົ່ວໄປ</view>
							<view class="line-title" :class="item.status === 0 ? 'bg-color-check' : 'bg-color-huic'" v-else-if="item.coupon && item.coupon.type === 12">ຄູປອງຂ້າມຮ້ານ</view>
							<view class="line-title" :class="item.status === 0 ? 'bg-color-check' : 'bg-color-huic'" v-else>ຄູປອງສິນຄ້າ</view>
							<view class="line1 coupon-title">{{item.coupon_title}}</view>
						</view>
						<view class='data acea-row row-between-wrapper'>
							<view>{{item.start_time | timeYMD}}-{{item.end_time | timeYMD}}</view>
							<view v-if="item.status==0">
								<navigator :url="'/pages/columnGoods/goods_coupon_list/index?coupon_id='+item.coupon_id" class='bnt1 b-color' :class="item.coupon.send_type == 5 ? 'svip-btn' : ''" hover-class="none">
								ໄປໃຊ້
								</navigator>
							</view>
							<view class='bnt1 gray' style="position: static;" v-if="item.status==1">ໃຊ້ແລ້ວ</view>
							<view class='bnt1 gray' style="position: static;" v-if="item.status==2">ໝົດອາຍຸ</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class='noCommodity' v-if="!couponsList.length && loading==true">
			<view class='pictrue'>
				<image :src="`${domain}/static/images/noCoupon.png`"></image>
				<view>ບໍ່ມີຄູປອງ</view>
			</view>
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
	let app = getApp();
	import { getUserCoupons } from '@/api/api.js';
	import { mapGetters } from "vuex";
	import { configMap } from '@/utils';
	import { HTTP_REQUEST_URL } from '@/config/app';
	import { toLogin } from '@/libs/login.js';
	export default {
		components: {},
		data() {
			return {
				domain: HTTP_REQUEST_URL,
				tabIndex:1,
				couponsList: [],
				loading: false,
				isUsed: 0,
				tabList:[
					{
						title:'ຍັງບໍ່ໃຊ້'
					},
					{
						title:'ໃຊ້ແລ້ວ/ໝົດອາຍຸ'
					}
				],
				limit:15,
				page:1,
				isScroll:true,
				moneyBg: '/static/images/couponBg',

			};
		},
		computed: configMap(['hide_mer_status'], mapGetters(['isLogin','viewColor','keyColor'])),
		filters: {
		  timeYMD: function (value) {
				if(value){
					var newDate=/\d{4}-\d{1,2}-\d{1,2}/g.exec(value)
					return newDate[0]
				}
		  }
		},
		onLoad() {
			if (this.isLogin) {
				this.getUseCoupons();
			} else {
				toLogin()
			}
		},
		mounted: function() {
		},
		methods: {
			bindTab(index){
				this.tabIndex = index+1
				this.page =1
				this.isScroll = true
				this.couponsList = []
				this.getUseCoupons()
			},
			goStore(item){
				if(this.hide_mer_status != 1 && item.status==0){
					uni.navigateTo({
						url:`/pages/store/home/index?id=${item.mer_id}`
					})
				}
			},
			/**
			 * 获取领取优惠券列表
			 */
			getUseCoupons: function() {
				let that = this;
				if(!this.isScroll) return
				getUserCoupons({
					statusTag: this.tabIndex,
					page:this.page,
					limit:this.limit
				}).then(res => {
					that.loading = true;
					that.couponsList = that.couponsList.concat(res.data.list)
					that.isScroll = that.couponsList.length<res.data.count
					that.page++
				})
			}
		},
		onReachBottom() {
			this.getUseCoupons()
		}
	}
</script>

<style scoped lang="scss">
	.navTabBox{
		background: #fff;
		height: 90rpx;
	}
	.longTab{
		display: flex;
		text-align: center;
	}
	.tab-item{
		width: 50%;
		display: inline-block;
		line-height: 90rpx;
		text{
			position: relative;
			display: inline-block;
		}
	}
	.tab-item.on{
		color: var(--view-theme);
		font-weight: bold;
		text{
			&:after{
				content: "";
				display: inline-block;
				width: 90%;
				height: 3rpx;
				background-color: var(--view-theme);
				position: absolute;
				left: 5%;
				bottom: 0;
			}
		}
	}
	.b-color {
		background-color: var(--view-theme);
	}
	.coupon-list .item .text .condition {
		display: flex;
		align-items: center;
		&.no-border{
			border: none;
		}
	}
	.condition .line-title {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 90rpx;
		height: 32rpx !important;
		padding: 0 10rpx;
		-webkit-box-sizing: border-box;
		box-sizing: border-box;
		background: var(--view-minorColor);
		border: 1px solid var(--view-theme);
		opacity: 1;
		border-radius: 26rpx;
		font-size: 20rpx !important;
		color: var(--view-theme);
		margin-right: 12rpx;
	}
	.condition .line-title.bg-color-huic {
		background-color: #F7F7F7;
		color: #999999;
		border-color: #DDDDDD;
	}
	.condition .coupon-title{
		width: 280rpx;
	}
	.store-info{
		background: #fff;
		padding: 18rpx 20rpx;
		position: relative;
		border-radius: 24rpx 24rpx 0 0;
		border-bottom: 2rpx dashed #EAEAEA;
		&::before,&::after{
			content: "";
			display: inline-block;
			width: 24rpx;
			height: 24rpx;
			background: #f5f5f5;
			border-radius: 100%;
			position: absolute;
			bottom: -12rpx;
			z-index: 10;
		}
		&::before{
			left: -10rpx;
		}
		&::after{
			right: -10rpx;
		}
		.image{
			width: 40rpx;
			height: 40rpx;
			border-radius: 100%;
			margin-right: 9rpx;
		}
		.name{
			color: #282828;
		}
		.store{
			color: var(--view-theme);
			font-size: 20rpx;
			padding: 5rpx 21rpx;
			border: 1px solid var(--view-theme);
			border-radius: 26rpx;
		}
	}
	.svip-btn{
		background-color: #E8C077;
	}
	.noCommodity{
		width: 100%;
		.pictrue{
			margin: 0 auto;
		}
	}
	.coupon_value{
		max-width: 220rpx;
	}
</style>
