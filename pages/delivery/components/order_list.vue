<template>
  <view class="order-list" @click="handleOrderListClick">
    <view 
			class="order-item" 
			v-for="(item, index) of orderList" 
			:key="index"
			:class="{'border-r-0': (orderType == 0 && index == 0)}"
		>
      <view class="order-item-header">
        <!-- <view class="order-item-type">
          {{ item.order_type === 0 ? "上门" : "到店" }}
        </view> -->
        <view class="order-item-sn overflow-text">{{ item.order_sn }}</view>
        <view class="order-item-status" :class="{'deliving-status': item.status === 1 || item.status === 0}">
					{{ getCityDeliveryOrderStatus(item) }}
				</view>
      </view>

      <view class="order-item-contact-info">
        <view class="contact-info-left">
          <view class="contact-info-name overflow-text">
            {{ item.real_name }}
            <text class="contact-info-phone">{{ item.user_phone }}</text>
          </view>
          <view class="contact-info-address overflow-text">
            {{ item.user_address }}
          </view>
        </view>
        <button class="contact-action-btn iconfont icon-ic_Phone" :data-event="EVENT.CALL" :data-index="index"></button>
        <button class="contact-action-btn iconfont icon-icon_Location" :data-event="EVENT.LOCATION"
          :data-index="index"></button>
      </view>

      <navigator hover-class="none" :url="`/pages/delivery/order_detail?id=${item.order_id}&mer_id=${item.mer_id}`"
        v-for="(product, _index) of item.orderProduct" :key="_index">
        <OrderGoodSku :product="product" />
        <view class="order-item-reverse-time overflow-text">
					{{setDeliveryTimeText(item)}}
          <!-- 预期时间：
          {{ product.reservation_date }}
          {{ product.reservation_time_part }}
					送达 -->
        </view>
      </navigator>

      <view class="order-item-btn-group">
        <button 
					v-if="orderType == 1"
					class="order-item-btn" 
					:data-event="EVENT.RUSH_ORDER"
          :data-index="index"
				>ຮັບໜ້າວຽກ</button>
				<block v-if="orderType == 0">
					<button
						class="order-item-btn order-item-remark-btn" 
						:data-event="EVENT.REMARK"
					  :data-index="index"
					>ໝາຍເຫດອໍເດີ</button>
					<button
						v-if="item.status == 1"
						class="order-item-btn" 
						:data-event="EVENT.SERVED_ORDER"
					  :data-index="index"
					>ຢືນຢັນສົ່ງແລ້ວ</button>
				</block>
      </view>
    </view>
		<ConfirmPopUp 
			:isShowConfirmPop="isShowConfirmPop" 
			@closeMask="closeConfirmMask"
			@confirmDelivered = "confirmDelivered"
			></ConfirmPopUp>
  </view>
</template>

<script>
import OrderGoodSku from "@/components/shared-order/order_good_sku.vue";
import ConfirmPopUp from "@/pages/delivery/components/confirm_pop_up.vue"
import { 
	getCityDeliveryOrderStatus, 
	handleMakeCallPhone, 
	handleOpenLocation ,
} from "@/utils/order";
import { 
	rushStaffOrder, 
	verifyStaffOrder,
	receiveStaffOrder,
	confirmeServedOrder,
	receiveServedOrder
} from "@/api/staff";
import { BtnUtil } from "@/utils/order";

const EVENT = {
  CALL: "call",
  LOCATION: "location",
  RUSH_ORDER: "rush_order",
	SERVED_ORDER: "served_order",
	REMARK: "remark"
}

export default {
  components: {
    OrderGoodSku,
		ConfirmPopUp
  },
  props: {
    orderList: {
      type: Array,
      default() {
				return []
			}
    },
    orderType: Number
  },
  data() {
    return {
      BtnUtil,
      EVENT,
			isShowConfirmPop: false, // 是否显示确认弹窗
			actIndex: -1, // 当前被选的列表索引
    };
  },
	created() {
		// console.log(this.orderList)
	},
  methods: {
    getCityDeliveryOrderStatus,
    async handleOrderListClick(e) {
      const { event, index } = e.target.dataset;
      if (event === undefined || index === undefined) return;
      const item = this.orderList[index];
      // if (item === undefined) return;

      if (event === EVENT.CALL) {
        handleMakeCallPhone(item.user_phone);
      } else if (event === EVENT.LOCATION) {
        handleOpenLocation(item.user_address);
      } else if (event === EVENT.RUSH_ORDER) {
        const result = await uni.showModal({
          title: "ທ່ານແນ່ໃຈວ່າຕ້ອງການຮັບໜ້າວຽກນີ້ບໍ?",
        });
        if (result[0] || result[1].cancel) return;
        try {
          const res = await receiveServedOrder(item.order_id);
          this.$util.Tips({
            title: res.message,
            icon: "success"
          });
          uni.navigateTo({
            url: `/pages/delivery/order_detail?id=${item.order_id}`
          });
        } catch (err) {
          this.$util.Tips({
            title: err,
            icon: "none"
          });
          console.log(err);
        }
      } else if(event === EVENT.SERVED_ORDER) {
				this.isShowConfirmPop = true
				this.actIndex = index
				// const [err, { confirm }] = await uni.showModal({
				//   title: "提示",
				//   content: `确定要确认送达吗？`,
				// });
				// if (err || !confirm) return;
				// uni.showLoading({
				//   mask: true
				// });
				// try {
				// 	const data = {
				// 		mer_id: item.merchant.mer_id
				// 	}
				// 	const res = await confirmeServedOrder(item.order_id, data);
				// 	this.$emit('refreshOrder')
				// 	uni.hideLoading();
				// 	this.$util.Tips({
				// 	  title: res.message,
				// 	  icon: "none"
				// 	});
				// } catch (err) {
				//   uni.hideLoading();
				//   this.$util.Tips({
				//     title: err,
				//     icon: "none"
				//   });
				// }
			} else if(event === EVENT.REMARK) {
				console.log('in', item)
				this.$emit('getOrderInfo', item)
			}
    },
		// 配送时间文本设置
		setDeliveryTimeText(orderInfo) {
			try {
				const merId = orderInfo.mer_id
				const takeInfo = JSON.parse(JSON.stringify(orderInfo.merchant_take_info[merId]))
				let deliveryTimeText = ''
				if ('remarks' in takeInfo) {
					const remarks = takeInfo.remarks
					deliveryTimeText = 'ເວລາຄາດໝາຍ: '+remarks
				} else if('date' in takeInfo) {
					const date = takeInfo.date
					const time = takeInfo.time
					deliveryTimeText = 'ເວລາຄາດໝາຍ: '+date+' '+time+' ສົ່ງຮອດ'
				} else {
				}
				return deliveryTimeText
			} catch(err) {
				// console.log(err)
				
			}
		},
		// 关闭确认弹窗
		closeConfirmMask() {
			this.isShowConfirmPop = false
		},
		// 确认送达
		async confirmDelivered() {
			const item = this.orderList[this.actIndex];
			uni.showLoading();
			try {
				const data = {
					mer_id: item.merchant.mer_id
				}
				const res = await confirmeServedOrder(item.order_id, data);
				this.$emit('refreshOrder')
				uni.hideLoading();
				this.isShowConfirmPop = false
				this.$util.Tips({
					title: res.message,
					icon: "none"
				});
			} catch (err) {
				uni.hideLoading();
				this.isShowConfirmPop = false
				this.$util.Tips({
					title: err,
					icon: "none"
				});
			}
		}
  }
}
</script>

<style scoped lang="scss">
.order-list {
  padding: 0 20rpx 20rpx;
  color: #333;
}

.order-item {
  background-color: #fff;
  border-radius: 24rpx;
  padding: 24rpx;

  &+.order-item {
    margin-top: 20rpx;
  }
}

.order-item-header {
  display: flex;
  align-items: baseline;
  margin-bottom: 26rpx;

  .order-item-type {
    height: 32rpx;
    display: flex;
    align-items: center;
    padding-inline: 6rpx;
    font-size: 20rpx;
    color: #2A7EFB;
    border: 1px solid currentColor;
    border-radius: 6rpx;
  }

  .order-item-sn {
    font-size: 28rpx;
    // margin-left: 16rpx;
    flex: 1;
  }

  .order-item-status {
    margin-left: auto;
    font-size: 26rpx;
    color: #2A7EFB;
  }
	.deliving-status {
		color: #FF7E00;
	}
}

.order-item-reverse-time {
  margin-top: 26rpx;
  font-size: 24rpx;
}

.order-item-btn-group {
  display: flex;
  justify-content: flex-end;
  margin-top: 32rpx;

  .order-item-btn {
    height: 64rpx;
    padding-inline: 32rpx;
    border-radius: 50rpx;
    background-color: #2291F8;
    font-size: 24rpx;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;

    &+.order-item-btn {
      margin-left: 20rpx;
    }
  }
	.order-item-remark-btn {
		background-color: #fff;
		border: 1rpx solid #DDDDDD;
		color: #666666;
	}
}

.order-item-contact-info {
  background-color: #f9f9f9;
  border-radius: 16rpx;
  padding: 32rpx;
  display: flex;
  margin-bottom: 26rpx;
  align-items: center;

  .contact-info-left {
    margin-right: 28rpx;
    flex: 1;
    overflow: hidden;
    font-size: 28rpx;
    color: #282828;

    .contact-info-phone {
      margin-left: 30rpx;
    }

    .contact-info-address {
      font-size: 24rpx;
      color: #999;
      margin-top: 6rpx;
    }
  }

  .contact-action-btn {
    width: 56rpx;
    height: 56rpx;
    background-color: #edf2f9;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28rpx;
    color: #2a7efb;

    &+.contact-action-btn {
      margin-left: 32rpx;
    }
  }
}
.border-r-0 {
	border-radius: 0 0 24rpx 24rpx;
}
</style>
