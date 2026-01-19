import { getSystemInfo } from "@/utils/device";
import { mapGetters } from "vuex";
// #ifdef MP-WEIXIN
import { getMenuButtonBoundingClientRect } from "@/utils/device";
// #endif

/**
 * 该 mixin 用于获取设备信息，如状态栏高度，安全区域，小程序胶囊按钮尺寸等
 * 使用时将 cssVars 属性赋值给页面根元素的 style 属性，即可使用各 css 变量
 */

export default {
  methods: {
    env_getEnvInfo() {
      const systemInfo = getSystemInfo();
      // #ifdef MP-WEIXIN
      const menuRect = getMenuButtonBoundingClientRect();
      // #endif
      return {
        // #ifdef MP-WEIXIN
        menuRect,
        // #endif
        safeArea: systemInfo.safeArea,
        safeAreaBottomSize: systemInfo.safeAreaInsets.bottom,
        statusBarHeight: systemInfo.statusBarHeight,
        screenWidth: systemInfo.screenWidth,
        screenHeight: systemInfo.screenHeight
      }
    }
  },
  computed: {
    ...mapGetters(["viewColor"]),
    cssVars() {
      const deviceInfo = this.env_getEnvInfo();
      const {
        statusBarHeight,
        safeAreaBottomSize,
        safeArea,
        screenWidth,
      } = deviceInfo;
      const baseCssVars = {
        "--safe-area-inset-top": `${statusBarHeight}px`, // 状态栏高度
        "--safe-area-inset-top-default": `${statusBarHeight || uni.upx2px(20)}px`, // 状态栏兜底高度值，防止状态栏高度为 0 时，使用兜底高度
        "--safe-area-inset-bottom": `${safeAreaBottomSize}px`, // 安全区域底部高度

        // "--nav-padding-y-gap": "10rpx", // 通用导航栏内边距
        // "--nav-content-height": "58rpx", // 通用导航栏内容高度
        "--nav-padding-y-gap": uni.upx2px(10) + 'px', // 通用导航栏内边距
        "--nav-content-height": uni.upx2px(58) + 'px', // 通用导航栏内容高度

        // #ifdef MP-WEIXIN
        "--nav-padding-y-gap": "calc(var(--menu-btn-top) - var(--safe-area-inset-top))",
        "--nav-content-height": "var(--menu-btn-height)",
        // #endif

        "--nav-bar-height": "calc(var(--safe-area-inset-top) + var(--nav-padding-y-gap) + var(--nav-content-height))",
      };
      // #ifdef MP-WEIXIN
      const {
        menuRect
      } = deviceInfo;
      Object.assign(baseCssVars, {
        "--menu-btn-height": `${menuRect.height}px`, // 胶囊按钮高度
        "--menu-btn-top": `${menuRect.top}px`, // 胶囊按钮 y 轴坐标（距离屏幕顶部）
        "--menu-btn-right": `${screenWidth - menuRect.right}px`, // 胶囊按钮 x 轴坐标（距离屏幕右侧）
        "--menu-btn-width": `${menuRect.width}px`, // 胶囊按钮宽度
      });
      // #endif
      const baseCssVarStr = Object.entries(baseCssVars)
        .map(([key, value]) => `${key}:${value}`)
        .join(";");
      return baseCssVarStr + ";" + this.viewColor;
    }
  }
}