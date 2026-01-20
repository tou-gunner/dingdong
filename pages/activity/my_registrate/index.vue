<template>
	<view>
		<view  class="application-record" v-if="listData.length">
			<block v-for="item in listData" :key="item.activity_id">
				<navigator v-if="item.activity" :url="`/pages/activity/registrate_activity/index?id=${item.activity_id}`" hover-class='none' class="card-list bg-f boder-24">
					<view class="card-top">
						<view class="card-wrapper">
							<view class="card-status" :class="'status'+item.activity.time_status">{{item.activity.time_status==0?'ຍັງບໍ່ເລີ່ມ' : item.activity.time_status==1?'ກຳລັງດຳເນີນ' : 'ສິ້ນສຸດແລ້ວ'}}</view>
							<view class="btn">ລາຍລະອຽດ<text class='iconfont icon-ic_rightarrow'></text></view>
						</view>
					</view>
					<view class="card-bottom">
						<view class="title">{{item.activity.activity_name}}</view>
						<view class="time">ເວລາສົ່ງ：{{item.create_time}}</view>
					</view>
				</navigator>
			</block>
		</view>
		<view class='no-shop' v-if="!listData.length && !loading">
			<view class='pictrue' style="margin: 0 auto;">
				<image :src="`${domain}/static/images/noActivity.png`"></image>
				<text>ບໍ່ມີກິດຈະກຳ, ໄປລົງທະບຽນເຂົ້າຮ່ວມກິດຈະກຳເລີຍ!</text>
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
	import { getRechargeRecordList } from '@/api/user.js'
	import {HTTP_REQUEST_URL} from '@/config/app';
	export default {
		data() {
			return {
				domain:HTTP_REQUEST_URL,
				loading: false,
				listData: [],
				count: 0,
				pageData: {
					page: 1,
					limit: 10,
				}
			}
		},
		onLoad() {
			this.getListData()
		},
		methods: {
			getListData() {
				this.loading = true
				uni.showLoading({
					title: 'ກຳລັງໂຫຼດຂໍ້ມູນ',
				});
				getRechargeRecordList(this.pageData).then(res => {
					this.count = res.data.count
					this.listData = this.listData.concat(res.data.list)
					uni.hideLoading();
					this.loading = false
				})
			},
		},
		// 滚动到底部
		onReachBottom() {
			if (this.count == this.listData.length) {
				uni.showToast({
					title: 'ບໍ່ມີຂໍ້ມູນເພີ່ມ',
					icon: 'none',
					duration: 1000
				});
			} else {
				this.pageData.page += 1
				this.getListData()
			}
		},
	}
</script>

<style lang="scss" scoped>
	.application-record {
		width: 710rpx;
		margin: 20rpx auto;
		.card-list {
			padding: 30rpx;
			margin-bottom: 20rpx;
			.card-top{
				.card-wrapper{
					display: flex;
					align-items: center;
					justify-content: space-between;
					border-bottom: 1px solid #EEEEEE;
					padding-bottom: 30rpx;
					.card-status{
						font-size: 28rpx;
						&.status1{
							color: #61CE74;
						}
						&.status-1{
							color: #FF922C;
						}
					}
					.btn{
						color:#666666;
						font-size: 24rpx;
						.iconfont{
							color: #999999;
							font-size: 26rpx;
							margin-left: 5rpx;
						}
					}
				}
			}
			.card-bottom {
				margin-top: 30rpx;
				.title {
					font-size: 28rpx;
					font-weight: bold;
				}
				.time {
					color: #999999;
					font-size: 24rpx;
					margin-top: 24rpx;
				}
			}
		}
	}
	.no-shop {
		width: 100%;
		background-color: #fff;
		height: 100vh;
		.pictrue {
			display: flex;
			flex-direction: column;
			align-items: center;
			color: $uni-nothing-text;
			image {
				width: 414rpx;
				height: 380rpx;
			}
		}
	}
</style>
