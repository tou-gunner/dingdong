<template>
	<view :style="viewColor">
		<!-- 选择提货点地址 -->
		<view class="mask-box">
			<view class='mask' catchtouchmove="true" :hidden='isShowStation==false' @tap='closeShowBox'></view>
			<view class="mask-content animated popup-main bg-f" :class="{slideInUp:isShowStation}">
				<view class="title font-500">
					选择地址
					<view class="close iconfont icon-ic_close popup-close" @click="closeShowBox"></view>
				</view>
				<view class="search-box">
					<SearchBar
						placeholder="请输入提货点名称/地址"
						custom-class="custom-search-bar"
						@confirm="handleConfirm" />
				</view>
				<view class="box">
					<scroll-view scroll-y="true" class="scroll-box">
						<!-- 提货点内容 -->
						<view
							class="station-item"
							v-for="(item,index) in deliveryStationData"
							:key="index"
							:class="{'activite-item' :index == radioIndex}"
							@click="changeActIndex(item, index)">
							<!-- 选中时的icon样式 -->
							<text
								v-show="index == radioIndex"
								class="iconfont icon-a-icon_cornermark">
							</text>
							<!-- S 左侧信息 -->
							<view class="left-box">
								<!-- 提货点名字 -->
								<view class="name fs-28 fw-500">
									{{item.station_name}}
								</view>
								<!-- 提货点地址 -->
								<view class="left-info address fs-22 fw-400">
									<text class="iconfont icon-ic_location51 fs-22 "></text>
									<view class="left-info-text address-text">
										提货地址：{{item.station_address}}
									</view>
								</view>
								<!-- 提货点营业时间 -->
								<view class="left-info time fs-22 fw-400">
									<text class="iconfont icon-icon_clock-2 fs-22"></text>
									<view class="left-info-text time-text">
										营业时间：{{item.business_time_start}}-{{item.business_time_end}}
									</view>
								</view>
							</view>
							<!-- E 左侧信息 -->
							<!-- S 右侧信息 -->
							<view class="distance-box">
								<view class="distance fs-20 fw-400">
									距离{{item.distance}}
								</view>
								<view
									class="icon-group"
									@click.stop.prevent>
									<!-- 电话按钮 -->
									<view
										class="icon-box phone-box"
										@click="callPhone(item.phone)">
										<text class="iconfont icon-ic_Phone fs-20"></text>
									</view>
									<!-- 导航按钮 -->
									<view
										class="icon-box location-box"
										@click="navigation(item)">
										<text class="iconfont icon-icon_Location fs-20"></text>
									</view>
								</view>
							</view>
							<!-- E 右侧信息 -->

						</view>
					</scroll-view>
				</view>
				<view class="foot">
					<view class="btn" @click="confirmBtn">确定</view>
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
	import SearchBar from "@/components/common/search_bar.vue";
	import {
		getDeliveryStationListApi
	} from '@/api/order.js';
	export default{
		name:'stationPopUp',
		components: {
			SearchBar
		},
		props:{
			// 是否展示提货点窗口
			isShowStation:{
				type:Boolean,
				default:false
			},
			// 当前门店索引
			activeIndex: {
				type: Number,
				default: 0
			},
			// 选中的提货点索引
			activeStationIndex: {
				type: Object,
				default: {}
			},
			// 用户地址id
			addressId: {
				type: Number,
				default: 0
			},
			// 商户id
			activeObj: {
				type: Object,
				default:function(){
					return {}
				}
			},
			// 提货点数据列表
			deliveryStationList:{
				type: Array,
				default: []
			},
		},
		computed: mapGetters(['viewColor']),
		data(){
			return {
				radioIndex: 0, // 当前被选中的提货点索引
				deliveryStationData: [], // 提货点数据
				keyword: '', // 提货点搜索内容
				stationId: 0, // 提货点id
				stationIndex: 0, // 当前被选中的提货点在总提货点列表的索引
			}
		},
		mounted() {
			this.radioIndex = this.activeStationIndex[this.activeIndex]
			this.getDeliveryStationData()
		},
		methods:{
			// 获取提货点数据
			async getDeliveryStationData() {
				// 获取当前地址的id、配送方式以及门店id
				const pickUpPoint = {
					address_id: this.addressId,
					mer_id: this.activeObj.mer_id,
					name_and_address_search: this.keyword
				}
				if (this.activeObj.order.isCityTake) {
					pickUpPoint.switch_city = 1
					delete pickUpPoint.switch_take
				} else if (this.activeObj.order.isTake) {
					pickUpPoint.switch_take = 1
					delete pickUpPoint.switch_city
				}
				await getDeliveryStationListApi(pickUpPoint).then(res => {
					this.deliveryStationData = res.data;
					this.stationId = res.data[0].station_id
				}).catch(err => {
					return this.$util.Tips({
						title: err
					})
				})
			},
			// 搜索提货点
			handleConfirm(value) {
			  this.keyword = value;
				this.getDeliveryStationData()
			},
			// 关闭选择地址弹窗
			closeShowBox(){
				this.$emit('closeShowStation')
			},
			// 更改当前被选中的提货点在总提货点列表的索引
			changeStationIndex() {
				this.deliveryStationList[this.activeIndex].forEach((el, i) => {
					if (el.station_id == this.stationId) {
						this.stationIndex = i;
					}
				})
			},
			// 选择提货点
			changeActIndex(item, index){
				this.radioIndex = index;
				this.stationId = item.station_id
				this.changeStationIndex()
			},
			confirmBtn(){
				this.changeStationIndex()
				this.$emit('changeStationIndex',this.stationIndex)
			},
			// 拨打电话
			callPhone(phone) {
				uni.makePhoneCall({
					phoneNumber: phone
				})
			},
			// 查看内置地图
			navigation(item) {
				let lat = Number(item.lat),
					long = Number(item.lng)

				//#ifdef H5
				if (this.$wechat.isWeixin() === true) {
					this.$wechat.seeLocation({
						latitude: lat,
						longitude: long,
						name: item.station_name,
						address: item.station_address ? item.station_address : '',
					}).then(res => {})
				} else {
					//#endif
					uni.openLocation({
						latitude: parseFloat(lat),
						longitude: parseFloat(long),
						scale: 8,
						name: item.station_name,
						address: item.station_address ? item.station_address : '',
						success: function(res) {
							that.go_map = true
						},
					});
					// #ifdef H5
				}
				//#endif
			}
		}
	}
</script>

<style lang="scss">
	.mask-box{
		.mask-content{
			background-color: #F5F5F5;
			.title{
				padding: 40rpx 0 20rpx 0;
				// margin-bottom: 40rpx;
				.close{
					position: absolute;
					right: 20rpx;
					top: 20rpx;
				}
			}
			.search-box {
				margin: 0 10rpx;
			}
			.box{
				padding: 0 30rpx;
				.scroll-box {
					max-height: 680rpx;
					// 去除滚动条
					::v-deep * {
						scrollbar-color: #fff #fff;
						scrollbar-width: none;
					}
					.station-item{
						position: relative;
						display: flex;
						align-items: center;
						justify-content: space-between;

						margin-bottom: 20rpx;
						padding: 28rpx 24rpx;
						background: #FFFFFF;
						border-radius: 16rpx 16rpx 16rpx 16rpx;
						border: 1rpx solid #FFFFFF;

						font-size: 28rpx;
						color: #333333;
						// .icon-a-icon_cornermark {
						// 	position: absolute;
						// 	top: -1rpx;
						// 	right: -1rpx;
						// 	color: var(--view-theme);
						// 	font-size: 56rpx;
						// }
						.left-box {
							width: 500rpx;
							padding-right: 50rpx;
							border-right: 1rpx solid #EEEEEE;
							.name {
								margin-bottom: 16rpx;
							}
							.left-info {
								display: flex;
								color: #999999;
								align-items: baseline;
								.iconfont {
									margin-right: 12rpx;

								}
								.left-info-text {
									width: 418rpx;
								}
							}
							.address {
								margin-bottom: 10rpx;
							}

						}

						.distance-box {
							display: flex;
							flex-direction: column;
							color: #999999;

							.icon-group {
								display: flex;
								color: var(--view-theme);
								justify-content: center;
								margin-top: 20rpx;
								.icon-box {
									display: flex;
									justify-content: center;
									align-items: center;
									width: 40rpx;
									height: 40rpx;
									border-radius: 50%;
									background-color: #FCEAE9;

								}
								.location-box {
									margin-left: 20rpx;
								}
							}
						}
					}
					.activite-item {
						border: 1rpx solid var(--view-theme);
						.icon-a-icon_cornermark {
							position: absolute;
							top: -1rpx;
							right: -1rpx;
							color: var(--view-theme);
							font-size: 56rpx;
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
	.fs-20 {
		font-size: 20rpx;
	}
	.fs-22 {
		font-size: 22rpx;
	}
	.fs-28 {
		font-size: 28rpx;
	}
	.fw-400 {
		font-weight: 400;
	}
	.fw-500 {
		font-weight: 500;
	}
</style>
