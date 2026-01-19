<template>
	<view>
		<view class='newsList'>
			<view class='nav bg-f' v-if="navList.length > 0">
				<scroll-view class="scroll-view_x" scroll-x scroll-with-animation :scroll-left="scrollLeft" style="width:auto;overflow:hidden;">
					<block v-for="(item,index) in navList" :key="index">
						<view class='item' :class='active==item.article_category_id?"on":""' @click='tabSelect(item.article_category_id)'>
							<view>{{item.title}}</view>
							<view class='line bg-color' v-if="active==item.article_category_id"></view>
						</view>
					</block>
				</scroll-view>
			</view>
			<view class='list pad20'>
				<block v-for="(item,index) in articleList" :key="index">
					<navigator :url='"/pages/news_details/index?id="+item.article_id' hover-class='none' class='item acea-row row-between-wrapper bg-f boder-24 mt20'>
						<view class='text acea-row row-column-between'>
							<view class='name line2'>{{item.title}}</view>
							<view>{{item.create_time}}</view>
						</view>
						<view class='pictrue'>
							<image :src='item.image_input'></image>
						</view>
					</navigator>
				</block>
			</view>
		</view>
		<block v-if="articleList.length == 0 && (page != 1 || active== 0)">
			<emptyPage title="暂无新闻信息～" :noImage="`${domain}/static/images/empty-box.png`"></emptyPage>
		</block>
		<home></home>
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
		getArticleCategoryList,
		getArticleList,
		getArticleHotList
	} from '@/api/api.js';
	import home from '@/components/home';
	import { HTTP_REQUEST_URL } from '@/config/app';
	import emptyPage from '@/components/emptyPage.vue';
	export default {
		components: {
			home,
			emptyPage
		},
		data() {
			return {
				domain: HTTP_REQUEST_URL,
				imgUrls: [],
				articleList: [],
				indicatorDots: false,
				circular: true,
				autoplay: true,
				interval: 3000,
				duration: 500,
				navList: [],
				active: 0,
				page: 1,
				limit: 8,
				status: false,
				scrollLeft: 0
			};
		},
		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: function() {},
		/**
		 * 生命周期函数--监听页面显示
		 */
		onLoad: function() {
			this.getArticleCate();
			this.status = false;
			this.page = 1;
			this.articleList = [];
		},
		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom: function() {
			this.getCidArticle();
		},
		methods: {
			getArticleHot: function() {
				let that = this;
				getArticleHotList().then(res => {
					that.$set(that, 'articleList', res.data);
				});
			},
			getCidArticle: function() {
				let that = this;
				if (that.active == 0) return;
				let limit = that.limit;
				let page = that.page;
				let articleList = that.articleList;
				if (that.status) return;
				getArticleList(that.active, {
					page: page,
					limit: limit
				}).then(res => {
					let articleListNew = [];
					let len = res.length;
					articleListNew = articleList.concat(res.data.list);
					that.page++;
					that.$set(that, 'articleList', articleListNew);
					that.status = limit > len;
					that.page = that.page;
				});
			},
			getArticleCate: function() {
				let that = this;
				getArticleCategoryList().then(res => {
					this.active = res.data[0].article_category_id
					that.$set(that, 'navList', res.data);
					this.getCidArticle();
				});
			},
			tabSelect(active) {
				this.active = active;
				if (this.active == 0) this.getArticleHot();
				else {
					this.$set(this, 'articleList', []);
					this.page = 1;
					this.status = false;
					this.getCidArticle();
				}
			}
		}
	}
</script>
<style lang="scss" scoped>
	.newsList .nav {
		padding: 0 30rpx;
		width: 100%;
		white-space: nowrap;
		box-sizing: border-box;
		padding-top: 43rpx;
	}
	.newsList .nav .item {
		display: inline-block;
		font-size: 32rpx;
		color: #999;
		min-width: 130rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		position: relative;
		padding-bottom: 20rpx;
		text-align: center;
	}
	.newsList .nav .item.on {
		color: #282828;
	}
	.newsList .nav .item~.item {
		margin-left: 46rpx;
	}
	.newsList .nav .item .line {
		width: 24rpx;
		height: 4rpx;
		border-radius: 2rpx;
		margin: 10rpx auto 0 auto;
		position: absolute;
		bottom: 5rpx;
		left: 50%;
		margin-left: -12rpx;
	}
	.newsList .list .item {
		border-bottom: 1px solid #f0f0f0;
		padding: 35rpx 30rpx;
	}
	.newsList .list .item .pictrue {
		width: 250rpx;
		height: 156rpx;
		border-radius: 16rpx;
	}
	.newsList .list .item .pictrue image {
		width: 100%;
		height: 100%;
		border-radius: 16rpx;
	}
	.newsList .list .item .text {
		width: 360rpx;
		height: 156rpx;
		font-size: 24rpx;
		color: #999;
	}
	.newsList .list .item .text .name {
		font-size: 30rpx;
		color: #282828;
	}
	.newsList .list .item .picList .pictrue {
		width: 335rpx;
		height: 210rpx;
		border-radius: 16rpx;
	}
	.newsList .list .item .picList.on .pictrue {
		width: 217rpx;
		height: 136rpx;
		border-radius: 16rpx;
	}
	.newsList .list .item .picList .pictrue image {
		width: 100%;
		height: 100%;
		border-radius: 16rpx;
	}
	.empty-box{
		margin-top: 200rpx;
	}
</style>
