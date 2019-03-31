import {
    login,
    updateUser,
    promisify
} from "../../utils/tools.js";
import {
    host_url
} from "../../utils/config.js";
import {
    HTTP
} from "../../utils/http-promise.js";
let http = new HTTP();
Page({
    data: {
        nickname: "",
        avatar: "",
        openid: "",
        pic: '',
        index: 0,
        canv: ''
    },
    onLoad: function() {
        let that = this
        let openid =wx.getStorageSync('openid');
        if (openid) {
        console.log('onload');
            // 获取背景图
            that.getShareBg();
            //获取用户信息
            http.request({
                url: `/index.php/api/user/getOneUser?openid=${openid}`
            }).then(res => {
                console.log(res);
                that.setData({
                    openid:openid,
                    nickname: res.nickname,
                    avatar: res.head_pic.replace('https://wx.qlogo.cn/', 'https://speakupjr.cn/wechat_image/')
                });
            },err=>{
                console.log(err);
            });
        }     

    },
    getShareBg(){
        let that = this
        http.request({
            url:`/index.php/api/share/getOneBg`
        }).then(res=>{
            that.setData({
                title: res.title,
                desc: res.description,
                shareBg0:res.file_url
            });
        });
    },
    onShareAppMessage: function() {
        let that = this
        return {
            title: that.data.title,
            desc: that.data.desc,
            path: '/pages/index/index'
        };
    },
    showPic: function() {
        var t = this, a = t.data.canv;
            // e = t.data.pic + "&rd=" + (new Date).getTime();
        wx.previewImage({
            current: a,
            urls: [a]
        });
    },
    // setPic: function(t) {
    //     var e = this,
    //         openid = e.data.openid,
    //         index = t.currentTarget.dataset.index,
    //         a = e.data.canv;
    //     e.setData({
    //         pic: a
    //     });
    // },
    onReady() {
        let that = this
        setTimeout(() => {
            console.log(this.data.avatar);
            if (that.data.avatar){
                that.creatPic();
            }
        }, 500);
 
    },
    creatPic(){
        let that = this
        let avatar = that.data.avatar;
        let shareBg0 = host_url +that.data.shareBg0;
        console.log(avatar, shareBg0)
        // promisify  http://speakupjr.cn/index.php/api/user/getUserAvatar
        const wxGetImageInfo = promisify(wx.getImageInfo)
        const wxCanvasToTempFilePath = promisify(wx.canvasToTempFilePath)
        Promise.all([
            wxGetImageInfo({
                src: shareBg0
            }),
            wxGetImageInfo({
                src: 'https://speakupjr.cn/Public/images/qr/qr-1.jpg'
            })
            ,
            wxGetImageInfo({
                src: avatar
            })
        ]).then(res => {
            const ctx = wx.createCanvasContext('shareCanvas')

            // 底图
            ctx.drawImage(res[0].path, 0, 0, 300, 533)

            // 作者名称
            ctx.setTextAlign('center') // 文字居中
            ctx.setFillStyle('#000000') // 文字颜色：黑色
            ctx.setFontSize(16) // 文字字号：22px
            ctx.fillText(that.data.nickname, 300 / 2, 110)
            // ctx.stroke();
            // 小程序码
            const qrImgSize = 120
            ctx.drawImage(res[1].path, (300 - qrImgSize) / 2, 260, qrImgSize, qrImgSize)
            // ctx.draw()
            ctx.stroke();
            //绘制头像
            const avatarSize = 60
            ctx.drawImage(res[2].path, (300 - avatarSize) / 2, 30, avatarSize, avatarSize)
            ctx.draw();
        })
        setTimeout(()=>{
            wxCanvasToTempFilePath({
                x:0,
                y:0,
                width:300,
                height:533,
                canvasId: 'shareCanvas'
            }, this).then(res => {
                that.setData({ 'canv': res.tempFilePath });
            })
        },1000);

    },
    saveImage(e){
        let canv = this.data.canv;
        const wxSaveImageToPhotosAlbum = promisify(wx.saveImageToPhotosAlbum)
        wxSaveImageToPhotosAlbum({
            filePath: canv
        }).then(res => {
                wx.showToast({
                    title: '已保存到相册'
                })
            })
    }
});