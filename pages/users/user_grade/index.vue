<template>
	<view class="user-grade">
		<view class="head">
			<view class="user-card">
				<view class="bg" :style="{ 'background-image': `url(${domain}/static/images/user_card_bg.png)`}"></view>
				<view class="user-info acea-row">
					<image class="avatar" :src="userInfo.avatar" v-if="userInfo.avatar"></image>
					<image v-else class="avatar" src="/static/images/f.png"></image>
					<view class="info">
						<view class="name" v-if="userInfo.uid">
							{{userInfo.nickname}}
						</view>
					</view>
					<view class="grade" v-if="curLevel && curLevel.brokerage_icon"><image class="image" :src="curLevel.brokerage_icon" alt="" /></view>
					<view class="vip" v-if="userInfo.is_svip > 0 && svip_switch_status == 1">
						<image :src="`${domain}/static/images/svip.png`"></image>
					</view>
					<view @click="showProtocol=true" class="rule acea-row row-center-wrapper">
						<view>规则说明</view>
						<text class="iconfont icon-icon_question"></text>
					</view>
				</view>
			</view>
			<view v-if="next_level" class="card-wrapper" :style="'background-image: url('+brokerage_bg+')'">
				<view class="growth">
					<view class="info">今日获得成长值{{growthValue}}点</view>
				</view>
				<view class="wait">
					<view v-if="next_level.brokerage_rule&&next_level.brokerage_rule.value == 0" class="wait_count">
						<text class="text">当前成长值{{member_value || 0}}点</text>
						<navigator class="iconfont icon-ic_rightarrow" url="/pages/users/user_grade_list/index" hover-class='none'></navigator></text>
					</view>
					<view v-else class="wait_count">
						<text class="text">{{member_value || 0}}成长值 距</text>
						<text class="value">{{next_level.brokerage_name ? next_level.brokerage_name : ''}}</text>
						<text class="text">还差{{next_level.brokerage_rule && next_level.brokerage_rule.value ? next_level.brokerage_rule.value-member_value : 0 }}点
						<navigator class="iconfont icon-ic_rightarrow" url="/pages/users/user_grade_list/index" hover-class='none'></navigator></text>
					</view>
					<view class="progress"><text class="current_value" :style="'width:'+curPercent+'%'"></text></view>
				</view>
			</view>
		</view>
		<view class="grade_main">
			<view v-if="gradeList.length > 0" class="grade_privilege" :style="{ 'background-image': `url(${domain}/static/images/grade-privilege.png)`}">
				<view class="title">会员可专项优质特权</view>
				<view class="grade_list acea-row row-between-wrapper">
					<view v-for="(item,index) in gradeList" class="item acea-row" :key="index">
						<view class="picture" :class="item.status == 0 ? 'isLocked' : ''">
							<image class="bg_image" :src="item.pic"></image>
							<view class="suozi" v-if="item.status == 0">
								<image class="image" :src="`${domain}/static/images/suozi.png`"></image>
							</view>
						</view>
						<view class="desc">
							<view class="name line1">{{item.name}}</view>
							<view class="detail line1">{{item.info}}</view>
						</view>
					</view>
				</view>
			</view>
			<view class="upgrade">
				<view class="title acea-row row-center-wrapper">
					<image :src="`${domain}/static/images/grade_title.png`"></image>
					<view class="name">快速升级技巧</view>
					<image :src="`${domain}/static/images/grade_title.png`" class="right"></image>
				</view>
				<view class="upgrade-svip acea-row">
					<view class="svip-view acea-row">
						<image :src="`${domain}/static/images/upgrade_icon.png`"></image>
						<text>{{userInfo.is_svip > 0 && svip_switch_status == 1 ? 'SVIP 会员中心，惊喜多多！' : '升级成为SVIP，成长值奖励可翻倍哦！'}}</text>
					</view>
					<navigator v-if="userInfo.is_svip > 0 && svip_switch_status == 1" url="/pages/annex/vip_center/index" class="svip-btn" hover-class="none">去看看<text class="iconfont icon-ic_rightarrow"></text></navigator>
					<navigator v-else url="/pages/annex/vip_paid/index" class="svip-btn" hover-class="none">立即开通<text class="iconfont icon-ic_rightarrow"></text></navigator>
				</view>
				<view class="upgrade-main">
					<view class="item acea-row row-between-wrapper">
						<view class="item-icon"><text class="iconfont icon-ic_pencil"></text></view>
						<view>
							<view class="name">
								签到
								<text class="add"><text class="iconfont icon-ic_leaf"></text>+{{valueList.member_sign_num}}点成长值</text>
							</view>
							<view class="text">每日签到可获得经验值</view>
						</view>
						<view v-if="userInfo.sign_status" class="get_btn">已完成</view>
						<navigator v-else class="get_btn" hover-class='none' url='/pages/users/user_sgin/index'>去完成</navigator>
					</view>
					<view class="item acea-row row-between-wrapper">
						<view class="item-icon"><text class="iconfont icon-a-ic_ShoppingBag2"></text></view>
						<view>
							<view class="name">
								购买商品<text class="add"><text class="iconfont icon-ic_leaf"></text>+{{valueList.member_pay_num}}点成长值</text></view>
							<view class="text">购买商品可获得对应的成长值</view>
						</view>
						<navigator class="get_btn" open-type='switchTab' hover-class='none' url='/pages/index/index'>去完成</navigator>
					</view>
					<view class="item acea-row row-between-wrapper">
						<view class="item-icon"><text class="iconfont icon-icon_Like_2"></text></view>
						<view>
							<view class="name">
								评价商品<text class="add"><text class="iconfont icon-ic_leaf"></text>+{{valueList.member_reply_num}}点成长值</text></view>
							<view class="text">评价商品可获得对应的成长值</view>
						</view>
						<navigator class="get_btn" hover-class='none' url='/pages/users/order_list/index?status=3'>去完成</navigator>
					</view>
					<view class="item acea-row row-between-wrapper">
						<view class="item-icon"><text class="iconfont icon-ic_friends"></text></view>
						<view>
							<view class="name">
								邀请好友<text class="add"><text class="iconfont icon-ic_leaf"></text>+{{valueList.member_share_num}}点成长值</text></view>
							<view class="text">邀请好友注册商城可获得成长值</view>
						</view>
						<view class="get_btn" @click="shareIntegral">去完成</view>
					</view>
					<view v-if="valueList.member_community_num" class="item acea-row row-between-wrapper">
						<view class="item-icon"><text class="iconfont icon-ic_camera2"></text></view>
						<view>
							<view class="name">
								发布种草
								<text class="add">+{{valueList.member_community_num}}点成长值</text></view>
							<view class="text">发布一条种草可获得成长值</view>
						</view>
						<navigator class="get_btn" hover-class='none' url='/pages/plantGrass/plant_release/index'>去完成</navigator>
					</view>
				</view>
			</view>
		</view>
		<view class='hotList'>
			<recommend v-if="recommend_switch == 1" :hostProduct='hostProduct' :isLogin="isLogin"></recommend>
		</view>
		<view class="instructions" v-if="showProtocol">
			<view class="agreement-count">
				<view class="setAgCount">
					<view class="title">会员规则</view>
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
			<view class="con" :style="{ 'background-image': `url(${domain}/static/images/grade-success-bg.png)`}">
				<view class="title">
					<text class="title-icon icon-left" :style="{ 'background-image': `url(${domain}/static/images/grade-title-icon.png)`}"></text>
					恭喜您升级为
					<text class="title-icon icon-right" :style="{ 'background-image': `url(${domain}/static/images/grade-title-icon.png)`}"></text>
				</view>
				<view class="upgrade">
					{{upgradeInfo.brokerage_name}}
				</view>
				<view class="level">
					<image class="imgae" :src="upgradeInfo.brokerage_icon"></image>
				</view>
				<view class="btn" @click="close">查看我的权益</view>
				<view class='iconfont icon-ic_close1' @click="close"></view>
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
	import { getUserInfo, getInstructions, memberInfo, brokerageNotice } from '@/api/user.js';
	import { getProductHot } from '@/api/store.js';
	import recommend from '@/components/recommend';
	import { mapGetters } from "vuex";
	import { configMap } from '@/utils';
	import parser from "@/components/jyf-parser/jyf-parser";
	import { toLogin } from '@/libs/login.js';
	import { HTTP_REQUEST_URL } from '@/config/app';
	export default {
		components: {
			recommend,
			"jyf-parser": parser,
		},
		data() {
			return {
				domain: HTTP_REQUEST_URL,
				loading: false, //是否加载中
				loadend: false, //是否加载完毕
				loadTitle: '加载更多', //提示语
				userInfo: {},
				protocol: '',
				showProtocol: false,
				tagStyle: {
					img: 'width:100%;display:block;',
					video: 'width:100%;'
				},
				gradeList: [],
				hostProduct: [],
				hotScroll: false,
				hotPage: 1,
				hotLimit: 10,
				isShowbox: false,
				curLevel: {},
				next_level: {},
				growthValue: '',
				brokerage_bg: '',
				member_value: '',
				curPercent: '',
				valueList: {},
				upgradeInfo: {}
			};
		},
		computed: configMap({hide_mer_status: 1,recommend_switch:0,svip_switch_status:0},mapGetters(['isLogin'])),
		onLoad() {
			if (this.isLogin) {
				this.getInstructions();
				this.getUserInfo();
				this.getHostProduct();
				this.getMemberInfo();
				this.upgradeRemind();
			} else {
				toLogin()
			}
		},
		methods: {
			/**
			 * 获取个人用户信息
			 */
			getUserInfo: function() {
				let that = this;
				getUserInfo().then(res => {
					that.userInfo = res.data
				});
			},
			shareIntegral(){
				uni.setStorageSync('isIntegral',true)
				uni.switchTab({
					url: '/pages/index/index'
				});
			},
			// 推荐列表
			getHostProduct: function() {
				let that = this;
				getProductHot(1,10).then(res => {
					that.hostProduct = res.data.list
				});
			},
			/*升级提醒*/
			upgradeRemind(){
				let that = this;
				brokerageNotice({type: 1}).then(function(res) {
					that.isShowbox = true;
					that.upgradeInfo = res.data.level;
				}).catch(res => {
					that.isShowbox = false;
				});
			},
			// 获取佣金说明
			getInstructions() {
				getInstructions('sys_member').then(res => {
					if(res.status == 200) {
						this.protocol = res.data.sys_member
					}
				})
			},
			// 获取会员信息
			getMemberInfo(){
				let that = this;
				memberInfo().then(res => {
					let info = res.data
					let value = info.next_level && info.next_level.brokerage_rule || null;
					this.curLevel = info.member;
					this.gradeList = info.interests;
					this.next_level = info.next_level ? info.next_level : null;
					this.growthValue = info.today;
					this.brokerage_bg = info.member && info.member.brokerage_rule && info.member.brokerage_rule.image || value && value.image || '';
					this.member_value = info.member_value;
					this.curPercent = (value && value.value!=0) ? ((info.member_value/value.value)*100).toFixed(2) : 100;
					this.valueList = info.config;
				}).catch(err => {
					this.$util.Tips({
						title: err
					});
					setTimeout(()=>{
						uni.switchTab({
							url: '/pages/user/index',
						});
					},1000)
				})
			},
			// 弹窗关闭
			close(){
				this.isShowbox = false
			},
		},
		// 滚动监听
		onPageScroll() {
			uni.$emit('scroll');
		},
	}
</script>

<style scoped lang="scss">
	.user-grade {
		background: #fff;
		.head {
			height: 500rpx;
			.user-card {
				position: relative;
				width: 100%;
				padding: 60rpx 0 200rpx;
				background: #181818;
				.bg {
					position: absolute;
					left: 0;
					top: 0;
					width: 100%;
					height: 100%;
					background-size: 100% 100%;
				}
				.user-info {
					z-index: 20;
					position: relative;
					display: flex;
					padding: 0 40rpx;
					align-items: center;
					.vip {
						width: 82rpx;
						height: 36rpx;
						margin-left: 20rpx;
						image {
							width: 82rpx;
							height: 36rpx;
						}
					}
					.rule{
						color: #AAAAAA;
						font-size: 24rpx;
						position: absolute;
						top: 50%;
						right: 40rpx;
						margin-top: -16rpx;
						.iconfont{
							font-size: 26rpx;
							margin-left: 6rpx;
						}
					}
					.avatar {
						width: 84rpx;
						height: 84rpx;
						border-radius: 50%;
					}
					.info {
						margin-left: 20rpx;
						padding: 15rpx 0;
						.name {
							display: flex;
							align-items: center;
							color: #fff;
							font-size: 31rpx;
							.vip {
								display: flex;
								align-items: center;
								height: 36rpx;
								padding: 0 20rpx;
								background: rgba(0, 0, 0, 0.2);
								border-radius: 18px;
								font-size: 20rpx;
								margin-left: 12rpx;
								image {
									width: 27rpx;
									height: 27rpx;
								}
							}
						}
						.num {
							display: flex;
							align-items: center;
							font-size: 26rpx;
							color: rgba(255, 255, 255, 0.6);
							image {
								width: 22rpx;
								height: 23rpx;
								margin-left: 20rpx;
							}
						}
					}
					.grade{
						width: 40rpx;
						height: 37rpx;
						margin-left: 10rpx;
						.image, uni-image{
							width: 40rpx;
							height: 37rpx;
						}
					}
				}
			}
		}
		.card-wrapper{
			background-size: cover;
			border-radius: 26rpx;
			width: 690rpx;
			height: 314rpx;
			margin: 0 auto;
			position: relative;
			top: -157rpx;
			padding: 100rpx 40rpx 45rpx;
			.title{
				font-size: 40rpx;
				color: #D16739;
			}
			.info{
				color: #333333;
				font-size: 26rpx;
				margin-top: 20rpx;
				opacity: .5;
			}
			.wait{
				margin-top: 50rpx;
				.wait_count{
					color: #333333;
					.text{
						opacity: .7;
						font-size: 24rpx;
					}
					.value{
						color: #282828;
						opacity: .7;
						font-weight: bold;
						font-size: 34rpx;
						margin: 0 6rpx;
					}
					.iconfont{
						font-size: 14rpx;
						color: #333333;
						display: inline-block;
						margin-left: 4rpx;
					}
				}
				.progress{
					width: 350rpx;
					height: 8rpx;
					margin-top: 15rpx;
					position: relative;
					&::after{
						content: "";
						display: inline-block;
						width: 350rpx;
						height: 8rpx;
						background-color: #333;
						border-radius: 13rpx;
						opacity: .3;
						position: absolute;
						top: 0;
						left: 0;
					}
					.current_value{
						display: inline-block;
						width: 240rpx;
						height: 8rpx;
						background-color: #333;
						border-radius: 13rpx;
						position: absolute;
						top: 0;
						left: 0;
						z-index: 5;
					}
				}
			}
			.brokerage_icon{
				width: 177rpx;
				height: 212rpx;
				position: absolute;
				right: 60rpx;
				top: 0;
			}
		}
		.grade_main{
			text-align: center;
			padding: 0 30rpx;
			.grade_privilege{
				.title{
					display: inline-block;
					color: #786046;
					font-size: 32rpx;
					font-weight: bold;
					padding: 44rpx 54rpx 20rpx;
					background-size: 100%;
				}
				.grade_list {
					.item{
						width: 330rpx;
						height: 135rpx;
						box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.08);
						background: #ffffff;
						border-radius: 10rpx;
						padding: 25rpx 25rpx;
						margin-top: 24rpx;
						.picture{
							width: 80rpx;
							height: 80rpx;
							border-radius: 100%;
							position: relative;
							background-color: #FAF1E4;
							image,uni-image{
								width: 80rpx;
								height: 80rpx;
								border-radius: 100%;
							}
							&.isLocked{
								background-color: #E8E8E8;
								image,uni-image{
									filter: grayscale(100%);
									filter: gray;
									opacity: .5;
								}
							}
							.suozi{
								width: 26rpx;
								height: 26rpx;
								position: absolute;
								bottom: 0;
								right: 0;
								.image,uni-image,image{
									width: 26rpx;
									height: 26rpx;
									filter: none;
									opacity: 1;
								}
							}
						}
						.desc{
							margin-left: 20rpx;
							text-align: left;
							.name{
								max-width: 180rpx;
								font-size: 32rpx;
								color: #282828;
							}
							.detail{
								font-size: 24rpx;
								color: #666666;
								max-width: 180rpx;
								margin-top: 6rpx;
							}
						}
					}
				}
			}
			.upgrade{
				margin-top: 50rpx;
				text-align: left;
				.title{
					font-size: 32rpx;
					color: #282828;
					font-weight: bold;
					.name{
						margin: 0 19rpx;
					}
					image {
						width: 119rpx;
						height: 15rpx;
						&.right {
							transform: rotate(180deg);
						}
					}
				}
				.upgrade-svip{
					margin: 40rpx 0;
					background: #FFF7EC;
					border-radius: 36rpx;
					padding: 16rpx 20rpx;
					font-size: 24rpx;
					justify-content: space-between;
					.svip-view{
						color: #AE6908;
						align-items: center;
						justify-content: center;
						image{
							width: 32rpx;
							height: 32rpx;
							margin-right: 6rpx;
						}
					}
					.svip-btn{
						color: #B37400;
						font-size: 22rpx;
						.icon-ic_rightarrow{
							margin-left: 6rpx;
							font-size: 20rpx;
						}
					}
				}
				.upgrade-main{
					margin-top: 15rpx;
				}
				.item{
					padding: 40rpx 0 30rpx;
					border-bottom: 1px solid #F5F5F5;
					position: relative;
					padding-left: 100rpx;
					.item-icon{
						width: 78rpx;
						height: 78rpx;
						display: flex;
						background: #FFF7EC;
						align-items: center;
						justify-content: center;
						position: absolute;
						top: 40rpx;
						left: 0;
						border-radius: 100%;
						.iconfont{
							font-size: 40rpx;
							color: #DFA759;
						}
					}
				}
				.name{
					font-size: 30rpx;
					color: #282828;
					.add{
						color: #AE6908;
						font-size: 22rpx;
						margin-left: 12rpx;
						.iconfont{
							font-size: 26rpx;
							color: #FFBD09;
						}
					}
				}
				.text{
					font-size: 22rpx;
					color: #999999;
					margin-top: 6rpx;
				}
				.get_btn{
					display: flex;
					align-items: center;
					justify-content: center;
					width: 136rpx;
					text-align: center;
					height: 58rpx;
					color: #AE6908;
					font-size: 26rpx;
					background: #FFDDAC;
					border-radius: 29rpx;
				}
			}
		}
	}
	.hotList{
		margin-top: 30rpx;
		background: linear-gradient( 180deg, #FFFFFF 0%, #F5F5F5 100%);
	}
	.success{
		z-index: 10;
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		text-align: center;
		.bg{
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			background-color: rgba(0,0,0,.5);
		}
		.level{
			width: 222rpx;
			height: 203rpx;
			margin: 20rpx auto 0;
			uni-image,image{
				width: 222rpx;
				height: 203rpx;
			}
		}
		.title{
			color: #CD8D33;
			font-weight: bold;
			font-size: 36rpx;
			margin: 0 auto;
			display: inline-block;
			font-size: 26rpx;
			width: 285rpx;
			margin-top: 96rpx;
			position: relative;
			.title-icon{
				display: block;
				width: 52rpx;
				height: 10rpx;
				position: absolute;
				/* #ifdef MP || APP-PLUS */
				top: 9rpx;
				/* #endif */
				/* #ifdef H5 */
				top: 14rpx;
				/* #endif */
				background-size: cover;
			}
			.icon-left{
				/* #ifdef MP || APP-PLUS */
				left: 0;
				/* #endif */
				/* #ifdef H5 */
				left: 0;
				/* #endif */
			}
			.icon-right{
				/* #ifdef MP || APP-PLUS */
				right: 0;
				/* #endif */
				/* #ifdef H5 */
				right: 0;
				/* #endif */
				transform: rotateY(180deg);
			}
		}
		.upgrade{
			font-size: 60rpx;
			text-align: ceter;
			color: #CC6C34;
			text-align: center;
			width: 100%;
			font-weight: bold;
			margin-top: 10rpx;
			font-family: 'Tahoma, Geneva, Verdana, sans-serif';
		}
		.con{
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translate(-50%,-50%);
			width:557rpx;
			height:660rpx;
			background-size: cover;
			.btn{
				position: absolute;
				width:380rpx;
				height:70rpx;
				left: 50%;
				margin-left: -185rpx;
				bottom: 77rpx;
				line-height: 70rpx;
				text-align: center;
				color: #9A5D08;
				background: linear-gradient(90deg, #EBBD7B 0%, #FFDDAC 100%);
				border-radius:35rpx;
				font-size: 28rpx;
			}
			.icon-ic_close1{
				color: #ffffff;
				font-size: 42rpx;
				position: absolute;
				bottom: -80rpx;
				left: 252rpx;
			}
		}
	}


</style>
