// pages/lesson/lesson.js
import {
    HTTP
} from '../../utils/http-promise.js';
import { cnsub } from '../../utils/tools.js'
let http = new HTTP();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        lessCats: [{
            id: 0,
            name: "全部"
        }, {
            id: 1,
            name: "英语演讲"
        }, {
            id: 2,
            name: "口才速成"
        }, {
            id: 3,
            name: "语感专题"
        }, {
            id: 4,
            name: "英语演讲"
        }, {
            id: 5,
            name: "口才速成"
        }, {
            id: 6,
            name: "语感专题"
        }],
        scrollIndex: "0",
        lesson: [],
        noMore:false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.getAllLesson();
    },
    changeCat(e) {
        let index = e.currentTarget.dataset.id;
        // console.log('change', e,index);
        this.setData({
            scrollIndex: index
        });
    },
    getAllLesson() {
        http.request({
            url: "/allLesson"
        }).then(data => {
            console.log(data)
            // data.forEach((item)=>{
            //     item.title = cnsub(item.title,36);
            // });
            this.setData({
                lesson: data
            })
        })
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
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
        this.setData({
            noMore:true
        })
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})