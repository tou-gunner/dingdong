<template>
  <form class="record-form-container">
    <view class="form-item" v-for="(item, index) of formConfig" :key="item.key">
      <view class="form-item-label" :data-required="item.required">{{ item.label }}</view>
      <view class="form-item-input-wrapper">
        <input v-if="item.type === 'texts'" :placeholder="item.placeholder" class="form-item-input"
          :type="item.inputType" v-model="item.value" placeholder-style="color: #ccc" />
        <textarea v-else-if="item.type === 'textarea'" :placeholder="item.placeholder" class="form-item-input"
          :type="item.inputType" v-model="item.value" placeholder-style="color: #ccc" auto-height />
        <picker v-else-if="item.type === 'selects'" :range="item.range" range-key="val" class="form-item-input"
          @change="handleSelectChange($event, item, index)" :value="item.index">
          <view class="form-item-input-content" :class="{ 'is-empty': !item.value }">
            {{ item.value || "请选择" }}
            <text class="iconfont icon-ic_rightarrow"></text>
          </view>
        </picker>
        <checkbox-group v-else-if="item.type === 'checkboxs'" @change="handleCheckboxChange($event, item, index)"
          class="form-item-checkbox-group">
          <label v-for="checkboxItem of item.range" :key="checkboxItem.val" class="form-item-checkbox-label">
            <checkbox :value="checkboxItem.val" :checked="item.value.includes(checkboxItem.val)" />
            {{ checkboxItem.val }}
          </label>
        </checkbox-group>
        <picker mode="date" v-else-if="item.type === 'dates'" class="form-item-input"
          @change="handleDateChange($event, item, index)" :value="item.value" :start="item.start">
          <view class="form-item-input-content" :class="{ 'is-empty': !item.value }">
            {{ item.value || item.placeholder }}
            <text class="iconfont icon-ic_rightarrow"></text>
          </view>
        </picker>
        <view class="form-item-input" v-else-if="item.type === 'citys'">
          <view class="form-item-input-content" :class="{ 'is-empty': !item.value.length }"
            @click="handleActiveCityPicker($event, item, index)">
            {{item.value.length ? item.value.map(i => i.name).join("/") : item.placeholder}}
            <text class="iconfont icon-ic_rightarrow"></text>
          </view>
          <CityPicker class="form-item-input-city" :display="item.active"
            @submit="handleCityChange($event, item, index)" :address="item.value"
            @changeClose="handleCityChangeClose($event, item, index)" :cityShow="item.cityShow" />
        </view>
        <uni-datetime-picker class="form-item-input daterange-picker" v-else-if="item.type === 'dateranges'"
          type="daterange" :border="false" :clear-icon="false" :placeholder="item.placeholder" :value="item.value"
          @change="handleDateRangeChange($event, item, index)">
          <view class="form-item-input-content" :class="{ 'is-empty': !item.value.length }">
            {{ item.value.length ? item.value.join(" ~ ") : item.placeholder }}
            <text class="iconfont icon-ic_rightarrow"></text>
          </view>
        </uni-datetime-picker>
        <uni-datetime-picker class="form-item-input daterange-picker" v-else-if="item.type === 'datetimerange'"
          type="datetimerange" :border="false" :clear-icon="false" :placeholder="item.placeholder" :value="item.value"
          @change="handleDateTimeRangeChange($event, item, index)">
          <view class="form-item-input-content" :class="{ 'is-empty': !item.value.length }">
            {{ item.value.length ? item.value.join(" ~ ") : item.placeholder }}
            <text class="iconfont icon-ic_rightarrow"></text>
          </view>
        </uni-datetime-picker>
        <radio-group class="form-item-input radio-group" v-else-if="item.type === 'radios'"
          @change="handleRadioChange($event, item, index)">
          <label v-for="radioItem in item.range" :key="radioItem.val">
            <radio :value="radioItem.val" :checked="item.value === radioItem.val" />
            {{ radioItem.val }}
          </label>
        </radio-group>
        <picker mode="time" v-else-if="item.type === 'times'" class="form-item-input"
          @change="handleTimeChange($event, item, index)" :value="item.value">
          <view class="form-item-input-content" :class="{ 'is-empty': !item.value }">
            {{ item.value || item.placeholder }}
            <text class="iconfont icon-ic_rightarrow"></text>
          </view>
        </picker>
        <picker mode="multiSelector" v-else-if="item.type === 'timeranges'" class="form-item-input"
          @change="handleTimeRangeChange($event, item, index)" :value="item.indexValue" :range="timeRange">
          <view class="form-item-input-content" :class="{ 'is-empty': !item.value.length }">
            {{ item.value.length ? item.value.join(" ~ ") : item.placeholder }}
            <text class="iconfont icon-ic_rightarrow"></text>
          </view>
        </picker>
        <view class="form-item-input image-list" v-else-if="item.type === 'uploadPicture'"
          @click="handleImageClick($event, item, index)">
          <view class="form-item-image-item form-item-image-item__add" :data-event="EVENT.ADD_IMAGE"
            v-if="item.value.length < item.maxCount">
            <image :src="`${domain}/static/images/checkin-form-camera.png`" mode="aspectFit"
              class="form-item-image-item__add__image" />
            <text>上传图片</text>
          </view>
          <view class="form-item-image-item" v-for="(image, index) in item.value" :key="index">
            <image class="form-item-image-item__image" mode="aspectFill" :src="image" />
            <button class="form-item-image-item__delete" :data-event="EVENT.DELETE_IMAGE" :data-index="index">
              <text class="iconfont icon-ic_close" :data-event="EVENT.DELETE_IMAGE" :data-index="index" />
            </button>
          </view>
        </view>
      </view>
    </view>
  </form>
</template>

<script>
import { systemFormData } from "@/api/user";
import dayjs from "@/plugin/dayjs/dayjs.min";
import CityPicker from "@/components/areaWindow/index.vue";
import { HTTP_REQUEST_URL as domain } from "@/config/app";

const EVENT = {
  ADD_IMAGE: "addImage",
  DELETE_IMAGE: "deleteImage",
};

export default {
  components: {
    CityPicker
  },
  props: {
    config: {
      type: Array,
      default: () => []
    },
    formId: Number,
    defaultValues: Object
  },
  data() {
    return {
      domain,
      EVENT,
      timeRange: this.generateTimePickerRange(),
      formConfig: []
    }
  },
  async created() {
    if (this.config.length) {
      this.formConfig = this.config;
      return;
    }
    try {
      await this.getFormData();
    } catch (error) {
      this.$util.Tips({
        title: error,
        icon: "none"
      });
    }
  },
  methods: {
    handleSelectChange(e, item, index) {
      const { value } = e.detail;
      this.formConfig[index].value = this.formConfig[index].range[value].val;
      this.formConfig[index].index = value;
    },
    handleCheckboxChange(e, item, index) {
      item.value = e.detail.value;
    },
    handleDateChange(e, item, index) {
      item.value = e.detail.value;
    },
    handleCityChange(e, item, index) {
      item.value = e;
    },
    handleCityChangeClose(e, item, index) {
      item.active = false;
    },
    handleActiveCityPicker(e, item, index) {
      item.active = true;
    },
    handleDateRangeChange(e, item, index) {
      item.value = e;
    },
    handleDateTimeRangeChange(e, item, index) {
      item.value = e;
    },
    handleRadioChange(e, item, index) {
      item.value = e.detail.value;
    },
    handleTimeChange(e, item, index) {
      item.value = e.detail.value;
    },
    handleTimeRangeChange(e, item, index) {
      item.indexValue = e.detail.value;
      const [startHourIndex, startMinuteIndex, endHourIndex, endMinuteIndex] = e.detail.value;
      item.value = [
        `${this.timeRange[0][startHourIndex]}:${this.timeRange[1][startMinuteIndex]}`,
        `${this.timeRange[2][endHourIndex]}:${this.timeRange[3][endMinuteIndex]}`,
      ];
    },
    handleUploadImage(list) {
      this.$util.uploadImageOne("upload/image", (res) => {
        list.push(res.data.path);
      });
    },
    handleImageClick(e, item, pindex) {
      const { event } = e.target.dataset;
      if (event === undefined) return;
      if (event === EVENT.ADD_IMAGE) {
        this.handleUploadImage(item.value);
      } else if (event === EVENT.DELETE_IMAGE) {
        const { index } = e.target.dataset;
        item.value.splice(index, 1);
      }
    },
    generateTimePickerRange() {
      const getHours = () => Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"));
      const getMinutes = () => Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0"));

      return [
        getHours(),
        getMinutes(),
        getHours(),
        getMinutes(),
      ];
    },
    async getFormData() {
      const res = await systemFormData(this.formId);
      this.$emit("metadata", JSON.parse(JSON.stringify(res.data)));
      this.processFormConfig(res.data);
    },
    processFormConfig({ form_keys, value }) {
      const formKeyMap = {};
      form_keys.forEach((item, index) => {
        formKeyMap[item.key] = item;
      });

      try {
        for (let item of Object.values(value)) {
          const formItem = formKeyMap[item.key];
          formItem.required = !!item.titleShow.val;

          if (item.tipConfig?.value) {
            formItem.placeholder = item.tipConfig.value;
          }

          if (item.wordsConfig) {
            formItem.range = item.wordsConfig.list;
          }

          const titleVal = item.titleConfig.value;

          if (formItem.type === "texts") {
            const inputTypeMap = {
              0: "text",
              1: "tel",
              2: "idcard",
              3: "email",
              4: "digit",
            };

            formItem.value = item.defaultValConfig.value;
            const { tabList, tabVal } = item.valConfig;
            const inputTypeLabel = tabList[tabVal]?.name;
            formItem.inputTypeLabel = inputTypeLabel;
            formItem.inputType = inputTypeMap[tabVal];
            if (this.defaultValues) {
              formItem.value = this.defaultValues[titleVal];
            }
          } else if (formItem.type === "selects") {
            formItem.index = 0;
            formItem.value = "";
            if (this.defaultValues) {
              formItem.value = this.defaultValues[titleVal];
              formItem.index = formItem.range.findIndex(item => item.val === formItem.value);
            }
          } else if (formItem.type === "radios") {
            if (this.defaultValues) {
              formItem.value = this.defaultValues[titleVal];
            } else {
              formItem.value = "";
            }
          } else if (formItem.type === "checkboxs") {
            if (this.defaultValues) {
              formItem.value = this.defaultValues[titleVal].split(",");
            } else {
              formItem.value = [];
            }
          } else if (formItem.type === "dates") {
            formItem.value = "";
            if (item.valConfig.tabVal === 1) {
              // 显示默认值
              if (item.valConfig.tabData === 1) {
                // 使用配置的默认值
                formItem.value = item.valConfig.specifyDate.replace(/\//g, "-");
              } else {
                // 使用当前时间
                formItem.value = dayjs().format("YYYY-MM-DD");
              }
            }
            if (this.defaultValues) {
              formItem.value = this.defaultValues[titleVal];
            }
          } else if (formItem.type === "citys") {
            formItem.value = [];
            formItem.active = false;
            formItem.cityShow = item.valConfig.tabVal + 1;
            if (this.defaultValues) {
              formItem.value = this.defaultValues[titleVal].split("/").map(item => {
                return {
                  name: item,
                };
              });
            } else {
              formItem.value = [];
            }
          } else if (formItem.type === "dateranges") {
            if (item.valConfig.tabVal === 1) {
              // 显示默认值
              if (item.valConfig.tabData === 1) {
                // 使用配置的默认值
                formItem.value = item.valConfig.specifyDate;
              } else {
                // 使用当前时间
                formItem.value = [
                  dayjs().format("YYYY-MM-DD"),
                  dayjs().format("YYYY-MM-DD"),
                ];
              }
            }
            if (this.defaultValues) {
              formItem.value = this.defaultValues[titleVal].split(",");
            } else {
              formItem.value = [];
            }
          } else if (formItem.type === "times") {
            if (item.valConfig.tabVal === 1) {
              // 显示默认值
              if (item.valConfig.tabData === 1) {
                // 使用配置的默认值
                formItem.value = item.valConfig.specifyDate;
              } else {
                // 使用当前时间
                formItem.value = dayjs().format("HH:mm");
              }
            }
            if (this.defaultValues) {
              formItem.value = this.defaultValues[titleVal];
            } else {
              formItem.value = "";
            }
          } else if (formItem.type === "timeranges") {
            formItem.value = [];
            formItem.indexValue = [0, 0, 0, 0];

            const generateTimeIndex = () => {
              try {
                const getHourIndex = str => Number(str.split(":")[0]);
                const getMinuteIndex = str => Number(str.split(":")[1]);

                formItem.indexValue = [
                  getHourIndex(formItem.value[0]),
                  getMinuteIndex(formItem.value[0]),
                  getHourIndex(formItem.value[1]),
                  getMinuteIndex(formItem.value[1]),
                ];
              } catch (error) {
                console.log(error);
              }
            }

            if (item.valConfig.tabVal === 1) {
              // 显示默认值
              formItem.value = item.valConfig.specifyDate;
              if (item.valConfig.tabData === 1) {
                // 使用配置的默认值
                formItem.value = item.valConfig.specifyDate;
              } else {
                // 使用当前时间
                formItem.value = [
                  dayjs().format("HH:mm"),
                  dayjs().format("HH:mm"),
                ];
              }

              generateTimeIndex();
            } else if (this.defaultValues) {
              formItem.value = this.defaultValues[titleVal].split("-").map(item => item.trim());
              generateTimeIndex();
            }
          } else if (formItem.type === "uploadPicture") {
            formItem.maxCount = item.numConfig.val;
            if (this.defaultValues) {
              formItem.value = this.defaultValues[titleVal];
            } else {
              formItem.value = [];
            }
          }
        }

      } catch (err) {
        console.log(err);
      }
      this.formConfig = form_keys;
    },
    getData(forceCheck = false) {
      const result = {};

      for (let item of this.formConfig) {
        let value = item.value;
        if (item.required || forceCheck) {
          const isEmpty = Array.isArray(value) ? value.length === 0 : !value;
          if (isEmpty) {
            this.$util.Tips({
              title: `${item.label}不能为空`,
              icon: "none"
            });
            return;
          }
        }

        if (item.type === "checkboxs") {
          value = value.join(",");
        } else if (item.type === "citys") {
          value = value.map(item => item.name).join("/");
        } else if (item.type === "timeranges") {
          value = value.join(" - ");
        } else if (item.type === "dateranges") {
          value = value.join(",");
        }

        result[item.key] = {
          label: item.label,
          value: value
        };
      }

      return result;
    }
  }
}
</script>

<style scoped lang="scss">
.record-form-container {
  --item-min-height: 90rpx;
  display: block;
  color: #282828;
}

.form-item {
  min-height: var(--item-min-height);
  display: flex;
  align-items: center;
}

.form-item-label {
  margin-right: 20rpx;
  flex-shrink: 0;

  &[data-required="true"] {
    &::after {
      margin-left: 4rpx;
      content: "*";
      color: red;
    }
  }
}

.form-item-input-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-left: auto;
  flex: 1;
  overflow: hidden;
}

.form-item-input {
  text-align: right;
  flex: 1;
  border: none;
  outline: none;



  &.daterange-picker {
    /deep/.uni-date-x {
      color: inherit;
    }

    /deep/.uni-icons.icon-calendar.uniui-calendar {
      display: none;
    }
  }

  &.radio-group {
    display: flex;
    flex-wrap: wrap;
    gap: 20rpx;
    justify-content: flex-end;
  }

  &.image-list {
    display: flex;
    flex-wrap: wrap;
    gap: 20rpx;
    justify-content: flex-end;
    padding: 20rpx 0;

    .form-item-image-item {
      position: relative;
      width: 100rpx;
      height: 100rpx;
      border-radius: 12rpx;
      background-color: #F9F9F9;

      &__add {
        border: 1rpx dashed #ddd;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 8rpx;

        &__image {
          width: 34rpx;
          height: 34rpx;
          pointer-events: none;
        }

        text {
          pointer-events: none;
          font-size: 20rpx;
          color: #333;
        }
      }

      &__image {
        width: 100%;
        height: 100%;
        border-radius: 12rpx;
      }

      &__delete {
        position: absolute;
        top: 0;
        right: 0;
        width: 28rpx;
        height: 28rpx;
        background-color: #bbb;
        border-radius: 0;
        border-bottom-left-radius: 12rpx;
        border-top-right-radius: 12rpx;
        display: flex;
        justify-content: center;
        align-items: center;

        .iconfont {
          font-size: 24rpx;
          color: #fff;
        }
      }
    }
  }
}

.form-item-input-content {
  text-align: right;
  display: inline-flex;
  align-items: center;

  .ic_rightarrow {
    font-size: 24rpx;
    margin-left: 8rpx;
  }

  &.is-empty {
    color: #ccc;
  }
}

.form-item-checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}

.form-item-input-city {
  text-align: initial;
}
</style>
