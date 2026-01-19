<template>
	<view :style="viewColor">
		<!-- 自定义顶部背景颜色 -->
		<view class="top">
			<!-- #ifdef MP || APP-PLUS -->
			<view class="sys-head fixed">
				<view class="sys-bar" :style="{height:sysHeight}"></view>
				<!-- #ifdef MP -->
				<view class="sys-title">
					<view class='iconfont icon-ic_leftarrow' :style="{lineHeight:sysHeight}" @tap='goBack'></view>
					ສົ່ງຄຳສັ່ງ
				</view>
				<!-- #endif -->
				<view class="bg"></view>
			</view>
			<!-- #endif -->
		</view>
		<view class="order-header-bg" :style="{marginTop:marTop}"></view>
		<view class='order-submission'>
			<view v-if="allow_address && order_model == 0" class="allAddress boder-24" @click="onAddress">
				<view class='address acea-row row-between-wrapper' v-if='shippingType == 0 '>
					<view class='addressCon' v-if="addressInfo.real_name">
						<view class='name'>{{addressInfo.real_name}}
							<text class='phone'>{{addressInfo.phone}}</text>
						</view>
						<view>
							<text class='default'
								v-if="addressInfo.is_default">[默认]</text>{{addressInfo.province}}{{addressInfo.city}}{{addressInfo.district}}{{addressInfo.street || ''}}{{addressInfo.detail}}
						</view>
					</view>
					<navigator v-else :url="'/pages/users/user_address/index?cartId='+cartId" hover-class="none" class='addressCon'>
						<view class='setaddress'>ຕັ້ງຄ່າທີ່ຢູ່ຮັບສິນຄ້າ</view>
					</navigator>
					<view class='iconfont icon-ic_rightarrow'></view>
				</view>
				<view class='line'>
					<image :src="`${domain}/static/images/line.jpg`"></image>
				</view>
			</view>
			<!-- 商品信息 -->
			<view class="storeinfo-wrapper ">
				<view class="store-item boder-24 bg-f" v-for="(item,index) in cartInfo" :key="index">
					<view class="store-title acea-row row-middle">
						<text class="iconfont icon-ic_mall"></text>
						<view class="txt font-500" @click="goStore(item.mer_id)">{{item.mer_name}}</view>
						<text class="iconfont icon-ic_rightarrow"></text>
					</view>
					<view v-for="(goods,j) in item.list" :key="j">
						<view v-if="goods.product_type == 2">
							<view class="product-item">
								<view class="img-box">
									<image :src="goods.productPresellAttr.image || goods.product.image"></image>
								</view>
								<view class="content">
									<view class="name line1"><text
											class="event_name event_bg">ຈອງລ່ວງໜ້າ</text>{{goods.productPresell.store_name}}
									</view>
									<view class="label" style="width: 70%;">{{goods.productAttr.sku}}</view>
									<view class="price">
										<priceFormat :price="goods.productPresellAttr.presell_price" weight intSize="28" floatSize="20" labelSize="20"></priceFormat>
										<view class="num">X{{goods.cart_num}}</view>
									</view>
									<view class="event_ship event_color">ເວລາຈັດສົ່ງ:
										<!--全款预售-->
										<text
											v-if="goods.productPresell.presell_type === 1">{{goods.productPresell.delivery_type === 1 ? 'ຫຼັງຈ່າຍເງິນ' : 'ຫຼັງສິ້ນສຸດການຈອງລ່ວງໜ້າ'}}{{ goods.productPresell.delivery_day }}ວັນ</text>
										<!--定金预售-->
										<text
											v-if="goods.productPresell.presell_type === 2">{{ goods.productPresell.delivery_type === 1 ? 'ຫຼັງຈ່າຍເງິນຍອດທ້າຍ' : 'ຫຼັງສິ້ນສຸດການຈອງລ່ວງໜ້າ' }}{{ goods.productPresell.delivery_day }}ວັນ</text>
									</view>
									<!-- <view class="err-txt" v-if="goods.undelivered && addressInfo.real_name">
										<text class="iconfont icon-icon_tip"></text>
										<view class="txt">此商品不支持该区域配送</view>
									</view> -->
								</view>
							</view>
							<view v-if="goods.productPresell.presell_type === 2" class="event_payTime">
								<view class="event_progress">
									<view class="progress_step">
										<text class="name color_red">定金</text>
										<text	class="price color_red">
											<priceFormat :price="(goods.productPresellAttr.down_price * goods.cart_num).toFixed(2)" weight intSize="28" floatSize="20" labelSize="20"></priceFormat>
										</text>
									</view>
									<view class="progress_step">
										<text class="name">ເງິນຍອດທ້າຍ</text>
										<view class="price">
											<priceFormat :price="(goods.productPresellAttr.final_price * goods.cart_num).toFixed(2)" weight intSize="28" floatSize="20" labelSize="20"></priceFormat>
										</view>
									</view>
									<view class="progress_pay">
										{{ goods.productPresell.final_start_time | filterDay}}ເລີ່ມຈ່າຍເງິນຍອດທ້າຍ</view>
								</view>
							</view>
						</view>
						<view v-else>
							<view class="product-item">
								<view class="img-box">
									<image :src="goods.productAttr.image || goods.product.image"></image>
								</view>
								<view class="content">
									<view class="acea-row row-between">
										<view class="name line1">{{goods.product.store_name}}</view>
										<view class="num">x{{goods.cart_num}}</view>
									</view>
									<view class="label">{{goods.productAttr.sku}}</view>
									<view class="price acea-row row-between">
										<view class="acea-row row-middle">
											<block v-if="order_type == 3">
												<priceFormat :price="goods.productAssistAttr.assist_price" weight intSize="28" floatSize="20" labelSize="20"></priceFormat>
											</block>
											<block v-else-if="order_type == 4">
												<priceFormat :price="goods.activeSku&&goods.activeSku.active_price" weight intSize="28" floatSize="20" labelSize="20"></priceFormat>
											</block>
											<block v-else>
												<priceFormat :price="goods.productAttr.price" weight intSize="28" floatSize="20" labelSize="20"></priceFormat>
											</block>
											<view v-if="goods.productAttr.show_svip_price" class="vipImg">
												<image :src="`${domain}/static/images/svip.png`"></image>
											</view>
										</view>
										<view v-if="order_model != 4" class="delivery_type">
											<block v-if="!goods.allow_delivery || !goods.allow_take || !goods.allow_city_take">
												<text class="iconfont icon-icon_tip"></text>
												<text>{{errDeliveryTypeText(goods)}}</text>
											</block>
										</view>
									</view>
									<!-- <view class="err-txt" v-if="isGoodsDelivery(goods, item)">
										<text class="iconfont icon-icon_tip"></text>
										<view class="txt">此商品不支持该区域配送</view>
									</view> -->
								</view>
							</view>
						</view>
					</view>
					<view class="wrapper">
						<view v-if="order_model !=4" class="boxs">
							<view class='item acea-row row-between-wrapper'>
								<view class="delivery-type flex-box">
									ວິທີການຈັດສົ່ງ
									<view
										v-if="item.order.isCityTake && !item.order.delivery_status"
										class="delivery-type-err ml-20"
									>
										<text class="iconfont icon-icon_tip"></text>
										<text class="txt">ບໍ່ຢູ່ໃນຂອບເຂດການຈັດສົ່ງ</text>
									</view>
								</view>
								<view class='discount' @tap="openShowBox(item,index)">
									{{ getDeliveryTypeName(item) }}
									<text v-if="item.order.deliveryTypeList.length > 1" class='iconfont icon-ic_rightarrow'></text>
								</view>
							</view>
							<view class="store-address" v-if="isShowStationBox[item.mer_id] && (item.order.isTake || item.order.isCityTake) && deliveryStationList[index].length">
								<view class="pick-up-point-box">
									<view class="name line2" @click="openShowStation(item, index)">
										<text>{{deliveryStationList[index][activeStationIndex[index]].station_name}}</text>

										<text class='iconfont icon-ic_rightarrow'></text>
									</view>
									<view class="info line2">
										<text class="distance">距您{{deliveryStationList[index][activeStationIndex[index]].distance}}</text>
										<text>{{deliveryStationList[index][activeStationIndex[index]].station_address}}</text>
									</view>
								</view>
								<view class="map" @click="goMap(item, index)">
									<text class="iconfont icon-ic_location5"></text>
									<view class="map_text">ແຜນທີ່</view>
								</view>
							</view>
						</view>
						<!-- 配送时间 -->
						<view
							class="item acea-row row-between-wrapper"
							v-if="item.order.isCityTake">
							<view style="width: 100px;">ເວລາຈັດສົ່ງ</view>
							<view class="discount">
								<block
									v-if="deliverySettings[index].deliverySettings.delivery_time_type == 1"
								>
									<view class="" @tap="openTimeBox(item,index)">
										{{deliveryTimeData[index].deliveryTimeText}}
										<text
											class='iconfont icon-ic_rightarrow'>
										</text>
									</view>
								</block>
								<block v-else>
									{{deliverySettings[index].deliverySettings.delivery_prompt}}
								</block>
							</view>
						</view>
						<view class='item acea-row row-between-wrapper' v-if="shippingType==0 && item.order.default_delivery != 'mer_take' && order_model == 0">
							<view>
								{{item.order.isCityTake? 'ຄ່າຈັດສົ່ງ' : 'ຄ່າຂົນສົ່ງ'}}
								<text v-if="item.list[0].productPresell && item.list[0].productPresell.presell_type == 2">(ໄລຍະເງິນຍອດທ້າຍ)</text>
							</view>
							<view class='discount regular' v-if='!item.order.isCityTake && item.order.postage_price > 0'>
								¥{{item.order.postage_price}}
							</view>
							<view
								class='discount regular'
								v-else-if='item.order.isCityTake && item.order.city_take_postage > 0'
							>
								¥{{item.order.city_take_postage}}
							</view>
							<view class='discount' v-else-if="item.order.isCityTake && !item.order.delivery_status">ບໍ່ຢູ່ໃນຂອບເຂດການຈັດສົ່ງ</view>
							<view class='discount' v-else>{{item.order.isCityTake ? 'ຈັດສົ່ງຟຣີ' : 'ຂົນສົ່ງຟຣີ'}}</view>
						</view>
						<view class='item acea-row row-between-wrapper'
							v-if="order_type != 3 && order_type != 4 && item.order.enabledCoupon">
							<view>ສ່ວນຫຼຸດຮ້ານຄ້າ</view>
							<block v-if="item.coupon.length>0">
								<view class='discount' @tap='couponTap(item,index)'>
									<text v-if="item.order.coupon_price>0">-¥{{item.order.coupon_price}}</text>
									<text v-else>ຍັງບໍ່ໄດ້ເລືອກຄູປອງ</text>
									<text class='iconfont icon-ic_rightarrow'></text>
								</view>
							</block>
							<block v-else>
								<view class='placeholder'>ບໍ່ມີຄູປອງ</view>
							</block>
						</view>
						<view v-if="order_type === 2 && item.list[0].productPresell.presell_type ==2"
							class="item acea-row row-between-wrapper">
							<checkbox-group class="checkgroup" @change='changeIsAgree'>
								<text class="iconfont icon-icon_question" style="margin-left: 0;margin-right:8px;"></text>
								<text @click="getPresellAgree">ຂ້ອຍໄດ້ຍອມຮັບເງິນມັດຈຳບໍ່ສາມາດຄືນໄດ້ແລະຂໍ້ຕົກລົງການຈອງລ່ວງໜ້າ</text>
								<checkbox class="checkbox" :checked="isAgree ? true : false" />
							</checkbox-group>
						</view>
						<!-- 开具发票 -->
						<!-- <view class="item acea-row row-between-wrapper">
							<view style="width: 100px;">
								开具发票
								<text class='iconfont icon-icon_question invoice-icon'></text>
							</view>
							<view class="discount">
								不开发票
								<text class='iconfont icon-ic_rightarrow'></text>
							</view>
						</view> -->
						<view class='item acea-row row-between-wrapper' v-if="textareaStatus">
							<view style="width: 100px;">ຂໍ້ມູນໝາຍເຫດ</view>
							<input v-if="coupon.status===false" placeholder-class='placeholder'
								@input='bindHideKeyboard' value="" name="mark" placeholder='ເລືອກຂຽນຂໍ້ມູນໝາຍເຫດ'
								v-model="msgObj[item.mer_id]"></input>
						</view>
						<view class="total">
							<view>
								<view class="shipping-amount" v-if="checkIsDisplayDiffAmount(item, index)">
									ຍັງຂາດ<text class="fs-10px">￥</text>{{ deliverySettings[index].deliverySettings.free_shipping_amount - item.order.total_price }} ຈັດສົ່ງຟຣີ
								</view>
							</view>
							<view class="flex-box">
								ລວມ {{item.order.total_num}} ລາຍການ ລວມຍ່ອຍ
								<view class="price" v-if="item.isTake == 0">
									<priceFormat :price="item.order.pay_price" weight intSize="40" floatSize="28" labelSize="28"></priceFormat>
								</view>
								<view class="price" v-if="item.isTake == 1">
									<priceFormat :price="item.order.org_price" weight intSize="40" floatSize="28" labelSize="28"></priceFormat>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<!--商品关联系统表单(不是预约商品)-->
			<view v-if="order_form.length>0 && order_model != 4" class="wrapper virtual_form bg-f boder-24">
				<view class='item acea-row row-between-wrapper' :class="{on:(item.name=='radios' || item.name=='checkboxs'),on2:item.name == 'dateranges',on3:item.name == 'citys',pd0:item.name == 'uploadPicture'}" v-for="(item,index) in order_form" :key="index">
				  <view class="name">
						<text class="item-require" v-if="item.titleShow.val">*</text>
				    {{ item.titleConfig.value }}
				  </view>
					<!-- radio -->
					<view v-if="item.name=='radios'" class="discount">
						<radio-group @change="radioChange($event, index, item)" class="acea-row row-middle row-right">
							<label class="radio" v-for="(j,jindex) in item.wordsConfig.list" :key="jindex">
								<view class="acea-row row-middle">
									<!-- #ifndef MP -->
									<radio :value="jindex.toString()" :checked='j.show'/>
									<!-- #endif -->
									<!-- #ifdef MP -->
									<radio :value="jindex" :checked='j.show'/>
									<!-- #endif -->
									<view>{{j.val}}</view>
								</view>
							</label>
						</radio-group>
					</view>
					<!-- checkbox -->
					<view v-if="item.name=='checkboxs'" class="discount acea-row">
						<checkbox-group @change="checkboxChange($event, index, item)" class="acea-row row-middle row-right">
							<label class="radio" v-for="(j,jindex) in item.wordsConfig.list" :key="jindex">
								<view class="acea-row row-middle">
									<!-- #ifndef MP -->
									<checkbox :value="jindex.toString()" :checked="j.show" style="transform:scale(0.9)" />
									<!-- #endif -->
									<!-- #ifdef MP -->
									<checkbox :value="jindex" :checked="j.show" style="transform:scale(0.9)" />
									<!-- #endif -->
									<view>{{j.val}}</view>
								</view>
							</label>
						</checkbox-group>
					</view>
					<!-- text -->
					<view v-if="item.name=='texts' && item.valConfig.tabVal == 0" class="discount">
						<input type="text" :placeholder="item.tipConfig.value" placeholder-class="placeholder" v-model="item.value" />
					</view>
					<!-- number -->
					<view v-if="item.name=='texts' && item.valConfig.tabVal == 4" class="discount">
						<input type="number" :placeholder="item.tipConfig.value" placeholder-class="placeholder" v-model="item.value" />
					</view>
					<!-- email -->
					<view v-if="item.name=='texts' && item.valConfig.tabVal == 3" class="discount">
						<input type="text" :placeholder="item.tipConfig.value" placeholder-class="placeholder" v-model="item.value" />
					</view>
					<!-- data -->
					<view v-if="item.name=='dates'" class="discount">
						<picker mode="date" :value="item.value" @change="bindDateChange($event,index)">
							<view class="acea-row row-between-wrapper">
								<view v-if="item.value == ''">{{item.tipConfig.value}}</view>
								<view v-else>{{item.value}}</view>
								<text class='iconfont icon-ic_rightarrow'></text>
							</view>
						</picker>
					</view>
					<!-- dateranges -->
					<view v-if="item.name=='dateranges'" class="discount">
						<uni-datetime-picker v-model="item.value" type="daterange" @maskClick="maskClick">
							{{item.value.length?item.value[0]+' - '+item.value[1]:item.tipConfig.value}}
						<text class='iconfont icon-ic_rightarrow'></text>
						</uni-datetime-picker>
					</view>
					<!-- time -->
					<view v-if="item.name=='times'" class="discount">
						<picker mode="time" :value="item.value" @change="bindTimeChange($event,index)"
							:placeholder="item.tipConfig.value">
							<view class="acea-row row-between-wrapper">
								<view v-if="item.value == ''">{{item.tipConfig.value}}</view>
								<view v-else>{{item.value}}</view>
								<text class='iconfont icon-ic_rightarrow'></text>
							</view>
						</picker>
					</view>
					<!-- timeranges -->
					<view v-if="item.name=='timeranges'" class="discount acea-row row-between-wrapper" @click="getTimeranges(index)">
						<view v-if="item.value">{{item.value}}</view>
						<view v-else>{{item.tipConfig.value}}</view>
						<text class='iconfont icon-ic_rightarrow'></text>
					</view>
					<!-- select -->
							<view v-if="item.name=='selects'" class="discount">
						<picker :value="item.value" :range="item.wordsConfig.list" @change="bindSelectChange($event,index,item)" range-key="val">
							<view class="acea-row row-between-wrapper">
								<view v-if="item.value">{{item.value}}</view>
								<view v-else>ກະລຸນາເລືອກ</view>
								<text class='iconfont icon-ic_rightarrow'></text>
							</view>
						</picker>
					</view>
					<!-- city -->
					<view v-if="item.name=='citys'" class="discount" @click="changeRegion(index)">
						<view class="acea-row row-middle row-right">
							<view class="city" v-if="item.value == ''">{{item.tipConfig.value}}</view>
							<view class="city" v-else>{{item.value}}</view>
							<text class='iconfont icon-ic_rightarrow'></text>
						</view>
					</view>
					<!-- id -->
					<view v-if="item.name=='texts' && item.valConfig.tabVal == 2" class="discount">
						<input type="idcard" :placeholder="item.tipConfig.value" placeholder-class="placeholder" v-model="item.value" />
					</view>
					<!-- phone -->
					<view v-if="item.name=='texts' && item.valConfig.tabVal == 1" class="discount">
						<input type="number" :placeholder="item.tipConfig.value" placeholder-class="placeholder" v-model="item.value" />
					</view>
					<!-- img -->
					<view v-if="item.name=='uploadPicture'" class="confirmImg" style="padding-bottom: 0;">
						<view class='upload'>
							<view class='pictrue' v-for="(items,indexs) in item.value" :key="indexs">
								<image :src='items' mode="aspectFill"></image>
								<view class="close acea-row row-center-wrapper" @tap='DelPic(index,indexs)'>
									<view class="iconfont icon-ic_close"></view>
								</view>
							</view>
							<view class='pictrue acea-row row-center-wrapper row-column' @tap='uploadpic(index)'
								v-if="item.value.length < item.numConfig.val">
								<view>ອັບໂຫຼດຮູບພາບ</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="instructions" v-if="showProtocol">
				<view class="agreement-count">
					<view class="setAgCount">
						<view class="title">{{agrementTtile}}</view>
						<view class="agBox">
							<view class="content">
								<jyf-parser :html="protocol" ref="article" :tag-style="tagStyle"></jyf-parser>
							</view>
						</view>
					</view>
					<text class="icon iconfont icon-ic_close1" @click="showProtocol = false"></text>
				</view>
			</view>
			<!--收货人信息-->
			<view v-if="is_take && order_model != 4" class="wrapper virtual_form bg-f boder-24">
				<form report-submit='true'>
					<view  class='item acea-row row-between-wrapper'>
						<view><text class="item-require">*</text>ຊື່ຜູ້ຮັບສິນຄ້າ</view>
						<view class='discount'>
							<input type="text" v-model="post.real_name" placeholder="ກະລຸນາປ້ອນຊື່ຜູ້ຮັບສິນຄ້າ" placeholder-class='placeholder' />
						</view>
					</view>
					<view class='item acea-row row-between-wrapper'>
						<view><text class="item-require">*</text>ເບີໂທຜູ້ຮັບສິນຄ້າ</view>
						<view class='discount'>
							<input type="number" v-model="post.phone" placeholder="ກະລຸນາປ້ອນເບີໂທຜູ້ຮັບສິນຄ້າ" placeholder-class='placeholder' />
						</view>
					</view>
				</form>
			</view>
			<view class='moneyList boder-24 bg-f'>
				<view class='item acea-row row-between-wrapper'>
					<view>ລາຄາສິນຄ້າລວມ:</view>
					<view class='money'>¥{{proPrice}}</view>
				</view>
				<view class='item acea-row row-between-wrapper' v-if="couponData.order_total_postage > 0">
					<view>ຄ່າຂົນສົ່ງ:</view>
					<view class='money'>¥{{couponData.order_total_postage}}</view>
				</view>
				<view class='item acea-row row-between-wrapper' v-if="coupon_price > 0">
					<view>ມູນຄ່າສ່ວນຫຼຸດຮ້ານຄ້າ:</view>
					<view class='money'>-¥{{coupon_price}}</view>
				</view>
				<view class='item acea-row row-between-wrapper' v-if="open_integral && userInfo.integral>0 && order_type == 0">
					<view>ຫັກແຕ້ມສະສົມ:</view>
					<view class='money'>
						<text v-if="!use_integral">ແຕ້ມປະຈຸບັນ <text class="pColor">{{userInfo.integral}}</text></text>
						<text v-else>ໃຊ້ {{integral_count}} ແຕ້ມ, ຫັກ <text
								class="pColor">{{integral_price}} ກີບ</text></text>
						<view class="checkbox integral_checked" @click="changeIntegral">
							<view class="iconfont icon-ic_unselect" v-if="!use_integral"></view>
							<view class='iconfont icon-a-ic_CompleteSelect' v-else></view>
						</view>
					</view>
				</view>
				<view class='item acea-row row-between-wrapper'
					v-if="order_type != 3 && order_type != 4 && enabledPlatformCoupon">
					<view>ຄູປອງແພລດຟອມ <text @tap="showCoupon" class="iconfont icon-icon_question"></text></view>
					<block v-if="platformCoupon.length > 0">
						<view class='discount money' @tap='couponTap2(platformCoupon,0)'>
							<text v-if="total_platform_coupon_price>0">ສ່ວນຫຼຸດ ¥{{total_platform_coupon_price}}</text>
							<text v-else>ຍັງບໍ່ໄດ້ເລືອກຄູປອງ</text>
							<text class='iconfont icon-ic_rightarrow'></text>
						</view>
					</block>
					<block v-else>
						<view class='placeholder'>ບໍ່ມີຄູປອງ</view>
					</block>
				</view>
				<view class='item acea-row row-between-wrapper' v-if="priceGroup.storePostage > 0">
					<view>ຄ່າຂົນສົ່ງ:</view>
					<view class='money'>+¥{{priceGroup.storePostage}}</view>
				</view>
			</view>
			<view style='height:140rpx;'></view>
			<view class='footer acea-row row-between-wrapper' v-if="cartInfo.length">
				<view class="footer_count">
					<view class="acea-row">
						<view>ລວມທັງໝົດ:</view>
						<view class='pColor'>
							<priceFormat :price="totalPrice" weight intSize="48" floatSize="32" labelSize="32"></priceFormat>
						</view>
					</view>
					<view class="coupon_price" v-if="couponData.total_coupon > 0">
						ສ່ວນຫຼຸດ: ¥ {{couponData.total_coupon}}
						<text @click="openDiscount">ລາຍລະອຽດສ່ວນຫຼຸດ</text>
					</view>
				</view>
				<view class='settlement' :class='couponData.status != "noAddress" && !hasNotInRange ? "" : "disabled"' style='z-index:100'
					@tap="SubOrder">{{couponData.status != "noAddress" ? 'ຢືນຢັນຄຳສັ່ງຊື້':'ເລືອກທີ່ຢູ່'}}</view>
			</view>
		</view>
		<block v-if="coupon.status">
			<couponListWindow :coupon='coupon' :couponTitle="plantCoupon ? 'ຄູປອງແພລດຟອມ' : 'ຄູປອງ'" @ChangCouponsClose="ChangCouponsClose" @getCoupon="getCoupon"
				:openType='openType' :coupon_amount='coupon_amount'
				:coupon_number='coupon_number'></couponListWindow>
		</block>
		<addressWindow ref="addressWindow" @changeTextareaStatus="changeTextareaStatus" :address='address'
			:pagesUrl="pagesUrl" @OnChangeAddress="OnChangeAddress" @changeClose="changeClose"></addressWindow>
		<block v-if="isShowBox">
			<checkDelivery
				:deliveryName="deliveryName"
				:isShowBox="isShowBox"
				:activeObj="activeObj"
				:radioList="radioList"
				:deliverySettings="deliverySettings[activeIndex]"
				@close="boxClose"
				@confirmBtn="handleChangeDeliveryType">
			</checkDelivery>
		</block>
		<!-- 提货点弹窗 -->
		<block v-if="isShowStation">
			<stationPopUp
				:isShowStation="isShowStation"
				:addressId = "addressId"
				:activeIndex="activeIndex"
				:activeObj = "activeObj"
				:activeStationIndex="activeStationIndex"
				:deliveryStationList="deliveryStationList"
				@closeShowStation="closeShowStation"
				@changeStationIndex="changeActIndex">
			</stationPopUp>
		</block>
		<!-- 配送时间弹窗 -->
		<block v-if="isShowTimeBox">
			<deliveryTimePopUp
				ref="deliveryTime"
				v-show="isShowTimeBox"
				:isShowTimeBox="isShowTimeBox"
				:activeIndex="activeIndex"
				:activeStationIndex="activeStationIndex"
				:deliveryStationList="deliveryStationList"
				:deliverySettings="deliverySettings"
				:deliveryTimeData="deliveryTimeData"
				@closeTimeBox="closeTimeBox"
				@changeDeliveryTimeData="changeDeliveryTimeData"
				@getCityTakeTimeData="getCityTakeTimeData"
			>
			</deliveryTimePopUp>
		</block>
		<!--优惠明细弹窗-->
		<discountDetails :isShowDiscount="isShowDiscount" @close="closeDiscount" :couponData="couponData"></discountDetails>
		<timeranges :isShow='isShow' :time='timeranges' @confrim="confrim" @cancel="cancels"></timeranges>
		<areaWindow ref="areaWindow" :display="display" :address='addressInfoArea' :cityShow='cityShow' @submit="OnAreaAddress" @changeClose="changeAddressClose"></areaWindow>
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
	let app = getApp();
	let sysHeight = uni.getSystemInfoSync().statusBarHeight + 'px';
	const CACHE_CITY = {};
	import {
		orderConfirm,
		getOrderConfirm,
		getCouponsOrderPrice,
		orderCreate,
		createOrder,
		getDeliveryStationListApi,
		getDeliverySettingsDataApi
	} from '@/api/order.js';
	import {
		getAddressDefault,
		getAddressDetail,
		getAddressList,
		getUserInfo,
		getAgreementApi
	} from '@/api/user.js';
	import { openPaySubscribe } from '@/utils/SubscribeMessage.js';
	import { initDeliveryTime } from '@/utils/deliveryTime.js';
	import { presellAgreement } from '@/api/activity.js';
	import couponListWindow from '../components/orderCoupon';
	import addressWindow from '@/components/addressWindow';
	import orderGoods from '@/components/orderGoods';
	import checkDelivery from '../components/checkDelivery/index.vue';
	import stationPopUp from '../components/stationPopUp/index.vue'; // 提货点弹窗组件
	import deliveryTimePopUp from '../components/deliveryTimePopUp/index.vue'; // 配送时间弹窗组件
	import discountDetails from '../components/discountDetails/index.vue';
	import parser from "@/components/jyf-parser/jyf-parser";
	import { mapGetters } from "vuex";
	import { toLogin } from '@/libs/login.js';
	import { configMap } from '@/utils';
	import { HTTP_REQUEST_URL } from '@/config/app';
	import dayjs from "@/plugin/dayjs/dayjs.min.js";
	import areaWindow from '@/components/areaWindow';
	import timeranges from '@/components/timeranges';

	const getDeliveryTypeList = (config, orderModel) => {
		const list = [
			{
				title: orderModel == 0 ? "ຂົນສົ່ງດ່ວນ" : "ຈັດສົ່ງເສ້ນ",
				type: "mer_delivery",
				check: config.default_delivery === "mer_delivery",
				validate: config.allow_delivery
			},
			{
				title: "ໄປຮັບທີ່ຮ້ານ",
				type: "mer_take",
				check: config.default_delivery === "mer_take",
				validate: config.allow_take
			},
			{
				title: "ຈັດສົ່ງໃນເມືອງ",
				type: "mer_city_takes",
				check: config.default_delivery === "mer_city_takes",
				validate: config.allow_city_take
			}
		];

		if (orderModel != 0) return list.slice(0, 1);

		return list
			.filter(item => item.validate)
			.map(item => ({
				title: item.title,
				type: item.type,
				check: item.check
			}));
	};

	export default {
		components: {
			couponListWindow,
			addressWindow,
			orderGoods,
			checkDelivery,
			stationPopUp,
			deliveryTimePopUp,
			discountDetails,
			"jyf-parser": parser,
			areaWindow,
			timeranges
		},
		filters: {
			filterDay(val) {
				if (val) {
					var reg = /(\d{4})\-(\d{2})\-(\d{2})/;
					var date = val.replace(reg, "$2月$3日");
					return date
				}
			}
		},
		data() {
			return {
				sysHeight: sysHeight,
				//#ifdef H5
				marTop: 0,
				//#endif
				//#ifdef MP
				marTop: uni.getSystemInfoSync().statusBarHeight+43+'px',
				//#endif
				//#ifdef APP-PLUS
				marTop: uni.getSystemInfoSync().statusBarHeight+'px',
				//#endif
				// 备注
				msgObj: {},
				textareaStatus: true,
				allowDeliveryTime: 1, // 是否允许设置配送时间
				deliveryName: 'ຂົນສົ່ງດ່ວນ',
				tagStyle: {
					img: 'width:100%;display:block;',
					video: 'width:100%;'
				},
				radioList: [],
				payType: 'weixin', //支付方式
				openType: 1, //优惠券打开方式 1=使用
				active: 0, //支付方式切换
				coupon: {
					status: false,
					list: [],
					statusTile: 'ໃຊ້ດຽວນີ້'
				}, //优惠券组件
				address: {
					address: false
				}, //地址组件
				addressInfo: {}, //地址信息
				addressId: 0, //地址id
				couponId: 0, //优惠券id
				cartId: '', //购物车id
				BargainId: 0,
				combinationId: 0,
				userInfo: {}, //用户信息
				post: {},
				mark: '', //备注信息
				couponTitle: 'ກະລຸນາເລືອກ', //优惠券
				coupon_price: 0, //优惠券抵扣金额
				useIntegral: false, //是否使用积分
				integral_price: 0, //积分抵扣金额
				integral: 0,
				status: 0,
				is_address: false,
				toPay: false, //修复进入支付时页面隐藏从新刷新页面
				shippingType: 0,
				storePostage: 0,
				cartInfo: [],
				priceGroup: {},
				animated: false,
				totalPrice: 0,
				use_integral: false,
				pagesUrl: "",
				orderKey: "",
				offlinePostage: "",
				from: '',
				orderStatus: '', //是否有地址
				couponIndex: 0, //选择商铺优惠券索引
				subCoupon: {}, //提交订单使用的优惠券
				proPrice: 0, //商品总价
				isShowBox: false,
				isAllowCloseBox: true, // 是否允许关闭弹窗
				activeObj: {}, //选中店铺信息
				activeIndex: 0, // 选中店铺索引
				isAgree: false,
				showProtocol: false,
				isCoupon: false,
				protocol: '',
				order_type: 0,
				couponData: {},
				go_map: false,
				orderPay: false,
				take: {}, // 选择到店自提的门店id与提货点数据（门店id：提货点数据）
				open_integral: 0,
				coupon_number: 0,
				store_coupon_number: 0,
				coupon_amount: 0,
				store_coupon_amount: 0,
				plant_coupon_amount: 0,
				integral_count: '',
				agrementTtile: 'ຄຳອະທິບາຍໃບແຈ້ງໜີ້',
				pics: [],
				order_model: 2,
				allow_address: true,
				order_extend: [],
				order_form: [],
				extend: {},
				virtualIndex: 0,
				platformCoupon: [],
				total_platform_coupon_price: 0,
				enabledPlatformCoupon: false,
				plantCoupon: false,
				isShowDiscount: false,
				order_key: '',
				is_take: '',
				domain: HTTP_REQUEST_URL,
				timerangesIndex:0,
				newImg: [],
				display: false,
				cityShow: 2,
				addressInfoArea: [],
				timeranges: [],
				isShow:false,
				service_type: "",
				formId: "",
				mer_id: "",
				city_take: {}, // 选择同城配送的门店id与数据（门店id：数据）
				deliveryStationList: [] ,// 提货点数据数组
				isShowStationBox: {}, // 是否显示提货点组件
				isShowStation: false, // 是否展示提货点弹窗
				activeStationIndex: {}, // 选中的提货点, key为被选中的商户索引，value为提货点索引
				isShowTimeBox: false, // 是否展示配送时间弹窗

				deliverySettings: [], // 商家配送设置

				deliveryTimeData: [], // 配送时间数据，数据为{
				// actDayIndex: 被选中的配送日期索引,
				// actTimeIndex: 被选中的配送时间索引,
				// deliveryTimeText: 预约时间文本，默认为预约时间}
				isSelectTime: {}, // 是否选择了预约时间，key为商户索引，value为true或false
				cityTakeTimeData: {}, // 组件中同城配送时间数据格式{"date":"2020-06-10","week":"周二","time":"10:00 - 12:00"}
				isInCityRange: {}, // 提货点与用户地址是否在同城配送范围内，key为商户索引，value为true或false
				formValidate: true,
				// isMountedTimeBox: false, // 是否挂载时间弹窗组件
			};
		},
		computed: {
			...mapGetters(['isLogin','viewColor']),
			...configMap(['hide_mer_status']),
			hasNotInRange() {
				return this.cartInfo.some(item => item.order.delivery_status === false);
			}
		},

		onReady() {
		},
		mounted: function() {
		},
		onLoad: function(options) {
			// #ifdef H5
			this.from = this.$wechat.isWeixin() ? 'weixin' : 'h5'
			// #endif
			// #ifdef MP
			this.from = 'routine'
			// #endif
			// #ifdef APP-PLUS
			this.from = 'weixin'
			// #endif
			if (!options.cartId) return this.$util.Tips({
				title: 'ກະລຸນາເລືອກສິນຄ້າທີ່ຕ້ອງການຊື້'
			}, {
				tab: 3,
				url: 1
			});
			this.couponId = options.couponId || 0;
			this.formId = options.formId || "";
			this.addressId = options.addressId || 0;
			this.service_type = options.serviceType;
			this.cartId = options.cartId;
			this.mer_id = options.merId;
			this.is_address = options.is_address ? true : false;
			this.news = options.new ? 1 : 0;
			if (!this.isLogin) {
				toLogin()
			}
			if (this.payType == 'weixin') {
				this.payType = this.from
			}
			let _this = this
			this.textareaStatus = true;
			if (this.isLogin && this.toPay == false && !this.orderPay) {
				this.getaddressInfo()
					.then(res => {
						res && this.initCartInfo();
					});
				this.$nextTick(function() {
					this.$refs.addressWindow.getAddressList();
					this.getUserInfo()
				})
			}
		},
		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: function() {
			let that = this;
		},
		methods: {
			checkIsDisplayDiffAmount(item, index) {
				// 检查是否要显示包邮差额
				const condition = item.order.isCityTake && this.deliverySettings[index] && this.deliverySettings[index].deliverySettings && item.order.delivery_status;
				if (condition) {
					const diffAmount = this.deliverySettings[index].deliverySettings.free_shipping_amount - item.order.total_price;
					return diffAmount > 0;
				}

				return false;
			},
			getDeliveryTypeName(cart) {
				const deliveryTypeNameMap = cart.order.deliveryTypeList
					.reduce((acc, item) => {
						acc[item.type] = item.title;
						return acc;
					}, {});
				return deliveryTypeNameMap[cart.order.default_delivery];
			},
			goBack: function() {
				uni.navigateBack();
			},
			/*预售协议*/
			getPresellAgree: function() {
				this.showProtocol = true
				this.agrementTtile = 'ຂໍ້ຕົກລົງການຈອງລ່ວງໜ້າ'
				presellAgreement().then(res => {
					this.protocol = res.data.sys_product_presell_agree;
				})
			},
			changeIsAgree: function(e) {
				this.isAgree = !this.isAgree;
			},
			changeIntegral: function(e) {
				this.use_integral = !this.use_integral;
				this.getConfirm(this.addressId);
			},
			showPresellAgree(){
				this.getPresellAgree()
			},
			showCoupon(){
				this.getCouponAgreement();
			},
			// 打开优惠明细弹窗
			openDiscount(item, index) {
				this.isShowDiscount = !this.isShowDiscount;
			},
			closeDiscount() {
				this.isShowDiscount = false
			},
			// 图片预览
			// 获得相册 idx
			getPhotoClickIdx(e) {
				let _this = this;
				let idx = e.currentTarget.dataset.index;
				_this.imgPreview(_this.pics, idx);
			},
			// 图片预览
			imgPreview: function(list, idx) {
				// list：图片 url 数组
				if (list && list.length > 0) {
					uni.previewImage({
						current: list[idx], //  传 Number H5端出现不兼容
						urls: list
					});
				}
			},

			// 获取个人信息
			getUserInfo() {
				getUserInfo().then(res => {
					this.userInfo = res.data
				})
			},
			/*获取优惠券说明*/
			getCouponAgreement() {
				let that = this
				that.showProtocol = true;
				that.agrementTtile = 'ຄຳອະທິບາຍຄູປອງ'
				getAgreementApi('sys_coupon_agree').then(res => {
					that.protocol = res.data.sys_coupon_agree
				})
			},
			// 单选
			radioChange(e, index, item){
				this.order_form[index].value = item.wordsConfig.list[e.detail.value].val
			},
			clickTextArea() {
				this.$refs.textarea.focus()
			},
			bindDateChange(e, index) {
				this.order_form[index].value = e.target.value
				this.$forceUpdate()
			},
			bindTimeChange(e, index) {
				this.order_form[index].value = e.target.value
			},
			bindSelectChange(e, index, item) {
				this.$set(this.order_form[index], 'value', item.wordsConfig.list[e.detail.value].val);
			},
			getTimeranges(index){
				this.isShow = true
				this.timerangesIndex = index
			},
			confrim(e){
			  this.isShow = false;
			  this.order_form[this.timerangesIndex].value = e.time;
				let arrayNew = [];
				e.val.forEach(item=>{
					arrayNew.push(Number(item))
				})
				this.timeranges = arrayNew;
			},
			cancels(){
				this.isShow = false;
			},
			// 多选
			checkboxChange(e, index, item){
				let obj = e.detail.value;
				let val = '';
				item.wordsConfig.list.forEach((j,jindex)=>{
				  obj.forEach(x=>{
					  if(jindex == x){
					  	val = val +(val?',':'') + j.val;
					  }
				  })
				})
				this.order_form[index].value = val
			},
			OnAreaAddress(address){
			  let addr = '';
				addr = address.map(v=>v.name).join('/');
			  this.order_form[this.timerangesIndex].value = addr;
			  CACHE_CITY[this.timerangesIndex] = address;
			},
			changeRegion(index){
				if(!this.order_form[index].value){
					this.addressInfoArea = [];
				}
				this.timerangesIndex = index;
				this.cityShow = Number(this.order_form[index].valConfig.tabVal) + 1;
				this.display = true;
				if(CACHE_CITY[index]){
					this.addressInfoArea = CACHE_CITY[index];
				}
			},
			// 关闭地址弹窗；
			changeAddressClose: function() {
				this.display = false;
			},
			/**上传文件*/
			uploadpic: function(index) {
			  let that = this;
			  this.$util.uploadImageOne('upload/image', function(res) {
			    that.newImg.push(res.data.path);
			    that.$set(that.order_form[index], 'value', that.newImg);
			  });
			},
			/**
			 * 删除图片
			 *
			 */
			DelPic: function(index, indexs) {
			  let that = this,
			  pic = this.order_form[index].value;
			  that.order_form[index].value.splice(indexs, 1);
			  that.$set(that.order_form[index], 'value', that.order_form[index].value);
			},
			// 关闭地址弹窗；
			changeClose: function() {
				this.$set(this.address, 'address', false);
			},

			// 进店
			goStore: function(id) {
				if (this.hide_mer_status != 1) {
					uni.navigateTo({
						url: `/pages/store/home/index?id=${id}`
					})
				}
			},
			ChangCouponsClose: function() {
				this.$set(this.coupon, 'status', false);
			},
			changeTextareaStatus: function() {
				for (let i = 0, len = this.coupon.list.length; i < len; i++) {
					this.coupon.list[i].use_title = '';
					this.coupon.list[i].is_use = 0;
				}
				this.textareaStatus = true;
				this.status = 0;
				this.$set(this.coupon, 'list', this.coupon.list);
			},
			/**
			 * 选择地址后改变事件
			 * @param object e
			 */
			OnChangeAddress: function(e) {
				this.textareaStatus = true;
				this.addressId = e;
				this.address.address = false;
				// 获取提货点数据并获取地址信息
				this.changeDeliveryStationData().then(()=> {
					this.getaddressInfo();
				}).catch(()=> {
					this.$util.Tips({
						title: 'ເກັບຂໍ້ມູນຈຸດເກັບສິນຄ້າລົ້ມເຫລວ'
					});
				})
			},
			bindHideKeyboard: function(e) {
				this.mark = e.detail.value;
			},
			getCoupon(coupon) {
				if (coupon.checked) {
					this.subCoupon[coupon.mer_id].forEach((item, i) => {
						if (coupon.coupon_user_id == item) {
							this.subCoupon[coupon.mer_id].splice(i, 1)
						}
					})
				} else {
					this.subCoupon[coupon.mer_id].push(coupon.coupon_user_id)
				}
				this.getConfirm(this.addressId)
			},
			/**
			 * 获取当前订单详细信息
			 *
			 */
			 async getConfirm(address_id) {
				let that = this;
				uni.showLoading({
					title: '',
					mask: true
				});
				let data = {
					cart_id: that.cartId.split(","),
					takes: that.take,
					use_coupon: that.subCoupon,
					use_integral: that.use_integral,
					city_takes: that.city_take
				}
				if(that.order_model != 4)data.takes = that.take
				if(that.service_type == 1){ //到店
					data.takes = [that.mer_id]
				} else {
					data.address_id = this.addressId
				}
				try {
					const res = await getOrderConfirm(data)
						// 默认选中
						that.is_take = false

						that.order_model = res.data.order_model
						res.data.order.forEach((el, index) => {
							if (this.cartInfo.length) {
								// 如果 cartInfo 存在数据，说明本次调用来自切换配送方式
								// 使用上一次选择的配送方式
								el.order.default_delivery = this.cartInfo[index].order.default_delivery;
							}

							if(el.order.isTake == 1)that.is_take = true
							el.isTake = 0
							that.subCoupon[el.mer_id] = []
							// 如果选择同城配送并且不在配送范围内
							if (el.order.isCityTake) {
								this.isInCityRange[index] = el.order.delivery_status
							} else {
								delete this.isInCityRange[index]
							}
							el.coupon.forEach(coupon => {
								if (coupon.checked) {
									that.subCoupon[el.mer_id].push(coupon.coupon_user_id)
								}
							})

							el.order.deliveryTypeList = getDeliveryTypeList(el.order, this.order_model);
						})
						that.subCoupon['0'] = []
						if(res.data.platformCoupon.length > 0){
							res.data.platformCoupon.forEach(el => {
								if (el.checked) {
									that.subCoupon[el.mer_id] = []
									that.subCoupon[el.mer_id].push(el.coupon_user_id)
								}
							})
						}
						that.$set(that.coupon, "coupon", that.plantCoupon ? res.data.platformCoupon : res.data.order[that.couponIndex].coupon);
						that.$set(that, "store_coupon_number",  res.data.order[that.couponIndex].order.useCouponIds.length);
						that.$set(that, "coupon_number", that.plantCoupon ? that.subCoupon['0'].length : that.store_coupon_number);
						that.$set(that, "store_coupon_amount", parseFloat(res.data.order[that.couponIndex].order.coupon_price));
						that.$set(that, "plant_coupon_amount", parseFloat(res.data.total_platform_coupon_price));
						that.$set(that, "coupon_amount", that.plantCoupon ? that.plant_coupon_amount : that.store_coupon_amount);
						that.$set(that, 'couponData', res.data);
						that.$set(that, 'cartInfo', res.data.order);
						that.$set(that, 'total_platform_coupon_price', res.data.total_platform_coupon_price);
						that.$set(that, 'enabledPlatformCoupon', res.data.enabledPlatformCoupon);
						that.$set(that, 'platformCoupon', res.data.platformCoupon);
						that.$set(that, 'order_type', res.data.order_type);
						that.$set(that, 'coupon_price', res.data.order_coupon_price);
						that.$set(that, 'integral_count', res.data.order_total_integral);
						that.$set(that, 'integral_price', res.data.order_total_integral_price);
						that.$set(that, 'open_integral', res.data.openIntegral);
						that.$set(that, 'use_integral', res.data.useIntegral);
						that.$set(that, 'order_extend', (that.order_extend && that.order_extend.length>0) ? that.order_extend : res.data.order_extend);
						if(res.data.mer_form_id && !that.order_form.length && res.data.mer_form_info && res.data.mer_form_info.value && res.data.order_model !== 1 &&  res.data.order_model !== 4){
							let formData = that.initFormData(res.data.mer_form_info.value)
							that.$set(that, 'order_form', (that.order_form && that.order_form.length>0) ? that.order_form : formData);
						}
						that.totalPrice = res.data.order_price
						that.orderStatus = res.data.status
						that.proPrice = res.data.total_price
						that.order_type = res.data.order_type
						that.allow_address = res.data.allow_address
						that.deliveryName = res.data.order_model == 0 ?  'ຂົນສົ່ງດ່ວນ' : 'ຈັດສົ່ງເສ້ນ'
						that.order_key = res.data.key
						uni.hideLoading();
						// 如果此时选择配送方式窗口在打开，则关闭
						if (this.isShowBox) {
							this.isShowBox = false;
						}

						return true;
					} catch(err) {
						this.$util.Tips({
							title: err
						});
						setTimeout(() => {
							uni.navigateBack();
						}, 1500);
						// 如果某个商户的总价格小于起送价则重置同城配送参数字段
						if (!this.activeObj.order) return;
						if ( this.activeObj.order.total_price < this.deliverySettings[this.activeIndex].deliverySettings.min_delivery_amount) {
							delete this.city_take[this.activeObj.mer_id]
						}
					};
			},
			/**表单信息格式化*/
			initFormData(form) {
				let that = this;
				let formData = that.objToArr(form)
				formData.forEach((item, index, arr)=>{
					that.$set(item, 'value', "");
					CACHE_CITY[index] = ''; //清空省市区
						if(item.name == 'texts'){
						  if(item.defaultValConfig.value){
							  item.value = item.defaultValConfig.value
						  }else{
							  item.value = ''
						  }
						}else if(item.name == 'radios'){
							item.value = item.wordsConfig.list[0].val
						}else if(item.name == 'uploadPicture'){
						  item.value = [];
						}else if(item.name == 'dateranges'){
							if(item.valConfig.tabVal==0){
							  if(item.valConfig.tabData==0){
								 let obj = dayjs(new Date(Number(new Date().getTime()))).format('YYYY-MM-DD');
								 item.value = [obj,obj]
							  }else{
								  let data1 = dayjs(new Date(Number(new Date(item.valConfig.specifyDate[0]).getTime()))).format('YYYY-MM-DD');
								  let data2 = dayjs(new Date(Number(new Date(item.valConfig.specifyDate[1]).getTime()))).format('YYYY-MM-DD');
							    item.value = [data1,data2];
							  }
							}else{
							  item.value = [];
							}
						}else{
							if(['times','dates','timeranges'].indexOf(item.name) != -1){
							  if(item.valConfig.tabVal==0){ //显示默认值
								  if(item.valConfig.tabData==0){
										if(item.name == 'times'){
											item.value = dayjs(new Date(Number(new Date().getTime()))).format('HH:mm');
										}else if(item.name == 'dates'){
											item.value = dayjs(new Date(Number(new Date().getTime()))).format('YYYY-MM-DD');
										}else{
											let current = dayjs(new Date(Number(new Date().getTime()))).format('HH:mm');
											item.value = current+' - '+current;
										}
									}else{
										if(item.name == 'times' || item.name == 'dates'){
											item.value = item.valConfig.specifyDate;
										}else{
											item.value = item.valConfig.specifyDate[0]+' - '+item.valConfig.specifyDate[1];
										}
								  }
							  }else{
									item.value = '';
							  }
							}else{
							  item.value = '';
							}
						}
					})
				function sortNumber(a, b) {
					return a.timestamp - b.timestamp;
				}
				formData.sort(sortNumber);
				return formData;
			},
			// 对象转数组
			objToArr(data) {
				let obj = Object.keys(data);
				let m = obj.map(key => data[key]);
				return m;
			},
			/*
			 * 获取默认收货地址或者获取某条地址信息
			 */
			getaddressInfo: function() {
				let that = this;
				if (that.addressId && that.addressId !=0) {
					return getAddressDetail(that.addressId).then(res => {
						res.data.is_default = parseInt(res.data.is_default);
						that.addressInfo = res.data || {};
						that.addressId = res.data.address_id || 0;
						that.address.addressId = res.data.address_id || 0;
						that.post = {real_name: res.data.real_name, phone: res.data.phone}
						return this.getConfirm(that.addressId);
					})
				} else {
					return getAddressList().then(res => {
						that.addressInfo = res.data.list.length > 0 ? res.data.list[0] : {};
						that.addressId = res.data.list.length > 0 ? res.data.list[0].address_id : 0;
						that.address.addressId = res.data.list.length > 0 ? res.data.list[0].address_id : 0;
						that.post = res.data.list.length > 0 ? {real_name: res.data.list[0].real_name,phone:res.data.list[0].phone } : {real_name: '', phone: ''}
						return this.getConfirm(that.addressId);
					})
				}
			},
			couponTap: function(item, index) {
				this.coupon = item
				this.$set(this.coupon, 'status', true)
				this.couponIndex = index
				this.plantCoupon = false
				this.$set(this, "coupon_number",  this.store_coupon_number);
				this.$set(this, "coupon_amount",  this.store_coupon_amount);
			},
			couponTap2: function(item, index) {
				this.coupon = {
					coupon: item,
					mer_id: 0,
					status: true
				}
				this.plantCoupon = true
				this.$set(this, "coupon_number",  this.subCoupon['0'].length);
				this.$set(this, "coupon_amount",  this.plant_coupon_amount);
			},
			car: function() {
				let that = this;
				that.animated = false;
			},
			onAddress: function() {
				let that = this;
				if(that.addressInfo.real_name){
					that.textareaStatus = false;
					that.address.address = true;
					that.pagesUrl = '/pages/users/user_address/index?cartId=' + this.cartId + '&couponId=' + this.couponId;
				}else{
					uni.navigateTo({
						url: `/pages/users/user_address/index?cartId=${this.cartId}`,
					});
				}
			},
			payment: function(data) {
				let that = this;
				createOrder(data).then(res => {
					if(res.data.status != 'success'){
						uni.navigateTo({
							url: `/pages/users/order_payment/index?order_id=${res.data.order_id}&from_type=order`
						})
						return
					}
					uni.hideLoading();
					let status = res.data.status,
						orderId = res.data.result.order_id,
						callback_key = res.data.result.pay_key,
						jsConfig = res.data.result.config,
						goPages = '/pages/order_pay_status/index?order_id=' + orderId + '&msg=' + res.message;
					that.orderPay = true;
					switch (status) {
						case 'ORDER_EXIST':
						case 'EXTEND_ORDER':
						case 'PAY_ERROR':
						case 'error':
							return that.$util.Tips({
								title: res.message
							}, {
								tab: 5,
								url: goPages
							});
							break;
						case 'success':
							return that.$util.Tips({
								title: res.message,
								icon: 'success'
							}, {
								tab: 5,
								url: goPages
							});
							break;
						case 'alipay':
						case "alipayQr":
							uni.navigateTo({
								url: '/pages/order_pay_back/index?keyCode=' + callback_key + '&url=' +
									jsConfig
							})
							return;
							break;
							// #ifndef MP
						case "wechat":
						case "weixin":
						case "weixinApp":
							jsConfig.timeStamp = jsConfig.timestamp;
							// #ifndef APP-PLUS
							this.$wechat.pay(jsConfig).then(res => {
								return that.$util.Tips({
									title: res.message,
									icon: 'success'
								}, {
									tab: 4,
									url: goPages
								});
							}).catch(res => {
								if (res.errMsg == 'chooseWXPay:cancel') return that.$util.Tips({
									title: '取消支付'
								}, {
									tab: 5,
									url: goPages + '&status=0'
								});
							})
							// #endif
							// #ifdef APP-PLUS
							let mp_pay_name=''
							if(uni.requestOrderPayment){
								mp_pay_name='requestOrderPayment'
							}else{
								mp_pay_name='requestPayment'
							}
							uni[mp_pay_name]({
								provider: 'wxpay',
								orderInfo: jsConfig,
								success: (e) => {
									let url = '/pages/order_pay_status/index?order_id=' + orderId +
										'&msg=支付成功';
									return that.$util.Tips({
										title: '支付成功',
										icon: 'success'
									}, {
										tab: 4,
										url: url
									});
								},
								fail: (e) => {
									let url = '/pages/order_pay_status/index?order_id=' + orderId + '&msg=取消支付';
									return that.$util.Tips({
										title: '取消支付',
									}, {
										tab: 4,
										url: url
									});
								},
								complete: () => {
									let url = '/pages/order_pay_status/index?order_id=' + orderId + '&msg=取消支付';
									return that.$util.Tips({
										title: '',
									}, {
										tab: 4,
										url: url
									});
								},
							});
							// #endif
							break;
							// #endif
							// #ifdef MP
						case "routine":
							jsConfig.timeStamp = jsConfig.timestamp;
							that.toPay = true;
							let mp_pay_name=''
							if(uni.requestOrderPayment){
								mp_pay_name='requestOrderPayment'
							}else{
								mp_pay_name='requestPayment'
							}
							uni[mp_pay_name]({
								...jsConfig,
								success: function(res) {
									uni.hideLoading();
									return that.$util.Tips({
										title: '支付成功',
										icon: 'success'
									}, {
										tab: 5,
										url: goPages
									});
								},
								fail: function(e) {
									let pages = '/pages/order_pay_status/index?order_id=' +
										orderId + '&msg=取消支付'
									return that.$util.Tips({
										title: '取消支付'
									}, {
										tab: 5,
										url: pages + '&status=0'
									});
								},
							})
							break;
							// #endif
						case "balance":
							//余额
							return that.$util.Tips({
								title: res.message
							}, {
								tab: 5,
								url: goPages + '&status=1'
							});
							break;
							// #ifdef H5
						case 'h5':
							let host = window.location.protocol + "//" + window.location.host;
							let url = `${host}/pages/order_pay_status/index?order_id=${orderId}&msg=${res.message}`
							let eUrl = encodeURIComponent(url)
							let jsurl = jsConfig.mweb_url || jsConfig.h5_url
							let locations = `${jsurl}&redirect_url=${eUrl}`
							setTimeout(() => {
								location.href = locations;
							}, 100);
							break;
							// #endif
							// #ifdef APP-PLUS
						case 'alipayApp':
							uni.requestPayment({
								provider: 'alipay',
								orderInfo: jsConfig,
								success: (e) => {
									return that.$util.Tips({
										title: '支付成功',
										icon: 'success'
									}, {
										tab: 5,
										url: goPages
									});
								},
								fail: (e) => {
									let pages = '/pages/order_pay_status/index?order_id=' +
										orderId + '&msg=支付失败'
									return that.$util.Tips({
										title: '支付失败'
									}, {
										tab: 5,
										url: pages
									});
								},
								complete: () => {
									uni.hideLoading();
									let pages = '/pages/order_pay_status/index?order_id=' +
										orderId + '&msg=取消支付'
									return that.$util.Tips({
										title: ''
									}, {
										tab: 5,
										url: pages
									});
								},
							});
							break;
							// #endif
						default:
							let pages = '/pages/order_pay_status/index?order_id=' +
								orderId + '&msg=取消支付'
							return that.$util.Tips({
								title: '取消支付'
							}, {
								tab: 5,
								url: pages + '&status=0'
							});
					}
				}).catch(err => {
					uni.hideLoading();
					return that.$util.Tips({
						title: err
					});
				});
			},
			isEmojiCharacter: function(substring) {
				if (substring) {
					for (var i = 0; i < substring.length; i++) {
						var hs = substring.charCodeAt(i);
						if (0xd800 <= hs && hs <= 0xdbff) {
							if (substring.length > 1) {
								var ls = substring.charCodeAt(i + 1);
								var uc = ((hs - 0xd800) * 0x400) + (ls - 0xdc00) + 0x10000;
								if (0x1d000 <= uc && uc <= 0x1f77f) {
									return true;
								}
							}
						} else if (substring.length > 1) {
							var ls = substring.charCodeAt(i + 1);
							if (ls == 0x20e3) {
								return true;
							}
						} else {
							if (0x2100 <= hs && hs <= 0x27ff) {
								return true;
							} else if (0x2B05 <= hs && hs <= 0x2b07) {
								return true;
							} else if (0x2934 <= hs && hs <= 0x2935) {
								return true;
							} else if (0x3297 <= hs && hs <= 0x3299) {
								return true;
							} else if (hs == 0xa9 || hs == 0xae || hs == 0x303d || hs == 0x3030 ||
								hs == 0x2b55 || hs == 0x2b1c || hs == 0x2b1b ||
								hs == 0x2b50) {
								return true;
							}
						}
					}
				}
			},
			getTime(index){
				this.virtualIndex = index;
			},
			SubOrder: function(e) {
				let that = this,
					data = {};
				if (!that.payType) return that.$util.Tips({
					title: '请选择支付方式'
				});
				if (that.orderStatus == 'noAddress') return that.$util.Tips({
					title: '请选择收货地址'
				});
				if (that.orderStatus != 'finish' && that.order_model == 0) {
					return that.$util.Tips({
						title: '收货地址不在配送区域'
					});
				}
				if (that.orderStatus == 'noDeliver') {
					return that.$util.Tips({
						title: '暂不发货'
					});
				}
				if (that.order_type == 2 && !that.isAgree && that.cartInfo[0].list[0].productPresell.presell_type ==
					2) {
					return that.$util.Tips({
						title: '请阅读并勾选协议，否则无法进行操作'
					});
				}
				if (that.is_take && that.order_model != 4) {
					if(!that.post.real_name){
						return that.$util.Tips({
							title: '请填写收货人姓名'
						});
					}
					if(!that.post.phone){
						return that.$util.Tips({
							title: '请填写收货人电话'
						});
					}
					if(that.post.phone && !/^1(3|4|5|7|8|9|6)\d{9}$/i.test(that.post.phone)){
						return that.$util.Tips({
							title: '收货人电话格式不正确'
						});
					}
				}
				// 未选择时间弹窗提示
				for (const item in this.isSelectTime) {
					if (!this.isSelectTime[item]) {
						return this.$util.Tips({
							title: '请选择预约时间'
						});
					}
				}
				// 判断是否在同城配送范围内
				for (const item in this.isInCityRange) {
					if (!this.isInCityRange[item]) {
						return this.$util.Tips({
							title: '不在配送范围内'
						});
					}
				}
				let extendArr = that.formId == 1 ? uni.getStorageSync('extendInfo') : that.getFormData();
				if(!this.formValidate) return;
				data = {
					cart_id: this.cartId.split(","),
					use_coupon: this.subCoupon,
					pay_type: this.payType,
					mark: this.msgObj,
					order_type: this.order_type,
					key: this.order_key,
					use_integral: this.use_integral,
					receipt_data: {},
					extend: extendArr,
					// #ifdef H5
					return_url: 'http://' + window.location.host + '/pages/users/order_list/index',
					// #endif
				};
				data.takes={}
				data.city_takes = {}
				if(that.order_model != 4) {
					// that.cartInfo.map(el => {
					// 	if (el.isTake == 1 || el.order.isTake) {
					// 		data.takes.push(el.mer_id)
					// 	}
					// })
					data.takes = this.take
					data.city_takes = this.city_take
					data.post = that.post
				}
				if(that.service_type == 1){ //到店
					data.post = uni.getStorageSync('customerInfo');
					data.takes = [that.mer_id]
				}else{
					data.address_id = this.addressId
				}
				if (data.mark && this.isEmojiCharacter(data.mark[Object.keys(data.mark)[0]])) {
					that.$util.Tips({
						title: '备注不允许输入表情！'
					});
					return;
				}

				if (data.payType == 'balance' && parseFloat(that.userInfo.now_money) < parseFloat(that.totalPrice))
					return that.$util
						.Tips({
							title: '余额不足！'
						});
				uni.showLoading({
					title: '订单支付中',
					mask: true
				});
				// #ifdef MP
				openPaySubscribe().then(() => {
					that.payment(data);
				});
				// #endif
				// #ifndef MP
				that.payment(data);
				// #endif
			},
			// 获取表单信息
			getFormData() {
				let that = this;
				that.formValidate = true;
				for (var i = 0; i < that.order_form.length; i++) {
				  let curdata = that.order_form[i]
				  if (['radios'].indexOf(curdata.name) == -1 && (curdata.titleShow.val || (['uploadPicture','dateranges'].indexOf(curdata.name) == -1 && curdata.value && curdata.value.trim()))) {
				    if ((curdata.name === 'texts' && curdata.valConfig.tabVal == 0) || ['dates','times','selects','citys','checkboxs'].indexOf(curdata.name) != -1) {
							if (curdata.value=="" || !curdata.value || (curdata.value && !curdata.value.trim())) {
								this.formValidate = false
								return that.$util.Tips({
									title: `请填写${curdata.titleConfig.value}`
								});

							}
						}
						if(curdata.name === 'timeranges'){
							if(!curdata.value){
								this.formValidate = false
								return that.$util.Tips({
									title: `请选择${curdata.titleConfig.value}`
								});
							}
						}
						if (curdata.name === 'dateranges') {
							if (!curdata.value.length) {
								this.formValidate = false
								return that.$util.Tips({
									title: `请选择${curdata.titleConfig.value}`
								});
							}
						}
				    if (curdata.name === 'texts' && curdata.valConfig.tabVal == 4) {
				      if (curdata.value <= 0) {
								this.formValidate = false
				        return that.$util.Tips({
				          title: `请填写大于0的${curdata.titleConfig.value}`
				        });
				      }
				    }
				    if (curdata.name === 'texts' && curdata.valConfig.tabVal == 3) {
				      if (!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(curdata.value)) {
								this.formValidate = false
				        return that.$util.Tips({
				          title: `请填写正确的${curdata.titleConfig.value}`
				        });
				      }
				    }
				    if (curdata.name === 'texts' && curdata.valConfig.tabVal == 1) {
				      if (!/^1(3|4|5|7|8|9|6)\d{9}$/i.test(curdata.value)) {
								this.formValidate = false
				        return that.$util.Tips({
				          title: `请填写正确的${curdata.titleConfig.value}`
				        });
				      }
				    }
				    if (curdata.name === 'texts' && curdata.valConfig.tabVal == 2) {
				      if (!
				        /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/i
				        .test(curdata.value)) {
								this.formValidate = false
				        return that.$util.Tips({
				          title: `请填写正确的${curdata.titleConfig.value}`
				        });
				      }
				    }
				    if (curdata.name === 'uploadPicture') {
				      if (!curdata.value.length) {
								this.formValidate = false
				        return that.$util.Tips({
				          title: `请上传${curdata.titleConfig.value}`
				        });
				      }
				    }
				  }
					this.extend[curdata.key] = curdata.value
				}
				let extendArr = []
				extendArr.push(this.extend)
				return extendArr
			},
			// 打开配送方式弹窗
			async openShowBox(item, index) {
				if (item.order.deliveryTypeList.length > 1){
					this.activeObj = item
					this.activeIndex = index
					this.radioList = item.order.deliveryTypeList;
					// 获取配送设置数据
					if (item.order.allow_city_take) {
						await this.getDeliverySettingsData(item.mer_id)
					}
					this.isShowBox = true
				}
			},
			boxClose() {
				this.isShowBox = false
			},
			// 获取提货点列表
			getDeliveryStationData(data) {
				//获取当前地址的id、配送方式以及门店id
				const pickUpPoint = {
					address_id: this.addressId,
					mer_id: data.mer_id,
				}
				if (data.order.isCityTake) {
					pickUpPoint.switch_city = 1
				} else if (data.order.isTake) {
					pickUpPoint.switch_take = 1
				}
				return getDeliveryStationListApi(pickUpPoint).then(res => {
					this.deliveryStationList[this.activeIndex] = res.data;
				}).catch(err => {
					return this.$util.Tips({
						title: err
					})
				})
			},
			// 切换地址后更改提货点列表
			async changeDeliveryStationData() {
				for(const [index, item] of this.cartInfo.entries()) {
					const pickUpPoint = {
						address_id: this.addressId,
						mer_id: item.mer_id,
					}
					if (item.order.isCityTake) {
						pickUpPoint.switch_city = 1
						delete pickUpPoint.switch_take
					} else if (item.order.isTake) {
						pickUpPoint.switch_take = 1
						delete pickUpPoint.switch_city
					}
					try {
						const res = await getDeliveryStationListApi(pickUpPoint)
						this.deliveryStationList[index] = res.data
						// 更改同城配送距离字段
						this.city_take[item.mer_id].distance = res.data[this.activeStationIndex[index]].distance
						this.city_take[item.mer_id].take_id = res.data[this.activeStationIndex[index]].station_id
						// 更改配送时间数据
						this.InitTimeData(index)
					} catch(err) {
						return this.$util.Tips({
							title: err
						})
					}
				}
			},
			async initCartInfo() {
				const tasks = this.cartInfo.map(item => this.handleUpdateCartInfo(item));
				await Promise.all(tasks);
				this.getConfirm();
			},
			async handleChangeDeliveryType(data) {
				this.cartInfo[this.activeIndex].order.default_delivery = data.order.default_delivery;
				await this.handleUpdateCartInfo(data);
				this.getConfirm()
			},
			async handleUpdateCartInfo(data) {
				const actIndex = this.activeIndex
				this.deliveryStationList[actIndex] = []
				this.activeStationIndex[actIndex] = 0 // 选择配送方式后令当前门店的提货点索引为0

				const deliveryType = data.order.default_delivery;

				uni.showLoading({ mask: true });
				if (deliveryType === "mer_take") {
					await this.updateTakeInfo(data);
				} else if(deliveryType === "mer_city_takes") {
					await this.updateCityTakeInfo(data);
				} else {
					delete this.city_take[data.mer_id]
					delete this.take[data.mer_id]
					delete this.isSelectTime[actIndex] // 选择快递配送后，删除是否选择预约时间里此商户的数据
				}
				uni.hideLoading();
			},
			async updateCityTakeInfo(cartItem) {
				const data = cartItem;
				const actIndex = this.activeIndex
				const actStationIndex = this.activeStationIndex
				await Promise.all([
					this.getDeliveryStationData(data),
					this.getDeliverySettingsData(data.mer_id)
				]);
				const stationListLength = this.deliveryStationList[this.activeIndex].length
				this.$set(this.isShowStationBox, data.mer_id, !!stationListLength);

				const deliveryTimeType = this.deliverySettings[actIndex].deliverySettings.delivery_time_type
				if (stationListLength) {
					if (deliveryTimeType == 1) {
						this.isSelectTime[actIndex] = false // 选择同城配送后，设置此商户是否预约时间的值为false

						this.city_take[data.mer_id] = {
							take_id: this.deliveryStationList[actIndex][actStationIndex[actIndex]].station_id,
							distance: this.deliveryStationList[actIndex][actStationIndex[actIndex]].distance
						}
					} else {
						this.city_take[data.mer_id] = {
							take_id: this.deliveryStationList[actIndex][actStationIndex[actIndex]].station_id,
							distance: this.deliveryStationList[actIndex][actStationIndex[actIndex]].distance,
							remarks: this.deliverySettings[actIndex].deliverySettings.delivery_prompt
						}
					}
				} else {
					if (deliveryTimeType == 1) {
						this.isSelectTime[actIndex] = false // 选择同城配送后，设置此商户是否预约时间的值为false

						this.city_take[data.mer_id] = {
							take_id: 0,
							distance: ''
						}
					} else {
						this.city_take[data.mer_id] = {
							take_id: 0,
							distance: '',
							remarks: this.deliverySettings[actIndex].deliverySettings.delivery_prompt
						}
					}
				}
				delete this.take[data.mer_id]

				if (this.deliverySettings[actIndex].deliverySettings.delivery_time_type == 1) {
					// 设置默认配送时间数据
					// this.deliveryTimeData[actIndex] = {
					// 	actDayIndex: 0, // 被选中的配送日期索引
					// 	actTimeIndex: 0, // 被选中的配送时间索引
					// 	deliveryTimeText: '预约时间', // 预约时间
					// }
					this.InitTimeData(actIndex)
				}
			},
			async updateTakeInfo(cartItem) {
				const data = cartItem;
				const actIndex = this.activeIndex
				const actStationIndex = this.activeStationIndex
				await this.getDeliveryStationData(data)
				const stationListLength = this.deliveryStationList[this.activeIndex].length
				this.$set(this.isShowStationBox, data.mer_id, !!stationListLength);
				if (stationListLength) {
					this.take[data.mer_id] = {
							take_id: this.deliveryStationList[actIndex][actStationIndex[actIndex]].station_id,
							distance: this.deliveryStationList[actIndex][actStationIndex[actIndex]].distance
						}
				} else {
					this.take[data.mer_id] = {
							take_id: 0,
							distance: ''
						}
				}
				delete this.city_take[data.mer_id]
				delete this.isSelectTime[actIndex] // 选择自提后，删除是否选择预约时间里此商户的数据
			},
			// 设置默认配送时间数据
			InitTimeData(actIndex) {
				this.deliveryTimeData[actIndex] = {
					actDayIndex: 0, // 被选中的配送日期索引
					actTimeIndex: 0, // 被选中的配送时间索引
					deliveryTimeText: '预约时间', // 预约时间
				}
				const [timeStr, timeData, dateList, timeList] = initDeliveryTime (
					actIndex,
					this.activeStationIndex,
					this.deliverySettings,
					this.deliveryStationList,
					this.deliveryTimeData
				)
				const merId = this.cartInfo[actIndex].mer_id;
				this.deliveryTimeData[actIndex] = {
					...this.deliveryTimeData[actIndex],
					deliveryTimeText: timeStr,
					dateList,
					timeList
				}
				this.city_take[merId] = { 
					...this.city_take[merId],
					...timeData,
				}
				this.isSelectTime[this.activeIndex] = true
			},
			//查看内置地图
			goMap(item, index) {
				let actStationIndex = this.activeStationIndex;
				let that = this;
				const stationData = this.deliveryStationList[index][actStationIndex[index]];

				const locationData = {
					latitude: Number(stationData.lat),
					longitude: Number(stationData.lng),
					name: stationData.station_name,
					address: stationData.station_address,
				};

				if (this?.$wechat?.isWeixin() === true) {
					this.$wechat.seeLocation(locationData)
				} else {
					uni.openLocation({
						...locationData,
						scale: 8,
						success: function(res) {
							that.go_map = true
						},
					});
				}
			},
			// 打开提货点弹窗
			openShowStation(item, index) {
				this.activeObj = item
				this.activeIndex = index
				this.isShowStation = true
			},
			// 关闭提货点弹窗
			closeShowStation() {
				this.isShowStation = false
			},
			// 修改被选中的提货点索引以及数据
			async changeActIndex(index) {
				const actIndex = this.activeIndex // 当前被选中的商户索引
				const merData = this.activeObj // 当前被选中的商户数据
				this.activeStationIndex[actIndex] = index
				this.isShowStation = false
				if (merData.order.isTake) {
					this.take[merData.mer_id] = {
							take_id: this.deliveryStationList[actIndex][index].station_id,
							distance: this.deliveryStationList[actIndex][index].distance
						}
				} else if(merData.order.isCityTake) {
					if (this.deliverySettings[actIndex].deliverySettings.delivery_time_type == 1) {
						this.isSelectTime[actIndex] = false // 重置此商户是否预约时间的值为0
						this.city_take[merData.mer_id] = {
							take_id: this.deliveryStationList[actIndex][index].station_id,
							distance: this.deliveryStationList[actIndex][index].distance
						}
						// 重置默认配送时间数据
						this.InitTimeData(actIndex)
						// this.deliveryTimeData[actIndex] = {
						// 	actDayIndex: 0, // 被选中的配送日期索引
						// 	actTimeIndex: 0, // 被选中的配送时间索引
						// 	deliveryTimeText: '预约时间', // 预约时间
						// }
					} else {
						this.city_take[merData.mer_id] = {
							take_id: this.deliveryStationList[actIndex][index].station_id,
							distance: this.deliveryStationList[actIndex][index].distance,
							remarks: this.deliverySettings[actIndex].deliverySettings.delivery_prompt
						}
					}
					delete this.take[merData.mer_id]
				}
				this.getConfirm(this.addressId)
			},
			// 判断该商品是否在此区域支持配送
			isGoodsDelivery(goods, item) {
				if (!goods.allow_city_take && item.order.isCityTake) { // 不支持同城配送且选中了同城配送
					return true
				} else if (!goods.allow_take && item.order.isTake) { // 不支持到店提货且选中了到店提货
					return true
				} else if (!goods.allow_delivery && !item.order.isCityTake && !item.order.isTake) { // 不支持快递配送且选中了快递配送
					return true
				} else {
					return false
				}
			},
			// 获取配送设置数据
			getDeliverySettingsData(merId) {
				if (this.deliverySettings[this.activeIndex]) return;
				const data = {mer_id: merId}
				return getDeliverySettingsDataApi(data).then(res => {
					this.deliverySettings[this.activeIndex] = res.data;
				}).catch(err => {
					return this.$util.Tips({
						title: err
					})
				})
			},
			// 打开配送时间弹窗
			openTimeBox(item, index) {
				this.activeObj = item;
				this.activeIndex = index;
				this.isShowTimeBox = true;
			},
			// 关闭配送时间弹窗
			closeTimeBox() {
				this.isShowTimeBox = false;
			},
			// 修改配送时间数据
			changeDeliveryTimeData(data) {
				this.deliveryTimeData[this.activeIndex].actDayIndex = data.leftIndex;
				this.deliveryTimeData[this.activeIndex].actTimeIndex = data.rightIndex;
				this.deliveryTimeData[this.activeIndex].deliveryTimeText = data.timeText;
				this.isShowTimeBox = false;
			},
			// 获取同城配送时间数据
			getCityTakeTimeData(data) {
				this.cityTakeTimeData = data;
				this.city_take[this.activeObj.mer_id] = {...this.city_take[this.activeObj.mer_id], ...data}
				this.isSelectTime[this.activeIndex] = true
				this.getConfirm(this.addressId);
			},
			// 不支持的配送方式文本
			errDeliveryTypeText(goods) {
				let text = '不支持'
				if(!goods.allow_delivery) {
					text = text+'快递配送'
				}
				if(!goods.allow_take) {
					if (!goods.allow_delivery) {
						text = text+'、'
					}
					text = text+'到店核销'
				}
				if(!goods.allow_city_take) {
					if (!goods.allow_delivery || !goods.allow_take) {
						text = text+'、'
					}
					text = text+'同城配送'
				}
				return text
			}
		}
	}
</script>

<style lang="scss" scoped>
	::v-deep checkbox .uni-checkbox-input.uni-checkbox-input-checked,
	::v-deep checkbox .wx-checkbox-input.wx-checkbox-input-checked {
	  border: 1px solid var(--view-theme)!important;
	  background-color: var(--view-theme)!important;
	  color: #fff!important;
		border-radius: 100%!important;
	}
	::v-deep checkbox .uni-checkbox-input,
	::v-deep checkbox .wx-checkbox-input {
		border-radius: 100%!important;
	}
	::v-deep radio .wx-radio-input.wx-radio-input-checked,
	::v-deep uni-radio .uni-radio-input.uni-radio-input-checked {
	 border: 1px solid var(--view-theme)!important;
	 background-color: var(--view-theme)!important;
	}
	.order-header-bg {
		height: 100rpx;
		background: linear-gradient( 360deg, #F5F5F5 0%, rgba(245,245,245,0) 100%);
		background-image: linear-gradient( 90deg, var(--view-bntColor22) 0%, var(--view-bntColor21) 100%);
		position: relative;
		&::after {
			content: "";
			position: absolute;
			left: 0;
			bottom: 0;
			width: 100%;
			height: 86rpx;
			background: linear-gradient(0deg, #F5F5F5 0%, rgba(245, 245, 245, 0) 100%);
		}
	}
	.sys-head .bg{
		background-image: linear-gradient( 90deg, var(--view-bntColor22) 0%, var(--view-bntColor21) 100%);
	}
	.order-submission{
		padding: 0 20rpx;
		position: relative;
		top: -70rpx;
	}
	.order-submission .line {
		position: absolute;
		left: 2%;
		bottom: 0;
		width: 96%;
		height: 3rpx;
	}
	.order-submission .line image {
		width: 100%;
		height: 100%;
		display: block;
	}
	.order-submission .address {
		padding: 28rpx 30rpx;
		box-sizing: border-box;
	}
	.order-submission .address .addressCon {
		width: 610rpx;
		font-size: 26rpx;
		color: #666;
	}
	.order-submission .address .addressCon .name {
		font-size: 30rpx;
		color: #282828;
		font-weight: bold;
		margin-bottom: 10rpx;
	}
	.order-submission .address .addressCon .name .phone {
		margin-left: 50rpx;
	}
	.order-submission .address .addressCon .default {
		margin-right: 12rpx;
		color: var(--view-theme);
	}
	.order-submission .address .addressCon .setaddress {
		color: #333;
		font-size: 28rpx;
	}
	.order-submission .address .iconfont {
		font-size: 35rpx;
		color: #707070;
	}
	.order-submission .allAddress {
		width: 100%;
		background-color: #fff;
		position: relative;
	}
	.order-submission .allAddress .nav {
		width: 710rpx;
		margin: 0 auto;
	}
	.order-submission .allAddress .nav .item {
		width: 355rpx;
	}
	.order-submission .allAddress .nav .item.on {
		position: relative;
		width: 250rpx;
	}
	.order-submission .allAddress .nav .item.on::before {
		position: absolute;
		bottom: 0;
		content: "快递配送";
		font-size: 28rpx;
		display: block;
		height: 0;
		width: 336rpx;
		border-width: 0 20rpx 80rpx 0;
		border-style: none solid solid;
		border-color: transparent transparent #fff;
		z-index: 2;
		border-radius: 7rpx 30rpx 0 0;
		text-align: center;
		line-height: 80rpx;
	}
	.order-submission .allAddress .nav .item:nth-of-type(2).on::before {
		content: '到店自提';
		border-width: 0 0 80rpx 20rpx;
		border-radius: 30rpx 7rpx 0 0;
	}
	.order-submission .allAddress .nav .item.on2 {
		position: relative;
	}
	.order-submission .allAddress .nav .item.on2::before {
		position: absolute;
		bottom: 0;
		content: '到店自提';
		font-size: 28rpx;
		display: block;
		height: 0;
		width: 400rpx;
		border-width: 0 0 60rpx 60rpx;
		border-style: none solid solid;
		border-color: transparent transparent #f7c1bd;
		border-radius: 40rpx 6rpx 0 0;
		text-align: center;
		line-height: 60rpx;
	}
	.order-submission .allAddress .nav .item:nth-of-type(1).on2::before {
		content: "快递配送";
		border-width: 0 60rpx 60rpx 0;
		border-radius: 6rpx 40rpx 0 0;
	}
	.order-submission .allAddress .address {
		margin: 0 auto;
	}
	.order-submission .allAddress .line {
		margin: 0 auto;
	}
	.order-submission .wrapper .item .discount .placeholder {

		text-align: right;
	}
	.order-submission .wrapper {
		margin-bottom: 20rpx;
	}
	.order-submission .wrapper .item {
		padding: 27rpx 30rpx;
		font-size: 30rpx;
		color: #282828;
	}
	.order-submission .virtual_form{
		padding: 0 30rpx;
	}
	::v-deep .order-submission .virtual_form .uni-input-wrapper {
		text-align: right;
	}
	.order-submission .virtual_form .item-require{
		color: red;
		margin-right: 4rpx;
	}
	.order-submission .virtual_form .item{
		padding: 27rpx 0;
	}
	.order-submission .virtual_form .item.on .discount{
		max-width: 460rpx;
	}
	.order-submission .virtual_form .item.pd0{
		padding-bottom: 0;
	}
	.order-submission .virtual_form .item .radio{
	  margin: 0 22rpx 0 22rpx;
	  padding: 10rpx 0;
	}
	.upload {
		display: -webkit-box;
		display: -moz-box;
		display: -webkit-flex;
		display: -ms-flexbox;
		display: flex;
		-webkit-box-lines: multiple;
		-moz-box-lines: multiple;
		-o-box-lines: multiple;
		-webkit-flex-wrap: wrap;
		-ms-flex-wrap: wrap;
		flex-wrap: wrap;
	}
	.order-submission .virtual_form .pictrue {
		width: 146rpx;
		height: 146rpx;
		margin: 20rpx 20rpx 0 0;
		position: relative;
		font-size: 11px;
		color: #bbb;
		border-radius: 8rpx;
		&:nth-child(4n) {
			margin-right: 0;
		}
		&:nth-last-child(1) {
			border: 0.5px solid #ddd;
			box-sizing: border-box;
		}
		uni-image,
		image {
			width: 100%;
			height: 100%;
			img {
				-webkit-touch-callout: none;
				-webkit-user-select: none;
				-moz-user-select: none;
				display: block;
				position: absolute;
				top: 0;
				left: 0;
				opacity: 0;
				width: 100%;
				height: 100%;
			}
		}
		.icon-ic_close {
			color: #fff;
			font-size: 14rpx;
			position: absolute;
			top: 0;
			right: 0;
			width: 30rpx;
			height: 30rpx;
			text-align: center;
			line-height: 30rpx;
			border-radius: 0 8rpx 0 8rpx;
			background: rgba(0,0,0,.6);
		}
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
	.order-submission .wrapper .item .discount {
		font-size: 30rpx;
		&.discount_voice {
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			max-width: 460rpx;
			text-align: right;
		}
	}
	.order-submission .wrapper .item .discount .iconfont {
		color: #515151;
		font-size: 30rpx;
		// margin-left: 12rpx;
		margin-left: 4rpx;
	}
	.order-submission .wrapper .item .discount .num {
		font-size: 32rpx;
		margin-right: 20rpx;
	}
	.order-submission .wrapper .item .shipping {
		font-size: 30rpx;
		color: #999;
		position: relative;
		padding-right: 58rpx;
	}
	.order-submission .wrapper .item .shipping .iconfont {
		font-size: 35rpx;
		color: #707070;
		position: absolute;
		right: 0;
		top: 50%;
		transform: translateY(-50%);
		margin-left: 30rpx;
	}
	.order-submission .wrapper .item input {
		flex: 1;
		height: 100%;
		margin-left: 20rpx;
		text-align: right;
	}
	.order-submission  .placeholder {
		color: #ccc;
	}
	.order-submission .wrapper .item .list {
		margin-top: 35rpx;
	}
	.order-submission .moneyList {
		margin-top: 20rpx;
		background-color: #fff;
		padding: 0 30rpx;
	}
	.order-submission .moneyList .item {
		font-size: 30rpx;
		color: #282828;
		line-height: 90rpx;
	}
	.order-submission .moneyList .item .money {
		color: #999999;
		display: flex;
		align-items: center;
	}
	.order-submission .footer {
		width: 100%;
		height: 100rpx;
		height: calc(120rpx + constant(safe-area-inset-bottom)); ///兼容 IOS<11.2/
		height: calc(120rpx + env(safe-area-inset-bottom)); ///兼容 IOS>11.2/
		background-color: #fff;
		padding: 0 30rpx;
		font-size: 28rpx;
		color: #333;
		box-sizing: border-box;
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 30;
		.footer_count{
			font-size: 28rpx;
			>view {
				align-items: baseline;
			}
			.pColor {
				margin-left: 12rpx;
			}
		}
		.coupon_price{
			color: #999999;
			font-size: 22rpx;
			margin-top: 10rpx;
			text{
				color: #666666;
				background: #F5F5F5;
				border-radius: 26rpx;
				margin-left: 20rpx;
				height: 34rpx;
				line-height: 34rpx;
				display: inline-block;
				width: 104rpx;
				text-align: center;
				font-size: 18rpx;
			}
		}
	}
	.pColor{
		color: var(--view-priceColor);
	}
	.order-submission .footer .settlement {
		font-size: 30rpx;
		color: #fff;
		width: 200rpx;
		height: 72rpx;
		background-color: var(--view-theme);
		border-radius: 60rpx;
		text-align: center;
		line-height: 72rpx;
		font-size: 26rpx;
		&.disabled {
			background-color: #cccccc;
		}
	}
	.event_bg {
		background: #FF7F00;
	}
	.event_color {
		color: #FF7F00;
	}
	.color_red {
		color: var(--view-theme);
	}
	.storeinfo-wrapper {
		.store-item {
			margin-top: 12rpx;
			.store-title {
				display: flex;
				align-items: center;
				padding: 28rpx 30rpx;
				.icon-ic_mall {
					font-size: 32rpx;
				}
				.icon-ic_rightarrow {
					font-size: 26rpx;
				}
				.txt {
					margin: 0 8rpx;
				}
			}
			.product-item {
				display: flex;
				padding: 0 30rpx;
				margin-bottom: 20rpx;

				.img-box {
					width: 130rpx;
					height: 130rpx;
					image {
						width: 130rpx;
						height: 130rpx;
						border-radius: 16rpx;
					}
				}
				.content {
					position: relative;
					width: 550rpx;
					margin-left: 30rpx;
					font-size: 28rpx;
					color: #282828;
					overflow: hidden;
					.name {
						max-width: 400rpx;
					}
					&.event_content {
						.line1 {
							width: 360rpx;
						}
						.price {
							position: absolute;
							top: 0;
							right: 0;
							margin-top: 0;
							color: var(--view-theme);
							text-align: right;
							.num{
								color: #999;
								font-size: 22rpx;
								margin-top: 10rpx;
							}
						}
					}
					.event_name {
						display: inline-block;
						margin-right: 9rpx;
						color: #fff;
						font-size: 20rpx;
						padding: 0 8rpx;
						line-height: 30rpx;
						text-align: center;
						border-radius: 6rpx;
					}
					.event_ship {
						font-size: 20rpx;
						margin-top: 10rpx;
					}
					.label {
						margin-top: 10rpx;
						color: #999999;
						font-size: 20rpx;
					}
					.price {
						margin-top: 20rpx;
						position: relative;

						.delivery_type{
							float: right;
							text{
								color: var(--view-priceColor);
								font-size: 13px;
							}
						}
					}
					.num {
						margin-left: 10rpx;
						color: #999;
						font-size: 26rpx;
					}
					.err-txt {
						display: flex;
						// align-items: center;
						align-items: baseline;
						margin-top: 18rpx;
						color: $theme-color;
						font-size: 22rpx;
						font-weight: 400;
						.iconfont {
							margin-right: 10rpx;
							font-size: 22rpx;
						}
					}
				}
			}
		}
		.event_payTime {
			padding: 0 30rpx 24rpx;
			.event_progress {
				margin-top: 50rpx;
				position: relative;
			}
			.progress_step {
				height: 80rpx;
				position: relative;
				padding-left: 60rpx;
				&::before {
					content: '';
					display: block;
					width: 2rpx;
					height: 40rpx;
					background: var(--view-theme);
					position: absolute;
					left: 35rpx;
					top: 18rpx;
				}
				&:nth-child(2) {
					&::before {
						bottom: 64rpx;
						top: auto;
						background: #EFEFEF;
					}
					&::after {
						background: #EFEFEF;
					}
				}
				&::after {
					content: '';
					display: block;
					width: 14rpx;
					height: 14rpx;
					background: var(--view-theme);
					border-radius: 50%;
					position: absolute;
					top: 10rpx;
					left: 29rpx;
				}
				.name {
					float: left;
					color: #282828;
					&.color_red {
						color: var(--view-theme);
					}
				}
				.price {
					float: right;
					color: #282828;
					&.color_red {
						color: var(--view-priceColor);
					}
				}
			}
			.progress_pay {
				padding-left: 60rpx;
				font-size: 24rpx;
				color: #999999;
				margin-top: -34rpx;
			}
		}
	}
	.integral_checked {
		margin-left: 10rpx;
		display: inline;
		.iconfont{
			font-size: 38rpx;
		}
		.icon-ic_unselect {
			color: #BFBFBF;
		}
		.icon-a-ic_CompleteSelect {
			color: var(--view-theme);
		}
	}
	uni-checkbox-group,
	.checkgroup {
		width: 100%;
		.checkbox {
			float: right;
		}
	}
	.icon-icon_question {
		color: #bbb;
		font-size: 36rpx;
		margin-left: 16rpx;
	}
	.total {
		display: flex;
		justify-content: space-between;
		// padding-right: 30rpx;
		// padding-bottom: 30rpx;
		padding: 0 30rpx 30rpx 30rpx;
		font-size: 26rpx;
		align-items: center;
		.shipping-amount {
			color: var(--view-priceColor);
			font-size: 13px;
		}
		.price {
			margin-left: 10rpx;
			color: var(--view-priceColor);
			font-size: 28rpx;
			font-weight: bold;
			text {
				font-size: 20rpx;
			}
		}
	}
	.store-address {
		padding: 26rpx 28rpx;
		margin: 0 30rpx;
		background: #F6F6F6;
		border-radius: 16rpx;
		font-size: 24rpx;
		display: -webkit-box;
		display: -moz-box;
		display: -ms-flexbox;
		display: -webkit-flex;
		display: flex;
		/*垂直居中*/
		-webkit-box-align: center;
		/*旧版本*/
		-moz-box-align: center;
		/*旧版本*/
		-ms-flex-align: center;
		/*混合版本*/
		-webkit-align-items: center;
		/*新版本*/
		align-items: center;
		justify-content: space-between;
		/*新版本*/
		.pick-up-point-box {
			padding-right: 44rpx;
			.name {
				// width: 148rpx;
				margin-right: 20rpx;
				font-weight: 500;
				font-size: 28rpx;
				color: #333333;
				.icon-ic_rightarrow {
					font-size: 28rpx;
					color: #333333;
					margin-left: 4rpx;
				}
			}
			.info {
				flex: 1;
				font-weight: 400;
				font-size: 22rpx;
				color: #666666;
				margin-top: 30rpx;
				.distance {
					// border-right: 1rpx solid #CCCCCC;
					// padding-right: 12rpx;
					// margin-right: 12rpx;
					position: relative;
					&::after {
						position: relative;
						bottom: 0;
						display: inline-block;
						content: '';
						width: 1rpx;
						height: 18rpx;
						background-color: #CCCCCC;
						margin: 0 12rpx;
					}
				}
			}
		}
		.map {
			flex-shrink: 0;
			text-align: center;
			position: relative;
			padding-left: 44rpx;
			&::before {
				content: '';
				display: inline-block;
				width: 2rpx;
				height: 42rpx;
				background-color: #DDDDDD;
				position: absolute;
				left: 0;
				top: 18rpx;
			}
			.iconfont {
				// color: var(--view-theme);
				color: #333333;
			}
			.map_text {
				// color: var(--view-theme);
				color: #333333;
			}
		}
	}
	// 配送方式后的错误文本
	.delivery-type {
		align-items: baseline;
		.delivery-type-err {
			color: $theme-color;
			font-size: 22rpx;
			font-weight: 400;
			.iconfont {
				margin-right: 10rpx;
				font-size: 22rpx;
			}
		}
	}

	// 发票icon
	.invoice-icon {
		font-size: 30rpx;
	}
	.flex-box {
		display: flex;
	}
	.fs-10px {
		font-size: 10px;
	}
</style>
