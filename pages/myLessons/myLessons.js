import {
    base_url,
    host_url
} from "../../utils/config.js";
import {
    HTTP
} from "../../utils/http-promise.js";
import {
  Order
} from "../../utils/order-model.js";
import {
  toast,
  jump,
  login,
  cnsub
} from "../../utils/tools.js";
let http = new HTTP();
let order = new Order();
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
        let detail = e.detail;
        let openid = wx.getStorageSync('openid');
      console.log(e, openid)
      if (e.type == 'payEvent' && detail.pay_status == "0" && openid) {
            this._oneMorePay(openid,detail.order_id);
        }
    },
  _oneMorePay(openid, orderId) {
    console.log(orderId);
        let that = this;
        order.execPay(orderId, d => {
            if (d == 2) {
                toast('支付成功', () => {
                    that.data.orderStatus = 1;
                    that.updateOrderStatus(orderId);
                    jump('/pages/my/my', 2);
                });
            } else {
                toast('支付失败');
            }
        });
    },
    /**
     * @param id 订单id
     * 支付完成修改订单状态
     */
    updateOrderStatus(id) {
        order.updateOrderStatus(id);
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