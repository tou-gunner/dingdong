<!-- 分类页面购物车 bar -->
<template>
  <view>
    <view class="w-710 h-96 cart_box" :style="[cartBarStyle]">
      <view class="w-full h-full flex-between-center">
        <view class="flex-y-center" @tap="openCartList">
          <view class="w-96 h-96 rd-50rpx bg-gradient1 flex-center relative ml--4" :class="{ empty: cartCount == 0 }">
            <image src="@/static/images/cart_pic.png" class="w-54 h-54"></image>
            <uni-badge class="badge-style" v-if="cartCount > 0" :text="cartCount"></uni-badge>
          </view>
          <view class="flex items-baseline ml-32">
            <view style="color: #fff;">
              <priceFormat :price="totalPrice" weight intSize="48" floatSize="32" labelSize="32"></priceFormat>
            </view>
            <view class="fs-24 text--w111-fff lh-34rpx pl-16" v-show="totalPrice > 0">查看明细 <text
                class="iconfont icon-ic_uparrow fs-24"></text> </view>
          </view>
        </view>
        <view class="w-186 h-72 rd-40rpx flex-center text--w111-fff fs-26 fw-500 bg-gradient1 mr-12"
          :class="{ empty: cartCount == 0 }" @tap="subOrder">去结算({{ cartCount || 0 }})</view>
      </view>
    </view>

    <cartList ref="cartList" :cartData="cartData" isFooter :hide_mer_status="hide_mer_status == 1"
      :cartNum="String(cartNum)" :productNumber="productNumber" @cartAllCheck="cartAllCheck" @closeList="closeList"
      @changeSubDel="changeSubDel" 
      @updateCartList="updateCartList" 
      @ChangeCartNumDan="ChangeCartList"
      @refresh="getCartList"
      @ChangeOneDel="ChangeOneDel">
    </cartList>
  </view>
</template>

<script>
import diyTabbarConfigMixin from '@/mixins/diy-tabbar';
import cartList from '@/components/cartList';
import { configMap } from '@/utils';
import { mapGetters } from 'vuex';
import { getCartList, cartDel, changeCartNum, emptyCart } from '@/api/order.js';
import { checkCart } from '@/utils/cartCache';
import { CART_TIME, CART_ID } from '@/config/cache';
import Cache from '@/utils/cache';
export default {
  mixins: [diyTabbarConfigMixin],
  name: 'CartBar',
  components: {
    cartList
  },
  data() {
    return {
      cartCount: 0,
      totalPrice: 0,

      cartData: {
        cartList: [],
        iScart: false
      },
      productNumber: 0,
    };
  },
  computed: {
    ...configMap({ hide_mer_status: 1 }, mapGetters(['isLogin', 'viewColor', 'cartNum'])),
    cartBarStyle() {
      // #ifdef H5
      if (!this.tabbarHeight) return {};
      // #endif
      return {
        "--tabbar-height": `${this.tabbarHeight}px`
      };
    }
  },
  watch: {
    cartNum: {
      handler(nVal, oVal) {
        this.getCartList()
      },
      immediate: true,
      deep: true
    },
  },
  created() {
    this.getCartNum();
  },
  methods: {
    // 购物车商品
    getCartList() {
      let that = this;
      if (!this.isLogin) return;
      getCartList().then(res => {
        if (checkCart()) {
          that.selectedArr = (Cache.get(CART_ID) && JSON.parse(Cache.get(CART_ID))) || []
        } else {
          that.selectedArr = []
        }
        res.data.list.forEach((item, index) => {
          item.allCheck = false
          item.list.forEach((goods, j) => {
            goods.check = that.selectedArr.indexOf(goods.cart_id) != -1
            if (goods.cart_num == 1) {
              goods.numSub = true;
            } else {
              goods.numSub = false;
            }
            if (goods.cart_num == goods.productAttr.stock) {
              goods.numAdd = true;
            } else {
              goods.numAdd = false;
            }
          })
        })
        this.cartData.cartList = res.data.list
        this.productNumber = res.data.productNumber
        this.cartAllCheck('goodsCheck')
      })
    },
    getCartNum() {
      this.$util.getCartNum(this.isLogin, (count) => {
        this.$store.commit('UPDATE_CARTNUM', count);
      })
    },
    // 生成订单；
    subOrder() {
      let selectValue = []
      this.cartData.cartList.forEach(el => {
        el.list.forEach(goods => {
          if (goods.check) {
            selectValue.push(goods.cart_id)
          }
        })
      })
      if (selectValue.length > 0) {
        uni.navigateTo({
          url: '/pages/users/order_confirm/index?cartId=' + selectValue.join(',')
        });
      } else {
        return this.$util.Tips({
          title: '请选择产品'
        });
      }
    },
    openCartList() {
      if (this.cartNum > 0) this.$set(this.cartData, 'iScart', true);
    },
    // 全选判断
    cartAllCheck(type) {
      let that = this;
      let allArr = [];
      let totalMoney = 0
      let totalNum = 0
      that.cartData.cartList.forEach((el, index) => {
        if (type == 'goodsCheck') {
          let tempArr = el.list.filter(goods => {
            return goods.check == true
          })
          if (el.list.length == tempArr.length) {
            el.allCheck = true
            allArr.push(el)
          } else {
            el.allCheck = false
          }
        } else {
          el.list.forEach((goods) => {
            goods.check = that.isAllSelect
          })
          el.allCheck = that.isAllSelect
          if (el.allCheck) allArr.push(el)
        }
        // 总金额 //总数
        el.list.forEach(e => {
          if (e.check) {
            totalMoney = that.$util.$h.Add(totalMoney, that.$util.$h.Mul(e.productAttr.price, e.cart_num))
            totalNum += e.cart_num
          }
        })
      })
      that.totalPrice = totalMoney
      that.cartCount = totalNum
      that.$refs.cartList.updateList(that.cartData.cartList)
    },
    closeList() {
      this.$set(this.cartData, 'iScart', false);
    },
    //清空购物车
    changeSubDel() {
      let that = this;
      uni.showModal({
        title: '提示',
        content: '确定清空购物车',
        success: function (res) {
          if (res.confirm) {
            emptyCart().then(res => {
              that.cartData = {
                iScart: false,
                cartList: []
              }
              that.totalPrice = 0
              that.$util.getCartNum(that.isLogin, null)
              this.cartAllCheck('goodsCheck')
              return that.$util.Tips({
                title: res.message,
                icon: 'success'
              });
            }).catch(err => {
              return that.$util.Tips({
                title: err
              });
            });
          } else if (res.cancel) {
            return that.$util.Tips({
              title: '已取消'
            });
          }
        }
      });
    },
    // 更新购物车列表
    updateCartList(type, list) {
      this.cartData.cartList = list;
      this.cartAllCheck(type)
    },
  }
}
</script>

<style scoped lang="scss">
.cart_box {
  width: 710rpx;
  height: 96rpx;
  border-radius: 48rpx;
  background-color: rgba(0, 0, 0, 0.83);
  position: fixed;
  // #ifdef H5
  bottom: calc(var(--tabbar-height, 20px) + 20rpx);
  // #endif
  // #ifndef H5
  bottom: calc(var(--tabbar-height) + 20rpx);
  // #endif
  left: 50%;
  transform: translateX(-50%);
  z-index: 110;
}

.bg-gradient1 {
  background-image: linear-gradient(90deg, var(--view-bntColor21) 0%, var(--view-bntColor22) 100%);

  &.empty {
    background: #aaa;
  }
}

.badge-style {
  position: absolute;
  top: -10rpx;
  right: -20rpx;

  ::v-deep .uni-badge--error {
    background-color: var(--view-theme) !important;
  }

  .uni-badge {
    color: var(--view-theme);
    border: 1px solid var(--view-theme);
    z-index: 29;
  }
}
</style>
