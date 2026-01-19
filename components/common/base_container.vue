<!-- 提供各种全局 CSS 变量，安全区域尺寸/小程序胶囊尺寸等 -->
<template>
  <view :style="cssVars" class="base-container" :class="{ 'has-min-height': hasMinHeight }">
    <slot />
  </view>
</template>

<script>
import deviceEnvMixin from "@/mixins/device-env";

export default {
  name: "BaseContainer",
  mixins: [deviceEnvMixin],
  props: {
    /**
     * 是否需要最小高度
     */
    hasMinHeight: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style scoped lang="scss">
.base-container {
  &.has-min-height {
    min-height: 100vh;
  }

  font-family: PingFang SC;
}
</style>
