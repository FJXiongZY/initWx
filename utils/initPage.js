import regeneratorRuntime from './runtime';
import dataModel from './dataModel';
import config from '../config/config';
import { jump, back } from '../utils/wxAction';
import { postFormId } from '../api/formidApi';

const app = getApp();

/**
 * 封装页面初始化启动对象
*/
export default class Initpage{
	constructor({ auth = false, watch = false, model = false, jump=true } = {}) {
		this.auth = auth;       // 初始化页面是否授权登陆
		this.watch = watch;     // 初始化页面是否需要数据监听
		this.model = model;     // 初始化页面是否需要数据双向绑定
		this.currentPage = null;	// 初始化页面的页面对象
		this.config = config;
	}

	/**
	 * 初始化页面
	 */
	initializePage(pageOptions) {
		if(pageOptions.constructor !== Object){
			throw new Error(`pageOptions is not object`)
		}
		return Object.assign({}, 
			pageOptions,
			(this.model ? dataModel : {}),	// 数据双向绑定
			this.initPageCustom(pageOptions)
		)
	}

	/**
	 * 自定义的一些页面启动调用，框架的主体
	*/
	initPageCustom(pageOptions){
		const self = this;	// 当前类
		return {
			onLoad(optios){	// 劫持页面加载的生命周期函数
				self.getPageObject();	// 在页面初始化时获取页面的页面对象

				self.initNeadAuthLogin();		// 操作当前页面是否需要授权登陆

				// 如果watch为true，那么就认为当前页面需要数据监听
				self.watch ? require('./dataWatch').setWatcher(self.currentPage) : null;

				// 合并页面的data
				let { access_token, userInfo } = app.globalData;
				Object.assign(self.currentPage.data || {}, {access_token, userInfo})

				// 自定义的事件处理完后，那么就调用页面的onLoad方法
				pageOptions.onLoad && pageOptions.onLoad.constructor === Function ? pageOptions.onLoad.call(self.currentPage, optios, app.globalData.userInfo) : null;
			},
			// 在基类中实现所有页面的右上角分享功能
			onShareAppMessage(e) {
				return pageOptions.onShareAppMessage && pageOptions.onShareAppMessage.constructor === Function ?
					pageOptions.onShareAppMessage.call(self.currentPage, e):
					self.doPageShare.call(self)
			},
			// 默认添加页面跳转功能
			$jump(event){
				let { callback } = event.currentTarget.dataset;
				jump({ event, setFn: this[callback] })
			},
			// 默认添加页面跳转功能
			$back(event){
				let { delta = 1, callback } = event.currentTarget.dataset;
				back({ event, delta, setFn: this[callback] })
			},
		}
	}

	// 操作当前页面是否需要授权登陆
	initNeadAuthLogin(){
		if(this.auth){
			let auth = this.currentPage.selectComponent('#authLogin');
			if(!auth) throw new Error('请在页面注册授权登陆组件')
			auth.changeAuthShow();	// 显示授权组件
		}
	}

	// 获取当前页面对象
	getPageObject(){
		const pages = getCurrentPages(); //获取加载的页面
		this.currentPage = pages[pages.length-1] //获取当前页面的对象
	}

	// 操作页面分享
	doPageShare(){
		return {
      		path: `/pages/index/index`
		}
	}

	// 收集formId
	collectFormId(e){
		app.globalData.formId.push(e.detail.formId);
		let formIdArray = app.globalData.formId;
		// 当收集的formid到一定数量时自动发送给后台
		formIdArray.length >= this.config.maxformidcount ? postFormId(JSON.stringify(formIdArray)) : null;
	}
}