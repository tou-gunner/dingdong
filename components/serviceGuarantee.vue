<template>
	<view v-if="guarantee && guarantee.length" class='attribute acea-row row-between-wrapper' @click="showGuaranee">
		<view class="acea-row row-center-wrapper">
			<view>ການຮັບປະກັນ：</view>
			<view class="guaranteeAttr">
				<text class='atterTxt' :class="item.guarantee_name ? 'hasAttr' : ''"  v-for="(item,index) in guarantee" :key="index">
					{{item.guarantee_name ? item.guarantee_name : ''}}
				</text>
			</view>
		</view>
		<view class='iconfont icon-ic_rightarrow'></view>
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
	export default {
		props: {
			guarantee: {
				type: Array,
				default: () => []
			},
		},
		data() {
			return {};
		},
		mounted() {},
		methods: {
			showGuaranee(){
				this.$emit('showGuaranee');
			}
		}
	}
</script>

<style scoped lang="scss">

</style>
