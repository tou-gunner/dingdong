<template>
  <base-container v-if="store.mer_id">
    <view :style="[wrapperStyle]" class="store-home">
      <!-- 搜索 -->
      <search :preview="preview" :store="store"></search>

      <view v-show="navShow" class="nav" :style="viewColor">
        <view class="nav-cont" :class="{ noPointer: preview }">
          <view :class="{ active: navActive === 0 }" class="item" @click="navActive = 0; select.show = !select.show">
            <view class="cont">
              {{ select.selected ? 'ຄະແນນ' : 'ທົ່ວໄປ' }}
              <text :class="['arrow-icon', 'iconfont', select.show ? 'icon-ic_uparrow' : 'icon-ic_downarrow']"></text>
            </view>
          </view>
          <view :class="{ active: navActive === 1 }" class="item" @click="set_where(2, 0)">
            <view class="cont">ຍອດຂາຍ</view>
          </view>
          <view :class="{ active: navActive === 2 }" class="item" @click="set_where(3, 0)">
            <view class="cont">
              ລາຄາ
              <image v-if="navActive === 2"
                :src="sortPrice ? domain + '/static/diy/up' + keyColor + '.png' : domain + '/static/diy/down' + keyColor + '.png'">
              </image>
            </view>
          </view>
          <view class="item" @click="select.show = false; navActive = 4; isColumn = !isColumn">
            <view class="cont">
              <text
                :class="['layout-icon', 'iconfont', isColumn ? 'icon-a-ic_Imageandtextsorting' : 'icon-a-ic_Picturearrangement']"></text>
            </view>
          </view>
        </view>
        <view v-show="select.show && navShow" class="select">
          <view v-for="item in select.options" :key="item.id" :class="{ active: item.id === select.selected }"
            class="item" @click="set_where(item.id, 0)">
            {{ item.name }}
            <text v-if="item.id === select.selected" class="iconfont icon-ic_complete"></text>
          </view>
        </view>
      </view>

      <view class="main-list-wrapper">
        <view class="main-list-content">
          <good-list :goods="goods" :is-column="isColumn" :store="store" :preview="preview" @scroll="scrollHome"
            :goodsLoading="goodsLoading" :loadTitle="loadTitle" @scrolltolower="onScrolltolower">
            <view v-show="!navShow" class="nav">
              <view class="nav-cont" :class="{ noPointer: preview }">
                <view :class="{ active: navActive === 0 }" class="item"
                  @click="navActive = 0; select.show = !select.show">
                  <view class="cont">
                    {{ select.selected ? 'ຄະແນນ' : 'ທົ່ວໄປ' }}
                    <text
                      :class="['arrow-icon', 'iconfont', select.show ? 'icon-ic_uparrow' : 'icon-ic_downarrow']"></text>
                  </view>
                </view>
                <view :class="{ active: navActive === 1 }" class="item" @click="set_where(2, 0)">
                  <view class="cont">
                    ຍອດຂາຍ
                  </view>
                </view>
                <view :class="{ active: navActive === 2 }" class="item" @click="set_where(3, 0)">
                  <view class="cont">
                    ລາຄາ
                    <image v-if="navActive === 2 && where.order == 'price_asc'"
                      :src="domain + '/static/diy/up' + keyColor + '.png'"></image>
                    <image v-if="navActive === 2 && where.order == 'price_desc'"
                      :src="domain + '/static/diy/down' + keyColor + '.png'"></image>
                  </view>
                </view>
                <view class="item" @click="select.show = false; navActive = 4; isColumn = !isColumn">
                  <view class="cont">
                    <text
                      :class="['layout-icon', 'iconfont', isColumn ? 'icon-a-ic_Imageandtextsorting' : 'icon-a-ic_Picturearrangement']"></text>
                  </view>
                </view>
              </view>
              <view v-show="select.show && !navShow" class="select">
                <view v-for="item in select.options" :key="item.id" :class="{ active: item.id === select.selected }"
                  class="item" @click="set_where(item.id, 0)">{{ item.name }}
                  <text v-if="item.id === select.selected" class="iconfont icon-ic_complete"></text>
                </view>
              </view>
            </view>
          </good-list>
        </view>
      </view>

      <diyDataProvider :diyId="diyId" :merId="merId" v-if="merId || diyId">
        <template #config="{ tabbarConfig }">
          <template v-if="tabbarConfig">
            <!--自定义底部tab栏-->
            <pageFootWrapper :merId="merId" :tabbarConfig="tabbarConfig" :nothing-data="updateStyle(tabbarConfig)" />
          </template>
        </template>
      </diyDataProvider>
    </view>
  </base-container>
</template>

<script>

import { mapGetters, mapState } from "vuex";
import BaseContainer from "@/components/common/base_container.vue";
import { HTTP_REQUEST_URL } from "@/config/app";
import { configMap } from "@/utils";
import { getStoreGoods } from '@/api/store.js';
import WaterfallsFlow from '@/components/WaterfallsFlow/WaterfallsFlow.vue'
import search from "./components/search.vue";
import goodList from "./components/good-list.vue";
import shareMixins from './components/share-mixins.js';
import diyDataProvider from '@/components/diyPage/common/diyDataProvider.vue';
import { diyUtil } from "@/utils/diy";
import pageFootWrapper from "@/sub-packages/diy/diyPage/common/pageFootWrapper.vue";

export default {
  components: {
    BaseContainer,
    WaterfallsFlow,
    search,
    goodList,
    diyDataProvider,
    pageFootWrapper
  },
  mixins: [shareMixins],
  // #ifdef MP
  componentPlaceholder: {
		"page-foot-wrapper": "view"
	},
	// #endif
  data() {
    return {
      domain: HTTP_REQUEST_URL,

      merId: 0, // 商铺id，兼容 mixin 的 merId 参数
      id: 0, // 商铺id
      preview: false,
      diyId: undefined,
      navShow: false, // 导航栏是否显示
      navActive: 0, // 导航栏激活状态
      isColumn: true, // 商品列表排列方式
      where: {
        order: '',
        keyword: '',
        page: 1,
        limit: 30
      },
      loading: false,
      loadend: false,
      goodsLoading: false,
      loadTitle: '',
      goods: [],
      tabbarHeight: 0,

      // 下拉菜单
      select: {
        show: false,
        selected: 0,
        options: [{
          id: 0,
          name: 'ທົ່ວໄປ'
        },
        {
          id: 1,
          name: 'ຄະແນນ'
        }
        ]
      },
    }
  },
  computed: {
    ...mapState({
      store(state) {
        return state.store.storeInfoMap[this.merId] || {};
      }
    }),
    wrapperStyle() {
      return {
        backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.5) 100%), url(${this.store.mer_banner})`,
        "--tabbar-height": `${this.tabbarHeight}px`
      }
    },
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
    ...configMap({
      margin_ico_switch: 0,
      margin_ico: '',
    }, mapGetters(['isLogin', 'uid', 'viewColor', 'keyColor'])),
  },
  onLoad(options) {
    this.diyId = parseInt(options.diyId) || 0;
    this.merId = this.id = parseInt(options.mer_id || options.id) || 0;
    this.getStore();
    this.getGoods();
  },
  methods: {
    updateStyle(tabbarConfig) {
      this.tabbarHeight = diyUtil.calcTabbarHeight(tabbarConfig);
      return undefined;
    },
    onScrolltolower(e) {
      if (this.loadend) return;
      if (this.loading) return;
      if (this.goodsLoading) return;
      this.getGoods();
    },
    // 商铺首页滚动 navbar 吸顶
    scrollHome(e) {
      this.navShow = e.detail.scrollTop >= 50;
    },
    // 选择条件展示商品
    set_where(param, isDiy) {
      this.select.show = false;
      this.loading = false;
      this.loadend = false;
      this.where.page = 1;
      this.goods = [];
      this.where.action = ""
      switch (param) {
        case 0:
          this.select.selected = 0;
          this.where.order = '';
          this.getGoods();
          break;
        case 1:
          this.select.selected = 1;
          this.where.order = 'rate';
          this.getGoods();
          break;
        case 2:
          this.navActive = 1;
          this.where.order = 'sales';
          this.getGoods();
          break;
        case 3:
          this.navActive = 2;
          this.sortPrice = !this.sortPrice;
          this.where.order = this.sortPrice ? 'price_asc' : 'price_desc';
          this.getGoods();
          break;
        case 4:
          if (isDiy == 1 || isDiy == 2) this.diyActive = isDiy
          this.navActive = 3;
          this.where.order = 'is_new';
          this.getGoods();
          break;
        case 5:
          if (isDiy == 1 || isDiy == 2) this.diyActive = isDiy
          this.navActive = 5;
          this.where.action = 1;
          this.where.order = ""
          this.getGoods();
          break;
      }
    },
    async getStore() {
      try {
        await this.$store.dispatch("getStoreInfo", {
          merId: this.id
        });
        this.ShareInfo();
      } catch (error) {
        console.error(error.message);
        this.$util.Tips({
          title: error.message
        });
      }
    },
    // 获取商铺商品
    getGoods() {
      let that = this;
      if (that.loadend) return;
      if (that.loading) return;
      if (that.goodsLoading) return;
      that.goodsLoading = true;
      that.loadTitle = '';
      getStoreGoods(that.id, that.where).then(res => {
        that.goodsLoading = false;
        let list = res.data.list;
        let goodsList = that.$util.SplitArray(list, that.goods);
        let loadend = list.length < that.where.limit;
        that.loadend = loadend;
        that.loading = false;
        that.loadTitle = loadend ? 'ໂຫຼດຄົບແລ້ວ' : 'ໂຫຼດເພີ່ມເຕີມ';
        that.$set(that, 'goods', goodsList);
        that.$set(that.where, 'page', that.where.page + 1);
      }).catch(err => {
        that.loading = false;
        that.goodsLoading = false;
        uni.showToast({
          title: err,
          icon: 'none'
        })
        setTimeout(function () {
          uni.navigateBack()
        }, 1000);
      });
    }
  }
}
</script>

<style scoped lang="scss">
@import "./components/common.scss";

.nav.fixed {
  position: fixed;
  left: 0;
  width: 100%;

  .nav-cont {
    position: absolute;
    width: 100%;
  }
}

.nav {
  position: relative;

  .nav-cont {
    display: flex;
    align-items: center;
    height: 84rpx;

    .item {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      min-width: 0;

      .cont {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 116rpx;
        height: 44rpx;
        border-radius: 22rpx;
        font-weight: 500;
        font-size: 24rpx;
        color: #ffffff;

        .arrow-icon {
          margin-left: 10rpx;
          font-size: 18rpx;
        }

        .layout-icon {
          font-size: 32rpx;
        }

        .icon-a-ic_Imageandtextsorting {
          font-size: 32rpx;
        }

        image {
          width: 15rpx;
          height: 21rpx;
          margin-left: 7rpx;
        }
      }
    }

    .active {
      .cont {
        background-color: #ffffff;
        font-weight: bold;
        color: var(--view-theme);
      }
    }
  }

  .select {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 2;
    width: 100%;
    padding-right: 40rpx;
    padding-bottom: 28rpx;
    padding-left: 74rpx;
    border-bottom-right-radius: 24rpx;
    border-bottom-left-radius: 24rpx;
    background-color: #ffffff;
    box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.06);

    .item {
      margin-top: 28rpx;
      font-size: 24rpx;
      color: #454545;
    }

    .active {
      color: var(--view-theme);

      .iconfont {
        color: var(--view-theme);
        float: right;
        font-size: 20rpx;
      }
    }
  }
}
</style>
