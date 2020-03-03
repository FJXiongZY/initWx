const TokenKey = 'APP-Token-YQU'
const UserKey = 'APP-User-YQU';
// 获取token
export const getToken = () =>{
	try {
		const value = wx.getStorageSync(TokenKey);
		return value
	} catch (e) {
		return undefined
	}
}

// 设置token
export const setToken = (token) =>{
	return wx.setStorage({ key: TokenKey, data: token });
}

// 删除token
export const removeToken = ()=>{
	return wx.removeStorage({ key: TokenKey });
}


/******用户信息******/

// 获取用户信息
export const storageGetUserInfo = ()=>{
	try {
		const value = wx.getStorageSync(UserKey);
		return value ? JSON.parse(value) : undefined
	} catch (e) {
		return undefined
	}
}

// 设置用户信息
export const setUserInfo = userInfo=>{
	return wx.setStorage({ key: UserKey, data: JSON.stringify(userInfo) });
}

// 删除用户信息
export const removeUserInfo = ()=>{
	return wx.removeStorage({ key: UserKey });
}

