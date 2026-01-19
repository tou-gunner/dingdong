<template>
  <BaseContainer>
    <view class="nav-bar-wrapper">
      <BaseNavBar title="订单改约" />
    </view>
    <template v-if="orderInfo">
      <view class="card good-card" v-for="product of orderInfo.orderProduct" :key="product.order_product_id">
        <image :src="product.cart_info.productAttr.image" mode="aspectFill" class="good-card__image" />
        <view class="good-card__info">
          <view class="good-card__info__title overflow-text">{{ product.cart_info.product.store_name }}</view>
          <view class="good-card__info__sku">{{ product.cart_info.productAttr.sku }}</view>
          <view class="good-card__info__price">
            <view class="price-box">
              ￥<text class="price-int">{{ getPriceInter(product.cart_info.productAttr.price) }}</text>.{{
                getPriceDecimal(product.cart_info.productAttr.price) }}
            </view>
            <view class="good-count">x{{ product.product_num }}</view>
          </view>
        </view>
      </view>

      <view class="card booking-form">
        <BaseSystemForm ref="bookingForm" :config="bookingForm" />
      </view>

      <template v-if="orderInfo.order_extend">
        <view class="card system-form" v-for="(formValue, index) of orderInfo.order_extend" :key="index">
          <view class="card-title">{{ formData ? formData.name : "表单信息" }}</view>
          <BaseSystemForm ref="systemForm" :formId="orderInfo.orderProduct[0].cart_info.product.mer_form_id"
          @metadata="handleFormMetadata" :defaultValues="formValue" />
        </view>
      </template>

      <view class="safe-placeholder"></view>

      <view class="form-btn-group">
        <button class="form-btn-group__btn confirm" @click="handleConfirm">确定</button>
      </view>
    </template>
  </BaseContainer>
</template>

<script>
import BaseContainer from "@/components/common/base_container.vue";
import BaseNavBar from "@/components/common/base_nav_bar.vue";
import BaseSystemForm from "@/components/common/base_system_form.vue";
import { getAdminOrderDetail, rescheduleBookingOrder } from "@/api/admin";
import { addBookingOrderType } from "@/utils/order";
import dayjsMin from "@/plugin/dayjs/dayjs.min";

export default {
  components: {
    BaseContainer,
    BaseNavBar,
    BaseSystemForm
  },
  data() {
    return {
      orderId: null,
      merId: null,
      formData: null,
      orderInfo: null,
      bookingForm: []
    }
  },
  onLoad(options) {
    this.orderId = options.order_id;
    this.merId = options.mer_id;
    this.getOrderInfo();
  },
  methods: {
    handleFormMetadata(formData) {
      this.formData = formData;
    },
    generateBookingForm() {
      const buildTimeRangeIndex = (timeRange) => {
        const [startTime, endTime] = timeRange.split("-");
        const [startHour, startMinute] = startTime.split(":");
        const [endHour, endMinute] = endTime.split(":");
        return [
          Number(startHour),
          Number(startMinute),
          Number(endHour),
          Number(endMinute)
        ];
      };
      this.bookingForm = [
        {
          key: "order_type",
          label: "预约方式",
          type: "selects",
          index: this.orderInfo.is_instore_order ? 1 : 0,
          value: this.orderInfo.is_instore_order ? "到店服务" : "上门服务",
          range: [
            {
              val: "上门服务"
            },
            {
              val: "到店服务"
            }
          ]
        },
        {
          key: "reservation_datetimerange",
          label: "预约日期",
          start: dayjsMin().format("YYYY-MM-DD"),
          type: "dates",
          value: this.orderInfo.orderProduct[0].reservation_date,
          placeholder: "请选择"
        },
        {
          key: "reservation_time_range",
          label: "预约时间",
          type: "timeranges",
          indexValue: buildTimeRangeIndex(this.orderInfo.orderProduct[0].reservation_time_part),
          value: this.orderInfo.orderProduct[0].reservation_time_part.split("-"),
          placeholder: "请选择"
        },
        {
          key: "real_name",
          label: "联系人",
          type: "texts",
          placeholder: "请输入姓名",
          value: this.orderInfo.real_name
        },
        {
          key: "user_phone",
          label: "联系电话",
          type: "texts",
          placeholder: "请输入联系电话",
          value: this.orderInfo.user_phone
        },
        {
          key: "user_address",
          label: "详细地址",
          type: "textarea",
          placeholder: "请输入详细地址",
          value: this.orderInfo.user_address
        }
      ];
    },
    getPriceInter(price) {
      return price.toString().split(".")[0];
    },
    getPriceDecimal(price) {
      return price.toString().split(".")[1];
    },
    async getOrderInfo() {
      uni.showLoading({ mask: true });
      try {
        const res = await getAdminOrderDetail(this.merId, this.orderId);
        addBookingOrderType(res.data);
        this.orderInfo = res.data;
        this.generateBookingForm();
        uni.hideLoading();
      } catch (err) {
        uni.hideLoading();
        this.$util.Tips({
          title: err,
          icon: "none"
        });
      }
    },
    async handleConfirm() {
      const rescheduleFormData = this.$refs.bookingForm.getData(true);
      if (!rescheduleFormData) return;
      const rescheduleDataMap = {};

      Object.entries(rescheduleFormData).forEach(([key, info]) => {
        rescheduleDataMap[key] = info.value;
      });

      const timePart = rescheduleDataMap.reservation_time_range.split("-").map(i => i.trim());



      const rescheduleData = {
        order_type: rescheduleDataMap.order_type === "上门服务" ? 0 : 1,
        reservation_date: rescheduleDataMap.reservation_datetimerange,
        part_start: timePart[0],
        part_end: timePart[1],
        real_name: rescheduleDataMap.real_name,
        user_phone: rescheduleDataMap.user_phone,
        user_address: rescheduleDataMap.user_address,
      };

      if (this.orderInfo.order_extend?.length && this.$refs.systemForm) {
        const systemFormDataList = this.$refs.systemForm.map(item => item.getData());
        if (systemFormDataList.some(item => !item)) return;

        const orderExtendData = systemFormDataList.map(item => {
          return Object.values(item).reduce((acc, cur) => {
            return {
              ...acc,
              [cur.label]: cur.value
            }
          }, {});
        });
        rescheduleData.order_extend = orderExtendData;
      }

      uni.showLoading({ mask: true });

      try {
        const res = await rescheduleBookingOrder(this.merId, this.orderId, rescheduleData);
        uni.hideLoading();
        this.$util.Tips({
          title: res.message,
          icon: "success"
        });
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
  z-index: 1;
}


$base-btn-height: 120rpx;

.card {
  background-color: #fff;
  border-radius: 24rpx;
  padding: 32rpx 24rpx;
  margin: 20rpx 20rpx 0;
}

.good-card {
  display: flex;
  gap: 20rpx;

  &__image {
    width: 136rpx;
    height: 136rpx;
    border-radius: 16rpx;
  }

  &__info {
    flex: 1;
    overflow: hidden;

    &__title {
      font-size: 28rpx;
      color: #333;
    }

    &__sku {
      margin: 12rpx 0 16rpx;
      font-size: 24rpx;
      color: #999;
    }

    &__price {
      display: flex;
      align-items: flex-end;
      gap: 12rpx;

      .price-box {
        font-family: dinProSemiBold;
        font-size: 20rpx;
        display: flex;
        align-items: flex-end;
      }

      .price-int {
        font-size: 32rpx;
      }

      .good-count {
        margin-left: auto;
        font-size: 24rpx;
        color: #999;
      }
    }
  }
}

.form-card {}

.booking-form {
  padding: 16rpx 24rpx;

  /deep/ .record-form-container {
    --item-min-height: 72rpx;
  }
}

.system-form {
  padding: 0 24rpx 16rpx;

  /deep/ .record-form-container {
    --item-min-height: 80rpx;
  }

  .card-title {
    font-size: 28rpx;
    font-weight: 500;
    color: #333333;
    padding-top: 32rpx;
    margin-bottom: 20rpx;
  }
}

.safe-placeholder {
  height: calc(#{$base-btn-height} + 20rpx + var(--safe-area-inset-bottom));
}

.form-btn-group {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
  height: calc(#{$base-btn-height} + var(--safe-area-inset-bottom));
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
