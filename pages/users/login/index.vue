<template>
	<div :style="viewColor">
		<div class="register_main" :style="{ 'background-image': formItem == 1 ? `url(${domain}/static/images/logo_bgl.png)` : `url(${domain}/static/images/logo_bgh.png)`}">
			<view class="system-height" :style="{ height: statusBarHeight }"></view>
			<!-- #ifdef APP-PLUS -->
			<view class="title-bar" style="height: 43px;">
				<view class="icon" @click="home">
					<text class="iconfont icon-ic_home"></text>
				</view>
				ເຂົ້າສູ່ລະບົບຮ້ານຄ້າ
			</view>
			<!-- #endif -->
			<div class="register absolute" v-if="!auth_token">
				<div class="whiteBg" v-if="formItem === 1">
					<view class="login_title">
						<view class="title_h">{{current==0 ? "ເຂົ້າສູ່ລະບົບດ້ວຍບັນຊີ" : "ເຂົ້າສູ່ລະບົບດ້ວຍເບີໂທ"}}</view>
						<view class="title_info" v-if="current==1">ການເຂົ້າສູ່ລະບົບຄັ້ງທຳອິດຈະລົງທະບຽນອັດຕະໂນມັດ</view>
						<view class="title_info" v-else>ບໍ່ມີບັນຊີ?<text @click="formItem = 2">ລົງທະບຽນດຽວນີ້</text></text></view>
					</view>
					<!--账号登录-->
					<div class="list" :hidden="current !== 0">
						<form @submit.prevent="submit">
							<div class="item">
								<input type="text" placeholder="ກະລຸນາປ້ອນເບີໂທຫຼືບັນຊີ" placeholder-class="placeholder" v-model="account" required />
							</div>
							<div class="item">
								<input type="password" placeholder="ປ້ອນລະຫັດຜ່ານ" placeholder-class="placeholder" v-model="password" required />
								<navigator class="forgetPwd" hover-class="none" url="/pages/users/retrievePassword/index">
									ລືມລະຫັດຜ່ານ
								</navigator>
							</div>
						</form>
					</div>
					<!--手机号验证码登录-->
					<div class="list" :hidden="current !== 1">
						<div class="item">
							<input type="text" placeholder="ປ້ອນເບີໂທລະສັບ" placeholder-class="placeholder" v-model="account" />
						</div>
						<div class="item">
							<input type="text" placeholder="ປ້ອນລະຫັດຢືນຢັນ" placeholder-class="placeholder" class="codeIput" v-model="captcha" />
							<button class="code" :disabled="disabled" :class="disabled === true ? 'on' : ''" @click="handleVerify">
								{{ text }}
							</button>
						</div>
					</div>
					<!--手机号验证码登录-->
					<div class="logon" @click="loginMobile" v-if="current ===1">ເຂົ້າສູ່ລະບົບດຽວນີ້</div>
					<div class="logon" @click="submit" v-else>ເຂົ້າສູ່ລະບົບ</div>
					<div class="tip">
						<text v-if="current==0" @click="current = 1">ເຂົ້າສູ່ລະບົບດ້ວຍເບີໂທ</text>
						<text v-else @click="current = 0">ເຂົ້າສູ່ລະບົບດ້ວຍບັນຊີ</text>
					</div>
					<div class="protocol acea-row row-between-wrapper">
						<checkbox-group class="checkgroup" @change='isAgree=!isAgree'>
							<checkbox class="checkbox" :checked="isAgree ? true : false" />
							<text class="protocol_text">ຂ້ອຍໄດ້ຍອມຮັບ<text @click="userAgree" class="font_pro">《ຂໍ້ຕົກລົງຜູ້ໃຊ້》</text>ແລະ<text @click="userPrivacyAgree" class="font_pro">《ນະໂຍບາຍຄວາມເປັນສ່ວນຕົວ》</text></text>
						</checkbox-group>
					</div>
					<!-- #ifdef APP-PLUS -->
					<view class="appLogin">
						<view class="hds">
							<span class="line"></span>
							<p>ວິທີເຂົ້າສູ່ລະບົບອື່ນໆ</p>
							<span class="line"></span>
						</view>
						<view class="btn-wrapper">
							<view class="btn wx" @click="wxLogin">
								<span class="iconfont icon-ic_wechat"></span>
							</view>
							<view class="btn wx btn-apple" @click="appleLogin" v-if="appleShow">
								<span class="iconfont icon-ic_apple"></span>
							</view>
						</view>
					</view>
					<!-- #endif -->
				</div>
				<div class="whiteBg" v-else>
					<view class="login_title">
						<view class="title_h">ລົງທະບຽນບັນຊີ</view>
					</view>
					<div class="list">
						<div class="item">
							<input type="text" placeholder="ກະລຸນາປ້ອນເບີໂທລະສັບ" placeholder-class="placeholder" v-model="account" />
						</div>
						<div class="item">
							<input type="text" placeholder="ປ້ອນລະຫັດຢືນຢັນ" placeholder-class="placeholder" class="codeIput" v-model="captcha" />
							<button class="code" :disabled="disabled" :class="disabled === true ? 'on' : ''" @click="handleVerify">
								{{ text }}
							</button>
						</div>
						<div class="item">
							<input type="password" placeholder="ປ້ອນລະຫັດຜ່ານຂອງທ່ານ" placeholder-class="placeholder" v-model="password" />
						</div>
						<div class="item" v-if="isShowCode">
							<input type="text" placeholder="ປ້ອນລະຫັດຢືນຢັນ" placeholder-class="placeholder" class="codeIput" v-model="codeVal" />
							<div class="code" @click="getcaptcha"><image class="code-img" style="width: 100%;height: 100%;" :src="codeUrl" /></div>
						</div>
					</div>
					<div class="tip">
						ມີບັນຊີແລ້ວ?
						<text @click="formItem = 1" class="t-color">ເຂົ້າສູ່ລະບົບດຽວນີ້</text>
					</div>
					<div class="logon" @click="register">ລົງທະບຽນ</div>
					<div class="protocol acea-row row-between-wrapper">
						<checkbox-group class="checkgroup" @change='isAgree=!isAgree'>
							<checkbox class="checkbox" :checked="isAgree ? true : false" />
							<text class="protocol_text">ຂ້ອຍໄດ້ຍອມຮັບ<text @click="userAgree" class="font_pro">《ຂໍ້ຕົກລົງຜູ້ໃຊ້》</text>ແລະ<text @click="userPrivacyAgree" class="font_pro">《ນະໂຍບາຍຄວາມເປັນສ່ວນຕົວ》</text></text>
						</checkbox-group>
					</div>
					<!-- #ifdef APP-PLUS -->
					<view class="appLogin">
						<view class="hds">
							<span class="line"></span>
							<p>ວິທີເຂົ້າສູ່ລະບົບອື່ນໆ</p>
							<span class="line"></span>
						</view>
						<view class="btn-wrapper">
							<view class="btn wx" @click="wxLogin">
								<span class="iconfont icon-ic_wechat"></span>
							</view>
							<view class="btn wx btn-apple" @click="appleLogin" v-if="appleShow">
								<span class="iconfont icon-ic_apple"></span>
							</view>
						</view>
					</view>
					<!-- #endif -->
				</div>
				<div class="bottom"></div>
			</div>
			<form report-submit='true' v-if="auth_token">
				<view class="register">
					<view class="whiteBg">
						<view class="login_title">
							<view class="title_h">ຜູກມັດເບີໂທລະສັບ</view>
						</view>
						<view class="list">
							<view class="item">
								<input type='number' placeholder='ປ້ອນເບີໂທລະສັບ' placeholder-class='placeholder' v-model="account"></input>
							</view>
							<view class="item">
								<input type='number' placeholder='ປ້ອນລະຫັດຢືນຢັນ' placeholder-class='placeholder' class="codeIput" v-model="captcha"></input>
								<button class="code" :class="disabled === true ? 'on' : ''" :disabled='disabled' @click="handleVerify">
									{{ text }}
								</button>
							</view>
							<view class="item">
								<input type='password' placeholder='ປ້ອນລະຫັດຜ່ານ' placeholder-class='placeholder' v-model="password"></input>
							</view>
							<view class="protocol acea-row">
								<checkbox-group class="checkgroup" @change='isAgree=!isAgree'>
									<checkbox class="checkbox" :checked="isAgree ? true : false" />
									<text class="protocol_text">ທ່ານໄດ້ຍອມຮັບ<text @click="userAgree" class="font_pro">《ຂໍ້ຕົກລົງຜູ້ໃຊ້》</text>ແລະ<text @click="userPrivacyAgree" class="font_pro">《ນະໂຍບາຍຄວາມເປັນສ່ວນຕົວ》</text></text>
								</checkbox-group>
							</view>
						</view>
						<button form-type="submit" @click="register" class="logon">ຢືນຢັນຜູກມັດ</button>
						<button form-type="submit" @click="auth_token = ''" class="logon back">ກັບຄືນ</button>
					</view>
				</view>
			</form>
			<view class="copyright">{{copyData}}</view>
			<Verify @success="success" :captchaType="'clickWord'" :imgSize="{ width: '330px', height: '155px' }" ref="verify"></Verify>
		</div>
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
	let statusBarHeight = uni.getSystemInfoSync().statusBarHeight + 'px';
	import dayjs from "@/plugin/dayjs/dayjs.min.js";
	import sendVerifyCode from "@/mixins/SendVerifyCode";
	import {
		loginH5,
		loginMobile,
		registerVerify,
		register,
		getCodeApi,
		getUserInfo,
		getCaptcha,
		appleLogin,
		loginMpPhone
	} from "@/api/user";
	// #ifdef APP-PLUS
	import { wechatAppAuth, appleAppAuth } from '@/api/api.js'
	// #endif
	import attrs, {	required, alpha_num, chs_phone } from "@/utils/validate";
	import { getLogo, getconfig, getVersion } from "@/api/public";
	import { getCartCounts } from '@/api/order.js';
	import { VUE_APP_API_URL,	configMap } from "@/utils";
	import { HTTP_REQUEST_URL } from '@/config/app';
	import parser from "@/components/jyf-parser/jyf-parser";
	import { commonAuth } from '../../../api/public';
	import { mapGetters} from "vuex";
	import Verify from '../components/verify/verify.vue';
	const BACK_URL = "login_back_url";
	export default {
		name: "Login",
		mixins: [sendVerifyCode],
		components: {
			"jyf-parser": parser,
			Verify
		},
		data: function() {
			return {
				domain: HTTP_REQUEST_URL,
				statusBarHeight: statusBarHeight,
				current: 1,
				account: "",
				password: "",
				captcha: "",
				formItem: 1,
				type: "login",
				keyCode: "",
				codeUrl: "",
				codeVal: "",
				isShowCode: false,
				tagStyle: {
					img: 'width:100%;display:block;'
				},
				isAgree: false,
				appLoginStatus: false, // 微信登录强制绑定手机号码状态
				appUserInfo: null, // 微信登录保存的用户信息
				appleLoginStatus: false, // 苹果登录强制绑定手机号码状态
				appleUserInfo: null,
				appleShow: false, // 苹果登录版本必须要求ios13以上的
				keyLock: true,
				auth_token: "",
				codeVal: '',
				copyright: {}
			};
		},
		computed:{
			...configMap(['login_logo','wechat_phone_switch','community_status'], mapGetters(['viewColor'])),
			copyData() {
				let copy = this.copyright.status == -1 ? this.copyright.year : this.copyright.Copyright
				return copy;
			}
		},
		watch: {
			formItem: function(nval, oVal) {
				if (nval == 1) {
					this.type = 'login'
				} else {
					this.type = 'register'
				}
			}
		},
		onLoad() {
			let self = this
			uni.getSystemInfo({
				success: function(res) {
					if (res.platform.toLowerCase() == 'ios' && self.getSystem(res.system) >= 13) {
						self.appleShow = true
					}
				}
			});
		},
		mounted: function() {
			this.getVersion();
		},
		onReady(){
			let that = this
			// #ifdef MP
			wx.login({
			  success (res) {
			    if (res.code) {
			     that.codeVal = res.code
			    } else {
			      console.log('ເຂົ້າສູ່ລະບົບລົ້ມເຫລວ！' + res.errMsg)
			    }
			  }
			})
			// #endif
		},
		methods: {
			// #ifdef MP
			getPhoneNumber(e) {
				let that = this;
				if(!that.isAgree){
					return that.$util.Tips({
						title: 'ກະລຸນາເລືອກຂໍ້ຕົກລົງຜູ້ໃຊ້ແລະນະໂຍບາຍຄວາມເປັນສ່ວນຕົວ'
					});
				}else{
					loginMpPhone({
						iv:e.detail.iv,
						encryptedData:e.detail.encryptedData,
						code:that.codeVal,
						auth_token: uni.getStorageSync('auth_token'),
						}).then(({
							data
						}) => {
							const backUrl = that.$Cache.get(BACK_URL) || "/pages/index/index";
							that.$Cache.clear(BACK_URL);
							that.$store.commit("LOGIN", {
								'token': data.token,
								'time': data.exp
							});
							that.$store.commit("SETUID", data.user.uid);
							that.$store.commit('UPDATE_USERINFO', data.user);
							let method
							let indexPat = ['/pages/index/index', '/pages/order_addcart/order_addcart', '/pages/goods_cate/goods_cate',
								'/pages/user/index'
							]
							if (indexPat.includes(this.getPath(backUrl))) {
								method = 'switchTab'
							} else {
								method = 'navigateTo'
							}
							this.getCartNum()
							if (this.getPath(backUrl) === '/pages/users/login/index') {
								uni.switchTab({
									url: '/pages/index/index'
								});
								return
							}
							uni[method]({
								url: backUrl
							});
						})
						.catch(res => {
							that.$util.Tips({
								title: res
							});
						});
				}

			},
			// #endif
			userAgree(){
				uni.navigateTo({
					url: '/pages/users/user_about/index?from=sys_user_agree'
				})
			},
			userPrivacyAgree(){
				uni.navigateTo({
					url: '/pages/users/user_about/index?from=sys_userr_privacy'
				})
			},
			getSystem(system) {
				if(system.indexOf('iOS') === -1){
					return system
				}else{
					let str = system.split(' ')[1]
					if (str.indexOf('.')) {
						return Number(str.split('.')[0])
					} else {
						return Number(str)
					}
				}
			},
			home() {
				uni.switchTab({
					url: '/pages/index/index'
				})
			},
			// 苹果登录
			appleLogin() {
				let self = this
				if(!self.isAgree){
					return self.$util.Tips({
						title: 'ກະລຸນາເລືອກຂໍ້ຕົກລົງຜູ້ໃຊ້ແລະນະໂຍບາຍຄວາມເປັນສ່ວນຕົວ'
					});
				}else{
					this.account = ''
					this.captcha = ''
					uni.showLoading({
						title: 'ກຳລັງເຂົ້າສູ່ລະບົບ...'
					})
					uni.login({
						provider: 'apple',
						timeout: 10000,
						success(loginRes) {
							uni.getUserInfo({
								provider: 'apple',
								success: function(infoRes) {
									self.appleUserInfo = infoRes.userInfo
									self.appleLoginApi()
								},
								fail() {
								uni.showToast({
									title: 'ບໍ່ສາມາດເກັບຂໍ້ມູນຜູ້ໃຊ້ໄດ້',
									icon: 'none',
									duration: 2000
								})
								},
								complete() {
									uni.hideLoading()
								}
							});
						},
						fail(error) {
								uni.showToast({
									title: 'ບໍ່ສາມາດເກັບຂໍ້ມູນຜູ້ໃຊ້ໄດ້',
									icon: 'none',
									duration: 2000
								})
							console.log(error)
						}
					})
				}
			},
			appleLoginApi(){
				let that = this
				commonAuth({
					auth: {
						type:'apple',
						auth: {
							userInfo: that.appleUserInfo,
							openId: that.appleUserInfo.openId,
							nickname: (that.appleUserInfo.fullName.familyName || '') + (that.appleUserInfo.fullName.giveName || ''),
						}
				}}).then(res => {
					const data = res.data;
					if(res.data.status == 200){
						const backUrl = that.$Cache.get(BACK_URL) || "/pages/index/index";
						that.$Cache.clear(BACK_URL);
						that.$store.commit("LOGIN", {
							'token': data.result.token,
							'time': data.result.exp
						});
						that.$store.commit("SETUID", data.result.user.uid);
						that.$store.commit('UPDATE_USERINFO', data.result.user);
						let method
						let indexPat = ['/pages/index/index', '/pages/order_addcart/order_addcart', '/pages/goods_cate/goods_cate',
							'/pages/user/index'
						]
						if (indexPat.includes(this.getPath(backUrl))) {
							method = 'switchTab'
						} else {
							method = 'navigateTo'
						}
						if (this.getPath(backUrl) === '/pages/users/login/index') {
							uni.switchTab({
								url: '/pages/index/index'
							});
							return
						}
						uni[method]({
							url: backUrl
						});
					}else{
						uni.hideLoading();
						that.auth_token = res.data.result.key;
					}
				}).catch(res => {
					uni.hideLoading();
					uni.showToast({
						title: res.message || res,
						icon: 'none',
						duration: 2000
					});
				});
			},
			// App微信登录
			wxLogin() {
				if (!this.isAgree) return this.$util.Tips({
					title: 'ກະລຸນາເລືອກຂໍ້ຕົກລົງຜູ້ໃຊ້ແລະນະໂຍບາຍຄວາມເປັນສ່ວນຕົວ'
				});
				let self = this
				this.account = ''
				this.captcha = ''
				uni.showLoading({
					title: 'ກຳລັງເຂົ້າສູ່ລະບົບ...'
				})
				uni.login({
					provider: 'weixin',
					// onlyAuthorize: true,
					success: function(loginRes) {
						self.appUserInfo = loginRes
						self.wxLoginApi()
					},
					fail(error) {
					uni.showToast({
						title: 'ເຂົ້າສູ່ລະບົບລົ້ມເຫລວ',
						icon: 'none',
						duration: 2000
					})
					}
				});
			},
			getPath(url) {
				if (url.indexOf("?") != -1) {
					url = url.split("?")[0];
					console.log(url);
				}
				return url
			},
			wxLoginApi() {
				const that = this
				commonAuth({
					auth: {
						type:'app_wechat',
						auth: {
							code: that.appUserInfo.authResult.access_token,
							openid: that.appUserInfo.authResult.openid,
							phone: this.account,
						}
				}}).then(res => {
					const data = res.data;
					if(res.data.status == 200){
						const backUrl = that.$Cache.get(BACK_URL) || "/pages/index/index";
						that.$Cache.clear(BACK_URL);
						that.$store.commit("LOGIN", {
							'token': data.result.token,
							'time': data.result.exp
						});
						that.$store.commit("SETUID", data.result.user.uid);
						that.$store.commit('UPDATE_USERINFO', data.result.user);
						let method
						let indexPat = ['/pages/index/index', '/pages/order_addcart/order_addcart', '/pages/goods_cate/goods_cate',
							'/pages/user/index'
						]
						if (indexPat.includes(this.getPath(backUrl))) {
							method = 'switchTab'
						} else {
							method = 'navigateTo'
						}
						this.getCartNum()
						if (this.getPath(backUrl) === '/pages/users/login/index') {
							uni.switchTab({
								url: '/pages/index/index'
							});
							return
						}
						uni[method]({
							url: backUrl
						});
					}else{
						that.auth_token = res.data.result.key;
						that.bindStatus = true;
					}
						uni.hideLoading();
				}).catch(res => {
					uni.hideLoading();
					uni.showToast({
						title: res.message || res,
						icon: 'none',
						duration: 2000
					});
				});
			},
			getCode(data) {
				let that = this
				getCodeApi()
					.then(res => {
						that.keyCode = res.data.key;
						that.code(data);
					})
					.catch(res => {
						that.$util.Tips({
							title: res
						});
					});
			},
			async loginMobile() {
				let that = this;
				if (!that.account) return that.$util.Tips({
					title: 'ກະລຸນາປ້ອນເບີໂທລະສັບ'
				});
				if (!/^1(3|4|5|7|8|9|6)\d{9}$/i.test(that.account)) return that.$util.Tips({
					title: 'ກະລຸນາປ້ອນເບີໂທລະສັບທີ່ຖືກຕ້ອງ'
				});
				if (!that.captcha) return that.$util.Tips({
					title: 'ກະລຸນາປ້ອນລະຫັດຢືນຢັນ'
				});
				if (!/^[\w\d]+$/i.test(that.captcha)) return that.$util.Tips({
					title: 'ກະລຸນາປ້ອນລະຫັດຢືນຢັນທີ່ຖືກຕ້ອງ'
				});
				if (!that.isAgree) return that.$util.Tips({
					title: 'ກະລຸນາເລືອກຂໍ້ຕົກລົງຜູ້ໃຊ້ແລະນະໂຍບາຍຄວາມເປັນສ່ວນຕົວ'
				});
				loginMobile({
					auth_token: uni.getStorageSync('auth_token'),
					phone: that.account,
					sms_code: that.captcha,
					spread: that.$Cache.get("spread"),
					// #ifdef APP-PLUS
					user_type: 'app',
					// #endif
					// #ifdef H5
					user_type: 'h5',
					// #endif
				})
				.then(({
					data
				}) => {
					const backUrl = that.$Cache.get(BACK_URL) || "/pages/index/index";
					that.$Cache.clear(BACK_URL);
					that.$store.commit("LOGIN", {
						'token': data.token,
						'time': data.exp
					});
					that.$store.commit("SETUID", data.user.uid);
					that.$store.commit('UPDATE_USERINFO', data.user);
					let method
					let indexPat = ['/pages/index/index', '/pages/order_addcart/order_addcart', '/pages/goods_cate/goods_cate',
						'/pages/user/index'
					]
					if (indexPat.includes(this.getPath(backUrl))) {
						method = 'switchTab'
					} else {
						method = 'navigateTo'
					}
					this.getCartNum()
					if (this.getPath(backUrl) === '/pages/users/login/index') {
						uni.switchTab({
							url: '/pages/index/index'
						});
						return
					}
					uni[method]({
						url: backUrl
					});
				})
				.catch(res => {
					that.$util.Tips({
						title: res
					});
				});
			},
			async register() {
				let that = this;
				if (!that.account) return that.$util.Tips({
					title: 'ກະລຸນາປ້ອນເບີໂທລະສັບ'
				});
				if (!/^1(3|4|5|7|8|9|6)\d{9}$/i.test(that.account)) return that.$util.Tips({
					title: 'ກະລຸນາປ້ອນເບີໂທລະສັບທີ່ຖືກຕ້ອງ'
				});
				if (!that.captcha) return that.$util.Tips({
					title: 'ກະລຸນາປ້ອນລະຫັດຢືນຢັນ'
				});
				if (!/^[\w\d]+$/i.test(that.captcha)) return that.$util.Tips({
					title: 'ກະລຸນາປ້ອນລະຫັດຢືນຢັນທີ່ຖືກຕ້ອງ'
				});
				if (!that.password) return that.$util.Tips({
					title: 'ກະລຸນາປ້ອນລະຫັດຜ່ານ'
				});
				if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/i.test(that.password)) return that.$util.Tips({
					title: 'ກະລຸນາປ້ອນລະຫັດຜ່ານຄວາມຍາວ 6-16 ຕົວອັກສອນປະສົມລະຫວ່າງຕົວອັກສອນແລະເລກ'
				});
				if (!that.isAgree) return that.$util.Tips({
					title: 'ກະລຸນາເລືອກຂໍ້ຕົກລົງຜູ້ໃຊ້ແລະນະໂຍບາຍຄວາມເປັນສ່ວນຕົວ'
				});
				register({
					auth_token: this.auth_token || uni.getStorageSync('auth_token'),
					phone: that.account,
					sms_code: that.captcha,
					pwd: that.password,
					spread: that.$Cache.get("spread"),
					// #ifdef APP-PLUS
					user_type: 'app',
					// #endif
					// #ifdef H5
					user_type: 'h5',
					// #endif
				})
				.then(res => {
					const backUrl = that.$Cache.get(BACK_URL) || "/pages/index/index";
					that.$Cache.clear(BACK_URL);
					that.$store.commit("LOGIN", {
						'token': res.data.token,
						'time': res.data.exp
					});
					that.$store.commit("SETUID", res.data.user.uid);
					that.$store.commit('UPDATE_USERINFO', res.data.user);
					uni.switchTab({
						url: '/pages/user/index'
					})
				})
				.catch(res => {
					that.$util.Tips({
						title: res
					});
				});
			},
			async code(data) {
				let that = this;
				if (!that.account) return that.$util.Tips({
					title: 'ກະລຸນາປ້ອນເບີໂທລະສັບ'
				});
				if (!/^1(3|4|5|7|8|9|6)\d{9}$/i.test(that.account)) return that.$util.Tips({
					title: 'ກະລຸນາປ້ອນເບີໂທລະສັບທີ່ຖືກຕ້ອງ'
				});
				await registerVerify({
						phone: that.account,
						type: 'login',
						key: that.keyCode,
						// code: that.codeVal,
						toke:data.token,
						captchaType: 'clickWord',
						captchaVerification: data.captchaVerification
					})
					.then(res => {
						that.$util.Tips({
							title: res.message
						});
						that.sendCode();
					})
					.catch(res => {
						that.$util.Tips({
							title: res
						});
					});
			},
			getcaptcha() {
				let that = this
				getCaptcha().then(data => {
					// that.codeUrl = `${VUE_APP_API_URL}/sms_captcha?key=${that.keyCode}`;
					that.codeUrl = data.data.captcha;
					that.keyCode = data.data.key
				})
				that.isShowCode = true;
			},
			navTap: function(index) {
				this.current = index;
			},
			getPath(url) {
				if (url.indexOf("?") != -1) {
					url = url.split("?")[0];
				}
				return url
			},
			async submit() {
				let that = this;
				if (!that.account) return that.$util.Tips({
					title: 'ກະລຸນາປ້ອນບັນຊີ'
				});
				if (!/^[\w\d]{5,16}$/i.test(that.account)) return that.$util.Tips({
					title: 'ກະລຸນາປ້ອນບັນຊີທີ່ຖືກຕ້ອງ'
				});
				if (!that.password) return that.$util.Tips({
					title: 'ກະລຸນາປ້ອນລະຫັດຜ່ານ'
				});
				if (!that.isAgree) return that.$util.Tips({
					title: 'ກະລຸນາເລືອກຂໍ້ຕົກລົງຜູ້ໃຊ້ແລະນະໂຍບາຍຄວາມເປັນສ່ວນຕົວ'
				});
				loginH5({
						auth_token: uni.getStorageSync('auth_token'),
						account: that.account,
						password: that.password,
						spread: that.$Cache.get("spread")
					})
					.then(({
						data
					}) => {
						const backUrl = that.$Cache.get(BACK_URL) || "/pages/index/index";
						that.$Cache.clear(BACK_URL);
						that.$store.commit("LOGIN", {
							'token': data.token,
							'time': data.exp
						});
						that.$store.commit("SETUID", data.user.uid);
						that.$store.commit('UPDATE_USERINFO', data.user);
						let method
						let indexPat = ['/pages/index/index', '/pages/order_addcart/order_addcart', '/pages/goods_cate/goods_cate',
							'/pages/user/index'
						]
						if (indexPat.includes(this.getPath(backUrl))) {
							method = 'switchTab'
						} else {
							method = 'navigateTo'
						}
						this.getCartNum()
						if (this.getPath(backUrl) === '/pages/users/login/index') {
							uni.switchTab({
								url: '/pages/index/index'
							});
							return
						}
						uni[method]({
							url: backUrl
						});
					})
					.catch(e => {
						that.$util.Tips({
							title: e
						});
					});
			},
			getVersion() {
				getVersion().then(data => {
					this.copyright = data.data;
				});
			},
			success(data) {
				this.$refs.verify.hide();
				this.code(data);
			},
			handleVerify() {
				let that = this;
				if (!that.account) return that.$util.Tips({
					title: 'ກະລຸນາປ້ອນເບີໂທລະສັບ'
				});
				if (!/^1(3|4|5|7|8|9|6)\d{9}$/i.test(that.account)) return that.$util.Tips({
					title: 'ກະລຸນາປ້ອນເບີໂທລະສັບທີ່ຖືກຕ້ອງ'
				});
				if (!that.isAgree) return that.$util.Tips({
					title: 'ກະລຸນາເລືອກຂໍ້ຕົກລົງຜູ້ໃຊ້ແລະນະໂຍບາຍຄວາມເປັນສ່ວນຕົວ'
				});
				that.$refs.verify.show();
			},
			getCartNum: function() {
				getCartCounts().then(res => {
					this.$store.commit('UPDATE_CARTNUM', res.data[0].count);
					if(res.data[0].count){
						uni.setTabBarBadge({
							index: 2,
							text: res.data[0].count
						})
					}
				});
			},
		}
	};
</script>
<style lang="scss" scoped>
	::v-deep uni-checkbox .uni-checkbox-input,
	::v-deep checkbox .wx-checkbox-input{
		border-radius: 100%;
		width: 30rpx;
		height: 30rpx;
	}
	::v-deep checkbox .uni-checkbox-input.uni-checkbox-input-checked,
	::v-deep checkbox .wx-checkbox-input.wx-checkbox-input-checked {
		border: 1px solid var(--view-theme)!important;
		background-color: var(--view-theme)!important;
	}
	.register .whiteBg .title_info text{
		color: var(--view-theme);
	}
	.register .list .item .code {
		color: var(--view-theme);
	}
	.title-bar {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 34rpx;
		font-weight: 500;
		color: #333333;
		line-height: 48rpx;
		.icon {
			position: absolute;
			left: 30rpx;
			top: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			width: 80rpx;
			height: 80rpx;
			image {
				width: 50rpx;
				height: 50rpx;
			}
		}
	}
	.code image {
		width: 100%;
		height: 100%;
	}
	.protocol_text{
		color: #999;
		font-size: 24rpx;
	}
	.protocol{
		margin-top: 82rpx;
		justify-content: center;
	}
	.protocol_text{
		.font_pro{
			color: var(--view-theme);
		}
	}
	.appLogin {
		margin-top: 82rpx;
		.hds {
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 24rpx;
			color: #B4B4B4;
			.line {
				width: 68rpx;
				height: 1rpx;
				background: #CCCCCC;
			}
			p {
				margin: 0 20rpx;
			}
		}
		.btn-wrapper {
			display: flex;
			align-items: center;
			justify-content: center;
			margin-top: 30rpx;
			.btn {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 68rpx;
				height: 68rpx;
				border-radius: 50%;
				+ .btn {
					margin-left: 30rpx;
				}
			}
			.apple-btn {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 246rpx;
				height: 66rpx;
				margin-left: 10rpx;
				background: #EAEAEA;
				border-radius: 34rpx;
				font-size: 24rpx;
				.icon-s-pingguo {
					color: #333;
					margin-right: 10rpx;
					font-size: 34rpx;
				}
			}
			.iconfont {
				font-size: 40rpx;
				color: #fff;
			}
			.wx {
				background-color: #61C64F;
				&.btn-apple{
					margin-right: 0;
					background-color: #333;
				}
			}
		}
	}
	.whiteBg .logon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 88rpx;
		margin-top: 48rpx;
		background-color: var(--view-theme);
		border-radius: 100rpx;
		color: #FFFFFF;
		font-size: 28rpx;
	}
	.whiteBg .back{
		border: 1px solid  var(--view-theme);
		color: var(--view-theme);
		margin-top: 30rpx;
		background-color: transparent;
	}
	.copyright {
		position: fixed;
		bottom: 30rpx;
		left: 0;
		width: 100%;
		text-align: center;
		font-size: 20rpx;
		line-height: 28rpx;
		color: #9E9E9E;
	}
	.t-color{color: var(--view-theme);}
</style>
