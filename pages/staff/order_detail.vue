<template>
  <BaseContainer>
    <!-- #ifdef MP || APP-PLUS -->
    <view class="nav-bar-wrapper">
      <BaseNavBar title="订单详情" lightText />
    </view>
    <!-- #endif -->
    <view class="order-body">
      <view class="body-bg1" />
      <view class="body-bg2" />
      <view class="order-body-wrapper" v-if="orderInfo">
        <OrderDetailStatus :orderInfo="orderInfo" @remark="handleOpenRemarkPanel" />
        <OrderDetailGoods :orderInfo="orderInfo" />
        <OrderDetailTable :list="item.list" :title="item.title" v-for="(item, index) in tableList" :key="index" />
        <OrderDetailInfo :orderInfo="orderInfo" />
        <OrderDetailBottomBar v-if="btnConfig.length" :config="btnConfig" @action="handleBottomBarAction" />
      </view>
    </view>
    <PriceChange :change="remarkPanelVisible" @closechange="handleCloseRemarkPanel" :orderInfo="orderInfo"
      @savePrice="handleSaveRemark" status="1" v-if="orderInfo" />
  </BaseContainer>
</template>

<script>
import BaseContainer from "@/components/common/base_container.vue";
import BaseNavBar from "@/components/common/base_nav_bar.vue";
import OrderDetailStatus from "@/components/shared-order/order_detail_status.vue";
import OrderDetailGoods from "@/components/shared-order/order_detail_goods.vue";
import OrderDetailTable from "@/components/shared-order/order_detail_table.vue";
import OrderDetailInfo from "@/components/shared-order/order_detail_info.vue";
import OrderDetailBottomBar from "@/components/shared-order/order_detail_bottom_bar.vue";
import PriceChange from "@/components/shared-order/PriceChange/index.vue";
import { toggleRemarkPanelMixin } from "@/mixins/toggle-status";
import { getStaffOrderDetail, verifyStaffOrder, getMerStaffCheckinConfig } from "@/api/staff";
import { addBookingOrderType } from "@/utils/order";
import { getTableList } from "@/utils/order";
import { systemFormData } from "@/api/user";
import { saveStaffOrderRemark } from "@/api/staff";
import { BtnUtil } from "@/utils/order";

const BTN_EVENT = {
  REMARK: "remark",
  SERVICE_RECORD: "serviceRecord",
  SIGN_IN: "signIn",
  VERIFY: "verify"
}

export default {
  mixins: [toggleRemarkPanelMixin],
  components: {
    BaseContainer,
    BaseNavBar,
    OrderDetailStatus,
    OrderDetailGoods,
    OrderDetailTable,
    OrderDetailInfo,
    OrderDetailBottomBar,
    PriceChange
  },
  data() {
    return {
      orderId: "",
      merId: "",
      rawOrderInfo: null,
      formData: null,
      merServiceConfig: null
    }
  },
  computed: {
    orderInfo() {
      if (!this.rawOrderInfo) return null;
      return Object.assign({}, this.rawOrderInfo, this.merServiceConfig);
    },
    btnConfig() {
      if (!this.orderInfo || !this.merServiceConfig) return [];
      const config = [];
      const progressStatus = [1, 20];
      if (progressStatus.includes(this.orderInfo.status)) {
        config.push(
          {
            text: "订单备注",
            type: "plain",
            event: BTN_EVENT.REMARK
          }
        );
      }


      if (!this.orderInfo.is_instore_order) {
        if (BtnUtil.getCheckinStatus(this.orderInfo, this.merServiceConfig)) {
          config.push({
            text: "上门打卡",
            type: "primary",
            event: BTN_EVENT.SIGN_IN
          });
        }

        if (BtnUtil.getServiceRecordStatus(this.orderInfo, this.merServiceConfig)) {
          config.push(
            {
              text: "服务记录",
              type: "primary",
              event: BTN_EVENT.SERVICE_RECORD
            }
          );
        }
      }


      const verifyItem = {
        text: "核销",
        type: "primary",
        event: BTN_EVENT.VERIFY
      };

      if (BtnUtil.getReedemStatus(this.orderInfo, this.merServiceConfig)) {
        config.push(verifyItem);
      }

      return config;
    },
    tableList() {
      return getTableList(this.orderInfo, this.formData);
    }
  },
  onLoad(options) {
    this.orderId = options.id;
    this.merId = options.mer_id;
    this.handleGetMerServiceConfig();
  },
  onShow() {
    this.handleGetOrderDetail();
  },
  methods: {
    async handleGetMerServiceConfig() {
      const res = await getMerStaffCheckinConfig(this.merId);
      this.merServiceConfig = res.data;
    },
    handleBottomBarAction(event) {
      switch (event) {
        case BTN_EVENT.REMARK:
          this.handleOpenRemarkPanel();
          break;
        case BTN_EVENT.SERVICE_RECORD:
          uni.navigateTo({
            url: `/pages/staff/service_record?order_id=${this.orderInfo.order_id}&mer_id=${this.orderInfo.mer_id}`
          });
          break;
        case BTN_EVENT.SIGN_IN:
          uni.navigateTo({
            url: `/pages/staff/checkin?order_id=${this.orderInfo.order_id}&mer_id=${this.orderInfo.mer_id}`
          });
          break;
        case BTN_EVENT.VERIFY:
          this.handleVerify();
          break;
      }
    },
    async handleSaveRemark({ remark }) {
      if (!remark) {
        this.$util.Tips({
          title: "请输入备注信息",
          icon: "none"
        });
        return;
      }

      uni.showLoading({
        mask: true
      });
      try {
        const res = await saveStaffOrderRemark(this.orderInfo.order_id, { remark });
        uni.hideLoading();
        this.$util.Tips({
          title: res.message,
          icon: "none"
        });
        this.handleGetOrderDetail();
        this.remarkPanelVisible = false;
      } catch (err) {
        uni.hideLoading();
        this.$util.Tips({
          title: err,
          icon: "none"
        });
      }
    },
    async handleVerify() {
      const [err, { confirm }] = await uni.showModal({
        title: "提示",
        content: `确定要核销此订单吗？`,
      });
      if (err || !confirm) return;
      uni.showLoading({
        mask: true
      });
      try {
        const res = await verifyStaffOrder(this.orderInfo.order_id, {
          mer_id: this.orderInfo.mer_id
        });
        uni.hideLoading();
        this.$util.Tips({
          title: res.message,
          icon: "none"
        });
        this.handleGetOrderDetail();
      } catch (err) {
        uni.hideLoading();
        this.$util.Tips({
          title: err,
          icon: "none"
        });
      }
    },
    async handleGetOrderDetail() {
      try {
        const res = await getStaffOrderDetail(this.orderId);
        addBookingOrderType(res.data);
        this.rawOrderInfo = res.data;

        const formId = this.rawOrderInfo.orderProduct[0].cart_info.product.mer_form_id;
        if (formId) {
          const formResponse = await systemFormData(formId);
          this.formData = formResponse.data;
        }
      } catch (err) {
        this.$util.Tips({
          title: err,
          icon: "none"
        });
      }
    }
  }
}
</script>

<style scoped lang="scss">
.nav-bar-wrapper {
  position: sticky;
  top: 0;
  z-index: 2;
  background: linear-gradient(90deg, #2291f8 0%, #1cd1dc 100%);
}

.order-body {
  margin-top: -1px;
  min-height: 100vh;
  position: relative;
  --bottom-bar-height: 108rpx;
  padding-bottom: calc(var(--bottom-bar-height) + var(--safe-area-inset-bottom) + 30rpx);

  .body-bg1 {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 212rpx;
    background-image: linear-gradient(90deg, #2291f8 0%, #1cd1dc 100%);
  }

  .body-bg2 {
    position: absolute;
    top: 164rpx;
    left: 0;
    height: 50rpx;
    width: 100%;
    background: linear-gradient(0deg, #f5f5f5 0%, rgba(245, 245, 245, 0) 100%);
  }

  .order-body-wrapper {
    padding: 0 20rpx;
    position: relative;
  }
}
</style>
