<template>
	<base-container>
		<diyPage :diyId="diyId" :merId="merId" :scrollTop="scrollTop" v-if="diyId" />

		<!-- 底部占位组件 -->
		<diyDataProvider v-if="merId || diyId" :diyId="diyId" :merId="merId">
			<template #config="{ tabbarConfig }">
				<!-- 占位组件，小程序环境下如果没有该占位组件，控制台会有组件报错 -->
				<!-- #ifdef MP -->
				<view v-if="!$attr" />
				<!-- #endif -->
				<pageFooterPlaceholder :tabbarConfig="tabbarConfig" v-if="tabbarConfig" />
			</template>
		</diyDataProvider>
	</base-container>
</template>
<script>
import BaseContainer from '@/components/common/base_container.vue';
import { mapGetters } from 'vuex';
import pageFooterPlaceholder from "@/components/diyPage/pageFooterPlaceholder.vue";
import diyDataProvider from '@/components/diyPage/common/diyDataProvider.vue';
import diyPage from "@/sub-packages/diy/diyPage/index.vue";

export default {
	components: {
		BaseContainer,
		pageFooterPlaceholder,
		diyDataProvider,
		diyPage
	},
	computed: {
		...mapGetters(['isLogin', 'uid', 'viewColor', 'keyColor'])
	},
	// #ifdef MP
	componentPlaceholder: {
		"diy-page": "view"
	},
	// #endif
	data() {
		return {
			diyId: undefined,
			merId: 0,
			scrollTop: 0
		}
	},
	onLoad(options) {
		this.diyId = parseInt(options.id) || 0;
		this.merId = parseInt(options.mer_id) || 0;
		this.merId && this.getStore();
	},
	onPageScroll(event) {
		this.scrollTop = event.scrollTop;
	},
	methods: {
		getStore() {
			this.$store.dispatch("getStoreInfo", {
				merId: this.merId
			});
		}
	}
}
</script>

<style scoped lang="scss"></style>
