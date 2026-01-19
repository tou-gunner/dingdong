<template>
	<view class='attribute acea-row row-between-wrapper skeleton-rect' @click="selecAttr">
		<view class="acea-row row-center-wrapper">
			<view>{{attrTxt}}</view>：
			<text class='atterTxt'>{{attrValue || 'ເລີ່ມຕົ້ນ'}}</text>
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
			attrTxt: {
				type: String,
				default: ""
			},
			attrValue: {
				type: String,
				default: ""
			},
		},
		data() {
			return {};
		},
		mounted() {},
		methods: {
			selecAttr(){
				this.$emit('selecAttr');
			}
		}
	}
</script>

<style scoped lang="scss">

</style>
