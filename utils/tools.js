import {
    host_url
} from "./config.js";
import {
    HTTP
} from "./http-promise.js";
let http = new HTTP();
const app = getApp();
// login
let login = function(that){
    wx.login({
        success(res) {
            console.log("tools login");
            if (res.code) {
                http.request({
                    url: '/index.php/api/user/login',
                    method: 'POST',
                    header: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    data: {
                        code: res.code,
                    }
                }).then(data => {
                    console.log(data);
                    let userStatus = data.code;
                    wx.setStorageSync('openid', data.openid);
                    wx.setStorageSync('userStatus', userStatus);
                    switch (userStatus){
                        case '10000':
                            jump('/pages/index/index', 2);
                        break;
                        case '10001':
                            toast("未绑定手机号");
                        break;
                        case '10002':
                            toast("未绑定手机号");
                            break;
                        case '10003':
                            toast("待审核用户");
                            break;
                        default:
                    }
                });
            } else {
                return wx.showToast({
                    title: '接口调用失败',
                })
            }
        },
        fail(res) {
            return wx.showToast({
                title: '登录失败！',
            })
        }
    })
}
// 获取用户头像等信息
let updateUser = function(that,cb) {
    wx.getUserInfo({
        success: (res) => {
            console.log(res);
            if (res.errMsg === "getUserInfo:ok") {
                let userInfo = res.userInfo;
                wx.setStorageSync("userInfo", JSON.stringify(userInfo));
                let openid = wx.getStorageSync('openid');
                http.request({
                    url: '/index.php/api/user/updateUser',
                    method: 'POST',
                    header: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    data: {
                        openid: openid,
                        nickname: userInfo.nickName,
                        sex: userInfo.gender,
                        head_pic: userInfo.avatarUrl,
                        province: userInfo.province,
                        city: userInfo.city,
                    }
                }).then(data => {
                    typeof cb == 'function' && cb();
                    console.log("用户信息保存成功！");
                });
            } else {
                return wx.showToast({
                    title: '获取用户信息失败',
                })
            }
        }
    })
}
let getSmsCode = (phone,cb)=>{
    http.request({
        url:`/index.php/api/sms/getSmsCode?phone=${phone}`
    }).then(data => {
        typeof cb == 'function' && cb(data);
        console.log("用户信息保存成功！");
    });
}
// 跳转
let jump= function(url, type = 1) {
    if (type == 1) {
        wx.navigateTo({
            url: url,
        })
    }
    if (type == 2) {
        wx.switchTab({
            url: url,
        })
    }
    if (type == 3) {
        wx.redirectTo({
            url: url,
        })
    }
    if (type == 4) {
        wx.reLaunch({
            url: url,
        })
    }
}
let toast = function(msg,cb,delay=1500){
    wx.showToast({
        title: msg,
        duration: delay,
        success(){
            setTimeout(()=>{
                typeof cb == 'function' && cb();
            }, delay);
        }

    })
}
// 截取字符串
let cnsub = function (str, n) {
    var r = /[^\x00-\xff]/g;
    if (str.replace(r, "mm").length <= n) { return str; }
    var m = Math.floor(n / 2);
    for (var i = m; i < str.length; i++) {
        if (str.substr(0, i).replace(r, "mm").length >= n) {
            return str.substr(0, i) + "...";
        }
    }
    return str;
}
/**
 * 将wx的callback形式的API转换成支持Promise的形式
 */
let promisify = api => {
    return (options, ...params) => {
        return new Promise((resolve, reject) => {
            const extras = {
                success: resolve,
                fail: reject
            }
            api({
                ...options,
                ...extras
            }, ...params)
        })
    }
}
export { promisify, jump, toast, login, updateUser,getSmsCode,cnsub}