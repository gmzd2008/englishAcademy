import {
  base_url,
  host_url
} from "./config.js";
class HTTP {
  request({
    url,
    data = {},
    header = {},
    method = "GET",
    success = () => {},
    fail = () => {}
  }) {
    return new Promise((resolve, reject) => {
      this._request(url, data, header, method, resolve, reject);
    })
  }
  _request(url, data, header, method, resolve, reject) {

    var reg = RegExp("/api");
    if (reg.test(url)) {
      url = host_url + url
    } else {
      url = base_url + url;
    };
    if(method.toUpperCase=='POST'){
        header = {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    }
    console.log(url);
    wx.request({
      url: url,
      data: data,
      header: header,
      method: method,
      success: (res) => {
        //   console.log(res);
        let data = res.data;
        if (data.status != undefined && data.status == 'ok' || data.status===0 ) {
          resolve(data.data)
        } else {
          reject();
          wx.showModal({
            title: '接口错误',
            content: data.msg,
            success(res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }

      },
      fail: (err) => {
        reject();
        wx.showToast({
          title: '接口出错了',
          icon: 'none',
          duration: 30000
        })
      }
    })
  }
}

export {
  HTTP
}