<template>
	<view class="agreement-rules pad20 mt20">
		<view class="list bg-f boder-24">
			<view class='item acea-row row-between-wrapper' v-for="(item,index) in listDta" @click="goMultiple(item.key)" :key="index">
				<view>{{item.label}}</view>
				<text class='iconfont icon-ic_rightarrow'></text>
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
	import {cacheLst} from '@/api/user.js';
	export default{
		name:'agreement-rules',
		data(){
			return{
				listDta:''
			}
		},
		onLoad: function() {
			this.getInfo()
		},
		methods:{
			getInfo(){
				cacheLst().then(res=>{
					this.listDta = res.data
				})
			},
			goMultiple(e){
				uni.navigateTo({
					url: '/pages/users/user_about/index?from='+e
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.agreement-rules {
		.list {
			.item {
				padding: 30rpx 30rpx 30rpx 0;
				border-bottom: 1px solid #f2f2f2;
				margin-left: 30rpx;
				font-size: 32rpx;
				color: #242424;
				.iconfont {
					font-size: 37rpx;
					color: #8A8A8A;
				}
			}
		}
	}
</style>
