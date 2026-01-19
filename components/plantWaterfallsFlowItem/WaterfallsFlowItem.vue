<template>
	<view v-if="item" @click="goDetail(item)" class="wf-page2 boder-24" :style="viewColor">
		<view class='pictrue skeleton-rect' :style="{'max-height': item.imageH + 'rpx'}">
			<image class="image" mode="widthFix"  :src="item.image[0]"></image>
			<view v-if="item.is_type == 2" class="plant-show">
				<text class="iconfont icon-ic_right2"></text>
			</view>
			<view v-else-if="item.is_type == 1" class="img-count acea-row row-center row-middle">
				{{item.image.length}}图
			</view>
			<view v-if="isAuth && tab == 0 && item.status != 1" class="approval_status acea-row row-middle row-center" :style="'height:'+(item.imageH-(item.imageH*0.03))+'rpx;'">
				<view>
					<view v-if="item.status == -1" class="approval_title font-bold">审核未通过</view>
					<view v-else-if="item.status == -2" class="approval_title font-bold">已下架</view>
					<view v-else-if="item.status == 0" class="approval_title font-bold">正在审核</view>
					<text v-if="item.status == -1 || item.status == -2" class="approval_info">查看未通过原因</text>
					<text v-if="item.status == 0" class="approval_info">通过后将展示在列表</text>
				</view>
			</view>
		</view>
		<view class='text' :class="{'text-show' : isShow}">
			<view class='name skeleton-rect'>
				<text class="text_name line2">{{item.title}}
				</text>
			</view>
			<view class="count acea-row skeleton-rect">
				<view v-if="!isAuth" class="author acea-row">
					<image class="image" :src="(item.author && item.author.avatar) || '/static/images/f.png'"></image>
					<text class="author_name line1">{{item.author && item.author.nickname}}</text>
				</view>
				<view v-else class="author acea-row">
					<text class="author_time">
					{{item.time}}
					</text>
				</view>
				<view class="like">
					<button class="like_count" hover-class="none" @click.stop="likeToggle(item)">
						<text class="iconfont" :class="item.relevance_id ? 'icon-icon_Like_2' : 'icon-ic_Like'"></text>
						<text class="collect">{{item.count_start}}</text>
					</button>
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
import { mapGetters } from "vuex";
import { HTTP_REQUEST_URL } from '@/config/app';
export default {
	components:{},
	computed: {...mapGetters(['viewColor'])},
    props: {
			item: {
					type: Object,
					require: true
			},
			type: {
				type: Number,
				default: 0
			},
			isAuth: {
				type: Number || String,
				default: 0
			},
			uid: {
				type: Number || String,
				default: 0
			},
			tab: {
				type: Number,
				default: 1
			},
			isFind: {
				type: Boolean,
				default: false
			},
			isShow: {
				type: Boolean,
				default: false
			},
    },
	data() {
		return {
			domain: HTTP_REQUEST_URL,
		};
	},
	mounted(){

	},
	methods: {
		//替换安全域名
		setDomain: function(url) {
			url = url ? url.toString() : '';
			//本地调试打开,生产请注销
			if (url.indexOf("https://") > -1) return url;
			else return url.replace('http://', 'https://');
		},
		likeToggle(item){
			this.$emit('likeToggle',item)
		},
		goDetail(item){
			if(this.isFind){
				uni.navigateTo({
					url: '/pages/plantGrass/plant_featured/index?id='+item.topic_id
				});
			}else{
				this.plantDeail(item)
			}
		},
		plantDeail(item){
			if(item.is_type == 1){
				uni.navigateTo({
					url: '/pages/plantGrass/plant_detail/index?id='+item.community_id
				});
			}else{
				let user = this.isAuth ? 1 : 0;
				console.log(this.uid)
				uni.navigateTo({
					//#ifdef APP
					url: '/pages/short_video/appSwiper/index?id='+item.community_id+'&user='+user+'&uid='+this.uid+'&tab='+this.tab
					//#endif
					//#ifndef APP
					url: '/pages/short_video/nvueSwiper/index?id='+item.community_id+'&user='+user+'&uid='+this.uid+'&tab='+this.tab
					//#endif
				});
			}
		}
	}

}

</script>
<style lang="scss" scoped>
.wf-page2 .pictrue{
	width: 345rpx;
	border-radius: 24rpx 24rpx 0 0;
	position: relative;
	line-height: 1;
	overflow: hidden;
	max-height: 500rpx;
	/deep/image,/deep/.image{
		width: 100%;
		max-width: 345rpx;
		border-radius: 24rpx 24rpx 0 0;
	}
	.img-count{
		width: 60rpx;
		height: 36rpx;
		position: absolute;
		bottom: 16rpx;
		right: 16rpx;
		z-index: 10;
		background: rgba(102,102,102,0.5);
		border-radius: 4rpx;
		color: #fff;
		font-size: 22rpx;
	}
	.plant-show{
		width: 40rpx;
		height: 40rpx;
		border-radius: 100%;
		background: rgba(0,0,0,.5);
		display: flex;
		align-items: center;
		justify-content: center;
		position: absolute;
		top: 20rpx;
		right: 20rpx;
		.iconfont{
			font-size: 20rpx;
			color: #fff;
		}
	}
}

.wf-page2 .text{
	width: 345rpx;
	padding: 16rpx 0;
	border-top: none;
	border-radius: 0 0 24rpx 24rpx;
	&.text-show {
		padding: 22rpx;
	}
	.name{
		font-size: 26rpx;
	}
	.count{
		margin-top: 20rpx;
		justify-content: space-between;
		color: #999999;
		.author{
			align-items: center;
		}
		.author_time {
			font-size: 22rpx;
		}
		.author_name {
			margin-left: 10rpx;
			max-width: 120rpx;
			font-size: 22rpx;
			max-width: 170rpx;
		}
		.like{
			font-size: 24rpx;
			display: flex;
			.like_count{
				display: flex;
				align-items: center;
				color: #999;
			}
			.iconfont{
				font-size: 30rpx;
			}
			.iconfont.icon-icon_Like_2{
				color: var(--view-priceColor);
			}
			.collect{
				font-size: 24rpx;
				margin-left: 8rpx;
			}
		}
	}
}
.wf-page2 .author .image,.wf-page2 .author uni-image{
	width: 48rpx;
	height: 48rpx;
	border-radius: 100%;
}
.approval_status{
	width: 100%;
	height: 100%;
	background: rgba(0,0,0,.4);
	position: absolute;
	top: 0;
	left: 0;
	border-radius: 24rpx 24rpx 0 0;
	color: #fff;
	text-align: center;
	z-index: 50;
	.approval_title{
		font-size: 28rpx;
	}
	.approval_info{
		font-size: 24rpx;
		margin-top: 24rpx;
	}
}
</style>
