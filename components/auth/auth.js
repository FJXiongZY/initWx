import regeneratorRuntime from '../../utils/runtime';
import { showTip, wxLogin } from '../../utils/wxAction'
import { setUserInfo, setToken } from '../../utils/auth'
import { authLogin } from '../../api/user'
const app = getApp();

Component({
	properties: {
		isshow: {
			type: Boolean,
			value: false
		}
	},
	data: {
		code: null
	},
	lifetimes: {
		// 在组件实例进入页面节点树时执行
		attached() {
			this.initGetCode()
		},
	},
	methods: {
		async initGetCode() {
			try {
				let code = await wxLogin();
				this.setData({ code })
			} catch (err) {
				setTimeout(() => {
					this.initGetCode();
				}, 26)
			}
		},
		show() {
			this.setData({ isshow: true })
		},
		hide() {
			this.setData({ isshow: false })
		},
		// 切换是否显示授权组件
		changeAuthShow(e) {
			this.setData({ isshow: !this.data.isshow })

			if (this.data.isshow) {
				this.initGetCode()
			}
		},
		// 获取用户授权信息
		async _onGotUserInfo(e) {
			let { errMsg, encryptedData, iv, userInfo } = e.detail;
			app.globalData.userInfo = userInfo;	// 保存用户信息
			setUserInfo(userInfo);				// 本地存储用户信息

			if (errMsg !== 'getUserInfo:ok') {
				return showTip({ title: '授权提示', content: '授权可更好体验应用哦~' })
			}

			try {
				let result = await authLogin(this.data.code, encryptedData, iv) || {};
				let { X_token, is_bind } = result.data || {};
				app.globalData.access_token = X_token;	// 存储用户的token
				this.setData({ access_token: X_token })	// 本页面存储一个token
				setToken(X_token);						// 本地存储token
				
				this.hide();
			} catch (err) {
				console.error(err)
				wx.showToast({ title: '授权失败，请重试尝试~', icon: 'none' })
			}
		},
	}
})
