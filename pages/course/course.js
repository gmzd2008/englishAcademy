import {
  base_url,
  host_url
} from "../../utils/config.js";
import {
  toast,
  jump,
  login
} from "../../utils/tools.js";
import {
  Order
} from "../../utils/order-model.js";
import {
  HTTP
} from "../../utils/http-promise.js";
let http = new HTTP();
let order = new Order();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    btnIndex: "0",
    lesson: {},
    timer: {},
    orderStatus: 0,
    orderId: "",
    tip:false

  },
  changeTab(e) {
    let index = e.target.dataset.index;
    let id = e.target.dataset.id;
    // this.setData({
    //     btnIndex: index
    // })
    if (index == 1) {
      wx.navigateTo({
        url: `/pages/courseDetails/courseDetails?id=${id}`,
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(opt) {
    console.log(opt);
    this.getOneLesson(opt.id);
  },
  pay() {
    let id = this.data.lesson.id;
    let openid = wx.getStorageSync('openid');
    let userStatus = wx.getStorageSync('userStatus');
    if (userStatus == '10000') {
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
    } else if (userStatus == '10001' || userStatus == '10002'){
      toast("请先手机注册",()=>{
        jump("/pages/register/register");
      });
    } else if (userStatus == '10003') {
      this.setData({tip:true});
    }else{
      toast("用户异常", () => {
        jump("/pages/index/index", 2);
      });
    }


  },
  _firstPay(openid, id) {
    let that = this
    order.doOrder({
      openid,
      id
    }, (res) => {
      console.log(res);
      if (res.hasOwnProperty('id') && res.id) {
        let orderId = res.id;
        that.data.orderId = orderId;
        that.data.orderStatus = 1;
        console.log(that.data.orderId);
        order.execPay(orderId, d => {
          if (d == 2) {
            toast('支付成功', () => {
              that.data.orderStatus = 0;
              that.updateOrderStatus(orderId);
              jump('/pages/my/my', 2);
            });
          } else if (d == 1) {
            toast('支付失败');
          } else {
            toast('支付失败3');
          }
        });
      } else {
        toast('下单失败');
      }

    });
  },
  _oneMorePay(openid, id) {
    let that = this;
    let orderId = this.data.orderId;
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
  onShow() {
    this.setData({
      orderStatus: 0,
      orderId: ""
    });

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  getOneLesson(id) {
    let that = this
    http.request({
      url: `/index.php/api/lesson/getOneLesson?id=${id}`
    }).then(data => {
      data.poster = host_url + data.poster
      data.list_img = host_url + data.list_img
      data.lecturer.picture = host_url + data.lecturer.picture
      let endTime = data.end_time;
      data.havBuySum = data.order.length;
      that.clock(endTime);
      console.log(data);
      that.setData({
        lesson: data
      })
    })
  },
  clock(endTime) {
    var today = new Date(), //当前时间
      h = today.getHours(),
      m = today.getMinutes(),
      s = today.getSeconds();
    var stopTime = new Date(endTime), //结束时间
      stopH = stopTime.getHours(),
      stopM = stopTime.getMinutes(),
      stopS = stopTime.getSeconds();
    var shenyu = stopTime.getTime() - today.getTime(), //倒计时毫秒数
      shengyuD = parseInt(shenyu / (60 * 60 * 24 * 1000)), //转换为天
      D = parseInt(shenyu) - parseInt(shengyuD * 60 * 60 * 24 * 1000), //除去天的毫秒数
      shengyuH = parseInt(D / (60 * 60 * 1000)), //除去天的毫秒数转换成小时
      H = D - shengyuH * 60 * 60 * 1000, //除去天、小时的毫秒数
      shengyuM = parseInt(H / (60 * 1000)), //除去天的毫秒数转换成分钟
      M = H - shengyuM * 60 * 1000, //除去天、小时、分的毫秒数
      S = parseInt((shenyu - shengyuD * 60 * 60 * 24 * 1000 - shengyuH * 60 * 60 * 1000 - shengyuM * 60 * 1000) / 1000); //除去天、小时、分的毫秒数转化为秒
    shengyuD = shengyuD > 10 ? shengyuD : "0" + shengyuD
    shengyuH = shengyuH > 10 ? shengyuH : "0" + shengyuH
    shengyuM = shengyuM > 10 ? shengyuM : "0" + shengyuM
    S = S > 10 ? S : "0" + S
    let timer = {
      D: shengyuD,
      H: shengyuH,
      M: shengyuH,
      S
    }
    this.setData({
      timer: timer
    })
    // setTimeout("clock()",500);
    setTimeout(() => {
      this.clock(endTime)
    }, 1000);
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})