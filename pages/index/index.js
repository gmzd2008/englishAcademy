import {
    login,
    updateUser
} from "../../utils/tools.js";
import {
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
        swiper: [{
                src: '/images/banner-2.jpg',
                link: "/"
            },
            {
                src: '/images/banner-2.jpg',
                link: ""
            }
        ],
        lesson: [],
        lessonL: [],
        lessonR: []
    },
    onNavTo(e){
        console.log(e)
        let detail = null;
        if (e.type == 'navTo') {
            detail = e.detail;
            wx.navigateTo({
                url: `/pages/course/course?id=${detail.ad_link}`
            })
        }
    },
    onMyNav(e) {
        console.log(e)
        let detail = e.currentTarget.dataset.detail;
        wx.navigateTo({
            url: `/pages/course/course?id=${detail.id}`
        })
    },
    onMyEvent(e) {
        console.log(e)
        let detail = null;
        if (e.type == 'myEvent') {
            detail = e.detail;
        } else {
            detail = e.currentTarget.dataset.detail;
        }
        wx.navigateTo({
            url: `/pages/course/course?id=${detail.id}`
        })
    },
    toRegister() {
        wx.navigateTo({
            url: '/pages/register/register?act=1',
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.getSwiper();
        this.getLesson();
        this.getHomeLesson();
    },
    getSwiper() {
        http.request({
            url: '/index.php/api/banner/getbanner'
        }).then(data => {
            // console.log(data);
            data = data.map((v, i) => {
                v.src = host_url + v.ad_code
                v.link = v.ad_link
                return v;
            });
            console.log(data)
            this.setData({
                swiper: data
            });
        });
    },
    getLesson() {
        http.request({
            url: '/index.php/api/lesson/getLessons?is_new=1'
        }).then(data => {
            data = data.map((v, i) => {
                v.poster = host_url + v.poster
                v.list_img = host_url + v.list_img
                return v;
            });
            this.setData({
                lesson: data
            })
        })
    },
    getHomeLesson() {
        http.request({
            url: '/index.php/api/lesson/getHomeLessons?id=1'
        }).then(data => {
            data = data.map((v, i) => {
                v.poster = host_url + v.poster
                v.list_img = host_url + v.list_img
                return v;
            });
            this.setData({
                lessonL: data
            })
        })
        http.request({
            url: '/index.php/api/lesson/getHomeLessons?id=2'
        }).then(data => {
            data = data.map((v, i) => {
                v.poster = host_url + v.poster
                v.list_img = host_url + v.list_img
                return v;
            });
            this.setData({
                lessonR: data
            })
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onShow: function() {
        let userStatus = wx.getStorageSync('userStatus');
        let openid = wx.getStorageSync('openid');
        // 判断用户状态，后台客服更新后及时更新用户状态
        if (!openid || userStatus !='10000'){
            login(this);    
        }
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