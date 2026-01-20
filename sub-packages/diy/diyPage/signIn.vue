<template>
	<view :style="[signWrapStyle]" class="relative">
		<view class="signIn" :style="[signStyle]">
			<view v-if="dataConfig.styleConfig.tabVal" class="text-wrap acea-row row-middle" :style="[signBodyStyle]">
				<image src="@/static/images/sign-icon-04.png" mode="widthFix" class="image"></image>
				<view class="text">
					<view class="name-wrap acea-row row-middle">
						<view class="name">ເຊັກອິນເພື່ອຮັບ</view>
						<view class="num acea-row row-middle" :style="[numStyle]">
							<view class="inner acea-row row-middle" :class="{ opacity: !dataConfig.toneConfig.tabVal }">
								<image src="@/static/images/sign-icon-01.png" mode="widthFix" class="icon"></image>
								+{{ sign_give_point }}
							</view>
						</view>
					</view>
					<view>ເຊັກອິນຕິດຕໍ່ກັນ {{ continuousSignDays || 0 }} ມື້</view>
				</view>
				<view class="button" :style="[buttonStyle]" @click="handleSign">
					{{ todayIsSign ? 'ເຊັກອິນແລ້ວ' : 'ເຊັກອິນດຽວນີ້' }}
				</view>
			</view>
			<view v-else class="week-wrap acea-row row-middle" :style="[signBodyStyle]">
				<view class="week acea-row">
					<view v-for="(item, index) in combineSignConfig" :key="index"
						class="item acea-row row-column row-center-wrapper">
						<image v-if="item.isSign" src="@/static/images/sign-icon-03.png" mode="widthFix" class="image"></image>
						<image v-else-if="item.isCurrentDay" src="@/static/images/sign-icon-02.png" mode="widthFix" class="image"></image>
						<image v-else src="@/static/images/sign-icon-01.png" mode="widthFix" class="image"></image>
						<view>{{ index | weekFormat }}</view>
					</view>
				</view>
				<view class="button" :style="[buttonStyle]" @click="handleSign">
					{{ todayIsSign ? 'ເຊັກອິນແລ້ວ' : 'ເຊັກອິນ' }}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import {
	getSignUser,
	getSignList,
	setSignIntegral
} from '@/api/user';
import { diyUtil } from '@/utils/diy';
import { mapGetters } from "vuex";
import dayjs from "@/plugin/dayjs/dayjs.min.js";

export default {
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
	filters: {
		weekFormat: function (value) {
			return ['ຈັນ', 'ອັງຄານ', 'ພຸດ', 'ພະຫັດ', 'ສຸກ', 'ເສົາ', 'ທິດ'][value];
		}
	},
	data() {
		const t = new Date();
		const d = t.getDay();
		return {
			today: d === 0 ? 6 : d - 1, // 0表示周日，6表示周六,保证计算结果是0-6，对应周一至周日
			signConfig: [],
			sign_give_point: 0,
			continuousSignDays: 0,
			nextContinuousSignRewardList: {},
			signRecordList: [],
			todayIsSign: false
		};
	},
	computed: {
		...mapGetters(['isLogin']),
		buttonStyle() {
			let styleObject = {};
			if (this.dataConfig.toneConfig.tabVal) {
				styleObject['background'] = `linear-gradient(90deg, ${this.dataConfig.bntBgColor.color[0].item} 0%, ${this.dataConfig.bntBgColor.color[1].item} 100%)`;
				styleObject['color'] = this.dataConfig.bntTxtColor.color[0].item;
			}
			return styleObject;
		},
		signStyle() {
			let color = this.dataConfig.styleConfig.tabVal ? this.dataConfig.moduleColor.color : this.dataConfig.moduleColor2.color;
			let borderRadius = `${this.dataConfig.fillet.val * 2}rpx`;
			if (this.dataConfig.fillet.type) {
				borderRadius =
					`${this.dataConfig.fillet.valList[0].val * 2}rpx ${this.dataConfig.fillet.valList[1].val * 2}rpx ${this.dataConfig.fillet.valList[3].val * 2}rpx ${this.dataConfig.fillet.valList[2].val * 2}rpx`;
			}
			return {
				'border-radius': borderRadius,
				'background': `linear-gradient(270deg, ${color[0].item} 0%, ${color[1].item} 100%)`,
			};
		},
		signBodyStyle() {
			return {
				'box-shadow': diyUtil.buildShadowStyle(this.dataConfig.signShadowConfig),
			}
		},
		signWrapStyle() {
			return {
				'z-index': diyUtil.calcZIndex(this.index),
				'box-shadow': diyUtil.buildShadowStyle(this.dataConfig.shadowConfig),
				'padding': `${this.dataConfig.topConfig.val * 2}rpx ${this.dataConfig.prConfig.val * 2}rpx ${this.dataConfig.bottomConfig.val * 2}rpx`,
				'margin-top': diyUtil.buildMarginTopOffset(this.dataConfig.mbConfig, this.dataConfig.offsetYConfig),
				'background': this.dataConfig.bottomBgColor.color[0].item,
			};
		},
		numStyle() {
			let styleObject = {};
			if (this.dataConfig.toneConfig.tabVal) {
				styleObject['background'] = this.dataConfig.labelBgColor.color[0].item;
				styleObject['color'] = this.dataConfig.labelTxtColor.color[0].item;
			}
			return styleObject;
		},
		combineSignConfig() {
			if (!this.signRecordList.length || !this.signConfig.length) return [];
			const signRecordMap = this.signRecordList.reduce((acc, item) => {
				const date = dayjs(item.create_time).format("YYYY-MM-DD");
				acc[date] = item.number;
				return acc;
			}, {});

			let currentDay = dayjs().day();
			currentDay = currentDay === 0 ? 7 : currentDay;

			return this.signConfig.map((item, index) => {
				const date = dayjs().startOf('week').add(index + 1, 'day').format('YYYY-MM-DD');
				return {
					...item,
					isCurrentDay: currentDay === index + 1,
					isSign: signRecordMap[date] > 0,
					value: {
						...item.value,
						sign_integral: signRecordMap[date] || item.value.sign_integral
					}
				}
			});
		}
	},
	created() {
		this.refreshData();
	},
	methods: {
		refreshData() {
			this.getSign();
			this.getSignList();
		},
		async handleSign() {
			if (this.todayIsSign) {
				this.$util.Tips({
					title: 'ທ່ານເຊັກອິນມື້ນີ້ແລ້ວ!'
				});
				return;
			}
			uni.showLoading({
				mask: true
			});
			try {
				await setSignIntegral();
				this.refreshData();
				uni.hideLoading();
				this.$util.Tips({
					title: 'ເຊັກອິນສຳເລັດ'
				});
			} catch (error) {
				uni.hideLoading();
				this.$util.Tips({
					title: error.message || error
				});
			}
		},
		getSign() {
			if (!this.isLogin) {
				return;
			}
			getSignUser().then(res => {
				this.continuousSignDays = res.data.sign_num;
				this.signConfig = res.data.title;
				this.sign_give_point = this.signConfig[this.today].value.sign_integral;
				this.todayIsSign = res.data.is_sign;
			});
		},
		getSignList() {
			if (!this.isLogin) return;
			getSignList({ page: 1, limit: 7 }).then(res => {
				this.signRecordList = res.data.list;
			})
		}
	},
}
</script>

<style lang="scss" scoped>
.signIn {
	padding: 24rpx;
	border-radius: 0rpx 0rpx 16rpx 16rpx;
	background: #FFFFFF;

	.week-wrap {
		height: 156rpx;
		border-radius: 16rpx;
		background: linear-gradient(to right, #FFE8F5, #F1FBFD);

		.week {
			flex: 1;
			font-weight: 500;
			font-size: 22rpx;
			line-height: 30rpx;
			color: #999999;

			.item {
				flex: 1;
			}

			.image {
				width: 48rpx;
				margin-bottom: 16rpx;
			}
		}

		.button {
			// width: 88rpx;
			padding-inline: 20rpx;
			height: 48rpx;
			border-radius: 24rpx;
			margin: 0 20rpx;
			background: linear-gradient(90deg, var(--view-theme) 0%, var(--view-assist) 100%);
			text-align: center;
			font-size: 24rpx;
			line-height: 48rpx;
			color: #FFFFFF;
		}
	}

	.text-wrap {
		height: 140rpx;
		border-radius: 16rpx;
		background: #FFFFFF;

		.image {
			width: 88rpx;
			height: 88rpx;
			margin-left: 20rpx;
		}

		.text {
			flex: 1;
			padding: 0 20rpx;
			font-size: 24rpx;
			color: #999999;
		}

		.name-wrap {
			margin-bottom: 14rpx;
		}

		.name {
			font-weight: 500;
			font-size: 30rpx;
			color: #282828;
		}

		.num {
			border-radius: 16rpx;
			margin-left: 4rpx;
			background: var(--view-theme);
			font-size: 20rpx;
			line-height: 32rpx;
			color: var(--view-theme);

			.inner {
				height: 32rpx;
				padding: 0 6rpx 0 8rpx;
				border-radius: 16rpx;
			}

			.opacity {
				background: rgba(255, 255, 255, 0.9);
			}
		}

		.icon {
			width: 24rpx;
			height: 24rpx;
		}

		.button {
			width: 140rpx;
			height: 52rpx;
			border-radius: 26rpx;
			margin: 0 20rpx;
			background: linear-gradient(90deg, var(--view-theme) 0%, var(--view-assist) 100%);
			text-align: center;
			font-size: 24rpx;
			line-height: 52rpx;
			color: #FFFFFF;
		}
	}
}
</style>