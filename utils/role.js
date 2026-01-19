import store from '@/store';

const ROLE_KEYS = "user-role-keys";

export const ROLES = {
  NORMAL: "normal",
  MERCHANT: "merchant",
  STAFF: "staff",
	DELIVERY_STAFF: "delivery_staff", 
};

export const ROLES_VALUES = Object.values(ROLES);

const ROLE_ROUTES = {
  [ROLES.NORMAL]: "/pages/user/index",
  [ROLES.MERCHANT]: "/pages/admin/business/index?is_sys=0",
  [ROLES.STAFF]: "/pages/staff/order_list",
	[ROLES.DELIVERY_STAFF]: "/pages/delivery/order_list",
};

export class RoleManager {
  static roleCallbacks = [];

  static getRole() {
    const roleKeys = uni.getStorageSync(ROLE_KEYS);
    if (ROLES_VALUES.includes(roleKeys)) {
      return roleKeys;
    }
    RoleManager.setRole(ROLES.NORMAL);
    return ROLES.NORMAL;
  }

  static subscribeRoleChange(callback) {
    RoleManager.roleCallbacks.push(callback);
  }

  static unsubscribeRoleChange(callback) {
    RoleManager.roleCallbacks = RoleManager.roleCallbacks.filter(cb => cb !== callback);
  }

  // 从引导页进入时，若角色为商城用户，则跳转至首页
  static getRoleRoute(role = this.getRole(), fromGuidePage = false) {
    if (!ROLES_VALUES.includes(role)) throw new Error("Invalid role");

    const fromGuideAndNormal = fromGuidePage && role === ROLES.NORMAL;
    const notNormalAndNoToken = role !== ROLES.NORMAL && !store.state.app.token;

    if (notNormalAndNoToken) {
      RoleManager.clearRole();
    }

    if (fromGuideAndNormal || notNormalAndNoToken) {
      return "/pages/index/index";
    }

    return ROLE_ROUTES[role];
  }

  static setRole(role) {
    uni.setStorageSync(ROLE_KEYS, role);
    RoleManager.roleCallbacks.forEach(cb => cb(role));
  }

  static clearRole() {
    uni.removeStorageSync(ROLE_KEYS);
  }
}