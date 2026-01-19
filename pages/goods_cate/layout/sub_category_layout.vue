<!-- 三级分类布局 -->
<template>
  <view class="sub-category-layout">

    <!-- 顶部搜索组件 -->
    <TopSearch />

    <!-- 纵向分类列表组件 -->
    <view class="main-layout">
      <VerticalCategoryList :list="activeSecondCategoryList" :activeIndex="levelSecondCateIndex"
        @toggle="handleToggleSecondCategory">
        <!-- 底部 tabbar 高度占位 -->
        <pageFooterPlaceholder :tabbarConfig="tabbarConfig" :appendHeight="0" />
      </VerticalCategoryList>
      <view class="main-right-layout flex-full-h">

        <!-- 横向文字分类列表组件 -->
        <HorizontalTextCateList :list="allCategoryList" :activeIndex="levelFirstCateIndex"
          @toggle="handleToggleFirstCategory" />

        <!-- 网格分类列表组件 -->
        <view class="flex-full-h">
          <GridCategory :list="activeSecondCategoryList" :activeIndex="levelSecondCateIndex"
            @toggle="handleToggleSecondCategory" />
        </view>

        <!-- 底部 tabbar 高度占位 -->
        <pageFooterPlaceholder :tabbarConfig="tabbarConfig" :appendHeight="0" />
      </view>
    </view>
  </view>
</template>

<script>
import TopSearch from '@/components/goodsCate/top-search.vue';
import pageFooterPlaceholder from '@/components/diyPage/pageFooterPlaceholder.vue';
import VerticalCategoryList from '@/components/goodsCate/vertical-category-list.vue';
import GridCategory from '@/components/goodsCate/grid-category.vue';
import diyTabbar from '@/mixins/diy-tabbar.js';
import HorizontalTextCateList from '@/components/goodsCate/horizontal-text-cate-list.vue';
import cateDataProvider from "../mixins/cate-data-provider.js";

export default {
  name: "SubCategoryLayout",
  mixins: [diyTabbar, cateDataProvider],
  components: {
    TopSearch,
    pageFooterPlaceholder,
    VerticalCategoryList,
    GridCategory,
    HorizontalTextCateList
  },
  data() {
    return {
      ignoreProduct: true, // 提供给 cateDataProvider，用来忽略商品请求，该布局组件无需商品数据，仅用于展示分类
    };
  }
}
</script>

<style scoped lang="scss">
.sub-category-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.main-layout {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.main-right-layout {
  display: flex;
  flex-direction: column;
  padding-inline: 24rpx 20rpx;
}

.flex-full-h {
  flex: 1;
  overflow: hidden;
}
</style>
