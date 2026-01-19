import request from "@/utils/request.js";

// 获取员工订单列表
export function getStaffOrderList(where) {
  return request.get("staffs/order_lst", where, { login: true });
}

// 获取员工订单详情
export function getStaffOrderDetail(orderId) {
  return request.get(`staffs/order/${orderId}`, null, { login: true });
}

// 领取工单
export function rushStaffOrder(orderId) {
  return request.post(`staffs/order/${orderId}/dispatch`, null, { login: true });
}

// 订单打卡
export function checkinStaffOrder(orderId, data) {
  return request.post(`staffs/order/${orderId}/check`, data, { login: true });
}

// 订单核销
export function verifyStaffOrder(orderId, data) {
  return request.post(`staffs/order/${orderId}/verifier`, data, { login: true });
}

// 地址解析
export function geocoding(address) {
  return request.get(`lbs/address`, { address }, { login: true });
}

// 获取门店员工预约打卡配置
export function getMerStaffCheckinConfig(merId) {
  return request.get(`staffs/reservation/config`, { mer_id: merId }, { login: true });
}

// 保存员工订单服务记录
export function saveStaffOrderServiceRecord(orderId, data) {
  return request.post(`staffs/order/${orderId}/trace`, data, { login: true });
}

// 保存员工订单备注
export function saveStaffOrderRemark(orderId, data) {
  return request.post(`staffs/order/${orderId}/mark`, data, { login: true });
}

// 获取员工订单列表(新)
export function getDeliveryStaffOrderList(data) {
	return request.get(`delivery/order_lst`, data, { login: true });
}

// 领取订单
export function receiveServedOrder(id) {
	return request.post(`delivery/order/${id}/receive`, null, { login: true });
}
// 确认送达订单
export function confirmeServedOrder(id, data) {
	return request.post(`delivery/order/${id}/confirm`, data, { login: true });
}
// 订单详情
export function getOrderDetail(id) {
	return request.get(`delivery/order/${id}`, null, { login: true });
}
// 订单备注
export function saveOrderRemark(id, data) {
	return request.post(`delivery/order/${id}/mark`, data, { login: true });
}