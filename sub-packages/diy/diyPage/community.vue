<template>
	<view :style="[shortVideoWrapStyle]" v-if="videoList.length" class="relative">
		<view class="shortVideo" :style="[shortVideoStyle]">
			<view class="nav acea-row row-between-wrapper" :style="[navStyle]">
				<view v-if="dataConfig.titleConfig.tabVal" class="title" :style="[titleStyle]">{{
					dataConfig.titleTxtConfig.value }}</view>
				<image v-else :src="dataConfig.imgConfig.url" style="width: 134rpx; height: 34rpx;" />
				<navigator class="more" :style="[buttonStyle]" hover-class="none" url="/pages/plant_grass/index">
					{{ dataConfig.rightBntConfig.value }}
					<text class="iconfont icon-ic_rightarrow" :style="[buttonStyle]"></text>
				</navigator>
				<image class="clover" src="/static/img/clover.png" mode=""></image>
			</view>
			<view v-if="dataConfig.styleConfig.tabVal == 0" class="list" :style="[listStyle]">
				<scroll-view scroll-x="true" scroll-y class="scroll white-nowrap pl-20" show-scrollbar="false">
					<view style="padding: 24rpx 0;">
						<view class="item inline-block" v-for="item in videoList" :key="item.community_id" @click="goDetail(item)"
							:style="[itemStyle]">
							<view class="relative">
								<image :src="item.image[0]"
									:style="{ borderRadius: imageRadius, width: '296rpx', height: '369rpx', display: 'block' }" mode="aspectFill" />
								<view class="abs-lb w-full text--w111-fff z-80">
									<view class="fs-24 pl-16 lh-38rpx w-full line1" v-if="isTitleVisible && item.title">{{ item.title }}
									</view>
									<view class="pl-16 pb-14 flex-y-center">
										<image class="w-36 h-36 rd-50-p111-" v-if="isAvatarVisible" :src="item.author.avatar"></image>
										<text class="pl-8 fs-20 line1 flex-1" v-if="isNicknameVisible">{{ item.author.nickname }}</text>
									</view>
								</view>
								<view class="video_img acea-row row-middle row-center" v-if="item.is_type == 2">
									<text class="iconfont icon-ic_right2"></text>
								</view>
								<view class="copty-mask" :style="{ 'border-radius': imageRadius }"></view>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
			<view v-else class="p-20" :style="[listStyle]">
				<view :class="'wf-page wf-page' + type">
					<!--    left    -->
					<view>
						<view id="left" v-if="leftList.length">
							<view v-for="(item, index) in leftList" :key="index" class="wf-item" :style="[wfItemStyle]"
								@click="goDetail(item)">
								<view class="wf-item-page wf-page0">
									<view class='pictrue overflow-picture relative'>
										<image :src="item.image[0]" :style="[imgStyle]" mode="aspectFill" />
										<view class="player flex-center" v-if="item.is_type == 2">
											<text class="iconfont icon-ic_right2 fs-20"></text>
										</view>
										<view class="w-60 h-36 rd-4rpx flex-center fs-22 text--w111-fff pic-number"
											v-if="item.is_type == 1">{{ item.image.length }} ຮູບ</view>
										<view class="abs-lt w-full h-full flex-col flex-center text--w111-fff shenhe"
											v-if="[0, -1].includes(item.is_verify)">
											<text class="fs-28" v-show="item.is_verify == 0">ກຳລັງກວດສອບ</text>
											<text class="fs-24 pt-22" v-show="item.is_verify == 0">ຈະສະແດງໃນລາຍຊື່ຫຼັງຜ່ານ</text>
											<text class="fs-28" v-show="item.is_verify == -1">ກວດສອບບໍ່ຜ່ານ</text>
											<text class="fs-24 pt-22" v-show="item.is_verify == -1">ເບິ່ງເຫດຜົນທີ່ບໍ່ຜ່ານ</text>
										</view>
									</view>
									<view class="info_box box-border">
										<view class="w-full lh-40rpx fs-28 line2" v-if="isTitleVisible && item.title">{{ item.title }}
										</view>
										<view class="pt-22 fs-22 text--w111-999 flex-between-center">
											<view class="flex-y-center" @tap.stop="toUser">
												<image class="w-34 h-34 rd-50-p111-" v-if="isAvatarVisible" :src="item.author.avatar"></image>
												<text class="pl-8" v-if="isNicknameVisible">{{ item.author.nickname }}</text>
											</view>
											<view class="flex-y-center" :class="{ 'text-red': item.relevance_id }"
												@tap.stop="likeToggle(item)">
												<text class="iconfont fs-22"
													:class="item.relevance_id ? 'icon-icon_Like_2' : 'icon-ic_Like'"></text>
												<text class="pl-10">{{ item.count_start }}</text>
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
					<!--    right    -->
					<view>
						<view id="right" v-if="rightList.length">
							<view v-for="(item, index) in rightList" :key="index" class="wf-item" :style="[wfItemStyle]"
								@click="goDetail(item)">
								<view class="wf-item-page wf-page0">
									<view class='pictrue overflow-picture relative'>
										<image :src="item.image[0]" :style="[imgStyle]" mode="aspectFill" />
										<view class="player flex-center" v-if="item.is_type == 2">
											<text class="iconfont icon-ic_right2 fs-20"></text>
										</view>
										<view class="w-60 h-36 rd-4rpx flex-center fs-22 text--w111-fff pic-number"
											v-if="item.is_type == 1">{{ item.image.length }} ຮູບ</view>
										<view class="abs-lt w-full h-full flex-col flex-center text--w111-fff shenhe"
											v-if="[0, -1].includes(item.is_verify)">
											<text class="fs-28" v-show="item.is_verify == 0">ກຳລັງກວດສອບ</text>
											<text class="fs-24 pt-22" v-show="item.is_verify == 0">ຈະສະແດງໃນລາຍຊື່ຫຼັງຜ່ານ</text>
											<text class="fs-28" v-show="item.is_verify == -1">ກວດສອບບໍ່ຜ່ານ</text>
											<text class="fs-24 pt-22" v-show="item.is_verify == -1">ເບິ່ງເຫດຜົນທີ່ບໍ່ຜ່ານ</text>
										</view>
									</view>
									<view class="info_box box-border">
										<view class="w-full lh-40rpx fs-28 line2" v-if="isTitleVisible && item.title">{{ item.title }}
										</view>
										<view class="pt-22 fs-22 text--w111-999 flex-between-center">
											<view class="flex-y-center" @tap.stop="toUser">
												<image class="w-34 h-34 rd-50-p111-" v-if="isAvatarVisible" :src="item.author.avatar"></image>
												<text class="pl-8" v-if="isNicknameVisible">{{ item.author.nickname }}</text>
											</view>
											<view class="flex-y-center" :class="{ 'text-red': item.relevance_id }"
												@tap.stop="likeToggle(item)">
												<text class="iconfont fs-22"
													:class="item.relevance_id ? 'icon-icon_Like_2' : 'icon-ic_Like'"></text>
												<text class="pl-10">{{ item.count_start }}</text>
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { graphicLstData } from '@/api/api.js';
import { HTTP_REQUEST_URL } from '@/config/app';
import { LOGIN_STATUS } from '@/config/cache';
import { configMap } from '@/utils';
import { graphicStartApi } from '@/api/community.js';
import { diyUtil } from '@/utils/diy';
export default {
	name: 'community',
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
			videoList: [],
			bgColor: '',
			infoColor: '',
			mbCongfig: 0,
			prConfig: 0, //背景边距
			numConfig: 0,
			allList: [],       // 全部列表
			leftList: [],      // 左边列表
			rightList: [],     // 右边列表
			mark: 0,           // 列表标记
			boxHeight: [],     // 下标0和1分别为左列和右列高度
			type: 0,
			updateNum: 10,
		}
	},
	computed: {
		...configMap(['community_status']),
		isTitleVisible() {
			return this.dataConfig.displayConfig.type.includes(0);
		},
		isAvatarVisible() {
			return this.dataConfig.displayConfig.type.includes(1);
		},
		isNicknameVisible() {
			return this.dataConfig.displayConfig.type.includes(2);
		},
		navStyle() {
			return {
				'border-radius': `${this.dataConfig.fillet.valList[0].val * 2}rpx ${this.dataConfig.fillet.valList[1].val * 2}rpx ${this.dataConfig.fillet.valList[3].val * 2}rpx ${this.dataConfig.fillet.valList[2].val * 2}rpx`,
				'background': `linear-gradient(90deg, ${this.dataConfig.headerBgColor.color[0].item} 0%, ${this.dataConfig.headerBgColor.color[1].item} 100%)`,
			};
		},
		titleStyle() {
			let fontStyle = 'normal';
			let fontWeight = 'normal';
			switch (this.dataConfig.titleText.tabVal) {
				case 0:
					fontWeight = 'bold'
					break;
				case 2:
					fontStyle = 'italic'
					fontWeight = 'bold'
					break;
			}
			return {
				'font-style': this.dataConfig.titleText.tabVal == 2 ? 'italic' : '',
				'font-size': `${this.dataConfig.titleNumber.val * 2}rpx`,
				'font-weight': this.dataConfig.titleText.tabVal == 0 ? 'bold' : '',
				color: this.dataConfig.titleColor.color[0].item
			};
		},
		buttonStyle() {
			return {
				'font-size': `${this.dataConfig.bntNumber.val * 2}rpx`,
				'color': this.dataConfig.headerBntColor.color[0].item,
			};
		},
		itemStyle() {
			let marginTop = 0;
			let marginLeft = 0;
			let marginRight = 0;
			if (this.dataConfig.styleConfig.tabVal == 0) {
				// marginLeft = `${this.dataConfig.videoSpace2.val * 2}rpx`;
				marginRight = `${this.dataConfig.videoSpace2.val * 2}rpx`;
			} else {
				marginTop = `${this.dataConfig.videoSpace.val * 2}rpx`;
			}
			return {
				boxShadow: diyUtil.buildShadowStyle(this.dataConfig.contentShadowConfig),
				borderRadius: this.imageRadius,
				'margin-top': marginTop,
				'margin-right': marginRight,
			};
		},
		itemLastStyle() {
			let marginRight = 0;
			if (this.dataConfig.styleConfig.tabVal) {
				marginRight = `${this.dataConfig.videoSpace2.val * 2}rpx`;
			}
			return {
				'margin-right': marginRight,
			};
		},
		imageRadius() {
			let borderRadius = [`${this.dataConfig.filletImg.val * 2}rpx`];
			if (this.dataConfig.filletImg.type) {
				borderRadius = [];
				for (let i = 0; i < this.dataConfig.filletImg.valList.length; i++) {
					borderRadius.push(`${this.dataConfig.filletImg.valList[i].val * 2}rpx`);
				}
			}
			return borderRadius.join(' ');
		},
		shortVideoWrapStyle() {
			return {
				zIndex: diyUtil.calcZIndex(this.index),
				boxShadow: diyUtil.buildShadowStyle(this.dataConfig.shadowConfig),
				padding: `${this.dataConfig.topConfig.val * 2}rpx ${this.dataConfig.prConfig.val * 2}rpx ${this.dataConfig.bottomConfig.val * 2}rpx`,
				marginTop: diyUtil.buildMarginTopOffset(this.dataConfig.mbConfig, this.dataConfig.offsetYConfig),
				background: this.dataConfig.bottomBgColor.color[0].item,
			}
		},
		shortVideoStyle() {
			let borderRadius = `${this.dataConfig.fillet.val * 2}rpx`;
			if (this.dataConfig.fillet.type) {
				borderRadius =
					`${this.dataConfig.fillet.valList[0].val * 2}rpx ${this.dataConfig.fillet.valList[1].val * 2}rpx ${this.dataConfig.fillet.valList[3].val * 2}rpx ${this.dataConfig.fillet.valList[2].val * 2}rpx`;
			}
			return {
				borderRadius,
			}
		},
		listStyle() {
			return {
				'background': `linear-gradient(90deg, ${this.dataConfig.moduleColor.color[0].item} 0%, ${this.dataConfig.moduleColor.color[1].item} 100%)`,
			};
		},
		imgStyle() {
			return {
				width: "100%",
				borderRadius: diyUtil.buildBorderRadius(this.dataConfig.filletImg),
			}
		},
		wfItemStyle() {
			let windowWidth = uni.getWindowInfo().windowWidth;
			return {
				"--item-gap": this.dataConfig.videoSpace.val + "px",
				boxShadow: diyUtil.buildShadowStyle(this.dataConfig.contentShadowConfig),
				width: (windowWidth - 30 - (this.dataConfig.prConfig.val * 2)) / 2 + 'px'
			}
		},
	},
	watch: {
		// 监听列表数据变化
		videoList: {
			handler(nVal, oVal) {
				// 如果数据为空或新的列表数据少于旧的列表数据（通常为下拉刷新或切换排序或使用筛选器），初始化变量

				if (!this.videoList.length ||
					(this.videoList.length === this.updateNum && this.videoList.length <= this.allList.length)) {
					this.allList = [];
					this.leftList = [];
					this.rightList = [];
					this.boxHeight = [];
					this.mark = 0;
				}

				// 如果列表有值，调用waterfall方法

				if (this.videoList.length) {
					this.allList = this.videoList;
					this.leftList = [];
					this.rightList = [];
					this.boxHeight = [];
					this.allList.forEach((v, i) => {
						if (this.allList.length < 3 || (this.allList.length <= 7 && this.allList.length - i > 1) || (this.allList.length > 7 && this.allList.length - i > 2)) {
							if (i % 2) {
								this.rightList.push(v);
							} else {
								this.leftList.push(v);
							}
						}
					});
					if (this.allList.length < 3) {
						this.mark = this.allList.length + 1;
					} else if (this.allList.length <= 7) {
						this.mark = this.allList.length - 1;
					} else {
						this.mark = this.allList.length - 2;
					}
					if (this.mark < this.allList.length) {
						this.waterFall()
					}
				}
			},
			immediate: true,
			deep: true
		},

		// 监听标记，当标记发生变化，则执行下一个item排序
		mark() {
			const len = this.allList.length;
			if (this.mark < len && this.mark !== 0 && this.boxHeight.length) {
				this.waterFall();
			}
		}
	},
	mounted() {
		if (this.community_status == 1) {
			this.getVideoList();
		}
	},
	inject: ["parentDiyId"],
	methods: {
		goDetail(item) {
			if (item.is_type == 1) {
				uni.navigateTo({
					url: '/pages/plantGrass/plant_detail/index?id=' + item.community_id
				});
			} else {
				uni.navigateTo({
					//#ifdef APP
					url: '/pages/short_video/appSwiper/index?id=' + item.community_id
					//#endif
					//#ifndef APP
					url: '/pages/short_video/nvueSwiper/index?id=' + item.community_id
					//#endif
				});
			}
		},
		likeToggle(item) {
			let status = item.relevance_id ? 0 : 1
			graphicStartApi(item.community_id, { status: status }).then(res => {
				if (item.relevance_id) {
					item.count_start--;
					item.count_start = item.count_start == 0 ? 0 : item.count_start
					item.relevance_id = false
				} else {
					item.count_start++;
					item.relevance_id = true
				}
			});
		},
		// 瀑布流排序
		waterFall() {
			const i = this.mark;
			if (i == 0) {
				// 初始化，从左边开始插入
				this.leftList.push(this.allList[i]);
				// 更新左边列表高度
				this.getViewHeight(0);
			} else if (i == 1) {
				// 第二个item插入，默认为右边插入
				this.rightList.push(this.allList[i]);
				// 更新右边列表高度
				this.getViewHeight(1);
			} else {
				// 根据左右列表高度判断下一个item应该插入哪边
				if (!this.boxHeight.length) {
					this.rightList.length < this.leftList.length
						? this.rightList.push(this.allList[i])
						: this.leftList.push(this.allList[i]);
				} else {
					const leftOrRight = this.boxHeight[0] > this.boxHeight[1] ? 1 : 0;
					if (leftOrRight) {
						this.rightList.push(this.allList[i])
					} else {
						this.leftList.push(this.allList[i])
					}
				}
				// 更新插入列表高度
				this.getViewHeight();
			}
		},
		// 获取列表高度
		getViewHeight() {
			// 使用nextTick，确保页面更新结束后，再请求高度
			this.$nextTick(() => {
				setTimeout(() => {
					uni.createSelectorQuery().in(this).select('#right').boundingClientRect(res => {
						res ? this.boxHeight[1] = res.height : '';
						uni.createSelectorQuery().in(this).select('#left').boundingClientRect(res => {
							res ? this.boxHeight[0] = res.height : '';
							this.mark = this.mark + 1;
						}).exec();
					}).exec();
				}, 100)
			})
		},
		getVideoList: function () {
			let that = this;
			graphicLstData({
				diy_id: that.parentDiyId,
				unique: that.unique || "",
				mer_id: that.merId || "",
				limit: this.dataConfig.numberConfig.val,
			}).then(res => {
				that.videoList = res.data.list;
			}).catch(e => { });
		}
	}
}
</script>

<style lang="scss">

.video_img{
	width: 38rpx;
	height: 38rpx;
	position: absolute;
	top: 20rpx;
	right: 20rpx;
	background: rgba(40, 40, 40, .5);
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 50%;
	.iconfont{
		color: #ffffff;
		font-size: 20rpx;
	}
}

.shortVideo {
	overflow: hidden;

	.nav {
		width: 100%;
		padding: 0 24rpx;
		height: 96rpx;
		background: linear-gradient(270deg, #FFFFFF 0%, #FFFFFF 100%);
		position: relative;

		.clover {
			position: absolute;
			right: 190rpx;
			top: 20rpx;
			width: 100rpx;
			height: 100rpx;
		}

		.more {
			font-size: 24rpx;
			color: #999999;

			.iconfont {
				font-size: 24rpx;
			}
		}
	}

	.list {
		background: #FFFFFF;
	}
}

.wf-page {
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-gap: 20rpx;
}

.wf-item {
	padding-bottom: 20rpx;
	&:not(:first-child) {
		margin-top: var(--item-gap);
	}
}

.wf-page1 .wf-item {
	margin-top: 20rpx;
	background-color: #fff;
	border-radius: 20rpx;
	padding-bottom: 0;
}

.overflow-picture {
	max-height: 500rpx;
	overflow-y: hidden;
}

.info_box {
	padding: 24rpx 0;
	border-radius: 0 0 24rpx 24rpx;
}

.box-border {
	// border: 1rpx solid #eee;
}

.text-red {
	color: #e93323;
}

.player {
	position: absolute;
	top: 20rpx;
	right: 20rpx;
	width: 40rpx;
	height: 40rpx;
	border-radius: 50%;
	background-color: rgba(51, 51, 51, 0.5);
	color: #fff;
}

.shenhe {
	background-color: rgba(0, 0, 0, 0.4);
}

.pic-number {
	position: absolute;
	right: 16rpx;
	bottom: 16rpx;
	background: rgba(102, 102, 102, 0.50);
}

.copty-mask {
	position: absolute;
	left: 0;
	top: 0;
	width: 296rpx;
	height: 369rpx;
	background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.4) 100%);
	z-index: 20;
}

.white-nowrap {
	white-space: nowrap;
}
</style>