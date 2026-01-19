<template>
  <view :style="[commonStyleVars]" class="store-info-wrapper" v-if="storeInfo.mer_id">
    <view class="store-info">
      <image :src="storeInfo.mer_avatar" class="store-logo" mode="aspectFit" />
      <view class="store-ctx">
        <navigator class="store-name" hover-class="none" :url="`/pages/store/detail/index?id=${storeInfo.mer_id}`">
          {{ storeInfo.mer_name }}
          <text class="iconfont icon-ic_rightarrow"></text>
        </navigator>
        <view class="score" v-if="isStoreTagVisible || isStoreScoreVisible">
          <template v-if="isStoreTagVisible">
            <view class="store-type" v-if="storeInfo.type_name">
              {{ storeInfo.type_name }}
            </view>
            <view class="store-type" v-else-if="storeInfo.is_trader">
              自营
            </view>
          </template>
          <view class="star" :style="{ background: `url(${domain}/static/diy/star.png) left top/100% 100% no-repeat` }" v-if="isStoreScoreVisible">
            <view class="star-item"
              :style="{ width: `${score.star.toFixed(2)}%`, background: `url(${domain}/static/diy/score1${keyColor}.png) left top/111rpx 19rpx no-repeat` }">
            </view>
          </view>
        </view>
      </view>
      <button class="store-follow-btn" @click="handleToggleFollow(storeInfo)" v-if="isStoreFollowBtnVisible">
        <i class="iconfont icon-ic_love" v-if="!storeInfo.care"></i>
        {{ storeInfo.care ? '已关注' : '关注' }}
      </button>
    </view>
  </view>
</template>

<script>
import { diyUtil } from '@/utils/diy';
import { HTTP_REQUEST_URL } from '@/config/app';
import { mapGetters, mapState } from 'vuex';
import storeFollowMixin from '@/mixins/store-follow';

export default {
  mixins: [storeFollowMixin],
  props: {
    dataConfig: Object
  },
  inject: ["parentMerId"],
  computed: {
    ...mapGetters(['isLogin', 'uid', 'viewColor', 'keyColor']),
    ...mapState({
      storeInfo(state) {
        return state.store.storeInfoMap[this.parentMerId] || {};
      }
    }),
    isStoreTagVisible() {
      const config = this.dataConfig.storeHeadVisible;
      return config && config.type.includes(0);
    },
    isStoreScoreVisible() {
      const config = this.dataConfig.storeHeadVisible;
      return config && config.type.includes(1);
    },
    isStoreFollowBtnVisible() {
      const config = this.dataConfig.storeHeadVisible;
      return config && config.type.includes(2);
    },
    score() {
      let store = this.storeInfo,
        score = {
          star: 0,
          number: 0
        };
      if ('postage_score' in store) {
        score.number = (parseFloat(store.postage_score) + parseFloat(store.product_score) + parseFloat(store.service_score)) /
          3;
        score.star = score.number / 5 * 100;
      }
      return score;
    },
    commonStyleVars() {
      const {
        storeNameColor,
        followBtnColor,
      } = this.dataConfig;

      return {
        "--store-name-color": storeNameColor.color[0].item,
        "--follow-btn-color": diyUtil.buildLinearColor(followBtnColor),
      };
    }
  },
  data() {
    return {
      domain: HTTP_REQUEST_URL,
    };
  },
  created() {
    this.refreshStoreInfo();
  },
  methods: {
    refreshStoreInfo(forceFresh = false) {
      this.$store.dispatch("getStoreInfo", {
        merId: this.parentMerId,
        forceFresh
      });
    }
  }
}
</script>

<style scoped lang="scss">
.store-info-wrapper {

  .store-info {
    display: flex;
    align-items: center;
    padding: 14rpx 24rpx 24rpx;

    .store-logo {
      width: 80rpx;
      height: 80rpx;
      margin-right: 12rpx;
      border-radius: 16rpx;
    }

    .store-ctx {
      display: flex;
      flex-flow: column;
    }

    .store-name {
      color: var(--store-name-color);
      font-size: 30rpx;
      display: flex;
      align-items: center;

      .iconfont {
        font-size: 24rpx;
        margin-left: 12rpx;
      }
    }

    .store-type {
      color: #fff;
      padding-inline: 4rpx;
      height: 28rpx;
      background: #e93323;
      border-radius: 2px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 18rpx;
      margin-right: 10rpx;
    }

    .store-follow-btn {
      margin-left: auto;
      width: 108rpx;
      height: 54rpx;
      background: var(--follow-btn-color);
      border: 1px solid #fff;
      border-radius: 26rpx;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 22rpx;
      color: #fff;

      .iconfont {
        font-size: 22rpx;
        margin-right: 4rpx;
      }
    }
  }
}

.score {
  display: flex;
  align-items: center;
  margin-top: 10rpx;
  font-weight: 500;
  font-size: 24rpx;
  line-height: 1;
  color: #FFFFFF;

  .star {
    position: relative;
    width: 111rpx;
    height: 19rpx;
    margin-right: 10rpx;
    overflow: hidden;

    .star-item {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }
}
</style>
