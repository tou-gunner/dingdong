<template>
	<view :style="viewColor">
		<form report-submit='true'>
			<view class="ChangePassword pad20">
				<view>
					<view class="list mt20 bg-f boder-24">
						<view class="item">
							<text class="phone">{{userInfo.phone}}</text>
						</view>
						<view class="item acea-row row-between-wrapper codeVal">
							<input type='number' placeholder='验证码' placeholder-class='placeholder' class="codeIput" v-model="captcha"></input>
							<button class="code" :class="disabled === true ? 'on' : ''" :disabled='disabled' @click="handleVerify">
								{{ text }}
							</button>
						</view>
					</view>
					<view class="list mt20 bg-f boder-24">
						<view class="item">
							<input type='password' placeholder='新密码' placeholder-class='placeholder' v-model="password" autocomplete="off"></input>
						</view>
						<view class="item">
							<input type='password' placeholder='确认新密码' placeholder-class='placeholder' v-model="repassword" autocomplete="off"></input>
						</view>
					</view>
				</view>
				<button form-type="submit" @click="confirmSubmit" class="confirmBnt">确认</button>
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
	import { modifyPassword,verifyCode } from '@/api/api.js';
	import { getUserInfo } from '@/api/user.js';
	import { registerVerify } from '@/api/user.js'
	import { mapGetters } from "vuex";
	import { toLogin } from '@/libs/login.js';
  import Verify from '../components/verify/verify.vue';
	export default {
		mixins: [sendVerifyCode],
		components: {
      Verify
		},
		data() {
			return {
				userInfo: {},
				phone:'',
				repassword: '',
				password: '',
				captcha:'',
				key: '',
				codeVal: '',
				disabled: false,
			};
		},
		computed: mapGetters(['isLogin', 'viewColor']),
		onLoad() {
			let that = this
			if (this.isLogin) {
				this.getUserInfo()
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
			/**
			 * 获取个人用户信息
			 */
			getUserInfo: function() {
				let that = this;
				getUserInfo().then(res => {
					that.userInfo = res.data
				});
			},
			confirmSubmit: function() {
				let that = this;
				if (!that.password) return that.$util.Tips({
					title: '请填写密码！'
				});
				if (!that.repassword) return that.$util.Tips({
					title: '请确认新密码！'
				});
				if (that.password !== that.repassword) return that.$util.Tips({
					title: '两次密码不一致，请重新填写！'
				});
				if (!that.captcha) return that.$util.Tips({
					title: '请填写验证码'
				});
				modifyPassword({
					password: that.password,
					repassword: that.repassword,
					sms_code: that.captcha
				}).then(res => {
					return that.$util.Tips({
						title: '修改成功！',
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
				// if (!(/^1(3|4|5|7|8|9|6)\d{9}$/i.test(that.userInfo.phone))) return that.$util.Tips({
				// 	title: '请输入正确的手机号码！'
				// });
				this.disabled = true
				await registerVerify({
					phone:that.userInfo.phone,
					code:that.captcha,
					type: 'change_pwd',
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
	.ChangePassword .list .item .code {
		font-size: 30rpx;
		position: relative;
		padding-left: 26rpx;
		color: var(--view-theme);
		&::before{
			content: "";
			width: 1rpx;
			height: 30rpx;
			position: absolute;
			top: 10rpx;
			left: 0;
			background: #DDDDDD;
			display: inline-block;
		}
	}
	.ChangePassword .list .item .code.on {
		color: #cccccc !important;
	}
	.confirmBnt {
		font-size: 28rpx;
		width: 100%;
		height: 88rpx;
		border-radius: 50rpx;
		color: #fff;
		margin-top: 60rpx;
		text-align: center;
		line-height: 88rpx;
		background-color: var(--view-theme);
	}
</style>
