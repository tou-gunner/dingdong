<template>
	<view class="user-setting pad20">
		<view class="list bg-f boder-24 mt20">
			<view class='item acea-row row-between-wrapper' @click="gouser">
				<view>ຂໍ້ມູນສ່ວນຕົວ</view>
				<text class='iconfont icon-ic_rightarrow'></text>
			</view>
		</view>
		<view class="list bg-f boder-24 mt20">
			<view class='item acea-row row-between-wrapper' @click="goMultiple('sys_about_us')">
				<view>ກ່ຽວກັບພວກເຮົາ</view>
				<text class='iconfont icon-ic_rightarrow'></text>
			</view>
			<view class='item acea-row row-between-wrapper' @click="goMultiple('sys_certificate')">
				<view>ໃບຢັ້ງຢືນຄຸນສົມບັດ</view>
				<text class='iconfont icon-ic_rightarrow'></text>
			</view>
			<view class='item acea-row row-between-wrapper' @click="gorules">
				<view>ກົດລະບຽບຂໍ້ຕົກລົງ</view>
				<text class='iconfont icon-ic_rightarrow'></text>
			</view>
			<!-- #ifdef MP -->
			<view class='item acea-row row-between-wrapper' @click="Setting">
				<view>ຕັ້ງຄ່າຄວາມເປັນສ່ວນຕົວ</view>
				<text class='iconfont icon-ic_rightarrow'></text>
			</view>
			<!-- #endif -->
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
	export default{
		name:'user-setting',
		data(){
			return{

			}
		},
		methods:{
			/**
			 * 小程序设置
			 */
			Setting: function() {
				uni.openSetting({
					success: function(res) {}
				});
			},
			//个人信息
			gouser(){
				uni.navigateTo({
					url: '/pages/users/user_info/index'
				})
			},
			//关于我们  资质证明
			goMultiple(e){
				uni.navigateTo({
					url: '/pages/users/user_about/index?from='+e
				})
			},
			gorules(){
				uni.navigateTo({
					url: '/pages/users/agreement_rules/index'
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.user-setting {
		.item {
			padding: 30rpx 30rpx 30rpx 0;
			margin-left: 30rpx;
			font-size: 30rpx;
			color: #242424;
			.iconfont {
				color: #999999;
			}
		}
	}
</style>
