<template>
  <base-drawer mode="right" :visible="visible" background-color="transparent" mask maskClosable @close="closeDrawer">
    <view class="drawer_box bg--w111-fff h-full flex flex-col">
      <view class="h-80 flex-center fs-34 fw-500 text--w111-333">ການກອງ</view>
      <view class="flex-1">
        <scroll-view scroll-y class="h-full">
          <view v-for="(item, index) in categoryList" :key="index">
            <view class="activity_box pt-24 pb-24 pl-32 pr-32">
              <view class="flex-between-center">
                <view class="fs-28 text--w111-333 fw-500" :class="innerFirstCateIndex == index ? 'one_cate_active' : ''"
                  @click="handleChangeFirstCate(index)">{{ item.cate_name }}</view>
                <view class="fs-20 text--w111-999" v-if="item.children && item.children.length > 3"
                  @tap="openShowMore(item)">
                  <text>{{ expandMap[item.store_category_id] ? 'ຫຍໍ້ເຂົ້າ' : 'ເບິ່ງເພີ່ມເຕີມ' }}</text>
                  <text class="iconfont fs-20"
                    :class="expandMap[item.store_category_id] ? 'icon-ic_uparrow' : 'icon-ic_downarrow'"></text>
                </view>
              </view>

              <view v-if="item.children && item.children.length">
                <view class="grid-column-3 box_gap mt-24">
                  <view class="h-56 rd-28rpx bg--w111-f5f5f5 flex-center fs-24 text--w111-333"
                    v-for="(cate, secondIndex) in getChildrenList(item)" :key="cate.store_category_id"
                    :class="{ cate_active: isActiveSecondCate(index, secondIndex) }"
                    @tap="handleChangeSecondCate(index, secondIndex)">
                    {{ cate.cate_name }}</view>
                </view>
              </view>
            </view>
          </view>
        </scroll-view>
      </view>
      <view class="bg--w111-fff w-full rd-b-40 bottom-wrapper">
        <view class="px-32 flex-between-center h-112">
          <view class="w-296 h-72 rd-40rpx flex-center text-primary-con con_border bg--w111-fff" @click="handleReset">ລ້າງຄ່າ
          </view>
          <view class="w-296 h-72 rd-40rpx flex-center text--w111-fff bg-color" @tap="handleConfirm">
            ຕົກລົງ</view>
        </view>
      </view>
    </view>
  </base-drawer>
</template>

<script>
import baseDrawer from '@/components/tui-drawer/tui-drawer.vue';

export default {
  name: 'CateDrawer',
  components: {
    baseDrawer
  },
  props: {
    categoryList: Array,
    levelFirstCateIndex: Number,
    levelSecondCateIndex: Number,
    visible: Boolean,
    emptyParams: Boolean
  },
  data() {
    return {
      expandMap: {},
      innerFirstCateIndex: this.levelFirstCateIndex,
      innerSecondCateIndex: this.levelSecondCateIndex,
    }
  },
  watch: {
    visible(val) {
      // 如果组件状态变化，则将 props 中的 index 和 内部 index 进行同步

      const reset = () => {
        this.updateIndex();
        this.expandMap = {};
      }
      if (val) {
        reset();
      } else {
        // 组件关闭时有动画，待动画执行完成后再进行重置，避免界面闪烁
        setTimeout(() => {
          reset();
        }, 100);
      }
    },
    emptyParams: {
      handler() {
        this.updateIndex();
      },
      immediate: true
    }
  },
  methods: {
    updateIndex() {
      if (this.emptyParams) {
        // 如果商品请求时使用的是空参数，则不应该选中任何分类
        this.innerFirstCateIndex = -1;
        this.innerSecondCateIndex = -1;
      } else {
        // 否则默认选中 props 中的 index
        this.innerFirstCateIndex = this.levelFirstCateIndex;
        this.innerSecondCateIndex = this.levelSecondCateIndex;
      }
    },
    handleChangeFirstCate(index) {
      this.innerFirstCateIndex = index;
      this.innerSecondCateIndex = 0;
    },
    handleChangeSecondCate(firstIndex, secondIndex) {
      this.innerFirstCateIndex = firstIndex;
      this.innerSecondCateIndex = secondIndex;
    },
    closeDrawer() {
      this.$emit("close-drawer");
    },
    openShowMore(item) {
      const val = this.expandMap[item.store_category_id];
      this.$set(this.expandMap, item.store_category_id, !val);
    },
    getChildrenList(item) {
      const val = this.expandMap[item.store_category_id];
      if (!val) return item.children.slice(0, 3);
      return item.children;
    },
    isActiveSecondCate(firstIndex, secondIndex) {
      return firstIndex === this.innerFirstCateIndex && secondIndex === this.innerSecondCateIndex;
    },
    handleReset() {
      this.innerFirstCateIndex = -1;
      this.innerSecondCateIndex = -1;
    },
    handleConfirm() {
      this.$emit("change-cate", {
        firstIndex: this.innerFirstCateIndex,
        secondIndex: this.innerSecondCateIndex,
      });
      this.closeDrawer();
    }
  }
}
</script>

<style scoped lang="scss">
.drawer_box {
  width: 668rpx;
  border-radius: 40rpx 0 0 40rpx;
  overflow: auto;
  padding-top: var(--safe-area-inset-top);
}

.bottom-wrapper {
  padding-bottom: var(--safe-area-inset-bottom);
}

.one_cate_active {
  color: var(--view-theme);
}

.box_gap {
  gap: 24rpx 26rpx;
}

.cate_active {
  color: var(--view-theme);
  background: var(--view-minorColorT);
  border: 1rpx solid var(--view-theme);
}

.rd-b-40 {
  border-radius: 0 0 0 40rpx;
}

.con_border {
  border: 1px solid var(--view-theme);
}

.text-primary-con {
  color: var(--view-theme);
}
</style>
