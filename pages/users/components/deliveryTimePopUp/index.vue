<template>
	<view
		:style="viewColor"
	>
		<!-- 选择配送时间 -->
		<view class="mask-box" @touchmove.stop.prevent="moveHandle()">
			<view class='mask' catchtouchmove="true" :hidden='isShowTimeBox==false' @tap='closeShowBox'></view>
			<view class="mask-content animated popup-main bg-f" :class="{slideInUp:isShowTimeBox}">
				<view class="title font-500">
					预计送达时间
					<view class="close iconfont icon-ic_close popup-close" @click="closeShowBox"></view>
				</view>
				<view class="box">
					<view class="scroll-box flex-box">
						<scroll-view
							scroll-y="true"
							class="scroll-left"
						>
							<view
								class="left-item flex-box"
								v-for="(item, index) in dayList"
								:key="index"
								:class="{'act-left-item': timeData.leftIndex == index}"
								@click="changeLeftIndex(index)"
							>
								<text class="left-text fs-24">{{item.text}}</text>
							</view>
						</scroll-view>
						<scroll-view
							scroll-y="true"
							:scroll-top="scrollTop"
							class="scroll-right"
						>
							<view
								class="right-item flex-box"
								v-for="(item, index) in timeList"
								:key="index"
								:class="{'act-color': timeData.rightIndex == index}"
								@click="changeRightIndex(index)"
							>
								<text class="right-text fs-28">{{item}}</text>
								<text
									class="iconfont icon-ic_complete fs-36"
									v-if="timeData.rightIndex == index"
								></text>
							</view>
						</scroll-view>
					</view>
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
	import { mapGetters } from "vuex";
	import dayjs from "@/plugin/dayjs/dayjs.min.js";
	import { generateTimeList } from "@/utils/deliveryTime";

	export default{
		name:'deliveryTimePopUp',
		props:{
			isShowTimeBox:{
				type:Boolean,
				default:false
			},
			// 被选的商家索引
			activeIndex: {
				type: Number,
				default: 0
			},
			// 被选中的提货点索引
			activeStationIndex: {
				type: Object,
				default: {}
			},
			// 商户的提货点列表
			deliveryStationList:{
				type:Array,
				default:[]
			},
			// 选中的配送时间索引
			actDeliveryTimeIndex: {
				type: Number,
				default: 0,
			},
			// 配送设置
			deliverySettings:{
				type:Array,
				default: [],
			},
			// 配送时间数据
			deliveryTimeData: {
				type: Array,
				default: [],
			}
		},
		data(){
			return {
				scrollTop: 0, // 滚动部分的位置
				dayNumber: 0, // 此门店的此提货点支持的配送天数
				startTime: [0, 0], // 提货点开始营业时间
				endTime: [23, 59], // 提货点结束营业时间
				timeData: {
					leftIndex: 0, // 左侧日期滚动栏索引
					rightIndex: 0, // 右侧时间滚动栏索引
					timeText: '预约时间', // 预约时间文本
				},
				cityTakeTimeData: {
					date:'',
					week:'',
					time:''
				}
			}
		},
		computed: {
			...mapGetters(['viewColor']),
			// 计算每天的日期以及星期
			dayList() {
				return this.deliveryTimeData[this.activeIndex].dateList;
			},
			// 计算时间段
			timeList() {
				const isToday = this.dayList.length && this.dayList[this.timeData.leftIndex].date === dayjs().format('YYYY-MM-DD');
				return generateTimeList(isToday, this.startTime, this.endTime);
			}
		},
		created() {
			// 设置此门店的此提货点支持的配送天数
			this.dayNumber = this.deliverySettings[this.activeIndex].deliverySettings.selectable_days;
			// 设置此提货点的开始与结束时间
			this.setTime()
			// 设置配送选项数据
			this.timeData.leftIndex = this.deliveryTimeData[this.activeIndex].actDayIndex;
			this.timeData.rightIndex = this.deliveryTimeData[this.activeIndex].actTimeIndex;
			this.timeData.timeText = this.deliveryTimeData[this.activeIndex].deliveryTimeText;
			// 设置滚动位置
			this.scrollTop = -1;
			this.$nextTick(function() {
				this.scrollTop = this.timeData.rightIndex*50;
			});
		},
		methods:{
			// 关闭配送方式弹窗
			closeShowBox(){
				this.$emit('closeTimeBox')
			},
			confirmBtn(){
				this.$emit('changeDeliveryTimeIndex', this.radioIndex)
			},
			// 设置同城配送的时间数据
			setCityTakesTimeData() {
				const data = {
					date: this.dayList[this.timeData.leftIndex].date,
					week: this.dayList[this.timeData.leftIndex].text.slice(-3, -1),
					time: this.timeList[this.timeData.rightIndex]
				}
				return data
			},
			// 切换日期
			changeLeftIndex(index) {
				this.timeData.leftIndex = index;
				this.timeData.rightIndex = 0;
				// 解决view层不同步的问题
				this.scrollTop = -1;
				this.$nextTick(function() {
					this.scrollTop = 0;
				});
			},
			// 切换时间段
			changeRightIndex(index) {
				this.timeData.rightIndex = index;
				this.timeData.timeText = `${this.dayList[this.timeData.leftIndex].text} ${this.timeList[index]}`;
				// 设置同城配送时间数据
				this.cityTakeTimeData = this.setCityTakesTimeData()
				this.$emit('changeDeliveryTimeData', this.timeData);
				this.$emit('getCityTakeTimeData', this.cityTakeTimeData)
				this.closeShowBox();
			},
			// 设置营业开始与结束时间
			setTime() {
				const actIndex = this.activeIndex
				const actStationIndex = this.activeStationIndex

				const startTimeStr = this.deliveryStationList[actIndex][actStationIndex[actIndex]].business_time_start;
				const endTimeStr = this.deliveryStationList[actIndex][actStationIndex[actIndex]].business_time_end;
				if (!!(startTimeStr && endTimeStr)) {
					this.startTime = startTimeStr.split(':').map(item => {
						return Number(item)
					})
					this.endTime = endTimeStr.split(':').map(item => {
						return Number(item)
					})
				}
			},
			// 禁止遮罩层下滚动
			moveHandle: function() {},
		}
	}
</script>

<style lang="scss">
	.mask-box{
		.mask-content{
			.title{
				padding: 40rpx 0;
				margin-bottom: 40rpx;
				.close{
					position: absolute;
					right: 20rpx;
					top: 20rpx;
				}
			}
			.box{
				.scroll-box {
					// margin-bottom: 52rpx;
					.scroll-left {
						height: 470rpx;
						width: 230rpx;
						flex-shrink: 0;
						background-color: #F5F5F5;
						// 去除滚动条
						::v-deep * {
							scrollbar-color: #fff #fff;
							scrollbar-width: none;
						}
						.left-item {
							align-items: center;
							padding: 30rpx 0;
							background-color: #F5F5F5;
							.left-text {
								margin-left: 34rpx;
							}
						}
						.act-left-item {
							background-color: #fff;
						}
					}
					.scroll-right {
						height: 470rpx;
						// 去除滚动条
						::v-deep * {
							scrollbar-color: #fff #fff;
							scrollbar-width: none;
						}
						.right-item {
							justify-content: space-between;
							align-items: center;
							padding: 30rpx 0;
							.right-text {
								margin-left: 34rpx;
							}
							.icon-ic_complete {
								margin-right: 32rpx;
							}
						}
					}

				}

				.check-item{
					display: flex;
					align-items: center;
					justify-content: space-between;
					height: 40rpx;
					margin-bottom: 50rpx;
					font-size: 28rpx;
					.check-item-text {
						display: flex;
						align-items: center;
						.err-txt {
							display: flex;
							// align-items: center;
							align-items: baseline;
							color: $theme-color;
							font-size: 22rpx;
							font-weight: 400;
							margin-left: 20rpx;
							.iconfont {
								margin-right: 10rpx;
								font-size: 22rpx;
								color: $theme-color;
							}
						}
					}

					.iconfont{
						font-size: 38rpx;
						color: #CCCCCC;
						&.icon-a-ic_CompleteSelect{
							color: var(--view-theme);
						}
					}
				}
			}
			.foot{
				padding: 50rpx 30rpx 20rpx;
				padding: 50rpx 30rpx calc(20rpx + constant(safe-area-inset-bottom)); ///兼容 IOS<11.2/
				padding: 50rpx 30rpx calc(20rpx + env(safe-area-inset-bottom)); ///兼容 IOS>11.2/
				.btn{
					width: 100%;
					height: 88rpx;
					line-height: 88rpx;
					text-align: center;
					border-radius: 50rpx;
					color: #fff;
					font-size: 28rpx;
					background: var(--view-theme);
				}
			}
		}
	}
	.animated {
		animation-duration: .3s
	}
	.flex-box {
		display: flex;
	}
	.act-color {
		color: var(--view-theme)
	}
	.fs-24 {
		font-size: 24rpx;
	}
	.fs-28 {
		font-size: 28rpx;
	}
	.fs-36 {
		font-size: 36rpx;
	}
</style>
