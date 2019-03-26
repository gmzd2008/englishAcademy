
import { HTTP } from "http-promise.js";
let http = new HTTP();
class Order{
    constructor(){
        this._storageKeyName='newOrder';
    }

    /*下订单*/
    doOrder(param,callback){
        var that=this;
        var allParams = {
            url: '/index.php/api/order/makeOrder',
            method:'post',
            header: {"Content-Type": "application/x-www-form-urlencoded"},
            data:{openid:param.openid,id:param.id}
            };
        http.request(allParams).then(function (data) {
            that.execSetStorageSync(true);
            callback && callback(data);
        });
    }

    /*
    * 拉起微信支付
    * params:
    * norderNumber - {int} 订单id
    * return：
    * callback - {obj} 回调方法 ，返回参数 可能值 0:商品缺货等原因导致订单不能支付;  1: 支付失败或者支付取消； 2:支付成功；
    * */
    execPay(orderNumber,callback){
        var allParams = {
            url: '/index.php/api/pay/getPreOrder',
            method:'post',
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            data:{id:orderNumber}
        };
        http.request(allParams).then(
            function (data) {
                var timeStamp = data.timeStamp;
                if (timeStamp) { //可以支付
                    wx.requestPayment({
                        'timeStamp': timeStamp.toString(),
                        'nonceStr': data.nonceStr,
                        'package': data.package,
                        'signType': data.signType,
                        'paySign': data.paySign,
                        success: function () {
                            callback && callback(2); // 已经支付
                        },
                        fail: function () {
                            callback && callback(1); // 支付失败
                        }
                    })
                }
            },
            function(e){
                callback && callback(0)// 下单失败
            }
        );
    }

    /*获得所有订单,pageIndex 从1开始*/
    getOrders(pageIndex,callback){
        var allParams = {
            url: 'order/by_user',
            data:{page:pageIndex},
            method:'get',
            sCallback: function (data) {
                callback && callback(data);  //1 未支付  2，已支付  3，已发货，4已支付，但库存不足
             }
        };
        this.request(allParams);
    }

    /*获得订单的具体内容*/
    getOrderInfoById(id,callback){
        var that=this;
        var allParams = {
            url: 'order/'+id
        };
        this.request(allParams).then(function (data) {
            callback && callback(data);
        });
    }

    /*本地缓存 保存／更新*/
    execSetStorageSync(data){
        wx.setStorageSync(this._storageKeyName,data);
    };

    /*是否有新的订单*/
    hasNewOrder(){
       var flag = wx.getStorageSync(this._storageKeyName);
       return flag==true;
    }

}

export {Order};