<template>
	<BaseContainer>
		<diyDataProvider :diyId="diyId" v-if="diyId !== undefined">
			<template #config="{ tabbarConfig }">

				<!-- 三级分类布局 -->
				<SubCategoryLayout v-if="cateTemplteIndex === 0" />

				<!-- 大图商品布局 -->
				<MediumProductLayout v-else-if="cateTemplteIndex === 1" />

				<!-- 小图商品布局 -->
				<CompactProductLayout v-else-if="cateTemplteIndex === 2" />

				<template v-if="tabbarConfig">
					<!--自定义底部tab栏-->
					<pageFootWrapper :tabbarConfig="tabbarConfig" />
					<tabbarCheck ref="tabbarCheck" :tabbarConfig="tabbarConfig" />
				</template>
			</template>
		</diyDataProvider>
	</BaseContainer>
</template>

<script>
import { diyCategory } from '@/api/api.js';
import BaseContainer from '@/components/common/base_container.vue';
import diyDataProvider from '@/components/diyPage/common/diyDataProvider.vue';
import tabbarCheck from '@/components/diyPage/common/tabbarCheck.vue';
import pageFootWrapper from "@/sub-packages/diy/diyPage/common/pageFootWrapper.vue";

import CompactProductLayout from './layout/compact_product_layout.vue';
import MediumProductLayout from './layout/medium_product_layout.vue';
import SubCategoryLayout from './layout/sub_category_layout.vue';

export default {
	name: "goods_cate",
	components: {
		BaseContainer,
		diyDataProvider,
		CompactProductLayout,
		MediumProductLayout,
		SubCategoryLayout,
		tabbarCheck,
		pageFootWrapper
	},
	// #ifdef MP
	componentPlaceholder: {
		"page-foot-wrapper": "view"
	},
	// #endif
	data() {
		return {
			diyId: undefined,
			cateTemplteIndex: -1
		};
	},
	onLoad(options) {
		const index = parseInt(options.index);
		this.diyId = this.$util.getDiyId(options);
		if (this.verifyCateTemplateIndex(index)) {
			this.cateTemplteIndex = index;
		} else {
			this.getCateConfig();
		}
	},
	onShow() {
		this.$refs.tabbarCheck && this.$refs.tabbarCheck.check();
	},
	methods: {
		verifyCateTemplateIndex(index) {
			// 验证是否是合法的分类模板索引值 , 0 ~ 2
			return Number.isInteger(index) && index >= 0 && index <= 2;
		},
		async getCateConfig() {
			try {
				const res = await diyCategory();
				this.cateTemplteIndex = res.data.value.index;
			} catch (error) {
				// this.$util.Tips({
				// 	title: error.message || error
				// });
			} finally {
				const isValidIndex = this.verifyCateTemplateIndex(this.cateTemplteIndex);
				if (!isValidIndex) {
					this.cateTemplteIndex = 0;
				}
			}
		}
	}
}
</script>

<style scoped lang="scss"></style>
