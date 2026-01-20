import { getStoreDetail } from "@/api/store";
import Vue from "vue";

export default {
  state() {
    return {
      storeInfoMap: {}
    }
  },
  mutations: {
    SET_STORE_INFO(state, { id, data }) {
      Vue.set(state.storeInfoMap, id, data);
    },
    UPDATE_STORE_FOLLOW(state, { id, is_follow }) {
      const storeInfo = state.storeInfoMap[id];
      if (storeInfo) {
        storeInfo.care = is_follow;
      } else {
        console.warn(`ຂໍ້ມູນຮ້ານຄ້າບໍ່ມີຢູ່: ${id}`);
      }
    }
  },
  actions: {
    async getStoreInfo({ commit, state }, { merId: id, forceFresh = false }) {
      const cacheData = state.storeInfoMap[id];
      if (cacheData && !forceFresh) return cacheData;

      try {
        const res = await getStoreDetail(id);
        if (res.status === 200 && res.data && res.data.mer_id) {
          commit("SET_STORE_INFO", { id: res.data.mer_id, data: res.data });
          return res.data;
        } else {
          throw new Error("ການດຶງຂໍ້ມູນຮ້ານຄ້າລົ້ມເຫລວ");
        }
      } catch (error) {
        throw error;
      }
    }
  }
}