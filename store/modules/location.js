import { getGeocoder } from "@/api/store";

export default {
  state() {
    return {
      location: null,
      address: ""
    }
  },
  mutations: {
    SET_LOCATION(state, location) {
      state.location = location;
    },
    SET_ADDRESS(state, address) {
      state.address = address;
    }
  },
  actions: {
    async initLocation({ dispatch }) {
      await dispatch('updateLocation', { force: true });
      await dispatch('updateAddress');
    },
    async updateLocation({ commit }, { force = false }) {
      if (this.location && !force) return;
      const [error, result] = await uni.getLocation({
        type: "wgs84"
      });
      if (error) throw new Error(error.errMsg);
      const { latitude, longitude } = result;
      commit('SET_LOCATION', {
        latitude,
        longitude
      });
    },
    async updateAddress({ commit, state }) {
      const { latitude, longitude } = state.location;
      const geoCoderRes = await getGeocoder({
        lat: latitude,
        long: longitude
      });
      commit('SET_ADDRESS', geoCoderRes.data.formatted_addresses.recommend);
    }
  }
}