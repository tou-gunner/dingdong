<template>
	<view :style="viewColor">
		<block v-if="bargain.length>0">
			<div class="bargain-record pad20" ref="container">
				<div class="item bg-f boder-24 mt20" v-for="(item, index) in bargain" :key="index">
					<div class="picTxt acea-row row-between-wrapper">
						<div v-if="item.product" class="pictrue">
							<image :src="item.product.image ? item.product.image : ''" />
						</div>
						<div class="text acea-row row-column-around">
							<div v-if="item.product" class="line1" style="width: 100%;">{{ item.product.store_name }}</div>
							<count-down :justify-left="'justify-content:left'" :is-day="true" :tip-text="'ນັບຖອຍຫຼັງ '" :day-text="' ມື້ '" :hour-text="' ຊມ '" :minute-text="' ນທ '"
							 :second-text="' ວິ'" :datatime="item.stop_time" :isView="true" v-if="item.status === 1" :id="item.product_assist_set_id"></count-down>
							 <view class="acea-row price_count acea-row row-bottom">
								 <view class='money t-color acea-row row-bottom'>
								 	<view>ລາຄາຊ່ວຍເຫຼືອ:</view>
								 	<view class='num' v-if="item.assistSku && item.assistSku[0]">
										<priceFormat :price="item.assistSku[0].assist_price" weight intSize="40" floatSize="26" labelSize="26"></priceFormat>
									</view>
								 </view>
								 <view class='money money_lf' v-if="item.product">
								 	<text class="under_price regular">¥{{item.product.price}}</text>
								 </view>
							 </view>
						</div>
					</div>
					<div class="bottom acea-row row-between-wrapper">
						<div class="purple" v-if="item.status === 1 || item.status === 0">ກິດຈະກຳກຳລັງດຳເນີນ</div>
						<div class="success" v-if="item.status === 10 || item.status === 20">ຊ່ວຍເຫຼືອສຳເລັດ</div>
						<div class="end" v-if="item.status === -1">ກິດຈະກຳສິ້ນສຸດແລ້ວ</div>
						<div class="acea-row row-middle row-right">
							<div v-if="item.status === 1 || item.status === 0">
<div class="bnt cancel" @click="getBargainUserCancel(item.product_assist_set_id)">
								ຍົກເລີກກິດຈະກຳ
							</div>
<div class="bnt b-color" @click="getInvitation(item.product_assist_set_id)">
								ເຊີນຊ່ວຍເຫຼືອ
							</div>
							</div>
							<div v-if="item.status === 10 || item.status === 20">
								<view v-if="(item.order.paid == 0 || item.order.paid == 1) && item.status === 20"class="bnt b-color" @click="goOrderDetail(item.order)">ເບິ່ງລາຍລະອຽດ</view>
								<view v-else  class="bnt b-color" @click="goPay(item)">ຊຳລະເງິນດຽວນີ້</view>
							</div>
						</div>
					</div>
				</div>
				<Loading :loaded="status" :loading="loadingList"></Loading>
			</div>
		</block>
		<block v-if="bargain.length == 0">
			<emptyPage title="ຍັງບໍ່ມີບັນທຶກ~" :noImage="`${domain}/static/images/noRecord.png`"></emptyPage>
		</block>
		<home></home>
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
	import CountDown from "@/components/countDown";
	import emptyPage from '@/components/emptyPage.vue'
	import { getBargainUserList, getBargainUserCancel } from "@/api/activity";
	import { postCartAdd } from '../../../api/store.js';
	import Loading from "@/components/Loading";
	import home from '@/components/home';
	import { mapGetters } from "vuex";
	import {HTTP_REQUEST_URL} from '@/config/app';
	export default {
		name: "BargainRecord",
		components: {
			CountDown,
			Loading,
			emptyPage,
			home
		},
		computed: { ...mapGetters(['viewColor'])},
		props: {},
		data: function() {
			return {
				domain:HTTP_REQUEST_URL,
				bargain: [],
				status: false, //助力列表是否获取完成 false 未完成 true 完成
				loadingList: false, //当前接口是否请求完成 false 完成 true 未完成
				page: 1, //页码
				limit: 20, //数量
			};
		},
		onLoad: function() {
			this.getBargainUserList();
		},
		onReady() {
			uni.$once('endTime',(data)=>{
				this.bargain.forEach((el,index)=>{
					if(el.product_assist_set_id == data){
						el.status = -1
					}
				})
			})
		},
		methods: {
			getBargainUserList: function() {
				var that = this;
				if (that.loadingList) return;
				if (that.status) return;
				getBargainUserList({
						page: that.page,
						limit: that.limit
					})
					.then(res => {
						that.status = res.data.list.length < that.limit;
						that.bargain.push.apply(that.bargain, res.data.list);
						that.page++;
						that.loadingList = false;
					})
					.catch(res => {
						that.$util.Tips({
							title: res
						})
					});
			},
			// 立即购买
			goPay: function(item) { //立即支付
				var that = this;
				var data = {
					product_id : item.product_assist_set_id,
					product_attr_unique: item.assistSku[0].unique,
					cart_num: 1,
					product_type: 3,
					is_new: 1
				};
				postCartAdd(data).then(res => {
					uni.navigateTo({
						url: '/pages/users/order_confirm/index?new=1&cartId=' + res.data.cart_id
					});
				}).catch(err => {
					return that.$util.Tips({title:err})
				});
			},
			// 邀请助力
			getInvitation: function(id){
				uni.navigateTo({
					url: '/pages/activity/assist_detail/index?id=' + id
				});
			},
			// 查看详情
			goOrderDetail: function(order) {
				if(order.paid == 1){
					uni.navigateTo({
						url: '/pages/order_details/index?order_id='+order.order_id,
					})
				}else{
					uni.navigateTo({
						url: '/pages/order_details/stay?order_id='+order.group_order_id,
					})
				}
			},
			// 取消
			getBargainUserCancel: function(id) {
				var that = this;
				getBargainUserCancel(id)
					.then(res => {
						that.status = false;
						that.loadingList = false;
						that.page = 1;
						that.$util.Tips({
							title: res.message
						})
						setTimeout(function(){
							that.bargain = [];
							that.getBargainUserList();
						},3000)
					})
					.catch(res => {
						that.$util.Tips({
							title: res
						})
					});
			},
		},
		onReachBottom() {
			this.getBargainUserList();
		}
	};
</script>

<style lang="scss">
	.bargain-record .item .price_count{
		.money_lf{
			margin-left: 10rpx;
		}
		.t-color {
			color: var(--view-priceColor);
		}
		.under_price{
			color: #999999;
			font-size: 26rpx;
			text-decoration: line-through;
			font-weight: normal;
		}
	}
	.bargain-record .item .picTxt {
		border-bottom: 1px solid #f5f5f5;
		padding: 30upx;
	}
	.bargain-record .item .picTxt .pictrue {
		width: 150upx;
		height: 150upx;
	}
	.bargain-record .item .picTxt .pictrue image {
		width: 100%;
		height: 100%;
		border-radius: 16upx;
	}
	.bargain-record .item .picTxt .text {
		width: 470upx;
		font-size: 30upx;
		color: #282828;
		height: 150upx;
	}
	.bargain-record .item .picTxt .text .time {
		font-size: 24upx;
		color: #999999;
		justify-content: left !important;
	}
	.bargain-record .item .picTxt .text .successTxt{
		font-size:24rpx;
	}
	.bargain-record .item .picTxt .text .endTxt{
		font-size:24rpx;
		color: #999;
	}
	.bargain-record .item .picTxt .text .money {
		font-size: 24upx;
		font-weight: bold;
	}
	.bargain-record .item .bottom {
		height: 100upx;
		padding: 0 30upx;
		font-size: 27upx;
	}
	.bargain-record .item .bottom .purple {
		color: #f78513;
	}
	.bargain-record .item .bottom .end {
		color: #999;
	}
	.bargain-record .item .bottom .success {
		color: var(--view-theme);
	}
	.bargain-record .item .bottom .bnt {
		font-size: 24upx;
		color: #fff;
		width: 160upx;
		height: 64upx;
		border-radius: 50upx;
		text-align: center;
		line-height: 64upx;
		display: inline-block;
		&.b-color {
			background-color: var(--view-theme);
		}
	}
	.bargain-record .item .bottom .bnt.cancel {
		color: #666;
		border: 1px solid #ddd;
	}
	.bargain-record .item .bottom .bnt~.bnt {
		margin-left: 18upx;
	}
</style>
