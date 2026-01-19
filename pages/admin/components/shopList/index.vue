<template>
	<view>
		<view class="store_content" :class="isShow?'on':''">
			<view class="popup" :class="{ on: isShow }">
				<scroll-view scroll-y="true">
					<radio-group name="store_name" @change="changeStore">
						<template v-for="item in storeList">
							<div v-if="item.merchant" class="store-list">
									<label :key="item.merchant.mer_id" class="acea-row row-middle">
										<view class="text">
											<view class="acea-row row-middle">
												<image class="mer_logo" v-if="item.merchant.mer_avatar"
												:src="item.merchant.mer_avatar" mode=""></image>
												<view class="name line1">{{ item.merchant.mer_name }}</view>
											</view>
										</view>
										<radio class="radio" :value="item.merchant.mer_id.toString()" :checked="item.merchant.mer_id == id ? true : false" />
									</label>
							</div>
						</template>
					</radio-group>
				</scroll-view>
			</view>
		</view>
		<view class='mask' catchtouchmove="true" :hidden='!isShow' @tap='close'></view>
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
		getStoreList
	} from '@/api/user.js';
	export default {
		props:['is_sys'],
		data() {
			return {
				isShow: false,
				id: '',
				storeList: [],
			}
		},
		watch: {
		},
		mounted(){

		},
		methods: {
			isShowStore(){
				this.isShow = !this.isShow;
			},
			close: function() {
				this.$emit('changeStoreClose');
				this.isShow = false;
			},
			changeStore(e) {
				this.close()
				this.getStoreName(e.detail.value)
				uni.setStorageSync('serMerId',e.detail.value)
			},
			//获取店铺列表
			getStoreList(parmas){
				getStoreList(parmas).then(res => {
					this.storeList = res.data;
					let serMerId = this.is_sys !== '' ? null : uni.getStorageSync('serMerId')
					let storeInfo = null;
					let flag = false
					this.storeList.forEach(item=>{
						if(flag) return;
						if(!serMerId){
							if(this.is_sys && !item['merchant']['mer_id']){
								storeInfo = item;
								flag = true;
							}else if(this.is_sys == '0' && item['merchant']['mer_id']){
								storeInfo = item;
								flag = true;
							}
						}else if(serMerId == item['merchant']['mer_id']){
							storeInfo = item;
							flag = true;
						}
					})
					if(!storeInfo){
						storeInfo = this.storeList[0]
					}
					this.id = storeInfo ? storeInfo['mer_id'] : ''
					this.$emit('getStoreInfo', storeInfo['merchant'])
					this.$emit('getService', storeInfo);
				})
			},
			//根据店铺ID匹配店铺名
			getStoreName(id){
				for (let i = 0; i < this.storeList.length; i++) {
					if (this.storeList[i]['merchant']['mer_id'] == id) {
						this.$emit('getStoreInfo',this.storeList[i]['merchant']);
						uni.setStorageSync('storeInfo', this.storeList[i]['merchant']);
						this.$emit('getService',this.storeList[i]);
					}
				}
			},
		}
	}
</script>
<style lang="scss" scoped>
	.store_content{
		position: fixed;
		bottom: 0;
		width: 100%;
		left: 0;
		background-color: #fff;
		z-index: 101;
		border-radius: 40rpx 40rpx 0 0;
		padding-bottom: 60rpx;
		transform: translate3d(0, 100%, 0);
		transition: all .3s cubic-bezier(.25, .5, .5, .9);
	}
	.store_content.on {
		transform: translate3d(0, 0, 0);
	}
	.store_content .store-list{
		height: 120rpx;
		line-height: 120rpx;
	}
	.store_content .store-list .mer_logo{
		width: 60rpx;
		height: 60rpx;
		margin-right: 20rpx;
	}
	.popup {
		width: 100%;
		border-top-left-radius: 40rpx;
		border-top-right-radius: 40rpx;
		background-color: #FFFFFF;
		overflow: hidden;
	}
	.popup scroll-view {
		height: 466rpx;
		padding-right: 30rpx;
		padding-left: 30rpx;
		box-sizing: border-box;
	}
	.popup .text {
		flex: 1;
		min-width: 0;
		font-size: 28rpx;
		color: #282828;
	}
	.popup .info {
		margin-top: 10rpx;
		font-size: 22rpx;
		color: #909090;
	}
	.popup .text .acea-row {
		display: inline-flex;
		max-width: 100%;
	}
	.popup .name {
		flex: 1;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		font-size: 30rpx;
	}

</style>
