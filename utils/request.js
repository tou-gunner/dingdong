// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016-2026 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------
import {
	HTTP_REQUEST_URL,
	HEADER,
	TOKENNAME
} from '@/config/app';
import { checkLogin } from '../libs/login';
import store from '../store';
import pako from '../plugin/pako/pako.es5.min.js'
import Cache from '@/utils/cache';
import { isWeixin } from '.';

// 提取硬编码的状态码为常量
const LOGIN_EXPIRED_STATUS = [410000, 410001, 410002, 40000];
const ERROR_PAGE_STATUS = 501;

function toLogin(){
	store.commit("LOGOUT");
	uni.showToast({
		title: '请登录',
		icon: 'none',
		duration: 1000
	});
	const pages = getCurrentPages();
	const lastPage = pages[pages.length - 1];
	const { route, options } = lastPage;
	const query = Object.entries(options).map(([k,v]) =>  k + "=" +v).join("&");
	Cache.set('login_back_url', "/" + route + (query ? "?" + query : ""));
	let url = '/pages/users/login/index';
	if (isWeixin()) {
		if(Cache.get('WECHAT_APPID')) {
			url = '/pages/users/wechat_login/index'
		}
	}
	// #ifdef MP
	url = '/pages/users/wechat_login/index'
	// #endif
	uni.navigateTo({
		url
	});
}
function decompress(str) {
	try {
		return pako.inflateRaw(base64ToUint8Array(str), {
			to: 'string'
		});
	} catch (error) {
		console.error('解压数据失败:', error);
		throw error;
	}
}
function base64ToUint8Array(base64String) {
  let padding = '='.repeat((4 - base64String.length % 4) % 4);
  let base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');
  let rawData = atob(base64);
  let outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
function atob(input) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  let str = input.replace(/=+$/, '');
  let output = '';
  if (str.length % 4 === 1) {
    throw new Error('InvalidLengthError');
  }
  for (let i = 0, len = str.length; i < len; i += 4) {
    const a = chars.indexOf(str.charAt(i));
    const b = chars.indexOf(str.charAt(i + 1));
    const c = chars.indexOf(str.charAt(i + 2));
    const d = chars.indexOf(str.charAt(i + 3));
    const sum = (a << 18) | (b << 12) | (c << 6) | d;
    output += String.fromCharCode((sum >> 16) & 0xFF, (sum >> 8) & 0xFF, sum & 0xFF);
  }
 
  return output;
}
/**
 * 发送请求
 */
function baseRequest(url, method, data, {
	noAuth = false,
	noVerify = false
}) {
	let Url = HTTP_REQUEST_URL,
		header = HEADER;
	if (!noAuth) {
		//登录过期自动登录
		if (!store.state.app.token && !checkLogin()) {
			toLogin();
			return Promise.reject({
				msg: '未登录'
			});
		}
	}
	if (store.state.app.token) header[TOKENNAME] = 'Bearer ' + store.state.app.token;
	if(store.state.app.uuid)header['uuid'] = store.state.app.uuid
	return new Promise((reslove, reject) => {
		uni.request({
			url: Url + '/api/' + url,
			method: method || 'GET',
			header: header,
			data: data || {},
			success: (res) => {
				if (res.data && res.data.encode) {
					try
					{
						res.data = JSON.parse(decompress(res.data.data));
					}catch(e){
						res.data = decompress(decodeURI(res.data.data));
					}
				}
				if (noVerify)
					reslove(res.data, res);
				else if (res.data.status == 200)
					reslove(res.data, res);
				else if ([410000, 410001, 410002, 40000].indexOf(res.data.status) !== -1) {
					toLogin();
					reject(res.data);
				} else if (res.data.status == 501) {
					uni.reLaunch({
						url: '/pages/error/index'
					})
					reject(res.data);
				} else
					reject(res.data.message || '系统错误');
			},
			fail: (message) => {
				reject('请求失败');
			}
		})
	});
}
const request = {};
['options', 'get', 'post', 'put', 'head', 'delete', 'trace', 'connect'].forEach((method) => {
	request[method] = (api, data, opt) => baseRequest(api, method, data, opt || {})
});
export default request;
