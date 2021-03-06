import {
    login,
    updateUser,
    jump,
    toast
} from "../../utils/tools.js";
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userStatus: '',
        tip: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
    },
    myLess() {
        wx.navigateTo({
            url: '/pages/myLessons/myLessons',
        })
    },
    profile() {
        wx.navigateTo({
            url: '/pages/myInfo/myInfo',
        })
    },
    myShare() {
        console.log(' myShare');
        wx.navigateTo({
            url: '/pages/share/index',
        })
    },
    checkAuth(){
        let userStatus = this.data.userStatus;
        if(userStatus== '10003'){
            this.setData({
                tip:true
            });
        }
        if (userStatus == '10002' || userStatus == '10001'){
            toast('去注册',()=>{
                jump('/pages/register/register');
            })
        }
    },
    confirmEvent(){
        this.setData({
            tip:false
        });
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {
        let openid = wx.getStorageSync("openid");
        if (!openid) {
            login(this);
        }
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        let userStatus = wx.getStorageSync('userStatus');
        this.setData({
            userStatus: userStatus
        });
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

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