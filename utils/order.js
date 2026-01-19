import { geocoding } from "@/api/staff";
import dayjs from "@/plugin/dayjs/dayjs.min";

export const getBookingOrderStatus = (order) => {
  if (order.status === -1) return "已取消";
  if (!order.paid) return "待支付";
  if (order.is_instore_order) {
    // 到店订单
    if (order.status === 0) return "待核销";
    if (order.status === 2) return "待评价";
    return "交易完成";
  } else {
    // 上门订单
    if (order.status === 0) return "派单中";
    if (order.status === 1) return "待服务";
    if (order.status === 20) return "服务中";
    if (order.status === 2) return "待评价";
    return "交易完成";
  }
}
// 同城配送
export const getCityDeliveryOrderStatus = (order) => {
  if (order.status === -1) return "已取消";
  if (!order.paid) return "待支付";
	if (order.status === 0) return "待领取";
	if (order.status === 1) return "待配送";
	if (order.status === 2) return "待评价";
	return "交易完成";
}
// 到店核销订单客服管理端状态
export const getVerifyOrderAdminStatus = (order) => {
  if (order.status === -1) return "已取消";
  if (!order.paid) return "待支付";
	if (order.status === 0) return "待核销";
	if (order.status === 2) return "待评价";
	return "交易完成";
}
// 快递配送客服管理端状态
export const getDeliveryOrderAdminStatus = (order) => {
  if (order.status === -1) return "已取消";
  if (!order.paid) return "待支付";
	if (order.status === 0) return "待发货";
	if (order.status === 1) return "待收货";
	if (order.status === 2) return "待评价";
	return "交易完成";
}
// 同城配送客服管理端状态
export const getCityDeliveryOrderAdminStatus = (order) => {
  // if (order.status === -1) return "已取消";
  // if (!order.paid) return "待支付";
	if (order.status === 0) return "待配送";
	if (order.status === 1) return "配送中";
	if (order.status === 2) return "待评价";
	return "交易完成";
}

export const addBookingOrderType = order => {
  // 是否是预约订单
  order.is_booking_order = order.is_virtual === 4;
  // 是否是到店订单
  order.is_instore_order = order.is_booking_order && order.order_type === 1;
}

export const handleMakeCallPhone = phone => {
  uni.makePhoneCall({
    phoneNumber: phone
  });
}

export const handleOpenLocation = async (address) => {
  uni.showLoading({ mask: true });

  try {
    const result = await geocoding(address);
    const { lng: longitude, lat: latitude } = result.data.location;
    uni.hideLoading();
    uni.openLocation({
      latitude: Number(latitude),
      longitude: Number(longitude),
      address
    });
  } catch (err) {
    uni.hideLoading();
    uni.showToast({
      title: err,
      icon: "none"
    });
  }
}

const getClockInInfo = (orderInfo) => {
  const info = (Array.isArray(orderInfo.clock_in_info) || !orderInfo.clock_in_info) ? null : orderInfo.clock_in_info;
  return info;
}

const getServiceList = (orderInfo) => {
  const info = getClockInInfo(orderInfo);

  const getTimeDuration = () => {
    if (!info) return "-";
    const { verify_time } = orderInfo;
    if (!info.clock_time || !verify_time) return "-";
    const clockTime = dayjs(info.clock_time);
    const verifyTime = dayjs(verify_time);
    const diffTime = verifyTime.diff(clockTime, "minutes");
    return (diffTime < 1 ? 1 : diffTime) + "分钟";
  }

  const config = [
    {
      label: "服务人员",
      value: orderInfo.staffs?.name || "-"
    },
    {
      label: "联系电话",
      value: orderInfo.staffs?.phone || "",
      isPhone: true
    },
    {
      label: "开始服务时间",
      value: info ? info.clock_time : "-",
      isDate: true
    },
    {
      label: "结束服务时间",
      value: orderInfo.verify_time || "-",
      isDate: true
    },
    {
      label: "服务时长",
      value: getTimeDuration()
    }
  ];

  if (orderInfo.enable_assigned == 0 || orderInfo.enable_checkin == 0) {
    config.splice(2, 1)
  }

  return config;
};

export const getSignList = (orderInfo) => {
  const info = getClockInInfo(orderInfo);
  return [
    {
      label: "打卡时间",
      value: info?.clock_time || "-"
    },
    {
      label: "打卡备注",
      value: info?.remark || "-"
    },
    {
      label: "打卡照片",
      isImage: true,
      value: info?.images || []
    }
  ];
};


export const getServiceProcessList = (orderInfo) => {
  const info = (Array.isArray(orderInfo.reservation_service_voucher) || !orderInfo.reservation_service_voucher) ? null : orderInfo.reservation_service_voucher;
  if (!info) return;
  return Object.entries(info).map(([label, value]) => ({
    label,
    value,
    isImage: Array.isArray(value)
  }));
}

export const buildFormList = formConfig => {
  const result = [];
  for (let [label, value] of Object.entries(formConfig)) {
    const item = {
      label,
      value
    };
    if (Array.isArray(value)) {
      item.isImage = true;
    }
    result.push(item);
  }
  return result;
}

export const getTableList = (orderInfo, formData) => {
  if (!orderInfo) {
    return [];
  }

  const result = [];
  if (!orderInfo.is_instore_order) {
    result.push({
      title: "服务信息",
      list: getServiceList(orderInfo)
    });

    // 已经打过卡
    if (orderInfo.status > 1) {
      result.push({
        title: "打卡信息",
        list: getSignList(orderInfo)
      });

      const processList = getServiceProcessList(orderInfo);
      if (processList && processList.length) {
        result.push({
          title: "服务过程留凭",
          list: processList
        });
      }
    }
  }

  if (orderInfo.order_extend?.length) {
    for (let formConfig of orderInfo.order_extend) {
      result.push({
        title: formData ? formData.name : "表单信息",
        list: buildFormList(formConfig)
      });
    }
  }

  return result;
}

export const BtnUtil = {
  getReedemStatus(item, merConfig) {
    // 服务中则可以核销
    if (item.status === 20) return true;

    if (item.status === 1) {
      const allowCheckin = this.getCheckinStatus(item, merConfig);
      // 如果无需打卡，则允许核销
      if (!allowCheckin) return true;
    }

    // 其他状态则不能核销
    return false;
  },
  getServiceRecordStatus(item, merConfig) {
    if (![1, 20].includes(item.status)) return false;
    const { enable_trace, trace_form_id } = merConfig;
    const allowRecord = enable_trace == 1 && !!trace_form_id;
    return allowRecord && (item.status === 20 || !this.getCheckinStatus(item, merConfig));
  },
  getCheckinStatus(item, merConfig) {
    const { enable_checkin } = merConfig;
    return enable_checkin == 1 && item.status === 1;
  },
}