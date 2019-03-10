// components/swiper/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    option: {
      type: Object,
      value: {
        //是否采用衔接滑动
        circular: true,
        //是否显示画板指示点
        indicatorDots: true,
        //选中点的颜色
        indicatorcolor: "#fff",
        //是否竖直
        vertical: false,
        //是否自动切换
        autoplay: true,
        //自动切换的间隔
        interval: 2500,
        //滑动动画时长毫秒
        duration: 100,
        //所有图片的高度
        imgheights: [],
        //图片宽度
        imgwidth: 750,
        //默认
        current: 0,
      }
    },
    imgs: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },
  ready(){
    console.log(this.data.option,this.data.imgs);
  },

  /**
   * 组件的方法列表
   */
  methods: {
    imageLoad: function (e) {//获取图片真实宽度
      var imgwidth = e.detail.width,
        imgheight = e.detail.height,
        //宽高比
        ratio = imgwidth / imgheight;
        console.log(imgwidth, imgheight)
      //计算的高度值
      var viewHeight = 750 / ratio;
      var imgheight = viewHeight;
      var imgheights = this.data.option.imgheights;
      //把每一张图片的对应的高度记录到数组里
      imgheights[e.target.dataset.id] = imgheight;
      this.setData({
        ['option.imgheights']: imgheights
      })
    },
    bindchange: function (e) {
      this.setData({ ['option.current']: e.detail.current })
    }
  }
})
