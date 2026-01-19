<template>
	<view>
		<view class='brokerage-details'>
			<view class='header' :style="{ backgroundImage: `url(${domain}/static/images/brokerage_header_bg.png)` }">
				<view class='currentScore'>当前分销等级 </view>
				<text @click="showProtocol=true,protocol=levelRules,title='分销等级规则'" class="brokerageRule">等级规则</text>
				<view v-if="userInfo.brokerage" class='nav'>
					<image v-if="userInfo.brokerage.brokerage_icon" class="level_icon" :src="userInfo.brokerage.brokerage_icon"></image>
					<image v-else class="level_icon" :src="`${domain}/static/images/level_avatar.png`"></image>
					<text class="level_text" :style="{ backgroundImage: `url(${domain}/static/images/level_text_bg.png)` }">
						<text class="text_bg" :style="{ backgroundImage: `url(${domain}/static/images/level_text_before.png)` }"></text>
						{{userInfo.brokerage.brokerage_name}}
					</text>
				</view>
			</view>
			<view class='wrapper'>
				<view class="grade">
					<view class="grade-table">
					 <view class="tr bg-w">
						 <view class="th table-bg"><text class="text text-bg" :style="{ backgroundImage: `url(${domain}/static/images/brokerage_table_header.png)` }">等级权益</text></view>
						 <view class="th"><text class="text">一级佣金上浮</text></view>
						 <view class="th"><text class="text">二级佣金上浮</text></view>
					 </view>
					 <view class="bg-g">
						 <block v-for="(item,index) in gradeList" :key="index">
						 	 <view class="tr" :class="item.brokerage_level == (userInfo.brokerage &&userInfo.brokerage.brokerage_level) ? 'current' : ''">
						 			<view class="td td-img">
						 				<img class="table_icon" :src="item.brokerage_icon" alt="">{{item.brokerage_name}}
									</view>
						 			<view class="td">{{item.extension_one}}%</view>
						 			<view class="td">{{item.extension_two}}%</view>
						 	</view>
						 </block>
					 </view>
					</view>
				</view>
				<view class='task'>
					<view class="task_title">
						<view class="title-t"><text class="t-bg" :style="{ backgroundImage: `url(${domain}/static/images/task_line.png)` }"></text>做任务<i>.</i>提升等级</view>
						<text v-if="(userInfo.brokerage && userInfo.brokerage.brokerage_level) != (userInfo.next_brokerage && userInfo.next_brokerage.brokerage_level)" class="title-b">
							完成每级对应的任务，即可解锁下一个等级
						</text>
						<text v-else class="title-b">
							您已升至最高等级，邀请好友赚佣金吧 <text class="iconfont icon-ic_rightarrow"></text>
						</text>
					</view>
					<view class="task_status">
						<view class='process_count acea-row row-between-wrapper'>
							<view class="text_line text_line1">
								<view class="icon_count duihao"><text class="iconfont icon-ic_complete"></text></view>
								<view class="task_level level1" v-if="userInfo.brokerage">
									{{userInfo.brokerage.brokerage_name}}
									<text class="level_text">(当前等级)</text>
								</view>
							</view>
							<view class="text_line text_line2">
								<view class="task_current">
									<image v-if="userInfo.next_brokerage" class="level_current" :src="userInfo.next_brokerage.brokerage_icon"></image>
								</view>
								<view class="task_level level2" v-if="userInfo.next_brokerage">
									{{userInfo.next_brokerage.brokerage_name}}
									<text class="level_text" v-if="userInfo.brokerage && userInfo.next_brokerage">
									{{ userInfo.brokerage.brokerage_level == userInfo.next_brokerage.brokerage_level
									? '(已完成)' : '(进行中)'}}
									</text>
								</view>
							</view>
							<view v-if="userInfo.down_brokerage" class="text_line text_line3">
								<view class="icon_count suozi"><text class="iconfont icon-ic_"></text></view>
								<view class="task_level level3" v-if="userInfo.down_brokerage">
									{{userInfo.down_brokerage.brokerage_name}}
									<text class="level_text">(未解锁)</text>
								</view>
							</view>
							<view v-else class="text_line text_line3">
								<view class="icon_count quan"></view>
								<view class="task_level level3">
									<text class="level_text">已达到顶级</text>
								</view>
							</view>
						</view>
					</view>
					<!--等级任务-->
					<view class="task_item">
						<view class="title">等级任务</view>
						<view class="item" v-for="(item,index) in userInfo.brokerage_rate" :key="index">
							<view class="item-title acea-row row-between">
								<view>
									<text class="current_state">{{item.name}}</text>
									<text v-if="item.info" class="iconfont icon-icon_question" @click="showInfo(item)"></text>
								</view>
								<text class="condition">{{item.rate != 100 ? '未满足条件' : '已满足条件'}}</text>
							</view>
							<view class="task-process">
								<text class="current_val" :style="'width:'+item.rate+'%;'"></text>
							</view>
							<view class="task-experience">
								<text class="task_remain">还需要{{getNumber(item.num-item.task,index)}}{{getNnit(index)}}</text>
								<view class="count"><text class="task_now">{{item.task}}</text>/<text class="task_all">{{item.num}}</text></view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="instructions" v-if="showProtocol">
			<view class="agreement-count">
				<view class="setAgCount">
					<view class="title">{{title}}</view>
					<view class="agBox">
						<view class="content">
							<jyf-parser :html="protocol" ref="article" :tag-style="tagStyle"></jyf-parser>
						</view>
					</view>
				</view>
				<text class="icon iconfont icon-ic_close1" @click="showProtocol = false"></text>
			</view>
		</view>
		<view class="success" v-if="isShowbox">
			<view class="bg"></view>
			<view class="con" :style="{ backgroundImage: `url(${domain}/static/images/commission_bg.png)` }">
				<view class="title" :style="{ backgroundImage: `url(${domain}/static/images/commission_title.png)` }">分销等级权益</view>
				<view class="upgrade">{{type == 'level' ? '恭喜您升级啦！' :  type == 'top' ?'恭喜您' : ''}}
					<text v-if="type=='top'" class="top">已升至最高等级</text>
				</view>
				<view class="commission">
					<text class="icon_before" :style="{ backgroundImage: `url(${domain}/static/images/commission_icon.png)` }"></text>
					邀 请 好 友，赚 更 多 的 佣 金
					<text class="icon_after" :style="{ backgroundImage: `url(${domain}/static/images/commission_icon.png)` }"></text></view>
				<view class="btn" @click="close">我知道了</view>
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
	import { getBrokerageInfo, getAgreementApi, getBrokerageGrade, brokerageNotice } from '@/api/user.js';
	import { mapGetters } from "vuex";
	import emptyPage from '@/components/emptyPage.vue';
	import parser from "@/components/jyf-parser/jyf-parser";
	import { HTTP_REQUEST_URL } from '@/config/app';
	import { toLogin } from '@/libs/login.js';
	const app = getApp();
	export default {
		components: {
			emptyPage,
			"jyf-parser": parser,
		},
		data() {
			return {
				domain: HTTP_REQUEST_URL,
				userInfo:{},
				loadend: false,
				loading: false,
				loadTitle: '加载更多',
				title: '分销等级规则',
				showProtocol: false,
				protocol: '',
				tagStyle: {
					img: 'width:100%;display:block;',
					video: 'width:100%;'
				},
				gradeList: [],
				isShowbox: false,
				type: '',
				levelRules: ""
			};
		},
		computed: mapGetters(['isLogin']),
		onLoad() {
			if (this.isLogin) {
				this.getUserInfo();
				this.getGrade();
				this.upgradeRemind();
			} else {
        toLogin()
			}
			this.getAgreement();
		},
		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom: function () {

		},
		methods: {
			getUserInfo: function() {
				let that = this;
				getBrokerageInfo().then(function(res) {
					that.$set(that,'userInfo',res.data);
				}).catch(res => {
					return that.$util.Tips({
						title: res
					});
				});
			},
			/*获取等级说明*/
			getAgreement() {
				let that = this
				getAgreementApi('sys_brokerage').then(res => {
					that.levelRules = res.data.sys_brokerage
				})
			},
			/*获取等级任务*/
			getGrade(){
				let that = this;
				getBrokerageGrade().then(function(res) {
					that.gradeList = res.data;
				}).catch(res => {
					return that.$util.Tips({
						title: res
					});
				});
			},
			/*查看任务说明*/
			showInfo(item){
				this.showProtocol = true;
				this.title = item.name;
				this.protocol = item.info;
			},
			// 弹窗关闭
			close(){
				this.isShowbox = false
			},
			/*分销员升级提醒*/
			upgradeRemind(){
				let that = this;
				brokerageNotice({type: 0}).then(function(res) {
					that.isShowbox = true;
					that.type = res.data.type
				}).catch(res => {
					that.isShowbox = false;
				});
			},
			getNumber(num,task){
				let s = '';
					switch (task) {
						case 'spread_user':
							s = parseInt(num); break;
						case 'pay_num':
							s = parseInt(num); break;
							break;
						case 'spread_money':
							s = num.toFixed(2); break;
							break;
						case 'pay_money':
							s = num.toFixed(2); break;
							break;
						default :
							s = num.toFixed(2)
					}
					return(s);
			},
			/*获取任务单位*/
			getNnit(task){
				let s = '';
				switch (task) {
				  case 'spread_user':
				    s = '人'; break;
				  case 'pay_num':
				    s = '个'; break;
				    break;
				  case 'spread_money':
				    s = '元'; break;
				    break;
					case 'pay_money':
					  s = '元'; break;
					  break;
				  default :
				    s = '个'
				}
				return(s);
			}
		}
	}
</script>

<style scoped lang="scss">
	.task_status{
		margin-top: 106rpx;
		padding: 0 94rpx;
	}
	.process_count{
		position: relative;
		&:before{
			content: '';
			display: block;
			width: 100%;
			height: 4rpx;
			background-color: rgba(255,255,255,.17);
		}
		.icon_count{
			width: 50rpx;
			height: 50rpx;
			border-radius: 100%;
			border-radius: 100%;
			text-align: center;
			line-height: 50rpx;
			&.duihao{
				background-color: #E93323;
				color: #ffffff;
			}
			&.suozi{
				background-color: #FBEACE;
				display: inline-block;
			}
		}
		.text_line{
			position: relative;
			width: 33.3%;
			&.text_line3{
				text-align: right;
			}
		}
		.text_line1,.text_line3{
			top: -25rpx;
		}
		.task_current{
			width: 86rpx;
			height: 86rpx;
			margin: -43rpx auto 0;
			.level_current{
				width: 86rpx;
				height: 86rpx;
			}
		}
		.icon-duihao{
			color: #ffffff;
		}
		.icon-ic_{
			color: #000000;
		}
		.task_level{
			text-align: center;
			margin-top: 15rpx;
			position: relative;
			font-size: 24rpx;
			.level_text{
				display: block;
				margin-top: 3rpx;
				font-size: 18rpx;
			}
			&.level1{
				left: -70rpx;
				color: #FFFFFF;
			}
			&.level2{
				color: #FBEACE;
				font-size: 30rpx;
			}
			&.level3{
				right: -70rpx;
				color: #FFFFFF;
				opacity: 0.6;
			}
		}
		.quan{
			display: inline-block;
			width: 24rpx;
			height: 24rpx;
			background-color: #404040;
			border-radius: 100%;
			position: absolute;
			right: -12rpx;
			top: -30rpx;
		}
	}
	.brokerage-details .task_item{
		background-color: #FBEACE;
		border-radius: 30rpx;
		margin: 50rpx 20rpx 0;
		padding: 38rpx 25rpx;
		position: relative;
		&:before{
			content: "";
			display: block;
			border: 20rpx solid transparent;
			border-bottom-color: #FBEACE;
			position: absolute;
			top: -38rpx;
			left: 50%;
			margin-left: -20rpx;
		}
		.title{
			color: #282828;
			font-size: 36rpx;
			font-weight: bold;
			text-align: left;
		}
		.item{
			margin-top: 20rpx;
			padding: 25rpx 30rpx 20rpx;
			background: #fff;
			border-radius: 12rpx;
			position: relative;
			&:before{
				content: "";
				display: block;
				width: 6rpx;
				height: 28rpx;
				background-color: #E93323;
				position: absolute;
				top: 30rpx;
				left: 0;
			}
		}
		.item-title{
			position: relative;
			text-align: left;
			.icon-icon_question{
				margin-left: 8rpx;
				color: #d5d5d5;
				font-size: 34rpx;
			}
			.current_state{
				font-size: 28rpx;
				font-weight: 700;
			}
			.condition{
				color: #999999;
				font-size: 26rpx;
				float: right;
			}
		}
		.task-process{
			margin-top: 36rpx;
			width: 100%;
			height: 12rpx;
			border-radius: 6rpx;
			background: #E5E5E5;
			position: relative;
			.current_val{
				display: block;
				width: 50%;
				height: 12rpx;
				background: linear-gradient(90deg, #E93323 0%, #FFA363 100%);
				border-radius: 6rpx;
				position: absolute;
				top: 0;
				left: 0;
			}
		}
		.task-experience{
			margin-top: 20rpx;
			color: #999999;
			text-align: left;
			.count{
				float: right;
				.task_now{
					color: #E93323;
				}
			}
		}
	}
	.brokerage-details{
		min-height: 100vh;
		background-color: #1F1F1F;
		padding-top: 60rpx;
	}
	.brokerage-details .header {
		position: relative;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		width: 100%;
		height: 490rpx;
		font-size: 72rpx;
		color: #fff;
		box-sizing: border-box;
		text-align: center;
		.brokerageRule{
			font-size: 22rpx;
			color: #FBEACE;
			padding: 8rpx 23rpx;
			border: 1px solid #FBEACE;
			border-radius: 26rpx;
			position: absolute;
			top: 40rpx;
			right: 20rpx;
		}
	}
	.brokerage-details .task{
		text-align: center;
		padding-bottom: 40rpx;
		.title-t{
			width: 438rpx;
			font-size: 46rpx;
			color: #FBEACE;
			font-weight: bold;
			margin:0 auto 18rpx;
			display: inline-block;
			position: relative;
			.t-bg{
				display: block;
				width: 438rpx;
				height: 17rpx;
				background-size: cover;
				position: absolute;
				top: 50%;
				margin-top: -8rpx;
				left: 0;
			}
			i{
				display:inline-block;
				font-size: 40rpx;
				font-weight: bold;
				font-style: normal;
				padding: 0 10rpx;
				position: relative;
				top: -10rpx;
			}
		}
		.title-b{
			font-size: 28rpx;
			color: #FBEACE;
			opacity: .7;
			display: block;
			.icon-ic_rightarrow{
				font-size: 16rpx;
				display: inline-block;
				margin-left: 6rpx;
			}
		}
	}
	.brokerage-details .header .currentScore {
		font-size: 28rpx;
		color: #FFFFFF;
		text-align: center;
		margin-bottom: 11rpx;
	}
	.brokerage-details .header .line {
		width: 60rpx;
		height: 3rpx;
		background-color: #fff;
		margin: 20rpx auto 0 auto;
	}
	.brokerage-details .header .nav {
		flex: 1;
		margin-top: 35rpx;
		.level_icon{
			width: 147rpx;
			height: 147rpx;
		}
		.level_text{
			display: block;
			width: 150rpx;
			text-align: center;
			font-size: 22rpx;
			font-weight: bold;
			color: #FBEACE;
			padding: 8rpx 0;
			margin: 0 auto;
			position: relative;
			top: -50rpx;
			background-size: cover;
			.text_bg{
				display: block;
				width: 204rpx;
				height: 35rpx;
				background-size: cover;
				position: absolute;
				top: -6rpx;
				left: 50%;
				margin-left: -102rpx;
			}
		}
	}
	.brokerage-details .grade{
		padding: 0 20rpx;
		position: relative;
		top: -100rpx;
		.grade-table{
			width: 710rpx;
			background: #ffffff;
			border-radius: 20rpx;
			text-align: center;
			border-spacing: 0;
			box-sizing: border-box;
			padding-bottom: 10rpx;
			max-height: 600rpx;
			overflow-y: scroll;
			.bg-w{
				position: relative;
			}
			.bg-g{
				padding: 0 6rpx;
			}
			.current{
				border: 1px solid #CCA25D;
				border-radius: 10rpx;
			}
			.th,.td{
				font-size: 24rpx;
				width: 231.66rpx;
				display: inline-block;
				padding: 10rpx;
			}
			.td-img{
				text-align: left;
				padding-left: 36rpx;
			}
			.th{
				color: #666666;
			}
			.td{
				height: 64rpx;
				color: #282828;
				font-weight: bold;
			}
			.table_icon{
				width: 34rpx;
				height: 34rpx;
				margin-right: 10rpx;
				position: relative;
				top: 10rpx;
			}
			.table-bg{
				color: #FBEACE;
				min-width: 213rpx;
				height: 70rpx;
				line-height: 70rpx;
				.text-bg{
					background-size: 100%;
					text-align: left;
					padding-left: 20rpx;
					position: absolute;
					top: -2rpx;
					left: -2rpx;
					width: 213rpx;
					height: 70rpx;
					border-radius: 20rpx 0 0 0;
				}
			}
			.text{
				position: relative;
				top: -20rpx;
			}
		}
	}
	.success{
		z-index: 10;
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		.bg{
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			background-color: rgba(0,0,0,.5);
		}
		.commission{
			font-size: 18rpx;
			color: #2F2B31;
			width: 100%;
			position: absolute;
			top: 240rpx;
			left: -20rpx;
			text-align: center;
			.icon_before,.icon_after{
				display: block;
				width: 52rpx;
				height: 10rpx;
				position: absolute;
				/* #ifdef MP || APP-PLUS */
				top: 9rpx;
				/* #endif */
				/* #ifdef H5 */
				top: 12rpx;
				/* #endif */
				background-size: cover;
			}
			.icon_before{
				/* #ifdef MP || APP-PLUS */
				left: 120rpx;
				/* #endif */
				/* #ifdef H5 */
				left: 72rpx;
				/* #endif */

			}
			.icon_after{
				/* #ifdef MP || APP-PLUS */
				right: 126rpx;
				/* #endif */
				/* #ifdef H5 */
				right: 76rpx;
				/* #endif */
				transform: rotateY(180deg);
			}
		}
		.title{
			width: 245rpx;
			height: 69rpx;
			background-size: cover;
			color: #FBEACE;
			text-align: center;
			position: absolute;
			top: 0;
			left: 50%;
			margin-left: -122rpx;
			line-height: 60rpx;
			font-size: 26rpx;
		}
		.upgrade{
			font-size: 58rpx;
			text-align: ceter;
			color: #CC6C34;
			text-align: center;
			width: 100%;
			position: absolute;
			left: 0;
			top: 90rpx;
			font-weight: bold;
			font-family: 'Tahoma, Geneva, Verdana, sans-serif';
			.top{
				display: block;
				font-size: 46rpx;
			}
		}
		.con{
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translate(-50%,-50%);
			width:561rpx;
			height:533rpx;
			background-size: cover;
			.btn{
				position: absolute;
				width:380rpx;
				height:70rpx;
				left: 50%;
				margin-left: -200rpx;
				bottom: 47rpx;
				line-height: 70rpx;
				text-align: center;
				color: #6C250F;
				background: linear-gradient(90deg, #fcebc1 0%, #f1ae5b 100%);
				border-radius:35rpx;
				font-size: 28rpx;
			}
		}
	}
</style>
