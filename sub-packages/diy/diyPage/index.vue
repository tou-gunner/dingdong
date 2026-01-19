<template>
  <view :style="viewColor">
    <view class="custom-container" :style="[pageBgStyle]" v-if="nestLevel <= 5">
      <template v-for="(item, index) of groupAndFilterComp">
        <follow v-if="item.config.name === 'follow'" :dataConfig="item.config" :key="item.key"
          @hide="handleHideFollowComp" :index="index" />
        <headerSerch v-else-if="item.config.name === 'headerSerch'" :dataConfig="item.config"
          :key="item.key" :index="index" :compCount="groupAndFilterComp.length" />
        <storeHeaderSerch v-else-if="item.config.name === 'storeHeaderSerch'" :dataConfig="item.config"
          :key="item.key" :isScroll="isScroll" :index="index" />
        <template v-else-if="item.config.name === 'homeComb'">
          <homeComb :dataConfig="item.config" :key="item.key" :isScroll="isScroll"
            :tabActiveIndex="tabActiveIndex" @change="handleTabIndexChange" :index="index" :compCount="groupAndFilterComp.length" />
          <tabNavContent :dataConfig="item.config" key="tabNavContent" :tabActiveIndex="tabActiveIndex" :index="index" />
        </template>
        <template v-else-if="item.config.name === 'tabNav'">
          <tabNav :topCompHeight="followCompHeight" :dataConfig="item.config" :key="item.key"
            :tabActiveIndex="tabActiveIndex" @change="handleTabIndexChange" :index="index" />
          <tabNavContent :dataConfig="item.config" key="tabNavContent" :tabActiveIndex="tabActiveIndex" :index="index" />
        </template>
        <storeHead v-else-if="item.config.name === 'store_head'" :dataConfig="item.config"
          :key="item.key" :isScroll="isScroll" :index="index" :compCount="groupAndFilterComp.length" />

        <!-- 分割线 -->

        <swiperBg v-if="item.config.name === 'swiperBg'" :dataConfig="item.config" :key="item.key" :index="index" />
        <pictureCube v-else-if="item.config.name === 'pictureCube'" :dataConfig="item.config" :key="item.key" :index="index" />
        <goodList v-else-if="item.config.name === 'goodList'" :dataConfig="item.config" :key="item.key"
          @selectAttr="handleSelectAttr" :index="index" />
        <menus v-else-if="item.config.name === 'menus'" :dataConfig="item.config" :key="item.key" :index="index" />
        <articleList v-else-if="item.config.name === 'articleList'" :dataConfig="item.config" :key="item.key" :index="index" />
        <hotspot v-else-if="item.config.name === 'hotspot'" :dataConfig="item.config" :key="item.key" :index="index" />
        <news v-else-if="item.config.name === 'news'" :dataConfig="item.config" :key="item.key" :index="index" />
        <promotionList v-else-if="item.config.name === 'promotionList'" :dataConfig="item.config" :key="item.key"
          @selectAttr="handleSelectAttr" :isScroll="isScroll" :index="index" />
        <shopList v-else-if="item.config.name === 'homeStore'" :dataConfig="item.config" :key="item.key" :index="index" />
        <homeRecommend v-else-if="item.config.name === 'homeRecommend'" :dataConfig="item.config" :key="item.key" :index="index" />
        <videos v-else-if="item.config.name === 'videos'" :dataConfig="item.config" :key="item.key" :index="index" />
        <coupon v-else-if="item.config.name === 'coupon'" :dataConfig="item.config" :key="item.key" :index="index" />
        <seckill v-else-if="item.config.name === 'seckill'" :dataConfig="item.config" :key="item.key" :index="index" />
        <liveBroadcast v-else-if="item.config.name === 'liveBroadcast'" :dataConfig="item.config" :key="item.key" :index="index" />
        <combination v-else-if="item.config.name === 'combination'" :dataConfig="item.config" :key="item.key" :index="index" />
        <bargain v-else-if="item.config.name === 'bargain'" :dataConfig="item.config" :key="item.key" :index="index" />
        <presale v-else-if="item.config.name === 'presale'" :dataConfig="item.config" :key="item.key" :index="index" />
        <signIn v-else-if="item.config.name === 'signIn'" :dataConfig="item.config" :key="item.key" :index="index" />
        <community v-else-if="item.config.name === 'community'" :dataConfig="item.config" :key="item.key" :index="index" />
        <ranking v-else-if="item.config.name === 'ranking'" :dataConfig="item.config" :key="item.key" :index="index" />
        <guide v-else-if="item.config.name === 'guide'" :dataConfig="item.config" :key="item.key" :index="index" />
        <titles v-else-if="item.config.name === 'titles'" :dataConfig="item.config" :key="item.key" :index="index" />
        <blankPage v-else-if="item.config.name === 'blankPage'" :dataConfig="item.config" :key="item.key" :index="index" />
        <richText v-else-if="item.config.name === 'richText'" :dataConfig="item.config" :key="item.key" :index="index" />
        <customerService v-else-if="item.config.name === 'customerService'" :dataConfig="item.config" :key="item.key" :index="index" />
        <storeInfo v-else-if="item.config.name === 'store_info'" :dataConfig="item.config" :key="item.key" :index="index" />
        <pageFoot v-else-if="nestLevel === 0 && item.config.name === 'pageFoot'" :dataConfig="item.config"
          :key="item.key" :index="index" />
      </template>
    </view>

    <productWindow :attr="attr" isShow :iSplus='1' :destri="0" isList isTab isCustom @myevent="onMyEvent"
      @ChangeAttr="ChangeAttr" @ChangeCartNum="ChangeCartNum" @attrVal="attrVal" @goCat="goCat" @iptCartNum="iptCartNum"
      id='product-window' :payLimit="pay_limit" :maxCount="max_count" :minCount="min_count" :svipPrice="svipPrice"
      :image="storeInfo.image"></productWindow>
  </view>
</template>

<script>
import { mapGetters } from "vuex";
import cartMixin from "@/mixins/cart";
import productWindow from '@/components/productWindow';
import pageFoot from "./pageFoot.vue";
import headerSerch from "./headerSerch.vue";
import swiperBg from "./swiperBg.vue";
import homeComb from "./homeComb.vue";
import goodList from "./goodList.vue";
import menus from "./menus.vue";
import articleList from "./articleList.vue";
import hotspot from "./hotspot.vue";
import news from "./news.vue";
import tabNav from "./tabNav.vue";
import tabNavContent from "./tabNavContent.vue";
import promotionList from "./promotionList.vue";
import shopList from "./shopList.vue";
import pictureCube from "./pictureCube.vue";
import homeRecommend from "./homeRecommend.vue";
import videos from "./videos.vue";
import coupon from "./coupon.vue";
import seckill from "./seckill.vue";
import liveBroadcast from "./liveBroadcast.vue";
import combination from "./combination.vue";
import bargain from "./bargain.vue";
import presale from "./presale.vue";
import signIn from "./signIn.vue";
import community from "./community.vue";
import ranking from "./ranking.vue";
import guide from "./guide.vue";
import titles from "./titles.vue";
import blankPage from "./blankPage.vue";
import richText from "./richText.vue";
import follow from "./follow.vue";
import customerService from "./customerService.vue";
import storeHeaderSerch from "./storeHeaderSerch.vue";
import storeInfo from "./storeInfo.vue";
import storeHead from "./storeHead.vue";
import { diyUtil } from "@/utils/diy.js";

export default {
  name: "diyPage",
  mixins: [cartMixin],
  components: {
    pageFoot,
    headerSerch,
    swiperBg,
    homeComb,
    goodList,
    menus,
    articleList,
    hotspot,
    news,
    tabNav,
    tabNavContent,
    promotionList,
    shopList,
    pictureCube,
    homeRecommend,
    videos,
    coupon,
    seckill,
    liveBroadcast,
    combination,
    bargain,
    presale,
    signIn,
    community,
    ranking,
    guide,
    titles,
    blankPage,
    richText,
    follow,
    customerService,
    productWindow,
    storeHeaderSerch,
    storeInfo,
    storeHead
  },
  props: {
    // 必须传递 diyId，用于获取 diy 模板数据
    // 如果要使用默认 diy 数据模板，应该在 diyPage 父组件中 dispatch fetchDiyData 获取默认模板 id
    // 然后传递给 diyPage 组件
    diyId: {
      type: Number,
      default: 0,
    },
    // 商户 id，商户调用该组件时需要传递该数据
    merId: {
      type: Number,
      default: 0
    },
    // 嵌套的 diy id 列表，用于判断是否存在循环引用
    nestDiyIdList: {
      type: Array,
      default: () => []
    },
    // 纵向滚动距离
    scrollTop: {
      type: Number,
      default: 0
    }
  },
  provide() {
    const target = this;
    return {
      get parentDiyId() {
        return target.diyId;
      },
      get parentMerId() {
        return target.merId;
      },
      get parentDiyIdList() {
        return [...target.nestDiyIdList, target.diyId];
      }
    };
  },
  data() {
    return {
      diyComp: {}, // diy 组件数据
      diyData: {}, // diy 基本数据
      isFollowCompHide: false, // 是否关闭了关注公众号组件

      tabActiveIndex: 0, // 选项卡组件当前索引，默认为0，不展示任何子内容
    };
  },
  computed: {
    ...mapGetters(['viewColor']),
    isScroll() {
      return this.scrollTop >= 50;
    },
    diyDataParams() {
      return {
        diyId: this.diyId,
        merId: this.merId
      };
    },
    nestLevel() {
      return this.nestDiyIdList.length;
    },
    followCompHeight() {
      const compConfig = this.groupAndFilterComp.find(item => item.config.name === "follow");
      if (!compConfig) return 0;
      return diyUtil.calcFollowCompHeight(compConfig);
    },
    groupAndFilterComp() {
      // 对组件进行分组，将需要固定在顶部的组件提前筛选出来

      const fixedTopCompName = [
        "follow",
        "headerSerch",
        "homeComb",
        "tabNav",
        "storeHeaderSerch",
        "store_head"
      ];

      // 总是显示的组件，不受 tabActiveIndex 影响
      const alwaysDisplayCompName = [
        "pageFoot"
      ];

      const normalComp = [];
      const fixedTopComp = [];
      let tabNavIndex = -1; // tabNav 组件索引值，-1 表示不存在
      const compKeys = Object.keys(this.diyComp).sort(); // 按照组件 key 排序

      for (let index = 0; index < compKeys.length; index++) {
        const key = compKeys[index];
        const config = this.diyComp[key];

        // 如果关注公众号组件被关闭了，则不处理该组件
        if (config.name === "follow" && this.isFollowCompHide) continue;

        if (config.name === "tabNav" || config.name === "homeComb") {
          // 保存 tabNav 组件的 index
          tabNavIndex = index;
        } else if (alwaysDisplayCompName.includes(config.name)) {
          // 总是显示的组件，不受 tabActiveIndex 影响
          // 空分支
        } else if (tabNavIndex > -1 && this.tabActiveIndex > 0 && index > tabNavIndex) {
          // tabNav 组件目前的选中的选项卡不是首页，因此 tabNav 后面的组件不需要渲染，直接跳过
          continue;
        }

        if (fixedTopCompName.includes(config.name)) {
          fixedTopComp.push({
            key,
            config
          });
        } else {
          normalComp.push({
            key,
            config
          });
        }
      }

      return [
        ...fixedTopComp,
        ...normalComp
      ];
    },
    tabbarConfig() {
      return this.diyComp && Object.values(this.diyComp).find(item => item.name === "pageFoot");
    },
    pageBgStyle() {
      const styles = {
        "--diy-sticky-top": diyUtil.calcStickyTopOffset(this.groupAndFilterComp)
      };
      const { is_bg_color, color_picker, is_bg_pic, bg_pic, bg_tab_val } = this.diyData;
      if (is_bg_pic) {
        const repeat = bg_tab_val === 1 ? "repeat" : "no-repeat";
        const size = bg_tab_val === 2 ? "cover" : "contain";
        const bgColor = is_bg_color ? color_picker : "";

        styles.background = `url(${bg_pic}) ${repeat} top left / ${size} ${bgColor}`;
      } else if (is_bg_color) {
        styles.backgroundColor = color_picker;
      }

      if (this.tabbarConfig) {
        styles["--tabbar-height"] = diyUtil.calcTabbarHeight(this.tabbarConfig) + "px";
      }

      return styles;
    }
  },
  watch: {
    diyDataParams: {
      handler() {
        this.initialComp();
      },
      immediate: true
    }
  },
  created() {
    this.$store.dispatch("initLocation");
  },
  methods: {
    initialComp() {
      // 初始化组件
      this.tabActiveIndex = 0;
      this.getDiyData();
    },
    handleTabIndexChange(index) {
      this.tabActiveIndex = index;
    },
    async getDiyData() {
      try {
        this.diyData = await this.$store.dispatch("fetchDiyData", { diyId: this.diyId, merId: this.merId });
        this.diyComp = this.diyData.value;
        if (this.nestLevel === 0) {
          uni.setNavigationBarTitle({
            title: this.diyData.title,
          });
        }
      } catch (err) {
        uni.showToast({
          title: err.message || err,
          icon: 'none'
        })
      }
    },
    handleSelectAttr(good) {
      this.selecAttr(good);
    },
    handleHideFollowComp() {
      this.isFollowCompHide = true;
    }
  }
}
</script>

<style lang="scss">
.custom-container {
  /deep/ .mr10 {
    margin-right: 10px;
  }
}
</style>