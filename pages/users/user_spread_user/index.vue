<template>
	<view :style="viewColor">
		<view class='my-promotion'>
			<view class="header" :style="{ 'background-image': `url(${domain}/static/images/promotion-header-bg.png)`}">
				<view class='name acea-row row-center-wrapper'>
					<view>当前佣金</view>
					<text @click="showProtocol=true" class="iconfont icon-icon_question"></text>
					<navigator v-if="userInfo.brokerage && userInfo.show_brokerage" url='/pages/users/user_brokerage/index' hover-class="none" class='record area-row row-middle'>
						<image v-if="userInfo.brokerage.brokerage_icon" class="level_icon" :src="userInfo.brokerage.brokerage_icon"></image>
						<image v-else class="level_icon" :src="`${domain}/static/images/level_avatar.png`"></image>
						<text>{{userInfo.brokerage.brokerage_name}}</text>
						<text class='iconfont icon-ic_rightarrow'></text>
					</navigator>
				</view>
				<view class='num regular'>{{userInfo.total_brokerage_price}}</view>
				<view class='profit acea-row row-between-wrapper'>
					<view class='item'>
						<view>昨日收益</view>
						<view class='money'>{{userInfo.yesterday_brokerage}}</view>
					</view>
					<view class='item'>
						<navigator url='/pages/users/user_spread_money/index?type=1' hover-class="none">累计已提<text class='iconfont icon-ic_rightarrow'></text></navigator>
						<view class='money'>{{userInfo.total_extract}}</view>
					</view>
				</view>
			</view>
			<navigator url="/pages/users/user_cash/index" hover-class="none" class='bnt b-color acea-row row-center-wrapper'>立即提现</navigator>
			<view class='list acea-row row-between-wrapper'>
				<navigator url='/pages/users/user_spread_code/index' hover-class="none" class='item acea-row row-center-wrapper row-column'>
					<text class='iconfont icon-ic_QRcode2'></text>
					<view>推广名片</view>
				</navigator>
				<navigator url='/pages/users/promoter-list/index' hover-class="none" class='item acea-row row-center-wrapper row-column'>
					<text class='iconfont icon-ic_statistics'></text>
					<view>推广人统计</view>
				</navigator>
				<navigator url='/pages/users/user_spread_money/index?type=2' hover-class="none" class='item acea-row row-center-wrapper row-column'>
					<text class='iconfont icon-ic_Money2'></text>
					<view>佣金明细</view>
				</navigator>
				<navigator url='/pages/users/promoter-order/index' hover-class="none" class='item acea-row row-center-wrapper row-column'>
					<text class='iconfont icon-ic_order1'></text>
					<view>推广人订单</view>
				</navigator>
				<navigator url='/pages/users/promoter_rank/index' hover-class="none" class='item acea-row row-center-wrapper row-column'>
					<text class='iconfont icon-ic_crown2'></text>
					<view>推广人排行</view>
				</navigator>
				<navigator url='/pages/users/commission_rank/index' hover-class="none" class='item acea-row row-center-wrapper row-column'>
					<text class='iconfont icon-ic_ranking'></text>
					<view>佣金排行</view>
				</navigator>
			</view>
		</view>
		<view class="instructions" v-if="showProtocol">
			<view class="agreement-count">
				<view class="setAgCount">
					<view class="title">佣金说明</view>
					<view class="agBox">
						<view class="content">
							<jyf-parser :html="protocol" ref="article" :tag-style="tagStyle"></jyf-parser>
						</view>
					</view>
				</view>
				<text class="icon iconfont icon-ic_close1" @click="showProtocol = false"></text>
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
	import { spreadInfo, commissionDescription } from '@/api/user.js';
	import { openEextractSubscribe } from '@/utils/SubscribeMessage.js';
	import { mapGetters } from "vuex";
	import parser from "@/components/jyf-parser/jyf-parser";
	import { toLogin } from '@/libs/login.js';
	import { HTTP_REQUEST_URL } from '@/config/app';
	export default {
		components: {
			"jyf-parser": parser,
		},
		data() {
			return {
				domain: HTTP_REQUEST_URL,
				userInfo: [],
				yesterdayPrice: 0.00,
				protocol: '',
				showProtocol: false,
				tagStyle: {
					img: 'width:100%;display:block;',
					video: 'width:100%;'
				},
			};
		},
		computed: mapGetters(['isLogin','viewColor']),
		onLoad() {
			if (this.isLogin) {
				this.spreadInfo();
				this.getCommissionDescription();
			} else {
				toLogin()
			}
		},
		methods: {
			// 获取佣金说明
			getCommissionDescription() {
				commissionDescription().then(res => {
					if(res.status == 200) {
						this.protocol = res.data.sys_extension_agree
					}
				})
			},
			/**
			 * 获取佣金数据
			 */
			spreadInfo: function() {
				let that = this;
				spreadInfo().then(res => {
					that.$set(that,'userInfo',res.data);
				}).catch((err) => {
					that.$util.Tips({
						title: err,
					});
					setTimeout(()=>{
						uni.switchTab({
							url: '/pages/user/index',
						});
					},1000)
				});
			}
		}
	}
</script>

<style scoped lang="scss">
	.b-color {
		background-color: var(--view-theme);
	}
	.level_icon{
		width: 43rpx;
		height: 43rpx;
		margin-right: 6rpx;
	}
	.my-promotion .header {
		background-size: 100% 100%;
		background-color: var(--view-theme);
		width: 100%;
		height: 375rpx;
	}
	.my-promotion .header .name {
		font-size: 30rpx;
		color: #fff;
		padding-top: 57rpx;
		position: relative;
	}
	.icon-icon_question{
		font-size: 34rpx;
		color: rgba(255,255,255,.8);
		margin-left: 8rpx;
	}
	.my-promotion .header .name .record {
		font-size: 26rpx;
		color: #D16739;
		position: absolute;
		right: 0;
		padding: 10rpx;
		border-radius: 30rpx 0 0 30rpx;
		background-color: #FFF9E3;
		-webkit-box-align: center;
		-moz-box-align: center;
		-o-box-align: center;
		-ms-flex-align: center;
		-webkit-align-items: center;
		align-items: center;
		display: -webkit-box;
		display: -moz-box;
		display: -webkit-flex;
		display: -ms-flexbox;
		display: flex;
		-webkit-box-lines: multiple;
		-moz-box-lines: multiple;
		-o-box-lines: multiple;
		-webkit-flex-wrap: wrap;
		-ms-flex-wrap: wrap;
		flex-wrap: wrap;
	}
	.my-promotion .header .name .record .iconfont {
		font-size: 25rpx;
		margin-left: 10rpx;
		vertical-align: 2rpx;
	}
	.my-promotion .header .num {
		text-align: center;
		color: #fff;
		margin-top: 28rpx;
		font-size: 76rpx;
		font-weight: 600;
	}
	.my-promotion .header .profit {
		padding: 0 20rpx;
		margin-top: 35rpx;
		font-size: 24rpx;
		color: rgba(255, 255, 255, 0.8);
	}
	.my-promotion .header .profit .item {
		min-width: 200rpx;
		text-align: center;
	}
	.my-promotion .header .profit .icon-ic_rightarrow{
		font-size: 24rpx;
	}
	.my-promotion .header .profit .item .money {
		font-size: 34rpx;
		color: #fff;
		margin-top: 5rpx;
	}

	.my-promotion .bnt {
		font-size: 28rpx;
		color: #fff;
		width: 278rpx;
		/* #ifdef MP*/
		height: 78rpx;
		/* #endif */
		/* #ifndef MP*/
		height: 88rpx;
		/* #endif */
		border-radius: 50rpx;
		margin: -32rpx auto 0 auto;
		border: 10rpx solid #f5f5f5;
	}
	.my-promotion .list {
		padding: 0 20rpx 50rpx 20rpx;
		margin-top: 10rpx;
	}
	.my-promotion .list .item {
		width: 344rpx;
		height: 240rpx;
		border-radius: 16rpx;
		background-color: #fff;
		margin-top: 20rpx;
		font-size: 30rpx;
		color: #666;
	}
	.my-promotion .list .item .iconfont {
		font-size: 70rpx;
		background-image: linear-gradient(to right, var(--view-bntColor21) 0%, var(--view-bntColor22) 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		margin-bottom: 20rpx;
	}

</style>
