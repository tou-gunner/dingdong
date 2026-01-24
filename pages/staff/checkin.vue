<template>
  <BaseContainer>
    <view class="checkin-bg" />
    <view class="checkin-bg2" />
    <view class="checkin-container">
      <NavBar :title="$t('staff.checkin_title')" lightText />
      <view class="checkin-body" :class="{ 'safe-bottom-env': safeAreaBottomSize > 0 }">
        <OrderAddress :orderInfo="orderInfo" v-if="orderInfo" />
        <view class="checkin-box">
          <button class="checkin-btn" :disabled="!allowCheckin" @click="handleCheckin">
            <view class="checkin-btn-text">{{ checkinBtnText }}</view>
            <view class="checkin-btn-time">{{ formatTime }}</view>
          </button>
          <view class="checkin-box-tips">
            {{
              allowCheckin ? this.$t('staff.checkin_in_area') : this.$t('staff.checkin_out_area')
            }}
          </view>
          <view class="checkin-address-info">
            <text class="iconfont icon-ic_location51"></text>
            <text class="overflow-text checkin-address-info__text">{{ addressInfo }}</text>
            <button class="checkin-address__refresh" @click="refreshLocation">{{$t('common.refresh')}}</button>
          </view>
        </view>
      </view>
      <CheckinPopup v-if="checkinPopupVisible" :time="formatTime" :address="addressInfo" :orderId="orderId"
        @cancel="handleCheckinCancel" :takePhoto="checkInConfig && checkInConfig.checkin_take_photo == 1" />
    </view>
  </BaseContainer>
</template>

<script>
import BaseContainer from "@/components/common/base_container.vue";
import NavBar from "@/components/common/base_nav_bar.vue";
import OrderAddress from "@/components/shared-order/order_address.vue";
import { getSystemInfo } from "@/utils/device";
import dayjs from "@/plugin/dayjs/dayjs.min.js";
import {
  getGeocoder
} from '@/api/store.js';
import { getDistanceInMeters } from "@/utils/location";
import CheckinPopup from "@/pages/staff/components/checkin_popup.vue";
import { getStaffOrderDetail, geocoding, getMerStaffCheckinConfig } from "@/api/staff";

export default {
  components: {
    BaseContainer,
    NavBar,
    OrderAddress,
    CheckinPopup
  },
  data() {
    const systemInfo = getSystemInfo();
    return {
      merId: null,
      orderId: null,
      orderInfo: null,
      customerLocation: null,
      checkInConfig: null,

      safeAreaBottomSize: systemInfo.safeAreaInsets.bottom,
      formatTime: "00:00:00",
      inCheckinArea: false,
      addressInfo: "获取位置中...",
      location: null,
      checkinLocation: null,
      checkinPopupVisible: false
    };
  },
  onLoad(options) {
    this.orderId = options.order_id;
    this.merId = options.mer_id;
    this.handleGetOrderDetail();
    this.getMerStaffCheckinConfig();
    this.getLocation(true);
    this.timeDisplayTimer();
  },
  computed: {
    checkinBtnText() {
      if (this.hasClockRecord) return "已打卡";
      if (!this.allowCheckin) return "无法打卡";
      if (this.checkInConfig.enable_checkin == 0) return "无需打卡";
      return "点击打卡";
    },
    locationDiff() {
      return {
        location: this.location,
        customerLocation: this.customerLocation,
        checkInConfig: this.checkInConfig
      };
    },
    hasClockRecord() {
      if (!this.orderInfo) return false;
      const { clock_in_info } = this.orderInfo;
      if (clock_in_info && clock_in_info.clock_time) {
        return true;
      }
      return false;
    },
    allowCheckin() {
      // 在这里判断是否需要在范围内进行定位打卡
      // 必须获取到打卡配置和订单信息之后再判断是否允许打卡
      if (!this.checkInConfig || !this.orderInfo) return false;
      if (this.hasClockRecord) return false;
      return this.inCheckinArea;
    }
  },
  watch: {
    locationDiff({ location, customerLocation, checkInConfig }) {
      if (!checkInConfig) return;
      if (checkInConfig.enable_checkin == 0) {
        // 如果打卡功能关闭，则设置为不在范围内
        this.inCheckinArea = false;
        return;
      }

      if (!checkInConfig.checkin_radius) {
        // 如果不限制打卡地址，则设置为在范围内
        this.inCheckinArea = true;
        return;
      };

      if (!location || !customerLocation) return;
      const distance = getDistanceInMeters(location, customerLocation);
      this.inCheckinArea = distance < checkInConfig.checkin_radius;
    }
  },
  methods: {
    async getMerStaffCheckinConfig() {
      try {
        const res = await getMerStaffCheckinConfig(this.merId);
        this.checkInConfig = res.data;
      } catch (error) {
        this.$util.Tips({
          title: error,
          icon: "none"
        });
      }
    },
    async getLocationByAddress(address) {

      try {
        const result = await geocoding(address);
        const { lng: longitude, lat: latitude } = result.data.location;
        this.customerLocation = {
          latitude: Number(latitude),
          longitude: Number(longitude)
        };
      } catch (error) {
        this.$util.Tips({
          title: error,
          icon: "none"
        });
      }
    },
    async handleGetOrderDetail() {
      try {
        const res = await getStaffOrderDetail(this.orderId);
        this.orderInfo = res.data;
        this.getLocationByAddress(this.orderInfo.user_address);
      } catch (err) {
        this.$util.Tips({
          title: err,
          icon: "none"
        });
      }
    },
    handleCheckinCancel() {
      this.checkinPopupVisible = false;
    },
    async handleCheckin() {
      this.checkinPopupVisible = true;
    },
    async refreshLocation() {
      await this.getLocation();
    },
    async getLocation(firstCheck = false) {
      if (this._checkLocationLoading) return;
      this._checkLocationLoading = true;
      try {
        const [error, result] = await uni.getLocation({
          isHighAccuracy: true
        });
        if (error) throw new Error(error.errMsg);
        const { latitude, longitude } = result;
        this.location = {
          latitude,
          longitude
        };
        const geoCoderRes = await getGeocoder({
          lat: latitude,
          long: longitude
        });
        this.addressInfo = geoCoderRes.data.address;
        firstCheck !== true && this.$util.Tips({
          title: "刷新位置成功",
          icon: "none"
        });
      } catch (error) {
        this.$util.Tips({
          title: error.message,
          icon: 'none'
        });
      } finally {
        this._checkLocationLoading = false;
      }
    },
    timeDisplayTimer() {
      const setCurrentTime = () => {
        this.formatTime = dayjs().format("HH:mm:ss");
      };
      setCurrentTime();
      this._displayTimer = setInterval(setCurrentTime, 1000);
    }
  },
  destroyed() {
    clearInterval(this._displayTimer);
  }
}
</script>

<style scoped lang="scss">
.checkin-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: calc(var(--nav-bar-height) + 212rpx);
  background-image: linear-gradient(90deg, #2291F8 0%, #1CD1DC 100%);
}

.checkin-bg2 {
  position: absolute;
  top: calc(var(--nav-bar-height) + 164rpx);
  left: 0;
  width: 100%;
  height: 50rpx;
  background-image: linear-gradient(0deg, #F5F5F5 0%, rgba(245, 245, 245, 0) 100%);
}

.checkin-container {
  height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
}

.checkin-body {
  padding: 18px 10px 10px;
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 10px;

  &.safe-bottom-env {
    padding-bottom: var(--safe-area-inset-bottom);
  }
}

.checkin-box {
  flex: 1;
  background-color: #fff;
  border-radius: 24rpx;
}

.checkin-btn {
  display: flex;
  flex-flow: column;
  align-items: center;
  gap: 20rpx;
  justify-content: center;
  color: #fff;
  width: 272rpx;
  height: 272rpx;
  border-radius: 50%;
  margin: 164rpx auto 0;

  background: linear-gradient(159deg, #1CD1DC -13%, #2291F8 43%), linear-gradient(139deg, #47B5FF 12%, #0F86F5 86%);
  box-shadow: 0rpx 10rpx 32rpx 0rpx rgba(48, 139, 248, 0.5);

  &[disabled] {
    background: linear-gradient(139deg, #D0D3D9 12%, #C3C7CE 85%);
    box-shadow: 0rpx 10rpx 32rpx 0rpx rgba(122, 140, 162, 0.3);
    color: #fff;
  }
}

.checkin-btn-text {
  font-size: 40rpx;
  font-weight: 500;
}

.checkin-btn-time {
  font-size: 32rpx;
  font-weight: 400;
  opacity: 0.7;
  font-variant-numeric: tabular-nums;
  font-family: initial;
}

.checkin-box-tips {
  text-align: center;
  font-size: 28rpx;
  margin-top: 60rpx;
  margin-bottom: 18rpx;
}

.checkin-address-info {
  width: 502rpx;
  margin: 0 auto;
  overflow: hidden;
  display: flex;
  align-items: center;
  color: #999;
  justify-content: center;

  .iconfont {
    font-size: 28rpx;
    margin-right: 4rpx;
  }

  .checkin-address__refresh {
    flex-shrink: 0;
    margin-left: 12rpx;
    color: #308Bf8;
    font-size: 12px;
  }
}
</style>
