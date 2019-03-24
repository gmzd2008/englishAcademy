import {
    login, updateUser
} from "../../utils/tools.js";
import {
    base_url,
    host_url
} from "../../utils/config.js";
import {
    HTTP
} from "../../utils/http-promise.js";
let http = new HTTP();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        getcodeShow: false,
        setCode: false,
        act: "",
        randCode: "",
        tempCode: "",
        mobile: "13366668431",
        subMobile: "",
        pwd1: "",
        pwd2: "",
        wxCode: "",
        confirmShow: true,
        tip: false
    },
    bindGetUserInfo(e) {
        console.log(e);
    },
    getCode: function() {
        let mobile = this.data.mobile;
        let reg = /^1[3|5|6|7|8|9]\d{9}$/;
        if (!(reg.test(mobile))) {
            return wx.showToast({
                title: '手机号格式不对',
            })
        }
        http.request({
            url: "/index.php/api/user/checkMobile?mobile=" + mobile
        }).then(data => {
            let subMobile = mobile.substr(0, 3) + '****' + mobile.substr(8, 4);
            this.getRandNu();
            console.log(data, subMobile)
            this.setData({
                subMobile: subMobile,
                getcodeShow: !this.data.getcodeShow

            })
        });

    },
    setCode: function() {
        if (this.data.tempCode != this.data.randCode) {
            return wx.showToast({
                title: '验证码不正确',
            })
        }
        this.setData({
            setCode: true,
            getcodeShow: false
        })
    },
    getRandNu() {
        let tempCode = parseInt(Math.random() * 99999);
        this.setData({
            tempCode: tempCode
        });

    },
    inputRandCode(e) {
        let val = e.detail.value;
        this.setData({
            randCode: val
        });
    },
    inputing(e) {
        let val = e.detail.value;
        this.setData({
            mobile: val
        });
    },
    inputPwd1(e) {
        let val = e.detail.value;
        this.setData({
            pwd1: val
        });
    },
    inputPwd2(e) {
        let val = e.detail.value;
        this.setData({
            pwd2: val
        });
    },
    sub() {
        console.log('sub');
        let reg = /^[A-Za-z0-9]{6,20}$/;
        if (!reg.test(this.data.pwd1)) {
            return wx.showModal({
                title: '第一次输入密码格式不正确',
                confirmtext: '确认',
                showCancel: false
            })
        }
        if (!reg.test(this.data.pwd2)) {
            return wx.showToast({
                title: '第二次输入密码格式不正确',
                confirmtext: '确认',
                showCancel: false
            })
        }
        if (this.data.pwd1 !== this.data.pwd2) {
            return wx.showToast({
                title: '两次密码输入不一样',
                confirmtext: '确认',
                showCancel: false
            })
        }
        let mobile = this.data.mobile;
        let pwd1 = this.data.pwd1;
        let openid = wx.getStorageSync("openid");
        let that = this
        http.request({
            url: '/index.php/api/user/updateUser',
            method: 'POST',
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: {
                mobile: mobile,
                pwd: pwd1,
                openid:openid,
                type:1
            }
        }).then(data => {
            console.log(data);
            wx.setStorageSync('userStatus', 10003);
            return wx.showToast({
                title: '用户注册成功！',
                duration: 1500,
                success() {
                    that.setData({
                        tip:true
                    });
                }
            })
        });
    },
    showDialog: function() {
        this.dialog.showDialog();
    },
    confirmEvent: function(e) {
        console.log('parent', e);
        this.dialog.hideDialog();
    },
    bindGetUserInfo: function(e) {
        console.log('parent', e);
        // 用户点击授权后，这里可以做一些登陆操作 
       updateUser(this,()=>{
           wx.setStorageSync('userStatus', 10002);
       });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(opt) {
        let act = opt.act;
        if (act == 1) {
            this.setData({
                act: act
            })
            wx.setNavigationBarTitle({
                title: "新用户注册"
            })
        }
        // this.updateUser()
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {
        console.log("onReady1");
        let that = this;
        that.dialog = that.selectComponent("#dialog");
        let openid = wx.getStorageSync('openid');
        let userStatus = wx.getStorageSync('userStatus');
        console.log('onready2', openid);
        if (!openid) {
            login(that);
        } else if (userStatus == '10003') {
            that.setData({
                tip: true
            })
        }
        wx.getSetting({
            success: (res) => {
                if (res.authSetting['scope.userInfo']) {
                    updateUser(that, () => {
                        wx.setStorageSync('userStatus', "10002");
                    });
                } else {
                    console.log("onReady 未授权");
                    that.dialog.showDialog();
                }
            }
        })
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})