<template>
	<view>
		<!-- 分类购物车下拉列表 -->
		<view class="cartList" :class="{'on':cartData.iScart,'no-foot': !isFooter, 'is-open': isOpen}" @touchmove.stop.prevent="moveHandle">
			<view class="title acea-row row-between-wrapper">
				<view class="name">ກະຕ່າສິນຄ້າ <text class="fs-24 text--w111-999 pl-8">(ລວມ{{productNumber}}ລາຍການ)</text> </view>
				<view class="del acea-row row-middle" @click="subDel">
					<view class="iconfont icon-ic_delete"></view>ລ້າງ
				</view>
			</view>
			<view class="lists">
				<scroll-view class="scroll-list" scroll-y="true" :style="{
					'max-height': '800rpx'
				}">
					<!--购物车有效商品-->
					<cartGoods 
					ref="cartGoods"
					:cartList="cartData.cartList" 
					:isCate="true"
					:hide_mer_status="hide_mer_status ? true : false"
					@refresh="$emit('refresh')"
					@updateIsOpen="updateIsOpen"
					@storeAllCheck="storeAllCheck" 
					@cartAllCheck="cartAllCheck"
					@updateCartList="updateCartList"
					@getCartNum="getCartNum"
					@getCalResult="getCalResult"
					@updateTotalCount="updateTotalCount"></cartGoods>
					<pageFooterPlaceholder :tabbarConfig="tabbarConfig" :appendHeight="116" />
				</scroll-view>
			</view>
		</view>
		<view class="mask" v-if="cartData.iScart" @click="closeList" @touchmove.stop.prevent="moveHandle"></view>
	</view>
</template>

<script>
	import cartGoods from '@/components/cartGoods';
	import pageFooterPlaceholder from '@/components/diyPage/pageFooterPlaceholder.vue';
	import diyTabbarConfigMixin from '@/mixins/diy-tabbar';
	export default {
		mixins: [diyTabbarConfigMixin],
		props:{
			cartData: {
				type: Object,
				default: () => {}
			},
			isFooter: {
			  type: Boolean,
			  default: false
			},
			hide_mer_status: {
				type: Boolean,
				default: false
			},
			cartNum: {
				type: String,
				default: '0'
			},
			productNumber: {
				type: Number,
				default: 0
			}
		},
		components: {
			cartGoods,
			pageFooterPlaceholder
		},
		data() {
			return {
				isOpen: false
			};
		},
		methods: {
			moveHandle(){
				return false
			},
			closeList(){
				this.$emit('closeList', false);
			},
			getCartNum() {
				this.$emit('getCartNum');
			},
			cartAllCheck(type) {
				this.$emit('cartAllCheck', type);
			},
			updateList(list) {
				this.$refs.cartGoods.updateList(list);
			},
			// 更新购物车列表
			updateCartList(type,list) {
				this.$emit('updateCartList', type, list);
			},
			leaveCart(index,item){
				if(item.productInfo.min_qty && item.cart_num == item.productInfo.min_qty) return
				this.$emit('ChangeCartNumDan', false,index);
			},
			joinCart(index){
				this.$emit('ChangeCartNumDan', true,index);
			},
			getCalResult(result) {
				this.$emit('getCalResult', result);
			},
			subDel(){
				this.$emit('changeSubDel');
			},
			oneDel(id,index){
				this.$emit('ChangeOneDel',id,index);
			},
			updateTotalCount(type) {
				this.$emit('updateTotalCount',type);
			},
			updateIsOpen(v) {
				this.isOpen = v;
			}
		}
	}
</script>

<style lang="scss">
	.mask{
		z-index: 99;
	}
	.cartList{
		position: fixed;
		left:0;
		bottom: 0;
		width: 100%;
		background-color: #fff;
		z-index:100;
		padding-top: 40rpx;
		box-sizing: border-box;
		border-radius:40rpx 40rpx 0 0;
		transform: translate3d(0, 100%, 0);
		transition: all .3s cubic-bezier(.25, .5, .5, .9);
		&.is-open {
			z-index: 120;
		}
		&.on{
			transform: translate3d(0, 0, 0);
		}
		.title{
			margin-bottom: 32rpx;
			padding: 0 32rpx;
			.name{
				font-size:32rpx;
				color: #333;
				font-weight:500;
			}
			.del{
				font-size: 24rpx;
				color: #666;
				.iconfont{
					margin-right: 8rpx;
					font-size: 28rpx;
				}
			}
		}
		.lists{
			max-height: 1000rpx;
			.item{
				margin-bottom: 32rpx;
				.pictrue{
					width: 200rpx;
					height: 200rpx;
					border-radius: 16rpx;
					position: relative;
					image{
						width: 100%;
						height: 100%;
						border-radius: 16rpx;
					}
					.mantle{
						position: absolute;
						top:0;
						left:0;
						width: 100%;
						height: 100%;
						background:rgba(255,255,255,0.65);
						border-radius:16rpx;
					}
				}
			}
		}
	}
	.noBnt{
		width:126rpx;
		height:44rpx;
		background:#f5f5f5;
		border-radius:22rpx;
		text-align: center;
		line-height: 44rpx;
		font-size: 24rpx;
		color: #333;
	}
	.max-w-460{
		max-width: 460rpx;;
	}
	.show-footer{
		/* #ifdef MP || APP-PLUS */
		height: calc(104rpx + env(safe-area-inset-bottom));
		/* #endif */
		
	}
	.disabled-btn{
		color: #DEDEDE;
	}
</style>
