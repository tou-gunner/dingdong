<template>
  <base-container v-if="store.mer_id">
    <view :style="[wrapperStyle]" class="store-home">
      <search :store="store"></search>
      <view class="main-list-wrapper">
        <view class="main-list-content">
          <scroll-view scroll-y class="main" :style="viewColor">
            <store-info :store="store"></store-info>
            <view>
              <block v-if="topicList.length > 0">
                <view class="main_count">
                  <navigator v-for="(item, index) in topicList" :key='item.group_data_id'
                    :url="`/pages/activity/topic_detail/index?id=${item.group_data_id}`" hover-class="none">
                    <view class='list'>
                      <image :src="item.pic" class="picture" mode="aspectFill"></image>
                    </view>
                  </navigator>
                  <view class="tabbar-placeholder"></view>
                </view>
              </block>
              <block v-else>
                <emptyPage title="ບໍ່ມີກິດຈະກຳພິເສດ~"></emptyPage>
              </block>
            </view>
          </scroll-view>
        </view>
      </view>
    </view>
    <diyDataProvider :diyId="diyId" :merId="merId" v-if="merId || diyId">
      <template #config="{ tabbarConfig }">
        <template v-if="tabbarConfig">
          <!--自定义底部tab栏-->
          <pageFootWrapper :merId="merId" :tabbarConfig="tabbarConfig" :nothing-data="updateStyle(tabbarConfig)" />
        </template>
      </template>
    </diyDataProvider>
  </base-container>
</template>
<script>
import BaseContainer from "@/components/common/base_container.vue";

import search from "./components/search.vue";
import storeInfo from "./components/store-info.vue";
import { getTopicList } from '@/api/activity.js';
import { mapGetters, mapState } from 'vuex';
import emptyPage from '@/components/emptyPage.vue'
import shareMixins from './components/share-mixins.js';
import diyDataProvider from '@/components/diyPage/common/diyDataProvider.vue';
import pageFootWrapper from "@/sub-packages/diy/diyPage/common/pageFootWrapper.vue";
import { diyUtil } from "@/utils/diy";

export default {
  mixins: [shareMixins],
  components: {
    BaseContainer,
    pageFootWrapper,
    search,
    storeInfo,
    emptyPage,
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
      topicList: [],
      tabbarHeight: 0
    }
  },
  onLoad(options) {
    this.merId = this.id = parseInt(options.mer_id || options.id) || 0;
    this.diyId = parseInt(options.diyId) || 0;
    this.getStore();
    this.getTopic();
  },
  computed: {
    ...mapGetters(['isLogin', 'uid', 'viewColor', 'keyColor']),
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
    // 获取商铺活动专题
    getTopic() {
      if (this.topicList.length) {
        return;
      }
      getTopicList(this.id, { page: 1, limit: 999 }).then(res => {
        this.topicList = res.data;
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
  }
}
</script>

<style scoped lang="scss">
@import "./components/common.scss";

::v-deep .diy-data-provider {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.main_count {
  background-color: #f5f5f5;
  padding: 20rpx;

  .list {
    width: 710rpx;
    height: 280rpx;
    margin-bottom: 20rpx;
    position: relative;

    .picture {
      width: 710rpx;
      height: 280rpx;
      border-radius: 24rpx;
    }
  }
}
</style>
