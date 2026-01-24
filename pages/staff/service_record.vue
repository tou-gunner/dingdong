<template>
  <BaseContainer>
    <view class="nav-bar-wrapper" :class="{ 'is-scroll': isScroll }">
      <BaseNavBar :title="$t('staff.service_record')" />
    </view>
    <view class="form-wrapper">
      <BaseSystemForm ref="form" :formId="formId" v-if="formId && orderInfo" :defaultValues="defaultValues" />
    </view>
    <view class="form-btn-group">
      <button class="form-btn-group__btn confirm" @click="handleConfirm">{{$t('common.confirm')}}</button>
    </view>
  </BaseContainer>
</template>

<script>
import BaseContainer from "@/components/common/base_container.vue";
import BaseNavBar from "@/components/common/base_nav_bar.vue";
import BaseSystemForm from "@/components/common/base_system_form.vue";
import { getStaffOrderDetail, getMerStaffCheckinConfig, saveStaffOrderServiceRecord } from "@/api/staff";

export default {
  components: {
    BaseContainer,
    BaseNavBar,
    BaseSystemForm
  },
  data() {
    return {
      merId: null,
      formId: null,
      orderId: null,
      orderInfo: null,
      checkinConfig: null,
      isScroll: false
    };
  },
  computed: {
    defaultValues() {
      if (!this.orderInfo) return;
      const values = this.orderInfo.reservation_service_voucher;
      if (Array.isArray(values) || !values) return;
      return values;
    }
  },
  onPageScroll(e) {
    this.isScroll = e.scrollTop > 5;
  },
  onLoad(options) {
    this.merId = options.mer_id;
    this.orderId = options.order_id;
    this.handleGetOrderDetail();
    this.handleGetMerStaffCheckinConfig();
  },
  methods: {
    async handleGetOrderDetail() {
      uni.showLoading({
        mask: true
      });
      try {
        const res = await getStaffOrderDetail(this.orderId);
        this.orderInfo = res.data;
        uni.hideLoading();
      } catch (err) {
        uni.hideLoading();
        this.$util.Tips({
          title: err,
          icon: "none"
        });
      }
    },
    async handleGetMerStaffCheckinConfig() {
      const res = await getMerStaffCheckinConfig(this.merId);
      this.checkinConfig = res.data;
      if (this.checkinConfig.enable_trace != 1 || !this.checkinConfig.trace_form_id) {
        this.$util.Tips({
          title: this.$t('staff.service_record_error'),
          icon: "none"
        });
      } else {
        this.formId = this.checkinConfig.trace_form_id;
      }
    },
    async handleConfirm() {
      const formData = this.$refs.form.getData();
      if (!formData) return;
      const formPayload = Object.values(formData).reduce((acc, item) => {
        acc[item.label] = item.value;
        return acc;
      }, {});
      uni.showLoading({
        mask: true
      });
      try {
        const res = await saveStaffOrderServiceRecord(this.orderId, {
          reservation_service_voucher: formPayload
        });
        uni.hideLoading();
        this.$util.Tips({
          title: res.message,
          icon: "success"
        });
        setTimeout(() => {
          uni.navigateBack();
        }, 1000);
      } catch (err) {
        uni.hideLoading();
        this.$util.Tips({
          title: err,
          icon: "none"
        });
      }
    },
  }
}
</script>

<style scoped lang="scss">
$btn-height: calc(126rpx + var(--safe-area-inset-bottom));

.form-wrapper {
  margin: 20rpx 20rpx 0;
  padding: 0 30rpx;
  background-color: #fff;
  border-radius: 24rpx;
  margin-bottom: calc(#{$btn-height} + 20rpx);
}

.nav-bar-wrapper {
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: #f5f5f5;
  &.is-scroll {
    background-color: #fff;
  }
}

.form-btn-group {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: $btn-height;
  background-color: #fff;
  padding: 20rpx 30rpx;
  padding-bottom: var(--safe-area-inset-bottom);

  &__btn {
    height: 88rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 43rpx;
    font-size: 28rpx;
    font-weight: 500;
    background: #F5F5F5;

    &.confirm {
      background: #2291F8;
      color: #fff;
    }
  }
}
</style>
