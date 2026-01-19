<template>
	<view :style="viewColor">
		<view v-if="pointsList.length>0" class='sign-record pad20'>
			<view class="bg-f boder-24">
				<view class='list' v-for="(item,index) in pointsList" :key="index">
					<view class='item'>
					 <view class='listn'>
						<view class='itemn acea-row row-between-wrapper'>
							<view>
								<view class='name line1'>{{item.title}}</view>
								<view>{{item.create_time}}</view>
							</view>
							<view class='num regular'>
								{{item.pm ? '+' : '-'}}{{Number(item.number)}}
							</view>
						</view>
					 </view>
					</view>
				</view>
			</view>

		 <view class='loadingicon acea-row row-center-wrapper'>
				<!-- <text class='loading iconfont icon-jiazai' :hidden='loading==false'></text>{{loadtitle}} -->
				{{loadtitle}}
		 </view>
		</view>
		<view v-if="pointsList.length == 0">
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
	import { getIntegralList } from '@/api/user.js';
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
				loadtitle:'正在加载...',
				page:1,
				limit:10,
				pointsList:[],
			};
		},
		computed: mapGetters(['isLogin','viewColor']),
		onLoad(options){
			if(this.isLogin){
				this.getPointsList();
			}else{
				toLoign()
			}
		},
		methods: {
			/**
				 * 获取积分明细
				*/
			getPointsList:function(){
				let that=this;
				if(that.loading) return;
				if(that.loadend) return;
				that.loading = true;
				that.loadtitle = "正在加载...";
				getIntegralList({ page: that.page, limit: that.limit }).then(res=>{
					let list = res.data.list;
					let loadend = list.length < that.limit;
					that.pointsList = that.$util.SplitArray(list, that.pointsList);
					that.$set(that,'pointsList',that.pointsList);
					that.loadend = loadend;
					that.loading = false;
					that.loadtitle = loadend ? "哼😕~我也是有底线的~" : "加载更多"
				}).catch(err=>{
					that.loading = false;
					that.loadtitle = '加载更多';
				});

			},
		},
		onReachBottom: function () {
			this.getPointsList();
		},
	}
</script>
<style>
	.num {color: #333!important}
	.sign-record{	margin-top: 38rpx; }
	.sign-record .list~.list .itemn{border-top: 1rpx solid #EEEEEE;}
	.sign-record .itemn {height: 150rpx!important}
</style>
