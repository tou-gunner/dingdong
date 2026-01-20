<template>
  <!-- 商品列表模块 -->
	<view :style="viewColor">
		<view class='productList'>
			<view class='search acea-row row-between-wrapper'>
				<view class='input acea-row row-between-wrapper'><text class='iconfont icon-ic_search'></text>
					<input placeholder='ຄົ້ນຫາຊື່ສິນຄ້າ' placeholder-class='placeholder' confirm-type='search' name="search"
						:value='where.keyword' @confirm="searchSubmit"></input>
				</view>
				<view class='iconfont' :class='is_switch==true?"icon-a-ic_Imageandtextsorting":"icon-a-ic_Picturearrangement"' @click.native='Changswitch'>
				</view>
			</view>
			<view class='nav acea-row row-middle'>
				<view class='item line1' :class="{'font-num': where.order==''}" @click.native='set_where(1)'>ຄ່າເລີ່ມຕົ້ນ</view>
				<view class='item' :class="{'font-num': where.order=='ot_price_desc' || where.order=='ot_price_asc'}" @click='set_where(2)'>
					ຄະແນນ
					<image v-if="price==1" :src="domain+'/static/diy/up'+keyColor+'.png'"></image>
					<image v-else-if="price==2" :src="domain+'/static/diy/down'+keyColor+'.png'"></image>
					<image v-else :src='`${domain}/static/images/horn.png`'></image>
				</view>
				<view class='item' :class="{'font-num': where.order=='sales'}" @click.native='set_where(3)'>
					ຍອດຂາຍ
				</view>
			</view>
			<view class='list acea-row row-between-wrapper' :class='is_switch==true?"":"on"'>
				<view class='item mt20 bg-f boder-24' :class='is_switch==true?"":"on"' hover-class='none'
					v-for="(item,index) in productList" :key="index" @click.native="godDetail(item)">
					<view class='pictrue' :class='is_switch==true?"":"on"'>
						<image :src='item.image' :class='is_switch==true?"":"on"'></image>
						<view v-if="item.stock == 0" class="sell_out" :class='is_switch==true?"":"on"'>ແລກໝົດແລ້ວ</view>
					</view>
					<view class='text acea-row row-column-between' :class='is_switch==true?"":"on"'>
						<view class='name' :class='is_switch==true?"line1":"line2"'>{{item.store_name}}</view>
						<view class='vip' :class='is_switch==true?"":"on"'>
							<view class="acea-row price-count">
								<image class="image" :src="`${domain}/static/images/jf-point.png`" mode="widthFix"></image>
								<view class="price-box">
									<text>{{ item.ot_price }}</text>ຄະແນນ
								</view>
								<view v-if="item.price!=0" class="sales">+{{parseFloat(Number(item.price).toFixed(2))}}ກີບ</view>
							</view>
							<view class="exchange">
								{{item.sales}} ຄົນແລກ
							</view>
						</view>
					</view>
				</view>
				<view class='loadingicon acea-row row-center-wrapper' v-if='loading'>
					<text class='loading iconfont icon-jiazai' :hidden='loading==false'></text>{{loadTitle}}
				</view>
			</view>
		</view>
		<view class='noCommodity' v-if="productList.length==0 && !loading">
			<view class='emptyBox'>
				<image :src="`${domain}/static/images/no_thing.png`"></image>
				<view class="tips">ບໍ່ມີສິນຄ້າ, ໄປເບິ່ງອັນອື່ນກ່ອນ</view>
			</view>
			<recommend :hostProduct="hostProduct"></recommend>
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
	import { getProductHot } from '@/api/store.js';
	import {getIntegralGoodsList } from '@/api/points_mall.js';
	import recommend from '@/components/recommend';
	import { mapGetters } from "vuex";
	import { goShopDetail } from '@/libs/order.js'
	import {HTTP_REQUEST_URL} from '@/config/app';
	export default {
		computed: mapGetters(['uid','viewColor','keyColor']),
		components: {
			recommend,
		},
		data() {
			return {
				productList: [],
				is_switch: true,
				where: {
					order: '',
					keyword: '',
					page: 1,
					cate_id: '',
					limit: 20,
				},
				price: 0,
				stock: 0,
				nows: false,
				loadend: false,
				loading: false,
				loadTitle: 'ໂຫຼດເພີ່ມ',
				title: '',
				hostProduct: [],
				hotPage: 1,
				hotLimit: 10,
				hotScroll: false,
				domain:HTTP_REQUEST_URL
			};
		},
		onLoad: function(option) {
			this.where.cid = option.cid || 0;
			this.$set(this.where, 'cate_id', option.cate_id || '');
			this.$set(this.where, 'keyword', option.searchValue || '');
			this.get_product_list();
		},
		onShow(){
			uni.removeStorageSync('form_type_cart');
		},
		methods: {
			// 去详情页
			godDetail(item) {
				uni.navigateTo({
					url: `/pages/points_mall/integral_goods_details?id=${item.product_id}`
				})
			},
			Changswitch: function() {
				let that = this;
				that.is_switch = !that.is_switch
			},
			searchSubmit: function(e) {
				let that = this;
				that.$set(that.where, 'keyword', e.detail.value);
				that.productList = [];
				that.loadend = false;
				that.loading = false;
				that.$set(that.where, 'page', 1);
				that.get_product_list();
			},
			//点击事件处理
			set_where: function(e) {
				switch (e) {
					case 1:
						this.price = 0
						this.where = {
							keyword: '',
							order: '',
							page: 1,
							limit: 20,
						}
						break
					case 2:
						if (this.price == 0 || this.price == 2) {
							this.price = 1;
						} else if (this.price == 1) {
							this.price = 2;
						}
						this.where.order = this.where.order == 'ot_price_asc' ? 'ot_price_desc' : 'ot_price_asc'
						break;
					case 3:
						this.price = 0;
						this.$set(this.where, 'order', 'sales')
						this.get_product_list(true);
						break;
				}
				this.loadend = false;
				this.loading = false
				this.productList = []
				this.$set(this.where, 'page', 1);
				this.get_product_list();
			},
			//查找产品
			get_product_list: function() {
				let that = this;
				if (that.loadend) return;
				if (that.loading) return;
				that.loading = true;
				that.loadTitle = '';
				getIntegralGoodsList(that.where).then(res => {
					let list = res.data.list;
					let productList = that.$util.SplitArray(list, that.productList);
					let loadend = list.length < that.where.limit;
					that.loadend = loadend;
					that.loading = false;
					that.loadTitle = loadend ? 'ບໍ່ມີເນື້ອຫາເພີ່ມເຕີມ~' : 'ໂຫຼດເພີ່ມ';
					that.$set(that, 'productList', productList);
					that.$set(that.where, 'page', that.where.page + 1);
				}).catch(err => {
					that.loading = false;
					that.loadTitle = 'ໂຫຼດເພີ່ມ';
				});
			},
		},
		onPullDownRefresh() {

		},
		onReachBottom() {
			this.get_product_list();

		}
	}
</script>

<style scoped lang="scss">
	.productList .search {
		width: 100%;
		height: 86rpx;
		padding-left: 23rpx;
		box-sizing: border-box;
		position: fixed;
		left: 0;
		top: 0;
		z-index: 9;
		background-color: var(--view-theme);
	}
	.productList .search .input {
		width: 640rpx;
		height: 60rpx;
		background-color: #fff;
		border-radius: 50rpx;
		padding: 0 20rpx;
		box-sizing: border-box;
	}
	.productList .search .input input {
		width: 548rpx;
		height: 100%;
		font-size: 26rpx;
	}
	.productList .search .input .placeholder {
		color: #ccc;
	}
	.productList .search .input .iconfont {
		font-size: 35rpx;
		color: #999;
	}
	.productList .search .icon-a-ic_Imageandtextsorting,
	.productList .search .icon-a-ic_Picturearrangement {
		color: #fff;
		width: 62rpx;
		font-size: 40rpx;
		height: 86rpx;
		line-height: 86rpx;
	}
	.productList .nav {
		height: 86rpx;
		color: #454545;
		position: fixed;
		left: 0;
		width: 100%;
		font-size: 28rpx;
		background-color: #fff;
		margin-top: 86rpx;
		top: 0;
		z-index: 9;
		border-bottom: 1rpx solid #f5f5f5;
	}
	.productList .nav .item {
		width: 33%;
		text-align: center;
		&.font-num{
			font-weight: bold;
		}
	}
	.productList .nav .item image {
		width: 15rpx;
		height: 19rpx;
		margin-left: 10rpx;
	}
	.productList .list {
		padding: 0 20rpx 20rpx;
		margin-top: 172rpx;
	}
	.productList .list.on {
		background-color: #fff;
		border-top: 1px solid #f6f6f6;
	}
	.productList .list .item {
		width: 345rpx;
	}
	.productList .list .item.on {
		width: 100%;
		display: flex;
		justify-content: space-between;
		padding: 30rpx 0 0;
		margin: 0;
	}
	.productList .list .item .pictrue {
		position: relative;
		width: 100%;
		height: 345rpx;
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
			&.on{
				width: 110rpx;
				height: 110rpx;
				margin: -55rpx 0 0 -55rpx;
				&::before{
					width: 100rpx;
					height: 100rpx;
				}
			}
		}
	}
	.productList .list .item .pictrue.on {
		width: 270rpx;
		height: 270rpx;
	}
	.productList .list .item .pictrue image {
		width: 100%;
		height: 100%;
		border-radius: 24rpx 24rpx 0 0;
	}
	.productList .list .item .pictrue image.on {
		border-radius: 16rpx;
	}
	.productList .list .item .text {
		padding: 20rpx 17rpx 26rpx 17rpx;
		font-size: 30rpx;
		.line1 {
			max-width: 300rpx;
		}
	}
	.productList .list .item .text.on {
		width: 420rpx;
		height: 270rpx;
		padding: 10rpx 0 0;
		.name{
			height: 78rpx;
		}
	}
	.productList .list .item .text .vip {
		font-size: 22rpx;
		margin-top: 20rpx;
		.sales {
			font-size: 22rpx;
			color: var(--view-theme);
		}
	}
	.productList .list .item .price-count{
		display: flex;
		margin-top: 8rpx;
		align-items: baseline;
		.price-box {
			font-size: 22rpx;
			color: var(--view-theme);
			text{
				font-size: 34rpx;
			}
		}
		.image{
			width: 26rpx;
			height: 26rpx;
			margin-right: 10rpx;
			border-radius: 0;
		}
	}
	.productList .list .item .exchange {
		font-size: 24rpx;
		margin-top: 18rpx;
		color: #666666;
	}
	.productList .list .item .text .vip.on {
		margin-top: 80rpx;
		display: flex;
		justify-content: space-between;
		.exchange{
			margin-top: 14rpx;
		}
	}
	.noCommodity {
		.emptyBox{
			text-align: center;
			margin-top: 40rpx;
			.tips{
				color: #aaa;
				font-size: 26rpx;
			}
			image {
				width: 414rpx;
				height: 304rpx;
			}
		}
	}
</style>
