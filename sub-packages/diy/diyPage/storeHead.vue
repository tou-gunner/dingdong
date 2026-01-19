<template>
  <view :style="[commonStyleVars]" class="store-head-wrap" :class="{ 'is-first': index === 0 }">
    <view class="search-container" :class="{ 'is-scroll': isScroll }">
      <!-- 搜索栏 -->
      <view class="search-bar">

        <!-- 导航按钮 -->
        <view class="button-group">
          <navigator class="button-item" hover-class="none" open-type="navigateBack">
            <view class="iconfont icon-ic_leftarrow"></view>
          </navigator>
          <view class="vertical-line"></view>
          <navigator class="button-item" hover-class="none" open-type="switchTab" url="/pages/index/index">
            <view class="iconfont icon-ic_home"></view>
          </navigator>
        </view>

        <!-- 搜索框 / 提示词 / 热词 -->
        <navigator class="input-box" :style="[inputWrapperStyle]" :url="searchUrl" hover-class="none">
          <view class="iconfont icon-ic_search"></view>
          <swiper class="hot-word-swiper" :indicator-dots="false" :autoplay="true"
            :interval="dataConfig.hotwordDisplayTime.val * 1000" :duration="500" :vertical="true" :circular="true"
            v-if="hotWordIsVisible" @change="handleHotWordChange">
            <swiper-item v-for="(item, index) in hotWordsText" :key='index'>
              <view class="hot-word-item" :style="[inputHotWordsTextStyle]">{{ item.val }}</view>
            </swiper-item>
          </swiper>
          <text :style="[inputTipTextStyle]" v-else>{{ inputTipText }}</text>
        </navigator>
      </view>
    </view>
    <view class="relative">
      <!-- 店铺信息模块 -->
      <store-head-info :dataConfig="dataConfig"></store-head-info>

      <!-- 轮播图模块 -->
      <swiper-bg :dataConfig="swiperDataConfig" @change="handleSwiperChange"></swiper-bg>
    </view>

    <view class="scroll-observer-dom"></view>
  </view>
</template>

<script>
import { diyUtil } from "@/utils/diy";
import storeHeadInfo from "./storeHeadInfo.vue";
import swiperBg from "./swiperBg.vue";

export default {
  name: "storeHead",
  components: {
    storeHeadInfo,
    swiperBg
  },
  props: {
    dataConfig: Object,
    index: {
      type: Number,
      default: 0
    },
    isScroll: {
      type: Boolean,
      default: false
    },
    compCount: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      swiperIndex: 0,
      hotWordIndex: 0
    };
  },
  inject: ["parentMerId"],
  computed: {
    // 轮播图数据配置
    swiperDataConfig() {
      const $ = this.dataConfig;
      const styleType = $.swiperStyle.tabVal;

      // 样式1类型的轮播图，无内边距
      const gapSize = styleType === 0 ? 0 : 10;
      return {
        styleConfig: $.swiperStyle,
        swiperConfig: $.swiperConfig,
        docConfig: $.docConfig,
        docPosition: $.docPosition,
        toneConfig: $.docToneConfig,
        dotColor: $.docActiveColor,
        dotBgColor: $.docNormalColor,
        filletImg: $.fillet,
        imgConfig: $.imgGap,
        bgColor: {
          color: [
            {
              item: $.swiperStyle.tabVal == 1 ? "#fff" : "transparent"
            }
          ]
        },
        topConfig: {
          val: 0,
        },
        bottomConfig: {
          val: gapSize,
        },
        prConfig: {
          val: gapSize,
        },
        mbConfig: {
          val: 0,
        },
        txtStyle: $.docPosition,
        shadowConfig: {
          color: "#888",
          x: 0,
          y: 0,
          blur: 0,
          spread: 0
        },
        imgShadowConfig: $.imgShadowConfig,
        offsetYConfig: {
          val: 0
        }
      };
    },
    searchUrl() {
      let keyword = this.inputTipText;
      if (this.hotWordsText.length) {
        keyword = this.hotWordsText[this.hotWordIndex].val;
      }
      return `/pages/store/list/index?mer_id=${this.parentMerId}&keyword=${keyword}`;
    },
    inputWrapperStyle() {
      const { searchBoxColor, shadowConfig } = this.dataConfig;
      return {
        boxShadow: diyUtil.buildShadowStyle(shadowConfig),
        backgroundColor: this.isScroll ? "#f5f5f5" : searchBoxColor.color[0].item
      };
    },
    inputTipText() {
      const { searchTipConfig } = this.dataConfig;
      return searchTipConfig.value || "请输入搜索内容";
    },
    inputTipTextStyle() {
      if (!this.dataConfig) return {};
      const { tipColor } = this.dataConfig;
      return {
        color: this.isScroll ? "inherit" : tipColor.color[0].item,
      };
    },
    inputHotWordsTextStyle() {
      if (!this.dataConfig) return {};
      const { hotWordsColor } = this.dataConfig;
      return {
        color: this.isScroll ? "inherit" : hotWordsColor.color[0].item,
      };
    },
    hotWordIsVisible() {
      const { list } = this.dataConfig.searchHotWord;
      return list.length && list[0].val;
    },
    hotWordsText() {
      return this.dataConfig.searchHotWord.list;
    },
    commonStyleVars() {
      const {
        swiperConfig,
      } = this.dataConfig;

      const styles = {
        "--search-bar-index": diyUtil.calcZIndex(this.compCount)
      };

      if (swiperConfig.list.length && swiperConfig.list[this.swiperIndex].img) {
        styles["--swiper-img"] = `url(${this.$util.BuildImgUrl(swiperConfig.list[this.swiperIndex].img)})`;
      }

      return styles;
    }
  },
  methods: {
    handleHotWordChange(e) {
      this.hotWordIndex = e.detail.current;
    },
    handleSwiperChange(e) {
      this.swiperIndex = e;
    }
  }
}
</script>

<style scoped lang="scss">
.store-head-wrap {
  position: relative;
  background: var(--swiper-img) no-repeat center / cover;
  transition: background 0.3s ease-in-out;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    backdrop-filter: blur(16rpx);
  }

  --search-bar-padding-vertical: 12rpx;
  // 搜索框垂直内边距

  --top-placeholder-height: var(--search-bar-padding-vertical);
  
  &.is-first {
    --top-placeholder-height: calc(var(--safe-area-inset-top) + var(--search-bar-padding-vertical));
  }
  // 搜索框顶部占位高度

  // #ifdef MP-WEIXIN
  --top-placeholder-height: var(--menu-btn-top);
  // 微信小程序环境下，搜索框顶部占位高度为胶囊按钮距离屏幕顶部的距离，保持和胶囊按钮对齐
  // #endif

  --search-bar-content-height: 58rpx;
  // 搜索框内容高度

  // #ifdef MP-WEIXIN
  --search-bar-content-height: var(--menu-btn-height);
  // 微信小程序环境下，搜索框内容高度为胶囊按钮高度
  // #endif


  padding-top: calc(var(--top-placeholder-height) + var(--search-bar-content-height) + var(--search-bar-padding-vertical));
  // 由于 search fixed 定位，因此需要设置 padding-top 来撑开高度
  // padding-top 高度 = 顶部占位高度 + 搜索框内容高度 + 搜索框底边距
}

.search-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding-top: var(--top-placeholder-height);
  padding-bottom: var(--search-bar-padding-vertical);
  padding-left: 24rpx;
  padding-right: 20rpx;
  z-index: var(--search-bar-index);
  color: #fff;

  &.is-scroll {
    background: #fff;
    transition: background 0.3s ease-in-out;
    color: #000 !important;
  }

  // #ifdef MP-WEIXIN
  padding-right: calc(var(--menu-btn-right) + var(--menu-btn-width) + 22rpx);
  // 微信小程序环境下，需要避开胶囊按钮
  // #endif
}

.search-bar {
  height: var(--search-bar-content-height);
  display: flex;

  .button-group {
    height: 100%;
    width: 154rpx;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 32rpx;
    border: 1px solid rgba(255, 255, 255, 0.6);
    margin-right: 20rpx;

    display: flex;
    align-items: center;

    .vertical-line {
      width: 1px;
      height: 30rpx;
      background: #B3B3B3;
    }

    .button-item {
      flex: 1;
      background: transparent;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;

      .iconfont {
        font-size: 32rpx;
      }
    }
  }

  .input-box {
    flex: 1;
    background: rgba(255, 255, 255, 0.4);
    border-radius: 32rpx;
    padding-inline: 20rpx;
    display: flex;
    align-items: center;

    .iconfont {
      font-size: 24rpx;
      margin-right: 14rpx;
    }

    .hot-word-swiper {
      height: 100%;
      width: 100%;

      .hot-word-item {
        height: 100%;
        display: flex;
        align-items: center;
        font-size: 12px;
      }
    }
  }
}
</style>
