// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016-2026 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------
export function getTouchPoints(touchs) {
	return Array.from(touchs).map(ev => {
		return [ev.clientX, ev.clientY]
	})
}
// 函数防抖
export function debounce(fn, wait = 200) {
	var timer = null;
	return function (){
		if (timer !== null) {
			clearTimeout(timer);
		}
		timer = setTimeout(fn.bind(this), wait);
	}
}

/**
 * @description 睡眠
 * @param {number} time 等待时间毫秒数
 */
export function sleep(time = 200) {
	return new Promise(resolve => {
		setTimeout(resolve, time)
	})
}

export function log(message,type='log'){
	if(process.env.NODE_ENV === 'development'){
		console[type](message)
	}
}
