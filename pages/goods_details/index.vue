<template>
	<view :style="viewColor">
		<view class="product-con">
			<view class="pos-fixed w-100 detail-header" id="home" :style="{ top: homeTop + 'rpx' }">
				<view class="head-wrapper">
					<view class="head-menu">
						<view class='iconfont icon-ic_left' @click="returns"></view>
						<view class="iconfont icon-ic_menu3" @click="showNav"></view>
					</view>
					<view v-if="diyProduct.openShare" class="share-icon" :style="{ left: homeLeft }" @click="shareProduct">
						<view class="iconfont icon-ic_transmit1"></view>
					</view>
				</view>
			</view>
			<homeList
				:navH="navH"
				:currentPage="currentPage"
				:sysHeight="sysHeight"
				:openNavList="diyProduct.navList"></homeList>
			<view v-if="storeInfo && storeInfo.merchant">
				<scroll-view :scroll-top="scrollTop" scroll-y='true' scroll-with-animation="true" :style='"height:"+height+"px;"'
				 @scroll="scroll">
					<view id="past0">
						<!-- #ifdef MP || APP-PLUS -->
						<view class="" :style="'width:100%;' + 'height:'+sysHeight + 'px'"></view>
						<!-- #endif -->
						<productConSwiper :autoHeight="diyProduct.pictureConfig" :imgUrls="storeInfo.slider_image" :videoCoverImg="videoCoverImg" :videoline="storeInfo.video_link" :showDot="diyProduct.swiperDot"></productConSwiper>
						<!--有氛围图-->
						<view v-if="storeInfo.atmosphere_pic" :style="{ backgroundImage: `url(${storeInfo.atmosphere_pic})` }" class='nav acea-row row-between-wrapper boder-44 pos-rel'>
							<view class='money skeleton-rect'>
								<priceFormat v-if="storeInfo.price" :price="storeInfo.price" weight intSize="48" floatSize="32" labelSize="32"></priceFormat>
								<text v-if="!svipData" class='y-money'>₭{{marketPrice || 0}}</text>
								<view class="atmosphere" v-if="svipData && svipData.show_svip_price && svipData.show_svip" style="display: inline-block;">
									<text class="vip-money regular">₭{{storeInfo.svip_price}}</text>
									<image class="vip-image" :src="`${domain}/static/images/svip.png`"></image>
								</view>
							</view>
						</view>
						<view class="swiper-bg pos-rel">
							<view class="detail-count">
								<view class='wrapper'>
									<view class="pad30">
										<view v-if="storeInfo.atmosphere_pic" class='introduce skeleton-rect acea-row atmosphere'>
											<view class="title">
												<text v-if="promotionType" class="font-bg-red bt-color">{{ promotionType }}</text>
												{{storeInfo.store_name || ''}}
											</view>
											<view v-if="diyProduct.shareList.length>0" class="fenxiang_btn">
												<block v-for="(item,index) in diyProduct.shareList" :key="index">
													<view v-if="diyProduct.shareConfig.includes(item.value)" @click="setShare(item.value)"><text class="iconfont" :class="[`${item.icon}`, { 'icon-ic_star1': storeInfo.isRelation&&item.value==1 }]"></text><br/>{{item.label}}</view>
												</block>
											</view>
										</view>
										<view v-if="storeInfo.atmosphere_pic" class='integral_count skeleton-rect'>
											<text v-if="storeInfo.max_integral > 0" class='integral'>ຄະແນນສູງສຸດສາມາດຫຼຸດໄດ້{{storeInfo.max_integral}}ກີບ</text>
										</view>
										<!--无氛围图-->
										<view v-else class='share acea-row row-between row-bottom'>
											<view class='money p-color skeleton-rect' style="min-width: 70rpx;">
												<priceFormat v-if="storeInfo.price" :price="storeInfo.price" weight intSize="48" floatSize="32" labelSize="32"></priceFormat>
												<view v-if="svipData && svipData.show_svip_price && svipData.show_svip" style="display: inline-block;">
													<text class="vip-money regular">₭{{storeInfo.svip_price || 0}}</text>
													<image class="vip-image" :src="`${domain}/static/images/svip.png`"></image>
												</view>
											</view>
											<view v-if="diyProduct.shareList.length>0" class="fenxiang_btn">
												<block v-for="(item,index) in diyProduct.shareList" :key="index">
													<view v-if="diyProduct.shareConfig.includes(item.value)" @click="setShare(item.value)"><text class="iconfont" :class="[`${item.icon}`, { 'icon-ic_star1': storeInfo.isRelation&&item.value==1 }]"></text><br/>{{item.label}}</view>
												</block>
											</view>
										</view>
										<view
											v-if="svipData && !svipData.is_svip && svipData.show_svip && diyProduct.showSvip==1"
											class="svipCon acea-row row-between-wrapper skeleton-rect" style="margin-top: 20rpx;">
											<view class="acea-row row-between-wrapper">
												<image :src="`${domain}/static/images/svip_user.png`"></image>
												<view class="">ເປີດສະມາຊິກ SVIP
													<block v-if="svipData.show_svip_price">ປະຢັດທັນທີ<text>{{svipData.save_money}}ກີບ</text></block>
													<block v-else><text>ປະຢັດເງິນຫຼາຍ, ສິດທິປະໂຫຍດຫຼາຍ</text></block>
												</view>
											</view>
											<navigator class="svipBtn" url="/pages/annex/vip_paid/index">
												ເປີດໃຊ້ດຽວນີ້
												<text class="iconfont icon-ic_rightarrow"></text>
											</navigator>
										</view>
										<view v-if="!storeInfo.atmosphere_pic" class='integral_count skeleton-rect'>
											<text v-if="storeInfo.max_integral > 0" class='integral'>ຄະແນນສູງສຸດສາມາດຫຼຸດໄດ້{{storeInfo.max_integral}}ກີບ</text>
										</view>
										<view v-if="!storeInfo.atmosphere_pic" class='introduce skeleton-rect'>
											<text v-if="promotionType" class="font-bg-red bt-color">{{promotionType}}</text>
											{{storeInfo.store_name || ''}}
										</view>
										<view class="good-tag-list flex item_tags" v-if="tagList.length">
											<view class="good-tag tags_item flex-center line1" v-for="tag of tagList" :style="[tag.style]" :key="tag.label">{{ tag.label }}</view>
										</view>
										<view class='label acea-row row-between-wrapper' :style="{'padding-bottom':coupon.list.length || storeInfo.top_pid?0 :10+'px;'}">
											<view v-show="diyProduct.isOpen.includes(0)" class="skeleton-rect line-through">₭{{marketPrice || 0}}</view>
											<view v-show="diyProduct.isOpen.includes(2)" class="skeleton-rect">ສະຕ໋ອກ:{{storeInfo.stock ? storeInfo.stock : 0}}{{storeInfo.unit_name ? storeInfo.unit_name : ''}}</view>
											<view v-show="diyProduct.isOpen.includes(1)" class="skeleton-rect">ຂາຍແລ້ວ:{{storeInfo.sales ? storeInfo.sales : 0}}{{storeInfo.unit_name ? storeInfo.unit_name : ''}}</view>
										</view>
									</view>
									<navigator v-if="storeInfo.top_pid && diyProduct.showRank==1" hover-class='none' :url="`/pages/activity/rank/index?cate_id=${storeInfo.top_pid}`" class='label pad20'>
										<view class="rank_list aceab-row row-between-wrapper">
											<view class="acea-row row-between-wrapper">
												<view class="acea-row row-middle">
													<text class="rank_title" :style="'background-image: url('+domain+'/static/images/rank-top-title.png)'"></text>
													<text>{{ storeInfo.top_name }} · 第{{ storeInfo.top_num }}名</text>
												</view>

												<text class="iconfont icon-ic_rightarrow"></text>
											</view>
										</view>
									</navigator>
								</view>
							</view>
							<view v-if="(diyProduct.showCoupon==1 && coupon.list.length > 0) || diyProduct.serviceList.length>0" class="pad20">
								<view v-if="diyProduct.showCoupon==1 && coupon.list.length > 0" class='coupon acea-row row-between-wrapper skeleton-rect bg-f boder-24 mt20' @click='couponTap'>
									<view class='hide line1 acea-row'>
										ຄູປອງ：
										<view class='activity' v-for="(item,index) in coupon.list" :key="index">{{item.use_min_price == 0 ? 'ຮັບຄູປອງຫຼຸດທັນທີ'+item.coupon_price : 'ຊື້ຄົບ'+item.use_min_price+'ຫຼຸດ'+item.coupon_price}}</view>
									</view>
									<view class='iconfont icon-ic_rightarrow'></view>
								</view>
								<view v-if="diyProduct.serviceList.length>0" class="bg-f boder-24 mt20">
									<block v-for="(item,index) in diyProduct.serviceList" :key="index">
										<specSelect v-if="item.props == 'specSelect' && diyProduct.showService.includes(item.value) && storeInfo.type != 4" :attrTxt="attrTxt" :attrValue="attrValue" @selecAttr="selecAttr"></specSelect>
										<freight v-if="item.props == 'freight' && diyProduct.showService.includes(item.value)" :shippingValue="shippingValue" :shipping="shipping" @showShip="showShip"></freight>
										<serviceGuarantee v-if="item.props == 'serviceGuarantee' && diyProduct.showService.includes(item.value)" :guarantee="guarantee" @showGuaranee="showGuaranee"></serviceGuarantee>
										<parameter v-if="item.props == 'parameter' && diyProduct.showService.includes(item.value)" :specsInfo="specsInfo" @seeSpecs="seeSpecs"></parameter>
									</block>
								</view>
							</view>
							<view class="pad20">
								<!--优惠套餐-->
								<view class='combo boder-24 bg-f mt20' v-if="comboList && comboList.length>0 && diyProduct.showMatch==1">
									<view class='title acea-row row-between-wrapper'>
										<view>ຊຸດໂປຣໂມຊັນ({{comboTotal}}) </view>
										<view class='praise' @click="openCombo">
											<text class='iconfont icon-ic_rightarrow'></text>
										</view>
									</view>
									<scroll-view scroll-x="true" style="white-space: nowrap; display: flex;height: 180rpx;" show-scrollbar="false">
										<view class="img-box">
											<block v-for="(item,index) in comboList" :key="index">
												<view class="combo_item">
													<view class="img-item" v-for="(itemn,indexn) in item.discountsProduct" :key="indexn">
														<image :src="itemn.image" mode="" @click="openCombo"></image>
														<text v-if="indexn != item.count-1" class="iconfont icon-ic_increase"></text>
													</view>
													<view class="list_total">
														<view class="list_num">ລວມ{{item.count}}ຊິ້ນ</view>
														<view class="list_price p-color">ປະຢັດ ₭{{item.max_price}}</view>
													</view>
												</view>
											</block>
										</view>
									</scroll-view>
								</view>
								<view class='userEvaluation boder-24' id="past1" v-if="replyCount && replyCount>0 && diyProduct.showReply==1">
									<view class='title acea-row row-between-wrapper skeleton-rect'>
										<view>ການປະເມີນຂອງຜູ້ໃຊ້({{replyCount}})</view>
										<navigator class='praise' hover-class='none' :url='"/pages/users/goods_comment_list/index?product_id="+id'>
											<text class='t-color'>{{replyChance}}</text>ອັດຕາຄວາມພໍໃຈ
											<text class='iconfont icon-ic_rightarrow'></text>
										</navigator>
									</view>
									<block v-if="replyCount && replyCount>0">
										<userEvaluation :reply="reply" :oneLine="true"></userEvaluation>
									</block>
								</view>
								<!-- 种草秀 -->
								<view class='userPlant boder-24 mt20' v-if="community_status==1 && storeInfo.community && storeInfo.community.length>0 && diyProduct.showCommunity == 1">
									<view class='title acea-row row-between-wrapper'>
										<view>ການສະແດງ({{storeInfo.community.length}})</view>
										<navigator class='praise' hover-class='none' :url="'/pages/plantGrass/plant_show/index?spu_id='+storeInfo.spu_id">
											ເບິ່ງທັງໝົດ
											<text class='iconfont icon-ic_rightarrow'></text>
										</navigator>
									</view>
									<view class="imgList acea-row">
										<view class="pictrue" v-for="(item, index) in storeInfo.community" :key="index" v-if="index<=2"
										 @click="goPlant(item)">
											<image :src="item.image[0]" class="image"></image>
											<view v-if="item.is_type == 2" class="video_img">
												<text class="iconfont icon-ic_right2"></text>
											</view>
										</view>
									</view>
								</view>
								<!-- 商铺信息 -->
								<view class="store-wrapper bg-f boder-24" v-if="storeInfo.merchant && hide_mer_status !=1">
									<view v-if="diyProduct.showStore==1" class="store-hd skeleton-rect">
										<view v-if="storeInfo.merchant&&hide_mer_status != 1" class="store-info">
											<navigator :url="'/pages/store/home/index?id='+storeInfo.mer_id" hover-class="none" class="logo">
												<image :src="storeInfo.merchant.mer_avatar" mode=""></image>
											</navigator>
											<navigator :url="'/pages/store/home/index?id='+storeInfo.mer_id" hover-class="none" class="info">
												<view class="name line1">
													<text>{{storeInfo.merchant.mer_name ? storeInfo.merchant.mer_name : ''}}</text>
													<image v-if="margin_ico_switch==1 && margin_ico && storeInfo.merchant.is_margin == 10" :src="margin_ico" class="store-margin"></image>
													<text v-if="storeInfo.merchant.type_name" class="font-bg-red ml8 bt-color">{{storeInfo.merchant.type_name}}</text>
													<text v-else-if="storeInfo.merchant.is_trader" class="font-bg-red ml8 bt-color">自营</text>
												</view>
												<view v-if="storeInfo.merchant.care_count" class="txt">
													{{storeInfo.merchant.care_count < 10000 ? storeInfo.merchant.care_count : (storeInfo.merchant.care_count/10000).toFixed(2)+'ໝື່ນ'}}ຄົນຕິດຕາມ
												</view>
												<view v-else class="txt">0ຄົນຕິດຕາມ</view>
											</navigator>
											<navigator v-if="hide_mer_status != 1" :url="'/pages/store/home/index?id='+storeInfo.mer_id" class="link"
											 hover-class="none">ເຂົ້າຮ້ານ</navigator>
										</view>
										<view class="score-wrapper">
											<view class="item">
												ລາຍລະອຽດສິນຄ້າ<text>{{storeInfo.merchant.product_score}}</text>
											</view>
											<view class="item">
												ການບໍລິການຂອງຜູ້ຂາຍ<text>{{storeInfo.merchant.service_score}}</text>
											</view>
											<view class="item">
												ການບໍລິການຂົນສົ່ງ<text>{{storeInfo.merchant.postage_score}}</text>
											</view>
										</view>
									</view>
									<view v-if="recommend && recommend.length > 0 && diyProduct.showRecommend==1" class="con-box">
										<view class="acea-row row-between">
											<view class="title">店铺推荐</view>
										</view>
										<view class="swiper page_swiper" :style="'height:'+swiperHeight+'rpx'">
											<swiper
											 indicator-dots="true"
											 :autoplay="false"
											 :circular="circular"
											 :interval="interval"
											 :duration="duration"
											 :current="swiperCur"
											  style="width:750rpx;"
											  :style="'height:'+swiperHeight+'rpx'"
											 >
												<block v-for="(item,index) in recommend" :key="index">
													<swiper-item class="swiper-item">
														<view class="img-box">
															<view class="img-item" v-for="(itm,idx) in item" :key="idx" @click="goProDetail(itm)">
																<image :src="itm.image"></image>
																<view class="txt">
																	<view class="title line1">{{itm.store_name}}</view>
																	<view class="price">
																		<priceFormat :price="itm.price" weight intSize="28" floatSize="20" labelSize="20"></priceFormat>
																	</view>
																</view>
															</view>
														</view>
													</swiper-item>
												</block>
											</swiper>
										</view>
									</view>
								</view>
								<view class='product-intro' id="past3">
									<view class='title'>ແນະນຳສິນຄ້າ</view>
									<view class='conter' v-if="description">
										<!-- #ifndef APP-PLUS -->
										<jyf-parser v-if="description.type == 0" :domain='domain' :html="description.content.replace(/<br\/>/ig, '')" ref="article" :tag-style="tagStyle"></jyf-parser>
										<!-- #endif -->
										<!-- #ifdef APP-PLUS -->
										<view v-if="description.type == 0" class="description" v-html="description.content.replace(/<br\/>/ig, '')"></view>
										<!-- #endif -->
										<view v-else class="product_content">
											<view v-if="description.content && description.content.title" class="title">{{description.content.title}}</view>
											<view v-if="description.content && description.content.image" class="pictures">
												<image v-for="(item,index) in description.content.image" :key="index" :src="item"></image>
											</view>
										</view>
									</view>
									<!-- 价格说明 -->
									<view v-if="priceRule.content" class="price-info">
										<view class="price-title">{{priceRule.rule_name}}</view>
										<!-- #ifndef APP-PLUS -->
										<jyf-parser :domain='domain' :html="priceRule.content.replace(/<br\/>/ig, '')" ref="article" :tag-style="tagStyle"></jyf-parser>
										<!-- #endif -->
										<!-- #ifdef APP-PLUS -->
										<view class="description" v-html="priceRule.content.replace(/<br\/>/ig, '')"></view>
										<!-- #endif -->
									</view>
								</view>
								<view class="content-height"></view>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
			<view class='footer acea-row row-between-wrapper' :class="{'footpl':hide_mer_status==1}">
				<block v-if="diyProduct.footerList.length>0">
					<block v-for="(item,index) in diyProduct.footerList" :key="index">
						<view v-if="diyProduct.menuList.includes(item.value) || (item.value==0 && diyProduct.menuList.includes(item.value)&& hide_mer_status !=1)" class="item skeleton-rect" @click="goMenu(item.value)">
							<view class="iconfont" :class="[`${item.icon}`, { 'icon-ic_star1': storeInfo.isRelation&&item.value==3 }]">
								<text v-if="item.value==2&&CartCount>0" class='num'>{{CartCount || 0}}</text>
							</view>
							<view>{{item.label}}</view>
						</view>
					</block>
				</block>
				<!--  -->
				<view v-if="attr.productSelect.stock != 0 || storeInfo.type == 4" class='bnt acea-row skeleton-rect'>
					<form v-if="diyProduct.showCart" @submit="joinCart" report-submit='true'>
						<button v-if="storeInfo.type != 1&&storeInfo.type != 2&&storeInfo.type != 3&&storeInfo.type != 4&&!storeInfo.mer_form_id" class='joinCart bnts' :class="'w_buy'+diyProduct.menuList.length" form-type="submit">ເພີ່ມເຂົ້າກະຕ່າ</button>
					</form>
					<form @submit="goBuy" report-submit='true' v-if="attr.productSelect">
						<button class='buy bnts' :class="(storeInfo.type == 1 || storeInfo.type == 2 || storeInfo.type == 3 || storeInfo.type == 4 || storeInfo.mer_form_id || !diyProduct.showCart) ? 'virtual_buy virtual_buy'+diyProduct.menuList.length : 'w_buy'+diyProduct.menuList.length" form-type="submit" :disabled="attr.productSelect.stock == 0 && storeInfo.type!=4">ຊື້ດຽວນີ້</button>
					</form>
				</view>
				<view v-else class='bnt acea-row skeleton-rect'>
					<form report-submit='true'>
						<button v-if="procudt_increase_status == 1" class='buy bnts sold_out' :class="'sold_out'+diyProduct.menuList.length" form-type="submit" @click="arrivalNotice">ແຈ້ງເຕືອນເມື່ອສິນຄ້າມາເຖິງ</button>
						<button v-else class='buy bnts sold_out' :class="'sold_out'+diyProduct.menuList.length" form-type="submit" disabled>ສິນຄ້າໝົດແລ້ວ</button>
					</form>
				</view>
			</view>
			<block v-if="promoter.extension_pop==1">
				<shareRedPackets :sharePacket="sharePacket" @listenerActionSheet="listenerActionSheet" @closeChange="closeChange"
				 :showAnimate="showAnimate" @boxStatus="boxStatus"></shareRedPackets>
			</block>
			<!-- 组件 -->
			<productWindow :attr="attr" :isShow='diyProduct.isOpen.includes(2) ? true : false' :iSplus='1' :isCustom="true" :productType="storeInfo.type" @myevent="onMyEvent" @ChangeAttr="ChangeAttr" @ChangeCartNum="ChangeCartNum"
			 @attrVal="attrVal" @iptCartNum="iptCartNum" id='product-window' :payLimit="pay_limit" :maxCount="max_count" :minCount="min_count" :svipPrice="svipPrice" :image="storeInfo.image"></productWindow>
			<block v-if="coupon.coupon">
				<couponListWindow :coupon='coupon' @ChangCouponsClose="ChangCouponsClose" @ChangCoupons="ChangCoupons"
				 @ChangCouponsUseState="ChangCouponsUseState"></couponListWindow>
			</block>
			<specs :specsInfo="specsInfo" @myevent="mySpecs"></specs>
			<!-- 分享按钮 -->
			<view class="generate-posters acea-row row-middle" :class="posters ? 'on' : ''">
				<!-- #ifndef MP -->
				<button class="item" :class="weixinStatus ? 'item3' : ''" hover-class='none' v-if="weixinStatus === true" @click="H5ShareBox = true">
					<view class="iconfont icon-ic_wechat"></view>
					<view class="">ສົ່ງໃຫ້ໝູ່ເພື່ອນ</view>
				</button>
				<!-- #endif -->
				<!-- #ifdef MP -->
				<button class="item" :class="weixinStatus ? 'item3' : ''" open-type="share" hover-class='none' @click="goFriend">
					<view class="iconfont icon-ic_wechat"></view>
					<view class="">ສົ່ງໃຫ້ໝູ່ເພື່ອນ</view>
				</button>
				<!-- #endif -->
				<!-- #ifdef APP-PLUS -->
				<view class="item" @click="appShare('WXSceneSession')">
					<view class="iconfont icon-ic_wechat"></view>
					<view class="">ແບ່ງປັນໃຫ້ໝູ່ເພື່ອນ</view>
				</view>
				<!-- #endif -->
				<button class="item" :class="weixinStatus ? 'item3' : ''" hover-class='none' @click="downloadFilePromotionCode">
					<view class="iconfont icon-a-ic_picture1"></view>
					<view class="">ສ້າງໂປສເຕີ</view>
				</button>
				<button class="item" :class="weixinStatus ? 'item3' : ''" hover-class='none' @click="copyPwd">
					<view class="iconfont icon-ic_key"></view>
					<view>ສ້າງລະຫັດ</view>
				</button>
			</view>
			<view class="mask" v-if="posters" @click="listenerActionClose"></view>
			<view class="mask_transparent" v-if="currentPage" @touchmove="hideNav" @click="hideNav()"></view>
			<!--口令复制结果-->
			<copyPassword :isCopy='isCopy' :copyUrl='copyUrl' @close="closeCopy"></copyPassword>
			<!-- 海报展示 -->
			<view class='poster-pop' v-if="posterImageStatus">
				<image src='../../static/images/poster-close.png' class='close' @click="posterImageClose"></image>
				<image :src='posterImage'></image>
				<!-- #ifndef H5  -->
				<view class='save-poster' @click="savePosterPath">ບັນທຶກລົງໂທລະສັບ</view>
				<!-- #endif -->
				<!-- #ifdef H5 -->
				<view class="keep">ກົດຄ້າງຮູບພາບເພື່ອບັນທຶກລົງໂທລະສັບ</view>
				<!-- #endif -->
			</view>
			<view class='mask' v-if="posterImageStatus"></view>
			<canvas class="canvas" canvas-id='myCanvas' v-if="canvasStatus"></canvas>
			<!-- 发送给朋友图片 -->
			<view class="share-box" v-if="H5ShareBox">
				<image :src="`${domain}/static/images/share-info.png`" @click="H5ShareBox = false"></image>
			</view>
			<guaranteeTemplate ref="guartemplate" :guarantee='guarantee' :shipping='shipping'></guaranteeTemplate>
			<!-- #ifndef H5 -->
			<passwordPopup></passwordPopup>
			<!-- #endif -->
			<!--套餐产品弹窗-->
			<discounts-goods ref="discounts" :uid="uid" :showNum="diyProduct.communityNum" :diyProduct="diyProduct"></discounts-goods>
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
	var sysHeight = uni.getSystemInfoSync().statusBarHeight;
	import { arrivalSubscribe } from '@/utils/SubscribeMessage.js';
	import {
		getProductDetail,
		getProductParmas,
		getProductCode,
		collectAdd,
		collectDel,
		postCartAdd,
		arrivalNoticeApi,
		copyPasswordApi,
		getDiscountsLst,
		priceRuleApi,
		getStoreRecommend
	} from '@/api/store.js';
	import { getUserInfo, imgToBase } from '@/api/user.js';
	import { getCoupons,getShopCoupons } from '@/api/api.js';
	import { getCartCounts } from '@/api/order.js';
	import { mapGetters } from "vuex";
	import { configMap, getCustomer } from "@/utils";
	import { imageBase64 } from "@/api/public";
	import productConSwiper from '@/components/productConSwiper';
	import couponListWindow from '@/components/couponListWindow';
	import copyPassword from '@/components/copyPassword';
	import productWindow from '@/components/productWindow';
	import userEvaluation from '@/components/userEvaluation';
	import shareRedPackets from '@/components/shareRedPackets';
	import specs from '@/components/specs/index.vue';
	import Cache from '@/utils/cache';
	import { toLogin } from '@/libs/login.js';
	// #ifndef H5
	import passwordPopup from '@/components/passwordPopup';
	// #endif
	import freight from '@/components/freight';
	import parameter from '@/components/parameter';
	import serviceGuarantee from '@/components/serviceGuarantee';
	import specSelect from '@/components/specSelect';
	import homeList from '@/components/homeList';
	import { HTTP_REQUEST_URL } from '@/config/app';
	import { CART_TIME,CART_ID} from '@/config/cache';
	import { silenceBindingSpread } from "@/utils";
	import parser from "@/components/jyf-parser/jyf-parser";
	import shareScence from "@/libs/spread";
	import guaranteeTemplate from '@/components/freightGuarantee';
	import discountsGoods from './discountsGoods';
	import { getProductPromotionType, getProductTagList } from "@/utils/product";
	let app = getApp();
	export default {
		components: {
			// #ifndef H5
			passwordPopup,
			// #endif
			productConSwiper,
			couponListWindow,
			productWindow,
			userEvaluation,
			shareRedPackets,
			guaranteeTemplate,
			copyPassword,
			discountsGoods,
			"jyf-parser": parser,
			specs,
			parameter,
			freight,
			serviceGuarantee,
			specSelect,
			homeList
		},
		data() {
			let that = this;
			return {
				isNodes: 0, //控制什么时候开始抓取元素节点,只要数值改变就重新抓取
				sysHeight: sysHeight, //系统导航条高度
				//属性是否打开
				coupon: {
					'coupon': false,
					list: [],
				},
				attrTxt: '选择', //属性页面提示
				attrValue: '', //已选属性
				animated: false, //购物车动画
				id: 0, //商品id
				replyCount: 0, //总评论数量
				reply: [], //评论列表
				storeInfo: {
					merchant: {}
				}, //商品详情
				productValue: [], //系统属性
				couponList: [], //优惠券
				cart_num: 1, //购买数量
				isOpen: false, //是否打开属性组件
				actionSheetHidden: true,
				posterImageStatus: false,
				storeImage: '', //海报产品图
				PromotionCode: '', //二维码图片
				canvasStatus: false, //海报绘图标签
				posterImage: '', //海报路径
				posterbackgd: '/static/images/posterbackgd.png',
				source: '',
				sharePacket: {
					isState: true, //默认不显示
				}, //分销商详细
				// uid: 0, //用户uid
				circular: false,
				autoplay: false,
				interval: 3000,
				duration: 500,
				swiperCur: 0,
				clientHeight: "",
				systemStore: {}, //门店信息
				replyChance: 0,
				CartCount: 0,
				storeSelfMention: true,
				posters: false,
				weixinStatus: false,
				attr: {
					cartAttr: false,
					productAttr: [],
					productSelect: {}
				},
				description: {},
				navActive: 0,
				H5ShareBox: false, //公众号分享图片
				activity: [],
				retunTop: true, //顶部返回
				navH: "",
				navList: [],
				opacity: 0,
				scrollY: 0,
				topArr: [],
				toView: '',
				height: 0,
				heightArr: [],
				lock: false,
				scrollTop: 0,
				tagStyle: {
					img: 'width:100%;display:block;'
				},
				// 动画状态
				showAnimate: true,
				domain: HTTP_REQUEST_URL,
				currSpid: '',
				codeImg: "",
				videoCoverImg: "",
				shipping: "",
				guarantee: [],
				shippingValue: "",
				uniqueValue: "",
				priceRule: "",
				isCopy: false,
				copyUrl: '',
				comboTotal: 0,
				comboList: [],
				max_count: 0,
				min_count: 0,
				pay_limit: 1,
				svipData: {},
				svipPrice: false,
				specsInfo: {
				  show: false,
				  params: []
				},
				recommend: [],
				serviceInfo: {},
				promoter: {},
				currentPage: false,
				homeTop: 59,
				homeLeft: 30,
				marketPrice: "",
				swiperHeight: "760",
				goodCoupon: [], // 商品专属优惠券
			};
		},
		computed:{
			...configMap(['margin_ico_switch','community_status','margin_ico','hide_mer_status','procudt_increase_status','site_name','share_pic'],
			mapGetters(['isLogin','uid','viewColor','diyProduct'])),
			promotionType() {
				if (!this.storeInfo.product_id) return null;
				return getProductPromotionType(this.storeInfo);
			},
			tagList() {
				if (!this.storeInfo.product_id) return [];
				return getProductTagList({
					...this.storeInfo,
					issetCoupon: this.goodCoupon[0]
				});
			}
		},
		onLoad(options) {
			let that = this
			if (options.spid) {
				app.globalData.spid = options.spid;
				that.currSpid = options.spid
			}
			var pages = getCurrentPages();
			let curPage = pages[pages.length - 1];
			if (pages.length <= 1) {
				that.retunTop = false
			}
			let curParam = curPage.options || curPage.$route.query;
			that.source = curParam.source;
			that.navH = app.globalData.navHeight+10;
			//页面中需要计算的一些值
			// #ifdef APP-PLUS
			that.homeTop = (that.sysHeight + 8)*2;
			// #endif
			// #ifdef H5
			that.homeTop = 0;
			// #endif
			that.id = options.id;
			uni.getSystemInfo({
				success: function(res) {
					that.height = res.windowHeight
					//res.windowHeight:获取整个窗口高度为px，*2为rpx；98为头部占据的高度；
					that.navHeight = res.statusBarHeight * (750 / res.windowWidth) + 91;
				},
			});
			//扫码携带参数处理
			// #ifdef MP
			if (options.scene) {
				let value = this.$util.getUrlParams(decodeURIComponent(options.scene));
				if (value.id) options.id = value.id;
				//记录推广人uid
				if (value.spid) {
					app.globalData.spid = value.spid;
					that.currSpid = value.spid
				}
			}
			if (!options.id && !options.scene) {
				return this.$util.Tips({
					title: 'ບໍ່ພົບພາລາມິເຕີ, ບໍ່ສາມາດເບິ່ງສິນຄ້າໄດ້'
				}, {
					tab: 3,
					url: 1
				});
			} else {
				this.id = options.id
			}
			//记录推广人uid
			if (options.spid) app.globalData.spid = options.spid;
			// #endif
			shareScence(that.currSpid, that.isLogin)

			// 通过vuex获取并储存商品详情,商品分类可视化的数据
			that.$store.dispatch("getDiyProduct");
			//#ifdef H5
			this.isLogin && silenceBindingSpread();
			//#endif
		},
		onReady() {
			this.isNodes++;
			this.$nextTick(function() {
				// #ifdef MP
				const menuButton = uni.getMenuButtonBoundingClientRect();
				const query = uni.createSelectorQuery().in(this);
				this.homeLeft = menuButton.left-38+'px';
				query
					.select('#home')
					.boundingClientRect(data => {
						this.homeTop = menuButton.top * 2 + menuButton.height - data.height;
					})
					.exec();
				// #endif
			});
		},
		onShow() {
			this.getGoodsDetails();
		},
		/**
		 * 用户点击右上角分享
		 */
		// #ifdef MP
		onShareAppMessage: function() {
			let that = this;
			that.$set(that, 'actionSheetHidden', !that.actionSheetHidden);
			return {
				title: that.storeInfo.store_name || '',
				imageUrl: that.storeInfo.image || '',
				path: '/pages/goods_details/index?id=' + that.id + '&spid=' + that.uid,
			}
		},
		onShareTimeline: function() {
			let that = this;
			that.$set(that, 'actionSheetHidden', !that.actionSheetHidden);
			return {
				title: that.storeInfo.store_name || '',
				query: {
					id: that.id,
					spid: that.uid
				},
				imageUrl: that.storeInfo.image || ''
			}
		},
		// #endif
		methods: {
			/**到货通知*/
			arrivalNotice(){
				let that = this;
				// #ifdef MP
				arrivalSubscribe().then((res) => {
					that.arrivalNoticeFun();
				}).catch(err => {
					console.log(err)
				});
				// #endif
				// #ifndef MP
				that.arrivalNoticeFun();
				// #endif
			},
			arrivalNoticeFun(){
				let that = this;
				let uniqueValue = that.uniqueValue;
				let typeValue = 0;
				// #ifdef MP
				typeValue = 3
				// #endif
				// #ifdef H5
				if(this.$wechat.isWeixin() === true){
					typeValue = 2
				}else{
					typeValue = 1
				}
				// #endif
				arrivalNoticeApi({ unique: uniqueValue,type:typeValue,product_id: that.id }).then(res => {
					return that.$util.Tips({
						title: res.message
					})
				}).catch(err => {
					//状态异常返回上级页面
					return that.$util.Tips({
						title: err
					})
				})
			},
			goProDetail(item) {
				uni.redirectTo({
					url: '/pages/goods_details/index?id=' + item.product_id
				})
			},
			boxStatus(data) {
				this.showAnimate = data
			},
			closeChange: function() {
				this.$set(this.sharePacket, 'isState', true);
			},
			showNav() {
				this.currentPage = !this.currentPage;
			},
			hideNav() {
				this.currentPage = false;
			},
			/**查看运费说明*/
			showShip: function() {
				this.$refs.guartemplate.showShippingTel();
			},
			/**查看服务保障*/
			showGuaranee: function() {
				this.$refs.guartemplate.showGuaranteeTel();
			},
			/*查看套餐详情*/
			openCombo(){
				this.$refs.discounts.showPopup(this.id);
			},
			seeSpecs() {
			  this.specsInfo.show = true;
			},
			mySpecs() {
			  this.$set(this.specsInfo, 'show', false);
			},
			/*获取套餐列表数据*/
			getDiscountsData(){
				getDiscountsLst({product_id: this.id,limit: this.diyProduct.communityNum}).then(res => {
					this.comboTotal = res.data.count;
					res.data.list.forEach((item, index) => {
						item.save_price = 0;
						item.discountsProduct.forEach((v, i) => {
							item.save_price += parseFloat(v.product.ot_price) - parseFloat(v.product.price)
						})
					})
				  this.comboList = res.data.list;
				}).catch(err => {

				});
			},
			/*获取价格说明*/
			getPricrRule() {
				priceRuleApi(this.storeInfo.cate_id).then(res => {
					this.priceRule = res.data
				}).catch(err => {

				});
			},
			/**
			 * 购物车手动填写
			 *
			 */
			iptCartNum: function(e) {
				this.$set(this.attr.productSelect, 'cart_num', e);
			},
			// 后退
			returns: function() {
				uni.navigateBack()
			},
			// 首页
			goHome() {
				uni.switchTab({
					url: '/pages/index/index'
				});
			},
			// 种草详情
			goPlant(item){
				if(item.is_type == 1){
					uni.navigateTo({
						url: '/pages/plantGrass/plant_detail/index?id='+item.community_id
					});
				}else{
					uni.navigateTo({
						//#ifdef APP
						url: '/pages/short_video/appSwiper/index?id='+item.community_id+'&tab=1'
						//#endif
						//#ifndef APP
						url: '/pages/short_video/nvueSwiper/index?id='+item.community_id+'&tab=1'
						//#endif
					});
				}
			},
			tap: function(index) {
				var id = "past" + index;
				var index = index;
				var that = this;
				this.$set(this, 'toView', id);
				this.$set(this, 'navActive', index);
				this.$set(this, 'lock', true);
				this.$set(this, 'scrollTop', index > 0 ? that.topArr[index] - (app.globalData.navHeight / 2) : that.topArr[index]);
			},
			scroll: function(e) {
				var that = this,
				scrollY = e.detail.scrollTop;
				var opacity = scrollY / 200;
				opacity = opacity > 1 ? 1 : opacity;
				that.$set(that, 'showAnimate', false);
				that.$set(that, 'opacity', opacity);
				that.$set(that, 'scrollY', scrollY);
				if (that.lock) {
					that.$set(that, 'lock', false)
					return;
				}
				for (var i = 0; i < that.topArr.length; i++) {
					if (scrollY < that.topArr[i] - (app.globalData.navHeight / 2) + that.heightArr[i]) {
						that.$set(that, 'navActive', i)
						break
					}
				}
				uni.$emit('scroll');
			},
			ChangCouponsClose: function() {
				this.$set(this.coupon, 'coupon', false)
			},
			/**
			 * 购物车数量加和数量减
			 *
			 */
			ChangeCartNum: function(changeValue) {
				//changeValue:是否 加|减
				//获取当前变动属性
				let productSelect = this.productValue[this.attrValue];
				//如果没有属性,赋值给商品默认库存
				if (productSelect === undefined && !this.attr.productAttr.length)
					productSelect = this.attr.productSelect;
				//无属性值即库存为0；不存在加减；
				if (productSelect === undefined) return;
				let stock = productSelect.stock || 0;
				let num = this.attr.productSelect;
				if (changeValue) {
					num.cart_num++;
					if (num.cart_num > stock) {
						this.$set(this.attr.productSelect, "cart_num", stock);
						this.$set(this, "cart_num", stock);
					}
					if(num.cart_num > this.storeInfo.once_max_count&&this.storeInfo.once_max_count!=0&&this.storeInfo.pay_limit!=0){
						this.$set(this.attr.productSelect, "cart_num", this.storeInfo.once_max_count);
						this.$set(this, "cart_num", this.storeInfo.once_max_count);
						return this.$util.Tips({
							title: "ຈຳນວນການສັ່ງຊື້ແຕ່ລະຄັ້ງຕ້ອງບໍ່ເກີນ "+this.storeInfo.once_max_count+" ອັນ!"
						});
					}
				} else {
					num.cart_num--;
					if (num.cart_num < 1) {
						this.$set(this.attr.productSelect, "cart_num", 1);
						this.$set(this, "cart_num", 1);
					}
					if(num.cart_num < this.storeInfo.once_min_count&&this.storeInfo.once_min_count!=0){
						this.$set(this.attr.productSelect, "cart_num", this.storeInfo.once_min_count);
						this.$set(this, "cart_num", this.storeInfo.once_min_count);
						return this.$util.Tips({
							title: "ຈຳນວນການສັ່ງຊື້ແຕ່ລະຄັ້ງຕ້ອງບໍ່ຫຼຸດ "+this.storeInfo.once_min_count+" ອັນ!"
						});
					}
				}
			},
			attrVal(val) {
				this.$set(this.attr.productAttr[val.indexw], 'index', this.attr.productAttr[val.indexw].attr_values[val.indexn]);
			},
			/**
			 * 属性变动赋值
			 *
			 */
			ChangeAttr: function(res) {
				let productSelect = this.productValue[res];
				if(productSelect)this.$set(this, "uniqueValue", productSelect.unique);
				if (productSelect && productSelect.stock > 0) {
					this.$set(this.attr.productSelect, "image", productSelect.image ? productSelect.image : this.storeInfo.image);
					this.$set(this.attr.productSelect, "price", productSelect.price);
					this.$set(this.attr.productSelect, "svip_price", productSelect.svip_price);
					this.$set(this.attr.productSelect, "stock", productSelect.stock);
					this.$set(this.attr.productSelect, "unique", productSelect.unique);
					this.$set(this.attr.productSelect, "value_id", productSelect.value_id);
					this.$set(this, "uniqueValue", productSelect.unique);
					this.$set(this, "marketPrice", productSelect.ot_price);
					this.$set(this, "attrValue", res);
					this.$set(this, "attrTxt", "ເລືອກ");
				}
				else {
					this.$set(this.attr.productSelect, "image", productSelect.image);
					this.$set(this.attr.productSelect, "price", productSelect.price);
					this.$set(this.attr.productSelect, "svip_price", productSelect.svip_price);
					this.$set(this.attr.productSelect, "stock", 0);
					this.$set(this.attr.productSelect, "unique", productSelect.unique);
					this.$set(this.attr.productSelect, "value_id", productSelect.value_id);
					this.$set(this.attr.productSelect, "cart_num", 0);
					this.$set(this, "marketPrice", productSelect.ot_price);
					this.$set(this, "attrValue", res);
					this.$set(this, "attrTxt", "ເລືອກ");
					this.$set(this.attr.productSelect, "cart_num", 0);
				}
			},
			/**
			 * 领取完毕移除当前页面领取过的优惠券展示
			 */
			ChangCoupons: function(e) {
				let coupon = e;
				let couponList = this.$util.ArrayRemove(this.couponList, 'id', coupon.id);
				this.$set(this, 'couponList', couponList);
				this.getCouponList();
			},
			setClientHeight: function() {
				let that = this;
				let view = uni.createSelectorQuery().in(this).select("#list0");
				view.fields({
					size: true,
				}, data => {
					that.$set(that, 'clientHeight', data.height + 20)
				}).exec();
			},
			/**
			 * 获取产品详情
			 *
			 */
			getGoodsDetails: function() {
				uni.showLoading({
					title: 'ກຳລັງໂຫຼດ...',
					mask: true
				});
				let that = this;
				getProductDetail(that.id,{pid: that.currSpid}).then(res => {
					uni.hideLoading();
					let storeInfo = res.data;
					if (storeInfo.video_link && storeInfo.slider_image.length > 1) {
						this.videoCoverImg = storeInfo.slider_image[0]
						storeInfo.slider_image.shift()
					} else if (storeInfo.video_link && storeInfo.slider_image.length === 1) {
						this.videoCoverImg = storeInfo.slider_image[0]
					}
					that.$set(that, 'storeInfo', storeInfo);
					that.$set(that, 'reply', res.data.topReply ? [res.data.topReply] : []);
					that.$set(that, 'replyCount', res.data.replayData && res.data.replayData.count);
					that.$set(that, 'replyChance', res.data.replayData && res.data.replayData.rate);
					that.$set(that.attr, 'productAttr', res.data.attr);
					that.$set(that, 'productValue', res.data.sku);
					that.$set(that, 'promoter', res.data.promoter);
					that.$set(that.sharePacket, 'max', res.data.max_extension);
					that.$set(that.sharePacket, 'min', res.data.min_extension);
					that.$set(that, 'systemStore', res.data.system_store);
					that.$set(that, 'storeSelfMention', res.data.store_self_mention);
					that.$set(that, 'PromotionCode', storeInfo.code_base);
					that.$set(that, 'activity', res.data.activity ? res.data.activity : []);
					that.$set(that, 'max_count', res.data.once_max_count);
					that.$set(that, 'pay_limit', res.data.pay_limit);
					that.$set(that, 'min_count', res.data.once_min_count);
					that.$set(that, 'svipData', res.data.show_svip_info || null);
					that.$set(that, 'svipPrice', res.data.show_svip_info && res.data.show_svip_info.show_svip_price || false);
					uni.setNavigationBarTitle({
						title: storeInfo.store_name.substring(0, 7) + "..."
					})
					that.$set(that, 'storeImage', that.storeInfo.image);
					getProductParmas(that.id).then((res) => {
						that.$set(that, 'description', res.data.content);
						if (that.description&&that.description.type == 0) {
							that.description.content = that.description.content.replace(
								/<img/gi,
								'<img style="max-width:100%;height:auto;float:left;display:block" '
							);
							that.description.content = that.description.content.replace(
								/<video/gi,
								'<video style="width:100%;height:300px;display:block" '
							);
						}
						that.$set(that, 'guarantee', res.data.guarantee ? res.data.guarantee : []);
						that.$set(that, 'shippingValue', res.data.temp ? res.data.temp.name : '');
						that.$set(that, 'shipping', res.data.temp ? res.data.temp.info : '');
						that.$set(that.specsInfo, 'params', res.data.params);
						that.$set(that.storeInfo, 'merchant', res.data.merchant);
						that.$set(that.storeInfo, 'spu_id', res.data.spu_id);
						that.$set(that.storeInfo, 'community', res.data.community);
						that.$set(that.storeInfo, 'atmosphere_pic', res.data.atmosphere_pic);
						that.$set(that.storeInfo, 'top_pid', res.data.top_pid);
						that.$set(that.storeInfo, 'top_num', res.data.top_num);
						that.$set(that.storeInfo, 'top_name', res.data.top_name);

					})
					that.getRecommendGoods();
					that.getDiscountsData();
					that.getCartCount();
					// #ifdef H5
					that.ShareInfo();
					// #endif
					setTimeout(function() {
						that.infoScroll();
					}, 500);
					that.DefaultSelect();
					that.getPricrRule(that.storeInfo.cate_id)
					that.$nextTick(function() {
						that.getCouponList();
					})
				}).catch(err => {
					//状态异常返回上级页面
					return that.$util.Tips({
						title: err
					}, {
						tab: 3,
						url: 1
					});
				})
			},
			/**获取店铺推荐商品*/
			getRecommendGoods() {
				let that = this
				getStoreRecommend({
					product_id: that.id,
					recommend_num: that.diyProduct.recommendNum
				}).then(res => {
					var recommendArr = [];
					that.swiperHeight = (res.data.length>=6 || res.data.length%6>3) ? '760' : '395';
					for(var i=0,len=res.data.length;i<len;i+=6){
						recommendArr.push(res.data.slice(i,i+6));
					}
					that.recommend = recommendArr
				}).catch(err=>{
					that.$util.Tips({
						title: err
					});
				})
			},
			infoScroll: function() {
				var that = this,
					topArr = [],
					heightArr = [];
				for (var i = 0; i < that.navList.length; i++) { //productList
					//获取元素所在位置
					var query = uni.createSelectorQuery().in(this);
					var idView = "#past" + i;
					query.select(idView).boundingClientRect();
					query.exec(function(res) {
						var top = res[0].top;
						var height = res[0].height;
						topArr.push(top);
						heightArr.push(height);
						that.$set(that, 'topArr', topArr);
						that.$set(that, 'heightArr', heightArr);
					});
				};
			},
			/**
			 * 默认选中属性
			 *
			 */
			DefaultSelect: function() {
				let productAttr = this.attr.productAttr;
				let value = [];
				let arr = []
				let unSortArr = []
				let found = false;
				for (var key in this.productValue) {
					if (this.productValue[key].is_default_select == 1) {
						value = this.attr.productAttr.length ? key.split(",") : [];
						found = true
						break;
					}
				}
				if(!found) {
					for (var key in this.productValue) {
						value = this.attr.productAttr.length ? key.split(",") : [];
						found = true
						break;
					}
				}
				for (let i = 0; i < productAttr.length; i++) {
					this.$set(productAttr[i], "index", value[i]);
				}
				//sort();排序函数:数字-英文-汉字；
				let productSelect = this.productValue[value.join(",")];
				if (productSelect && productAttr.length) {
					this.$set(
						this.attr.productSelect,
						"store_name",
						this.storeInfo.store_name
					);
					this.$set(this.attr.productSelect, "image", productSelect.image ? productSelect.image : this.storeInfo.image);
					this.$set(this.attr.productSelect, "price", productSelect.price);
					this.$set(this.attr.productSelect, "svip_price", productSelect.svip_price);
					this.$set(this.attr.productSelect, "stock", productSelect.stock);
					this.$set(this.attr.productSelect, "unique", productSelect.unique);
					this.$set(this.attr.productSelect, "value_id", productSelect.value_id);
					this.$set(this.attr.productSelect, "is_show", productSelect.is_show);
					this.$set(this, "uniqueValue", productSelect.unique);
					this.$set(this, "marketPrice", productSelect.ot_price);
					this.$set(this, "attrValue", value.join(","));
					this.$set(this, "attrTxt", "选择");
					if (productSelect.stock == 0) {
						this.$set(this.attr.productSelect, "cart_num", 0);
					} else {
						this.$set(this.attr.productSelect, "cart_num", this.min_count || 1);
					}
				} else if (!productSelect && productAttr.length) {
					this.$set(this.attr.productSelect, "store_name", this.storeInfo.store_name);
					this.$set(this.attr.productSelect, "image", this.storeInfo.image);
					this.$set(this.attr.productSelect, "price", this.storeInfo.price);
					this.$set(this.attr.productSelect, "svip_price", this.storeInfo.svip_price);
					this.$set(this.attr.productSelect, "stock", 0);
					this.$set(this.attr.productSelect, "unique", "");
					this.$set(this.attr.productSelect, "value_id", "");
					this.$set(this, "uniqueValue", "");
					this.$set(this.attr.productSelect, "cart_num", 0);
					this.$set(this, "marketPrice", this.storeInfo.ot_price);
					this.$set(this, "attrValue", "");
					this.$set(this, "attrTxt", "选择");
				} else if (!productSelect && !productAttr.length) {
					this.$set(this.attr.productSelect, "store_name", this.storeInfo.store_name);
					this.$set(this.attr.productSelect, "image", this.storeInfo.image);
					this.$set(this.attr.productSelect, "price", this.storeInfo.price);
					this.$set(this.attr.productSelect, "svip_price", this.storeInfo.svip_price);
					this.$set(this.attr.productSelect, "stock", this.storeInfo.stock);
					this.$set(this.attr.productSelect, "unique", this.storeInfo.unique || "");
					this.$set(this.attr.productSelect, "value_id", "");
					this.$set(this, "uniqueValue", this.storeInfo.unique || "");
					this.$set(this, "marketPrice", this.storeInfo.ot_price);
					this.$set(this.attr.productSelect, "cart_num", 1);
					this.$set(this, "attrValue", "");
					this.$set(this, "attrTxt", "选择");
				} else if (productSelect && !productAttr.length) {
					this.$set(this.attr.productSelect, "store_name", this.storeInfo.store_name);
					this.$set(this.attr.productSelect, "image", productSelect.image);
					this.$set(this.attr.productSelect, "price", productSelect.price);
					this.$set(this.attr.productSelect, "svip_price", productSelect.svip_price);
					this.$set(this.attr.productSelect, "stock", productSelect.stock);
					this.$set(this.attr.productSelect, "unique", productSelect.unique);
					this.$set(this.attr.productSelect, "value_id", productSelect.value_id);
					this.$set(this, "uniqueValue", productSelect.unique);
					this.$set(this, "marketPrice", productSelect.ot_price);
					this.$set(this, "attrValue", value.join(","));
					this.$set(this, "attrTxt", "选择");
					if (productSelect.stock == 0) {
						this.$set(this.attr.productSelect, "cart_num", 0);
					} else {
						this.$set(this.attr.productSelect, "cart_num", this.min_count || 1);
					}
				}
			},
			/**
			 * 获取优惠券
			 *
			 */
			async getCouponList() {
				const [goodCouponRes, shopCouponRes] = await Promise.all([
					getCoupons({ ids: this.id	}),
					getShopCoupons(this.storeInfo.mer_id)
				]);

				const couponList = [
					...goodCouponRes.data,
					...shopCouponRes.data
				];

				const validCouponList = couponList.filter(item => !item.issue);
				this.goodCoupon = goodCouponRes.data;
				this.coupon.list = couponList;
				this.couponList = validCouponList.slice(0, 2);
			},
			ChangCouponsUseState(index) {
				let that = this;
				that.$set(that.coupon, 'coupon', false);
			},
			setShare(value){
				switch (value) {
					case 0:
						this.goCustomer();
						break;
					case 1:
						this.setCollect();
						break;
					case 2:
						this.shareProduct();
						break;
					default:
						break;
				}
			},
			/*底部跳转*/
			goMenu(value) {
				switch (value) {
					case 0:
						uni.navigateTo({
							url: '/pages/store/home/index?id=' + this.storeInfo.mer_id
						});
						break;
					case 1:
						this.goCustomer();
						break;
					case 2:
						uni.switchTab({
							url: '/pages/order_addcart/order_addcart'
						})
						break;
					case 3:
						this.setCollect();
						break;
					case 4:
						this.shareProduct();
						break;
					case 5:
						uni.switchTab({
							url: '/pages/index/index'
						})
						break;
					default:
						break;
				}
			},
			/**
			 *
			 *
			 * 收藏商品
			 */
			setCollect: function() {
				if (this.isLogin === false) {
					toLogin()
				} else {
					let that = this;
					if (this.storeInfo.isRelation) {
						collectDel({
							type: 0,
							type_id: this.id
						}).then(res => {
							that.$util.Tips({
								title: 'ຍົກເລີກການເກັບໄວ້ແລ້ວ'
							});
							that.$set(that.storeInfo, 'isRelation', !that.storeInfo.isRelation);
						}).catch(err=>{
							that.$util.Tips({
								title: err
							});
						})
					} else {
						collectAdd({
							type_id: this.id,
							type: 0
						}).then(res => {
							that.$util.Tips({
								title: 'ເກັບໄວ້ສຳເລັດແລ້ວ'
							});
							that.$set(that.storeInfo, 'isRelation', !that.storeInfo.isRelation);
						}).catch(err=>{
							that.$util.Tips({
								title: err
							});
						})
					}
				}
			},
			/**
			 * 打开属性插件
			 */
			selecAttr: function() {
				this.$set(this.attr, 'cartAttr', true);
				this.$set(this, 'isOpen', true);
			},
			/**
			 * 打开优惠券插件
			 */
			couponTap: function() {
				let that = this;
				if (that.isLogin === false) {
					toLogin()
				} else {
					that.$set(that.coupon, 'coupon', true);
				}
			},
			goCustomer: function() {
				let that = this;
				if (that.isLogin === false) {
					toLogin()
				} else {
					let mer = that.storeInfo.merchant.services_type
					let data = {
						type: mer.services_type,
						service_phone: mer.service_phone,
						customer_url: mer.mer_customer_url,
						customer_corpId: mer.mer_customer_corpId,
						customer_link: mer.mer_customer_link
					}
					let url = `/pages/chat/customer_list/chat?mer_id=${that.storeInfo.mer_id}&uid=${that.uid}&productId=${that.id}`
					getCustomer(data, url)
				}
			},
			onMyEvent: function() {
				this.$set(this.attr, 'cartAttr', false);
				this.$set(this, 'isOpen', false);
			},
			/**
			 * 打开属性加入购物车
			 *
			 */
			joinCart: function(e) {
				//是否登录
				if (this.isLogin === false) {
					toLogin()
				} else {
					this.goCat();
				}
			},
			/*
			 * 加入购物车
			 */
			goCat: function(news) {
				let that = this,
					productSelect = that.productValue[this.attrValue];
				//打开属性
				if (that.attrValue) {
					//默认选中了属性，但是没有打开过属性弹窗还是自动打开让用户查看默认选中的属性
					that.attr.cartAttr = !that.isOpen ? true : false;
					// if(!that.isOpen)that.attr.cartAttr = true
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
						title: "ສິນຄ້າບໍ່ພຽງພໍ, ກະລຸນາເລືອກລາຍການອື່ນ"
					});
				if (that.attr.productSelect.cart_num == 0) {
					return that.$util.Tips({
						title: 'ຈຳນວນການສັ່ງຊື້ຕ້ອງບໍ່ແມ່ນ 0!'
					})
				}
				let q = {
					is_new: news === undefined ? 0 : 1,
					product_id: that.id,
					cart_num: that.attr.productSelect.cart_num,
					product_attr_unique: that.attr.productSelect !== undefined ? that.attr.productSelect.unique : "",
					source: this.source,
					product_type: 0,
					spread_id: this.currSpid
				};
				postCartAdd(q)
					.then(function(res) {
						that.isOpen = that.attr.cartAttr = false;
						let cartId = res.data.cart_id
						let arr = (Cache.get(CART_ID)&&JSON.parse(Cache.get(CART_ID))) || []
						// let arr = []
						arr.push(cartId)
						Cache.set(CART_ID, Array.from([...new Set(arr)]))
						const timestamp = Date.now();
						Cache.set(CART_TIME,timestamp)
						if (news) {
							uni.navigateTo({
								url: '/pages/users/order_confirm/index?cartId=' + cartId
							});
						} else {
							that.$util.Tips({
								title: "ເພີ່ມເຂົ້າກະຕ່າສຳເລັດ",
								success: () => {
									that.getCartCount(true);
								}
							});
						}
					})
					.catch(res => {
						return that.$util.Tips({
							title: res
						});
					});
			},
			/**
			 * 获取购物车数量
			 * @param boolean 是否展示购物车动画和重置属性
			 */
			getCartCount: function(isAnima) {
				let that = this;
				if(that.isLogin) {
					that.$util.getCartNum(that.isLogin,function(count){
						that.CartCount = count;
						if (isAnima) {
							that.animated = true;
							setTimeout(function() {
								that.animated = false;
							}, 500);
						}
					})
				}
			},
			/**
			 * 立即购买
			 */
			goBuy: function(e) {
				if (this.isLogin === false) {
					toLogin()
				} else {
					if(this.storeInfo.type == 4){
						let sku_id = this.attr.productSelect !== undefined ? this.attr.productSelect.value_id : ""
						uni.navigateTo({
							url: `/pages/reservation/reservation/index?id=${this.id}&sku_id=${sku_id}`
						});
					}else {
						this.goCat(true);
					}
				}
			},
			shareProduct () {
				// #ifdef H5
				if (this.$wechat.isWeixin() === true) {
					this.weixinStatus = true;
				}
				// #endif
				this.posters = true;
			},
			/**
			 * 分销
			 *
			 */
			listenerActionSheet: function() {
				if(this.promoter.isPromoter == 0){
					if(!this.isLogin){
						toLogin()
					}else if(this.promoter.promoter_type==1){
						uni.showModal({
							title: 'ແຈ້ງເຕືອນ',
							content: 'ກະລຸນາຕິດຕໍ່ຫາຝ່າຍບໍລິການເພື່ອເປັນຕົວແທນຈຳໜ່າຍ (ເບີໂທ: '+app.globalData.service_type.sys_phone+')',
							success: function(res) {
								if (res.confirm) {
									uni.makePhoneCall({
										phoneNumber: app.globalData.service_type.sys_phone,
									});
								}
							}
						})
					}else{
						uni.navigateTo({
							url: `/pages/users/distributor/index`
						});
					}
				}else {
					// #ifdef H5
					if (this.$wechat.isWeixin() === true) {
						this.weixinStatus = true;
					}
					// #endif
					this.posters = true;
				}
			},
			// 分享关闭
			listenerActionClose: function() {
				this.posters = false;
				this.currentPage = false;
			},
			//隐藏海报
			posterImageClose: function() {
				this.posterImageStatus = false
			},
			//替换安全域名
			setDomain: function(url) {
				url = url ? url.toString() : '';
				//本地调试打开,生产请注销
				if (url.indexOf("https://") > -1) return url;
				else return url.replace('http://', 'https://');
			},
			/**
			 * 获取产品分销二维码
			 * @param function successFn 下载完成回调
			 *
			 */
			downloadFilePromotionCode: function(successFn) {
				let that = this;
				let type;
				// #ifndef MP
				type = 'wechat'
				// #endif
				// #ifdef MP
				type = 'routine'
				// #endif
				getProductCode(that.id, {
					type: type,
					product_type: 0
				}).then(async res => {
					that.codeImg = res.data.url
					that.goPoster()
				}).catch(err => {
					that.$util.Tips({
						title: err
					});
					that.posters = false;
					that.$set(that, 'PromotionCode', '');

				});
			},
			// 小程序关闭分享弹窗；
			goFriend: function() {
				this.posters = false;
				this.currentPage = false;
			},
			/**
			 * 生成海报
			 */
			async goPoster() {
				if (this.posterImage) {
					this.posterImageStatus = true
					this.posters = false
					return
				}
				let that = this;
				let arr2
				that.posters = false;
				that.$set(that, 'canvasStatus', true);
				uni.showLoading({
					title: 'ກຳລັງສ້າງໂປສເຕີ...',
					mask: true
				});
				// #ifdef MP || APP-PLUS
				arr2 = [that.posterbackgd, await that.fileStoreImage(that.storeImage), await that.fileStoreImage(
					that.codeImg), await that.fileStoreImage(that.share_pic)];
				// #endif
				// #ifdef H5
				arr2 = [that.posterbackgd, await that.imgToBase(that.storeImage), await that.imgToBase(that.codeImg), await that.imgToBase(that.share_pic)];
				// #endif
				//生成推广海报
				that.$util.goodsPosterCanvas(arr2, that.storeInfo.store_name, that.storeInfo.price, that.site_name, that.marketPrice, function(tempFilePath) {
					that.$set(that, 'posterImage', tempFilePath);
					that.$set(that, 'posterImageStatus', true);
					that.$set(that, 'actionSheetHidden', !that.actionSheetHidden);
					that.$set(that, 'canvasStatus', false);
				}, (err) => {
					that.$set(that, 'canvasStatus', false);
				});
			},
			//图片转符合安全域名路径
			fileStoreImage(url) {
				if(url){
					// #ifdef MP  || APP-PLUS
					let ishttps = url.split('//')[0] == 'https:'
					if (!ishttps) {
						url = 'https://'+url.split('//')[1]
					}
					// #endif
					return new Promise((resolve, reject) => {
						let that = this;
						uni.downloadFile({
							url: url,
							success: function(res) {
								resolve(res.tempFilePath);
							},
							fail: function(error) {
								console.log(error)
								return that.$util.Tips({
									title: 'ກະລຸນາກວດສອບທີ່ຢູ່ຮູບພາບວ່າຢູ່ໃນໂດເມນທີ່ຖືກຕ້ອງຫຼືບໍ່'
								});
							}
						});
					})
				}
			},
			/*
			 * 保存到手机相册
			 */
			// #ifdef MP
			savePosterPath: function() {
				let that = this;
				uni.getSetting({
					success(res) {
						if (!res.authSetting['scope.writePhotosAlbum']) {
							uni.authorize({
								scope: 'scope.writePhotosAlbum',
								success() {
									uni.saveImageToPhotosAlbum({
										filePath: that.posterImage,
										success: function(res) {
											that.posterImageClose();
											that.$util.Tips({
												title: 'ບັນທຶກສຳເລັດ',
												icon: 'success'
											});
										},
										fail: function(res) {
											that.$util.Tips({
												title: 'ບັນທຶກບໍ່ສຳເລັດ'
											});
										}
									})
								}
							})
						} else {
							uni.saveImageToPhotosAlbum({
								filePath: that.posterImage,
								success: function(res) {
									that.posterImageClose();
									that.$util.Tips({
										title: 'ບັນທຶກສຳເລັດ',
										icon: 'success'
									});
								},
								fail: function(res) {
									that.$util.Tips({
										title: 'ບັນທຶກບໍ່ສຳເລັດ'
									});
								},
							})
						}
					}
				})
			},
			// #endif
			// #ifdef APP-PLUS
			savePosterPath(){
				let that = this
				uni.saveImageToPhotosAlbum({
					filePath: that.posterImage,
					success: function(res) {
						that.posterImageClose();
						that.$util.Tips({
							title: 'ບັນທຶກສຳເລັດ',
							icon: 'success'
						});
					},
					fail: function(res) {
						that.$util.Tips({
							title: 'ບັນທຶກບໍ່ສຳເລັດ'
						});
					},
				})
			},
			// #endif
			//#ifdef H5
			ShareInfo() {
				let data = this.storeInfo;
				let href = location.href;
				if (this.$wechat.isWeixin()) {
					getUserInfo().then(res => {
						href =
							href.indexOf("?") === -1 ?
							href + "?spid=" + res.data.uid :
							href + "&spid=" + res.data.uid;
						let configAppMessage = {
							desc: data.store_info,
							title: data.store_name,
							link: href,
							imgUrl: data.image
						};
						this.$wechat.wechatEvevt([
							"updateAppMessageShareData",
							"updateTimelineShareData",
							"onMenuShareAppMessage",
							"onMenuShareTimeline"
						], configAppMessage).then(res => {
						}).catch(err => {
							console.log(err);
						})
					});
				}
			},
			//#endif
			async imgToBase(url) {
				let res = await imgToBase({
					image: url
				})
				return res.data.image
			},
			//复制口令
			copyPwd(){
				if (!this.isLogin) {
					return toLogin();
				}
				let that = this;
				copyPasswordApi({
					id: that.id,
					product_type: 0
				}).then(async res => {
					that.copyUrl = res.data.str;
					that.posters = false
					that.isCopy = true;
				})
			},
			closeCopy(){
				this.isCopy = false
			},
			// APP分享
			appShare(scene){
				let that = this
				uni.showLoading({
					title: 'ກຳລັງໂຫຼດ...',
					mask: true
				});
				let routes = getCurrentPages(); // 获取当前打开过的页面路由数组
				let curRoute = routes[routes.length - 1].$page.fullPath // 获取当前页面路由，也就是最后一个打开的页面路由
				uni.share({
					provider: "weixin",
					scene: scene,
					type: 0,
					href: `${HTTP_REQUEST_URL}${curRoute}&spid=${that.uid}`,
					title: that.storeInfo.store_name,
					summary: that.storeInfo.store_info,
					imageUrl: that.storeInfo.image,
					success: function(res) {
						uni.showToast({
							title: 'ແບ່ງປັນສຳເລັດ',
							icon: 'success'
						})
						that.posters = false;
						uni.hideLoading();
					},
					fail: function(err) {
						uni.showToast({
							title: 'ແບ່ງປັນບໍ່ສຳເລັດ',
							icon: 'none',
							duration: 2000
						})
						that.posters = false;
						uni.hideLoading();
					}
				});
			}
		}
	}
</script>
<style lang="scss" scoped>
	.ml8{
		top:2rpx
	}
	.head-wrapper {
		position: static;
	}
	.product-con .nav {
		background-color: var(--view-theme);
		height: 152rpx;
		box-sizing: border-box;
		padding-bottom: 50rpx;
		margin-bottom: -50rpx;
	}
	.t-color {
		color: var(--view-theme);
	}
	.p-color {
		color: var(--view-priceColor);
	}
	.bt-color {
		background-color: var(--view-theme);
		border: 1px solid var(--view-theme);
	}
	.head-bar {
		background: #fff;
	}
	.generate-posters .item {
		/* #ifdef H5 */
		flex: 50%;
		/* #endif */
		/* #ifndef H5 */
		flex: 33.33%;
		/* #endif */
		text-align: center;
		font-size: 30rpx;
		&.item3{
			flex: 33.33%;
		}
	}
	.product-con .footer {
		padding: 0 20rpx 0 40rpx;
	}
	.product-con .coupon .activity {
		&::before,&::after{
			border: 1px solid var(--view-theme);
		}
		&::before{
			border-left-color: #ffffff;
		}
		&::after{
			border-right-color: #ffffff;
		}
	}
	.product-con .footer .item .iconfont {
		text-align: center;
		font-size: 40rpx;
	}
	.fenxiang_btn{
		.icon-ic_star1{
			color: var(--view-priceColor)!important;
		}
	}
	.product-con .wrapper .label .rank_list {
		width: 100%;
		background: #FFFFFF;
		border-radius: 10rpx;
		height: 56rpx;
		line-height: 56rpx;
		padding: 0 26rpx 0 14rpx;
		justify-content: space-between;
		font-size: 22rpx;
		color: #282828;
	}

	.product-con .wrapper .rank_list .rank_title {
		width: 108rpx;
		height: 36rpx;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		margin-right: 10rpx;
	}
	.product-con .wrapper .rank_list .iconfont {
		width: 24rpx;
		height: 24rpx;
		border-radius: 24rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 12rpx;
		color: #fff;
		background: #666666;
		margin-left: 10rpx;
	}
	.product-con .wrapper .introduce {
		margin-top: 20rpx;
		&.atmosphere {
			padding: 30rpx 10rpx 10rpx;
			margin: 0;
			justify-content: space-between;
			align-items: flex-start;
			.title{
				width: 540rpx;
			}
		}
		.font-bg-red{
			position: relative;
			/* #ifdef H5 */
			top: -2rpx;
			/* #endif */
			/* #ifndef H5 */
			top: -4rpx;
			/* #endif */
		}
	}
	.product-con .integral{
		display: inline-block;
		margin: 20rpx 30rpx 0 0;
		color: #FF9000;
		background-color: #FFF4E6;
		height: 40rpx;
		line-height: 40rpx;
		border-radius: 22rpx;
		padding: 0 26rpx;
		font-size: 24rpx;
		font-weight: normal;
		&:last-child{
			margin-left: 0;
		}
	}
	.product-con .footer .bnt {
		min-width: 444rpx;
		height: 76rpx;
	}
	.product-con .footer .bnt .bnts {
		width: 222rpx;
		text-align: center;
		line-height: 76rpx;
		color: #fff;
		font-size: 28rpx;
		&.sold_out {
			width: 444rpx;
			border-radius: 50rpx;
		}
		&.virtual_buy {
			width: 444rpx;
			border-radius: 50rpx;
		}
		&.virtual_buy1,&.sold_out1{
			width: 580rpx;
		}
		&.virtual_buy2,&.sold_out2{
			width: 500rpx;
		}
		&.virtual_buy3,&.sold_out3{
			width: 432rpx;
		}
	}
	.product-con .footer .bnt .joinCart {
		border-radius: 50rpx 0 0 50rpx;
		background-image: linear-gradient(90deg, var(--view-bntColor11) 0%, var(--view-bntColor12) 100%);
		&.disabled{
			background: #bbb;
		}
	}
	.product-con .footer .bnt .buy {
		border-radius: 0 50rpx 50rpx 0;
		background-image: linear-gradient(90deg, var(--view-bntColor21) 0%, var(--view-bntColor22) 100%);
	}
	.product-con .footer .bnt .buy[disabled] {
		background: #bbb;
	}

	.svipCon {
    height: 64rpx;
    padding: 0 20rpx;
		background: #FAE3BB;
    font-size: 24rpx;
    color: #B37400;
		border-radius: 10rpx;
		color: 6c404e7;
		image{
			width: 38rpx;
			height: 38rpx;
			margin-right: 20rpx;
		}
  }
	.svipCon .svipBtn {
		font-size: 22rpx;
		.iconfont{
			font-size: 18rpx;
			margin-left: 4rpx;
		}
	}
	button {
		padding: 0;
		margin: 0;
		line-height: normal;
		background-color: #fff;
	}
	button::after {
		border: 0;
	}
	.contact {
		font-size: 16px;
		width: 50%;
		background-color: #fff;
		padding: 8rpx 0;
		border-radius: 0;
		margin: 0;
		line-height: 2;
	}
	.contact::after {
		border: none;
	}
	.canvas {
		z-index: 300;
		width: 750px;
		height: 1190px;
	}
	.swiper-item,::v-deep uni-swiper-wrapper,::v-deep uni-swiper{
		height: 750rpx;
	}

	.good-tag-list {
    overflow: hidden;
    white-space: nowrap;

		.good-tag {
			border: 1px solid currentColor;
      flex-shrink: 0;
		}
	}
</style>
