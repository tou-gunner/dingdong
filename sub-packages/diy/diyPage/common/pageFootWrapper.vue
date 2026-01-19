<!-- 对 diy 组件 pageFoot 进行包裹，以便通过 props 传递 merId 进行 provider  -->
<template>
  <!--自定义底部tab栏-->
  <view :style="cssVars">
    <pageFoot :dataConfig="tabbarConfig" v-if="tabbarConfig" />
  </view>
</template>

<script>
import deviceEnvMixin from "@/mixins/device-env";
import pageFoot from "../pageFoot.vue";

export default {
  mixins: [deviceEnvMixin],
  components: {
    pageFoot
  },
  props: {
    tabbarConfig: Object,
    merId: {
      type: Number,
      default: 0
    }
  },
  provide() {
    return {
      parentMerId: this.merId
    }
  }
}
</script>
