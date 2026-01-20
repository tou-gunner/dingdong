<template>
  <BaseContainer>
    <!-- #ifdef MP || APP-PLUS -->
    <view class="nav-bar-wrapper">
      <BaseNavBar title="ລາຍລະອຽດອໍເດີ" lightText />
    </view>
    <!-- #endif -->
    <view class="order-body">
      <view class="body-bg1" />
      <view class="body-bg2" />
      <view class="order-body-wrapper" v-if="orderInfo">
        <OrderDetailStatus :orderInfo="orderInfo" @remark="handleOpenRemarkPanel" />
        <OrderDetailGoods :orderInfo="orderInfo" />
				<PickUpPointInfo v-if="orderInfo.take" :orderInfo="orderInfo"/>
				<DeliveryInfo v-if="orderInfo.deliveryOrder" :orderInfo="orderInfo"/>
        <OrderDetailInfo :orderInfo="orderInfo" />
			</view>
    </view>
    <PriceChange :change="remarkPanelVisible" @closechange="handleCloseRemarkPanel" :orderInfo="orderInfo"
      @savePrice="handleSaveRemark" status="1" v-if="orderInfo" />
		<view v-if="orderInfo" class="bottom-box">
			<view class="btn-box remarks" @click="handleOpenRemarkPanel">
				ໝາຍເຫດອໍເດີ
			</view>
			<view v-if="orderInfo.status == 1" class="btn-box confirm" @click="confirmServed">
				ຢືນຢັນສົ່ງແລ້ວ
			</view>
			<view v-if="orderInfo.status == 0" class="btn-box confirm" @click="receiveOrder">
				ຮັບໜ້າວຽກ
			</view>
		</view>
  </BaseContainer>
</template>

<script>
import BaseContainer from "@/components/common/base_container.vue";
import BaseNavBar from "@/components/common/base_nav_bar.vue";

// 原公共组件
import OrderDetailStatus from "@/components/shared-order/order_detail_status.vue";
import OrderDetailGoods from "@/components/shared-order/order_detail_goods.vue";
import OrderDetailTable from "@/components/shared-order/order_detail_table.vue";
import OrderDetailInfo from "@/components/shared-order/order_detail_info.vue";
// import OrderDetailBottomBar from "@/components/shared-order/order_detail_bottom_bar.vue";
import PriceChange from "@/components/shared-order/PriceChange/index.vue";
// 新建公共组件
import PickUpPointInfo from "@/components/shared-order/order_detail_pick_info.vue";
import DeliveryInfo from "@/components/shared-order/order_detail_delivery_info.vue";

// import OrderBottomBtn from "@/components/shared-order/order_bottom_btn.vue"

import { toggleRemarkPanelMixin } from "@/mixins/toggle-status";
import { 
	getStaffOrderDetail, 
	verifyStaffOrder, 
	getMerStaffCheckinConfig ,
	getOrderDetail,
	saveOrderRemark,
	receiveServedOrder,
	confirmeServedOrder
} from "@/api/staff";
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
		PickUpPointInfo,
		DeliveryInfo,
    OrderDetailInfo,
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
            text: "ໝາຍເຫດອໍເດີ",
            type: "plain",
            event: BTN_EVENT.REMARK
          }
        );
      }


      if (!this.orderInfo.is_instore_order) {
        if (BtnUtil.getCheckinStatus(this.orderInfo, this.merServiceConfig)) {
          config.push({
            text: "ເຊັກອິນເຂົ້າ",
            type: "primary",
            event: BTN_EVENT.SIGN_IN
          });
        }

        if (BtnUtil.getServiceRecordStatus(this.orderInfo, this.merServiceConfig)) {
          config.push(
            {
              text: "ບັນທຶກການບໍລິການ",
              type: "primary",
              event: BTN_EVENT.SERVICE_RECORD
            }
          );
        }
      }


      const verifyItem = {
        text: "ກວດສອບ",
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
  },
  onShow() {
    this.handleGetOrderDetail();
  },
  methods: {
    async handleSaveRemark({ remark }) {
      if (!remark) {
        this.$util.Tips({
          title: "ກະລຸນາປ້ອນຂໍ້ມູນໝາຍເຫດ",
          icon: "none"
        });
        return;
      }

      uni.showLoading({
        mask: true
      });
      try {
        const res = await saveOrderRemark(this.orderInfo.order_id, { remark });
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
    async handleGetOrderDetail() {
      try {
        const res = await getOrderDetail(this.orderId);
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
    },
		// 确认送达
		async confirmServed() {
			const [err, { confirm }] = await uni.showModal({
			  title: "ແຈ້ງເຕືອນ",
			  content: `ແນ່ໃຈວ່າຕ້ອງການຢືນຢັນສົ່ງແລ້ວບໍ?`,
			});
			if (err || !confirm) return;
			uni.showLoading({
			  mask: true
			});
			try {
				const data = {
					mer_id: this.orderInfo.mer_id
				}
				const res = await confirmeServedOrder(this.orderInfo.order_id, data);
				uni.hideLoading();
				this.$util.Tips({
				  title: res.message,
				  icon: "none"
				});
				uni.navigateTo({
					url: '/pages/delivery/my_delivery'
				})
			} catch (err) {
			  uni.hideLoading();
			  this.$util.Tips({
			    title: err,
			    icon: "none"
			  });
			}
		},
		// 领取订单
		async receiveOrder() {
			const [err, { confirm }] = await uni.showModal({
			  title: "ແຈ້ງເຕືອນ",
			  content: `ແນ່ໃຈວ່າຕ້ອງການຮັບໜ້າວຽກນີ້ບໍ?`,
			});
			if (err || !confirm) return;
			uni.showLoading({
			  mask: true
			});
			try {
				const res = await receiveServedOrder(this.orderInfo.order_id);
				uni.hideLoading();
				this.$util.Tips({
				  title: res.message,
				  icon: "none"
				});
				uni.navigateTo({
					url: '/pages/delivery/my_delivery'
				})
			} catch (err) {
			  uni.hideLoading();
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
.bottom-box {
		position: fixed;
		display: flex;
		width: 100%;
		height: 106rpx;
		background: #FFFFFF;
		bottom: 0;
		padding: 0 20rpx;
		align-items: center;
		justify-content: flex-end;
		.btn-box {
			display: flex;
			width: 160rpx;
			height: 64rpx;
			border-radius: 50rpx;
			justify-content: center;
			align-items: center;
			&+.btn-box {
				margin-left: 18rpx;
			}
		}
		.remarks {
			border: 1rpx solid #DDDDDD;
			font-weight: 500;
			font-size: 24rpx;
			color: #666666;
		}
		.confirm {
			background: #2291F8;
			border: 1rpx solid #2291F8;
			font-weight: 500;
			font-size: 24rpx;
			color: #FFFFFF;
		}
	}
</style>
