<template>
  <view :style="[commonStyleVars]" class="store-info-wrapper relative" v-if="storeInfo.mer_id">
    <view class="store-info">
      <image :src="storeInfo.mer_avatar" class="store-logo" mode="aspectFit" />
      <view class="store-ctx">
        <view class="store-name">
          <view class="store-type" v-if="storeInfo.type_name">
            {{ storeInfo.type_name }}
          </view>
          <view class="store-type" v-else-if="storeInfo.is_trader">
            ທາງການ
          </view>
          {{ storeInfo.mer_name }}
        </view>
        <view class="score">
          <view class="star" :style="{ background: `url(${domain}/static/diy/star.png) left top/100% 100% no-repeat` }">
            <view class="star-item"
              :style="{ width: `${score.star.toFixed(2)}%`, background: `url(${domain}/static/diy/score1${keyColor}.png) left top/111rpx 19rpx no-repeat` }">
            </view>
          </view>
          <view>{{ score.number.toFixed(1) }}</view>
        </view>
      </view>
      <i class="iconfont icon-ic_customerservice customer-btn" @click="goCustomer"></i>
      <button class="store-follow-btn" @click="handleToggleFollow(storeInfo)">
        <i class="iconfont icon-ic_love" v-if="!storeInfo.care"></i>
        {{ storeInfo.care ? 'ຕິດຕາມແລ້ວ' : 'ຕິດຕາມ' }}
      </button>
    </view>
  </view>
</template>

<script>
import { diyUtil } from '@/utils/diy';
import { HTTP_REQUEST_URL } from '@/config/app';
import { mapGetters, mapState } from 'vuex';
import { toLogin } from '@/libs/login';
import { getCustomer } from "@/utils";
import storeFollowMixin from '@/mixins/store-follow';

export default {
  name: "StoreInfo",
  mixins: [storeFollowMixin],
  props: {
    dataConfig: Object,
    index: {
      type: Number,
      default: 0
    }
  },
  inject: ["parentMerId"],
  computed: {
    ...mapGetters(['isLogin', 'uid', 'viewColor', 'keyColor']),
    ...mapState({
      storeInfo(state) {
        return state.store.storeInfoMap[this.parentMerId] || {};
      }
    }),
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
        storeName,
        followBtn,
        compOffsetY,
        compBg,
        bottomBg,
        mtConfig,
        mbConfig,
        mlConfig,
        pageTopConfig,
        fillet,
        shadowConfig
      } = this.dataConfig;

      return {
        "--store-name-color": storeName.color[0].item,
        "--follow-btn-color": diyUtil.buildLinearColor(followBtn),
        "--comp-bg": diyUtil.buildLinearColor(compBg),
        "--bottom-bg": bottomBg.color[0].item,
        "--mt": `${mtConfig.val}px`,
        "--mb": `${mbConfig.val}px`,
        "--ml": `${mlConfig.val}px`,
        "margin-top": diyUtil.buildMarginTopOffset(pageTopConfig, compOffsetY),
        "--fillet": diyUtil.buildBorderRadius(fillet),
        "--shadow": diyUtil.buildShadowStyle(shadowConfig)
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
    },
    goCustomer() {
      if (!this.isLogin) return toLogin();
      let mer = this.storeInfo.services_type
      let data = {
        type: mer.services_type,
        service_phone: mer.service_phone,
        customer_url: mer.mer_customer_url,
        customer_corpId: mer.mer_customer_corpId,
        customer_link: mer.mer_customer_link
      }
      let url = `/pages/chat/customer_list/chat?mer_id=${this.storeInfo.mer_id}&uid=${this.uid}`
      getCustomer(data, url)
    },
  }
}
</script>

<style scoped lang="scss">
.store-info-wrapper {
  background-color: var(--bottom-bg);
  padding-top: var(--mt);
  padding-bottom: var(--mb);
  padding-inline: var(--ml);

  .store-info {
    display: flex;
    align-items: center;
    padding: 30rpx 20rpx;

    border-radius: var(--fillet);
    box-shadow: var(--shadow);
    background: var(--comp-bg);

    .store-logo {
      width: 74rpx;
      height: 74rpx;
      margin-right: 22rpx;
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

    .customer-btn {
      margin-left: auto;
      font-size: 34rpx;
      color: #282828;
      margin-right: 28rpx;
    }

    .store-follow-btn {
      width: 114rpx;
      height: 48rpx;
      background: var(--follow-btn-color);
      border-radius: 24rpx;
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
  margin-top: 17rpx;
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
