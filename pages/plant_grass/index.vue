<template>
	<diyDataProvider :diyId="diyId" v-if="diyId !== undefined">
		<template #config="{ tabbarConfig }">
			<view :style="viewColor">
				<!-- 自定义顶部背景颜色 -->
				<view class="page_con" @click.stop="showBubble=false">
					<view class="header-bg" :style="{'background-image': navShow ? 'none' : `url(${domain}/static/images/grass_header.png)`}">
						<view :style="{'height': sysHeight}"></view>
						<!-- #ifdef MP -->
						<view v-if="navShow" class="page-header">
							<view class="toggle_btn iconfont icon-ic_menu3" @click.stop="showBubble=!showBubble">
								<view class="toggle_count" v-if="showBubble">
									<view v-if="community_status == 1" @click="goPage('/pages/plantGrass/plant_release/index')" class="items">
										<text class="iconfont icon-ic_edit"></text>
										<text>发布作品</text>
									</view>
									<view v-if="community_status == 1" @click="goPage('/pages/plantGrass/plant_user/index?id='+userInfo.uid)" class="items">
										<text class="iconfont icon-a-ic_user1"></text>
										<text>我的主页</text>
									</view>
								</view>
							</view>
							<view class="sys-title">种草社区</view>
						</view>
						<!-- #endif -->
						<view class="grass_header">
							<view v-if="!navShow" class="header">
								<view class="navTab">
									<view class="toggle_btn iconfont icon-ic_menu3" @click.stop="showBubble=!showBubble">
										<view class="toggle_count" v-if="showBubble">
											<view v-if="community_status == 1" @click="goPage('/pages/plantGrass/plant_release/index')" class="items">
												<text class="iconfont icon-ic_edit"></text>
												<text>发布作品</text>
											</view>
											<view v-if="community_status == 1" @click="goPage('/pages/plantGrass/plant_user/index?id='+userInfo.uid)" class="items">
												<text class="iconfont icon-a-ic_user1"></text>
												<text>我的主页</text>
											</view>
										</view>
									</view>
									<view class="acea-row row-center-wrapper flex-center">
										<view :class="tabActive == 0 ? 'on' : ''" class="nav-item" @click="tabActive=0;">关注</view>
										<view :class="tabActive == 1 ? 'on' : ''" class="nav-item" @click="tabActive=1;">发现</view>
									</view>
								</view>
								<view class="search_count">
									<navigator url="/pages/plantGrass/plant_search/index" hover-class="none" class="search"><text class="iconfont icon-ic_search"></text>搜索想看的文章</navigator>
									<navigator class="search_topic" url="/pages/plantGrass/plant_topic/index">
										<image class="topic_icon" :src="`${domain}/static/images/topic_cate.png`"></image>
									</navigator>
								</view>
							</view>
							<view class="longTab" v-if="tabActive == 1">
								<scroll-view scroll-x="true" style="white-space: nowrap; display: flex;" scroll-with-animation class="menu" :scroll-left="tabLeft" show-scrollbar="true">
									<view class="longItem"
									:data-index="index"
									:class="index === tabClick ? 'click' : ''"
									v-for="(item, index) in menuList"
									:key="index"
									:id="'id' + index"
									@click.stop="selectMenu(item, index, true)">{{ item.cate_name }}</view>
								</scroll-view>
							</view>
						</view>
					</view>
					<scroll-view class="main" :class="{'scroll-main' : tabActive == 0}" scroll-y="true" @scroll="followScroll">
						<view class="tab-cont" id="main" @touchmove="onTouchmove" style="height: 100%;">
							<!-- 关注 -->
							<view v-if="tabActive === 0">
								<view v-if="isLogin && followList.length > 0" class="follow_count boder-24">
									<block v-for="(item, index) in followList" :key="index">
										<view class="list_count">
											<view class="title">
												<navigator hover-class="none" :url="'/pages/plantGrass/plant_user/index?id='+item.uid" v-if="item.author" class="author">
													<image class="picture" :src="item.author&&item.author.avatar || '/static/images/f.png'"></image>
													<text class="name">{{item.author.nickname || ''}}</text>
												</navigator>
												<view class="time">{{item.time}}</view>
											</view>
											<view class="product">
												<productConSwiper v-if="item.is_type == 1" :imgUrls="item.image"></productConSwiper>
												<view v-else class="videoSwiper" @click="goVideo(item)">
													<image class="image" :src="item.image[0]"></image>
													<view v-if="item.is_type == 2" class="video_img acea-row row-middle row-center">
														<text class="iconfont icon-ic_right2"></text>
													</view>
												</view>
											</view>
											<view class="pro_describle">
												<view class="mentioned" v-if="item.relevance && item.relevance.length > 0" @click="openMore(item)">
													<text class="title">查看TA提到的宝贝({{item.relevance.length}})</text>
													<view class="product_more">
														<view class="item">
															<image v-if="indexn<4" v-for="(itemn, indexn) in item.relevance" :key="indexn" :src="(itemn.spu && itemn.spu.image) || itemn.image" class="more_image"></image>
														</view>
														<text class="iconfont icon-ic_rightarrow"></text>
													</view>
												</view>
												<view v-if="!item.show && item.content.length > 110" class="product_info">
													<text class="text">
														{{item.content.substring(0,90)+'...'}}
													</text>
													<text @click.stop="showMore(item)" class="unfold_btn">展开</text>
												</view>
												<view v-else class="product_info">
													<text class="text">
														{{item.content}}
													</text>
												</view>
												<navigator v-if="item.topic" hover-class="none" class="product_cate" :url="'/pages/plantGrass/plant_search_list/index?id='+item.topic.topic_id">
													<view>
														<text class="icon">#</text><text class="text">{{item.topic.topic_name}}</text>
													</view>
												</navigator>
												<view class="foot_bar">
													<!-- #ifdef MP -->
													<button class="time iconfont icon-icon_transmit-2" open-type="share" hover-class='none' @click="shareFriend(item)"></button>
													<!-- #endif -->
													<!-- #ifndef MP -->
													<button></button>
													<!-- #endif -->
													<view class="item">
														<view class="item_count" @click.stop="likeToggle(item)">
															<text class="iconfont" :class="item.relevance_id ? 'icon-ic_love_2' : 'icon-ic_love'"></text>
															<text>{{item.count_start > 0 ? item.count_start : '点赞'}}</text>
														</view>
														<view v-if="community_reply_status == 1" class="item_count" @click.stop="openCommon(item,index)">
															<text class="iconfont icon-ic_daipingjia1"></text>
															<text>{{item.count_reply > 0 ? item.count_reply : '评论'}}</text>
														</view>
													</view>
												</view>
											</view>
										</view>
									</block>
									<!-- 底部占位组件 -->
									<pageFooterPlaceholder :tabbarConfig="tabbarConfig" v-if="tabbarConfig" />
								</view>
								<view v-if="followList.length == 0 && !focusLoading && isLogin" class="empty">
									<image :src="`${domain}/static/images/no_thing.png`"></image>
									<text class="text">暂无内容~</text>
								</view>
								<view v-if="!isLogin" class="empty no_login">
									<image :src="`${domain}/static/images/noActivity.png`"></image>
									<view class="title">ຍັງບໍ່ໄດ້ເຂົ້າສູ່ລະບົບ</view>
									<view class="text">ເຂົ້າສູ່ລະບົບແລ້ວສາມາດເບິ່ງການເຜີຍແຜ່ຂອງຜູ້ໃຊ້ທີ່ຕິດຕາມແລ້ວ~</view>
									<button class="login_btn" @click="authOpen">ເຂົ້າສູ່ລະບົບດຽວນີ້</button>
								</view>
							</view>
							<!-- 发现 -->
							<view v-show="tabActive === 1" style="height: 100%;">
								<!-- 商品 -->
								<swiper :interval="interval" indicator-color="rgba(255,255,255,0.6)" :current="swiperCurrent" @change="swiperChange" style="height: 100%;">
									<block v-for="(item,index) in menuList" :key="index">
										<swiper-item :item-id="`${item.category_id}`">
											<scroll-view @scroll="scrollLeft" scroll-y="true" style="height: 100%;" id="goods"
												refresher-enabled="true" :refresher-threshold="100"
												:refresher-triggered="triggeredDiscover"
												@refresherrefresh="onRefreshDiscover" @refresherpulling="onPulling"
												@refresherrestore="onRestore" @refresherabort="onAbort">
												<view v-if="cateGoods[item.category_id] && cateGoods[item.category_id].goods.length" class="goods-wrap" id="goods">
													<view class="goods">
														<WaterfallsFlow :isShow="false" :wfList='cateGoods[item.category_id].goods' :isFind="true" @likeToggle="likeToggle"/>
													</view>
												</view>
												<!-- 底部占位组件 -->
												<pageFooterPlaceholder :tabbarConfig="tabbarConfig" v-if="tabbarConfig" />
												<view :hidden="cateGoods[item.category_id] && !cateGoods[item.category_id].goodsLoading" class="acea-row row-center-wrapper loadingicon">
													<text class="iconfont icon-jiazai loading"></text>{{!cateGoods[item.category_id] ? 0 : cateGoods[item.category_id].goodsLoading}}
												</view>
												<view v-if="cateGoods[item.category_id] && cateGoods[item.category_id].goods.length == 0 && !cateGoods[item.category_id].goodsLoading" class="empty">
													<image :src="`${domain}/static/images/no_thing.png`"></image>
													<text class="text">{{item.category_id == -1 ? '暂无视频' : '暂无文章'}}~</text>
												</view>

											</scroll-view>
										</swiper-item>
									</block>
								</swiper>
							</view>
						</view>
					</scroll-view>
				</view>
				<!-- 他提到的宝贝弹窗 -->
				<mentioned ref="mentioned" :isHome="true" @close="closePopup" :list="moreList" :uid="authorUid"></mentioned>
				<!--自定义底部tab栏-->
						<!-- 评论弹窗 -->
				<comment ref="comment" :isShow="showComment" :userInfo="userInfo" :bottom="bottom" @successFul="commentSucces" @close="close"></comment>
				<template v-if="tabbarConfig">
					<pageFootWrapper :tabbarConfig="tabbarConfig" />
					<tabbarCheck ref="tabbarCheck" :tabbarConfig="tabbarConfig" />
				</template>
			</view>
		</template>
	</diyDataProvider>
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
	const systemInfo = uni.getSystemInfoSync();
	let sysHeight = systemInfo.statusBarHeight + 'px';
	import WaterfallsFlow from '@/components/plantWaterfallsFlow/WaterfallsFlow.vue'
	import mentioned from '@/components/mentioned.vue';
	import comment from './components/comment.vue';
	import { graphicLstApi, getTopicList, graphicStartApi, focusArticleLst } from '@/api/community.js';
	import { getUserInfo } from '@/api/user.js';
	import { mapGetters } from "vuex";
	import productConSwiper from '@/components/plantConSwiper';
	import { HTTP_REQUEST_URL } from '@/config/app';
	import { toLogin } from '@/libs/login.js';
	import { configMap } from '@/utils';
	import pageFootWrapper from "@/sub-packages/diy/diyPage/common/pageFootWrapper.vue";
	import pageFooterPlaceholder from "@/components/diyPage/pageFooterPlaceholder.vue";
	import diyDataProvider from '@/components/diyPage/common/diyDataProvider.vue';
	import tabbarCheck from '@/components/diyPage/common/tabbarCheck.vue';

	const app = getApp();
	export default {
		components: {
			WaterfallsFlow,
			productConSwiper,
			mentioned,
			comment,

			pageFooterPlaceholder,
			diyDataProvider,
			tabbarCheck,
			pageFootWrapper
		},
		// #ifdef MP
		componentPlaceholder: {
			"page-foot-wrapper": "view"
		},
		// #endif
		data() {
			return {
				diyId: undefined,
				sysHeight: sysHeight,
				domain: HTTP_REQUEST_URL,
				tabClick: 0,
				tabLeft: 0,
				isLeft: 0, //导航栏下划线位置
				isWidth: 0, //每个导航栏占位
				windowHeight: 0,
				swiperHeight: 0,
				childIndex: 0,
				showComment: false,
				triggered: false,
				triggeredDiscover: false,
				userInfo: {},
				goods: [], // 商铺商品
				followList: [], //关注列表
				menuList: [],
				moreList: [],
				commList: [], //评论列表
				goodsList: [],
				navShow: false,
				navActive: 0,
				tabActive: 1, // 底部切换
				keyword: '',
				sortPrice: true, // 价格排序
				focusLoading: false,
				goodsLoading: false,
				goodsLoaded: false,
				focusLoaded: false,
				loadTitle: '加载更多',
				where: {
					category_id: 0,
					page: 1,
					limit: 30
				},
				focusWhere: {
					page: 1,
					limit: 30
				},
				storeScroll: true,
				_freshing: false,
				storeTop: 0,
				storeHeight: 0,
				navHeight: 0,
				avatar: '',
				hederBg: '../static/images/plant_header.png',
				top: 300,
				shareInfo: {},
				actionSheetHidden: true,
				authorUid: 0,
				swiperCur: 0,
				circular: true,
				isScroll: false,
				interval: 3000,
				currentItemId: 0,
				swiperCurrent: 0,
				scrollTop: 0,
				cateGoods:{},
				showBubble: false,
				//#ifdef MP||APP-PLUS
				bottom: 0,
				//#endif
				//#ifndef MP||APP-PLUS
				bottom: 90,
				//#endif
			}
		},
		// 滚动监听
		onPageScroll({scrollTop}) {
			uni.$emit('scroll');
		},
		created() {
			var that = this;
			// 获取设备宽度
			uni.getSystemInfo({
				success(e) {
					that.isWidth = e.windowWidth / 6;
					that.windowHeight = e.windowHeight;
					// that.swiperHeight = that.windowHeight - 205
					that.$set(that, 'swiperHeight', that.windowHeight-205);
				}
			});
		},
		computed: {
			...mapGetters(['isLogin', 'uid', 'viewColor','cartNum']),
			...configMap({community_reply_status: 0,community_status:0,community_app_switch: [],navigation: {}})
		},
		watch: {},
		onLoad(options) {
			this.diyId = this.$util.getDiyId(options);
			let that = this;
			uni.$on('startLike',function(data){
				for(var i = 0; i < that.cateGoods[that.currentItemId]['goods'].length; i++){
					let item = that.cateGoods[that.currentItemId]['goods'][i]
					if(data.community_id == item['community_id']){
						item['count_start'] = data.relevance_id ? item['count_start']+1 : item['count_start']-1
						item['relevance_id'] =  data.relevance_id ? true : false
					}
				}
			})
		},
		onShow() {
			this.$refs.tabbarCheck && this.$refs.tabbarCheck.check();
			app.getConfigData();
			this.getCateList();
			this.getGoods();
			let that = this
			this.showBubble = false;
			this.$util.getCartNum(this.isLogin,null)
			if (that.isLogin) {
				that.focusLoading = false;
				that.focusLoaded = false;
				that.focusWhere.page = 1;
				that.followList = [];
				this.getUserInfo();
				this.getFocusArtical();
			} else {
				this.userInfo = {}
			}
		},
		mounted: function() {
			const query = uni.createSelectorQuery().in(this);
			query.select('#main').boundingClientRect(data => {
				this.storeHeight = data.height;
				this.storeTop = data.top;
			}).exec();
		},
		/**
		 * 用户点击右上角分享
		 */
		// #ifdef MP
		onShareAppMessage: function() {
			let that = this;
			that.$set(that, 'actionSheetHidden', !that.actionSheetHidden);
			return {
				title: that.shareInfo.title || '',
				imageUrl: that.shareInfo.image[0] || '',
				path: '/pages/plantGrass/plant_detail/index?id=' + that.shareInfo.community_id + '&spid=' + that.uid,
			}
		},
		onShareTimeline: function() {
			let that = this;
			that.$set(that, 'actionSheetHidden', !that.actionSheetHidden);
			return {
				title: that.shareInfo.title || '',
				query: {
					id: that.shareInfo.community_id,
					spid: that.uid
				},
				imageUrl: that.shareInfo.image[0] || ''
			}
		},
		// #endif
		methods: {
			goPage(url){
				if(this.isLogin){
					uni.navigateTo({
						url: url
					});
				}else{
					toLogin()
				}
			},
			followScroll(e){
				uni.$emit('scroll');
			},
			//分享信息
			shareFriend(item){
				this.shareInfo = item
			},
			// 打开授权
			authOpen: function() {
				toLogin()
			},
			/**
			 * 获取个人用户信息
			 */
			getUserInfo: function() {
				let that = this;
				getUserInfo().then(res => {
					that.userInfo = res.data
				});
			},
			/*获取分类列表*/
			getCateList(){
				getTopicList().then(res => {
					let data = [{cate_name: "推荐",category_id: 0,children: []}]
					if(this.community_app_switch.length == 2 || this.community_app_switch[0]==2){
						data = [{cate_name: "推荐",category_id: 0,children: []},{cate_name: "视频",category_id: -1,children: []}]
					}
					this.menuList = Array.from(new Set([...data,...res.data]));
				})
			},
			swiperChange(e) {
				let { current, source, currentItemId } = e.detail;
				if (source === 'autoplay' || source === 'touch') {
					this.currentItemId = currentItemId;
					this.swiperCur = current
					this.selectMenu(this.menuList[this.swiperCur],this.swiperCur,false)
					if (this.menuList.length > 6) {
						var tempIndex = this.swiperCur - 2;
						tempIndex = tempIndex <= 0 ? 0 : tempIndex;
						let tabLeft = (this.swiperCur - 2) * this.isWidth; //设置下划线位置
						this.$nextTick(function() {
							this.$set(this, 'tabLeft', tabLeft);
						});
					}
				}
			},
			// 点击列表头部
			selectMenu(item, index, isScroll) {
				this.currentItemId = item.category_id;
				this.swiperCurrent = index;
				this.swiperCur = index
				this.isScroll = isScroll;
				this.tabClick = index; //设置导航点击了哪一个
				this.isLeft = index * this.isWidth; //设置下划线位置
				this.setMenuLeft(index);
			},
			/*导航栏移动位置*/
			setMenuLeft(index) {
				this.getGoods();
			},
			showMore(item){
				this.$set(item,'show', true);
			},
			scrollLeft: function(e){

				uni.$emit('scroll');
				this.scrollTop = e.detail.scrollTop
				// this.navShow = e.detail.scrollTop >= this.storeHeight - 200;
				if(this.navShow){
					this.$set(this, 'swiperHeight', this.windowHeight-50);
					this.showBubble = false
				}
				if(e.detail.scrollTop > e.detail.scrollHeight - 1500){
					this.getGoods();
				}
				setTimeout(()=>{
					this.showBubble = false
				},300)
			},
			// 获取发现商品
			getGoods: function() {
				let that = this;
				if(!that.cateGoods[that.currentItemId]) {
					that.$set(that.cateGoods, that.currentItemId, {
						where: {...that.where, category_id: that.currentItemId},
						goods: [],
						goodsLoading: false,
                    	goodsLoaded: false
					})
				}
				const data = that.cateGoods[that.currentItemId];
				const cateId = that.currentItemId;
				if (data.goodsLoading || data.goodsLoaded) return;
				data.goodsLoading = true;
				data.loadTitle = "";
				graphicLstApi(data.where).then(res => {
					data.goodsLoading = false;
					data.goodsLoaded = res.data.list.length < that.where.limit;
					if(data.where.page == 1 ){
						data.goods = [];
					}
					data.goods.push.apply(data.goods, res.data.list);
					data.where.page = data.where.page + 1;
					that.$set(that.cateGoods,cateId, {...data});
					that.triggeredDiscover = false;
					that.$forceUpdate()
				}).catch(err => {
					data.goodsLoading = false;
					that.$set(that.cateGoods,cateId, data);
					that.$util.Tips({
						title: err
					}, {
						tab: 1,
						url: '/pages/index/index'
					});
				});
			},
			/*获取关注的人的文章列表*/
			getFocusArtical(){
				let that = this;
				if (that.focusLoading || that.focusLoaded) return;
				that.focusLoading = true;
				that.loadTitle = "";
				focusArticleLst(that.focusWhere).then(res => {
					that.focusLoading = false;
					that.focusLoaded = res.data.list.length < that.focusWhere.limit;
					res.data.list.forEach((item)=>{
						item.show = false
					})
					that.followList.push.apply(that.followList, res.data.list);
					that.focusWhere.page = that.focusWhere.page + 1;
				}).catch(err => {
					that.focusLoading = false;
					return that.$util.Tips({
						title: err
					}, {
						tab: 1,
						url: '/pages/index/index'
					});
				});
			},
			onPulling(e) {
				if (e.detail.deltaY < 0) return // 防止上滑页面也触发下拉
				if (this.tabActive == 1) {
					this.triggeredDiscover = true;
				} else {
					this.triggered = true;
				}
			},
			onRefreshDiscover() {
				if (this._freshing) return;
				this._freshing = true;
				setTimeout(() => {
					this._freshing = false;
					this.cateGoods = {}
					this.getGoods();
					this.triggeredDiscover = false;
					this.scrollTop = 0;
					uni.stopPullDownRefresh();
				}, 1000)
			},
			onRefresh() {
				if (this._freshing) return;
				this._freshing = true;
				setTimeout(() => {
					this.loadendfollow = false;
					this.loadend = false;
					this.followList = [];
					this.focusWhere.page = 1;
					this.params.page = 1;
					this.getFocusArtical();
					setTimeout(() => {
						if(this.followList.length === 0 || this.focusLoaded) this.getGoods();
					}, 400)
					this.triggered = false
					uni.stopPullDownRefresh();
					this._freshing = false;
				}, 1000)
			},
			onRestore() {
				this.triggeredDiscover = false;
			},
			onAbort() {
				console.log("onAbort");
			},
			likeToggle(item){
				let status = item.relevance_id ? 0 : 1
				graphicStartApi(item.community_id,{status: status}).then(res => {
					if(item.relevance_id){
						item.count_start--;
						item.count_start = item.count_start == 0 ? 0 : item.count_start
						item.relevance_id = false
					}else{
						item.count_start++;
						item.relevance_id = true
					}
				});
			},
			/*查看提到的宝贝*/
			openMore(item){
				this.$refs.mentioned.showPopup()
				this.moreList = item.relevance;
				this.authorUid = item.uid
			},
			openCommon(item,index){
				this.showComment = true
				this.$refs.comment.getData(item,index);
			},
			commentSucces(index){
				this.followList[index]['count_reply']++
			},
			closePopup(){
				this.$refs.mentioned.closePopup()
			},
			close(){
				this.showComment = false;
			},
			onTouchmove(e){
				const query = uni.createSelectorQuery().in(this);
				query.select('#goods').boundingClientRect(data => {
					if(data.bottom < 1500) {
						if(this.tabActive == 1){
							this.getGoods();
						}else{
							this.getFocusArtical();
						}
					}
				}).exec();
				// 模拟触底刷新
			},
			goVideo(item) {
				uni.navigateTo({
					//#ifdef APP
					url: '/pages/short_video/appSwiper/index?id='+item.community_id
					//#endif
					//#ifndef APP
					url: '/pages/short_video/nvueSwiper/index?id='+item.community_id
					//#endif
				});
			},
		},
		onReachBottom() {

			if(this.tabActive == 1){
				this.getGoods();
			}else{
				this.getFocusArtical();
			}
		},
		beforeDestroy() {
			uni.$off('startLike');
		}
	}
</script>

<style lang="scss" scoped>
.page_con{
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	display: flex;
	flex-direction: column;
}
.longTab {
	display: flex;
	width: 100%;
	background: #fff;
	border-radius: 24rpx 24rpx 0 0;
	padding: 20rpx;
	.longItem {
		height: 50upx;
		display: inline-block;
		line-height: 50upx;
		text-align: center;
		font-size: 30rpx;
		color: #999999;
		max-width: 160rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		overflow-x: scroll;
		overflow-y: hidden;
		margin-right: 56rpx;
		&:last-child{
			margin-right: 0;
		}
		/*解决ios上滑动不流畅*/
		-webkit-overflow-scrolling: touch;
		position: relative;
		&.click {
			font-weight: bold;
			font-size: 34rpx;
			color: var(--view-theme);
			&::after{
				content: "";
				display: block;
				width: 60rpx;
				height: 4rpx;
				background-color: var(--view-theme);
				display: flex;
				position: absolute;
				left: 50%;
				margin-left: -32rpx;
				bottom: 0rpx;
			}
			.underline {
				opacity: 1;
			}
		}
	}
}

.follow_count{
	background: #ffffff;
	padding: 20rpx 20rpx 100rpx;
	.title{
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.author{
		display: flex;
		align-items: center;
		.picture{
			width: 78rpx;
			height: 78rpx;
			border-radius: 100%;
			overflow: hidden;
		}
		.name{
			margin-left: 20rpx;
			color: #333333;
			font-size: 32rpx;
			font-weight: bold;
		}
	}
	.time{
		color: #999999;
		font-size: 24rpx;
	}
	.product{
		margin-top: 20rpx;
		border-radius: 16rpx;
	}
	.icon-icon_transmit-2{
		color: #282828;
		font-size: 46rpx;
		background: transparent;
	}
}
.list_count{
	margin-bottom: 70rpx;
	&:last-child{
		margin-bottom: 0;
	}
}
.videoSwiper{
	width: 710rpx;
	height: 710rpx;
	position: relative;
	border-radius: 16rpx;
	.image{
		width: 710rpx;
		height: 710rpx;
		border-radius: 16rpx;
	}
	.video_img{
		width: 100rpx;
		height: 100rpx;
		position: absolute;
		top: 50%;
		left: 50%;
		margin-left: -50rpx;
		margin-top: -50rpx;
		z-index: 10;
		background: rgba(40, 40, 40, .5);
		display: flex;
		border-radius: 100%;
		.iconfont{
			color: #ffffff;
			font-size: 54rpx;
		}
	}
}
.pro_describle{
	.mentioned{
		padding: 20rpx 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1px solid #F5F5F5;
		.title{
			color: #666666;
			font-size: 26rpx;
		}
	}
	.product_more{
		max-width: 360rpx;
		display: flex;
		align-items: center;
		.more_image{
			width: 58rpx;
			height: 58rpx;
			border-radius: 5rpx;
			margin-right: 12rpx;
			display: inline-block;
			border: 1px solid #BBBBBB;
		}

		.iconfont{
			color: #999999;
			margin-left: 10rpx;
		}
	}
	.product_info{
		line-height: 45rpx;
		margin: 20rpx 0;
		.text{
			font-size: 28rpx;
			color: #282828;
		}
		.unfold_btn{
			margin-left: 30rpx;
			font-size: 30rpx;
			color: #282828;
			font-weight: bold;
		}
	}
	.product_cate{
		margin: 20rpx 0;
		display: inline-block;
		>view{
			display: flex;
			align-items: center;
			background: var(--view-minorColor);
			border-radius: 30rpx;
			padding: 0 25rpx;
			line-height: 56rpx;
			height: 56rpx;
			color: var(--view-theme);
			.text{
				font-size: 28rpx;
			}
			.icon{
				font-size: 35rpx;
				font-weight: bold;
				margin-right: 10rpx;
			}
		}
	}
	.foot_bar{
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 20rpx;
		.item{
			display: flex;
			align-items: center;
			color: #282828;
			&.icon-icon_transmit-2{
				font-size: 46rpx;
			}
		}
		.item_count{
			font-size: 26rpx;
			display: flex;
			align-items: center;
			&:first-child{
				margin-right: 30rpx;
			}
			.iconfont{
				font-size: 42rpx;
				margin-right: 5rpx;
				&.icon-ic_daipingjia1{
					font-size: 36rpx;
				}
			}
			.icon-ic_love_2{
				color: var(--view-priceColor);
			}
		}
	}
}
.grass_header {
	display: flex;
	flex-direction: column;
	background-size: cover;
	width: 100%;
	z-index: 10;
}
.header-bg {
	background-color: #fff;
	background-size: cover;
	.page-header {
		position: relative;
		.toggle_btn {
			position: absolute;
			top: 50%;
			margin-top: -18rpx;
			left: 30rpx;
		}
	}
	.sys-title {
		height: 43px;
		text-align: center;
		line-height: 43px;
		font-size: 32rpx;
		color: #666666;
	}
}
.toggle_btn {
	font-size: 40rpx;
	color: #333;
	position: absolute;
	.toggle_count{
		width: 200rpx;
		background: #ffffff;
		box-shadow: 0 2rpx 15rpx rgba(0, 0, 0, 0.1);
		padding: 0 22rpx;
		position: absolute;
		top: 70rpx;
		left: -20rpx;
		z-index: 90;
		border-radius: 16rpx;
		&::before{
			content: "";
			display: inline-block;
			width: 26rpx;
			height: 26rpx;
			background: #ffffff;
			transform: rotate(140deg);
			position: absolute;
			top: -12rpx;
			left: 30rpx;
			box-shadow: -1rpx -1rpx 1rpx rgba(0, 0, 0, 0.05);
		}
		.items{
			border-bottom: 1px solid #EEEEEE;
			color: #282828;
			font-size: 26rpx;
			padding: 30rpx 0;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: row;
			&:last-child{
				border-bottom: none;
			}
			.iconfont{
				margin-right: 16rpx;
			}
		}
	}
}
.header {
	padding: 0 30rpx 20rpx;
	.navTab{
		position: relative;
		padding: 28rpx 0 20rpx;
		display: flex;
		align-items: center;
		.flex-center {
			flex: 1;
		}
		.nav-item{
			font-size: 32rpx;
			color: #666666;
			&:first-child{
				margin-right: 70rpx;
			}
			&.on{
				font-size: 38rpx;
				color: #282828;
				font-weight: bold;
			}
		}
		.release_btn{
			color: #333;
			.iconfont{
				font-size: 32rpx;
			}
		}
		.flex-right {
			width: 58rpx;
			height: 58rpx;
			.avatar{
				width: 58rpx;
				height: 58rpx;
				border-radius: 100%;
				border: 3rpx solid rgba(0,0,0,.05);
			}
		}
	}
	.search_count{
		display: flex;
		align-items: center;
		justify-content: space-between;
		.search_topic{
			width: 46rpx;
			height: 46rpx;
			image,.topic_icon,uni-image{
				width: 46rpx;
				height: 46rpx;
			}
		}
	}
	.search {
		display: flex;
		align-items: center;
		min-width: 0;
		height: 64rpx;
		border-radius: 36rpx;
		background-color: #FFFFFF;
		font-size: 26rpx;
		color: #999999;
		width: 609rpx;
		.iconfont {
			margin-right: 13rpx;
			margin-left: 30rpx;
			font-size: 30rpx;
		}
	}
}
.main {
	flex: 1;
	height: auto;
	background: #fff;
	border-radius: 24rpx 23rpx 0 0;
	&.scroll-main{
		min-height: 60vh;
	}
}
.nav.fixed {
	position: fixed;
	left: 0;
	width: 100%;
	.nav-cont {
		position: absolute;
		width: 100%;
	}
}
.goods {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	padding: 0 20rpx;
	background: #ffffff;
	width: 750rpx;
	&.cusHeight {
		/*#ifdef MP*/
		padding-bottom: 340rpx;
		/*#endif*/
		/*#ifndef MP*/
		padding-bottom: 280rpx;
		/*#endif*/
	}
}
.empty{
	width: 100%;
	text-align: center;
	position:relative;
	top: 200rpx;
	text-align: center;
	image,uni-image{
		display: inline-block;
		width: 414rpx;
		height: 305rpx;
	}
	.title{
		font-size: 28rpx;
		font-weight: bold;
	}
	.text{
		margin-top: 26rpx;
		color: #999999;
		font-size: 24rpx;
		display: block;
	}
	.login_btn{
		width: 336rpx;
		text-align: center;
		height: 80rpx;
		line-height: 80rpx;
		color: var(--view-theme);
		border: 1px solid var(--view-theme);
		border-radius: 100rpx;
		margin: 40rpx auto 0;
		font-size: 26rpx;
	}
}
</style>
