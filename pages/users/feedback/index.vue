<template>
	<view class="feedback" :style="viewColor">
		<view class="tips" v-if="service_type.sys_service_switch != 0 && ((isRoutine && service_type.sys_service_switch==5) || (!isRoutine && service_type.sys_service_switch!=5))">
			<view class="tipBox">
				<view class="left">
					<image :src="`${domain}/static/images/kefu.png`" mode=""></image>
					<view class="font">如需尽快解决问题，可直接联系在线客服</view>
				</view>
				<view @click="customer" v-if="service_type.sys_service_switch != 5"><i class="iconfont icon-ic_rightarrow" style="fontsize: 24rpx"></i></view>
				<!--#ifdef MP-->
				<button v-if="service_type.sys_service_switch == 5" open-type='contact' hover-class='none' class="button acea-row row-middle">
					<i class="iconfont icon-ic_rightarrow" style="fontsize: 24rpx"></i>
				</button>
				<!--#endif-->
			</view>
		</view>
		<view class="pad20 ">
			<view class="feedback-container bg-f boder-24">
				<view class="item-box">
					<view class="title-box">
						<text>*</text>
						反馈类型
					</view>
					<view class="tab-box" v-if="tabList.length > 0">
						<block v-for="(item, index) in tabList" :key="index">
							<view class="tab-item" :key="index" :class="{ active: index == tabKey }" @click="bindTab(item, index)">{{ item.cate_name }}</view>
						</block>
					</view>
					<view class="picker" v-if="qsArray.length > 0">
						<picker @change="bindPickerChange" :value="qsIndex" :range="qsArray" range-key="cate_name">
							<view class="picker-box">
								{{ qsArray[qsIndex]['cate_name'] }}
								<text class="iconfont icon-ic_downarrow"></text>
							</view>
						</picker>
					</view>
				</view>
				<view class="item-box">
					<view class="title-box">
						<text>*</text>
						反馈内容
					</view>
					<view class="textarea-box">
						<textarea maxlength="200" placeholder-class="placeholder" placeholder="请输入文字" v-model="con" />
						<view class="num">{{ con.length }}/200字</view>
					</view>
				</view>
				<view class="item-box">
					<view class="title-box">
						<text>*</text>
						图片上传
						<text class="des">(上传聊天截图或与问题描述相关的图片)</text>
					</view>
					<view class="upload-img">
						<view class="img-wrapper" v-if="uploadImg.length > 0" v-for="(item, index) in uploadImg" :key="index">
							<image :src="item"></image>
							<view class="iconfont icon-ic_close2" @click="deleteImg(index)"></view>
						</view>
						<view class="add-img" @click="uploadpic" v-if="isUpload">
							<text class="iconfont icon-ic_camera1"></text>
						</view>
					</view>
				</view>
				<view class="item-box">
					<view class="title-box">
						<text>*</text>
						联系方式
					</view>
					<view class="input-box">
						<input type="text" placeholder-class="placeholderc" placeholder="请填写您的姓名" v-model="name" />
						<input type="text" placeholder-class="placeholderc" placeholder="请填写您的电话或邮箱" v-model="phone" />
					</view>
				</view>
				<view class="item-box">
					<view class="sub-btn" @click="bindSub">ສົ່ງຄຳຄິດເຫັນ</view>

				</view>
				<view class="success" v-if="isShowbox">
					<view class="bg"></view>
					<view class="con">
						<image :src="domain + '/static/diy/success' + keyColor + '.png'" mode=""></image>
						<view class="text">ສົ່ງຄຳຄິດເຫັນສຳເລັດແລ້ວ</view>
						<navigator hover-class="none" url="/pages/user/index" open-type='switchTab' class="btn" @click="close">ຂ້ອຍຮັບຊາບແລ້ວ</navigator>
					</view>
				</view>
			</view>
			<navigator url="/pages/users/feedback/list" class="link" hover-class="none">
				反馈记录
				<text class="iconfont icon-ic_rightarrow"></text>
			</navigator>
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
import { feedbackType, feedback, hasServiceApi } from '@/api/user.js';
import { checkPhone, isEmailAvailable } from '@/utils/validate.js';
import { mapGetters } from 'vuex';
import { HTTP_REQUEST_URL } from '@/config/app';
import { configMap, getCustomer } from '@/utils';
let app = getApp();
export default {
	data() {
		return {
			domain: HTTP_REQUEST_URL,
			// 反馈类型
			tabList: [],
			// 反馈类型key
			tabKey: 0,
			// 反馈列表
			qsArray: [],
			// 反馈index
			qsIndex: 0,
			// 反馈内容
			con: '',
			uploadImg: [],
			name: '',
			phone: '',
			isShowbox: false,
			isUpload: true,
			service: false,
			is_open_service: false,
			//#ifdef MP
			isRoutine: true,
			//#endif
			//#ifndef MP
			isRoutine: false,
			//#endif
		};
	},
	computed: {
		...configMap({site_logo:'',service_type: {}},
		mapGetters(['viewColor', 'keyColor'])),
	},
	watch: {
		uploadImg(nVal, oVal) {
			this.isUpload = nVal.length < 6 ? true : false;
		}
	},
	onLoad() {
		this.hasService();
		// 获取反馈类型
		feedbackType().then(({ data }) => {
			this.tabList = data;
			this.getFeedBack(data);
		});
	},
	mounted() {
		setTimeout((e) => {
			console.log(app.globalData.sys_service_data,'app.globalData.sys_service_data')
			if (app.globalData.sys_service_data.type != 0) this.is_open_service = true;
		}, 100);
	},
	methods: {
		customer() {
			let that = this;
			let sys = that.service_type
			let data = {
				type: sys.sys_service_switch,
				service_phone: sys.sys_phone,
				customer_url: sys.customer_url,
				customer_corpId: sys.customer_corpId,
				customer_link: sys.customer_link
			}
			let url = `/pages/chat/customer_list/chat?type=0`
			getCustomer(data, url)
		},
		toChat() {
			uni.navigateTo({
				url: `/pages/chat/customer_list/chat?mer_id=0`
			});
		},
		/*判断店铺是否有在线客服*/
		hasService() {
			hasServiceApi(0)
				.then((res) => {
					this.service = true;
				})
				.catch((err) => {
					this.service = false;
				});
		},
		// 获取含有二级分类的反馈类型
		getFeedBack(data) {
			let that = this;
			data.forEach(function (item, i) {
				if (item.children) {
					that.tabKey = i;
					that.qsArray = data[that.tabKey].children;
					return;
				}
			});
		},
		// 下拉选中
		bindPickerChange(e) {
			this.qsIndex = e.target.value;
		},
		// tab切换
		bindTab(item, index) {
			this.tabKey = index;
			this.qsIndex = 0;
			this.qsArray = this.tabList[this.tabKey].children ? this.tabList[this.tabKey].children : [];
		},
		/**
		 * 上传文件
		 *
		 */
		uploadpic: function () {
			let that = this;
			that.$util.uploadImageOne('upload/image', function (res) {
				console.log(res, '回调');
				that.uploadImg.push(res.data.path);
				that.$set(that, 'uploadImg', that.uploadImg);
			});
		},
		// 弹窗关闭
		close() {
			this.con = '';
			this.uploadImg = [];
			this.name = '';
			this.phone = '';
			this.isShowbox = false;
		},
		// 删除图片
		deleteImg(index) {
			this.uploadImg.splice(index, 1);
		},
		// 提交反馈
		bindSub() {
			if (!this.con) {
				uni.showToast({
					title: '请输入反馈内容',
					icon: 'none'
				});
				return;
			}
			if (this.uploadImg.length == 0) {
				uni.showToast({
					title: '请上传图片',
					icon: 'none'
				});
				return;
			}
			if (!this.name) {
				uni.showToast({
					title: '请输入姓名',
					icon: 'none'
				});
				return;
			}
			if (!this.phone) {
				uni.showToast({
					title: '请输入电话或者邮箱',
					icon: 'none'
				});
				return;
			}
			if (!isEmailAvailable(this.phone) && !checkPhone(this.phone)) {
				uni.showToast({
					title: '请输入有效的电话或者邮箱',
					icon: 'none'
				});
				return;
			}
			feedback({
				type: (this.qsArray[this.qsIndex] && this.qsArray[this.qsIndex].feedback_category_id) || 0,
				content: this.con,
				images: this.uploadImg,
				realname: this.name,
				contact: this.phone
			})
				.then((res) => {
					this.isShowbox = true;
				})
				.catch((error) => {
					this.$util.Tips({
						title: error
					});
				});
		}
	}
};
</script>

<style lang="scss">
.tips {
	padding: 20rpx 20rpx 0;
	.tipBox {
		width: 100%;
		height: 100rpx;
		background: var(--view-minorColor);
		border-radius: 24rpx;
		line-height: 100rpx;
		display: flex;
		justify-content: space-between;
		font-size: 24rpx;
		font-weight: 400;
		color: var(--view-theme);
		padding: 0rpx 30rpx;
		.left {
			display: flex;
			image {
				width: 70rpx;
				height: 70rpx;
				background: #ffffff;
				border-radius: 50%;
				display: inline-block;
				margin-top: 15rpx;
			}
			.font {
				padding-left: 20rpx;
			}
		}
	}
}
.feedback-container {
	padding: 20rpx;
	margin-top: 20rpx;
	.item-box {
		margin-bottom: 40rpx;
		.title-box {
			font-size: 28rpx;
			color: #222222;
			text {
				margin-right: 10rpx;
				color: var(--view-theme);
			}
			.des {
				margin-left: 10rpx;
				font-size: 22rpx;
				color: #999999;
			}
		}
		.tab-box {
			margin-top: 20rpx;
			display: flex;
			flex-wrap: wrap;
			.tab-item {
				line-height: 60rpx;
				align-items: center;
				justify-content: center;
				width: 200rpx;
				margin: 0 20rpx 20rpx 0;
				border: 2rpx solid #dddddd;
				border-radius: 100rpx;
				font-size: 26rpx;
				text-align: center;
				color: #999;
				&.active {
					background: var(--view-theme);
					color: #fff;
					border-color: var(--view-theme);
				}
			}
		}
		.picker {
			margin-top: 30rpx;
			.picker-box {
				position: relative;
				width: 100%;
				height: 90rpx;
				line-height: 90rpx;
				padding: 0 30rpx;
				background-color: #f5f5f5;
				border-radius: 16rpx;
				.iconfont {
					position: absolute;
					right: 30rpx;
					top: 50%;
					transform: translateY(-50%);
					font-size: 28rpx;
				}
				.icon-ic_rightarrow {
					color: var(--view-theme);
				}
				.icon-ic_downarrow {
					color: #999;
				}
			}
		}
		.textarea-box {
			background: #f5f5f5;
			border-radius: 16rpx;
			textarea {
				width: 100%;
				height: 300rpx;
				margin-top: 30rpx;
				padding: 20rpx 20rpx 0;
				font-size: 28rpx;
				line-height: 1.5;
			}
			.num {
				color: #999;
				text-align: right;
				padding: 20rpx;
			}
		}
		.upload-img {
			display: flex;
			flex-wrap: wrap;
			.img-wrapper {
				position: relative;
				display: flex;
				flex-wrap: wrap;
				margin: 30rpx 20rpx 20rpx 0;
				width: 158rpx;
				height: 158rpx;
				image {
					width: 158rpx;
					height: 158rpx;
					border-radius: 16rpx;
				}
				.iconfont {
					position: absolute;
					right: -15rpx;
					top: -20rpx;
					font-size: 40rpx;
					color: var(--view-theme);
				}
				&:nth-child(4n) {
					margin-right: 0;
				}
			}
			.add-img {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 158rpx;
				height: 158rpx;
				background: #f5f5f5;
				border-radius: 16rpx;
				margin-top: 30rpx;
				margin-bottom: 20rpx;
				.iconfont {
					color: #b5b5b5;
					font-size: 55rpx;
				}
			}
		}
		.input-box {
			input {
				display: block;
				width: 100%;
				height: 90rpx;
				margin-top: 20rpx;
				padding-left: 20rpx;
				background: #f5f5f5;
				border-radius: 16rpx;
				font-size: 28rpx;
			}
		}
		.sub-btn {
			height: 88rpx;
			line-height: 88rpx;
			background: var(--view-theme);
			color: #fff;
			font-size: 28rpx;
			text-align: center;
			border-radius: 100rpx;
		}
	}
	.success {
		z-index: 10;
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		.bg {
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			background-color: rgba(0, 0, 0, 0.5);
		}
		.con {
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			width: 500rpx;
			height: 540rpx;
			background: #fff;
			border-radius: 16rpx;
			font-size: 34rpx;
			color: #282828;
			image {
				width: 149rpx;
				height: 230rpx;
			}
			.btn {
				width: 340rpx;
				height: 88rpx;
				line-height: 88rpx;
				margin-top: 38rpx;
				text-align: center;
				color: #fff;
				background-image: linear-gradient(-90deg, var(--view-bntColor21) 0%, var(--view-bntColor22) 100%);
				border-radius: 50rpx;
			}
		}
	}
}
.feedback {
	padding-bottom: 46rpx;
	.link {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: 36rpx;
		width: 100%;
		color: #666666;
		.iconfont {
			margin-top: 6rpx;
			font-size: 22rpx;
		}
	}
}
.button {
	background: transparent;
	.icon-ic_rightarrow {
		color: var(--view-theme);
	}
}
</style>
