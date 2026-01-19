<template>
	<view class="empty-box">
		<image :src="noImage"></image>
		<view class="txt">{{title}}</view>
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
	import { HTTP_REQUEST_URL } from '@/config/app';
	export default{
		props: {
			title: {
				type: String,
				default: 'ບໍ່ມີບັນທຶກ',
			},
			noImage: {
				type: String,
				default: HTTP_REQUEST_URL+'/static/images/empty-box.png',
			}
		},
	}

</script>

<style lang="scss">
	.empty-box{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		// margin-top: 120rpx;
		image{
			width: 414rpx;
			height: 305rpx;
		}
		.txt{
			font-size: 26rpx;
			color: #999;
		}
	}
</style>
