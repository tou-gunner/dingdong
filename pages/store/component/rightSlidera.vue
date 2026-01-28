<template>
	<view class="right-wrapper" :style="viewColor">
		<view class="control-wrapper animated" :class="showBox?'slideInRight':''">
			<view class="header">
				<view class="title font-bold">ຊ່ວງລາຄາ</view>
				<view class="input-wrapper">
					<input placeholder="ລາຄາຕ່ຳສຸດ" v-model="min" type="number"/>
					<view class="line"></view>
					<input placeholder="ລາຄາສູງສຸດ" v-model="max" type="number"/>
				</view>
			</view>
			<view class="content-box content-border">
				<view class="content-title">
					<view class="title">ຍີ່ຫໍ້</view>
					<view v-if="list.length>3">
						<view class="btns" @click="isShowBrand = !isShowBrand">{{isShowBrand?'ຫຍໍ້ເຂົ້າ':'ເບິ່ງເພີ່ມເຕີມ'}}<text class="iconfont" :class="isShowBrand ? 'icon-ic_uparrow' : 'icon-ic_downarrow'"></text></view>
					</view>
				</view>
				<view class="brand-wrapper">
					<scroll-view :style="{'height':isShow?'90%':'250rpx'}" :scroll-y="isShow">
						<view class="wrapper">
							<view class="item line1" v-for="(item,index) in list" :key="index" :class="item.check?'on':''" @tap="bindChenck(item)">
								{{item.brand_name}}
							</view>
						</view>
					</scroll-view>
					<view class="btns" v-if="!isShow && list.length>9" @click="isShow = true">ເບິ່ງທັງໝົດ<text class="iconfont icon-ic_downarrow"></text></view>
					<view class="btns" v-if="isShow && list.length>9"  @click="isShow = false">ຫຍໍ້ເຂົ້າ<text class="iconfont icon-ic_uparrow"></text></view>
				</view>
			</view>
			<view class="foot-btn">
				<view class="btn-item" @click="reset">ລ້າງຄ່າ</view>
				<view class="btn-item confirm" @click="confirm">ຕົກລົງ</view>
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
	export default{
		props: {
			brandList: {
				type: Array,
			},
			status:{
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
			}
		},
		computed: mapGetters(['viewColor']),
		data(){
			return {
				min: '',
				max:'',
				is_trader: '',
				isShow:false,
				list:[],
				storeTypeList: [
					{name: 'ທັງໝົດ', value: '',check: true},
					{name: 'ຮ້ານຄ້າຫຼັກ', value: 'trader',check: false},
				],
				activeList:[],
				showBox:false,
				isShowBrand: false,
			}
		},
		mounted() {
			// 重要组件挂载后
			this.list = this.brandList
			this.showBox = this.status
			this.min = this.price_on
			this.max = this.price_off
		},
		methods:{
			bindChenck(item){
				item.check = !item.check
				this.arrFilter()
			},
			bindChenckType(item,index){
				this.storeTypeList = [
					{name: 'ທັງໝົດ', value: '',check: false},
					{name: 'ຮ້ານຄ້າຫຼັກ', value: 'trader',check: false},
				]
				this.storeTypeList[index]['check'] = true
				this.is_trader = this.storeTypeList[0]['check'] ? '' : 1
			},
			arrFilter(){
				this.activeList = this.list.filter(item=>{
					return item.check == true
				})
			},
			reset(){
				this.list.forEach((el,index)=>{
					el.check = false
				})
				this.storeTypeList = [
					{name: 'ທັງໝົດ', value: '',check: true},
					{name: 'ຮ້ານຄ້າຫຼັກ', value: 'trader',check: false}
				]
				this.min = this.max = ''
				this.arrFilter()
			},
			confirm(){
				this.arrFilter()
				console.log(this.activeList)
				let obj = {
					brandList:this.activeList,
					price_on:this.min,
					price_off:this.max,
					status:false,
					is_trader: this.is_trader
				}
				this.showBox = false
				this.$emit('confirm',obj)
			},
			close(){
				this.showBox = false
				this.$emit('close')
			},
		}
	}
</script>

<style lang="scss" scoped>
</style>
