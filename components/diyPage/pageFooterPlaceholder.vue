<!-- footer 占位组件，用于撑开 footer 占据的空间 -->
<template>
  <view class="page-footer-placeholder" :style="[compStyle]" />
</template>

<script>
import { diyUtil } from "@/utils/diy.js";
import { getSystemInfo } from "@/utils/device";

export default {
  name: "pageFooterPlaceholder",
  props: {
    tabbarConfig: {
      type: Object
    },
    /**
     * 附加高度，用于撑开 footer 占据的空间，单位 rpx
     */
    appendHeight: {
      type: Number,
      default: 30
    }
  },
  computed: {
    compStyle() {
      const tabbarHeight = this.tabbarConfig ? diyUtil.calcTabbarHeight(this.tabbarConfig) : getSystemInfo().safeAreaInsets.bottom;
      const appendHeight = uni.upx2px(this.appendHeight || 0);
      return {
        "--placeholder-height": `${tabbarHeight + appendHeight}px`
      }
    }
  }
}
</script>

<style scoped lang="scss">
.page-footer-placeholder {
  height: calc(var(--placeholder-height, 0px));
}
</style>
