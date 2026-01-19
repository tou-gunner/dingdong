// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016-2026 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------
import { spread } from "@/api/user";
import Cache from "@/utils/cache";
import Store from '@/store/index';
export function configMap(args, init) {
	if (Array.isArray(args)) {
		return args.reduce((i, v) => {
			i[v] = () => Store.getters.globalData[v];
			return i;
		}, init || {})
	} else {
		return Object.keys(args).reduce((i, v) => {
			i[v] = () => {
				const val = Store.getters.globalData[v];
				return (val === undefined || val === null || val === '') ? args[v] : val;
			};
			return i;
		}, init || {})
	}
}
export function redirect(url) {
	uni.switchTab({
		url,
		fail() {
			uni.redirectTo({
				url
			})
		}
	})
}
/**
 *  转换商户跳转链接, 自动追加商户 id
 * @param {string} path
 * @param {int} mer_id
 * @param {string} name 商户id  参数名, 默认 mer_id
 */
export function merPath(path, mer_id, name) {
	if (!mer_id) return path;
	path += ((path.indexOf('?') > -1 ? '&' : '?') + (name || 'mer_id') + '=' + mer_id);
	return path;
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
 * 绑定用户授权
 * @param {Object} puid
 */
export function silenceBindingSpread() {
	let puid;
	//#ifdef H5
	 puid = Cache.get('spread');
	//#endif
	//#ifdef MP || APP-PLUS
	const app = getApp();
	puid = app.globalData.spid;
	if (!puid) {
		puid = app.globalData.code;
	}
	//#endif
	puid = parseInt(puid);
	if (Number.isNaN(puid)) {
		puid = 0;
	}
	if (puid) {
		//#ifdef H5
		Cache.clear('spread');
		//#endif
		//#ifdef MP || APP-PLUS
		app.globalData.spid = 0;
		app.globalData.code = 0;
		//#endif
	}
}
export function getCustomer(data, url) {
	if (data.type == '0' || data.type == '') {
		uni.showToast({
			title: '暂无客服',
			icon: "none"
		})
	} else if (data.type == '1') {
		uni.navigateTo({
			url: url || '/pages/extension/customer_list/chat'
		})
	} else if (data.type == '2') {
		uni.showModal({
			title: '提示',
			content: '暂无在线客服，确定拨打客服电话:'+data.service_phone+'吗？',
			success: function(res) {
				if (res.confirm) {
					uni.makePhoneCall({
						phoneNumber: data.service_phone,
					});
				}
			}
		})
	} else if (data.type == '3') {
		// #ifdef APP-PLUS
		plus.runtime.openURL(data.customer_url)
		// #endif
		// #ifdef H5 || MP
		if (data.customer_url.indexOf('work.weixin.qq.com') > 0) {
			// #ifdef H5
			return window.location.href = data.customer_url
			// #endif			
			// #ifdef MP
			uni.openCustomerServiceChat({
				extInfo: {
					url: data.customer_url
				},
				corpId: data.customer_corpId,
				success(res) {},
				fail(err) {
					uni.showToast({
						title: err.errMsg,
						icon: 'none',
						duration: 2000
					});
				}
			})
			// #endif
		} else {
			uni.navigateTo({
				url: `/pages/annex/web_view/index?url=${data.customer_url}`
			});
		}
		// #endif		
	}else{
		uni.navigateTo({
			url: `/pages/annex/web_view/index?url=${data.customer_link}`
		});
	}
}

export function isWeixin() {
	// #ifdef H5
	return navigator.userAgent.toLowerCase().indexOf("micromessenger") !== -1;
	// #endif
	// #ifndef H5
	return false;
	// #endif
}

export function parseQuery() {
	const res = {};
	const query = (location.href.split("?")[1] || "")
		.trim()
		.replace(/^(\?|#|&)/, "");

	if (!query) {
		return res;
	}

	query.split("&").forEach(param => {
		const parts = param.replace(/\+/g, " ").split("=");
		const key = decodeURIComponent(parts.shift());
		const val = parts.length > 0 ? decodeURIComponent(parts.join("=")) : null;

		if (res[key] === undefined) {
			res[key] = val;
		} else if (Array.isArray(res[key])) {
			res[key].push(val);
		} else {
			res[key] = [res[key], val];
		}
	});

	return res;
}
let token = ''
try {
	token = uni.getStorageSync('LOGIN_STATUS_TOKEN')
} catch (error) {

}
// const VUE_APP_WS_URL = process.env.VUE_APP_WS_URL || `ws://${location.hostname}?type=user&token=${token}`;
// const VUE_APP_WS_URL = `wss://mer.crmeb.net?type=user&token=${token}`
export default parseQuery;
