<template>
	<view :style="viewColor">
		<view class="verificate bg-f boder-24">
			<view class="title">ລະຫັດກວດສອບ</view>
			<view class="pictrue">
				<image :src="codeUrl"></image>
			</view>
			<view class="acea-row row-middle row-center mt-20">
				<view class="code">{{verifyVal}}</view>
				<view class="conter">
					<!-- #ifndef H5 -->
					<text class='copyCode' @tap='copy(verifyVal)'>ສຳເນົາ</text>
					<!-- #endif -->
					<!-- #ifdef H5 -->
					<text class='copyCode copy-data' :data-clipboard-text="verifyVal">ສຳເນົາ</text>
					<!-- #endif -->
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
	import { mapGetters } from "vuex";
	import ClipboardJS from "@/plugin/clipboard/clipboard.js";
	let app = getApp();
	export default {
		name: 'reservationCode',
		props: {
			codeUrl: {
				type: String,
				default: ""
			},
			verifyVal: {
				type: String || Number,
				default: ""
			}
		},
		computed: mapGetters(['viewColor']),
		data() {
			return {

			};
		},
		created() {

		},
		methods: {
			copy(data) {
				this.$emit('copy',data);
			},
		}
	}
</script>

<style lang="scss">
	.verificate {
		text-align: center;
		padding: 48rpx 0;
		.pictrue {
			margin: 40rpx auto 0;
			width: 320rpx;
			height: 320rpx;
			image {
				width: 320rpx;
				height: 320rpx;
			}
		}
		.code {
			color: var(--view-theme);
			font-weight: 500;
		}
		.copyCode {
			font-size: 24rpx;
			color: #666;
			margin-left: 20rpx;
		}
	}

</style>
