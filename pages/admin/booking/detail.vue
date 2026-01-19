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
        <OrderDetailStatus @remark="handleOpenRemarkPanel" :orderInfo="orderInfo" />
        <OrderDetailUserInfo :orderInfo="orderInfo" />
        <OrderDetailGoods :orderInfo="orderInfo" />
        <OrderDetailTable :list="item.list" :title="item.title" v-for="(item, index) in tableList" :key="index" />
        <OrderDetailInfo :orderInfo="orderInfo" />
        <OrderDetailBottomBar :config="btnConfig" @action="handleBottomBarAction" />
      </view>
    </view>
    <PriceChange :change="remarkPanelVisible" @closechange="handleCloseRemarkPanel" :orderInfo="orderInfo"
      @savePrice="handleSaveRemark" status="1" v-if="orderInfo" />
    <OrderAssign ref="orderAssign" :merId="merId" @refresh="getOrderDetail" />
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
import OrderDetailUserInfo from "@/pages/admin/booking/components/order_detail_userinfo.vue";
import PriceChange from "@/components/shared-order/PriceChange/index.vue";
import { toggleRemarkPanelMixin } from "@/mixins/toggle-status";
import OrderAssign from "../components/order_assign.vue";
import { getAdminOrderDetail, setAdminOrderRemark, getMerStaffCheckinConfig } from "@/api/admin";
import { addBookingOrderType } from "@/utils/order";
import { getTableList } from "@/utils/order";
import { systemFormData } from "@/api/user";

const EVENT_TYPE = {
  ASSIGN: "assign",
  REASSIGN: "reassign",
  REMARK: "remark",
  RESCHEDULE: "reschedule"
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
    OrderDetailUserInfo,
    PriceChange,
    OrderAssign
  },
  data() {
    return {
      orderId: null,
      merId: null,
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
      if (!this.orderInfo) {
        return [];
      }

      const config = [
        {
          text: "订单备注",
          type: "plain",
          event: EVENT_TYPE.REMARK
        }
      ];

      if (!this.orderInfo.paid) return config;

      if (this.orderInfo.status === 0) {
        config.push({
          text: "改约",
          type: "plain",
          event: EVENT_TYPE.RESCHEDULE
        });
      }

      if (!this.orderInfo.is_instore_order) {
        if (this.orderInfo.status === 0) {
          config.push({
            text: "派单",
            type: "primary",
            event: EVENT_TYPE.ASSIGN
          });
        } else if (this.orderInfo.status === 1) {
          config.push({
            text: "改派",
            type: "plain",
            event: EVENT_TYPE.REASSIGN
          });
        }
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
    this.getMerStaffCheckinConfig();
  },
  onShow() {
    this.getOrderDetail();
  },
  methods: {
    async getMerStaffCheckinConfig() {
      const res = await getMerStaffCheckinConfig(this.merId);
      this.merServiceConfig = res.data;
    },
    async getOrderDetail() {
      uni.showLoading({
        mask: true
      });
      try {
        const res = await getAdminOrderDetail(this.merId, this.orderId);
        addBookingOrderType(res.data);
        this.rawOrderInfo = res.data;
        uni.hideLoading();

        const formId = this.rawOrderInfo.orderProduct[0].cart_info.product.mer_form_id;
        if (formId) {
          const formResponse = await systemFormData(formId);
          this.formData = formResponse.data;
        }
      } catch (err) {
        uni.hideLoading();
        this.$util.Tips({
          title: err,
          icon: "none"
        });
      }
    },
    handleOpenAssignPage(orderId, isReassign = false) {
      this.$refs.orderAssign.openPanel(orderId, isReassign);
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
        const res = await setAdminOrderRemark(this.orderInfo.mer_id, this.orderInfo.order_id, { remark });
        uni.hideLoading();
        this.$util.Tips({
          title: res.message,
          icon: "none"
        });
        this.getOrderDetail();
        this.remarkPanelVisible = false;
      } catch (err) {
        uni.hideLoading();
        this.$util.Tips({
          title: err,
          icon: "none"
        });
      }
    },
    handleOpenRemarkPanel() {
      this.remarkPanelVisible = true;
    },
    handleBottomBarAction(event) {
      if (event === EVENT_TYPE.REMARK) {
        this.handleOpenRemarkPanel();
      } else if (event === EVENT_TYPE.ASSIGN) {
        this.handleOpenAssignPage(this.orderInfo.order_id);
      } else if (event === EVENT_TYPE.REASSIGN) {
        this.handleOpenAssignPage(this.orderInfo.order_id, true);
      } else if (event === EVENT_TYPE.RESCHEDULE) {
        uni.navigateTo({
          url: `/pages/admin/booking/reschedule?order_id=${this.orderInfo.order_id}&mer_id=${this.merId}`
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
