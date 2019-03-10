// pages/index/index.js
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
    lesson: []
  },
  onMyEvent(e) {
    console.log(e)
    let detail = e.detail;
    // wx.navigateTo({
    //   url: `/pages/detail/detail?id=${detail.id}&title=${detail.title}`
    // })
    wx.navigateTo({
        url: `/pages/course/course`
    })
  },
    toRegister(){
        wx.navigateTo({
            url: '/pages/register/register',
        })
    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // this.getSwiper();
    this.getLesson();
  },
  getSwiper() {

  },
  getLesson() {
    http.request({
      url: '/getLessons'
    }).then(data => {
      this.setData({
        lesson: data
      })
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