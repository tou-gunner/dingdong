import { mapGetters, mapState } from 'vuex';

export default {
  computed: {
    ...mapGetters(['isLogin', 'cartNum']),
    ...mapState({
      cartList: state => state.cart.cartList
    }),

    updateProductCartParams() {
      return {
        cartList: this.cartList,
        productList: this.productList
      }
    }
  },
  watch: {
    cartNum() {
      if (!this.isLogin) return;
      this.$store.dispatch('updateCartList');
    },
    updateProductCartParams() {
      if (!this.isLogin) return;
      this.updateProductCartInfo();
    }
  },
  methods: {
    updateProductCartInfo() {
      if (!this.isLogin || !this.productList.length) return;
      const cartProductList = this.cartList.list.map(item => item.list).flat();
      const cartInfoMap = Object.fromEntries(cartProductList.map(item => [item.product_id, item])); // product_id -> productCartInfo 映射
      this.productList.forEach(item => {
        if (item.cart && !cartInfoMap[item.product_id]) {
          // 商品列表有购物车属性，但购物车中没有该商品
          // 删除商品列表的购物车属性
          item.cart = [];
        } else if (cartInfoMap[item.product_id]) {
          // 商品列表没有购物车属性，但购物车中有该商品
          // 添加商品列表的购物车属性
          item.cart = JSON.parse(JSON.stringify(cartInfoMap[item.product_id]));
        }
      });
    },
  }
}