// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016-2026 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------
import { CART_TIME,CART_ID} from '@/config/cache';
import Cache from '../utils/cache';
// 定义常量表示两小时的毫秒数
const TWO_HOURS_IN_MS = 2 * 60 * 60 * 1000;
export function checkCart() {
	try {
		const cachedTime = Cache.get(CART_TIME);
		let cartTime = 0;
		if (cachedTime) {
		  cartTime = cachedTime + TWO_HOURS_IN_MS;
		}
	
		const newTime = Date.now();
		if (cartTime < newTime) {
		  Cache.clear(CART_ID);
		  Cache.clear(CART_TIME);
		  return false;
		}
		return true;
	  } catch (error) {
		console.error('检查购物车缓存时出错:', error);
		// 出错时默认返回 false，可根据实际业务调整
		return false;
	}
}
