<template>
  <base-container>
    <!-- 有网络权限 -->
    <template v-if="!errorNetwork">
      <diyPage :diyId="diyId" :scrollTop="scrollTop" v-if="diyId" />

      <diyDataProvider :diyId="diyId" v-if="diyId">
        <template #config="{ tabbarConfig }">
          <view class="main">
            <!-- 首页推荐 -->
            <view v-if="recommend_switch == 1" class="index-product-wrapper">
              <!-- 首发新品 -->
              <recommend :hostProduct="hostProduct" :indexP="true" :isTab="true" :isLogin="isLogin"
                :isCustom="!!tabbarConfig">
              </recommend>
              <view class="loadingicon acea-row row-center-wrapper" v-if="hostProduct.length > 0">
                <text class="loading iconfont icon-jiazai" :hidden="hotLoading == false"></text>
                {{ hotTitle }}
              </view>
            </view>
          </view>

          <!-- #ifdef H5 -->
          <a v-if="beian_sn" href="https://beian.miit.gov.cn" class="copyRight">{{ beian_sn }}</a>
          <!-- #endif -->
          <!-- #ifndef H5 -->
          <view v-if="beian_sn" class="copyRight" @click="goCopyright('https://beian.miit.gov.cn')">{{ beian_sn }}</view>
          <!-- #endif -->

          <!-- 底部占位组件 -->
          <pageFooterPlaceholder v-if="tabbarConfig" :tabbarConfig="tabbarConfig"></pageFooterPlaceholder>
          <tabbarCheck ref="tabbarCheck" :tabbarConfig="tabbarConfig" v-if="tabbarConfig" />
        </template>
      </diyDataProvider>
    </template>

    <!-- 没有网络权限 -->
    <view class="error-network" v-else>
      <image :src="`${domain}/static/images/error-network.png`"></image>
      <view class="title">ການເຊື່ອມຕໍ່ເຄືອຂ່າຍຂັດຂ້ອງ</view>
      <view class="con">
        <view class="label">ກະລຸນາກວດສອບການຕັ້ງຄ່າ:</view>
        <view class="item">· ໃນການຕັ້ງຄ່າໄດ້ເປີດສິດເຄືອຂ່າຍຫຼືບໍ່</view>
        <view class="item">· ປະຈຸບັນຢູ່ໃນສະພາບແວດລ້ອມເຄືອຂ່າຍອ່ອນຫຼືບໍ່</view>
        <view class="item">· ເວີຊັ່ນຕໍ່າເກີນໄປ, ລອງອັບເກຣດ</view>
      </view>
      <view class="btn" @click="reconnect">ເຊື່ອມຕໍ່ໃໝ່</view>
    </view>

    <!-- #ifdef APP-PLUS -->
    <!-- App 隐私协议 -->
    <view class="privacy-wrapper" v-if="privacyStatus">
      <view class="privacy-box">
        <view class="title">ຂໍ້ຕົກລົງຜູ້ໃຊ້ ແລະ ນະໂຍບາຍຄວາມເປັນສ່ວນຕົວ</view>
        <view class="content">
          ກະລຸນາອ່ານຢ່າງລະມັດລະວັງ ແລະ ເຂົ້າໃຈຢ່າງເຕັມທີ່ກ່ຽວກັບ "ຂໍ້ຕົກລົງຜູ້ໃຊ້ ແລະ ນະໂຍບາຍຄວາມເປັນສ່ວນຕົວ" ທຸກຂໍ້ກຳນົດ, ລວມທັງແຕ່ບໍ່ຈຳກັດ: ເພື່ອໃຫ້ບໍລິການສື່ສານທັນທີ, ແບ່ງປັນເນື້ອຫາ ແລະ ອື່ນໆ, ພວກເຮົາຈຳເປັນຕ້ອງເກັບກຳຂໍ້ມູນອຸປະກອນ, ບັນທຶກການດຳເນີນງານ ແລະ ຂໍ້ມູນສ່ວນຕົວອື່ນໆຂອງທ່ານ. ທ່ານສາມາດໃນ "ການຕັ້ງຄ່າ" ເບິ່ງ, ປ່ຽນ, ລຶບຂໍ້ມູນສ່ວນຕົວ ແລະ ຈັດການການອະນຸຍາດຂອງທ່ານ.
          <br />
          ທ່ານສາມາດອ່ານ
          <navigator url="/pages/users/user_about/index?from=sys_user_agree">《ຂໍ້ຕົກລົງຜູ້ໃຊ້》</navigator>ແລະ<navigator
            url="/pages/users/user_about/index?from=sys_userr_privacy">《ນະໂຍບາຍຄວາມເປັນສ່ວນຕົວ》</navigator>
          ເພື່ອເຂົ້າໃຈລາຍລະອຽດ. ຖ້າທ່ານເຫັນດີ, ກະລຸນາກົດ "ຂ້ອຍເຫັນດີ" ເພື່ອເລີ່ມໃຊ້ບໍລິການ.
        </view>
        <view class="btn-box">
          <view class="btn-item" @click="confirmApp">ຂ້ອຍເຫັນດີ</view>
          <view class="btn" @click="closeModel">ເບິ່ງໄປກ່ອນ</view>
        </view>
      </view>
    </view>
    <!-- #endif -->

    <!-- 发送给朋友图片 -->
    <view class="share-box" v-if="isIntegral">
      <!-- #ifndef H5 -->
      <image :src="`${domain}/static/images/share-info.png`" @click="closeShare"></image>
      <!-- #endif -->
      <!-- #ifdef H5 -->
      <image :src="`${domain}/static/images/share-info-wechat.png`" @click="closeShare"></image>
      <!-- #endif -->
    </view>

    <!-- 优惠券弹窗 -->
    <view class="coupon_popups" v-if="showCoupon">
      <!-- <view class="coupon_popups"> -->
      <view class="bg"></view>
      <view class="con" @click.stop="goCoupon"
        :style="{ 'background-image': register_popup_pic ? `url(${register_popup_pic})` : `url(${domain}/static/images/coupon-window.png)` }">
        <scroll-view v-if="!register_popup_pic" scroll-y="true" class="coupon-count">
          <view class="item" v-for="(item, index) in couponArray"
            :style="{ 'background-image': `url(${domain}/static/images/coupon-list-bg.png)` }" :key="index">
            <view class="left">
              <view class="price semiBold">
                <priceFormat :price="item.coupon_price" weight intSize="40" floatSize="26" labelSize="24"></priceFormat>
              </view>
              <block v-if="item.coupon_type != 'balance'">
                <view class="max_price" v-if="item.use_min_price > 0">ຊື້ຄົບ{{ item.use_min_price }}ໃຊ້ໄດ້</view>
                <view class="max_price" v-else>ຮັບຄູປອງຫຼຸດທັນທີ{{ item.coupon_price }}ກີບ</view>
              </block>
            </view>
            <view class="right">
              <view class="title line1">{{ item.coupon_type == 'balance' ? "ເງິນຍອດພິເສດສຳລັບຜູ້ໃໝ່" : "ຄູປອງພິເສດສຳລັບຜູ້ໃໝ່" }}~</view>
              <view class="info line1">{{ item.coupon_type == 'balance' ? "ເງິນຍອດ" : "ຄູປອງ" }}ຖືກເພີ່ມເຂົ້າໃນບັນຊີຂອງທ່ານແລ້ວ~</view>
            </view>
          </view>
        </scroll-view>
        <view v-if="!register_popup_pic" class="integral-count">
          ສິດພິເສດຖືກເພີ່ມເຂົ້າໃນບັນຊີຂອງທ່ານແລ້ວ, ຍັງມີ{{ register_give_integral }}ຄະແນນ, ໄປສັ່ງຊື້ໄດ້ເລີຍ!
        </view>
        <view class="coupon-window-btn">
          <block v-if="!register_popup_pic">
            <navigator v-if="!only_register_money" url="/pages/columnGoods/goods_coupon_list/index" hover-class="none"
              class="coupon-btn" :style="{ 'background-image': `url(${domain}/static/images/coupon-btn.png)` }">
            </navigator>
            <navigator v-else url="/pages/columnGoods/goods_list/index" hover-class="none" class="coupon-btn"
              :style="{ 'background-image': `url(${domain}/static/images/coupon-btn.png)` }"></navigator>
          </block>
          <view class='iconfont icon-ic_close1' @click.stop="showCoupon = false"></view>
        </view>
      </view>
    </view>

    <!-- #ifndef H5 -->
    <passwordPopup></passwordPopup>
    <!-- #endif -->
  </base-container>
</template>
<script>
// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016-2026 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------
let app = getApp();
import { getUserInfo } from '@/api/user.js';
import { getDiy, getPageDiy, getAppVersion } from '@/api/api.js';
import { getStorage } from '@/libs/uniApi.js';
import { goShopDetail } from '@/libs/order.js';
import { toLogin } from '@/libs/login.js';
import { mapGetters } from 'vuex';
import { getProductslist, getProductHot, storeCategory } from '@/api/store.js';
import { initiateAssistApi } from '@/api/activity.js';
import { setVisit } from '@/api/user.js';
import recommend from '@/components/recommend';
// #ifndef H5
import passwordPopup from '@/components/passwordPopup';
// #endif
import { silenceBindingSpread, configMap } from '@/utils/index';
import history from '@/mixins/history';
import shareScence from '@/libs/spread';
import { getNewPeopleCouponLst } from '@/api/activity.js'
import { HTTP_REQUEST_URL } from '@/config/app';
import BaseContainer from '@/components/common/base_container.vue';
import pageFooterPlaceholder from "@/components/diyPage/pageFooterPlaceholder.vue";
import diyDataProvider from '@/components/diyPage/common/diyDataProvider.vue';
import tabbarCheck from '@/components/diyPage/common/tabbarCheck.vue';
import diyPage from "@/sub-packages/diy/diyPage/index.vue";

export default {
  computed: configMap({ hide_mer_status: 0, recommend_switch: 0, beian_sn: '', share_title: '', share_pic: '', site_name: '', hot_ranking_switch: 0, navigation: {} },
    mapGetters(['isLogin', 'uid', 'keyColor', 'viewColor', 'cartNum', 'location'])),
  mixins: [history],
  components: {
    BaseContainer,
    pageFooterPlaceholder,
    recommend,
    diyDataProvider,
    tabbarCheck,
    diyPage,
    // #ifndef H5
    passwordPopup,
    // #endif
  },
  // #ifdef MP
  componentPlaceholder: {
    "diy-page": "view"
  },
  // #endif
  data() {
    return {
      domain: HTTP_REQUEST_URL,
      scrollTop: 0,
      styleConfig: [],
      showSkeleton: true, //骨架屏显示隐藏
      isNodes: 0, //控制什么时候开始抓取元素节点,只要数值改变就重新抓取
      privacyStatus: false,
      errorNetwork: false,
      userInfo: {},
      navIndex: 0,
      navTop: [],
      subscribe: false,
      followUrl: '',
      followHid: true,
      followCode: false,
      sortList: [],
      window: false,
      navH: '',
      couponList: [],
      marTop: 0,
      loadend: false,
      loading: false,
      loadTitle: 'ໂຫລດເພີ່ມເຕີມ',
      where: {
        pid: 0,
        page: 1,
        limit: 6
      },
      is_switch: true,
      hostProduct: [],
      hotPage: 1,
      hotLimit: 30,
      hotScroll: true,
      hotLoading: false,
      hotTitle: 'ໂຫລດເພີ່ມເຕີມ',
      isFixed: false,
      scrolled: false,
      tempArr: [], //精品推荐临时数组
      d: '',
      h: '',
      m: '',
      s: '',
      sum_h: '',
      sortMarTop: 0,
      globalDatas: {},
      currSpid: '',
      _options: {},
      isIntegral: false,
      appUpdate: {},
      bgColor: '',
      bgPic: '',
      bgTabVal: '',
      windowHeight: 0,
      isHeaderSerch: false,
      showCoupon: false,
      couponArray: [
        // {coupon_price:"200",use_min_price:"1000"},
        // {coupon_price:"200",use_min_price:""},
        // {coupon_price:"20",coupon_type:"balance"},
      ],
      register_popup_pic: "",
      register_give_integral: 0,
      balance: 0,
      smallPage: false,
      isMenu: false,
      isScale: false,
      homeCombData: {},
      footerStatus: false,
      activeRouter: '',
      diyId: undefined,
      preview: false,
      isSupport: true,
      only_register_money: false
    };
  },
  /**
   * 用户点击右上角分享
   */
  // #ifdef MP
  onShareAppMessage: function () {
    let that = this;
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
    return {
      title: that.share_title,
      imageUrl: that.share_pic,
      path: '/pages/index/index?spid=' + that.uid
    };
  },
  onShareTimeline: function () {
    let that = this;
    return {
      title: that.share_title,
      query: {
        spid: that.uid
      },
      imageUrl: that.share_pic
    };
  },
  // #endif
  onLoad(options) {
    let that = this
    this._options = options;
    this.diyId = this.$util.getDiyId(options);
    this.preview = options.time ? true : false;
    that.$nextTick(function () {
      uni.getSystemInfo({
        success: function (res) {
          that.windowHeight = res.windowHeight;
        }
      });
    })
    // #ifdef APP-PLUS
    that.appVersionConfig(); //APP版本检测
    that.checkFirstLaunch(options);
    // #endif
    // #ifndef APP-PLUS
    that.pageLoad(options);
    // #endif

    if (this.diyId === 0) {
      this.$store.dispatch("fetchDiyData")
        .then(data => {
          this.diyId = data.id;
          if (this.recommend_switch == 1) {
            this.get_host_product();
          }
        });
    }
  },
  created(options) {
    let routes = getCurrentPages(); // 获取当前打开过的页面路由数组
    let curRoute = routes[routes.length - 1].route //获取当前页面路由
    this.activeRouter = '/' + curRoute
  },
  onShow() {
    this.$refs.tabbarCheck && this.$refs.tabbarCheck.check();
    let that = this
    that.isIntegral = uni.getStorageSync('isIntegral')
    // #ifdef APP-PLUS
    if (that.appUpdate.openUpgrade == '1') {
      that.alertAppUpdate();
    }
    // #endif
    that.loadCoupon()
    that.$util.getCartNum(that.isLogin, null)
  },
  onHide() {
    uni.setStorageSync('isIntegral', false)
  },
  onReady() { },
  watch: {
    globalDatas(nVal, oVal) {
      // #ifdef H5
      this.ShareInfo(nVal);
      // #endif
    },
    location() {
      if (this.recommend_switch != 1) return;
      const request = () => {
        this.hotPage = 1;
        this.hostProduct = [];
        this.get_host_product();
      }
      // 如果正在请求，则等待上一次的任务完成后再发起请求
      if (this.hotLoading) {
        this.getRecommendTask.then(request);
      } else {
        request();
      }
    }
  },
  onPageScroll(event) {
		this.scrollTop = event.scrollTop;
	},
  onPullDownRefresh() {
    this.reconnect();
    // #ifdef APP-PLUS
    setTimeout(() => {
      uni.reLaunch({
        url: "/pages/index/index"
      });
    }, 50)
    // #endif
  },
  methods: {
    goCopyright(url) {
      this.$util.JumpPath(url);
    },
    loadCoupon() {
      if (!this.showCoupon && !uni.getStorageSync('show_coupon') && uni.getStorageSync('is_new_user')) {
        getNewPeopleCouponLst().then(res => {
          this.couponArray = res.data.coupon;
          this.only_register_money = res.data.coupon.length > 0 ? false : true;
          if (res.data.register_money_status == 1 && res.data.register_give_money > 0) {
            this.couponArray.push({
              coupon_price: res.data.register_give_money,
              coupon_type: "balance",
            })
          }
          this.register_give_integral = res.data.register_integral_status == 1 ? res.data.register_give_integral : "";
          this.register_popup_pic = res.data.register_popup_pic;
          setTimeout(() => {
            this.showCoupon = res.data.newcomer_status == 1 && (res.data.coupon.length > 0 || (res.data.register_integral_status && res.data.register_give_money > 0));
            uni.setStorageSync('show_coupon', true)
          }, 1500);
        })
      }
    },
    goCoupon() {
      if (this.register_popup_pic) {
        uni.navigateTo({
          url: '/pages/columnGoods/goods_coupon_list/index'
        });
      }
    },
    checkFirstLaunch(options) {
      const isFirstLaunch = !uni.getStorageSync('appLaunched');
      if (isFirstLaunch) {
        uni.setStorageSync('appLaunched', true);
        this.showWelcomeAndCheckNetwork(options);
      } else {
        this.pageLoad(options);
      }
    },
    showWelcomeAndCheckNetwork(options) {
      uni.showModal({
        title: 'ຍິນດີຕ້ອນຮັບ',
        content: 'ການໃຊ້ຄັ້ງທຳອິດກະລຸນາຮັບປະກັນວ່າການເຊື່ອມຕໍ່ເຄືອຂ່າຍປົກກະຕິ',
        success: (res) => {
          if (res.confirm) {
            this.pageLoad(options);
          }
        }
      });
    },
    async pageLoad(options) {
      let that = this;
      if (options.spid) {
        that.currSpid = options.spid;
        app.globalData.spid = options.spid;
      } else if (getStorage('spid')) {
        that.currSpid = getStorage('spid');
        app.globalData.spid = getStorage('spid');
      }
      // #ifdef APP-PLUS
      try {
        let val = uni.getStorageSync('privacyStatus') || true;
        if (!val) {
          this.privacyStatus = true;
        }
      } catch (e) { }
      this.snycNetWork();
      // #endif
      // #ifdef MP
      if (options.scene) {
        let value = that.$util.getUrlParams(decodeURIComponent(options.scene));
        if (value.id) options.id = value.id;
        //记录推广人uid
        if (value.spid) {
          that.currSpid = value.spid;
          app.globalData.spid = value.spid;
        } else if (getStorage('spid')) {
          that.currSpid = getStorage('spid');
          app.globalData.spid = getStorage('spid');
        }
      }
      // #endif
      shareScence(that.currSpid, that.isLogin);
      this.isLogin && silenceBindingSpread();
      this.reloadData();
      // Promise.all([
      //   this.diyData(0),
      // ]);
      if (this.isLogin) {
        this.getUserInfo();
      }
    },
    closeShare() {
      uni.setStorageSync('isIntegral', false);
      this.isIntegral = uni.getStorageSync('isIntegral');
    },
    // 重新链接
    reconnect() {
      uni.getNetworkType({
        success: res => {
          this.errorNetwork = res.networkType === 'none';
          if (!this.errorNetwork) {
            this.pageLoad(this._options);
          }
        }
      });
    },
    // #ifdef APP-PLUS
    snycNetWork() {
      uni.getNetworkType({
        success: res => {
          this.errorNetwork = res.networkType === 'none';
        }
      });
    },
    // 同意隐私协议
    confirmApp() {
      uni.setStorageSync('privacyStatus', true);
      this.privacyStatus = false;
    },
    // 关闭 Model
    closeModel() {
      this.privacyStatus = false;
    },
    // #endif
    // 对象转数组
    objToArr(data) {
      let obj = Object.keys(data).sort();
      let m = obj.map(key => data[key]);
      return m;
    },
    diyData(id) {
      let that = this;
      let parmas = {
        id: id,
        did: that.diyId,
        version: '221'
      }
      that.styleConfig = []
      that.smallPage = false;
      getDiy(parmas).then(res => {
        setTimeout(() => {
          that.isNodes++;
        }, 0);
        that.errorNetwork = false
        let data = res.data;
        uni.setNavigationBarTitle({
          title: data.title
        });
        if (data.is_bg_color) {
          that.bgColor = data.color_picker
        }
        if (data.is_bg_pic) {
          that.bgPic = data.bg_pic
          that.bgTabVal = data.bg_tab_val
        } else {
          that.bgPic = ""
        }
        that.styleConfig = that.objToArr(data.value);
        that.styleConfig.forEach((item, index, arr) => {
          item.did = data.id
          if (item.name == 'headerSerch' || item.name == 'homeComb') {
            that.isHeaderSerch = true
            if (item.name == 'homeComb') {
              that.$set(that, 'homeCombData', item)
              that.smallPage = true;
            }
          }
          if (item.name == 'pageFoot') {
            if (item.status && item.status.status) {
              this.newData = item
              setTimeout((e) => {
                that.$set(that, 'footerStatus', true);
              }, 50)
            }
            uni.setStorageSync('FOOTER_BAR', item.status && item.status.status ? true : false)
            item.menuList.map((path, index) => {
              if (path.link === '/pages/order_addcart/order_addcart') {
                uni.setStorageSync('FOOTER_ADDCART', index)
              }
            })
            arr.splice(index, 1);
          }
          if (item.name == 'menus') {
            that.isMenu = true;
          }
          if (that.recommend_switch == 1) that.get_host_product()
          uni.pageScrollTo({
            scrollTop: 0,
          })
          that.overflow = false;
          uni.stopPullDownRefresh();
        });
      }).catch(err => {
        uni.showToast({
          title: err,
          icon: 'none'
        })
        uni.stopPullDownRefresh();
      });
    },
    // #ifdef APP-PLUS
    appVersionConfig() {
      var that = this;
      //app升级
      // 获取本地应用资源版本号
      getAppVersion().then(res => {
        that.$set(that.appUpdate, 'androidAddress', res.data.androidAddress);
        that.$set(that.appUpdate, 'appVersion', res.data.appVersion);
        that.$set(that.appUpdate, 'iosAddress', res.data.iosAddress);
        that.$set(that.appUpdate, 'openUpgrade', res.data.openUpgrade);
        plus.runtime.getProperty(plus.runtime.appid, function (inf) {
          let nowVersion = (inf.version).split('.').join('');
          let appVersion = (res.data.appVersion).split('.').join('');
          that.$set(that.appUpdate, 'alert', appVersion > nowVersion);
          that.alertAppUpdate();
        });
      })
    },
    alertAppUpdate() {
      if (this.appUpdate.alert) {
        uni.getSystemInfo({
          success: (res) => {
            uni.showModal({
              title: 'ການແຈ້ງເຕືອນອັບເດດ',
              content: 'ພົບເວີຊັ່ນໃໝ່, ຕ້ອງການດາວໂຫລດບໍ່?',
              showCancel: this.appUpdate.openUpgrade != '1',
              cancelColor: '#eeeeee',
              confirmColor: '#FF0000',
              success: (response) => {
                if (response.confirm) {
                  switch (res.platform) {
                    case "android":
                      plus.runtime.openURL(this
                        .appUpdate
                        .androidAddress);
                      break;
                    case "ios":
                      plus.runtime.openURL(encodeURI(
                        this.appUpdate
                          .iosAddress));
                      break;
                  }
                }
              }
            });
          }
        })
      }
    },
    // #endif
    /**
     * 获取个人用户信息
     */
    getUserInfo: function () {
      let that = this;
      getUserInfo().then(res => {
        that.userInfo = res.data;
      });
    },
    // 记录会员访问
    setVisit() {
      setVisit({
        url: '/pages/index/index'
      }).then(res => {
        console.log(res);
      });
    },
    /**
     * 获取我的推荐
     */
    get_host_product: function () {
      let that = this;
      let num = that.hotLimit;
      if (!that.hotScroll) return;
      if (that.hotLoading) return;
      that.hotLoading = true;
      that.hotTitle = '';
      this.getRecommendTask = getProductHot(that.hotPage, that.hotLimit, that.location).then(res => {
        let list = res.data.list;
        let productList = that.$util.SplitArray(list, that.hostProduct);
        let hotScroll = list.length <= num && list.length != 0;
        that.hotScroll = hotScroll;
        that.hotLoading = false;
        that.hotTitle = !hotScroll ? 'ໂຫລດຄົບຖ້ວນແລ້ວ' : 'ໂຫລດເພີ່ມເຕີມ';
        that.$set(that, 'hostProduct', productList);
        that.$set(that, 'hotPage', that.hotPage + 1);
      });
    },
    reloadData() {
      setTimeout(() => {
        this.showSkeleton = false
      }, 500)
    },
    //#ifdef H5
    ShareInfo(datas) {
      let data = this.storeInfo;
      let href = location.href;
      if (this.$wechat.isWeixin()) {
        if (this.isLogin) {
          href = href.indexOf('?') === -1 ? href + '?spid=' + this.uid : href + '&spid=' + this.uid;
        } else {
          href = href;
        }
        let configAppMessage = {
          desc: datas.share_info,
          title: datas.share_title,
          link: href,
          imgUrl: datas.share_pic
        };
        this.$wechat
          .wechatEvevt(['updateAppMessageShareData', 'updateTimelineShareData', 'onMenuShareAppMessage', 'onMenuShareTimeline'], configAppMessage)
          .then(res => { })
          .catch(err => {
            console.log(err);
          });
      }
    },
    //#endif
  },
  // 滚动到底部
  onReachBottom() {
    if (this.recommend_switch == 1 && this.navIndex == 0) {
      // 首页加载更多
      this.get_host_product();
    }
  },
  onUnload() {
    // 页面卸载时取消监听
    // uni.offNetworkStatusChange();
  }
};
</script>

<style lang="scss" scoped>
.error-network {
  position: fixed;
  left: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  padding-top: 40rpx;
  background: #fff;
  padding-top: 30%;

  image {
    width: 414rpx;
    height: 336rpx;
  }

  .title {
    position: relative;
    top: -40rpx;
    font-size: 32rpx;
    color: #666;
  }

  .con {
    font-size: 24rpx;
    color: #999;

    .label {
      margin-bottom: 20rpx;
    }

    .item {
      margin-bottom: 20rpx;
    }
  }

  .btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 508rpx;
    height: 86rpx;
    margin-top: 100rpx;
    border: 1px solid #d74432;
    color: #e93323;
    font-size: 30rpx;
    border-radius: 120rpx;
  }
}

.privacy-wrapper {
  z-index: 999;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background: #7f7f7f;

  .privacy-box {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 560rpx;
    padding: 50rpx 45rpx 0;
    background: #fff;
    border-radius: 20rpx;

    .title {
      text-align: center;
      font-size: 32rpx;
      text-align: center;
      color: #333;
      font-weight: 700;
    }

    .content {
      margin-top: 20rpx;
      line-height: 1.5;
      font-size: 26rpx;
      color: #666;

      navigator {
        display: inline-block;
        color: #e93323;
      }
    }

    .btn-box {
      margin-top: 40rpx;
      text-align: center;
      font-size: 30rpx;

      .btn-item {
        height: 82rpx;
        line-height: 82rpx;
        background: linear-gradient(90deg, #f67a38 0%, #f11b09 100%);
        color: #fff;
        border-radius: 41rpx;
      }

      .btn {
        padding: 30rpx 0;
      }
    }
  }
}

.coupon_popups {
  z-index: 999;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  text-align: center;

  .bg {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
  }

  .con {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 540rpx;
    height: 860rpx;
    background-size: 100% auto;
    background-repeat: no-repeat;

    .coupon-count {
      width: 464rpx;
      max-height: 300rpx;
      padding: 20rpx 10rpx 0;
      margin: 180rpx auto 0;
    }

    .item {
      display: flex;
      align-items: center;
      width: 100%;
      height: 140rpx;
      background-repeat: no-repeat;
      background-size: 100% 100%;
      margin-bottom: 28rpx;
      border-radius: 20rpx;
      position: relative;

      .left {
        width: 240rpx;
        text-align: center;

        .price {
          color: #FBFCDA;
          font-size: 26rpx;
          font-weight: bold;

          text {
            font-size: 46rpx;
          }
        }

        .max_price {
          color: rgba(251, 252, 218, 0.8);
          font-size: 18rpx;
          margin-top: 8rpx;
        }
      }

      .right {
        width: 432rpx;
        padding: 0 20rpx;

        .title {
          color: #FBFCDA;
          font-size: 28rpx;
          font-weight: bold;
        }

        .info {
          color: rgba(255, 249, 216, 0.8);
          font-size: 16rpx;
          margin-top: 12rpx;
        }
      }
    }

    .integral-count {
      color: #3D3D3D;
      font-size: 18rpx;
      margin-top: 40rpx;
    }

    .coupon-window-btn {
      width: 100%;
      position: absolute;
      bottom: 0;

      .coupon-btn {
        width: 442rpx;
        height: 106rpx;
        background-size: 100% 100%;
        margin: 0 auto 60rpx;
      }

      .icon-ic_close1 {
        color: #ffffff;
        font-size: 70rpx;
        margin: 0 auto;
      }
    }
  }
}

.copyRight {
  display: block;
  margin: 60rpx auto 20rpx;
  max-width: 690rpx;
  width: fit-content;
  font-size: 20rpx;
  color: #707070;
  text-decoration: none;
	background-color: 906f0;
}

</style>
