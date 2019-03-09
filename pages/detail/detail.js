// pages/detail/detail.js
import {
  HTTP
} from "../../utils/http-promise.js";
let http = new HTTP;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    animationData: {},
    showModalStatus: false,
    other: [{
      id: 1,
      title: "JS基础",
      date: 1549814400000
    }, {
      id: 2,
      title: "CSS基础",
      date: 1549814400000
    }, {
      id: 3,
      title: "HTML基础",
      date: 1549814400000
    }]
  },
  toCommnet(){
    wx.navigateTo({
      url: '/pages/comment/comment',
    });
  },
  showModal() {
    const animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
    })

    this.animation = animation

    animation.translateY(300).step()

    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })

    setTimeout(function() {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 1000)
  },
  hideModal() {
    this.animation.translateY(300).step()
    this.setData({
      animationData: this.animation.export()
    })
    setTimeout(() => {
      this.animation.translateY(0).step()
      this.setData({
        animationData: this.animation.export(),
        showModalStatus: false
      })
    }, 2000)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setNavTitle(options.title);
    this.getDetail(options.id);
  },
  setNavTitle(title) {
    wx.setNavigationBarTitle({
      title: title
    })
  },
  getDetail(id) {
    http.request({
      url: "/detail?id=" + id
    }).then(data => {
      this.setData({
        detailData: data
      })
    })
  },
  phoneCall() {
    wx.makePhoneCall({
      phoneNumber: '12345678',
      success(e) {
        console.log(e)
      }
    })
  },
  // showModal(){
  //   wx.showActionSheet({
  //     itemList: ["JS","CSS3","HTML5"],
  //     success(res){
  //       console.log(res)
  //     }
  //   })
  // },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
})