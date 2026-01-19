<template>
  <view>
    <diyPage v-if="currentTabDiyId" :diyId="currentTabDiyId" :merId="parentMerId" :nestDiyIdList="diyIdList" />
    <view class="water-flow-wrapper" v-if="currentTabCateId && productList.length" :key="currentTabCateId">
      <WaterfallsFlow :wfList="productList" @itemTap="goDetail" />
    </view>
  </view>
</template>

<script>

import { getProductslist } from '@/api/store.js';
// #ifdef MP
import diyPage from "./index.vue";
// #endif

export default {
  name: 'tabNavContent',
  components: {
    // #ifdef WEB
    diyPage: () => import("./index.vue"), // WEB 环境下，使用 import 异步加载，解决循环依赖问题
    // #endif
    // #ifdef MP
    diyPage, // 小程序环境里使用常规引入方式即可
    // #endif

    // APP 端无需进行分包，在 main.js 入口文件中进行全局注册
  },
  props: {
    dataConfig: {
      type: Object,
      default: () => ({})
    },
    tabActiveIndex: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      productList: []
    };
  },
  inject: ["parentDiyId", "parentMerId", "parentDiyIdList"],
  watch: {
    currentTabCateId: {
      handler(nextVal, oldVal) {
        if (nextVal) {
          this.getProductList();
        }
      },
      immediate: true
    }
  },
  computed: {
    diyIdList() {
      return this.parentDiyIdList;
    },
    realTabActiveIndex() {
      // 因为 tabNav 组件配置项中添加了默认首页，所以需要从索引值中减去 1
      // 见 tabNav 组件 computed 中的 tabListConfig
      return this.tabActiveIndex - 1;
    },
    tabListConfig() {
      let tabList = this.dataConfig.tabListConfig.list;
      return tabList
    },
    currentTabDiyId() {
      const tab = this.tabListConfig[this.realTabActiveIndex];
      if (tab && tab.dataType.tabVal === 0 && tab.microPage.id) {
        const diyId = Number(tab.microPage.id);
        if (Number.isInteger(diyId)) {
          if (this.parentDiyIdList.includes(diyId)) {
            // 如果当前调用的微页面模板已被嵌套引用，则不展示该微页面，防止造成死循环
            console.warn(`当前组件引用的微页面 ID 和父页面 ID 存在循环引用 !`);
            return null;
          } else {
            return diyId;
          }
        }
      }
      return null;
    },
    currentTabCateId() {
      const tab = this.tabListConfig[this.realTabActiveIndex];
      if (tab && tab.dataType.tabVal === 1 && tab.classPage.id) {
        const id = tab.classPage.id;
        if (Array.isArray(id)) {
          return id.join(",");
        }
        return id;
      }
      return null;
    },
  },
  methods: {
    async getProductList() {
      try {
        const res = await getProductslist({
          cate_id: this.currentTabCateId,
          page: 1,
          limit: 10
        });

        this.productList = res.data.list;
      } catch (error) {
        console.log(error);
      }
    },

    goDetail(item) {
      uni.navigateTo({
        url: '/pages/goods_details/index?id=' + item.product_id
      });
    },
  }
}
</script>

<style scoped lang="scss">
.water-flow-wrapper {
  padding-top: 10px;
  padding-inline: 10px;
}
</style>
