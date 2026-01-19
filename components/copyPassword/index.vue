<template>
	<view :style="viewColor">
		<view class='copy-list-window popup-main bg-f' :class='isCopy==true?"on":""'>
			<text class="iconfont icon-ic_close popup-close" @click="close"></text>
			<view class="title font-500">
				<text class="iconfont icon-a-ic_CompleteSelect"></text>
				{{title}}
			</view>
			<view class="copy-url">
				<!-- #ifdef H5 -->
				<text class="copy copy-data" :data-clipboard-text="copyUrl">{{copyUrl}}</text>
				<!-- #endif -->
				<!-- #ifndef H5 -->
				<text>{{copyUrl}}</text>
				<!-- #endif -->
			</view>
			<!-- #ifdef H5 -->
			<button class="button copy-data" :data-clipboard-text="copyUrl">点击复制口令</button>
			<!-- #endif -->
			<!-- #ifndef H5 -->
			<button class="button" @click="copyText">点击复制口令</button>
			<!-- #endif -->
		</view>
		<view class='mask' catchtouchmove="true" :hidden='isCopy==false' @click='close'></view>
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
	// #ifdef H5
	import ClipboardJS from "@/plugin/clipboard/clipboard.js";
	// #endif
	import { mapGetters } from "vuex";
	export default {
		props: {
			isCopy: {
				type: Boolean,
				default: false,
			},
			copyUrl: {
				type: String,
				default: '',
			}
		},
		computed: mapGetters(['viewColor']),
		data() {
			return {
				title: '复制以下口令'
			};
		},
		mounted(){
			let that = this
			// #ifdef H5
			that.$nextTick(function() {
				var clipboard = new ClipboardJS('.copy-data');
				clipboard.on('success', function(e) {
					that.$util.Tips({
						title:'复制成功'
					})
					setTimeout(()=>{
						that.$emit('close');
					},500)
				});
				clipboard.on('error', function(e) {
					that.$util.Tips({
						title:'复制失败'
					})
				});
			});
			// #endif
		},
		methods: {
			//#ifndef H5
			copyText:function(){
				let that = this;
				uni.setClipboardData({ data: this.copyUrl });
				setTimeout(()=>{
					that.$emit('close');
				},500)
			},
			// #endif
			close: function(){
			  this.$emit('close');
			}
		}
	}
</script>

<style scoped lang="scss">
	.copy-list-window {
		padding: 50rpx 30rpx 30rpx;
		.popup-close{
			position: absolute;
			top: 20rpx;
			right: 20rpx;
		}
		.button{
			height: 88rpx;
			border-radius: 50rpx;
			margin-top: 40rpx;
			background-color: var(--view-theme);
			font-size: 28rpx;
			line-height: 88rpx;
			color: #FFFFFF;
		}
	}
	.copy-list-window .title {
		.iconfont {
			font-size: 32rpx;
			color: #FBB324;
			margin-right: 12rpx;
		}
	}
	.copy-url{
		margin-top: 30rpx;
		background: #F5F5F5;
		padding: 26rpx 20rpx 40rpx;
		font-size: 28rpx;
		border-radius: 16rpx;
		.copy{
			width: 100%;
			height: auto;
			font-size: 28rpx;
			color: #333;
			border: none;
		}
	}
</style>
