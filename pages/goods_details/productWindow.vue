<template>
	<view :style="viewColor">
		<view class="product-window popup-main bg-f"
			:class="(attr.cartAttr === true ? 'on' : '') + ' ' + (iSbnt?'join':'') + ' ' + (iScart?'joinCart':'')">
			<text class="iconfont icon-ic_close popup-close" @click.stop="closeAttr"></text>
			<view class="textpic acea-row row-between-wrapper">
				<view class="pictrue">
					<image :src="attr.productSelect.image" @click='getpreviewImage'></image>
				</view>
				<view class="text">
					<view :class="[ isShow ? 'line1' : 'line2' ]">
						{{ title }}
					</view>
					<view class="money">
						<view class="acea-row row-middle">
							<priceFormat :price="attr.productSelect.price" weight intSize="40" floatSize="26" labelSize="26"></priceFormat>
						</view>
						<text class="stock" v-if='isShow'>ສະຕ໋ອກ: {{ attr.productSelect.stock }}</text>
					</view>
				</view>
			</view>
			<view class="rollTop">
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
			</view>
			<view class="joinBnt on"
				v-if="!attr.productSelect || attr.productSelect.stock <=0">ໝົດແລ້ວ
			</view>
			<view class="joinBnt" v-if="attr.productSelect.stock" @click="goCat">ຢືນຢັນ</view>
			<view class="joinBnt on" v-else-if="!attr.productSelect.stock">ໝົດແລ້ວ</view>
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
	export default {
		props: {
			attr: {
				type: Object,
				default: () => {}
			},
			title: {
				type: String
			},
			limitNum: {
				type: Number,
				default: 0
			},
			isShow: {
				type: Boolean,
				default: () => false
			},
			iSbnt: {
				type: Number,
				default: 0
			},
			iSplus: {
				type: Number,
				default: 0
			},
			iScart: {
				type: Number,
				default: 0
			},
			is_vip: {
				type: Number,
				default: 0
			}
		},
		computed: mapGetters(['viewColor']),
		data() {
			return {};
		},
		mounted() {
		},
		methods: {
			getpreviewImage: function() {
				uni.previewImage({
					urls: this.attr.productSelect.image.split(','),
					current: this.attr.productSelect.image
				});
			},
			goCat: function() {
				this.$emit('goCat');
			},
			closeAttr: function() {
				this.$emit('myevent');
			},
			tapAttr: function(indexw, indexn) {
				let that = this;
				that.$emit("attrVal", {
					indexw: indexw,
					indexn: indexn
				});
				this.$set(this.attr.productAttr[indexw], 'index', this.attr.productAttr[indexw].attr_values[indexn]);
				let value = that
					.getCheckedValue()
					.join(",");
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
		height: 1000rpx;
		z-index: 320;
		--pd-bottom: var(--tabbar-height, 140rpx);
		padding-bottom: var(--pd-bottom);
		padding-bottom: calc(var(--pd-bottom) + constant(safe-area-inset-bottom)); /* 兼容 IOS<11.2 */
		padding-bottom: calc(var(--pd-bottom) + env(safe-area-inset-bottom)); /* 兼容 IOS>11.2 */
	}
	.product-window .icon-ic_close{
		z-index: 1;
		right: 20rpx;
		position: absolute;
		top: 20rpx;
	}


	.product-window .rollTop {
		max-height: 500rpx;
		overflow: auto;
		margin: 36rpx 0;
	}
	.product-window .productWinList .item .listn .itemn.limit {
		color: #999;
		text-decoration: line-through;
	}
	.product-window .cart {
		margin-top: 36rpx;
		padding: 0 30rpx;
	}
	.product-window .cart .title {
		font-size: 30rpx;
		color: #999;
	}
	.product-window .joinBnt {
		font-size: 28rpx;
		width: 690rpx;
		height: 86rpx;
		border-radius: 50rpx;
		text-align: center;
		line-height: 88rpx;
		color: #fff;
		position: absolute;
		bottom: 30rpx;
		left: 30rpx;
		background-image: linear-gradient(270deg, var(--view-bntColor21) 0%, var(--view-bntColor22) 100%);
	}
</style>
