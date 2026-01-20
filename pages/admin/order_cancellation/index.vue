<template>
	<BaseContainer>
		<view class="base-bg"></view>
		<BaseNavBar title="ສະແກນກວດສອບ" />
		<view class="scan-container flex-center">
			<button class="scan-btn flex-center" v-if="redeemType === REDEEM_TYPE.SCAN" @click="scanCode">
				<text class="iconfont icon-ic_Scan"></text>
			</button>
			<view class="scan-input-wrapper" v-else>
				<input confirm-type="search" class="scan-input" :class="{ 'has-padding-right': inputValue.length > 10 }"
					v-model="inputValue" @confirm="handleSearchOrder" />
				<button class="search-btn flex-center" @click="handleSearchOrder">
					<text class="iconfont icon-ic_search"></text>
				</button>
			</view>
		</view>
		<view class="redeem-type-list">
			<button class="type-btn" :class="{ active: redeemType === REDEEM_TYPE.SCAN }" 
				@click="handleChangeRedeemType(REDEEM_TYPE.SCAN)" :style="leftRectVar">
				<text class="iconfont icon-ic_Scan" />
				ສະແກນກວດສອບ
			</button>
			<button class="type-btn" :class="{ active: redeemType === REDEEM_TYPE.INPUT }" :style="rightRectVar"
				@click="handleChangeRedeemType(REDEEM_TYPE.INPUT)">
				<text class="iconfont icon-ic_edit" />
				ໃສ່ດ້ວຍຕົນເອງ
			</button>
		</view>
		<!-- #ifdef H5 -->
		<view class="reader-box" v-if="qrVisible">
			<QrcodeStream @detect="handleDetect" />
			<button class="close-btn" @click="qrVisible = false">
				<text class="iconfont icon-ic_close"></text>
			</button>
		</view>
		<!-- #endif -->
	</BaseContainer>
</template>

<script>
import BaseContainer from "@/components/common/base_container.vue";
import BaseNavBar from "@/components/common/base_nav_bar.vue";
import { HTTP_REQUEST_URL as domain } from "@/config/app";

// #ifdef H5
import { QrcodeStream } from "@/plugin/vue-qrcode-reader/vue-qrcode-reader.min.js";
// #endif

const REDEEM_TYPE = {
	SCAN: 1,
	INPUT: 2
}

export default {
	components: {
		BaseContainer,
		BaseNavBar,
		// #ifdef H5
		QrcodeStream
		// #endif
	},
	data() {
		return {
			// #ifdef H5
			qrVisible: false,
			// #endif
			domain,

			REDEEM_TYPE,
			redeemType: REDEEM_TYPE.SCAN,
			inputValue: "",
			verifyCode: "",
			merId: ""
		}
	},
	onLoad(options) {
		// #ifdef MP
		if (options.scene) {
			let value = this.$util.getUrlParams(decodeURIComponent(options.scene) || {});
			if (value.verify_code) options.verify_code = value.verify_code;
			if (value.mer_id) options.mer_id = value.mer_id;
		}
		// #endif
		this.verifyCode = options.verify_code;
		this.merId = options.mer_id;

		if (this.verifyCode) {
			this.codeChange();
		}
	},
	computed: {
		leftRectVar() {
			return this.getCssVar(true, this.redeemType === REDEEM_TYPE.SCAN);
		},
		rightRectVar() {
			return this.getCssVar(false, this.redeemType === REDEEM_TYPE.INPUT);
		}
	},
	methods: {
		getCssVar(isLeft, isActive) {
			return `background-image: url(${domain}/static/images/${isLeft ? 'left' : 'right'}-rect${isActive ? '-active' : ''}.png)`;
		},
		async handleDetect(e) {
			this.qrVisible = false;
			const result = await e;
			this.handleScanResult(result.content);
		},
		handleChangeRedeemType(type) {
			this.redeemType = type;
		},
		handleSearchOrder() {
			this.verifyCode = this.inputValue;
			this.codeChange();
		},
		// 立即核销
		codeChange() {
			let self = this
			let ref = /[0-9]/;
			if (!this.verifyCode) return self.$util.Tips({
				title: 'ກະລຸນາໃສ່ລະຫັດກວດສອບ'
			});
			if (!ref.test(this.verifyCode)) return self.$util.Tips({
				title: 'ກະລຸນາໃສ່ລະຫັດກວດສອບທີ່ຖືກຕ້ອງ'
			});
			uni.navigateTo({
				url: '/pages/admin/cancellate_result/index?cal_code=' + this.verifyCode + '&mer_id=' + this.merId
			});
		},
		// 扫码核销			
		scanCode() {
			var self = this;
			// #ifdef MP || APP-PLUS
			wx.scanCode({
				scanType: ["qrCode", "barCode"],
				success(res) {
					self.handleScanResult(res.result);
					// self.codeChange();
				},
				fail(res) {
					console.log(res);
				},
			})
			// #endif
			//#ifdef H5
			if (this.$wechat.isWeixin()) {
				this.$wechat.wechatEvevt('scanQRCode', {
					needResult: 1,
					scanType: ["qrCode", "barCode"]
				}).then(res => {
					this.handleScanResult(res.resultStr);
					// this.codeChange();
				}).catch(res => {
					this.$util.Tips({
						title: res
					});
				});
			} else {
				this.qrVisible = true;
			}
			//#endif
		},
		handleScanResult(str) {
			const params = this.getDataBetweenStrings(str);
			if (!params || !params.cal_code || !params.mer_id) {
				this.$util.Tips({
					title: "ລະຫັດກວດສອບບໍ່ຖືກຕ້ອງ"
				});
				return;
			}
			uni.navigateTo({
				url: `/pages/admin/cancellate_result/index?cal_code=${params.cal_code}&mer_id=${params.mer_id}`
			});
		},
		getDataBetweenStrings(str) {
			const queryStr = str.split("?")[1];
			if (!queryStr) return null;
			return queryStr.split("&").reduce((acc, i) => {
				const [k, v] = i.split("=");
				acc[k] = v;
				return acc;
			}, {});
		}
	}
};
</script>

<style scoped lang="scss">
.base-bg {
	background-color: #fff;
	width: 3200rpx;
	height: 3200rpx;
	border-radius: 50%;
	position: absolute;
	left: 50%;
	transform: translateX(-50%);
	top: -2380rpx;
}

.flex-center {
	display: flex;
	align-items: center;
	justify-content: center;
}

.scan-container {
	height: 660rpx;
}

.scan-btn {
	width: 400rpx;
	height: 400rpx;
	border-radius: 50%;
	background: #2291F8;
	box-shadow: 0rpx 4rpx 32rpx 0rpx rgba(27, 102, 214, 0.3);

	.iconfont {
		font-size: 120rpx;
		color: #fff;
	}
}

.scan-input-wrapper {
	width: 540rpx;
	height: 120rpx;
	border-radius: 100rpx;
	background: #F5F5F5;
	position: relative;
}

.scan-input {
	width: 100%;
	height: 100%;
	font-size: 48rpx;
	text-align: center;
	padding: 0 30rpx;
	box-sizing: border-box;

	&.has-padding-right {
		padding-right: 120rpx;
		text-align: left;
	}
}

.search-btn {
	position: absolute;
	width: 80rpx;
	height: 80rpx;
	top: 20rpx;
	right: 20rpx;
	border-radius: 50%;
	background: #2291F8;
	z-index: 10;

	.iconfont {
		font-size: 32rpx;
		color: #fff;
	}
}

.redeem-type-list {
	margin-top: calc(126rpx - var(--safe-area-inset-top) + 80rpx);
	display: flex;
	justify-content: center;
}

.type-btn {
	width: 260rpx;
	height: 80rpx;
	background-color: #fff;
	color: #333;
	font-size: 28rpx;
	font-weight: 500;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 16rpx;
	background: none no-repeat center / cover;

	.iconfont {
		font-size: 32rpx;
		color: inherit;
	}

	&.active {
		color: #fff;
	}
}

.reader-box {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 1000;
	background-color: rgba(0, 0, 0, 0.5);
}

.close-btn {
	position: absolute;
	top: calc(var(--safe-area-inset-top) + 20rpx);
	right: 20rpx;
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
	background-color: transparent;
	z-index: 10;
	display: flex;
	align-items: center;
	justify-content: center;

	.iconfont {
		font-size: 48rpx;
		color: #fff;
	}
}
</style>
