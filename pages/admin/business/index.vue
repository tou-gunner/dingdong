<template>
	<BaseContainer class="business">
		<view class="business-bg" />
		<BaseNavBar :title="service && service.merchant ? service.merchant.mer_name : '商家管理'" lightText />
		<view class="merchant-info">
			<view class="merchant-info-wrapper">
				<image :src="userInfo.avatar" class="merchant-user-avatar" />
				<view class="merchant-user-name overflow-text">{{ userInfo.nickname }}</view>
				<RoleToggle />
				<button class="merchant-select-btn" @click="changeTips">
					切换店铺
					<text class="iconfont icon-icon_sort"></text>
				</button>
			</view>
		</view>
		<view class="business-content">
			<view @click="goNext(item)" class="listBox" v-for="(item, index) in list" :key="index">
				<text :class="item.icon" class="businessIcon"></text>
				<view>{{ item.title }}</view>
			</view>
		</view>
		<shopList ref="shopList" @changeStoreClose="changeClose" @getService="getService" :is_sys='is_sys'></shopList>
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
import shopList from '../components/shopList';
import BaseContainer from '@/components/common/base_container.vue';
import BaseNavBar from '@/components/common/base_nav_bar.vue';
import { mapGetters } from "vuex";
import RoleToggle from '@/components/role-toggle.vue';

export default {
	name: 'business',
	components: {
		shopList,
		BaseContainer,
		BaseNavBar,
		RoleToggle
	},
	data() {
		return {
			is_sys: '',
			downStatus: false,
			service: null
		}
	},
	computed: {
		...mapGetters(["userInfo"]),
		list() {
			if (!this.service) return [];
			const merId = this.service.mer_id;
			const list = [];
			if (this.service.is_verify) {
				list.push({
					title: '订单核销',
					url: '/pages/admin/order_cancellation/index?mer_id=' + merId,
					icon: 'iconfont icon-dingdanhexiao'
				});
			}
			list.push({
				type: 'customer',
				title: '客服记录',
				url: '/pages/chat/customer_list/index?type=1&mer_id=' + merId,
				icon: 'iconfont icon-kefujilu'
			});
			if (this.service.customer) {
				list.push({
					title: '订单管理',
					url: '/pages/admin/order/index?mer_id=' + merId,
					icon: 'iconfont icon-dingdanguanli'
				});
			}
			if (this.service.is_goods) {
				list.push({
					title: '商品管理',
					url: '/pages/product/list/index?mer_id=' + merId,
					icon: 'iconfont icon-shangjiaguanli'
				});
			}
			return list;
		}
	},
	onLoad: function (options) {
		this.$store.dispatch("USERINFO");
		this.is_sys = options.is_sys;
		this.getStoreList({ is_sys: this.is_sys });
		uni.setNavigationBarTitle({
			title: this.is_sys ? '平台管理' : '商家管理'
		})
	},
	methods: {
		getStoreList: function (data) {
			this.$nextTick(() => {
				this.$refs.shopList.getStoreList(data)
			});
		},
		changeTips(data) {
			this.downStatus = !this.downStatus;
			this.$refs.shopList.isShowStore();
		},
		changeClose() {
			this.downStatus = false;
		},
		goNext(item) {
			if (item.type == 'customer' && this.service.status == 0) {
				return this.$util.Tips({
					title: '客服已离线，请开启客服状态！'
				});
			} else {
				uni.navigateTo({
					url: item.url,
				});
			}

		},
		getService: function (data) {
			this.service = data;
			if (data && data.merchant) {
				uni.setNavigationBarTitle({
					title: data.merchant.mer_name
				})
			} else {
				uni.setNavigationBarTitle({
					title: (!data.mer_id) ? '平台管理' : '商家管理'
				})
			}
		}
	}
}
</script>

<style scoped lang="scss">
.businessIcon {
	color: #2291F8;
	font-size: 80rpx;
	display: inline-block;
	margin-bottom: 29rpx;
}

.business-bg {
	height: calc(var(--nav-bar-height) + 290rpx);
	background: linear-gradient(180deg, #2291F8 0%, #2291F8 var(--nav-bar-height), rgba(34, 145, 248, 0) 100%);
	position: fixed;
	width: 100%;
	top: 0;
	left: 0;
}

.merchant-info {
	padding: 24rpx 24rpx 28rpx 20rpx;
	position: relative;

	&-wrapper {
		display: flex;
		align-items: center;
	}

	.merchant-user-avatar {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
	}

	.merchant-user-name {
		font-size: 32rpx;
		font-weight: 500;
		color: #fff;
		max-width: 220rpx;
		margin: 0 16rpx;
	}

	.merchant-select-btn {
		background: transparent;
		color: #fff;
		font-size: 26rpx;
		margin-left: auto;

		display: flex;
		align-items: center;

		.iconfont {
			font-size: 36rpx;
			margin-left: 8rpx;
			transform: rotate(90deg)
		}
	}
}

.business-content {
	width: 100%;
	padding: 0 18rpx;
	display: flex;
	justify-content: space-around;
	flex-wrap: wrap;

	.listBox {
		width: 345rpx;
		height: 270rpx;
		background: #FFFFFF;
		box-shadow: 0rpx 5rpx 15rpx rgba(142, 82, 77, 0.1);
		border-radius: 24rpx;
		z-index: 1;
		margin-bottom: 20rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		image {
			width: 66rpx;
			height: 66rpx;
			background: #F34C20;
		}
	}
}

::v-deep  radio .wx-radio-input.wx-radio-input-checked,
::v-deep radio .uni-radio-input.uni-radio-input-checked {
	border: 1px solid #2291F8 !important;
	background-color: #2291F8 !important
}
</style>
