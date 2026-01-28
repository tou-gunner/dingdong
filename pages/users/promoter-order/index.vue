<template>
	<view :style="viewColor">
		<view class="promoter-order">
			<view class="promoter-header">
				<view class="search">
					<view class="search-content acea-row row-middle">
						<text class="iconfont icon-ic_search"></text>
						<input type='text' placeholder='搜索用户昵称或商品名称' @confirm="searchSubmitValue" confirm-type='search'
						name="search" placeholder-class='placeholder' />
					</view>
				</view>
				<timeSlot @changeTime="changeTime"></timeSlot>
			</view>
			<view class='list pad20' v-if="recordList.length>0">
				<view class="top_num">
					共 <text class="main_color">{{total}}</text> 笔订单
				</view>
				<block v-for="(item,index) in recordList" :key="index">
					<view class='item bg-f boder-24'>
						<view class='listn'>
								<view class='itenm'>
									<view class='top acea-row row-between-wrapper'>
										<view class='pictxt acea-row row-between-wrapper'>
											<view class='pictrue'>
												<image v-if="item.user.avatar" :src='item.user.avatar'></image>
												<image v-else class="avatar" src="/static/images/f.png"></image>
											</view>
											<view class='text line1'>{{item.user.nickname}}</view>
										</view>
										<view class='money' v-if="item.status >= 2">返佣：<text class='p-color'>₭{{item.brokerage}}</text></view>
										<view class='money' v-else>待结算佣金：<text class='p-color'>₭{{item.brokerage}}</text></view>
									</view>
									<view class='bottom'>
										<view class="acea-row">
											<view class='name'>商品名称：</view>
											<view class="line1 store_name">{{item.orderProduct[0]['cart_info']['product']['store_name']}}</view>
										</view>
										<view><text class='name'>订单编号：</text>{{item.order_sn}}</view>
										<view><text class='name'>下单时间：</text>{{item.pay_time}}</view>
									</view>
								</view>
						</view>
					</view>
				</block>
			</view>
			<view v-if="recordList.length == 0">
				<emptyPage title="暂无推广订单～" :noImage="`${domain}/static/images/noRecord.png`"></emptyPage>
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
	import { spreadOrder } from '@/api/user.js';
	import { mapGetters } from "vuex";
	import { toLogin } from '@/libs/login.js';
	import emptyPage from '@/components/emptyPage.vue';
	import { HTTP_REQUEST_URL } from '@/config/app';
	import timeSlot from '../components/timeSlot/index.vue';
	export default {
		components: {
			timeSlot,
			emptyPage
		},
		data() {
			return {
				domain: HTTP_REQUEST_URL,
				page: 1,
				limit: 8,
				keyword: "",
				start: 0,
				stop: 0,
				status: false,
				total:0,
				sum_brokerage:0,
				recordList: [],
				recordCount: 0,
				userInfo:'',
				time: "", //时间|today=今天|yesterday=昨天|month=本月
				times: [],
			};
		},
		computed: mapGetters(['isLogin','viewColor']),
		onLoad() {
			if (this.isLogin) {
				this.getRecordOrderList();
			} else {
				toLogin()
			}
		},
		methods: {
			searchSubmitValue(e) {
				this.keyword = e ? e.detail.value : ''
				this.page = 1;
				this.limit = 20;
				this.status = false;
				this.$set(this, 'recordList', []);
				this.$set(this, 'times', []);
				this.getRecordOrderList()
			},
			changeTime(time) {
				this.start = time.start
				this.stop = time.stop
				this.searchSubmitValue()
			},
			getRecordOrderList: function() {
				let that = this;
				let page = that.page;
				let limit = that.limit;
				let status = that.status;
				let recordList = that.recordList;
				let recordListNew = [];
				if (status == true) return;
				spreadOrder({
					start: that.start,
					stop: that.stop,
					keyword: that.keyword,
					page: page,
					limit: limit
				}).then(res => {
					that.total = res.data.count;
					that.sum_brokerage = res.data.sum_brokerage;
					let len = res.data.list ? res.data.list.length : 0;
					let recordListData = res.data.list;
					recordListNew = recordList.concat(recordListData);
					that.recordCount = res.data.count || 0;
					that.status = limit > len;
					that.page +=1;
					that.$set(that, 'recordList', recordListNew);
				});
			}
		},
		onReachBottom() {
			this.getRecordOrderList();
		}
	}
</script>

<style scoped lang="scss">
	.promoter-header{
		position: fixed;
		top: 0;
		left: 0;
		z-index: 9;
		width: 100%;
		background: #ffffff;
	}
	.p-color {
		color: var(--view-priceColor);
	}
	.search {
		padding: 17rpx 30rpx;
		.search-content {
			width: 100%;
			height: 60rpx;
			padding: 0 30rpx;
			border-radius: 30rpx;
			background: #f5f5f5;
			font-size: 26rpx;
		}
		.iconfont {
			margin-right: 10rpx;
			font-size: 26rpx;
			color: #999999;
		}
		.input {
			flex: 1;
		}
	}
	.promoter-order .list{
		margin-top: 200rpx;
	}
	.promoter-order .list .item {
		margin-bottom: 20rpx;
		padding: 0 24rpx;
	}
	.promoter-order .list .item .title {
		height: 133rpx;
		padding: 0 30rpx;
		font-size: 26rpx;
		color: #999;
	}
	.promoter-order .list .item .title .data {
		font-size: 28rpx;
		color: #282828;
		margin-bottom: 5rpx;
	}
	.promoter-order .list .item .listn .itenm .top {

		border-bottom: 1px solid #eee;
		height: 100rpx;
	}
	.promoter-order .list .item .listn .itenm .top .pictxt .text {
		width: 230rpx;
		font-size: 30rpx;
	}
	.promoter-order .list .item .listn .itenm .top .pictxt .pictrue {
		margin-right: 16rpx;
	}
	.promoter-order .list .item .listn .itenm .top .pictxt .pictrue image {
		width: 64rpx;
		height: 64rpx;
		border-radius: 50%;
		border: 3rpx solid #fff;
		box-sizing: border-box;
		box-shadow: 0px 1px 12px 0px rgba(0,0,0,0.102);
	}
	.promoter-order .list .itenm .top .money {
		font-size: 28rpx;
	}
	.promoter-order .list .itenm .bottom {
		padding: 20rpx 0;
		font-size: 28rpx;
		color: #666;
		line-height: 1.6;
		>view{
			margin-top: 14rpx;
		}
	}
	.promoter-order .list .item .listn .itenm .bottom .name {
		color: #999;
	}
	.promoter-order .list .item .listn .itenm .bottom .store_name{
		max-width: 520rpx;
	}
	.top_num{
		padding: 0 10rpx;
		font-size: 24rpx;
		color: #999;
		line-height: 86rpx;
	}
	.main_color{
		color: var(--view-theme);
	}
	::v-deep .empty-box {
		margin-top: 300rpx;
	}
</style>
