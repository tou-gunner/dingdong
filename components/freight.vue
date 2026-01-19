<template>
	<view v-if="shipping || shippingValue" class='attribute acea-row row-between-wrapper' @click="showShip">
		<view class="acea-row row-center-wrapper">
			<view>ຄ່າຂົນສົ່ງ：</view>
			<text class='atterTxt'>{{shippingValue}}</text>
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
			shippingValue: {
				type: String,
				default: ""
			},
			shipping: {
				type: String,
				default: ""
			}
		},
		data() {
			return {};
		},
		mounted() {},
		methods: {
			showShip(){
				this.$emit('showShip');
			}
		}
	}
</script>

<style scoped lang="scss">

</style>
