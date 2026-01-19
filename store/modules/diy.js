import { getDiy } from "@/api/api";
import Vue from "vue";

const taskMap = {};

// 缓存请求任务
const getTask = key => {
  const keyString = JSON.stringify(key);
  if (!taskMap[keyString]) {
    taskMap[keyString] = getDiy(key);
  }

  return taskMap[keyString];
}

export default {
  state() {
    return {
      diyDataMap: {},
      merDiyDataMap: {}
    };
  },
  mutations: {
    SET_DIY_DATA(state, { diyId, data }) {
      Vue.set(state.diyDataMap, diyId, data);
    },
    SET_MER_DIY_DATA(state, { merId, data }) {
      Vue.set(state.merDiyDataMap, merId, data);
    }
  },
  actions: {
    async fetchDiyFromApi({ commit }, { diyId = 0, merId = 0 } = {}) {
      const set = data => {
        commit("SET_DIY_DATA", { diyId: data.id, data });

        if (merId) {
          // 如果传入了商户id，则以商户的 id 为 key，缓存 diy 数据
          commit("SET_MER_DIY_DATA", { merId, data });
        } else if (diyId === 0) {
          // 首页的 diy id 一般为 0，所以需要缓存一份首页的 diy 数据
          commit("SET_DIY_DATA", { diyId: 0, data });
        }
      };

      const params = {
        version: 221
      };

      if (diyId !== 0) {
        params.did = diyId;
      }
      if (merId !== 0) {
        params.id = merId;
      }

      try {
        const res = await getTask(params);
        if (res.status === 200 && res.data && res.data.id) {

          // 过滤隐藏状态的组件
          const nextData = {
            ...res.data,
            value: Object.keys(res.data.value)
              .reduce((result, key) => {
                const configItem = res.data.value[key];
                if (configItem.isHide !== true) {
                  result[key] = configItem;
                }
                return result
              }, {})
          };

          set(nextData);
          return nextData;
        } else {
          throw new Error("获取 diy 数据失败");
        }
      } catch (error) {
        throw error;
      }
    },
    async fetchDiyByDiyId({ state, dispatch }, { diyId = 0 } = {}) {
      if (state.diyDataMap[diyId]) return state.diyDataMap[diyId];
      return dispatch("fetchDiyFromApi", { diyId });
    },
    async fetchDiyData({ state, dispatch }, { diyId = 0, merId = 0 } = {}) {
      /**
       * case1: 来自首页              diyId=0, merId=0 ，无需携带参数
       * case2: 来自商户首页          diyId=0, merId=1   需携带 merId，diyId 可选
       * case3: 来自首页预览          diyId=1, merId=0   需携带 diyId
       * case4: 来自商户预览          diyId=1, merId=1    需携带 merId 和 diyId
       */
      if (merId && diyId) {
        // case4
        if (state.diyDataMap[diyId]) return state.diyDataMap[diyId];
        return dispatch("fetchDiyFromApi", { diyId, merId });
      } else if (merId && !diyId) {
        // case2
        if (state.merDiyDataMap[merId]) return state.merDiyDataMap[merId];
        return dispatch("fetchDiyFromApi", { merId });
      } else {
        // case1 || case3 || others
        if (state.diyDataMap[diyId]) return state.diyDataMap[diyId];
        return dispatch("fetchDiyFromApi", { diyId });
      }
    }
  }
}