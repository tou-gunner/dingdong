<template>
	<!-- 小程序直播 -->
	<!-- #ifdef MP -->
		<view :style="liveWrapperStyle" class="relative">
			<view class="mb-config" :style="liveStyle">
				<template v-if="dataConfig.styleConfig.tabVal == 0">
					<view class="live-wrapper-a">
						<navigator class="live-item-a" v-for="(item, index) in liveList" :key="item.id" :style="liveWrapStyle"
							:url="'plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=' + item.room_id + '&custom_params=' + customParams"
							hover-class="none">
							<view class="img-box" :style="liveItemStyle">
								<view class="label-a acea-row row-middle" v-if="item.live_status == 101">
									<text class="iconfont icon-ic_video1"></text>
									<text>ຖ່າຍທອດສົດ</text>
								</view>
								<view class="label-b acea-row row-middle" v-else-if="item.live_status == 102">
									<view class="txt acea-row row-middle">ເປີດໂຕໃໝ່</view>
									<view class="msg">{{ item.show_time }}</view>
								</view>
								<view class="label-c acea-row row-middle" v-else-if="item.live_status == 103">
									<text>ເບິ່ງຄືນ</text>
								</view>
								<image mode="aspectFill" :src="item.cover_img" style="width: 100%; height: 400rpx;" />
							</view>
							<view class="info">
								<view class="title line2" v-if="titleShow">{{ item.name }}</view>
								<view class="people acea-row row-middle" v-if="anchorShow">
									<image class="image" :src="item.anchor_img" style="width: 40rpx; height: 40rpx; border-radius: 20rpx;" />
									<text>ນັກຖ່າຍທອດ: {{ item.anchor_name }}</text>
								</view>
							</view>
						</navigator>
					</view>
				</template>
				<template v-else-if="dataConfig.styleConfig.tabVal == 1">
					<view class="live-wrapper-b">
						<navigator class="live-item acea-row" v-for="(item, index) in liveList" :key="item.id" :style="liveWrapStyle"
							:url="'plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=' + item.room_id + '&custom_params=' + customParams"
							hover-class="none">
							<view class="img-box" :style="liveItemStyle">
								<view class="label-a" v-if="item.live_status == 101">
									<text class="iconfont icon-ic_video1"></text>
									<text>ຖ່າຍທອດສົດ</text>
								</view>
								<view class="label-b acea-row" v-else-if="item.live_status == 102">
									<view class="txt acea-row row-middle">ເປີດໂຕໃໝ່</view>
									<view class="msg">{{ item.show_time }}</view>
								</view>
								<view class="label-c" v-else-if="item.live_status == 103">
									<text>ເບິ່ງຄືນ</text>
								</view>
								<image :src="item.cover_img" mode="aspectFill" style="width: 332rpx; height: 236rpx; border-radius: 16rpx 0rpx 0rpx 16rpx;" />
							</view>
							<view class="info acea-row row-column">
								<view class="title line2" v-if="titleShow">{{ item.name }}</view>
								<view class="goods-wrapper acea-row">
									<view class="goods-item" v-for="goodsItem in item.goods">
										<image :src="goodsItem.cover_img" style="width: 96rpx; height: 96rpx; border-radius: 8rpx;" />
										<view class="money">¥{ goodsItem.price }</view>
										<view class="num acea-row row-center-wrapper">+5</view>
									</view>
								</view>
							</view>
						</navigator>
					</view>
				</template>
				<template v-else-if="dataConfig.styleConfig.tabVal == 2">
					<view class="live-wrapper-c">
						<scroll-view class="scroll-view" scroll-x="true">
							<navigator class="live-item" v-for="(item, index) in liveList" :key="item.id" :style="liveWrapStyle"
								:url="'plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=' + item.room_id + '&custom_params=' + customParams"
								hover-class="none">
								<view class="img-box" :style="liveItemStyle">
									<view class="label-a" v-if="item.live_status == 101">
										<text class="iconfont icon-ic_video1"></text>
										<text>ຖ່າຍທອດສົດ</text>
									</view>
									<view class="label-b acea-row" v-else-if="item.live_status == 102">
										<view class="txt">ເປີດໂຕໃໝ່</view>
										<view class="msg">{{ item.show_time }}</view>
									</view>
									<view class="label-c" v-else-if="item.live_status == 103">
										<text>ເບິ່ງຄືນ</text>
									</view>
									<image :src="item.cover_img" mode="aspectFill" style="width: 280rpx; height: 200rpx; border-radius: 16rpx;" />
								</view>
								<view class="info">
									<view class="title line1" v-if="titleShow">{{ item.name }}</view>
									<view class="people acea-row row-middle" v-if="anchorShow">
										<image class="image" :src="item.anchor_img" style="width: 40rpx; height: 40rpx; border-radius: 20rpx;" />
										<text>ນັກຖ່າຍທອດ: {{ item.anchor_name }}</text>
									</view>
								</view>
							</navigator>
						</scroll-view>
					</view>
				</template>
				<template v-else-if="dataConfig.styleConfig.tabVal == 3">
					<view class="live-wrapper-d">
						<template v-for="(item, index) in liveList">
							<navigator v-if="index" class="live-item-b" :key="item.id" :style="liveWrapStyle"
								:url="'plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=' + item.room_id + '&custom_params=' + customParams"
								hover-class="none">
								<view class="info">
									<view class="acea-row row-middle">
										<view class="label-a acea-row row-middle" v-if="item.live_status == 101">
											<text class="iconfont icon-ic_video1"></text>
											<text>ຖ່າຍທອດສົດ</text>
										</view>
										<view class="label-b acea-row row-middle" v-else-if="item.live_status == 102">
											<text>ເປີດໂຕໃໝ່</text>
										</view>
										<view class="label-c acea-row row-middle" v-else-if="item.live_status == 103">
											<text>ເບິ່ງຄືນ</text>
										</view>
										<view class="title line1" v-if="titleShow">{{ item.name }}</view>
									</view>
									<view class="people acea-row row-middle" v-if="anchorShow">
										<image class="image" :src="item.anchor_img" style="width: 40rpx; height: 40rpx; border-radius: 20rpx;" />
										<text>ນັກຖ່າຍທອດ: {{ item.anchor_name }}</text>
										<text class="time">{{ item.show_time }}</text>
									</view>
								</view>
							</navigator>
							<navigator v-else class="live-item-a" :style="liveItemStyle"
								:url="'plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=' + item.room_id + '&custom_params=' + customParams"
								hover-class="none">
								<view class="img-box">
									<view class="label-a" v-if="item.live_status == 101">
										<text class="iconfont icon-ic_video1"></text>
										<text>ຖ່າຍທອດສົດ</text>
									</view>
									<view class="label-b acea-row" v-else-if="item.live_status == 102">
										<view class="txt">ເປີດໂຕໃໝ່</view>
										<view class="msg">{{ item.show_time }}</view>
									</view>
									<view class="label-c acea-row row-middle" v-else-if="item.live_status == 103">
										<text>ເບິ່ງຄືນ</text>
									</view>
									<image mode="aspectFill" :src="item.cover_img" style="width: 100%; height: 670rpx;" />
								</view>
								<view class="info" v-if="titleShow || anchorShow">
									<view class="title line1" v-if="titleShow">{{ item.name }}</view>
									<view class="people acea-row row-middle" v-if="anchorShow">
										<image class="image" :src="item.anchor_img" style="width: 40rpx; height: 40rpx; border-radius: 20rpx;" />
										<text>ນັກຖ່າຍທອດ: {{ item.anchor_name }}</text>
									</view>
								</view>
							</navigator>
						</template>
					</view>
				</template>
			</view>
		</view>
	<!-- #endif -->
</template>

<script>
// #ifdef MP
import {
	mapGetters
} from "vuex";
import {
	getLiveData
} from '@/api/api.js';
import { diyUtil } from "@/utils/diy";
export default {
	computed: mapGetters(['uid']),
	name: 'liveBroadcast',
	props: {
		dataConfig: {
			type: Object,
			default: () => { }
		},
		index: {
			type: Number,
			default: 0
		}
	},
	data() {
		return {
			// endBg: this.dataConfig.endBg.color[0].item,
			// notBg: this.dataConfig.notBg.color[0].item,
			// playBg: this.dataConfig.playBg.color[0].item,
			listStyle: 0,
			mbConfig: 0,
			liveList: [],
			customParams: 0,
			bg: '',
			titleColor: '',
			prConfig: '',
			boxShadow: '',
			// limit: 0,
			itemStyle: 0
		};
	},
	computed: {
		liveWrapperStyle() {
			return {
				zIndex: diyUtil.calcZIndex(this.index),
				boxShadow: diyUtil.buildShadowStyle(this.dataConfig.shadowConfig),
				'padding': `${this.dataConfig.topConfig.val * 2}rpx ${this.dataConfig.prConfig.val * 2}rpx ${this.dataConfig.bottomConfig.val * 2}rpx`,
				'margin-top': diyUtil.buildMarginTopOffset(this.dataConfig.mbConfig, this.dataConfig.offsetYConfig),
				'background': this.dataConfig.bottomBgColor.color[0].item,
			};
		},
		liveStyle() {
			let borderRadius = `${this.dataConfig.fillet.val * 2}rpx`;
			if (this.dataConfig.fillet.type) {
				borderRadius =
					`${this.dataConfig.fillet.valList[0].val * 2}rpx ${this.dataConfig.fillet.valList[1].val * 2}rpx ${this.dataConfig.fillet.valList[3].val * 2}rpx ${this.dataConfig.fillet.valList[2].val * 2}rpx`;
			}
			return {
				"--live-shadow": diyUtil.buildShadowStyle(this.dataConfig.liveShadowConfig),
				'border-radius': borderRadius,
				'background': `linear-gradient(90deg, ${this.dataConfig.moduleColor.color[0].item} 0%, ${this.dataConfig.moduleColor.color[1].item} 100%)`,
			};
		},
		liveWrapStyle() {
			let marginTop = 0;
			let marginLeft = 0;
			let marginRight = 0;
			if (this.dataConfig.styleConfig.tabVal == 2) {
				marginLeft = `${this.dataConfig.liveConfig.val * 2}rpx`;
				marginRight = `${this.dataConfig.liveConfig.val * 2}rpx`;
			} else {
				marginTop = `${this.dataConfig.liveConfig.val * 2}rpx`;
			}
			return {
				'margin-top': marginTop,
				'margin-left': marginLeft,
				'margin-right': marginRight,
			};
		},
		liveItemStyle() {
			let borderRadius = `${this.dataConfig.filletImg.val * 2}rpx`;
			if (this.dataConfig.filletImg.type) {
				borderRadius =
					`${this.dataConfig.filletImg.valList[0].val * 2}rpx ${this.dataConfig.filletImg.valList[1].val * 2}rpx ${this.dataConfig.filletImg.valList[3].val * 2}rpx ${this.dataConfig.fillet.valList[2].val * 2}rpx`;
			}
			return {
				'border-radius': borderRadius,
			};
		},
		anchorShow() {
			return this.dataConfig.checkboxInfo.type.includes(1);
		},
		titleShow() {
			return this.dataConfig.checkboxInfo.type.includes(0);
		},
	},
	watch: {
		uid: {
			handler(newV, oldValue) {
				this.getCustomParams();
			},
			immediate: true,
			deep: true
		}
	},
	created() { },
	mounted() {
		this.getLiveList();
	},
	inject: ["parentDiyId", "parentMerId"],
	methods: {
		getCustomParams() {
			this.customParams = encodeURIComponent(JSON.stringify({
				pid: this.uid
			}));
		},
		getLiveList: function () {
			let that = this;
			getLiveData({
				diy_id: this.parentDiyId,
				unique: this.unique || "",
				mer_id: that.parentMerId || "",
				limit: 10
			}).then(res => {
				res.data.list.forEach(val => {
					val.link =
						(val.live_status == 103 && val.replay_status) || val.live_status === 101 || val.live_status === 102
							? 'plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=' + val.room_id
							: '';
				});
				that.$set(that, 'liveList', res.data.list)
			})
				.catch(e => { });
		}
	}
};
// #endif
</script>

<style lang="scss">
.pageOn {
	border-radius: 16rpx;
}

.label-img {
	width: 20rpx !important;
	height: 20rpx !important;
}

.bgred-img {
	width: 21rpx !important;
	height: 22rpx !important;
}

.live-wrapper-a {
	padding: 20rpx;

	.live-item-a {
		&:first-child {
			margin-top: 0 !important;
		}

		.img-box {
			position: relative;
			height: 400rpx;
			overflow: hidden;
		}

		.info {
			padding: 24rpx 0 0;

			.title {
				font-size: 28rpx;
				line-height: 40rpx;
				color: #333333;
			}

			.people {
				margin-top: 12rpx;
				font-size: 24rpx;
				color: #999999;

				.image {
					margin-right: 12rpx;
				}
			}
		}

		.label-a {
			position: absolute;
			top: 24rpx;
			left: 0;
			z-index: 2;
			height: 40rpx;
			padding: 0 16rpx;
			border-radius: 0 20rpx 20rpx 0;
			background: linear-gradient(90deg, #FF2851 0%, #FF2851 100%);
			font-size: 22rpx;
			line-height: 40rpx;
			color: #FFFFFF;
		}

		.label-b {
			position: absolute;
			top: 24rpx;
			left: 0;
			z-index: 2;
			height: 40rpx;
			padding: 0 16rpx 0 0;
			border-radius: 0 20rpx 20rpx 0;
			background: rgba(0, 0, 0, 0.2);
			font-size: 22rpx;
			color: #FFFFFF;

			.txt {
				height: 40rpx;
				padding: 0 16rpx;
				border-radius: 0 20rpx 20rpx 0;
				margin-right: 12rpx;
				background: linear-gradient(90deg, #208FF2 0%, #3FA6FF 98%);
			}
		}

		.label-c {
			position: absolute;
			top: 24rpx;
			left: 0;
			z-index: 2;
			height: 40rpx;
			padding: 0 16rpx;
			border-radius: 0 20rpx 20rpx 0;
			background: linear-gradient(90deg, #6D80AC 0%, #889EBD 100%);
			font-size: 22rpx;
			color: #FFFFFF;
		}
	}
}

.live-wrapper-b {
	padding: 20rpx;

	.live-item {
		&:first-child {
			margin-top: 0 !important;
		}

		.img-box {
			position: relative;
			width: 332rpx;
			height: 236rpx;
			background: #F3F9FF;
			overflow: hidden;
		}

		.info {
			flex: 1;
			padding: 20rpx 0 24rpx 24rpx;

			.title {
				flex: 1;
				font-size: 28rpx;
				line-height: 40rpx;
				color: #333333;
			}
		}
	}

	.label-a {
		position: absolute;
		top: 12rpx;
		left: 12rpx;
		z-index: 2;
		height: 36rpx;
		padding: 0 12rpx;
		border-radius: 18rpx;
		background: linear-gradient(90deg, #FF2851 0%, #FF2851 100%);
		font-size: 22rpx;
		line-height: 36rpx;
		color: #FFFFFF;
	}

	.label-b {
		position: absolute;
		top: 12rpx;
		left: 12rpx;
		z-index: 2;
		height: 36rpx;
		padding: 0 12rpx 0 0;
		border-radius: 18rpx;
		background: rgba(0, 0, 0, 0.2);
		font-size: 22rpx;
		line-height: 36rpx;
		color: #FFFFFF;

		.txt {
			height: 36rpx;
			padding: 0 12rpx;
			border-radius: 18rpx;
			margin-right: 12rpx;
			background: linear-gradient(90deg, #208FF2 0%, #3FA6FF 98%);
		}
	}

	.label-c {
		position: absolute;
		top: 12rpx;
		left: 12rpx;
		z-index: 2;
		height: 36rpx;
		padding: 0 12rpx;
		border-radius: 18rpx;
		background: linear-gradient(90deg, #6D80AC 0%, #889EBD 100%);
		font-size: 22rpx;
		line-height: 36rpx;
		color: #FFFFFF;
	}

	.goods-wrapper {
		margin-top: 16rpx;

		.goods-item {
			position: relative;
			width: 96rpx;
			height: 96rpx;
		}

		.money {
			position: absolute;
			right: 0;
			bottom: 0;
			left: 0;
			height: 26rpx;
			background: rgba(0, 0, 0, 0.3);
			text-align: center;
			font-size: 22rpx;
			line-height: 26rpx;
			color: #FFFFFF;
		}

		.num {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background: rgba(0, 0, 0, 0.35);
			font-size: 28rpx;
			color: #FEFEFE;
		}
	}
}

.live-wrapper-c {
	padding: 20rpx 0;

	.scroll-view {
		white-space: nowrap;
	}

	.live-item {
		display: inline-block;
		width: 280rpx;

		+.live-item {
			margin-left: 0 !important;
		}

		.img-box {
			position: relative;
			width: 280rpx;
			height: 200rpx;
			background: #F3F9FF;
			overflow: hidden;
		}

		.info {
			padding-top: 16rpx;

			.title {
				font-size: 28rpx;
				line-height: 40rpx;
				color: #333333;
			}

			.people {
				margin-top: 12rpx;
				font-size: 24rpx;
				color: #999999;

				.image {
					margin-right: 12rpx;
				}
			}
		}
	}

	.label-a {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 2;
		height: 36rpx;
		padding: 0 12rpx;
		border-radius: 16rpx 0rpx 20rpx 0rpx;
		background: linear-gradient(90deg, #FF2851 0%, #FF2851 100%);
		font-size: 22rpx;
		line-height: 36rpx;
		color: #FFFFFF;

		.iconfont {
			margin-right: 8rpx;
			font-size: 24rpx
		}
	}

	.label-b {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 2;
		height: 36rpx;
		padding: 0 12rpx 0 0;
		border-radius: 16rpx 0rpx 20rpx 0rpx;
		background: rgba(0, 0, 0, 0.2);
		font-size: 22rpx;
		line-height: 36rpx;
		color: #FFFFFF;

		.txt {
			height: 36rpx;
			padding: 0 12rpx;
			border-radius: 16rpx 0rpx 20rpx 0rpx;
			margin-right: 12rpx;
			background: linear-gradient(90deg, #208FF2 0%, #3FA6FF 98%);
		}
	}

	.label-c {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 2;
		height: 36rpx;
		padding: 0 12rpx;
		border-radius: 16rpx 0rpx 20rpx 0rpx;
		background: linear-gradient(90deg, #6D80AC 0%, #889EBD 100%);
		font-size: 22rpx;
		line-height: 36rpx;
		color: #FFFFFF;
	}
}

.live-wrapper-d {
	padding: 20rpx;

	.live-item-a {
		position: relative;
		overflow: hidden;

		.img-box {
			width: 100%;
			height: 670rpx;
			background: #F3F9FF;
			overflow: hidden;
		}

		.info {
			position: absolute;
			right: 0;
			bottom: 0;
			left: 0;
			padding: 24rpx;
			background: rgba(0, 0, 0, 0.2);

			.title {
				font-size: 28rpx;
				line-height: 40rpx;
				color: #FFFFFF;
			}

			.people {
				margin-top: 12rpx;
				font-size: 24rpx;
				color: #FFFFFF;

				.image {
					margin-right: 12rpx;
				}
			}
		}

		.label-a {
			position: absolute;
			top: 24rpx;
			left: 0;
			z-index: 2;
			height: 40rpx;
			padding: 0 16rpx;
			border-radius: 0 20rpx 20rpx 0;
			background: linear-gradient(90deg, #FF2851 0%, #FF2851 100%);
			font-size: 22rpx;
			color: #FFFFFF;
		}

		.label-b {
			position: absolute;
			top: 24rpx;
			left: 0;
			z-index: 2;
			height: 40rpx;
			padding: 0 16rpx 0 0;
			border-radius: 0 20rpx 20rpx 0;
			background: rgba(0, 0, 0, 0.2);
			font-size: 22rpx;
			color: #FFFFFF;

			.txt {
				height: 40rpx;
				padding: 0 16rpx;
				border-radius: 0 20rpx 20rpx 0;
				margin-right: 12rpx;
				background: linear-gradient(90deg, #208FF2 0%, #3FA6FF 98%);
			}
		}

		.label-c {
			position: absolute;
			top: 24rpx;
			left: 0;
			z-index: 2;
			height: 40rpx;
			padding: 0 16rpx;
			border-radius: 0 20rpx 20rpx 0;
			background: linear-gradient(90deg, #6D80AC 0%, #889EBD 100%);
			font-size: 22rpx;
			color: #FFFFFF;
		}
	}

	.live-item-b {
		padding: 24rpx 24rpx 20rpx;
		border: 1rpx solid #EEEEEE;
		border-radius: 16rpx;
		margin-top: 20rpx;

		.title {
			flex: 1;
			font-size: 28rpx;
			line-height: 40rpx;
			color: #333333;
		}

		.people {
			margin-top: 16rpx;
			font-size: 24rpx;
			color: #999999;

			.time {
				padding-left: 12rpx;
				margin-left: 12rpx;
				border-left: 1rpx solid #EEEEEE;
				line-height: 22rpx;
			}
		}

		.label-a {
			height: 32rpx;
			padding: 0 12rpx;
			border-radius: 8rpx;
			margin-right: 16rpx;
			background: linear-gradient(90deg, #FF2851 0%, #FF2851 100%);
			font-size: 20rpx;
			color: #FFFFFF;
		}

		.label-b {
			height: 32rpx;
			padding: 0 12rpx;
			border-radius: 8rpx;
			margin-right: 16rpx;
			background: linear-gradient(90deg, #208FF2 0%, #3FA6FF 98%);
			font-size: 20rpx;
			color: #FFFFFF;
		}

		.label-c {
			height: 32rpx;
			padding: 0 12rpx;
			border-radius: 8rpx;
			margin-right: 16rpx;
			background: linear-gradient(90deg, #6D80AC 0%, #889EBD 100%);
			font-size: 20rpx;
			color: #FFFFFF;
		}
	}
}

.bgblue {
	width: 220rpx;
	height: 38rpx;
	background: rgba(0, 0, 0, 0.36);
	overflow: hidden;

	.txt {
		position: relative;
		left: -5rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 38px;
		height: 100%;
		text-align: center;
		background: linear-gradient(270deg, #2FA1F5 0%, #0076FF 100%);
	}
}

.title-box {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20rpx;
	font-size: 32rpx;

	.more {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 26rpx;
		color: #999;

		.iconfont {
			font-size: 26rpx;
			margin-top: 8rpx;
		}
	}
}

.live-item,
.live-item-a,
.live-item-b {
	box-shadow: var(--live-shadow);
}
</style>