var data = bubbleSort(
  [{
    date: "201804",
    title: "凌晨的十字街头",
    location: "北京",
    url: "blog/image/PANO_20180408_011824.jpg"
  },{
      date: "201710",
      title: "夏末秋初",
      location: "北京 植物园",
      url: "blog/image/PANO_20171003_155216.jpg"
    },{
      date: "201710",
      title: "夏末秋初",
      location: "北京 植物园",
      url: "blog/image/PANO_20171003_154619.jpg"
    },{
      date: "201710",
      title: "夏末秋初",
      location: "北京 植物园",
      url: "blog/image/IMG_20171009_205549.jpg"
    },{
      date: "201410",
      title: "跳跃",
      location: "浙江 乌镇",
      url: "blog/photo/IMG_7135.JPG"
    },
    {
      date: "201011",
      title: "水至清则无鱼",
      location: "北京 凤凰岭",
      url: "blog/photo/IMG_2669.jpg"
    },
    {
      date: "201410",
      title: "zen 喜乐",
      location: "浙江 乌镇",
      url: "blog/photo/IMG_7215.JPG"
    },
    {
      date: "201410",
      title: "zen 喜乐",
      location: "浙江 乌镇",
      url: "blog/photo/IMG_7220.JPG"
    },
    {
      date: "201410",
      title: "忙里偷闲",
      location: "浙江 乌镇",
      url: "blog/photo/IMG_7268.JPG"
    },
    {
      date: "201705",
      title: "窗外",
      location: "北京",
      url: "blog/photo/IMG_20170830_162120_702.jpg"
    },
    {
      type: "video",
      date: "201603",
      title: "春季踏青",
      location: "北京 奥利匹克公园",
      url: "blog/video/5709155670c303439.mp4"
    },
    {
      type: "video",
      date: "201607",
      title: "海豚表演",
      location: "河北 北戴河",
      url: "blog/video/WeChatSight105.mp4"
    },
    {
      date: "201701",
      title: "冬日暖炉",
      location: "山东 泰安",
      url: "blog/photo/IMG_20170129_121842-01.jpeg"
    },
    {
      date: "201511",
      title: "小区内深秋景色",
      location: "北京 万年花城",
      description: "临时手机抓拍 太模糊了",
      url: "blog/photo/mmexport1497866593335.jpeg"
    },
    {
      date: "201702",
      title: "夜晚中的观礼台",
      location: "北京 奥林匹克广场",
      url: "blog/photo/IMG_20170228_212604_HHT.jpg"
    },
    {
      date: "201705",
      title: "初音",
      location: "日本 秋叶原",
      url: "blog/photo/IMG_20170810_101928_036.jpg"
    },
    {
      date: "201703",
      title: "碧波佛香阁",
      location: "北京 颐和园",
      url: "blog/photo/IMG_20170312_130523.jpeg"
    },
    {
      date: "201010",
      title: "草原黄昏",
      location: "北京 康西草原",
      url: "blog/photo/cyhh.jpg"
    },
    {
      date: "201008",
      title: "夏日花花草草",
      location: "北京 北宫森林公园",
      url: "blog/photo/flower-in-summer.jpg"
    },
    {
      date: "201104",
      title: "同事",
      location: "北京 爨底下",
      url: "blog/photo/20110423.jpg"
    },
    {
      date: "201009",
      title: "山间野花",
      location: "北京 阳台山",
      url: "blog/photo/201008290001.jpg"
    },
    {
      date: "201708",
      title: "海滩边 (媳妇手机原图)",
      location: "深圳 大梅沙海滨公园",
      url: "blog/photo/WechatIMG13304.jpeg"
    },
    {
      date: "201708",
      title: "摩托",
      location: "北京",
      url: "blog/photo/IMG_20170810_101722_002.jpg"
    },

    {
      date: "201707",
      title: "仰望",
      location: "北京 颐和园",
      url: "blog/photo/IMG_20170731_170349_748.jpg"
    },
    {
      date: "201703",
      title: "初春",
      location: "北京 颐和园",
      url: "blog/photo/PANO_20170312_132021.jpg"
    },
    {
      date: "201703",
      title: "苏州街",
      location: "北京 颐和园",
      url: "blog/photo/IMG_20170312_104757.jpeg"
    },
    {
      date: "201506",
      title: "和谐",
      location: "北京 奥林匹克公园南园",
      url: "blog/photo/IMG_20170613_104518_049.jpg"
    }
  ],
  "date"
);

/**
 * 冒泡排序
 * @param {*} arr
 */
function bubbleSort(arr, attr) {
  var len = arr.length;
  for (var i = 0; i < len; i++) {
    for (var j = 0; j < len - 1 - i; j++) {
      if (attr) {
        if (arr[j][attr] < arr[j + 1][attr]) {
          var temp = arr[j + 1];
          arr[j + 1] = arr[j];
          arr[j] = temp;
        }
      } else {
        if (arr[j] < arr[j + 1]) {
          var temp = arr[j + 1];
          arr[j + 1] = arr[j];
          arr[j] = temp;
        }
      }
    }
  }
  return arr;
}

var pswpElement;
var gallery;

function resizeImg(index, item) {
  if (!item.loaded2) {
    var img = new Image();
    img.onload = function() {
      item.w = this.width;
      item.h = this.height;
      try {
        item.loaded2 = true;
        gallery.invalidateCurrItems();
        gallery.updateSize(true);
      } catch (error) {
        //console.log(error);
      }
    };
    img.src = item.src;
  }
}

PhotoSwipeUI_Default.history = false;
PhotoSwipeUI_Default.galleryPIDs = false;
PhotoSwipeUI_Default.bgOpacity = 0.7;
var app = new Vue({
  el: "#photo-box",
  data: {
    items: [],
    pageMax: 1,
    page: 1,
    limit: 9,
    loaded: true,
    qnvroot: "http://s2.jiasucloud.com/",
    qnroot: "https://ss.jiasucloud.com/",
    photos: []
  },
  methods: {
    view(index) {
      gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, this.items, {
        index: index
      });
      gallery.init();
      gallery.listen("imageLoadComplete", resizeImg);
    },
    render() {
      var index = (this.page - 1) * this.limit;
      var photos = (this.photos = data.slice(index, index + this.limit));
      var items = [];
      for (var i = 0, l = photos.length; i < l; i++) {
        var photo = photos[i];
        if (photo.type !== "video") {
          photo.index = items.length;
          items.push({
            title: photo.title + " " + photo.date + " @" + photo.location,
            src: this.qnroot + photo.url + "-p",
            w: -1,
            h: -1
          });
        }
      }
      this.items = items;
      //gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, this.items);
      //gallery.init();
    },
    prev() {
      this.page = this.page - 1;
      if (this.page < 1) {
        this.page = this.pageMax;
      }
      this.render();
    },
    next() {
      this.page = this.page + 1;
      if (this.page > this.pageMax) {
        this.page = 1;
      }
      this.render();
    }
  },
  created() {
    this.pageMax = Math.ceil(data.length / this.limit);
    pswpElement = document.querySelectorAll(".pswp")[0];
    this.render();
  }
});
