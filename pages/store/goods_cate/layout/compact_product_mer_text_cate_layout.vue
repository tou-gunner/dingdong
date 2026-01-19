<!-- 紧凑文字商品的分类页面布局，分类仅文字，不含图片 -->
<template>
  <view class="compact-product-layout">

    <!-- 顶部搜索组件 -->
    <TopSearch theme="light" />

    <view class="main-layout flex flex-1">

      <!-- 纵向分类列表组件 -->
      <VerticalCategoryList theme="light" :list="categoryList" :activeIndex="levelFirstCateIndex"
        @toggle="handleToggleFirstCategory">
        
        <!-- 底部 tabbar 高度占位 -->
        <pageFooterPlaceholder :tabbarConfig="tabbarConfig" :appendHeight="120" />
      </VerticalCategoryList>
      <view class="main-right-layout flex-full-h">
        <view v-if="activeSecondCategoryList.length" class="main-right-layout-top">

          <!-- 横向文字分类列表组件 -->
          <HorizontalTextCateList :list="activeSecondCategoryList" :activeIndex="levelSecondCateIndex"
            @toggle="handleToggleSecondCategory" theme="gray" />
        </view>
        <view class="flex-full-h">

          <!-- 紧凑小图商品列表组件 -->
          <CompactProductList :list="productList" @loadMore="handleLoadMoreProduct" @addCart="selecAttr"
            v-if="productList.length">

            <!-- 底部 tabbar 高度占位 -->
            <pageFooterPlaceholder :tabbarConfig="tabbarConfig" :appendHeight="120" />
          </CompactProductList>

          <!-- 空页面组件 -->
          <emptyPage title="暂无商品，去看点别的吧～" :noImage="`${domain}/static/images/no_thing.png`"
            v-if="!productList.length && !loading" />
        </view>
      </view>
    </view>

    <!-- 购物车信息统计组件 -->
    <CartBar />

    <!-- 商品属性选择组件 -->
    <productWindow :attr="attr" :isShow='true' :iSplus='1' :destri="0" :isList="true" :isTab="true" isCustom
      @myevent="onMyEvent" @ChangeAttr="ChangeAttr" @ChangeCartNum="ChangeCartNum" @attrVal="attrVal" @goCat="goCat"
      @iptCartNum="iptCartNum" id='product-window' :payLimit="pay_limit" :maxCount="max_count" :minCount="min_count"
      :svipPrice="svipPrice" :image="storeInfo.image"></productWindow>
  </view>
</template>

<script>
import TopSearch from '@/components/goodsCate/top-search.vue';
import VerticalCategoryList from '@/components/goodsCate/vertical-category-list.vue';
import HorizontalTextCateList from '@/components/goodsCate/horizontal-text-cate-list.vue';
import CompactProductList from '@/components/goodsCate/compact-product-list.vue';
import pageFooterPlaceholder from '@/components/diyPage/pageFooterPlaceholder.vue';
import productWindow from '@/components/productWindow';
import CartBar from '@/components/goodsCate/cart-bar.vue';
import emptyPage from '@/components/emptyPage.vue';

import cart from '@/mixins/cart.js';
import diyTabbar from '@/mixins/diy-tabbar.js';
import cateDataProvider from "../mixins/cate-data-provider.js";

export default {
  name: "CompactProductMerTextCateLayout",
  mixins: [diyTabbar, cateDataProvider, cart],
  components: {
    TopSearch,
    VerticalCategoryList,
    HorizontalTextCateList,
    CompactProductList,
    pageFooterPlaceholder,
    productWindow,
    CartBar,
    emptyPage
  },
  methods: {
    handleToggleNextCategory() {
      const length = this.categoryList.length;
      const index = this.levelFirstCateIndex;
      if (index < length - 1) {
        this.handleToggleFirstCategory(index + 1);
      }
    }
  }
}
</script>


<style scoped lang="scss">
.compact-product-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.main-layout {
  overflow: hidden;
}

.main-right-layout {
  display: flex;
  flex-direction: column;
  background-color: #fff;
}

.main-right-layout-top {
  padding-inline: 24rpx 20rpx;
}

.flex-full-h {
  flex: 1;
  overflow: hidden;
}
</style>
