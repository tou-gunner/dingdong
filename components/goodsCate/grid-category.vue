<!-- 商品分类页面右侧网格分类组件，展示所有分类 -->
<template>
  <scroll-view class="grid-category" scroll-y :scroll-into-view="scrollIntoViewId" scroll-with-animation
    id="grid-category-scroll" @scroll="handleScroll" :scroll-top="scrollTop">
    <view class="second-category-item" v-for="(secondCate, index) of list" :key="secondCate.store_category_id"
      :id="`grid-category-${index}`" :data-index="index">
      <navigator hover-class="none" :url="buildCateUrl(secondCate)" class="second-cate-name">
        {{ secondCate.cate_name }}
        <view class="iconfont icon-ic_rightarrow"></view>
      </navigator>
      <view class="third-category-list" v-if="secondCate.children && secondCate.children.length">
        <navigator hover-class="none" :url="buildCateUrl(thirdCate)" class="third-category-item"
          v-for="thirdCate of secondCate.children" :key="thirdCate.store_category_id">
          <image :src="thirdCate.pic" mode="aspectFill" class="third-cate-img" />
          <view class="third-cate-name line1">{{ thirdCate.cate_name }}</view>
        </navigator>
      </view>
    </view>
    <view :style="[lastItemPlaceholderStyle]"></view>
  </scroll-view>
</template>

<script>
export default {
  name: "GridCategory",
  props: {
    list: Array,
    activeIndex: Number,
    merId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      scrollIntoViewId: "",
      scrollTop: 0,
      lastEmitIndex: 0,

      scrollContainerHeight: 0, // 滚动容器高度
      contentPositions: [],
      lastSetIntoViewIdTime: 0
    }
  },
  watch: {
    activeIndex(index) {
      if (index !== this.lastEmitIndex) {
        this.lastEmitIndex = index;
        this.scrollIntoViewId = `grid-category-${index}`;
        this.lastSetIntoViewIdTime = Date.now();
      }
    },
    list() {
      setTimeout(() => {
        this.initItemRect();
        this.initScrollContainerHeight();
      }, 100);
    }
  },
  computed: {
    lastItemPlaceholderStyle() {
      if (this.scrollContainerHeight && this.contentPositions.length) {
        const lastItemHeight = this.contentPositions[this.contentPositions.length - 1].height;

        if (lastItemHeight < this.scrollContainerHeight) {
          return {
            height: this.scrollContainerHeight - lastItemHeight + "px"
          }
        }
      }
      return {
        height: uni.upx2px(20) + "px"
      };
    }
  },
  methods: {
    initItemRect() {
      uni.createSelectorQuery()
        .in(this)
        .selectAll(`.second-category-item`)
        .boundingClientRect(rectList => {
          let topPos = 0;
          const contentPositions = [];
          rectList.forEach((rect, index) => {
            if (index === 0) {//顶部布局的距离
              topPos = rect.top
            }
            contentPositions[index] = {
              top: rect.top - topPos,
              bottom: rect.bottom - topPos,
              height: rect.height
            }
          });
          this.contentPositions = contentPositions;
        }).exec();
    },
    initScrollContainerHeight() {
      uni.createSelectorQuery()
        .in(this)
        .select("#grid-category-scroll")
        .boundingClientRect(data => {
          this.scrollContainerHeight = data.height;
        })
        .exec();
    },
    buildCateUrl(cate) {
      if (this.merId) {
        return `/pages/store/list/index?id=${cate.store_category_id}&mer_id=${this.merId}&title=${cate.cate_name}`;
      }
      return `/pages/columnGoods/goods_list/index?id=${cate.store_category_id}&title=${cate.cate_name}`;
    },
    handleScroll(e) {
      // 接收到新索引后会通过 scroll-into-view 设置滚动位置，并设置滚动位置
      // 滚动动画约 400ms 左右，动画结束后会触发滚动事件
      // 为了防止滚动事件被 props 更新索引时重复触发，需要设置一个时间间隔
      // 只有滚动动画结束后，才允许触发滚动事件
      const allowScroll = Date.now() - this.lastSetIntoViewIdTime > 500;
      if (!allowScroll) return;


      const { scrollTop, scrollHeight } = e.detail;
      const contentPositions = this.contentPositions;
      const length = contentPositions.length;
      let index = -1;

      const scrollRange = Math.floor(scrollHeight - this.scrollContainerHeight);
      if (scrollTop >= scrollRange) {
        index = length - 1;
      } else {
        index = contentPositions.findIndex((item, index) => {
          return (index + 1 < length && scrollTop < this.contentPositions[index + 1].top) || index === length - 1;
        });
      }
      if (index !== -1 && index !== this.activeIndex) {
        this.lastEmitIndex = index;
        this.$emit("toggle", index);
      }
    }
  }
}
</script>

<style scoped lang="scss">
.grid-category {
  height: 100%;
}

.second-category-item {
  background-color: #fff;
  padding: 32rpx 24rpx;
  border-radius: 16rpx;

  &+.second-category-item {
    margin-top: 20rpx;
  }

  .second-cate-name {
    display: flex;
    font-weight: 500;
    font-size: 28rpx;
    color: #333333;
    line-height: 40rpx;
    padding-left: 8rpx;

    .iconfont {
      font-size: 24rpx;
      margin-left: 8rpx;
    }
  }
}

.third-category-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32rpx 50rpx;
  margin-top: 20rpx;

  .third-cate-item {
    overflow: hidden;
  }

  .third-cate-img {
    display: block;
    width: 100%;
    height: auto;
    aspect-ratio: 1;
    object-fit: cover;
    margin-bottom: 12rpx;
  }

  .third-cate-name {
    text-align: center;
    font-size: 24rpx;
    color: #333333;
    line-height: 34rpx;
  }
}
</style>
