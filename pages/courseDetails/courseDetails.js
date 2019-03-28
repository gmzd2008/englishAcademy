import {
    base_url,
    host_url
} from "../../utils/config.js";
import {
    HTTP
} from "../../utils/http-promise.js";
import {
    toast,
    jump,
    login
} from "../../utils/tools.js";
import {
    Order
} from "../../utils/order-model.js";
let http = new HTTP;
let order = new Order();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        btnIndex: "1",
        lesson: [],
        comments:[],
        orderStatus: 0,
        orderId: ""
    },
    pay() {
        let id = this.data.lesson.id;
        let openid = wx.getStorageSync('openid');
        console.log(id);
        if (openid && id) {
            if (this.data.orderStatus == 0) {
                this._firstPay(openid, id);
            } else {
                this._oneMorePay(openid, id)
            }
        } else {
            toast('用户openid 不存在', () => {
                jump('/pages/my/my', 2);
            });
        }

    },
    _firstPay(openid, id) {
        let that = this
        order.doOrder({
            openid,
            id
        }, (d) => {
            console.log(d);
            if (d.hasOwnProperty('id')) {
                let orderId = d.id;
                that.data.orderId = orderId;
                that.data.orderStatus = 1;
                console.log(that.data.orderId);
                order.execPay(orderId, d => {
                    if (d == 2) {
                        toast('支付成功', () => {
                            that.data.orderStatus = 1;
                            jump('/pages/my/my', 2);
                        });
                    } else if (d == 1) {
                        toast('支付失败');
                    } else {
                        toast('下单失败');
                    }
                });
            } else {
                toast('下单失败');
            }

        });
    },
    _oneMorePay(openid, id) {
        let that = this
        order.execPay(this.data.orderId, d => {
            if (d == 2) {
                toast('支付成功', () => {
                    that.data.orderStatus = 1;
                    jump('/pages/my/my', 2);
                });
            } else {
                toast('支付失败');
            }
        });
    },
    changeTab(e) {
        let index = e.target.dataset.index;
        let id = this.data.lesson.id;
        if(index == 2 && id ){
            this.getComments(id);
        }
        this.setData({
            btnIndex: index
        })
    },
    remark() {
        let lessId = this.data.lesson.id;
        wx.navigateTo({
            url: '/pages/comment/comment?id=' + lessId
        })
    },
    getOneLessCom(id) {
        let that = this
        http.request({
            url: `/index.php/api/lesson/getOneLessCom?id=${id}`
        }).then(data => {
            data.poster = host_url + data.poster
            data.list_img = host_url + data.list_img
            console.log(data);
            that.setData({
                lesson: data
            })
        })
    },
    getComments(id) {
        let that = this
        http.request({
            url: `/index.php/api/lesson/getComments?id=${id}`
        }).then(data => {
            console.log(data);
            that.setData({
                comments: data
            })
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(opt) {
        console.log(opt)
        // opt = opt.hasOwnProperty('id') ? opt : {
        //     id: 2
        // };
        this.getOneLessCom(opt.id);
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

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