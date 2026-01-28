<template>
	<view :style="viewColor">
		<view class="container popup-main" :class="popup.show==true?'on':''">
			<view class="header">
				<text class="title font-500">ຊຸດໂປຣໂມຊັນ({{discountsTotal}})</text>
				<text class="iconfont icon-ic_close popup-close" @tap.stop="closePopup"></text>
			</view>
			<view class="main_count">
				<scroll-view scroll-y="true">
					<block v-for="(item, index) in discountsData" :key="index">
						<view class="list bg-f boder-24">
							<view class="acea-row list_title">
								<view class="combo_list_name">
									<image class="title_icon" :src="`${domain}/static/images/combo_title.png`"></image>
									<view class="name line1">ຊຸດ{{index+1}}: {{item.title}}</view>
								</view>
								<view class="combo_list_money">
									<priceFormat :price="item.total_price.toFixed(2)" weight intSize="32" floatSize="22" labelSize="22"></priceFormat>
								</view>
							</view>
							<view v-if="item.is_time == 1">
								<view class="comb_time">
									<text class="count-time">ຍັງເຫຼືອເວລາ</text>
									<countDown class="spike-count" :tip-text="' '" :day-text="'天'" :hour-text="':'" :minute-text="':'" :second-text="' '" :isDay="true" :datatime="item.stop_time" :isTheme="true" :isView="true"></countDown>
								</view>
							</view>
							<view>
								<block v-for="(itemn, indexn) in item.discountsProduct" :key="indexn">
									<view class="pro_list">
										<view v-if="item.type == 1 && indexn!=0" class="checkbox" @tap.stop="checkedChange(item,itemn)">
											<text v-if="itemn.checked" class="iconfont icon-a-ic_CompleteSelect"></text>
											<text v-else class="iconfont icon-ic_unselect"></text>
										</view>
										<view v-if="item.type == 1 && indexn ==0" class="checkbox">
											<text class="iconfont icon-ic_complete"></text>
										</view>
										<view class="picture">
											<image :src="itemn.image" class="image"></image>
											<text v-if="itemn.product_id == id" class="current_pro">ສິນຄ້າປັດຈຸບັນ</text>
										</view>
										<view class="info">
											<view class="name line2" :class="item.type==1 ? 'names' : ''">{{itemn.store_name}}</view>
											<view class="list_attr" @click="selecAttr(index,indexn)">
												<text class="line1">
												{{itemn.attr || 'ຄ່າເລີ່ມຕົ້ນ'}}
												</text>
												<text class="iconfont icon-ic_downarrow"></text>
											</view>
											<view class="price acea-row">
												<view>
													<priceFormat :price="itemn.product.price" weight intSize="32" floatSize="22" labelSize="22"></priceFormat>
												</view>
												<view class="ot_price regular">
												₭{{itemn.product.ot_price}}
												</view>
											</view>
										</view>
									</view>
								</block>
							</view>
							<view class="save_money semiBold"><text>ປະຢັດ:</text>
								₭{{item.checked_save_money}}
							</view>
							<view v-if="item.is_limit == 0 || (item.is_limit == 1 && item.limit_num > 0)" class="btn" @click="subData(index)">
								ຊື້ຊຸດນີ້（{{item.checked_num}}ຊິ້ນສິນຄ້າ）
							</view>
							<view v-else-if="item.is_limit == 1 && item.limit_num <= 0" class="btn disabled">
								ຊຸດໝົດແລ້ວ
							</view>
						</view>
					</block>
				</scroll-view>
			</view>
		</view>
		<view class='mask' catchtouchmove="true" :hidden='popup.show==false' @tap="closePopup"></view>
		<productWindow :attr="attr" :isShow="diyProduct.isOpen.includes(2)" :title="selectTitle" :iSplus="1" @myevent="onMyEvent"
			@ChangeAttr="ChangeAttr" @attrVal="attrVal" @iptCartNum="iptCartNum" id="product-window" @goCat="goOrder()">
		</productWindow>
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
	import { goShopDetail } from '@/libs/order.js'
	import { discountsCartAdd, getDiscountsLst } from '@/api/store.js';
	import productWindow from './productWindow.vue'
	import { mapGetters } from "vuex";
	import { HTTP_REQUEST_URL } from '@/config/app';
	import countDown from '@/components/countDown';
	export default {
		components: {
			productWindow,
			countDown
		},
		props:{
			uid: {
				type: Number || String,
			},
			showNum: {
				type: Number || String,
				default: 1
			},
			diyProduct: {
				type: Object,
				default: () => {}
			}
		},
		computed: mapGetters(['viewColor']),
		data() {
			return {
				id: "",
				domain: HTTP_REQUEST_URL,
				discountsData: [],
				discountsTotal: 0,
				popup: {
					show: false
				},
				attr: {
					cartAttr: false,
					productAttr: [],
					productSelect: {},
				},
				productValue: [], //系统属性
				isOpen: false, //是否打开属性组件
				attrValue: [],
				attrTxt: "",
				selectAttr: [],
				selectValue: [], //选中的ID
				proNum: 0,
				images: [],
				selectCountPrice: [],
				selectTitle: "",
				seleNum: 0,
				isFirst: true,
				seleIndexn: -1,
				seleIndex: -1,
				unique: "0"
			};
		},
		mounted(){},
		methods: {
			// 点击关闭按钮
			closePopup() {
				this.$set(this.popup, 'show', false);
			},
			showPopup(id) {
				this.id = id
				this.$set(this.popup, 'show', true);
				this.getList();
			},
			initAttr(){
				this.discountsData.map((v, i) => {
					this.getData(i)
				})
			},
			getData(index){
				this.discountsData[index].discountsProduct.forEach((item, i) => {
					this.attr.productAttr = item.product.attr;
					this.productValue = item.product.sku
					this.DefaultSelect(index,i)
					this.getPrice(this.discountsData[index])
				})
			},
			/*获取套餐列表数据*/
			getList(){
				getDiscountsLst({product_id: this.id, limit: this.showNum}).then(res => {
					res.data.list.forEach((item, index) => {
						item.total_price = 0;
						item.checked_num = item.count;
						item.checked_save_money = 0;
						item.discountsProduct.forEach((v, i) => {
							this.$set(v,'checked',true)
							this.$set(v,'attr','')
							this.$set(v,'unique','')
							item.total_price += parseFloat(v.product.price)
							item.checked_save_money += (parseFloat(v.product.ot_price) - parseFloat(v.product.price)).toFixed(2)
						})
					})
					this.discountsTotal = res.data.count;
				  	this.discountsData = res.data.list;
					this.initAttr()
				}).catch(err => {
					// 添加错误提示
					this.$util.Tips({
						title: '获取套餐列表失败，请稍后重试'
					});
				});
			},
			/**
			 * 购物车手动填写
			 *
			 */
			iptCartNum: function(e) {
				this.$set(this.attr.productSelect, 'cart_num', e);
			},
			/**
			 * 打开属性插件
			 */
			selecAttr: function(index, n) {
				this.proNum = index
				this.seleNum = n
				this.selectTitle = this.discountsData[index].discountsProduct[n].product.store_name
				this.attr.productAttr = this.discountsData[index].discountsProduct[n].product.attr
				this.productValue = this.discountsData[index].discountsProduct[n].product.sku
				if(this.isFirst || (!this.isFirst &&
				 (this.seleIndex != index && this.seleIndexn != n || this.seleIndex == index && this.seleIndexn != n || this.seleIndex != index && this.seleIndexn == n) || this.unique != this.attr.productSelect.unique)){
					this.DefaultSelect(index,n)
				}
				this.seleIndex = index;this.seleIndexn = n
				this.isFirst = false
				this.$nextTick((e) => {
					this.$set(this.attr, 'cartAttr', true);
					this.$set(this, 'isOpen', true);
				})
			},
			attrVal(val) {
				this.$set(this.attr.productAttr[val.indexw], 'index', this.attr.productAttr[val.indexw]
				.attr_values[val.indexn]);
			},
			/**
			* 属性变动赋值
			*
			*/
			ChangeAttr: function(res) {
				let productSelect = this.productValue[res];
				if (productSelect && productSelect.stock > 0) {
					this.$set(this.attr.productSelect, 'image', productSelect.image);
					this.$set(this.attr.productSelect, 'price', productSelect.price);
					this.$set(this.attr.productSelect, 'stock', productSelect.stock);
					this.$set(this.attr.productSelect, 'unique', productSelect.unique);
					this.$set(this, 'unique', productSelect.unique);
					this.$set(this.attr.productSelect, 'cart_num', 1);
					this.$set(this.discountsData[this.proNum].discountsProduct[this.seleNum], 'attr', res || "");
					this.$set(this.discountsData[this.proNum].discountsProduct[this.seleNum]['product'], 'price', productSelect.price || 0);
					this.$set(this.discountsData[this.proNum].discountsProduct[this.seleNum]['product'], 'ot_price', productSelect.ot_price || 0);
					this.$set(this.discountsData[this.proNum].discountsProduct[this.seleNum], 'unique', productSelect.unique || "");
				} else {
					this.$set(this.attr.productSelect,"store_name",this.discountsData[this.proNum].discountsProduct[this.seleNum].product.store_name
					);
					this.$set(this.attr.productSelect, "image", this.discountsData[this.proNum].discountsProduct[this.seleNum].product.image);
					this.$set(this.attr.productSelect, "price", this.discountsData[this.proNum].discountsProduct[this.seleNum].product.price);
					this.$set(this.attr.productSelect, "ot_price", this.discountsData[this.proNum].discountsProduct[this.seleNum].product.ot_price);
					this.$set(this.attr.productSelect, "stock", 0);
					this.$set(this.attr.productSelect,"unique", "");
					return;
				}
				this.getPrice(this.discountsData[this.proNum])
			},
			/**
			 * 默认选中属性
			 *
			 */
			DefaultSelect: function(index,indexn) {
				let productAttr = this.attr.productAttr;
				let value = [];
				let found = false;
				for (var key in this.productValue) {
					if (this.productValue[key].is_default_select == 1) {
						value = this.attr.productAttr.length ? key.split(",") : [];
						found = true
						break;
					}
				}
				if(!found) {
					for (var key in this.productValue) {
						value = this.attr.productAttr.length ? key.split(",") : [];
						found = true
						break;
					}
				}
				for (let i = 0; i < productAttr.length; i++) {
					this.$set(productAttr[i], 'index', value[i]);
				}
				//sort();排序函数:数字-英文-汉字；
				let productSelect = this.productValue[value.join(',')];
				const getValidImg = () => {
					return productSelect.image || this.discountsData[index].discountsProduct[indexn].image;
				}
				if (productSelect && productAttr.length) {
					this.$set(this.attr.productSelect, 'store_name', productSelect.store_name);
					this.$set(this.attr.productSelect, 'image', getValidImg());
					this.$set(this.attr.productSelect, 'price', productSelect.price);
					this.$set(this.attr.productSelect, 'ot_price', productSelect.ot_price);
					this.$set(this.attr.productSelect, 'stock', productSelect.stock);
					this.$set(this.attr.productSelect, 'unique', productSelect.unique);
					this.$set(this, 'unique', productSelect.unique);
					this.$set(this.attr.productSelect, 'cart_num', 1);
					this.$set(this.attr.productSelect, 'vip_price', productSelect.vip_price);
					this.$set(this.discountsData[index].discountsProduct[indexn], 'unique', productSelect.unique || "");
					this.$set(this.discountsData[index].discountsProduct[indexn], 'attr', value.join(','));
					this.$set(this.discountsData[index].discountsProduct[indexn]['product'], 'price', productSelect.price);
					this.$set(this.discountsData[index].discountsProduct[indexn]['product'], 'ot_price', productSelect.ot_price);
					this.$set(this.discountsData[index].discountsProduct[indexn]['product'], 'ot_price', productSelect.ot_price);
				} else if (productSelect && !productAttr.length) {
					this.$set(this.attr.productSelect, 'store_name', productSelect.store_name);
					this.$set(this.attr.productSelect, 'image', getValidImg());
					this.$set(this.attr.productSelect, 'price', productSelect.price);
					this.$set(this.attr.productSelect, 'ot_price', productSelect.ot_price);
					this.$set(this.attr.productSelect, 'stock', productSelect.stock);
					this.$set(this.attr.productSelect, 'unique', productSelect.unique || '');
					this.$set(this, 'unique', productSelect.unique);
					this.$set(this.attr.productSelect, 'cart_num', 1);
					this.$set(this.attr.productSelect, 'vip_price', productSelect.vip_price);
					this.$set(this.discountsData[index].discountsProduct[indexn]['product'], 'price', productSelect.price);
					this.$set(this.discountsData[index].discountsProduct[indexn]['product'], 'ot_price', productSelect.ot_price);
					this.$set(this.discountsData[index].discountsProduct[indexn], 'attr', '')
					this.$set(this.discountsData[index].discountsProduct[indexn], 'unique', productSelect.unique || "");
				}else if (!productSelect && !productAttr.length || !productSelect && productAttr.length) {
					this.$set(this.attr.productSelect,"store_name",this.discountsData[0].discountsProduct[0].product.store_name
					);
					this.$set(this.attr.productSelect, "image", this.discountsData[0].discountsProduct[0].product.image);
					this.$set(this.attr.productSelect, "price", this.discountsData[0].discountsProduct[0].product.price);
					this.$set(this.attr.productSelect, "ot_price", this.discountsData[0].discountsProduct[0].product.ot_price);
					this.$set(this.attr.productSelect, "stock", 0);
					this.$set(this.attr.productSelect,"unique", "");
					this.$set(this, 'unique', "");
				}
			},
			onMyEvent: function() {
				this.$set(this.attr, 'cartAttr', false);
				this.$set(this, 'isOpen', false);
			},
			checkedChange(item,itemn) {
				itemn.checked = !itemn.checked
				if(itemn.checked){
					item.checked_num++
				}else{
					item.checked_num--;
				}
				this.getPrice(item)
			},
			/*计算此套餐总价及节省价*/
			getPrice(item){
				let checked_save_money = 0;
				let total_price = 0;
				item.discountsProduct.forEach((v, i) => {
					if(v.checked){
						checked_save_money += (parseFloat(v.product.ot_price) - parseFloat(v.product.price));
						total_price += parseFloat(v.product.price);
					}
				})
				this.$set(item, 'checked_save_money', checked_save_money.toFixed(2));
				this.$set(item, 'total_price', total_price);
			},
			subData(index) {
				let data = []
				let reqData = {
					is_new: 1,
					discount_id: this.discountsData[index].discount_id,
					data: [],
				}
				if (this.discountsData[index].type == 0) {
					this.selectValue = []
					this.discountsData[index].discountsProduct.map(v => {
						this.selectValue.push(v.discount_product_id + '')
					})
				} else {
					if (this.discountsData[index].checked_num < 2) {
						return this.$util.Tips({
							title: '请先选择套餐商品'
						});
					}
					this.selectValue = []
					this.discountsData[index].discountsProduct.map(v => {
						if(v.checked){
							this.selectValue.push(v.discount_product_id + '')
						}
					})
				}
				for (let i = 0; i < this.discountsData[index].discountsProduct.length; i++) {
					for (let j = 0; j < this.selectValue.length; j++) {
						if (this.discountsData[index].discountsProduct[i].discount_product_id == this.selectValue[j]) {
							reqData.data.push({
								cart_num: 1,
								product_attr_unique: this.discountsData[index].discountsProduct[i].unique,
								product_id: this.discountsData[index].discountsProduct[i].product_id
							})
						}
					}
				}
				discountsCartAdd(reqData)
					.then(function(res) {
						uni.navigateTo({
							url: '/pages/users/order_confirm/index?cartId=' + res
								.data
								.cart_id
								.join(',')
						});
					})
					.catch((err) => {
						this.selectValue = []
						return this.$util.Tips({
							title: err
						});
					});
			},
			goOrder() {
				this.$set(this, 'isOpen', false);
				this.$set(this.attr, 'cartAttr', false);
			}
		}
	}
</script>

<style lang="scss" scoped>
.container{
	background-color: #f5f5f5;
	max-height: 1000rpx;
	.header{
		position: relative;
		padding: 36rpx 30rpx;
		text-align: center;
		.icon-ic_close {
			right: 20rpx;
			position: absolute;
			top: 30rpx;
		}
	}
	scroll-view{
		max-height: 900rpx;
	}
	.comb_time{
		display: flex;
		justify-items: center;
		margin-top: 24rpx;
		.count-time{
			color: #666666;
			font-size: 22rpx;
		}
		::v-deep .time{
			align-items: center;
		}
		::v-deep .red{
			height: 30rpx;
			line-height: 30rpx;
		}
		::v-deep .styleAll{
			background-color: var(--view-theme);
			color: #ffffff;
			font-size: 22rpx;
		}
		::v-deep .timeTxt{
			color: var(--view-theme);
			font-size: 20rpx;
		}
	}
	::v-deep .styleAll{
		background-color: var(--view-theme);
		color: #ffffff;
		font-size: 22rpx;
	}
	.main_count{
		padding: 0 20rpx 30rpx;
		max-height: 900rpx;
		overflow-y: scroll;
		.list{
			margin-bottom: 20rpx;
			padding: 30rpx 20rpx;
			.list_title{
				color: #282828;
				font-weight: bold;
				display: flex;
				align-items: center;
				justify-content: space-between;
				.combo_list_name{
					font-size: 26rpx;
					display: flex;
					align-items: center;
					.name{
						max-width: 500rpx;
						margin-left: 8rpx;
					}
					.title_icon,uni-image,image{
						width: 26rpx;
						height:26rpx;
					}
				}
				.combo_list_money{
					color: var(--view-priceColor);
					font-size: 28rpx;
				}
			}
			&:last-child{
				margin-bottom: 0;
			}
			.btn{
				width: 670rpx;
				height: 64rpx;
				line-height: 64rpx;
				background-image: linear-gradient(270deg, var(--view-bntColor21) 0%, var(--view-bntColor22) 100%);
				border-radius: 43px;
				margin: 21rpx auto 0;
				color: #ffffff;
				text-align: center;
				font-size: 24rpx;
				&.disabled{
					cursor: not-allowed;
					background:#bbb
				}
			}
			.save_money{
				color: var(--view-priceColor);
				font-size: 26rpx;
				font-weight: bold;
				text-align: center;
				margin-top: 30rpx;
				text{
					font-weight: normal;
					display: inline-block;
					font-size: 20rpx;
					margin-right: 8rpx;
				}
			}
		}
		.pro_list{
			display: flex;
			align-items: center;
			padding: 30rpx 0;
			&:last-child {
				.info {
					&::after {
						display: none;
					}
				}
			}
			.checkbox{
				margin-right: 30rpx;
			}
			.icon-a-ic_CompleteSelect{
				color: var(--view-theme);
			}
			.icon-ic_unselect {
				color: #ddd;
			}
			.icon-a-ic_CompleteSelect,.icon-ic_unselect{
				font-size: 40rpx;
			}
			.icon-ic_complete{
				display: inline-block;
				color: var(--view-theme);
				font-size: 24rpx;
				width: 40rpx;
				height: 40rpx;
				border-radius: 100%;
				background: var(--view-minorColor);
				line-height: 40rpx;
				text-align: center;
				font-weight: bold;
			}
			.picture,.image,uni-image{
				width: 180rpx;
				height: 180rpx;
				border-radius: 16rpx;
				position: relative;
			}
			.current_pro{
				background: linear-gradient( 90deg, #F67A38 0%, #F11B09 100%);
				border-radius: 12rpx 0 12rpx 12rpx;
				color: #fff;
				line-height: 34rpx;
				height: 34rpx;
				font-size: 16rpx;
				text-align: center;
				position: absolute;
				bottom: 0;
				left: 0;
				width: 100rpx;
			}
			.info{
				margin-left: 30rpx;
				position: relative;
				&::after {
					content: "";
					display: block;
					width: 100%;
					height: 1rpx;
					background: #eee;
					position: absolute;
					bottom: -30rpx;
				}
				.name{
					max-width: 460rpx;
					color: #282828;
					font-size: 24rpx;
					line-height: 36rpx;
					&.names{
						max-width: 380rpx;
					}
				}
				.price{
					color: #282828;
					margin-top: 30rpx;
					align-items: baseline;
					text{
						font-size: 28rpx;
					}
					.ot_price{
						font-weight: normal;
						font-size: 22rpx;
						color: #999;
						text-decoration: line-through;
						margin-left: 10rpx;
					}
				}
			}
		}
	}
	.list_attr{
		max-width:390rpx;
		height: 34rpx;
		line-height: 34rpx;
		font-size: 20rpx;
		color: #666666;
		border-radius: 18rpx;
		background-color: #f5f5f5;
		padding: 0 60rpx 0 20rpx;
		margin-top: 20rpx;
		position: relative;
		.iconfont{
			font-size: 12rpx;
			position: absolute;
			right: 20rpx;
			top: 2rpx;
		}
		text{
			display: inline-block;
			max-width: 300rpx;
		}
	}
}
::v-deep uni-checkbox .uni-checkbox-input{
	width: 38rpx;
	height: 38rpx;
	border-radius: 100%;
	margin-right: 30rpx;
}
</style>
