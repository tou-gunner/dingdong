import util from '@/utils/util.js';
import { goShopDetail } from '@/libs/order.js';

/**
 * 该 mixin 用于处理购买按钮呼起购物车的相关逻辑，需要配合 product-window 组件使用
 * 具体使用方法可参考 pages/store/home/components/good-list.vue 中的使用方式
 */

export default {
  data() {
    return {
      isTab: true,
      isCustom: false,
      max_count: 0,
      min_count: 0,
      pay_limit: 1,
      svipData: {},
      svipPrice: false,
      attr: {
        cartAttr: false,
        productAttr: [],
        productSelect: {}
      },
      storeInfo: {},
      cart_num: 1, //购买数量
      isOpen: false, //是否打开属性组件
      selectedArr: [],
      productValue: [], //系统属性
      attrValue: "",
      uniqueValue: "",
    };
  },
  methods: {
    // 跳转商品详情页
    goDetail(item) {
      goShopDetail(item).then(result => {
        if (result) {
          uni.navigateTo({
            url: `/pages/goods_details/index?id=${item.product_id}`
          });
        }
      });
    },
    /**
     * 打开属性插件
     */
    selecAttr: function (item) {
      let that = this;
      let type = item.product ? item.product.type : item.type
      if ((item.product_type == 0 && type != 0) || item.product_type > 0 || item.mer_form_id || item.stock === 0) {
        that.goDetail(item)
      } else {
        that.storeInfo = item;
        util.getProductSpecs(item.spu_id, function (data) {
          if (!data.attr || !data.attr.productSelect) {
            return that.goDetail(item);
          }
          that.$set(that, "attr", data.attr);
          that.$set(that.attr.productSelect, "store_name", item.store_name);
          that.$set(that, 'svipPrice', item.show_svip_info && item.show_svip_info.show_svip_price || false);
          that.$set(that, 'productValue', data.productValue);
          that.$set(that, "attrValue", data.attrValue);
          that.$set(that.attr, 'cartAttr', true);
          that.$set(that, 'isOpen', true);
        })
      }
    },
    onMyEvent: function () {
      this.$set(this.attr, 'cartAttr', false);
      this.$set(this, 'isOpen', false);
    },
    attrVal(val) {
      this.$set(this.attr.productAttr[val.indexw], 'index', this.attr.productAttr[val.indexw].attr_values[val.indexn]);
    },
    /**
     * 购物车手动填写
     *
     */
    iptCartNum: function (e) {
      this.$set(this.attr.productSelect, 'cart_num', e);
    },
    /**
     * 属性变动赋值
     *
     */
    ChangeAttr: function (res) {
      let productSelect = this.productValue[res];

      this.attr.productSelect = { ...this.attr.productSelect, ...productSelect }
      if (!productSelect || productSelect.stock <= 0) {
        this.$set(this.attr.productSelect, "stock", 0);
        this.$set(this.attr.productSelect, "unique", "");
        this.$set(this.attr.productSelect, "cart_num", 0);
      }
    },
    /**
     * 购物车数量加和数量减
     *
     */
    ChangeCartNum: function (changeValue) {
      //changeValue:是否 加|减
      //获取当前变动属性
      let productSelect = this.productValue[this.attrValue];
      util.ChangeCartNum(productSelect, this.attr, changeValue, function (stock) {
        this.$set(this.attr.productSelect, "cart_num", stock);
      })
    },
    /*
     * 加入购物车
     */
    goCat: function () {
      let that = this,
        productSelect = that.productValue[this.attrValue];
      //打开属性
      if (that.attrValue) {
        //默认选中了属性，但是没有打开过属性弹窗还是自动打开让用户查看默认选中的属性
        that.attr.cartAttr = !that.isOpen ? true : false;
      } else {
        if (that.isOpen) that.attr.cartAttr = true;
        else
          that.attr.cartAttr = !that.attr.cartAttr;
      }
      //只有关闭属性弹窗时进行加入购物车
      if (that.attr.cartAttr === true && that.isOpen === false)
        return (that.isOpen = true);
      that.isOpen = that.attr.cartAttr = true;
      //如果有属性,没有选择,提示用户选择
      if (
        that.attr.productAttr.length &&
        that.isOpen === true &&
        productSelect.stock == 0
      )
        return that.$util.Tips({
          title: "产品库存不足，请选择其它"
        });
      if (that.attr.productSelect.cart_num == 0) {
        return that.$util.Tips({
          title: '购买个数不能为0！'
        })
      }
      let q = {
        is_new: 0,
        product_id: that.storeInfo.product_id,
        cart_num: that.attr.productSelect.cart_num,
        product_attr_unique: that.attr.productSelect !== undefined ? that.attr.productSelect.unique : "",
        product_type: that.storeInfo.product_type,
      };
      util.addCart(q, function () {
        that.isOpen = that.attr.cartAttr = false;
        if (that.isCart) {
          that.$emit("getCartNum");
          // that.$emit("getCartList");
        }
      })
    },
  }
}