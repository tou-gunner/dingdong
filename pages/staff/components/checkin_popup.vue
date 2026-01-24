<template>
  <view>
    <view v-if="stage === STAGE.DIRECT_SUBMIT"></view>
    <view v-else-if="stage === STAGE.FILL_FORM" class="popup-bg">
      <view class="popup-form-container" :style="{ 'backgroundImage': `url(${domain}/static/images/checkin-bg.png)` }">
        <view class="popup-form-wrapper">
          <view class="popup-form-title">{{$t('staff.confirm_checkin')}}</view>
          <view class="popup-form-date">
            <text class="iconfont icon-ic_clock" />
            {{$t('staff.checkin_time')}}
            {{ time }}
          </view>
          <view class="popup-form-location">
            <text class="iconfont icon-ic_location51" />
            {{ address }}
          </view>
          <view class="popup-form-input__wrapper">
            <view class="popup-form-input__inner_wrapper">
              <textarea class="popup-form-input" :placeholder="$t('staff.input_checkin_remark')" fixed :maxlength="maxLength"
                placeholder-style="color: #9e9e9e;" v-model="form.remark" />
              <view class="popup-form-input__count">
                <text>{{ form.remark.length }}/{{ maxLength }}</text>
              </view>
            </view>
            <view class="popup-form-image-list" @click="handleImageListClick">
              <view class="popup-form-image-item" v-for="(image, index) in form.images" :key="index">
                <image class="popup-form-image-item__image" mode="aspectFill" :src="image" />
                <button class="popup-form-image-item__delete" :data-event="EVENT.DELETE_IMAGE" :data-index="index">
                  <text class="iconfont icon-ic_close" :data-event="EVENT.DELETE_IMAGE" :data-index="index" />
                </button>
              </view>
              <view class="popup-form-image-item popup-form-image-item__add"
                :style="{ 'background': `url(${domain}/static/images/checkin-form-camera.png) no-repeat center / 52rpx` }"
                :data-event="EVENT.ADD_IMAGE" v-if="form.images.length < imageCountLimit">
                <text class="iconfont icon-ic_add" />
              </view>
            </view>
          </view>
        </view>

        <view class="popup-form-button-wrapper">
          <button class="popup-form-button" @click="handleCheckinCancel">取消</button>
          <button class="popup-form-button confirm" @click="handleCheckinConfirm">确认打卡</button>
        </view>
      </view>
    </view>
    <view v-else class="popup-bg popup-bg-success">
      <view class="popup-result-container">
        <image :src="`${domain}/static/images/checkin-succ.png`" v-if="stage === STAGE.SUCCESS" mode="widthFill"
          class="popup-result-image" />
        <image :src="`${domain}/static/images/checkin-fail.png`" v-else mode="widthFill" class="popup-result-image" />


        <view class="popup-result-title">
          {{
            stage === STAGE.SUCCESS ? `打卡成功 ${form.checkInTime}` : "打卡失败"
          }}
        </view>
        <view class="popup-result-description">
          {{ stage === STAGE.SUCCESS ? "感谢您的辛苦付出～" : "打卡失败，请再试一次" }}
        </view>
        <button class="popup-result-btn" v-if="stage === STAGE.SUCCESS" @click="handleCheckinSuccess">我知道了</button>
        <button class="popup-result-btn" v-else @click="handleRetryCheckin">重新打卡</button>
      </view>
    </view>
  </view>
</template>

<script>
import { checkinStaffOrder } from "@/api/staff";
import dayjs from "@/plugin/dayjs/dayjs.min.js";
import { STAFF_CHECKIN_SUCC_EVENT } from "@/utils/constants";
import { HTTP_REQUEST_URL as domain } from "@/config/app";

const STAGE = {
  DIRECT_SUBMIT: 0,
  FILL_FORM: 1,
  SUCCESS: 2,
  FAIL: 3
};

const EVENT = {
  DELETE_IMAGE: 'delete-image',
  ADD_IMAGE: 'add-image',
}

export default {
  props: {
    time: String,
    address: String,
    orderId: String,
    takePhoto: Boolean
  },
  data() {
    const { takePhoto } = this;
    return {
      domain,
      STAGE,
      EVENT,
      maxLength: 100,
      stage: takePhoto ? STAGE.FILL_FORM : STAGE.DIRECT_SUBMIT,

      imageCountLimit: 9,
      form: {
        checkInTime: this.time,
        remark: "",
        images: []
      }
    };
  },
  async created() {
    if (!this.takePhoto) {
      const [err, { confirm }] = await uni.showModal({
        title: "提示",
        content: `确定要打卡吗？`,
      });
      if (err || !confirm) {
        this.handleCheckinCancel();
      } else {
        this.handleCheckinConfirm();
      }
    }
  },
  methods: {
    handleCheckinCancel() {
      this.$emit("cancel");
    },
    async handleCheckinConfirm() {
      const { remark, images } = this.form;
      // if (!remark) return this.$util.Tips({
      //   title: "请输入打卡备注",
      //   icon: "none"
      // });
      // if (images.length === 0) return this.$util.Tips({
      //   title: "请上传打卡照片",
      //   icon: "none"
      // });

      uni.showLoading({
        mask: true
      });

      try {
        const checkinTime = dayjs().format("HH:mm:ss");
        const res = await checkinStaffOrder(this.orderId, {
          clock_in_info: {
            clock_time: dayjs().format("YYYY-MM-DD HH:mm:ss"),
            address: this.address,
            remark,
            images
          }
        });
        uni.hideLoading();
        this.form.checkInTime = checkinTime;
        this.stage = STAGE.SUCCESS;
        uni.$emit(STAFF_CHECKIN_SUCC_EVENT, this.orderId);
      } catch (err) {
        uni.hideLoading();
        this.stage = STAGE.FAIL;
        this.$util.Tips({
          title: err,
          icon: "none"
        });
      }


    },
    handleUploadImage() {
      this.$util.uploadImageOne("upload/image", (res) => {
        this.form.images.push(res.data.path);
      });
    },
    handleImageListClick(e) {
      const { event, index } = e.target.dataset;
      if (event === undefined) return;

      switch (event) {
        case EVENT.DELETE_IMAGE:
          this.form.images.splice(index, 1);
          break;
        case EVENT.ADD_IMAGE:
          this.handleUploadImage();
          break;
      }
    },
    handleCheckinSuccess() {
      uni.navigateBack();
    },
    handleRetryCheckin() {
      this.stage = STAGE.FILL_FORM;
    }
  }
};
</script>

<style scoped lang="scss">
.popup-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.popup-bg-success {
  background-color: rgba(0, 0, 0, 0.8);
}

.popup-form-container {
  width: 654rpx;
  border-radius: 12px;
  background: none no-repeat left top / 100% auto #fff;
  overflow: hidden;


  .popup-form-wrapper {
    padding: 40rpx 27rpx 40rpx;

    .popup-form-title {
      font-size: 32rpx;
      font-weight: 500;
      margin-bottom: 14rpx;
    }
  }

  .popup-form-date,
  .popup-form-location {
    display: flex;
    align-items: center;
    font-size: 24rpx;

    .iconfont {
      font-size: 28rpx;
      margin-right: 5rpx;
    }
  }

  .popup-form-date {
    color: #2291F8;
  }

  .popup-form-location {
    margin-top: 12rpx;
    color: #999;
  }

  .popup-form-input__wrapper {
    margin-top: 28rpx;
    background-color: #F9F9F9;
    border-radius: 8px;
    padding: 28rpx 20rpx 20rpx;
  }

  .popup-form-input__inner_wrapper {
    position: relative;
  }

  .popup-form-input {
    font-size: 14px;
    line-height: 40rpx;
    height: 200rpx;
    width: 100%;
  }

  .popup-form-input__count {
    text-align: right;
    font-size: 28rpx;
  }

  .popup-form-image-list {
    display: flex;
    flex-flow: row wrap;
    --gap: 20rpx;
    --row-count: 4;
    gap: var(--gap);
    font-size: 0;
    margin-top: 12px;
  }


  .popup-form-image-item {
    --size: calc((100% - var(--gap) * (var(--row-count) - 1)) / var(--row-count));
    width: var(--size);
    aspect-ratio: 1 / 1;
    border-radius: 6px;
    background-color: #F9F9F9;
    position: relative;
  }

  .popup-form-image-item__image {
    width: 100%;
    height: 100%;
    border-radius: 6px;
  }

  .popup-form-image-item__delete {
    position: absolute;
    top: -16rpx;
    right: -12rpx;

    width: 32rpx;
    height: 32rpx;
    background-color: #ccc;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;

    .iconfont {
      font-size: 24rpx;
      color: #fff;
    }
  }

  .popup-form-image-item__add {
    border: 1rpx solid #ddd;
    background-color: #f5f5f5;
  }

  .popup-form-button-wrapper {
    border-top: 1rpx solid #eee;
    display: flex;
  }

  .popup-form-button {
    flex: 1;
    height: 90rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 30rpx;
    color: #666;
    border-radius: 0;
  }

  .popup-form-button.confirm {
    color: #2291F8;
    border-left: 1rpx solid #eee;
  }
}

.popup-result-container {
  border-radius: 12px;
  background: #FFFFFF;
  width: 560rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 70rpx 0 86rpx;

  .popup-result-image {
    width: 350rpx;
    height: 222rpx;
    margin-bottom: 60rpx;
  }

  .popup-result-title {
    font-size: 36rpx;
    font-weight: 500;
  }

  .popup-result-description {
    font-size: 28rpx;
    color: #999999;
    margin: 16rpx 0 68rpx;
  }

  .popup-result-btn {
    width: 340rpx;
    height: 88rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50rpx;
    background: #2291F8;
    color: #fff;
    font-size: 28rpx;
    font-weight: 500;
  }


}
</style>
