<template>
	<view :style="viewColor">
		<view class='productList'>
			<view class='search acea-row row-between-wrapper'>
				<!--#ifdef H5-->
				<view v-if='!$wechat.isWeixin()' class="back" @click='set_where(1)'>
					<view class="iconfont icon-ic_leftarrow"></view>
				</view>
				<!--#endif-->
				<view class='input acea-row row-between-wrapper'><text class='iconfont icon-ic_search'></text>
					<input placeholder='ປ້ອນຊື່ສິນຄ້າ/ຮ້ານເພື່ອຄົ້ນຫາ' placeholder-class='placeholder' confirm-type='search' name="search" :value='where.keyword'
					 @confirm="searchSubmit" @input="inputChange"></input>
				</view>
				<view style="text-align: right;" v-if="tabIndex==1" class='iconfont' :class='is_switch==true?"icon-a-ic_Imageandtextsorting":"icon-a-ic_Picturearrangement"'
				 @click='Changswitch'></view>
				<view v-else-if="mer_location == 1" style="text-align: right;" class='iconfont icon-ic_location51' @click="showMaoLocation(latitude,longitude)"></view>
			</view>
			<view class="nav-wrapper">
				<view v-if="hide_mer_status == 0" class="tab-bar">
					<view class="tab-item" :class="{on:tabIndex==1}" @click="tabIndex = 1">ສິນຄ້າ</view>
					<view class="tab-item" :class="{on:tabIndex==2}" @click="tabIndex = 2">ຮ້ານຄ້າ</view>
				</view>
				<block v-if="tabIndex==1">
					<view class='nav acea-row row-middle'>
						<view class='item' @click="downStatus = !downStatus" :class="{'t-color':downKey>0 && firstKey == 0}">
							{{downMenu[downKey].title}}
							<text v-if="!downStatus" class="iconfont icon-ic_downarrow"></text>
							<text v-else class="iconfont icon-ic_uparrow"></text>
						</view>
						<view class='item' :class="{'t-color': where.order=='sales'}" @click='set_where(3)'>
							ຍອດຂາຍ
						</view>
						<view class='item' :class="{'t-color': where.order=='price_desc'}" @click='set_where(2)'>
							ລາຄາ
							<image v-if="price==1" :src="domain+'/static/diy/up'+keyColor+'.png'"></image>
							<image v-else-if="price==2" :src="domain+'/static/diy/down'+keyColor+'.png'"></image>
							<image v-else :src='`${domain}/static/images/horn.png`'></image>
						</view>
						<!-- down -->
						<view class='item' @click='bindRight'>
							ກັ່ນຕອງ
							<text class="iconfont icon-ic_sort"></text>
						</view>
					</view>
				</block>
				<block v-if="tabIndex==2">
					<view class='nav acea-row row-middle'>
						<view class='item' v-for="item in shopTab" :key="item.key" :class=" {'t-color':storeKey==item.key}" @click="storeTab(item.key)">
							{{item.title}}
						</view>
						<view class="item" :class="{'t-colors':firstKey == 4}" @click="bindRight2">
							<view>ກັ່ນຕອງ
							<text class="iconfont icon-ic_sort"></text>
							</view>
							<view class="line" :class="{'font-line':firstKey == 4}">
							</view>
						</view>
					</view>
				</block>
			</view>
			<!-- 商品 -->
			<block v-if="tabIndex == 1">
				<view class='list acea-row row-between-wrapper on' v-if="!is_switch" :style="{ marginTop: mTop }">
					<view class='item on' v-for="(item,index) in productList" :key="index"
					 @click="godDetail(item)">
						<view class='pictrue on'>
							<image :src='item.image' class="on"></image>
							<view v-if="item.stock == 0" class="sell_out">ຂາຍໝົດແລ້ວ</view>
							<view v-if="item.border_pic" :style="{ backgroundImage: `url(${item.border_pic})` }" class="border-picture"></view>
						</view>
						<view class='text on acea-row row-column-between'>
							<view class='name'>
								<text class="name_text line2">{{item.store_name}}</text>
							</view>
							<view class="item_bot">
								<view class="acea-row row-bottom">
									<view class='money on'>
										<priceFormat :price="item.price" weight intSize="40" floatSize="26" labelSize="26"></priceFormat>
									</view>
									<view v-if="item.show_svip_info&&item.show_svip_info.show_svip_price && item.svip_price" class="acea-row row-middle">
										<text class='vip-money'>¥{{item.svip_price}}</text>
										<view class="vipImg">
											<image :src="`${domain}/static/images/svip.png`"></image>
										</view>
									</view>
								</view>
								<view class="item_tags acea-row">
									<text v-if="item.merchant.type_name && item.product_type == 0" class="font-bg-red bt-color line1">{{item.merchant.type_name}}</text>
									<text v-else-if="item.merchant.is_trader && item.product_type == 0" class="font-bg-red bt-color line1">ຂາຍເອງ</text>
									<text v-if="item.product_type != 0" :class="'font_bg-red bt-color type'+item.product_type">{{item.product_type == 1 ? "ການຂາຍດ່ວນ" : item.product_type == 2 ? "ສັ່ງຈອງລ່ວງໜ້າ" : item.product_type == 3 ? "ຊ່ວຍເຫຼືອ" : item.product_type == 4 ? "ຊື້ເປັນກຸ່ມ" : ""}}</text>
									<text class="tags_item ticket" v-if="item.issetCoupon">ເອົາຄູປອງ</text>
									<text class="tags_item delivery" v-if="item.delivery_free == 1">ສົ່ງຟຣີ</text>
									<text class="tags_item reservation" v-if="item.product.reservation && item.product.type == 4">{{reservateLabel(item.product.reservation)}}</text>
								</view>
								<view class="score">{{item.rate}}ຄະແນນ {{item.reply_count}}ຄຳເຫັນ</view>
								<view class="company" v-if="item.merchant && hide_mer_status==0">
									<text class='name line1'>{{item.merchant.mer_name}}</text>
									<view class="flex" v-if="item.merchant" @click.stop="goStore(item.merchant.mer_id)">
										ເຂົ້າຮ້ານ
										<text class="iconfont icon-ic_rightarrow"></text>
									</view>
								</view>
								<view class="add-cart acea-row row-middle row-center" @click.stop='selecAttr(item)'>
									<text class="iconfont icon-ic_ShoppingCart1"></text>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view v-else class="list" :style="{ marginTop: mTop }">
					<WaterfallsFlow :wfList='productList' :isStore="hide_mer_status" :addCart="true" @itemTap="godDetail" :type="1" @goShop="goStore" @addCat="selecAttr"/>
					<view class='loadingicon acea-row row-center-wrapper' v-if='productList.length > 0'>
						<text class='loading iconfont icon-jiazai' :hidden='loading==false'></text>{{loadTitle}}
					</view>
				</view>
				<view class='loadingicon acea-row row-center-wrapper' v-if='loading'>
					<text class='loading iconfont icon-jiazai' :hidden='loading==false'></text>{{loadTitle}}
				</view>
				<block v-if="productList.length==0 && !loading">
					<view class='noCommodity'>
						<view class='pictrue' style="margin: 0 auto;">
							<image :src="domain+'/static/images/noSearch.png'"></image>
							<text>ບໍ່ມີສິນຄ້າ, ໄປຄົ້ນຫາສິນຄ້າອື່ນ</text>
						</view>
					</view>
					<recommend v-if="recommend_switch == 1" :hostProduct="hostProduct" :isLogin="isLogin"></recommend>
				</block>
			</block>
			<!-- 店铺 -->
			<block v-if="tabIndex == 2">
				<view class="store-wrapper">
					<view class="store-item" v-if="storeList.length" v-for="(item,index) in storeList" :key="index">
						<view class="head">
							<view class="left-wrapper">
								<view class="logo">
									<image :src="item.mer_avatar" mode=""></image>
								</view>
								<view class="con-box">
									<view class="name acea-row row-middle">
										<text class="mer_name line1">{{item.mer_name}}</text>
										<image v-if="margin_ico_switch==1 && margin_ico && item.is_margin == 10" :src="margin_ico" class="store-margin"></image>
										<text v-if="item.type_name" class="font-bg-red b-color">{{item.type_name}}</text>
										<text v-else-if="item.is_trader" class="font-bg-red b-color">ຂາຍເອງ</text>
									</view>
									<view class="star-box">
										<view class="star">
											<view class="star-active" :style="{width: `${item.allScore}%`, backgroundImage: `url(${domain}/static/diy/score1${keyColor}.png)`}"></view>
										</view>
										<view class="num">{{item.product_score}}</view>
										<view class="line" v-if="item.distance"></view>
										<view class="distance" v-if="item.distance" @click="showMaoLocation(item.lat,item.long)">{{item.distance}}
											<view class="iconfont icon-ic_rightarrow"></view>
										</view>
									</view>
								</view>
							</view>
							<view class="link" @click="goStore(item.mer_id)">ເຂົ້າຮ້ານ</view>
						</view>
						<view class="pic-wrapper">
							<view class="pic-item" v-for="(goods,index) in item.recommend" :key="index">
								<navigator :url="`/pages/goods_details/index?id=${goods.product_id}`">
									<image :src="goods.image" mode=""></image>
									<view class="price">
										<text>¥</text>{{goods.price}}
									</view>
								</navigator>
							</view>
						</view>
					</view>
				</view>
				<view class='loadingicon acea-row row-center-wrapper' v-if='loading'>
					<text class='loading iconfont icon-jiazai' :hidden='loading==false'></text>{{loadTitle}}
				</view>
				<block v-if="!storeList.length && !loading">
					<view class='noCommodity'>
						<view class='pictrue' style="margin: 0 auto;">
							<image :src="domain+'/static/images/no_thing.png'"></image>
							<text>ບໍ່ມີສິນຄ້າ, ໄປຄົ້ນຫາສິນຄ້າອື່ນ</text>
						</view>
					</view>
					<recommend v-if="recommend_switch == 1" :hostProduct="hostProduct" :isLogin="isLogin"></recommend>
				</block>
			</block>
			<rightSlider1 v-if="rightBox&&typeStatus&&brandStatus&&parmasStatus" :status="rightBox&&typeStatus&&brandStatus&&parmasStatus" :activeIndex="activeIndex" :storeTypeArr="storeTypeArr" :brandList="brandList" :parmasList="parmasList" :price_on="where.price_on" :price_off="where.price_off"
			  :isCate="true" @confirm="confirm" @close="close"></rightSlider1>
		</view>
		<view class="down-wrapper" v-if="downStatus">
			<view class="bg" @click="downStatus=false"></view>
			<view class="down-box" :style="{ top: mTop }">
				<view class="down-item" v-for="(item,index) in downMenu" :key="item.key" :class="{'on':index == downKey}" @click="bindDown(item,index)">
					{{item.title}}
					<text v-if="index == downKey" class="iconfont icon-ic_complete"></text>
				</view>
			</view>
		</view>
		<rightSlider2 v-if="rightBox2&&storeCateStatus&&typeStatus" :status="rightBox2&&storeCateStatus&&typeStatus" :activeIndex="activeIndex" :merList="merList" :storeTypeArr="storeTypeArr" @confirm="confirm2" @close="close"></rightSlider2>
		<!-- #ifndef H5 -->
		<passwordPopup></passwordPopup>
		<!-- #endif -->
		<!-- 组件 -->
		<productWindow :attr="attr" :isShow='true' :iSplus='1' :destri="0" :isList="true" @myevent="onMyEvent" @ChangeAttr="ChangeAttr" @ChangeCartNum="ChangeCartNum"
		 @attrVal="attrVal" @goCat="goCat" @iptCartNum="iptCartNum" id='product-window' :payLimit="pay_limit" :maxCount="max_count" :minCount="min_count" :svipPrice="svipPrice" :image="storeInfo.image"></productWindow>
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
	import {
		getProductslist,
		getProductHot,
		getBrandlist,
		getParmasList,
		storeMerchantList,
		getGeocoder
	} from '@/api/store.js';
	import {initiateAssistApi} from '@/api/activity.js';
	import recommend from '@/components/recommend';
	import rightSlider1 from '../components/rightSlider.vue';
	import rightSlider2 from '@/components/rightSlider/index';
	import productWindow from '@/components/productWindow';
	import WaterfallsFlow from '@/components/WaterfallsFlow/WaterfallsFlow.vue'
	import { merClassifly, getStoreTypeApi } from '@/api/store.js';
	import { configMap } from "@/utils";
	import util from '@/utils/util.js';
	import { mapGetters } from "vuex";
	// #ifndef H5
	import passwordPopup from '@/components/passwordPopup';
	// #endif
	import { toLogin } from '@/libs/login.js';
	import { HTTP_REQUEST_URL } from '@/config/app';
	import { goShopDetail } from '@/libs/order.js'
	import { getconfig } from '@/api/public.js';
	const app = getApp();
	export default {
		components: {
			recommend,
			rightSlider1,
			rightSlider2,
			WaterfallsFlow,
			productWindow,
			// #ifndef H5
			passwordPopup,
			// #endif
		},
		watch: {
			tabIndex(nVal, oVal) {
				if (nVal == 1) {
					this.loadend = false;
					this.$set(this.where, 'page', 1)
					this.get_product_list(true);
				} else {
					this.loadend = false;
					this.downStatus = false
					this.storeScroll = true
					this.storeList = []
					this.storeMerchantList('')
				}
			}
		},
		data() {
			return {
				domain: HTTP_REQUEST_URL,
				productList: [],
				is_switch: true,
				where: {
					cate_id: '',
					order: '',
					price_on: '',
					price_off: '',
					brand_id: '',
					keyword: '',
					is_trader: '',
					mer_type_id: '',
					filter_params: '',
					page: 1,
					limit: 30
				},
				shopTabs: [{
						title: 'ຄ່າເລີ່ມຕົ້ນ',
						key: 0,
						order: ""
					},
					{
						title: 'ຍອດຂາຍ',
						key: 1,
						order: 'sales'
					},
					{
						title: 'ຄຳຕິຊົມດີ',
						key: 2,
						order: 'rate'
					},
					{
						title: 'ໄລຍະຫ່າງ',
						key: 3,
						order: 'location'
					}
				],
				price: 0,
				stock: 0,
				nows: false,
				loadend: false,
				loading: false,
				loadTitle: 'ໂຫຼດເພີ່ມ',
				title: '',
				hostProduct: [],
				hotPage: 1,
				hotLimit: 10,
				hotScroll: false,
				// 筛选框
				rightBox: false,
				brandStatus: false,
				typeStatus: false,
				cateStatus: false,
				parmasStatus: false,
				rightBox2: false,
				storeCateStatus: false,
				//品牌列表
				brandList: [],
				downKey: 0,
				downStatus: false,
				// 下拉菜单
				downMenu: [{
						title: 'ຈັດລຽງລວມ',
						key: 1,
					},
					{
						title: 'ຄະແນນ',
						key: 2,
					},
					{
						title: 'ສິນຄ້າໃໝ່',
						key: 3,
					}
				],
				// 是否第一个
				firstKey: 0,
				// tab切换
				tabIndex: 1,
				// 商铺列表
				storeList: [],
				sotreParam: {
					keyword: '',
					page: 1,
					limit: 10,
					order: '',
					category_id : '',
					type_id: '',
					parameter_id: []
				},
				storeKey: 0,
				storeScroll: true,
				detaile_address: "", //详细地址
				recommend_address: "", //当前地点
				latitude: "",
				longitude: "",
				mer_location: 0,
				count: 0, //店铺总条数
				storeTypeArr: [], //店铺类型
				parmasList: [],
				merList: [], //商户分类
				mTop: 0,
				activeIndex: 0,
				max_count: 0,
				min_count: 0,
				pay_limit: 1,
				svipData: {},
				svipPrice: false,
				attr: {
					cartAttr: false,
					productAttr: [],
					productSelect: {}
				},
				storeInfo: {},
				cart_num: 1, //购买数量
				isOpen: false, //是否打开属性组件
				selectedArr: [],
				productValue: [], //系统属性
				attrValue: "",
				uniqueValue: "",
			};
		},
		onLoad: function(options) {
			this.$set(this.where, 'cate_id', options.id || '');
			this.title = options.title || '';
			this.$set(this.where, 'keyword', options.searchValue || '');
			this.get_product_list();
			this.get_host_product();
		},
		onReady() {
		},
		mounted() {
			uni.getStorage({
				key: 'GLOBAL_DATA',
				success: (res) => {
					if (res.data.mer_location == 1) {
						this.mer_location = res.data.mer_location
						this.selfLocation()
					}
				}
			});
			this.mTop = this.hide_mer_status == 0 ? '244rpx' : '170rpx'
		},
		computed: {
			shopTab: function() {
				return this.shopTabs.filter((item) => {
					if (this.mer_location == 1) {
						return item
					} else {
						return item.key < 3
					}
				})
			},
			...configMap({margin_ico_switch: 0,margin_ico: '',hide_mer_status:0,recommend_switch: 0},mapGetters(['uid','isLogin','scrollTop','viewColor','keyColor'])),
		},
		// 滚动监听
		onPageScroll() {
			uni.$emit('scroll');
		},
		methods: {
			reservateLabel(item) {
				return item.reservation_type == 1 ? 'ຮັບຢູ່ຮ້ານ' : item.reservation_type == 2 ? 'ສົ່ງເຖິງບ້ານ' : 'ສົ່ງເຖິງບ້ານ+ຮັບຢູ່ຮ້ານ'
			},
			//查看地图
			showMaoLocation(lat, lon) {
				if (!lat || !lon) return this.$util.Tips({
						title: 'ກະລຸນາຕັ້ງຄ່າອະນຸຍາດໃຫ້ຮ້ານເຂົ້າຖຶງຕຳແໜ່ງຂອງທ່ານ!'
					});
				//#ifdef H5
				if(this.$wechat.isWeixin() === true) {
					this.$wechat.seeLocation({
						latitude: Number(lat),
						longitude: Number(lon)
					}).then(res=>{
						console.log('success');
					})
				}else{
					//#endif
					uni.openLocation({
						latitude: parseFloat(lat),
						longitude: parseFloat(lon),
						scale: 8,
						geocode: true,
						name: 'ຕຳແໜ່ງປັດຈຸບັນ',
						address: this.detaile_address,
						success: function(res) {
							console.log(res)
						},
					});
				// #ifdef H5
				}
				//#endif
			},
			//获取定位
			selfLocation() {
				let self = this
				uni.getLocation({
					type: 'gcj02',
					success: (res) => {
						let latitude, longitude;
						latitude = res.latitude.toString();
						longitude = res.longitude.toString();
						this.latitude = res.latitude
						this.longitude = res.longitude
						getGeocoder({
							lat: latitude,
							long: longitude
						}).then(res => {
							this.detaile_address = res.data.address;
							this.recommend_address = res.data.formatted_addresses.recommend;
						})
					},
					complete: function() {
					}
				});
			},
			// 获取商户分类
			getClassfication: function() {
				let temp = []
				merClassifly()
					.then(res => {
						this.storeCateStatus = true
						temp = res.data.map(item => {
							return {
								...item,
								check: false
							}
						})
						this.merList = temp
					})
					.catch(res => {
						this.$util.Tips({
							title: res
						});
					});
			},
			// 获取店铺类型
			async getStoreType() {
				let temp = []
				getStoreTypeApi()
					.then(res => {
						this.typeStatus = true
						temp = res.data.map(item => {
							return {
								...item,
								check: false
							}
						})
						this.storeTypeArr = temp
					})
					.catch(res => {
						this.$util.Tips({
							title: res
						});
					});
			},
			// 获取参数列表
			async getParmasList(){
				let temp = []
				getParmasList({
					cate_id: this.where.cate_id,
					keyword:this.where.keyword
				})
					.then(res => {
						this.parmasStatus = true
						temp = res.data.map(item => {
							return {
								...item,
								check: false,
								showValue: false,
								parmasValue: []
							}
						})
						this.parmasList = temp
					})
					.catch(res => {
						this.$util.Tips({
							title: res
						});
					});
			},
			// 查找店铺
			storeMerchantList(type) {
				if (!this.storeScroll) return
				this.loading = true
				let serachData = {
					keyword: this.where.keyword,
					page: this.sotreParam.page,
					limit: this.sotreParam.limit,
					order: this.sotreParam.order,
					category_id: this.sotreParam.category_id,
					type_id: this.sotreParam.type_id
				}
				if (this.latitude) {
					serachData.location = this.latitude + ',' + this.longitude
				}
				storeMerchantList(serachData).then(res => {
					res.data.list.forEach(item => {
						var tempNum = parseFloat(item.product_score) + parseFloat(item.service_score) + parseInt(item.postage_score)
						tempNum = tempNum / 3 / 5 * 100
						item.allScore = tempNum.toFixed(2)
					})
					this.storeScroll = res.data.list.length >= this.sotreParam.limit
					this.storeList = this.storeList.concat(res.data.list)
					this.count = res.data.count
					this.loading = false
				})
			},
			// 店铺排序
			storeTab(key) {
				if (this.loading) return
				this.storeKey = key
				this.sotreParam.order = this.shopTabs[key].order
				this.sotreParam.page = 1
				this.storeScroll = true
				this.storeList = []
				this.storeMerchantList()
			},
			// 右侧切换
			bindRight() {
				this.price = 0;
				this.firstKey = 4
				if(!this.brandList.length)this.getBrandlist()
				if(!this.storeTypeArr.length)this.getStoreType()
				if(!this.parmasList.length)this.getParmasList()
				this.rightBox = true
			},
			// 品牌列表
			async getBrandlist() {
				let temp = []
				getBrandlist({
					cate_id: this.where.cate_id,
					keyword: this.where.keyword
				}).then(res => {
					this.brandStatus = true
					temp = res.data.list.map(item => {
						return {
							...item,
							check: false
						}
					})
					this.brandList = temp
				})
			},
			// 去详情页
			godDetail(item) {
				goShopDetail(item, this.uid).then(res => {
					if (this.isLogin) {
						initiateAssistApi(item.activity_id).then(res => {
							let id = res.data.product_assist_set_id;
							uni.hideLoading();
							uni.navigateTo({
								url: '/pages/activity/assist_detail/index?id=' + id
							});
						}).catch((err) => {
							uni.showToast({
								title: err,
								icon: 'none'
							})
						});
					} else {
						toLogin()
					}
				})
			},
			// 组件确定
			confirm(data,index) {
				let arr1 = [], arr2 = []
				if (data.brandList.length == 0) {
					this.where.brand_id = ''
				} else {
					data.brandList.forEach(item => {
						arr1.push(item.brand_id)
					})
					this.where.brand_id = arr1.toString()
				}
				if(data.typeList.length == 0){
					this.where.mer_type_id = ''
				}else{
					data.typeList.forEach(item =>{
						arr2.push(item.mer_type_id)
					})
					this.where.mer_type_id = arr2.toString()
				}
				this.activeIndex = index
				this.where.filter_params = data.parmasList.length>0 ? data.parmasList.toString() : ''
				this.rightBox = data.status
				this.where.price_on = data.price_on
				this.where.price_off = data.price_off
				this.where.is_trader = data.is_trader
				this.loadend = false;
				this.$set(this.where, 'page', 1)
				this.get_product_list(true);
			},
			// 右侧切换
			bindRight2() {
				this.price = 0;
				this.sotreParam.page = 1
				this.sotreParam.order = ''
				if(!this.storeTypeArr.length)this.getStoreType()
				if(!this.merList.length)this.getClassfication()
				this.rightBox2 = true
			},
			// 组件确定
			confirm2(data) {
				let arr1 = [],arr2 = []
				if (data.storeTypeArr.length == 0) {
					this.sotreParam.type_id = ''
				} else {
					data.storeTypeArr.forEach(item => {
						arr1.push(item.mer_type_id)
					})
					this.sotreParam.type_id = arr1.toString();
				}
				if (data.merList.length == 0) {
					this.sotreParam.category_id = ''
				} else {
					data.merList.forEach(item => {
						arr2.push(item.merchant_category_id)
					})
					this.sotreParam.category_id = arr2.toString();
				}
				this.rightBox2 = data.status
				this.loadend = false;
				this.$set(this.sotreParam, 'page', 1)
				this.storeList = [];
				this.storeScroll = true
				this.storeMerchantList();
			},
			// 组件关闭
			close() {
				this.rightBox = false
				this.rightBox2 = false
			},
			// 下拉选项
			bindDown(item, index) {
				this.firstKey = 0
				if (index == 0) {
					this.where.order = ''
				} else if (index == 1) {
					this.where.order = 'rate'
				} else if (index == 2) {
					this.where.order = 'is_new'
				}
				this.downKey = index
				this.downStatus = false
				this.loadend = false;
				this.$set(this.where, 'page', 1)
				this.get_product_list(true);
			},
			Changswitch: function() {
				let that = this;
				that.is_switch = !that.is_switch
			},
			searchSubmit: function(e) {
				let that = this;
				if (!e.detail.value.trim()) {
					uni.showToast({
						title: 'ກະລຸນາປ້ອນເນື້ອຫາຄົ້ນຫາ',
						icon: 'none',
						duration: 1000
					});
					return
				}
				that.$set(that.where, 'keyword', e.detail.value);
				if (this.tabIndex == 1) {
					that.loadend = false;
					that.$set(that.where, 'page', 1)
					this.get_product_list(true);
				} else {
					this.sotreParam.page = 1
					this.storeScroll = true
					this.storeList = []
					this.storeMerchantList('search')
				}
			},
			inputChange: function(e) {
				let that = this;
				that.$set(that.where, 'keyword', e.detail.value);
			},
			/**
			 * 获取我的推荐
			 */
			get_host_product: function() {
				let that = this;
				if (that.hotScroll) return
				getProductHot(
					that.hotPage,
					that.hotLimit,
				).then(res => {
					that.hotPage++
					that.hotScroll = res.data.list.length < that.hotLimit
					that.hostProduct = that.hostProduct.concat(res.data.list)
				});
			},
			//点击事件处理
			set_where: function(e) {
				this.downStatus = false
				switch (e) {
					case 1:
						uni.navigateBack()
						break
					case 2:
						this.firstKey = e
						if (this.price == 0) {
							this.price = 1;
							this.where.order = 'price_asc'
						} else if (this.price == 1) {
							this.price = 2;
							this.where.order = 'price_desc'
						} else if (this.price == 2) {
							this.price = 0;
							this.where.order = ''
						}
						this.$set(this.where, 'page', 1)
						this.get_product_list(true);
						break;
					case 3:
						this.price = 0;
						this.loadend = false;
						this.$set(this.where, 'order', 'sales')
						this.$set(this.where, 'page', 1)
						this.get_product_list(true);
						this.firstKey = e
						break;
				}
				this.loadend = false;
				this.$set(this.where, 'page', 1);
				this.get_product_list(true);
			},
			//查找产品
			get_product_list: function(isPage) {
				let that = this;
				if (that.loadend) return;
				if (that.loading) return;
				if (isPage === true) that.$set(that, 'productList', []);
				that.loading = true;
				that.loadTitle = '';
				getProductslist(that.where).then(res => {
					let list = res.data.list;
					let productList = that.$util.SplitArray(list, that.productList);
					let loadend = list.length < that.where.limit;
					that.loadend = loadend;
					that.loading = false;
					that.loadTitle = loadend ? 'ໂຫຼດໝົດແລ້ວ' : 'ໂຫຼດເພີ່ມ';
					that.$set(that, 'productList', productList);
					that.$set(that.where, 'page', that.where.page + 1);
				}).catch(err => {
					that.loading = false;
					that.loadTitle = 'ໂຫຼດເພີ່ມ';
				});
			},
			goStore: function(id) {
				if (this.hide_mer_status != 1) {
					uni.navigateTo({
						url: `/pages/store/home/index?id=${id}`
					})
				}
			},
			/**
			 * 打开规格属性
			 */
			selecAttr: function(item) {
				let that = this;
				let type = item.product ? item.product.type : item.type
				if((item.product_type == 0 && type != 0) || item.product_type > 0 || item.mer_form_id){
					that.godDetail(item);
				}else{
					that.storeInfo = item;
					util.getProductSpecs(item.spu_id,function(data){
						that.$set(that, "attr", data.attr);
						that.$set(that.attr.productSelect,"store_name",item.store_name);
						that.$set(that, 'productValue', data.productValue);
						that.$set(that, "attrValue", data.attrValue);
						that.$set(that, 'svipPrice', item.show_svip_info && item.show_svip_info.show_svip_price || false);
						that.$set(that.attr, 'cartAttr', true);
						that.$set(that, 'isOpen', true);
					})
				}

			},
			onMyEvent: function() {
				this.$set(this.attr, 'cartAttr', false);
				this.$set(this, 'isOpen', false);
			},
			attrVal(val) {
				this.$set(this.attr.productAttr[val.indexw], 'index', this.attr.productAttr[val.indexw].attr_values[val.indexn]);
			},
			/**
			 * 购物车手动填写
			 *
			 */
			iptCartNum: function(e) {
				this.$set(this.attr.productSelect, 'cart_num', e);
			},
			/**
			 * 属性变动赋值
			 *
			 */
			ChangeAttr: function(res) {
				let productSelect = this.productValue[res];
				this.attr.productSelect = {...this.attr.productSelect,...productSelect}
				if(!productSelect || productSelect.stock <= 0){
					this.$set(this.attr.productSelect, "stock", 0);
					this.$set(this.attr.productSelect, "unique", "");
					this.$set(this.attr.productSelect, "cart_num", 0);
				}
			},
			/**
			 * 购物车数量加和数量减
			 *
			 */
			ChangeCartNum: function(changeValue) {
				//changeValue:是否 加|减
				//获取当前变动属性
				let productSelect = this.productValue[this.attrValue];
				util.ChangeCartNum(productSelect,this.attr,changeValue,function(stock){
					this.$set(this.attr.productSelect, "cart_num", stock);
				})
			},
			/*
			 * 加入购物车
			 */
			goCat: function() {
				let that = this,
				productSelect = that.productValue[this.attrValue];
				//打开属性
				if (that.attrValue) {
					//默认选中了属性，但是没有打开过属性弹窗还是自动打开让用户查看默认选中的属性
					that.attr.cartAttr = !that.isOpen ? true : false;
				} else {
					if (that.isOpen) that.attr.cartAttr = true;
					else
					that.attr.cartAttr = !that.attr.cartAttr;
				}
				//只有关闭属性弹窗时进行加入购物车
				if (that.attr.cartAttr === true && that.isOpen === false)
					return (that.isOpen = true);
				that.isOpen = that.attr.cartAttr = true;
				//如果有属性,没有选择,提示用户选择
				if (
					that.attr.productAttr.length &&
					that.isOpen === true &&
					productSelect.stock == 0
				)
					return that.$util.Tips({
						title: "ສິນຄ້າໝົດສະຕ໋ອກ, ກະລຸນາເລືອກອັນອື່ນ"
					});
				if (that.attr.productSelect.cart_num == 0) {
					return that.$util.Tips({
						title: 'ຈຳນວນຊື້ຕ້ອງບໍ່ແມ່ນ 0!'
					})
				}
				let q = {
					is_new: 0,
					product_id: that.storeInfo.product_id,
					cart_num: that.attr.productSelect.cart_num,
					product_attr_unique: that.attr.productSelect !== undefined ? that.attr.productSelect.unique : "",
					product_type: that.storeInfo.product_type,
				};
				util.addCart(q,function(){
					that.isOpen = that.attr.cartAttr = false;
				})
			},
		},
		onPullDownRefresh() {

		},
		onReachBottom() {
			if (this.tabIndex == 1) {
				if (this.productList.length > 0) {
					this.get_product_list(false);
				} else {
					this.get_host_product();
				}
			} else {
				if (this.count === this.storeList.length) {
					if (this.count === 0) {
						return
					}
					uni.showToast({
						title: 'ໂຫຼດໝົດແລ້ວ',
						icon: 'none',
						duration: 1000
					});
				} else {
					this.sotreParam.page += 1
					this.storeMerchantList()
				}
			}
		},
		onPullDownRefresh(){
			setTimeout(()=>{
				const newList = this.productList.reverse();
				this.productList = newList;
				uni.stopPullDownRefresh();
			},500)
		}
	}
</script>

<style lang="scss" scoped>
	.b-color {
		background-color: var(--view-theme)!important;
		border: 1px solid var(--view-theme)!important;
	}
	.productList .search {
		width: 100%;
		height: 86rpx;
		padding: 0 20rpx;
		box-sizing: border-box;
		position: fixed;
		left: 0;
		top: 0;
		z-index: 9;
		background-color: var(--view-theme);
		.icon-ic_location51 {
			color: #fff;
			font-weight: 0;
			font-size: 40rpx;
			line-height: 86rpx;
			width: 62rpx;
		}
	}
	.productList .search .back {
		display: flex;
		align-items: center;
		width: 40rpx;
		height: 60rpx;
		.iconfont {
			color: #fff;
			font-size: 36rpx;
		}
	}
	.productList .search .input {
		flex: 1;
		height: 60rpx;
		background-color: #fff;
		border-radius: 60rpx;
		padding: 0 30rpx;
		box-sizing: border-box;
	}
	.productList .search .input input {
		flex: 1;
		height: 100%;
		font-size: 26rpx;
		margin-left: 10rpx;
	}
	.productList .search .input .placeholder {
		color: #ccc;
	}
	.productList .search .input .iconfont {
		font-size: 32rpx;
		color: #999;
	}
	.productList .search .icon-a-ic_Imageandtextsorting,
	.productList .search .icon-a-ic_Picturearrangement,
	.productList .search .iconempty {
		color: #fff;
		width: 62rpx;
		font-size: 40rpx;
		height: 86rpx;
		line-height: 86rpx;
	}
	.productList .nav-wrapper {
		z-index: 9;
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		margin-top: 82rpx;
		background-color: var(--view-theme);
		.tab-bar {
			display: flex;
			align-items: center;
			.tab-item {
				position: relative;
				flex: 1;
				display: flex;
				justify-content: center;
				align-items: center;
				padding: 16rpx 0 26rpx;
				color: #fff;
				font-size: 28rpx;
				font-weight: bold;
				&::after {
					content: ' ';
					position: absolute;
					left: 50%;
					bottom: 18rpx;
					width: 60rpx;
					height: 4rpx;
					background: transparent;
					transform: translateX(-50%);
				}
				&.on {
					&::after {
						background: #fff;
					}
				}
			}
		}
	}
	.productList .nav {
		height: 86rpx;
		font-size: 26rpx;
		background-color: #fff;
		display: flex;
		justify-content: space-between;
		padding: 0 28rpx;
		border-radius: 24rpx 24rpx 0 0;
		position: relative;
		bottom: -2rpx;
	}
	.productList .nav .item {
		display: flex;
		align-items: center;
		justify-content: center;
		flex: 1;
		.iconfont {
			font-size: 24rpx;
		}
	}
	.t-color {
		color: var(--view-theme);
	}
	.productList .nav .item.t-color {
		font-weight: bold;
	}
	.productList .nav .item image {
		width: 15rpx;
		height: 19rpx;
		margin-left: 10rpx;
	}
	.productList .list {
		padding: 0 20rpx;
	}
	.productList .list.on {
		background-color: #fff;
		padding-top: 24rpx;
	}
	.productList .list .item {
		position: relative;
		width: 345rpx;
		margin-top: 20rpx;
		background-color: #fff;
		border-radius: 20rpx;
		.name{
			display: flex;
			align-items: center;
		}
	}
	.productList .list .item.on {
		width: 100%;
		display: flex;
		justify-content: space-between;
		margin: 0 0 32rpx;
	}
	.productList .list .item .pictrue {
		position: relative;
		width: 100%;
		height: 345rpx;
	}
	.productList .list .item .pictrue.on {
		width: 270rpx;
		height: 270rpx;
		.sell_out {
			display: flex;
			width: 110rpx;
			height: 110rpx;
			align-items: center;
			justify-content: center;
			border-radius: 100%;
			background: rgba(0,0,0,.6);
			color: #fff;
			font-size: 24rpx;
			position: absolute;
			top: 50%;
			left: 50%;
			margin: -55rpx 0 0 -55rpx;
			&::before{
				content: "";
				display: block;
				width: 100rpx;
				height: 100rpx;
				border-radius: 100%;
				border: 1px dashed #fff;
				position: absolute;
				top: 5rpx;
				left: 5rpx;
			}
		}
		.border-picture {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			border-radius: 16rpx;
			background: center/cover no-repeat;
		}
	}
	.productList .list .item .pictrue image.on {
		border-radius: 24rpx;
		width: 270rpx;
		height: 270rpx;
	}
	.productList .list .item .text {
		padding: 20rpx 17rpx 26rpx 17rpx;

		font-size: 30rpx;
	}
	.productList .list .item .text.on {
		width: 420rpx;
		height: 270rpx;
		font-size: 28rpx;
		padding: 8rpx 0 0;
		justify-content: space-between;
		.font-bg-red{
			max-width: 120rpx;
		}
		.bt-color {
			background-color: var(--view-theme);
			&.type2{
				background-color: #FD6523;
			}
		}
		.name,.item_bot{
			width: 100%;
		}
		.name_text{
			line-height: 38rpx;
			height: 76rpx;
		}
		.vip-money {
			color: #282828;
			font-size: 22rpx;
			margin-left: 6rpx;
			font-weight: bold;
		}
		.vipImg {
			width: 65rpx;
			height: 28rpx;
			margin-left: 4rpx;
			image {
				width: 100%;
				height: 100%;
				display: block;
			}
		}
	}
	.productList .list .item .text .money {
		display: flex;
		align-items: center;
		font-size: 26rpx;
		font-weight: bold;
		color: var(--view-priceColor);
	}
	.productList .list .item .text .money .num {
		font-size: 34rpx;
	}
	.productList .distance {
		display: flex;
		align-items: center;
		font-size: 24rpx;
		color: #999999;
		.iconfont {
			font-size: 20rpx;
			margin-top: 4rpx;
		}
	}
	.productList .list .item .text .money .ticket {
		margin-left: 10rpx;
		padding: 0 5rpx;
		font-weight: initial;
		font-size: 20rpx;
		border: 1px solid var(--view-theme);
		border-radius: 4rpx;
	}
	.productList .list .item .item_tags{
		margin-top: 8rpx;
	}
	.productList .list .item .text .score {
		margin-top: 10rpx;
		color: #666666;
		font-size: 22rpx;
	}
	.productList .list .item .text .company {
		display: flex;
		align-items: center;
		color: #666666;
		font-size: 22rpx;
		margin-top: 6rpx;
		.name {
			display: inline-block;
			width: auto;
			max-width: 200rpx;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
		}
		.flex {
			display: flex;
			align-items: center;
			margin-left: 10rpx;
			color: #282828;
			width: 100rpx;
			.iconfont {
				font-size: 20rpx;
				margin-top: 4rpx;
			}
		}
	}
	.productList .list .item .foot-bar {
		width: 100%;
		height: 52rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		background-image: linear-gradient(-90deg, var(--view-bntColor21) 0%, var(--view-bntColor22) 100%);
		border-radius: 0px 0px 16rpx 16rpx;
		color: #fff;
		font-size: 24rpx;
		.icon-fenxiang {
			font-size: 24rpx;
			margin-right: 10rpx;
		}
		&.on {
			position: absolute;
			right: 0;
			bottom: 26rpx;
			width: 200rpx;
			height: 44rpx;
			border-radius: 22rpx;
		}
	}
	.noCommodity {
		.pictrue {
			height: 420rpx;
			color: $uni-nothing-text;
			image {
				width: 414rpx;
				height: 336rpx;
			}
		}
	}
	.no-shop {
		margin-top: 240rpx;
		background-color: #fff;
		padding-bottom: calc(100% - 109rpx);
		.pictrue {
			display: flex;
			flex-direction: column;
			align-items: center;
			color: $uni-nothing-text;
			image {
				width: 414rpx;
				height: 336rpx;
			}
		}
	}
	.icon-ic_downarrow {
		margin-top: 6rpx;
	}
	.icon-ic_sort {
		font-size: 30rpx;
		margin-left: 10rpx;
	}
	.down-wrapper {
		.bg {
			z-index: 8;
			position: fixed;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			background: rgba(0, 0, 0, .5);
		}
		.down-box {
			z-index: 8;
			position: fixed;
			left: 0;
			top: 238rpx;
			width: 100%;
			padding: 0 40rpx 28rpx 74rpx;
			background-color: #FFF;
			border-radius: 0 0 24rpx 24rpx;
			.down-item {
				margin-top: 28rpx;
				font-size: 24rpx;
				color: #454545;
				&.on {
					color: var(--view-theme);
				}
				.iconfont{
					font-size: 28rpx;
					float: right;
				}
			}
		}
	}
	.store-wrapper {
		margin-top: 260rpx;
		padding: 0 20rpx;
		.star-box {
			display: flex;
			align-items: center;
			.line {
				width: 2rpx;
				height: 20rpx;
				background: #BFBFBF;
				margin: 0 12rpx;
				.iconfont {
					font-size: 20rpx;
				}
			}
			.star {
				position: relative;
				width: 111rpx;
				height: 19rpx;
				background-size: 111rpx 19rpx;
				top: -1rpx;
			}
			.star-active {
				position: absolute;
				left: 0;
				top: 0;
				width: 111rpx;
				height: 19rpx;
				overflow: hidden;
				background-size: 111rpx 19rpx;
			}
			.num {
				color: var(--view-theme);
				font-size: 24rpx;
				margin-left: 10rpx;
			}
		}
		.store-item {
			margin-bottom: 20rpx;
			padding: 40rpx 20rpx;
			background-color: #fff;
			border-radius: 24rpx;
			.head {
				display: flex;
				align-items: center;
				justify-content: space-between;
				.left-wrapper {
					display: flex;
					align-items: center;
					.logo {
						width: 80rpx;
						height: 80rpx;
						image {
							width: 80rpx;
							height: 80rpx;
							border-radius: 6rpx;
						}
					}
					.con-box {
						margin-left: 20rpx;
						.font-bg-red {
							width: max-content;
							white-space: nowrap;
							margin-left: 16rpx;
							font-size: 18rpx;
							padding: 2rpx 10rpx;
							color: #FFFFFF;
							background-color: #E93323;
							border-radius: 13rpx;
						}
						.name {
							font-size: 30rpx;
							color: #333;
							font-weight: bold;
							margin-bottom: 10rpx;
							.store-margin{
								width: 28rpx;
								height: 30rpx;
								margin-left: 10rpx;
							}
							.mer_name{
								max-width: 360rpx;
							}
						}
					}
				}
				.link {
					width: 92rpx;
					height: 52rpx;
					line-height: 52rpx;
					background-image: linear-gradient(-90deg, var(--view-bntColor21) 0%, var(--view-bntColor22) 100%);
					border-radius: 26rpx;
					text-align: center;
					color: #fff;
					font-size: 22rpx;
				}
			}
			.pic-wrapper {
				display: flex;
				margin-top: 30rpx;
				.pic-item {
					position: relative;
					width: 212rpx;
					height: 212rpx;
					margin-right: 18rpx;
					image {
						width: 212rpx;
						height: 212rpx;
						border-radius: 16rpx;
					}
					.price {
						position: absolute;
						right: 0;
						bottom: 0;
						height: 36rpx;
						padding: 0 10rpx;
						line-height: 36rpx;
						text-align: center;
						background: rgba(0, 0, 0, .5);
						border-radius: 16rpx 2rpx 16rpx 2rpx;
						color: #fff;
						font-size: 24rpx;
						text {
							font-size: 18rpx;
						}
					}
					&:nth-child(3n) {
						margin-right: 0;
					}
				}
			}
		}
	}
</style>
