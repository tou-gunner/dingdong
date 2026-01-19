/**
 * 该 mixin 用于获取当前 diy 模板中的 tabBar 数据，如计算出 tabBar 的高度，是否浮动等
 * 可利用该 mixin 提供底部 tabbar 高度，使页面内容不被 tabbar 遮挡
 * 使用该组件时，父组件需要使用 provider 注入获取 tabBar 配置的函数
 */

import { getSystemInfo } from "@/utils/device";
import { diyUtil } from "@/utils/diy.js";

export default {
  data() {
    return {
      tabbarConfig: null,
      tabbarHeight: getSystemInfo().safeAreaInsets.bottom,
      isFloatTabbar: false
    };
  },
  inject: ["getTabbarConfig"],
  created() {
    this.calcTabbarInfo();
  },
  methods: {
    async calcTabbarInfo() {
      if (!this.getTabbarConfig) {
        console.error(`请在引用该 mixins 的组件父组件中使用 provider 注入 getTabbarConfig 方法`);
      }
      this.tabbarConfig = await this.getTabbarConfig();
      if (!this.tabbarConfig) return;
      this.tabbarHeight = diyUtil.calcTabbarHeight(this.tabbarConfig);
      const { effectConfig, navConfig } = this.tabbarConfig;

      // 自定tabbar & 悬浮类型 tabbar
      this.isFloatTabbar = effectConfig.tabVal === 1 && navConfig.tabVal === 1;
    },
  }
}