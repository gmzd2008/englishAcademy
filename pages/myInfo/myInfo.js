// pages/index/index.js
import {
    host_url
} from "../../utils/config.js";
import {
    HTTP
} from "../../utils/http-promise.js";
let http = new HTTP();
Page({
    data: {
        head_pic: "",
        nickname: "",
        flag: !0,
        childSexArray: ["选择", "男", "女"],
        childSex: 0,
        name: "",
        mobile: "",
        child_name1: "",
        child_name2: "",
        child_birthday: "",
        child_school: "",
        child_concat:"",
        qq: "",
        sendPhoneFlag: "",
        sendFlag: "",
        sendClass: "btn_send",
        sendTxt: "获取验证码",
        sendPhone: "",
        code: "",
        smsPhone: "",
        smsCode: ""
    },
    onLoad: function (e) {
        let openid = wx.getStorageSync("openid");
        if (openid){
            this.getUser(openid);
        }else{
            toast("openid 不存在");
        }
    },
    getUser(op) {
        let that = this
        http.request({
            url: '/index.php/api/user/getOneUser?openid='+op
        }).then(data => {
            console.log(data);
            that.setData({
                head_pic:data.head_pic,
                nickname: data.nickname,
                name:data.name,
                mobile:data.mobile,
                child_name1: data.child_name1,
                child_name2: data.child_name2,
                child_birthday: data.child_birthday,
                child_school: data.child_school,
                child_concat: data.child_concat,
                childSex:data.child_sex,
                qq:data.qq

            })
        });
    },
    onReady: function () { },
    onShareAppMessage: function () { },
    selectchildSex: function (e) {
        var t = this, a = e.detail.value;
        t.setData({
            childSex: a
        });
    },
    selectchild_birthday(e){
        var t = this, a = e.detail.value;
        console.log(a);
        t.setData({
            child_birthday: a
        });
    },
    inputUserName: function (e) {
        var t = this, a = e.detail.value;
        "" != a && t.setData({
            name: a
        });
    },
    inputMobile(e){
        let m = e.detail.value;
        let reg = /^1[3|5|6|7|8|9]\d{9}$/
        if(reg.test(m)){
            return this.checkMobile(m);
        }
        this.setData({
            mobile: m
        });
    },
    inputChild_name1: function (e) {
        var t = this, a = e.detail.value;
        "" != a && t.setData({
            child_name1: a
        });
    },
    inputChild_name2: function (e) {
        var t = this, a = e.detail.value;
        "" != a && t.setData({
            child_name2: a
        });
    },
    inputChild_school: function (e) {
        var t = this, a = e.detail.value;
        "" != a && t.setData({
            child_school: a
        });
    },
    inputChildConcat(e){
        let m = e.detail.value;
        let reg = /^1[3|5|6|7|8|9]\d{9}$/
        if (!reg.test(m)) {
            return wx.showToast({
                title: '输入正确手机号',
            });
        }
        this.setData({
            child_concat: m
        });
    },
    checkMobile: function (m) {
        var t = this;
        http.request({
            url:"/index.php/api/user/checkMobile?mobile="+m
        }).then(data=>{
            console.log("check",data);
        });

    },
    inputSendPhone: function (e) {
        var t = this, a = e.detail.value;
        "" != a && t.setData({
            sendPhone: a
        });
    },
    inputCode: function (e) {
        var t = this, a = e.detail.value;
        "" != a && t.setData({
            code: a
        });
    },
    inputQQ: function (e) {
        var t = this, a = e.detail.value;
        "" != a && t.setData({
            qq: a
        });
    },
    hide: function () {
        this.setData({
            flag: !0
        });
    },
    show: function () {
        this.setData({
            flag: !1
        });
    },
    send: function () {
        var e = this, t = e.data.sendPhone, a = e.data.phone, s = wx.getStorageSync("openid");
        if ("" != s) if ("" != t) {
            e.setData({
                sendFlag: !0,
                sendClass: "btn_send_dis"
            });
            var n = 60, o = setInterval(function () {
                if (0 == n) n = 60, e.setData({
                    sendFlag: "",
                    sendClass: "btn_send",
                    sendTxt: "获取验证码"
                }), clearInterval(o); else if (60 == n) {
                    var d = "https://xuedou.ybb18.com/?opt=app&obj=api&method=getCode&sendPhone=" + t;
                    "" != a && (d = d + "&act=clear&openid=" + s), wx.request({
                        url: d,
                        method: "GET",
                        success: function (t) {
                            if ("success" != t.data.status) return e.setData({
                                sendFlag: "",
                                sendClass: "btn_send",
                                sendTxt: "获取验证码"
                            }), wx.showModal({
                                title: "提示",
                                content: "" + t.data.message
                            }), void clearInterval(o);
                            e.setData({
                                smsPhone: t.data.smsPhone,
                                smsCode: t.data.smsCode
                            }), n--;
                        }
                    });
                } else e.setData({
                    sendFlag: !0,
                    sendClass: "btn_send_dis",
                    sendTxt: n + "s后重发"
                }), n--;
            }, 1e3);
        } else wx.showModal({
            title: "提示",
            content: "请输入手机号码"
        }); else wx.navigateTo({
            url: "/pages/index/index"
        });
    },
    sub: function () {
        var e = wx.getStorageSync("openid"), t = this, a = t.data.phone, s = t.data.sendPhone, n = t.data.code, o = t.data.smsPhone, d = t.data.smsCode;
        if ("" != e) if ("" != s) if ("" != n) if (s == o) if (n == d) {
            var i = "https://xuedou.ybb18.com/?opt=app&obj=api&method=binding&sendPhone=" + s + "&code=" + n + "&openid=" + e;
            "" != a && (i += "&act=clear"), wx.request({
                url: i,
                method: "GET",
                success: function (e) {
                    "success" != e.data.status ? wx.showModal({
                        title: "提示",
                        content: "" + e.data.message
                    }) : "" == a ? t.setData({
                        flag: !0,
                        phone: s,
                        sendPhoneFlag: !0,
                        sendPhone: s,
                        code: ""
                    }) : t.setData({
                        flag: !0,
                        phone: "",
                        sendPhoneFlag: "",
                        sendPhone: "",
                        code: ""
                    });
                }
            });
        } else wx.showModal({
            title: "提示",
            content: "验证码错误"
        }); else wx.showModal({
            title: "提示",
            content: "该号码未验证"
        }); else wx.showModal({
            title: "提示",
            content: "请输入验证码"
        }); else wx.showModal({
            title: "提示",
            content: "请输入手机号码"
        }); else wx.navigateTo({
            url: "/pages/index/index"
        });
    },
    save: function () {
        let that = this;
        let openid = wx.getStorageSync("openid");
        if(openid){
            http.request({
                url: '/index.php/api/user/updateUser',
                method: 'POST',
                header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                data: {
                    openid: openid,
                    name: that.data.name,
                    mobile: that.data.mobile,
                    child_name1: that.data.child_name1,
                    child_name2: that.data.child_name2,
                    child_birthday: that.data.child_birthday,
                    child_school: that.data.child_school,
                    child_concat: that.data.child_concat,
                    childSex: that.data.child_sex,
                    qq:that.data.qq,
                }
            }).then(data=>{
                wx.showToast({
                    title: '保存成功',
                    duration:1500,
                    success(){
                        setTimeout(()=>{
                            wx.navigateBack();
                        },1500);

                    }
                })
            });
        }else{
            wx.showToast({
                title: 'openid 不存在',
                duration:1500,
                success(){
                    wx.navigateTo({
                        url: '/pages/index/index',
                    })
                }
            })
        }
    }
});