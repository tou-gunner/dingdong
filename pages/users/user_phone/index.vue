<template>
	<view class="pad20" :style="viewColor">
		<form report-submit='true'>
			<view class="ChangePassword">
				<view class="list bg-f boder-24 mt20">
					<view class="item">
						<input type='number' placeholder='填写手机号码' placeholder-class='placeholder' v-model="phone"></input>
					</view>
					<view class="item acea-row row-between-wrapper">
						<input type='number' placeholder='填写验证码' placeholder-class='placeholder' class="codeIput" v-model="captcha"></input>
						<button class="code" :class="disabled === true ? 'on' : ''" :disabled='disabled' @click="handleVerify">
							{{ text }}
						</button>
					</view>
				</view>
				<button form-type="submit" @click="editPwd" class="confirmBnt">确认绑定</button>
				<!-- #ifdef MP -->
				<button v-if="wechat_phone_switch == 1" form-type="submit" class="getPhoneBtn" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber"><text class="iconfont icon-icon_WeChat_1"></text>使用微信绑定号码</button>
				<!-- #endif -->
			</view>
		</form>
    <Verify @success="success" :imgSize="{ width: '330px', height: '155px' }" ref="verify"></Verify>
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
	import { bindingPhone, verifyCode, appletsDecrypt} from '@/api/api.js';
	import { registerVerify } from '@/api/user.js'
	import { mapGetters } from "vuex";
	import { configMap } from '@/utils/index';
  import Verify from '../components/verify/verify.vue';
	import { toLogin } from '@/libs/login.js';
	export default {
		mixins: [sendVerifyCode],
		components: {
      Verify
		},
		data() {
			return {
				phone:'',
				captcha:'',
				key: '',
				codeVal: ''
			};
		},
		computed: {
			...mapGetters(['isLogin', 'viewColor']),
			...configMap(['wechat_phone_switch'])
		},
		onLoad() {
			let that = this
			if (this.isLogin) {
				// verifyCode().then(res=>{
				// 	this.$set(this, 'key', res.data.key)
				// });
			} else {
				toLogin()
			}
			// #ifdef MP
			wx.login({
			  success (res) {
			    if (res.code) {
			     that.codeVal = res.code
			    } else {
			      console.log('登录失败！' + res.errMsg)
			    }
			  }
			})
			// #endif
		},
		methods: {
			// Lao phone validation helper
			isValidLaoPhone(phone) {
				if (!phone) return false;
				let cleanPhone = phone.replace(/[\s\-\.\+]/g, '');
				if (cleanPhone.startsWith('856')) cleanPhone = cleanPhone.substring(3);
				if (cleanPhone.startsWith('0')) cleanPhone = cleanPhone.substring(1);
				return /^(20|30)?\d{8}$/.test(cleanPhone);
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
							title: '绑定成功！',
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
					title: '请填写手机号码！'
				});
				if (!that.isValidLaoPhone(that.phone)) return that.$util.Tips({
					title: 'ກະລຸນາໃສ່ເບີໂທລະສັບທີ່ຖືກຕ້ອງ'
				});
				if (!that.captcha) return that.$util.Tips({
					title: '请填写验证码'
				});
				bindingPhone({
					phone: that.phone,
					sms_code: that.captcha
				}).then(res => {
					if (res.data !== undefined && res.data.is_bind) {
						uni.showModal({
							title: '是否绑定账号',
							content: res.message,
							confirmText: '绑定',
							success(res) {
								if (res.confirm) {
									bindingPhone({
										phone: that.phone,
										captcha: that.captcha,
										step: 1
									}).then(res => {
										return that.$util.Tips({
											title: res.message,
											icon: 'success'
										}, {
											tab: 5,
											url: '/pages/users/user_info/index'
										});
									}).catch(err => {
										return that.$util.Tips({
											title: err
										});
									})
								} else if (res.cancel) {
									return that.$util.Tips({
										title: '您已取消绑定！'
									}, {
										tab: 5,
										url: '/pages/users/user_info/index'
									});
								}
							}
						});
					} else
						return that.$util.Tips({
							title: '绑定成功！',
							icon: 'success'
						}, {
							tab: 5,
							url: '/pages/users/user_info/index'
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
					title: '请填写手机号码！'
				});
				if (!that.isValidLaoPhone(that.phone)) return that.$util.Tips({
					title: 'ກະລຸນາໃສ່ເບີໂທລະສັບທີ່ຖືກຕ້ອງ'
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
			},
			handleVerify() {
				this.$refs.verify.show();
			}
		}
	}
</script>

<style lang="scss" scoped>
	.getPhoneBtn{
		font-size: 28rpx;
		width: 100%;
		height: 88rpx;
		border-radius: 50rpx;
		border: 1px solid #3CB625;
		color: #3CB625;
		margin: 40rpx auto 0 auto;
		text-align: center;
		line-height: 88rpx;
		.iconfont{
			font-size: 32rpx;
			margin-right: 12rpx;
		}
	}
</style>
