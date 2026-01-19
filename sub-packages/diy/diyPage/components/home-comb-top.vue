<template>
  <view class="my-main">
    <view class="mp-header" id="home" :style="[mpHeaderStyle]">
      <view class="sys-head" :style="{ height: statusBarHeight + 'px' }" v-if="!special"></view>
      <view class="serch-box">
        <view class="serch-wrapper flex" :class="special ? 'on' : ''">
          <view class="title skeleton-rect" :style="[titleStyle]" v-if="searchBox == 1">{{ titleConfig }}</view>
          <view class="logo skeleton-rect" v-else-if="searchBox == 0 && logoUpImg">
            <image :src="logoUpImg" mode="heightFix" class="logo-img"></image>
          </view>
          <view v-else-if="searchBox == 2" :style="[locationStyle]">
            <LocationSelector />
          </view>
          <navigator v-if="hotWords.length" :url="'/pages/columnGoods/goods_search/index?searchVal=' + searchVal"
            :class="logoConfig ? 'input' : 'uninput'" hover-class="none" class="skeleton-rect" :style="[inputStyle]">
            <view class="swiperTxt">
              <swiper :indicator-dots="false" autoplay :interval="interval" :duration="500" vertical="true"
                circular="true" @change="textChange" class="swiper">
                <block v-for="(item, index) in hotWords" :key="index">
                  <swiper-item catchtouchmove="catchTouchMove">
                    <view class="acea-row row-between-wrapper">
                      <view class="text acea-row row-between-wrapper">
                        <view class="newsTitle line1">{{ item.val }}</view>
                      </view>
                    </view>
                  </swiper-item>
                </block>
              </swiper>
            </view>
            <text class="iconfont icon-ic_search"></text>
          </navigator>
          <navigator v-else url="/pages/columnGoods/goods_search/index" hover-class="none" class="skeleton-rect input"
            :style="[inputStyle]">
            {{ dataConfig.inputConfig.value }}
            <text class="iconfont icon-ic_search"></text>
          </navigator>
        </view>
      </view>
    </view>
    <view :style="'height:' + (statusBarHeight + 43) + 'px'" v-if="!special && searchShow"></view>
    <view v-if="!dataConfig.classConfig.tabVal" class="navTabBox tabNav">
      <view class="longTab" :style="{ width: `${mainWidth}px` }">
        <scroll-view scroll-x="true" scroll-with-animation :scroll-left="tabLeft" show-scrollbar="true" class="scroll-view">
          <view class="longItem" v-for="(item, index) in tabListConfig" :key="index"
            :class="{ click: index == tabClick }" :id="'id' + index" :data-index="index"
            @click="changeTab(item, index)">
            {{ item.text.val }}
          </view>
        </scroll-view>
      </view>
      <view class="category" @click="showCategory">
        <text class="iconfont icon-a-ic_Imageandtextsorting"
          :style="'color:' + (isScrolled ? txtColor : '#fff')"></text>
      </view>
    </view>
    <view v-if="isCategory" class="category_count">
      <view class="sys-head tui-skeleton" :style="{ height: statusBarHeight + 'px' }" v-if="!special"></view>
      <view class="fs-28">精选类目</view>
      <view class="cate_count grid-column-4 grid-gap-16rpx mt-32">
        <view class="category_item" :style="[index === tabClick ? classColor : '']" @click="changeTab(item, index)"
          v-for="(item, index) in tabListConfig" :key="index" :id="'ids' + index">
          {{ item.text.val }}
        </view>
      </view>
    </view>


    <view v-if="isCategory" class="mask" @click="isCategory = false"></view>
  </view>
</template>

<script>

import LocationSelector from '@/components/LocationSelector.vue';
import { diyUtil } from '@/utils/diy';

export default {
  name: "HomeCombTop",
  components: {
    LocationSelector
  },
  props: {
    dataConfig: Object,
    special: {
      type: Number,
      default: 0
    },
    isScrolled: {
      type: Boolean,
      default: false
    },
    tabActiveIndex: {
      type: Number,
      default: 0
    },
    compCount: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      statusBarHeight: uni.getSystemInfoSync().statusBarHeight,
      
			txtColor: '',

      tabClick: 0, //导航栏被点击
      mainWidth: 0,
      interval: this.dataConfig.numConfig.val * 1000 || 2500,
      logoConfig: this.dataConfig.logoConfig.url,
      titleConfig: this.dataConfig.titleConfig.value,
      searchBox: this.dataConfig.searchBox.tabVal,

      hotWordShow: false,
      isCategory: false,

      searchShow: false,
      searchVal: '',

      tabLeft: 0,
    }
  },
  created() {
    var that = this;
    // 获取设备宽度
    uni.getSystemInfo({
      success(e) {
        that.mainWidth = e.windowWidth;
      }
    });

    that.hotWords.forEach((item) => {
      if (item.val) {
        this.hotWordShow = true;
      }
    });
    uni.setStorageSync('hotList', that.hotWords);
  },
  watch: {
    tabActiveIndex() {
      this.tabClick = this.tabActiveIndex;
    },
  },
  computed: {
		classColor() {
			let color = this.dataConfig.classColor;
			return {
				background: `linear-gradient(90deg, ${color.color[0].item} 50%, ${color.color[1].item} 100%)`,
				color: '#fff'
			};
		},
    tabListConfig() {
      // 向配置项中添加默认首页，用来展示其他 DIY 组件
      let tabList = this.dataConfig.tabListConfig.list;
      return [
        {
          text: {
            val: "首页"
          }
        },
        ...tabList
      ];
    },
    inputStyle() {
      let style = {};
      if (this.isScrolled && this.dataConfig.searchConfig.tabVal) {
        style.background = `#F5F5F5`;
        style.color = `#BBBBBB`;
      }
      return style;
    },
    titleStyle() {
      let style = {};
      if (this.isScrolled && this.dataConfig.searchConfig.tabVal) {
        style.color = `#333`;
      }
      return style;
    },
    mpHeaderStyle() {
      let style = {};
      if (this.isScrolled && this.dataConfig.searchConfig.tabVal) {
        style.background = `linear-gradient(90deg, #FFFFFF 50%, #FFFFFF 100%)`;
        style.position = `fixed`;
        style.zIndex = diyUtil.calcZIndex(this.compCount);
        this.searchShow = true;
      } else {
        this.searchShow = false;
      }
      return style;
    },
    logoUpImg() {
      let img = '';
      if (this.isScrolled && this.dataConfig.searchConfig.tabVal && this.dataConfig.logoUpConfig && this.dataConfig.logoUpConfig.url) {
        img = this.dataConfig.logoUpConfig.url;
      } else {
        img = this.dataConfig.logoConfig.url;
      }
      return img;
    },
    locationStyle() {
      return {
        "--location-color": this.isScrolled ? "#333" : "#fff"
      };
    },
    hotWords() {
      return this.dataConfig.hotWords.list.filter((item) => {
        return item.val;
      });
    },
  },
  methods: {
    textChange(e) {
      let { current, source } = e.detail;
      if (source === 'autoplay' || source === 'touch') {
        this.searchVal = this.hotWords[e.detail.current]['val'];
      }
    },
    /*跳转为页面*/
    changeTab(item, index) {
      if (this.tabClick == index) return;
      this.tabClick = index; //设置导航点击了哪一个
      this.isLeft = index * this.isWidth + 16; //设置下划线位置
      this.isCategory = false;
      this.$emit("change", index);
    },
    /**显示全部分类*/
    showCategory() {
      this.isCategory = true;
    },
  }
}
</script>

<style scoped lang="scss">
.my-main {
  transition: background-color 0.5s ease;
}


.mp-header {
  position: relative;
  left: 0;
  top: 0;
  width: 100%;

  &.on {
    position: relative;
  }

  .serch-box {
    height: 43px;
  }

  .logo {
    height: 60rpx;
    margin-right: 20rpx;

    .logo-img {
      width: 100%;
      height: 100%;
    }
  }

  .serch-wrapper {
    align-items: center;
    /* #ifdef MP */
    padding: 0 220rpx 0 30rpx;
    /* #endif */
    /* #ifndef MP */
    padding: 0 30rpx;
    /* #endif */
    height: 100%;

    &.on {
      padding: 0 30rpx;
    }

    .title,
    .map {
      font-size: 28rpx;
      color: #fff;
      margin-right: 24rpx;
    }

    .map {
      .iconfont {
        font-size: 26rpx;
      }

      .icon-ic_location4 {
        margin-right: 12rpx;
      }
    }

    &.on {
      padding: 0 30rpx;
    }

    .input,
    .uninput {
      flex: 1;
      min-width: 0;
      position: relative;
      display: flex;
      align-items: center;
      height: 60rpx;
      padding: 0 32rpx;
      border-radius: 30rpx;
      background: rgba(255, 255, 255, 0.4);
      font-size: 28rpx;
      color: #ffffff;

      .iconfont {
        position: absolute;
        right: 25rpx;
        top: 13rpx;
      }
    }
  }
}

.navTabBox {
  color: #ffffff;
  padding: 0 57rpx 0 30rpx;
  // z-index: 99;
  position: relative;
  // position: fixed;
  left: 0;
  width: 100%;
  // padding-top: 5px;

  &.on {
    position: relative;
  }

  .scroll-view {
    /* #ifdef MP */
    width: 640rpx;
    /* #endif */
    /* #ifndef MP */
    width: 666rpx;
    /* #endif */
    height: 82rpx;
    white-space: nowrap;
  }

  .click {
    color: white;
  }

  .longTab {
    // height: 34px;

    .longItem {
      display: inline-block;
      text-align: center;
      font-size: 28rpx;
      color: #ffffff;
      max-width: 160rpx;
      margin-right: 30rpx;
      position: relative;
      font-weight: 400;
      line-height: 82rpx;

      &:last-child {
        margin-right: 0;
      }

      &.click {
        font-weight: 600;
        font-size: 30rpx;
        color: #ffffff;

        &::after {
          content: '';
          transition: .5s;
          width: 20rpx;
          height: 2px;
          background: #FFFFFF;
          position: absolute;
          bottom: 14rpx;
          left: 50%;
          transform: translateX(-50%);
        }
      }
    }
  }

  .category {
    position: absolute;
    right: 0;
    top: 50%;
    width: 57rpx;
    height: 45rpx;
    padding-left: 11rpx;
    line-height: 45rpx;
    z-index: 10;
    transform: translateY(-50%);

    .iconfont {
      font-size: 35rpx;
    }

    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      width: 2rpx;
      height: 28rpx;
      background: linear-gradient(135deg, #ffffff 0%, rgba(216, 216, 216, 0) 100%);
      transform: translateY(-50%);
    }
  }

  &.isFixed {
    z-index: 10;
    position: fixed;
    left: 0;
    width: 100%;
  }
}


.tabNav {
  // padding-top: 10rpx;
}


.category_count {
  width: 100%;
  background: #fff;
  padding: 32rpx;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  border-radius: 0 0 24rpx 24rpx;

  .cate_count {
    .category_item {
      padding: 0 20rpx;
      height: 72rpx;
      text-align: center;
      line-height: 72rpx;
      word-wrap: break-word;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      background-color: #f5f5f5;
      border-radius: 8rpx;
      font-size: 24rpx;
    }
  }
}

.swiperTxt {
  width: 300rpx;
  height: 100%;
  line-height: 58rpx;
  overflow: hidden;
}

.swiperTxt .text {
  width: 480rpx;
}

.swiperTxt .text .label {
  font-size: 20rpx;
  color: #ff4c48;
  width: 64rpx;
  height: 30rpx;
  border-radius: 40rpx;
  text-align: center;
  line-height: 28rpx;
  border: 2rpx solid #ff4947;
}

.swiperTxt .text .newsTitle {
  width: 300rpx;
  font-size: 24rpx;
  // color: #fff;
}

.swiperTxt .swiper {
  height: 100%;
}


.mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  z-index: 22;
}
</style>
