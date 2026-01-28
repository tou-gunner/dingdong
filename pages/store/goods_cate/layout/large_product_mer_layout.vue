<template>
  <view class="large-product-mer-layout relative flex flex-col">
    <view class="search-wrapper">

      <!-- 顶部搜索组件 -->
      <TopSearch :merId="merId">

        <!-- 菜单按钮 -->
        <MenuBtn @open-drawer="handleOpenDrawer" />
      </TopSearch>
    </view>

    <!-- 该组件仅用于占据实际顶部搜索组件的高度，无实际作用 -->
    <TopSearch />

    <view class="flex-1">
      <scroll-view scroll-y class="product-list h-full" :lower-threshold="100" @scrolltolower="handleLoadMoreProduct">

        <!-- 大图商品列表组件 -->
        <LargeProductItem :goods="goods" v-for="goods in productList" :key="goods.spu_id" @addCart="selecAttr" />

        <!-- 空页面组件 -->
        <emptyPage title="ບໍ່ມີສິນຄ້າ, ລອງໄປເບິ່ງຢ່າງອື່ນດູ" :noImage="`${domain}/static/images/no_thing.png`"
          v-if="!productList.length && !loading" />

        <!-- 底部 tabbar 高度占位 -->
        <pageFooterPlaceholder :tabbarConfig="tabbarConfig" :appendHeight="20" />
      </scroll-view>
    </view>

    <!-- 分类抽屉组件 -->
    <CateDrawer :categoryList="categoryList" :levelFirstCateIndex="levelFirstCateIndex"
      :levelSecondCateIndex="levelSecondCateIndex" :visible="drawerVisible" @close-drawer="handleCloseDrawer"
      @change-cate="handleChangeCate" :emptyParams="isDefaultProductParams" />

    <!-- 商品属性选择组件 -->
    <productWindow :attr="attr" :isShow='true' :iSplus='1' :destri="0" :isList="true" :isTab="true" isCustom
      @myevent="onMyEvent" @ChangeAttr="ChangeAttr" @ChangeCartNum="ChangeCartNum" @attrVal="attrVal" @goCat="goCat"
      @iptCartNum="iptCartNum" id='product-window' :payLimit="pay_limit" :maxCount="max_count" :minCount="min_count"
      :svipPrice="svipPrice" :image="storeInfo.image"></productWindow>
  </view>
</template>

<script>
import diyTabbar from '@/mixins/diy-tabbar.js';
import cateDataProvider from "../mixins/cate-data-provider.js";
import pageFooterPlaceholder from '@/components/diyPage/pageFooterPlaceholder.vue';
import LargeProductItem from "../components/large_product_item.vue";
import cart from '@/mixins/cart.js';
import productWindow from '@/components/productWindow';
import CateDrawer from "../components/cate_drawer.vue";
import emptyPage from '@/components/emptyPage.vue';
import TopSearch from '@/components/goodsCate/top-search.vue';
import MenuBtn from "../components/menu_btn.vue";

export default {
  name: "LargeProductMerLayout",
  mixins: [diyTabbar, cateDataProvider, cart],
  components: {
    pageFooterPlaceholder,
    LargeProductItem,
    productWindow,
    CateDrawer,
    emptyPage,
    TopSearch,
    MenuBtn
  },
  data() {
    return {
      isRequireAllProduct: true,
      drawerVisible: false,
    };
  },
  methods: {
    handleOpenDrawer() {
      this.drawerVisible = true;
    },
    handleCloseDrawer() {
      this.drawerVisible = false;
    },
    handleChangeCate({ firstIndex, secondIndex }) {
      if (firstIndex === -1 || secondIndex === -1) {
        // 如果返回的商品分类索引为 -1，则认为用户重置了商品分类，此时需要重置商品分类数据的变化次数
        // 重置商品分类数据的变化次数后，需要重新请求商品数据，此时不会携带商品分类相关参数
        this.paramsChangeCount = 0;
        this.levelFirstCateIndex = 0;
        this.levelSecondCateIndex = 0;
        this.getProductsList(true);
      } else {
        if (firstIndex === this.levelFirstCateIndex && secondIndex === this.levelSecondCateIndex && this.isDefaultProductParams) {
          // 商品分类索引变化时，会触发商品数据请求
          // 而如果回调函数接收到的索引和当前索引值相同时，且商品接口使用的是默认参数
          // 则说明是如下情况：用户选中的一级分类和二级分类索引值都为0，恰好和默认索引值相等
          // 此时单纯更新索引值不会触发商品数据请求
          // 因此需要请求商品数据，并确保携带相关分类参数
          this.paramsChangeCount = 2;
          this.getProductsList(true);
        } else {
          this.levelFirstCateIndex = firstIndex;
          this.levelSecondCateIndex = secondIndex;
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
.large-product-mer-layout {
  height: 100vh;
}

.search-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1;
  --top-search-padding-inline: 20rpx;
}

.product-list {
  padding: 24rpx 20rpx 0;
}
</style>
