<template>
  <uni-popup ref="popup" type="bottom">
    <view class="order-assign-wrapper">
      <button class="close-btn" @click="handleClosePopup">
        <text class="iconfont icon-ic_close" />
      </button>
      <view class="popup-title">
        ມອບໝາຍອໍເດີ
      </view>
      <SearchBar placeholder="ໃສ່ຊື່ຜູ້ໃຊ້/ID" custom-class="custom-search-bar" @confirm="handleConfirm" />
      <view class="assign-user-list-scroll">
        <view class="scroll-inner-wrapper">
          <scroll-view scroll-y style="height: 100%;" @scrolltolower="handleScrollToBottom">
            <view class="assign-user-list">
              <view class="assign-user-item" v-for="item in userList" :key="item.staffs_id" @click="handleAssign(item)">
								<image v-if="isCity" class="assign-user-item__avatar" :src="item.avatar" />
								<image v-else class="assign-user-item__avatar" :src="item.photo" />
                <view class="assign-user-item__info">
                  <view class="assign-user-item__name">
                    {{ item.name }}
                  </view>
                  <view class="assign-user-item__phone" @click.stop="handleCall(item)">
                    {{ item.phone }}
                    <text class="iconfont icon-ic_phone" />
                  </view>
                  <view class="assign-user-item__intro overflow-text">
                    {{ item.remark || "-" }}
                  </view>
                </view>
              </view>
            </view>
          </scroll-view>
        </view>
      </view>
    </view>
  </uni-popup>
</template>

<script>
import BaseContainer from "@/components/common/base_container.vue";
import BaseNavBar from "@/components/common/base_nav_bar.vue";
import SearchBar from "@/components/common/search_bar.vue";
import { 
	getStaffList, 
	assignOrderToStaff, 
	reassignOrderToStaff,
	getCityStaffList,
	assignCityOrderToStaff,
	reassignCityOrderToStaff
} from "@/api/admin";


export default {
  name: "OrderAssign",
  components: {
    BaseContainer,
    BaseNavBar,
    SearchBar
  },
  props: {
    merId: String,
  },
  data() {
    return {
      orderId: "",
      isReassign: false,
      userList: [],
			isCity: false,
      loadOptions: {
        page: 1,
        limit: 10,
        keyword: "",
        total: 0,
        loading: false,
        loaded: false
      }
    }
  },
  mounted() {
		// if (this.isCity) {
		// 	this.handleGetCityUserList()
		// } else {
		// 	this.handleGetUserList();
		// }
  },
  methods: {
		// 重置加载参数
		resetLoadOptions() {
			this.userList = []
			this.loadOptions.page = 1;
			this.loadOptions.loaded = false;
			this.loadOptions.loading = false;
		},
    openPanel(orderId, isReassign = false, isCity = false) {
			this.resetLoadOptions()
      this.orderId = orderId;
      this.isReassign = isReassign;
			this.isCity = isCity
      this.$refs.popup.open();
			if (this.isCity) {
				this.handleGetCityUserList()
			} else {
				this.handleGetUserList();
			}
    },
    handleConfirm(value) {
      this.loadOptions.keyword = value;
      this.resetLoadOptions()
      if (this.isCity) {
      	this.handleGetCityUserList()
      } else {
      	this.handleGetUserList();
      }
    },
    async handleAssign(item) {
      const [err, { confirm }] = await uni.showModal({
        title: "ແຈ້ງເຕືອນ",
        content: `ແນ່ໃຈບໍ${this.isReassign ? "ມອບໝາຍໃໝ່" : "ມອບໝາຍ"}ໃຫ້${item.name}?`,
      });
      if (err || !confirm) return;
      uni.showLoading({
        mask: true
      });
			let api = {}
			if (this.isCity) {
				api = this.isReassign ? reassignCityOrderToStaff : assignCityOrderToStaff;
			} else {
				api = this.isReassign ? reassignOrderToStaff : assignOrderToStaff;
			}
      try {
				let result = {}
				if (this.isCity) {
					result = await api(this.merId, this.orderId, {service_id: item.service_id});
				} else {
					result = await api(this.merId, this.orderId, item.staffs_id);
				}
        uni.hideLoading();
        this.$util.Tips({
          title: result.message,
          icon: "success"
        });
        this.handleClosePopup();
        this.$emit("refresh", this.orderId);
      } catch (err) {
        uni.hideLoading();
        this.$util.Tips({
          title: err,
          icon: "none"
        });
      }
    },
    handleCall(item) {
      uni.makePhoneCall({
        phoneNumber: item.phone
      });
    },
    handleClosePopup() {
      this.$refs.popup.close();
    },
    handleScrollToBottom() {
      if (this.orderType == 2) {
      	this.handleGetCityUserList()
      } else {
      	this.handleGetUserList();
      }
    },
    async handleGetUserList() {
      const { page, limit, keyword, loading, loaded } = this.loadOptions;
      if (loading || loaded) return;
      this.loadOptions.loading = true;
      try {
        const res = await getStaffList(this.merId, {
          page,
          limit,
          keyword
        });
        this.loadOptions.page++;
        this.userList = [...this.userList, ...res.data.list];
        this.loadOptions.total = res.data.count;
        this.loadOptions.loaded = this.userList.length >= this.loadOptions.total;
      } catch (err) {
        this.$util.Tips({
          title: err,
          icon: "none"
        });
      }
      this.loadOptions.loading = false;
    },
		async handleGetCityUserList() {
		  const { page, limit, keyword, loading, loaded } = this.loadOptions;
		  if (loading || loaded) return;
		  this.loadOptions.loading = true;
		  try {
		    const res = await getCityStaffList(this.merId, {
		      page,
		      limit,
		      keyword
		    });
		    this.loadOptions.page++;
		    this.userList = [...this.userList, ...res.data.list];
		    this.loadOptions.total = res.data.count;
		    this.loadOptions.loaded = this.userList.length >= this.loadOptions.total;
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

<style lang="scss" scoped>
.order-assign-wrapper {
  background-color: #f5f5f5;
  border-top-left-radius: 40rpx;
  border-top-right-radius: 40rpx;
  height: calc(61vh + var(--safe-area-inset-bottom));
  display: flex;
  flex-direction: column;
  position: relative;
}

.close-btn {
  position: absolute;
  top: 27rpx;
  right: 28rpx;
  width: 36rpx;
  height: 36rpx;
  border-radius: 50%;
  background: #EEEEEE;
  display: flex;
  align-items: center;
  justify-content: center;

  .iconfont {
    font-size: 28rpx;
    color: #999;
  }
}

::v-deep  .custom-search-bar.custom-search-bar {
  --content-height: 72rpx;
  --font-size: 28rpx;
  --color: #ccc;
}

.popup-title {
  margin: 46rpx 0 28rpx;
  text-align: center;
  font-size: 32rpx;
  font-weight: 500;
}

.assign-user-list-scroll {
  flex: 1;
  position: relative;
}

.scroll-inner-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.assign-user-list {
  padding-inline: 20rpx;
  padding-bottom: calc(20rpx + var(--safe-area-inset-bottom));
  font-size: 28rpx;
  color: #333;
}

.assign-user-item {
  display: flex;
  align-items: center;
  padding: 30rpx 24rpx 24rpx;
  background-color: #fff;
  border-radius: 24rpx;

  &+.assign-user-item {
    margin-top: 20rpx;
  }

  &__avatar {
    width: 96rpx;
    height: 96rpx;
    border-radius: 50%;
  }

  &__info {
    flex: 1;
    margin-left: 24rpx;
    overflow: hidden;
  }

  &__name {
    font-weight: 500;
  }

  &__phone {
    display: flex;
    align-items: center;
    width: fit-content;
    margin: 4rpx 0;

    .iconfont {
      margin-left: 12rpx;
      font-size: 28rpx;
      color: #2a7efb;
    }
  }

  &__intro {
    font-size: 24rpx;
    color: #999;
  }
}
</style>
