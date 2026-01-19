<template>
  <view />
</template>

<script>
import { diyUtil } from "@/utils/diy";
export default {
  props: {
    tabbarConfig: Object
  },
  created() {
    this.check();
  },
  methods: {
    check() {
      diyUtil.checkTabbarStatus(this.tabbarConfig);
    }
  }
}
</script>

<style scoped></style>
