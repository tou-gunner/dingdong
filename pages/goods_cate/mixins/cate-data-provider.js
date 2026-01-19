import { configMap } from "@/utils";
import {
  getCategoryList,
  getProductslist,
} from '@/api/store.js';
import { HTTP_REQUEST_URL } from '@/config/app.js';
import updateCart from '@/components/goodsCate/mixins/update-cart.js';

export default {
  mixins: [updateCart],
  data() {
    return {
      domain: HTTP_REQUEST_URL, // 域名
      categoryList: [], // 一级分类
      hotCategoryList: [],  // 热门分类
      levelFirstCateIndex: 0, // 一级分类当前索引
      levelSecondCateIndex: 0, // 二级分类当前索引
      levelThirdCateIndex: 0, // 三级分类当前索引

      page: 1, // 页码
      limit: 10, // 每页条数  
      loaded: false, // 是否加载完成
      loading: false, // 是否加载中
      productList: [], // 商品列表
    };
  },
  computed: {
    ...configMap({
      login_logo: ""
    }),
    allCategoryList() {
      return [
        {
          cate_name: "全部分类",
          pic: this.login_logo,
          store_category_id: 0
        },
        ...this.categoryList,
      ];
    },
    activeSecondCategoryList() {
      let categoryList = [
        {
          cate_name: "推荐",
          store_category_id: 0,
          children: this.hotCategoryList
        }
      ]; // 默认推荐分类

      if (this.levelFirstCateIndex === 0) {
        // 展示全部二级分类
        categoryList = this.categoryList.reduce((acc, item) => {
          acc.push(...item.children);
          return acc;
        }, categoryList);
      } else {
        // 展示当前选中的一级分类下的二级分类
        categoryList = categoryList.concat(this.allCategoryList[this.levelFirstCateIndex].children);
      }

      return categoryList;
    },
    activeThirdCategoryList() {
      const categoryList = [
        {
          cate_name: "全部商品",
          store_category_id: 0
        }
      ];
      const secondCate = this.activeSecondCategoryList[this.levelSecondCateIndex];
      return categoryList.concat(secondCate ? secondCate.children : []);
    },
    catePidParams() {
      const secondCate = this.activeSecondCategoryList[this.levelSecondCateIndex];
      const thirdCate = this.activeThirdCategoryList[this.levelThirdCateIndex];
      return {
        pid: secondCate ? secondCate.store_category_id || "" : "",
        cate_pid: thirdCate ? thirdCate.store_category_id || "" : ""
      };
    }
  },
  watch: {
    catePidParams() {
      this.getProductsList(true);
    }
  },
  created() {
    this.getCategoryList();
  },
  methods: {
    handleLoadMoreProduct() {
      if (this.loaded && !this.ignoreProduct) {
        const length = this.activeSecondCategoryList.length;
        const index = this.levelSecondCateIndex;
        if (index < length - 1) {
          this.handleToggleSecondCategory(index + 1);
        }
        return;
      }
      
      if (this.loading || this.loaded) return;
      this.page = this.page + 1;
      this.getProductsList();
    },
    async getProductsList(newParams = false) {
      if (this.ignoreProduct) return;
      if (newParams) {
        this.page = 1;
        this.loaded = false;
      } else {
        if (this.loading || this.loaded) return;
      }

      this.loading = true;

      try {
        const res = await getProductslist({
          page: this.page,
          limit: this.limit,
          ...this.catePidParams
        });

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
        const res = await getCategoryList();
        this.categoryList = res.data.list;
        this.hotCategoryList = res.data.hot;
      } catch (error) {
        this.$util.Tips({
          title: error.message || error
        });
      }
    },
    handleToggleSecondCategory(index) {
      this.levelSecondCateIndex = index;
      this.handleToggleThirdCategory(0);
    },
    handleToggleThirdCategory(index) {
      this.levelThirdCateIndex = index;
    },
    handleToggleFirstCategory(index) {
      this.levelFirstCateIndex = index;
      this.handleToggleSecondCategory(0);
    }
  }
}