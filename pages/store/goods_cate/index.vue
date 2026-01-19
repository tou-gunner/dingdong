<template>
	<BaseContainer>
		<diyDataProvider :diyId="diyId" :merId="mer_id" v-if="mer_id || diyId">
			<template #config="{ tabbarConfig }">
				<!-- 平铺展示所有子分类布局 -->
				<SubCategoryLayout v-if="cateTemplteIndex === 0" :merId="mer_id" />

				<!-- 文字类型二级分类 & 中图商品布局 -->
				<MediumProductTextCateLayout v-else-if="cateTemplteIndex === 1" :merId="mer_id" />

				<!-- 图片类型二级分类 & 小图商品布局 -->
				<CompactProductImgCateLayout v-else-if="cateTemplteIndex === 2" :merId="mer_id" />

				<!-- 文字类型二级分类 & 小图商品布局 -->
				<CompactProductTextCateLayout v-else-if="cateTemplteIndex === 3" :merId="mer_id" />

				<!-- 图片类型二级分类 & 中图商品布局 -->
				<MediumProductImgCateLayout v-else-if="cateTemplteIndex === 4" :merId="mer_id" />

				<!-- 无分类，大图商品卡片布局 -->
				<LargeProductCardLayout v-else-if="cateTemplteIndex === 5" :merId="mer_id" />

				<!--自定义底部tab栏-->
				<pageFootWrapper :tabbarConfig="tabbarConfig" :merId="mer_id" />
			</template>
		</diyDataProvider>
	</BaseContainer>
</template>

<script>
import { diyCategory } from '@/api/api.js';

import BaseContainer from '@/components/common/base_container.vue';
import diyDataProvider from '@/components/diyPage/common/diyDataProvider.vue';
import pageFootWrapper from "@/sub-packages/diy/diyPage/common/pageFootWrapper.vue";

import SubCategoryLayout from "./layout/sub_mer_category_layout.vue";
import MediumProductImgCateLayout from "./layout/medium_product_mer_img_cate_layout.vue";
import CompactProductImgCateLayout from "./layout/compact_product_mer_img_cate_layout.vue";
import CompactProductTextCateLayout from "./layout/compact_product_mer_text_cate_layout.vue";
import MediumProductTextCateLayout from "./layout/medium_product_mer_text_cate_layout.vue";
import LargeProductCardLayout from "./layout/large_product_mer_layout.vue";

export default {
	name: "goods_cate",
	components: {
		BaseContainer,
		diyDataProvider,
		pageFootWrapper,

		SubCategoryLayout,
		MediumProductImgCateLayout,
		CompactProductImgCateLayout,
		CompactProductTextCateLayout,
		MediumProductTextCateLayout,
		LargeProductCardLayout
	},
	// #ifdef MP
	componentPlaceholder: {
		"page-foot-wrapper": "view"
	},
	// #endif
	computed: {
	},
	data() {
		return {
			diyId: undefined,
			cateTemplteIndex: -1,
			mer_id: 0
		};
	},
	onLoad(options) {
		const index = parseInt(options.index);
		this.diyId = parseInt(options.diyId) || 0;
		this.mer_id = parseInt(options.id) || 0;

		if (this.verifyCateTemplateIndex(index)) {
			this.cateTemplteIndex = index;
		} else {
			this.getCateConfig();
		}
	},
	methods: {
		verifyCateTemplateIndex(index) {
			// 验证是否是合法的分类模板索引值 , 0 ~ 5
			return Number.isInteger(index) && index >= 0 && index <= 5;
		},
		async getCateConfig() {
			try {
				const res = await diyCategory({ mer_id: this.mer_id });
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
