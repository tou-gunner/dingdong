<template>
  <BaseContainer>
    <view class="body-bg1">
      <!-- <view class="body-bg2" :class="{ 'unassign-order-and-scroll': orderType === UNASSIGNED && isScroll }" /> -->
			<view class="body-bg2" />
    </view>
    <view class="order-top-bar">
      <view class="order-top-bar-content">
        <OrderListInfo/>
        <SearchBar @confirm="confirmSearchText" @change="changeSearchText" placeholder="请输入订单编号/商品名称">
        </SearchBar>
      </view>
      <view class="order-category-bg" v-if="orderType === ASSIGNED">
      	<!-- 配送类型分类 -->
				<OrderCategory 
					@changeDeliveryCase="changeDeliveryCase" 
					:orderCount="deliveringOrderCount"
				/>
      </view>
    </view>
    <view class="order-list-container" :class="{ 'is-assign-order': orderType === UNASSIGNED }">
			<OrderList 
				v-if="orderType === UNASSIGNED"
				:orderList="orderList"
				:orderType="orderType"
			/>
			<OrderList
				v-if="orderType === ASSIGNED"
				:orderList="orderList"
				:orderType="orderType"
				@refreshOrder="handleForceRefetch"
				@getOrderInfo="getOrderInfo"
			/>
    </view>
    <template v-if="!loadOptions.loading">
      <view class="order-list-empty" v-if="loadOptions.loaded && orderList.length">
        人家也是有底线的～
      </view>
      <view v-else-if="orderList.length === 0" class="nothing">
        <EmptyPage title="暂无订单~" :noImage="`${domain}/static/images/noRecord.png`" />
      </view>
    </template>
		<!-- 备注弹窗 -->
		<PriceChange :change="remarkPanelVisible" @closechange="handleCloseRemarkPanel" :orderInfo="orderInfo"
			@savePrice="handleSaveRemark" status="1" v-if="orderInfo" />
		<view class="list-bottom-tab-placeholder"></view>
    <OrderListBottomTabs 
			v-model="orderType"
		/>
  </BaseContainer>
</template>

<script>
import BaseContainer from "@/components/common/base_container.vue";
import OrderCategory from "@/pages/delivery/components/order_list_category.vue";
import SearchBar from "@/components/common/search_bar.vue";
import OrderList from "@/pages/delivery/components/order_list.vue";
import OrderListBottomTabs from "@/pages/delivery/components/order_list_bottom_tabs.vue";
import OrderListInfo from "@/pages/delivery/components/order_list_info.vue";
import EmptyPage from "@/components/emptyPage.vue";
import PriceChange from "@/components/shared-order/PriceChange/index.vue";
import { HTTP_REQUEST_URL } from "@/config/app";
import { addBookingOrderType } from "@/utils/order";
import { 
	getStaffOrderList, 
	getMerStaffCheckinConfig,
	getDeliveryStaffOrderList,
	saveOrderRemark
} from "@/api/staff";
import { STAFF_CHECKIN_SUCC_EVENT } from "@/utils/constants";
import { ASSIGNED, UNASSIGNED } from "./config";
import { mapGetters } from "vuex";
import RoleToggle from "@/components/role-toggle.vue";
import { toggleRemarkPanelMixin } from "@/mixins/toggle-status";


export default {
  components: {
    BaseContainer,
    SearchBar,
    OrderCategory,
    OrderList,
    OrderListBottomTabs,
    OrderListInfo,
    EmptyPage,
		RoleToggle,
		PriceChange,
  },
	mixins: [toggleRemarkPanelMixin],
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

			isShow: false,

      orderType: ASSIGNED,
      isScroll: false,

      loadOptions: {
        page: 1,
        pageSize: 10,
        total: 0,
        loading: false,
        loaded: false,
      },
			user: {
				avatar: '',
				name: '昵称',
				id: 'id',
			},
			panelHeight: 0, // 订单类型选项到屏幕剩余高度
			type: 1, // 0:接单列表，1:我的配送列表
			status: 1, // 0:未派单，1:配送中，2:已配送 （接单列表传0，我的配送列表根据tab传 1 或 2）
			searchText: '', // 搜索内容
			orderCount: 0, // 订单数量
			deliveringOrderCount: 0, // 配送中的订单数量
			orderList: [], // 订单列表
			orderInfo: {}, // 订单数据
    };
  },
	computed: {
		...mapGetters(['userInfo']),
		queryParams() {
		  const params = {
		    type: this.type,
				status: this.status,
		    delivery_keywords: this.searchText
		  };
		
		  if (this.status) {
		    params.status = this.status;
		  }
		  return params;
		}
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
		// this.handleForceRefetch();
  },
	onShow() {
		this.handleForceRefetch();
	},
  onUnload() {
  },
  watch: {
		// 订单类型，接单或我的配送
    orderType(nVal) {
      this.status = nVal ? 0 : 1;
			this.type = nVal ? 0 : 1
    },
		// 订单列表接口参数
    queryParams() {
      this.handleForceRefetch();
    }
  },
  methods: {
		// 刷新订单
    handleForceRefetch() {
      this.handleResetLoadOptions();
      this.orderList = [];
      return this.handleGetOrderList();
    },
		// 重置订单加载参数
    handleResetLoadOptions() {
      this.loadOptions.page = 1;
      this.loadOptions.total = 0;
      this.loadOptions.loaded = false;
      this.loadOptions.loading = false;
    },
		// 改变搜索文本
    changeSearchText(searchText) {
      this.searchText = searchText;
    },
		// 回车确认搜索文本
		confirmSearchText(searchText) {
			this.searchText = searchText;
			this.handleForceRefetch()
		},
		// 获取订单数据
    async handleGetOrderList() {
      const { loading, loaded, page, pageSize } = this.loadOptions;
      if (loading || loaded) return;
      this.loadOptions.loading = true;
      try {
				const data = {
					...this.queryParams,
					page: page,
					limit: pageSize
				}
        const res = await getDeliveryStaffOrderList(data)
				if (data.type == 1 && data.status == 1) {
					this.deliveringOrderCount = res.data.count
				}
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
    },
		// 订单备注
		async handleSaveRemark({ remark }) {
		  if (!remark) {
		    this.$util.Tips({
		      title: "请输入备注信息",
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
		    this.remarkPanelVisible = false;
		  } catch (err) {
		    uni.hideLoading();
		    this.$util.Tips({
		      title: err,
		      icon: "none"
		    });
		  }
		},
		// 切换配送情况index{0: 配送中，1: 已配送}
		changeDeliveryCase(index) {
			this.status = index ? 2 : 1;
		},
		//点击订单备注按钮，获取选中的订单数据
		getOrderInfo(data) {
			this.orderInfo = data
			this.handleOpenRemarkPanel()
		},
		confirm() {
			this.isShow = true;
		},
		changeIsShow: function(res) {
			this.isShow = res
		},
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
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0) 30%, #f5f5f5 100%);
  // &.unassign-order-and-scroll {
  //   background: #f5f5f5;
  // }
}

/* 配送类型分类 */
.order-category-bg {
	position: relative;
	&::after,
	&::before {
		position: absolute;
		content: '';
		width: 100%;
		top: -10rpx;
	}
	&::before {
		height: 50rpx;
		background-image: linear-gradient(90deg, #2291F8 0%, #1CD1DC 100%);
	}
	&::after {
		top: 0;
		height: 48rpx;
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

  /deep/ .empty-box {
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
  margin-top: -2rpx;
  position: relative;

  &.is-assign-order {
    margin-top: -36rpx;
  }
}
</style>