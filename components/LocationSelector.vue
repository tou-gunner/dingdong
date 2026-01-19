<template>
  <button class="location-toggle" @click="handlePickerLocation" :class="{ scroll: isScroll }">
    <view class="iconfont icon-ic_location51" />
    <text class="address">{{ address || '定位中...' }}</text>
    <view class="iconfont icon-ic_downarrow" />
  </button>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: 'LocationSelector',
  props: {
    isScroll: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {};
  },
  computed: {
    ...mapState({
      address: state => state.location.address,
      location: state => state.location.location,
    }),
  },
  created() {
    this.$store.dispatch("initLocation");
  },
  methods: {
    async handlePickerLocation() {
      try {
        const [error, result] = await uni.chooseLocation();
        if (error) {
          if (error.errMsg.includes('auth deny')) {
            this.$util.Tips({
              title: '缺少定位权限'
            });
            return;
          } else if (error.errMsg.includes('cancel') || error.errMsg === "chooseLocation:fail") {
            // 取消选择
            return;
          }
          throw new Error(error.errMsg);
        }
        const { name, latitude, longitude } = result;
        this.$store.commit('SET_LOCATION', {
          latitude,
          longitude
        });
        this.$store.commit('SET_ADDRESS', name);
      } catch (err) {
        uni.showToast({
          title: `定位失败: ` + (err.message || err),
          icon: 'none',
        });
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.location-toggle {
  display: flex;
  align-items: center;
  background-color: transparent;
  color: var(--location-color, #888);
  font-size: 14px;
  line-height: 1;
  margin-right: 19rpx;

  &.scroll {
    color: #333;
  }

  .address {
    margin-left: 6rpx;
    max-width: 5em;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
