<template>
	<div class="register absolute" :style="viewColor">
		<div class="whiteBg" :style="{ 'background-image': `url(${domain}/static/images/logo_bgl.png)`}">
			<view class="login_title">
				<view class="title_h">ກູ້ຄືນລະຫັດຜ່ານ</view>
			</view>
			<div class="list">
				<div class="item">
					<input type="text" placeholder="ປ້ອນເບີໂທລະສັບ" placeholder-class="placeholder" v-model="account" autocomplete="off" />
					<input type="text" style="height: 0;opacity: 0">
				</div>
				<div class="item">
					<input type="password" placeholder="ປ້ອນລະຫັດຜ່ານໃໝ່ຂອງທ່ານ" placeholder-class="placeholder" v-model="password" autocomplete="off" />
				</div>
				<div class="item">
					<input type="password" placeholder="ປ້ອນລະຫັດຜ່ານໃໝ່ອີກຄັ້ງ" placeholder-class="placeholder" v-model="confirm_pwd" autocomplete="off" />
				</div>
				<div class="item">
					<input type="text" placeholder="ປ້ອນລະຫັດຢືນຢັນ" placeholder-class="placeholder" class="codeIput" v-model="captcha" autocomplete="off" />
					<button class="code" :disabled="disabled" :class="disabled === true ? 'on' : ''" @click="handleVerify">
						{{ text }}
					</button>
				</div>
			</div>
			<div class="logon" @click="registerReset">ຢືນຢັນ</div>
			<div class="tip">
				<text @click="back">ເຂົ້າສູ່ລະບົບດຽວນີ້</text>
			</div>
		</div>
		<div class="bottom"></div>
    <Verify @success="success" :imgSize="{ width: '330px', height: '155px' }" ref="verify"></Verify>
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
	const app = getApp();
	import { mapGetters} from "vuex";
	import sendVerifyCode from "@/mixins/SendVerifyCode";
	import {
		registerVerify,
		registerForget,
		getCaptcha
	} from "@/api/user";
	import { configMap } from '@/utils';
	import { HTTP_REQUEST_URL } from '@/config/app';
  import Verify from '../components/verify/verify.vue';
	export default {
		name: "RetrievePassword",
      components: {
        Verify
		},
		mixins: [sendVerifyCode],
		data: function() {
			return {
				account: "",
				password: "",
				confirm_pwd: "",
				captcha: "",
				codeKey: "",
				codeUrl: "",
				codeVal: "",
				isShowCode: false,
				domain: HTTP_REQUEST_URL,
			};
		},
		computed: configMap(['login_logo'], mapGetters(['viewColor'])),
		onReady() {
		},
		mounted: function() {
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
			back() {
				uni.navigateBack();
			},
			again() {
				this.codeUrl =	VUE_APP_API_URL + "/captcha?" + this.keyCode + Date.parse(new Date());
			},
			async code(data) {
				let that = this;
				if (!that.account) return that.$util.Tips({
					title: 'ກະລຸນາປ້ອນເບີໂທລະສັບ'
				});
				if (!that.isValidLaoPhone(that.account)) return that.$util.Tips({
					title: 'ກະລຸນາປ້ອນເບີໂທລະສັບທີ່ຖືກຕ້ອງ'
				});
				await registerVerify({
					phone: that.account,
					type: 'change_pwd',
					captchaVerification: data.captchaVerification
				})
				.then(res => {
					that.$util.Tips({
						title: res.message
					});
					that.sendCode();
				}).catch(res => {
					that.$util.Tips({
						title: res
					});
				});
			},
			getcaptcha() {
				let that = this
				getCaptcha().then(data => {
					that.codeUrl = data.data.captcha; //图片路径
					that.codeVal = data.data.code; //图片验证码
					that.codeKey = data.data.key //图片验证码key
				})
				that.isShowCode = true;
			},
			async registerReset() {
				var that = this;
				if (!that.account) return that.$util.Tips({
					title: 'ກະລຸນາປ້ອນເບີໂທລະສັບ'
				});
				if (!that.isValidLaoPhone(that.account)) return that.$util.Tips({
					title: 'ກະລຸນາປ້ອນເບີໂທລະສັບທີ່ຖືກຕ້ອງ'
				});
				if (that.password == '123456') return that.$util.Tips({
					title: 'ລະຫັດຜ່ານທີ່ທ່ານປ້ອນແມ່ນງ່າຍເກີນໄປ'
				});
				if (that.password != that.confirm_pwd) return that.$util.Tips({
					title: 'ລະຫັດຜ່ານສອງຄັ້ງບໍ່ກົງກັນ'
				});
				if (!that.captcha) return that.$util.Tips({
					title: 'ກະລຸນາປ້ອນລະຫັດຢືນຢັນ'
				});
				registerForget({
					phone: that.account,
					sms_code: that.captcha,
					pwd: that.password,
					confirm_pwd: that.confirm_pwd
				})
				.then(res => {
					that.$util.Tips({
						title: res.message
					}, {
						tab: 3
					})
				})
				.catch(res => {
					that.$util.Tips({
						title: res
					})
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
	};
</script>
<style lang="scss" scoped>
	.register{
		background: #ffffff;
		height: 100vh;
	}
	.register .list .item .code {
		color: var(--view-theme);
	}
	.whiteBg .logon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 86rpx;
		margin-top: 48rpx;
		background-color:var(--view-theme);
		border-radius: 120rpx;
		color: #FFFFFF;
		font-size: 28rpx;
	}
	.whiteBg{
		background-repeat: no-repeat;
		background-size: 100% auto;
	}
</style>
