<template>
	<view :style="viewColor">
		<view class="customerCount">
			<view class="title">选择登录店铺</view>
			<view class="store_count">
				<scroll-view scroll-y="true" show-scrollbar="false">
					<view v-for="(item, index) in list" class="item" :key="index">
						<view class="info" @click="login(item)">
							<image class="image" :src='item.merchant.mer_avatar' ></image>
							<view class="text">
								<view class="name">{{item.merchant.mer_name}}</view>
								<view class="desc">{{item.account}}</view>
							</view>
						</view>
						<text class="iconfont icon-ic_rightarrow"></text>
					</view>
				</scroll-view>
			</view>
			<view class="picture-group">
			<view class="picture" :style="{ 'background-image': `url(${domain}/static/images/customer_login_bg.png)`}"></view>
			</view>
		</view>
		<view v-if="loaded && !list.length">
			<view class="empty">
				<image class="img" :src="`${domain}/static/images/noPermission.png)`"></image>
				<view class="title">暂无权限</view>
				<view class="intr">抱歉，您还没有登录权限哦！</view>
				<navigator class="btn" open-type="switchTab" url="/pages/index/index">返回首页</navigator>
			</view>
		</view>
		<view class="success" v-if="isShowbox">
			<view class="bg"></view>
			<view class="con bg-f boder-24">
				<image :src="domain+'/static/images/login_success.png'" mode=""></image>
				<view class="text">登录成功</view>
				<view class="btn" @click="close">我知道了</view>
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
	import {
		getStoreList,
		serviceLogin
	} from '@/api/user.js';
	import {
		mapGetters
	} from "vuex";
	import { HTTP_REQUEST_URL } from '@/config/app';
	export default {
		name: "CustomerLogin",
		computed: mapGetters(['viewColor', 'keyColor']),
		components:{

		},
		data() {
			return {
				domain: HTTP_REQUEST_URL,
				list: [],
				isShowbox: false,
				key:'',
				loaded: false,
			};
		},
		onLoad(options) {
			this.key = options.key
			this.loaded = !this.key
			!this.loaded && this.getList()
		},
		onShow(option) {

		},
		onHide(){

		},
		onUnload() {

		},
		methods: {
			close(){
				this.isShowbox = false;
				uni.reLaunch({
					url: '/pages/index/index'
				})
			},
			getList() {
				uni.showLoading({
					title: '加载中',
					mask: true
				})
				getStoreList().then(res=>{
					uni.hideLoading()
					this.loaded = true;
					this.list = res.data;
				})
			},
			login(item){
				uni.showLoading({
					title: '授权中',
					mask: true
				})
				serviceLogin(this.key, {service_id:item.service_id}).then(res=>{
					uni.hideLoading()
					this.isShowbox = true
				}).catch(err=>{
					uni.hideLoading()
					uni.showToast({
						title: err,
						icon: 'none'
					})
				})
			}
		},
	};
</script>
<style lang="scss">
	page{
		background-color: #fff;
		height: 100%;
	}
	.customerCount{
		.title{
			padding: 60rpx 40rpx 50rpx;
			color: #282828;
			font-size: 36rpx;
			font-weight: bold;
			position: fixed;
			top: 0;
			width: 100%;
			background-color: #fff;
			z-index: 2;
		}
		.store_count{
			margin-top: 160rpx;
			height: 100%;
			margin-bottom: 400rpx;
			scroll-view{
				height: 100%;
			}
			.item{
				border-top: 1px solid #E5E5E5;
				padding: 21rpx 20rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				.info{
					width: 500rpx;
					display: flex;
					align-items: center;
					.image{
						width: 80rpx;
						height: 80rpx;
						border-radius: 100%;
					}
					.text{
						margin-left: 20rpx;
						.name{
							color: #282828;
							font-size: 30rpx;
						}
						.desc{
							color: #666666;
							font-size: 26rpx;
							margin-top: 10rpx;
						}
					}
				}
				.iconfont{
					font-size: 30rpx;
					color: #999999;
				}
			}
		}
		.picture-group{
			position: fixed;
			display: flex;
			justify-content: center;
			bottom: 0;
			background-color: #fff;
			width: 100%;
		}
		.picture{
			width: 650rpx;
			height: 390rpx;
			background-size: 100% 100%;
			background-repeat: no-repeat;
		}
	}
	.empty{
		text-align: center;
		margin-top: 300rpx;
		.img{
			width: 414rpx;
			height: 305rpx;
		}
		.title{
			color: #282828;
			font-size: 28rpx;
			font-weight: bold;
		}
		.intr{
			font-size: 24rpx;
			color: #999999;
			margin-top: 14rpx;
		}
		.btn{
			width: 240rpx;
			height: 80rpx;
			line-height: 80rpx;
			border: 1rpx solid var(--view-theme);
			text-align: center;
			border-radius: 50rpx;
			margin: 44rpx auto 0;
			color: var(--view-theme);
		}
	}
	.success {
		z-index: 10;
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		.bg {
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			background-color: rgba(0, 0, 0, .5);
		}
		.con {
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			width: 500rpx;
			height: 540rpx;
			font-size: 34rpx;
			color: #282828;
			image {
				width: 290rpx;
				height: 224rpx;
			}
			.text{
				color: #282828;
				font-size: 36rpx;
				margin-top: 36rpx;
				font-weight: bold;
			}
			.btn {
				width: 408rpx;
				height: 88rpx;
				line-height: 88rpx;
				margin-top: 38rpx;
				font-size: 28rpx;
				text-align: center;
				color: #fff;
				background: #2291F8;
				border-radius: 50rpx;
			}
		}
	}
</style>
