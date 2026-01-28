<template>
	<view class="merchant-details">
		<view class="top">
			<image class="img" :src="`${domain}/static/images/successTop.png`" mode=""></image>
			<view class="title">
				ຍິນດີນຳ, ການສະໝັກຂອງທ່ານຜ່ານການກວດສອບແລ້ວ!
			</view>
		</view>
		<view class="msg" v-if="mer_id > 0 && resData.login_url">
			<view class="url">
				<text class="head">ລິ້ງເຂົ້າສູ່ລະບົບ:</text>
				<text class="content">{{resData.login_url}}</text>
			</view>
			<view class="phone">
				<view class="">
					<text class="head">ບັນຊີຮ້ານຄ້າ:</text>
					<text class="content">{{resData.phone}}</text>
				</view>
				<text class="cope acea-row row-middle row-center" @click="copyTBL()">ຄັດລອກ</text>
			</view>
		</view>
		<view class="btn" v-if="mer_id > 0">
			<view class="">
				ຄຳແນະນຳ: ລະຫັດຜ່ານເລີ່ມຕົ້ນແມ່ນເລກທ້າຍ 6 ໂຕຂອງເບີໂທລະສັບ, ກະລຸນາປ່ຽນລະຫັດຜ່ານຫຼັງຈາກເຂົ້າສູ່ລະບົບຄັ້ງທຳອິດ.
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
	import {
		getGoodsDetails
	} from '@/api/store.js'
	import { HTTP_REQUEST_URL } from '@/config/app';
	export default {
		data() {
			return {
				domain: HTTP_REQUEST_URL,
				mer_id: 0,
				resData: {}
			}
		},
		onLoad(e) {
			this.mer_id = e.mer_id
			if (this.mer_id > 0) {
				this.getGoodsDetails(e.mer_i_id)
			}
		},
		methods: {
			getGoodsDetails(id) {
				getGoodsDetails(id).then(res => {
					this.resData = res.data
				})
			},
			copyTBL(url) {
				let copeData = `ທີ່ຢູ່ເຂົ້າສູ່ລະບົບ:${this.resData.login_url} ບັນຊີຮ້ານຄ້າ:${this.resData.phone}`
				// #ifdef MP || APP-PLUS
				uni.setClipboardData({
					data: copeData,
					success: function() {
						uni.showToast({
							title: 'ຄັດລອກສຳເລັດ',
							duration: 1000
						});
					}
				});
				// #endif
				// #ifdef H5
				this.copyText(copeData)
				// #endif
			},
			//H5复制方法
			webCopy(e) {
				let transfer = document.createElement('input');
				document.body.appendChild(transfer);
				transfer.value = e; // 这里表示想要复制的内容
				transfer.focus();
				transfer.select();
				if (document.execCommand('copy')) {
					document.execCommand('copy');
				}
				transfer.blur();
				this.$util.Tips({
					title: 'ຄັດລອກສຳເລັດ'
				});
				transfer.style.display = 'none'
				document.body.removeChild(transfer);
			},
			// 兼容版一键复制
			copyText(text) {
				// 需要转化成字符串
				const textString = text.toString();
				let input = document.querySelector('#copy-input');
				if (!input) {
					input = document.createElement('input');
					input.id = "copy-input";
					input.readOnly = "readOnly"; // 防止ios聚焦触发键盘事件
					input.style.position = "absolute";
					input.style.left = "-1000px";
					input.style.zIndex = "-1000";
					document.body.appendChild(input)
				}
				input.value = textString;
				// ios必须先选中文字且不支持 input.select();
				selectText(input, 0, textString.length);
				if (document.execCommand('copy')) {
					document.execCommand('copy');
					this.$util.Tips({
						title: 'ຄັດລອກສຳເລັດ'
					});
				}
				input.blur();
				// input自带的select()方法在苹果端无法进行选择
				// 选择文本。createTextRange(setSelectionRange)是input方法
				function selectText(textbox, startIndex, stopIndex) {
					if (textbox.createTextRange) { //ie
						const range = textbox.createTextRange();
						range.collapse(true);
						range.moveStart('character', startIndex); //起始光标
						range.moveEnd('character', stopIndex - startIndex); //结束光标
						range.select(); //不兼容苹果
					} else { //firefox/chrome
						textbox.setSelectionRange(startIndex, stopIndex);
						textbox.focus();
					}
				}
			}
		},
	}
</script>

<style lang="scss" scoped>
	.merchant-details {
		display: flex;
		flex-direction: column;
		align-items: center;
		background-color: #fff;
		height: 100vh;
		position: relative;
		.top {
			display: flex;
			flex-direction: column;
			align-items: center;
			.img {
				width: 340rpx;
				height: 280rpx;
				margin: 140rpx 0 30rpx 0;
			}
			.title {
				font-size: 32rpx;
				font-weight: bold;
				color: #333;
			}
		}
		.msg {
			width: 85%;
			padding: 30rpx;
			height: 150rpx;
			margin: 70rpx 70rpx;
			background-color: #F6F6F6;
			border-radius: 16rpx;
			.url {
				display: flex;
				flex-wrap: nowrap;
				margin-bottom: 20rpx;
			}
			.phone {
				display: flex;
				justify-content: space-between;
			}
			.head {
				color: #333333;
				font-size: 28rpx;
				font-weight: 500;
				white-space: nowrap;
			}
			.content {
				color: #999999;
				font-size: 26rpx;
			}
			.cope {
				width: 76rpx;
				height: 38rpx;
				color: #FFFFFF;
				border-radius: 26rpx;
				background-color: #999999;
				margin-left: 40rpx;
				font-size: 20rpx;
			}
		}
		.btn {
			width: 70%;
			position: absolute;
			text-align: center;
			color: #999999;
			font-size: 24rpx;
			bottom: 80rpx
		}
	}
</style>
