<template>
	<view :style="viewColor">
		<!-- 自定义顶部背景颜色 -->
		<view class="top">
			<!-- #ifdef MP || APP-PLUS -->
			<view class="sys-head fixed">
				<view class="sys-bar" :style="{height:sysHeight}"></view>
				<!-- #ifdef MP -->
				<view class="sys-title">
					<view class='iconfont icon-ic_leftarrow' @tap='goBack'></view>
					签到
				</view>
				<!-- #endif -->
				<view class="bg"></view>
			</view>
			<!-- #endif -->
		</view>
		<view class='sign' :style="{marginTop:marTop}">
		    <view class='header'>
		       <view class='headerCon acea-row row-between-wrapper'>
		          <view class='left acea-row row-between-wrapper'>
		             <view class='pictrue'><image :src='userInfo.avatar || "/static/images/f.png"'></image></view>
		             <view class='text'>
		                 <view class='line1'>{{userInfo.nickname}}</view>
		                 <view class='integral acea-row'><text>积分: {{userInfo.integral ? userInfo.integral : 0}}</text></view>
		             </view>
		          </view>
		          <navigator class='right acea-row row-middle row-center' hover-class='none' url='/pages/users/user_sgin_list/index'>
							 <view class='iconfont icon-icon_menu'></view>
							 <view>明细</view>
		          </navigator>
		       </view>
		   </view>
		   <view class='wrapper boder-24'>
		      <view class='list acea-row row-between-wrapper'>
		         <view class='item' v-for="(item,index) in combineSignConfig" :key="index">
		            <view :class="{ rewardTxt: item.isCurrentDay }">{{item.value.sign_day}}</view>
								<view v-if="item.isSign" class="venus venusSelect" :style="{ 'background-image': `url(${domain}/static/images/sign-venus-selected.png)`}"></view>
								<view v-else-if="index + 1 === signConfig.length" class="venus reward" :style="{ 'background-image': `url(${domain}/static/images/sign-venus-last.png)`}"></view>
								<view v-else class="venus" :style="{ 'background-image': `url(${domain}/static/images/sign-venus.png)`}"></view>
		            <view class='num' :class='item.isSign ? "on" : ""'>+{{item.value.sign_integral}}</view>
		         </view>
		      </view>
		      <button class='but b-color on' v-if="is_sign">已签到</button>
		      <form @submit="goSign" report-submit='true' v-else>
		        <button class='but b-color' :class="disabled ? 'disabled' : ''" formType="submit">立即签到</button>
		      </form>
		      <view class='lock' :style="{ 'background-image': `url(${domain}/static/images/sign-lock.png)`}"></view>
		   </view>
		   <view class='wrapper wrapper2 boder-24'>
		      <view class='tip'>已累计签到</view>
		      <view class='list2 acea-row row-center row-bottom'>
		         <view class='item'>{{signCount[0] || 0}}</view>
		         <view class='item'>{{signCount[1] || 0}}</view>
		         <view class='item'>{{signCount[2] || 0}}</view>
		         <view class='item'>{{signCount[3] || 0}}</view>
		         <view class='data'>天</view>
		      </view>
		      <view class='tip2'>据说连续签到第7天可获得超额积分，一定要坚持签到哦~~~</view>
		      <view class='list3'>
		         <view class='item acea-row' v-for="(item,index) in signList" :key="index">
		            <view>
		               <view class='name line1'>{{item.title}}</view>
		               <view class='data'>{{item.create_time}}</view>
		            </view>
		            <view class='num semiBold'>+{{item.number}}</view>
		         </view>
		         <view class='loading' @click='goSignList' v-if="signList.length >= 3">点击加载更多<text class='iconfont icon-ic_rightarrow'></text></view>
		      </view>
		   </view>
		   <view class='signTip acea-row row-center-wrapper' :class='active==true?"on":""'>
		      <view class='signTipLight loadingpic' :style="'background-image: url('+domain+'/static/images/sign-rotate-bg.png)'"></view>
		      <view class='signTipCon' :style="'background-image: url('+domain+'/static/diy/signSuccess'+keyColor+'.png)'">
		        <view class='state'>签到成功</view>
		        <view class='integral'>获得{{integral}}积分</view>
		        <view class='signTipBnt' @click='close'>好的</view>
		      </view>
					<view class="iconfont icon-ic_close1" @click='close'></view>
		   </view>
		   <view class='mask' @touchmove.stop.prevent="false" :hidden='active==false'></view>
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
	 let sysHeight = uni.getSystemInfoSync().statusBarHeight + 'px';
	 import { mapGetters } from "vuex";
	 import { getSignUser, getSignList, setSignIntegral} from '@/api/user.js';
	 import { HTTP_REQUEST_URL } from '@/config/app';
	 import { toLogin } from '@/libs/login.js';
	 import dayjs from "@/plugin/dayjs/dayjs.min.js";
	 export default {
		components: {},
	 	data() {
	 		return {
				sysHeight: sysHeight,
				//#ifdef H5
				marTop: 0,
				//#endif
				//#ifndef H5
				marTop: uni.getSystemInfoSync().statusBarHeight+43+'px',
				//#endif
				domain: HTTP_REQUEST_URL,
				active:false,
				userInfo:{},
				signConfig: [],
				signCount:[],
				signSystemList:[],
				signList:[],
				integral:0,
				day:0,
				sign_index:0,
				is_sign: false, //是否签到
				disabled: false
	 		};
	 	},
	 	computed: {
			...mapGetters(['isLogin','viewColor','keyColor']),
			combineSignConfig() {
				if (!this.signList.length || !this.signConfig.length) return [];
				const signRecordMap = this.signList.reduce((acc, item) => {
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
	 	onLoad(){
	 		if(this.isLogin){
	 			this.getUserInfo();
	 			this.getSignList();
	 		}else{
				toLogin()
	 		}
	 	},
	 	methods: {
			goBack: function() {
				uni.navigateBack();
			},
			/**
			    * 去签到记录页面
			    *
			*/
			goSignList:function(){
			  return this.$util.Tips('/pages/users/user_sgin_list/index');
			},
			/**
			 * 获取用户信息
			*/
			getUserInfo:function(){
			  let that=this;
			  getSignUser().then(res=>{
			    res.data.integral = parseInt(res.data.integral);
			    let sum_sgin_day = res.data.count;
				that.$set(that,'signConfig',res.data.title);
				that.$set(that,'is_sign',res.data.is_sign);
				that.$set(that,'userInfo',res.data.userInfo);
				that.signCount = that.PrefixInteger(sum_sgin_day, 4);
				that.sign_index = res.data.sign_num;
			  });
			},
			/**
			 * 获取签到列表
			 *
			*/
			getSignList:function(){
			  let that=this;
			  getSignList({page:1,limit:7}).then(res=>{
				  that.$set(that,'signList',res.data.list);
			  })
			},
			/**
			 * 数字转中文
			 *
			*/
			Rp: function (n) {
			  let cnum = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
			  let s = '';
			  n = '' + n; // 数字转为字符串
			  for (let i = 0; i < n.length; i++) {
			    s += cnum[parseInt(n.charAt(i))];
			  }
			  return s;
			},

			/**
			 * 数字分割为数组
			 * @param int num 需要分割的数字
			 * @param int length 需要分割为n位数组
			*/
			PrefixInteger: function (num, length) {
			  return (Array(length).join('0') + num).slice(-length).split('');
			},
			/**
			 * 用户签到
			*/
			goSign:function(e){
			  let that = this, sum_sgin_day = that.signConfig.sign_num;
			  if (that.userInfo.is_day_sgin) return this.$util.Tips({title:'您今日已签到!'});
			  that.disabled = true;
			  setSignIntegral().then(res=>{
				  that.active = true;
				  that.integral = res.data.integral;
				  that.sign_index = (that.sign_index + 1) > that.signConfig.title.length ? 1 : that.sign_index + 1;
				  that.signCount = that.PrefixInteger(sum_sgin_day + 1, 4);
				  that.$set(that.userInfo,'is_sgin',true);
				  that.$set(that.userInfo,'integral',that.$util.$h.Add(that.userInfo.integral, res.data.integral));
					that.getSignList();
			  }).catch(err=>{
				 that.disabled = false;
			    return this.$util.Tips({title:err})
			  });
			},
			/**
			 * 关闭签到提示
			*/
			close:function(){
			   this.active = false;
			   this.getSignList();
			   this.getUserInfo();
			}
	 	}
	 }
</script>

<style scoped lang="scss">
	.sys-head .bg { background-color: var(--view-theme); }
	.sign .header{width:100%;height:310rpx;background:var(--view-theme);}
	.sign .header .headerCon{padding:0 0 0 30rpx;height:234rpx;}
	.sign .header .headerCon .left{width:530rpx;font-size:32rpx;color:#fff;font-weight:bold;}
	.sign .header .headerCon .left .integral text{font-size:24rpx;margin-top:19rpx;background-color:#ff9000;text-align:center;border-radius:6rpx;font-weight:normal;padding:4rpx 15rpx;}
	.sign .header .headerCon .text{width:410rpx;}
	.sign .header .headerCon .left .pictrue{width:100rpx;height:100rpx;border-radius:50%;border:4rpx solid #ecddbc;}
	.sign .header .headerCon .left .pictrue image{width:100%;height:100%;border-radius:50%;}
	.sign .header .headerCon .right{width:142rpx;height:66rpx;background-color:#fff;border-radius:50rpx 0 0 50rpx;font-size:24rpx;color:#ff9000;}
	.sign .header .headerCon .right .iconfont{font-size:28rpx;margin-right:8rpx;}
	.sign .wrapper{background-color:#fff;margin:-80rpx 20rpx 0 20rpx;padding-bottom:80rpx;position:relative;}
	.sign .wrapper .list{padding:0 30rpx;height:240rpx;}
	.sign .wrapper .list .item{font-size:22rpx;color:#999999;text-align:center;}
	.sign .wrapper .list .item .rewardTxt{width:74rpx;height:32rpx;background-color:#f4b409;border-radius:16rpx;font-size:20rpx;color:#a57d3f;line-height:32rpx;}
	.sign .wrapper .list .item .num{font-size:30rpx;color:#999;}
	.sign .wrapper .list .item .venus{background-repeat:no-repeat;background-size:100% 100%;width:56rpx;height:56rpx;margin:10rpx auto;}
	.sign .wrapper .list .item .venus.reward{width:75rpx;height:56rpx;}
	.sign .wrapper .list .item .venus.venusSelect+.num{color:#ff9000;}
	.sign .wrapper .lock{background-repeat:no-repeat;background-size:100% 100%;width:558rpx;height:68rpx;position:absolute;left:50%;transform: translateX(-50%);bottom:-42rpx;z-index:9;}
	.sign .wrapper .but{width:400rpx;height:76rpx;font-size:30rpx;line-height:76rpx;color:#fff;border-radius:40rpx;text-align:center;margin:0 auto;background-color: var(--view-theme);}
	.sign .wrapper .but.disabled{pointer-events: none}
	.sign .wrapper .but.on{background-color: #999 !important;}
	.sign .wrapper2{margin-top:15rpx;padding:73rpx 0 0 0;}
	.sign .wrapper2 .tip{font-size:30rpx;color:#666;text-align:center;}
	.sign .wrapper2 .list2{margin:45rpx 0 49rpx 0;}
	.sign .wrapper2 .list2 .item{
		width:80rpx;
		height:116rpx;
		color:#fff;
		font-size:72rpx;
		text-align:center;
		line-height:116rpx;
		margin-right:19rpx;
		background-color:var(--view-theme);
		border-radius: 16rpx;
		position:relative;
		&::after{
			content: "";
			display: block;
			width: 100%;
			height: 4rpx;
			background: #eee;
			opacity: .2;
			position: absolute;
			left: 0;
			top: 56rpx;
			z-index:0;
		}
	}
	.sign .wrapper2 .list2 .data{font-size:30rpx;color:#232323;}
	.sign .wrapper2 .tip2{font-size:30rpx;color:#999999;padding:0 55rpx;text-align:center;line-height:1.5;}
	.sign .list3{margin:45rpx 37rpx 0 37rpx;border-top:1px dashed #eee;}
	.sign .list3 .item{align-items:center;justify-content:space-between;border-bottom:1px solid #FBF4EC;height:130rpx;}
	.sign .list3 .item .name{color:#232323;font-size:30rpx;width:400rpx;}
	.sign .list3 .item .data{font-size:24rpx;color:#999999;margin-top:9rpx;}
	.sign .list3 .item .num{font-size:36rpx;color:var(--view-theme);}
	.sign .list3 .loading{font-size:26rpx;color:#282828;height:97rpx;line-height:97rpx;text-align:center;}
	.sign .list3 .loading .iconfont{font-size:25rpx;color:#212121;vertical-align:2rpx;margin-left:10rpx;}
	.sign .signTip{width:644rpx;height:645rpx;position:fixed;top:50%;left:50%;margin-left:-322rpx;margin-top:-322.5rpx;z-index:101;text-align:center;transition:all 0.3s ease-in-out 0s;opacity:0;transform: scale(0);}
	.sign .signTip .icon-ic_close1{position: absolute; bottom: 64rpx; color: #fff; font-size: 42rpx;}
	.sign .signTip .signTipLight{background-repeat:no-repeat;background-size:100% 100%;width:100%;height:100%;}
	.sign .signTip.on{opacity:1;transform: scale(1);}
	.sign .signTip .signTipCon{background-repeat:no-repeat;background-size:100% 100%;width:420rpx;height:420rpx;margin-top:-700rpx;position:relative;}
	.sign .signTip .signTipCon .state{font-size:34rpx;color:#fff;margin-top:150rpx;}
	.sign .signTip .signTipCon .integral{font-size:30rpx;color:rgba(255,255,255,0.6);margin-top:9rpx;}
	.sign .signTip .signTipCon .signTipBnt{font-size:30rpx;color:#fff;
	width:260rpx;height:76rpx;background: linear-gradient( 270deg, #FFCA52 0%, #FE960F 100%);
	border-radius:38rpx;line-height:76rpx;margin:48rpx auto 0 auto;}
</style>
