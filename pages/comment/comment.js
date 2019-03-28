import {
    HTTP
} from "../../utils/http-promise.js";
let http = new HTTP();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    stars: 5,
    userInput:""
  },
  onTap(e){
    let stars = e.target.dataset.index;
    this.setData({
      stars: stars
    })
  },
  textAreaCon(e){
    this.setData({
      userInput: e.detail.value
    })
  },
  upload(){
    wx.chooseImage({
      count:1,
      success: (res)=>{
        //console.log(res)
        // wx.uploadFile({
        //   url: '',
        //   filePath: res.tempFilePaths[0],
        //   name: '',
        //   success:(res)=>{

        //   }
        // })
        this.setData({
          imgUrl: res.tempFilePaths[0]
        })
      },
    })
  },
  onSaveComment(){
    if (this.data.userInput == ""){
      wx.showModal({
        title: '提示',
        content: '输入点内容吧',
      })
    } else {
        let openid = wx.getStorageSync("openid");
        let id = this.data.id;
        let cnt = encodeURI(this.data.userInput);
        let stars = this.data.stars;
        http.request({
            url: `/index.php/api/lesson/onSaveComment?id=${id}&content=${cnt}&stars=${stars}&openid=${openid}`
        }).then(data => {
            wx.showToast({
                title: '提交成功',
                success(){
                    setTimeout(()=>{
                        wx.redirectTo({
                            url: '/pages/courseDetails/courseDetails?id=' +id,
                        })
                    },1000);
                }
            })
        })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (opt) {
      this.setData({id:opt.id});
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

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