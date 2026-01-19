<template>
	<view v-if="specsInfo.params && specsInfo.params.length>0" class="attribute acea-row row-between-wrapper" @click="seeSpecs">
		<view class="acea-row row-center-wrapper">
			<view>ຕົວກໍານົດ：</view>
			<view class="list line1">
				<text class="item params" v-for="(item,index) in specsInfo.params" :key="index"
					v-if="index<2">{{item.label}}</text>
				<text>...</text>
			</view>
		</view>
		<view class="iconfont icon-ic_rightarrow"></view>
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
			specsInfo: {
				type: Object,
				default: () => {}
			},
		},
		data() {
			return {};
		},
		mounted() {},
		methods: {
			seeSpecs(){
				this.$emit('seeSpecs');
			}
		}
	}
</script>

<style scoped lang="scss">

</style>
