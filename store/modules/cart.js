import { getCartList } from '@/api/order.js';

export default {
  state() {
    return {
      cartList: {
        list: [],
      }
    };
  },
  mutations: {
    SET_CART_LIST(state, list) {
      state.cartList = list;
    }
  },
  actions: {
    async updateCartList({ commit }) {
      try {
        const res = await getCartList();
        commit('SET_CART_LIST', res.data);
        return res.data;
      } catch (error) {
        console.error(error);
      }
    }
  }
}