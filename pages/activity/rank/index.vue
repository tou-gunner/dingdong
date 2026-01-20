<template>
	<view class="content" :style="viewColor">
		<view class="rank_header" :style="{ 'background-image': `url(${domain}/static/images/rank_header.png)`}">
			<!--#ifdef MP-->
			<view class="fixed-head">
				<view class="sys-head" :style="{height:sysHeight}"></view>
				<view class="tool-bar">
					<view class='iconfont icon-ic_leftarrow' @tap='goBack'></view>
				</view>
			</view>
			<!--#endif-->
			<view class="cate_name acea-row row-center row-middle">
				<text class="title_icon icon_left" :style="{ 'background-image': `url(${domain}/static/images/rank-title.png)`}"></text>
				<text class="line1 name">{{(active == 0 || !cate_name) ? 'ລາຍການຂາຍດີສຸດ TOP' : `${cate_name}ອັນດັບຂາຍດີ`}}</text>
				<text class="title_icon icon_right" :style="{ 'background-image': `url(${domain}/static/images/rank-title.png)`}"></text>
			</view>
			<view class="scroll_box">
				<scroll-view scroll-x="true" style="white-space: nowrap; vertical-align: middle;" show-scrollbar="false"
				:scroll-left="tabLeft">
					<view class="scroll_item"
						v-for="(item,index) in categoryList"
						:key="item.store_category_id"
						:id="`cate${item.store_category_id}`"
						:data-index="item.store_category_id"
						@click="checkActive(item,index,true)"
						:class="active == item.store_category_id ? 'scroll_item_active' : ''">{{item.cate_name}}
					</view>
				</scroll-view>
			</view>
		</view>
		<view class="rank_list pad30">
			<swiper :interval="interval" indicator-color="rgba(255,255,255,0.6)" :current="swiperCurrent" @change="swiperChange" :style="'height:'+swiperHeight+'px;'" >
				<block v-for="(item,index) in categoryList" :key="item.store_category_id">
					<swiper-item :item-id="`${item.store_category_id}`">
						<scroll-view scroll-y="true" :style="'height:'+swiperHeight+'px'" id="goods">
							<view class='item acea-row' v-for="(itm,idx) in spuTopList" :key="itm.spu_id" @click="godDetail(itm)">
								<view class="rank" :class="'rank'+idx"
								:style="{'color': idx<3 ? '#CE8F21' : '#986561', backgroundImage: idx<3 ? `url(${domain}/static/images/rank.png)` : `url(${domain}/static/images/rank_num.png)`}"
								>
								{{idx < 9 ? '0'+(idx+1) : idx+1}}
								</view>
								<view class='pictrue on'>
									<image :src='itm.image' class="on"></image>
								</view>
								<view class='goods-msg pad16 acea-row row-column row-between'>
									<text class="name line2">{{itm.store_name}}</text>
									<view v-if="itm.sales>0" class="list"><text class="iconfont icon-a-icon_ShoppingBag"></text>{{itm.sales>10000 ? (itm.sales/10000).toFixed(2)+'ໝື່ນ' : itm.sales}}ຄົນຊື້ແລ້ວ</view>
									<view class="list-price acea-row">
										<view class="item-price">
											<priceFormat weight :price="itm.price" intSize="40" floatSize="26" labelSize="26"></priceFormat>
										</view>
										<view class="item-otprice regular">
											{{itm.ot_price.toFixed(2)}}
										</view>
									</view>
								</view>
							</view>
						</scroll-view>
					</swiper-item>
				</block>
			</swiper>
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
	let sysHeight = uni.getSystemInfoSync().statusBarHeight + 'px';
	import { spuTop,spuTopList } from '@/api/activity.js';
	import { HTTP_REQUEST_URL } from '@/config/app';
	import { mapGetters } from "vuex";
	export default {
		data() {
			return {
				sysHeight: sysHeight,
				categoryList: [{
					store_category_id: 0,
					cate_name: 'ທັງໝົດ'
				}],
				cate_name: "",
				spuTopList: [],
				active: 0,
				scrollInto: '',
				domain: HTTP_REQUEST_URL,
				tabClick: 0,
				tabLeft: 0,
				isLeft: 0, //导航栏下划线位置
				isWidth: 0, //每个导航栏占位
				windowHeight: 0,
				swiperHeight: 0,
				swiperCur: 0,
				circular: true,
				isScroll: false,
				interval: 3000,
				currentItemId: 0,
				swiperCurrent: 0,
			}
		},
		computed: mapGetters(['viewColor']),
		created() {
			var that = this;
			// 获取设备宽度
			uni.getSystemInfo({
				success(e) {
					that.isWidth = e.windowWidth / 6;
					that.windowHeight = e.windowHeight;
					// that.swiperHeight = that.windowHeight - 205
					that.$set(that, 'swiperHeight', that.windowHeight-150);
				}
			});
		},
		onLoad(option) {
			this.spuTop(option.cate_id || 0)
			if(option.cate_id){
				this.active = option.cate_id
			}
		},
		methods: {
			goBack: function() {
				uni.navigateBack();
			},
			spuTop(cate_id) {
				spuTop().then(res => {
					this.categoryList = [...this.categoryList, ...res.data]
					this.cate_name = this.getCate(cate_id,this.categoryList) || ''
					this.$nextTick(() => {
						this.getSpuTopList(cate_id)
						this.active = cate_id && this.cate_name ? cate_id : 0
						this.scrollInto = `cate${cate_id}`;
						let tabLeft = (this.swiperCur - 2) * this.isWidth; //设置下划线位置
						this.$set(this, 'tabLeft', tabLeft);
					});
				})
			},
			getSpuTopList(cate_id) {
				cate_id = this.cate_name ? cate_id : 0
				spuTopList({
					cate_pid: cate_id
				}).then(res => {
					this.spuTopList = (res.data[0] && res.data[0]['list']) || []
				})
			},
			swiperChange(e) {
				let { current, source, currentItemId } = e.detail;
				if (source === 'autoplay' || source === 'touch') {
					this.active = currentItemId;
					this.swiperCur = current
					this.checkActive(this.categoryList[this.swiperCur],this.swiperCur,false)
					if (this.categoryList.length > 6) {
						var tempIndex = this.swiperCur - 2;
						tempIndex = tempIndex <= 0 ? 0 : tempIndex;
						let tabLeft = (this.swiperCur - 2) * this.isWidth; //设置下划线位置
						this.$nextTick(function() {
							this.$set(this, 'tabLeft', tabLeft);
						});
					}
				}
			},
			checkActive(item, index, isScroll) {
				this.active = item.store_category_id;
				this.cate_name = item.cate_name
				this.swiperCurrent = index;
				this.swiperCur = index
				this.isScroll = isScroll;
				this.tabClick = index; //设置导航点击了哪一个
				this.isLeft = index * this.isWidth; //设置下划线位置
				this.spuTopList = [];
				this.getSpuTopList(item.store_category_id)
			},
			// 去商品详情页
			godDetail(item) {
				uni.navigateTo({
					url: "/pages/goods_details/index?id=" + item.product_id
				})
			},
			// 获取第一次进来的默认分类名称
			getCate(id,arr){
				for (let i = 0; i < arr.length; i++) {
					if (arr[i].store_category_id == id) {
						this.swiperCur = i
						return arr[i]['cate_name']
					}
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.content{
		background: #FB5615;
		min-height: 100vh;
	}
	.rank_header {
		background-size: cover;
		height: 426rpx;
		position: fixed;
		top: 0;
		left: 0;
		display: block;
		z-index: 9999;
		.cate_name{
			text-align: center;
			position: relative;
			top: 140rpx;
			height: 144rpx;
			.name{
				background-image: linear-gradient(to bottom, #FFEBB5, #FFFFFF);
				-webkit-background-clip: text;
				-webkit-text-fill-color: transparent;
				font-weight: bold;
				font-size: 52rpx;
				position: relative;
				display: inline-block;
			}
			.title_icon{
				content: "";
				display: inline-block;
				width: 60rpx;
				height: 136rpx;
				background-repeat: no-repeat;
				background-size: 100% 100%;
				&.icon_right{
					transform: rotateY(180deg);
				}
			}
		}
	}
	.scroll_box {
		width: 750rpx;
		box-sizing: border-box;
		line-height: 50rpx;
		padding-left: 32rpx;
		margin-top: 160rpx;
	}
	.scroll_item {
		display: inline-block;
		font-size: 28rpx;
		color: rgba(255,255,255,.8);
		&:last-child {
			margin-right: 40rpx;
		}
	}
	.scroll_item_active {
		font-weight: bold;
		position: relative;
		text-align: center;
		color: #fff;
		&::after{
			content: "";
			display: block;
			margin: 10rpx auto 0;
			width: 80%;
			height:4rpx;
			border-radius: 2rpx;
			background: #fff;
		}
	}
	.scroll_item~.scroll_item {
		margin-left: 40rpx;
	}
	.rank_list {
		padding-top: 360rpx;
		padding-bottom: 32rpx;
		.list-price {
			margin-top: 18rpx;
			align-items: baseline;
		}
		.item {
			border-radius: 16rpx;
			background: #fff;
			margin-top: 20rpx;
			padding: 28rpx 30rpx 32rpx;
			position: relative;
			.rank {
				position: absolute;
				top: 0;
				left: 20rpx;
				width: 50rpx;
				height: 61rpx;
				display: flex;
				justify-content: center;
				line-height: 61rpx;
				font-size: 30rpx;
				z-index: 10;
				background-size: 100% 100%;
				font-family: '黑体';
				font-weight: bold;
			}
			.name {
				width: 382rpx;
				height: 76rpx;
				line-height: 38rpx;
				color: #282828;
				font-weight: 500;
				font-size: 32rpx;
			}
		}
		.ot_price {
			font-weight: 300;
			color: #6D6D6D;
			padding-left: 16rpx;
		}
		.goods-msg {
			flex: 1;
			margin-left: 20rpx;
			.list{
				background: #FDF8EE;
				line-height: 57rpx;
				color: #666666;
				font-size: 26rpx;
				padding: 0 12rpx;
				border-radius: 16rpx;
				.iconfont{
					color: #FFB31C;
					margin-right: 12rpx;
				}
			}
			.item-price{
				color: var(--view-priceColor);
				margin-right: 16rpx;
			}
			.item-otprice{
				font-size: 26rpx;
				color: #999999;
				text-decoration: line-through;
			}
		}
		.pictrue {
			width: 240rpx;
			height: 240rpx;
			position: relative;
			flex: 1;
			image {
				width: 100%;
				height: 100%;
				border-radius: 16rpx;
			}
		}
	}
</style>
