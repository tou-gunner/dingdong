<template>
	<view class="pad20" :style="viewColor">
		<form report-submit='true'>
			<view class="ChangePassword">
				<view class="list bg-f boder-24 mt20">
					<view class="item">
						<input type='text' name='nickname' :value='userInfo.nickname' disabled></input>
					</view>
					<view class="item acea-row row-between-wrapper">
						<input type='nickname' placeholder='新昵称(限8个字符以内)' maxlength="8" placeholder-class='placeholder' class="codeIput"
							v-model="inputcontent"></input>
					</view>
				</view>
				<button form-type="submit" @click="inputEdita" class="confirmBnt">确认修改</button>
			</view>
		</form>
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
	import { getUserInfo, userEdit, editAvatar } from '@/api/user.js'
	import { mapGetters } from "vuex";
	import { toLogin } from '@/libs/login.js';
	export default {
		components: {},
		data() {
			return {
				userInfo: {},
				inputcontent: "",
			};
		},
		computed: mapGetters(['isLogin', 'viewColor']),
		onLoad() {
			if (this.isLogin) {
				this.getUserInfo();
			} else {
				toLogin()
			};
		},
		methods: {
			/**
			 * 获取用户详情
			 */
			getUserInfo: function() {
				let that = this;
				getUserInfo().then(res => {
					that.$set(that, 'userInfo', res.data);
				});
			},
			inputEdita() {
				if (this.userInfo.nickname == this.inputcontent) {
					uni.showToast({
						title: '昵称重复，请重新修改！',
						icon:'none',
					});
				} else if (this.inputcontent == '') {
					uni.showToast({
						title: '昵称不能为空！',
						icon: 'none',
					});
				} else {
					editAvatar({
						nickname: this.inputcontent
					}).then(res => {
						return this.$util.Tips({
							title: '修改成功！',
							icon: 'success'
						}, {
							tab: 5,
							url: '/pages/users/user_info/index'
						});
					}).catch(err => {
						uni.showToast({
							title: err,
							icon: 'none'
						});
					});
				}
			},
		}
	}
</script>

<style lang="scss" scoped>

</style>
