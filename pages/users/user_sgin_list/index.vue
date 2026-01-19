<template>
	<view :style="viewColor">
		<view v-if="signList.length>0" class='sign-record pad20'>
		 <view class='list' v-for="(item,index) in signList" :key="index">
			<view class='item'>
			 <view class='data'>{{item.month}}</view>
			 <view class='listn bg-f boder-24'>
				<view class='itemn acea-row row-between-wrapper' v-for="(itemn,indexn) in item.list" :key="indexn">
					<view>
						<view class='name line1'>{{itemn.title}}</view>
						<view>{{itemn.create_time}}</view>
				 </view>
				 <view class='num t-color semiBold'>+{{itemn.number}}</view>
				</view>
			 </view>
			</view>
		 </view>
		 <view class='loadingicon acea-row row-center-wrapper'>
				<text class='loading iconfont icon-jiazai' :hidden='loading==false'></text>{{loadtitle}}
		 </view>
		</view>
		<view v-if="signList.length == 0">
			<emptyPage title="暂无记录~" :noImage="`${domain}/static/images/empty-box.png`"></emptyPage>
		</view>
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
	import { getSignMonthList } from '@/api/user.js';
  import { mapGetters } from "vuex";
	import { toLogin } from '@/libs/login.js';
	import { HTTP_REQUEST_URL } from '@/config/app';
	import emptyPage from '@/components/emptyPage.vue';
	export default {
		components: {emptyPage},
		data() {
			return {
				domain: HTTP_REQUEST_URL,
				loading:false,
				loadend:false,
				loadtitle:'加载更多',
				page:1,
				limit:8,
				signList:[],
			};
		},
		computed: mapGetters(['isLogin','viewColor']),
		onLoad(options){
			if(this.isLogin){
				this.getSignMoneList();
			}else{
				toLoign()
			}
		},
		methods: {
			/**
				 * 获取签到记录列表
				*/
			getSignMoneList:function(){
				let that=this;
				if(that.loading) return;
				if(that.loadend) return;
				that.loading = true;
				that.loadtitle = "";
				getSignMonthList({ page: that.page, limit: that.limit }).then(res=>{
					let list = res.data;
					let loadend = list.length < that.limit;
					that.signList = that.$util.SplitArray(list, that.signList);
					that.$set(that,'signList',that.signList);
					that.loadend = loadend;
					that.loading = false;
					that.loadtitle = loadend ? "哼😕~我也是有底线的~" : "加载更多"
				}).catch(err=>{
					that.loading = false;
					that.loadtitle = '加载更多';
				})
			},
		},
		onReachBottom: function () {
			this.getSignMoneList();
		},
	}
</script>
<style>
	.t-color{color:var(--view-theme)!important;}
</style>
