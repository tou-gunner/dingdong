
<template>
	<view class="right-wrapper" @touchmove.stop.prevent="moveStop" :style="viewColor">
		<view class="control-wrapper animated" :class="showBox?'slideInRight':''">
			<view class="wrapper-count">
				<view class="content-box">
						<view class="content-title">
							<view class="title">店铺类型</view>
							<view v-if="list.length>20">
								<view class="btns" @click="isShowType = !isShowType">{{isShowType?'收起':'展开'}}<text class="iconfont" :class="isShowType ? 'icon-ic_uparrow' : 'icon-ic_downarrow'"></text></view>
							</view>
						</view>
						<view class="brand-wrapper">
							<!-- <scroll-view style="max-height: 400rpx;" :scroll-y="isShow"> -->
							<scroll-view scroll-y="true" style="max-height: 400rpx;">
								<view class="wrapper">
									<view class="item line1" v-for="(item,index) in list" :key="index" :class="item.check?'on':''" @tap="bindChenck1(item)">
										{{item.type_name}}
									</view>
								</view>
							</scroll-view>
						</view>
					</view>
					<view class="content-box">
						<view class="content-title">
							<view class="title">商户分类</view>
							<view v-if="merCate.length>20">
								<view class="btns" @click="isShowCate = !isShowCate">{{isShowCate?'收起':'展开'}}<text class="iconfont" :class="isShowCate ? 'icon-ic_uparrow' : 'icon-ic_downarrow'"></text></view>
							</view>
						</view>
						<view class="brand-wrapper">
							<!-- <scroll-view style="max-height: 400rpx;" :scroll-y="isShow"> -->
							<scroll-view scroll-y="true" style="max-height: 400rpx;">
								<view class="wrapper">
									<view class="item line1" v-for="(item,index) in merCate" :key="index" :class="item.check?'on':''" @tap="bindChenck2(item)">
										{{item.category_name}}
									</view>
								</view>
							</scroll-view>
						</view>
					</view>
				</view>
				<view class="foot-btn">
					<view class="btn-item" @click="reset">重置</view>
					<view class="btn-item confirm" @click="confirm">确定</view>
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
			storeTypeArr: { //店铺类型
				type: Array,
			},
			merList: { //商户分类
				type: Array,
			},
			status:{
				type:Boolean,
				default:false
			},
		},
		computed: mapGetters(['viewColor']),
		data(){
			return {
				min: '',
				max:'',
				isShow: false,
				isShowType: false,
				isShowCate: false,
				list:[],
				merCate: [],
				activeList:[],
				selectList: [],
				showBox:false,
			}
		},
		mounted() {
			// 重要组件挂载后
			this.list = this.storeTypeArr //店铺类型
			this.merCate = this.merList //商户分类
			this.showBox = this.status
		},
		methods:{
			bindChenck1(item){
				item.check = !item.check
				this.arrFilter1()
			},
			bindChenck2(item){
				item.check = !item.check
				this.arrFilter2()
			},
			arrFilter1(){
				this.selectList = this.list.filter(item=>{
					return item.check == true
				})
			},
			arrFilter2(){
				this.activeList = this.merCate.filter(item=>{
					return item.check == true
				})
			},
			reset(){
				this.list.forEach((el,index)=>{
					el.check = false
				})
				this.merCate.forEach((el,index)=>{
					el.check = false
				})
				this.arrFilter1()
				this.arrFilter2()
			},
			confirm(){
				this.arrFilter1()
				this.arrFilter2()
				console.log(this.activeList)
				let obj = {
					storeTypeArr:this.selectList,
					merList: this.activeList,
					status:false
				}
				this.showBox = false
				this.$emit('confirm',obj)
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

</style>
