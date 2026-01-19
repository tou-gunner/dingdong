import { getSystemInfo } from "@/utils/device";

export const diyUtil = {
  buildBorderRadius(config, direction) {
    // direction: top / bottom，分别指左上&右上  / 左下&右下 的圆角
    const { valList, val, type } = config;
    const isUniformRadius = type === 0;
    if (direction === "top") {
      if (isUniformRadius) {
        return `${val}px ${val}px 0 0`;
      }
      return `${valList[0].val}px ${valList[1].val}px 0 0`;
    } else if (direction === "bottom") {
      if (isUniformRadius) {
        return `0 0 ${val}px ${val}px`;
      }
      return `0 0 ${valList[2].val}px ${valList[3].val}px`;
    }

    if (isUniformRadius) return `${val}px`;
    return `${valList[0].val}px ${valList[1].val}px ${valList[3].val}px ${valList[2].val}px`;
  },
  buildLinearColor(config, direction = 'to right') {
    const linearColor = config.color.map(item => item.item || 'transparent');
    return `linear-gradient(${direction}, ${linearColor.join(',')})`;
  },
  buildShadowStyle(config) {
    const { color, x, y, blur, spread, visible } = config;
    if (visible === 0 || (x == 0 && y == 0 && blur == 0 && spread == 0)) return 'none';
    return `${x}px ${y}px ${blur}px ${spread}px ${color}`;
  },
  buildMarginTopOffset(marginTopConfig, marginTopFloatConfig) {
    // 页面上边距配置和组件上浮配置
    // 如果配置了组件上浮或者没有配置页面上边距，则以组件上浮为准，即 marginTop 负值，实现向上偏移
    // 否则采用页面上边距配置
    if (!marginTopConfig && !marginTopFloatConfig) return '0px';

    if (!marginTopConfig || marginTopFloatConfig && marginTopFloatConfig.val) {
      return `-${marginTopFloatConfig.val}px`;
    }
    return `${marginTopConfig.val}px`;
  },
  // 根据 tabbar DIY 配置计算 tabbar 占据的实际高度
  calcTabbarHeight(config) {
    const {
      topConfig,
      bottomConfig,
      mbConfig,
      navConfig,
      effectConfig
    } = config;

    if (effectConfig.tabVal === 0) {
      // 使用原生 tabbar 的状态

      // 在 App 和小程序平台使用原生 tabbar 时，屏幕高度不包含原生 tabbar 高度
      // 因此 tabbar 高度返回为 0 即可
      
      // 而在 WEB 平台下，所谓的原生 tabbar 是使用 view 模拟的，仍然包含在屏幕高度内
      // 因此为了避免其他组件根据 tabbar 高度进行 fixed 定位时和 tabbar 重叠
      // 需要返回真实的 tabbar 高度

      // uniapp 在 web 平台使用原生 tabbar高度时，会自动给页面外部容器增加 50px 的 padding-bottom
      // 需要在 App.vue 里进行重置

      // #ifdef WEB
      return 50;
      // #endif
      // #ifndef WEB
      return 0;
      // #endif
    }

    const safeAreaBottom = getSystemInfo().safeAreaInsets.bottom;

    // tabbar 高度 + padding-top + padding-bottom + 安全区域底部高度
    let height = uni.upx2px(100) + topConfig.val + bottomConfig.val + safeAreaBottom;

    if (navConfig.tabVal === 1 && mbConfig.val > 0) {
      // 如果是悬浮类型 tabbar，且偏移距离大于安全区域底部高度，则需要减去两者之差
      if (mbConfig.val > safeAreaBottom) {
        height += mbConfig.val - safeAreaBottom;
      }
    }
    return height;
  },
  checkTabbarStatus(config) {
    if (!config) {
      // 如果没有配置 tabBar，则隐藏原生 tabBar
      // uni.hideTabBar();
      return;
    }

    if (config.effectConfig.tabVal === 0) {
      // 使用原生 tabbar
      uni.showTabBar();
    } else {
      // 否则隐藏原生 tabbar，使用自定义 tabbar
      uni.hideTabBar();
    }
  },
  calcFollowCompHeight() {
    const logoHeight = 92; // rpx
    const statusBarHeight = getSystemInfo().safeAreaInsets.top;
    const containerPaddingY = 14 * 2;
    return uni.upx2px(logoHeight + containerPaddingY) + statusBarHeight;
  },
  calcZIndex(index) {
    return index + 1;
  },
  calcStickyTopOffset(compList) {
    // 计算头部组件吸顶时的 top 偏移值，提供给子组件，避免吸顶后被遮挡
    const headerSearchCompIndex = compList.findIndex(item => item.config.name === 'headerSerch');
    const homeCombCompIndex = compList.findIndex(item => item.config.name === 'homeComb');
    const storeHeaderCompIndex = compList.findIndex(item => item.config.name === 'store_head');

    if (headerSearchCompIndex !== -1) {
      const { fixedConfig, topConfig, bottomConfig } = compList[headerSearchCompIndex].config;
      if (fixedConfig.tabVal === 1) {
        const compHeight = topConfig.val + bottomConfig.val + 48;
        if (headerSearchCompIndex === 0) {
          return `calc(var(--safe-area-inset-top) + ${compHeight}px)`;
        }
        return compHeight + "px";
      }
    } else if (homeCombCompIndex !== -1) {
      const { searchConfig } = compList[homeCombCompIndex].config;
      if (searchConfig.tabVal === 1) {
        const compHeight = 43;
        if (homeCombCompIndex === 0) {
          return `calc(var(--safe-area-inset-top) + ${compHeight}px)`;
        }
        return compHeight + "px";
      }
    } else if (storeHeaderCompIndex !== -1) {
      const searchBarPaddingBottom = uni.upx2px(12) + "px";
      // #ifndef MP
      const searchBarContentHeight = uni.upx2px(58) + "px";
      const searchBarPaddingTop = uni.upx2px(12) + "px";

      return `calc(${searchBarContentHeight} + ${searchBarPaddingTop} + ${searchBarPaddingBottom} + var(--safe-area-inset-top))`;
      // #endif
      // #ifdef MP
      const searchBarContentHeight = "var(--menu-btn-height)";
      const searchBarPaddingTop = "var(--menu-btn-top)";
      return `calc(${searchBarContentHeight} + ${searchBarPaddingTop} + ${searchBarPaddingBottom})`;
      // #endif
    }

    return 0;
  },
  checkUrl(url, merId) {
    // 检查 url 是否需要追加商户 id
    if (!merId) return url;

    const searchIndex = url.indexOf("?");
    const merIdParamsName = url.startsWith("/pages/store/") ? "id" : "mer_id";

    const safeDecode = (str = "") => {
      try {
        return decodeURIComponent(str);
      } catch {
        return str;
      }
    };

    const params = searchIndex === -1 ? {} :
      url.slice(searchIndex + 1)
        .split('&')
        .filter(Boolean)
        .reduce((acc, item) => {
          let [k, v = ""] = item.trim().split("=");
          if (k) acc[safeDecode(k)] = safeDecode(v);
          return acc;
        }, {});

    params[merIdParamsName] ??= merId; // 保证 merId 存在

    const encode = encodeURIComponent;
    const newQuery = Object.entries(params)
      .map(([k, v]) => `${encode(k)}=${encode(v)}`)
      .join("&");

    return `${url.slice(0, searchIndex === -1 ? url.length : searchIndex)}?${newQuery}`;
  }
};