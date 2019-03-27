import {
    base_url,
    host_url
} from "../../utils/config.js";
import {
    HTTP
} from "../../utils/http-promise.js";
import {
    cnsub
} from '../../utils/tools.js'
let http = new HTTP();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        lesson: [],
        noMore:false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getOrders();
    },
    getOrders() {
        let openid = wx.getStorageSync('openid');
        http.request({
            url: "/index.php/api/order/getOrders?openid=" + openid
        }).then(data => {
            console.log(data)
            data.forEach((item) => {
                item.title = cnsub(item.title, 30);
                item.remark = cnsub(item.lesson_remark, 66)
                item.list_img = host_url + item.list_img;
            });
            this.setData({
                lesson: data
            })
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
    onPayEvent(e){
        console.log(e)
        let detail = null;
        if (e.type == 'myEvent') {
            detail = e.detail;
        }
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})