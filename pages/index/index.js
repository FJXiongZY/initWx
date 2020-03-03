import regeneratorRuntime from '../../utils/runtime';
import { getToken } from '../../utils/auth'
import InitPage from '../../utils/initPage';
const dxPage = new InitPage();
const app = getApp();

/**
 * 和小程序不同的是封装了一个page的基类。公共的分享、formid收集、用户信息等都可以在基类中实现。
 * 用法：
 * 	import InitPage from '../../utils/initPage';
 *	const dxPage = new InitPage();
 *  
 * 	Page(dxPage.initializePage({
 * 		...里面和小程序的一样（生命周期、方法调用等都一样）
 * 	}))
 * */
Page(dxPage.initializePage({
	data: {
		access_token: getToken(),
	},
	onLoad() {
		
	},
	onReady(){
		this.signModal = this.selectComponent('#signModal');
	},
	// 关闭签到模态框
	closeSignModal(){
		this.signModal.hide();
	}
}))
