<template>
	<view :style="viewColor">
		<view class='cash-withdrawal' :hidden='!loading'>
			<!-- #ifdef MP -->
			<view class="accountTitle">
				<view :style="{height:getHeight.barTop+'px'}"></view>
				<view class="sysTitle acea-row row-center-wrapper" :style="{height:getHeight.barHeight+'px'}">
					<view>提现</view>
					<text class="iconfont icon-ic_leftarrow" @click="goBack"></text>
				</view>
			</view>
			<view :style="{height:(getHeight.barTop+getHeight.barHeight)+'px'}"></view>
			<!-- #endif -->
			<view class="header">
				<view class="headerCon" :style="{ 'background-image': `url(${domain}/static/images/cashBg.png)`}">
					<view class="money regular">{{userInfo.brokerage_price}}</view>
					<view>可提现金额</view>
				</view>
			</view>
			<view class='wrapper'>
				<block v-if="extract_switch.withdraw_type.length==1&&extract_switch.withdraw_type.includes('1') && (extract_switch.sys_extension_type==1 || extract_switch.sys_extension_type==2)">
					<view class="nav on">
						<view class="item">
						  提现至微信
						</view>
					</view>
				</block>
				<block v-else>
					<view class="nav acea-row" v-if="extract_switch.withdraw_type.length == 4">
						<view class="item"
						:class="[currentIndex==0?'on6':currentIndex==1?'on7':currentIndex==2?'on8':'on9',currentIndex==index?'items':'']"
						v-for="(item,index) in extract_switch.withdraw_type" :key="index" @click="swichNav(navList[item].id,index)">
						  {{navList[item].name}}
						</view>
						<view class="navBg"
						:class="currentIndex==0?'on6':currentIndex==1?'on7':currentIndex==2?'on8':'on9'"
						:style="{ 'background-image': currentIndex==0 ? `url(${domain}/static/images/tixian06.png)` : currentIndex==1 ? `url(${domain}/static/images/tixian07.png)` : currentIndex==2 ? `url(${domain}/static/images/tixian08.png)` : `url(${domain}/static/images/tixian09.png)`}"
						></view>
					</view>
					<view class="nav acea-row" v-if="extract_switch.withdraw_type.length == 3">
						<view class="item"
						:class="[currentIndex==0?'on1':currentIndex==1?'on2':'on3',currentIndex==index?'items':'']"
						v-for="(item,index) in extract_switch.withdraw_type" :key="index" @click="swichNav(navList[item].id,index)">
						  {{navList[item].name}}
						</view>
						<view class="navBg"
						:class="currentIndex==0?'on1':currentIndex==1?'on2':'on3'"
						:style="{ 'background-image': currentIndex==0 ? `url(${domain}/static/images/tixian01.png)` : currentIndex==1 ? `url(${domain}/static/images/tixian02.png)` : `url(${domain}/static/images/tixian03.png)`}"
						></view>
					</view>
					<view class="nav acea-row" v-if="extract_switch.withdraw_type.length == 2">
						<view class="item on" :class="currentTab == item.id ? 'ons':''"
						v-for="(item,index) in extract_switch.withdraw_type" :key="index" @click="swichNav(navList[item].id,index)">
						  {{navList[item].name}}
						</view>
						<view class="navBg"
						:class="currentIndex==0?'on4':'on5'"
						:style="{ 'background-image': currentIndex==0 ? `url(${domain}/static/images/tixian04.png)` : `url(${domain}/static/images/tixian05.png)`}"></view>
					</view>
					<view class="nav on" v-if="extract_switch.withdraw_type.length == 1">
						<view class="item" :key="index">
						  {{extract_switch.withdraw_type[0]==0?'提现至银行卡':extract_switch.withdraw_type[0]==1?'提现至微信':extract_switch.withdraw_type[0]==2?'提现至支付宝':'提现至余额'}}
						</view>
					</view>
				</block>
				<view :hidden='currentTab != 0'>
					<form @submit="subCash" report-submit='true'>
						<view class="list bg-f">
							<view class='item acea-row row-between-wrapper'>
								<view class='name'>持卡人</view>
								<view class='input'><input placeholder='请输入持卡人姓名' placeholder-class='placeholder' name="real_name" v-model="real_name"></input></view>
							</view>
							<view class='item acea-row row-between-wrapper'>
								<view class='name'>卡号</view>
								<view class='input'><input type='number' placeholder='请填写卡号' placeholder-class='placeholder' name="bank_code" v-model="bank_code"></input></view>
							</view>
							<view class='item acea-row row-between-wrapper' v-if="array.length>0">
								<view class='name'>银行</view>
								<view class='input'>
									<picker @change="bindPickerChange" :value="index" :range="array" range-key="name">
										<view class="acea-row row-between-wrapper">
											<text class='Bank'>{{array[index]["name"]}}</text>
											<text class='iconfont icon-ic_rightarrow'></text>
										</view>
									</picker>
								</view>
							</view>
							<view class='item acea-row row-between-wrapper'>
								<view class='name'>提现</view>
								<view class='input acea-row row-between-wrapper'><input :placeholder='"最低提现金额：₭"+minPrice' placeholder-class='placeholder' name="extract_price"
									type='digit' v-model="extract_price"></input>
									<view class="all" @click="allCash">全部提现</view>
								</view>
							</view>
							<view class='tip mt25'>
								当前可提现金额：<text class="price">₭{{userInfo.brokerage_price}}，</text>冻结佣金：₭{{userInfo.lock_brokerage}}
							</view>
							<view class='tip' v-if="userInfo.broken_day>0">
								说明：每笔佣金的冻结期为{{userInfo.broken_day}}天，到期后可提现
							</view>
						</view>
						<view class="btn-submit">
							<button formType="submit" :disabled="load" class='bnt b-color' :class="load ? 'disabled' : ''" >提现</button>
						</view>
					</form>
				</view>
				<view :hidden='currentTab != 1'>
					<form @submit="subCash" report-submit='true'>
						<view class='list bg-f boder-24'>
							<view v-if="extract_switch.sys_extension_type == 0" class="">
								<view class='item acea-row row-between-wrapper'>
									<view class='name'>账号</view>
									<view class='input'><input placeholder='请填写您的微信账号' placeholder-class='placeholder' name="wechat"></input></view>
								</view>
								<view class='item acea-row row-between-wrapper'>
									<view class='name'>提现</view>
									<view class='input acea-row row-between-wrapper'><input :placeholder='"最低提现金额：₭"+minPrice' placeholder-class='placeholder' name="extract_price"
									 type='digit' v-model="extract_price"></input>
									 <view class="all" @click="allCash">全部提现</view>
									</view>
								</view>
								<view class='item acea-row row-between-wrapper uploadItem'>
									<view class='name'>收款码</view>
									<view class='input upload acea-row row-middle'>
										<view class='picture' v-for="(item,index) in pics" :key="index">
											<image :src='item'></image>
											<text class='iconfont icon-ic_close2' @click='DelPic(index)'></text>
										</view>
										<view class='picture acea-row row-center-wrapper row-column' @click='uploadpic' v-if="pics.length < 1">
											<text class='iconfont icon-ic_camera1'></text>
											<view>上传凭证</view>
										</view>
									</view>
								</view>
								<view class='tip mt25'>
									当前可提现金额: <text class="price">₭{{userInfo.brokerage_price}}，</text>冻结佣金：₭{{userInfo.lock_brokerage}}
								</view>
								<view class='tip' v-if="userInfo.broken_day>0">
									说明: 每笔佣金的冻结期为{{userInfo.broken_day}}天，到期后可提现
								</view>
							</view>
							<view v-else class="auto_arrival">
								<view class='tip'>当前可提现金额: <text class="price">₭{{userInfo.brokerage_price}}</text>冻结佣金：₭{{userInfo.lock_brokerage}}
								</view>
								<view class='input'><input placeholder-class='placeholder1' name="extract_price"
									 type="digit" @input="handleInput" :placeholder="placeholderValue" @focus="placeholderValue = ''" v-model="extract_price" @blur="blurPrice"></input>
								</view>
							</view>
						</view>
						<view class="btn-submit">
						  <button formType="submit" :disabled="load" class='bnt b-color' :class="load ? 'disabled' : ''" >提现</button>
						</view>
					</form>
				</view>
				<view :hidden='currentTab != 2'>
					<form @submit="subCash" report-submit='true'>
						<view class='list bg-f boder-24'>
							<view class='item acea-row row-between-wrapper'>
								<view class='name'>账号</view>
								<view class='input'><input placeholder='请填写您的支付宝账号' placeholder-class='placeholder' name="alipay_code"></input></view>
							</view>
							<view class='item acea-row row-between-wrapper'>
								<view class='name'>提现</view>
								<view class='input acea-row row-between-wrapper'><input :placeholder='"最低提现金额：₭"+minPrice' placeholder-class='placeholder' name="extract_price"
									type='digit' @input="handleInput" v-model="extract_price" @blur="blurPrice"></input>
									<view class="all" @click="allCash">全部提现</view>
								</view>
							</view>
							<view class='item acea-row row-between-wrapper uploadItem'>
								<view class='name'>收款码</view>
								<view class='input upload acea-row row-middle'>
									<view class='picture' v-for="(item,index) in pics" :key="index">
										<image :src='item'></image>
										<text class='iconfont icon-ic_close2' @click='DelPic(index)'></text>
									</view>
									<view class='picture acea-row row-center-wrapper row-column' @click='uploadpic' v-if="pics.length < 1">
										<text class='iconfont icon-ic_camera1'></text>
										<view>上传凭证</view>
									</view>
								</view>
							</view>
							<view class='tip'>
								当前可提现金额: <text class="price">₭{{userInfo.brokerage_price}}，</text>冻结佣金：₭{{userInfo.lock_brokerage}}
							</view>
							<view class='tip' v-if="userInfo.broken_day>0">
								说明: 每笔佣金的冻结期为{{userInfo.broken_day}}天，到期后可提现
							</view>
						</view>
						<view class="btn-submit">
						  <button formType="submit" :disabled="load" class='bnt b-color' :class="load ? 'disabled' : ''" >提现</button>
						</view>
					</form>
				</view>
				<view :hidden="currentTab != 3 && currentTab != 4">
					<form @submit="subCash" report-submit='true'>
						<view class='list bg-f boder-24'>
							<view class="itemCon">
								<view class='item acea-row row-between-wrapper'>
									<view class='name'>提现</view>
									<view class='input acea-row row-between-wrapper'><input :placeholder='"最低提现金额：₭"+minPrice' placeholder-class='placeholder' name="extract_price"
										type='digit' @input="handleInput" v-model="extract_price" @blur="blurPrice"></input>
										<view class="all" @click="allCash">全部提现</view>
									</view>
								</view>
							</view>
							<view class='tip'>
								当前可提现金额: <text class="price">₭{{userInfo.brokerage_price}}，</text>冻结佣金：₭{{userInfo.lock_brokerage}}
							</view>
							<view class='tip' v-if="userInfo.broken_day>0">
								说明: 每笔佣金的冻结期为{{userInfo.broken_day}}天，到期后可提现
							</view>
						</view>
						<view class="btn-submit">
						  <button formType="submit" :disabled="load" class='bnt b-color' :class="load ? 'disabled' : ''" >提现</button>
						</view>
					</form>
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
	const app = getApp()
	import {
		extractCash,
		extractBank,
		getUserInfo,
		spreadInfo,
		getBankInfo
	} from '@/api/user.js';
	import { openEextractSubscribe } from '@/utils/SubscribeMessage.js';
	import { mapGetters } from "vuex";
	import { configMap } from '@/utils';
	import { toLogin } from '@/libs/login.js';
	import { HTTP_REQUEST_URL } from '@/config/app';
	export default {
		components: {},
		data() {
			return {
				domain: HTTP_REQUEST_URL,
				navList: [{
						'id': '0',
						'ids': 1,
						'name': '银行卡',
					},
					{
						'id': '1',
						'ids': 2,
						'name': '微信',
					},
					{
						'id': '2',
						'ids': 3,
						'name': '支付宝',
					},
					{},
					{
						'id': '3',
						'ids': 4,
						'name': '余额',
					}
				],
				// #ifdef MP
				getHeight: this.$util.getWXStatusHeight(),
				// #endif
				currentIndex:0, //索引值；
				currentTab: '0',
				extract_price: '',
				index: 0,
				array: [], //提现银行
				minPrice: 0.00, //最低提现金额
				userInfo: [],
				isClone: false,
				loading: true,
				load: false,
				pics: [], //收款码
				extract_pic: '',
				placeholderValue: '0.00',
				payColor: '',
				pay_close: false,
				real_name: '',
				bank_address: '',
				bank_code: '',
				pay_type: [],
				debounceTimeout: {}, // 防抖函数
			};
		},
		computed: {
			...mapGetters(['isLogin','viewColor']),
			... configMap(['extract_switch'])
		},
		watch: {
			// type变化则全面刷新
			extract_switch: {
				immediate: true,
				handler() {
					this.currentTab = (this.extract_switch.sys_extension_type != 0 && this.extract_switch.withdraw_type.length==1) ? '1' : this.extract_switch.withdraw_type[0]
				}
			}
		},
		onShow() {
			// app.getConfigData()
		},
		onLoad() {
			if (this.isLogin) {
				this.getUserInfo();
				this.getUserExtractBank();
				this.getBankInfo();
			} else {
				toLogin()
			}
		},
		methods: {
			goBack: function() {
				uni.navigateBack();
			},
			/*获取之前提交过的银行卡信息*/
			getBankInfo(){
				let that = this;
				getBankInfo().then(res => {
					let info = res.data;
					that.real_name = info.real_name;
					that.bank_name = info.bank_name;
					that.bank_code = info.bank_code;
					that.bank_address = info.bank_address;
				});
			},
			getUserExtractBank: function() {
				let that = this;
				extractBank().then(res => {
					let array = res.data;
					that.$set(that, 'array', array);
				});
			},
			/**
			 * 获取个人用户信息
			 */
			getUserInfo: function() {
				let that = this;
				spreadInfo().then(res => {
					that.userInfo = res.data;
					that.minPrice = res.data.user_extract_min;
				});
			},
			swichNav: function(current,index) {
				this.currentTab = current;
				this.currentIndex = index;
				this.load = false;
			},
			bindPickerChange: function(e) {
				this.index = e.detail.value;
			},
			allCash(){
				this.extract_price = '';
				this.$nextTick(()=>{
					this.extract_price = this.userInfo.brokerage_price;
				})
			},
			handleInput(event) {
				let value = event.detail.value;
				if (value > 200) {
					this.extract_price = 200;
				} else {
					// this.$set(this, 'extract_price', Number(value || 0).toFixed(2))
					// this.extract_price = Number(value || 0).toFixed(2);
				}
			},
		  blurPrice() {
			 this.$set(this, 'extract_price', Number(this.extract_price || 0).toFixed(2))
			},
			uploadpic: function() {
				let that = this;
				that.$util.uploadImageOne('upload/image', function(res) {
					that.pics.push(res.data.path);
					that.$set(that, 'pics', that.pics);
					that.$set(that, 'extract_pic', that.pics[0])
				});
			},
			/**
			 * 删除图片
			 *
			 */
			DelPic: function(index) {
				let that = this,
				pic = this.pics[index];
				that.pics.splice(index, 1);
				that.$set(that, 'pics', that.pics);
			},
			subCash: function(e) {
				let that = this,
				value = e.detail.value;
				if(this.debounceTimeout) {
					that.$util.Tips({
						title: '提现频率过快，请稍等'
					});
					clearTimeout(this.debounceTimeout);
				}
				// if(that.load) return;
				value.extract_type = that.currentTab
				if (that.currentTab == 0) { //银行卡
					if (value.real_name.length == 0) return this.$util.Tips({
						title: '请填写持卡人姓名'
					});
					if (value.bank_code.length == 0) return this.$util.Tips({
						title: '请填写卡号'
					});
					value.bank_name = (that.array && that.array.length) ? that.array[that.index].name : '';
				} else if (that.currentTab == 1) { //微信
					value.extract_type = that.extract_switch.sys_extension_type == 0 ? 1 : 3
					if(that.extract_switch.sys_extension_type == 0){
						value.extract_pic = that.extract_pic
						if (value.wechat.length == 0) return this.$util.Tips({
							title: '请填写微信号'
						});
						if (value.extract_pic.length == 0) return this.$util.Tips({
							title: '请上传收款码'
						});
					}
				} else if (that.currentTab == 2) { //支付宝
					value.extract_pic = that.extract_pic
					if (value.alipay_code.length == 0) return this.$util.Tips({
						title: '请填写支付宝账号'
					});
					if (value.extract_pic.length == 0) return this.$util.Tips({
						title: '请上传收款码'
					});
				} else if(that.currentTab == 3){
					value.extract_type = 4
				}
				if (value.extract_price.length == 0) return this.$util.Tips({
					title: '请填写提现金额'
				});
				if (Number(value.extract_price) < that.minPrice) return this.$util.Tips({
					title: '提现金额不能低于' + that.minPrice
				});
				// that.load = true;
				if(that.extract_switch.withdraw_type.length == 1){
					value.extract_type = that.extract_switch.withdraw_type[0]
				}
				value.extract_price = e.detail.value.extract_price
				// console.log(value)
				// #ifdef MP
				this.debounceTimeout = setTimeout(() => {
					openEextractSubscribe().then((res) => {
						that.cach(value);
					}).catch(() => {
						uni.hideLoading();
					});
				}, 500)
				// #endif
				// #ifndef MP
				this.debounceTimeout = setTimeout(() => {
					that.cach(value);
				}, 500)
				// #endif
			},
			cach(value) {
				let that = this;
				extractCash(value).then(res => {
					that.getUserInfo();
					that.load = false;
					that.$util.Tips({
						title: res.message,
						icon: 'success'
					});
					setTimeout(function(){
						uni.navigateTo({
							url: '/pages/users/user_spread_user/index'
						});
					},1000)
				}).catch(err => {
					that.load = false;
					return that.$util.Tips({
						title: err
					});
				});
			},
			/**
			 * 打开支付组件
			 *
			 */
			goPay: function(pay_price) {
				this.$set(this, 'pay_close', true);
			},
			/**
			 * 关闭支付组件
			 *
			 */
			payClose: function() {
				this.pay_close = false;
			},
			onChangeFun: function(e) {
				let opt = e;
				let action = opt.action || null;
				let value = opt.value != undefined ? opt.value : null;
				(action && this[action]) && this[action](value);
				this.currentTab = opt.type
			},
		}
	}
</script>

<style lang="scss" scoped>
  .mt25{
		margin-top: 25rpx;
	}
	.accountTitle{
		background: linear-gradient(90deg, var(--view-bntColor22) 0%, var(--view-bntColor21) 100%);
		position: fixed;
		left:0;
		top:0;
		width: 100%;
		z-index: 99;
		.sysTitle{
			width: 100%;
			position: relative;
			font-weight: 500;
			color: #fff;
			font-size: 30rpx;
			.iconfont{
				position: absolute;
				font-size: 36rpx;
				left:11rpx;
				width: 60rpx;
			}
		}
	}
	.header{
		width: 100%;
		height: 380rpx;
		background: linear-gradient(90deg, var(--view-bntColor22) 0%, var(--view-bntColor21) 100%);
		font-size: 30rpx;
		font-weight: 400;
		color: #F5F5F5;
		text-align: center;
		padding-top: 88rpx;
		position: relative;
		&::after{
			position: absolute;
			content: ' ';
			width: 50%;
			height: 160rpx;
			background: linear-gradient(180deg, var(--view-bntColor22) 0%, #F5F5F5 100%);
			left: 0;
		}
		&:before{
			position: absolute;
			content: ' ';
			width: 50%;
			height: 160rpx;
			background: linear-gradient(180deg, var(--view-bntColor21) 0%, #F5F5F5 100%);
			right: 0;
			bottom: -146rpx;
		}
		.headerCon{
			background-repeat: no-repeat;
			background-size: 100% 100%;
			width: 100%;
			height: 278rpx;
		}
		.money{
			font-size: 76rpx;
			font-weight: 600;
			color: #FFFFFF;
			margin-bottom: 16rpx;
		}
	}
	.cash-withdrawal .nav{
		width: 100%;
		height: 110rpx;
		background-color: rgba(255, 255, 255, 0.9);
		border-radius: 24rpx 24rpx 0 0;
		position: relative;
		z-index: 9;
		&.on{
			height: unset;
			padding: 18rpx 0 8rpx 0;
			background-color: #fff;
			.item{
				padding-top: 0;
				padding-left: 30rpx;
				font-weight: 500;
				color: #333;
			}
		}
		.item{
			width: 33.33%;
			height: 84rpx;
			line-height: 84rpx;
			color: #666666;
			font-size: 26rpx;
			position: relative;
			z-index: 9;
			&.items{
				font-size: 28rpx;
				color: var(--view-theme);
				font-weight: 500 !important;
			}
			&.on{
				width: 50%;
				padding-left: 0;
				text-align: center;
			}
			&.ons{
				color: var(--view-theme);
				font-weight: 500;
				font-size: 28rpx;
			}
			&.on1,&.on2,&.on3{
				font-weight: 400;
				padding-left: 0;
				text-align: center;
			}
			&.on6,&.on7,&.on8,&.on9{
				width: 25%;
				font-weight: 400;
				padding-left: 0;
				text-align: center;
			}
		}
		.navBg{
			position: absolute;
			background-repeat: no-repeat;
			background-size: 100% 100%;
			width: 710rpx;
			height: 122rpx;
			left:0;
			bottom: 0;
			box-sizing: border-box;
		}
	}
	.b-color{background-color: var(--view-theme);}
	.cash-withdrawal .nav .input {
		width: 505rpx;
		.more-content{
			display: flex;
			align-items: center;
			.more-content-left{
				width: 90%;
				.type-icon{
					display: inline-block;
					width: 56rpx;
					height: 56rpx;
					text-align: center;
					line-height: 56rpx;
					background-color: #FE960F;
					margin-right: 20rpx;
					border-radius: 50%;
					.bankicon{
						font-size: 36rpx;
						color: #FFFFFF;
					}
				}
			}
			.moreicon{
				width: 10%;
				text-align: right;
			}
		}
	}
	.cash-withdrawal .wrapper {
		width: 710rpx;
		margin: -100rpx auto 0 auto;
		position: relative;
		z-index: 9;
	}
	.cash-withdrawal .wrapper .list {
		padding: 0 30rpx 20rpx;
		border-radius: 0 0 24rpx 24rpx;
	}
	.cash-withdrawal .wrapper .list .item {
		height: 107rpx;
		font-size: 30rpx;
		color: #333;
		&.uploadItem {
			height: auto;
			border-bottom: 1px solid #eee;
			.name {
				height: 107rpx;
			}
		}
	}
	.picture {
		width: 140rpx;
		height: 140rpx;
		margin: 0 0 40rpx 0;
		position: relative;
		box-sizing: border-box;
		margin-top: 40rpx;
		border-radius: 16rpx;
		&.row-column{
			color: #999;
			border: 2rpx dashed #ccc;
			background: #F5F5F5;
			font-size: 22rpx;
			.iconfont {
				font-size: 46rpx;
				margin-bottom: 10rpx;
			}
		}
		uni-image,image {
			width: 100%;
			height: 100%;
			border-radius: 16rpx;
		}
		.icon-ic_close2 {
			font-size: 22px;
			position: absolute;
			top: -10px;
			right: -10px;
			color: #fc4141;
		}
	}
	.cash-withdrawal .wrapper .list .item .name {
		width: 130rpx;
	}
	.cash-withdrawal .wrapper .list .item .input {
		width: 505rpx;
	}
	.cash-withdrawal .wrapper .list .item .input uni-input {
		width: 400rpx;
	}
	.cash-withdrawal .wrapper .list .item .input .all {
		font-size: 26rpx;
		color: var(--view-theme);
	}
	.cash-withdrawal .wrapper .list .item .input .iconfont {
		color: #cccccc;
	}
	.cash-withdrawal .wrapper .list .item .input .placeholder {
		color: #ccc;
		font-size: 28rpx;
	}
	.cash-withdrawal .placeholder1 {
		font-size: 46rpx;
	}
	.cash-withdrawal .wrapper .tip {
		font-size: 24rpx;
		color: #999;
		margin: 30rpx 0 10rpx;
	}
 .cash-withdrawal .btn-submit{
	 margin-top: 80rpx;
  }
	.cash-withdrawal .wrapper .bnt {
		font-size: 32rpx;
		color: #fff;
		width: 100%;
		height: 88rpx;
		text-align: center;
		border-radius: 50rpx;
		line-height: 88rpx;
		::v-deep  &.disabled {
			background: #E3E3E3!important;
			pointer-events: none;
		}
	}
	.cash-withdrawal .wrapper .list .tip2 {
		font-size: 26rpx;
		color: #999;
		text-align: center;
		margin: 44rpx 0 20rpx 0;
	}
	.cash-withdrawal .wrapper .list .value {
		height: 135rpx;
		line-height: 135rpx;
		border-bottom: 1px solid #eee;
		width: 690rpx;
		margin: 0 auto;
	}
	.cash-withdrawal .wrapper .list .value input {
		font-size: 80rpx;
		color: #282828;
		height: 135rpx;
		text-align: center;
	}
	.cash-withdrawal .wrapper .list .value .placeholder2 {
		color: #bbb;
	}
	.price {
		color: var(--view-priceColor);
	}
	.auto_arrival{
		text-align: center;
		padding: 20rpx 0 0 0;
		.input{
			width: 100%;
			border-bottom: 1px solid #eee;
			margin-top: 10rpx;
			color: #999;
			height: 120rpx;
			::v-deep uni-input,input{
				height: 120rpx;
				font-size: 40rpx;
			}
		}
	}
	 uni-toast.uni-mask{
		background-color: rgba(0,0,0,0.5) !important;
	}
</style>
