<template>
	<view class="product-con" :style="viewColor">
		<view v-if="storeInfo && storeInfo.merchant">
			<scroll-view>
				<view id="past0">
					<productConSwiper :imgUrls="storeInfo.slider_image" :videoCoverImg="videoCoverImg" :videoline="storeInfo.video_link"></productConSwiper>
					<!--有氛围图-->
					<view v-if="storeInfo.atmosphere_pic" :style="{ backgroundImage: `url(${storeInfo.atmosphere_pic})` }" class='nav acea-row row-between-wrapper boder-44 pos-rel'>
						<view class='money skeleton-rect'>
							<priceFormat v-if="storeInfo.price" :price="storeInfo.price" weight intSize="48" floatSize="32" labelSize="32"></priceFormat>
							<text v-if="!svipData" class='y-money'>¥{{marketPrice || 0}}</text>
							<view class="atmosphere" v-if="svipData && svipData.show_svip_price && svipData.show_svip" style="display: inline-block;">
								<text class="vip-money regular">¥{{storeInfo.svip_price}}</text>
								<image class="vip-image" :src="`${domain}/static/images/svip.png`"></image>
							</view>
						</view>
					</view>
					<!--秒杀-->
					<view v-if="storeInfo.product_type == 1" class='nav seckillnav acea-row row-between-wrapper boder-44 pos-rel' :style="{ 'background-image': `url(${domain}/static/images/seckill-bg.png)`}">
						<view class='money skeleton-rect'>
							<text class="money-text">秒杀价</text>
							<priceFormat :price="storeInfo.price" weight intSize="48" floatSize="32" labelSize="32"></priceFormat>
							<text class='y-money regular'>¥{{storeInfo.ot_price}}</text></view>
							<view class='acea-row row-middle skeleton-rect' v-if="storeInfo.seckill_status == '1'">
								<view class='time'>
									<view>距秒杀结束仅剩</view>
									<countDown :is-day="false" :tip-text="' '" :day-text="' '" :hour-text="' : '" :minute-text="' : '" :second-text="' '" :colorTheme="true" :noBorder="true" :datatime="datatime"></countDown>
								</view>
							</view>
					</view>
					<view v-if="storeInfo.product_type == 1" class="detail-count pos-rel" style="background: #f5f5f5;">
						<view class='wrapper wrappers'>
							<view class='introduce skeleton-rect acea-row row-between'>
								<view class="title line2">
									<text v-if="(storeInfo.merchant && storeInfo.merchant.type_name)" class="font-bg-red">{{storeInfo.merchant.type_name}}</text>
									<text v-else-if="(storeInfo.merchant && storeInfo.merchant.is_trader)" class="font-bg-red">自营</text>
									{{storeInfo.store_name}}
								</view>
								<view v-if="diyProduct.shareList.length>0" class="fenxiang_btn">
									<block v-for="(item,index) in diyProduct.shareList" :key="index">
										<view v-if="diyProduct.shareConfig.includes(item.value)"><text class="iconfont" :class="[`${item.icon}`, { 'icon-ic_star1': storeInfo.isRelation&&item.value==1 }]"></text><br/>{{item.label}}</view>
									</block>
								</view>
							</view>
							<view class='label acea-row row-between-wrapper'>
								<view v-show="diyProduct.isOpen.includes(0)" class="skeleton-rect line-through">¥{{storeInfo.ot_price || 0}}</view>
								<view v-show="diyProduct.isOpen.includes(2)" class="skeleton-rect">库存:{{storeInfo.stock || 0}}{{storeInfo.unit_name || ''}}</view>
								<view v-show="diyProduct.isOpen.includes(1)" class="skeleton-rect">已售:{{storeInfo.sales || 0}}{{storeInfo.unit_name || ''}}</view>
							</view>
						</view>
					</view>
					<view v-if="storeInfo.product_type == 2" class="swiper-bg pos-rel">
						<view class="detail-count pos-rel pad30" :class="{ 'mt-40' : !storeInfo.atmosphere_pic }">
							<!--预售-->
							<view class='wrapper'>
								<view class='share acea-row row-between row-bottom' style="padding-top: 20rpx;">
									<view class='money p-color'>
										<priceFormat :price="storeInfo.price" weight intSize="48" floatSize="32" labelSize="32"></priceFormat>
										<text class="price_text" :style="{ backgroundImage: `url(${domain}/static/images/price_text.png)` }">预售价</text>
									</view>
									<view class='iconfont icon-fenxiang' v-if="comForm != 'admin'"></view>
								</view>
								<view class='label acea-row' :class="'label'+product_type">
									<view class="line-through">¥{{storeInfo.ot_price || ''}}</view>
									<view style="margin-left: 30rpx;">已预定:0{{ storeInfo.unit_name }}</view>
								</view>
								<view class='introduce line2'>
									<text v-if="(storeInfo.merchant && storeInfo.merchant.type_name)" class="font-bg-red">{{storeInfo.merchant.type_name}}</text>
									<text v-else-if="(storeInfo.merchant && storeInfo.merchant.is_trader)" class="font-bg-red">自营</text>
									{{storeInfo.store_name}}</view>
								<view class="presell_count">
									<view>
										<view>预售活动时间：</view>
										<view v-if="storeInfo.start_time && storeInfo.p_end_time" class="presell_time">
											<view class='iconfont icon-icon_clock-2'></view>
											{{ new Date(storeInfo.start_time.replace(/-/g,"/")).getMonth()+1 }}月{{ new Date(storeInfo.start_time.replace(/-/g,"/")).getDate() }}日{{ new Date(storeInfo.start_time.replace(/-/g,"/")).getHours() }}时{{ new Date(storeInfo.start_time.replace(/-/g,"/")).getMinutes()}}分
											<span class='area_line'>~</span>
											<view class='iconfont icon-icon_clock-2'></view>
											{{ new Date(storeInfo.p_end_time.replace(/-/g,"/")).getMonth()+1 }}月{{ new Date(storeInfo.p_end_time.replace(/-/g,"/")).getDate() }}日{{ new Date(storeInfo.p_end_time.replace(/-/g,"/")).getHours() }}时{{ new Date(storeInfo.p_end_time.replace(/-/g,"/")).getMinutes()}}分
										</view>
									</view>
									<view v-if="storeInfo.presell_type == 2">
										<view>支付尾款时间：</view>
										<view v-if="storeInfo.start_time && storeInfo.p_end_time" class="presell_time">
											<view class='iconfont icon-icon_clock-2'></view>
											{{ new Date(storeInfo.start_time.replace(/-/g,"/")).getMonth()+1 }}月{{ new Date(storeInfo.start_time.replace(/-/g,"/")).getDate() }}日{{ new Date(storeInfo.start_time.replace(/-/g,"/")).getHours() }}时{{ new Date(storeInfo.start_time.replace(/-/g,"/")).getMinutes()}}分
											<span class='area_line'>~</span>
											<view class='iconfont icon-icon_clock-2'></view>
											{{ new Date(storeInfo.p_end_time.replace(/-/g,"/")).getMonth()+1 }}月{{ new Date(storeInfo.p_end_time.replace(/-/g,"/")).getDate() }}日{{ new Date(storeInfo.p_end_time.replace(/-/g,"/")).getHours() }}时{{ new Date(storeInfo.p_end_time.replace(/-/g,"/")).getMinutes()}}分
										</view>
									</view>
									<view>
										<view v-if="storeInfo.presell_type==2">付尾款成功后10天内发货</view>
									</view>
								</view>
							</view>
						</view>
						<view>
							<view class="pad20">
								<view class="bg-f boder-24">
									<view class='attribute acea-row row-between-wrapper mt20'>
										<view class="acea-row row-between-wrapper">{{attrTxt}}：
											<text class='atterTxt'>{{attrValue}}</text>
										</view>
										<view class='iconfont icon-ic_rightarrow'></view>
									</view>
									<view v-if="specsInfo.params && specsInfo.params.length>0" class="attribute acea-row row-between-wrapper" @click="seeSpecs">
										<view class="acea-row row-middle">
											参数：
											<view class="list line1">
												<text class="item params" v-for="(item,index) in specsInfo.params" :key="index"
													v-if="index<2">{{item.name}}</text>
												<text>...</text>
											</view>
										</view>
										<view class="iconfont icon-ic_rightarrow"></view>
									</view>
									<!--运费-->
									<view v-if="shippingValue" class='attribute acea-row row-between-wrapper'>
										<view class="acea-row row-between-wrapper">运费：
											<text class='atterTxt'>{{shippingValue}}</text>
										</view>
										<view class='iconfont icon-ic_rightarrow'></view>
									</view>
									<!--保障-->
									<view v-if="guarantee && guarantee.length" class='attribute acea-row row-between-wrapper'>
										<view class="acea-row row-between-wrapper">保障：
											<view class="guaranteeAttr">
												<text class='atterTxt1' :class="item.guarantee_name ? 'hasAttr' : ''"  v-for="(item,index) in guarantee" :key="index">
													{{item.guarantee_name ? item.guarantee_name : ''}}
												</text>
											</view>
										</view>
										<view class='iconfont icon-ic_rightarrow'></view>
									</view>
							  </view>
								<!--定金预售流程-->
								<view v-if="storeInfo.presell_type === 2" class='acea-row row-between-wrapper wrapper presell_process bg-f boder-24'>
									<view>流程：
										<view class='process_count'>
											<view class="process_line"></view>
											<span class="text_line text_line1"><text>定金</text></span>
											<span class="text_line text_line2"><text>尾款</text></span>
											<span class="text_line text_line3"><text>发货</text></span>
										</view>
									</view>
								</view>
								<!-- 商铺信息 -->
								<view class="store-wrapper bg-f boder-24" v-if="storeInfo.merchant && hide_mer_status !=1">
									<view class="store-hd">
										<view class="store-info">
											<view class="logo">
												<image :src="storeInfo.merchant.mer_avatar" mode=""></image>
											</view>
											<view class="info">
												<view class="name">{{storeInfo.merchant.mer_name ? storeInfo.merchant.mer_name : ''}}
													<text v-if="storeInfo.merchant.type_name" class="font-bg-red ml8 bt-color">{{storeInfo.merchant.type_name}}</text>
													<text v-else-if="storeInfo.merchant.is_trader" class="font-bg-red ml8 bt-color">自营</text>
												</view>
												<view v-if="storeInfo.merchant.care_count" class="txt">
													{{storeInfo.merchant.care_count < 10000 ? storeInfo.merchant.care_count : (storeInfo.merchant.care_count/10000).toFixed(2)+'万'}}人关注
												</view>
												<view v-else class="txt">0人关注</view>
											</view>
										</view>
										<view class="score-wrapper">
											<view class="item">
												商品描述<text>{{storeInfo.merchant.product_score}}</text>
											</view>
											<view class="item">
												卖家服务<text>{{storeInfo.merchant.service_score}}</text>
											</view>
											<view class="item">
												物流服务<text>{{storeInfo.merchant.postage_score}}</text>
											</view>
										</view>
									</view>
								</view>
								<view class='product-intro' id="past3">
									<view class='title'>产品介绍</view>
									<jyf-parser v-if="description.type == 0" :domain='domain' :html="description.content.replace(/<br\/>/ig, '')" ref="article" :tag-style="tagStyle"></jyf-parser>
									<view v-else class="product_content">
										<view v-if="description.content && description.content.title" class="title">{{description.content.title}}</view>
										<view v-if="description.content && description.content.image" class="pictures">
											<image v-for="(item,index) in description.content.image" :key="index" :src="item"></image>
										</view>
									</view>
								</view>
								<view style='height:120rpx;'></view>
							</view>
						</view>
					</view>
					<view v-if="storeInfo.product_type == 4" class="swiper-bg pos-rel">
						<view class='navs acea-row row-between-wrapper boder-44 pos-rel' :style="{ 'background-image': `url(${domain}/static/images/combination-price-bg.png)`}">
							<view class='money skeleton-rect acea-row row-bottom' style="min-width: 10rpx;">
								<view class="text">拼团价</view>
								<view v-if="storeInfo.price" class="price">
									<priceFormat :price="storeInfo.price" weight intSize="48" floatSize="32" labelSize="32"></priceFormat>
								</view>
								<text v-if="storeInfo.ot_price" class="orig_price regular">
									¥{{storeInfo.ot_price}}</text>
								</text>
							</view>
							<view class="combin-people">
								2人团
							</view>
						</view>
						<view class="detail-count pos-rel" :class="{ 'mt-40' : !storeInfo.atmosphere_pic }" style="padding-bottom: 20rpx; background:#f5f5f5;">
							<!--拼团-->
							<view class='wrapper pad30'>
								<view class='share acea-row row-between row-bottom' style="padding: 0;margin: 0;">

								</view>
								<view class='introduce line2'>
									<text v-if="(storeInfo.merchant && storeInfo.merchant.type_name)" class="font-bg-red">{{storeInfo.merchant.type_name}}</text>
									<text v-else-if="(storeInfo.merchant && storeInfo.merchant.is_trader)" class="font-bg-red">自营</text>
									{{storeInfo.store_name}}
								</view>
								<view class='label acea-row row-between-wrapper'>
									<view>拼团人数:{{storeInfo.buying_count_num ? storeInfo.buying_count_num : 0}}人团</view>
									<view>库存:{{storeInfo.stock ? storeInfo.stock : 0}}</view>
									<view>已拼:{{storeInfo.sales ? storeInfo.sales : 0}}{{storeInfo.unit_name ? storeInfo.unit_name : ''}}</view>
								</view>
							</view>
							<view v-if="storeInfo.product_type == 4" class="combination_wrapper">
								<view class='notice acea-row row-middle' v-if="itemNew.length">
									<view class='num font-color'>
										<text class='iconfont icon-ic_promotion'></text>
										已拼{{storeInfo.sales ? storeInfo.sales : 0}}{{storeInfo.unit_name ? storeInfo.unit_name : ''}}<text
										 class='line'>|</text>
									</view>
									<view class='swiper'>
										<swiper :indicator-dots="indicatorDots" :autoplay="autoplay" interval="2500" duration="500" vertical="true"
										 circular="true">
											<block v-for="(item,index) in itemNew" :key='index'>
												<swiper-item>
													<view class='line1'>{{item.nickname ? item.nickname : ''}}拼团成功</view>
												</swiper-item>
											</block>
										</swiper>
									</view>
								</view>
								<view class="combination_wrapper pad20">
									<view class='assemble' v-if="pink.length" :style="itemNew.length ? '' : 'margin-top: 20rpx;'">
										<view class='item acea-row row-between-wrapper' v-for='(item,index) in pink' :key='index' v-if="index < AllIndex && pink.length>0">
											<view class='pictxt acea-row row-between-wrapper'>
												<view class='pictrue'>
													<image:src="item.initiator.avatar || '/static/images/f.png'"></image>
												</view>
												<view class='text line1'>{{ item.initiator.nickname ? item.initiator.nickname : ""}}</view>
											</view>
											<view class='right acea-row row-middle'>
												<view>
													<view class='lack'>还差<text class='font-color'>{{item.buying_count_num - item.yet_buying_num}}</text>人成团</view>
													<view class='time'>
														剩余
														<count-down :justifyLeft="justifyLeft" :is-day="false" :tip-text="' '" :day-text="' '" :hour-text="':'"
														 :minute-text="':'" :second-text="' '" :datatime="item.end_time"></count-down>
													</view>
												</view>
												<navigator hover-class='none' :url="'/pages/activity/combination_status/index?id='+item.group_buying_id" class='spellBnt'>
													去拼单
													<text class='iconfont icon-ic_rightarrow'></text>
												</navigator>
											</view>
										</view>
										<template v-if="pink.length">
											<view class='more' v-if="pink.length > AllIndex">查看更多<text class='iconfont icon-ic_downarrow'></text></view>
											<view class='more' v-else-if="pink.length === AllIndex && pink.length !== AllIndexDefault">收起<text
											 class='iconfont icon-ic_uparrow'></text></view>
										</template>
									</view>
									<view class='playWay boder-24 bg-f'>
										<view class='title acea-row row-between-wrapper'>
											<view>拼团玩法</view>
										</view>
										<view class='way acea-row row-middle'>
											<view class='item'>
												<text class='num'>①</text>
												<text class="way_text">开团/参团</text>
											</view>
											<view class='iconfont icon-a-jiantou11'></view>
											<view class='item'>
												<text class='num'>②</text>
												<text class="way_text">邀请好友</text>
											</view>
											<view class='iconfont icon-a-jiantou11'></view>
											<view class='item'>
												<view>
													<text class='num'>③</text>
													<text class="way_text">满员发货</text>
												</view>
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
			</view>
			<view class="pos-rel pad20" style="background: #f5f5f5; top: -2rpx;">
				<view class="detail-count" style="background: #f5f5f5;">
					<view class='wrapper' v-if="storeInfo.product_type == 0">
						<view v-if="storeInfo.atmosphere_pic" class='introduce skeleton-rect acea-row atmosphere'>
							<view class="title">
								<text v-if="(storeInfo.merchant && storeInfo.merchant.type_name)" class="font-bg-red bt-color">{{storeInfo.merchant.type_name}}</text>
								<text v-else-if="(storeInfo.merchant && storeInfo.merchant.is_trader)" class="font-bg-red bt-color">自营</text>
								{{storeInfo.store_name || ''}}
							</view>
							<view v-if="diyProduct.shareList.length>0" class="fenxiang_btn">
								<block v-for="(item,index) in diyProduct.shareList" :key="index">
									<view v-if="diyProduct.shareConfig.includes(item.value)" @click="setShare(item.value)"><text class="iconfont" :class="[`${item.icon}`, { 'icon-ic_star1': storeInfo.isRelation&&item.value==1 }]"></text><br/>{{item.label}}</view>
								</block>
							</view>
						</view>
						<view v-if="storeInfo.atmosphere_pic" class='integral_count skeleton-rect'>
							<text v-if="storeInfo.max_integral > 0" class='integral'>积分最高可抵扣{{storeInfo.max_integral}}元</text>
							<text v-if="storeInfo.delivery_free == 1" class='integral'>包邮</text>
						</view>
						<!--无氛围图-->
						<view v-else class='share acea-row row-between row-bottom'>
							<view class='money p-color skeleton-rect' style="min-width: 70rpx;">
								<priceFormat v-if="storeInfo.price" :price="storeInfo.price" weight intSize="48" floatSize="32" labelSize="32"></priceFormat>
								<view v-if="svipData && svipData.show_svip_price && svipData.show_svip" style="display: inline-block;">
									<text class="vip-money regular">¥{{storeInfo.svip_price || 0}}</text>
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
								<view class="">开通 SVIP会员
									<block v-if="svipData.show_svip_price">立省<text>{{svipData.save_money}}元</text></block>
									<block v-else><text>省钱多多，权益多多</text></block>
								</view>
							</view>
							<navigator class="svipBtn" url="/pages/annex/vip_paid/index">
								立即开通
								<text class="iconfont icon-ic_rightarrow"></text>
							</navigator>
						</view>
						<view v-if="!storeInfo.atmosphere_pic" class='integral_count skeleton-rect'>
							<text v-if="storeInfo.max_integral > 0" class='integral'>积分最高可抵扣{{storeInfo.max_integral}}元</text>
							<text v-if="storeInfo.delivery_free == 1" class='integral'>包邮</text>
						</view>
						<view v-if="!storeInfo.atmosphere_pic" class='introduce skeleton-rect'>
							<text v-if="storeInfo.merchant.type_name" class="font-bg-red bt-color">{{storeInfo.merchant.type_name}}</text>
							<text v-else-if="storeInfo.merchant.is_trader" class="font-bg-red bt-color">自营</text>
							{{storeInfo.store_name || ''}}
						</view>
						<view class='label acea-row row-between-wrapper' style="padding-bottom:10px;">
							<view v-show="diyProduct.isOpen.includes(0)" class="skeleton-rect line-through">¥{{storeInfo.ot_price || 0}}</view>
							<view v-show="diyProduct.isOpen.includes(1)" class="skeleton-rect">库存:{{storeInfo.stock ? storeInfo.stock : 0}}{{storeInfo.unit_name ? storeInfo.unit_name : ''}}</view>
							<view v-show="diyProduct.isOpen.includes(2)" class="skeleton-rect">销量:{{storeInfo.sales ? storeInfo.sales : 0}}{{storeInfo.unit_name ? storeInfo.unit_name : ''}}</view>
						</view>
					</view>
					<view>
						<view class="bg-f boder-24">
							<view v-if="storeInfo.product_type != 2" class='attribute acea-row row-between-wrapper'>
								<view class="acea-row row-between-wrapper">选择：
									<text class='atterTxt'>默认</text>
								</view>
								<view class='iconfont icon-ic_rightarrow'></view>
							</view>
							<block v-if="storeInfo.product_type != 2">
								<view v-if="specsInfo.params && specsInfo.params.length>0" class="attribute acea-row row-between-wrapper" @click="seeSpecs">
									<view class="acea-row row-middle">
										参数：
										<view class="list line1">
											<text class="item params" v-for="(item,index) in specsInfo.params" :key="index"
												v-if="index<2">{{item.name}}</text>
											<text>...</text>
										</view>
									</view>
									<view class="iconfont icon-ic_rightarrow"></view>
								</view>
								<!--运费-->
								<view v-if="shippingValue" class='attribute acea-row row-between-wrapper'>
									<view class="acea-row row-between-wrapper">运费：
										<text class='atterTxt'>{{shippingValue}}</text>
									</view>
									<view class='iconfont icon-ic_rightarrow'></view>
								</view>
								<!--保障-->
								<view v-if="guarantee && guarantee.length" class='attribute acea-row row-between-wrapper'>
									<view class="acea-row row-between-wrapper">保障：
										<view class="guaranteeAttr">
											<text class='atterTxt1' :class="item.guarantee_name ? 'hasAttr' : ''"  v-for="(item,index) in guarantee" :key="index">
												{{item.guarantee_name ? item.guarantee_name : ''}}
											</text>
										</view>
									</view>
									<view class='iconfont icon-ic_rightarrow'></view>
								</view>
							</block>
						</view>
						<!-- 商铺信息 -->
						<view class="store-wrapper bg-f boder-24" v-if="storeInfo.merchant && hide_mer_status !=1">
							<view class="store-hd">
								<view class="store-info">
									<view class="logo">
										<image :src="storeInfo.merchant.mer_avatar" mode=""></image>
									</view>
									<view class="info">
										<view class="name">{{storeInfo.merchant.mer_name ? storeInfo.merchant.mer_name : ''}}
											<text v-if="storeInfo.merchant.type_name" class="font-bg-red ml8 bt-color">{{storeInfo.merchant.type_name}}</text>
											<text v-else-if="storeInfo.merchant.is_trader" class="font-bg-red ml8 bt-color">自营</text>
										</view>
										<view v-if="storeInfo.merchant.care_count" class="txt">
											{{storeInfo.merchant.care_count < 10000 ? storeInfo.merchant.care_count : (storeInfo.merchant.care_count/10000).toFixed(2)+'万'}}人关注
										</view>
										<view v-else class="txt">0人关注</view>
									</view>
								</view>
								<view class="score-wrapper">
									<view class="item">
										商品描述<text>{{storeInfo.merchant.product_score}}</text>
									</view>
									<view class="item">
										卖家服务<text>{{storeInfo.merchant.service_score}}</text>
									</view>
									<view class="item">
										物流服务<text>{{storeInfo.merchant.postage_score}}</text>
									</view>
								</view>
							</view>
						</view>
						<view class='product-intro' id="past3">
							<view class='title'>产品介绍</view>
							<jyf-parser v-if="description.type == 0" :domain='domain' :html="description.content.replace(/<br\/>/ig, '')" ref="article" :tag-style="tagStyle"></jyf-parser>
							<view v-else class="product_content">
								<view v-if="description.content && description.content.title" class="title">{{description.content.title}}</view>
								<view v-if="description.content && description.content.image" class="pictures">
									<image v-for="(item,index) in description.content.image" :key="index" :src="item"></image>
								</view>
							</view>
						</view>
						<view style='height:120rpx;'></view>
					</view>
				</view>
			</view>
		</view>
	</scroll-view>
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
	var statusBarHeight = uni.getSystemInfoSync().statusBarHeight + 'px';
	import { getPreviewProDetail } from '@/api/store.js';
	import productConSwiper from '@/components/productConSwiper';
	import { mapGetters } from "vuex";
	import countDown from '@/components/countDown';
	import parser from "@/components/jyf-parser/jyf-parser";
	import { HTTP_REQUEST_URL } from '@/config/app';
	import { configMap } from "@/utils";
	let app = getApp();
	export default {
		components: {
			productConSwiper,
			countDown,
			"jyf-parser": parser,
		},
		data() {
			let that = this;
			return {
				statusBarHeight: statusBarHeight, //系统导航条高度
				attrTxt: '请选择', //属性页面提示
				attrValue: '', //已选属性
				animated: false, //购物车动画
				product_id: 0, //商品id
				product_type: 0, //活动类型
				reply: [], //评论列表
				storeInfo: {
					merchant: {}
				}, //商品详情
				productValue: [], //系统属性
				cart_num: 1, //购买数量
				isOpen: false, //是否打开属性组件
				canvasStatus: false, //海报绘图标签
				source: '',
				domain: HTTP_REQUEST_URL,
				circular: false,
				autoplay: false,
				interval: 3000,
				duration: 500,
				replyChance: 0,
				CartCount: 0,
				isDown: true,
				attr: {
					cartAttr: false,
					productAttr: [],
					productSelect: {}
				},
				description: '',
				navActive: 0,
				activity: [],
				retunTop: true, //顶部返回
				opacity: 0,
				height: 0,
				lock: false,
				tagStyle: {
					img: 'width:100%;display:block;'
				},
				codeImg: "",
				videoCoverImg: "",
				shipping: "",
				guarantee: [],
				specsInfo: {
				  show: false,
				  params: []
				},
				guaranteeValue: "",
				shippingValue: "",
				uniqueValue: "",
				datatime: 0,
				pink: [],
				AllIndexDefault: 0,
				AllIndex: 2,
				maxAllIndex: 0,
				itemNew: [],
				indicatorDots: false,
				preview_key: '',
				comForm: '', // 页面打开的途径，admin代表时后台的预览
				svipData: {},
				svipPrice: false,
				marketPrice: "",
			};
		},
		computed: configMap(['hide_mer_status'],mapGetters(['isLogin', 'uid', 'viewColor','diyProduct'])),
		onLoad(options) {
			let that = this
			var pages = getCurrentPages();
			let curPage = pages[pages.length - 1];
			if (pages.length <= 1) {
				that.retunTop = false
			}
			let curParam = curPage.options || curPage.$route.query;
			this.source = curParam.source;
			this.id = options.product_id;
			this.preview_key = options.preview_key;
			this.product_type = options.product_type;
			this.comForm = options.comForm
			uni.getSystemInfo({
				success: function(res) {
					that.height = res.windowHeight
				},
			});
			this.getPreviewDetails()
		},
		onReady() {},
		onShow() {},
		methods: {
			/*获取预览商品详情*/
			getPreviewDetails(){
				uni.showLoading({
					title: '加载中',
					mask: true
				});
				let that = this;
				let params = that.preview_key ? {key:that.preview_key} : {id: that.id, product_type: that.product_type}
				getPreviewProDetail(params).then(res => {
					uni.hideLoading();
					let storeInfo = res.data;
					if (storeInfo.video_link && storeInfo.slider_image.length > 1) {
						this.videoCoverImg = storeInfo.slider_image[0]
						storeInfo.slider_image.splice(0, 1)
					} else if (storeInfo.video_link && storeInfo.slider_image.length === 1) {
						this.videoCoverImg = storeInfo.slider_image[0]
					}
					that.$set(that, 'storeInfo', storeInfo);
					that.$set(that, 'description', storeInfo.content);
					that.$set(that.description, 'type', storeInfo.content&&storeInfo.content.type || 0 );
					that.$set(that, 'reply', res.data.topReply ? [res.data.topReply] : []);
					that.$set(that.attr, 'productAttr', res.data.attr);
					that.$set(that, 'productValue', res.data.sku);
					that.$set(that, 'activity', res.data.activity ? res.data.activity : []);
					that.$set(that, 'shippingValue', res.data.temp ? res.data.temp.name : '');
					that.$set(that, 'guaranteeValue', res.data.guarantee ? res.data.guarantee.template_name : '');
					that.$set(that, 'guarantee', res.data.guaranteeTemplate ? res.data.guaranteeTemplate : []);
					that.$set(that, 'shipping', res.data.temp ? res.data.temp.info : '');
					that.$set(that.specsInfo, 'params', res.data.params);
					that.$set(that, 'datatime', storeInfo.stop ? Number(storeInfo.stop) : 0);
					that.$set(that, 'svipData', res.data.show_svip_info || null);
					that.$set(that, 'svipPrice', res.data.show_svip_info && res.data.show_svip_info.show_svip_price || false);
					uni.setNavigationBarTitle({
						title: storeInfo.store_name.substring(0, 7) + "..."
					})
					that.DefaultSelect();
				}).catch(err => {
					//状态异常返回上级页面
					return that.$util.Tips({
						title: err
					});
				})
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
				for (var key in this.productValue) {
					if (this.productValue[key].stock > 0) {
						value = this.attr.productAttr.length ? key.split(",") : [];
						break;
					}
				}
				for (let i = 0; i < productAttr.length; i++) {
					this.$set(productAttr[i], "index", value[i]);
				}
				let productSelect = this.productValue[value.join(",")];
				if (productSelect && productAttr.length) {
					this.$set(
						this.attr.productSelect,
						"store_name",
						this.storeInfo.store_name
					);
					this.$set(this.attr.productSelect, "image", productSelect.image ? productSelect.image : this.storeInfo.image);
					this.$set(this.attr.productSelect, "price", productSelect.price);
					this.$set(this.attr.productSelect, "stock", productSelect.stock);
					this.$set(this.attr.productSelect, "unique", productSelect.unique);
					this.$set(this.attr.productSelect, "marketPrice", productSelect.ot_price);
					this.$set(this, "uniqueValue", productSelect.unique);
					this.$set(this, "attrValue", value.join(","));
					this.$set(this, "attrTxt", "选择");
					if (productSelect.stock == 0) {
						this.$set(this.attr.productSelect, "cart_num", 0);
					} else {
						this.$set(this.attr.productSelect, "cart_num", 1);
					}
				} else if (!productSelect && productAttr.length) {
					this.$set(
						this.attr.productSelect,
						"store_name",
						this.storeInfo.store_name
					);
					this.$set(this.attr.productSelect, "image", this.storeInfo.image);
					this.$set(this.attr.productSelect, "price", this.storeInfo.price);
					this.$set(this.attr.productSelect, "stock", 0);
					this.$set(this.attr.productSelect, "unique", "");
					this.$set(this.attr.productSelect, "marketPrice", 0);
					this.$set(this, "uniqueValue", "");
					this.$set(this.attr.productSelect, "cart_num", 0);
					this.$set(this, "attrValue", "");
					this.$set(this, "attrTxt", "请选择");
				} else if (!productSelect && !productAttr.length) {
					this.$set(
						this.attr.productSelect,
						"store_name",
						this.storeInfo.store_name
					);
					this.$set(this.attr.productSelect, "image", this.storeInfo.image);
					this.$set(this.attr.productSelect, "price", this.storeInfo.price);
					this.$set(this.attr.productSelect, "stock", this.storeInfo.stock);
					this.$set(this.attr.productSelect, "unique", this.storeInfo.unique || "");
					this.$set(this.attr.productSelect, "marketPrice", this.storeInfo.ot_price);
					this.$set(this, "uniqueValue", this.storeInfo.unique || "");
					this.$set(this.attr.productSelect, "cart_num", 1);
					this.$set(this, "attrValue", "");
					this.$set(this, "attrTxt", "请选择");
				} else if (productSelect && !productAttr.length) {
					this.$set(this.attr.productSelect, "store_name", this.storeInfo.store_name);
					this.$set(this.attr.productSelect, "image", productSelect.image);
					this.$set(this.attr.productSelect, "price", productSelect.price);
					this.$set(this.attr.productSelect, "stock", productSelect.stock);
					this.$set(this.attr.productSelect, "unique", productSelect.unique);
					this.$set(this.attr.productSelect, "marketPrice", productSelect.ot_price);
					this.$set(this, "uniqueValue", productSelect.unique);
					this.$set(this, "attrValue", value.join(","));
					this.$set(this, "attrTxt", "选择");
					if (productSelect.stock == 0) {
						this.$set(this.attr.productSelect, "cart_num", 0);
					} else {
						this.$set(this.attr.productSelect, "cart_num", 1);
					}
				}
			},
			onMyEvent: function() {
				this.$set(this.attr, 'cartAttr', false);
				this.$set(this, 'isOpen', false);
			},
		},
	}
</script>
<style scoped lang="scss">
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
		.product-con {
			background: #f5f5f5;
		}
		.swiper-bg {
			top: 0;
		}
		/deep/.swiper-dot {
			bottom: 60rpx;
		}
		.noBorder {
			border-radius: 0;
		}
		.product-con .price_text {
			display: inline-block;
			width: 90rpx;
			height: 30rpx;
			background-size: 100%;
			color: #FD6523;
			font-size: 22rpx;
			line-height: 30rpx;
			text-align: center;
			margin-left: 27rpx;
			position: relative;
			top: -8rpx;
		}
		.svipCon {
		  height: 64rpx;
		  padding: 0 20rpx;
			background: #FAE3BB;
		  font-size: 24rpx;
		  color: #B37400;
			border-radius: 10rpx;
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
		.product-con .navs {
			background-repeat: no-repeat;
			background-size: 100% 100%;
			background-color: var(--view-theme);
			width: 100%;
			height: 152rpx;
			padding: 0 40rpx;
			box-sizing: border-box;
			padding-bottom: 50rpx;
			margin-bottom: -50rpx;
			top: -2px;
		}
		.product-con .navs .money {
			font-size: 28rpx;
			color: #fff;
			.text{
				font-size: 28rpx;
				font-weight: bold;
				margin-right: 16rpx;
			}
			.price{
				position: relative;
				top: 4rpx;
			}
		}
		.product-con .navs .combin-people {
			width: 110rpx;
			height: 48rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			background: rgba(255,255,255,.9);
			border-radius: 120rpx 100rpx 100rpx 0;
			font-size: 24rpx;
			color: var(--view-theme);
		}
		.orig_price {
			text-decoration: line-through;
			margin-left: 16rpx;
		}
		.product-con .notice {
			width: 100%;
			height: 62rpx;
			background-color: var(--view-minorColor);
			padding: 0 20rpx;
			box-sizing: border-box;
			border-radius: 16rpx;
			margin-top: 30rpx;
		}
		.product-con .notice .num {
			font-size: 24rpx;
		}
		.product-con .notice .num .iconfont {
			font-size: 30rpx;
			vertical-align: -3rpx;
			margin-right: 20rpx;
		}
		.product-con .notice .num .line {
			color: #282828;
			margin-left: 15rpx;
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
		.product-con .presell_count {
			margin-top: 20rpx;
			font-size: 26rpx;
			color: #999999;
			.presell_time {
				margin: 8rpx 0 4rpx;
				.area_line {
					display: inline-block;
					margin: 0 6rpx;
				}
			}
			.icon-icon_clock-2 {
				display: inline-block;
				margin-right: 4rpx;
			}
		}
		.product-con .presell_process {
			margin-top: 20rpx;
			height: 110rpx;
			padding: 4rpx 32rpx 32rpx;
			.process_count {
				display: inline-block;
				position: relative;
				top: 24rpx;
				left: 40rpx;
			}
			.process_line {
				width: 414rpx;
				height: 2rpx;
				background: #CCCCCC;
			}
			.text_line {
				display: inline-block;
				width: 25%;
				color: #CCCCCC;
				margin-top: 6rpx;
				position: relative;
				&::after {
					content: "";
					display: inline-block;
					width: 14rpx;
					height: 14rpx;
					background: #CCCCCC;
					border-radius: 100%;
					position: absolute;
					top: -14rpx;
				}
				&.text_line1 {
					text-align: left;
					color: var(--view-theme);
					&::after {
						background: var(--view-theme);
						left: 0;
					}
					text {
						margin-left: -20rpx
					}
				}
				&.text_line3 {
					text-align: right;
					&::after {
						right: 0;
					}
					text {
						margin-right: -20rpx

					}
				}
				&.text_line2 {
					width: 50%;
					text-align: center;
					&::after {
						left: 50%;
						margin-left: -4rpx;
					}
				}
			}
		}
		.product-con .attribute .params{
			margin-right: 20rpx;
			font-size: 28rpx;
			color: #282828;
			&:nth-child(2){
				margin-right: 0;
			}
		}
		/*拼团*/
		.product-con .notice {
			width: 100%;
			height: 62rpx;
			background-color: #ffedeb;
			padding: 0 30rpx;
			box-sizing: border-box;
		}
		.product-con .notice .num {
			font-size: 24rpx;
		}
		.product-con .notice .num .iconfont {
			font-size: 30rpx;
			vertical-align: -3rpx;
			margin-right: 20rpx;
		}
		.product-con .notice .num .line {
			color: #282828;
			margin-left: 15rpx;
		}
		.product-con .notice .swiper {
			height: 100%;
			width: 360rpx;
			line-height: 62rpx;
			overflow: hidden;
			margin-left: 14rpx;
		}
		.product-con .notice .swiper swiper {
			height: 100%;
			width: 100%;
			overflow: hidden;
			font-size: 24rpx;
			color: #282828;
		}
		.product-con .playWay {
			background-color: #fff;
			padding: 0 20rpx;
			margin-top: 20rpx;
			font-size: 28rpx;
			color: #282828;
		}
		.product-con .playWay .title {
			height: 86rpx;
			border-bottom: 1px solid #eee;
		}
		.product-con .playWay .title .iconfont {
			margin-left: 13rpx;
			font-size: 28rpx;
			color: #717171;
		}
		.product-con .playWay .way {
			min-height: 110rpx;
			font-size: 26rpx;
			color: #282828;
		}
		.product-con .playWay .way .iconfont {
			color: #cdcdcd;
			font-size: 40rpx;
			margin: 0 30rpx;
		}
		.product-con .playWay .way .item .num {
			font-size: 34rpx;
			margin-right: 6rpx;
			width: 17px;
			height: 28px;
			display: inline-block;
			vertical-align: middle;
		}
		.product-con .playWay .way .item .tip {
			font-size: 22rpx;
			color: #a5a5a5;
			margin-top: -4rpx;
		}
		.product-con .playWay .way .way_text {
			position: relative;
			top: 4rpx;
		}
		.product-con .attribute .atterTxt {
			width: 400rpx;
		}
		.product-con .attribute .atterTxt1{
			color: #282828;
			&.hasAttr{
				&:after{
					content: "";
					display: inline-block;
					position: relative;
					top: -6rpx;
					margin: 0 6rpx;
					width: 5rpx;
					height: 5rpx;
					background-color: #282828;
					border-radius: 100%;
				}
				&:last-child{
					&:after{
						display: none;
					}
				}
			}
		}
		.product-intro .title {
			font-size: 30rpx;
			color: #282828;
			text-align: center;
		}
		.product-intro .pictures,.product-intro .pictures uni-image,
		.product-intro .pictures image{
			width: 100%;
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
		.product-con .wrapper {
			width: 100%;
			box-sizing: border-box;
			&.wrappers {
				padding: 32rpx 30rpx;
				width: 100%;
				box-sizing: border-box;
				background: linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 54%, rgba(255, 255, 255, 0) 100%);
				border-radius: 48rpx 48rpx 0 0;
				.introduce {
					margin: 0;
				}
				.title {
					width: 500rpx;
				}
			}
		}
		.product-con .nav .money .money-text {
			font-size: 26rpx;
			margin-right: 10rpx;
		}
		.product-con .nav {
			background-color: var(--view-theme);
			background-repeat: no-repeat;
			background-size: 100% 100%;
			width: 100%;
			height: 100rpx;
			padding: 0 30rpx;
			box-sizing: border-box;
			&.seckillnav {
				height: 152rpx;
				padding-bottom: 50rpx;
				margin-bottom: -50rpx;
				top: -2px;
			}
		}
		.product-con .nav .money {
			font-size: 28rpx;
			color: #fff;
		}
		.product-con .nav .money .num {
			font-size: 48rpx;
		}
		.product-con .nav .money .y-money {
			font-size: 26rpx;
			margin-left: 10rpx;
			text-decoration: line-through;
		}
		.product-con .nav .time {
			font-size: 20rpx;
			color: #fff;
			text-align: center;
		}
		.product-con .nav .iconfont {
			color: #fff;
			font-size: 30rpx;
			margin-left: 20rpx;
		}
</style>
