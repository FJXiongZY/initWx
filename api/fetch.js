import config from '../config/config';

import { getCurrentPath, showToast } from '../utils/wxAction.js'

//请求域名
const domain = config.baseUrl;

export const axios = (url, params, method, message = false) => {
    return new Promise((resolve, reject) => {
        if (message !== false) wx.showLoading({title: message});
        
        wx.request({
            url: domain + url,
            data: params,
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            method: method,
            success: function(res) {
                if (message !== false) wx.hideLoading();

                if (res.statusCode == 200) {
                    resolve(res.data)
                } else {
                    wx.showToast({ title: res.data.msg, icon: 'none', duration: 3000});
                    reject(res)
                }
            },
            fail: function(res) {
                if (message !== false) wx.hideLoading();

                wx.showToast({ title: '发起请求失败~', icon: 'none', duration: 3000, mask: true})
                reject(res)
            }
        })
    })
}

/**
 * 封装GET方法
 * request.get(url[, params, message])  //第一个参数为请求地址，第二个参数为请求数据，第三个参数为提示信息
 * request.get(url[, message])          //第一个参数为请求地址，第二个参数为提示信息
 * @param {String} url      get请求地址 '/user/list' 不用写请求域名
 * @param {Object} params   请求参数，默认为空对象
 * @param {String} message  请求时加载的文字信息,默认为空
 * @return {Object}         使用 .then()捕获正确返回 .catch()捕获错误返回
 */
export const get = function(url, params = {}, message) {
    return new Promise((resolve, reject) => {
        if (!arguments[0] || arguments[0] == '') { // 如果传递的请求地址为空，那么直接返回错误信息
            throw new Error('请求地址不能为空~');
        } else if (typeof arguments[1] === 'string') { // 如果第二个参数为字符串，那么我们就认为它是提示信息
            message = arguments[1];
            params = {}
        }

        axios(url, params, 'GET', message).then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}

/**
 * 封装POST方法 
 * request.post(url[, params, message])  //第一个参数为请求地址，第二个参数为请求数据，第三个参数为提示信息
 * request.post(url[, message])          //第一个参数为请求地址，第二个参数为提示信息
 * @param {String} url      post请求地址 '/user/list' 不用写请求域名
 * @param {Object} params   请求参数，默认为空对象
 * @param {String} message  请求时加载的文字信息,默认为空
 * @return {Object}         使用 .then()捕获正确返回 .catch()捕获错误返回
 */
export const post = function(url, params = {}, message) {
    return new Promise((resolve, reject) => {

        if (!arguments[0] || arguments[0] == '') { // 如果传递的请求地址为空，那么直接返回错误信息
            throw new Error('请求地址不能为空~');
        } else if (typeof arguments[1] === 'string') { // 如果第二个参数为字符串，那么我们就认为它是提示信息
            message = arguments[1];
            params = {}
        }

        axios(url, params, 'POST', message).then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}