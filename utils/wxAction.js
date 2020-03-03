const app = getApp();
import config from '../config/config'
import regeneratorRuntime from './runtime';

/**
 * 页面跳转
 * @param: {Object}    event 获取点击事件源
 * @param: {Function}  setFn 默认为null，如果使用者传入修改函数则执行
*/
export function jump({ event, setFn = null }){
    if (event.constructor !== Object || (setFn && typeof setFn !== 'function')) throw new Error("$jump方法参数错误");

    let { type, url } = event.currentTarget.dataset;
    // 获取传入的跳转类型 (navigateTo | switchTab | reLaunch | redirectTo)
    let jumpType = type || 'navigateTo';
    if(config.jumpType.indexOf(jumpType) === -1) throw new Error('$jump方法的data-type错误') 

    return new Promise((resolve, reject) => {
        //跳转页面前进行的设置
        setFn && setFn();

        wx[jumpType]({
            url, success: resolve, fail: res => { 
                reject(res); 
                wx.showToast({ title: '跳转失败，请重新尝试', icon: 'none', duration: 2000 }) 
            } 
        })
    })
}

/**
 * 页面返回
 * @param: {Object}    event 获取点击事件源
 * @param: {Number}    delta 默认为1 返回页面级数，1为返回页的层级
 * @param: {Function}    setFn 自定义设置返回页数据, 并且将返回页的数据对象（this）掉给它
*/
export function back({ event, delta=1, setFn } = {}){
    const pages = getCurrentPages();
    const prevPage = pages[pages.length - (delta + 1)];

    if(typeof setFn === 'function'){
        setFn.call(null, prevPage)
    } else if(event) {
        const { attr, val } = event.currentTarget.dataset;
        // 判断是否操作返回页的数据
        attr && prevPage.setData({ [attr]: val });
    }
    return wx.navigateBack({ delta })
}

/**
 * 获取当前页面路劲
*/
export function getCurrentPath(){
    const pages = getCurrentPages();
    const current = pages[pages.length - 1];
    return current.route
}

/**
 * 二次封装showModel
*/
export const showTip = ({ 
    title = "提示", 
    content = "提示内容", 
    showCancel = true, 
    cancelText = "取消", 
    cancelColor = "#444444", 
    confirmText = "确定", 
    confirmColor = "#4B69FF",
    complete = false 
}) => {
    return new Promise((resolve, reject) => {
        wx.showModal({
            title, content, showCancel, cancelText, cancelColor, confirmText, confirmColor,
            success(res){
                if (complete) {
                    resolve(res)
                } else if (res.confirm) {
                    resolve(res)
                } else {
                    reject(res)
                }
            },
            fail(err){ reject(err) }
        })
    })
}

// 轻提示
export function showToast({ title, icon, duration}){
    return new Promise((resolve, reject)=>{
        wx.showToast({
            title, icon, duration, success: function(){
                let timers = setTimeout(()=>{
                    resolve();
                    clearTimeout(timers)
                }, duration)
            }, fail: reject
        })
    })
}

/**
 * 多图片上传
 * @return {Object}
*/
export const moreUploadImages = async (url, params = {})=> {
    const {tempFilePaths} = await chooseImages();
    let [counter, result] = [1, []]
    
    for(let i of tempFilePaths){
        counter ++;
        let { data } = await uploadImages(url, i, params, `第${counter}张图片上传失败`);
        result.push(JSON.parse(data).data.list.url)
    }
    return Promise.resolve(result);
}

/**
 * 选择本地图片
 * @param: {Number}  count 最多可以选择的图片张数，默认9
 * @return {Object}
*/
export const chooseImages = (count = 9) => {
    return new Promise((resolve, reject) => {
        wx.chooseImage({
            count: count, // 默认9
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success(res){ resolve(res) },
            fail(err){ reject(err) }
        })
    })
}

/**
 * 图片上传
 * @param {String} url    图片上传地址
 * @param {String} file   图片地址
 * @param {String} message   提示用语
 * @return {Object}
*/
export const uploadImages = (url, file, params = {}, message) => {
    return new Promise((resolve, reject) => {
        wx.uploadFile({
            url: app.globalData.host + url,
            filePath: file,
            header: { "Content-Type": "multipart/form-data;charset=utf-8" },
            name: 'filename',
            formData: params,   // 额外需要携带的参数
            success(res){
                resolve(res)
            },
            fail(err){
                reject(err);
                wx.showToast({  title: message ? message : '图片上传失败', duration: 3000 })
            }
        })
    })
}

/**
 * 获取元素信息
 * @param: {Object}  target 目标元素
 * @return {void}
*/
export const query = target => {
    var query = wx.createSelectorQuery();
    query.select(target).boundingClientRect(function (res) {
        return Promise.resolve(res)
    }).exec();
}

/**
 * 上传音频
 * @param: {String}  url    上传地址
 * @param: {String}  file    上传的文件地址
 * @param: {String}  params   上传文件的额外参数配置
 * @return {String}
*/
export const uploadRecord = function (url, file, params) {
    return new Promise((resolve, reject) => {
        wx.uploadFile({ 
            url,
            filePath: file,
            header: { "Content-Type": "multipart/form-data;charset=utf-8" },
            name: 'file',
            formData: params,
            success(res){ resolve(res) },
            fail(err){
                reject(err);
                wx.showToast({ title: '上传音频失败~', duration: 3000 })
            }
        })
    })
}

/*
* 从本地存储中获取数据
*/
export const getStore = key=>{
    const data = wx.getStorageSync(key);
    return data ? JSON.parse(data) : null;
}

/*
* 缓存信息
*/
export const setUser = (key, value)=>{
    wx.setStorageSync(key, JSON.stringify(value));
}

// 获取code
export const wxLogin = ()=>{
    return new Promise(resolve=>{
        wx.login({ success: res => {resolve(res.code)}, fail: err=>{wxLogin()} })
    })
}

// 获取用户位置信息
export const _getLocation = ()=>{
    let userLocation = checkAuthLocation();
    return new Promise((resolve, reject)=>{
        if (!userLocation) {
            wx.authorize({
                scope: 'scope.userLocation',
                success(authRes){
                    wx.getLocation({
                        type: 'gcj02',
                        success(res){
                            resolve(res)
                        },
                        fail(err){ wx.showToast({title: '获取位置信息失败', icon:'none', duration: 2000}) }
                    })
                },
                fail(authErr){ checkAuthLocation(true); reject(authErr) }
            })
        }else{
            wx.getLocation({
                type: 'gcj02',
                success(res){
                    resolve(res)
                },
                fail(err){ wx.showToast({title: '获取位置信息失败', icon:'none', duration: 2000}); reject(err) }
            })
        }
    })
}
// 检测地理位置授权和提示
function checkAuthLocation(showModel = false){
    wx.getSetting({
        success(res) {
            if (!res.authSetting['scope.userLocation']) {
                if(showModel){
                    wx.showModal({
                        title: '授权提示',
                        content: '需要您的地理位置',
                        confirmText: '去开启',
                        confirmColor: '#FE5250',
                        success(modelRes){
                            if(modelRes.confirm){
                                wx.openSetting() // 打开授权管理页面
                            }
                        }
                    })
                }
                return {'userLocation': false}
            }else{
                return {'userLocation': true}
            }
        }
    })
}