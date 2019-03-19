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
    btnIndex:"0",
    lesson:{},
    timer:{}
  },
  changeTab(e){
    let index = e.target.dataset.index;
    let id = e.target.dataset.id;
    this.setData({
      btnIndex:index
    })
    if(index == 1){
      wx.navigateTo({
        url: `/pages/courseDetails/courseDetails?id=${id}`,
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (opt) {
    console.log(opt);
    this.getOneLesson(opt.id);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },
  getOneLesson(){
    let that = this
    http.request({
      url: '/index.php/api/lesson/getOneLesson?id=1'
    }).then(data => {
      data.poster = host_url + data.poster
      data.list_img = host_url + data.list_img
      data.lecturer.picture = host_url + data.lecturer.picture
      var endTime = data.end_time;
      that.clock(endTime);
      console.log(data);
      that.setData({
        lesson: data
      })
    })
  },
  clock(endTime){
    var today = new Date(),//当前时间
    h=today.getHours(),
    m=today.getMinutes(),
    s=today.getSeconds();
    var stopTime = new Date(endTime),//结束时间
    stopH=stopTime.getHours(),
    stopM=stopTime.getMinutes(),
    stopS=stopTime.getSeconds();
    var shenyu = stopTime.getTime() - today.getTime(),//倒计时毫秒数
    shengyuD=parseInt(shenyu / (60 * 60 * 24 * 1000)),//转换为天
    D=parseInt(shenyu) - parseInt(shengyuD * 60 * 60 * 24 * 1000),//除去天的毫秒数
    shengyuH=parseInt(D / (60 * 60 * 1000)),//除去天的毫秒数转换成小时
    H=D - shengyuH * 60 * 60 * 1000,//除去天、小时的毫秒数
    shengyuM=parseInt(H / (60 * 1000)),//除去天的毫秒数转换成分钟
    M=H - shengyuM * 60 * 1000,//除去天、小时、分的毫秒数
    S=parseInt((shenyu - shengyuD * 60 * 60 * 24 * 1000 - shengyuH * 60 * 60 * 1000 - shengyuM * 60 * 1000) / 1000);//除去天、小时、分的毫秒数转化为秒
    shengyuD = shengyuD > 10 ? shengyuD : "0" + shengyuD
    shengyuH = shengyuH > 10 ? shengyuH : "0" + shengyuH
    shengyuM = shengyuM > 10 ? shengyuM : "0" + shengyuM
    S = S > 10 ? S : "0" + S
    let timer = { D: shengyuD, H: shengyuH, M: shengyuH,S}
    this.setData({ timer: timer})
    // setTimeout("clock()",500);
    setTimeout(()=>{this.clock(endTime)},1000);
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})