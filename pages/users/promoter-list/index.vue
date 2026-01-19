<template>
	<view :style="viewColor">
		<view class="promoter-list">
			<view class="promoter-header">
				<view class="search">
					<view class="search-content acea-row row-middle">
						<text class="iconfont icon-ic_search"></text>
						<input type='text' v-model="keyword" placeholder='搜索用户名称' @confirm="searchSubmitValue" confirm-type='search'
						name="search" placeholder-class='placeholder' />
					</view>
				</view>
			</view>
			<view class='nav acea-row row-around'>
				<view :class="grade == 0 ? 'item on' : 'item'" @click='setType(0)'>一级({{userInfo.one_level_count}})</view>
				<view :class="grade == 1 ? 'item on' : 'item'" @click='setType(1)'>二级({{userInfo.two_level_count}})</view>
			</view>
			<timeSlot @changeTime="changeTime"></timeSlot>
			<view class="pad20">
				<view class='list mt20 bg-f boder-24'>
					<view class="sortNav acea-row row-middle">
						<view class="sortItem" @click='setSort("spread_count ASC")' v-if="sort == 'spread_count DESC'">团队排序
							<image :src="domain+'/static/diy/sort1'+keyColor+'.png'"></image>
						</view>
						<view class="sortItem" @click='setSort("")' v-else-if="sort == 'spread_count ASC'">团队排序
							<image class="sort3" :src="domain+'/static/diy/sort1'+keyColor+'.png'"></image>
						</view>
						<view class="sortItem" @click='setSort("spread_count DESC")' v-else>团队排序
							<image :src="`${domain}/static/images/sort2.png`"></image>
						</view>
						<view class="sortItem" @click='setSort("pay_price ASC")' v-if="sort == 'pay_price DESC'">金额排序
							<image :src="domain+'/static/diy/sort1'+keyColor+'.png'"></image>
						</view>
						<view class="sortItem" @click='setSort("")' v-else-if="sort == 'pay_price ASC'">金额排序
							<image class="sort3" :src="domain+'/static/diy/sort1'+keyColor+'.png'"></image>
						</view>
						<view class="sortItem" @click='setSort("pay_price DESC")' v-else>金额排序
							<image :src="`${domain}/static/images/sort2.png`"></image>
						</view>
						<view class="sortItem" @click='setSort("pay_count ASC")' v-if="sort == 'pay_count DESC'">订单排序
							<image :src="domain+'/static/diy/sort1'+keyColor+'.png'"></image>
						</view>
						<view class="sortItem" @click='setSort("")' v-else-if="sort == 'pay_count ASC'">订单排序
							<image class="sort3" :src="domain+'/static/diy/sort1'+keyColor+'.png'"></image>
						</view>
						<view class="sortItem" @click='setSort("pay_count DESC")' v-else>订单排序
							<image :src="`${domain}/static/images/sort2.png`"></image>
						</view>
					</view>
					<block v-for="(item,index) in recordList" :key="index">
						<view class='item acea-row row-between-wrapper'>
							<view class="picTxt acea-row row-between-wrapper">
								<view class='pictrue'>
									<image :src='item.avatar || "/static/images/f.png"'></image>
								</view>
								<view class='text'>
									<view class='name line1'>{{item.nickname}}</view>
									<view>加入时间: {{item.spread_time}}</view>
								</view>
							</view>
							<view class="right">
								<view><text class='num t-color'>{{item.spread_count ? item.spread_count : 0}}</text>人</view>
								<view><text class="num">{{item.pay_count ? item.pay_count : 0}}</text>单</view>
								<view><text class="num">{{item.pay_price ? item.pay_price : 0}}</text>元</view>
							</view>
						</view>
					</block>

				</view>
			</view>
		</view>
		<block v-if="recordList.length == 0">
			<emptyPage title="暂无数据~"></emptyPage>
		</block>
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
	import { spreadPeople, getUserInfo, spreadInfo } from '@/api/user.js';
	import { mapGetters } from "vuex";
	import { HTTP_REQUEST_URL } from '@/config/app';
	import { toLogin } from '@/libs/login.js';
	import timeSlot from '../components/timeSlot/index.vue';
	import emptyPage from '@/components/emptyPage.vue'
	export default {
		components: {
			timeSlot,
			emptyPage
		},
		data() {
			return {
				domain: HTTP_REQUEST_URL,
				total: 0,
				totalLevel: 0,
				teamCount: 0,
				page: 1,
				limit: 20,
				keyword: '',
				start: 0,
				stop: 0,
				sort: '',
				grade: 0,
				status: false,
				recordList: [],
				userInfo:{},
				times: [],
			};
		},
		computed: mapGetters(['isLogin','viewColor','keyColor']),
		onLoad() {
			if (this.isLogin) {
				this.userSpreadNewList();
				this.getUserInfo()
			} else {
				toLogin()
			}
		},
		onShow: function() {
			if (this.is_show){
				this.userSpreadNewList();
				this.getUserInfo();
			}
		},
		onHide: function() {
			this.is_show = true;
		},
		methods: {
			getUserInfo(){
				spreadInfo().then(res => {
					this.userInfo = res.data
				});
			},
			setSort: function(sort) {
				let that = this;
				that.sort = sort;
				that.page = 1;
				that.limit = 20;
				that.status = false;
				that.$set(that, 'recordList', []);
				that.userSpreadNewList();
			},
			changeTime(time) {
				this.start = time.start
				this.stop = time.stop
				this.searchSubmitValue()
			},
			searchSubmitValue(e) {
				this.page = 1;
				this.limit = 20;
				this.status = false;
				this.$set(this, 'recordList', []);
				this.$set(this, 'times', []);
				this.userSpreadNewList()
			},
			setType: function(grade) {
				if (this.grade != grade) {
					this.grade = grade;
					this.page = 1;
					this.limit = 20;
					this.keyword = '';
					this.sort = '';
					this.status = false;
					this.$set(this, 'recordList', []);
					this.userSpreadNewList();
				}
			},
			userSpreadNewList: function() {
				let that = this;
				let page = that.page;
				let limit = that.limit;
				let status = that.status;
				let keyword = that.keyword;
				let sort = that.sort;
				let grade = that.grade;
				let start = that.start;
				let stop = that.stop;
				let recordList = that.recordList;
				let recordListNew = [];
				if (status == true) return;
				spreadPeople({
					page: page,
					limit: limit,
					keyword: keyword,
					level: grade+1,
					sort: sort,
					start: start,
					stop: stop
				}).then(res => {
					let len = res.data.list.length;
					let recordListData = res.data.list;
					recordListNew = recordList.concat(recordListData);
					that.total = res.data.total;
					that.totalLevel = res.data.totalLevel;
					that.teamCount = that.$util.$h.Add(Number(res.data.total), Number(res.data.totalLevel));
					that.status = limit > len;
					that.page = page + 1;
					that.$set(that, 'recordList', recordListNew);
				});
			}
		},
		onReachBottom: function() {
			this.userSpreadNewList();
		}
	}
</script>

<style scoped lang="scss">
	.promoterHeader {
		background-image: linear-gradient(to right, var(--view-bntColor21) 0%, var(--view-bntColor22) 100%);
	}
	.t-color {
		color: var(--view-theme);
	}
	.promoter-header{
		width: 100%;
	}
	.search {
		padding: 17rpx 30rpx;
		background-color: var(--view-theme);
		.search-content {
			width: 100%;
			height: 60rpx;
			padding: 0 30rpx;
			border-radius: 30rpx;
			background-color: #FFFFFF;
			font-size: 26rpx;
		}
		.iconfont {
			margin-right: 10rpx;
			font-size: 26rpx;
			color: #999999;
		}
		.placeholder {
			font-size: 26rpx;
			color: #999999;
		}
		.input {
			flex: 1;
		}
	}
	.promoter-list .nav {
		background-color: #fff;
		height: 86rpx;
		line-height: 86rpx;
		font-size: 28rpx;
		color: #282828;
	}
	.promoter-list .nav .item.on {
		border-bottom: 5rpx solid var(--view-theme);
		color: var(--view-theme);
	}
	.promoter-list .list .sortNav {
		height: 76rpx;
		border-bottom: 1px solid #eee;
		color: #333;
		font-size: 28rpx;
	}
	.promoter-list .list .sortNav .sortItem {
		text-align: center;
		flex: 1;
	}
	.promoter-list .list .sortNav .sortItem image {
		width: 24rpx;
		height: 24rpx;
		margin-left: 6rpx;
		vertical-align: -3rpx;
		&.sort3{
			transform: rotate(180deg);
		}
	}
	.promoter-list .list .item {
		border-bottom: 1px solid #eee;
		padding: 32rpx 24rpx;
		font-size: 24rpx;
		color: #666;
	}
	.promoter-list .list .item .picTxt {
		width: 480rpx;
	}
	.promoter-list .list .item .picTxt .pictrue {
		width: 112rpx;
		height: 112rpx;
		border-radius: 50%;
	}
	.promoter-list .list .item .picTxt .pictrue image {
		width: 100%;
		height: 100%;
		border-radius: 50%;
		border: 3rpx solid #fff;
		box-shadow: 0 0 10rpx #aaa;
		box-sizing: border-box;
	}
	.promoter-list .list .item .picTxt .text {
		width: 360rpx;
		font-size: 24rpx;
		color: #999999;
	}
	.promoter-list .list .item .picTxt .text .name {
		font-size: 28rpx;
		color: #333;
		margin-bottom: 13rpx;
	}
	.promoter-list .list .item .right {
		width: 180rpx;
		text-align: right;
		font-size: 22rpx;
		color: #333;
	}
	.promoter-list .list .item .right .num{
		margin-right: 7rpx;
	}
</style>
