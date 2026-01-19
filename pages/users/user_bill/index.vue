<template>
	<view :style="viewColor">
		<view class='bill-details'>
			<view class='nav acea-row'>
				<view class='item' :class='type==0 ? "on":""' @click='changeType(0)'><text>全部</text></view>
				<view class='item' :class='type==1 ? "on":""' @click='changeType(1)'><text>消费</text></view>
				<view class='item' :class='type==2 ? "on":""' @click='changeType(2)'><text>充值</text></view>
			</view>
			<view class='sign-record'>
				<view class='list' v-for="(item,index) in userBillList" :key="index">
					<view class='item bg-f'>
						<!-- <view class='data'>{{item.time}}</view> -->
						<view class='listn'>
							<view class='itemn acea-row row-between-wrapper'>
								<view>
									<view class='name line1'>{{item.title}}</view>
									<view>{{item.create_time}}</view>
								</view>
								<view class='num semiBold' v-if="item.pm ==1">+{{item.number}}</view>
								<view class='num p-color semiBold' v-else>-{{item.number}}</view>
							</view>
						</view>
					</view>
				</view>
				<view class='loadingicon acea-row row-center-wrapper' v-if="userBillList.length>0">
					<text class='loading iconfont icon-jiazai' :hidden='loading==false'></text>{{loadTitle}}
				</view>
				<view v-if="userBillList.length == 0">
					<emptyPage title="暂无账单的记录哦～" :noImage="`${domain}/static/images/noRecord.png`"></emptyPage>
				</view>
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
	import { getCommissionInfo } from '@/api/user.js';
	import { mapGetters } from "vuex";
	import emptyPage from '@/components/emptyPage.vue'
	import { toLogin } from '@/libs/login.js';
	import { HTTP_REQUEST_URL } from '@/config/app';
	export default {
		components: {
			emptyPage
		},
		data() {
			return {
				domain: HTTP_REQUEST_URL,
				loadTitle: '加载更多',
				loading: false,
				loadend: false,
				page: 1,
				limit: 15,
				type: 0,
				userBillList: [],
			};
		},
		computed: mapGetters(['isLogin','viewColor']),
		onShow() {
			if (this.isLogin) {
				this.getUserBillList();
			} else {
        toLogin()
			}
		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			this.type = options.type || 0;
		},
		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom: function() {
			this.getUserBillList();
		},
		methods: {
			/**
			 * 获取账户明细
			 */
			getUserBillList: function() {
				let that = this;
				if (that.loadend) return;
				if (that.loading) return;
				that.loading = true;
				that.loadTitle = "";
				let data = {
					page: that.page,
					limit: that.limit,
					type:that.type
				}
				getCommissionInfo(data).then(function(res) {
					let list = res.data.list,
					loadend = list.length < that.limit;
					that.userBillList = that.$util.SplitArray(list, that.userBillList);
					that.$set(that, 'userBillList', that.userBillList);
					that.loadend = loadend;
					that.loading = false;
					that.loadTitle = loadend ? "哼😕~我也是有底线的~" : "加载更多";
					that.page = that.page + 1;
				}, function(res) {
					that.loading = false;
					that.loadTitle = '加载更多';
				});
			},
			/**
			 * 切换导航
			 */
			changeType: function(type) {
				this.type = type;
				this.loadend = false;
				this.page = 1;
				this.$set(this, 'userBillList', []);
				this.getUserBillList();
			},
		}
	}
</script>

<style scoped lang='scss'>
	.bill-details .nav {
		background-color: #fff;
		height: 90rpx;
		width: 100%;
		line-height: 90rpx;
	}
	.bill-details .nav .item {
		flex: 1;
		text-align: center;
		font-size: 30rpx;
		color: #282828;
		text {
			display: inline-block;
			line-height: 90rpx;
		}
	}
	.bill-details .nav .item.on {
		color: #E93323;
		text {
			border-bottom: 4rpx solid #E93323;
		}
	}
	.p-color {
		color: #E93323!important;
	}
</style>
