import { followStore, unfollowStore } from '@/api/store.js';
import { toLogin } from '@/libs/login';

/**
 * 该 mixin 用于处理店铺关注逻辑，可直接在页面中通过 handleToggleFollow(storeInfo) 来调用
 * 调用完成后，会自动更新缓存中的店铺信息
 * 使用之前请确保已通过 mapGetters 获取到 isLogin 状态
 */

export default {
  methods: {
    async handleToggleFollow(storeInfo) {
      if (!this.isLogin) return toLogin();
      try {
        const res = await(storeInfo.care ? unfollowStore(storeInfo.mer_id) : followStore(storeInfo.mer_id));
        if (res.status === 200) {
          this.$store.commit("UPDATE_STORE_FOLLOW", {
            id: storeInfo.mer_id,
            is_follow: !storeInfo.care
          });
          this.$store.dispatch("getStoreInfo", {
            merId: storeInfo.mer_id,
            forceFresh: true
          });
          this.$util.Tips({
            title: storeInfo.care ? '已关注' : '已取消关注'
          });
        } else {
          throw new Error(res.message);
        }
      } catch (error) {
        this.$util.Tips({
          title: error.message
        });
      }
    },
  }
}