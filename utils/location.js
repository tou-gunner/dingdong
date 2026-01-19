
/**
 * 计算两个经纬度之间的距离（单位：米）
 * @param {Object} location1 - 第一个经纬度对象，包含 latitude 和 longitude 属性
 * @param {Object} location2 - 第二个经纬度对象，包含 latitude 和 longitude 属性
 * @returns {number} 两个经纬度之间的距离（单位：米）
 */
export const getDistanceInMeters = (location1, location2) => {
  const EARTH_RADIUS = 6378137.0; // 地球半径，单位为米
  const radLat1 = (location1.latitude * Math.PI) / 180.0;
  const radLat2 = (location2.latitude * Math.PI) / 180.0;
  const a = radLat1 - radLat2;
  const b = (location1.longitude - location2.longitude) * Math.PI / 180.0;
  const s = 2
    * Math.asin(
      Math.sqrt(
        Math.pow(Math.sin(a / 2), 2)
        + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)
      )
    );
  return s * EARTH_RADIUS;
};