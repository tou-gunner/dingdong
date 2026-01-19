<template>
  <view v-if="dataConfig.effectConfig.tabVal" class="page-foot-comp"
    :class="{ 'is-float': dataConfig.navConfig.tabVal === 1 }" :style="[compStyle]">
    <view class="nav-item" v-for="item of menuList" :key="item.link" :class="{ active: isActiveLink(item.link) }"
      @click="handleNavClick(item.link)">
      <template v-if="dataConfig.navStyleConfig.tabVal !== 1">
        <image class="nav-icon" :src="isActiveLink(item.link) ? item.imgList[0] : item.imgList[1]" mode="aspectFit" />
      </template>
      <view v-if="dataConfig.navStyleConfig.tabVal !== 2">{{ item.name }}</view>

      <view v-if="isCartLink(item.link) && cartNum" class="cart-count-dot">{{ cartNum > 99 ? 99 : cartNum }}</view>
    </view>
  </view>
</template>

<script>
import { diyUtil } from "@/utils/diy.js";
import { getSystemInfo } from "@/utils/device";
import { mapGetters } from "vuex";

export default {
  name: "pageFoot",
  props: {
    dataConfig: Object
  },
  inject: {
    parentMerId: {
      default: 0
    },
    parentDiyId: {
      default: 0
    }
  },
  computed: {
    ...mapGetters(["cartNum"]),
    menuList() {
      const merId = this.parentMerId;
      const urlSearch = (() => {
        if (merId === 0) return "";
        if (merId && this.parentDiyId) {
          return `?id=${this.parentMerId}&diyId=${this.parentDiyId}`;
        } else if (merId) {
          return `?id=${this.parentMerId}`;
        } else if (this.parentDiyId) {
          return `?diyId=${this.parentDiyId}`;
        }
      })();
      return this.dataConfig.menuList.map(item => ({
        ...item,
        link: item.link + urlSearch
      }));
    },
    compStyle() {
      const {
        toneConfig,
        txtColor,
        activeTxtColor,
        bgColor,
        bgColor2,
        topConfig,
        bottomConfig,
        prConfig,
        mbConfig,
        fillet,
        navConfig
      } = this.dataConfig;

      const styles = {
        "--bg-color": bgColor.color[0].item,
        "--pd-top": topConfig.val + "px",
        "--pd-bottom": bottomConfig.val + "px"
      };



      if (navConfig.tabVal === 1) {
        // 悬浮 tabbar 样式
        Object.assign(styles, {
          "--bg-color": bgColor2.color[0].item,
          "--pd-inline": prConfig.val + "px",
          "--mr-bottom": mbConfig.val + "px",
          "--border-radius": diyUtil.buildBorderRadius(fillet),
        });


        // 底部安全区域高度
        const safeAreaBottom = getSystemInfo().safeAreaInsets.bottom;

        if (safeAreaBottom && mbConfig.val > 0) {
          if (mbConfig.val <= safeAreaBottom) {
            // diy 设置的偏移距离小于安全区域高度，则使用安全区域高度即可
            // 由于 css 中已经加上了安全区域高度，因此将 pd-bottom 设置为 0
            styles["--mr-bottom"] = "0px";
          } else {
            // diy 设置的偏移距离大于安全区域高度，则使用 diy 设置的偏移距离减去安全区域高度
            // 两者之差加上安全区域高度，刚好等于 diy 设置的偏移距离
            styles["--mr-bottom"] = (mbConfig.val - safeAreaBottom) + "px";
          }
        }
      }

      if (toneConfig.tabVal === 1) {
        styles["--text-color"] = txtColor.color[0].item;
        styles["--active-text-color"] = activeTxtColor.color[0].item;
      }


      return styles;
    }
  },
  data() {
    return {
      currentRoute: this.getCurrentRoute()
    };
  },
  methods: {
    isCartLink(link) {
      const cartPageLink = "/pages/order_addcart/order_addcart";
      return link.includes(cartPageLink);
    },
    getCurrentRoute() {
      const pages = getCurrentPages();
      const currentPage = pages[pages.length - 1];
      return currentPage.$page.fullPath;
    },
    isActiveLink(link) {
      return link && this.currentRoute.startsWith(link.split("?")[0]);
    },
    handleNavClick(link) {
      if (this.isActiveLink(link)) return;
      uni.switchTab({
        url: link,
        fail(err) {
          uni.redirectTo({
            url: link,
            animationType: "none"
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.page-foot-comp {
  position: fixed;
  left: var(--pd-inline, 0px);
  right: var(--pd-inline, 0px);
  bottom: calc(var(--mr-bottom, 0px));
  color: var(--text-color, #282828);
  background-color: var(--bg-color);
  padding-top: var(--pd-top);
  padding-bottom: calc(var(--pd-bottom) + var(--safe-area-inset-bottom));
  font-size: 20rpx;
  display: flex;
  border-radius: var(--border-radius, 0px);
  z-index: 900;

  &.is-float {
    backdrop-filter: blur(10px);
    padding-bottom: var(--pd-bottom, 0px);
    bottom: calc(var(--mr-bottom, 0px) + var(--safe-area-inset-bottom));
    box-shadow: 0 0 2px 0px rgba(0, 0, 0, 0.1);
  }

  .nav-item {
    height: 100rpx;
    flex: 1;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    justify-content: center;
    position: relative;

    &.active {
      color: var(--active-text-color, #f62c2c);
    }

    .cart-count-dot {
      position: absolute;
      height: 16px;
      min-width: 16px;
      padding: 0 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 1.2;
      background-color: var(--view-theme);
      border-radius: 8px;
      top: 2px;
      left: 50%;
      transform: translateX(20%);
      color: #fff;
    }
  }

  .nav-icon {
    width: 40rpx;
    height: 40rpx;
    margin-bottom: 6rpx;
  }
}
</style>
