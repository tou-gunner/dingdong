<template>
  <view class="role-toggle-wrapper">
    <view class="toggle-mask" v-if="menuVisible" @click="handleCloseMenu"></view>
    <button class="role-toggle-btn" @click="handleToggleMenu">
      <text class="role-name">{{ roleName }}</text>
      <text class="iconfont icon-ic_downarrow"></text>
    </button>
    <view class="role-toggle-menu" v-if="menuVisible" @click="handleToggleRole" :class="{ 'use-theme-color': useThemeColor }">
      <view class="role-toggle-menu-item" v-for="item of roleList" :key="item.role"
        :class="{ active: currentRole === item.role }" :data-role="item.role">
        {{ item.name }}
      </view>
    </view>
  </view>
</template>

<script>
import { mapGetters } from "vuex";
import { ROLES, RoleManager, ROLES_VALUES } from "@/utils/role";

export default {
  name: "role-toggle",
  created() {
    this.$store.dispatch("USERINFO");
    RoleManager.subscribeRoleChange(this.setRole);
  },
  destroyed() {
    RoleManager.unsubscribeRoleChange(this.setRole);
  },
  props: {
    useThemeColor: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      currentRole: RoleManager.getRole(),
      menuVisible: false
    }
  },
  computed: {
    ...mapGetters(["userInfo"]),
    roleList() {
      const roleList = [
        {
          role: ROLES.NORMAL,
          name: "ຜູ້ໃຊ້ຮ້ານຄ້າ"
        }
      ];

      if (this.userInfo.staffs?.length) {
        roleList.unshift({
          role: ROLES.STAFF,
          name: "ພະນັກງານບໍລິການ"
        });
      }

      if (this.userInfo.service) {
        roleList.unshift({
          role: ROLES.MERCHANT,
          name: "ບໍລິການລູກຄ້າຮ້ານຄ້າ"
        });
      }
			
			if (this.userInfo.delivery?.length) {
				roleList.unshift({
				  role: ROLES.DELIVERY_STAFF,
				  name: "ພະນັກງານຈັດສົ່ງ"
				});
			}
      return roleList;
    },
    roleName() {
      return this.roleList.find(item => item.role === this.currentRole)?.name;
    }
  },
  watch: {
    userInfo: {
      handler(val) {
        // 如果用户本地角色权限和后端返回的角色权限不一致，则更新本地角色
        if (!this.userInfo?.uid) return;

        const currentRole = this.currentRole;
        if (currentRole === ROLES.NORMAL) return;
        const hasStaffPermission = !!this.userInfo.staffs?.length;
        const hasMerchantPermission = !!this.userInfo.service;

        const invalidRole = [
          !hasStaffPermission && currentRole === ROLES.STAFF,
          !hasMerchantPermission && currentRole === ROLES.MERCHANT,
        ];
        
        // 如果拥有非法权限，则清理本地角色，并跳转至首页
        if (invalidRole.some(Boolean)) {

          // 判断当前页面是否是员工/客服页面
          // 如果是，则重载到普通用户首页
          const pages = getCurrentPages();
          const currentPage = pages[pages.length - 1].route;
          const roleRoute = RoleManager.getRoleRoute(currentRole);
          const requireRelaunch = roleRoute.includes(currentPage);

          this.currentRole = ROLES.NORMAL;
          RoleManager.setRole(ROLES.NORMAL);

          if (requireRelaunch) {
            uni.reLaunch({
              url: RoleManager.getRoleRoute(ROLES.NORMAL)
            })
          }
        }
      },
      immediate: true
    }
  },
  methods: {
    setRole(role) {
      this.currentRole = role;
    },
    checkIfNeedNavigate(role) {
      const targetRoute = RoleManager.getRoleRoute(role);
      const pages = getCurrentPages();
      const currentPage = pages[pages.length - 1].route;
      if (!targetRoute.includes(currentPage)) {
        if (role === ROLES.NORMAL) {
          uni.switchTab({
            url: targetRoute
          })
        } else {
          uni.navigateTo({
            url: targetRoute
          })
        }
      }
    },
    handleToggleMenu() {
      this.menuVisible = !this.menuVisible;
    },
    handleCloseMenu() {
      this.menuVisible = false;
    },
    handleToggleRole(e) {
      const { role } = e.target.dataset;
      this.handleCloseMenu();
      if (ROLES_VALUES.includes(role) && role !== this.currentRole) {
        this.currentRole = role;
        RoleManager.setRole(role);
        this.checkIfNeedNavigate(role);
      }
    }
  }
}
</script>

<style scoped lang="scss">
.role-toggle-wrapper {
  position: relative;
  z-index: 3;
  width: fit-content;
}

.toggle-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.role-toggle-btn {
  height: 42rpx;
  padding-inline: 16rpx;
  background-color: transparent;
  border: .5px solid #fff;

  // 修复 .5px 边框在 iOS 平台渲染异常的问题
  transform: translateZ(0px);
  //

  display: inline-flex;
  align-items: center;
  border-radius: 21rpx;
  gap: 4rpx;
  color: #fff;
  font-size: 24rpx;

  .iconfont {
    font-size: inherit;
  }
}

.role-toggle-menu {
  position: absolute;
  left: -6rpx;
  right: -6rpx;
  top: calc(100% + 27rpx);
  padding: 32rpx;
  color: #333333;
  font-size: 26rpx;
  background: #FFFFFF;
  box-shadow: 0rpx 0rpx 16rpx 0rpx rgba(0, 0, 0, 0.08);
  border-radius: 8rpx;

  &::before {
    content: "";
    width: 14rpx;
    height: 14rpx;
    background: #FFFFFF;
    position: absolute;
    top: -7rpx;
    right: 27rpx;
    transform: rotate(45deg);

  }

  &.use-theme-color {
    .role-toggle-menu-item.active {
      color: var(--view-theme);
    }
  }

  .role-toggle-menu-item {
    width: 4em;
    &.active {
      color: #2A7EFB;
    }

    &+.role-toggle-menu-item {
      margin-top: 32rpx;
    }
  }
}
</style>
