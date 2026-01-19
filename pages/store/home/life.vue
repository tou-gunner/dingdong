<template>
  <base-container v-if="store.mer_id">
    <view :style="[wrapperStyle]" class="store-home">
      <search :store="store"></search>

      <view class="main-list-wrapper">
        <view class="main-list-content">
          <good-list :goods="productList" :is-column="true" :store="store" :preview="false" @scroll="scrollHome"
            :goodsLoading="goodsLoading" :loadTitle="loadTitle" @scrolltolower="onScrolltolower"></good-list>
        </view>
      </view>

      <diyDataProvider :diyId="diyId" :merId="merId" v-if="merId || diyId">
        <template #config="{ tabbarConfig }">
          <template v-if="tabbarConfig">
            <!--自定义底部tab栏-->
            <pageFootWrapper :merId="id" :tabbarConfig="tabbarConfig" :nothing-data="updateStyle(tabbarConfig)" />
          </template>
        </template>
      </diyDataProvider>
    </view>
  </base-container>
</template>

<script>
import BaseContainer from "@/components/common/base_container.vue";

import search from "./components/search.vue";
import goodList from "./components/good-list.vue";
import { storeServiceList } from '@/api/store.js';
import shareMixins from './components/share-mixins.js';
import { mapState } from 'vuex';
import diyDataProvider from '@/components/diyPage/common/diyDataProvider.vue';
import pageFootWrapper from "@/sub-packages/diy/diyPage/common/pageFootWrapper.vue";
import { diyUtil } from "@/utils/diy";

export default {
  mixins: [shareMixins],
  components: {
    BaseContainer,
    pageFootWrapper,
    search,
    goodList,
    diyDataProvider
  },
  // #ifdef MP
  componentPlaceholder: {
		"page-foot-wrapper": "view"
	},
	// #endif
  data() {
    return {
      merId: 0, // 商铺id，兼容 mixin 的 merId 参数
      id: 0, // 商铺id
      diyId: undefined,
      where: {
        order: '',
        keyword: '',
        page: 1,
        limit: 30
      },
      loading: false,
      loadend: false,
      goodsLoading: false,
      loadTitle: '',
      productList: [],
      tabbarHeight: 0
    }
  },
  onLoad(options) {
    this.merId = this.id = parseInt(options.mer_id || options.id) || 0;
    this.diyId = parseInt(options.diyId) || 0;
    this.getStore();
    this.get_service_list();
  },
  computed: {
    ...mapState({
      store(state) {
        return state.store.storeInfoMap[this.merId] || {};
      }
    }), 
    wrapperStyle() {
      return {
        backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.5) 100%), url(${this.store.mer_banner})`,
        "--tabbar-height": `${this.tabbarHeight}px`
      }
    },
  },
  methods: {
    updateStyle(tabbarConfig) {
      this.tabbarHeight = diyUtil.calcTabbarHeight(tabbarConfig);
      return undefined;
    },
    onScrolltolower() {
      if (this.loadend) return;
      if (this.loading) return;
      if (this.goodsLoading) return;
      this.get_service_list();
    },
    // 本地生活服务商品
    get_service_list() {
      let that = this;
      if (that.loadend) return;
      if (that.loading) return;
      if (that.goodsLoading) return;
      that.goodsLoading = true;
      that.loadTitle = '';
      storeServiceList(that.id, that.where).then(res => {
        that.goodsLoading = false;
        let list = res.data.list;
        let productList = that.$util.SplitArray(list, that.productList);
        let loadend = list.length < that.where.limit;
        that.loadend = loadend;
        that.loading = false;
        that.loadTitle = loadend ? '加载更多' : '已全部加载';
        that.$set(that, 'productList', productList);
        that.$set(that.where, 'page', that.where.page + 1);
      }).catch(err => {
        that.loading = false;
        that.goodsLoading = false;
        uni.showToast({
          title: err,
          icon: 'none'
        })
        setTimeout(function () {
          uni.navigateBack()
        }, 1000);
      });
    },
    async getStore() {
      try {
        await this.$store.dispatch("getStoreInfo", {
          merId: this.id
        });
        this.ShareInfo();
      } catch (error) {
        console.error(error.message);
        this.$util.Tips({
          title: error.message
        });
      }
    },
    scrollHome(e) {
      uni.$emit('scroll');
      // this.navShow = e.detail.scrollTop >= 50;
    },
  }
}
</script>

<style scoped lang="scss">
@import "./components/common.scss";
</style>