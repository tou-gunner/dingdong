<template>
	<view class="right-wrapper" @touchmove.stop.prevent="moveStop" :style="viewColor">
		<view class="control-wrapper animated" :class="showBox?'slideInRight':''">
			<view class="wrapper-count">
				<view class="header">
					<view class="title">ຊ່ວງລາຄາ</view>
					<view class="input-wrapper">
						<input placeholder="ລາຄາຕໍ່າສຸດ" v-model="min" type="number"/>
						<view class="line"></view>
						<input placeholder="ລາຄາສູງສຸດ" v-model="max" type="number"/>
					</view>
				</view>
				<view class="store_type content-border">
					<view class="title">ປະເພດຮ້ານຄ້າ</view>
					<view class="brand-wrapper">
						<view class="wrapper">
							<view class="item line1" v-for="(item,index) in storeCateList" :key="index" :class="item.check?'on':''" @tap="bindChenckType(item,index)">
								{{item.name}}
							</view>
						</view>
					</view>
				</view>
				<view class="content-box">
					<view class="content-title">
						<view class="title">ຍີ່ຫໍ້</view>
						<view v-if="list.length>3">
							<view class="btns" @click="isShowBrand = !isShowBrand">{{isShowBrand?'ຫຍໍ້':'ຂະຫຍາຍ'}}<text class="iconfont" :class="isShowBrand ? 'icon-ic_uparrow' : 'icon-ic_downarrow'"></text></view>
						</view>
					</view>
					<view class="brand-wrapper">
						<scroll-view :style="{'max-height':isShowBrand?'90%':'100rpx'}" :scroll-y="isShowBrand">
							<view class="wrapper">
								<view class="item line1" v-for="(item,index) in list" :key="index" :class="item.check?'on':''" @tap="bindChenck(item,'brand')">
									{{item.brand_name}}
								</view>
							</view>
						</scroll-view>
					</view>
				</view>
				<!--店铺类型-->
				<view class="content-box">
					<view class="content-title">
						<view class="title">ປະເພດຮ້ານ</view>
						<view v-if="storeTypeList.length>3">
							<view class="btns" @click="isShowType = !isShowType">{{isShowType?'ຫຍໍ້':'ຂະຫຍາຍ'}}<text class="iconfont" :class="isShowType ? 'icon-ic_uparrow' : 'icon-ic_downarrow'"></text></view>
						</view>
					</view>
					<view class="brand-wrapper">
						<scroll-view :scroll-y="isShowType" :style="{'max-height':isShowType?'90%':'100rpx'}">
							<view class="wrapper">
								<view class="item line1" v-for="(item,index) in storeTypeList" :key="index" :class="item.check?'on':''" @tap="bindChenck(item)">
									{{item.type_name}}
								</view>
							</view>
						</scroll-view>
					</view>
				</view>
				<!--商品参数-->
				<view class="content-border">
					<scroll-view style="max-height:400rpx" scroll-y="true">
						<view class="content-box" v-for="(item,index) in productParmasList" :key="index">
							<view class="content-title">
								<view class="title">{{item.name}}</view>
								<view>
									<view class="btns" @click="getParmasValue(item)">{{item.showValue?'ຫຍໍ້':'ຂະຫຍາຍ'}}<text class="iconfont" :class="item.showValue ? 'icon-ic_uparrow' : 'icon-ic_downarrow'"></text></view>
								</view>
							</view>
							<view v-if="item.parmasValue.length>0 && item.showValue" class="brand-wrapper">
								<scroll-view :scroll-y="isShowParmas" :style="{'max-height':item.showValue?'90%':'100rpx'}">
									<view class="wrapper">
										<view class="item line1" v-for="(itm,idx) in item.parmasValue" :key="idx" :class="itm.check?'on':''" @tap="bindChenck(itm)">
											{{itm.value}}
										</view>
									</view>
								</scroll-view>
							</view>
						</view>
					</scroll-view>
				</view>
			</view>
			<view class="foot-btn">
				<view class="btn-item" @click="reset">ຣີເຊັດ</view>
				<view class="btn-item confirm" @click="confirm">ຢືນຢັນ</view>
			</view>
		</view>
		<view class="right-bg" @click="close"></view>
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
	import { getParmasValue } from '@/api/store.js';
	export default{
		props: {
			brandList: {
				type: Array,
			},
			storeTypeArr: { //店铺类型
				type: Array,
			},
			parmasList: { //商品参数
				type: Array,
			},
			status:{
				type:Boolean,
				default:false
			},
			isCate:{
				type:Boolean,
				default:false
			},
			price_on:{
				type:String,
				default:''
			},
			price_off:{
				type:String,
				default:''
			},
			activeIndex:{
				type:Number,
				default:0
			}
		},
		computed: mapGetters(['viewColor']),
		data(){
			return {
				min: '',
				max:'',
				is_trader: '',
				isShow:false,
				isShowBrand: false,
				isShowType: false,
				isShowParmas: false,
				list:[],
				storeTypeList: [],
				productParmasList: [],
				storeCateList: [
					{name: 'ທັງໝົດ', value: '',check: true},
					{name: 'ຂາຍເອງ', value: 'trader',check: false},
					{name: 'ບໍ່ຂາຍເອງ', value: 'trader',check: false},
				],
				activeList:[],
				showBox:false,
				index: this.activeIndex
			}
		},
		mounted() {
			// 重要组件挂载后
			this.list =  this.brandList
			this.storeTypeList = this.storeTypeArr
			this.productParmasList = this.parmasList
			this.showBox = this.status
			this.min = this.price_on
			this.max = this.price_off
			this.bindChenckType({},this.activeIndex)
		},
		methods:{
			bindChenck(item,key){
				item.check = !item.check

			},
			bindChenckType(item,index){
				this.storeCateList = [
					{name: 'ທັງໝົດ', value: '',check: false},
					{name: 'ຂາຍເອງ', value: 'trader',check: false},
					{name: 'ບໍ່ຂາຍເອງ', value: 'trader',check: false},
				]
				this.storeCateList[index]['check'] = true
				this.is_trader = this.storeCateList[0]['check'] ? '' : this.storeCateList[1]['check'] ? 1 : 0
				this.index = index
			},
			/*获取参数值*/
			getParmasValue(item){
				item.showValue = !item.showValue
				getParmasValue(item.parameter_id).then(res => {
					res.data.forEach((data, index) => {
						data.check = false
					})
					if(item.parmasValue.length>0)return
					item.parmasValue =  res.data
				});
			},
			arrFilter(list){
				let arr = []
				arr = list.filter(item=>{
					return item.check == true
				})
				return arr
			},
			reset(){
				this.list.forEach((el,index)=>{
					el.check = false
				})
				this.storeTypeList.forEach((el,index)=>{
					el.check = false
				})
				this.productParmasList.forEach((item,index)=>{
					item.parmasValue.forEach((el,idx)=>{
						el.check = false
					})
				})
				this.storeCateList = [
					{name: 'ທັງໝົດ', value: '',check: true},
					{name: 'ຂາຍເອງ', value: 'trader',check: false},
					{name: 'ບໍ່ຂາຍເອງ', value: 'trader',check: false}
				]
				this.min = this.max = ''
				// this.arrFilter()
			},
			confirm(){
				let parmas = []
				this.productParmasList.forEach((item,index)=>{
					item.parmasValue.forEach((el,idx)=>{
						if(el.check){
							parmas.push(el.parameter_value_id)
						}
					})
				})
				let obj = {
					brandList: this.arrFilter(this.list),
					typeList: this.arrFilter(this.storeTypeList),
					parmasList: parmas,
					price_on: this.min,
					price_off: this.max,
					status: false,
					is_trader: this.is_trader
				}
				this.showBox = false
				this.$emit('confirm',obj,this.index)
			},
			close(){
				this.showBox = false
				this.$emit('close')
			},
			moveStop(){}
		}
	}
</script>

<style lang="scss" scoped>
	.store_type{
		position: relative;
		padding: 0 26rpx;
		.title{
			padding: 40rpx 0 20rpx;
			font-size: 26rpx;
			font-weight: 500;
			color: #282828;
		}
	}
</style>
