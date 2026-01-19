<template>
	<view :style="viewColor">
		<view class="CommissionRank">
		    <view class="header" :style="{ 'background-image': `url(${domain}/static/images/rank_header_bg.png)`}">
		      <view class="rank" v-if="position">您目前的排名第<text class="num">{{position }}</text>名</view>
		      <view class="rank" v-else>您目前暂无排名</view>
		    </view>
		    <view class="wrapper">
		      <view class="nav acea-row row-around">
		        <view class="item" :class="active == index ? 't-color' : ''" v-for="(item,index) in navList" :key="index" @click="switchTap(index)">
		          {{ item }}
		        </view>
		      </view>
		      <view class="list">
						<block v-if="rankList.length>0&&!loading">
							<view class="item acea-row row-between-wrapper" v-for="(item,index) in rankList" :key="index">
								<view class="num" v-if="index <= 2">
									<image :src="`${domain}/static/images/medal0${index+1}.png`"></image>
								</view>
								<view class="num" v-else>
								{{index+1}}
								</view>
								<view class="picTxt acea-row row-between-wrapper">
									<view class="pictrue"><image :src="item.avatar || '/static/images/f.png'"></image></view>
									<view class="text line1">{{item.nickname}}</view>
								</view>
								<view class="people p-color">¥{{item.count}}</view>
							</view>

						</block>

						<emptyPage v-else :noImage="`${domain}/static/images/noRecord.png`" title="暂无排行~"></emptyPage>
		    	</view>
				</view>
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
	import { HTTP_REQUEST_URL } from '@/config/app';
	import { getBrokerageRank } from '@/api/user.js';
	import { mapGetters } from "vuex";
	import { toLogin } from '@/libs/login.js';
	import emptyPage from '@/components/emptyPage.vue'
	export default {
		components: {emptyPage},
		data() {
			return {
				domain: HTTP_REQUEST_URL,
				navList: ["周排行", "月排行"],
				active: 0,
				rankList:[],
				page:1,
				limit:10,
				loadend:false,
				loading:false,
				loadTitle:'加载更多',
				type:'week',
				position:0,
			};
		},
		computed: mapGetters(['isLogin','viewColor','keyColor']),
		onLoad(){
			if(this.isLogin){
				this.getBrokerageRankList();
			}else{
				toLogin()
			}
		},
		methods: {
			switchTap:function(index){
				this.active = index;
				this.type = index ? 'month': 'week';
				this.page = 1;
				this.loadend = false;
				this.$set(this,'rankList',[]);
				this.getBrokerageRankList();
			},
			getBrokerageRankList:function(){
				if(this.loadend) return;
				if(this.loading) return;
				this.loading = true;
				this.loadTitle = '';
					getBrokerageRank({
						page:this.page,
						limit:this.limit,
						type:this.type
					}).then(res=>{
						let list = res.data.list;
						let loadend = list.length < this.limit;
						this.rankList.push.apply(this.rankList, list);
						this.loading = false;
						this.loadend = loadend;
						this.loadTitle = loadend ? '😕我也是有底线的':'加载更多';
						this.$set(this,'rankList',this.rankList);
						this.position = res.data.position;
					}).catch(err=>{
						this.loading = false;
						this.loadTitle = '加载更多';
					})
				}
		},
		 onReachBottom: function () {
				this.page++;
		    this.getBrokerageRankList();
		  }
	}
</script>

<style scoped lang="scss">
	.CommissionRank .header {
	  background-repeat: no-repeat;
	  background-color: var(--view-theme);
	  width: 100%;height: 344rpx;background-size: 100% 100%;
	  }
	.CommissionRank .header .rank {font-size: 33rpx;color: #fff;position: absolute;top: 160rpx;left: 48rpx;}
	.CommissionRank .header .rank .num {font-size: 51rpx;font-weight: bold;margin: 0 10rpx;}
	.CommissionRank .wrapper {width: 710rpx;background-color: #fff;min-height: calc(100vh - 284rpx);border-radius: 20rpx;margin: -76rpx auto 0 auto;}
	.CommissionRank .wrapper .nav {height: 99rpx;border-bottom: 2.5rpx solid #f3f3f3;font-size: 30rpx;font-weight: bold;color: #999;line-height: 99rpx;}
	.CommissionRank .wrapper .nav .item.t-color {border-bottom: 4rpx solid var(--view-theme); color: var(--view-theme)}
	.p-color{color: var(--view-priceColor);}
	.CommissionRank .wrapper .list {padding: 0 30rpx;}
	.CommissionRank .wrapper .list .item {border-bottom: 1px solid #f3f3f3;height: 101rpx;font-size: 28rpx;}
	.CommissionRank .wrapper .list .item .num {color: #666;width: 70rpx;}
	.CommissionRank .wrapper .list .item .num image {width: 34rpx;height: 40rpx;display: block;}
	.CommissionRank .wrapper .list .item .picTxt {width: 350rpx;}
	.CommissionRank .wrapper .list .item .picTxt .pictrue {width: 68rpx;height: 68rpx;}
	.CommissionRank .wrapper .list .item .picTxt .pictrue image {width: 100%;height: 100%;display: block;border-radius: 50%;}
	.CommissionRank .wrapper .list .item .picTxt .text {width: 262rpx;color: #333;}
	.CommissionRank .wrapper .list .item .people {width: 175rpx;text-align: right;}
</style>
