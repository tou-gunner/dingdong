<template>
  <!--重置小圆点的样式  -->
  <view class="dots acea-row" :class="{
    'row-center': dataConfig.docPosition.tabVal == 1,
    'row-right': dataConfig.docPosition.tabVal == 2
  }">
    <view v-if="dataConfig.docConfig.tabVal == 2" class="dot3">
      <view class="dot" :style="[progressWidth, dotBgColor]">
        <view class="active" :style="[progressValue, dotColor]"></view>
      </view>
    </view>
    <view v-else class="acea-row" :class="{
      dot1: dataConfig.docConfig.tabVal == 0,
      dot2: dataConfig.docConfig.tabVal == 1,
      dot4: dataConfig.docConfig.tabVal == 3
    }">
      <view v-for="(item, index) in dataConfig.swiperConfig.list" :key="index" class="dot"
        :class="{ active: index == swiperCur }" :style="[dotBgColor, index == swiperCur ? dotColor : '']"></view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'HomeCombSwiperDot',
  props: {
    dataConfig: Object,
    swiperCur: Number
  },
  computed: {
    dotColor() {
      return {
        background: this.dataConfig.dotColor.color[0].item
      };
    },
    progressValue() {
      return {
        width: `${((this.swiperCur + 1) / this.dataConfig.swiperConfig.list.length) * 100}%`
      };
    },
    progressWidth() {
      return {
        width: `${this.dataConfig.swiperConfig.list.length * 20}rpx`
      };
    },
    dotBgColor() {
      return {
        background: this.dataConfig.dotBgColor.color[0].item
      };
    },
  }
}

</script>

<style scoped lang="scss">
/*用来包裹所有的小圆点  */
.dots {
  // width: 156rpx;
  // height: 36rpx;
  display: flex;
  flex-direction: row;
  position: absolute;
  right: 20rpx;
  left: 20rpx;
  bottom: 23rpx;
}

/*未选中时的小圆点样式 */
.dot1 {
  .dot {
    width: 12rpx;
    height: 12rpx;
    border-radius: 6rpx;
    margin-right: 16rpx;
    background-color: rgba(0, 0, 0, 0.1);

    &:last-child {
      margin-right: 0;
    }

    /*选中以后的小圆点样式  */
    &.active {
      background: #e93323;
    }
  }
}

.dot2 {
  .dot {
    width: 10rpx;
    height: 10rpx;
    border-radius: 5rpx;
    margin-right: 8rpx;
    background-color: rgba(0, 0, 0, 0.1);

    &:last-child {
      margin-right: 0;
    }

    /*选中以后的小圆点样式  */
    &.active {
      width: 18rpx;
      background: #e93323;
    }
  }
}

.dot4 {
  .dot {
    width: 20rpx;
    height: 6rpx;
    border-radius: 3rpx;
    margin-right: 10rpx;
    background-color: #dddddd;

    &:last-child {
      margin-right: 0;
    }

    /*选中以后的小圆点样式  */
    &.active {
      background: #e93323;
    }
  }
}

.dot3 {
  .dot {
    height: 6rpx;
    border-radius: 3rpx;
    margin-right: 10rpx;
    background-color: rgba(0, 0, 0, 0.1);

    &:last-child {
      margin-right: 0;
    }

    /*选中以后的小圆点样式  */
    .active {
      height: 6rpx;
      border-radius: 3rpx;
      background: #e93323;
    }
  }
}
</style>
