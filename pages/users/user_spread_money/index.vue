<template>
	<view :style="viewColor">
		<view class='commission-details'>
			<view class='promoterHeader'>
				<timeSlot @changeTime="changeTime"></timeSlot>
			</view>
			<view class="pad20">
				<view class='sign-record bg-f boder-24 mt20' v-if="type==1">
					<block v-for="(item,index) in recordList" :key="index" v-if="recordList.length>0">
						<view class='list'>
							<view class='item'>
								<view class='listn'>
									<view class='itemn h-90'>
										<view class="acea-row row-between-wrapper">
											<view>
												<block v-if="item.status>=0">
													<view class='name line1' v-if="item.extract_type == 0">银行卡提现</view>
													<view class='name line1' v-if="item.extract_type == 2">微信提现</view>
													<view class='name line1' v-if="item.extract_type == 1">支付宝提现</view>
													<view class='name line1' v-if="item.extract_type == 3">提现到零钱</view>
													<view class='name line1' v-if="item.extract_type == 4">提现到余额</view>
												</block>
												<block v-else>
													<view class='name line1'>提现失败<text class="message">({{item.fail_msg}})</text></view>
												</block>
											</view>
											<view class='nums semiBold' v-if="item.status>=0">-{{item.extract_price}}</view>
											<view class='nums p-color acea-row row-between-wrapper' v-else>
												<text v-if="item.status == 0" class="item-label">冻结中</text>
												<text class="semiBold">+{{item.extract_price}}</text>
											</view>
										</view>
										<view class="item-foot acea-row row-between-wrapper">
											<view>{{item.create_time}}</view>
											<view>
												<view class="fail" v-if="item.status == -1">审核未通过</view>
												<view class="wait" v-if="item.status == 0">待审核</view>
												<view class="get" v-if="item.status == 1 && item.wechat_status == 'WAIT_USER_CONFIRM'">待收款</view>
											</view>
										</view>
										<view class="acea-row row-between">
											<view></view>
											<!-- #ifdef MP-WEIXIN  -->
											<navigator hover-class="none" class="receive-btn acea-row row-center-wrapper"
												v-if="item.wechat_status == 'WAIT_USER_CONFIRM'"
												:url="'/pages/users/user_spread_money/receiving?type=1&id=' + item.extract_id">立即收款</navigator>
											<!-- #endif -->
											<!-- #ifdef H5 -->
											<navigator hover-class="none" class="receive-btn acea-row row-center-wrapper"
												v-if="item.wechat_status == 'WAIT_USER_CONFIRM' && isWeixin"
												:url="'/pages/users/user_spread_money/receiving?type=1&id=' + item.extract_id">立即收款</navigator>
											<!-- #endif -->
										</view>
									</view>
								</view>
							</view>
						</view>
					</block>
				</view>
				<view class='sign-record bg-f boder-24 mt20' v-if="type==2">
					<block v-for="(item,index) in recordList" :key="index" v-if="recordList.length>0">
						<view class='list'>
							<view class='item'>
								<view class='listn'>
									<view class='itemn acea-row row-between-wrapper'>
										<view>
											<view class='name line1'>{{item.title}}</view>
											<view>{{item.create_time}}</view>
										</view>
										<view class='nums semiBold' v-if="item.pm==0">-{{item.number}}</view>
										<view v-else class='nums p-color acea-row row-between-wrapper'>
											<text v-if="item.status == 0" class="item-label">冻结中</text>
											<text class="semiBold">+{{item.number}}</text>
										</view>
									</view>
								</view>
							</view>
						</view>
					</block>
				</view>
				<view v-if="recordList.length == 0">
					<emptyPage title='暂无佣金记录~' :noImage="`${domain}/static/images/noRecord.png`"></emptyPage>
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
	import {
		getSpreadInfo,
		extractLst,
		brokerage_list,
		spreadInfo
	} from '@/api/user.js';
	import { mapGetters } from "vuex";
	import emptyPage from '@/components/emptyPage.vue';
	import { HTTP_REQUEST_URL } from '@/config/app';
	import timeSlot from '../components/timeSlot/index.vue';
	import { toLogin } from '@/libs/login.js';
	export default {
		components: {
			emptyPage,
			timeSlot
		},
		data() {
			return {
				domain: HTTP_REQUEST_URL,
				name: '',
				type: 0,
				page: 1,
				limit: 12,
				recordList: [],
				recordType: 0,
				status: false,
				times: [],
				start: "",
				stop: "",
				// #ifdef H5
				isWeixin: this.$wechat.isWeixin()
				// #endif
			};
		},
		computed: mapGetters(['isLogin','viewColor']),
		onLoad(options) {
			if (this.isLogin) {
				this.type = options.type;
			} else {
				toLogin()
			}
		},
		onShow: function() {
			let type = this.type;
			if(type == 2){
				uni.setNavigationBarTitle({
					title: "佣金记录"
				});
				this.name = '佣金明细';
				this.recordType = 2;
			}
			if(type == 1){
				uni.setNavigationBarTitle({
					title: "提现记录"
				});
				this.name = '提现总额';
				this.recordType = 1;
			}
			this.searchSubmitValue()
		},
		methods: {
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
				this.getRecordList()
			},
			getRecordList: function() {
				let that = this;
				let page = that.page;
				let limit = that.limit;
				let status = that.status;
				let recordType = that.recordType;
				let start = that.start;
				let stop = that.stop;
				let recordList = that.recordList;
				let recordListNew = [];
				if (status == true) return;
				if(this.type == 1){
					extractLst({
						page: page,
						limit: limit,
						start: start,
						stop: stop
					}, recordType).then(res => {
						let len = res.data.list.length;
						let recordListData = res.data.list;
						recordListNew = recordList.concat(recordListData);
						that.status = limit > len;
						that.page+=1;
						that.$set(that, 'recordList', recordListNew);
					});
				}
				if(this.type == 2){
					brokerage_list({
						page: page,
						limit: limit,
						start: start,
						stop: stop
					}).then(res => {
						let len = res.data.list.length;
						let recordListData = res.data.list;
						recordListNew = recordList.concat(recordListData);
						that.status = limit > len;
						that.page+=1;
						that.$set(that, 'recordList', recordListNew);
					});
				}
			},
		},
		onReachBottom: function() {
			this.getRecordList();
		}
	}
</script>

<style scoped lang="scss">
	.promoterHeader{
		background-image: linear-gradient(to right, var(--view-bntColor21) 0%, var(--view-bntColor22) 100%);
	}
	.commission-details .promoterHeader .headerCon .money {
		font-size: 36rpx;
	}
	.p-color {
		color: #E93323;
	}
	.commission-details .listn .nums {
		font-size: 36rpx;
	}
	.commission-details .listn .itemn.h-90 {
		height: auto;
		padding: 32rpx 0 24rpx;
		border-bottom: 2rpx solid #eee;
	}
	.commission-details .listn .item-foot {
		margin-top: 12rpx;
	}
	.commission-details .listn .receive-btn {
		width: 142rpx;
		height: 56rpx;
		color: #fff;
		background: var(--view-theme);
		border-radius: 30rpx;
		margin-top: 20rpx;
	}
	.message{
		font-size: 18rpx;
		color: #fc4141;
	}
	.item-label{
		font-size: 18rpx;
		display: flex;
		width: 76rpx;
		height: 26rpx;
		text-align: center;
		justify-content: center;
		background-color: var(--view-bgColor);
		margin-right: 6rpx;
		font-weight: normal;
	}
	.commission-details .listn .fail,
	.commission-details .listn .wait,
	.commission-details .listn .get{
		margin-top: 14rpx;
		text-align: right;
	}
	.commission-details .listn .fail {
		color: #E93323;
	}
	.commission-details .listn .wait{
		color: #FF7D00;
	}
	.commission-details .listn .get {
		color: #FFB200;
	}
</style>
