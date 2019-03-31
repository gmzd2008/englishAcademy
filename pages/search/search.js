import {
    host_url
} from "../../utils/config.js";
import {HTTP} from "../../utils/http-promise.js";
let http = new HTTP();
import {
    cnsub
} from '../../utils/tools.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    historySearch: wx.getStorageSync("historySearch") || [],
    hotLesson: [],
    keyWord: "",
    lesson: [],
    total:null,
    showLesson: false,
    noData: false,
    noMore: false,
    loading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getHotLesson();
  },
  getHotLesson(){
    //   关键词 数组
    http.request({
        url:"/index.php/api/lesson/getlessons?is_recommend=1"
    }).then(data=>{
        data.lesson.forEach((item) => {
            item.title = cnsub(item.title, 30);
            item.remark = cnsub(item.lesson_remark, 66)
            item.list_img = host_url + item.list_img;
        });
      this.setData({
        hotLesson: data
      })
    })
  },
  onConfirm(e){
    let value = e.detail.value|| e.currentTarget.dataset.value;
    if (value){
      this.addHistorySearch(value);
      this.searchByKeyword(value);
      this.setData({
        keyWord: value,
        showLesson: true
      })
    }
  },
  searchByKeyword(value){
    this.locked();
    let start = this.data.lesson.length;
    setTimeout(()=>{
      http.request({
          url: `/index.php/api/lesson/lessonSeacrch?key=${value}&start=${start}&size=6`
      }).then(data => {
        this.setLesson(data);
        this.unLocked();
      },()=>{
        this.unLocked();
      })
    },1000)
  },
  setLesson(data){
    this.data.total = data.total;
    if (data.total == 0){
      this.setData({
        noData: true,
        lesson:[]
      })
    } else {
        data.lesson.forEach((item) => {
            item.title = cnsub(item.title, 30);
            item.remark = cnsub(item.lesson_remark, 66)
            item.list_img = host_url + item.list_img;
        });
      let lesson = this.data.lesson.concat(data.lesson);
      this.setData({
        lesson: lesson
      })
    }
  },
  addHistorySearch(value){
    let historySearch = this.data.historySearch || [];
    let has = historySearch.includes(value);
    if (has){
      return
    }
    let len = historySearch.length;
    if (len >=10){
      historySearch.pop();
    }
    historySearch.unshift(value);
    wx.setStorage({
      key: 'historySearch',
      data: historySearch,
      success:()=>{
        this.setData({
          historySearch: historySearch
        })
      }
    })
  },
  romveStorage(){
    wx.removeStorage({
      key: 'historySearch',
      success: (res)=>{
        this.setData({
          historySearch: []
        })
      },
    })
  },
  onCancel(){
    this.setData({
      keyWord: "",
      lesson: [],
      total: null,
      showLesson: false,
      noData: false,
      noMore: false
    })
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
    if (this.isLocked()){
      return;
    }
    if (this.hasMore()){
      this.searchByKeyword(this.data.keyWord);
    } else {
      this.setData({
        noMore: true
      })
    }
  },
  hasMore(){
    return this.data.lesson.length >= this.data.total?false:true;
  },
  isLocked(){
    return this.data.loading? true:false;
  },
  locked(){
    //wx.showNavigationBarLoading();
    wx.showLoading({
      title: '加载中。。。',
    })
    this.setData({
      loading:true
    })
  },
  unLocked(){
    //wx.hideNavigationBarLoading();
    wx.hideLoading();
    this.setData({
      loading: false
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
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})