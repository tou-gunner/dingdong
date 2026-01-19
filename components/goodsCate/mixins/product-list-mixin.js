// 商品列表组件 script 部分，仅模板部分不同
import { goShopDetail } from '@/libs/order.js';
import { changeCartNum } from '@/api/order.js';
import Cache from '@/utils/cache';
import { CART_TIME, CART_ID } from '@/config/cache';
import { mapGetters } from 'vuex';

export default {
  props: {
    list: Array
  },
  computed: {
    ...mapGetters(['isLogin'])
  },
  methods: {
    goProductDetail(item) {
      goShopDetail(item).then(result => {
        if (result) {
          uni.navigateTo({
            url: `/pages/goods_details/index?id=${item.product_id}`
          });
        }
      });
    },
    handleScrollToLower() {
      this.$emit("loadMore");
    },
    addCart(item) {
      this.$emit("addCart", item);
    },
    handleDesCartNum(goods) {
      const cart_num = goods.cart.cart_num;
      if (cart_num === 1 || cart_num <= goods.product.once_min_count) return;
      let data = { cart_id: goods.cart.cart_id, cart_num: Number(goods.cart.cart_num) - 1 }
      this.changeCartNum(data)
      goods.cart.cart_num = Number(goods.cart.cart_num) - 1
    },
    handleAddCartNum(goods) {
      const cart_num = Number(goods.cart.cart_num) || 1;
      if (goods.product.once_max_count && cart_num > goods.product.once_max_count) {
        goods.cart.cart_num = goods.product.once_max_count;
      } else if (goods.hasOwnProperty('productAttr') && goods.cart_num > goods.productAttr.stock) {
        goods.cart.cart_num = goods.productAttr.stock;
      } else {
        goods.cart.cart_num = cart_num + 1;
      }
      let data = { cart_id: goods.cart.cart_id, cart_num: goods.cart.cart_num }
      this.changeCartNum(data)
    },
    getCartNum() {
      this.$util.getCartNum(this.isLogin, (count) => {
        this.$store.commit('UPDATE_CARTNUM', count);
      })
    },
    changeCartNum(data) {
      changeCartNum(data.cart_id, {
        cart_num: data.cart_num
      }).then((res) => {
        this.$util.Tips({
          title: res.message
        });
        let arr = (Cache.get(CART_ID) && JSON.parse(Cache.get(CART_ID))) || []
        arr.push(data.cart_id)
        Cache.set(CART_ID, Array.from([...new Set(arr)]))
        const timestamp = Date.now();
        Cache.set(CART_TIME, timestamp);
        // this.cartAllCheck('goodsCheck')
        this.getCartNum()
      })
        .catch(err => {
          return this.$util.Tips({
            title: err
          });
        });
    },
    setProCartNum(e, item) {
      if (!e.detail.value) {
        return this.$util.Tips({
          title: '请输入大于等于1的值'
        });
      }
      let data = { cart_id: item.cart.cart_id, cart_num: e.detail.value }
      this.changeCartNum(data)
    },

    inputClick(e, item) {
      const o = e.detail.value
      const inputRule = /[^\d]/g
      this.$nextTick(() => {
        item.cart.cart_num = o.replace(inputRule, '');
      })
    },
  }
}