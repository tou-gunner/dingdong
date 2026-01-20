<template>
	<view :style="viewColor">
		<view class="main">
			<view class='search acea-row row-between-wrapper'>
				<view class='input acea-row row-between-wrapper'>
					<text class='iconfont icon-ic_search'></text>
					<input type='text' v-model="where.keyword" :focus="focus" placeholder='ກະລຸນາປ້ອນຄຳຄົ້ນຫາ' placeholder-class='placeholder' @input="setValue" confirm-type="search" @confirm="searchBut()"></input>
					<i v-if="where.keyword" class="iconfont icon-ic_close2 icon-zhanwei" @click="where.keyword = ''"></i>
					<i v-else class="iconfont icon-zhanwei"></i>
				</view>
				<view class='bnt' @tap='searchBut'>ຄົ້ນຫາ</view>
			</view>
			<view class="search-tabs acea-row">
				<view v-for="(item,index) in tabList" :key="index" @click="getList(item,index)" class="item" :class="{on : activeIndex == index}">{{item.title}}</view>
			</view>
			<view v-if="activeIndex == 2" class="tab-cont">
				<view class="author-wrap">
					<view class="user_plant_item" v-for="(item,index) in goods" :key="index" @click="goAuthor(item)">
						<image :src="(item.author&&item.author.avatar) || '/static/images/f.png'" mode=""></image>
						<view v-if="item.author" class="info">
							<view class="line1">
								<text class="name line1">{{item.author.nickname}}</text>
							</view>
							<view class="acea-row plant-des">
								<view class="des">
									ເນື້ອຫາ<text>{{(item.author.count_content<10000&&item.author.count_content>0) ? item.author.count_content : item.author.count_content>1000 ? (item.author.count_content/10000).toFixed(2)+'ໝື່ນ' : 0}}</text>
								</view>
								<view class="des">
									ຜູ້ຕິດຕາມ<text>{{(item.author.count_fans<10000&&item.author.count_fans>0) ? item.author.count_fans : item.author.count_fans>1000 ? (item.author.count_fans/10000).toFixed(2)+'ໝື່ນ' : 0}}</text>
								</view>
							</view>
							<view class="btn" :class="!item.is_fans ? 'focusBtn' : ''" @click.stop="focusToggle(item)">
								<text v-if="!item.is_fans" class="iconfont icon-ic_increase"></text>
								{{item.is_fans ? 'ຕິດຕາມແລ້ວ' : 'ຕິດຕາມ'}}
							</view>
						</view>
					</view>
				</view>
				<view :hidden="!loading" class="acea-row row-center-wrapper loadingicon">
					<text class="iconfont icon-jiazai loading"></text>
				</view>
				<emptyPage v-if="authorList.length == 0 && !loading" title="ບໍ່ມີຜູ້ໃຊ້~"></emptyPage>
			</view>
			<view v-else class="tab-cont">
				<view v-if="goods.length" class="goods-wrap">
					<view class="goods">
						<WaterfallsFlow :wfList='goods' :isFind="false" :isAuth="0"/>
					</view>
				</view>
			</view>
			<view :hidden="!loading" class="acea-row row-center-wrapper loadingicon">
				<text class="iconfont icon-jiazai loading"></text>
			</view>
			<emptyPage v-if="goods.length == 0 && !loading" title="ບໍ່ມີເນື້ອຫາ~"></emptyPage>
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
	import WaterfallsFlow from '@/components/plantWaterfallsFlow/WaterfallsFlow.vue'
	import { graphicLstApi, followAuthorApi } from '@/api/community.js';
	import { toLogin } from '@/libs/login.js';
	import { mapGetters } from "vuex";
	import { configMap } from '@/utils';
	import emptyPage from '@/components/emptyPage.vue'
	const app = getApp();
	export default {
		components: {
			emptyPage,
			WaterfallsFlow,
		},
		data() {
			return {
				focus: false,
				goods: [],
				authorList: [
					{avatar: "",nickname: '爱吃酥脆紫菜的小西', count: 35, count_fans: 0, is_fans: 1},
					{avatar: "https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKZw2XnQEyK8f1BIcNGVegibE9tPZBtjyu0AgyaPDEEwmyZnWydhXwXUnbrtGnXmam6WTzichTBcLgQ/132",nickname: '猪猪甜甜圈', count: 35, count_fans: 951, is_fans: 0},
					{avatar: "",nickname: '爱吃酥脆紫菜的小西', count: 35, count_fans: 951, is_fans: 1},
				],
				keyword: '',
				loaded: false,
				loading: false,
				loadTitle: 'ໂຫຼດເພີ່ມ',
				where: {
					keyword: "",
					search_type: "all",
					page: 1,
					limit: 30,
					topic_id: ''
				},
				searchValue: "",
				activeIndex: 0,
				tabList:[
					{title: "ທັງໝົດ", value: 0, type: "all"},
					{title: "ເນື້ອຫາ", value: 1, type: "content"},
					{title: "ຜູ້ໃຊ້", value: 2, type: "user"},
				]
			}
		},
		created() {},
		computed: {
			...mapGetters(['isLogin', 'uid', 'viewColor']),
			...configMap({community_status: 0})
		},
		watch: {},
		onLoad: function(options) {
			this.where.keyword = this.searchValue =  options.searchValue ? options.searchValue : ''
			this.where.topic_id = options.id ? options.id : ''
			this.getGoods();
		},
		onShow() {},
		mounted: function() {},
		methods: {
			setValue: function(event) {
				this.$set(this.where, 'keyword', event.detail.value);
			},
			searchBut(){
				this.loadend = this.loading = false
				this.where.page = 1
				this.goods = []
				this.getGoods()
			},
			goAuthor(item){
				if(this.isLogin && this.community_status==1){
					uni.navigateTo({
						url: '/pages/plantGrass/plant_user/index?id='+item.uid
					})
				}else{
					toLogin()
				}

			},
			// 获取列表数据
			getList(item,index){
				this.activeIndex = index;
				this.where={
					keyword: this.where.keyword,
					search_type: item.type,
					page: 1,
					limit: 30,
					topic_id: this.where.topic_id || ''
				}
				this.goods = []
				this.loadend = false
				this.loading = false
				this.getGoods()
			},
			// 获取社区内容列表
			getGoods: function() {
				let that = this;
				if (that.loadend) return;
				if (that.loading) return;
				that.loading = true;
				that.loadTitle = '';
				graphicLstApi(that.where).then(res => {
					that.loading = false;
					let list = res.data.list;
					let goodsList = that.$util.SplitArray(list, that.goods);
					let loadend = list.length < that.where.limit;
					that.loadend = loadend;
					that.loading = false;
					that.loadTitle = loadend ? 'ໂຫຼດໝົດແລ້ວ' : 'ໂຫຼດເພີ່ມ';
					that.$set(that, 'goods', goodsList);
					that.$set(that.where, 'page', that.where.page + 1);
				}).catch(err => {
					that.loading = false;
					that.goodsLoading = false;
					uni.showToast({
						title: err,
						icon: 'none'
					})
				});
			},
			/*关注*/
			focusToggle(item){
				let status = item.is_fans ? 0 : 1
				followAuthorApi(item.author.uid,{status: status}).then(res => {
					if (res.status === 200) {
						item.is_fans = item.is_fans ? false : true
					}
					this.$util.Tips({
						title: res.message
					});
				}).catch(err => {
					this.$util.Tips({
						title: err
					});
				});
			},
		},
		onReachBottom() {
			this.getGoods();
		},
		// 滚动监听
		onPageScroll(e) {}
	}
</script>

<style lang="scss" scoped>
	@import '../style/main.scss';
	.main .search {
		padding: 20rpx 0 0 10rpx;
	}
	.main .search .input {
		width: 580rpx;
		background-color: #f7f7f7;
		border-radius: 34rpx;
		padding: 0 20rpx 0 30rpx;
		box-sizing: border-box;
		height: 66rpx;
		position: relative;
	}
	.main .search .input input {
		width: 440rpx;
		font-size: 28rpx;
	}
	.main .search .input .placeholder {
		color: #bbb;
	}
	.main .search .input .iconfont {
		color: #999999;
		font-size: 35rpx;
	}
	.main .search .input .icon-ic_close2 {
		font-size: 32rpx;
		color: #cccccc;

	}
	.main .search .bnt {
		width: 120rpx;
		text-align: center;
		height: 66rpx;
		line-height: 66rpx;
		font-size: 28rpx;
		color: #282828;
	}
	.search-tabs{
		align-items: center;
		padding: 40rpx 30rpx 30rpx;
		.item{
			color: #999999;
			font-size: 30rpx;
			position: relative;
			+.item{
				margin-left: 55rpx;
			}
			&.on{
				color: var(--view-theme);
				font-size: 34rpx;
				font-weight: bold;
				&::after{
					content: "";
					display: block;
					width: 40rpx;
					height: 5rpx;
					background: var(--view-theme);
					position: absolute;
					left: 50%;
					margin-left: -20rpx;
					bottom: -18rpx;
				}
			}
		}
	}
	.author-wrap{
		.focusBtn{
			color: var(--view-theme)!important;
			border-color: var(--view-theme)!important;

		}
	}
	.main {
		background: #ffffff;
		padding: 0 20rpx;
		min-height: 100vh;
		.goods-wrap{
			margin-top: 20rpx;
		}
	}
	.goods {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	}
	.empty-box{
		padding-top: 200rpx;
	}
</style>
