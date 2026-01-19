<template>
	<view 
		v-if="isShowConfirmPop" 
		class="page flex-center" 
		@click="closemask" 
		@touchmove.stop.prevent=""
	>
		<view class="content-box flex-box" @click.stop>
			<view class="text flex-center">请将包裹送达客户手中，辛苦您了！</view>
			<view class="btn-box flex-box">
				<view class="cancel flex-center" @click="cancel">
					取消
				</view>
				<view class="confirm flex-center" @click="confirm">
					确认
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'ConfirmPopUp',
		props: {
			isShowConfirmPop: {
				type: Boolean,
				default: false
			}
		},
		data() {
		  return {
				
			}
		},
		methods: {
			closemask() {
				this.$emit('closeMask')
			},
			confirm() {
				this.$emit('confirmDelivered')
			},
			cancel() {
				this.$emit('closeMask')
			}
		}
	}
</script>

<style scoped lang="scss">
	.page {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 99;
		// transition: opacity 0.3s ease;
		.content-box {
			flex-direction: column;
			width: 100%;
			height: 245rpx;
			background: #FFFFFF;
			border-radius: 24rpx 24rpx 24rpx 24rpx;
			margin: 0 76rpx 74rpx;
			.text {
				height: 146rpx;
				font-weight: 400;
				font-size: 30rpx;
				color: #282828;
				border-bottom: 1rpx solid #EEEEEE;
			}
			.btn-box {
				height: 98rpx;
				.cancel {
					width: 50%;
					border-right: 1rpx solid #EEEEEE;
					&:active  {
						background: #EEEEEE;
						border-bottom-left-radius: 24rpx;
					}
				}
				.confirm {
					width: 50%;
					&:active  {
						background: #EEEEEE;
						border-bottom-right-radius: 24rpx;
					}
				}
			}
		}
	}
	.flex-box {
		display: flex;
	}
	.flex-center {
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>