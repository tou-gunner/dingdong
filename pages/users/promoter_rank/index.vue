<template>
	<view :style="viewColor">
		<view class="PromoterRank">
			<view class="redBg" :style="'background-image: url('+domain+'/static/images/promoter_rank_bg.png)'">
				<view class="header">
					<view class="nav acea-row row-center-wrapper">
						<view class="item" :class="active == index ? 'view-color' : ''" v-for="(item,index) in navList" :key="index"
						 @click="switchTap(index)">
							{{ item }}
						</view>
					</view>
					<view class="rank acea-row row-bottom row-around">
						<view class="item" v-if="Two.uid">
							<view class="pictrue pictrue2" :style="'background-image: url('+domain+'/static/images/promoter_rank2.png)'">
								<image :src="Two.avatar || '/static/images/f.png'"></image>
							</view>
							<view class="name line1">{{Two.nickname}}</view>
							<view class="num">{{Two.count}}人</view>
						</view>
						<view class="item" v-if="One.uid">
							<view class="pictrue pictrue1" :style="'background-image: url('+domain+'/static/images/promoter_rank1.png)'">
								<image :src="One.avatar || '/static/images/f.png'"></image>
							</view>
							<view class="name line1">{{One.nickname}}</view>
							<view class="num">{{One.count}}人</view>
						</view>
						<view class="item" v-if="Three.uid">
							<view class="pictrue pictrue3" :style="'background-image: url('+domain+'/static/images/promoter_rank3.png)'">
								<image :src="Three.avatar || '/static/images/f.png'"></image>
							</view>
							<view class="name line1">{{Three.nickname}}</view>
							<view class="num">{{Three.count}}人</view>
						</view>
					</view>
				</view>
			</view>
			<view class="list bg-f boder-24" v-if="rankList.length">
				<view class="item acea-row row-between-wrapper" v-for="(item,index) in rankList" :key="index">
					<view class="num">{{index+4}}</view>
					<view class="picTxt acea-row row-between-wrapper">
						<view class="pictrue">
							<image :src="item.avatar || '/static/images/f.png'"></image>
						</view>
						<view class="text line1">{{item.nickname}}</view>
					</view>
					<view class="people">{{item.count}}人</view>
				</view>
			</view>
		</view>
		<emptyPage v-if="isEmpty" :noImage="`${domain}/static/images/noRecord.png`" title="暂无排行~"></emptyPage>
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
	import { getRankList } from '@/api/user.js';
	import { mapGetters } from "vuex";
	import { toLogin } from '@/libs/login.js';
	import emptyPage from '@/components/emptyPage.vue'
	import { HTTP_REQUEST_URL } from '@/config/app';
	export default {
		components: {emptyPage},
		data() {
			return {
				domain: HTTP_REQUEST_URL,
				navList: ["周榜", "月榜"],
				active: 0,
				page: 1,
				limit: 10,
				type: 'week',
				loading: false,
				loadend: false,
				rankList: [],
				Two: {},
				One: {},
				Three: {},
				isEmpty: true,
			};
		},
		computed: mapGetters(['isLogin','viewColor']),
		onLoad() {
			if (this.isLogin) {
				this.getRanklist();
			} else {
				toLogin()
			}
		},
		methods: {
			getRanklist: function() {
				let that = this;
				if (that.loadend) return;
				if (that.loading) return;
				that.loading = true;
				getRankList({
					page: that.page,
					limit: that.limit,
					type: that.active
				}).then(res => {
					let list = res.data.list;
					that.isEmpty = res.data.list<=0 && that.page == 1
					that.rankList.push(...list);
					if (that.page == 1) {
						that.One = that.rankList.shift() || {};
						that.Two = that.rankList.shift() || {};
						that.Three = that.rankList.shift() || {};
					}
					that.loadend = list.length < that.limit;
					that.loading = false;
					that.$set(that, 'rankList', that.rankList);
					that.One = that.One;
					that.Two = that.Two;
					that.Three = that.Three;
					that.page = that.page + 1;
				}).catch(err => {
					that.loading = false;
				})
			},
			switchTap: function(index) {
				if (this.active === index) return;
				this.active = index;
				this.type = index ? 'month' : 'week';
				this.page = 1;
				this.loadend = false;
				this.$set(this, 'rankList', []);
				this.Two = {};
				this.One = {};
				this.Three = {};
				this.getRanklist();
			},
		},
		onReachBottom: function() {
			this.getRanklist();
		}
	}
</script>

<style scoped lang="scss">
	.PromoterRank .redBg {
		padding: 45rpx 0 30rpx 0;
		height: 460rpx;
		background-color: var(--view-theme);
		background-repeat: no-repeat;
		background-size: 100% auto;
		background-position: left bottom;
	}
	.PromoterRank .header {
		width: 100%;
		background-size: 100% 100%;
	}
	.PromoterRank .header .nav {
		width: 450rpx;
		height: 66rpx;
		border: 1px solid #fff;
		border-radius: 33rpx;
		font-size: 30rpx;
		color: #fff;
		margin: 0 auto;
	}
	.PromoterRank .header .nav .item {
		width: 223rpx;
		height: 100%;
		text-align: center;
		line-height: 60rpx;
		position: relative;
	}
	.view-color{
		color: var(--view-theme);
	}
	.PromoterRank .header .nav .item.view-color:nth-of-type(1) {
		background-color: #fff;
		border-radius: 33rpx 0 0 33rpx;
		left: -2rpx;
	}
	.PromoterRank .header .nav .item.view-color:nth-of-type(2) {
		background-color: #fff;
		border-radius: 0 33rpx 33rpx 0;
		right: -2rpx;
	}
	.PromoterRank .header .rank {
		padding: 0 20rpx;
		margin-top: 15rpx;
	}
	.PromoterRank .header .rank .item .pictrue {
		background-size: 100% 100%;
		width: 136rpx;
		height: 177rpx;
		position: relative;
		margin: 0 auto;
	}
	.PromoterRank .header .rank .item .pictrue image {
		position: absolute;
		width: 130rpx;
		height: 130rpx;
		display: block;
		bottom: 2rpx;
		border-radius: 50%;
		left: 50%;
		margin-left: -65rpx;
	}
	.PromoterRank .header .rank .item:nth-of-type(2) .pictrue {
		width: 156rpx;
		height: 205rpx;
	}
	.PromoterRank .header .rank .item:nth-of-type(2) .pictrue image {
		width: 150rpx;
		height: 150rpx;
		margin-left: -75rpx;
	}
	.PromoterRank .header .rank .item:nth-of-type(3) .pictrue image {
		margin-left: -64rpx;
	}
	.PromoterRank .header .rank .item .name {
		font-size: 30rpx;
		color: #fff;
		margin-top: 22rpx;
		text-align: center;
		width: 170rpx;
	}
	.PromoterRank .header .rank .item .num {
		font-size: 30rpx;
		color: #fff;
		text-align: center;
	}
	.PromoterRank .list {
		width: 710rpx;
		margin: -30rpx auto 0 auto;
		padding: 0 30rpx;
	}
	.PromoterRank .list .item {
		border-bottom: 1px solid #f3f3f3;
		height: 110rpx;
		font-size: 28rpx;
	}
	.PromoterRank .list .item .num {
		color: #666;
		width: 70rpx;
	}
	.PromoterRank .list .item .picTxt {
		width: 350rpx;
	}
	.PromoterRank .list .item .picTxt .pictrue {
		width: 68rpx;
		height: 68rpx;
	}
	.PromoterRank .list .item .picTxt .pictrue image {
		width: 100%;
		height: 100%;
		display: block;
		border-radius: 50%;
	}
	.PromoterRank .list .item .picTxt .text {
		width: 262rpx;
		color: #333;
	}
	.PromoterRank .list .item .people {
		width: 175rpx;
		text-align: right;
		color: var(--view-priceColor);
	}
	.empty-box {
		margin-top: 0;
	}
</style>
