<template>
  <view>
    <view class="order-index" ref="container" :style="{ 'background-image': `url(${domain}/static/images/product-order-index.png)`}">
      <view class="header">
		  <!-- <div class="header_count" >
			  <swiper
			  	indicator-dots="true"
			  	:circular="circular"
			  	indicator-color="#E4E4E4"
			  	indicator-active-color="#E93323"
			  	previous-margin="0"
			  	next-margin="0"
			  	:current="swiperCur"
			  	@change="swiperChange"
			  >
			  	<block>
			  		<swiper-item :class="{ active: 0 == swiperCur }">
			  			<view class="slide-navigator">
			  				<view class="item" hover-class='none' @click="jumpAddGoods">
			  					<image mode='widthFix' class="image" :src="`${domain}/static/images/product_add.png`"></image>
			  					<text class="text">添加商品</text>
			  				</view>
			  				<navigator class="item" :url="`/pages/product/goodsOnSale/index?mer_id=${mer_id}&type=1`" hover-class='none'>
			  				  <image mode='widthFix' class="image" :src="`${domain}/static/images/product_sales.png`"></image>
			  				  <text class="text">在售商品</text>
			  				</navigator>
			  				<navigator class="item" :url="`/pages/product/goodsOnSale/index?mer_id=${mer_id}&type=3`" hover-class='none'>
			  				  <image mode='widthFix' class="image" :src="`${domain}/static/images/product_out.png`"></image>
			  				  <text class="text">售罄商品</text>
			  				</navigator>
			  				<navigator class="item" :url="`/pages/product/goodsOnSale/index?mer_id=${mer_id}&type=5`" hover-class='none'>
			  				  <image mode='widthFix' class="image" :src="`${domain}/static/images/product_recycle.png`"></image>
			  				  <text class="text">回收站</text>
			  				</navigator>
			  				<navigator class="item" :url="`/pages/product/storeClassification/index?mer_id=${mer_id}`" hover-class='none'>
			  				  <image mode='widthFix' class="image" :src="`${domain}/static/images/product_cate.png`"></image>
			  				  <text class="text">店铺分类</text>
			  				</navigator>
			  			</view>
					</swiper-item>
			  		<swiper-item :class="{ active: 1 == swiperCur }">
			  			<view class="slide-navigator">
			  				<navigator class="item" :url="`/pages/product/addGoods/freightTemplate?mer_id=${mer_id}`" hover-class='none'>
			  				  <image mode='widthFix' class="image" :src="`${domain}/static/images/product_freight.png`"></image>
			  				  <text class="text">运费模板</text>
			  				</navigator>
			  				<navigator class="item" :url="`/pages/product/addGoods/mulSpecification?mer_id=${mer_id}`" hover-class='none'>
			  				  <image mode='widthFix' class="image" :src="`${domain}/static/images/product_specification.png`"></image>
			  				  <text class="text">规格模板</text>
			  				</navigator>
			  			</view>
			  		</swiper-item>
			  	</block>
			  </swiper>
		  </div> -->
      </view>
      <view class="wrapper">
        <view class='product_list acea-row row-between-wrapper'>
          <block v-for="(item,index) in productList" :key="index">
              <view class='item'>
				<view class='image'>
				  <image :src='item.image'></image>
				  <text v-if="item.spec_type == 1" class="spec">多规格</text>
				</view>
				<view class='text'>
				  <view class='name'>
					  <text v-if="item.is_gift_bag" class="font-org">礼包</text>
					  <text class="text_name acea-row line1">{{item.store_name}}</text>

				  </view>
				  <view class="sales">
				    <text class="num">库存: {{item.stock}}</text>
				    <text class="num">销量: {{item.sales}}</text>
				  </view>
				  <view class='money-wrap'>
				    <text class='price font-color'>¥{{item.price}}</text>
				    <text class='ot_price'>¥{{item.ot_price}}</text>
				  </view>
				</view>
			  </view>
            <view class="operation acea-row row-between-wrapper">
              <view></view>
              <view class="acea-row row-middle">
                <view v-if="item.is_show == 1 && item.status == 1" class="bnt" @tap.stop="handleShelves(item,0)">下架</view>
                <view v-if="item.is_show == 0 && item.status == 1" class="bnt" @tap.stop="handleShelves(item),1">上架</view>
				<!-- <view @click="editGoods(item)" class="bnt">编辑</view>
				<navigator :url="'/pages/admin/goods_details/index?product_id='+item.product_id+'&product_type=0'" class="bnt" hover-class='none'>预览</navigator>
				<view class="bnt" v-if="item.is_show == 0" @tap.stop="handleRecycle(item,index)">删除</view>
				<view class="bnt bnt_recommend" v-if="item.is_show == 1" @tap.stop="handleRecommend(item)">{{item.is_good ? '取消推荐' : '店铺推荐'}}</view> -->
              </view>
            </view>
          </block>
        </view>
      </view>
      <Loading :loaded="loaded" :loading="loading"></Loading>
    </view>
  </view>
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
import {
  productLstApi, productDeleteApi, productOffApi, productRecommendApi
} from "@/api/product";
import Loading from '@/components/Loading/index.vue';
import { navigateTo, navigateBack, serialize, setStorage, getStorage, removeStorage, Toast, Modal,} from '../../../libs/uniApi.js';
import {HTTP_REQUEST_URL} from '@/config/app.js';
export default {
  name: 'productList',
  components: {
    Loading,
  },
  data() {
    return {
			domain: HTTP_REQUEST_URL,
      current: "",
      where: {
        page: 1,
        limit: 20
      },
      loaded: false,
      loading: false,
      mer_id: '',
      productList: [],
			swiperCur: 0,
			circular: true,
    }
  },
  onLoad(options) {
  	this.mer_id = options.mer_id;
    this.getList(this.mer_id);
  },
  methods: {
		// 跳转添加商品界面
		jumpAddGoods() {
			const data = getStorage('addGoodsFormData');
			if(data && data.product_id){
				let waitDeleteData = ['addGoodsFormData', 'singleSpecification', 'attrValue', 'modifyPriceData', 'addGoodsSecoundData', 'goodsDis', 'editGoodsDetils'];
				waitDeleteData.forEach(item => {
					if(getStorage(item)) {
						removeStorage(item);
					}
				})
			}
			navigateTo(1, '/pages/product/addGoods/index', { mer_id: this.mer_id });
		},
	// swiper
	swiperChange(e) {
		let { current, source } = e.detail;
		if (source === 'touch') {
			//根据官方 source 来进行判断swiper的change事件是通过什么来触发的，autoplay是自动轮播。touch是用户手动滑动。其他的就是未知问题。抖动问题主要由于未知问题引起的，所以做了限制，只有在自动轮播和用户主动触发才去改变current值，达到规避了抖动bug
			this.swiperCur = e.detail.current;
		}
	},
    getList: function(mer_id) {
      var that = this;
      if(that.loading || that.loaded) return;
      that.loading = true;
      productLstApi(mer_id, that.where).then(
        res => {
          that.loading = false;
          that.loaded = res.data.list.length < that.where.limit;
          that.productList.push.apply(that.productList, res.data.list);
          that.where.page = that.where.page + 1;
        },
        error => {
          that.$util.Tips({
            title: error.msg
          })
        }
      );
    },
    editGoods(item) {
      let waitDeleteData = [
        'addGoodsFormData',
        'singleSpecification',
        'attrValue',
        'modifyPriceData',
        'addGoodsSecoundData',
        'goodsDis',
        'editGoodsDetils',
        'canChange',
        'canChangeSecound'
      ];
      waitDeleteData.forEach(item => {
        if(getStorage(item)) {
          removeStorage(item);
        }
      });
      navigateTo(1, '/pages/product/addGoods/index', { mer_id: item.mer_id, product_id: item.product_id });
    },
    handleRecycle(item, index) {
      let that = this;
			Modal('温馨提示', `商品"${item.store_name}"将被加入回收站，请问是否继续?`).then(res => {
				productDeleteApi(that.mer_id, item.product_id)
					.then(res => {
					 that.$util.Tips({
						title: res.message,
						icon: 'success'
					 }, () => {
							that.productList.splice(index, 1);
						});
					})
					.catch(rej => {
						Toast(`${rej}, 加入回收站失败`);
					});
			});
    },
    //下架 0
    handleShelves(item, status) {
      let that = this;
      if(status == 0) {
        uni.showModal({
          content: '确定要下架该商品么？',
          success: function(res) {
            if(res.confirm) {
              that.onAndOff(item, 0)
              uni.showToast({
                title: '下架成功',
                icon: 'none'
              })
            } else if(res.cancel) {
              console.log('用户点击取消');
            }
          }
        });
      } else {
        that.onAndOff(item, 1)
      }
    },
    //上下架
    onAndOff(item, status) {
      let that = this;
      productOffApi(that.mer_id, item.product_id, { status: status }).then((res) => {
        that.$util.Tips({
          title: res.message,
          icon: 'success'
        }, () => {
         that.$set(item,'is_show', item.is_show == 0 ? 1 : 0);
        });
      }).catch(err => {
        return that.$util.Tips({
          title: err
        });
      });
    },
    //设置推荐
    handleRecommend(item) {
      let that = this
      let is_good = item.is_good ? 0 : 1
      productRecommendApi(that.mer_id, item.product_id, { is_good: is_good }).then((res) => {
        that.$util.Tips({
          title: res.message,
          icon: 'success'
        }, () => {
		  that.$set(item,'is_good', item.is_good == 0 ? 1 : 0);
        });
      }).catch(err => {
        return that.$util.Tips({
          title: err
        });
      });
    },
    more(index) {
      this.current = index
    },
  },
  onReachBottom() {
    this.getList(this.mer_id)
  }
}
</script>

<style scoped lang="scss">
page{
	background-color: #F5F5F5;
}
.order-index{
	background-repeat: no-repeat;
	background-size: 100%;
}
.popupn {
  position: fixed;
  width: 100%;
  text-align: center;
  top: 0;
  left: 0;
  background: transparent;
  height: 90rpx;
  line-height: 90rpx;
  z-index: 5;
  .title {
    max-width: 560rpx;
    margin: 0 auto;
    position: relative;
    display: inline;
    padding: 10rpx 30rpx 10rpx 50rpx;
    background-color: rgba(0,0,0,.25);
    border-radius: 30rpx;
    color: #FFFFFF;
  }
  .iconfont {
    display: inline-block;
    position: relative;
    top: 4rpx;
    right: 0;
  }
  .mer_logo {
    width: 34rpx;
    height: 34rpx;
    position: relative;
    top: 6rpx;
    right: 10px;
  }
  .mer_name {
    display: inline-block;
    max-width: 650rpx;
  }
  .invoice-content {
    background-color: #ffffff;
  }
}

::v-deep .uni-swiper-slides{
	inset: 0!important;
}
uni-swiper,swiper{
	height: 200rpx;
}
.header {
  // padding-top: 40rpx;
  margin: 0 20rpx;
  .header_count{
	  width: 710rpx;
	  padding: 30rpx 30rpx 0;
	  background: #ffffff;
	  border-radius: 10rpx;
	  position: relative;
  }
  .item {
	 display: inline-block;
	 width: 130rpx;
	 text-align: center;
    .image {
      width: 84rpx;
      height: 84rpx;
    }
    .text {
      display: block;
      text-align: center;
      color: #666666;
      font-size: 24rpx;
      margin-top: 18rpx;
    }
  }
}
::v-deep .uni-swiper-slides{
	width: 650rpx;
}
::v-deep .uni-swiper-dot{
	width: 15rpx;
	height: 5rpx;
}
::v-deep .uni-swiper-dots-horizontal .uni-swiper-dot{
	margin-right: 0;
}
.product_list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 100%;
  padding: 0 20rpx;
  .item {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    padding: 30rpx 20rpx;
    border-radius: 0;
    margin-bottom: 0;
    background: #ffffff;
    margin-top: 30rpx;
    border-radius: 10rpx 10rpx 0 0;
    .image,image {
      width: 150rpx;
      height: 150rpx;
      border-radius: 16rpx;
      position: relative;
      .spec {
        color: #ffffff;
        background: rgba(0, 0, 0, 0.5);
        border-radius: 16rpx 0 16rpx 0;
        text-align: center;
        font-size: 18rpx;
        display: inline-block;
        width: 84rpx;
        line-height: 30rpx;
        position: absolute;
        bottom: 0;
        right: 0;
      }
      uni-image {
        width: 150rpx;
        height: 150rpx;
        border-radius: 16rpx;
      }
    }
    .text {
      position: relative;
      flex: 1;
      min-width: 0;
      padding: 10rpx 10rpx 20rpx 30rpx;
      .name {
        color: #282828;
        font-size: 30rpx;
        font-family: "PingFang SC";
		display: flex;
		align-items: center;
      }
	   .text_name{
	  		  display: inline-block;
	  		  max-width: 400rpx;
	  	  }
	  	  .font-org{
	  		  background-color: #FC8327;

	  		  display: inline-block;
	  		  color: #fff;
	  		  font-size: 16rpx;
	  		  text-align: center;
	  		  border-radius: 5rpx;
	  		  padding: 0 4rpx;
	  		  line-height: 28rpx;
	  		  margin-right: 8rpx;
	  	  }
      .money-wrap {
        margin-top: 20rpx;
        .price {
          font-size: 30rpx;
          display: inline-block;
          margin-right: 15rpx;
        }
        .ot_price {
          color: #bebebe;
          font-size: 26rpx;
          text-decoration: line-through;
        }
      }
      .sales {
        margin-top: 20rpx;
        color: #999;
        font-size: 22rpx;
        .num {
          display: inline-block;
          margin-right: 20rpx;
        }
      }
    }
  }
  .operation {
    padding: 20upx 30upx;
    background: #ffffff;
    width: 100%;
    border-radius: 0 0 10rpx 10rpx;
    .bnt {
      font-size: 26rpx;
      color: #999999;
      width: 120rpx;
      height: 58rpx;
      border-radius: 30rpx;
      border: 1px solid #999999;
      text-align: center;
      line-height: 58rpx;
      ~ .bnt {
        margin-left: 18rpx;
      }
	  &.bnt_recommend{
	  	width: 160rpx;
	  	color: #ffffff;
	  	background: linear-gradient(135deg, #FD6523 0%, #E93323 100%);
		border-color: transparent;
	  }
    }
  }
}
</style>
