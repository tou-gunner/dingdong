<template>
	<view :style="viewColor">
		<view class="guaranee_tel popup-main">
			<view class="popup bg-f" :class="{ on: isGuarantee }">
				<view class="title font-500">ຄຳອະທິບາຍການຮັບປະກັນ<text class="iconfont icon-ic_close popup-close" @click="close"></text></view>
					<view v-if="guarantee.length" class="content">
						<view v-for="(item,index) in guarantee" class="item acea-row" :key="index">
							<image :src='item.image' class="image"></image>
							<view class="text">
								<view class="name">{{item.guarantee_name}}</view>
								<view class="info" style="white-space: pre-line;">{{item.guarantee_info}}</view>
							</view>
						</view>
					</view>
				<button @tap="close">ຢືນຢັນ</button>
			</view>
			<view class="popup bg-f" :class="{ on: isShipping }">
				<view class="title font-500">ຄຳອະທິບາຍຄ່າຂົນສົ່ງ<text class="iconfont icon-ic_close popup-close" @click="close"></text></view>
					<view class="content" style="white-space: pre-line;">
						{{shipping}}
					</view>
				<button @tap="close">ຢືນຢັນ</button>
			</view>
		</view>
		<view class='mask' catchtouchmove="true" :hidden='showMask==false' @tap='close'></view>
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
	export default {
		props: {
			shipping: {
				type: String,
			},
			guarantee: {
				type: Array,
			}
		},
		computed: mapGetters(['viewColor']),
		data() {
			return {
				isShipping: false,
				isGuarantee: false,
				showMask: false,
			}
		},
		watch: {

		},
		onLoad(option) {

		},
		onShow(){

		},
		methods: {
			showShippingTel() {
				this.isShipping = true;
				this.showMask = true;
			},
			showGuaranteeTel() {
				this.isGuarantee = true;
				this.showMask = true;
			},
			close: function() {
				this.isShipping = false;
				this.isGuarantee = false;
				this.showMask = false;
			}
		}
	}
</script>

<style scoped lang="scss">
	.guaranee_tel{
		padding-bottom: 20rpx;
	}
	.guaranee_tel.on {
		transform: translate3d(0, 0, 0);
	}
	.guaranee_tel .title {
		height: 123rpx;
		position: relative;
	}
	.guaranee_tel .title .iconfont {
		position: absolute;
		right: 20rpx;
		top: -10rpx;
	}
	.popup {
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 99;
		width: 100%;
		padding: 36rpx 0 40rpx;
		border-radius: 40rpx 40rpx 0 0;
		overflow: hidden;
		transform: translateY(100%);
		transition: 0.3s;
	}
	.popup.on {
		transform: translateY(0);
	}
	.popup .title {
		position: relative;
		height: 137rpx;
		font-size: 32rpx;
		text-align: center;
	}
	.popup scroll-view {
		height: 466rpx;
		padding-right: 30rpx;
		padding-left: 30rpx;
		box-sizing: border-box;
	}
	.popup .content{
		padding: 0 30rpx;
		color: #999999;
		max-height: 800rpx;
		overflow-y: scroll;
		.item{
			margin-bottom: 70rpx;
		}
		.image{
			width: 30rpx;
			height: 30rpx;
			margin-right: 20rpx;
			position: relative;
			top: 4rpx;
		}
		.text {
			width: 634rpx;
		}
		.name{
			color: #282828;
			flex: 1;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
		}
		.info{
			margin-top: 15rpx;
		}
	}
	.popup button {
		height: 88rpx;
		border-radius: 50rpx;
		margin-right: 30rpx;
		margin-left: 30rpx;
		background: var(--view-theme);
		font-size: 28rpx;
		line-height: 88rpx;
		color: #FFFFFF;
		margin-top: 80rpx;
	}
	.popup .text .acea-row {
		display: inline-flex;
		max-width: 100%;
	}
</style>
