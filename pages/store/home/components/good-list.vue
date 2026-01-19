<template>
  <view style="height: 100%;">
    <scroll-view class="main" scroll-y @scroll="handleScroll" :style="viewColor" @scrolltolower="onScrolltolower">
      <!-- 店铺信息 -->
      <store-info :store="store"></store-info>

      <slot></slot>
      <view class="tab-cont" :style="viewColor" :class="{ noPointer: preview }">
        <!-- 首页 -->
        <view>
          <!-- 商品 -->
          <view v-if="goods.length" class="goods-wrap" id="goods">
            <view v-if="isColumn" class="goods column">
              <view v-for="item in goods" :key="item.product_id" class="item" @click="goGoodsDetail(item)">
                <view class="image">
                  <image :src="item.image"></image>
                  <view v-if="item.stock == 0" class="sell_out">已售罄</view>
                  <view v-if="item.border_pic" :style="{ backgroundImage: `url(${item.border_pic})` }"
                    class="border-picture"></view>
                </view>
                <view class="text on acea-row row-column-between">
                  <view class="name line2">
                    <text class="name_text line2">{{ item.store_name }}</text>
                  </view>
                  <view class="item_bot">
                    <view class="money-wrap acea-row">
                      <view class="money">
                        <priceFormat :price="item.price" weight intSize="40" floatSize="26" labelSize="26">
                        </priceFormat>
                      </view>
                      <view v-if="item.show_svip_info && item.show_svip_info.show_svip_price && item.svip_price"
                        class="acea-row row-middle">
                        <text class='vip-money'>¥{{ item.svip_price }}</text>
                        <view class="vipImg">
                          <image class="image" :src="`${domain}/static/images/svip.png`"></image>
                        </view>
                      </view>
                    </view>
                    <view v-if="item.product_type != 0 || item.issetCoupon || item.delivery_free == 1"
                      class="item_tags">
                      <text v-if="item.product_type != 0" :class="'font_bg-red type' + item.product_type">{{
                        item.product_type == 1 ? "秒杀" :
                          item.product_type == 2 ? "预售" : item.product_type == 3 ? "助力" : item.product_type == 4 ?
                            "拼团"
                            : "" }}</text>
                      <text class="tags_item ticket" v-if="item.issetCoupon">领券</text>
                      <text class="tags_item delivery" v-if="item.delivery_free == 1">包邮</text>
                      <view class="tags_item reservation" v-if="item.reservation_type && item.type == 4">
                        {{ reservateLabel(item.reservation_type) }}</view>
                    </view>
                    <view class="score">{{ item.rate }}评分 {{ item.reply_count }}条评论</view>
                  </view>
                </view>
                <view class="add-cart acea-row row-middle row-center" @click.stop='selecAttr(item)'>
                  <text class="iconfont icon-ic_ShoppingCart1"></text>
                </view>
              </view>
              <view class="tabbar-placeholder"></view>
            </view>
            <view v-else class="goods">
              <WaterfallsFlow :wfList='goods' :addCart="true" @itemTap="goGoodsDetail" @addCat="selecAttr" :type="1"
                :isStore="1" />
            </view>
          </view>
          <view v-if="goodsLoading" class="acea-row row-center-wrapper loadingicon">
            <text :hidden="!goodsLoading" class="iconfont icon-jiazai loading"></text>
            {{ loadTitle }}
          </view>
          <emptyPage v-if="goods.length == 0 && !goodsLoading" title="暂无商品~"></emptyPage>
        </view>
      </view>
    </scroll-view>

    <!-- 组件 -->
    <productWindow :attr="attr" :isShow='true' :iSplus='1' :destri="0" isTab isList isCustom @myevent="onMyEvent"
      @ChangeAttr="ChangeAttr" @ChangeCartNum="ChangeCartNum" @attrVal="attrVal" @goCat="goCat" @iptCartNum="iptCartNum"
      id='product-window' :payLimit="pay_limit" :maxCount="max_count" :minCount="min_count" :svipPrice="svipPrice"
      :image="storeInfo.image"></productWindow>
  </view>
</template>

<script>
import { mapGetters } from 'vuex';
import { HTTP_REQUEST_URL } from '@/config/app';
import { toLogin } from '@/libs/login';
import { goShopDetail } from '@/libs/order.js';
import cartMixin from '@/mixins/cart.js';
import productWindow from '@/components/productWindow';
import emptyPage from '@/components/emptyPage.vue'
import storeInfo from "./store-info.vue";

export default {
  name: "good-list",
  mixins: [cartMixin],
  components: {
    productWindow,
    emptyPage,
    storeInfo
  },
  props: {
    store: Object,
    preview: {
      type: Boolean,
      default: false
    },
    goods: Array,
    isColumn: Boolean,
    goodsLoading: Boolean,
    loadTitle: String,
  },
  data() {
    return {
      domain: HTTP_REQUEST_URL,
    }
  },
  computed: {
    ...mapGetters(['isLogin', 'uid', 'viewColor', 'keyColor']),
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
    reservateLabel(item) {
      return item.reservation_type == 1 ? '到店' : item.reservation_type == 2 ? '上门' : '上门+到店'
    },
    handleScroll(e) {
      this.$emit('scroll', e);
    },
    // 去商品详情页
    goGoodsDetail(item) {
      goShopDetail(item, this.uid).then(res => {
        if (this.isLogin) {
          initiateAssistApi(item.activity_id).then(res => {
            let id = res.data.product_assist_set_id;
            uni.hideLoading();
            uni.navigateTo({
              url: '/pages/activity/assist_detail/index?id=' + id
            });
          }).catch((err) => {
            uni.showToast({
              title: err,
              icon: 'none'
            })
          });
        } else {
          toLogin()
        }
      })
    },
    onScrolltolower(e) {
      this.$emit('scrolltolower', e);
    }
  }
}
</script>

<style scoped lang="scss">
@import "./common.scss";

.tab-cont {
  min-height: 500rpx;
}

.goods {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 0 20rpx;
  background-color: #f5f5f5;
  width: 750rpx;

  .item {
    width: 345rpx;
    border-radius: 16rpx;
    background-color: #ffffff;
    overflow: hidden;

    .sell_out {
      display: flex;
      width: 110rpx;
      height: 110rpx;
      align-items: center;
      justify-content: center;
      border-radius: 100%;
      background: rgba(0, 0, 0, 0.6);
      color: #fff;
      font-size: 24rpx;
      position: absolute;
      top: 50%;
      left: 50%;
      margin: -55rpx 0 0 -55rpx;

      &::before {
        content: "";
        display: block;
        width: 100rpx;
        height: 100rpx;
        border-radius: 100%;
        border: 1px dashed #fff;
        position: absolute;
        top: 5rpx;
        left: 5rpx;
      }
    }

    .image {
      width: 345rpx;
      height: 345rpx;

      image {
        display: block;
        width: 100%;
        height: 100%;
      }
    }

    .text {
      padding: 20rpx 20rpx 25rpx;

      .name {
        font-weight: 500;
        font-size: 30rpx;
        line-height: 1;
        display: flex;
        align-items: center;

        .name_text {
          // display: inline-block;
          max-width: 440rpx;
        }
      }

      .money-wrap {
        display: flex;
        align-items: baseline;
        margin-top: 43rpx;

        .money {
          font-weight: bold;
          font-size: 26rpx;
          color: var(--view-priceColor);

          text {
            font-size: 34rpx;
            line-height: 1;
          }
        }
      }

      .score {
        margin-top: 14rpx;
        font-weight: 500;
        font-size: 22rpx;
        line-height: 1;
        color: #666666;
      }
    }

    .item_tags {
      margin-top: 8rpx;
    }

    .item_tags .tags_item {
      display: inline-block;
      font-size: 20rpx;
      text-align: center;
      border-radius: 5rpx;
      padding: 0 4rpx;
      line-height: 28rpx;
      margin-right: 8rpx;
    }

    .item_tags .tags_item.ticket {
      border: 1px solid var(--view-theme);
      color: var(--view-theme);
    }

    .item_tags .tags_item.delivery {
      color: #ff9000;
      border: 1px solid #ff9000;
    }

    .foot {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 52rpx;
      background-image: linear-gradient(-90deg, var(--view-bntColor21) 0%, var(--view-bntColor22) 100%);
      font-weight: 500;
      font-size: 24rpx;
      color: #ffffff;

      .iconfont {
        margin-right: 10rpx;
        font-size: 22rpx;
        line-height: 1;
      }
    }
  }
}

.column {
  padding: 0 0 20rpx;
  background-color: #ffffff;

  .item {
    position: relative;
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding: 0 20rpx;
    border-radius: 0;
    margin-top: 30rpx;

    .image {
      width: 270rpx;
      height: 270rpx;
      border-radius: 24rpx;
      overflow: hidden;
      position: relative;
    }

    .border-picture {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: center/cover no-repeat;
      border-radius: 24rpx;
    }

    .text {
      position: relative;
      width: 420rpx;
      height: 270rpx;
      padding: 10rpx 0 0;

      .name {
        color: #282828;
        width: 100%;
        display: flex;
      }

      .item_bot {
        width: 100%;
      }

      .money-wrap {
        display: flex;
        align-items: baseline;
        margin-top: 52rpx;

        .ticket {
          height: 28rpx;
          padding-right: 12rpx;
          padding-left: 12rpx;
          border: none;
          border-radius: 0;
          margin-top: 17rpx;
          margin-left: 0;
          line-height: 28rpx;
        }
      }
    }

    .foot {
      position: absolute;
      right: 20rpx;
      bottom: 30rpx;
      height: 44rpx;
      padding-right: 17rpx;
      padding-left: 17rpx;
      border-radius: 22rpx;
      font-size: 22rpx;
      color: #f5f5f5;
    }
  }
}

.vip-money {
  color: #282828;
  font-size: 22rpx;
  margin-left: 6rpx;
  font-weight: bold;
}


.vipImg {
  width: 65rpx;
  height: 28rpx;
  margin-left: 4rpx;

  image {
    width: 100% !important;
    height: 100% !important;
    display: block;
  }
}
</style>