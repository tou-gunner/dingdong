<template>
	<view :style="viewColor">
		<view class="container popup-main bg-f" :class="showBind==true?'on':''">
			<view class="header">
				<text class="title font-500">ຜູກເບີໂທລະສັບ</text>
				<text class="iconfont icon-ic_close popup-close" @tap="closePopup"></text>
			</view>
			<view class="main_counts">
				<form report-submit='true'>
					<view class="ChangePassword">
						<view class="list">
							<view class="item">
								<input type='number' placeholder='ປ້ອນເບີໂທລະສັບ' placeholder-class='placeholder' v-model="phone"></input>
							</view>
							<view class="item acea-row row-between-wrapper">
								<input type='number' placeholder='ປ້ອນລະຫັດຢືນຢັນ' placeholder-class='placeholder' class="codeIput" v-model="captcha"></input>
								<button class="code" :class="disabled === true ? 'on' : ''" :disabled='disabled' @click="handleVerify">
									{{ text }}
								</button>
							</view>
						</view>
						<button form-type="submit" @click="editPwd" class="confirmBnt">ຢືນຢັນການຜູກ</button>
						<!-- #ifdef MP -->
						<button v-if="!isCommuity && wechat_phone_switch == 1" form-type="submit" class="getPhoneBtn" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">ຜູກເບີໂທລະສັບ</button>
						<!-- #endif -->
					</view>
				</form>
			</view>
			<Verify @success="success" @closeVerfiy="closeVerfiy" :imgSize="{ width: '330px', height: '155px' }" ref="verify"></Verify>
		</view>
		<view class='mask' catchtouchmove="true" :hidden='showBind==false' @tap='closePopup'></view>
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
	import sendVerifyCode from "@/mixins/SendVerifyCode";
	import { bindingPhone, verifyCode, appletsDecrypt } from '@/api/api.js';
	import { registerVerify } from '@/api/user.js'
	import { mapGetters } from "vuex";
	import { configMap } from '@/utils/index';
  import Verify from './verify/verify.vue';
	export default {
		props:{
			isCommuity: {
				type: Boolean,
				default: false
			},
		},
		mixins: [sendVerifyCode],
		components: {
      Verify
		},
		data() {
			return {
				phone:'',
				captcha:'',
				key: '',
				codeVal: '',
				popup: {
					show: false
				},
				showBind: false
			};
		},
		computed: {
			...mapGetters(['isLogin', 'viewColor']),
			...configMap(['wechat_phone_switch'])
		},
		onLoad() {},
		methods: {
			open() {
				this.showBind = true;
			},
			// 点击关闭按钮
			closePopup() {
				this.showBind = false;
			},
			// #ifdef MP
			getPhoneNumber(e) {
				let that = this;
				appletsDecrypt({
					iv:e.detail.iv,
					encryptedData:e.detail.encryptedData,
					code:that.codeVal
					}).then(res => {
						that.$util.Tips({
							title: 'ຜູກສຳເລັດແລ້ວ！',
							icon: 'success'
						})
						setTimeout(()=>{
							uni.switchTab({
								url: '/pages/user/index',
							});
						},2000)
					})
			},
			// #endif
			editPwd: function() {
				let that = this;
				if (!that.phone) return that.$util.Tips({
					title: 'ກະລຸນາປ້ອນເບີໂທລະສັບ！'
				});
				if (!(/^1(3|4|5|7|8|9|6)\d{9}$/i.test(that.phone))) return that.$util.Tips({
					title: 'ກະລຸນາປ້ອນເບີໂທລະສັບທີ່ຖືກຕ້ອງ！'
				});
				if (!that.captcha) return that.$util.Tips({
					title: 'ກະລຸນາປ້ອນລະຫັດຢືນຢັນ'
				});
				bindingPhone({
					phone: that.phone,
					sms_code: that.captcha
				}).then(res => {
					if (res.data !== undefined && res.data.is_bind) {
						uni.showModal({
							title: 'ຕ້ອງການຜູກເບີໂທລະສັບບໍ່',
							content: res.message,
							confirmText: 'ຜູກ',
							success(res) {
								if (res.confirm) {
									bindingPhone({
										phone: that.phone,
										captcha: that.captcha,
										step: 1
									}).then(res => {
										that.$emit('close');
										return that.$util.Tips({
											title: res.message,
											icon: 'success'
										});
									}).catch(err => {
										return that.$util.Tips({
											title: err
										});
									})
								} else if (res.cancel) {
									return that.$util.Tips({
										title: 'ທ່ານໄດ້ຍົກເລີກການຜູກແລ້ວ！'
									}, {
										tab: 5,
										url: '/pages/users/user_info/index'
									});
								}
							}
						});
					} else
						that.closePopup();
						return that.$util.Tips({
							title: 'ຜູກສຳເລັດແລ້ວ！',
							icon: 'success'
						});
				}).catch(err => {
					return that.$util.Tips({
						title: err
					});
				})
			},
			/**
			 * 发送验证码
			 *
			 */
			async code(data) {
				let that = this;
				if (!that.phone) return that.$util.Tips({
					title: 'ກະລຸນາປ້ອນເບີໂທລະສັບ！'
				});
				if (!(/^1(3|4|5|7|8|9|6)\d{9}$/i.test(that.phone))) return that.$util.Tips({
					title: 'ກະລຸນາປ້ອນເບີໂທລະສັບທີ່ຖືກຕ້ອງ！'
				});
				this.disabled = true
				await registerVerify({
					phone:that.phone,
					key:that.key,
					code:that.captcha,
					type: 'binding',
					captchaVerification: data.captchaVerification
				}).then(res => {
					this.disabled = false
					that.$util.Tips({
						title: res.message
					});
					that.sendCode();
				}).catch(err => {
					this.disabled = false
					return that.$util.Tips({
						title: err
					});
				});
			},
			success(data) {
				this.$refs.verify.hide();
				this.code(data);
				this.$emit('changeVisible','visible')
			},
			closeVerfiy() {
				this.$emit('changeVisible','visible')
			},
			handleVerify() {
				let that = this;
				if (!that.phone) return that.$util.Tips({
					title: 'ກະລຸນາປ້ອນເບີໂທລະສັບ！'
				});
				if (!(/^1(3|4|5|7|8|9|6)\d{9}$/i.test(that.phone))) return that.$util.Tips({
					title: 'ກະລຸນາປ້ອນເບີໂທລະສັບທີ່ຖືກຕ້ອງ！'
				});
				this.$refs.verify.show();
				this.$emit('changeVisible','hidden')
			}
		}
	}
</script>

<style lang="scss" scoped>
.container {
	.header{
		position: relative;
		padding: 40rpx 30rpx;
		text-align: center;
		.title{
			color: #282828;
			font-size: 32rpx;
		}
		.iconfont{
			position: absolute;
			top: 20rpx;
			right: 20rpx;
		}
	}
}
.ChangePassword{
	padding: 0 30rpx 100rpx;
}
.ChangePassword .phone {
	font-size: 32rpx;
	font-weight: bold;
	text-align: center;
	margin-top: 55rpx;
}
.ChangePassword .list .item {
	height: 86rpx;
	margin-bottom: 30rpx;
	flex-direction: row;
	border: none;
}
.ChangePassword .list .item input {
	height: 100%;
	font-size: 32rpx;
	border: 1px solid #DDDDDD;
	border-radius: 43rpx;
	padding: 0 40rpx;
}
.ChangePassword .list .item .placeholder {
	color: #cccccc;
}
.ChangePassword .list .item input.codeIput {
	max-width: 310rpx;
}
.ChangePassword .list .item .code {
	font-size: 28rpx;
	background-color: var(--view-minorColor);
	color: var(--view-theme);
	width: 230rpx;
	height: 86rpx;
	border-radius: 43rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}
.ChangePassword .list .item .code.on {
	color: #b9b9bc;
}
.ChangePassword .confirmBnt {
	font-size: 32rpx;
	width: 580rpx;
	height: 90rpx;
	border-radius: 45rpx;
	color: #fff;
	margin: 60rpx auto 0 auto;
	text-align: center;
	line-height: 90rpx;
	background-color: var(--view-theme);
}
.getPhoneBtn{
	font-size: 32rpx;
	width: 580rpx;
	height: 90rpx;
	border-radius: 45rpx;
	border: 1px solid #3CB625;
	color: #3CB625;
	margin: 40rpx auto 0 auto;
	text-align: center;
	line-height: 90rpx;
	.iconfont{
		font-size: 32rpx;
		margin-right: 12rpx;
	}
}
::v-deep .verifybox{
	margin-top: -380rpx;
	position: fixed;
}
</style>
