<template>
	<view :style="viewColor">
		<view class="receive">
			<template v-if="!showBack">
				<view class="receive-type bg-f boder-24 acea-row row-between-wrapper">
					<text>收款方式</text>
					<view class="acea-row row-center-wrapper">
						<view class="weixin acea-row row-center-wrapper"><text class="iconfont icon-icon_WeChat_1"></text></view>
						<text class="">收款至微信</text>
					</view>
				</view>
				<view class="receive-money bg-f boder-24">
					<view class="title">收款金额</view>
					<view class="money">
						¥<text class="semiBold">{{infoData.extract_price}}</text>
					</view>
				</view>
			</template>
			<view v-if="showBack" class="receive-success bg-f boder-24">
				<view class="acea-row row-center-wrapper">
					<view class="icon-success acea-row row-center-wrapper"><text class="iconfont icon-duihao2"></text></view>
					<text class="">收款成功</text>
				</view>
				<view class="receive-info">
					<view class="money acea-row row-center-wrapper">
						¥<text class="semiBold">{{infoData.extract_price}}</text>
					</view>
				</view>
				<view class="info">可在“微信支付-服务-钱包-账单”查看明细</view>
				<view class="receive-back acea-row row-center-wrapper" @tap="backList">返回列表</view>
			</view>
			<view @tap="confrimTap" class="confirm-btn" v-if="!showBack">
				<view class="btn acea-row row-center-wrapper">
					<view class="">立即收款</view>
					<!-- <view class="" @tap="confrimTap">立即收款</view> -->
				</view>
			</view>
		</view>
	</view>
</template>
<script>
import { toLogin } from '@/libs/login.js';
import { extractDetailApi } from "@/api/user";
import { mapGetters } from "vuex";
export default {
	data() {
		return {
			id:0,
			type:1,
			infoData:{
				extract_price: "",
				package_info:"",
				mchid:"",
				wechat_appid: ""
			},
			showBack: false
		};
	},
	computed: mapGetters(['isLogin', 'viewColor']),
	onLoad(options) {
		if(options.id){
			this.id = options.id;
			this.type = options.type;
			this.getInfo();
		}
	},
	methods:{
		getInfo(){
			extractDetailApi(this.id).then(res=>{
				this.infoData = res.data;
			}).catch(err=>{
				return this.$util.Tips({
					title: err
				},{
					tab:3
				});
			})
		},
		confrimTap(){
			let that = this;
			// #ifdef MP-WEIXIN
			if (wx.canIUse('requestMerchantTransfer')) {
			  wx.requestMerchantTransfer({
			    mchId: that.infoData.wechat_mch_id,
			    // appId: wx.getAccountInfoSync().miniProgram.appId,
					appId: that.infoData.wechat_app_id,
			    package: that.infoData.package_info,
			    success: (res) => {
					that.showBack = true;
			      // res.err_msg将在页面展示成功后返回应用时返回ok，并不代表付款成功
			      console.log('success:', res);
			    },
			    fail: (res) => {
			      console.log('fail:', res);
						return that.$util.Tips({
							title: res
						});
			    },
			  });
			} else {
				return that.$util.Tips({
					title: '你的微信版本过低，请更新至最新版本。'
				}); 
			}
			// #endif
			// #ifdef H5
			if (that.$wechat.isWeixin()) {
				let configAppMessage = {
					mchId: that.infoData.wechat_mch_id,
					appId: that.infoData.wechat_app_id,
					package: that.infoData.package_info,
				};
				if(WeixinJSBridge){
					WeixinJSBridge.invoke('requestMerchantTransfer', configAppMessage, function (res) {
						if (res.err_msg === 'requestMerchantTransfer:ok') {
							// res.err_msg将在页面展示成功后返回应用时返回success，并不代表付款成功
							that.showBack = true;
						}
					});
				}	
			}
			// #endif
		},
		backList(){
			let pages = getCurrentPages(); // 获取当前打开过的页面路由数，
			if (pages.length > 1) {
				uni.navigateBack()
			} else {
				uni.redirectTo({
					url: '/pages/users/user_spread_money/index?type=1'
				});
			}
		}
	}
}
</script>
<style scoped lang="scss">
	.receive {
		padding: 0 20rpx;
	}
	.receive-type {
		margin-top: 40rpx;
		height: 120rpx;
		padding: 0 32rpx;
	}
	.receive-type .weixin {
		width: 42rpx;
		height: 42rpx;
		border-radius: 100%;
		margin-right: 16rpx;
		background: linear-gradient(360deg, #43C93E 0%, #4BE146 100%);
		.icon-icon_WeChat_1 {
			color: #fff;
			font-size: 30rpx;
		}
	}
	.receive-money {
		padding: 40rpx 32rpx 20rpx;
		margin-top: 20rpx;
	}
	.receive-money .title {
		padding-top: 40rpx;
	}
	.receive .money {
		margin: 36rpx 0;
		margin-top: 32rpx;
		font-size: 48rpx;
		font-weight: 600;
		text {
			font-size: 72rpx;
			margin-left: 4rpx;
		}
	}
	.confirm-btn {
		color: #fff;
		position: fixed;
		bottom: 24rpx;
		bottom: calc(24rpx + constant(safe-area-inset-bottom)); ///兼容 IOS<11.2/
		bottom: calc(24rpx + env(safe-area-inset-bottom)); ///兼容 IOS>11.2/
		left: 0;
		padding: 0 20rpx;
		width: 100%;
		.btn {
			width: 100%;
			height: 80rpx;
			border-radius: 50rpx;
			background: var(--view-theme);
		}
	}
	.receive-success {
		margin-top: 40rpx;
		padding: 82rpx 0;
		text-align: center;
		.icon-success {
			width: 60rpx;
			height: 60rpx;
			border-radius: 100%;
			background: #16AC57;
			margin-right: 16rpx;
			.icon-duihao2 {
				font-size: 30rpx;
				color: #fff;
			}
		}
		.receive-info {
			margin-top: 40rpx;	
		}
		.info {
			color: #999;
			font-size: 26rpx;
		}
		.receive-back {
			margin: 56rpx auto 0;
			width: 500rpx;
			height: 80rpx;
			border-radius: 50rpx;
			color: #fff;
			background: var(--view-theme);
		}
	}
</style>	