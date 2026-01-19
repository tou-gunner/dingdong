import { configMap } from "@/utils";
import {
  merchantProduct,
  getStoreCategory,
} from '@/api/store.js';
import { HTTP_REQUEST_URL } from '@/config/app.js';
import updateCart from '@/components/goodsCate/mixins/update-cart.js';

export default {
  mixins: [updateCart],
  props: {
    merId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      domain: HTTP_REQUEST_URL,

      categoryList: [], // 一级分类
      levelFirstCateIndex: 0, // 一级分类当前索引
      levelSecondCateIndex: 0, // 二级分类当前索引

      /**
       * 商品分页请求相关配置
       */
      page: 1,
      limit: 10,
      loaded: false,
      loading: false,
      productList: [],
      //


      paramsChangeCount: 0, // 商品分类数据的变化次数
    };
  },
  computed: {
    ...configMap({
      login_logo: ""
    }),
    isDefaultProductParams() {
      // 是否商品请求时使用默认参数，即不携带商品分类相关参数
      return this.paramsChangeCount <= 1;
    },
    activeSecondCategoryList() {
      // 当前要展示的所有二级分类
      const activeLevelFirstCate = this.categoryList[this.levelFirstCateIndex];
      if (!activeLevelFirstCate || !activeLevelFirstCate.children) return [];
      return activeLevelFirstCate.children;
    },
    catePidParams() {
      let mer_cate_id = "";
      const activeLevelSecondCate = this.activeSecondCategoryList[this.levelSecondCateIndex];
      const activeLevelFirstCate = this.categoryList[this.levelFirstCateIndex];
      if (activeLevelSecondCate) {
        mer_cate_id = activeLevelSecondCate.store_category_id;
      } else if (activeLevelFirstCate) {
        mer_cate_id = activeLevelFirstCate.store_category_id;
      }
      return {
        mer_cate_id
      };
    }
  },
  watch: {
    catePidParams() {
      // 如果 mixins 的组件需要忽略商品数据，则不发起商品数据请求
      if (this.ignoreProduct) return;

      if (this.isRequireAllProduct) {
        // 商品分类数据的变化会触发该 watch 回调
        // 如果默认需要所有商品数据，则商品分类数据的初始化引起的第一次 watch 回调需要被忽略
        // 以免覆盖在 created 中请求的所有商品数据
        // 记录商品分类数据的变化次数
        // 默认第一次为 1
        // 否则进行递增
        this.paramsChangeCount++;
        if (this.paramsChangeCount <= 1) {
          // 如果是第一次回调，则拒绝进行商品数据的请求
          return;
        }
      }
      this.getProductsList(true);
    }
  },
  created() {
    this.getCategoryList();
    if (this.isRequireAllProduct) {
      // 如果默认需要所有商品数据，则在初始化时需要发起商品数据请求
      // 该配置项在引入 mixins 时的组件中进行配置
      this.getProductsList(true);
    }
  },
  methods: {
    handleLoadMoreProduct() {
      if (this.loaded && !this.ignoreProduct) {
        if (this.handleToggleNextCategory) {
          this.handleToggleNextCategory();
        }
        return;
      }

      
      if (this.loading || this.loaded) return;
      this.page = this.page + 1;
      this.getProductsList();
    },
    async getProductsList(newParams = false) {
      if (newParams) {
        this.page = 1;
        this.loaded = false;
      } else {
        if (this.loading || this.loaded) return;
      }

      this.loading = true;

      const params = {
        page: this.page,
        limit: this.limit,
      };

      if (!this.isRequireAllProduct) {
        // 没有特殊配置项的情况下，需要携带相关商品分类参数
        Object.assign(params, this.catePidParams);
      } else if (this.isRequireAllProduct) {
        // 在默认需要商品数据的前提下，如果商品分类数据无变化，则不携带任何商品分类相关参数
        // 避免未切换商品分类时，分页请求时却携带了商品分类相关参数
        if (!this.isDefaultProductParams) {
          Object.assign(params, this.catePidParams);
        }
      }

      try {
        const res = await merchantProduct(this.merId, params);

        this.loaded = res.data.list.length < this.limit;
        if (newParams) {
          this.productList = res.data.list;
        } else {
          this.productList = this.productList.concat(res.data.list);
        }
      } catch (error) {
        this.$util.Tips({
          title: error.message || error
        });
      } finally {
        this.loading = false;
      }
    },
    async getCategoryList() {
      try {
        const res = await getStoreCategory(this.merId);
        this.categoryList = res.data;
      } catch (error) {
        this.$util.Tips({
          title: error.message || error
        });
      }
    },
    handleToggleSecondCategory(index) {
      this.levelSecondCateIndex = index;
    },
    handleToggleFirstCategory(index) {
      this.levelFirstCateIndex = index;
      this.handleToggleSecondCategory(0);
    }
  }
}