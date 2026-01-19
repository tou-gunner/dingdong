<template>
  <BaseContainer>
    <view class="body-bg1">
      <view class="body-bg2" :class="{ 'unassign-order-and-scroll': orderType === UNASSIGNED && isScroll }" />
    </view>
    <view class="order-top-bar">
      <view class="order-top-bar-content">
        <OrderListInfo />
        <SearchBar @confirm="handleSearch" placeholder="请输入商品名称">
          <view class="calendar-btn" :style="{ 'background-image': `url(${domain}/static/images/ic_calendar.png)` }">
            <uni-datetime-picker ref="daterange" type="daterange" @change="handleChangeDateRange">
              <view class="daterange-placeholder"></view>
              <template #header>
                <button hover-class="none" class="calendar-clear-btn" @click="handleClearDateRange">清空</button>
              </template>
            </uni-datetime-picker>
          </view>
        </SearchBar>
      </view>
      <view class="order-category-bg" v-if="orderType === ASSIGNED">
        <OrderCategory v-model="orderStatus" />
      </view>
    </view>
    <view class="order-list-container" :class="{ 'is-assign-order': orderType === UNASSIGNED }">
      <OrderList :orderList="orderList" :orderType="orderType" />
    </view>
    <template v-if="!loadOptions.loading">
      <view class="order-list-empty" v-if="loadOptions.loaded && orderList.length">
        人家也是有底线的～
      </view>
      <view v-else-if="orderList.length === 0" class="nothing">
        <EmptyPage title="暂无订单~" :noImage="`${domain}/static/images/noRecord.png`" />
      </view>
    </template>

    <view class="list-bottom-tab-placeholder"></view>
    <OrderListBottomTabs v-model="orderType" />
  </BaseContainer>
</template>

<script>
import BaseContainer from "@/components/common/base_container.vue";
import OrderCategory from "@/pages/staff/components/order_list_category.vue";
import SearchBar from "@/components/common/search_bar.vue";
import OrderList from "@/pages/staff/components/order_list.vue";
import OrderListBottomTabs from "@/pages/staff/components/order_list_bottom_tabs.vue";
import OrderListInfo from "@/pages/staff/components/order_list_info.vue";
import EmptyPage from "@/components/emptyPage.vue";
import { HTTP_REQUEST_URL } from "@/config/app";
import { addBookingOrderType } from "@/utils/order";
import { getStaffOrderList, getMerStaffCheckinConfig } from "@/api/staff";
import { STAFF_CHECKIN_SUCC_EVENT } from "@/utils/constants";
import { ASSIGNED, UNASSIGNED } from "./config";


export default {
  components: {
    BaseContainer,
    SearchBar,
    OrderCategory,
    OrderList,
    OrderListBottomTabs,
    OrderListInfo,
    EmptyPage
  },
  data() {
    return {
      ASSIGNED,
      UNASSIGNED,
      domain: HTTP_REQUEST_URL,
      orderStatus: 0,
      searchText: "",
      orderList: [],
      startDate: "",
      endDate: "",

      orderType: ASSIGNED,
      isScroll: false,

      loadOptions: {
        page: 1,
        pageSize: 10,
        total: 0,
        loading: false,
        loaded: false,
      }
    };
  },
  async onPullDownRefresh() {
    await this.handleForceRefetch();
    uni.stopPullDownRefresh();
  },
  onPageScroll(e) {
    this.isScroll = e.scrollTop > 0;
  },
  onReachBottom() {
    const { loading, loaded } = this.loadOptions;
    if (loading || loaded) return;
    this.loadOptions.page++;
    this.handleGetOrderList();
  },
  onLoad() {
    this.handleGetOrderList();
    uni.$on(STAFF_CHECKIN_SUCC_EVENT, this.handleStaffCheckinSucc);
  },
  onUnload() {
    uni.$off(STAFF_CHECKIN_SUCC_EVENT, this.handleStaffCheckinSucc);
  },
  computed: {
    queryParams() {
      const params = {
        assigned: this.orderType,
        store_name: this.searchText
      };

      if (this.orderStatus) {
        params.status = this.orderStatus;
      }

      const formatDate = date => date.replace(/-/g, "/");

      if (this.startDate && this.endDate) {
        params.date = `${formatDate(this.startDate)}-${formatDate(this.endDate)}`;
      }

      return params;
    }
  },
  watch: {
    orderType() {
      this.orderStatus = 0;
      this.handleClearDateRange();
    },
    queryParams() {
      this.handleForceRefetch();
    }
  },
  methods: {
    handleStaffCheckinSucc(orderId) {
      if (this.orderType === ASSIGNED) {
        const order = this.orderList.find(item => item.order_id === Number(orderId));
        if (order) {
          // 更新打卡后的订单状态为已上门打卡，待服务
          order.status = 20;
        }
      }
    },
    handleChangeDateRange(e) {
      const [before, after] = e;
      this.startDate = before;
      this.endDate = after;
    },
    handleClearDateRange() {
      this.$refs.daterange.close();
      this.$refs.daterange.clear();
      this.startDate = "";
      this.endDate = "";
    },
    handleForceRefetch() {
      this.handleResetLoadOptions();
      this.orderList = [];
      return this.handleGetOrderList();
    },
    handleResetLoadOptions() {
      this.loadOptions.page = 1;
      this.loadOptions.total = 0;
      this.loadOptions.loaded = false;
      this.loadOptions.loading = false;
    },
    handleSearch(searchText) {
      this.searchText = searchText;
    },
    async handleGetOrderList() {
      const { loading, loaded, page, pageSize } = this.loadOptions;
      if (loading || loaded) return;
      this.loadOptions.loading = true;
      try {
        const res = await getStaffOrderList({
          ...this.queryParams,
          page,
          limit: pageSize
        });
        res.data.list.forEach(item => {
          addBookingOrderType(item);
        });
        this.orderList.push(...res.data.list);
        this.loadOptions.total = res.data.count;
        this.loadOptions.loaded = this.orderList.length >= this.loadOptions.total;
      } catch (err) {
        this.$util.Tips({
          title: err,
          icon: "none"
        });
      }
      this.loadOptions.loading = false;
    }
  }
}
</script>

<style scoped lang="scss">
$bg-height: calc(238rpx + var(--safe-area-inset-top));


.body-bg1 {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: $bg-height;
  background-image: linear-gradient(90deg, #2291F8 0%, #1CD1DC 100%);
}

.body-bg2 {
  position: absolute;
  bottom: -2rpx;
  left: 0;
  height: 48rpx;
  width: 100%;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, #f5f5f5 100%);

  &.unassign-order-and-scroll {
    background: #f5f5f5;
  }
}

.order-category-bg {
  position: relative;

  &::after,
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 48rpx;
  }

  &::before {
    background-image: linear-gradient(90deg, #2291F8 0%, #1CD1DC 100%);
  }

  &::after {
    height: 50rpx;
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, #f5f5f5 100%);
  }
}


.order-top-bar {
  position: sticky;
  top: 0;
  z-index: 10;
  min-height: $bg-height;


  .order-top-bar-content {
    background-image: linear-gradient(90deg, #2291F8 0%, #1CD1DC 100%);
    padding-top: var(--safe-area-inset-top);
    padding-bottom: 1rpx;
  }
}

.list-bottom-tab-placeholder {
  height: calc(var(--safe-area-inset-bottom) + 100rpx);
}

.order-list-empty {
  text-align: center;
  margin: 20rpx 0 70rpx;
  color: #CCCCCC;
  font-size: 26rpx;
}

.nothing {
  margin-top: 0;

  ::v-deep  .empty-box {
    margin-top: 0;
  }
}

.calendar-btn {
  height: var(--content-height);
  aspect-ratio: 1;
  margin-left: 16rpx;
  background-color: #fff;
  border-radius: 50%;
  background: none no-repeat center / 36rpx #fff;

  .daterange-placeholder {
    height: var(--content-height);
  }

  .calendar-clear-btn {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 10px 25px 0;
    font-size: 26rpx;
    color: #737987;
  }
}

.order-list-container {
  margin-top: 20rpx;
  position: relative;

  &.is-assign-order {
    margin-top: -40rpx;
  }
}
</style>