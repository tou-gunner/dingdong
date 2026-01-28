<template>
	<view>
		<view class="application-record" v-if="listData.length">
			<view class="card-list bg-f boder-24" v-for="item in listData" :key="item.mer_intention_id">
				<view class="card-top">
					<view class="title">{{item.mer_name}}</view>
					<view class="time">ເວລາສົ່ງ：{{item.create_time}}</view>
					<view v-if="item.fail_msg" class="reason">ເຫດຜົນ：{{item.fail_msg}}</view>
				</view>
				<view class="line"></view>
				<view class="card-bottom">
					<view class="card-status">
						<text class="status-icon iconfont icon-icon_review" v-if="item.status === 0"></text>
						<text class="status-icon iconfont icon-a-ic_CompleteSelect" v-else-if="item.status === 1"></text>
						<text class="status-icon iconfont icon-ic_close2" v-else-if="item.status === 2"></text>
						<text class="status-text">{{statusText(item.status)}}</text>
					</view>
					<view class="status-btn" @click="jump(item)">{{statusBtn(item.status)}}</view>
				</view>
			</view>
		</view>
		<view class='no-shop' v-if="!listData.length && !loading">
			<view class='pictrue' style="margin: 0 auto;">
				<image :src="`${domain}/static/images/noRecord.png`"></image>
				<text>ບໍ່ມີປະຫວັດການສະໝັກ, ຮີບໄປສະໝັກເລີຍ!</text>
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
		getApplicationRecordList
	} from '@/api/store.js'
	import {HTTP_REQUEST_URL} from '@/config/app';
	export default {
		data() {
			return {
				domain:HTTP_REQUEST_URL,
				loading: false,
				listData: [],
				pageData: {
					page: 1,
					limit: 10,
				}
			}
		},
		onLoad() {
			this.getListData()
		},
		// 滚动到底部
		onReachBottom() {
			if (this.count == this.listData.length) {
				uni.showToast({
					title: 'ບໍ່ມີຂໍ້ມູນເພີ່ມເຕີມ',
					icon: 'none',
					duration: 1000
				});
			} else {
				this.pageData.page += 1
				this.getListData()
			}
		},
		methods: {
			getListData() {
				this.loading = true
				uni.showLoading({
					title: 'ກຳລັງໂຫຼດຂໍ້ມູນ',
				});
				getApplicationRecordList(this.pageData).then(res => {
					this.count = res.data.count
					this.listData = this.listData.concat(res.data.list)
					uni.hideLoading();
					this.loading = false
				})
			},
			// 跳转逻辑
			jump(item) {
				console.log(item)
				if ([0, 2].includes(item.status)) {
					uni.navigateTo({
						url: `/pages/store/settled/index?mer_i_id=${item.mer_intention_id}`
					})
				} else if (item.status === 1) {
					uni.navigateTo({
						url: `/pages/store/merchantDetails/index?mer_i_id=${item.mer_intention_id}&mer_id=${item.mer_id}`
					})
				}
			},
			//状态判断
			statusText(number) {
				// 使用对象
				let statusData = {
					0: "ລໍຖ້າການກວດສອບ",
					1: "ກວດສອບຜ່ານ",
					2: "ກວດສອບບໍ່ຜ່ານ",
				};
				return statusData[number]
			},
			// button显示文字
			statusBtn(number) {
				// ໃຊ້ອັອບເຈັກ
				let statusData = {
					0: "ແກ້ໄຂ",
					1: "ເບິ່ງ",
					2: "ສົ່ງໃໝ່",
				};
				return statusData[number]
			},
		}
	}
</script>

<style lang="scss" scoped>
	.application-record {
		display: flex;
		flex-direction: column;
		align-items: center;
		background-color: #F5F5F5;
		padding: 20rpx 30rpx;
		.card-list {
			width: 100%;
			padding: 20rpx 24rpx;
			margin-bottom: 20rpx;
			.card-top {
				height: 140rpx;
				.title {
					font-size: 28rpx;
					font-weight: bold;
				}
				.time {
					color: #999999;
					font-size: 24rpx;
					padding: 5rpx 0;
				}
				.reason {
					color: #E93323;
					font-weight: bold;
					font-size: 24rpx;
				}
			}
			.line {
				height: 2rpx;
				margin: 20rpx 0 20rpx 0;
				background-color: #EEEEEE;
			}
			.card-bottom {
				display: flex;
				justify-content: space-between;
				align-items: center;
				.card-status {
					display: flex;
					align-items: center;
					.status-icon {
						font-size: 36rpx;
						margin: 10rpx;
					}
					.icon-ic_close2{
						color: #E93323;
					}
					.icon-icon_review{
						color: #3382F7;
					}
					.icon-a-ic_CompleteSelect{
						color: #61CE74;
					}
					.status-text {
						font-size: 28rpx;
						font-weight: 500;
					}
				}
				.status-btn {
					font-size: 24rpx;
					color: #999999;
					border: 1px solid #dddddd;
					padding: 10rpx 21rpx;
					border-radius: 50rpx;
				}
			}
		}
	}
	.no-shop {
		width: 100%;
		background-color: #fff;
		height: 100vh;
		padding-top: 120rpx;
		.pictrue {
			display: flex;
			flex-direction: column;
			align-items: center;
			color: $uni-nothing-text;
			image {
				width: 414rpx;
				height: 305rpx;
			}
		}
	}
</style>
