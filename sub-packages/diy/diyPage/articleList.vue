<template>
	<!-- 文章列表 -->
	<view :style="[articleWrapperStyle]" class="relative articleList-box">
		<view class="articleList" :class="{
			large: dataConfig.styleConfig.tabVal == 0,
			small: dataConfig.styleConfig.tabVal == 2,
		}" v-if="articleList.length">
			<navigator :url='"/pages/news_details/index?id=" + item.article_id' hover-class="none"
				v-for="(item, index) in articleList" :key="index" :style="[articleItemStyle]" class="item">
				<view v-if="dataConfig.styleConfig.tabVal != 0" class="image-wrap">
					<image :src="item.image_input" mode="aspectFill" :style="[imgStyle]" class="easy-loadimage"></image>
				</view>
				<view class="text-wrap">
					<view class="title-wrap">
						<view class="title" :class="{
							line1: dataConfig.styleConfig.tabVal != 1,
							line2: dataConfig.styleConfig.tabVal == 1,
						}" :style="[titleStyle]">{{ item.title }}</view>
					</view>
					<view v-if="dataConfig.styleConfig.tabVal == 0" class="image-wrap">
						<image :src="item.image_input" mode="aspectFill" :style="[imgStyle]" class="easy-loadimage"></image>
					</view>
					<view class="time-wrap" :style="[numberStyle]">
						<view v-if="dataConfig.checkboxList.type.includes(0)" class="time time-wrap-item" :style="[timeStyle]">{{
							item.create_time }}</view>
						<!-- <view v-else class="time time-wrap-item"></view> -->
						<view class="like-wrap time-wrap-item">
							<view v-if="dataConfig.checkboxList.type.includes(1)" class="view acea-row row-middle">
								<text class="iconfont icon-ic_Eyes" :style="[iconEyesStyle]"></text>{{ item.visit || 0 }}
							</view>
							<!-- <view v-if="dataConfig.checkboxList.type.includes(2) && dataConfig.styleConfig.tabVal == 0" class="like">
								<text class="iconfont icon-ic_Like" :style="[item.is_like ? iconLikeStyle : '']"></text>{{ item.likes ||
								0 }}
							</view> -->
						</view>
					</view>
				</view>
			</navigator>
		</view>
	</view>
</template>

<script>
import {
	getArticleList
} from '@/api/api.js';
import dayjs from '@/plugin/dayjs/dayjs.min.js';
import { diyUtil } from '@/utils/diy';
export default {
	name: 'articleList',
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
			articleList: [],
		}
	},
	computed: {
		imgStyle() {
			let borderRadius = `${this.dataConfig.filletImg.val * 2}rpx`;
			if (this.dataConfig.filletImg.type) {
				borderRadius =
					`${this.dataConfig.filletImg.valList[0].val * 2}rpx ${this.dataConfig.filletImg.valList[1].val * 2}rpx ${this.dataConfig.filletImg.valList[3].val * 2}rpx ${this.dataConfig.filletImg.valList[2].val * 2}rpx`;
			}
			return {
				borderRadius
			};
		},
		timeStyle() {
			return {
				'color': this.dataConfig.timeColor.color[0].item,
			};
		},
		iconEyesStyle() {
			return {
				'color': this.dataConfig.browseColor.color[0].item,
			};
		},
		iconLikeStyle() {
			return {
				'color': this.dataConfig.likeSuccessColor.color[0].item,
			};
		},
		numberStyle() {
			return {
				'color': this.dataConfig.statisticColor.color[0].item,
			};
		},
		articleItemStyle() {
			let borderRadius = `${this.dataConfig.fillet.val * 2}rpx`;
			if (this.dataConfig.fillet.type) {
				borderRadius =
					`${this.dataConfig.fillet.valList[0].val * 2}rpx ${this.dataConfig.fillet.valList[1].val * 2}rpx ${this.dataConfig.fillet.valList[3].val * 2}rpx ${this.dataConfig.fillet.valList[2].val * 2}rpx`;
			}
			return {
				'box-shadow': diyUtil.buildShadowStyle(this.dataConfig.shadowConfig),
				'border-radius': borderRadius,
				'background': `linear-gradient(90deg, ${this.dataConfig.bgColor.color[0].item} 0%, ${this.dataConfig.bgColor.color[1].item} 100%)`,
			};
		},
		articleWrapperStyle() {
			return {
				'box-shadow': diyUtil.buildShadowStyle(this.dataConfig.compShadowConfig),
				'padding': `${this.dataConfig.topConfig.val * 2}rpx ${this.dataConfig.prConfig.val * 2}rpx ${this.dataConfig.bottomConfig.val * 2}rpx`,
				'margin-top': diyUtil.buildMarginTopOffset(this.dataConfig.mbConfig, this.dataConfig.offsetYConfig),
				'--z-index': diyUtil.calcZIndex(this.index),
				'background': this.dataConfig.bottomBgColor.color[0].item,
			};
		},
		titleStyle() {
			let styleObject = {
				'color': this.dataConfig.nameColor.color[0].item,
			};
			if (!this.dataConfig.nameConfig.tabVal) {
				styleObject['font-weight'] = 'bold';
			}
			return styleObject;
		}
	},
	mounted() {
		this.getCidArticle();
	},
	methods: {
		getCidArticle: function () {
			getArticleList(this.dataConfig.selectConfig.activeValue || 0, {
				page: 1,
				limit: this.dataConfig.numConfig.val
			}).then(res => {
				if (this.dataConfig.styleConfig.tabVal == 2) {
					res.data.list.forEach(item => {
						item.create_time = dayjs(item.create_time).format('YYYY-MM-DD')
					})
				} else {
					res.data.list.forEach(item => {
						item.create_time = dayjs(item.create_time).format('YYYY-MM-DD HH:mm')
					})
				}
				this.articleList = res.data.list;
			});
		},
	}
}
</script>

<style lang="scss">
.articleList {
	z-index: var(--z-index);
}

.articleList-box {
	.item {
		display: flex;
		padding: 20rpx;
		margin: 0;
		margin-bottom: 10px;
		background: #FFFFFF;
	}

	.text-wrap {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 0 0 6rpx 24rpx;
	}

	.title-wrap {
		flex: 1;
	}

	.title {
		font-size: 30rpx;
		line-height: 42rpx;
		color: #333333;
	}

	.label-wrap {
		margin-top: 16rpx;
		font-size: 0;
	}

	.label {
		display: inline-flex;
		flex-wrap: nowrap;
		height: 28rpx;
		padding: 0 6rpx;
		border: 1rpx solid #E93323;
		border-radius: 6rpx;
		font-size: 20rpx;
		color: #E93323;
	}

	.image-wrap {
		width: 240rpx;
		height: 152rpx;
	}

	.time-wrap {
		display: flex;
		font-size: 24rpx;
		line-height: 34rpx;
		color: #999999;

		.time-wrap-item:first-child {
			flex: 1;
		}
	}

	.like-wrap {
		display: flex;
	}

	.view {
		flex: 1;

		&.on {
			margin-right: 0;
		}
	}

	.iconfont {
		margin-right: 8rpx;
		font-size: 28rpx;
	}

	&.large {
		.item {
			flex-direction: column;
			padding: 0;
		}

		.text-wrap {
			padding: 32rpx 24rpx;
		}

		.image-wrap {
			width: 100%;
			height: 320rpx;
			margin-top: 24rpx;
		}

		.time-wrap {
			margin-top: 24rpx;
		}

		.like {
			margin-left: 32rpx;
		}
	}

	&.small {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;

		.item {
			flex-direction: column;
			width: 342rpx;
			padding: 0;
			margin-bottom: 20rpx;
		}

		.text-wrap {
			padding: 20rpx 20rpx 18rpx;
		}

		.image-wrap {
			width: 342rpx;
			height: 216rpx;
		}

		.label-wrap {
			margin-top: 16rpx;
		}

		.time-wrap {
			margin-top: 16rpx;
		}

		.like-wrap {
			justify-content: space-between;
		}
	}
}

.easy-loadimage {
	width: 100%;
	height: 100%;
}
</style>