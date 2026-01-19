<template>
	<base-container>
		<template v-if="diyId">
			<diyPage :diyId="diyId" :merId="merId" :scrollTop="scrollTop" />

			<!-- 底部占位组件 -->
			<diyDataProvider :diyId="diyId" :merId="merId">
				<template #config="{ tabbarConfig }">
					<!-- 占位组件，小程序环境下如果没有该占位组件，控制台会有组件报错 -->
					<!-- #ifdef MP -->
					<view v-if="!$attr" />
					<!-- #endif -->
					<pageFooterPlaceholder :tabbarConfig="tabbarConfig" v-if="tabbarConfig" />
				</template>
			</diyDataProvider>
		</template>
	</base-container>
</template>

<script>
import BaseContainer from '@/components/common/base_container.vue';
import { mapGetters, mapState } from 'vuex';
import shareScence from "@/libs/spread";
import shareMixins from './components/share-mixins.js';
import pageFooterPlaceholder from "@/components/diyPage/pageFooterPlaceholder.vue";
import diyDataProvider from '@/components/diyPage/common/diyDataProvider.vue';
import diyPage from "@/sub-packages/diy/diyPage/index.vue";

export default {
	mixins: [shareMixins],
	components: {
		BaseContainer,
		pageFooterPlaceholder,
		diyDataProvider,
		diyPage
	},
	// #ifdef MP
	componentPlaceholder: {
		"diy-page": "view"
	},
	// #endif
	data() {
		return {
			scrollTop: 0,
			merId: '',
			isCoupon: 0,
			order: "",
			type: 0,
			diyActive: 0,
			preview: false,
			currSpid: "",
			diyId: undefined
		}
	},
	computed: {
		...mapGetters(['isLogin', 'uid', 'viewColor', 'keyColor']),
		...mapState({
			store(state) {
				return state.store.storeInfoMap[this.merId] || {};
			}
		})
	},
	onLoad(options) {
		this.type = parseInt(options.type) || 1
		this.diyId = parseInt(options.diyId) || 0;
		this.merId = parseInt(options.mer_id || options.id) || 0;
		if (!this.diyId) {
			this.getDiyData();
		}
		this.isCoupon = options.coupon || 0;
		this.diyActive = options.order || 0;
		this.order = options.order;
		this.preview = options.time ? true : false;
		if (options.spid) {
			this.currSpid = options.spid
			app.globalData.spid = options.spid;
		}
		// #ifdef MP
		if (options.scene) {
			let value = this.$util.getUrlParams(decodeURIComponent(options.scene));
			if (value.id) this.merId = value.id || 0;
			//记录推广人uid
			if (value.spid) {
				this.currSpid = value.spid
				app.globalData.spid = value.spid;
			}
		}
		// #endif
		this.getStore();
		shareScence(this.currSpid, this.isLogin)
	},
	onPageScroll(event) {
		this.scrollTop = event.scrollTop;
	},
	methods: {
		async getDiyData() {
			try {
				const diyData = await this.$store.dispatch("fetchDiyData", { diyId: 0, merId: this.merId });
				this.diyId = diyData.id;
			} catch { }
		},
		async getStore() {
			try {
				await this.$store.dispatch("getStoreInfo", {
					merId: this.merId
				});
				this.ShareInfo();
			} catch (error) {
				console.error(error.message);
				this.$util.Tips({
					title: error.message
				});
			}
		}
	}
}
</script>