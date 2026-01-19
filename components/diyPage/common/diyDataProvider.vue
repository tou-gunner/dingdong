<!-- 通过 inject 注入相关数据 -->
<!-- 使用时，需要传入 diyId / merId，以获取 diy 数据，并通过 slot 和 provider 注入相关数据，子组件可以通过 slot prop / inject 获取相关数据 -->
<template>
  <view class="diy-data-provider" :style="[cssVars]">
    <!-- 通过 props 传递相关数据 -->
    <slot name="config" :tabbarConfig="tabbarConfig"></slot>
  </view>
</template>

<script>
import { diyUtil } from "@/utils/diy.js";

export default {
  props: {
    diyId: {
      type: Number,
      default: 0,
    },
    merId: {
      type: Number,
      default: 0
    }
  },
  provide() {
    return {
      getTabbarConfig: () => {
        if (this.tabbarConfig) return this.tabbarConfig;
        return new Promise((resolve) => {
          this.task.push(() => {
            resolve(this.tabbarConfig);
          });
        });
      },
      parentDiyId: this.diyId,
      parentMerId: this.merId
    }
  },
  computed: {
    tabbarConfig() {
      return this.diyComp && Object.values(this.diyComp).find(item => item.name === "pageFoot");
    },
    cssVars() {
      const style = {};

      if (this.tabbarConfig) {
        style["--tabbar-height"] = diyUtil.calcTabbarHeight(this.tabbarConfig) + "px";
      }

      return style;
    }
  },
  data() {
    return {
      task: [],

      diyData: null,
      diyComp: null
    }
  },
  created() {
    this.getDiyData()
      .then(() => {
        this.task.forEach(fn => fn());
      });
  },
  methods: {
    async getDiyData() {
      try {
        const diyData = await this.$store.dispatch("fetchDiyData", { diyId: this.diyId, merId: this.merId });
        this.diyComp = diyData.value;
        this.diyData = diyData;
      } catch (err) {
        uni.showToast({
          title: err.message,
          icon: 'none'
        })
      }
    },
  }
}
</script>

<style scoped></style>
