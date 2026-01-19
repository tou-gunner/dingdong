<template>
  <view id="store" class="store" :class="{ noPointer: preview }">
    <image :src="store.mer_avatar"></image>
    <view class="text">
      <navigator :url="`/pages/store/detail/index?id=${store.mer_id}`" hover-class="none">
        <text v-if="store.type_name" class="font-bg-red">{{ store.type_name }}</text>
        <text v-else-if="store.is_trader" class="font-bg-red">自营</text>
        <text class="name">{{ store.mer_name }}</text>
        <image v-if="margin_ico_switch == 1 && margin_ico && store.is_margin == 10" :src="margin_ico"
          class="store-margin"></image>
        <text class="iconfont icon-ic_rightarrow"></text>
      </navigator>
      <view class="score">
        <view class="star" :style="{ background: `url(${domain}/static/diy/star.png) left top/100% 100% no-repeat` }">
          <view
            :style="{ width: `${score.star.toFixed(2)}%`, background: `url(${domain}/static/diy/score1${keyColor}.png) left top/111rpx 19rpx no-repeat` }">
          </view>
        </view>
        <view>{{ score.number.toFixed(1) }}</view>
      </view>
    </view>
    <view class="kefu" @click="goCustomer">
      <text class="iconfont icon-ic_customerservice"></text>
    </view>
    <button hover-class="none" :class="store.care ? 'care' : ''" v-if="!isLogin" @click="authOpen">
      <text v-show="!store.care" class="iconfont icon-ic_love"></text>
      {{ store.care ? '已关注' : '关注' }}
    </button>
    <button v-else hover-class="none" :class="store.care ? 'care' : ''" @click="handleToggleFollow(store)">
      <text v-show="!store.care" class="iconfont icon-ic_love"></text>
      {{ store.care ? '已关注' : '关注' }}
    </button>
  </view>
</template>

<script>
import { configMap, getCustomer } from "@/utils";
import { toLogin } from '@/libs/login';
import { mapGetters } from 'vuex';
import { HTTP_REQUEST_URL } from '@/config/app';
import storeFollowMixin from '@/mixins/store-follow';

export default {
  mixins: [storeFollowMixin],
  props: {
    store: Object,
    preview: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      domain: HTTP_REQUEST_URL,
    }
  },
  computed: {
    ...configMap({
      margin_ico_switch: 0,
      margin_ico: '',
    }, mapGetters(['isLogin', 'uid', 'viewColor', 'keyColor'])),
    score() {
      let store = this.store,
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
  },
  methods: {
    // 打开授权
    authOpen() {
      toLogin()
    },
    goCustomer() {
      let that = this;
      if (that.isLogin === false) {
        toLogin()
      } else {
        let mer = that.store.services_type
        let data = {
          type: mer.services_type,
          service_phone: mer.service_phone,
          customer_url: mer.mer_customer_url,
          customer_corpId: mer.mer_customer_corpId,
          customer_link: mer.mer_customer_link
        }
        let url = `/pages/chat/customer_list/chat?mer_id=${that.store.mer_id}&uid=${that.uid}`
        getCustomer(data, url)
      }
    },
  }
}
</script>

<style scoped lang="scss"></style>


<style scoped lang="scss">
.care {
  background-image: none !important;
  border: 1px solid #fff;
  background-color: transparent;
}

.store {
  position: relative;
  z-index: 6;
  display: flex;
  align-items: center;
  padding-right: 20rpx;
  padding-left: 20rpx;
  padding-top: 20rpx;
  padding-bottom: 22rpx;

  image {
    width: 74rpx;
    height: 74rpx;
    border-radius: 6rpx;
  }

  .store-margin {
    width: 26rpx;
    height: 26rpx;
    margin-left: 10rpx;
  }

  .kefu {
    color: #ffffff;
    margin-right: 26rpx;
    cursor: pointer;

    .icon-ic_customerservice {
      font-size: 34rpx;
    }
  }

  .text {
    flex: 1;
    min-width: 0;
    margin-right: 20rpx;
    margin-left: 20rpx;

    navigator {
      display: inline-flex;
      align-items: center;
      max-width: 100%;

      .name {
        flex: 1;
        min-width: 0;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-weight: bold;
        font-size: 30rpx;
        line-height: 1;
        color: #ffffff;
      }

      .iconfont {
        margin-left: 10rpx;
        font-size: 24rpx;
        color: #ffffff;
      }
    }

    .score {
      display: flex;
      align-items: center;
      margin-top: 17rpx;
      font-weight: 500;
      font-size: 24rpx;
      line-height: 1;
      color: #ffffff;

      .star {
        position: relative;
        width: 111rpx;
        height: 19rpx;
        margin-right: 10rpx;
        overflow: hidden;

        view {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
      }
    }
  }

  button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 124rpx;
    height: 50rpx;
    border-radius: 26rpx;
    background-image: linear-gradient(-90deg, var(--view-bntColor21) 0%, var(--view-bntColor22) 100%);
    font-size: 22rpx;
    color: #ffffff;

    .iconfont {
      margin-right: 6rpx;
      font-size: 22rpx;
    }

    &.gary {
      background-color: #999;
    }
  }
}


.font-bg-red {
  background-color: var(--view-theme);
}
</style>
