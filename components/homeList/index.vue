<template>
	<!-- ເມນູເລື່ອນລົງດ້ານເທິງ -->
	<view class="animated dialog_nav dialogIndex" 
		:style="{ top: navH + 'rpx' }" v-show="currentPage">
		<view class="dialog_nav_item" :class="item.after" 
			v-for="(item,index) in headerNav" :key="index" 
			@tap="linkPage(item.url)">
			<text class="iconfont" :class="item.icon"></text>
			<text class="pl-20">{{item.name}}</text>
		</view>
	</view>
</template>
<script>
	export default {
		name: "homeIdex",
		props: {
			navH: {
				type: String|Number,
				default: ""
			},
			currentPage: {
				type: Boolean,
				default: false
			},
			openNavList:{
				type: Array,
				default: ()=>[]
			}
		},
		data() {
			return {
				selectNavList:[
					{
							name: 'ໜ້າຫຼັກ',
							icon: 'icon-ic_home',
							url: '/pages/index/index',
							after: 'dialog_after'
						},
						{
							name: 'ຄົ້ນຫາ',
							icon: 'icon-ic_search',
							url: '/pages/columnGoods/goods_search_con/index',
							after: 'dialog_after'
						},
						{
							name: 'ກະຕ່າສິນຄ້າ',
							icon: 'icon-ic_ShoppingCart1',
							url: '/pages/order_addcart/order_addcart',
							after: 'dialog_after'
						},
						{
							name: 'ລາຍການທີ່ເກັບໄວ້',
							icon: 'icon-ic_star',
							url: '/pages/users/user_goods_collection/index',
							after: 'dialog_after'
						},
						{
							name: 'ສູນກາງສ່ວນຕົວ',
							icon: 'icon-ic_user1',
							url: '/pages/user/index'
						},
				]
			};
		},
		computed:{
			headerNav(){
				let arr = [];
				this.selectNavList.forEach((item,index)=>{
					if(this.openNavList.includes(index)){
						arr.push(item);
					}
				})
				return arr
			}
		},
		methods: {
			linkPage(url){
				if (['/pages/goods_cate/goods_cate', '/pages/order_addcart/order_addcart', '/pages/user/index', '/pages/index/index']
					.indexOf(url) == -1) {
					uni.navigateTo({
						url: url
					})
				} else {
					uni.switchTab({
						url: url
					})
				}
			}
		},
	};
</script>

<style scoped lang="scss">
	.dialog_nav {
		position: absolute;
		left: 30rpx;
		width: 240rpx;
		background: #FFFFFF;
		box-shadow: 0px 0px 16rpx rgba(0, 0, 0, 0.08);
		z-index: 310;
		border-radius: 14rpx;
		&::before {
			content: '';
			width: 0;
			height: 0;
			position: absolute;
			left: 0;
			right: 0;
			margin: auto;
			top: -9px;
			border-bottom: 26rpx solid #FFFFFF;
			border-left: 26rpx solid transparent;
			/*transparent ໝາຍເຖິງໂປ່ງໃສ*/
			border-right: 26rpx solid transparent;
		}
	}
	.dialog_nav_item {
		width: 100%;
		height: 84rpx;
		line-height: 84rpx;
		padding: 0 20rpx 0;
		box-sizing: border-box;
		font-size: 28rpx;
		color: #333;
		position: relative;
		.iconfont {
			font-size: 32rpx;
		}
	}
	.dialog_after {
		::after {
			content: '';
			position: absolute;
			width: 172rpx;
			height: 1rpx;
			background: #EEEEEE;
			bottom: 0;
			right: 0;
		}
	}
</style>
