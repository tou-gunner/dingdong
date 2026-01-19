<template>
	<view :style="viewColor">
		<view class="product-window"
			:class="windowClassList">
			<view class="textpic acea-row row-between-wrapper">
				<view class="pictrue">
					<image class="image" :src="attr.productSelect.image ? attr.productSelect.image : image" @click="loookImg">
					</image>
				</view>
				<view class="text">
					<view :class="[isShow ? 'line1' : 'line2']">
						{{ attr.productSelect.store_name }}
					</view>
					<view v-if="isPresell" class="money presell_price">
						<view>
							<text style="margin-right: 2rpx;">预售价</text>
							<priceFormat :price="attr.productSelect.price" weight intSize="40" floatSize="26" labelSize="26">
							</priceFormat>
							<text v-if="presell_type === 2" style="margin-left:10rpx;">定金¥<text class="num semiBold">{{
								attr.productSelect.down_price }}</text></text>
						</view>
						<text class="stock" v-if='isShow'>库存: {{ attr.productSelect.stock }}</text>
						<text class='stock' v-if="limitNum">限量: {{ attr.productSelect.limitNum }}</text>
					</view>
					<view v-else class="money" :class="[isShow ? '' : 'mini-margin-top']">
						<view class="acea-row row-middle">
							<view class="acea-row row-bottom">
								<view v-if="type == 'points'" class="points_money">
									<image :src="`${domain}/static/images/jf-point.png`" mode="" class="point-img"></image>
									<text class="points-num">{{ attr.productSelect.ot_price }}</text>积分 <text
										v-if="attr.productSelect.price > 0">+{{ attr.productSelect.price }}元</text>
									<text v-if="limitCount > 0" class="points-limit">限购{{ limitCount }}件</text>
								</view>
								<view v-else>
									<priceFormat :price="attr.productSelect.price" weight intSize="40" floatSize="26" labelSize="26">
									</priceFormat>
								</view>
								<view v-if="svipPrice" class="acea-row row-middle">
									<text class='vip-money semiBold'>¥{{ attr.productSelect.svip_price }}</text>
									<view class="vipImg">
										<image :src="`${domain}/static/images/svip.png`" class="vip-img"></image>
									</view>
								</view>
							</view>
						</view>
						<view class="stock_count">
							<text class="stock" v-if='isShow'>库存: {{ attr.productSelect.stock }}</text>
							<text class='stock' v-if="limitNum">限量: {{ attr.productSelect.quota_show }}</text>
						</view>
					</view>
				</view>
				<view class="iconfont icon-ic_close popup-close" @click="closeAttr"></view>
			</view>
			<view class="productWinList">
				<view class="item" v-for="(item, indexw) in attr.productAttr" :key="indexw">
					<view class="titles">{{ item.attr_name }}</view>
					<view class="listn acea-row">
						<view class="itemn" :class="item.index === itemn.attr ? 'on' : ''"
							v-for="(itemn, indexn) in item.attr_value" @click="tapAttr(indexw, indexn)" :key="indexn">
							{{ itemn.attr }}
						</view>
					</view>
				</view>
			</view>
			<view v-if="productType != 3" class="cart acea-row row-between-wrapper">
				<view class="title">数量</view>
				<view class="carnum acea-row row-left">
					<view class="buy_limit" v-if="minCount > 0 || maxCount > 0">
						(<text v-if="minCount > 0">{{ minCount }}件起购<text v-if="minCount > 0 && maxCount > 0">，</text></text><text
							v-if="maxCount > 0">最多{{ maxCount }}件</text>)
					</view>
					<view class="item reduce"
						:class="(attr.productSelect.cart_num <= 1 || (minCount > 0 && attr.productSelect.cart_num <= minCount)) ? 'on' : ''"
						@click="CartNumDes">
						<text class="iconfont icon-ic_Reduce"></text>
					</view>
					<view class='item num'>
						<input type="number" v-model="attr.productSelect.cart_num" data-name="productSelect.cart_num"
							@input="bindCode(attr.productSelect.cart_num)"></input>
					</view>
					<view v-if="iSplus" class="item plus"
						:class="(attr.productSelect.cart_num >= attr.productSelect.stock || destri || (maxCount > 0 && attr.productSelect.cart_num >= maxCount)) ? 'on' : ''"
						@click="CartNumAdd"><text class="iconfont icon-ic_increase"></text></view>
					<view v-else class='item plus'
						:class='((attr.productSelect.cart_num >= attr.productSelect.quota_show)
							|| (attr.productSelect.cart_num >= attr.productSelect.stock) || (maxCount > 0 && attr.productSelect.cart_num >= maxCount)) ? "on" : ""'
						@click='CartNumAdd'><text class="iconfont icon-ic_increase"></text></view>
				</view>
			</view>
			<view class="joinBnt b-color" v-if="(destri || iSbnt) && attr.productSelect.stock > 0" @click="goCat">立即购买</view>
			<view class="joinBnt on" v-else-if="destri && attr.productSelect.stock <= 0">已售罄</view>
			<view class="joinBnt b-color" v-else-if="isList && attr.productSelect.stock > 0" @click="goCat">立即加购</view>
			<view class="joinBnt on" v-else-if="(iSbnt && attr.productSelect.stock <= 0)">已售罄</view>
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
import { toLogin } from '@/libs/login.js';
export default {
	props: {
		attr: {
			type: Object,
			default: () => { }
		},
		limitNum: {
			type: Number,
			default: 0
		},
		limitCount: {
			type: Number || String,
			default: 0
		},
		isShow: {
			type: Boolean,
			default: () => false
		},
		iSbnt: { //参团
			type: Number,
			default: 0
		},
		iSplus: {
			type: Number,
			default: 0
		},
		destri: {
			type: Number,
			default: 0
		},
		isPresell: {
			type: Number,
			default: 0
		},
		presell_type: {
			type: Number,
			default: 1
		},
		image: {
			type: String,
			default: ''
		},
		maxCount: {
			type: Number,
			default: 0
		},
		minCount: {
			type: Number,
			default: 0
		},
		payLimit: {
			type: Number || String,
			default: 1
		},
		svipPrice: {
			type: Boolean,
			default: false
		},
		isList: {
			type: Boolean,
			default: false
		},
		isTab: {
			type: Boolean,
			default: false
		},
		type: {
			type: String,
			default: ''
		},
		productType: {
			type: Number || String,
			default: 1
		},
		isCustom: {
			type: Boolean,
			default: () => false
		},
	},
	computed: {
		...mapGetters(['viewColor', 'isLogin']),
		windowClassList() {
			const classListConfig = [
				{
					className: "on",
					validate: () => this.attr.cartAttr === true
				},
				{
					className: "join",
					validate: () => {
						return this.iSbnt || this.destri || (this.isList && !this.isTab);
					}
				},
				{
					className: "presell-window",
					validate: () => this.isPresell
				},
				{
					className: "custom-window",
					validate: () => this.isCustom
				}
			];

			return classListConfig
				.filter(item => item.validate())
				.map(item => item.className);
		}
	},
	data() {
		return {
			domain: HTTP_REQUEST_URL
		};
	},
	mounted() { },
	methods: {
		//  查看大图
		loookImg() {
			let self = this
			let arr = [self.attr.productSelect.image ? self.attr.productSelect.image : self.image]
			uni.previewImage({
				urls: arr,
			});
		},
		goCat: function () {
			if (!this.isLogin) toLogin()
			this.$emit('goCat');
		},
		/**
		 * 购物车手动输入数量
		 *
		 */
		bindCode: function (e) {
			let num = JSON.parse(JSON.stringify(e))
			this.$emit('iptCartNum', num);
		},
		closeAttr: function () {
			this.$emit('myevent');
		},
		CartNumDes: function () {
			if (!this.destri) {
				this.$emit('ChangeCartNum', false);
			}
		},
		CartNumAdd: function () {
			if (!this.destri) {
				this.$emit('ChangeCartNum', true);
			}
		},
		tapAttr: function (indexw, indexn) {
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
		getCheckedValue: function () {
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
		},

	}
}
</script>

<style scoped lang="scss">
.product-window {
	position: fixed;
	bottom: 0;
	width: 100%;
	left: 0;
	background-color: #fff;
	z-index: 120;
	border-radius: 40rpx 40rpx 0 0;
	/*#ifdef H5*/
	padding-bottom: 150rpx;
	padding-bottom: calc(150rpx+ constant(safe-area-inset-bottom)); ///兼容 IOS<11.2/
	padding-bottom: calc(150rpx + env(safe-area-inset-bottom)); ///兼容 IOS>11.2/
	/*#endif*/
	/*#ifdef MP || APP-PLUS*/
	padding-bottom: 44rpx;
	/*#endif*/
	transform: translate3d(0, 100%, 0);
	transition: all .3s cubic-bezier(.25, .5, .5, .9);

	&.presell-window {
		/*#ifdef H5 || APP-PLUS*/
		padding-bottom: 200rpx;
		/*#endif*/
		/*#ifdef MP*/
		padding-bottom: 260rpx;
		/*#endif*/
	}

	&.custom-window {
		--default-pd-size: 120rpx;
		--default-pd-size: calc(120rpx + constant(safe-area-inset-bottom));
		--default-pd-size: calc(120rpx + env(safe-area-inset-bottom));
		--pd-bottom: var(--tabbar-height, var(--default-pd-size));
		padding-bottom: calc(var(--pd-bottom) + 10px);
	}

	&.join {
		padding-bottom: 30rpx;
		padding-bottom: calc(30rpx+ constant(safe-area-inset-bottom)); ///兼容 IOS<11.2/
		padding-bottom: calc(30rpx + env(safe-area-inset-bottom)); ///兼容 IOS>11.2/
	}
}

.product-window.on {
	transform: translate3d(0, 0, 0);
}

.product-window .textpic .text .money .points_money {
	display: flex;
	align-items: baseline;

	.point-img {
		width: 26rpx;
		height: 26rpx;
		margin-right: 10rpx;
	}

	.points-num {
		font-size: 34rpx;
		font-weight: bold;
	}

	.points-limit {
		display: flex;
		padding: 0 10rpx;
		align-items: center;
		justify-content: center;
		color: var(--view-theme);
		border: 1px solid var(--view-theme);
		height: 26rpx;
		border-radius: 14rpx;
		background: var(--view-bgColor);
		margin-left: 10rpx;
		font-size: 18rpx;
	}
}

.product-window .stock_count {
	margin-top: 12rpx;
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

.vip-money {
	color: #282828;
	font-size: 22rpx;
	margin: 0 10rpx 0 20rpx;
}

.vipImg {
	width: 65rpx;
	height: 28rpx;

	.vip-img {
		width: 100%;
		height: 100%;
		display: block;
	}
}

.product-window .productWinList {
	max-height: 730rpx;
	overflow: auto;
	margin-top: 36rpx;
}

.product-window .cart {
	margin-top: 36rpx;
	padding: 0 30rpx;
	display: -webkit-box;
	display: -webkit-flex;
	display: -ms-flexbox;
	display: flex;
	-webkit-box-pack: justify;
	-webkit-justify-content: space-between;
	-ms-flex-pack: justify;
	justify-content: space-between;
}

.product-window .cart .title {
	font-size: 30rpx;
	color: #999;
	line-height: 54rpx;
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

.mini-margin-top {
	margin-top: 20rpx !important;
}
</style>
