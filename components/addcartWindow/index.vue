<template>
	<view :style="viewColor">
		<view class="product-window popup-main bg-f" :class="(attr.cartAttr === true ? 'on' : '') + ' ' + (iSbnt ?'join':'') + ' ' + (isPresell ? 'presell-window':'') + ' ' + (isCustom ?'custom-window':'')" :style="[wrapperStyle]">
			<view class="textpic acea-row row-between-wrapper">
				<view class="pictrue">
					<image :src="(attr.productSelect&&attr.productSelect.image) ? attr.productSelect.image : ''" @click="loookImg"></image>
				</view>
				<view class="text">
					<view class="line1">
						{{ attr.productSelect.store_name }}
					</view>
					<view v-if="isPresell" class="money presell_price">
						<view>
							预售价
							¥<text class="num">{{ attr.productSelect.price }}</text>
							<text v-if="presell_type === 2">定金¥<text class="num">{{ attr.productSelect.down_price }}</text></text>
						</view>
						<text class="stock" v-if='isShow'>库存: {{ attr.productSelect.stock }}</text>
						<text class='stock' v-if="limitNum">限量: {{attr.productSelect.quota_show}}</text>
					</view>
					<view v-else class="money">
						<view class="acea-row row-middle">
							<view class="acea-row row-middle">
								<priceFormat :price="attr.productSelect.price" weight intSize="40" floatSize="26" labelSize="26"></priceFormat>
								<view v-if="attr.productSelect && Number(attr.productSelect.svip_price)>0" class="acea-row row-middle">
									<text class='vip-money'>¥{{attr.productSelect.svip_price}}</text>
									<view class="vipImg">
										<image :src="`${domain}/static/images/svip.png`"></image>
									</view>
								</view>
							</view>
						</view>
						<view class="stock_count">
							<text class="stock" v-if='isShow'>库存: {{ attr.productSelect.stock }}</text>
							<text class='stock' v-if="limitNum">限量: {{attr.productSelect.quota_show}}</text>
						</view>
					</view>
				</view>
				<view class="iconfont icon-ic_close popup-close" @click="closeAttr"></view>
			</view>
			<view class="productWinList">
				<view class="item" v-for="(item, indexw) in attr.productAttr" :key="indexw">
					<view class="titles">{{ item.attr_name }}</view>
					<view class="listn acea-row row-middle">
						<view class="itemn" :class="item.index === itemn.attr ? 'on' : ''" v-for="(itemn, indexn) in item.attr_value"
						 @click="tapAttr(indexw, indexn)" :key="indexn">
							{{ itemn.attr }}
						</view>
					</view>
				</view>
			</view>
			<view v-if="isRecommend" class="cart acea-row row-between">
				<view class="title">数量</view>
				<view class="carnum acea-row row-left">
					<view class="buy_limit" v-if="minCount>0 || maxCount>0">
						(<text v-if="minCount>0">{{minCount}}件起购<text v-if="minCount>0 && maxCount>0">，</text></text><text v-if="maxCount>0">最多{{maxCount}}件</text>)
					</view>
					<view class="item reduce" :class="(attr.productSelect.cart_num <= 1 || (minCount>0 && attr.productSelect.cart_num<=minCount)) ? 'on' : ''" @click="CartNumDes">
						<text class="iconfont icon-ic_Reduce"></text>
					</view>
					<view class='item num'>
						<input type="number" v-model="attr.productSelect.cart_num" data-name="productSelect.cart_num" @input="bindCode(attr.productSelect.cart_num)"></input>
					</view>
					<view v-if="iSplus" class="item plus" :class="(attr.productSelect.cart_num >= attr.productSelect.stock || (maxCount>0&&attr.productSelect.cart_num>=maxCount)) ? 'on' : ''"
					 @click="CartNumAdd"><text class="iconfont icon-ic_increase"></text></view>
					<view v-else class='item plus' :class='((attr.productSelect.cart_num >= attr.productSelect.quota_show)
						|| (attr.productSelect.cart_num >= attr.productSelect.product_stock) || (maxCount>0&&attr.productSelect.cart_num>=maxCount)) ? "on":""'
					 @click='CartNumAdd'>
					 <text class="iconfont icon-ic_increase"></text></view>
				</view>
			</view>
			<view class="joinBnt b-color" v-if="destri && attr.productSelect.stock>0" @click="goCat">确定</view>
			<view class="joinBnt on" v-else-if="destri && attr.productSelect.stock<=0">已售罄</view>
			<view class="joinBnt on" v-else-if="(iSbnt && attr.productSelect.stock<=0)">已售罄</view>
		</view>
		<view class="mask" @touchmove.prevent :hidden="attr.cartAttr === false" @click="closeAttr"></view>
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
	import { HTTP_REQUEST_URL } from '@/config/app';
	export default {
		computed: {
			...mapGetters(['viewColor']),
			wrapperStyle() {
				if (this.appendHeight) {
					return {
						paddingBottom: this.appendHeight + 10 + 'px'
					}
				}
				return {}
			}
		},
		props: {
			appendHeight: {
				type: Number,
				default: 0
			},
			attr: {
				type: Object,
				default: () => {}
			},
			limitNum: {
				type: Number,
				value: 0
			},
			isShow: {
				type: Number,
				value: 0
			},
			iSbnt: {
				type: Number,
				value: 0
			},
			iSplus: {
				type: Number,
				value: 0
			},
			destri: {
				type: Number,
				value: 0
			},
			isPresell: {
				type: Number,
				value: 0
			},
			presell_type: {
				type: Number,
				value: 1
			},
			image: {
				type: String,
				value: ''
			},
			maxCount: {
				type: Number,
				value: 0
			},
			minCount: {
				type: Number,
				value: 0
			},
			addCart: {
				type: Boolean,
				default: () => false
			},
			isRecommend: {
				type: Boolean,
				default: () => false
			},
			isCustom: {
				type: Boolean,
				default: () => false
			}
		},
		data() {
			return {
				domain: HTTP_REQUEST_URL,
			}
		},
		mounted(){
		},
		methods: {
			//  查看大图
			loookImg(){
				let self = this
				let arr = [self.attr.productSelect.image ? self.attr.productSelect.image : self.image]
				uni.previewImage({
					urls: arr,
				});
			},
			goCat: function() {
				this.$emit('goCat',!this.addCart);
			},
			/**
			 * 购物车手动输入数量
			 *
			 */
			bindCode: function(e) {
				let num = JSON.parse(JSON.stringify(e))
				this.$emit('iptCartNum', num);
			},
			closeAttr: function() {
				this.$emit('myevent');
			},
			CartNumDes: function() {
				this.$emit('ChangeCartNum', false);
			},
			CartNumAdd: function() {
				this.$emit('ChangeCartNum', true);
			},
			tapAttr: function(indexw, indexn) {
				let that = this;
				that.$emit("attrVal", {
					indexw: indexw,
					indexn: indexn
				});
				this.$set(this.attr.productAttr[indexw], 'index', this.attr.productAttr[indexw].attr_values[indexn]);
				let value = that.getCheckedValue().join(",");
				that.$emit("ChangeAttr", value);
			},
			//获取被选中属性；
			getCheckedValue: function() {
				let productAttr = this.attr.productAttr;
				let value = [];
				for (let i = 0; i < productAttr.length; i++) {
					for (let j = 0; j < productAttr[i].attr_values.length; j++) {
						if (productAttr[i].index === productAttr[i].attr_values[j]) {
							value.push(productAttr[i].attr_values[j]);
						}
					}
				}
				return value;
			}
		}
	}
</script>

<style scoped lang="scss">
	.product-window {
		/*#ifdef H5*/
		padding-bottom: 130rpx;
		padding-bottom: calc(130rpx+ constant(safe-area-inset-bottom)); ///兼容 IOS<11.2/
		padding-bottom: calc(130rpx + env(safe-area-inset-bottom)); ///兼容 IOS>11.2/
		/*#endif*/
		/*#ifndef H5*/
		padding-bottom: 20rpx;
		/*#endif*/
		&.presell-window {
			/*#ifdef H5*/
			padding-bottom: 200rpx;
			/*#endif*/
		}
		&.custom-window {
			padding-bottom: 120rpx;
			padding-bottom: calc(120rpx+ constant(safe-area-inset-bottom)); ///兼容 IOS<11.2/
			padding-bottom: calc(120rpx + env(safe-area-inset-bottom)); ///兼容 IOS>11.2/
		}
	}
	.vip-money {
		color: #282828;
		font-size: 22rpx;
		margin-left: 6rpx;
	}
	.vipImg {
		width: 65rpx;
		height: 28rpx;
		margin-left: 4rpx;
		image {
			width: 100%;
			height: 100%;
			display: block;
		}
	}
	.product-window .textpic .text .presell_price {
		color: #FF7F00;
		.num {
			display: inline-block;
			margin-right: 20rpx;
		}
		.stock {
			margin-left: 0;
		}
	}
	.product-window .productWinList {
		max-height: 395rpx;
		overflow: auto;
		margin-top: 36rpx;
	}
	.product-window .cart {
		margin-top: 36rpx;
		padding: 0 30rpx;
	}
	.product-window .cart .carnum {
		align-items: center;
	}
	.product-window .cart .carnum .buy_limit {
		font-size: 22rpx;
		color: var(--view-theme);
		margin-right: 30rpx;
		border: none;
	}
</style>
