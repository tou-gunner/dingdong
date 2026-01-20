<template>
	<div class="statistical-page" ref="container">
		<view v-show="isShowBox">
			<div class="navs">
				<div class="list">
					<div class="item" :class="time == 'today' ? 'on' : ''" @click="setTime('today')">
						ມື້ນີ້
					</div>
					<div class="item" :class="time == 'yesterday' ? 'on' : ''" @click="setTime('yesterday')">
						ມື້ວານ
					</div>
					<div class="item" :class="time == 'seven' ? 'on' : ''" @click="setTime('seven')">
						7ມື້ທີ່ຜ່ານມາ
					</div>
					<div class="item" :class="time == 'month' ? 'on' : ''" @click="setTime('month')">
						ເດືອນນີ້
					</div>
					<div class="item" :class="time == 'date' ? 'on' : ''" @click="dateTitle">
						ກຳນົດເອງ
					</div>
				</div>
			</div>
			<div class="wrapper bg-f boder-24">
				<div class="title">
					{{ title }}{{ where.type == 1 ? "ລາຍຮັບ（ກີບ）" : "ຈຳນວນອໍເດີ（ລາຍການ）" }}
				</div>
				<div v-if="where.type == 1" class="money">{{ time_price }}</div>
				<div v-else class="money">{{ time_price }}</div>
				<div class="increase acea-row row-between-wrapper">
					<div>
						{{ title }}ອັດຕາການເຕີບໂຕ：<span :class="increase_time_status === 1 ? 'red' : 'green'">{{ increase_time_status === 1 ? "" : "-" }}{{ growth_rate }}%
							<span class="iconfont" :class="
			            increase_time_status === 1
			              ? 'icon-ic_uparrow'
			              : 'icon-ic_downarrow'
			          "></span></span>
					</div>
					<div>
						{{ title }}ການເຕີບໂຕ：<span :class="increase_time_status === 1 ? 'red' : 'green'">{{ increase_time_status === 1 ? "" : "-" }}{{ increase_time }}
							<span class="iconfont" :class="
			            increase_time_status === 1
			              ? 'icon-ic_uparrow'
			              : 'icon-ic_downarrow'
			          "></span></span>
					</div>
				</div>
			</div>
			<div class="chart" v-if="showChart">
				<div class="chart-title">
					ຫົວໜ່ວຍ（{{where.type == 1?'ກີບ':'ລາຍການ'}}）
				</div>
				<canvas canvas-id="canvasLineA" id="canvasLineA" class="charts" disable-scroll=true @touchstart="touchLineA"
				 @touchmove="moveLineA" @touchend="touchEndLineA"></canvas>
			</div>
			<div class="public-wrapper boder-24 bg-f">
				<div class="title">
					<span class="iconfont icon-xiangxishuju"></span>ຂໍ້ມູນລະອຽດ
				</div>
				<div class="nav acea-row row-between-wrapper">
					<div class="data">ວັນທີ</div>
					<div class="browse">ຈຳນວນອໍເດີ</div>
					<div class="turnover">ຍອດຂາຍ</div>
				</div>
				<div class="conter">
					<div class="item acea-row row-between-wrapper" v-for="(item, index) in list" :key="index">
						<div class="data">{{ item.day }}</div>
						<div class="browse">{{ item.total }}</div>
						<div class="turnover">{{ item.pay_price }}</div>
					</div>
				</div>
			</div>
		</view>
		<uni-calendar ref="calendar" :date="info.date" :insert="info.insert" :lunar="info.lunar" :startDate="info.startDate"
		 :endDate="info.endDate" :range="info.range" @confirm="confirm" :showMonth="info.showMonth" @close="close" />
		<div class="mask" @touchmove.prevent v-show="current === true" @click="close"></div>
	</div>
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
	  import uCharts from '../components/ucharts/ucharts'
		import uniCalendar from '../components/uni-calendar/uni-calendar.vue'
		var canvaLineA = null;
		import {
			orderPrice,
			orderNumberStatistics,
			turnoverStatistics
		} from "@/api/admin";
		const year = new Date().getFullYear();
		const month = new Date().getMonth() + 1;
		const day = new Date().getDate();
		export default {
			name: "Statistics",
			components: {
				uniCalendar
			},
			props: {},
			data: function() {
				return {
					isShowBox:true,
					showChart: false,
					value: [
						[year, month, day - 1],
						[year, month, day]
					],
					isrange: true,
					weekSwitch: false,
					ismulti: false,
					monFirst: true,
					clean: false, //简洁模式
					lunar: false, //显示农历
					renderValues: [],
					monthRange: [],
					current: false,
					where: {
						start: "",
						stop: "",
						type: ""
					},
					types: "", //类型|order=订单数|price=营业额
					time: "", //时间|today=今天|yesterday=昨天|month=本月
					title: "", //时间|today=今天|yesterday=昨天|month=本月
					growth_rate: "", //增长率
					increase_time: "", //增长率
					increase_time_status: "", //增长率
					time_price: "", //增长率
					order_num: "", //订单量
					loaded: false,
					loading: false,
					filter: {
						page: 1,
						limit: 10,
						start: "",
						stop: ""
					},
					list: [],
					cWidth: '',
					cHeight: '',
					pixelRatio: 1,
					textarea: '',
					"LineA": {
						"categories": ["2012", "2013", "2014", "2015", "2016", "2017"],
						"series": [{
							"data": [35, 8, 25, 37, 4, 20]
						}]
					},
					info: {
						startDate: '',
						endDate: '',
						lunar: false,
						range: true,
						insert: false,
						selected: [],
						showMonth: false
					},
					merId: ''
				};
			},
			watch: {
				"$route.params": function(newVal) {
					var that = this;
					if (newVal != undefined) {
						that.setType(newVal.type);
						that.setTime(newVal.time);
						that.getIndex();
					}
				}
			},
			onLoad: function(options) {
				this.merId = options.merId;
				this.setType(options.type);
				this.setTime(options.time);
				this.cWidth = uni.upx2px(690);
				this.cHeight = uni.upx2px(500);
				this.getInfo();
			},
			computed: {
				monthRangeText() {
					return this.monthRange.length ? "固定" : "指定范围";
				}
			},
			methods: {
				getIndex: function() {
					let tempDay = []
					let tempNum = []
					var that = this;
					that.where.type == 1 ?
						turnoverStatistics(that.where, that.merId).then(
							res => {
								var _info = res.data.chart,
									day = [],
									num = [];
								_info.forEach(function(item) {
									day.push(item.time);
									num.push(item.num);
								});
								that.growth_rate = res.data.growth_rate;
								that.increase_time = res.data.increase_time;
								that.increase_time_status = res.data.increase_time_status;
								that.time_price = res.data.time;
								res.data.chart.forEach((item, index) => {
									tempDay.push(item.time)
									tempNum.push(item.num)
								})
								that.LineA.categories = tempDay
								that.LineA.series[0].data = tempNum
								that.showLineA("canvasLineA", that.LineA);
							},
							error => {
								that.$dialog.error(error.msg);
							}
						) : orderNumberStatistics(that.where, this.merId).then(
							res => {
								var _info = res.data.chart,
									day = [],
									num = [];
								_info.forEach(function(item) {
									day.push(item.time);
									num.push(item.num);
								});
								that.growth_rate = res.data.growth_rate;
								that.increase_time = res.data.increase_time;
								that.increase_time_status = res.data.increase_time_status;
								that.time_price = res.data.time;
								res.data.chart.forEach((item, index) => {
									tempDay.push(item.time)
									tempNum.push(item.num)
								})
								that.LineA.categories = tempDay
								that.LineA.series[0].data = tempNum
								that.showLineA("canvasLineA", that.LineA);
							},
							error => {
								that.$dialog.error(error.msg);
							}
						)
				},
				setTime: function(time) {
					let self = this
					this.time = time;
					this.showChart = true;
					var year = new Date().getFullYear(),
						month = new Date().getMonth() + 1,
						day = new Date().getDate();
					this.list = [];
					this.filter.page = 1;
					this.loaded = false;
					this.loading = false;
					switch (time) {
						case "today":
						this.showChart = false;
							this.where.start =
								new Date(Date.parse(year + "/" + month + "/" + day)).getTime() /
								1000;
							this.where.stop =
								new Date(Date.parse(year + "/" + month + "/" + day)).getTime() /
								1000 +
								24 * 60 * 60 -
								1;
							this.where.month = 0
							this.title = "ມື້ນີ້";
							this.getIndex();
							this.getInfo();
							break;
						case "yesterday":
							this.showChart = false;
							this.where.start =
								new Date(Date.parse(year + "/" + month + "/" + day)).getTime() /
								1000 -
								24 * 60 * 60;
							this.where.stop =
								new Date(Date.parse(year + "/" + month + "/" + day)).getTime() /
								1000 -
								1;
							this.where.month = 0
							this.title = "ມື້ວານ";
							this.getIndex();
							this.getInfo();
							break;
						case "month":

							this.where.start =
								new Date(year, new Date().getMonth(), 1).getTime() / 1000;
							this.where.stop = new Date(year, month, 1).getTime() / 1000 - 1;
							this.title = "ເດືອນນີ້";
							this.where.month = 1
							this.getIndex();
							this.getInfo();
							break;
						case "seven":
							this.where.start =
								new Date(Date.parse(year + "/" + month + "/" + day)).getTime() /
								1000 +
								24 * 60 * 60 -
								7 * 3600 * 24;
							this.where.stop =
								new Date(Date.parse(year + "/" + month + "/" + day)).getTime() /
								1000 +
								24 * 60 * 60 -
								1;
							this.title = "7ມື້";
							this.where.month = 0
							this.getIndex();
							this.getInfo();
							break;
					}
				},
				setType: function(type) {
					switch (type) {
						case "price":
							this.where.type = 1;
							break;
						case "order":
							this.where.type = 2;
							break;
					}
				},
				dateTitle: function() {
					this.isShowBox = false
					this.$refs.calendar.open()
					this.time = 'date'
					this.title = "ກຳນົດເອງ";
					this.where.month = 0;
					// this.current = true;
				},
				close: function() {
					this.current = false;
					this.isShowBox = true
				},
				getInfo: function() {
					var that = this;
					if (that.loading || that.loaded) return;
					that.loading = true;
					that.filter.start = that.where.start;
					that.filter.stop = that.where.stop;
					orderPrice(that.filter, this.merId).then(
						res => {
							that.loading = false;
							that.loaded = res.data.length < that.filter.limit;
							that.list.push.apply(that.list, res.data);
							that.filter.page = that.filter.page + 1;
						},
						error => {
							that.$dialog.message(error.msg);
						}
					)
				},
				// 创建charts
				showLineA(canvasId, chartData) {
					let _self = this
					canvaLineA = new uCharts({
						$this: _self,
						canvasId: canvasId,
						type: 'line',
						fontSize: 11,
						padding: [15, 15, 0, 15],
						legend: {
							show: false,
							padding: 5,
							lineHeight: 11,
							margin: 5,
						},
						dataLabel: true,
						dataPointShape: true,
						dataPointShapeType: 'hollow',
						background: '#FFFFFF',
						pixelRatio: _self.pixelRatio,
						categories: chartData.categories,
						series: chartData.series,
						animation: true,
						enableScroll: true, //开启图表拖拽功能
						xAxis: {
							disableGrid: false,
							type: 'grid',
							gridType: 'dash',
							itemCount: 4,
							scrollShow: true,
							scrollAlign: 'left'
						},
						yAxis: {
							gridType: 'dash',
							splitNumber: 8,
							min: 0,
							max: 30,
							format: (val) => {
								return val.toFixed(0)
							} //如不写此方法，Y轴刻度默认保留两位小数
						},
						width: _self.cWidth * _self.pixelRatio,
						height: _self.cHeight * _self.pixelRatio,
						extra: {
							line: {
								type: 'straight'
							}
						},
					});
				},
				// charts触摸事件

				touchLineA(e) {
					canvaLineA.scrollStart(e);
				},
				moveLineA(e) {
					canvaLineA.scroll(e);
				},
				touchEndLineA(e) {
					canvaLineA.scrollEnd(e);
				},
				// 日历确定
				confirm(e) {
					let self = this
					if (e.range.after && e.range.before) {
						let star = new Date(e.range.after + ' 00:00:00').getTime() / 1000
						let stop = new Date(e.range.before + ' 00:00:00').getTime() / 1000
						self.where.start = star < stop ? star : stop
						self.where.stop = (stop > star ? stop : star) - 1 + 86400
						self.where.month = 0
						self.list = [];
						self.filter.page = 1;
						self.loaded = false;
						self.loading = false;
						self.isShowBox = true
						Promise.all([self.getIndex(), self.getInfo()]);
					}
				},
			},
			onReachBottom() {
				this.getInfo();
			}
		};
</script>
<style>
	/*交易额统计*/
	.statistical-page .navs {
		width: 100%;
		height: 96upx;
		background-color: #fff;
		overflow: hidden;
		line-height: 96upx;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 9;
	}
	.statistical-page .navs .list {
		overflow-y: hidden;
		overflow-x: auto;
		white-space: nowrap;
		-webkit-overflow-scrolling: touch;
		width: 100%;
	}
	.statistical-page .navs .item {
		font-size: 32upx;
		color: #282828;
		margin-left: 60upx;
		display: inline-block;
	}
	.statistical-page .navs .item.on {
		color: #2291f8;
	}
	.statistical-page .navs .item .iconfont {
		font-size: 25upx;
		margin-left: 13upx;
	}
	.statistical-page .wrapper {
		width: 710upx;
		background-color: #fff;
		margin: 119upx auto 0 auto;
		padding: 50upx 60upx;
	}
	.statistical-page .wrapper .title {
		font-size: 30upx;
		color: #999;
		text-align: center;
	}
	.statistical-page .wrapper .money {
		font-size: 72upx;
		color: #fba02a;
		text-align: center;
		margin-top: 10upx;
	}
	.statistical-page .wrapper .increase {
		font-size: 28upx;
		color: #999;
		margin-top: 20upx;
	}
	.statistical-page .wrapper .increase .red {
		color: #ff6969;
	}
	.statistical-page .wrapper .increase .green {
		color: #1abb1d;
	}
	.statistical-page .wrapper .increase .iconfont {
		font-size: 23upx;
		margin-left: 15upx;
	}
	.statistical-page .chart {
		width: 690upx;
		background-color: #fff;
		border-radius: 10upx;
		margin: 23upx auto 0 auto;
	}
	.statistical-page .chart .chart-title {
		padding: 20upx 20upx 10upx;
		font-size: 26upx;
		color: #999;
	}
	.statistical-page .chart canvas {
		width: 100%;
		height: 530rpx;
	}
	.statistical-page .wrapper .increase {
		font-size: 26upx;
	}
	.statistical-page .wrapper .increase .iconfont {
		margin-left: 0;
	}
	.public-wrapper .title {
		font-size: 30upx;
		color: #282828;
		padding: 0 30upx;
		margin-bottom: 20upx;
	}
	.public-wrapper .title .iconfont {
		color: #2291f8;
		font-size: 40upx;
		margin-right: 13upx;
		vertical-align: middle;
	}
	.public-wrapper {
		margin: 20rpx auto;
		width: 710upx;
		padding-top: 25upx;
	}
	.public-wrapper .nav {
		padding: 0 30upx;
		height: 70upx;
		line-height: 70upx;
		font-size: 24upx;
		color: #999;
	}
	.public-wrapper .data {
		width: 210upx;
		text-align: left;
	}
	.public-wrapper .browse {
		width: 192upx;
		text-align: right;
	}
	.public-wrapper .turnover {
		width: 227upx;
		text-align: right;
	}
	.public-wrapper .conter {
		padding: 0 30upx;
	}
	.public-wrapper .conter .item {
		border-bottom: 1px solid #f7f7f7;
		height: 70upx;
		font-size: 24upx;
	}

	.public-wrapper .conter .item .turnover {
		color: #d84242;
	}
</style>
