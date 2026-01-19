<template>
	<view :style="viewColor">
		<view class="address-window popup-main bg-f" :class="display==true?'on':''">
			<view class='title font-500'>ກະລຸນາເລືອກພາກພື້ນຂອງທ່ານ<text class='iconfont icon-ic_close popup-close' @tap='close'></text></view>
			<view class="address-count">
				<view class="address-selected">
					<view v-for="(item,index) in selectedArr" :key="index" class="selected-list" :class="{active:index === selectedIndex}" @click="change(item.parent_id, index)">
						{{item.name}}
						<text class="iconfont icon-ic_rightarrow"></text>
					</view>
					<view class="selected-list" :class="{active:-1 === selectedIndex}"  v-if="showMore" @click="change(-1, -1)">
						<text class="iconfont icon-ic_rightarrow"></text>
						ກະລຸນາເລືອກ
					</view>
				</view>
				<scroll-view scroll-y="true" :scroll-top="scrollTop" class="address-list" @scroll="scroll">
					<view v-for="(item,index) in addressList" :key="index" class="list" :class="{active:item.id === activeId}" @click="selected(item)">
						<text class="item-name">{{item.name}}</text>
						<text v-if="item.id === activeId" class="iconfont icon-ic_complete"></text>
					</view>
				</scroll-view>
			</view>
		</view>
		<view class='mask' catchtouchmove="true" :hidden='display==false' @tap='close'></view>
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
	import {getAddressList} from '@/api/user.js';
	import { getCityV2 } from '@/api/api.js';
	import { mapGetters } from "vuex";
	const CACHE_ADDRESS = {};
	export default {
		props: {
			display: {
				type: Boolean,
				default: true
			},
			cityShow: {
				type: Number,
				default: 3
			},
			address: {
				type:Array | Object,
				default: () => []
			},
		},
		data() {
			return {
				active: 0,
				//地址列表
				addressList: [],
				selectedArr: [],
				selectedIndex: -1,
				is_loading: false,
				old: { scrollTop: 0 },
				scrollTop: 0
			};
		},
		computed:{
			...mapGetters(['viewColor']),
			activeId(){
				return this.selectedIndex == -1 ? 0 : this.selectedArr[this.selectedIndex].id
			},
			showMore(){
				return this.selectedArr.length ? (this.selectedArr[this.selectedArr.length - 1].hasOwnProperty('children') && ((this.cityShow==1 && this.addressList.level<2) || (this.cityShow==2 && this.addressList.level<3) || (this.cityShow==3 && this.addressList.level<4))) : true
			}
		},
		watch:{
			address(n){
				this.selectedArr = n ? [...n] : []
			},
			display(n){
				if(!n) {
					this.addressList = [];
					this.selectedArr =  this.address ? [...this.address] : [];
					this.selectedIndex = -1;
					this.is_loading = false;
				}else{
					this.loadAddress(0)
				}
			}
		},
		mounted() {
			this.loadAddress(0)
		},
		methods: {
			change(pid,index){
				if(this.selectedIndex == index) return;
				if(pid === -1){
					pid = this.selectedArr.length ? this.selectedArr[this.selectedArr.length -1].id : 0;
				}
				this.selectedIndex = index;
				this.loadAddress(pid);
			},
			loadAddress(pid){
				if(CACHE_ADDRESS[pid]){
					this.addressList = CACHE_ADDRESS[pid];
					return ;
				}
				this.is_loading = true;
				getCityV2(pid).then(res=>{
					this.is_loading = false;
					CACHE_ADDRESS[pid] = res.data;
					this.addressList = res.data;
				})
				this.goTop()
			},
			selected(item){
				if(this.is_loading) return;
				if(this.selectedIndex > -1){
					this.selectedArr.splice(this.selectedIndex + 1,999)
					this.selectedArr[this.selectedIndex] = item;
					this.selectedIndex = -1;
				}else if(!item.parent_id){
					this.selectedArr = [item];
				}else{
					this.selectedArr.push(item);
				}
				if(item.snum && ((this.cityShow==1 && this.addressList[0].level<2) || (this.cityShow==2 && this.addressList[0].level<3) || (this.cityShow==3 && this.addressList[0].level<4))){
					this.loadAddress(item.id);
				} else {
					this.$emit('submit', [...this.selectedArr]);
					this.$emit('changeClose');
				}
				this.goTop()
			},
			close: function() {
				this.$emit('changeClose');
			},
			scroll : function(e) {
				this.old.scrollTop = e.detail.scrollTop
			},
			goTop: function(e) {
				this.scrollTop = this.old.scrollTop
				this.$nextTick(() => {
					this.scrollTop = 0
				});
			}
		}
	}
</script>

<style scoped lang="scss">
	.address-window .title {
		height: 123rpx;
		line-height: 123rpx;
	}
	.address-window .title .iconfont {
		position: absolute;
		right: 28rpx;
		top: 30rpx;
	}
	.address-count{
		.address-selected{
			padding: 0 30rpx;
			margin-top: 10rpx;
			position: relative;
			padding-bottom: 20rpx;
			border-bottom: 2rpx solid #f7f7f7;
		}
		.selected-list{
			font-size: 26rpx;
			color: #282828;
			line-height: 50rpx;
			padding-bottom: 10rpx;
			padding-left: 60rpx;
			position: relative;
			&.active{
				color: var(--view-theme);
			}
			&:before,&:after{
				content: '';
				display: block;
				position: absolute;
			}
			&:before{
				width: 4rpx;
				height: 100%;
				background-color: var(--view-theme);
				top: 0;
				left: 10rpx;
			}
			&:after{
				width: 12rpx;
				height: 12rpx;
				background: var(--view-theme);
				border-radius: 100%;
				left: 6rpx;
				top: 50%;
				margin-top: -8rpx;
			}
			&:first-child,&:last-child{
				&:before{
					height: 50%;
				}
			}
			&:first-child{
				&:before{
					top: auto;
					bottom: 0;
				}
			}
			.iconfont{
				font-size: 28rpx;
				float: right;
				color: #dddddd;
			}
		}
		scroll-view{
			height: 550rpx;
		}
		.address-list{
			padding: 0 30rpx;
			margin-top: 20rpx;
			box-sizing: border-box;
			.list{
				.iconfont{
					float: right;
					color: #ddd;
					font-size: 28rpx;
				}
				.item-name{
					display: inline-block;
					line-height: 50rpx;
					margin-bottom: 20rpx;
					font-size: 26rpx;
				}
				&.active{
					color: var(--view-theme);
					.iconfont{
						color: var(--view-theme);
					}
				}
			}
		}
	}
</style>
