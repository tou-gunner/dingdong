<template>
  <view v-if="type == 0" class="wf-item-page wf-page0" :style="viewColor">
		<view class='pictrue'>
			<image class="image" :src="item.image"></image>
			<view v-if="item.stock == 0" class="sell_out">已售罄</view>
			<view v-if="item.border_pic" :style="{ backgroundImage: `url(${item.border_pic})` }" class="border-picture"></view>
		</view>
		<view class="text">
			<view v-if="item.distance" style="margin-top: 16rpx;">
				<MerDistanceInfo :info="item" />
			</view>
			<view class='name line2'>{{item.store_name}}</view>
			<view class="good-tag-list flex item_tags" v-if="tagList.length">
				<view class="good-tag tags_item flex-center line1" v-for="tag of tagList" :style="[tag.style]" :key="tag.label">{{ tag.label }}</view>
			</view>
			<view class="acea-row row-middle">
				<view class='money'>
					<priceFormat :price="item.price" weight intSize="40" floatSize="26" labelSize="26"></priceFormat>
				</view>
			</view>
			<view v-if="item.show_svip_info && item.show_svip_info.show_svip_price && item.svip_price" class="acea-row row-middle svip">
				<text class='vip-money'>¥{{item.svip_price}}</text>
				<view class="vipImg">
					<image :src="`${domain}/static/images/svip.png`" class="vip-img"></image>
				</view>
			</view>
		</view>
		<view v-if="addCart && item.product_type != 3" class="add-cart acea-row row-middle row-center" @click.stop='addCat(item)'>
			<text class="iconfont icon-ic_ShoppingCart1"></text>
		</view>
  </view>
	<view v-else-if="type == 1" class="wf-page1" :style="viewColor">
		<view class='pictrue'>
			<image class="image" :src="item.image"></image>
			<view v-if="item.stock == 0" class="sell_out">已售罄</view>
			<view v-if="item.border_pic" :style="{ backgroundImage: `url(${item.border_pic})` }" class="border-picture"></view>
		</view>
		<view class='text'>
			<view v-if="item.distance" style="margin-top: 16rpx;">
				<MerDistanceInfo :info="item" />
			</view>
			<view class='name'>{{item.store_name}}</view>
			<view class="good-tag-list flex item_tags" v-if="tagList.length">
				<view class="good-tag tags_item flex-center line1" v-for="tag of tagList" :style="[tag.style]" :key="tag.label">{{ tag.label }}</view>
			</view>
			<view class='money'>
				<priceFormat :price="item.price" weight intSize="40" floatSize="26" labelSize="26"></priceFormat>
			</view>
			<view v-if="item.show_svip_info&&item.show_svip_info.show_svip && item.show_svip_info.show_svip_price" class="acea-row row-middle svip">
				<text class='vip-money'>¥{{item.svip_price}}</text>
				<view class="vipImg">
					<image :src="`${domain}/static/images/svip.png`" class="vip-img"></image>
				</view>
			</view>
			<view class="score">{{item.rate}}评分 {{item.reply_count}}条评论</view>
			<view class="company" v-if="item.merchant" @click.stop="goShop(item.merchant.mer_id)">
				<text class="line1">{{item.merchant.mer_name}}</text>
				<view class="flex" v-if="isStore != '1'">
					进店
					<text class="iconfont icon-ic_rightarrow"></text>
				</view>
			</view>
			<view v-if="addCart && item.product_type != 3" class="add-cart acea-row row-middle row-center" @click.stop='addCat(item)'>
				<text class="iconfont icon-ic_ShoppingCart1"></text>
			</view>
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
import MerDistanceInfo from '@/components/MerDistanceInfo.vue';
import {mapGetters} from "vuex";
import { HTTP_REQUEST_URL } from '@/config/app';
import { getProductTagList } from '@/utils/product';
export default {
	components:{
		MerDistanceInfo
	},
	computed: {
		...mapGetters(['viewColor']),
		tagList() {
			const product = this.item?.product || this.item;
			const merchant = this.item.merchant || this.item?.product?.merchant;
			const issetCoupon = this.item.issetCoupon || this.item?.product?.issetCoupon;
			return getProductTagList({
				...product,
				issetCoupon,
				merchant
			});
		}
	},
	props: {
		item: {
			type: Object,
			require: true
		},
		type: {
			type: Number,
			default: 0
		},
		isStore: {
			type: [String, Number],
			default: '1'
		},
		addCart: {
			type: Boolean,
			require: false
		},
		isLogin: {
			type: Boolean,
			require: false
		}
  },
	data(){
		return {
			domain: HTTP_REQUEST_URL,
		}
	},
	methods: {
		goShop(id) {
			this.$emit('goShop', id);
		},
		authOpen(){
			this.$emit('authOpen');
		},
		followToggle(item){
			this.$emit('followToggle', item);
		},
		addCat(item){
			this.$emit('addCat', item);
		}
	}
}

</script>
<style lang="scss" scoped>
.wf-item-page {
	background: #fff;
	overflow: hidden;
	border-radius: 24rpx;
	padding-bottom: 20rpx;
}
.wf-page0 .coupon{
	background:rgba(255,248,247,1);
	border:1px solid rgba(233,51,35,1);
	border-radius:4rpx;
	font-size:20rpx;
	margin-left: 18rpx;
	padding: 1rpx 4rpx;
}
.wf-page0 .pictrue{
	width: 100%!important;
	height: 345rpx;
	position: relative;
	.image{
		width: 345rpx;
		height: 345rpx;
		border-radius: 24rpx 24rpx 0 0;
	}
	.border-picture {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		border-radius: 24rpx 24rpx 0 0;
		background: center/cover no-repeat;
	}
}
.svip{
	margin: 5rpx 0 15rpx;
}
.vip-money {
	color: #282828;
	font-size: 22rpx;
	margin-left: 6rpx;
	font-weight: bold;
}
.vipImg {
	width: 65rpx;
	height: 28rpx;
	margin-left: 4rpx;
	.vip-img {
		width: 100%;
		height: 100%;
		display: block;
	}
}
.wf-page0 .name {
	margin: 20rpx 0 20rpx;
	font-size: 28rpx;
	overflow:hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	text-align: left;
}
.wf-page0 .text{
	padding: 0 20rpx;
}
.wf-page0 .money {
	font-size: 20rpx;
	font-weight: bold;
	color: var(--view-priceColor);
}
.b-color {
	background-color: var(--view-theme);
	border: 1px solid var(--view-theme);
}
.wf-page0 .money .num {
	font-size: 34rpx;
}
.wf-page1 {
	.name{
		margin: 20rpx 0;
		font-size: 13px;
		overflow:hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		text-align: left;
	}
}
.wf-page1 .pictrue {
	position: relative;
	width: 345rpx;
	height: 345rpx;
	width: 100%!important;
	/deep/.image{
		width: 345rpx;
		height: 345rpx;
		border-radius: 24rpx 24rpx 0 0;
	}
	.border-picture {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		border-radius: 24rpx 24rpx 0 0;
		background: center/cover no-repeat;
	}
}
.sell_out {
	display: flex;
	width: 150rpx;
	height: 150rpx;
	align-items: center;
	justify-content: center;
	border-radius: 100%;
	background: rgba(0,0,0,.6);
	color: #fff;
	font-size: 30rpx;
	position: absolute;
	top: 50%;
	left: 50%;
	margin: -75rpx 0 0 -75rpx;
	&::before{
		content: "";
		display: block;
		width: 140rpx;
		height: 140rpx;
		border-radius: 100%;
		border: 1px dashed #fff;
		position: absolute;
		top: 5rpx;
		left: 5rpx;
	}
}
.wf-page1 .text {
	padding: 20rpx 17rpx 26rpx 17rpx;
	font-size: 30rpx;
}
.wf-page1 .text .money {
	display: flex;
	align-items: center;
	font-size: 26rpx;
	font-weight: bold;
	margin-top: 20rpx;
	color: var(--view-priceColor);
}
.wf-page1 .text .money .num {
	font-size: 34rpx;
}
.item_tags{
	margin-top: 8rpx;
	display: flex;
}
.wf-page1 .text .score {
	margin-top: 16rpx;
	color: #666666;
	font-size: 22rpx;
}
.wf-page1 .text .company {
	display: flex;
	align-items: center;
	color: #666666;
	font-size: 22rpx;
	margin-top: 6rpx;
	.line1{
		max-width: 200rpx;
	}
	.flex {
		display: flex;
		align-items: center;
		margin-left: 10rpx;
		color: #282828;
		.iconfont {
			font-size: 20rpx;
			margin-top: 4rpx;
		}
	}
}


.good-tag-list {
	overflow: hidden;
	white-space: nowrap;
	margin-bottom: 10rpx;

	.good-tag {
		border: 1px solid currentColor;
		flex-shrink: 0;
	}
}
</style>
