<template>
	<diyDataProvider :diyId="diyId" v-if="diyId !== undefined">
		<template #config="{ tabbarConfig }">
			<view :style="viewColor">
				<view class='shoppingCart'>
					<view class='f2ef6a acea-row row-around row-middle'>
						<view class='item'><text class='iconfont icon-ic-complete1'></text>100%ຮັບປະກັນຂອງແທ້</view>
						<view class='item'><text class='iconfont icon-ic-complete1'></text>ສິນຄ້າທັງໝົດຄັດສັນຢ່າງດີ</view>
						<view class='item'><text class='iconfont icon-ic-complete1'></text>ບໍລິການຫຼັງການຂາຍ</view>
					</view>
					<view class="nav-head">
						<view class='nav acea-row row-between-wrapper bg-f'>
							<view>ສິນຄ້າ <text class='num t-color'>{{cartTotalCount}}</text></view>
							<view v-if="cartList.valid.length > 0 || cartList.invalid.length > 0" class='administrate acea-row row-center-wrapper'
							@click='manage'>{{ footerswitch ? 'ຈັດການ' : 'ຍົກເລີກ'}}</view>
						</view>
					</view>
					<view class="pad20">
						<view v-if="cartList.valid.length > 0 || cartList.invalid.length > 0">
							<!-- <view class='list'>
								<block v-for="(item,index) in cartList.valid" :key="index">
									<view class='item acea-row row-between-wrapper bg-f boder-24'>
										<view class="store-title">
											<view class="checkbox" @click="storeAllCheck(item,index)">
												<text v-if="!item.allCheck" class="iconfont icon-ic_unselect"></text>
												<text v-else class="iconfont icon-a-ic_CompleteSelect"></text>
											</view>
											<navigator :url="hide_mer_status == 0 ? '/pages/store/home/index?id='+item.mer_id : '#'" class="info">
												<text class="iconfont icon-ic_mall"></text>
												<view class="name">{{item.mer_name}}</view>
												<text class="iconfont icon-ic_rightarrow"></text>
											</navigator>
											<view class="coupon-btn" v-if="item.hasCoupon>0" @click="giveCoupon(item)">优惠券</view>
										</view>
										<navigator v-for="goods in item.list" :key="goods.cart_id" :url='"/pages/goods_details/index?id="+goods.product.product_id'
										hover-class='none' class='picTxt acea-row'>
											<view class="checkbox" @click.stop="goodsCheck(goods,index)">
												<text v-if="!goods.check" class="iconfont icon-ic_unselect"></text>
												<text v-else class="iconfont icon-a-ic_CompleteSelect"></text>
											</view>
											<view class="item-right acea-row row-between">
												<view class='pictrue'>
													<image :src='(goods.productAttr && goods.productAttr.image) || goods.product.image'></image>
												</view>
												<view class='text'>
													<view class='line1'>{{goods.product.store_name}}</view>
													<view class='infor line1' v-if="goods.productAttr.sku" @click.stop='changeCart(goods,goods.product_id)'>
														{{goods.productAttr.sku}}
														<text class="iconfont icon-ic_downarrow"></text>
													</view>
													<view v-if="goods.product.once_max_count>0 && goods.product.once_min_count>0" class="buy_limit">
														<text v-if="goods.product.once_min_count>0">{{goods.product.once_min_count}}件起购，</text><text v-if="goods.product.once_max_count>0">最多{{goods.product.once_max_count}}件</text>
													</view>
													<view class="carnum-count acea-row row-between">
														<view class='money acea-row row-middle'>
															<priceFormat :price="goods.productAttr.price" weight intSize="36" floatSize="24" labelSize="24"></priceFormat>
															<view v-if="goods.productAttr.show_svip_price" class="vipImg">
																<image :src="`${domain}/static/images/svip.png`"></image>
															</view>
														</view>
														<view class='carnum acea-row row-center-wrapper'>
															<view class="reduce" :class="goods.numSub || (goods.product.once_max_count>0 && goods.product.once_min_count>0 && goods.cart_num <= goods.product.once_min_count) ? 'on' : ''" @click.stop='subCart(goods)'>
																<text class="iconfont icon-ic_Reduce"></text>
															</view>
															<view class='num'>{{goods.cart_num}}</view>
															<view class="plus" :class="(goods.numAdd || (goods.cart_num >= goods.productAttr.stock) || (goods.product.once_max_count>0 && goods.product.once_min_count>0 && goods.cart_num >= goods.product.once_max_count)) ? 'on' : ''" @click.stop='addCart(goods)'>
																<text class="iconfont icon-ic_increase"></text>
															</view>
														</view>
													</view>
												</view>
											</view>
										</navigator>
									</view>
								</block>
							</view> -->
							<!--购物车有效商品-->
							<cartGoods
								ref="cartGoods"
								:cartList="cartList.valid"
								:hide_mer_status="hide_mer_status ? true : false"
								:isFooter="isFooter"
								@refresh="getCartList"
								@giveCoupon="giveCoupon"
								@cartAllCheck="cartAllCheck"
								@getCartNum="getCartNum"
								@updateCartList="updateCartList"
								@updateTotalCount="updateTotalCount"></cartGoods>
							<view class='invalidGoods bg-f boder-24' v-if="cartList.invalid.length > 0">
								<view class='goodsNav acea-row row-between-wrapper'>
									<view @click='goodsOpen'><text class='iconfont' :class='goodsHidden==true?"icon-ic_downarrow":"icon-ic_uparrow"'></text>ສິນຄ້າໝົດອາຍຸ</view>
									<view class='del' @click='unsetCart'><text class='iconfont icon-ic_delete'></text>ລ້າງ</view>
								</view>
								<view class='goodsList' :hidden='goodsHidden'>
									<block v-for="(item,index) in cartList.invalid" :key='index'>
										<navigator v-if="item.product" :url="'/pages/goods_details/index?id='+item.product_id" class='item acea-row row-between-wrapper' hover-class='none'>
											<view class='invalid'>ໝົດອາຍຸ</view>
											<view class='pictrue'>
												<image :src='(item.productAttr && item.productAttr.image) || (item.product&&item.product.image)'></image>
											</view>
											<view class='text acea-row row-column-between'>
												<view class='line1 name'>{{item.product.store_name}}</view>
												<view class='acea-row row-between-wrapper'>
													<view class='end'>ສິນຄ້ານີ້ໝົດອາຍຸແລ້ວ</view>
												</view>
											</view>
										</navigator>
									</block>
								</view>
							</view>
						</view>
					</view>
					<view v-if="cartList.valid.length <=0 && cartList.invalid.length <= 0" class='noCart' :style="{marginTop:cartList.invalid.length ==0 && cartList.invalid.length ==0?'170rpx':'' }">
						<view class="pad20">
							<view class='pictrue bg-f boder-24'>
								<image :src="`${domain}/static/images/no_thing.png`"></image>
								<view>ບໍ່ມີສິນຄ້າ, ໄປເພີ່ມບາງອັນເດີ້~</view>
							</view>
						</view>
						<block v-if="recommend">
							<recommend v-if="recommend_switch == 1" :hostProduct='hostProduct' :isTab="true" :isCart="true" :isLogin="isLogin" :isCustom="isFooter" @getCartList="getCartList" @getCartNum="getCartNum"></recommend>
							<view class='loadingicon acea-row row-center-wrapper' v-if="hostProduct.length>5 && recommend_switch == 1">
								<text class='loading iconfont icon-jiazai' :hidden='loading==false'></text>{{loadTitle}}
							</view>
						</block>
					</view>
					<view class='footer acea-row row-between-wrapper' :class="{on : isFooter}" v-if="isCartBarVisible" :style="[getCartBarStyle(tabbarConfig)]">
						<view>
							<view class="allcheckbox" @click.stop="checkboxAllChange">
								<text v-if="!isAllSelect" class="iconfont icon-ic_unselect"></text>
								<text v-else class="iconfont icon-a-ic_CompleteSelect"></text>
								ເລືອກທັງໝົດ ({{cartCount}})
							</view>
						</view>
						<view class='money acea-row row-middle' v-if="footerswitch==true">
							<view class='t-color'>
								<priceFormat :price="selectCountPrice" weight intSize="40" floatSize="26" labelSize="26"></priceFormat>
							</view>
							<form @submit="subOrder" report-submit='true'>
								<button class='placeOrder' formType="submit">ໄປຊຳລະ</button>
							</form>
						</view>
						<view class='button acea-row row-middle' v-else>
							<form @submit="subCollect" report-submit='true'>
								<button class='bnt bt-color' formType="submit">ເກັບໄວ້</button>
							</form>
							<form @submit="subDel" report-submit='true'>
								<button class='bnt' formType="submit">ລຶບ</button>
							</form>
						</view>
					</view>
				</view>
				<template v-if="tabbarConfig">
					<!-- 底部占位组件 -->
					<pageFooterPlaceholder :tabbarConfig="tabbarConfig" :appendHeight="isCartBarVisible ? 96 : 30" />

					<!--自定义底部tab栏-->
					<pageFootWrapper :tabbarConfig="tabbarConfig" />
					<tabbarCheck ref="tabbarCheck" :tabbarConfig="tabbarConfig" />
				</template>

				<!-- 优惠券弹窗 -->
				<block v-if="coupon.coupon">
					<couponListWindow
						:coupon='coupon'
						@ChangCouponsClose="ChangCouponsClose"
						@ChangCouponsUseState="ChangCouponsUseState"
					></couponListWindow>
				</block>
			</view>
		</template>
	</diyDataProvider>
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
	import couponListWindow from '@/components/couponListWindow';
	import cartGoods from '@/components/cartGoods';
	import { getCartList,getCartCounts,changeCartNum,cartDel,cartProductAttr } from '@/api/order.js';
	import { getCoupons,getShopCoupons } from '@/api/api.js';
	import { getProductHot,collectAll} from '@/api/store.js';
	import { mapGetters } from "vuex";
	import recommend from '@/components/recommend';
	import { configMap } from '@/utils';
	import { HTTP_REQUEST_URL } from '@/config/app';
	import { toLogin } from '@/libs/login.js';
	import { CART_TIME,CART_ID} from '@/config/cache';
	import { checkCart } from '@/utils/cartCache';
	import Cache from '@/utils/cache';
	import pageFooterPlaceholder from "@/components/diyPage/pageFooterPlaceholder.vue";
	import diyDataProvider from '@/components/diyPage/common/diyDataProvider.vue';
	import tabbarCheck from '@/components/diyPage/common/tabbarCheck.vue';
	import { diyUtil } from "@/utils/diy.js";
	import pageFootWrapper from "@/sub-packages/diy/diyPage/common/pageFootWrapper.vue";
	const app = getApp();
	export default {
		props: {
			image: {
				type: String,
				default: '',
			}
		},
		components: {
			recommend,
			couponListWindow,
			cartGoods,
			pageFooterPlaceholder,
			diyDataProvider,
			tabbarCheck,
			pageFootWrapper
		},
		// #ifdef MP
		componentPlaceholder: {
			"page-foot-wrapper": "view"
		},
		// #endif
		data() {
			return {
				diyId: undefined,
				domain: HTTP_REQUEST_URL,
				loading: false, //是否加载中
				loadend: false, //是否加载完毕
				loadTitle: 'ໂຫລດເພີ່ມເຕີມ', //提示语
				isFooter:false,
				cartCount: 0,
				goodsHidden: true,
				footerswitch: true,
				hostProduct: [],
				cartList: {
					valid: [],
					invalid: []
				},
				isAllSelect: false, //全选
				selectValue: [], //选中的数据
				selectCountPrice: 0.00,
				hotScroll: false,
				hotPage: 1,
				hotLimit: 10,
				//属性是否打开
				coupon: {
					'coupon': false,
					list: [],
				},
				// 购物车总数
				cartTotalCount:0,
				recommend: false,
				productValue: [], //系统属性
				attr: {
					cartAttr: false,
					productAttr: [],
					productSelect: {}
				},
				isOpen: false, //是否打开属性组件
				source: '',
				attrImage: '',
				isCart: true,
				cart_id: '',
				attrValue: '', //已选属性
				uniqueValue: "",
				newVal: {},
				goods: {},
				currSku: '',
				selectedArr: []
			};
		},
		computed: {
			...configMap({hide_mer_status: 1,recommend_switch:0,navigation: {}}, mapGetters(['isLogin','viewColor'])),
			isCartBarVisible() {
				return this.cartList.valid.length > 0;
			}
		},
		onReady(){},
		mounted: function() {},
		onLoad(options){
			this.diyId = this.$util.getDiyId(options);
		},
		onShow: function() {
			this.$refs.tabbarCheck && this.$refs.tabbarCheck.check();
			let that = this
			if (this.isLogin == true) {
				this.getCartList();
				this.getCartNum();
				this.goodsHidden = true;
				this.footerswitch = true;
				this.isAllSelect = false; //全选
				this.selectValue = []; //选中的数据
				uni.setStorage({
					key:'invoice_Data',
					data:{},
					success: function(){}
				})
			}else {
				this.recommend = true;
				this.getHostProduct();
			}
		},
		methods: {
			getCartBarStyle(tabbarConfig) {
				if (!tabbarConfig) return {};
				const tabbarHeight = diyUtil.calcTabbarHeight(tabbarConfig);
				const { effectConfig, navConfig } = tabbarConfig;
				const isFloatTabbar = effectConfig.tabVal === 1 && navConfig.tabVal === 1;
				// #ifdef H5
				if (!tabbarHeight) return {};
				// #endif
				// 如果自定义底部导航栏是浮动状态，则需要加上 10px 的间距
				const gapSize = isFloatTabbar ? 10 : 0;
				return {
					"--tabbar-height": `${tabbarHeight + gapSize}px`
				};
			},
			// 删除
			subDel: function(event) {
				let that = this
				let type_id = []
				this.cartList.valid.forEach(el=>{
					el.list.forEach(goods=>{
						if(goods.check){
							type_id.push(goods.cart_id)
						}
					})
				})
				if(type_id.length == 0){
					return that.$util.Tips({
						title: 'ກະລຸນາເລືອກສິນຄ້າ'
					});
				}else{
					cartDel({
						cart_id:type_id,
					}).then(res=>{
						that.$util.Tips({
							title: res.message,
							icon: 'success'
						});
						this.getCartList();
						this.getCartNum();
					}).catch(err => {
						return that.$util.Tips({
							title: err
						});
					});
				}
			},
			// 收藏
			subCollect: function(event) {
				let that = this
				let type_id = []
				this.cartList.valid.forEach(el=>{
					el.list.forEach(goods=>{
						if(goods.check){
							type_id.push(goods.spu.spu_id)
						}
					})
				})
				if(type_id.length == 0){
					return that.$util.Tips({
						title: 'ກະລຸນາເລືອກສິນຄ້າ'
					});
				}else{
					collectAll({
						type_id:type_id,
						type:1
					}).then(res=>{
						return that.$util.Tips({
							title: res.message,
							icon: 'success'
						});
					}).catch(err => {
						return that.$util.Tips({
							title: err
						});
					});
				}
			},
			// 立即下单
			subOrder: function(event) {
				let selectValue = []
				this.cartList.valid.forEach(el=>{
					el.list.forEach(goods=>{
						if(goods.check){
							selectValue.push(goods.cart_id)
						}
					})
				})
				if (selectValue.length > 0) {
					uni.navigateTo({
						url: '/pages/users/order_confirm/index?cartId=' + selectValue.join(',')
					});
				} else {
					return this.$util.Tips({
						title: 'ກະລຸນາເລືອກສິນຄ້າ'
					});
				}
			},
			updateTotalCount(type) {
				this.cartTotalCount = type == 1 ? Number(this.cartTotalCount) + 1 : Number(this.cartTotalCount) - 1;
			},
			getCartNum: function() {
				let that = this;
				that.$util.getCartNum(that.isLogin,function(count){
					that.cartTotalCount = count;
				})
			},
			// 购物车列表
			getCartList: function(isChange) {
				let that = this;
				getCartList().then(res => {
					if(checkCart()){
						that.selectedArr = (Cache.get(CART_ID)&&JSON.parse(Cache.get(CART_ID))) || []
					}else{
						that.selectedArr = []
					}
					res.data.list.forEach((item, index) => {
						item.allCheck = false
						item.list.forEach((goods, j) => {
							goods.check = that.selectedArr.indexOf(goods.cart_id)!=-1
							if (goods.cart_num == 1) {
								goods.numSub = true;
							} else {
								goods.numSub = false;
							}
							if (goods.cart_num == goods.productAttr.stock) {
								goods.numAdd = true;
							} else {
								goods.numAdd = false;
							}
						})
					})
					this.cartList.valid = res.data.list
					this.cartList.invalid = res.data.fail
					if(res.data.list.length == 0){
						this.recommend = true;
						if(!this.hostProduct.length){
							this.getHostProduct();
						}
					}else{
						this.recommend = false
					}
					const sku = {}
					this.cartAllCheck('goodsCheck')
					uni.stopPullDownRefresh(); //结束下拉刷新
				});
			},
			// 购物车全选
			checkboxAllChange() {
				let that = this;
				that.isAllSelect = !that.isAllSelect
				if(!that.isAllSelect){
					Cache.set(CART_ID, [])
				}else{
					let arr = (Cache.get('CART_ID')&&JSON.parse(Cache.get('CART_ID'))) || []
					that.cartList.valid.forEach((el, index) => {
						el.list.forEach(e => {
							arr.push(e.cart_id)
						})
					})
					Cache.set(CART_ID, Array.from([...new Set(arr)]))
					const timestamp = Date.now();
					Cache.set(CART_TIME,timestamp);
				}
				this.cartAllCheck('cartCheck')
			},
			// 全选判断
			cartAllCheck(type) {
				let that = this;
				let allArr = [];
				let totalMoney = 0
				let totalNum = 0
				that.cartList.valid.forEach((el, index) => {
					if (type == 'goodsCheck') {
						let tempArr = el.list.filter(goods => {
							return goods.check == true
						})
						if (el.list.length == tempArr.length) {
							el.allCheck = true
							allArr.push(el)
						} else {
							el.allCheck = false
						}
					} else {
						el.list.forEach((goods) => {
							goods.check = that.isAllSelect
						})
						el.allCheck = that.isAllSelect
						if (el.allCheck) allArr.push(el)
					}
					// 总金额 //总数
					el.list.forEach(e => {
						if (e.check) {
							totalMoney = that.$util.$h.Add(totalMoney, that.$util.$h.Mul(e.productAttr.price, e.cart_num))
							totalNum += e.cart_num
						}
					})
				})
				that.cartCount = totalNum
				that.selectCountPrice = totalMoney
				// 全选
				that.isAllSelect = allArr.length == that.cartList.valid.length ? true : false
				that.$refs.cartGoods?.updateList(that.cartList.valid)
			},
			// 更新购物车列表
			updateCartList(type,list) {
				this.cartList.valid = list;
				this.cartAllCheck(type)
			},
			// 推荐列表
			getHostProduct: function() {
				let that = this;
				if (that.loadend) return;
				if (that.hotScroll) return;
				that.loading = true;
				that.loadTitle = "ໂຫລດເພີ່ມເຕີມ";
				getProductHot(
					that.hotPage,
					that.hotLimit,
				).then(res => {
					let list = res.data.list || [];
					that.hotPage++
					that.hotScroll = res.data.list.length < that.hotLimit
					that.hostProduct = that.hostProduct.concat(res.data.list)
					that.loading = false;
					that.loadTitle = that.hotScroll ? "ໂຫລດຄົບແລ້ວ" : 'ໂຫລດເພີ່ມເຕີມ';
				});
			},
			// 失效商品展开
			goodsOpen: function() {
				let that = this;
				that.goodsHidden = !that.goodsHidden;
			},
			// 管理
			manage: function() {
				let that = this;
				that.footerswitch = !that.footerswitch;
			},
			// 清空
			unsetCart: function() {
				let that = this,ids = [];
				for (let i = 0, len = that.cartList.invalid.length; i < len; i++) {
					ids.push(that.cartList.invalid[i].cart_id);
				}
				cartDel({
					cart_id:ids
				}).then(res => {
					that.$util.Tips({
						title: 'ລ້າງສຳເລັດ'
					});
					that.getCartNum();
					that.$set(that.cartList, 'invalid', []);
				}).catch(res => {});
			},
			// 店铺优惠券
			giveCoupon(item){
				let that = this;
				let goodsArr = []
				let couponList = [];
				let activeList = [];
				let ids = []
				item.list.map(el=>{
					ids.push(el.product_id)
				})
				uni.showLoading({
					title: 'ກຳລັງໂຫລດ...',
					mask: true
				});
				getCoupons({
					ids:ids.join(',')
				}).then(res => {
					goodsArr = res.data
					getShopCoupons(item.mer_id).then(({data})=>{
						uni.hideLoading();
						couponList = goodsArr.concat(data)
						this.$set(this.coupon, 'list', couponList);
						this.$set(this.coupon, 'coupon', true);
					}).catch(error=>{})
				});
			},
			ChangCouponsClose: function() {
				this.$set(this.coupon, 'coupon', false)
			},
			ChangCouponsUseState(index) {
				let that = this;
				that.coupon.list[index].issue = true;
			},
		},
		onPullDownRefresh: function(){
			this.cartList = {
				valid: [],
				invalid: []
			}
			this.getCartNum();
			this.getCartList();
		},
		onReachBottom() {
			this.recommend && this.getHostProduct();
		},
		// 滚动监听
		onPageScroll(e) {}
	}
</script>

<style scoped lang="scss">
	.shoppingCart .f2ef6a {
		height: 76rpx;
		padding: 0 30rpx;
		font-size: 22rpx;
		color: #8c8c8c;
		position: fixed;
		left: 0;
		width: 100%;
		box-sizing: border-box;
		background-color: #f5f5f5;
		z-index: 5;
		top: 0;
	}
	.shoppingCart .f2ef6a .item .iconfont {
		font-size: 25rpx;
		margin-right: 10rpx;
	}
	.t-color {
		color: var(--view-theme);
	}
	.shoppingCart .nav-head {
		background: #f5f5f5;
		width: 100%;
		height: 80rpx;
		position: fixed;
		left: 0;
		z-index: 5;
		top: 76rpx;
	}
	.shoppingCart .nav {
		width: 710rpx;
		height: 80rpx;
		padding: 0 30rpx;
		box-sizing: border-box;
		font-size: 28rpx;
		margin-left: 20rpx;
		border-radius: 16rpx;
	}
	.shoppingCart .nav .administrate {
		font-size: 26rpx;
		color: #282828;
		width: 110rpx;
		height: 46rpx;
		border-radius: 24rpx;
		border: 1px solid #ddd;
	}
	.shoppingCart .noCart {
		margin-top: 20rpx;
		margin-bottom: 20rpx;
		padding-top: 0.1rpx;
	}
	.shoppingCart .noCart .pictrue {
		text-align: center;
		margin: 0 auto;
		padding: 80rpx 0 100rpx;
	}
	.shoppingCart .noCart .pictrue image {
		width: 414rpx;
		height: 305rpx;
		border-radius: 16rpx;
	}
	.shoppingCart .noCart .pictrue view{
		color: #999;
	}
	.shoppingCart .list {
		margin: 171rpx 0 20rpx;
	}
	.shoppingCart .list .item {
		margin-bottom: 20rpx;
		.store-title {
			display: flex;
			align-items: center;
			width: 100%;
			padding: 0 30rpx;
			height: 85rpx;
			.checkbox {
				width: 60rpx;
				.iconfont {
					font-size: 40rpx;
					color: #CCCCCC;
				}
				.icon-a-ic_CompleteSelect {
					color: var(--view-theme);
				}
			}
			.info {
				flex: 1;
				display: flex;
				align-items: center;
				.iconfont {
					font-size: 36rpx;
				}
				.name {
					margin: 0 0 0 10rpx;
					font-size: 28rpx;
					color: #282828;
					font-weight: 500;
				}
				.icon-ic_rightarrow {
					margin-top: 6rpx;
					font-size: 28rpx;
				}
			}
			.coupon-btn {
				color: var(--view-theme);
				font-size: 22rpx;
				width: 100rpx;
				line-height: 36rpx;
				background: var(--view-minorColor);
				border-radius: 18rpx;
				text-align: center;
			}
		}
	}
	.vipImg {
		width: 65rpx;
		height: 28rpx;
		margin-left: 10rpx;
		image {
			width: 100%;
			height: 100%;
			display: block;
		}
	}
	.shoppingCart .list .item .picTxt {
		width: 100%;
		padding: 25rpx 30rpx;
		position: relative;
		align-items: center;
		.checkbox {
			width: 55rpx;
			.iconfont {
				font-size: 40rpx;
				color: #CCCCCC;
			}
			.icon-a-ic_CompleteSelect {
				color: var(--view-theme);
			}
		}
	}
	.shoppingCart .list .item .item-right {
		width: 590rpx;
	}
	.shoppingCart .list .item .picTxt .pictrue {
		width: 180rpx;
		height: 180rpx;
	}
	.shoppingCart .list .item .picTxt .pictrue image {
		width: 100%;
		height: 100%;
		border-radius: 16rpx;
	}
	.shoppingCart .list .item .picTxt .text {
		width: 390rpx;
		font-size: 28rpx;
		color: #282828;
	}
	.shoppingCart .list .item .picTxt .buy_limit {
		margin-top: 10rpx;
		color: var(--view-theme);
		font-size: 22rpx;
	}
	.shoppingCart .list .item .picTxt .text .infor {
		display: inline-block;
		padding: 10rpx;
		border-radius: 4rpx;
		font-size: 24rpx;
		color: #999;
		margin-top: 16rpx;
		background-color: #F5F5F5;
		max-width: 400rpx;
		.icon-ic_downarrow {
			font-size: 24rpx;
			padding: 0 5rpx;
		}
	}
	.shoppingCart .list .item .carnum-count {
		margin-top: 28rpx;
	}
	.shoppingCart .list .item .picTxt .text .money {
		font-size: 32rpx;
		color: var(--view-theme);
	}
	.shoppingCart .invalidGoods .goodsNav {
		width: 100%;
		height: 66rpx;
		padding: 0 30rpx;
		box-sizing: border-box;
		font-size: 28rpx;
		color: #282828;
	}
	.shoppingCart .invalidGoods .goodsNav .iconfont {
		color: #424242;
		font-size: 28rpx;
		margin-right: 17rpx;
	}
	.shoppingCart .invalidGoods .goodsNav .del {
		font-size: 26rpx;
		color: #999;
	}
	.shoppingCart .invalidGoods .goodsNav .del .icon-ic_delete {
		color: #999;
		font-size: 33rpx;
		vertical-align: -2rpx;
		margin-right: 8rpx;
	}
	.shoppingCart .invalidGoods .goodsList .item {
		padding: 20rpx 30rpx;
		border-top: 1px solid #f5f5f5;
	}
	.shoppingCart .invalidGoods .goodsList .item .invalid {
		font-size: 22rpx;
		color: #fff;
		width: 75rpx;
		height: 38rpx;
		background-color: #ccc;
		border-radius: 20rpx;
		text-align: center;
		line-height: 36rpx;
	}
	.shoppingCart .invalidGoods .goodsList .item .pictrue {
		width: 140rpx;
		height: 140rpx;
	}
	.shoppingCart .invalidGoods .goodsList .item .pictrue image {
		width: 100%;
		height: 100%;
		border-radius: 16rpx;
	}
	.shoppingCart .invalidGoods .goodsList .item .text {
		width: 400rpx;
		font-size: 28rpx;
		color: #999;
		height: 140rpx;
	}
	.shoppingCart .invalidGoods .goodsList .item .text .name {
		width: 100%;
	}
	.shoppingCart .invalidGoods .goodsList .item .text .infor {
		font-size: 24rpx;
	}
	.shoppingCart .invalidGoods .goodsList .item .text .end {
		font-size: 26rpx;
		color: #bbb;
	}
	.shoppingCart .footer {
		z-index: 9;
		width: 100%;
		height: 96rpx;
		background-color: #fff;
		position: fixed;
		padding: 0 30rpx;
		box-sizing: border-box;
		border-top: 1px solid #eee;
		left: 0;
		// #ifdef H5
		bottom: calc(var(--tabbar-height, 50px));
		// #endif
		// #ifndef H5
		bottom: var(--tabbar-height, 50px);
		// #endif
	}
	.shoppingCart .footer .money {
		font-size: 30rpx;
	}
	.shoppingCart .footer .placeOrder {
		color: #fff;
		font-size: 26rpx;
		width: 200rpx;
		height: 72rpx;
		border-radius: 60rpx;
		text-align: center;
		line-height: 72rpx;
		margin-left: 22rpx;
		background-color: var(--view-theme);
	}
	.shoppingCart .footer .button .bnt {
		font-size: 28rpx;
		color: #666;
		border-radius: 50rpx;
		border: 1px solid #ddd;
		width: 160rpx;
		height: 60rpx;
		text-align: center;
		line-height: 60rpx;
		&.bt-color {
			color: var(--view-theme);
			border: 1px solid var(--view-theme);
		}
	}
	.shoppingCart .footer .button form~form {
		margin-left: 17rpx;
	}
	.allcheckbox {
		display: flex;
		align-items: center;
		width: 260rpx;
		.iconfont {
			margin-right: 20rpx;
			font-size: 40rpx;
			color: #CCCCCC;
		}
		.icon-a-ic_CompleteSelect {
			color: var(--view-theme);
		}
	}
</style>

