
let cacheDeviceInfo = null;

/**
 * 获取并缓存系统信息
 * @returns 
 */
export const getSystemInfo = () => {
  if (!cacheDeviceInfo) {
    cacheDeviceInfo = uni.getSystemInfoSync();
  }
  return cacheDeviceInfo;
};


/**
 * 获取并缓存胶囊按钮位置信息
 * @returns 
*/
// #ifdef MP-WEIXIN
let cacheMenuButtonInfo = null;

export const getMenuButtonBoundingClientRect = () => {
  if (!cacheMenuButtonInfo) {
    cacheMenuButtonInfo = wx.getMenuButtonBoundingClientRect();
  }
  return cacheMenuButtonInfo;
};
// #endif

